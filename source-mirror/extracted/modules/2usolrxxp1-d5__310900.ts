// Reconstructed from 2usolrxxp1-d5.js, module 310900.
// deps: m271645, m799887
// exports: useMetadataOptions
export { function(){let[e,i]=(0,t.useState)(null),[l,n]=(0,t.useState)("");return(0,t.useEffect)(()=>{let e=!0;return(a??=(0,s.getMetadataOptions)().then(e=>e.options)).then(t=>e&&i(t)).catch(t=>{a=null,e&&n(t.message)}),()=>{e=!1}},[]),{options:e,error:l}} as "useMetadataOptions" };

"use strict";var t=m271645,s=m799887;let a=null;
