/**
 * GET /api/grading/capture — what a paired phone is allowed to see.
 *
 * Deliberately narrow: the session title and the roster needed to pick a
 * student. No scores, no other sessions, no class list beyond this one.
 */
import { NextResponse } from 'next/server';
import { currentCapture } from '@/lib/server/auth';
import { query, queryOne } from '@/lib/server/db';
import { HttpError, jsonError, requireDatabase } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    requireDatabase();
    const capture = await currentCapture();
    if (!capture) {
      throw new HttpError(401, 'Thiết bị này chưa được ghép với đợt chấm nào.', 'not_paired');
    }

    const session = await queryOne<{
      id: string;
      title: string;
      class_name: string | null;
      mode: string;
      sheet_mode: string;
      class_id: string | null;
      sheet_template: unknown;
    }>(
      `select id, title, class_name, mode, sheet_mode, class_id, sheet_template
         from grading_sessions where id = $1`,
      [capture.sessionId],
    );
    if (!session) throw new HttpError(404, 'Đợt chấm không còn tồn tại.', 'session_not_found');

    const students = session.class_id
      ? await query<{ id: string; code: string | null; name: string }>(
          `select id, code, name from students where class_id = $1 order by sort_index, name`,
          [session.class_id],
        )
      : [];

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        title: session.title,
        className: session.class_name,
        mode: session.mode,
        sheetMode: session.sheet_mode,
        // Lets the phone read a standard sheet locally before uploading.
        sheetTemplate: session.sheet_template ?? null,
      },
      students,
    });
  } catch (error) {
    return jsonError(error);
  }
}
