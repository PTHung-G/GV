/**
 * GET /api/grading/sessions/[id] — one session with its frozen rubric.
 *
 * Returns 404 for a session owned by somebody else, so ids cannot be probed.
 */
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { HttpError, jsonError, requireDatabase } from '@/lib/server/http';
import { getSession } from '@/lib/grading/sessions';
import { lockSession } from '@/lib/grading/lifecycle';
import { withTransaction } from '@/lib/server/db';
import { deleteObject } from '@/lib/server/storage';
import { authorizeTeacher } from '@/lib/grading/access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const user = await requireUser();
    const { id } = await params;

    const session = await getSession(user.id, id);
    if (!session) throw new HttpError(404, 'Không tìm thấy đợt chấm.', 'session_not_found');

    return NextResponse.json({ success: true, session });
  } catch (error) {
    return jsonError(error);
  }
}

/**
 * DELETE /api/grading/sessions/[id] — remove a session and its photos.
 *
 * Rows go first (cascade), then the files: a failure leaves orphaned files
 * rather than database rows pointing at images that no longer exist.
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;
    await authorizeTeacher(id);

    const files = await withTransaction(async client => {
      await lockSession(client, id);
      const published=await client.query('select id from exam_release_variants where session_id=$1',[id]);
      if(published.rows.length)throw new HttpError(409,'Không thể xóa đợt chấm thuộc bộ mã đề đã chốt.','published_session_protected');
      const files = await client.query<{ storage_key: string }>(
        `select p.storage_key from page_assets p join submissions sub on sub.id = p.submission_id where sub.session_id = $1`, [id]);
      await client.query("insert into audit_events (actor_id, action, before_value) values ($1,'session.delete',jsonb_build_object('sessionId',$2::text))", [(await authorizeTeacher(id)).userId, id]);
      await client.query('delete from grading_sessions where id = $1', [id]);
      // Do not garbage-collect frozen snapshots/rubrics here: retention policy is separate.
      return files.rows;
    });

    await Promise.all(files.map((file) => deleteObject(file.storage_key).catch(() => undefined)));

    return NextResponse.json({ success: true, deletedFiles: files.length });
  } catch (error) {
    return jsonError(error);
  }
}
