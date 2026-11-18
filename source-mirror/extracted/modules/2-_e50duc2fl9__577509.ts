// Reconstructed from 2-_e50duc2fl9.js, module 577509.
// deps: m456420, m715760
// exports: ClipboardCheck, requestAnswerKey
export { t as "ClipboardCheck" };
export { n as "requestAnswerKey" };

"use strict";let t=(0,m456420.default)("clipboard-check",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"m9 14 2 2 4-4",key:"df797q"}]]);;var r=m715760;async function n(e,t){let n=await (0,r.postJson)("/api/exam-answer-key",{exam:e},t);return{codes:n.codes?.length?n.codes:[{code:"",questions:n.questions??[]}],model:n.model}}
