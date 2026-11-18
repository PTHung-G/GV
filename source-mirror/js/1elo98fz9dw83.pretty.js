(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  330009,
  (e) => {
    "use strict";
    var t = e.i(843476),
      a = e.i(179862),
      n = e.i(271645),
      i = e.i(30030),
      r = e.i(820783),
      s = e.i(326999),
      o = e.i(981140),
      l = Object.defineProperty,
      d = (e, t) => l(e, "name", { value: t, configurable: !0 }),
      [c, u] = (0, i.createContextScope)("AlertDialog", [s.createDialogScope]),
      g = (0, s.createDialogScope)(),
      f = d((e) => {
        let { __scopeAlertDialog: a, ...n } = e,
          i = g(a);
        return (0, t.jsx)(s.Root, { ...i, ...n, modal: !0 });
      }, "AlertDialog"),
      m = n.forwardRef(
        d(function (e, a) {
          let { __scopeAlertDialog: n, ...i } = e,
            r = g(n);
          return (0, t.jsx)(s.Trigger, { ...r, ...i, ref: a });
        }, "AlertDialogTrigger"),
      ),
      p = d((e) => {
        let { __scopeAlertDialog: a, ...n } = e,
          i = g(a);
        return (0, t.jsx)(s.Portal, { ...i, ...n });
      }, "AlertDialogPortal"),
      x = n.forwardRef(
        d(function (e, a) {
          let { __scopeAlertDialog: n, ...i } = e,
            r = g(n);
          return (0, t.jsx)(s.Overlay, { ...r, ...i, ref: a });
        }, "AlertDialogOverlay"),
      ),
      [h, v] = c("AlertDialogContent"),
      b = n.forwardRef(
        d(function (e, a) {
          let { __scopeAlertDialog: i, children: l, ...d } = e,
            c = g(i),
            u = n.useRef(null),
            f = (0, r.useComposedRefs)(a, u),
            m = n.useRef(null);
          return (0, t.jsx)(h, {
            scope: i,
            cancelRef: m,
            children: (0, t.jsx)(s.Content, {
              role: "alertdialog",
              ...c,
              ...d,
              ref: f,
              onOpenAutoFocus: (0, o.composeEventHandlers)(
                d.onOpenAutoFocus,
                (e) => {
                  (e.preventDefault(), m.current?.focus({ preventScroll: !0 }));
                },
              ),
              onPointerDownOutside: (e) => e.preventDefault(),
              onInteractOutside: (e) => e.preventDefault(),
              children: l,
            }),
          });
        }, "AlertDialogContent"),
      ),
      j = n.forwardRef(
        d(function (e, a) {
          let { __scopeAlertDialog: n, ...i } = e,
            r = g(n);
          return (0, t.jsx)(s.Title, { ...r, ...i, ref: a });
        }, "AlertDialogTitle"),
      ),
      y = n.forwardRef(
        d(function (e, a) {
          let { __scopeAlertDialog: n, ...i } = e,
            r = g(n);
          return (0, t.jsx)(s.Description, { ...r, ...i, ref: a });
        }, "AlertDialogDescription"),
      ),
      D = n.forwardRef(
        d(function (e, a) {
          let { __scopeAlertDialog: n, ...i } = e,
            r = g(n);
          return (0, t.jsx)(s.Close, { ...r, ...i, ref: a });
        }, "AlertDialogAction"),
      ),
      C = n.forwardRef(
        d(function (e, a) {
          let { __scopeAlertDialog: n, ...i } = e,
            { cancelRef: o } = v("AlertDialogCancel", n),
            l = g(n),
            d = (0, r.useComposedRefs)(a, o);
          return (0, t.jsx)(s.Close, { ...l, ...i, ref: d });
        }, "AlertDialogCancel"),
      );
    e.s(
      [
        "Action",
        0,
        D,
        "AlertDialog",
        0,
        f,
        "AlertDialogAction",
        0,
        D,
        "AlertDialogCancel",
        0,
        C,
        "AlertDialogContent",
        0,
        b,
        "AlertDialogDescription",
        0,
        y,
        "AlertDialogOverlay",
        0,
        x,
        "AlertDialogPortal",
        0,
        p,
        "AlertDialogTitle",
        0,
        j,
        "AlertDialogTrigger",
        0,
        m,
        "Cancel",
        0,
        C,
        "Content",
        0,
        b,
        "Description",
        0,
        y,
        "Overlay",
        0,
        x,
        "Portal",
        0,
        p,
        "Root",
        0,
        f,
        "Title",
        0,
        j,
        "Trigger",
        0,
        m,
        "createAlertDialogScope",
        0,
        u,
      ],
      691162,
    );
    var w = e.i(691162),
      w = w,
      N = e.i(167881);
    function A({ ...e }) {
      return (0, t.jsx)(w.Portal, { "data-slot": "alert-dialog-portal", ...e });
    }
    function R({ className: e, ...n }) {
      return (0, t.jsx)(w.Overlay, {
        "data-slot": "alert-dialog-overlay",
        className: (0, a.cn)(
          "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
          e,
        ),
        ...n,
      });
    }
    e.s(
      [
        "AlertDialog",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(w.Root, { "data-slot": "alert-dialog", ...e });
        },
        "AlertDialogAction",
        0,
        function ({
          className: e,
          variant: n = "default",
          size: i = "default",
          ...r
        }) {
          return (0, t.jsx)(N.Button, {
            variant: n,
            size: i,
            asChild: !0,
            children: (0, t.jsx)(w.Action, {
              "data-slot": "alert-dialog-action",
              className: (0, a.cn)(e),
              ...r,
            }),
          });
        },
        "AlertDialogCancel",
        0,
        function ({
          className: e,
          variant: n = "outline",
          size: i = "default",
          ...r
        }) {
          return (0, t.jsx)(N.Button, {
            variant: n,
            size: i,
            asChild: !0,
            children: (0, t.jsx)(w.Cancel, {
              "data-slot": "alert-dialog-cancel",
              className: (0, a.cn)(e),
              ...r,
            }),
          });
        },
        "AlertDialogContent",
        0,
        function ({ className: e, size: n = "default", ...i }) {
          return (0, t.jsxs)(A, {
            children: [
              (0, t.jsx)(R, {}),
              (0, t.jsx)(w.Content, {
                "data-slot": "alert-dialog-content",
                "data-size": n,
                className: (0, a.cn)(
                  "group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[size=sm]:max-w-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[size=default]:sm:max-w-lg",
                  e,
                ),
                ...i,
              }),
            ],
          });
        },
        "AlertDialogDescription",
        0,
        function ({ className: e, ...n }) {
          return (0, t.jsx)(w.Description, {
            "data-slot": "alert-dialog-description",
            className: (0, a.cn)("text-sm text-muted-foreground", e),
            ...n,
          });
        },
        "AlertDialogFooter",
        0,
        function ({ className: e, ...n }) {
          return (0, t.jsx)("div", {
            "data-slot": "alert-dialog-footer",
            className: (0, a.cn)(
              "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
              e,
            ),
            ...n,
          });
        },
        "AlertDialogHeader",
        0,
        function ({ className: e, ...n }) {
          return (0, t.jsx)("div", {
            "data-slot": "alert-dialog-header",
            className: (0, a.cn)(
              "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
              e,
            ),
            ...n,
          });
        },
        "AlertDialogTitle",
        0,
        function ({ className: e, ...n }) {
          return (0, t.jsx)(w.Title, {
            "data-slot": "alert-dialog-title",
            className: (0, a.cn)(
              "text-lg font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
              e,
            ),
            ...n,
          });
        },
        "AlertDialogTrigger",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(w.Trigger, {
            "data-slot": "alert-dialog-trigger",
            ...e,
          });
        },
      ],
      330009,
    );
  },
  994179,
  (e) => {
    "use strict";
    var t = e.i(843476),
      a = e.i(225913),
      n = e.i(179862),
      i = e.i(586011);
    let r = (0, a.cva)(
      "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
      {
        variants: {
          variant: {
            default:
              "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
            secondary:
              "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
            destructive:
              "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
            outline:
              "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            link: "text-primary underline-offset-4 [a&]:hover:underline",
          },
        },
        defaultVariants: { variant: "default" },
      },
    );
    e.s([
      "Badge",
      0,
      function ({
        className: e,
        variant: a = "default",
        asChild: s = !1,
        ...o
      }) {
        let l = s ? i.Slot.Root : "span";
        return (0, t.jsx)(l, {
          "data-slot": "badge",
          "data-variant": a,
          className: (0, n.cn)(r({ variant: a }), e),
          ...o,
        });
      },
    ]);
  },
  630374,
  (e) => {
    "use strict";
    var t = e.i(843476),
      a = e.i(179862),
      n = e.i(814387),
      n = n,
      i = e.i(964053),
      r = e.i(167881);
    function s({ ...e }) {
      return (0, t.jsx)(i.Dialog.Portal, {
        "data-slot": "dialog-portal",
        ...e,
      });
    }
    function o({ className: e, ...n }) {
      return (0, t.jsx)(i.Dialog.Overlay, {
        "data-slot": "dialog-overlay",
        className: (0, a.cn)(
          "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
          e,
        ),
        ...n,
      });
    }
    e.s(
      [
        "Dialog",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(i.Dialog.Root, { "data-slot": "dialog", ...e });
        },
        "DialogClose",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(i.Dialog.Close, {
            "data-slot": "dialog-close",
            ...e,
          });
        },
        "DialogContent",
        0,
        function ({
          className: e,
          children: r,
          showCloseButton: l = !0,
          ...d
        }) {
          return (0, t.jsxs)(s, {
            "data-slot": "dialog-portal",
            children: [
              (0, t.jsx)(o, {}),
              (0, t.jsxs)(i.Dialog.Content, {
                "data-slot": "dialog-content",
                className: (0, a.cn)(
                  "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg",
                  e,
                ),
                ...d,
                children: [
                  r,
                  l &&
                    (0, t.jsxs)(i.Dialog.Close, {
                      "data-slot": "dialog-close",
                      className:
                        "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                      children: [
                        (0, t.jsx)(n.default, {}),
                        (0, t.jsx)("span", {
                          className: "sr-only",
                          children: "Close",
                        }),
                      ],
                    }),
                ],
              }),
            ],
          });
        },
        "DialogDescription",
        0,
        function ({ className: e, ...n }) {
          return (0, t.jsx)(i.Dialog.Description, {
            "data-slot": "dialog-description",
            className: (0, a.cn)("text-sm text-muted-foreground", e),
            ...n,
          });
        },
        "DialogFooter",
        0,
        function ({
          className: e,
          showCloseButton: n = !1,
          children: s,
          ...o
        }) {
          return (0, t.jsxs)("div", {
            "data-slot": "dialog-footer",
            className: (0, a.cn)(
              "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
              e,
            ),
            ...o,
            children: [
              s,
              n &&
                (0, t.jsx)(i.Dialog.Close, {
                  asChild: !0,
                  children: (0, t.jsx)(r.Button, {
                    variant: "outline",
                    children: "Close",
                  }),
                }),
            ],
          });
        },
        "DialogHeader",
        0,
        function ({ className: e, ...n }) {
          return (0, t.jsx)("div", {
            "data-slot": "dialog-header",
            className: (0, a.cn)(
              "flex flex-col gap-2 text-center sm:text-left",
              e,
            ),
            ...n,
          });
        },
        "DialogTitle",
        0,
        function ({ className: e, ...n }) {
          return (0, t.jsx)(i.Dialog.Title, {
            "data-slot": "dialog-title",
            className: (0, a.cn)("text-lg leading-none font-semibold", e),
            ...n,
          });
        },
      ],
      630374,
    );
  },
  463415,
  (e) => {
    "use strict";
    var t = e.i(843476),
      a = e.i(179862);
    (e.i(593698),
      e.i(986253),
      (0, e.i(456420).default)("circle", [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
      ]));
    var n = e.i(295692);
    e.s(
      [
        "DropdownMenu",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(n.DropdownMenu.Root, {
            "data-slot": "dropdown-menu",
            ...e,
          });
        },
        "DropdownMenuContent",
        0,
        function ({ className: e, sideOffset: i = 4, ...r }) {
          return (0, t.jsx)(n.DropdownMenu.Portal, {
            children: (0, t.jsx)(n.DropdownMenu.Content, {
              "data-slot": "dropdown-menu-content",
              sideOffset: i,
              className: (0, a.cn)(
                "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                e,
              ),
              ...r,
            }),
          });
        },
        "DropdownMenuItem",
        0,
        function ({ className: e, inset: i, variant: r = "default", ...s }) {
          return (0, t.jsx)(n.DropdownMenu.Item, {
            "data-slot": "dropdown-menu-item",
            "data-inset": i,
            "data-variant": r,
            className: (0, a.cn)(
              "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
              e,
            ),
            ...s,
          });
        },
        "DropdownMenuSeparator",
        0,
        function ({ className: e, ...i }) {
          return (0, t.jsx)(n.DropdownMenu.Separator, {
            "data-slot": "dropdown-menu-separator",
            className: (0, a.cn)("-mx-1 my-1 h-px bg-border", e),
            ...i,
          });
        },
        "DropdownMenuTrigger",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(n.DropdownMenu.Trigger, {
            "data-slot": "dropdown-menu-trigger",
            ...e,
          });
        },
      ],
      463415,
    );
  },
  10708,
  (e) => {
    "use strict";
    var t = e.i(843476),
      a = e.i(647163);
    e.s([
      "Label",
      0,
      function ({ className: e, ...n }) {
        return (0, t.jsx)("label", {
          "data-slot": "label",
          className: (0, a.cn)("text-sm font-medium leading-none", e),
          ...n,
        });
      },
    ]);
  },
  287336,
  (e) => {
    "use strict";
    var t = e.i(843476),
      a = e.i(179862),
      n = e.i(271645),
      i = e.i(30030),
      r = e.i(248425),
      s = Object.defineProperty,
      o = (e, t) => s(e, "name", { value: t, configurable: !0 }),
      l = "Progress",
      [d, c] = (0, i.createContextScope)(l),
      [u, g] = d(l),
      f = n.forwardRef(
        o(function (e, a) {
          let {
            __scopeProgress: n,
            value: i = null,
            max: s,
            getValueLabel: o = p,
            ...l
          } = e;
          (s || 0 === s) && !v(s) && console.error(j(`${s}`, "Progress"));
          let d = v(s) ? s : 100;
          null === i || b(i, d) || console.error(y(`${i}`, "Progress"));
          let c = b(i, d) ? i : null,
            g = h(c) ? o(c, d) : void 0;
          return (0, t.jsx)(u, {
            scope: n,
            value: c,
            max: d,
            children: (0, t.jsx)(r.Primitive.div, {
              "aria-valuemax": d,
              "aria-valuemin": 0,
              "aria-valuenow": h(c) ? c : void 0,
              "aria-valuetext": g,
              role: "progressbar",
              "data-state": x(c, d),
              "data-value": c ?? void 0,
              "data-max": d,
              ...l,
              ref: a,
            }),
          });
        }, "Progress"),
      ),
      m = n.forwardRef(
        o(function (e, a) {
          let { __scopeProgress: n, ...i } = e,
            s = g("ProgressIndicator", n);
          return (0, t.jsx)(r.Primitive.div, {
            "data-state": x(s.value, s.max),
            "data-value": s.value ?? void 0,
            "data-max": s.max,
            ...i,
            ref: a,
          });
        }, "ProgressIndicator"),
      );
    function p(e, t) {
      return `${Math.round((e / t) * 100)}%`;
    }
    function x(e, t) {
      return null == e ? "indeterminate" : e === t ? "complete" : "loading";
    }
    function h(e) {
      return "number" == typeof e;
    }
    function v(e) {
      return h(e) && !isNaN(e) && e > 0;
    }
    function b(e, t) {
      return h(e) && !isNaN(e) && e <= t && e >= 0;
    }
    function j(e, t) {
      return `Invalid prop \`max\` of value \`${e}\` supplied to \`${t}\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`;
    }
    function y(e, t) {
      return `Invalid prop \`value\` of value \`${e}\` supplied to \`${t}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
    }
    (o(p, "defaultGetValueLabel"),
      o(x, "getProgressState"),
      o(h, "isNumber"),
      o(v, "isValidMaxNumber"),
      o(b, "isValidValueNumber"),
      o(j, "getInvalidMaxError"),
      o(y, "getInvalidValueError"),
      e.s(
        [
          "Indicator",
          0,
          m,
          "Progress",
          0,
          f,
          "ProgressIndicator",
          0,
          m,
          "Root",
          0,
          f,
          "createProgressScope",
          0,
          c,
        ],
        676027,
      ));
    var D = e.i(676027),
      D = D;
    e.s(
      [
        "Progress",
        0,
        function ({ className: e, value: n, ...i }) {
          return (0, t.jsx)(D.Root, {
            "data-slot": "progress",
            className: (0, a.cn)(
              "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
              e,
            ),
            ...i,
            children: (0, t.jsx)(D.Indicator, {
              "data-slot": "progress-indicator",
              className: "h-full w-full flex-1 bg-primary transition-all",
              style: { transform: `translateX(-${100 - (n || 0)}%)` },
            }),
          });
        },
      ],
      287336,
    );
  },
  604131,
  (e) => {
    "use strict";
    var t = e.i(843476),
      a = e.i(271645),
      n = e.i(636607);
    let i = /^::(left|center|right|justify)::[ \t]?/;
    function r(e) {
      let t = i.exec(e);
      return t
        ? { align: t[1], text: e.slice(t[0].length) }
        : { align: void 0, text: e };
    }
    function s(e) {
      return !!e && /<[a-z][\s\S]*>/i.test(e);
    }
    let o =
      /^\s*<(?:p|div|li|blockquote|h[1-6])\b[\s\S]*<\/(?:p|div|li|blockquote|h[1-6])>\s*$/i;
    class l extends a.Component {
      constructor(e) {
        (super(e), (this.state = { hasError: !1 }));
      }
      static getDerivedStateFromError() {
        return { hasError: !0 };
      }
      render() {
        return this.state.hasError
          ? (0, t.jsxs)("span", {
              className:
                "rounded border border-rose-200 bg-rose-50 px-1 py-0.5 font-mono text-xs text-rose-600",
              children: ["$", this.props.fallbackText, "$"],
            })
          : this.props.children;
      }
    }
    let d = [
      [/\\(?:ne|neq)\b/g, "≠"],
      [/\\(?:ge|geq)\b/g, "≥"],
      [/\\(?:le|leq)\b/g, "≤"],
      [/\\pm\b/g, "±"],
      [/\\times\b/g, "×"],
      [/\\cdot\b/g, "·"],
      [/\\approx\b/g, "≈"],
      [/\\infty\b/g, "∞"],
      [/\\alpha\b/g, "α"],
      [/\\beta\b/g, "β"],
      [/\\gamma\b/g, "γ"],
      [/\\Delta\b/g, "Δ"],
      [/\\pi\b/g, "π"],
      [/\\in\b/g, "∈"],
      [/\\notin\b/g, "∉"],
      [/\\angle\b/g, "∠"],
      [/\\triangle\b/g, "△"],
      [/\\(?:circ|degree)\b/g, "°"],
      [/\\rightarrow\b/g, "→"],
      [/\\Rightarrow\b/g, "⇒"],
      [/\\Leftrightarrow\b/g, "⇔"],
    ];
    function c({ math: e }) {
      let a = e.trim();
      if (!a) return null;
      let i = a.replace(/\\ne\b/g, "\\neq");
      return (0, t.jsx)(l, {
        fallbackText: a,
        children: (0, t.jsx)(n.InlineMath, { math: i, errorColor: "#dc2626" }),
      });
    }
    function u({ math: e }) {
      let a = e.trim();
      if (!a) return null;
      let i = a.replace(/\\ne\b/g, "\\neq");
      return (0, t.jsx)(l, {
        fallbackText: a,
        children: (0, t.jsx)(n.BlockMath, { math: i, errorColor: "#dc2626" }),
      });
    }
    let g = {
      left: "block text-left",
      center: "block text-center",
      right: "block text-right",
      justify: "block text-justify",
    };
    function f(e) {
      return e
        ? (function (e) {
            let t = e;
            for (let [e, a] of d) t = t.replace(e, a);
            return t;
          })(e)
            .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
            .map((e, n) =>
              e.startsWith("**") && e.endsWith("**") && e.length > 4
                ? (0, t.jsx)("strong", { children: e.slice(2, -2) }, n)
                : e.startsWith("*") && e.endsWith("*") && e.length > 2
                  ? (0, t.jsx)("em", { children: e.slice(1, -1) }, n)
                  : (0, t.jsx)(a.Fragment, { children: e }, n),
            )
        : null;
    }
    e.s(
      [
        "RichText",
        0,
        function ({ text: e }) {
          return e
            ? (0, t.jsx)(t.Fragment, {
                children: (function (e) {
                  if (!e) return null;
                  let n = (function (e) {
                    if (!e || !s(e)) return e;
                    let t = e.split("\n");
                    return t.some((e) => void 0 !== r(e).align)
                      ? t
                          .map((e) => {
                            let { align: t, text: a } = r(e);
                            if (!t && o.test(a)) return a;
                            let n = t ? ` style="text-align: ${t}"` : "",
                              i = a
                                ? a
                                    .replace(
                                      /\*\*([^*]+)\*\*/g,
                                      "<strong>$1</strong>",
                                    )
                                    .replace(
                                      /(^|[^*])\*([^*]+)\*/g,
                                      "$1<em>$2</em>",
                                    )
                                : "<br>";
                            return `<p${n}>${i}</p>`;
                          })
                          .join("")
                      : e;
                  })(e);
                  if (s(n))
                    return Array.from(
                      new DOMParser().parseFromString(
                        `<body>${n}</body>`,
                        "text/html",
                      ).body.childNodes,
                    ).map((e, n) =>
                      (function e(n, i) {
                        if (n.nodeType === Node.TEXT_NODE) {
                          var r;
                          let e = n.textContent || "";
                          return (0, t.jsx)(
                            a.Fragment,
                            {
                              children: (r = e)
                                ? r
                                    .split(/\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g)
                                    .map((e, n) =>
                                      void 0 === e
                                        ? null
                                        : n % 3 == 1
                                          ? (0, t.jsx)(
                                              u,
                                              { math: e },
                                              `disp-${n}`,
                                            )
                                          : n % 3 == 2
                                            ? (0, t.jsx)(
                                                c,
                                                { math: e },
                                                `inl-${n}`,
                                              )
                                            : (0, t.jsx)(
                                                a.Fragment,
                                                { children: f(e) },
                                                `t-${n}`,
                                              ),
                                    )
                                : null,
                            },
                            i,
                          );
                        }
                        if (n.nodeType === Node.ELEMENT_NODE) {
                          let r = n.tagName.toLowerCase();
                          if (
                            "math" === n.getAttribute("data-type") ||
                            n.classList.contains("math-node")
                          ) {
                            let e = n.getAttribute("data-latex"),
                              a = "";
                            if (e) a = decodeURIComponent(e);
                            else {
                              let e = n.textContent || "",
                                t = /\$\$([\s\S]*?)\$\$|\$([^$]*)\$/g.exec(e);
                              a = t ? (t[1] ?? t[2] ?? "") : e;
                            }
                            return "true" === n.getAttribute("data-display")
                              ? (0, t.jsx)(u, { math: a }, i)
                              : (0, t.jsx)(c, { math: a }, i);
                          }
                          let s = Array.from(n.childNodes).map((t, a) =>
                              e(t, `${i}-${a}`),
                            ),
                            o = {};
                          (n.style.textAlign &&
                            (o.textAlign = n.style.textAlign),
                            n.style.fontSize && (o.fontSize = n.style.fontSize),
                            n.style.lineHeight &&
                              (o.lineHeight = n.style.lineHeight),
                            n.style.marginBottom &&
                              (o.marginBottom = n.style.marginBottom));
                          let l = Object.keys(o).length > 0 ? o : void 0;
                          switch (r) {
                            case "p":
                              return (0, t.jsx)(
                                "p",
                                {
                                  style: l,
                                  className:
                                    "center" === n.style.textAlign
                                      ? "text-center"
                                      : "right" === n.style.textAlign
                                        ? "text-right"
                                        : "justify" === n.style.textAlign
                                          ? "text-justify"
                                          : void 0,
                                  children:
                                    s.length > 0 ? s : (0, t.jsx)("br", {}),
                                },
                                i,
                              );
                            case "strong":
                            case "b":
                              return (0, t.jsx)(
                                "strong",
                                { style: l, children: s },
                                i,
                              );
                            case "em":
                            case "i":
                              return (0, t.jsx)(
                                "em",
                                { style: l, children: s },
                                i,
                              );
                            case "u":
                              return (0, t.jsx)(
                                "u",
                                { style: l, children: s },
                                i,
                              );
                            case "s":
                            case "strike":
                            case "del":
                              return (0, t.jsx)(
                                "s",
                                { style: l, children: s },
                                i,
                              );
                            case "sub":
                              return (0, t.jsx)(
                                "sub",
                                { style: l, children: s },
                                i,
                              );
                            case "sup":
                              return (0, t.jsx)(
                                "sup",
                                { style: l, children: s },
                                i,
                              );
                            case "br":
                              return (0, t.jsx)("br", {}, i);
                            case "span":
                              return (0, t.jsx)(
                                "span",
                                { style: l, children: s },
                                i,
                              );
                            default:
                              return (0, t.jsx)(a.Fragment, { children: s }, i);
                          }
                        }
                        return null;
                      })(e, n),
                    );
                  if (!n) return null;
                  let i = [],
                    l = n
                      .replace(
                        /\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g,
                        (e, a, n) => {
                          let r = i.length;
                          return (
                            void 0 !== a
                              ? i.push((0, t.jsx)(u, { math: a }, `bm-${r}`))
                              : i.push(
                                  (0, t.jsx)(c, { math: n ?? "" }, `im-${r}`),
                                ),
                            `\u0000MATH_${r}\u0000`
                          );
                        },
                      )
                      .split("\n")
                      .map(r);
                  return l.map((e, n) => {
                    var r, s;
                    let o = void 0 !== e.align,
                      d = l[n + 1]?.align !== void 0,
                      c =
                        ((r = e.text),
                        (s = i),
                        r
                          ? r
                              .split(/\u0000MATH_(\d+)\u0000/g)
                              .map((e, n) =>
                                n % 2 == 1
                                  ? (s[parseInt(e, 10)] ?? null)
                                  : (0, t.jsx)(
                                      a.Fragment,
                                      { children: f(e) },
                                      n,
                                    ),
                              )
                          : null);
                    return (0, t.jsxs)(
                      a.Fragment,
                      {
                        children: [
                          o
                            ? (0, t.jsx)("span", {
                                className: g[e.align],
                                children: c,
                              })
                            : c,
                          n < l.length - 1 && !o && !d && (0, t.jsx)("br", {}),
                        ],
                      },
                      n,
                    );
                  });
                })(e),
              })
            : null;
        },
      ],
      604131,
    );
  },
  375727,
  (e) => {
    "use strict";
    var t = e.i(843476),
      a = e.i(490985),
      n = e.i(632781),
      i = e.i(328623),
      r = e.i(522016),
      s = e.i(271645),
      o = e.i(781947),
      l = e.i(167881),
      d = e.i(630374),
      c = e.i(715760),
      u = e.i(799887),
      g = e.i(775691),
      f = e.i(42118),
      m = e.i(452022),
      p = e.i(11485),
      x = e.i(310900),
      h = e.i(389567);
    e.s([
      "ShareExamDialog",
      0,
      function ({
        open: e,
        onOpenChange: v,
        documentId: b,
        title: j,
        beforeShare: y,
      }) {
        let { options: D } = (0, x.useMetadataOptions)(),
          [C, w] = (0, s.useState)(""),
          [N, A] = (0, s.useState)(""),
          [R, T] = (0, s.useState)(""),
          [S, k] = (0, s.useState)(null),
          [P, $] = (0, s.useState)([]),
          [O, M] = (0, s.useState)(!1),
          [_, I] = (0, s.useState)(""),
          [z, E] = (0, s.useState)(""),
          L = (0, s.useCallback)(
            () =>
              Promise.all([
                (0, u.getMissions)().catch(() => null),
                (0, u.listSubmissions)({
                  documentId: b,
                  kind: "exam",
                  limit: 10,
                }),
              ]).then(([e, t]) => {
                (k(e?.missions.find((e) => "share_exam" === e.id) ?? null),
                  $(t.submissions));
              }),
            [b],
          );
        (0, s.useEffect)(() => {
          e && L().catch((e) => I(e.message));
        }, [e, L]);
        let B = (e) => {
            O || (e || (I(""), E("")), v(e));
          },
          F = P.some((e) => "pending" === e.status || "reviewing" === e.status);
        (0, s.useEffect)(() => {
          if (!e || !F) return;
          let t = window.setInterval(() => void L().catch(() => {}), 5e3);
          return () => window.clearInterval(t);
        }, [e, F, L]);
        let H = async () => {
          (M(!0), I(""), E(""));
          try {
            await y?.();
            let e = await (0, u.shareDocument)(b, {
              subject: C || void 0,
              grade: N ? Number(N) : void 0,
              examType: R || void 0,
            });
            ((0, h.track)("exam_share", { missionCounted: e.missionCounted }),
              E(
                e.missionCounted
                  ? "Đã gửi đề để xét duyệt. Lượt này được tính cho nhiệm vụ “Chia sẻ đề thi”."
                  : "Đã gửi đề để xét duyệt. Lượt này không được tính thưởng (nhiệm vụ đã hết lượt hoặc đang tắt).",
              ),
              await L());
          } catch (e) {
            (e instanceof c.ApiError &&
              401 === e.status &&
              (0, g.requestLogin)(),
              I(e instanceof Error ? e.message : "Không chia sẻ được đề."));
          } finally {
            M(!1);
          }
        };
        return (0, t.jsx)(d.Dialog, {
          open: e,
          onOpenChange: B,
          children: (0, t.jsxs)(d.DialogContent, {
            className: "max-h-[90dvh] overflow-y-auto sm:max-w-2xl",
            children: [
              (0, t.jsxs)(d.DialogHeader, {
                children: [
                  (0, t.jsxs)(d.DialogTitle, {
                    className: "flex items-center gap-2 text-xl font-normal",
                    children: [
                      (0, t.jsx)(a.Globe2, {
                        "aria-hidden": !0,
                        className: "size-5 text-[#2383e2]",
                      }),
                      " Chia sẻ “",
                      j || "Đề thi",
                      "” lên cộng đồng",
                    ],
                  }),
                  (0, t.jsx)(d.DialogDescription, {
                    children:
                      "Đề cần có nội dung thật sự mới và sẽ được xét duyệt trước khi được chia sẻ cho mọi người.",
                  }),
                ],
              }),
              S &&
                (0, t.jsxs)("div", {
                  className: "rounded-xl bg-[#f7f6f3] p-3 text-sm",
                  children: [
                    (0, t.jsxs)("p", {
                      className:
                        "flex items-center gap-1.5 font-medium text-[#37352f]",
                      children: [
                        (0, t.jsx)(i.Sparkles, {
                          "aria-hidden": !0,
                          className: "size-4 text-[#2383e2]",
                        }),
                        " Nhiệm vụ: ",
                        S.title,
                      ],
                    }),
                    (0, t.jsx)("p", {
                      className: "mt-1 text-[#5f5e5b]",
                      children: (0, f.missionRewardText)(S),
                    }),
                    (0, t.jsxs)("p", {
                      className: "text-[#5f5e5b]",
                      children: [
                        (0, f.missionAttemptsText)(S),
                        " · ",
                        (0, f.missionResetText)(S),
                      ],
                    }),
                    !(0, f.missionAvailable)(S) &&
                      (0, t.jsx)("p", {
                        className: "mt-1 text-[#8a5a00]",
                        children:
                          "Bạn đã hết lượt trong chu kỳ này: vẫn chia sẻ được nhưng không nhận thưởng.",
                      }),
                    (0, t.jsx)(r.default, {
                      href: "/missions",
                      className:
                        "mt-1 inline-block text-[#2383e2] hover:underline",
                      children: "Xem tất cả nhiệm vụ",
                    }),
                  ],
                }),
              (0, t.jsxs)("div", {
                className: "grid gap-3 sm:grid-cols-3",
                children: [
                  (0, t.jsx)(m.MetadataSelect, {
                    label: "Môn học",
                    value: C,
                    options: D?.subjects ?? [],
                    onChange: w,
                    noneLabel: "Tự động nhận diện",
                  }),
                  (0, t.jsx)(m.MetadataSelect, {
                    label: "Lớp",
                    value: N,
                    options: (0, m.gradeOptions)(D?.grades ?? []),
                    onChange: A,
                    noneLabel: "Tự động nhận diện",
                  }),
                  (0, t.jsx)(m.MetadataSelect, {
                    label: "Loại đề",
                    value: R,
                    options: D?.examTypes ?? [],
                    onChange: T,
                    noneLabel: "Tự động nhận diện",
                  }),
                ],
              }),
              _ &&
                (0, t.jsx)(o.Alert, {
                  variant: "destructive",
                  children: (0, t.jsx)(o.AlertDescription, { children: _ }),
                }),
              z &&
                (0, t.jsx)(o.Alert, {
                  children: (0, t.jsx)(o.AlertDescription, { children: z }),
                }),
              P.length > 0 &&
                (0, t.jsxs)("div", {
                  className: "space-y-2",
                  children: [
                    (0, t.jsx)("p", {
                      className: "text-sm font-medium text-[#5f5e5b]",
                      children: "Các lần chia sẻ đề này",
                    }),
                    P.map((e) =>
                      (0, t.jsx)(
                        p.SubmissionCard,
                        { submission: e, compact: !0 },
                        e.id,
                      ),
                    ),
                  ],
                }),
              (0, t.jsxs)(d.DialogFooter, {
                children: [
                  (0, t.jsx)(l.Button, {
                    variant: "outline",
                    onClick: () => B(!1),
                    disabled: O,
                    children: "Đóng",
                  }),
                  (0, t.jsxs)(l.Button, {
                    onClick: H,
                    disabled: O || F,
                    children: [
                      O &&
                        (0, t.jsx)(n.Loader2, {
                          "aria-hidden": !0,
                          className: "animate-spin",
                        }),
                      F ? "Đang chờ duyệt…" : "Gửi chia sẻ",
                    ],
                  }),
                ],
              }),
            ],
          }),
        });
      },
    ]);
  },
  11485,
  (e) => {
    "use strict";
    var t = e.i(843476),
      a = e.i(716327),
      n = e.i(226091),
      i = e.i(576248),
      r = e.i(328623),
      s = e.i(271645),
      o = e.i(994179),
      l = e.i(981140),
      d = e.i(30030),
      c = e.i(369340),
      u = e.i(934620),
      g = e.i(820783),
      f = e.i(248425),
      m = e.i(296626),
      p = e.i(610772),
      x = Object.defineProperty,
      h = (e, t) => x(e, "name", { value: t, configurable: !0 }),
      v = "Collapsible",
      [b, j] = (0, d.createContextScope)(v),
      [y, D] = b(v),
      C = s.forwardRef(
        h(function (e, a) {
          let {
              __scopeCollapsible: n,
              open: i,
              defaultOpen: r,
              disabled: o,
              onOpenChange: l,
              ...d
            } = e,
            [u, g] = (0, c.useControllableState)({
              prop: i,
              defaultProp: r ?? !1,
              onChange: l,
              caller: v,
            });
          return (0, t.jsx)(y, {
            scope: n,
            disabled: o,
            contentId: (0, p.useId)(),
            open: u,
            onOpenToggle: s.useCallback(() => g((e) => !e), [g]),
            children: (0, t.jsx)(f.Primitive.div, {
              "data-state": T(u),
              "data-disabled": o ? "" : void 0,
              ...d,
              ref: a,
            }),
          });
        }, "Collapsible"),
      ),
      w = s.forwardRef(
        h(function (e, a) {
          let { __scopeCollapsible: n, ...i } = e,
            r = D("CollapsibleTrigger", n);
          return (0, t.jsx)(f.Primitive.button, {
            type: "button",
            "aria-controls": r.open ? r.contentId : void 0,
            "aria-expanded": r.open || !1,
            "data-state": T(r.open),
            "data-disabled": r.disabled ? "" : void 0,
            disabled: r.disabled,
            ...i,
            ref: a,
            onClick: (0, l.composeEventHandlers)(e.onClick, r.onOpenToggle),
          });
        }, "CollapsibleTrigger"),
      ),
      N = "CollapsibleContent",
      A = s.forwardRef(
        h(function (e, a) {
          let { forceMount: n, ...i } = e,
            r = D(N, e.__scopeCollapsible);
          return (0, t.jsx)(m.Presence, {
            present: n || r.open,
            children: ({ present: e }) =>
              (0, t.jsx)(R, { ...i, ref: a, present: e }),
          });
        }, "CollapsibleContent"),
      ),
      R = s.forwardRef(
        h(function (e, a) {
          let { __scopeCollapsible: n, present: i, children: r, ...o } = e,
            l = D(N, n),
            [d, c] = s.useState(i),
            m = s.useRef(null),
            p = (0, g.useComposedRefs)(a, m),
            x = s.useRef(0),
            h = x.current,
            v = s.useRef(0),
            b = v.current,
            j = l.open || d,
            y = s.useRef(j),
            C = s.useRef(void 0);
          return (
            s.useEffect(() => {
              let e = requestAnimationFrame(() => (y.current = !1));
              return () => cancelAnimationFrame(e);
            }, []),
            (0, u.useLayoutEffect)(() => {
              let e = m.current;
              if (e) {
                ((C.current = C.current || {
                  transitionDuration: e.style.transitionDuration,
                  animationName: e.style.animationName,
                }),
                  (e.style.transitionDuration = "0s"),
                  (e.style.animationName = "none"));
                let t = e.getBoundingClientRect();
                ((x.current = t.height),
                  (v.current = t.width),
                  y.current ||
                    ((e.style.transitionDuration =
                      C.current.transitionDuration),
                    (e.style.animationName = C.current.animationName)),
                  c(i));
              }
            }, [l.open, i]),
            (0, t.jsx)(f.Primitive.div, {
              "data-state": T(l.open),
              "data-disabled": l.disabled ? "" : void 0,
              id: l.contentId,
              hidden: !j,
              ...o,
              ref: p,
              style: {
                "--radix-collapsible-content-height": h ? `${h}px` : void 0,
                "--radix-collapsible-content-width": b ? `${b}px` : void 0,
                ...e.style,
              },
              children: j && r,
            })
          );
        }, "CollapsibleContentImpl"),
      );
    function T(e) {
      return e ? "open" : "closed";
    }
    (h(T, "getState"),
      e.s(
        [
          "Collapsible",
          0,
          C,
          "CollapsibleContent",
          0,
          A,
          "CollapsibleTrigger",
          0,
          w,
          "Content",
          0,
          A,
          "Root",
          0,
          C,
          "Trigger",
          0,
          w,
          "createCollapsibleScope",
          0,
          j,
        ],
        687607,
      ));
    var S = e.i(687607),
      S = S;
    function k({ ...e }) {
      return (0, t.jsx)(S.Root, { "data-slot": "collapsible", ...e });
    }
    function P({ ...e }) {
      return (0, t.jsx)(S.CollapsibleTrigger, {
        "data-slot": "collapsible-trigger",
        ...e,
      });
    }
    function $({ ...e }) {
      return (0, t.jsx)(S.CollapsibleContent, {
        "data-slot": "collapsible-content",
        ...e,
      });
    }
    var O = e.i(604131),
      M = e.i(42118),
      _ = e.i(647163);
    let I = {
        pending: "bg-[#fef7e0] text-[#8a5a00]",
        reviewing: "bg-[#e7f3f8] text-[#2383e2]",
        awaiting_admin: "bg-[#fef7e0] text-[#8a5a00]",
        approved: "bg-[#dbeddb] text-[#1c3829]",
        rejected: "bg-[#fdebec] text-[#a50e0e]",
        failed: "bg-[#fdebec] text-[#a50e0e]",
      },
      z = {
        novel: "bg-[#dbeddb] text-[#1c3829]",
        variant: "bg-[#fef7e0] text-[#8a5a00]",
        duplicate: "bg-[#fdebec] text-[#a50e0e]",
        common: "bg-[#f1f1ef] text-[#5f5e5b]",
        invalid: "bg-[#fdebec] text-[#a50e0e]",
      };
    function E({ status: e }) {
      return (0, t.jsx)(o.Badge, {
        className: (0, _.cn)("border-0 font-medium", I[e]),
        children: M.STATUS_LABEL[e],
      });
    }
    e.s(
      [
        "SubmissionCard",
        0,
        function ({ submission: e, compact: l }) {
          let [d, c] = (0, s.useState)(!1),
            u = e.review?.questions ?? [],
            g =
              "pending" === e.status ||
              "reviewing" === e.status ||
              "awaiting_admin" === e.status;
          return (0, t.jsxs)("div", {
            className: "rounded-xl border border-[#e9e9e7] bg-white p-4",
            children: [
              (0, t.jsxs)("div", {
                className: "flex items-start gap-3",
                children: [
                  (0, t.jsx)("span", {
                    className:
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e7f3f8] text-[#2383e2]",
                    children:
                      "exam" === e.kind
                        ? (0, t.jsx)(n.FileText, {
                            "aria-hidden": !0,
                            className: "size-4",
                          })
                        : (0, t.jsx)(i.HelpCircle, {
                            "aria-hidden": !0,
                            className: "size-4",
                          }),
                  }),
                  (0, t.jsxs)("div", {
                    className: "min-w-0 flex-1",
                    children: [
                      (0, t.jsxs)("div", {
                        className: "flex flex-wrap items-center gap-2",
                        children: [
                          (0, t.jsx)("p", {
                            className:
                              "min-w-0 truncate font-medium text-[#37352f]",
                            children: e.title || "Không tên",
                          }),
                          (0, t.jsx)(E, { status: e.status }),
                          e.rewardPoints > 0 &&
                            (0, t.jsxs)(o.Badge, {
                              className: "border-0 bg-[#dbeddb] text-[#1c3829]",
                              children: [
                                (0, t.jsx)(r.Sparkles, { "aria-hidden": !0 }),
                                " +",
                                e.rewardPoints.toLocaleString("vi-VN"),
                                " điểm",
                              ],
                            }),
                          "approved" === e.status &&
                            "exam" === e.kind &&
                            !e.published &&
                            (0, t.jsx)(o.Badge, {
                              variant: "outline",
                              children: "Đã bị ẩn khỏi cộng đồng",
                            }),
                        ],
                      }),
                      (0, t.jsxs)("p", {
                        className: "mt-1 text-xs text-[#787774]",
                        children: [
                          "exam" === e.kind ? "Đề thi" : "Câu hỏi",
                          " · gửi ",
                          (0, M.formatDateTime)(e.createdAt),
                          e.reviewedAt &&
                            ` \xb7 duyệt ${(0, M.formatDateTime)(e.reviewedAt)}`,
                          e.missionId
                            ? " · tính cho nhiệm vụ"
                            : " · không tính nhiệm vụ",
                        ],
                      }),
                      (e.reason || g) &&
                        (0, t.jsx)("p", {
                          className: "mt-2 text-sm text-[#5f5e5b]",
                          children:
                            e.reason ||
                            "Bài của bạn đang được xét duyệt. Kết quả sẽ tự cập nhật.",
                        }),
                      !l &&
                        e.excerpt &&
                        "question" === e.kind &&
                        (0, t.jsx)("p", {
                          className:
                            "mt-2 line-clamp-3 whitespace-pre-wrap rounded-md bg-[#f7f6f3] p-2 text-sm text-[#3c4043]",
                          children: (0, t.jsx)(O.RichText, { text: e.excerpt }),
                        }),
                    ],
                  }),
                ],
              }),
              u.length > 0 &&
                (0, t.jsxs)(k, {
                  open: d,
                  onOpenChange: c,
                  className: "mt-3",
                  children: [
                    (0, t.jsxs)(P, {
                      className:
                        "flex items-center gap-1 text-sm font-medium text-[#2383e2] hover:underline",
                      children: [
                        (0, t.jsx)(a.ChevronDown, {
                          "aria-hidden": !0,
                          className: (0, _.cn)(
                            "size-4 transition-transform",
                            d && "rotate-180",
                          ),
                        }),
                        "Chi tiết từng câu (",
                        e.novelCount,
                        "/",
                        u.length,
                        " câu mới)",
                      ],
                    }),
                    (0, t.jsx)($, {
                      children: (0, t.jsx)("ol", {
                        className: "mt-3 space-y-2",
                        children: u.map((e) =>
                          (0, t.jsxs)(
                            "li",
                            {
                              className:
                                "rounded-lg border border-[#e9e9e7] p-3",
                              children: [
                                (0, t.jsxs)("div", {
                                  className:
                                    "flex flex-wrap items-center gap-2",
                                  children: [
                                    (0, t.jsx)("span", {
                                      className: "text-sm font-medium",
                                      children: e.number || `C\xe2u ${e.index}`,
                                    }),
                                    (0, t.jsx)(o.Badge, {
                                      className: (0, _.cn)(
                                        "border-0",
                                        z[e.verdict] ?? z.variant,
                                      ),
                                      children:
                                        M.VERDICT_LABEL[e.verdict] ?? e.verdict,
                                    }),
                                  ],
                                }),
                                (0, t.jsx)("p", {
                                  className:
                                    "mt-1 line-clamp-3 text-sm text-[#787774]",
                                  children: (0, t.jsx)(O.RichText, {
                                    text: e.stem,
                                  }),
                                }),
                                e.reason &&
                                  (0, t.jsx)("p", {
                                    className: "mt-1 text-sm text-[#37352f]",
                                    children: (0, t.jsx)(O.RichText, {
                                      text: e.reason,
                                    }),
                                  }),
                                (e.candidates ?? []).length > 0 &&
                                  (0, t.jsx)("p", {
                                    className:
                                      "mt-2 rounded-md bg-[#f7f6f3] p-2 text-xs text-[#787774]",
                                    children:
                                      "Câu này giống với nội dung đã có trên hệ thống.",
                                  }),
                              ],
                            },
                            e.index,
                          ),
                        ),
                      }),
                    }),
                  ],
                }),
            ],
          });
        },
      ],
      11485,
    );
  },
  42118,
  (e) => {
    "use strict";
    let t = "Asia/Ho_Chi_Minh";
    function a(e) {
      let t = ["B", "KB", "MB", "GB", "TB"],
        a = Math.max(0, e),
        n = 0;
      for (; a >= 1024 && n < t.length - 1; ) ((a /= 1024), n++);
      let i = 0 === n || a >= 100 ? 0 : 1;
      return `${a.toFixed(i).replace(".", ",").replace(/,0$/, "")} ${t[n]}`;
    }
    function n(e) {
      return e
        ? new Date(e).toLocaleString("vi-VN", {
            timeZone: t,
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "";
    }
    function i(e) {
      return e
        ? new Date(e).toLocaleDateString("vi-VN", {
            timeZone: t,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "";
    }
    function r(e) {
      let t =
        e % 168 == 0
          ? { size: e / 168, label: "tuần" }
          : e % 24 == 0
            ? { size: e / 24, label: "ngày" }
            : { size: e, label: "giờ" };
      return 1 === t.size ? `mỗi ${t.label}` : `mỗi ${t.size} ${t.label}`;
    }
    e.s([
      "STATUS_LABEL",
      0,
      {
        pending: "Chờ duyệt",
        reviewing: "Đang xét duyệt",
        awaiting_admin: "Chờ quản trị viên duyệt",
        approved: "Đã duyệt",
        rejected: "Không được duyệt",
        failed: "Chưa duyệt được",
      },
      "VERDICT_LABEL",
      0,
      {
        novel: "Câu mới",
        variant: "Gần giống câu đã có",
        duplicate: "Đã có trên hệ thống",
        common: "Nội dung phổ biến",
        invalid: "Không hợp lệ",
      },
      "formatBytes",
      0,
      a,
      "formatDate",
      0,
      i,
      "formatDateTime",
      0,
      n,
      "formatRecent",
      0,
      function (e, a = new Date()) {
        let n = new Date(e);
        return n.toLocaleDateString("vi-VN", { timeZone: t }) ===
          a.toLocaleDateString("vi-VN", { timeZone: t })
          ? n.toLocaleTimeString("vi-VN", {
              timeZone: t,
              hour: "2-digit",
              minute: "2-digit",
            })
          : i(e);
      },
      "isClaimMission",
      0,
      function (e) {
        return "daily_checkin" === e.kind || "link_share" === e.kind;
      },
      "missionAttemptsText",
      0,
      function (e) {
        return null === e.maxAttempts
          ? `Đ\xe3 l\xe0m ${e.attemptsUsed} lượt`
          : `Đ\xe3 d\xf9ng ${e.attemptsUsed}/${e.maxAttempts} lượt`;
      },
      "missionAvailable",
      0,
      function (e) {
        return (
          e.enabled && (null === e.attemptsRemaining || e.attemptsRemaining > 0)
        );
      },
      "missionResetText",
      0,
      function (e) {
        return null === e.resetHours
          ? "Không làm mới"
          : `L\xe0m mới ${r(e.resetHours)} \xb7 lần tới ${n(e.nextResetAt)}`;
      },
      "missionRewardText",
      0,
      function (e) {
        return e.rewardPoints > 0
          ? `+${e.rewardPoints.toLocaleString("vi-VN")} điểm t\xedn dụng AI mỗi lượt được duyệt`
          : "Chưa có điểm thưởng";
      },
      "resetPeriodText",
      0,
      r,
      "storageLimitNote",
      0,
      function (e) {
        let t = e.override;
        return t?.active
          ? t.expiresAt
            ? `Hạn mức ${a(t.limitBytes)} đến ${n(t.expiresAt)}, sau đ\xf3 về mức ${a(e.defaultLimitBytes)}.`
            : `Hạn mức ${a(t.limitBytes)}, kh\xf4ng thời hạn.`
          : `Hạn mức ${a(e.defaultLimitBytes)}.`;
      },
      "storageRatio",
      0,
      function (e) {
        return e.limitBytes <= 0
          ? +(e.usedBytes > 0)
          : Math.min(1, e.usedBytes / e.limitBytes);
      },
    ]);
  },
  326999,
  (e) => {
    "use strict";
    var t = e.i(271645),
      a = e.i(981140),
      n = e.i(820783),
      i = e.i(30030),
      r = e.i(610772),
      s = e.i(369340),
      o = e.i(726330),
      l = e.i(765491),
      d = e.i(774606),
      c = e.i(296626),
      u = e.i(248425),
      g = e.i(303536),
      f = e.i(934620),
      m = e.i(985369),
      p = e.i(186312),
      x = e.i(991918),
      h = e.i(843476),
      v = Object.defineProperty,
      b = (e, t) => v(e, "name", { value: t, configurable: !0 }),
      j = "Dialog",
      [y, D] = (0, i.createContextScope)(j),
      [C, w] = y(j),
      N = b((e) => {
        let {
            __scopeDialog: a,
            children: n,
            open: i,
            defaultOpen: o,
            onOpenChange: l,
            modal: d = !0,
          } = e,
          c = t.useRef(null),
          u = t.useRef(null),
          [g, f] = (0, s.useControllableState)({
            prop: i,
            defaultProp: o ?? !1,
            onChange: l,
            caller: j,
          }),
          [m, p] = t.useState(0),
          [x, v] = t.useState(0);
        return (0, h.jsx)(C, {
          scope: a,
          triggerRef: c,
          contentRef: u,
          contentId: (0, r.useId)(),
          titleId: (0, r.useId)(),
          descriptionId: (0, r.useId)(),
          titlePresent: m > 0,
          descriptionPresent: x > 0,
          setTitleCount: p,
          setDescriptionCount: v,
          open: g,
          onOpenChange: f,
          onOpenToggle: t.useCallback(() => f((e) => !e), [f]),
          modal: d,
          children: n,
        });
      }, "Dialog"),
      A = t.forwardRef(
        b(function (e, t) {
          let { __scopeDialog: i, ...r } = e,
            s = w("DialogTrigger", i),
            o = (0, n.useComposedRefs)(t, s.triggerRef);
          return (0, h.jsx)(u.Primitive.button, {
            type: "button",
            "aria-haspopup": "dialog",
            "aria-expanded": s.open,
            "aria-controls": s.open ? s.contentId : void 0,
            "data-state": q(s.open),
            ...r,
            ref: o,
            onClick: (0, a.composeEventHandlers)(e.onClick, s.onOpenToggle),
          });
        }, "DialogTrigger"),
      ),
      R = "DialogPortal",
      [T, S] = y(R, { forceMount: void 0 }),
      k = b((e) => {
        let { __scopeDialog: a, forceMount: n, children: i, container: r } = e,
          s = w(R, a);
        return (0, h.jsx)(T, {
          scope: a,
          forceMount: n,
          children: t.Children.map(i, (e) =>
            (0, h.jsx)(c.Presence, {
              present: n || s.open,
              children: (0, h.jsx)(d.Portal, {
                asChild: !0,
                container: r,
                children: e,
              }),
            }),
          ),
        });
      }, "DialogPortal"),
      P = "DialogOverlay",
      $ = t.forwardRef(
        b(function (e, t) {
          let a = S(P, e.__scopeDialog),
            { forceMount: n = a.forceMount, ...i } = e,
            r = w(P, e.__scopeDialog);
          return r.modal
            ? (0, h.jsx)(c.Presence, {
                present: n || r.open,
                children: (0, h.jsx)(M, { ...i, ref: t }),
              })
            : null;
        }, "DialogOverlay"),
      ),
      O = (0, x.createSlot)("DialogOverlay.RemoveScroll"),
      M = t.forwardRef(
        b(function (e, t) {
          let { __scopeDialog: a, ...i } = e,
            r = w(P, a),
            s = (0, o.useDismissableLayerSurface)(),
            l = (0, n.useComposedRefs)(t, s);
          return (0, h.jsx)(m.RemoveScroll, {
            as: O,
            allowPinchZoom: !0,
            shards: [r.contentRef],
            children: (0, h.jsx)(u.Primitive.div, {
              "data-state": q(r.open),
              ...i,
              ref: l,
              style: { pointerEvents: "auto", ...i.style },
            }),
          });
        }, "DialogOverlayImpl"),
      ),
      _ = "DialogContent",
      I = t.forwardRef(
        b(function (e, t) {
          let a = S(_, e.__scopeDialog),
            { forceMount: n = a.forceMount, ...i } = e,
            r = w(_, e.__scopeDialog);
          return (0, h.jsx)(c.Presence, {
            present: n || r.open,
            children: r.modal
              ? (0, h.jsx)(z, { ...i, ref: t })
              : (0, h.jsx)(E, { ...i, ref: t }),
          });
        }, "DialogContent"),
      ),
      z = t.forwardRef(
        b(function (e, i) {
          let r = w(_, e.__scopeDialog),
            s = t.useRef(null),
            o = (0, n.useComposedRefs)(i, r.contentRef, s);
          return (
            t.useEffect(() => {
              let e = s.current;
              if (e) return (0, p.hideOthers)(e);
            }, []),
            (0, h.jsx)(L, {
              ...e,
              ref: o,
              trapFocus: r.open,
              disableOutsidePointerEvents: r.open,
              onCloseAutoFocus: (0, a.composeEventHandlers)(
                e.onCloseAutoFocus,
                (e) => {
                  (e.preventDefault(), r.triggerRef.current?.focus());
                },
              ),
              onPointerDownOutside: (0, a.composeEventHandlers)(
                e.onPointerDownOutside,
                (e) => {
                  let t = e.detail.originalEvent,
                    a = 0 === t.button && !0 === t.ctrlKey;
                  (2 === t.button || a) && e.preventDefault();
                },
              ),
              onFocusOutside: (0, a.composeEventHandlers)(
                e.onFocusOutside,
                (e) => e.preventDefault(),
              ),
            })
          );
        }, "DialogContentModal"),
      ),
      E = t.forwardRef(
        b(function (e, a) {
          let n = w(_, e.__scopeDialog),
            i = t.useRef(!1),
            r = t.useRef(!1);
          return (0, h.jsx)(L, {
            ...e,
            ref: a,
            trapFocus: !1,
            disableOutsidePointerEvents: !1,
            onCloseAutoFocus: (t) => {
              (e.onCloseAutoFocus?.(t),
                t.defaultPrevented ||
                  (i.current || n.triggerRef.current?.focus(),
                  t.preventDefault()),
                (i.current = !1),
                (r.current = !1));
            },
            onInteractOutside: (t) => {
              (e.onInteractOutside?.(t),
                t.defaultPrevented ||
                  ((i.current = !0),
                  "pointerdown" === t.detail.originalEvent.type &&
                    (r.current = !0)));
              let a = t.target;
              (n.triggerRef.current?.contains(a) && t.preventDefault(),
                "focusin" === t.detail.originalEvent.type &&
                  r.current &&
                  t.preventDefault());
            },
          });
        }, "DialogContentNonModal"),
      ),
      L = t.forwardRef(
        b(function (e, t) {
          let {
              __scopeDialog: a,
              trapFocus: n,
              onOpenAutoFocus: i,
              onCloseAutoFocus: r,
              ...s
            } = e,
            d = w(_, a);
          return (
            (0, g.useFocusGuards)(),
            (0, h.jsx)(h.Fragment, {
              children: (0, h.jsx)(l.FocusScope, {
                asChild: !0,
                loop: !0,
                trapped: n,
                onMountAutoFocus: i,
                onUnmountAutoFocus: r,
                children: (0, h.jsx)(o.DismissableLayer, {
                  role: "dialog",
                  id: d.contentId,
                  "aria-describedby": d.descriptionPresent
                    ? d.descriptionId
                    : void 0,
                  "aria-labelledby": d.titlePresent ? d.titleId : void 0,
                  "data-state": q(d.open),
                  ...s,
                  ref: t,
                  deferPointerDownOutside: !0,
                  onDismiss: () => d.onOpenChange(!1),
                }),
              }),
            })
          );
        }, "DialogContentImpl"),
      ),
      B = t.forwardRef(
        b(function (e, t) {
          let { __scopeDialog: a, ...n } = e,
            i = w("DialogTitle", a),
            { setTitleCount: r } = i;
          return (
            (0, f.useLayoutEffect)(
              () => (r((e) => e + 1), () => r((e) => e - 1)),
              [r],
            ),
            (0, h.jsx)(u.Primitive.h2, { id: i.titleId, ...n, ref: t })
          );
        }, "DialogTitle"),
      ),
      F = t.forwardRef(
        b(function (e, t) {
          let { __scopeDialog: a, ...n } = e,
            i = w("DialogDescription", a),
            { setDescriptionCount: r } = i;
          return (
            (0, f.useLayoutEffect)(
              () => (r((e) => e + 1), () => r((e) => e - 1)),
              [r],
            ),
            (0, h.jsx)(u.Primitive.p, { id: i.descriptionId, ...n, ref: t })
          );
        }, "DialogDescription"),
      ),
      H = t.forwardRef(
        b(function (e, t) {
          let { __scopeDialog: n, ...i } = e,
            r = w("DialogClose", n);
          return (0, h.jsx)(u.Primitive.button, {
            type: "button",
            ...i,
            ref: t,
            onClick: (0, a.composeEventHandlers)(e.onClick, () =>
              r.onOpenChange(!1),
            ),
          });
        }, "DialogClose"),
      ),
      V = b((e) => e.children, "WarningProvider");
    function q(e) {
      return e ? "open" : "closed";
    }
    (b(q, "getState"),
      e.s([
        "Close",
        0,
        H,
        "Content",
        0,
        I,
        "Description",
        0,
        F,
        "Dialog",
        0,
        N,
        "DialogClose",
        0,
        H,
        "DialogContent",
        0,
        I,
        "DialogDescription",
        0,
        F,
        "DialogOverlay",
        0,
        $,
        "DialogPortal",
        0,
        k,
        "DialogTitle",
        0,
        B,
        "DialogTrigger",
        0,
        A,
        "Overlay",
        0,
        $,
        "Portal",
        0,
        k,
        "Root",
        0,
        N,
        "Title",
        0,
        B,
        "Trigger",
        0,
        A,
        "WarningProvider",
        0,
        V,
        "createDialogScope",
        0,
        D,
      ]));
  },
  964053,
  (e) => {
    "use strict";
    var t = e.i(326999);
    e.s(["Dialog", 0, t]);
  },
  716327,
  (e) => {
    "use strict";
    var t = e.i(26495);
    e.s(["ChevronDown", () => t.default]);
  },
  986253,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("chevron-right", [
      ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }],
    ]);
    e.s(["default", 0, t]);
  },
  576248,
  (e) => {
    "use strict";
    var t = e.i(275043);
    e.s(["HelpCircle", () => t.default]);
  },
  490985,
  452022,
  (e) => {
    "use strict";
    var t = e.i(503678);
    e.s(["Globe2", () => t.default], 490985);
    var a = e.i(843476),
      n = e.i(10708),
      i = e.i(62870);
    let r = "__none__";
    e.s(
      [
        "MetadataSelect",
        0,
        function ({
          label: e,
          value: t,
          options: s,
          onChange: o,
          placeholder: l = "Chọn",
          noneLabel: d,
          required: c,
          disabled: u,
        }) {
          return (0, a.jsxs)(n.Label, {
            className: "grid gap-1.5 text-[13px] font-medium text-[#5f5e5b]",
            children: [
              (0, a.jsxs)("span", {
                children: [
                  e,
                  c &&
                    (0, a.jsx)("span", {
                      className: "text-[#eb5757]",
                      children: " *",
                    }),
                ],
              }),
              (0, a.jsxs)(i.Select, {
                value: "" === t ? (d ? r : "") : t,
                onValueChange: (e) => o(e === r ? "" : e),
                disabled: u,
                children: [
                  (0, a.jsx)(i.SelectTrigger, {
                    className: "w-full bg-white",
                    "aria-label": e,
                    children: (0, a.jsx)(i.SelectValue, { placeholder: l }),
                  }),
                  (0, a.jsxs)(i.SelectContent, {
                    className: "max-h-72",
                    children: [
                      d && (0, a.jsx)(i.SelectItem, { value: r, children: d }),
                      s.map((e) =>
                        (0, a.jsx)(
                          i.SelectItem,
                          { value: e.value, children: e.label },
                          e.value,
                        ),
                      ),
                    ],
                  }),
                ],
              }),
            ],
          });
        },
        "gradeOptions",
        0,
        (e) => e.map((e) => ({ value: String(e), label: `Lớp ${e}` })),
      ],
      452022,
    );
  },
  446849,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("ellipsis-vertical", [
      ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
      ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
      ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }],
    ]);
    e.s(["default", 0, t]);
  },
  189904,
  (e) => {
    "use strict";
    var t = e.i(446849);
    e.s(["MoreVertical", () => t.default]);
  },
  482022,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("external-link", [
      ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
      ["path", { d: "M10 14 21 3", key: "gplh6r" }],
      [
        "path",
        {
          d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
          key: "a6xqqp",
        },
      ],
    ]);
    e.s(["ExternalLink", 0, t], 482022);
  },
  573474,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("trash-2", [
      ["path", { d: "M10 11v6", key: "nco0om" }],
      ["path", { d: "M14 11v6", key: "outv1u" }],
      [
        "path",
        { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" },
      ],
      ["path", { d: "M3 6h18", key: "d0wm0j" }],
      ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }],
    ]);
    e.s(["Trash2", 0, t], 573474);
  },
]);
