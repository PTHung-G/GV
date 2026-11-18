import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { jsonError, readJson } from '@/lib/server/http';
import { validateAuthRequest } from '@/lib/server/auth-input';
import { validateRelease } from '@/lib/exam-release/server';
import type { ReleaseInput } from '@/lib/exam-release/types';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:Request){try{const user=await requireUser();validateAuthRequest(req);return NextResponse.json(await validateRelease(user.id,await readJson<ReleaseInput>(req)));}catch(e){return jsonError(e);}}
