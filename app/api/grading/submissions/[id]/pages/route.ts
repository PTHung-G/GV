/**
 * POST /api/grading/submissions/[id]/pages — upload one photo of a paper.
 *
 * Accepts multipart form data with a `file` field. The declared content type is
 * ignored: the bytes are sniffed, so a renamed file cannot smuggle a non-image
 * into private storage.
 */
import { NextResponse } from 'next/server';
import { HttpError, jsonError, requireDatabase } from '@/lib/server/http';
import { authorizeSession } from '@/lib/grading/access';
import { addPage, MAX_PAGE_BYTES } from '@/lib/grading/submissions';
import { queryOne } from '@/lib/server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const { id } = await params;

    const owner = await queryOne<{ session_id: string }>(
      `select session_id from submissions where id = $1`,
      [id],
    );
    if (!owner) throw new HttpError(404, 'Không tìm thấy bài làm.', 'submission_not_found');
    await authorizeSession(owner.session_id);

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      throw new HttpError(400, 'Không đọc được dữ liệu tải lên.', 'invalid_form_data');
    }

    const file = form.get('file');
    if (!(file instanceof File)) {
      throw new HttpError(400, 'Thiếu tệp ảnh.', 'missing_file');
    }
    if (file.size > MAX_PAGE_BYTES) {
      throw new HttpError(
        413,
        `Ảnh vượt quá ${Math.round(MAX_PAGE_BYTES / 1024 / 1024)}MB.`,
        'file_too_large',
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await addPage(owner.session_id, id, buffer);

    return NextResponse.json(
      { success: true, page: result.page, duplicate: result.duplicate, warnings: result.warnings },
      { status: 201 },
    );
  } catch (error) {
    return jsonError(error);
  }
}
