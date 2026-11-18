/**
 * /api/grading/sessions
 *   GET  — the signed-in teacher's grading sessions, newest first.
 *   POST — create a session, freezing the exam, answer key and rubric.
 */
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { HttpError, jsonError, readJson, requireDatabase, requireString } from '@/lib/server/http';
import { createSession, listSessions, type CreateSessionInput } from '@/lib/grading/sessions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    requireDatabase();
    const user = await requireUser();
    return NextResponse.json({ success: true, sessions: await listSessions(user.id, new URL(req.url).searchParams.get('examId') || undefined) });
  } catch (error) {
    return jsonError(error);
  }
}

type Body = Partial<CreateSessionInput> & { examTitle?: string };

export async function POST(req: Request) {
  try {
    requireDatabase();
    const user = await requireUser();
    const body = await readJson<Body>(req);

    const examTitle = requireString(body.examTitle, 'Thiếu tên đề thi.', 'missing_exam_title');

    if (!body.rubric) {
      throw new HttpError(
        400,
        'Thiếu bảng đáp án và thang điểm đã xác nhận.',
        'missing_rubric',
      );
    }

    const session = await createSession(user.id, {
      ...body,
      examTitle,
      // Narrowed above; `Partial<CreateSessionInput>` still marks it optional.
      rubric: body.rubric,
    });
    return NextResponse.json({ success: true, session }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
