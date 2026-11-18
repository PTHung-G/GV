/**
 * GET /api/grading/sessions/[id]/review — every answer and criterion at once.
 *
 * The review screens need the whole class in one shot (the multiple-choice grid
 * compares papers side by side), so this returns flat rows instead of making the
 * browser fetch one paper at a time.
 */
import { NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { jsonError, requireDatabase } from '@/lib/server/http';
import { authorizeSession } from '@/lib/grading/access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;
    await authorizeSession(id);

    const mc = await query<{
      submission_id: string;
      question_no: number;
      picked: string | null;
      confidence: string | null;
      flags: string[];
      source: string;
    }>(
      `select a.submission_id, a.question_no, a.picked, a.confidence, a.flags, a.source
         from mc_answers a
         join submissions s on s.id = a.submission_id
        where s.session_id = $1
        order by a.question_no`,
      [id],
    );

    const essay = await query<{
      submission_id: string;
      question_no: number;
      criterion_key: string;
      max_points: string;
      ai_points: string | null;
      final_points: string | null;
      evidence: string | null;
      confidence: string | null;
      flags: string[];
      source: string;
    }>(
      `select c.submission_id, c.question_no, c.criterion_key, c.max_points,
              c.ai_points, c.final_points, c.evidence, c.confidence, c.flags, c.source
         from criterion_scores c
         join submissions s on s.id = c.submission_id
        where s.session_id = $1 and c.section = 'essay'
        order by c.question_no, c.criterion_key`,
      [id],
    );

    return NextResponse.json({
      success: true,
      mc: mc.map((row) => ({
        submissionId: row.submission_id,
        questionNo: row.question_no,
        picked: row.picked,
        confidence: row.confidence === null ? null : Number(row.confidence),
        flags: row.flags ?? [],
        source: row.source,
      })),
      essay: essay.map((row) => ({
        submissionId: row.submission_id,
        questionNo: row.question_no,
        criterionKey: row.criterion_key,
        maxPoints: Number(row.max_points),
        aiPoints: row.ai_points === null ? null : Number(row.ai_points),
        finalPoints: row.final_points === null ? null : Number(row.final_points),
        evidence: row.evidence,
        confidence: row.confidence === null ? null : Number(row.confidence),
        flags: row.flags ?? [],
        source: row.source,
      })),
    });
  } catch (error) {
    return jsonError(error);
  }
}
