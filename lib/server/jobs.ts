/**
 * Background job runner.
 *
 * Grading must not depend on a phone keeping its browser open, so jobs live in
 * the database and a single in-process runner picks them up. Claiming uses
 * `for update skip locked`, so two workers (or a restart racing a slow job)
 * never grade the same paper twice.
 *
 * This is deliberately the simplest thing that is correct on one server. Moving
 * to several servers means replacing the claim query, not the handlers.
 */
import { query, queryOne, withTransaction } from '@/lib/server/db';
import { isDatabaseConfigured } from '@/lib/server/db';
import { checkWorkerFence } from '@/lib/grading/lifecycle';
import { gradeSubmission, refreshTotals, type GradeKind } from '@/lib/grading/grade';

const POLL_MS = 3_000;

type JobRow = {
  id: string;
  kind: GradeKind;
  submission_id: string | null;
  attempts: number;
  max_attempts: number;
  session_id: string; input_revision: number; section_revision: number; lease_token: string;
};

let running = false;

/** A job left 'running' by a crashed process would block its paper forever. */
const STALE_MINUTES = 10;

async function reclaimStaleJobs(): Promise<void> {
  try {
    await query(
      `update jobs
          set status = 'queued', lease_token = null, run_after = now()
        where status = 'running'
          and started_at < now() - make_interval(mins => $1::int)`,
      [STALE_MINUTES],
    );
  } catch {
    /* the queue keeps working even if this cleanup fails */
  }
}

/** Takes one queued job, or returns null when the queue is empty. */
async function claimJob(): Promise<JobRow | null> {
  const row = await queryOne<JobRow>(
    `with next as (
       select j.id from jobs j join grading_sessions s on s.id = j.session_id
         join submissions sub on sub.id = j.submission_id
       where j.status = 'queued' and j.run_after <= now() and s.status = 'active'
         and sub.status <> 'confirmed' and j.input_revision = sub.input_revision
         and j.section_revision = case when j.kind = 'grade-mc' then sub.mc_revision else sub.essay_revision end
       order by j.run_after limit 1 for update of j skip locked
     ) update jobs j set status = 'running', started_at = now(), attempts = j.attempts + 1,
         lease_token = gen_random_uuid() from next where j.id = next.id returning j.*`,
  );
  return row;
}

/** Runs one job. Exported so a route or a test can drive the queue by hand. */
export async function runOneJob(): Promise<{ ran: boolean; jobId?: string; error?: string }> {
  const job = await claimJob();
  if (!job) return { ran: false };

  const fence = { jobId: job.id, leaseToken: job.lease_token, inputRevision: job.input_revision, sectionRevision: job.section_revision };
  try {
    if (!job.submission_id) throw new Error('Job không gắn với bài làm nào.');
    const result = await gradeSubmission(job.submission_id, job.kind, fence);
    await query("update jobs set status = 'succeeded', finished_at = now(), result = $3, last_error = null where id = $1 and lease_token = $2 and status = 'running'", [job.id, job.lease_token, JSON.stringify(result)]);
    return { ran: true, jobId: job.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi không xác định.';
    const code = (error as { code?: string })?.code;
    const exhausted = job.attempts >= job.max_attempts || ['too_many_pages','no_pages'].includes(code ?? '');
    try {
      await withTransaction(async client => {
        if (!job.submission_id) throw error;
        await checkWorkerFence(client, job.session_id, job.submission_id, job.kind, fence);
        if (exhausted) {
          await client.query(`update submissions set ${job.kind === 'grade-mc' ? 'mc_status' : 'essay_status'} = 'failed', status = 'needs-review', flags = array_append(flags,$2), updated_at = now() where id = $1`, [job.submission_id, `grading-failed: ${message.slice(0,500)}`]);
          await refreshTotals(job.submission_id, client);
        }
        await client.query(`update jobs set status = $3, finished_at = case when $3 = 'failed' then now() else null end,
          last_error = $4, run_after = now() + make_interval(secs => $5::int), lease_token = null where id = $1 and lease_token = $2`,
          [job.id, job.lease_token, exhausted ? 'failed' : 'queued', message.slice(0,1000), 10 * job.attempts]);
      });
    } catch {
      // Finalized/deleted/newer input owns the submission; retire only this lease.
      await query("update jobs set status = 'failed', finished_at = now(), last_error = $3, lease_token = null where id = $1 and lease_token = $2 and status = 'running'", [job.id, job.lease_token, message.slice(0,1000)]);
    }
    return { ran: true, jobId: job.id, error: message };
  }
}

/** Drains the queue; used by the manual tick endpoint and by tests. */
export async function drainJobs(limit = 10): Promise<number> {
  let processed = 0;
  while (processed < limit) {
    const outcome = await runOneJob();
    if (!outcome.ran) break;
    processed += 1;
  }
  return processed;
}

async function tick(): Promise<void> {
  if (running) return;
  running = true;
  try {
    await reclaimStaleJobs();
    await drainJobs(3);
  } catch (error) {
    console.error('[jobs] vòng quét gặp lỗi:', error instanceof Error ? error.message : error);
  } finally {
    running = false;
  }
}

/**
 * Starts the polling loop once per server process. Safe to call from several
 * places: the guard lives on globalThis so a hot reload cannot double-start it.
 */
export function startWorker(): void {
  if (!isDatabaseConfigured()) return;
  // `next build` also loads instrumentation; never leave a timer running there.
  if (process.env.NEXT_PHASE === 'phase-production-build') return;

  const scope = globalThis as { __sdtGradingWorker?: boolean };
  if (scope.__sdtGradingWorker) return;
  scope.__sdtGradingWorker = true;

  console.log('[jobs] worker chấm bài đã khởi động.');
  setInterval(() => {
    void tick();
  }, POLL_MS);
}

/** Retries a failed job by hand, for the "thử lại" button. */
export async function retryJob(_jobId: string): Promise<void> {
  throw new Error('Hãy dùng thao tác chấm lại bài để tạo phiên bản chấm mới.');
}
