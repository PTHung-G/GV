/**
 * /api/grading/sessions/[id]/submissions
 *   GET  — every paper in the session, with its pages.
 *   POST — start a new paper (optionally already assigned to a student).
 */
import { NextResponse } from 'next/server';
import { jsonError, readJson, requireDatabase } from '@/lib/server/http';
import { authorizeSession } from '@/lib/grading/access';
import {
  createSubmission,
  listSubmissions,
  sessionProgress,
  type CreateSubmissionInput,
} from '@/lib/grading/submissions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;
    await authorizeSession(id);

    const [submissions, progress] = await Promise.all([listSubmissions(id), sessionProgress(id)]);
    return NextResponse.json({ success: true, submissions, progress });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;
    await authorizeSession(id);

    const body = await readJson<CreateSubmissionInput>(req);
    const submission = await createSubmission(id, body ?? {});
    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
