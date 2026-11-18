// Reconstructed from 3n7v2d43g4jof.pretty.js, module 127341.
// deps: m843476, m225913, m179862, m271645, m981140, m30030, m842727, m296626, m248425, m586318, m369340, m610772, m926209
// exports: Content, List, Root, Tabs, TabsContent, TabsList, TabsTrigger, Trigger, createTabsScope, Tabs, TabsContent, TabsList, TabsTrigger
export { N as "Content" };
export { k as "List" };
export { j as "Root" };
export { j as "Tabs" };
export { N as "TabsContent" };
export { k as "TabsList" };
export { w as "TabsTrigger" };
export { w as "Trigger" };
export { f as "createTabsScope" };
export { function ({ className: e, orientation: a = "horizontal", ...i }) { return (0, t.jsx)(M.Root, { "data-slot": "tabs", "data-orientation": a, orientation: a, className: (0, n.cn)( "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", e, ), ...i, }); } as "Tabs" };
export { function ({ className: e, ...a }) { return (0, t.jsx)(M.Content, { "data-slot": "tabs-content", className: (0, n.cn)("flex-1 outline-none", e), ...a, }); } as "TabsContent" };
export { function ({ className: e, variant: a = "default", ...i }) { return (0, t.jsx)(M.List, { "data-slot": "tabs-list", "data-variant": a, className: (0, n.cn)(S({ variant: a }), e), ...i, }); } as "TabsList" };
export { function ({ className: e, ...a }) { return (0, t.jsx)(M.Trigger, { "data-slot": "tabs-trigger", className: (0, n.cn)( "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent", "data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground", "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100", e, ), ...a, }); } as "TabsTrigger" };

"use strict";
    var t = m843476,
      a = m225913,
      n = m179862,
      i = m271645,
      s = m981140,
      r = m30030,
      l = m842727,
      o = m296626,
      c = m248425,
      d = m586318,
      u = m369340,
      h = m610772,
      m = Object.defineProperty,
      x = (e, t) => m(e, "name", { value: t, configurable: !0 }),
      g = "Tabs",
      [p, f] = (0, r.createContextScope)(g, [l.createRovingFocusGroupScope]),
      b = (0, l.createRovingFocusGroupScope)(),
      [v, y] = p(g),
      j = i.forwardRef(
        x(function (e, a) {
          let {
              __scopeTabs: n,
              value: i,
              onValueChange: s,
              defaultValue: r,
              orientation: l = "horizontal",
              dir: o,
              activationMode: m = "automatic",
              ...x
            } = e,
            p = (0, d.useDirection)(o),
            [f, b] = (0, u.useControllableState)({
              prop: i,
              onChange: s,
              defaultProp: r ?? "",
              caller: g,
            });
          return (0, t.jsx)(v, {
            scope: n,
            baseId: (0, h.useId)(),
            value: f,
            onValueChange: b,
            orientation: l,
            dir: p,
            activationMode: m,
            children: (0, t.jsx)(c.Primitive.div, {
              dir: p,
              "data-orientation": l,
              ...x,
              ref: a,
            }),
          });
        }, "Tabs"),
      ),
      k = i.forwardRef(
        x(function (e, a) {
          let { __scopeTabs: n, loop: i = !0, ...s } = e,
            r = y("TabsList", n),
            o = b(n);
          return (0, t.jsx)(l.Root, {
            asChild: !0,
            ...o,
            orientation: r.orientation,
            dir: r.dir,
            loop: i,
            children: (0, t.jsx)(c.Primitive.div, {
              role: "tablist",
              "aria-orientation": r.orientation,
              ...s,
              ref: a,
            }),
          });
        }, "TabsList"),
      ),
      w = i.forwardRef(
        x(function (e, a) {
          let { __scopeTabs: n, value: i, disabled: r = !1, ...o } = e,
            d = y("TabsTrigger", n),
            u = b(n),
            h = C(d.baseId, i),
            m = T(d.baseId, i),
            x = i === d.value;
          return (0, t.jsx)(l.Item, {
            asChild: !0,
            ...u,
            focusable: !r,
            active: x,
            children: (0, t.jsx)(c.Primitive.button, {
              type: "button",
              role: "tab",
              "aria-selected": x,
              "aria-controls": m,
              "data-state": x ? "active" : "inactive",
              "data-disabled": r ? "" : void 0,
              disabled: r,
              id: h,
              ...o,
              ref: a,
              onMouseDown: (0, s.composeEventHandlers)(e.onMouseDown, (e) => {
                r || 0 !== e.button || !1 !== e.ctrlKey
                  ? e.preventDefault()
                  : d.onValueChange(i);
              }),
              onKeyDown: (0, s.composeEventHandlers)(e.onKeyDown, (e) => {
                !r &&
                  e.target === e.currentTarget &&
                  [" ", "Enter"].includes(e.key) &&
                  d.onValueChange(i);
              }),
              onFocus: (0, s.composeEventHandlers)(e.onFocus, () => {
                let e = "manual" !== d.activationMode;
                x || r || !e || d.onValueChange(i);
              }),
            }),
          });
        }, "TabsTrigger"),
      ),
      N = i.forwardRef(
        x(function (e, a) {
          let {
              __scopeTabs: n,
              value: s,
              forceMount: r,
              children: l,
              ...d
            } = e,
            u = y("TabsContent", n),
            h = C(u.baseId, s),
            m = T(u.baseId, s),
            x = s === u.value,
            g = i.useRef(x);
          return (
            i.useEffect(() => {
              let e = requestAnimationFrame(() => (g.current = !1));
              return () => cancelAnimationFrame(e);
            }, []),
            (0, t.jsx)(o.Presence, {
              present: r || x,
              children: ({ present: n }) =>
                (0, t.jsx)(c.Primitive.div, {
                  "data-state": x ? "active" : "inactive",
                  "data-orientation": u.orientation,
                  role: "tabpanel",
                  "aria-labelledby": h,
                  hidden: !n,
                  id: m,
                  tabIndex: 0,
                  ...d,
                  ref: a,
                  style: {
                    ...e.style,
                    animationDuration: g.current ? "0s" : void 0,
                  },
                  children: n && l,
                }),
            })
          );
        }, "TabsContent"),
      );
    function C(e, t) {
      return `${e}-trigger-${t}`;
    }
    function T(e, t) {
      return `${e}-content-${t}`;
    }
    (x(C, "makeTriggerId"),
      x(T, "makeContentId"),
      );
    var M = m926209,
      M = M;
    let S = (0, a.cva)(
      "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
      {
        variants: {
          variant: { default: "bg-muted", line: "gap-1 bg-transparent" },
        },
        defaultVariants: { variant: "default" },
      },
    );
    ;
