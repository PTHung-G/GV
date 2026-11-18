// Reconstructed from 0ro5n-m-6x12_.js, module 922737.
// deps: none
// exports: none


"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"setAttributesFromProps",{enumerable:!0,get:function(){return l}});let n={acceptCharset:"accept-charset",className:"class",htmlFor:"for",httpEquiv:"http-equiv",noModule:"noModule"},o=["onLoad","onReady","dangerouslySetInnerHTML","children","onError","strategy","stylesheets"];function a(e){return["async","defer","noModule"].includes(e)}function l(e,t){for(let[r,l]of Object.entries(t)){if(!t.hasOwnProperty(r)||o.includes(r)||void 0===l)continue;let i=n[r]||r.toLowerCase();"SCRIPT"===e.tagName&&a(i)?e[i]=!!l:e.setAttribute(i,String(l)),(!1===l||"SCRIPT"===e.tagName&&a(i)&&(!l||"false"===l))&&(e.setAttribute(i,""),e.removeAttribute(i))}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)
