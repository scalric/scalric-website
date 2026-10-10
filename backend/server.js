import { createServer } from 'node:http';
import { closeDatabase, database, initializeDatabase } from '../database/index.js';

const host = process.env.API_HOST || '127.0.0.1';
const port = Number(process.env.API_PORT || 3001);
const maxBodyBytes = 12_000;
const windows = new Map();

function json(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(payload));
}

function rateLimited(request) {
  const key = request.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = windows.get(key) || { count: 0, resetAt: now + 60_000 };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + 60_000; }
  entry.count += 1;
  windows.set(key, entry);
  return entry.count > 12;
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodyBytes) throw new Error('Request is too large.');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function requiredText(value, label, maxLength) {
  if (typeof value !== 'string') throw new Error(`${label} is required.`);
  const text = value.trim();
  if (!text || text.length > maxLength) throw new Error(`${label} is required and must be under ${maxLength} characters.`);
  return text;
}

function validEmail(value) {
  const email = requiredText(value, 'Email', 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
  return email;
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

  if (request.method !== 'POST' || !['/api/contact', '/api/impact/applications'].includes(url.pathname)) {
    return json(response, 404, { error: 'Not found.' });
  }
  if (rateLimited(request)) return json(response, 429, { error: 'Please wait a moment before sending another request.' });
  if (!request.headers['content-type']?.includes('application/json')) {
    return json(response, 415, { error: 'Send the form as JSON.' });
  }

  let body;
  let values;
  try {
    body = await readBody(request);
    if (body.consent !== true) return json(response, 400, { error: 'Please confirm that Scalric may contact you about this request.' });
    if (url.pathname === '/api/contact') {
      values = {
        name: requiredText(body.name, 'Name', 120),
        email: validEmail(body.email),
        inquiryType: requiredText(body.inquiryType, 'Inquiry type', 40),
        organization: typeof body.organization === 'string' ? body.organization.trim().slice(0, 160) : '',
        message: requiredText(body.message, 'Message', 5000),
      };
    } else values = {
      organization: requiredText(body.organization, 'Organization', 160),
      contactName: requiredText(body.contactName, 'Your name', 120),
      email: validEmail(body.email),
      organizationType: body.organizationType,
      need: requiredText(body.need, 'How we can help', 5000),
    };
    if (url.pathname === '/api/impact/applications' && !['business', 'ngo'].includes(values.organizationType)) throw new Error('Choose business or NGO.');
  } catch (error) {
    return json(response, 400, { error: error.message || 'We could not process that request.' });
  }

  try {
    if (url.pathname === '/api/contact') {
      await database.query(`INSERT INTO contact_submissions (name, email, inquiry_type, organization, message)
        VALUES ($1, $2, $3, $4, $5)`, [values.name, values.email, values.inquiryType, values.organization, values.message]);
      return json(response, 201, { message: 'Thank you. Your message has been received.' });
    }
    await database.query(`INSERT INTO impact_applications (organization, contact_name, email, organization_type, need)
      VALUES ($1, $2, $3, $4, $5)`, [values.organization, values.contactName, values.email, values.organizationType, values.need]);
    return json(response, 201, { message: 'Thank you. Your request has been received.' });
  } catch {
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
