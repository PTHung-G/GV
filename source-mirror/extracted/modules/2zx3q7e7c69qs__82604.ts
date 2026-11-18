// Reconstructed from 2zx3q7e7c69qs.js, module 82604.
// deps: m126935
// exports: none


"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={HTML_LIMITED_BOT_UA_RE:function(){return l.HTML_LIMITED_BOT_UA_RE},HTML_LIMITED_BOT_UA_RE_STRING:function(){return i},getBotType:function(){return s},isBot:function(){return c}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let l=m126935,u=/Googlebot(?!-)|Googlebot$/i,i=l.HTML_LIMITED_BOT_UA_RE.source;function o(e){return l.HTML_LIMITED_BOT_UA_RE.test(e)}function c(e){return u.test(e)||o(e)}function s(e){return u.test(e)?"dom":o(e)?"html":void 0}
