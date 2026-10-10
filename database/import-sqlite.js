import 'dotenv/config';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { closeDatabase, database, initializeDatabase } from './index.js';

const sqlitePath = resolve(process.env.SQLITE_IMPORT_PATH || 'database/scalric.sqlite');
if (!existsSync(sqlitePath)) {
  console.log(`No SQLite database found at ${sqlitePath}; nothing to import.`);
  process.exit(0);
}

const source = new DatabaseSync(sqlitePath, { readOnly: true });
let client;
let transactionStarted = false;

try {
  await initializeDatabase();
  client = await database.connect();
  await client.query('BEGIN');
  transactionStarted = true;

  const contacts = source.prepare('SELECT id, name, email, inquiry_type, organization, message, created_at FROM contact_submissions ORDER BY id').all();
  for (const row of contacts) {
    await client.query(`INSERT INTO contact_submissions (id, name, email, inquiry_type, organization, message, created_at)
      OVERRIDING SYSTEM VALUE VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
    [row.id, row.name, row.email, row.inquiry_type, row.organization, row.message, row.created_at]);
  }

  const applications = source.prepare('SELECT id, organization, contact_name, email, organization_type, need, created_at FROM impact_applications ORDER BY id').all();
  for (const row of applications) {
    await client.query(`INSERT INTO impact_applications (id, organization, contact_name, email, organization_type, need, created_at)
      OVERRIDING SYSTEM VALUE VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
    [row.id, row.organization, row.contact_name, row.email, row.organization_type, row.need, row.created_at]);
  }

  for (const table of ['contact_submissions', 'impact_applications']) {
    await client.query(`SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM ${table}`, [table]);
  }
  await client.query('COMMIT');
  transactionStarted = false;
  console.log(`SQLite import complete. Found ${contacts.length} contacts and ${applications.length} Impact applications. Existing PostgreSQL IDs were left unchanged.`);
} catch (error) {
  if (transactionStarted) await client.query('ROLLBACK').catch(() => {});
  throw error;
} finally {
  source.close();
  client?.release();
  await closeDatabase();
}
