import { createHash, randomUUID } from 'node:crypto';
import { queryOne, withTransaction } from './db';
import { HttpError } from './http';
import { BANK_LIMITS, emptyBank, type BankEnvelope, type BankState, type BankSource, type SourceBlock } from '@/lib/question-bank/types';
import { validateBlocks, validateTree } from '@/lib/question-bank/validation';
import { nativeCandidates, validateStructure } from '@/lib/structured-exam';

export async function readBank(ownerId: string): Promise<BankEnvelope> {
 const row = await queryOne<{revision:string;state:BankState}>('select revision,state from question_banks where owner_id=$1',[ownerId]);
 return {ownerId,revision:Number(row?.revision??0),bank:row?.state??emptyBank()};
}
export async function mutateBank<T>(ownerId:string,fn:(bank:BankState,revision:number)=>T,admitWork=false):Promise<{value:T;envelope:BankEnvelope}> {
 return withTransaction(async client=>{
  if(admitWork){
   await client.query('select pg_advisory_xact_lock(72319012)');
   const active=await client.query(`select count(*)::int as total from question_banks b where
    coalesce((b.state->'organization'->'lease'->>'until')::bigint,0)>$1
    or exists(select 1 from jsonb_array_elements(b.state->'sources') s where coalesce((s->'lease'->>'until')::bigint,0)>$1)`,[Date.now()]);
   if(active.rows[0].total>=2)throw new HttpError(409,'Dịch vụ đang xử lý đủ 2 kho đồng thời. Hãy thử lại sau.','service_busy');
  }
  await client.query('insert into question_banks(owner_id,state) values($1,$2::jsonb) on conflict do nothing',[ownerId,JSON.stringify(emptyBank())]);
  const {rows}=await client.query('select revision,state from question_banks where owner_id=$1 for update',[ownerId]);
  const bank=rows[0].state as BankState; const revision=Number(rows[0].revision);
  const value=fn(bank,revision);
  validateTree(bank.nodes,bank.questions);
  if(JSON.stringify(bank).length>24_000_000) throw new HttpError(413,'Kho câu hỏi vượt giới hạn dung lượng 24 MB.','bank_too_large');
  await client.query('update question_banks set state=$2::jsonb,revision=revision+1,updated_at=now() where owner_id=$1',[ownerId,JSON.stringify(bank)]);
  return {value,envelope:{ownerId,revision:revision+1,bank}};
 });
}
function required(value:unknown,max:number,name:string):string {
 if(typeof value!=='string'||!value.trim()||value.length>max)throw new HttpError(400,`${name} không hợp lệ.`,'invalid_source');
 return value;
}
export async function saveSource(ownerId:string,input:Record<string,unknown>) {
 const rawHtml=required(input.rawHtml,BANK_LIMITS.sourceChars,'Nội dung');
 const operationKey=required(input.operationKey,100,'Mã thao tác');
 const docId=required(input.docId,200,'Đề nguồn'); const title=required(input.title,500,'Tên đề');
 if(!Array.isArray(input.blocks))throw new HttpError(400,'Thiếu khối nguồn.','invalid_blocks');
 const blocks=input.blocks as SourceBlock[]; validateBlocks(rawHtml,blocks);
 let structure: ReturnType<typeof validateStructure> | undefined;
 let candidates: ReturnType<typeof nativeCandidates> = [];
 if(input.structure!==undefined){
  try{structure=validateStructure(input.structure);candidates=nativeCandidates(rawHtml,blocks,structure);}
  catch{throw new HttpError(400,'Cấu trúc câu hỏi không khớp nguồn hiện tại. Nội dung chưa bị thay đổi.','invalid_structure');}
 }
 const hash=createHash('sha256').update(rawHtml).digest('hex');
 const payloadHash=createHash('sha256').update(JSON.stringify({docId,title,rawHtml,blocks,answerKey:input.answerKey??null,...(structure?{structure}:{})})).digest('hex');
 return mutateBank(ownerId,bank=>{
  const old=bank.sources.find(s=>s.operationKey===operationKey);
  if(old){if(old.hash!==hash||old.docId!==docId||old.payloadHash!==payloadHash)throw new HttpError(409,'Mã thao tác đã dùng cho nội dung khác.','operation_conflict');return old.id;}
  if(bank.sources.length>=BANK_LIMITS.sources)throw new HttpError(413,'Kho đạt giới hạn 200 nguồn đã chốt.','source_limit');
  const source:BankSource={id:randomUUID(),operationKey,payloadHash,docId,title,rawHtml,hash,blocks,createdAt:new Date().toISOString(),status:structure?'review':'pending',candidates,previewVersion:randomUUID(),confirmedIds:[],attempts:0,answerKey:null,extractionMode:structure?'native':'ai',...(structure?{structure}:{})};
  // Preserve explicit accompanying answer-key snapshot without guessing question mapping.
  const key=input.answerKey as Record<string,unknown>|undefined;
  if(key&&typeof key.content==='string'&&key.content.length<=BANK_LIMITS.sourceChars&&Array.isArray(key.questions))source.answerKey={content:key.content,questions:key.questions};
  bank.sources.push(source);return source.id;
 });
}
export async function confirmSource(ownerId:string,input:Record<string,unknown>) {
 return mutateBank(ownerId,bank=>{
  const source=bank.sources.find(s=>s.id===input.sourceId);
  if(!source)throw new HttpError(404,'Không tìm thấy nguồn.','source_not_found');
  if(source.previewVersion!==input.previewVersion)throw new HttpError(409,'Bản xem trước đã thay đổi. Hãy xem lại.','preview_changed');
  if(!['review','complete'].includes(source.status))throw new HttpError(409,'Nguồn chưa sẵn sàng để xác nhận.','source_not_ready');
  if(!Array.isArray(input.candidateIds)||!input.candidateIds.length||input.candidateIds.some(id=>typeof id!=='string'||!source.candidates.some(c=>c.id===id)))throw new HttpError(400,'Hãy chọn nội dung hợp lệ.','invalid_selection');
  const ids=[...new Set(input.candidateIds as string[])];
  const fresh=ids.filter(id=>!source.confirmedIds.includes(id));
  if(bank.questions.length+fresh.length>BANK_LIMITS.questions)throw new HttpError(413,'Kho đạt giới hạn 2.000 câu hỏi.','question_limit');
  for(const id of fresh){const c=source.candidates.find(c=>c.id===id)!;bank.questions.push({id:randomUUID(),sourceId:source.id,candidateId:id,label:c.label,bodyBlockIds:c.bodyBlockIds,contextBlockIds:c.contextBlockIds,topicId:'root',createdAt:new Date().toISOString(),answer:null,rubric:null,points:null});}
  source.confirmedIds.push(...fresh);source.status='complete';
  if(fresh.length)bank.organization={status:'pending',attempts:0};
  return source.id;
 });
}
