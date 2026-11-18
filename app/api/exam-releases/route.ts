import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { jsonError, readJson } from '@/lib/server/http';
import { validateAuthRequest } from '@/lib/server/auth-input';
import { listReleases, publishRelease } from '@/lib/exam-release/server';
import type { ReleaseInput } from '@/lib/exam-release/types';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(req:Request){try{const user=await requireUser();return NextResponse.json({releases:await listReleases(user.id,new URL(req.url).searchParams.get('sourceExamId')??undefined)});}catch(e){return jsonError(e);}}
export async function POST(req:Request){try{const user=await requireUser();validateAuthRequest(req);const body=await readJson<{input:ReleaseInput;idempotencyKey:string}>(req);return NextResponse.json({release:await publishRelease(user.id,body.input,body.idempotencyKey)},{status:201});}catch(e){return jsonError(e);}}
