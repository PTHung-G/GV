import { NextResponse } from 'next/server';
import { bankUser, jsonError } from '@/lib/server/question-bank-http';
import { readBank } from '@/lib/server/question-bank-store';
import { HttpError } from '@/lib/server/http';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){try{const user=await bankUser();const {id}=await params;const {bank}=await readBank(user.id);const source=bank.sources.find(s=>s.id===id);if(!source)throw new HttpError(404,'Không tìm thấy nguồn.','source_not_found');return NextResponse.json({ownerId:user.id,source},{headers:{'Cache-Control':'no-store'}});}catch(e){return jsonError(e);}}
