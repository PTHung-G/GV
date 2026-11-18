import { NextResponse } from 'next/server';
import { requireUser } from './auth';
import { HttpError, jsonError, requireDatabase } from './http';
import type { BankEnvelope } from '@/lib/question-bank/types';
export async function bankUser(){requireDatabase();return requireUser();}
export async function bankBody(req:Request,ownerId:string):Promise<Record<string,unknown>>{
 const origin=req.headers.get('origin');
 if(origin){let host:string;try{host=new URL(origin).host;}catch{throw new HttpError(403,'Nguồn yêu cầu không hợp lệ.','invalid_origin');}if(host!==req.headers.get('host'))throw new HttpError(403,'Yêu cầu khác nguồn không được phép.','invalid_origin');}
 if(!req.headers.get('content-type')?.includes('application/json'))throw new HttpError(415,'Cần dữ liệu JSON.','invalid_content_type');
 const reader=req.body?.getReader();const chunks:Uint8Array[]=[];let bytes=0;
 if(reader){while(true){const next=await reader.read();if(next.done)break;bytes+=next.value.byteLength;if(bytes>12_000_000){await reader.cancel();throw new HttpError(413,'Dữ liệu gửi lên quá lớn.','request_too_large');}chunks.push(next.value);}}
 let body:Record<string,unknown>;
 try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new HttpError(400,'JSON không hợp lệ.','invalid_json');}
 if(!body||typeof body!=='object'||Array.isArray(body))throw new HttpError(400,'Dữ liệu không hợp lệ.','invalid_body');
 if(body.ownerId!==ownerId)throw new HttpError(409,'Tài khoản đã thay đổi. Vui lòng tải lại.','account_changed');
 return body;
}
export function bankResponse(envelope:BankEnvelope,extra:Record<string,unknown>={}){return NextResponse.json({...envelope,...extra},{headers:{'Cache-Control':'no-store'}});}
export {jsonError};
