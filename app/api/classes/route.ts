/**
 * GET /api/classes — the teacher's saved classes, for reusing a roster.
 * GET /api/classes?classId=… — that class's students.
 */
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { jsonError, requireDatabase } from '@/lib/server/http';
import { listClasses, listStudents } from '@/lib/grading/sessions';

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
