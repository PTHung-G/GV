// Reconstructed from 3bg0pkvz9zgwr.js, module 869093.
// deps: none
// exports: none


"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"default",{enumerable:!0,get:function(){return c}});let a=t.r(843476),i=t.r(271645),r=t.r(667585),o=t.r(652157);function l(t){return{default:t&&"default"in t?t.default:t}}let s={loader:()=>Promise.resolve(l(()=>null)),loading:null,ssr:!0},c=function(t){let e={...s,...t},n=(0,i.lazy)(()=>e.loader().then(l)),c=e.loading;function h(t){let l=c?(0,a.jsx)(c,{isLoading:!0,pastDelay:!0,error:null}):null,s=!e.ssr||!!e.loading,h=s?i.Suspense:i.Fragment,u=e.ssr?(0,a.jsxs)(a.Fragment,{children:["u"<typeof window?(0,a.jsx)(o.PreloadChunks,{moduleIds:e.modules}):null,(0,a.jsx)(n,{...t})]}):(0,a.jsx)(r.BailoutToCSR,{reason:"next/dynamic",children:(0,a.jsx)(n,{...t})});return(0,a.jsx)(h,{...s?{fallback:l}:{},children:u})}return h.displayName="LoadableComponent",h}
