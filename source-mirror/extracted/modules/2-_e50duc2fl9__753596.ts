// Reconstructed from 2-_e50duc2fl9.js, module 753596.
// deps: m715760
// exports: analyzeVersions, getDocumentTabs, saveDocumentTabs, transformVersions, versionCandidates
export { (e,r)=>(0,t.postJson)("/api/exam-versions/analyze",e,r) as "analyzeVersions" };
export { e=>(0,t.requestJson)("GET",`/api/documents/${encodeURIComponent(e)}/tabs`) as "getDocumentTabs" };
export { (e,r,n={})=>(0,t.requestJson)("PUT",`/api/documents/${encodeURIComponent(e)}/tabs`,r,n) as "saveDocumentTabs" };
export { r as "transformVersions" };
export { (e,r)=>(0,t.postJson)("/api/exam-versions/candidates",e,r) as "versionCandidates" };

"use strict";var t=m715760;async function r(e,n={}){return(0,t.postJsonStream)("/api/exam-versions/transform",e,{...n,onProgress:e=>n.onProgress?.(e.message),onEvent:(e,t)=>{"item"===e&&t&&"object"==typeof t&&n.onItem?.(t)}})}
