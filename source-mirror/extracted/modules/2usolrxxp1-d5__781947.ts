// Reconstructed from 2usolrxxp1-d5.js, module 781947.
// deps: m843476, m225913, m647163
// exports: Alert, AlertDescription, AlertTitle
export { function({className:e,variant:s,...l}){return(0,t.jsx)("div",{"data-slot":"alert",role:"alert",className:(0,a.cn)(i({variant:s}),e),...l})} as "Alert" };
export { function({className:e,...s}){return(0,t.jsx)("div",{"data-slot":"alert-description",className:(0,a.cn)("col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",e),...s})} as "AlertDescription" };
export { function({className:e,...s}){return(0,t.jsx)("div",{"data-slot":"alert-title",className:(0,a.cn)("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",e),...s})} as "AlertTitle" };

"use strict";var t=m843476,s=m225913,a=m647163;let i=(0,s.cva)("relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",{variants:{variant:{default:"bg-card text-card-foreground",destructive:"bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current"}},defaultVariants:{variant:"default"}});
