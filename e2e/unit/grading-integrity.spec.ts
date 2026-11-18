import { expect, test } from '@playwright/test';
import type { PoolClient } from 'pg';
import { confirmationProblems, lockSession, checkWorkerFence, queueSection } from '../../lib/grading/lifecycle';
import { assertSupportedPageCount } from '../../lib/grading/grade';
import { computeSectionScores, type ScoreInput } from '../../lib/grading/scores';

const base: ScoreInput & { pageCount: number; identityStatus: string; activeJobs: number; flags: string[] } = {
  rubric: { version: 1, totalPoints: 1, questions: [{ no: 1, type: 'mc', answer: 'A', points: 1 }] },
  mcAnswers: [{ questionNo: 1, picked: null }], criteria: [], mcStatus: 'needs-review', essayStatus: 'not-applicable',
  pageCount: 1, identityStatus: 'verified', activeJobs: 0, flags: [],
};
test('explicit blank is zero; absent reading is not a grade', () => {
  expect(computeSectionScores(base).total).toBe(0);
  expect(computeSectionScores({ ...base, mcAnswers: [] }).total).toBeNull();
  expect(confirmationProblems(base)).toEqual([]);
  expect(confirmationProblems({ ...base, mcAnswers: [] }).length).toBeGreaterThan(0);
});
test('confirmation rejects unfinished identity, pages, jobs, and failed sections', () => {
  for (const patch of [{ identityStatus: 'suggested' }, { pageCount: 0 }, { activeJobs: 1 },
    { mcStatus: 'failed' as const }, { flags: ['needs-retake'] }]) {
    expect(confirmationProblems({ ...base, ...patch }).length).toBeGreaterThan(0);
  }
});
test('missing essay criterion blocks confirmation, explicit zero is complete', () => {
  const input = { ...base, rubric: { version: 1 as const, totalPoints: 1, questions: [
    { no: 2, type: 'essay' as const, points: 1, steps: [{ key: 's1', text: 'step', points: 1 }] }] },
    mcStatus: 'not-applicable' as const, essayStatus: 'needs-review' as const };
  expect(confirmationProblems(input).length).toBeGreaterThan(0);
  expect(confirmationProblems({ ...input, criteria: [{ questionNo: 2, criterionKey: 's1', maxPoints: 1, aiPoints: 0, finalPoints: null }] })).toEqual([]);
});
test('AI rejects five pages instead of truncating and accepts four', () => {
  expect(() => assertSupportedPageCount(5)).toThrow(/5 trang/);
  expect(() => assertSupportedPageCount(0)).toThrow(/chưa có trang/);
  expect(() => assertSupportedPageCount(4)).not.toThrow();
});
function fake(rows: unknown[][]) {
  const calls: Array<{ sql: string; args: unknown[] }> = [];
  const client = { query: async (sql: string, args: unknown[] = []) => {
    calls.push({ sql, args }); return { rows: rows.shift() ?? [], rowCount: 1 };
  } } as unknown as PoolClient;
  return { client, calls };
}
test('finalized and archived session rejects before submission/job writes', async () => {
  for (const status of ['finalized', 'archived']) {
    const { client, calls } = fake([[{ id: 's', status, mode: 'mixed' }]]);
    await expect(lockSession(client, 's')).rejects.toMatchObject({ code: 'session_locked' });
    expect(calls).toHaveLength(1);
    expect(calls[0].sql).toContain('for update');
  }
});
test('worker rejects revision drift and reclaimed leases under session-first locks', async () => {
  for (const patch of [{ input_revision: 2 }, { mc_revision: 2 }, { status: 'confirmed' }, {}]) {
    const { client, calls } = fake([[{ id: 's', status: 'active' }],
      [], // Published provenance guard: no unverified published submission.
      [{ id: 'p', input_revision: 1, mc_revision: 1, status: 'processing', ...patch }],
      Object.keys(patch).length ? [{ valid: true }] : []]);
    await expect(checkWorkerFence(client, 's', 'p', 'grade-mc', { jobId: 'j', leaseToken: 'old', inputRevision: 1, sectionRevision: 1 }))
      .rejects.toMatchObject({ code: 'stale_grading_result' });
    expect(calls[0].sql).toContain('grading_sessions');
    expect(calls[1].sql).toContain('exam_release_variants');
    expect(calls[1].args).toEqual(['s', 'p']);
    expect(calls[2].sql).toContain('submissions');
    expect(calls[2].sql).toContain('for update');
    expect(calls[3].args).toEqual(['j', 'old']);
    expect(calls[3].sql).toContain('for update');
    expect(calls).toHaveLength(4);
  }
});
test('queue key binds both input and section revision', async () => {
  const { client, calls } = fake([[], [{ id: 'p', input_revision: 3, essay_revision: 7 }], [{ id: 'j' }], []]);
  await queueSection(client, 's', 'p', 'grade-essay');
  expect(calls[0].sql).toContain('exam_release_variants');
  expect(calls[2].args).toEqual(['s', 'p', 'grade-essay', 'p:grade-essay:i3:s7', 3, 7]);
});
test('unverified published provenance blocks workers and queues before submission/job writes', async () => {
  const worker = fake([[{ id: 's', status: 'active' }], [{ id: 'variant' }]]);
  await expect(checkWorkerFence(worker.client, 's', 'p', 'grade-mc', {
    jobId: 'j', leaseToken: 'lease', inputRevision: 1, sectionRevision: 1,
  })).rejects.toMatchObject({ code: 'published_identity_required' });
  expect(worker.calls).toHaveLength(2);
  const queue = fake([[{ id: 'variant' }]]);
  await expect(queueSection(queue.client, 's', 'p', 'grade-essay'))
    .rejects.toMatchObject({ code: 'published_identity_required' });
  expect(queue.calls).toHaveLength(1);
});
test('verified published MC cannot fall back to an AI grading job', async () => {
  const { client, calls } = fake([[], [{ id: 'p', input_revision: 1, mc_revision: 1 }], [{ id: 'variant' }]]);
  await expect(queueSection(client, 's', 'p', 'grade-mc'))
    .rejects.toMatchObject({ code: 'published_omr_required' });
  expect(calls).toHaveLength(3);
  expect(calls.every(call => !/insert into jobs|update submissions/.test(call.sql))).toBe(true);
});
