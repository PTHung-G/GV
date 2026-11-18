// Reconstructed from 2zx3q7e7c69qs.js, module 891668.
// deps: m451191, m388540, m760355, m620896, m269845, m595871
// exports: none


"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"serverPatchReducer",{enumerable:!0,get:function(){return c}});let n=m451191,a=m388540,l=m760355,u=m620896,i=m269845,o=m595871;function c(e,t){let r=t.mpa,c=new URL(t.url,location.origin),s=t.seed,f=t.navigateType;if(r||null===s)return(0,l.completeHardNavigation)(e,c,f);let d=new URL(e.canonicalUrl,location.origin),h=e.renderedSearch;if(t.previousTree!==e.tree)return(0,i.refreshReducer)(e,{type:a.ACTION_REFRESH});let p=(0,n.createHrefFromUrl)(c),y=t.nextUrl,g=a.ScrollBehavior.Default,_=(0,o.getCurrentNavigationLock)(),v=Date.now();return(0,l.navigateToKnownRoute)(v,e,c,p,s,d,h,e.cache,e.tree,t.freshnessPolicy,y,g,f,_,u.segmentCacheMap,null,null,void 0)}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)
