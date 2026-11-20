#!/usr/bin/env node
/**
 * Runs a command against a temporary (or persisted) in-process PostgreSQL 16
 * instance powered by @electric-sql/pglite + @electric-sql/pglite-socket.
 *
 * Usage:
 *   node scripts/with-pglite.mjs [--migrate] [--port 54329] [--persist .data/pg] -- <command...>
 */
import { spawn } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rawArgs = process.argv.slice(2);
const sep = rawArgs.indexOf('--');
const flags = sep >= 0 ? rawArgs.slice(0, sep) : rawArgs;
const cmdArgs = sep >= 0 ? rawArgs.slice(sep + 1) : [];

if (cmdArgs.length === 0) {
  console.error('Usage: node scripts/with-pglite.mjs [--migrate] [--port N] [--persist DIR] -- <command...>');
  process.exit(1);
}

let requestedPort = 0;
let migrate = false;
let noAppDb = false;
let persistDir = undefined;

for (let i = 0; i < flags.length; i += 1) {
  const f = flags[i];
  if (f === '--migrate') migrate = true;
  else if (f === '--no-app-db') noAppDb = true;
  else if (f === '--port' && flags[i + 1]) requestedPort = Number(flags[++i]);
  else if (f === '--persist' && flags[i + 1]) persistDir = path.resolve(flags[++i]);
}

const db = persistDir ? new PGlite(persistDir) : new PGlite();
await db.waitReady;

if (migrate) {
  const migrationsDir = path.join(root, 'db', 'migrations');
  const files = (await readdir(migrationsDir)).filter((n) => n.endsWith('.sql')).sort();
  await db.exec(`
    create table if not exists schema_migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    );
  `);
  const applied = new Set((await db.query('select name from schema_migrations')).rows.map((r) => r.name));
  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = await readFile(path.join(migrationsDir, file), 'utf8');
    await db.exec('begin;');
    try {
      await db.exec(sql);
      await db.query('insert into schema_migrations (name) values ($1)', [file]);
      await db.exec('commit;');
      console.log(`[with-pglite] migrated ${file}`);
    } catch (err) {
      await db.exec('rollback;').catch(() => {});
      console.error(`[with-pglite] migration failed in ${file}:`, err);
      await db.close();
      process.exit(1);
    }
  }
}

const server = new PGLiteSocketServer({
  db,
  host: '127.0.0.1',
  port: requestedPort,
  maxConnections: 32,
});
await server.start();

const conn = server.getServerConn(); // e.g. "127.0.0.1:54321"
const port = conn.split(':').pop();
const databaseUrl = `postgresql://postgres@127.0.0.1:${port}/postgres`;

const childEnv = {
  ...process.env,
  QUESTION_BANK_TEST_PORT: String(port),
};
if (!noAppDb) {
  childEnv.DATABASE_URL = databaseUrl;
  childEnv.EXAM_SYNC_TEST_PORT = String(port);
  childEnv.DB_POOL_MAX = '1';
} else {
  delete childEnv.DATABASE_URL;
  delete childEnv.EXAM_SYNC_TEST_PORT;
}

const child = spawn(cmdArgs[0], cmdArgs.slice(1), {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: childEnv,
});

let shuttingDown = false;
async function cleanup(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  await server.stop().catch(() => {});
  await db.close().catch(() => {});
  process.exit(code);
}

process.on('SIGINT', () => void cleanup(130));
process.on('SIGTERM', () => void cleanup(143));

child.on('exit', (code, signal) => {
  void cleanup(code ?? (signal ? 1 : 0));
});
child.on('error', (err) => {
  console.error('[with-pglite] spawn error:', err);
  void cleanup(1);
});
