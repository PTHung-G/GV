// Reconstructed from 26g4tn5b226u5.js, module 968391.
// deps: m476963
// exports: none


"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={REDIRECT_ERROR_CODE:function(){return i},isRedirectError:function(){return a}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let u=m476963,i="NEXT_REDIRECT";function a(e){if("object"!=typeof e||null===e||!("digest"in e)||"string"!=typeof e.digest)return!1;let t=e.digest.split(";"),[r,n]=t,o=t.slice(2,-2).join(";"),a=Number(t.at(-2));return r===i&&("replace"===n||"push"===n)&&"string"==typeof o&&!isNaN(a)&&a in u.RedirectStatusCode}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)
