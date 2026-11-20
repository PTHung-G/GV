/**
 * GET /api/grading/pages/[id] — serve one stored photo.
 *
 * Images never live under `public/`. This route resolves the page's session,
 * checks that the caller may see it, and only then reads the file. The response
 * is marked private so no shared cache keeps a copy.
 */
import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/server/db';
import { HttpError, jsonError, requireDatabase } from '@/lib/server/http';
import { getObject } from '@/lib/server/storage';
import { authorizeSession } from '@/lib/grading/access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;

    const row = await queryOne<{
      storage_key: string;
      mime_type: string;
      session_id: string;
      sub_status: string;
    }>(
      `select p.storage_key, p.mime_type, sub.session_id, sub.status as sub_status
         from page_assets p
         join submissions sub on sub.id = p.submission_id
        where p.id = $1`,
      [id],
    );
    if (!row) throw new HttpError(404, 'Không tìm thấy trang.', 'page_not_found');

    const actor = await authorizeSession(row.session_id);
    if (actor.via !== 'user' && row.sub_status !== 'draft') {
      throw new HttpError(403, 'Thao tác này cần đăng nhập trên máy tính.', 'teacher_only');
    }

    const buffer = await getObject(row.storage_key);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'content-type': row.mime_type,
        'content-length': String(buffer.byteLength),
        'cache-control': 'private, max-age=300',
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
