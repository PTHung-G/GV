// Reconstructed from 2zx3q7e7c69qs.js, module 82823.
// deps: m247167, m938281, m572463
// exports: none


"use strict";m247167,Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"normalizePathTrailingSlash",{enumerable:!0,get:function(){return l}});let n=m938281,a=m572463,l=e=>{if(47!==e.charCodeAt(0))return e;let{pathname:t,query:r,hash:l}=(0,a.parsePath)(e);return`${(0,n.removeTrailingSlash)(t)}${r}${l}`};("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)
