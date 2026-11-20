import { NextResponse } from 'next/server';
import { bankUser, jsonError } from '@/lib/server/question-bank-http';
import { assembleExamFromBank } from '@/lib/server/question-bank-store';
import { validateAuthRequest } from '@/lib/server/auth-input';
import { readJson } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    validateAuthRequest(req);
    const user = await bankUser();
    const body = await readJson<{
      title: string;
      subject?: string;
      grade?: number | null;
      questionIds: string[];
    }>(req);
    const result = await assembleExamFromBank(user.id, body);
    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (e) {
    return jsonError(e);
  }
}
