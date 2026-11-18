// Reconstructed from 1em08pi09_cer.js, module 330009.
// deps: m843476, m179862, m271645, m30030, m820783, m326999, m981140, m691162, m167881
// exports: Action, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, Cancel, Content, Description, Overlay, Portal, Root, Title, Trigger, createAlertDialogScope, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
export { D as "Action" };
export { f as "AlertDialog" };
export { D as "AlertDialogAction" };
export { w as "AlertDialogCancel" };
export { y as "AlertDialogContent" };
export { b as "AlertDialogDescription" };
export { x as "AlertDialogOverlay" };
export { p as "AlertDialogPortal" };
export { j as "AlertDialogTitle" };
export { m as "AlertDialogTrigger" };
export { w as "Cancel" };
export { y as "Content" };
export { b as "Description" };
export { x as "Overlay" };
export { p as "Portal" };
export { f as "Root" };
export { j as "Title" };
export { m as "Trigger" };
export { u as "createAlertDialogScope" };
export { function({...e}){return(0,t.jsx)(A.Root,{"data-slot":"alert-dialog",...e})} as "AlertDialog" };
export { function({className:e,variant:r="default",size:i="default",...n}){return(0,t.jsx)(N.Button,{variant:r,size:i,asChild:!0,children:(0,t.jsx)(A.Action,{"data-slot":"alert-dialog-action",className:(0,a.cn)(e),...n})})} as "AlertDialogAction" };
export { function({className:e,variant:r="outline",size:i="default",...n}){return(0,t.jsx)(N.Button,{variant:r,size:i,asChild:!0,children:(0,t.jsx)(A.Cancel,{"data-slot":"alert-dialog-cancel",className:(0,a.cn)(e),...n})})} as "AlertDialogCancel" };
export { function({className:e,size:r="default",...i}){return(0,t.jsxs)(z,{children:[(0,t.jsx)(C,{}),(0,t.jsx)(A.Content,{"data-slot":"alert-dialog-content","data-size":r,className:(0,a.cn)("group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[size=sm]:max-w-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[size=default]:sm:max-w-lg",e),...i})]})} as "AlertDialogContent" };
export { function({className:e,...r}){return(0,t.jsx)(A.Description,{"data-slot":"alert-dialog-description",className:(0,a.cn)("text-sm text-muted-foreground",e),...r})} as "AlertDialogDescription" };
export { function({className:e,...r}){return(0,t.jsx)("div",{"data-slot":"alert-dialog-footer",className:(0,a.cn)("flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",e),...r})} as "AlertDialogFooter" };
export { function({className:e,...r}){return(0,t.jsx)("div",{"data-slot":"alert-dialog-header",className:(0,a.cn)("grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",e),...r})} as "AlertDialogHeader" };
export { function({className:e,...r}){return(0,t.jsx)(A.Title,{"data-slot":"alert-dialog-title",className:(0,a.cn)("text-lg font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",e),...r})} as "AlertDialogTitle" };
export { function({...e}){return(0,t.jsx)(A.Trigger,{"data-slot":"alert-dialog-trigger",...e})} as "AlertDialogTrigger" };

"use strict";var t=m843476,a=m179862,r=m271645,i=m30030,n=m820783,l=m326999,o=m981140,s=Object.defineProperty,d=(e,t)=>s(e,"name",{value:t,configurable:!0}),[c,u]=(0,i.createContextScope)("AlertDialog",[l.createDialogScope]),g=(0,l.createDialogScope)(),f=d(e=>{let{__scopeAlertDialog:a,...r}=e,i=g(a);return(0,t.jsx)(l.Root,{...i,...r,modal:!0})},"AlertDialog"),m=r.forwardRef(d(function(e,a){let{__scopeAlertDialog:r,...i}=e,n=g(r);return(0,t.jsx)(l.Trigger,{...n,...i,ref:a})},"AlertDialogTrigger")),p=d(e=>{let{__scopeAlertDialog:a,...r}=e,i=g(a);return(0,t.jsx)(l.Portal,{...i,...r})},"AlertDialogPortal"),x=r.forwardRef(d(function(e,a){let{__scopeAlertDialog:r,...i}=e,n=g(r);return(0,t.jsx)(l.Overlay,{...n,...i,ref:a})},"AlertDialogOverlay")),[v,h]=c("AlertDialogContent"),y=r.forwardRef(d(function(e,a){let{__scopeAlertDialog:i,children:s,...d}=e,c=g(i),u=r.useRef(null),f=(0,n.useComposedRefs)(a,u),m=r.useRef(null);return(0,t.jsx)(v,{scope:i,cancelRef:m,children:(0,t.jsx)(l.Content,{role:"alertdialog",...c,...d,ref:f,onOpenAutoFocus:(0,o.composeEventHandlers)(d.onOpenAutoFocus,e=>{e.preventDefault(),m.current?.focus({preventScroll:!0})}),onPointerDownOutside:e=>e.preventDefault(),onInteractOutside:e=>e.preventDefault(),children:s})})},"AlertDialogContent")),j=r.forwardRef(d(function(e,a){let{__scopeAlertDialog:r,...i}=e,n=g(r);return(0,t.jsx)(l.Title,{...n,...i,ref:a})},"AlertDialogTitle")),b=r.forwardRef(d(function(e,a){let{__scopeAlertDialog:r,...i}=e,n=g(r);return(0,t.jsx)(l.Description,{...n,...i,ref:a})},"AlertDialogDescription")),D=r.forwardRef(d(function(e,a){let{__scopeAlertDialog:r,...i}=e,n=g(r);return(0,t.jsx)(l.Close,{...n,...i,ref:a})},"AlertDialogAction")),w=r.forwardRef(d(function(e,a){let{__scopeAlertDialog:r,...i}=e,{cancelRef:o}=h("AlertDialogCancel",r),s=g(r),d=(0,n.useComposedRefs)(a,o);return(0,t.jsx)(l.Close,{...s,...i,ref:d})},"AlertDialogCancel"));;var A=m691162,A=A,N=m167881;function z({...e}){return(0,t.jsx)(A.Portal,{"data-slot":"alert-dialog-portal",...e})}function C({className:e,...r}){return(0,t.jsx)(A.Overlay,{"data-slot":"alert-dialog-overlay",className:(0,a.cn)("fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",e),...r})}
