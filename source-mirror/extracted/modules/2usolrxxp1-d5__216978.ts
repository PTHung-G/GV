// Reconstructed from 2usolrxxp1-d5.js, module 216978.
// deps: m843476, m770703, m271645, m647163
// exports: DocThumbnail
export { function({excerpt:e,className:s}){let n=(0,a.useRef)(null),[r,d]=(0,a.useState)(!1);(0,a.useEffect)(()=>{let e=n.current;if(!e||r)return;let t=new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)&&d(!0)},{rootMargin:"200px"});return t.observe(e),()=>t.disconnect()},[r]);let c=!e?.trim();return(0,t.jsxs)("div",{ref:n,"aria-hidden":!0,className:(0,i.cn)("relative h-full w-full overflow-hidden bg-white",s),children:[c&&(0,t.jsx)("div",{className:"space-y-1.5 px-4 pt-4",children:[90,70,80,60].map(e=>(0,t.jsx)("div",{className:"h-1 rounded-full bg-[#eceff1]",style:{width:`${e}%`}},e))}),r&&e&&!c&&(0,t.jsx)(l,{excerpt:e})]})} as "DocThumbnail" };

"use strict";var t=m843476,s=m770703,a=m271645,i=m647163;let l=(0,s.default)(()=>e.A(458094).then(e=>e.DocThumbnailPage),{loadableGenerated:{modules:[303604]},ssr:!1});
