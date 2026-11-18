// Reconstructed from 2zx3q7e7c69qs.js, module 754069.
// deps: m247167, m760355, m620896, m595871
// exports: none


"use strict";m247167,Object.defineProperty(r,"__esModule",{value:!0});var n={DYNAMIC_STALETIME_MS:function(){return o},STATIC_STALETIME_MS:function(){return c},navigateReducer:function(){return s}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let l=m760355,u=m620896,i=m595871,o=1e3*Number("0"),c=(0,u.getStaleTimeMs)(Number("300"));function s(e,t){let{url:r,isExternalUrl:n,navigateType:a,scrollBehavior:u}=t;if(n||document.getElementById("__next-page-redirect"))return(0,l.completeHardNavigation)(e,r,a);let o=new URL(e.canonicalUrl,location.origin),c=e.renderedSearch;return(0,l.navigate)(e,r,o,c,e.cache,e.tree,e.nextUrl,i.FreshnessPolicy.Default,u,a)}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)
