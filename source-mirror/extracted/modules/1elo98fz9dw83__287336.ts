// Reconstructed from 1elo98fz9dw83.js, module 287336.
// deps: m843476, m179862, m271645, m30030, m248425, m676027
// exports: Indicator, Progress, ProgressIndicator, Root, createProgressScope, Progress
export { m as "Indicator" };
export { f as "Progress" };
export { m as "ProgressIndicator" };
export { f as "Root" };
export { c as "createProgressScope" };
export { function({className:e,value:n,...i}){return(0,t.jsx)(D.Root,{"data-slot":"progress",className:(0,a.cn)("relative h-2 w-full overflow-hidden rounded-full bg-primary/20",e),...i,children:(0,t.jsx)(D.Indicator,{"data-slot":"progress-indicator",className:"h-full w-full flex-1 bg-primary transition-all",style:{transform:`translateX(-${100-(n||0)}%)`}})})} as "Progress" };

"use strict";var t=m843476,a=m179862,n=m271645,i=m30030,r=m248425,s=Object.defineProperty,o=(e,t)=>s(e,"name",{value:t,configurable:!0}),l="Progress",[d,c]=(0,i.createContextScope)(l),[u,g]=d(l),f=n.forwardRef(o(function(e,a){let{__scopeProgress:n,value:i=null,max:s,getValueLabel:o=p,...l}=e;(s||0===s)&&!v(s)&&console.error(j(`${s}`,"Progress"));let d=v(s)?s:100;null===i||b(i,d)||console.error(y(`${i}`,"Progress"));let c=b(i,d)?i:null,g=h(c)?o(c,d):void 0;return(0,t.jsx)(u,{scope:n,value:c,max:d,children:(0,t.jsx)(r.Primitive.div,{"aria-valuemax":d,"aria-valuemin":0,"aria-valuenow":h(c)?c:void 0,"aria-valuetext":g,role:"progressbar","data-state":x(c,d),"data-value":c??void 0,"data-max":d,...l,ref:a})})},"Progress")),m=n.forwardRef(o(function(e,a){let{__scopeProgress:n,...i}=e,s=g("ProgressIndicator",n);return(0,t.jsx)(r.Primitive.div,{"data-state":x(s.value,s.max),"data-value":s.value??void 0,"data-max":s.max,...i,ref:a})},"ProgressIndicator"));function p(e,t){return`${Math.round(e/t*100)}%`}function x(e,t){return null==e?"indeterminate":e===t?"complete":"loading"}function h(e){return"number"==typeof e}function v(e){return h(e)&&!isNaN(e)&&e>0}function b(e,t){return h(e)&&!isNaN(e)&&e<=t&&e>=0}function j(e,t){return`Invalid prop \`max\` of value \`${e}\` supplied to \`${t}\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`}function y(e,t){return`Invalid prop \`value\` of value \`${e}\` supplied to \`${t}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`}o(p,"defaultGetValueLabel"),o(x,"getProgressState"),o(h,"isNumber"),o(v,"isValidMaxNumber"),o(b,"isValidValueNumber"),o(j,"getInvalidMaxError"),o(y,"getInvalidValueError"),;var D=m676027,D=D;
