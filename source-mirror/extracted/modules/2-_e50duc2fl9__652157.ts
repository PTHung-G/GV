// Reconstructed from 2-_e50duc2fl9.js, module 652157.
// deps: m843476, m174080, m563599, m309885, m543369
// exports: none


"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"PreloadChunks",{enumerable:!0,get:function(){return l}});let n=m843476,s=m174080,i=m563599,a=m309885,o=m543369;function l({moduleIds:e}){if("u">typeof window)return null;let t=i.workAsyncStorage.getStore();if(void 0===t)return null;let r=[];if(t.reactLoadableManifest&&e){let n=t.reactLoadableManifest;for(let t of e){if(!n[t])continue;let e=n[t].files;r.push(...e)}}if(0===r.length)return null;let u=(0,o.getAssetTokenQuery)();return(0,n.jsx)(n.Fragment,{children:r.map(e=>{let r=`${t.assetPrefix}/_next/${(0,a.encodeURIPath)(e)}${u}`;return e.endsWith(".css")?(0,n.jsx)("link",{precedence:"dynamic",href:r,rel:"stylesheet",as:"style",nonce:t.nonce},e):((0,s.preload)(r,{as:"script",fetchPriority:"low",nonce:t.nonce}),null)})})}
