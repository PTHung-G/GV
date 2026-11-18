// Reconstructed from 1c8ttxz-uq6b-.js, module 610772.
// deps: m271645, m934620
// exports: useId
export { u as "useId" };

"use strict";var t=m271645,n=m934620,r=Object.defineProperty,o=t[" useId ".trim().toString()]||(()=>void 0),i=0;function u(e){let[r,u]=t.useState(o());return(0,n.useLayoutEffect)(()=>{e||u(e=>e??String(i++))},[e]),e||(r?`radix-${r}`:"")}r(u,"name",{value:"useId",configurable:!0}),
