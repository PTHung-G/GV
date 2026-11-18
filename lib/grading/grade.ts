/**
 * Grading one submission.
 *
 * The two sections are graded by separate jobs so a failure or a re-run in one
 * never disturbs the other. Scores are written per criterion, and the totals are
 * always recomputed by `computeSectionScores` — the model proposes, the code
 * decides what the marks add up to.
 */
import { query, queryOne, withTransaction } from '@/lib/server/db';
import type { PoolClient } from 'pg';
import { HttpError } from '@/lib/server/http';
import { checkWorkerFence, lockSession, lockSubmission, type GradeFence } from './lifecycle';
import { getObject } from '@/lib/server/storage';
import { computeSectionScores, type SectionStatus } from './scores';
import { rubricFromStored, type EssayQuestion, type Rubric } from './rubric';
import {
  ESSAY_LOW_CONFIDENCE,
  MC_AUTO_CONFIRM_CONFIDENCE,
  essayQuestionsOf,
  gradeEssayQuestion,
  mcQuestionsOf,
  readMultipleChoice,
  type PageImage,
} from './vision';

export type GradeKind = 'grade-mc' | 'grade-essay';

/** Sending every page of a long paper would be slow and expensive. */
const MAX_PAGES_PER_CALL = 4;

type SubmissionContext = {
  submissionId: string;
  sessionId: string;
  subject: string | null;
  className: string | null;
  mode: string;
  rubric: Rubric;
  identityStatus: string;
  examHtml: string | null;
};

async function loadContext(submissionId: string): Promise<SubmissionContext> {
  const row = await queryOne<{
    session_id: string;
    subject: string | null;
    class_name: string | null;
    mode: string;
    payload: unknown;
    identity_status: string;
    exam_html: string | null;
    status: string;
  }>(
    `select s.id as session_id, snap.subject, s.class_name, s.mode, r.payload, sub.identity_status, snap.exam_html, s.status
       from submissions sub
       join grading_sessions s on s.id = sub.session_id
       join exam_snapshots snap on snap.id = s.snapshot_id
       join rubric_revisions r on r.id = s.rubric_revision_id
      where sub.id = $1`,
    [submissionId],
  );
  if (!row) throw new Error('submission_not_found');
  if (row.status !== 'active') throw new HttpError(409, 'Đợt chấm đã khóa.', 'session_locked');

  return {
    submissionId,
    sessionId: row.session_id,
    subject: row.subject,
    className: row.class_name,
    mode: row.mode,
    rubric: rubricFromStored(row.payload),
    identityStatus: row.identity_status,
    examHtml: row.exam_html,
  };
}

/** Explicit rejection rather than silently grading the first four pages. */
export function assertSupportedPageCount(pageCount: number): void {
  if (!pageCount) throw new HttpError(400, 'Bài chưa có trang ảnh để chấm.', 'no_pages');
  if (pageCount > MAX_PAGES_PER_CALL) throw new HttpError(422,
    `Bài có ${pageCount} trang; AI hiện hỗ trợ tối đa ${MAX_PAGES_PER_CALL} trang. Hãy chấm tay toàn bộ bài hoặc gộp ảnh rõ nét thành tối đa 4 trang rồi nộp lại. Không trang nào đã được chấm.`, 'too_many_pages');
}

async function loadPages(submissionId: string): Promise<PageImage[]> {
  const rows = await query<{ storage_key: string; mime_type: string }>(
    `select storage_key, mime_type from page_assets
      where submission_id = $1 and kind = 'original' and status = 'stored'
      order by page_index
      limit $2`,
    [submissionId, MAX_PAGES_PER_CALL],
  );

  assertSupportedPageCount(rows.length);
  const images: PageImage[] = [];
  for (const row of rows) {
    const buffer = await getObject(row.storage_key);
    images.push({ mimeType: row.mime_type, base64: buffer.toString('base64') });
  }
  return images;
}

// ------------------------------------------------------- multiple choice

export async function runMcGrading(submissionId: string, fence: GradeFence): Promise<{ status: SectionStatus }> {
  const context = await loadContext(submissionId);
  const questions = mcQuestionsOf(context.rubric);

  if (questions.length === 0) {

    return { status: 'not-applicable' };
  }

  const pages = await loadPages(submissionId);
  const { readings, warning, student } = await readMultipleChoice(pages, questions, {
    subject: context.subject,
    className: context.className,
  });

  const questionByNo = new Map(questions.map((question) => [question.no, question]));
  let needsReview = Boolean(warning);

  await withTransaction(async (client) => {
    await checkWorkerFence(client, context.sessionId, submissionId, 'grade-mc', fence);
  // A name read off the page is a proposal, not proof: it is stored as a
  // suggestion so the teacher can confirm it, never as verified identity.
  if (
    student &&
    (student.name || student.code) &&
    (context.identityStatus === 'unassigned' || context.identityStatus === 'suggested')
  ) {
    await client.query(
      `update submissions
          set student_name = coalesce($2, student_name),
              student_code = coalesce($3, student_code),
              identity_status = 'suggested',
              updated_at = now()
        where id = $1 and identity_status in ('unassigned', 'suggested')`,
      [submissionId, student.name, student.code],
    );
  }

    await client.query(`delete from mc_answers where submission_id = $1`, [submissionId]);

    for (const reading of readings) {
      const question = questionByNo.get(reading.questionNo);
      if (!question) continue;

      const picked = reading.picked;
      const flags: string[] = [];

      if (picked === null) flags.push('blank');
      else if (!/^[A-D]$/.test(picked)) flags.push('double-mark');
      else if (picked !== question.answer) flags.push('incorrect');
      else if (reading.confidence < MC_AUTO_CONFIRM_CONFIDENCE) flags.push('low-confidence');

      // A wrong answer is a fact, not an uncertainty: only unreadable or
      // ambiguous answers need a human.
      const uncertain = flags.some((flag) => flag !== 'incorrect');
      if (uncertain) needsReview = true;

      await client.query(
        `insert into mc_answers (submission_id, question_no, picked, confidence, source, flags)
         values ($1, $2, $3, $4, 'ai', $5)`,
        [submissionId, reading.questionNo, picked, reading.confidence, flags],
      );
    }
    await client.query('update submissions set mc_status = $2, updated_at = now() where id = $1',
      [submissionId, needsReview ? 'needs-review' : 'confirmed']);
    await refreshTotals(submissionId, client);
  });
  const status: SectionStatus = needsReview ? 'needs-review' : 'confirmed';

  return { status };
}

// --------------------------------------------------------------- essay

export async function runEssayGrading(submissionId: string, fence: GradeFence): Promise<{ status: SectionStatus }> {
  const context = await loadContext(submissionId);
  const questions = essayQuestionsOf(context.rubric);

  if (questions.length === 0) {

    return { status: 'not-applicable' };
  }

  const pages = await loadPages(submissionId);
  const results: Array<{ question: EssayQuestion; steps: Awaited<ReturnType<typeof gradeEssayQuestion>>['steps'] }> = [];

  for (const question of questions) {
    // The model call happens before the transaction: holding one open across
    // network I/O would block other writers and lose everything on a stall.
    const { steps, warning } = await gradeEssayQuestion(pages, question, {
      subject: context.subject,
      className: context.className,
      examHtml: context.examHtml,
    });
    if (warning) throw new Error(warning);
    results.push({ question, steps });
  }
  await withTransaction(async (client) => {
    await checkWorkerFence(client, context.sessionId, submissionId, 'grade-essay', fence);
    for (const { question, steps } of results) {
      for (const step of steps) {
        const maxPoints = question.steps.find((entry) => entry.key === step.key)?.points ?? 0;
        const flags: string[] = [];
        if (step.awarded === null) flags.push('unreadable');
        else if (step.confidence < ESSAY_LOW_CONFIDENCE) flags.push('low-confidence');
        // A mark sitting between zero and full is exactly what a teacher should see.
        else if (step.awarded > 0 && step.awarded < maxPoints) flags.push('partial');

        await client.query(
          `insert into criterion_scores
             (submission_id, section, question_no, criterion_key, max_points, ai_points, evidence, confidence, flags, source)
           values ($1, 'essay', $2, $3, $4, $5, $6, $7, $8, 'ai')
           on conflict (submission_id, question_no, criterion_key) do update
             set ai_points = excluded.ai_points,
                 evidence = excluded.evidence,
                 confidence = excluded.confidence,
                 flags = excluded.flags,
                 max_points = excluded.max_points,
                 updated_at = now()`,
          [
            submissionId,
            question.no,
            step.key,
            maxPoints,
            step.awarded,
            step.evidence || null,
            step.confidence,
            flags,
          ],
        );
      }
    }
    await client.query("update submissions set essay_status = 'needs-review', updated_at = now() where id = $1", [submissionId]);
    await refreshTotals(submissionId, client);
  });

  // Essay marks are always a proposal: the teacher approves them.
  const status: SectionStatus = 'needs-review';

  return { status };
}

// -------------------------------------------------------------- totals

/**
 * Recomputes both section marks and the total from stored rows.
 *
 * Called after every grading run and after every teacher edit, so the stored
 * totals can never drift from the criteria they came from.
 */
export async function refreshTotals(submissionId: string, client?: PoolClient): Promise<void> {
  if (!client) {
    const owner = await queryOne<{ session_id: string }>('select session_id from submissions where id = $1', [submissionId]);
    if (!owner) return;
    return withTransaction(async tx => {
      await lockSession(tx, owner.session_id);
      await lockSubmission(tx, owner.session_id, submissionId);
      await refreshTotals(submissionId, tx);
    });
  }
  const one = async <T extends import('pg').QueryResultRow>(sql: string, args: unknown[]) => (await client.query<T>(sql, args)).rows[0];
  const many = async <T extends import('pg').QueryResultRow = import('pg').QueryResultRow>(sql: string, args: unknown[]) => (await client.query<T>(sql, args)).rows;
  const row = await one<{
    mc_status: SectionStatus;
    essay_status: SectionStatus;
    payload: unknown;
  }>(
    `select sub.mc_status, sub.essay_status, r.payload
       from submissions sub
       join grading_sessions s on s.id = sub.session_id
       join rubric_revisions r on r.id = s.rubric_revision_id
      where sub.id = $1`,
    [submissionId],
  );
  if (!row) return;

  const rubric = rubricFromStored(row.payload);

  const mcAnswers = await many<{ question_no: number; picked: string | null; flags: string[] }>(
    `select question_no, picked, flags from mc_answers where submission_id = $1`,
    [submissionId],
  );

  const criteria = await many<{
    question_no: number;
    criterion_key: string;
    max_points: string;
    ai_points: string | null;
    final_points: string | null;
  }>(
    `select question_no, criterion_key, max_points, ai_points, final_points
       from criterion_scores where submission_id = $1 and section = 'essay'`,
    [submissionId],
  );

  const result = computeSectionScores({
    rubric,
    mcAnswers: mcAnswers.map((answer) => ({
      questionNo: answer.question_no,
      picked: answer.picked,
      flags: answer.flags ?? [],
    })),
    criteria: criteria.map((criterion) => ({
      questionNo: criterion.question_no,
      criterionKey: criterion.criterion_key,
      maxPoints: Number(criterion.max_points),
      aiPoints: criterion.ai_points === null ? null : Number(criterion.ai_points),
      finalPoints: criterion.final_points === null ? null : Number(criterion.final_points),
    })),
    mcStatus: row.mc_status,
    essayStatus: row.essay_status,
  });

  const needsReview = row.mc_status === 'needs-review' || row.essay_status === 'needs-review';
  const stillProcessing = row.mc_status === 'processing' || row.essay_status === 'processing';

  // A confirmed paper stays confirmed; grading never silently un-confirms it.
  const status = stillProcessing ? 'processing' : 'needs-review';
  void needsReview;

  await many(
    `update submissions
        set mc_score = $2,
            essay_score = $3,
            total_score = $4,
            status = case when status = 'confirmed' then 'confirmed' else $5 end,
            updated_at = now()
      where id = $1`,
    [submissionId, result.mc, result.essay, result.total, status],
  );
}

export async function gradeSubmission(
  submissionId: string,
  kind: GradeKind,
  fence: GradeFence,
): Promise<Record<string, unknown>> {
  if (kind === 'grade-mc') {
    const { status } = await runMcGrading(submissionId, fence);
    return { section: 'mc', status };
  }
  const { status } = await runEssayGrading(submissionId, fence);
  return { section: 'essay', status };
}

/** Small helper used by the review UI to know which questions are essay ones. */
export function essayQuestionByNo(rubric: Rubric, no: number): EssayQuestion | undefined {
  return essayQuestionsOf(rubric).find((question) => question.no === no);
}
