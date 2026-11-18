// Reconstructed from 2-_e50duc2fl9.js, module 509742.
// deps: m939717
// exports: missingExamCodes, prepareAnswerKeys
export { function(e,r){return(0,t.examCodesInText)(r).filter(t=>!e.some(e=>e.code===t))} as "missingExamCodes" };
export { function(e,r="",n=""){let s=e.map(e=>({code:e.code.trim(),items:e.questions.map(e=>({...e,answer:(0,t.normalizeAnswer)(e.kind,e.answer)}))}));return 1!==s.length||s[0].code||(s[0].code=(0,t.examCodesInText)(r)[0]??n),s} as "prepareAnswerKeys" };

"use strict";var t=m939717;
