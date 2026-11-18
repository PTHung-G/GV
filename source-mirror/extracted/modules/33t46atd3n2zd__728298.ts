// Reconstructed from 33t46atd3n2zd.js, module 728298.
// deps: m247167, m271645
// exports: none


"use strict";m247167,Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useRouterBFCache",{enumerable:!0,get:function(){return l}});let n=m271645;function l(e,t,r){let[l,u]=(0,n.useState)(()=>({tree:e,cacheNode:t,stateKey:r,next:null}));if(l.tree===e)return l;let a={tree:e,cacheNode:t,stateKey:r,next:null},o=1,d=l,s=a;for(;null!==d&&o<1;){if(d.stateKey===r){s.next=d.next;break}{o++;let e={tree:d.tree,cacheNode:d.cacheNode,stateKey:d.stateKey,next:null};s.next=e,s=e}d=d.next}return u(a),a}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)
