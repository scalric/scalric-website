import 'dotenv/config';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { sampleRoles } from './sampleRoles.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const file = resolve(root, process.env.DATABASE_PATH || 'database/scalric.sqlite');
mkdirSync(dirname(file), { recursive: true });

const sqlite = new DatabaseSync(file);
sqlite.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');

// Columns added after the first release; applied to existing databases on startup.
const addedColumns = {
  contact_submissions: [
    ['role', "TEXT NOT NULL DEFAULT ''"],
    ['link', "TEXT NOT NULL DEFAULT ''"],
    ['phone', "TEXT NOT NULL DEFAULT ''"],
    ['experience_years', "TEXT NOT NULL DEFAULT ''"],
    ['experience', "TEXT NOT NULL DEFAULT ''"],
    ['resume_name', "TEXT NOT NULL DEFAULT ''"],
    ['resume_file', "TEXT NOT NULL DEFAULT ''"],
    ["status", "TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived'))"],
    ['notes', "TEXT NOT NULL DEFAULT ''"],
    ['updated_at', "TEXT NOT NULL DEFAULT ''"],
  ],
  impact_applications: [
    ["status", "TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived'))"],
    ['notes', "TEXT NOT NULL DEFAULT ''"],
    ['updated_at', "TEXT NOT NULL DEFAULT ''"],
  ],
};

/** Small async wrapper so callers use `query(sql, params)` with `$1`-style placeholders and get `{ rows, rowCount }`. */
export const database = {
  async query(sql, params = []) {
    const statement = sqlite.prepare(sql.replace(/\$(\d+)/g, '?$1'));
    if (/^\s*(SELECT|WITH)/i.test(sql) || /\bRETURNING\b/i.test(sql)) {
      const rows = statement.all(...params);
      return { rows, rowCount: rows.length };
    }
    const result = statement.run(...params);
    return { rows: [], rowCount: Number(result.changes) };
  },
};

function seedSampleRoles() {
  // One-time: only on a database that has never been seeded, so roles deleted in the admin stay deleted.
  if (sqlite.prepare('PRAGMA user_version').get().user_version >= 1) return;
  const insert = sqlite.prepare('INSERT OR IGNORE INTO roles (slug, title, team, location, work_mode, description, published) VALUES (?, ?, ?, ?, ?, ?, 1)');
  for (const role of sampleRoles) insert.run(...role);
  sqlite.exec('PRAGMA user_version = 1');
}

export async function initializeDatabase() {
  sqlite.exec(readFileSync(resolve(root, 'database/schema.sql'), 'utf8'));
  for (const [table, columns] of Object.entries(addedColumns)) {
    const existing = new Set(sqlite.prepare(`PRAGMA table_info(${table})`).all().map((column) => column.name));
    for (const [name, definition] of columns) {
      if (!existing.has(name)) sqlite.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
    }
  }
  seedSampleRoles();
  sqlite.exec('CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status); CREATE INDEX IF NOT EXISTS idx_impact_applications_status ON impact_applications(status);');
}

export async function closeDatabase() {
  sqlite.close();
}
