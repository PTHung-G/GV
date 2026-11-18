// Reconstructed from 26g4tn5b226u5.js, module 754394.
// deps: none
// exports: none


"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={HTTPAccessErrorStatus:function(){return u},HTTP_ERROR_FALLBACK_ERROR_CODE:function(){return a},getAccessFallbackErrorTypeByStatus:function(){return s},getAccessFallbackHTTPStatus:function(){return l},isHTTPAccessFallbackError:function(){return c}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let u={NOT_FOUND:404,FORBIDDEN:403,UNAUTHORIZED:401},i=new Set(Object.values(u)),a="NEXT_HTTP_ERROR_FALLBACK";function c(e){if("object"!=typeof e||null===e||!("digest"in e)||"string"!=typeof e.digest)return!1;let[t,r]=e.digest.split(";");return t===a&&i.has(Number(r))}function l(e){return Number(e.digest.split(";")[1])}function s(e){switch(e){case 401:return"unauthorized";case 403:return"forbidden";case 404:return"not-found";default:return}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)
