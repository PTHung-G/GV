import { test,expect,type APIRequestContext,type Page } from '@playwright/test';
import jsQR from 'jsqr';
import { signInWithDocuments } from './document-fixture';
import { examContentHash } from '../lib/exam-revision';
const content='<h1>Đề đã chốt</h1>'+[1,2].map(no=>`<p><b>Câu ${no}.</b> Tính ${no}+1</p><div class="doc-grid">${['A. 2','B. 3','C. 4','D. 5'].map(text=>`<div class="doc-grid-cell"><p>${text}</p></div>`).join('')}</div>`).join('');
const input=()=>({sourceExamId:'demo-de-giua-ky-toan-9',title:'Bộ mã API',content,answerKey:[{label:'Câu 1',answer:'A',points:'1'},{label:'Câu 2',answer:'B',points:'1'}],reviewed:true,codes:['101','102'],seed:'api-test-seed',shuffleQuestions:true,shuffleOptions:true});
async function publish(api:APIRequestContext){const response=await api.post('/api/exam-releases',{data:{input:input(),idempotencyKey:crypto.randomUUID()}});expect(response.ok(),await response.text()).toBe(true);return (await response.json()).release;}
async function sheetQr(page:Page,release:any,variant:any){
 const html=await (await page.request.get(`/api/exam-releases/${release.id}/print?kind=sheet&code=${variant.code}`)).text();
 const png=html.match(/src="(data:image\/png;base64,[^"]+)"/);expect(png).not.toBeNull();
 await page.goto('/');
 const pixels=await page.evaluate(async(src)=>{const img=new Image();img.src=src;await img.decode();const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;const ctx=canvas.getContext('2d')!;ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0);return {data:Array.from(ctx.getImageData(0,0,canvas.width,canvas.height).data),width:canvas.width,height:canvas.height};},png![1]);
 const qr=jsQR(new Uint8ClampedArray(pixels.data),pixels.width,pixels.height);expect(qr).not.toBeNull();return qr!.data;
}
test.beforeEach(async({page})=>{await signInWithDocuments(page);});
test('atomic concurrent publication, strict owner source/key validation and immutable reprints',async({page})=>{
 const api=page.request,key=crypto.randomUUID(),payload=input();
 const preview=await api.post('/api/exam-releases/preview',{data:payload});expect(preview.ok(),await preview.text()).toBe(true);expect((await preview.json()).variants).toHaveLength(2);
 const responses=await Promise.all([1,2,3].map(()=>api.post('/api/exam-releases',{data:{input:payload,idempotencyKey:key}})));for(const response of responses)expect(response.ok(),await response.text()).toBe(true);
 const releases=await Promise.all(responses.map(r=>r.json()));const release=releases[0].release;expect(new Set(releases.map(r=>r.release.id)).size).toBe(1);expect(new Set(release.variants.map((v:any)=>v.sessionId)).size).toBe(2);
 expect((await api.post('/api/exam-releases',{data:{input:{...payload,title:'Changed'},idempotencyKey:key}})).status()).toBe(409);
 for(const changed of [{sourceExamId:'someone-elses-source'},{reviewed:false},{sourceContentHash:examContentHash(content+'changed')},{codes:['101','101']}])expect((await api.post('/api/exam-releases',{data:{input:{...payload,...changed},idempotencyKey:crypto.randomUUID()}})).ok()).toBe(false);
 const listed=(await (await api.get('/api/exam-releases?sourceExamId='+payload.sourceExamId)).json()).releases;expect(listed).toHaveLength(1);
 const variant=release.variants[0];const url=`/api/exam-releases/${release.id}/print?kind=sheet&code=${variant.code}`;
 const before=await (await api.get(url)).text();expect(before).toContain('data:image/png;base64');await api.get(`/api/grading/sessions/${variant.sessionId}/sheet`);expect(await (await api.get(url)).text()).toBe(before);
 expect((await api.delete(`/api/grading/sessions/${variant.sessionId}`)).status()).toBe(409);
 const other=await page.context().browser()!.newContext();try{expect((await other.request.get(`/api/exam-releases/${release.id}`)).status()).toBe(401);expect((await other.request.get(url)).status()).toBe(401);}finally{await other.close();}
});
test('QR v2 resolves frozen variants and published scoring rejects identity bypass',async({page})=>{
 const api=page.request,release=await publish(api),variant=release.variants[0];
 // Authorized print includes a raster QR; direct resolver identity requires all secret tuple components.
 for(const qr of ['',JSON.stringify({v:1,sid:variant.sessionId}),JSON.stringify({v:2,sid:variant.sessionId,vid:variant.id,t:'guessed'})]){
  expect((await api.post(`/api/exam-releases/${release.id}/resolve`,{data:{qr}})).status()).toBe(409);
  expect((await api.post(`/api/grading/sessions/${variant.sessionId}/submissions`,{data:{qr,examCode:variant.code}})).status()).toBe(409);
 }
 expect((await (await api.get(`/api/grading/sessions/${variant.sessionId}/submissions`)).json()).submissions).toHaveLength(0);
});
test('release capture grant is separate, single-use and cannot reveal keys or cross releases',async({page})=>{
 const api=page.request,release=await publish(api),otherRelease=await publish(api);
 const pairing=await (await api.post(`/api/exam-releases/${release.id}/pairings`,{data:{}})).json();
 const phone=await page.context().browser()!.newContext();try{
  const claim=`/api/exam-releases/pairings/${pairing.code}/claim`;expect((await phone.request.post(claim,{data:{}})).ok()).toBe(true);expect((await phone.request.post(claim,{data:{}})).status()).toBe(410);
  const capture=(await (await phone.request.get('/api/exam-releases/capture')).json()).release;expect(capture.id).toBe(release.id);expect(JSON.stringify(capture)).not.toContain('rubric');
  expect((await phone.request.get(`/api/exam-releases/${release.id}`)).status()).toBe(401);
  expect((await phone.request.get(`/api/exam-releases/${release.id}/print?kind=key`)).status()).toBe(401);
  expect((await phone.request.post(`/api/grading/sessions/${otherRelease.variants[0].sessionId}/submissions`,{data:{}})).status()).toBe(403);
 }finally{await phone.close();}
});
