// Reconstructed from 2-_e50duc2fl9.js, module 799887.
// deps: m715760
// exports: claimMission, copyPublicExam, createDocument, deleteDocument, getDocument, getMetadataOptions, getMissions, getPublicExam, getPublicProfile, listDocuments, listPublicExams, listSubmissions, ocrQuestion, saveDocument, shareDocument, shareQuestion
export { (e,r)=>(0,t.requestJson)("POST",`/api/missions/${encodeURIComponent(e)}/claim`,r?{shareUrl:r}:void 0) as "claimMission" };
export { e=>(0,t.requestJson)("POST",`/api/public-exams/${encodeURIComponent(e)}/copy`) as "copyPublicExam" };
export { (e,r)=>(0,t.requestJson)("POST","/api/documents",{title:e,content:r}) as "createDocument" };
export { e=>(0,t.requestJson)("DELETE",`/api/documents/${encodeURIComponent(e)}`) as "deleteDocument" };
export { e=>(0,t.requestJson)("GET",`/api/documents/${encodeURIComponent(e)}`) as "getDocument" };
export { ()=>(0,t.requestJson)("GET","/api/community/options",void 0,{accessToken:null}) as "getMetadataOptions" };
export { ()=>(0,t.requestJson)("GET","/api/missions") as "getMissions" };
export { e=>(0,t.requestJson)("GET",`/api/public-exams/${encodeURIComponent(e)}`) as "getPublicExam" };
export { (e,r=24,n=0)=>(0,t.requestJson)("GET",`/api/users/${encodeURIComponent(e)}/profile?limit=${r}&offset=${n}`) as "getPublicProfile" };
export { (e=50,r=0)=>(0,t.requestJson)("GET",`/api/documents?limit=${e}&offset=${r}`) as "listDocuments" };
export { (e="",r=24,n=0,s={})=>{let i=new URLSearchParams({limit:String(r),offset:String(n),search:e});return s.subject&&i.set("subject",s.subject),s.grade&&i.set("grade",s.grade),(0,t.requestJson)("GET",`/api/public-exams?${i}`)} as "listPublicExams" };
export { (e={})=>{let r=new URLSearchParams({limit:String(e.limit??30)});return e.kind&&r.set("kind",e.kind),e.documentId&&r.set("documentId",e.documentId),(0,t.requestJson)("GET",`/api/community/submissions?${r}`)} as "listSubmissions" };
export { r as "ocrQuestion" };
export { (e,r,n,s={})=>(0,t.requestJson)("PUT",`/api/documents/${encodeURIComponent(e)}`,{title:r,content:n},s) as "saveDocument" };
export { (e,r)=>(0,t.requestJson)("POST",`/api/documents/${encodeURIComponent(e)}/share`,r) as "shareDocument" };
export { e=>(0,t.requestJson)("POST","/api/missions/share-question",e) as "shareQuestion" };

"use strict";var t=m715760;async function r(e){return(await (0,t.postJson)("/api/extract-exam",{images:e})).data.content.trim()}
