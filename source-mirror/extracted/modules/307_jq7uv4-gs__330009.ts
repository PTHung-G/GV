// Reconstructed from 307_jq7uv4-gs.js, module 330009.
// deps: m843476, m179862, m271645, m30030, m820783, m326999, m981140, m691162, m167881
// exports: Action, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, Cancel, Content, Description, Overlay, Portal, Root, Title, Trigger, createAlertDialogScope, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
export { v as "Action" };
export { g as "AlertDialog" };
export { v as "AlertDialogAction" };
export { A as "AlertDialogCancel" };
export { k as "AlertDialogContent" };
export { j as "AlertDialogDescription" };
export { h as "AlertDialogOverlay" };
export { f as "AlertDialogPortal" };
export { D as "AlertDialogTitle" };
export { m as "AlertDialogTrigger" };
export { A as "Cancel" };
export { k as "Content" };
export { j as "Description" };
export { h as "Overlay" };
export { f as "Portal" };
export { g as "Root" };
export { D as "Title" };
export { m as "Trigger" };
export { u as "createAlertDialogScope" };
export { function({...e}){return(0,t.jsx)(b.Root,{"data-slot":"alert-dialog",...e})} as "AlertDialog" };
export { function({className:e,variant:i="default",size:r="default",...n}){return(0,t.jsx)(w.Button,{variant:i,size:r,asChild:!0,children:(0,t.jsx)(b.Action,{"data-slot":"alert-dialog-action",className:(0,a.cn)(e),...n})})} as "AlertDialogAction" };
export { function({className:e,variant:i="outline",size:r="default",...n}){return(0,t.jsx)(w.Button,{variant:i,size:r,asChild:!0,children:(0,t.jsx)(b.Cancel,{"data-slot":"alert-dialog-cancel",className:(0,a.cn)(e),...n})})} as "AlertDialogCancel" };
export { function({className:e,size:i="default",...r}){return(0,t.jsxs)(S,{children:[(0,t.jsx)(N,{}),(0,t.jsx)(b.Content,{"data-slot":"alert-dialog-content","data-size":i,className:(0,a.cn)("group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[size=sm]:max-w-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[size=default]:sm:max-w-lg",e),...r})]})} as "AlertDialogContent" };
export { function({className:e,...i}){return(0,t.jsx)(b.Description,{"data-slot":"alert-dialog-description",className:(0,a.cn)("text-sm text-muted-foreground",e),...i})} as "AlertDialogDescription" };
export { function({className:e,...i}){return(0,t.jsx)("div",{"data-slot":"alert-dialog-footer",className:(0,a.cn)("flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",e),...i})} as "AlertDialogFooter" };
export { function({className:e,...i}){return(0,t.jsx)("div",{"data-slot":"alert-dialog-header",className:(0,a.cn)("grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",e),...i})} as "AlertDialogHeader" };
export { function({className:e,...i}){return(0,t.jsx)(b.Title,{"data-slot":"alert-dialog-title",className:(0,a.cn)("text-lg font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",e),...i})} as "AlertDialogTitle" };
export { function({...e}){return(0,t.jsx)(b.Trigger,{"data-slot":"alert-dialog-trigger",...e})} as "AlertDialogTrigger" };

"use strict";var t=m843476,a=m179862,i=m271645,r=m30030,n=m820783,s=m326999,l=m981140,o=Object.defineProperty,d=(e,t)=>o(e,"name",{value:t,configurable:!0}),[c,u]=(0,r.createContextScope)("AlertDialog",[s.createDialogScope]),p=(0,s.createDialogScope)(),g=d(e=>{let{__scopeAlertDialog:a,...i}=e,r=p(a);return(0,t.jsx)(s.Root,{...r,...i,modal:!0})},"AlertDialog"),m=i.forwardRef(d(function(e,a){let{__scopeAlertDialog:i,...r}=e,n=p(i);return(0,t.jsx)(s.Trigger,{...n,...r,ref:a})},"AlertDialogTrigger")),f=d(e=>{let{__scopeAlertDialog:a,...i}=e,r=p(a);return(0,t.jsx)(s.Portal,{...r,...i})},"AlertDialogPortal"),h=i.forwardRef(d(function(e,a){let{__scopeAlertDialog:i,...r}=e,n=p(i);return(0,t.jsx)(s.Overlay,{...n,...r,ref:a})},"AlertDialogOverlay")),[x,y]=c("AlertDialogContent"),k=i.forwardRef(d(function(e,a){let{__scopeAlertDialog:r,children:o,...d}=e,c=p(r),u=i.useRef(null),g=(0,n.useComposedRefs)(a,u),m=i.useRef(null);return(0,t.jsx)(x,{scope:r,cancelRef:m,children:(0,t.jsx)(s.Content,{role:"alertdialog",...c,...d,ref:g,onOpenAutoFocus:(0,l.composeEventHandlers)(d.onOpenAutoFocus,e=>{e.preventDefault(),m.current?.focus({preventScroll:!0})}),onPointerDownOutside:e=>e.preventDefault(),onInteractOutside:e=>e.preventDefault(),children:o})})},"AlertDialogContent")),D=i.forwardRef(d(function(e,a){let{__scopeAlertDialog:i,...r}=e,n=p(i);return(0,t.jsx)(s.Title,{...n,...r,ref:a})},"AlertDialogTitle")),j=i.forwardRef(d(function(e,a){let{__scopeAlertDialog:i,...r}=e,n=p(i);return(0,t.jsx)(s.Description,{...n,...r,ref:a})},"AlertDialogDescription")),v=i.forwardRef(d(function(e,a){let{__scopeAlertDialog:i,...r}=e,n=p(i);return(0,t.jsx)(s.Close,{...n,...r,ref:a})},"AlertDialogAction")),A=i.forwardRef(d(function(e,a){let{__scopeAlertDialog:i,...r}=e,{cancelRef:l}=y("AlertDialogCancel",i),o=p(i),d=(0,n.useComposedRefs)(a,l);return(0,t.jsx)(s.Close,{...o,...r,ref:d})},"AlertDialogCancel"));;var b=m691162,b=b,w=m167881;function S({...e}){return(0,t.jsx)(b.Portal,{"data-slot":"alert-dialog-portal",...e})}function N({className:e,...i}){return(0,t.jsx)(b.Overlay,{"data-slot":"alert-dialog-overlay",className:(0,a.cn)("fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",e),...i})}
