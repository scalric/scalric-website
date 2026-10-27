import 'dotenv/config';
import pg from 'pg';

// bigint (ids, COUNT(*)) comes back as a string by default; our values are far below 2^53.
pg.types.setTypeParser(20, Number);

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set. Add the Supabase connection string to .env.');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
  max: 5,
});

/** Thin wrapper so callers use `query(sql, params)` with `$1`-style placeholders and get `{ rows, rowCount }`. */
export const database = {
  async query(sql, params = []) {
    const result = await pool.query(sql, params);
    return { rows: result.rows, rowCount: result.rowCount ?? 0 };
  },
};

/** The schema lives in database/supabase-schema.sql and is applied through the Supabase SQL Editor. */
export async function initializeDatabase() {
  await pool.query('SELECT 1');
}

export async function closeDatabase() {
  await pool.end();
}
