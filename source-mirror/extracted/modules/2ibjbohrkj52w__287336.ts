// Reconstructed from 2ibjbohrkj52w.js, module 287336.
// deps: m843476, m179862, m271645, m30030, m248425, m676027
// exports: Indicator, Progress, ProgressIndicator, Root, createProgressScope, Progress
export { x as "Indicator" };
export { g as "Progress" };
export { x as "ProgressIndicator" };
export { g as "Root" };
export { c as "createProgressScope" };
export { function({className:e,value:n,...a}){return(0,t.jsx)(N.Root,{"data-slot":"progress",className:(0,i.cn)("relative h-2 w-full overflow-hidden rounded-full bg-primary/20",e),...a,children:(0,t.jsx)(N.Indicator,{"data-slot":"progress-indicator",className:"h-full w-full flex-1 bg-primary transition-all",style:{transform:`translateX(-${100-(n||0)}%)`}})})} as "Progress" };

"use strict";var t=m843476,i=m179862,n=m271645,a=m30030,s=m248425,r=Object.defineProperty,l=(e,t)=>r(e,"name",{value:t,configurable:!0}),o="Progress",[d,c]=(0,a.createContextScope)(o),[u,m]=d(o),g=n.forwardRef(l(function(e,i){let{__scopeProgress:n,value:a=null,max:r,getValueLabel:l=h,...o}=e;(r||0===r)&&!v(r)&&console.error(j(`${r}`,"Progress"));let d=v(r)?r:100;null===a||b(a,d)||console.error(y(`${a}`,"Progress"));let c=b(a,d)?a:null,m=p(c)?l(c,d):void 0;return(0,t.jsx)(u,{scope:n,value:c,max:d,children:(0,t.jsx)(s.Primitive.div,{"aria-valuemax":d,"aria-valuemin":0,"aria-valuenow":p(c)?c:void 0,"aria-valuetext":m,role:"progressbar","data-state":f(c,d),"data-value":c??void 0,"data-max":d,...o,ref:i})})},"Progress")),x=n.forwardRef(l(function(e,i){let{__scopeProgress:n,...a}=e,r=m("ProgressIndicator",n);return(0,t.jsx)(s.Primitive.div,{"data-state":f(r.value,r.max),"data-value":r.value??void 0,"data-max":r.max,...a,ref:i})},"ProgressIndicator"));function h(e,t){return`${Math.round(e/t*100)}%`}function f(e,t){return null==e?"indeterminate":e===t?"complete":"loading"}function p(e){return"number"==typeof e}function v(e){return p(e)&&!isNaN(e)&&e>0}function b(e,t){return p(e)&&!isNaN(e)&&e<=t&&e>=0}function j(e,t){return`Invalid prop \`max\` of value \`${e}\` supplied to \`${t}\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`}function y(e,t){return`Invalid prop \`value\` of value \`${e}\` supplied to \`${t}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`}l(h,"defaultGetValueLabel"),l(f,"getProgressState"),l(p,"isNumber"),l(v,"isValidMaxNumber"),l(b,"isValidValueNumber"),l(j,"getInvalidMaxError"),l(y,"getInvalidValueError"),;var N=m676027,N=N;
