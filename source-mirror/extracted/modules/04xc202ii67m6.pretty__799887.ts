// Reconstructed from 04xc202ii67m6.pretty.js, module 799887.
// deps: m715760
// exports: claimMission, copyPublicExam, createDocument, deleteDocument, getDocument, getMetadataOptions, getMissions, getPublicExam, getPublicProfile, listDocuments, listPublicExams, listSubmissions, ocrQuestion, saveDocument, shareDocument, shareQuestion
export { (e, n) => (0, t.requestJson)( "POST", `/api/missions/${encodeURIComponent(e)}/claim`, n ? { shareUrl: n } : void 0, ) as "claimMission" };
export { (e) => (0, t.requestJson)( "POST", `/api/public-exams/${encodeURIComponent(e)}/copy`, ) as "copyPublicExam" };
export { (e, n) => (0, t.requestJson)("POST", "/api/documents", { title: e, content: n }) as "createDocument" };
export { (e) => (0, t.requestJson)("DELETE", `/api/documents/${encodeURIComponent(e)}`) as "deleteDocument" };
export { (e) => (0, t.requestJson)("GET", `/api/documents/${encodeURIComponent(e)}`) as "getDocument" };
export { () => (0, t.requestJson)("GET", "/api/community/options", void 0, { accessToken: null, }) as "getMetadataOptions" };
export { () => (0, t.requestJson)("GET", "/api/missions") as "getMissions" };
export { (e) => (0, t.requestJson)("GET", `/api/public-exams/${encodeURIComponent(e)}`) as "getPublicExam" };
export { (e, n = 24, i = 0) => (0, t.requestJson)( "GET", `/api/users/${encodeURIComponent(e)}/profile?limit=${n}&offset=${i}`, ) as "getPublicProfile" };
export { (e = 50, n = 0) => (0, t.requestJson)("GET", `/api/documents?limit=${e}&offset=${n}`) as "listDocuments" };
export { (e = "", n = 24, i = 0, r = {}) => { let s = new URLSearchParams({ limit: String(n), offset: String(i), search: e, }); return ( r.subject && s.set("subject", r.subject), r.grade && s.set("grade", r.grade), (0, t.requestJson)("GET", `/api/public-exams?${s}`) ); } as "listPublicExams" };
export { (e = {}) => { let n = new URLSearchParams({ limit: String(e.limit ?? 30) }); return ( e.kind && n.set("kind", e.kind), e.documentId && n.set("documentId", e.documentId), (0, t.requestJson)("GET", `/api/community/submissions?${n}`) ); } as "listSubmissions" };
export { n as "ocrQuestion" };
export { (e, n, i, r = {}) => (0, t.requestJson)( "PUT", `/api/documents/${encodeURIComponent(e)}`, { title: n, content: i }, r, ) as "saveDocument" };
export { (e, n) => (0, t.requestJson)( "POST", `/api/documents/${encodeURIComponent(e)}/share`, n, ) as "shareDocument" };
export { (e) => (0, t.requestJson)("POST", "/api/missions/share-question", e) as "shareQuestion" };

"use strict";
    var t = m715760;
    async function n(e) {
      return (
        await (0, t.postJson)("/api/extract-exam", { images: e })
      ).data.content.trim();
    }
    ;
