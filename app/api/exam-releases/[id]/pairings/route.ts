import { NextResponse } from 'next/server';import { jsonError } from '@/lib/server/http';import { validateAuthRequest } from '@/lib/server/auth-input';import { mintReleasePairing } from '@/lib/exam-release/access';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){try{validateAuthRequest(req);return NextResponse.json(await mintReleasePairing((await params).id));}catch(e){return jsonError(e);}}
