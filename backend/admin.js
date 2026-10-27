import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, unlink } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { database } from '../database/index.js';
import { json, readBody } from './http.js';

const UPLOAD_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../database/uploads');
const CONTENT_TYPES = { pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
const SAFE_FILE = /^[0-9a-f-]{36}\.(pdf|doc|docx)$/;
const COOKIE = 'scalric_admin';
const SESSION_MS = 8 * 60 * 60 * 1000;
const STATUSES = ['new', 'read', 'replied', 'archived'];
const username = process.env.ADMIN_USERNAME || 'admin';
const password = process.env.ADMIN_PASSWORD || '';
// A random per-process secret still works if none is configured; sessions then end when the API restarts.
const secret = process.env.ADMIN_SESSION_SECRET || randomBytes(32).toString('hex');
const attempts = new Map();

// Each admin collection maps to one table; the contact table is split into views by inquiry_type.
const collections = {
  contact: { table: 'contact_submissions', search: ['name', 'email', 'organization', 'message'] },
};

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}

function sign(value) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function issueToken() {
  const payload = Buffer.from(JSON.stringify({ u: username, exp: Date.now() + SESSION_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function session(request) {
  const raw = (request.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`));
  if (!raw) return null;
  const [payload, signature] = raw.slice(COOKIE.length + 1).split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.exp > Date.now() ? data : null;
  } catch { return null; }
}

function cookie(value, maxAgeSeconds) {
  return `${COOKIE}=${value}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${maxAgeSeconds}`;
}

function loginLimited(request) {
  const key = request.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = attempts.get(key) || { count: 0, resetAt: now + 15 * 60_000 };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + 15 * 60_000; }
  entry.count += 1;
  attempts.set(key, entry);
  return entry.count > 8;
}

// Postgres returns timestamptz as Date objects; send ISO strings.
const iso = ({ resume_file: resumeFile, ...row }) => ({ ...row, ...(resumeFile === undefined ? {} : { has_resume: Boolean(resumeFile) }), created_at: new Date(row.created_at).toISOString(), updated_at: new Date(row.updated_at || row.created_at).toISOString() });

function csv(rows) {
  const cell = (value) => {
    let text = value instanceof Date ? value.toISOString() : String(value ?? '');
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`; // neutralise spreadsheet formulas
    return `"${text.replace(/"/g, '""')}"`;
  };
  if (!rows.length) return '';
  const columns = Object.keys(rows[0]);
  return [columns.join(','), ...rows.map((row) => columns.map((column) => cell(row[column])).join(','))].join('\r\n');
}

function filters(collection, url, params) {
  const clauses = [];
  const status = url.searchParams.get('status');
  if (STATUSES.includes(status)) { params.push(status); clauses.push(`status = $${params.length}`); }
  const type = url.searchParams.get('type');
  if (collection === 'contact' && type && /^[a-z]{1,40}$/.test(type)) { params.push(type); clauses.push(`inquiry_type = $${params.length}`); }
  const q = (url.searchParams.get('q') || '').trim().slice(0, 100);
  if (q) {
    params.push(`%${q.replace(/[\\%_]/g, '\\$&')}%`);
    clauses.push(`(${collections[collection].search.map((column) => `${column} ILIKE $${params.length} ESCAPE '\\'`).join(' OR ')})`);
  }
  return clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
}

const RESERVED_SLUGS = new Set(['openings']); // used by site routes under /careers/
const slugify = (text) => {
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'role';
  return RESERVED_SLUGS.has(slug) ? `${slug}-role` : slug;
};
const roleView = (row) => ({ ...iso(row), published: row.published === true });

function roleFields(body, partial) {
  const out = {};
  const limits = { title: 120, team: 80, location: 80, work_mode: 40, description: 5000 };
  const aliases = { work_mode: 'workMode' };
  for (const [column, max] of Object.entries(limits)) {
    const value = body[aliases[column] || column];
    if (value === undefined && partial) continue;
    if (typeof value !== 'string' || value.trim().length > max || (column === 'title' && !value.trim())) {
      throw new Error(column === 'title' ? 'A role needs a title (under 120 characters).' : `${column.replace('_', ' ')} must be under ${max} characters.`);
    }
    out[column] = value.trim();
  }
  if (body.published !== undefined) out.published = body.published === true;
  return out;
}

async function handleRoles(request, response, route) {
  const id = route.split('/')[2];
  if (!id && request.method === 'GET') {
    const { rows } = await database.query('SELECT * FROM roles ORDER BY published DESC, created_at DESC');
    return json(response, 200, { items: rows.map(roleView) });
  }
  let body = {};
  if (request.method === 'POST' || request.method === 'PATCH') {
    try { body = await readBody(request, 12_000); } catch { return json(response, 400, { error: 'Invalid request.' }); }
  }
  try {
    if (!id && request.method === 'POST') {
      const fields = roleFields(body, false);
      let slug = slugify(fields.title);
      const taken = new Set((await database.query('SELECT slug FROM roles WHERE slug LIKE $1', [`${slug}%`])).rows.map((row) => row.slug));
      for (let n = 2; taken.has(slug); n += 1) slug = `${slugify(fields.title)}-${n}`;
      const { rows } = await database.query(
        'INSERT INTO roles (slug, title, team, location, work_mode, description, published) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [slug, fields.title, fields.team, fields.location, fields.work_mode, fields.description, fields.published ?? false]);
      return json(response, 201, roleView(rows[0]));
    }
    if (id && request.method === 'PATCH') {
      const fields = roleFields(body, true);
      const columns = Object.keys(fields);
      if (!columns.length) return json(response, 400, { error: 'Nothing to update.' });
      const { rows } = await database.query(
        `UPDATE roles SET ${columns.map((column, index) => `${column} = $${index + 1}`).join(', ')}, updated_at = now() WHERE id = $${columns.length + 1} RETURNING *`,
        [...columns.map((column) => fields[column]), id]);
      return rows[0] ? json(response, 200, roleView(rows[0])) : json(response, 404, { error: 'Not found.' });
    }
    if (id && request.method === 'DELETE') {
      const { rowCount } = await database.query('DELETE FROM roles WHERE id = $1', [id]);
      return rowCount ? json(response, 200, { ok: true }) : json(response, 404, { error: 'Not found.' });
    }
  } catch (error) {
    return json(response, 400, { error: error.message });
  }
  return json(response, 405, { error: 'Method not allowed.' });
}

async function removeFiles(rows) {
  await Promise.all(rows.map((row) => (SAFE_FILE.test(row.resume_file || '') ? unlink(resolve(UPLOAD_DIR, row.resume_file)).catch(() => {}) : null)));
}

export async function handleAdmin(request, response, url) {
  const route = url.pathname.replace(/^\/api\/admin/, '') || '/';

  if (!password) return json(response, 503, { error: 'Admin is disabled. Set ADMIN_PASSWORD in .env and restart the API.' });

  if (route === '/login' && request.method === 'POST') {
    if (loginLimited(request)) return json(response, 429, { error: 'Too many attempts. Try again in a few minutes.' });
    let body;
    try { body = await readBody(request, 2_000); } catch { return json(response, 400, { error: 'Invalid request.' }); }
    const userOk = safeEqual(body.username ?? '', username);
    const passOk = safeEqual(body.password ?? '', password);
    if (!(userOk && passOk)) return json(response, 401, { error: 'Incorrect username or password.' });
    return json(response, 200, { user: username }, { 'Set-Cookie': cookie(issueToken(), SESSION_MS / 1000) });
  }
  if (route === '/logout' && request.method === 'POST') {
    return json(response, 200, { ok: true }, { 'Set-Cookie': cookie('', 0) });
  }

  const user = session(request);
  if (!user) return json(response, 401, { error: 'Sign in required.' });
  if (route === '/me' && request.method === 'GET') return json(response, 200, { user: user.u });

  if (route === '/stats' && request.method === 'GET') {
    const [contact, byType] = await Promise.all([
      database.query('SELECT status, COUNT(*) AS n FROM contact_submissions GROUP BY status'),
      database.query(`SELECT inquiry_type AS type, COUNT(*) AS n, COUNT(*) FILTER (WHERE status = 'new') AS unread FROM contact_submissions GROUP BY inquiry_type`),
    ]);
    const tally = (rows) => Object.fromEntries(rows.map((row) => [row.status, row.n]));
    const daily = await database.query(`SELECT to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS day, COUNT(*) AS n FROM contact_submissions WHERE (created_at AT TIME ZONE 'UTC') >= date_trunc('day', now() AT TIME ZONE 'UTC') - interval '13 days' GROUP BY day`);
    const recent = await database.query('SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 6');
    const roles = await database.query('SELECT published, COUNT(*) AS n FROM roles GROUP BY published');
    const counts = Object.fromEntries(daily.rows.map((row) => [row.day, row.n]));
    const series = Array.from({ length: 14 }, (_, index) => {
      const day = new Date(Date.now() - (13 - index) * 86_400_000).toISOString().slice(0, 10);
      return { day, n: counts[day] || 0 };
    });
    return json(response, 200, {
      contact: tally(contact.rows), contactByType: byType.rows, daily: series, recent: recent.rows.map(iso),
      roles: { published: roles.rows.find((row) => row.published === true)?.n || 0, draft: roles.rows.find((row) => row.published === false)?.n || 0 },
    });
  }

  if (route === '/roles' || /^\/roles\/\d{1,15}$/.test(route)) return handleRoles(request, response, route);

  if (route === '/contact/bulk' && request.method === 'POST') {
    let body;
    try { body = await readBody(request, 20_000); } catch { return json(response, 400, { error: 'Invalid request.' }); }
    const ids = Array.isArray(body.ids) ? body.ids.filter((id) => Number.isInteger(id)).slice(0, 200) : [];
    if (!ids.length) return json(response, 400, { error: 'Select at least one enquiry.' });
    const marks = ids.map((_, index) => `$${index + 1}`).join(',');
    if (body.action === 'delete') {
      const files = await database.query(`SELECT resume_file FROM contact_submissions WHERE id IN (${marks})`, ids);
      const { rowCount } = await database.query(`DELETE FROM contact_submissions WHERE id IN (${marks})`, ids);
      await removeFiles(files.rows);
      return json(response, 200, { changed: rowCount });
    }
    if (body.action === 'status' && STATUSES.includes(body.status)) {
      const { rowCount } = await database.query(`UPDATE contact_submissions SET status = $${ids.length + 1}, updated_at = now() WHERE id IN (${marks})`, [...ids, body.status]);
      return json(response, 200, { changed: rowCount });
    }
    return json(response, 400, { error: 'Unknown action.' });
  }

  const resumeRoute = route.match(/^\/contact\/(\d{1,15})\/resume$/);
  if (resumeRoute && request.method === 'GET') {
    const { rows } = await database.query('SELECT resume_name, resume_file FROM contact_submissions WHERE id = $1', [resumeRoute[1]]);
    const row = rows[0];
    if (!row || !SAFE_FILE.test(row.resume_file)) return json(response, 404, { error: 'No resume attached.' });
    try {
      const data = await readFile(resolve(UPLOAD_DIR, row.resume_file));
      response.writeHead(200, {
        'Content-Type': CONTENT_TYPES[row.resume_file.split('.').pop()],
        'Content-Disposition': `attachment; filename="${row.resume_name.replace(/[^\w .()-]/g, '_') || 'resume'}"`,
        'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store',
      });
      return response.end(data);
    } catch { return json(response, 404, { error: 'The resume file is missing.' }); }
  }

  const match = route.match(/^\/(contact)(?:\/(export|\d{1,15}))?$/);
  if (!match) return json(response, 404, { error: 'Not found.' });
  const [, collection, tail] = match;
  const { table } = collections[collection];

  if (request.method === 'GET' && tail === 'export') {
    const params = [];
    const { rows } = await database.query(`SELECT * FROM ${table} ${filters(collection, url, params)} ORDER BY created_at DESC`, params);
    response.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${collection}-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    });
    return response.end(csv(rows.map((row) => { const { resume_file: _internal, ...rest } = iso(row); return rest; })));
  }

  if (request.method === 'GET' && !tail) {
    const params = [];
    const where = filters(collection, url, params);
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const size = 25;
    const total = await database.query(`SELECT COUNT(*) AS n FROM ${table} ${where}`, params);
    const { rows } = await database.query(`SELECT * FROM ${table} ${where} ORDER BY created_at DESC LIMIT ${size} OFFSET ${(page - 1) * size}`, params);
    return json(response, 200, { items: rows.map(iso), total: total.rows[0].n, page, pageSize: size });
  }

  if (!tail) return json(response, 405, { error: 'Method not allowed.' });

  if (request.method === 'PATCH') {
    let body;
    try { body = await readBody(request, 8_000); } catch { return json(response, 400, { error: 'Invalid request.' }); }
    const sets = [];
    const params = [];
    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status)) return json(response, 400, { error: 'Invalid status.' });
      params.push(body.status); sets.push(`status = $${params.length}`);
    }
    if (body.notes !== undefined) {
      if (typeof body.notes !== 'string' || body.notes.length > 4000) return json(response, 400, { error: 'Notes must be under 4000 characters.' });
      params.push(body.notes); sets.push(`notes = $${params.length}`);
    }
    if (!sets.length) return json(response, 400, { error: 'Nothing to update.' });
    params.push(tail);
    const { rows } = await database.query(`UPDATE ${table} SET ${sets.join(', ')}, updated_at = now() WHERE id = $${params.length} RETURNING *`, params);
    return rows[0] ? json(response, 200, iso(rows[0])) : json(response, 404, { error: 'Not found.' });
  }

  if (request.method === 'DELETE') {
    const files = await database.query(`SELECT resume_file FROM ${table} WHERE id = $1`, [tail]);
    const { rowCount } = await database.query(`DELETE FROM ${table} WHERE id = $1`, [tail]);
    await removeFiles(files.rows);
    return rowCount ? json(response, 200, { ok: true }) : json(response, 404, { error: 'Not found.' });
  }

  return json(response, 405, { error: 'Method not allowed.' });
}
