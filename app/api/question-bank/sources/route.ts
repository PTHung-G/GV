import { bankUser, bankBody, bankResponse, jsonError } from '@/lib/server/question-bank-http';
import { saveSource } from '@/lib/server/question-bank-store';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:Request){try{const user=await bankUser();const body=await bankBody(req,user.id);const result=await saveSource(user.id,body);return bankResponse(result.envelope,{sourceId:result.value});}catch(e){return jsonError(e);}}
