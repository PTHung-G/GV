// Reconstructed from 0arlwmr2oo6mr.js, module 197293.
// deps: m775691, m715760
// exports: deleteLibraryDocument, fetchLibraryOriginal, getLibraryDocument, libraryStatuses, listLibrary, retryLibraryDocument, updateLibraryDocument, uploadLibrary
export { l as "deleteLibraryDocument" };
export { o as "fetchLibraryOriginal" };
export { s as "getLibraryDocument" };
export { a as "libraryStatuses" };
export { function(e){return(0,n.requestJson)("GET","/api/library?limit=500",void 0,{signal:e})} as "listLibrary" };
export { c as "retryLibraryDocument" };
export { r as "updateLibraryDocument" };
export { i as "uploadLibrary" };

"use strict";var t=m775691,n=m715760;async function a(e,t){return 0===e.length?[]:(await (0,n.requestJson)("GET",`/api/library/status?ids=${e.map(encodeURIComponent).join(",")}`,void 0,{signal:t})).documents}async function s(e,t){return(await (0,n.requestJson)("GET",`/api/library/${encodeURIComponent(e)}`,void 0,{signal:t})).document}async function i(e,t){let a=new FormData;for(let t of e)a.append("file",t,t.name);let s=await (0,n.postForm)("/api/library",a,{signal:t});return{document:s.document,duplicate:s.duplicate,estimate:s.estimate??{pages:0,points:0,known:!1}}}async function r(e,t){return(await (0,n.requestJson)("PATCH",`/api/library/${encodeURIComponent(e)}`,t)).document}async function l(e){await (0,n.requestJson)("DELETE",`/api/library/${encodeURIComponent(e)}`)}async function c(e){return(await (0,n.requestJson)("POST",`/api/library/${encodeURIComponent(e)}/retry`)).document}async function o(e,a=1,s){let i=await (0,t.sessionAccessToken)(n.API_BASE_URL),r=`/api/library/${encodeURIComponent(e)}/original?page=${a}`,l=await (0,n.fetchAuthed)(r,e=>({headers:e?{Authorization:`Bearer ${e}`}:void 0,cache:"no-store",signal:s}),i,!0);if(!l.ok){let e=await l.json().catch(()=>null);throw new n.ApiError(e?.error||"Chưa tải được bản gốc.",{status:l.status,code:e?.code})}return l.blob()}
