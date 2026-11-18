import { test, expect } from '@playwright/test';
import { Pool } from 'pg';
import { readFileSync, readdirSync } from 'node:fs';
import { checkWorkerFence, lockSession, queueSection } from '../../lib/grading/lifecycle';

// Opt-in only. Uses its own pool, never DATABASE_URL or application pool.
const port = process.env.EXAM_SYNC_TEST_PORT;
test.skip(!port, 'Requires a disposable PostgreSQL container mapped to loopback');
let pool: Pool;
let session: string;
let submission: string;
let job: string;
const lease = '11111111-1111-4111-8111-111111111111';
test.beforeAll(async () => {
  pool = new Pool({ host: '127.0.0.1', port: Number(port), user: 'postgres', database: 'postgres', max: 4 });
  // Refuse any populated database instead of migrating a possibly real database.
  const existing = await pool.query("select count(*)::int as count from information_schema.tables where table_schema='public'");
  if (existing.rows[0].count !== 0) throw new Error('Integration tests require an empty disposable database');
  for (const name of readdirSync('db/migrations').filter(n => n.endsWith('.sql')).sort()) {
    await pool.query(readFileSync(`db/migrations/${name}`, 'utf8'));
  }
  const owner = (await pool.query("insert into users(email,name) values('integration@example.test','Test') returning id")).rows[0].id;
  const snapshot = (await pool.query("insert into exam_snapshots(owner_id,title) values($1,'Frozen') returning id", [owner])).rows[0].id;
  const rubric = (await pool.query("insert into rubric_revisions(snapshot_id,total_points,payload) values($1,1,'{}') returning id", [snapshot])).rows[0].id;
  session = (await pool.query("insert into grading_sessions(owner_id,snapshot_id,rubric_revision_id,title,mode) values($1,$2,$3,'Test','mc-only') returning id", [owner, snapshot, rubric])).rows[0].id;
  submission = (await pool.query('insert into submissions(session_id) values($1) returning id', [session])).rows[0].id;
});
test.afterAll(async () => { await pool?.end(); });

test('real lifecycle SQL queues idempotently and rejects stale revisions, leases and finalized writes', async () => {
  const client = await pool.connect();
  try {
    await client.query('begin');
    await lockSession(client, session);
    await queueSection(client, session, submission, 'grade-mc');
    await queueSection(client, session, submission, 'grade-mc');
    await client.query('commit');
    const jobs = await pool.query('select * from jobs where submission_id=$1', [submission]);
    expect(jobs.rows).toHaveLength(1);
    job = jobs.rows[0].id;
    await pool.query("update jobs set status='running',lease_token=$2 where id=$1", [job, lease]);
    const fence = { jobId: job, leaseToken: lease, inputRevision: 1, sectionRevision: 1 };
    await client.query('begin');
    await checkWorkerFence(client, session, submission, 'grade-mc', fence);
    await client.query('commit');
    for (const patch of [{ inputRevision: 2 }, { sectionRevision: 2 }, { leaseToken: '22222222-2222-4222-8222-222222222222' }]) {
      await client.query('begin');
      await expect(checkWorkerFence(client, session, submission, 'grade-mc', { ...fence, ...patch })).rejects.toMatchObject({ code: 'stale_grading_result' });
      await client.query('rollback');
    }
    // Finalization holds the same session lock while a real worker fence waits.
    const finalizer = await pool.connect();
    try {
      await finalizer.query('begin');
      await lockSession(finalizer, session);
      await finalizer.query("update grading_sessions set status='finalized' where id=$1", [session]);
      await client.query('begin');
      const waitingFence = checkWorkerFence(client, session, submission, 'grade-mc', fence);
      const rejected = expect(waitingFence).rejects.toMatchObject({ code: 'session_locked' });
      await finalizer.query('commit');
      await rejected;
      await client.query('rollback');
    } finally { finalizer.release(); }
    expect((await pool.query('select total_score from submissions where id=$1', [submission])).rows[0].total_score).toBeNull();
  } finally {
    await client.query('rollback');
    client.release();
  }
});
