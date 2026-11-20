/**
 * GET /api/grading/sessions/[id]/stats — class-level analysis.
 *
 * The maths lives in `scoreStatistics` (pure and unit tested); this route only
 * assembles the rows it needs.
 */
import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/server/db';
import { jsonError, requireDatabase } from '@/lib/server/http';
import { authorizeTeacher } from '@/lib/grading/access';
import { rubricFromStored } from '@/lib/grading/rubric';
import { scoreStatistics, type McAnswer } from '@/lib/grading/scores';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;
    await authorizeTeacher(id);

    const session = await queryOne<{ payload: unknown }>(
      `select r.payload
         from grading_sessions s
         join rubric_revisions r on r.id = s.rubric_revision_id
        where s.id = $1`,
      [id],
    );
    if (!session) return NextResponse.json({ error: 'Không tìm thấy đợt chấm.' }, { status: 404 });

    const rubric = rubricFromStored(session.payload);

    const submissions = await query<{ id: string; total_score: string | null }>(
      `select id, total_score from submissions where session_id = $1`,
      [id],
    );

    const answers = await query<{ submission_id: string; question_no: number; picked: string | null }>(
      `select a.submission_id, a.question_no, a.picked
         from mc_answers a
         join submissions s on s.id = a.submission_id
        where s.session_id = $1`,
      [id],
    );

    const bySubmission = new Map<string, McAnswer[]>();
    for (const row of answers) {
      const list = bySubmission.get(row.submission_id) ?? [];
      list.push({ questionNo: row.question_no, picked: row.picked });
      bySubmission.set(row.submission_id, list);
    }

    const stats = scoreStatistics(
      rubric,
      submissions.map((submission) => ({
        mcAnswers: bySubmission.get(submission.id) ?? [],
        total: submission.total_score === null ? null : Number(submission.total_score),
      })),
    );

    return NextResponse.json({ success: true, stats, totalPoints: rubric.totalPoints });
  } catch (error) {
    return jsonError(error);
  }
}
