// Reconstructed from 1elo98fz9dw83.js, module 330009.
// deps: m843476, m179862, m271645, m30030, m820783, m326999, m981140, m691162, m167881
// exports: Action, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, Cancel, Content, Description, Overlay, Portal, Root, Title, Trigger, createAlertDialogScope, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
export { D as "Action" };
export { f as "AlertDialog" };
export { D as "AlertDialogAction" };
export { C as "AlertDialogCancel" };
export { b as "AlertDialogContent" };
export { y as "AlertDialogDescription" };
export { x as "AlertDialogOverlay" };
export { p as "AlertDialogPortal" };
export { j as "AlertDialogTitle" };
export { m as "AlertDialogTrigger" };
export { C as "Cancel" };
export { b as "Content" };
export { y as "Description" };
export { x as "Overlay" };
export { p as "Portal" };
export { f as "Root" };
export { j as "Title" };
export { m as "Trigger" };
export { u as "createAlertDialogScope" };
export { function({...e}){return(0,t.jsx)(w.Root,{"data-slot":"alert-dialog",...e})} as "AlertDialog" };
export { function({className:e,variant:n="default",size:i="default",...r}){return(0,t.jsx)(N.Button,{variant:n,size:i,asChild:!0,children:(0,t.jsx)(w.Action,{"data-slot":"alert-dialog-action",className:(0,a.cn)(e),...r})})} as "AlertDialogAction" };
export { function({className:e,variant:n="outline",size:i="default",...r}){return(0,t.jsx)(N.Button,{variant:n,size:i,asChild:!0,children:(0,t.jsx)(w.Cancel,{"data-slot":"alert-dialog-cancel",className:(0,a.cn)(e),...r})})} as "AlertDialogCancel" };
export { function({className:e,size:n="default",...i}){return(0,t.jsxs)(A,{children:[(0,t.jsx)(R,{}),(0,t.jsx)(w.Content,{"data-slot":"alert-dialog-content","data-size":n,className:(0,a.cn)("group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[size=sm]:max-w-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[size=default]:sm:max-w-lg",e),...i})]})} as "AlertDialogContent" };
export { function({className:e,...n}){return(0,t.jsx)(w.Description,{"data-slot":"alert-dialog-description",className:(0,a.cn)("text-sm text-muted-foreground",e),...n})} as "AlertDialogDescription" };
export { function({className:e,...n}){return(0,t.jsx)("div",{"data-slot":"alert-dialog-footer",className:(0,a.cn)("flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",e),...n})} as "AlertDialogFooter" };
export { function({className:e,...n}){return(0,t.jsx)("div",{"data-slot":"alert-dialog-header",className:(0,a.cn)("grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",e),...n})} as "AlertDialogHeader" };
export { function({className:e,...n}){return(0,t.jsx)(w.Title,{"data-slot":"alert-dialog-title",className:(0,a.cn)("text-lg font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",e),...n})} as "AlertDialogTitle" };
export { function({...e}){return(0,t.jsx)(w.Trigger,{"data-slot":"alert-dialog-trigger",...e})} as "AlertDialogTrigger" };

"use strict";var t=m843476,a=m179862,n=m271645,i=m30030,r=m820783,s=m326999,o=m981140,l=Object.defineProperty,d=(e,t)=>l(e,"name",{value:t,configurable:!0}),[c,u]=(0,i.createContextScope)("AlertDialog",[s.createDialogScope]),g=(0,s.createDialogScope)(),f=d(e=>{let{__scopeAlertDialog:a,...n}=e,i=g(a);return(0,t.jsx)(s.Root,{...i,...n,modal:!0})},"AlertDialog"),m=n.forwardRef(d(function(e,a){let{__scopeAlertDialog:n,...i}=e,r=g(n);return(0,t.jsx)(s.Trigger,{...r,...i,ref:a})},"AlertDialogTrigger")),p=d(e=>{let{__scopeAlertDialog:a,...n}=e,i=g(a);return(0,t.jsx)(s.Portal,{...i,...n})},"AlertDialogPortal"),x=n.forwardRef(d(function(e,a){let{__scopeAlertDialog:n,...i}=e,r=g(n);return(0,t.jsx)(s.Overlay,{...r,...i,ref:a})},"AlertDialogOverlay")),[h,v]=c("AlertDialogContent"),b=n.forwardRef(d(function(e,a){let{__scopeAlertDialog:i,children:l,...d}=e,c=g(i),u=n.useRef(null),f=(0,r.useComposedRefs)(a,u),m=n.useRef(null);return(0,t.jsx)(h,{scope:i,cancelRef:m,children:(0,t.jsx)(s.Content,{role:"alertdialog",...c,...d,ref:f,onOpenAutoFocus:(0,o.composeEventHandlers)(d.onOpenAutoFocus,e=>{e.preventDefault(),m.current?.focus({preventScroll:!0})}),onPointerDownOutside:e=>e.preventDefault(),onInteractOutside:e=>e.preventDefault(),children:l})})},"AlertDialogContent")),j=n.forwardRef(d(function(e,a){let{__scopeAlertDialog:n,...i}=e,r=g(n);return(0,t.jsx)(s.Title,{...r,...i,ref:a})},"AlertDialogTitle")),y=n.forwardRef(d(function(e,a){let{__scopeAlertDialog:n,...i}=e,r=g(n);return(0,t.jsx)(s.Description,{...r,...i,ref:a})},"AlertDialogDescription")),D=n.forwardRef(d(function(e,a){let{__scopeAlertDialog:n,...i}=e,r=g(n);return(0,t.jsx)(s.Close,{...r,...i,ref:a})},"AlertDialogAction")),C=n.forwardRef(d(function(e,a){let{__scopeAlertDialog:n,...i}=e,{cancelRef:o}=v("AlertDialogCancel",n),l=g(n),d=(0,r.useComposedRefs)(a,o);return(0,t.jsx)(s.Close,{...l,...i,ref:d})},"AlertDialogCancel"));;var w=m691162,w=w,N=m167881;function A({...e}){return(0,t.jsx)(w.Portal,{"data-slot":"alert-dialog-portal",...e})}function R({className:e,...n}){return(0,t.jsx)(w.Overlay,{"data-slot":"alert-dialog-overlay",className:(0,a.cn)("fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",e),...n})}
