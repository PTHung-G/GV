// Reconstructed from 04xc202ii67m6.pretty.js, module 630374.
// deps: m843476, m179862, m814387, m964053, m167881
// exports: Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
export { function ({ ...e }) { return (0, t.jsx)(r.Dialog.Root, { "data-slot": "dialog", ...e }); } as "Dialog" };
export { function ({ ...e }) { return (0, t.jsx)(r.Dialog.Close, { "data-slot": "dialog-close", ...e, }); } as "DialogClose" };
export { function ({ className: e, children: s, showCloseButton: l = !0, ...d }) { return (0, t.jsxs)(a, { "data-slot": "dialog-portal", children: [ (0, t.jsx)(o, {}), (0, t.jsxs)(r.Dialog.Content, { "data-slot": "dialog-content", className: (0, n.cn)( "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg", e, ), ...d, children: [ s, l && (0, t.jsxs)(r.Dialog.Close, { "data-slot": "dialog-close", className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", children: [ (0, t.jsx)(i.default, {}), (0, t.jsx)("span", { className: "sr-only", children: "Close", }), ], }), ], }), ], }); } as "DialogContent" };
export { function ({ className: e, ...i }) { return (0, t.jsx)(r.Dialog.Description, { "data-slot": "dialog-description", className: (0, n.cn)("text-sm text-muted-foreground", e), ...i, }); } as "DialogDescription" };
export { function ({ className: e, showCloseButton: i = !1, children: a, ...o }) { return (0, t.jsxs)("div", { "data-slot": "dialog-footer", className: (0, n.cn)( "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", e, ), ...o, children: [ a, i && (0, t.jsx)(r.Dialog.Close, { asChild: !0, children: (0, t.jsx)(s.Button, { variant: "outline", children: "Close", }), }), ], }); } as "DialogFooter" };
export { function ({ className: e, ...i }) { return (0, t.jsx)("div", { "data-slot": "dialog-header", className: (0, n.cn)( "flex flex-col gap-2 text-center sm:text-left", e, ), ...i, }); } as "DialogHeader" };
export { function ({ className: e, ...i }) { return (0, t.jsx)(r.Dialog.Title, { "data-slot": "dialog-title", className: (0, n.cn)("text-lg leading-none font-semibold", e), ...i, }); } as "DialogTitle" };

"use strict";
    var t = m843476,
      n = m179862,
      i = m814387,
      i = i,
      r = m964053,
      s = m167881;
    function a({ ...e }) {
      return (0, t.jsx)(r.Dialog.Portal, {
        "data-slot": "dialog-portal",
        ...e,
      });
    }
    function o({ className: e, ...i }) {
      return (0, t.jsx)(r.Dialog.Overlay, {
        "data-slot": "dialog-overlay",
        className: (0, n.cn)(
          "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
          e,
        ),
        ...i,
      });
    }
    ;
