import { NextResponse } from 'next/server';import { jsonError } from '@/lib/server/http';import { validateAuthRequest } from '@/lib/server/auth-input';import { claimReleasePairing } from '@/lib/exam-release/access';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:Request,{params}:{params:Promise<{code:string}>}){try{validateAuthRequest(req);return NextResponse.json(await claimReleasePairing((await params).code));}catch(e){return jsonError(e);}}
