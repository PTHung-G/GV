// Reconstructed from 2-_e50duc2fl9.js, module 781947.
// deps: m843476, m225913, m647163
// exports: Alert, AlertDescription, AlertTitle
export { function({className:e,variant:r,...i}){return(0,t.jsx)("div",{"data-slot":"alert",role:"alert",className:(0,n.cn)(s({variant:r}),e),...i})} as "Alert" };
export { function({className:e,...r}){return(0,t.jsx)("div",{"data-slot":"alert-description",className:(0,n.cn)("col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",e),...r})} as "AlertDescription" };
export { function({className:e,...r}){return(0,t.jsx)("div",{"data-slot":"alert-title",className:(0,n.cn)("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",e),...r})} as "AlertTitle" };

"use strict";var t=m843476,r=m225913,n=m647163;let s=(0,r.cva)("relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",{variants:{variant:{default:"bg-card text-card-foreground",destructive:"bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current"}},defaultVariants:{variant:"default"}});
