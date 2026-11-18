import { bankUser, bankBody, bankResponse, jsonError } from '@/lib/server/question-bank-http';
import { processBank } from '@/lib/server/question-bank-ai';
import { HttpError } from '@/lib/server/http';
export const runtime='nodejs';export const dynamic='force-dynamic';export const maxDuration=120;
export async function POST(req:Request){try{const user=await bankUser();const body=await bankBody(req,user.id);if(body.kind!=='extract'&&body.kind!=='organize')throw new HttpError(400,'Loại xử lý không hợp lệ.','invalid_kind');return bankResponse(await processBank(user.id,body.kind,typeof body.sourceId==='string'?body.sourceId:undefined,body.retry===true));}catch(e){return jsonError(e);}}
