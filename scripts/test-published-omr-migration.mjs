#!/usr/bin/env node
/** Standalone disposable-Postgres regression; never reads DATABASE_URL or app data.
 * Run: node scripts/test-published-omr-migration.mjs
 * Requires the local postgres:16-alpine image and Docker. No ports or volumes.
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';

const name = `sdt-omr-migration-test-${process.pid}-${Date.now()}`;
const directory = new URL('../db/migrations/', import.meta.url);
const repair = await readFile(new URL('0014_published_omr_verification.sql', directory), 'utf8');
const docker = (args, input) => execFileSync('docker', args, {
  input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 30_000,
});
const sql = (input) => docker(['exec', '-i', name, 'psql', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-h', '127.0.0.1', '-U', 'postgres'], input).trim();
let started = false;
try {
  docker(['run', '--detach', '--rm', '--pull', 'never', '--name', name, '--network', 'none',
    '--tmpfs', '/var/lib/postgresql/data', '-e', 'POSTGRES_HOST_AUTH_METHOD=trust',
    'postgres:16-alpine']);
  started = true;
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      docker(['exec', name, 'pg_isready', '-h', '127.0.0.1', '-U', 'postgres']);
      ready = true;
      break;
    } catch { await setTimeout(250); }
  }
  assert.ok(ready, 'Disposable Postgres did not become ready');
  // Fresh install: execute the real migration chain and repeat the repair.
  for (const file of (await readdir(directory)).filter(file => file.endsWith('.sql')).sort()) {
    sql(await readFile(new URL(file, directory), 'utf8'));
  }
  sql(repair);
  assert.equal(sql(`select data_type || ':' || is_nullable || ':' || coalesce(column_default, 'NULL')
    from information_schema.columns where table_schema='public' and table_name='submissions'
    and column_name='published_omr_verified_at';`), 'timestamp with time zone:YES:NULL');
  console.log('PASS fresh migration chain and already-present repair');
  // Reproduce earlier-0013 drift in an isolated schema, with a pre-existing row.
  const scope = 'set search_path = drift, public;\n';
  sql(`create schema drift; create table drift.submissions (id integer primary key, status text not null);
    insert into drift.submissions values (1, 'needs-review');`);
  sql(scope + repair);
  assert.equal(sql(scope + `select id || ':' || status || ':' || (published_omr_verified_at is null)
    from submissions;`), '1:needs-review:true');
  sql(scope + `update submissions set published_omr_verified_at = '2026-01-02T03:04:05Z';`);
  sql(scope + repair);
  assert.equal(sql(scope + `select id || ':' || status || ':' ||
    to_char(published_omr_verified_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI:SS') from submissions;`),
    '1:needs-review:2026-01-02 03:04:05');
  console.log('PASS drift repair leaves old rows unverified and repeat preserves verified timestamp');
} finally {
  if (started) docker(['rm', '--force', name]);
}
