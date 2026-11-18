import { NextResponse } from 'next/server';import { jsonError,readJson } from '@/lib/server/http';import { validateAuthRequest } from '@/lib/server/auth-input';import { resolveRelease } from '@/lib/exam-release/server';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){try{validateAuthRequest(req);const body=await readJson<{qr:string}>(req);return NextResponse.json(await resolveRelease((await params).id,body.qr));}catch(e){return jsonError(e);}}
