import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Copy .env.example to .env and configure PostgreSQL.');
}

export const database = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_SIZE || 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
});

export async function waitForDatabase() {
  const maxAttempts = Number(process.env.DB_CONNECT_RETRIES || 30);
  const delayMs = Number(process.env.DB_RETRY_DELAY_MS || 1_000);
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await database.query('SELECT 1');
      return;
    } catch (error) {
      lastError = error;
      const retryable = error.code?.startsWith('ECONN') || ['57P03', '08001', '08006'].includes(error.code) || error.message?.includes('Connection terminated unexpectedly');
      if (!retryable) throw error;
      if (attempt === maxAttempts) break;
      console.log(`Waiting for PostgreSQL (${attempt}/${maxAttempts})...`);
      await new Promise((resolveDelay) => setTimeout(resolveDelay, delayMs));
    }
  }

  throw new Error(`Could not connect to PostgreSQL after ${maxAttempts} attempts: ${lastError?.message || 'connection failed'}`);
}

export async function initializeDatabase() {
  await waitForDatabase();
  const schema = await readFile(resolve(root, 'database/schema.sql'), 'utf8');
  await database.query(schema);
}

export async function closeDatabase() {
  await database.end();
}
