/**
 * GET /api/classes — the teacher's saved classes, for reusing a roster.
 * GET /api/classes?classId=… — that class's students.
 */
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { validateAuthRequest } from '@/lib/server/auth-input';
import { jsonError, readJson, requireDatabase } from '@/lib/server/http';
import { createClassWithStudents, listClasses, listStudents } from '@/lib/grading/sessions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    requireDatabase();
    const user = await requireUser();
    const classId = new URL(req.url).searchParams.get('classId');

    if (classId) {
      return NextResponse.json({ success: true, students: await listStudents(user.id, classId) });
    }

    return NextResponse.json({ success: true, classes: await listClasses(user.id) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    requireDatabase();
    validateAuthRequest(req);
    const user = await requireUser();
    const body = await readJson<{
      name: string;
      subject?: string | null;
      grade?: number | null;
      academicYear?: string | null;
      students?: Array<{ code?: string | null; name: string }>;
    }>(req);
    const cls = await createClassWithStudents(user.id, body);
    return NextResponse.json({ success: true, class: cls }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
