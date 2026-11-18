import { chromium } from '@playwright/test';
import fs from 'node:fs';
import pg from 'pg';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
// Synthetic account only; never upload real exams or inspect unrelated rows.
const base='http://127.0.0.1:3210/soandethi';
const email=`bank-deploy-${crypto.randomUUID()}@example.test`;
const password=crypto.randomUUID();
let id;let browser;let pool;
try{
 const env=fs.readFileSync('.env.local','utf8');const match=env.match(/^DATABASE_URL=(.*)$/m);if(!match)throw Error('missing database');
 pool=new pg.Pool({connectionString:match[1].trim().replace(/^['"]|['"]$/g,'')});
 browser=await chromium.launch({headless:true});const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const reg=await context.request.post(base+'/api/auth/register',{data:{name:'Synthetic deployment verification',email,password},headers:{origin:'http://127.0.0.1:3210'}});if(reg.status()!==201)throw Error('registration status '+reg.status());id=(await reg.json()).user.id;
 const own=await pool.query('select id from users where id=$1 and email=$2',[id,email]);if(own.rowCount!==1)throw Error('database mismatch');
 const rawHtml='<p data-sdt-block="deploy-body">Câu 1. Tính $2+2$.</p>';
 const structure={version:1,blocks:[{id:'deploy-body'}],questions:[{id:'deploy-question',label:'Câu 1',bodyBlockIds:['deploy-body'],contextBlockIds:[]}]};
 const save=await context.request.post(base+'/api/question-bank/sources',{headers:{origin:'http://127.0.0.1:3210'},data:{ownerId:id,operationKey:crypto.randomUUID(),docId:'deploy-synthetic',title:'Nguồn kiểm tra triển khai',rawHtml,structure,blocks:[{start:0,end:rawHtml.length,html:rawHtml,text:'Câu 1. Tính $2+2$.'}]}});if(save.status()!==200)throw Error('save '+save.status());const saved=await save.json();
 await page.goto(base+'/question-bank');await page.getByRole('button',{name:/Nguồn đã lưu/}).click();await page.getByText('Nguồn kiểm tra triển khai',{exact:true}).click();await page.screenshot({path:'test-results-bank-deployed.png',fullPage:true});
 execFileSync('systemctl',['restart','soandethi.service']);
 for(let i=0;i<30;i++){try{const r=await context.request.get(base+'/api/question-bank');if(r.ok())break;}catch{}await new Promise(r=>setTimeout(r,100));}
 const after=await context.request.get(base+'/api/question-bank');if(!after.ok())throw Error('restart fetch');const bank=await after.json();const source=bank.bank.sources.find(s=>s.id===saved.sourceId);if(source?.rawHtml!==rawHtml||source.status!=='review'||source.extractionMode!=='native'||source.attempts!==0||source.candidates[0]?.id!=='deploy-question')throw Error('durability');
 await page.reload();await page.getByRole('heading',{name:'Kho câu hỏi',exact:true}).waitFor();if(errors.length)throw Error('browser errors '+errors.join(';'));
 console.log(JSON.stringify({subpath:base,page:'passed',sourceSave:'passed',serviceRestart:'passed',cookieAndSourcePersist:'passed',browserErrors:0,screenshot:'test-results-bank-deployed.png'}));
}finally{if(id&&email.startsWith('bank-deploy-'))await pool?.query('delete from users where id=$1 and email=$2',[id,email]);await browser?.close();await pool?.end();}
