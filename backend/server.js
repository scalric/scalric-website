import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { closeDatabase, database, initializeDatabase } from '../database/index.js';
import { handleAdmin } from './admin.js';
import { json, readBody } from './http.js';
import {
  MAX_EXPERIENCE_ENTRIES, validateEmail, validateExperienceEntry, validateMessage, validateName, validateOrganization, validatePhone, validateResumeFile, validateYears,
} from '../shared/validators.js';

const host = process.env.API_HOST || '127.0.0.1';
const port = Number(process.env.API_PORT || 3001);
const windows = new Map();

function rateLimited(request) {
  const key = request.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = windows.get(key) || { count: 0, resetAt: now + 60_000 };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + 60_000; }
  entry.count += 1;
  windows.set(key, entry);
  return entry.count > 12;
}

const UPLOAD_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../database/uploads');
const MAGIC = { pdf: [0x25, 0x50, 0x44, 0x46], docx: [0x50, 0x4b, 0x03, 0x04], doc: [0xd0, 0xcf, 0x11, 0xe0] };

function check(message) {
  if (message) throw new Error(message);
}

/** Decodes and verifies an uploaded resume (extension, size and file signature); returns { name, extension, buffer }. */
function parseResume(resume) {
  if (!resume || typeof resume.name !== 'string' || typeof resume.data !== 'string') throw new Error('Attach your resume (PDF, DOC or DOCX).');
  const buffer = Buffer.from(resume.data, 'base64');
  check(validateResumeFile({ name: resume.name, size: buffer.length }));
  const extension = resume.name.split('.').pop().toLowerCase();
  if (!MAGIC[extension].every((byte, index) => buffer[index] === byte)) throw new Error('That file does not look like a real PDF, DOC or DOCX.');
  return { name: resume.name.replace(/[^\w .()-]/g, '_').slice(-120), extension, buffer };
}

async function handle(request, response) {
  const url = new URL(request.url || '/', `http://${request.headers.host || `${host}:${port}`}`);
  if (request.method === 'GET' && url.pathname === '/api/health') {
    try {
      await database.query('SELECT 1');
      return json(response, 200, { status: 'ok', service: 'scalric-api', database: 'connected' });
    } catch {
      return json(response, 503, { status: 'unavailable', service: 'scalric-api', database: 'disconnected' });
    }
  }

  if (request.method === 'GET' && url.pathname === '/api/roles') {
    const { rows } = await database.query('SELECT slug, title, team, location, work_mode, description FROM roles WHERE published = true ORDER BY created_at DESC');
    return json(response, 200, { items: rows.map(({ work_mode: workMode, ...role }) => ({ ...role, workMode })) });
  }

  if (url.pathname.startsWith('/api/admin/')) return handleAdmin(request, response, url);

  if (request.method !== 'POST' || !['/api/contact', '/api/impact/applications'].includes(url.pathname)) {
    return json(response, 404, { error: 'Not found.' });
  }
  if (rateLimited(request)) return json(response, 429, { error: 'Please wait a moment before sending another request.' });
  if (!request.headers['content-type']?.includes('application/json')) {
    return json(response, 415, { error: 'Send the form as JSON.' });
  }

  let body;
  let values;
  let resume = null;
  const isContact = url.pathname === '/api/contact';
  try {
    body = await readBody(request, isContact ? 8_000_000 : 12_000);
    if (body.consent !== true) return json(response, 400, { error: 'Please confirm that Scalric may contact you about this request.' });
    if (isContact) {
      values = {
        name: String(body.name ?? '').trim(),
        email: String(body.email ?? '').trim(),
        inquiryType: String(body.inquiryType ?? '').trim(),
        organization: String(body.organization ?? '').trim(),
        message: String(body.message ?? '').trim(),
        phone: String(body.phone ?? '').trim(),
        role: '', experienceYears: '', experience: '', link: '',
      };
      check(validateName(values.name));
      check(validateEmail(values.email));
      check(validateOrganization(values.organization));
      check(validateMessage(values.message));
      if (!['business', 'partnership', 'impact', 'careers', 'other'].includes(values.inquiryType)) throw new Error('Choose what you are reaching out about.');
      if (typeof body.role === 'string' && body.role) {
        const found = await database.query('SELECT title FROM roles WHERE slug = $1 AND published = true', [body.role.slice(0, 80)]);
        if (!found.rows[0]) throw new Error('That role is no longer open.');
        values.role = found.rows[0].title;
        values.inquiryType = 'careers';
        check(validatePhone(values.phone));
        check(validateYears(body.experienceYears));
        values.experienceYears = String(Number(body.experienceYears));
        const entries = Array.isArray(body.experience) ? body.experience : [];
        if (entries.length > MAX_EXPERIENCE_ENTRIES) throw new Error(`Add at most ${MAX_EXPERIENCE_ENTRIES} experience entries.`);
        entries.forEach((entry, index) => { const error = validateExperienceEntry(entry); if (error) throw new Error(`Experience ${index + 1}: ${error}`); });
        values.experience = JSON.stringify(entries.map((entry) => ({
          company: entry.company.trim(), title: entry.title.trim(), from: entry.from, to: entry.current ? '' : entry.to, current: Boolean(entry.current),
        })));
        resume = parseResume(body.resume);
      } else if (values.phone) check(validatePhone(values.phone));
    } else {
      values = {
        organization: String(body.organization ?? '').trim(),
        contactName: String(body.contactName ?? '').trim(),
        email: String(body.email ?? '').trim(),
        organizationType: body.organizationType,
        need: String(body.need ?? '').trim(),
      };
      check(validateOrganization(values.organization, { required: true }));
      check(validateName(values.contactName, 'Your name'));
      check(validateEmail(values.email));
      if (!['business', 'ngo'].includes(values.organizationType)) throw new Error('Choose business or NGO.');
      check(validateMessage(values.need, 'How we can help'));
    }
  } catch (error) {
    return json(response, 400, { error: error.message || 'We could not process that request.' });
  }

  let savedFile = '';
  try {
    if (isContact) {
      if (resume) {
        await mkdir(UPLOAD_DIR, { recursive: true });
        savedFile = `${randomUUID()}.${resume.extension}`;
        await writeFile(resolve(UPLOAD_DIR, savedFile), resume.buffer);
      }
      await database.query(`INSERT INTO contact_submissions (name, email, inquiry_type, organization, message, role, link, phone, experience_years, experience, resume_name, resume_file)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [values.name, values.email, values.inquiryType, values.organization, values.message, values.role, values.link, values.phone, values.experienceYears, values.experience, resume?.name || '', savedFile]);
      return json(response, 201, { message: values.role ? `Thank you. Your application for ${values.role} has been received.` : 'Thank you. Your message has been received.' });
    }
    await database.query(`INSERT INTO impact_applications (organization, contact_name, email, organization_type, need)
      VALUES ($1, $2, $3, $4, $5)`, [values.organization, values.contactName, values.email, values.organizationType, values.need]);
    return json(response, 201, { message: 'Thank you. Your request has been received.' });
  } catch {
    if (savedFile) await unlink(resolve(UPLOAD_DIR, savedFile)).catch(() => {});
    return json(response, 503, { error: 'We could not save your request right now. Please try again shortly.' });
  }
}

const server = createServer((request, response) => {
  handle(request, response).catch(() => json(response, 500, { error: 'Something went wrong. Please try again.' }));
});

server.on('error', async (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the existing API process, or set API_PORT to a free port.`);
  } else {
    console.error(`Scalric API could not listen: ${error.message}`);
  }
  await closeDatabase();
  process.exitCode = 1;
});

async function start() {
  await initializeDatabase();
  server.listen(port, host, () => console.log(`Scalric API listening on http://${host}:${port}`));
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    server.close();
    await closeDatabase();
    process.exit(0);
  });
}

start().catch((error) => {
  console.error(`Unable to start Scalric API: ${error.message}`);
  process.exitCode = 1;
});
