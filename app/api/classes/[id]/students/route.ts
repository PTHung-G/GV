import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { validateAuthRequest } from '@/lib/server/auth-input';
import { HttpError, jsonError, readJson, requireDatabase } from '@/lib/server/http';
import {
  addStudentsToClass,
  deleteStudentFromClass,
  updateStudentInClass,
} from '@/lib/grading/sessions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    validateAuthRequest(req);
    const user = await requireUser();
    const body = await readJson<{
      students: Array<{ code?: string | null; name: string }>;
      autoAssignSbd?: boolean;
    }>(req);
    const cls = await addStudentsToClass(user.id, (await params).id, body.students, Boolean(body.autoAssignSbd));
    return NextResponse.json({ success: true, class: cls }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireDatabase();
    validateAuthRequest(req);
    const user = await requireUser();
    const body = await readJson<{ studentId: string; code?: string | null; name?: string }>(req);
    if (!body.studentId) throw new HttpError(400, 'Thiếu mã học sinh.', 'invalid_student');
    const cls = await updateStudentInClass(user.id, (await params).id, body.studentId, body);
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
    const studentId =
      new URL(req.url).searchParams.get('studentId') ||
      (await readJson<{ studentId?: string }>(req).catch(() => ({} as { studentId?: string }))).studentId;
    if (!studentId) throw new HttpError(400, 'Thiếu mã học sinh.', 'invalid_student');
    const cls = await deleteStudentFromClass(user.id, (await params).id, studentId);
    return NextResponse.json({ success: true, class: cls });
  } catch (error) {
    return jsonError(error);
  }
}
