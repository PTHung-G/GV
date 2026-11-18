import { bankUser, bankResponse, jsonError } from '@/lib/server/question-bank-http';
import { readBank } from '@/lib/server/question-bank-store';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){try{const user=await bankUser();return bankResponse(await readBank(user.id));}catch(e){return jsonError(e);}}
