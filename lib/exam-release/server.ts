import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { PoolClient } from 'pg';
import { query, queryOne, withTransaction } from '@/lib/server/db';
import { HttpError } from '@/lib/server/http';
import { basePath } from '@/lib/api-url';
import { examContentHash } from '@/lib/exam-revision';
import { buildReleaseVariants } from './engine';
import type { ReleaseInput, ReleaseBuild } from './types';
import { normalizeRubric, rubricTotals, rubricMode } from '@/lib/grading/rubric';
import type { Rubric } from '@/lib/grading/rubric';
import { buildSheetTemplate, renderSheetHtml, type SheetTemplate } from '@/lib/grading/sheet-template';
import { authorizeRelease, verifyPublishedIdentity } from './access';
import { releaseArtifact, escapeHtml } from './render-server';
const sha=(value:string)=>createHash('sha256').update(value).digest('hex');
const canonical=(value:unknown):string=>JSON.stringify(value,(_key,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.keys(item).sort().map(key=>[key,item[key]])):item);
export type ReleaseVariantDetail={id:string;code:string;sessionId:string;mapping:ReleaseBuild['variants'][number]['mapping'];rubric:Rubric;template:SheetTemplate;printUrls:{exam:string;key:string;sheet:string}};
export type ReleaseDetail={id:string;title:string;sourceExamId:string;classId?:string|null;className?:string|null;createdAt:string;warnings:string[];variants:ReleaseVariantDetail[]};
export async function validateRelease(ownerId:string,input:ReleaseInput,client?:PoolClient):Promise<ReleaseBuild> {
 if(!input||typeof input!=='object'||typeof input.sourceExamId!=='string'||typeof input.title!=='string'||!input.title.trim()||input.title.length>300||typeof input.content!=='string'||input.content.length>160000||input.reviewed!==true||!Array.isArray(input.answerKey)||input.answerKey.length<1||input.answerKey.length>200)throw new HttpError(400,'Cần đề đầy đủ và đáp án có cấu trúc đã rà soát.','invalid_release');
 const one=async<T extends import('pg').QueryResultRow>(sql:string,args:unknown[])=>client?(await client.query<T>(sql,args as never[])).rows[0]??null:queryOne<T>(sql,args);
 const relDoc=await one<{id:string}>("select id from documents where owner_id=$1 and id=$2 and kind<>'answer-key' limit 1",[ownerId,input.sourceExamId]);
 if(!relDoc){
  const library=await one<{documents:Array<{id:string;kind?:string}>}>('select documents from document_libraries where owner_id=$1',[ownerId]);
  if(!library?.documents.some(doc=>doc.id===input.sourceExamId&&doc.kind!=='answer-key'))throw new HttpError(404,'Không tìm thấy đề nguồn thuộc tài khoản.','source_not_found');
 }
 if(input.sourceContentHash&&input.sourceContentHash!==examContentHash(input.content))throw new HttpError(409,'Đáp án không khớp bản đề đang chốt. Hãy rà soát và cập nhật đáp án.','stale_answer_key');
 try {return buildReleaseVariants(input);}catch(error){throw new HttpError(422,(error as Error).message,'invalid_release_structure');}
}
export async function getRelease(ownerId:string,id:string):Promise<ReleaseDetail|null> {
 const row=await queryOne<{id:string;title:string;source_exam_id:string;class_id:string|null;class_name:string|null;created_at:Date;warnings:string[]}>('select * from exam_releases where id=$1 and owner_id=$2',[id,ownerId]);if(!row)return null;
 const variants=await query<{id:string;code:string;session_id:string;mapping:ReleaseVariantDetail['mapping'];rubric:Rubric;template:SheetTemplate}>('select id,code,session_id,mapping,rubric,template from exam_release_variants where release_id=$1 order by code',[id]);
 return {id:row.id,title:row.title,sourceExamId:row.source_exam_id,classId:row.class_id,className:row.class_name,createdAt:row.created_at.toISOString(),warnings:row.warnings,variants:variants.map(v=>({id:v.id,code:v.code,sessionId:v.session_id,mapping:v.mapping,rubric:v.rubric,template:v.template,printUrls:Object.fromEntries(['exam','key','sheet'].map(kind=>[kind,basePath(`/api/exam-releases/${id}/print?kind=${kind}&code=${encodeURIComponent(v.code)}`)])) as ReleaseVariantDetail['printUrls']}))};
}
export async function listReleases(ownerId:string,sourceExamId?:string) {
 const rows=await query<{id:string;title:string;source_exam_id:string;class_id:string|null;class_name:string|null;created_at:Date;variant_count:number}>('select r.id,r.title,r.source_exam_id,r.class_id,r.class_name,r.created_at,(select count(*)::int from exam_release_variants v where v.release_id=r.id) variant_count from exam_releases r where owner_id=$1 and ($2::text is null or source_exam_id=$2) order by created_at desc',[ownerId,sourceExamId??null]);
 return rows.map(r=>({id:r.id,title:r.title,sourceExamId:r.source_exam_id,classId:r.class_id,className:r.class_name,createdAt:r.created_at.toISOString(),variantCount:r.variant_count}));
}
export async function publishRelease(ownerId:string,input:ReleaseInput,idempotencyKey:string) {
 if(typeof idempotencyKey!=='string'||!/^[A-Za-z0-9_-]{8,128}$/.test(idempotencyKey))throw new HttpError(400,'Thiếu khóa chống tạo trùng hợp lệ.','invalid_idempotency_key');
 const requestHash=sha(canonical(input));
 const id=await withTransaction(async client=>{
  await client.query('select pg_advisory_xact_lock(hashtextextended($1,0))',[`${ownerId}:${idempotencyKey}`]);
  const previous=await client.query<{id:string;request_sha256:string}>('select id,request_sha256 from exam_releases where owner_id=$1 and idempotency_key=$2',[ownerId,idempotencyKey]);
  if(previous.rows[0]){if(previous.rows[0].request_sha256!==requestHash)throw new HttpError(409,'Khóa xuất đã dùng cho nội dung khác.','idempotency_conflict');return previous.rows[0].id;}
  let classId:string|null=null;
  let className:string|null=null;
  let classStudents:Array<{code:string|null;name:string}>=[];
  if(input.classId){
   const cls=await client.query<{id:string;name:string}>('select id,name from classes where id=$1 and owner_id=$2',[input.classId,ownerId]);
   if(!cls.rows[0])throw new HttpError(404,'Không tìm thấy lớp thuộc tài khoản.','class_not_found');
   classId=cls.rows[0].id;
   className=cls.rows[0].name;
   const sts=await client.query<{code:string|null;name:string}>('select code,name from students where class_id=$1 order by sort_index,name',[classId]);
   classStudents=sts.rows;
  }
  const build=await validateRelease(ownerId,input,client);const releaseId=randomUUID();
  await client.query('insert into exam_releases(id,owner_id,source_exam_id,class_id,class_name,title,source_sha256,input,warnings,idempotency_key,request_sha256) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[releaseId,ownerId,input.sourceExamId,classId,className,input.title.trim(),sha(input.content),JSON.stringify(input),JSON.stringify(build.warnings),idempotencyKey,requestHash]);
  for(const variant of build.variants){
   const variantId=randomUUID(),sessionId=randomUUID(),snapshotId=randomUUID(),rubricId=randomUUID(),token=randomBytes(32).toString('base64url');
   const rubric=normalizeRubric(variant.rubric);const totals=rubricTotals(rubric);
   const mcCount=rubric.questions.filter(q=>q.type==='mc').length;if(mcCount>60)throw new HttpError(422,'Phiếu hỗ trợ tối đa 60 câu A–D.','too_many_mc');
   const examHtml=releaseArtifact(input.title,variant.code,releaseId,variant.examHtml);
   const keyBody='<h1>HƯỚNG DẪN CHẤM VÀ THANG ĐIỂM</h1><table><thead><tr><th>Câu</th><th>Đáp án / hướng dẫn</th><th>Điểm</th></tr></thead><tbody>'+variant.answerKey.map(q=>`<tr><td>${escapeHtml(q.label)}</td><td>${escapeHtml(q.answer)}${(q.steps??[]).map(step=>`<p>${escapeHtml(step.text)} <b>${escapeHtml(step.points??'')}</b></p>`).join('')}</td><td>${escapeHtml(q.points??'')}</td></tr>`).join('')+'</tbody></table>';
   const keyHtml=releaseArtifact(input.title,variant.code,releaseId,keyBody);
   const options={title:input.title,examCode:variant.code,className,sessionId,publishedIdentity:{variantId,token},...(classStudents.length?{students:classStudents}:{}),note:`Bộ in ${releaseId}. Mã đề ${variant.code}. Không dùng phiếu của mã khác.`};
   const template=buildSheetTemplate(rubric,options);const sheetHtml=await renderSheetHtml(rubric,options);
   await client.query('insert into exam_snapshots(id,owner_id,title,exam_html,answer_key_html,source_exam_id) values($1,$2,$3,$4,$5,$6)',[snapshotId,ownerId,input.title,examHtml,keyHtml,input.sourceExamId]);
   await client.query('insert into rubric_revisions(id,snapshot_id,total_points,mc_points,essay_points,payload) values($1,$2,$3,$4,$5,$6)',[rubricId,snapshotId,totals.total,totals.mc,totals.essay,JSON.stringify(rubric)]);
   await client.query("insert into grading_sessions(id,owner_id,snapshot_id,rubric_revision_id,release_id,class_id,class_name,title,mode,sheet_mode,sheet_template) values($1,$2,$3,$4,$5,$6,$7,$8,$9,'template',$10)",[sessionId,ownerId,snapshotId,rubricId,releaseId,classId,className,`${input.title} · Mã ${variant.code}`,rubricMode(rubric),JSON.stringify(template)]);
   await client.query('insert into exam_release_variants(id,release_id,code,session_id,snapshot_id,rubric_revision_id,qr_token,exam_html,key_html,sheet_html,template,template_sha256,rubric,mapping) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',[variantId,releaseId,variant.code,sessionId,snapshotId,rubricId,token,examHtml,keyHtml,sheetHtml,JSON.stringify(template),sha(canonical(template)),JSON.stringify(rubric),JSON.stringify(variant.mapping)]);
  }
  return releaseId;
 });return (await getRelease(ownerId,id))!;
}
export async function resolveRelease(id:string,qr:string) {
 await authorizeRelease(id);let parsed:{sid?:unknown}={};try{parsed=JSON.parse(qr);}catch{}
 if(typeof parsed.sid!=='string'||!/^[-a-f0-9]{36}$/i.test(parsed.sid))throw new HttpError(409,'QR không hợp lệ.','published_identity_mismatch');
 return withTransaction(async client=>{
  const v=await verifyPublishedIdentity(client,parsed.sid as string,qr);if(!v||v.release_id!==id)throw new HttpError(409,'Phiếu không thuộc bộ mã đề này.','wrong_release');
  const row=await client.query<{template:SheetTemplate}>('select template from exam_release_variants where id=$1',[v.id]);
  return {sessionId:parsed.sid,variantId:v.id,code:v.code,template:row.rows[0].template};
 });
}
export async function printRelease(ownerId:string,id:string,kind:string,code:string|null) {
 if(!['exam','key','sheet'].includes(kind))throw new HttpError(400,'Loại bản in không hợp lệ.','invalid_print_kind');
 const rows=await query<{html:string}>(`select v.${kind==='exam'?'exam_html':kind==='key'?'key_html':'sheet_html'} as html from exam_release_variants v join exam_releases r on r.id=v.release_id where r.id=$1 and r.owner_id=$2 and ($3::text is null or v.code=$3) order by v.code`,[id,ownerId,code]);
 if(!rows.length)throw new HttpError(404,'Không tìm thấy bản in.','release_not_found');
 if(rows.length===1)return rows[0].html;
 return rows.map((row,index)=>index===0?row.html.replace('</body></html>',''):row.html.replace(/^[\s\S]*?<body>/,'<div style="break-before:page"></div>').replace('</body></html>','')).join('')+'</body></html>';
}

export async function assignReleaseClass(
 ownerId: string,
 releaseId: string,
 classId: string | null,
): Promise<ReleaseDetail> {
 await withTransaction(async (client) => {
  const rel = await client.query<{ id: string }>(
   'select id from exam_releases where id = $1 and owner_id = $2',
   [releaseId, ownerId],
  );
  if (!rel.rows[0]) throw new HttpError(404, 'Không tìm thấy bộ mã đề.', 'release_not_found');
  let className: string | null = null;
  if (classId) {
   const cls = await client.query<{ id: string; name: string }>(
    'select id, name from classes where id = $1 and owner_id = $2',
    [classId, ownerId],
   );
   if (!cls.rows[0]) throw new HttpError(404, 'Không tìm thấy lớp thuộc tài khoản.', 'class_not_found');
   className = cls.rows[0].name;
  }
  await client.query(
   'update exam_releases set class_id = $2, class_name = $3 where id = $1 and owner_id = $4',
   [releaseId, classId, className, ownerId],
  );
  await client.query(
   `update grading_sessions
       set class_id = $2, class_name = $3
     where owner_id = $4 and id in (select session_id from exam_release_variants where release_id = $1)`,
   [releaseId, classId, className, ownerId],
  );
 });
 return (await getRelease(ownerId, releaseId))!;
}

export type ReleaseGradebookRow = {
 studentId: string | null;
 studentCode: string | null;
 studentName: string;
 identityStatus: string;
 examCode: string | null;
 sessionId: string | null;
 submissionId: string | null;
 mcScore: number | null;
 essayScore: number | null;
 totalScore: number | null;
 status: string;
};

export async function getReleaseGradebook(ownerId: string, releaseId: string) {
 const rel = await queryOne<{
  id: string;
  title: string;
  class_id: string | null;
  class_name: string | null;
 }>(
  'select id, title, class_id, class_name from exam_releases where id = $1 and owner_id = $2',
  [releaseId, ownerId],
 );
 if (!rel) throw new HttpError(404, 'Không tìm thấy bộ mã đề.', 'release_not_found');

 const variants = await query<{ code: string; session_id: string }>(
  'select code, session_id from exam_release_variants where release_id = $1 order by code',
  [releaseId],
 );
 const sessionIds = variants.map((v) => v.session_id);
 const codeBySession = new Map(variants.map((v) => [v.session_id, v.code]));

 const subs = sessionIds.length
  ? await query<{
     id: string;
     session_id: string;
     student_id: string | null;
     student_code: string | null;
     student_name: string | null;
     identity_status: string;
     label: string | null;
     exam_code: string | null;
     mc_score: string | null;
     essay_score: string | null;
     total_score: string | null;
     status: string;
    }>(
     `select id, session_id, student_id, student_code, student_name, identity_status,
             label, exam_code, mc_score, essay_score, total_score, status
        from submissions
       where session_id = any($1::uuid[])
       order by created_at asc`,
     [sessionIds],
    )
  : [];

 const roster = rel.class_id
  ? await query<{ id: string; code: string | null; name: string; sort_index: number }>(
     'select id, code, name, sort_index from students where class_id = $1 order by sort_index, name',
     [rel.class_id],
    )
  : [];

 const subByStudentId = new Map<string, (typeof subs)[number]>();
 const unmappedSubs: Array<(typeof subs)[number]> = [];
 for (const sub of subs) {
  if (sub.student_id && roster.some((r) => r.id === sub.student_id)) {
   subByStudentId.set(sub.student_id, sub);
  } else {
   unmappedSubs.push(sub);
  }
 }

 const rows: ReleaseGradebookRow[] = [];
 for (const st of roster) {
  const sub = subByStudentId.get(st.id);
  rows.push({
   studentId: st.id,
   studentCode: st.code,
   studentName: st.name,
   identityStatus: sub ? sub.identity_status : 'verified',
   examCode: sub ? (sub.exam_code ?? codeBySession.get(sub.session_id) ?? null) : null,
   sessionId: sub?.session_id ?? null,
   submissionId: sub?.id ?? null,
   mcScore: sub?.mc_score === null || sub?.mc_score === undefined ? null : Number(sub.mc_score),
   essayScore: sub?.essay_score === null || sub?.essay_score === undefined ? null : Number(sub.essay_score),
   totalScore: sub?.total_score === null || sub?.total_score === undefined ? null : Number(sub.total_score),
   status: sub ? sub.status : 'missing',
  });
 }

 for (const sub of unmappedSubs) {
  rows.push({
   studentId: sub.student_id,
   studentCode: sub.student_code,
   studentName: sub.student_name || sub.label || 'Bài chưa gán',
   identityStatus: sub.identity_status,
   examCode: sub.exam_code ?? codeBySession.get(sub.session_id) ?? null,
   sessionId: sub.session_id,
   submissionId: sub.id,
   mcScore: sub.mc_score === null || sub.mc_score === undefined ? null : Number(sub.mc_score),
   essayScore: sub.essay_score === null || sub.essay_score === undefined ? null : Number(sub.essay_score),
   totalScore: sub.total_score === null || sub.total_score === undefined ? null : Number(sub.total_score),
   status: sub.status,
  });
 }

 const totals = rows.map((r) => r.totalScore).filter((v): v is number => v !== null && Number.isFinite(v));
 const stats = {
  totalRows: rows.length,
  submitted: rows.filter((r) => r.submissionId !== null).length,
  confirmed: rows.filter((r) => r.status === 'confirmed').length,
  average: totals.length ? Math.round((totals.reduce((a, b) => a + b, 0) / totals.length) * 100) / 100 : null,
  highest: totals.length ? Math.max(...totals) : null,
  lowest: totals.length ? Math.min(...totals) : null,
 };

 const fmtNum = (n: number | null) => (n === null ? '' : n.toFixed(2).replace(/\.?0+$/, '').replace('.', ','));
 const esc = (s: string) => {
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[;"\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
 };
 const header = ['STT', 'SBD', 'Họ và tên', 'Mã đề', 'Điểm TN', 'Điểm TL', 'Tổng điểm', 'Trạng thái'];
 const csvLines = [
  header.join(';'),
  ...rows.map((r, idx) =>
   [
    String(idx + 1),
    esc(r.studentCode ?? ''),
    esc(r.studentName),
    esc(r.examCode ?? ''),
    fmtNum(r.mcScore),
    fmtNum(r.essayScore),
    fmtNum(r.totalScore),
    esc(r.status === 'confirmed' ? 'Đã duyệt' : r.status === 'missing' ? 'Chưa có bài' : r.status === 'needs-review' ? 'Cần xem lại' : r.status),
   ].join(';'),
  ),
 ];
 const csv = `\uFEFF${csvLines.join('\r\n')}\r\n`;

 return {
  release: { id: rel.id, title: rel.title, classId: rel.class_id, className: rel.class_name },
  rows,
  stats,
  csv,
 };
}
