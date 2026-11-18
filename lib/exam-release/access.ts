import { createHash, randomBytes } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import type { PoolClient } from 'pg';
import { currentUser } from '@/lib/server/auth';
import { queryOne, withTransaction } from '@/lib/server/db';
import { HttpError } from '@/lib/server/http';

export const RELEASE_COOKIE = 'sdt_release_capture';
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export async function releaseCapture() {
 const token = (await cookies()).get(RELEASE_COOKIE)?.value;
 if (!token) return null;
 return queryOne<{ release_id: string; owner_id: string; title: string }>(`select g.release_id,r.owner_id,r.title from release_capture_grants g join exam_releases r on r.id=g.release_id where token_hash=$1 and revoked_at is null and expires_at>now()`,[hash(token)]);
}
export async function authorizeRelease(id: string, teacherOnly = false) {
 const user = await currentUser();
 if (user) {
  const release = await queryOne<{owner_id:string}>('select owner_id from exam_releases where id=$1',[id]);
  if (release?.owner_id === user.id) return {userId:user.id,via:'user' as const};
 }
 if (!teacherOnly) { const grant=await releaseCapture(); if(grant?.release_id===id) return {userId:grant.owner_id,via:'release' as const}; }
 throw new HttpError(user?404:401,'Không có quyền truy cập bộ mã đề.','release_access_denied');
}
export async function releaseSessionGrant(sessionId:string) {
 const grant=await releaseCapture(); if(!grant)return null;
 const variant=await queryOne('select id from exam_release_variants where release_id=$1 and session_id=$2',[grant.release_id,sessionId]);
 if(!variant)throw new HttpError(403,'Thiết bị chỉ được chụp bộ mã đề đã ghép.','release_scope_denied');
 return {userId:grant.owner_id,via:'capture' as const};
}
export async function mintReleasePairing(id:string) {
 await authorizeRelease(id,true);const code=randomBytes(24).toString('base64url');
 const row=await queryOne<{expires_at:Date}>(`insert into release_capture_pairings(release_id,code_hash,expires_at) values($1,$2,now()+interval '10 minutes') returning expires_at`,[id,hash(code)]);
 return {code,expiresAt:row!.expires_at.toISOString()};
}
export async function claimReleasePairing(code:string) {
 if(!/^[A-Za-z0-9_-]{32}$/.test(code))throw new HttpError(404,'Mã ghép không hợp lệ.','pairing_not_found');
 const token=randomBytes(32).toString('base64url');
 const releaseId=await withTransaction(async client=>{
  const result=await client.query<{release_id:string}>(`update release_capture_pairings set consumed_at=now() where code_hash=$1 and consumed_at is null and expires_at>now() returning release_id`,[hash(code)]);
  if(!result.rows[0])throw new HttpError(410,'Mã ghép đã dùng hoặc hết hạn.','pairing_expired');
  await client.query(`insert into release_capture_grants(token_hash,release_id,expires_at) values($1,$2,now()+interval '2 hours')`,[hash(token),result.rows[0].release_id]);return result.rows[0].release_id;
 });
 const h=await headers();(await cookies()).set(RELEASE_COOKIE,token,{httpOnly:true,sameSite:'lax',secure:h.get('x-forwarded-proto')==='https',path:'/',maxAge:7200});
 return {releaseId};
}
export async function verifyPublishedIdentity(client:PoolClient,sessionId:string,qr:unknown) {
 const result=await client.query<{id:string;code:string;release_id:string;qr_token:string}>('select id,code,release_id,qr_token from exam_release_variants where session_id=$1',[sessionId]);
 const variant=result.rows[0];if(!variant)return null;
 let value: {v?:unknown;sid?:unknown;vid?:unknown;t?:unknown}={};
 try { if(typeof qr==='string' && qr.length<2000)value=JSON.parse(qr); }catch{}
 if(value.v!==2||value.sid!==sessionId||value.vid!==variant.id||typeof value.t!=='string'||hash(value.t)!==hash(variant.qr_token))throw new HttpError(409,'Phiếu thiếu hoặc sai QR mã đề đã chốt. Hãy chụp lại đúng phiếu.','published_identity_mismatch');
 return variant;
}
export async function assertPublishedProvenance(client:PoolClient,sessionId:string,submissionId:string) {
 const result=await client.query(`select v.id from exam_release_variants v left join submissions s on s.session_id=v.session_id and s.id=$2 where v.session_id=$1 and (s.published_variant_id is distinct from v.id or s.published_identity_verified_at is null)`,[sessionId,submissionId]);
 if(result.rows.length)throw new HttpError(409,'Bài chưa xác minh QR mã đề. Không thể chấm.','published_identity_required');
}
export async function assertBundleStudentUnique(client:PoolClient,sessionId:string,submissionId:string) {
 const result=await client.query(`select s.student_id,s.student_code,v.release_id from submissions s join exam_release_variants v on v.session_id=s.session_id where s.id=$1 and s.session_id=$2`,[submissionId,sessionId]);
 const row=result.rows[0];if(!row)return;
 await client.query('select id from exam_releases where id=$1 for update',[row.release_id]);
 const duplicate=await client.query(`select s.id from submissions s join exam_release_variants v on v.session_id=s.session_id where v.release_id=$1 and s.id<>$2 and s.status<>'absent' and (($3::uuid is not null and s.student_id=$3) or ($4::text is not null and lower(s.student_code)=lower($4)))`,[row.release_id,submissionId,row.student_id,row.student_code]);
 if(duplicate.rows.length)throw new HttpError(409,'Học sinh có bài khác trong bộ mã đề. Cần rà soát và xử lý bài trùng trước khi xác nhận.','duplicate_release_student');
}
