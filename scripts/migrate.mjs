#!/usr/bin/env node
/**
 * Migration runner — `pnpm db:migrate` (add `--status` to only report).
 *
 * Applies db/migrations/*.sql in filename order, once each, inside a
 * transaction, and records the filename in schema_migrations. Re-running is
 * safe: applied files are skipped.
 */
import { existsSync, readFileSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Minimal .env reader so scripts do not need a dotenv dependency. */
function loadEnvFile(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const match = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    let value = rawValue;
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

// Dev database credentials first, then .env.local so it can override them.
loadEnvFile(path.join(root, '.data', 'dev-db.env'));
loadEnvFile(path.join(root, '.env.local'));

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  console.error(
    'Thiếu DATABASE_URL. Chạy `docker compose --env-file .data/dev-db.env -f compose.dev-db.yml up -d --wait` trước.',
  );
  process.exit(1);
}

const statusOnly = process.argv.includes('--status');
const migrationsDir = path.join(root, 'db', 'migrations');

const files = (await readdir(migrationsDir)).filter((name) => name.endsWith('.sql')).sort();

const client = new pg.Client({ connectionString });
await client.connect();

await client.query(`
  create table if not exists schema_migrations (
    name text primary key,
    applied_at timestamptz not null default now()
  )
`);

const { rows } = await client.query('select name from schema_migrations');
const applied = new Set(rows.map((row) => row.name));

let pending = 0;
for (const file of files) {
  if (applied.has(file)) {
    console.log(`• đã áp dụng: ${file}`);
    continue;
  }
  pending += 1;
  if (statusOnly) {
    console.log(`• cần chạy:   ${file}`);
    continue;
  }
  const sql = await readFile(path.join(migrationsDir, file), 'utf8');
  await client.query('begin');
  try {
    await client.query(sql);
    await client.query('insert into schema_migrations (name) values ($1)', [file]);
    await client.query('commit');
    console.log(`✓ đã áp dụng: ${file}`);
  } catch (error) {
    await client.query('rollback');
    console.error(`✗ lỗi ở ${file}: ${error.message}`);
    await client.end();
    process.exit(1);
  }
}

if (statusOnly) {
  console.log(pending === 0 ? 'Không có migration nào chờ.' : `${pending} migration đang chờ.`);
}

await client.end();
