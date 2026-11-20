import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { validateAuthRequest } from '@/lib/server/auth-input';
import { HttpError, jsonError, readJson, requireDatabase } from '@/lib/server/http';
import { deleteClassById, getClassDetail, updateClassMeta } from '@/lib/grading/sessions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    const user = await requireUser();
    const cls = await getClassDetail(user.id, (await params).id);
    if (!cls) throw new HttpError(404, 'Không tìm thấy lớp.', 'class_not_found');
    return NextResponse.json({ success: true, class: cls });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    validateAuthRequest(req);
    const user = await requireUser();
    const body = await readJson<{
      name?: string;
      subject?: string | null;
      grade?: number | null;
      academicYear?: string | null;
    }>(req);
    const cls = await updateClassMeta(user.id, (await params).id, body);
    return NextResponse.json({ success: true, class: cls });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    validateAuthRequest(req);
    const user = await requireUser();
    await deleteClassById(user.id, (await params).id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error);
  }
}
