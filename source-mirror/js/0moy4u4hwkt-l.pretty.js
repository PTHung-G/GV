(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  330009,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(179862),
      r = e.i(271645),
      a = e.i(30030),
      i = e.i(820783),
      l = e.i(326999),
      s = e.i(981140),
      o = Object.defineProperty,
      c = (e, t) => o(e, "name", { value: t, configurable: !0 }),
      [d, u] = (0, a.createContextScope)("AlertDialog", [l.createDialogScope]),
      g = (0, l.createDialogScope)(),
      m = c((e) => {
        let { __scopeAlertDialog: n, ...r } = e,
          a = g(n);
        return (0, t.jsx)(l.Root, { ...a, ...r, modal: !0 });
      }, "AlertDialog"),
      f = r.forwardRef(
        c(function (e, n) {
          let { __scopeAlertDialog: r, ...a } = e,
            i = g(r);
          return (0, t.jsx)(l.Trigger, { ...i, ...a, ref: n });
        }, "AlertDialogTrigger"),
      ),
      x = c((e) => {
        let { __scopeAlertDialog: n, ...r } = e,
          a = g(n);
        return (0, t.jsx)(l.Portal, { ...a, ...r });
      }, "AlertDialogPortal"),
      h = r.forwardRef(
        c(function (e, n) {
          let { __scopeAlertDialog: r, ...a } = e,
            i = g(r);
          return (0, t.jsx)(l.Overlay, { ...i, ...a, ref: n });
        }, "AlertDialogOverlay"),
      ),
      [p, b] = d("AlertDialogContent"),
      v = r.forwardRef(
        c(function (e, n) {
          let { __scopeAlertDialog: a, children: o, ...c } = e,
            d = g(a),
            u = r.useRef(null),
            m = (0, i.useComposedRefs)(n, u),
            f = r.useRef(null);
          return (0, t.jsx)(p, {
            scope: a,
            cancelRef: f,
            children: (0, t.jsx)(l.Content, {
              role: "alertdialog",
              ...d,
              ...c,
              ref: m,
              onOpenAutoFocus: (0, s.composeEventHandlers)(
                c.onOpenAutoFocus,
                (e) => {
                  (e.preventDefault(), f.current?.focus({ preventScroll: !0 }));
                },
              ),
              onPointerDownOutside: (e) => e.preventDefault(),
              onInteractOutside: (e) => e.preventDefault(),
              children: o,
            }),
          });
        }, "AlertDialogContent"),
      ),
      j = r.forwardRef(
        c(function (e, n) {
          let { __scopeAlertDialog: r, ...a } = e,
            i = g(r);
          return (0, t.jsx)(l.Title, { ...i, ...a, ref: n });
        }, "AlertDialogTitle"),
      ),
      y = r.forwardRef(
        c(function (e, n) {
          let { __scopeAlertDialog: r, ...a } = e,
            i = g(r);
          return (0, t.jsx)(l.Description, { ...i, ...a, ref: n });
        }, "AlertDialogDescription"),
      ),
      w = r.forwardRef(
        c(function (e, n) {
          let { __scopeAlertDialog: r, ...a } = e,
            i = g(r);
          return (0, t.jsx)(l.Close, { ...i, ...a, ref: n });
        }, "AlertDialogAction"),
      ),
      C = r.forwardRef(
        c(function (e, n) {
          let { __scopeAlertDialog: r, ...a } = e,
            { cancelRef: s } = b("AlertDialogCancel", r),
            o = g(r),
            c = (0, i.useComposedRefs)(n, s);
          return (0, t.jsx)(l.Close, { ...o, ...a, ref: c });
        }, "AlertDialogCancel"),
      );
    e.s(
      [
        "Action",
        0,
        w,
        "AlertDialog",
        0,
        m,
        "AlertDialogAction",
        0,
        w,
        "AlertDialogCancel",
        0,
        C,
        "AlertDialogContent",
        0,
        v,
        "AlertDialogDescription",
        0,
        y,
        "AlertDialogOverlay",
        0,
        h,
        "AlertDialogPortal",
        0,
        x,
        "AlertDialogTitle",
        0,
        j,
        "AlertDialogTrigger",
        0,
        f,
        "Cancel",
        0,
        C,
        "Content",
        0,
        v,
        "Description",
        0,
        y,
        "Overlay",
        0,
        h,
        "Portal",
        0,
        x,
        "Root",
        0,
        m,
        "Title",
        0,
        j,
        "Trigger",
        0,
        f,
        "createAlertDialogScope",
        0,
        u,
      ],
      691162,
    );
    var A = e.i(691162),
      A = A,
      N = e.i(167881);
    function D({ ...e }) {
      return (0, t.jsx)(A.Portal, { "data-slot": "alert-dialog-portal", ...e });
    }
    function S({ className: e, ...r }) {
      return (0, t.jsx)(A.Overlay, {
        "data-slot": "alert-dialog-overlay",
        className: (0, n.cn)(
          "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
          e,
        ),
        ...r,
      });
    }
    e.s(
      [
        "AlertDialog",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(A.Root, { "data-slot": "alert-dialog", ...e });
        },
        "AlertDialogAction",
        0,
        function ({
          className: e,
          variant: r = "default",
          size: a = "default",
          ...i
        }) {
          return (0, t.jsx)(N.Button, {
            variant: r,
            size: a,
            asChild: !0,
            children: (0, t.jsx)(A.Action, {
              "data-slot": "alert-dialog-action",
              className: (0, n.cn)(e),
              ...i,
            }),
          });
        },
        "AlertDialogCancel",
        0,
        function ({
          className: e,
          variant: r = "outline",
          size: a = "default",
          ...i
        }) {
          return (0, t.jsx)(N.Button, {
            variant: r,
            size: a,
            asChild: !0,
            children: (0, t.jsx)(A.Cancel, {
              "data-slot": "alert-dialog-cancel",
              className: (0, n.cn)(e),
              ...i,
            }),
          });
        },
        "AlertDialogContent",
        0,
        function ({ className: e, size: r = "default", ...a }) {
          return (0, t.jsxs)(D, {
            children: [
              (0, t.jsx)(S, {}),
              (0, t.jsx)(A.Content, {
                "data-slot": "alert-dialog-content",
                "data-size": r,
                className: (0, n.cn)(
                  "group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[size=sm]:max-w-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[size=default]:sm:max-w-lg",
                  e,
                ),
                ...a,
              }),
            ],
          });
        },
        "AlertDialogDescription",
        0,
        function ({ className: e, ...r }) {
          return (0, t.jsx)(A.Description, {
            "data-slot": "alert-dialog-description",
            className: (0, n.cn)("text-sm text-muted-foreground", e),
            ...r,
          });
        },
        "AlertDialogFooter",
        0,
        function ({ className: e, ...r }) {
          return (0, t.jsx)("div", {
            "data-slot": "alert-dialog-footer",
            className: (0, n.cn)(
              "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
              e,
            ),
            ...r,
          });
        },
        "AlertDialogHeader",
        0,
        function ({ className: e, ...r }) {
          return (0, t.jsx)("div", {
            "data-slot": "alert-dialog-header",
            className: (0, n.cn)(
              "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
              e,
            ),
            ...r,
          });
        },
        "AlertDialogTitle",
        0,
        function ({ className: e, ...r }) {
          return (0, t.jsx)(A.Title, {
            "data-slot": "alert-dialog-title",
            className: (0, n.cn)(
              "text-lg font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
              e,
            ),
            ...r,
          });
        },
        "AlertDialogTrigger",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(A.Trigger, {
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
      n = e.i(225913),
      r = e.i(179862),
      a = e.i(586011);
    let i = (0, n.cva)(
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
        variant: n = "default",
        asChild: l = !1,
        ...s
      }) {
        let o = l ? a.Slot.Root : "span";
        return (0, t.jsx)(o, {
          "data-slot": "badge",
          "data-variant": n,
          className: (0, r.cn)(i({ variant: n }), e),
          ...s,
        });
      },
    ]);
  },
  287336,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(179862),
      r = e.i(271645),
      a = e.i(30030),
      i = e.i(248425),
      l = Object.defineProperty,
      s = (e, t) => l(e, "name", { value: t, configurable: !0 }),
      o = "Progress",
      [c, d] = (0, a.createContextScope)(o),
      [u, g] = c(o),
      m = r.forwardRef(
        s(function (e, n) {
          let {
            __scopeProgress: r,
            value: a = null,
            max: l,
            getValueLabel: s = x,
            ...o
          } = e;
          (l || 0 === l) && !b(l) && console.error(j(`${l}`, "Progress"));
          let c = b(l) ? l : 100;
          null === a || v(a, c) || console.error(y(`${a}`, "Progress"));
          let d = v(a, c) ? a : null,
            g = p(d) ? s(d, c) : void 0;
          return (0, t.jsx)(u, {
            scope: r,
            value: d,
            max: c,
            children: (0, t.jsx)(i.Primitive.div, {
              "aria-valuemax": c,
              "aria-valuemin": 0,
              "aria-valuenow": p(d) ? d : void 0,
              "aria-valuetext": g,
              role: "progressbar",
              "data-state": h(d, c),
              "data-value": d ?? void 0,
              "data-max": c,
              ...o,
              ref: n,
            }),
          });
        }, "Progress"),
      ),
      f = r.forwardRef(
        s(function (e, n) {
          let { __scopeProgress: r, ...a } = e,
            l = g("ProgressIndicator", r);
          return (0, t.jsx)(i.Primitive.div, {
            "data-state": h(l.value, l.max),
            "data-value": l.value ?? void 0,
            "data-max": l.max,
            ...a,
            ref: n,
          });
        }, "ProgressIndicator"),
      );
    function x(e, t) {
      return `${Math.round((e / t) * 100)}%`;
    }
    function h(e, t) {
      return null == e ? "indeterminate" : e === t ? "complete" : "loading";
    }
    function p(e) {
      return "number" == typeof e;
    }
    function b(e) {
      return p(e) && !isNaN(e) && e > 0;
    }
    function v(e, t) {
      return p(e) && !isNaN(e) && e <= t && e >= 0;
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
    (s(x, "defaultGetValueLabel"),
      s(h, "getProgressState"),
      s(p, "isNumber"),
      s(b, "isValidMaxNumber"),
      s(v, "isValidValueNumber"),
      s(j, "getInvalidMaxError"),
      s(y, "getInvalidValueError"),
      e.s(
        [
          "Indicator",
          0,
          f,
          "Progress",
          0,
          m,
          "ProgressIndicator",
          0,
          f,
          "Root",
          0,
          m,
          "createProgressScope",
          0,
          d,
        ],
        676027,
      ));
    var w = e.i(676027),
      w = w;
    e.s(
      [
        "Progress",
        0,
        function ({ className: e, value: r, ...a }) {
          return (0, t.jsx)(w.Root, {
            "data-slot": "progress",
            className: (0, n.cn)(
              "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
              e,
            ),
            ...a,
            children: (0, t.jsx)(w.Indicator, {
              "data-slot": "progress-indicator",
              className: "h-full w-full flex-1 bg-primary transition-all",
              style: { transform: `translateX(-${100 - (r || 0)}%)` },
            }),
          });
        },
      ],
      287336,
    );
  },
  636607,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(716400),
      r = e.i(271645);
    e.i(148043);
    var a = e.i(378610);
    function i(e, t, i) {
      return (0, r.useMemo)(
        () =>
          n.default.renderToString(
            (0, a.spaceMatrixRows)((0, a.normalizeLatex)(e)),
            {
              displayMode: t,
              errorColor: i,
              throwOnError: !1,
              strict: !1,
              output: "html",
            },
          ),
        [e, t, i],
      );
    }
    e.s([
      "BlockMath",
      0,
      function ({ math: e, errorColor: n = "#dc2626" }) {
        let r = i(e, !0, n);
        return (0, t.jsx)("div", { dangerouslySetInnerHTML: { __html: r } });
      },
      "InlineMath",
      0,
      function ({ math: e, errorColor: n = "#dc2626" }) {
        let r = i(e, !1, n);
        return (0, t.jsx)("span", { dangerouslySetInnerHTML: { __html: r } });
      },
    ]);
  },
  604131,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(271645),
      r = e.i(636607);
    let a = /^::(left|center|right|justify)::[ \t]?/;
    function i(e) {
      let t = a.exec(e);
      return t
        ? { align: t[1], text: e.slice(t[0].length) }
        : { align: void 0, text: e };
    }
    function l(e) {
      return !!e && /<[a-z][\s\S]*>/i.test(e);
    }
    let s =
      /^\s*<(?:p|div|li|blockquote|h[1-6])\b[\s\S]*<\/(?:p|div|li|blockquote|h[1-6])>\s*$/i;
    class o extends n.Component {
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
    let c = [
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
    function d({ math: e }) {
      let n = e.trim();
      if (!n) return null;
      let a = n.replace(/\\ne\b/g, "\\neq");
      return (0, t.jsx)(o, {
        fallbackText: n,
        children: (0, t.jsx)(r.InlineMath, { math: a, errorColor: "#dc2626" }),
      });
    }
    function u({ math: e }) {
      let n = e.trim();
      if (!n) return null;
      let a = n.replace(/\\ne\b/g, "\\neq");
      return (0, t.jsx)(o, {
        fallbackText: n,
        children: (0, t.jsx)(r.BlockMath, { math: a, errorColor: "#dc2626" }),
      });
    }
    let g = {
      left: "block text-left",
      center: "block text-center",
      right: "block text-right",
      justify: "block text-justify",
    };
    function m(e) {
      return e
        ? (function (e) {
            let t = e;
            for (let [e, n] of c) t = t.replace(e, n);
            return t;
          })(e)
            .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
            .map((e, r) =>
              e.startsWith("**") && e.endsWith("**") && e.length > 4
                ? (0, t.jsx)("strong", { children: e.slice(2, -2) }, r)
                : e.startsWith("*") && e.endsWith("*") && e.length > 2
                  ? (0, t.jsx)("em", { children: e.slice(1, -1) }, r)
                  : (0, t.jsx)(n.Fragment, { children: e }, r),
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
                  let r = (function (e) {
                    if (!e || !l(e)) return e;
                    let t = e.split("\n");
                    return t.some((e) => void 0 !== i(e).align)
                      ? t
                          .map((e) => {
                            let { align: t, text: n } = i(e);
                            if (!t && s.test(n)) return n;
                            let r = t ? ` style="text-align: ${t}"` : "",
                              a = n
                                ? n
                                    .replace(
                                      /\*\*([^*]+)\*\*/g,
                                      "<strong>$1</strong>",
                                    )
                                    .replace(
                                      /(^|[^*])\*([^*]+)\*/g,
                                      "$1<em>$2</em>",
                                    )
                                : "<br>";
                            return `<p${r}>${a}</p>`;
                          })
                          .join("")
                      : e;
                  })(e);
                  if (l(r))
                    return Array.from(
                      new DOMParser().parseFromString(
                        `<body>${r}</body>`,
                        "text/html",
                      ).body.childNodes,
                    ).map((e, r) =>
                      (function e(r, a) {
                        if (r.nodeType === Node.TEXT_NODE) {
                          var i;
                          let e = r.textContent || "";
                          return (0, t.jsx)(
                            n.Fragment,
                            {
                              children: (i = e)
                                ? i
                                    .split(/\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g)
                                    .map((e, r) =>
                                      void 0 === e
                                        ? null
                                        : r % 3 == 1
                                          ? (0, t.jsx)(
                                              u,
                                              { math: e },
                                              `disp-${r}`,
                                            )
                                          : r % 3 == 2
                                            ? (0, t.jsx)(
                                                d,
                                                { math: e },
                                                `inl-${r}`,
                                              )
                                            : (0, t.jsx)(
                                                n.Fragment,
                                                { children: m(e) },
                                                `t-${r}`,
                                              ),
                                    )
                                : null,
                            },
                            a,
                          );
                        }
                        if (r.nodeType === Node.ELEMENT_NODE) {
                          let i = r.tagName.toLowerCase();
                          if (
                            "math" === r.getAttribute("data-type") ||
                            r.classList.contains("math-node")
                          ) {
                            let e = r.getAttribute("data-latex"),
                              n = "";
                            if (e) n = decodeURIComponent(e);
                            else {
                              let e = r.textContent || "",
                                t = /\$\$([\s\S]*?)\$\$|\$([^$]*)\$/g.exec(e);
                              n = t ? (t[1] ?? t[2] ?? "") : e;
                            }
                            return "true" === r.getAttribute("data-display")
                              ? (0, t.jsx)(u, { math: n }, a)
                              : (0, t.jsx)(d, { math: n }, a);
                          }
                          let l = Array.from(r.childNodes).map((t, n) =>
                              e(t, `${a}-${n}`),
                            ),
                            s = {};
                          (r.style.textAlign &&
                            (s.textAlign = r.style.textAlign),
                            r.style.fontSize && (s.fontSize = r.style.fontSize),
                            r.style.lineHeight &&
                              (s.lineHeight = r.style.lineHeight),
                            r.style.marginBottom &&
                              (s.marginBottom = r.style.marginBottom));
                          let o = Object.keys(s).length > 0 ? s : void 0;
                          switch (i) {
                            case "p":
                              return (0, t.jsx)(
                                "p",
                                {
                                  style: o,
                                  className:
                                    "center" === r.style.textAlign
                                      ? "text-center"
                                      : "right" === r.style.textAlign
                                        ? "text-right"
                                        : "justify" === r.style.textAlign
                                          ? "text-justify"
                                          : void 0,
                                  children:
                                    l.length > 0 ? l : (0, t.jsx)("br", {}),
                                },
                                a,
                              );
                            case "strong":
                            case "b":
                              return (0, t.jsx)(
                                "strong",
                                { style: o, children: l },
                                a,
                              );
                            case "em":
                            case "i":
                              return (0, t.jsx)(
                                "em",
                                { style: o, children: l },
                                a,
                              );
                            case "u":
                              return (0, t.jsx)(
                                "u",
                                { style: o, children: l },
                                a,
                              );
                            case "s":
                            case "strike":
                            case "del":
                              return (0, t.jsx)(
                                "s",
                                { style: o, children: l },
                                a,
                              );
                            case "sub":
                              return (0, t.jsx)(
                                "sub",
                                { style: o, children: l },
                                a,
                              );
                            case "sup":
                              return (0, t.jsx)(
                                "sup",
                                { style: o, children: l },
                                a,
                              );
                            case "br":
                              return (0, t.jsx)("br", {}, a);
                            case "span":
                              return (0, t.jsx)(
                                "span",
                                { style: o, children: l },
                                a,
                              );
                            default:
                              return (0, t.jsx)(n.Fragment, { children: l }, a);
                          }
                        }
                        return null;
                      })(e, r),
                    );
                  if (!r) return null;
                  let a = [],
                    o = r
                      .replace(
                        /\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g,
                        (e, n, r) => {
                          let i = a.length;
                          return (
                            void 0 !== n
                              ? a.push((0, t.jsx)(u, { math: n }, `bm-${i}`))
                              : a.push(
                                  (0, t.jsx)(d, { math: r ?? "" }, `im-${i}`),
                                ),
                            `\u0000MATH_${i}\u0000`
                          );
                        },
                      )
                      .split("\n")
                      .map(i);
                  return o.map((e, r) => {
                    var i, l;
                    let s = void 0 !== e.align,
                      c = o[r + 1]?.align !== void 0,
                      d =
                        ((i = e.text),
                        (l = a),
                        i
                          ? i
                              .split(/\u0000MATH_(\d+)\u0000/g)
                              .map((e, r) =>
                                r % 2 == 1
                                  ? (l[parseInt(e, 10)] ?? null)
                                  : (0, t.jsx)(
                                      n.Fragment,
                                      { children: m(e) },
                                      r,
                                    ),
                              )
                          : null);
                    return (0, t.jsxs)(
                      n.Fragment,
                      {
                        children: [
                          s
                            ? (0, t.jsx)("span", {
                                className: g[e.align],
                                children: d,
                              })
                            : d,
                          r < o.length - 1 && !s && !c && (0, t.jsx)("br", {}),
                        ],
                      },
                      r,
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
      n = e.i(490985),
      r = e.i(632781),
      a = e.i(328623),
      i = e.i(522016),
      l = e.i(271645),
      s = e.i(781947),
      o = e.i(167881),
      c = e.i(630374),
      d = e.i(715760),
      u = e.i(799887),
      g = e.i(775691),
      m = e.i(42118),
      f = e.i(452022),
      x = e.i(11485),
      h = e.i(310900),
      p = e.i(389567);
    e.s([
      "ShareExamDialog",
      0,
      function ({
        open: e,
        onOpenChange: b,
        documentId: v,
        title: j,
        beforeShare: y,
      }) {
        let { options: w } = (0, h.useMetadataOptions)(),
          [C, A] = (0, l.useState)(""),
          [N, D] = (0, l.useState)(""),
          [S, k] = (0, l.useState)(""),
          [T, $] = (0, l.useState)(null),
          [R, P] = (0, l.useState)([]),
          [_, M] = (0, l.useState)(!1),
          [O, L] = (0, l.useState)(""),
          [B, E] = (0, l.useState)(""),
          z = (0, l.useCallback)(
            () =>
              Promise.all([
                (0, u.getMissions)().catch(() => null),
                (0, u.listSubmissions)({
                  documentId: v,
                  kind: "exam",
                  limit: 10,
                }),
              ]).then(([e, t]) => {
                ($(e?.missions.find((e) => "share_exam" === e.id) ?? null),
                  P(t.submissions));
              }),
            [v],
          );
        (0, l.useEffect)(() => {
          e && z().catch((e) => L(e.message));
        }, [e, z]);
        let I = (e) => {
            _ || (e || (L(""), E("")), b(e));
          },
          H = R.some((e) => "pending" === e.status || "reviewing" === e.status);
        (0, l.useEffect)(() => {
          if (!e || !H) return;
          let t = window.setInterval(() => void z().catch(() => {}), 5e3);
          return () => window.clearInterval(t);
        }, [e, H, z]);
        let V = async () => {
          (M(!0), L(""), E(""));
          try {
            await y?.();
            let e = await (0, u.shareDocument)(v, {
              subject: C || void 0,
              grade: N ? Number(N) : void 0,
              examType: S || void 0,
            });
            ((0, p.track)("exam_share", { missionCounted: e.missionCounted }),
              E(
                e.missionCounted
                  ? "Đã gửi đề để xét duyệt. Lượt này được tính cho nhiệm vụ “Chia sẻ đề thi”."
                  : "Đã gửi đề để xét duyệt. Lượt này không được tính thưởng (nhiệm vụ đã hết lượt hoặc đang tắt).",
              ),
              await z());
          } catch (e) {
            (e instanceof d.ApiError &&
              401 === e.status &&
              (0, g.requestLogin)(),
              L(e instanceof Error ? e.message : "Không chia sẻ được đề."));
          } finally {
            M(!1);
          }
        };
        return (0, t.jsx)(c.Dialog, {
          open: e,
          onOpenChange: I,
          children: (0, t.jsxs)(c.DialogContent, {
            className: "max-h-[90dvh] overflow-y-auto sm:max-w-2xl",
            children: [
              (0, t.jsxs)(c.DialogHeader, {
                children: [
                  (0, t.jsxs)(c.DialogTitle, {
                    className: "flex items-center gap-2 text-xl font-normal",
                    children: [
                      (0, t.jsx)(n.Globe2, {
                        "aria-hidden": !0,
                        className: "size-5 text-[#2383e2]",
                      }),
                      " Chia sẻ “",
                      j || "Đề thi",
                      "” lên cộng đồng",
                    ],
                  }),
                  (0, t.jsx)(c.DialogDescription, {
                    children:
                      "Đề cần có nội dung thật sự mới và sẽ được xét duyệt trước khi được chia sẻ cho mọi người.",
                  }),
                ],
              }),
              T &&
                (0, t.jsxs)("div", {
                  className: "rounded-xl bg-[#f7f6f3] p-3 text-sm",
                  children: [
                    (0, t.jsxs)("p", {
                      className:
                        "flex items-center gap-1.5 font-medium text-[#37352f]",
                      children: [
                        (0, t.jsx)(a.Sparkles, {
                          "aria-hidden": !0,
                          className: "size-4 text-[#2383e2]",
                        }),
                        " Nhiệm vụ: ",
                        T.title,
                      ],
                    }),
                    (0, t.jsx)("p", {
                      className: "mt-1 text-[#5f5e5b]",
                      children: (0, m.missionRewardText)(T),
                    }),
                    (0, t.jsxs)("p", {
                      className: "text-[#5f5e5b]",
                      children: [
                        (0, m.missionAttemptsText)(T),
                        " · ",
                        (0, m.missionResetText)(T),
                      ],
                    }),
                    !(0, m.missionAvailable)(T) &&
                      (0, t.jsx)("p", {
                        className: "mt-1 text-[#8a5a00]",
                        children:
                          "Bạn đã hết lượt trong chu kỳ này: vẫn chia sẻ được nhưng không nhận thưởng.",
                      }),
                    (0, t.jsx)(i.default, {
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
                  (0, t.jsx)(f.MetadataSelect, {
                    label: "Môn học",
                    value: C,
                    options: w?.subjects ?? [],
                    onChange: A,
                    noneLabel: "Tự động nhận diện",
                  }),
                  (0, t.jsx)(f.MetadataSelect, {
                    label: "Lớp",
                    value: N,
                    options: (0, f.gradeOptions)(w?.grades ?? []),
                    onChange: D,
                    noneLabel: "Tự động nhận diện",
                  }),
                  (0, t.jsx)(f.MetadataSelect, {
                    label: "Loại đề",
                    value: S,
                    options: w?.examTypes ?? [],
                    onChange: k,
                    noneLabel: "Tự động nhận diện",
                  }),
                ],
              }),
              O &&
                (0, t.jsx)(s.Alert, {
                  variant: "destructive",
                  children: (0, t.jsx)(s.AlertDescription, { children: O }),
                }),
              B &&
                (0, t.jsx)(s.Alert, {
                  children: (0, t.jsx)(s.AlertDescription, { children: B }),
                }),
              R.length > 0 &&
                (0, t.jsxs)("div", {
                  className: "space-y-2",
                  children: [
                    (0, t.jsx)("p", {
                      className: "text-sm font-medium text-[#5f5e5b]",
                      children: "Các lần chia sẻ đề này",
                    }),
                    R.map((e) =>
                      (0, t.jsx)(
                        x.SubmissionCard,
                        { submission: e, compact: !0 },
                        e.id,
                      ),
                    ),
                  ],
                }),
              (0, t.jsxs)(c.DialogFooter, {
                children: [
                  (0, t.jsx)(o.Button, {
                    variant: "outline",
                    onClick: () => I(!1),
                    disabled: _,
                    children: "Đóng",
                  }),
                  (0, t.jsxs)(o.Button, {
                    onClick: V,
                    disabled: _ || H,
                    children: [
                      _ &&
                        (0, t.jsx)(r.Loader2, {
                          "aria-hidden": !0,
                          className: "animate-spin",
                        }),
                      H ? "Đang chờ duyệt…" : "Gửi chia sẻ",
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
      n = e.i(716327),
      r = e.i(226091),
      a = e.i(576248),
      i = e.i(328623),
      l = e.i(271645),
      s = e.i(994179),
      o = e.i(981140),
      c = e.i(30030),
      d = e.i(369340),
      u = e.i(934620),
      g = e.i(820783),
      m = e.i(248425),
      f = e.i(296626),
      x = e.i(610772),
      h = Object.defineProperty,
      p = (e, t) => h(e, "name", { value: t, configurable: !0 }),
      b = "Collapsible",
      [v, j] = (0, c.createContextScope)(b),
      [y, w] = v(b),
      C = l.forwardRef(
        p(function (e, n) {
          let {
              __scopeCollapsible: r,
              open: a,
              defaultOpen: i,
              disabled: s,
              onOpenChange: o,
              ...c
            } = e,
            [u, g] = (0, d.useControllableState)({
              prop: a,
              defaultProp: i ?? !1,
              onChange: o,
              caller: b,
            });
          return (0, t.jsx)(y, {
            scope: r,
            disabled: s,
            contentId: (0, x.useId)(),
            open: u,
            onOpenToggle: l.useCallback(() => g((e) => !e), [g]),
            children: (0, t.jsx)(m.Primitive.div, {
              "data-state": k(u),
              "data-disabled": s ? "" : void 0,
              ...c,
              ref: n,
            }),
          });
        }, "Collapsible"),
      ),
      A = l.forwardRef(
        p(function (e, n) {
          let { __scopeCollapsible: r, ...a } = e,
            i = w("CollapsibleTrigger", r);
          return (0, t.jsx)(m.Primitive.button, {
            type: "button",
            "aria-controls": i.open ? i.contentId : void 0,
            "aria-expanded": i.open || !1,
            "data-state": k(i.open),
            "data-disabled": i.disabled ? "" : void 0,
            disabled: i.disabled,
            ...a,
            ref: n,
            onClick: (0, o.composeEventHandlers)(e.onClick, i.onOpenToggle),
          });
        }, "CollapsibleTrigger"),
      ),
      N = "CollapsibleContent",
      D = l.forwardRef(
        p(function (e, n) {
          let { forceMount: r, ...a } = e,
            i = w(N, e.__scopeCollapsible);
          return (0, t.jsx)(f.Presence, {
            present: r || i.open,
            children: ({ present: e }) =>
              (0, t.jsx)(S, { ...a, ref: n, present: e }),
          });
        }, "CollapsibleContent"),
      ),
      S = l.forwardRef(
        p(function (e, n) {
          let { __scopeCollapsible: r, present: a, children: i, ...s } = e,
            o = w(N, r),
            [c, d] = l.useState(a),
            f = l.useRef(null),
            x = (0, g.useComposedRefs)(n, f),
            h = l.useRef(0),
            p = h.current,
            b = l.useRef(0),
            v = b.current,
            j = o.open || c,
            y = l.useRef(j),
            C = l.useRef(void 0);
          return (
            l.useEffect(() => {
              let e = requestAnimationFrame(() => (y.current = !1));
              return () => cancelAnimationFrame(e);
            }, []),
            (0, u.useLayoutEffect)(() => {
              let e = f.current;
              if (e) {
                ((C.current = C.current || {
                  transitionDuration: e.style.transitionDuration,
                  animationName: e.style.animationName,
                }),
                  (e.style.transitionDuration = "0s"),
                  (e.style.animationName = "none"));
                let t = e.getBoundingClientRect();
                ((h.current = t.height),
                  (b.current = t.width),
                  y.current ||
                    ((e.style.transitionDuration =
                      C.current.transitionDuration),
                    (e.style.animationName = C.current.animationName)),
                  d(a));
              }
            }, [o.open, a]),
            (0, t.jsx)(m.Primitive.div, {
              "data-state": k(o.open),
              "data-disabled": o.disabled ? "" : void 0,
              id: o.contentId,
              hidden: !j,
              ...s,
              ref: x,
              style: {
                "--radix-collapsible-content-height": p ? `${p}px` : void 0,
                "--radix-collapsible-content-width": v ? `${v}px` : void 0,
                ...e.style,
              },
              children: j && i,
            })
          );
        }, "CollapsibleContentImpl"),
      );
    function k(e) {
      return e ? "open" : "closed";
    }
    (p(k, "getState"),
      e.s(
        [
          "Collapsible",
          0,
          C,
          "CollapsibleContent",
          0,
          D,
          "CollapsibleTrigger",
          0,
          A,
          "Content",
          0,
          D,
          "Root",
          0,
          C,
          "Trigger",
          0,
          A,
          "createCollapsibleScope",
          0,
          j,
        ],
        687607,
      ));
    var T = e.i(687607),
      T = T;
    function $({ ...e }) {
      return (0, t.jsx)(T.Root, { "data-slot": "collapsible", ...e });
    }
    function R({ ...e }) {
      return (0, t.jsx)(T.CollapsibleTrigger, {
        "data-slot": "collapsible-trigger",
        ...e,
      });
    }
    function P({ ...e }) {
      return (0, t.jsx)(T.CollapsibleContent, {
        "data-slot": "collapsible-content",
        ...e,
      });
    }
    var _ = e.i(604131),
      M = e.i(42118),
      O = e.i(647163);
    let L = {
        pending: "bg-[#fef7e0] text-[#8a5a00]",
        reviewing: "bg-[#e7f3f8] text-[#2383e2]",
        awaiting_admin: "bg-[#fef7e0] text-[#8a5a00]",
        approved: "bg-[#dbeddb] text-[#1c3829]",
        rejected: "bg-[#fdebec] text-[#a50e0e]",
        failed: "bg-[#fdebec] text-[#a50e0e]",
      },
      B = {
        novel: "bg-[#dbeddb] text-[#1c3829]",
        variant: "bg-[#fef7e0] text-[#8a5a00]",
        duplicate: "bg-[#fdebec] text-[#a50e0e]",
        common: "bg-[#f1f1ef] text-[#5f5e5b]",
        invalid: "bg-[#fdebec] text-[#a50e0e]",
      };
    function E({ status: e }) {
      return (0, t.jsx)(s.Badge, {
        className: (0, O.cn)("border-0 font-medium", L[e]),
        children: M.STATUS_LABEL[e],
      });
    }
    e.s(
      [
        "SubmissionCard",
        0,
        function ({ submission: e, compact: o }) {
          let [c, d] = (0, l.useState)(!1),
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
                        ? (0, t.jsx)(r.FileText, {
                            "aria-hidden": !0,
                            className: "size-4",
                          })
                        : (0, t.jsx)(a.HelpCircle, {
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
                            (0, t.jsxs)(s.Badge, {
                              className: "border-0 bg-[#dbeddb] text-[#1c3829]",
                              children: [
                                (0, t.jsx)(i.Sparkles, { "aria-hidden": !0 }),
                                " +",
                                e.rewardPoints.toLocaleString("vi-VN"),
                                " điểm",
                              ],
                            }),
                          "approved" === e.status &&
                            "exam" === e.kind &&
                            !e.published &&
                            (0, t.jsx)(s.Badge, {
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
                      !o &&
                        e.excerpt &&
                        "question" === e.kind &&
                        (0, t.jsx)("p", {
                          className:
                            "mt-2 line-clamp-3 whitespace-pre-wrap rounded-md bg-[#f7f6f3] p-2 text-sm text-[#3c4043]",
                          children: (0, t.jsx)(_.RichText, { text: e.excerpt }),
                        }),
                    ],
                  }),
                ],
              }),
              u.length > 0 &&
                (0, t.jsxs)($, {
                  open: c,
                  onOpenChange: d,
                  className: "mt-3",
                  children: [
                    (0, t.jsxs)(R, {
                      className:
                        "flex items-center gap-1 text-sm font-medium text-[#2383e2] hover:underline",
                      children: [
                        (0, t.jsx)(n.ChevronDown, {
                          "aria-hidden": !0,
                          className: (0, O.cn)(
                            "size-4 transition-transform",
                            c && "rotate-180",
                          ),
                        }),
                        "Chi tiết từng câu (",
                        e.novelCount,
                        "/",
                        u.length,
                        " câu mới)",
                      ],
                    }),
                    (0, t.jsx)(P, {
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
                                    (0, t.jsx)(s.Badge, {
                                      className: (0, O.cn)(
                                        "border-0",
                                        B[e.verdict] ?? B.variant,
                                      ),
                                      children:
                                        M.VERDICT_LABEL[e.verdict] ?? e.verdict,
                                    }),
                                  ],
                                }),
                                (0, t.jsx)("p", {
                                  className:
                                    "mt-1 line-clamp-3 text-sm text-[#787774]",
                                  children: (0, t.jsx)(_.RichText, {
                                    text: e.stem,
                                  }),
                                }),
                                e.reason &&
                                  (0, t.jsx)("p", {
                                    className: "mt-1 text-sm text-[#37352f]",
                                    children: (0, t.jsx)(_.RichText, {
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
    function n(e) {
      let t = ["B", "KB", "MB", "GB", "TB"],
        n = Math.max(0, e),
        r = 0;
      for (; n >= 1024 && r < t.length - 1; ) ((n /= 1024), r++);
      let a = 0 === r || n >= 100 ? 0 : 1;
      return `${n.toFixed(a).replace(".", ",").replace(/,0$/, "")} ${t[r]}`;
    }
    function r(e) {
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
    function a(e) {
      return e
        ? new Date(e).toLocaleDateString("vi-VN", {
            timeZone: t,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "";
    }
    function i(e) {
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
      n,
      "formatDate",
      0,
      a,
      "formatDateTime",
      0,
      r,
      "formatRecent",
      0,
      function (e, n = new Date()) {
        let r = new Date(e);
        return r.toLocaleDateString("vi-VN", { timeZone: t }) ===
          n.toLocaleDateString("vi-VN", { timeZone: t })
          ? r.toLocaleTimeString("vi-VN", {
              timeZone: t,
              hour: "2-digit",
              minute: "2-digit",
            })
          : a(e);
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
          : `L\xe0m mới ${i(e.resetHours)} \xb7 lần tới ${r(e.nextResetAt)}`;
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
      i,
      "storageLimitNote",
      0,
      function (e) {
        let t = e.override;
        return t?.active
          ? t.expiresAt
            ? `Hạn mức ${n(t.limitBytes)} đến ${r(t.expiresAt)}, sau đ\xf3 về mức ${n(e.defaultLimitBytes)}.`
            : `Hạn mức ${n(t.limitBytes)}, kh\xf4ng thời hạn.`
          : `Hạn mức ${n(e.defaultLimitBytes)}.`;
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
  275043,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("circle-question-mark", [
      ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
      ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
      ["path", { d: "M12 17h.01", key: "p32p05" }],
    ]);
    e.s(["default", 0, t]);
  },
  576248,
  (e) => {
    "use strict";
    var t = e.i(275043);
    e.s(["HelpCircle", () => t.default]);
  },
  503678,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("earth", [
      ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54", key: "1djwo0" }],
      [
        "path",
        {
          d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",
          key: "1tzkfa",
        },
      ],
      [
        "path",
        {
          d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",
          key: "14pb5j",
        },
      ],
      ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ]);
    e.s(["default", 0, t]);
  },
  490985,
  452022,
  (e) => {
    "use strict";
    var t = e.i(503678);
    e.s(["Globe2", () => t.default], 490985);
    var n = e.i(843476),
      r = e.i(10708),
      a = e.i(62870);
    let i = "__none__";
    e.s(
      [
        "MetadataSelect",
        0,
        function ({
          label: e,
          value: t,
          options: l,
          onChange: s,
          placeholder: o = "Chọn",
          noneLabel: c,
          required: d,
          disabled: u,
        }) {
          return (0, n.jsxs)(r.Label, {
            className: "grid gap-1.5 text-[13px] font-medium text-[#5f5e5b]",
            children: [
              (0, n.jsxs)("span", {
                children: [
                  e,
                  d &&
                    (0, n.jsx)("span", {
                      className: "text-[#eb5757]",
                      children: " *",
                    }),
                ],
              }),
              (0, n.jsxs)(a.Select, {
                value: "" === t ? (c ? i : "") : t,
                onValueChange: (e) => s(e === i ? "" : e),
                disabled: u,
                children: [
                  (0, n.jsx)(a.SelectTrigger, {
                    className: "w-full bg-white",
                    "aria-label": e,
                    children: (0, n.jsx)(a.SelectValue, { placeholder: o }),
                  }),
                  (0, n.jsxs)(a.SelectContent, {
                    className: "max-h-72",
                    children: [
                      c && (0, n.jsx)(a.SelectItem, { value: i, children: c }),
                      l.map((e) =>
                        (0, n.jsx)(
                          a.SelectItem,
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
  226091,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("file-text", [
      [
        "path",
        {
          d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
          key: "1oefj6",
        },
      ],
      ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
      ["path", { d: "M10 9H8", key: "b1mrlr" }],
      ["path", { d: "M16 13H8", key: "t4e002" }],
      ["path", { d: "M16 17H8", key: "z1uh3a" }],
    ]);
    e.s(["FileText", 0, t], 226091);
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
  90317,
  (e, t, n) => {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 });
    var r = {
      bindSnapshot: function () {
        return c;
      },
      createAsyncLocalStorage: function () {
        return o;
      },
      createSnapshot: function () {
        return d;
      },
    };
    for (var a in r) Object.defineProperty(n, a, { enumerable: !0, get: r[a] });
    let i = Object.defineProperty(
      Error(
        "Invariant: AsyncLocalStorage accessed in runtime where it is not available",
      ),
      "__NEXT_ERROR_CODE",
      { value: "E504", enumerable: !1, configurable: !0 },
    );
    class l {
      disable() {
        throw i;
      }
      getStore() {}
      run() {
        throw i;
      }
      exit() {
        throw i;
      }
      enterWith() {
        throw i;
      }
      static bind(e) {
        return e;
      }
    }
    let s = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
    function o() {
      return s ? new s() : new l();
    }
    function c(e) {
      return s ? s.bind(e) : l.bind(e);
    }
    function d() {
      return s
        ? s.snapshot()
        : function (e, ...t) {
            return e(...t);
          };
    }
  },
  242344,
  (e, t, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "workAsyncStorageInstance", {
        enumerable: !0,
        get: function () {
          return r;
        },
      }));
    let r = (0, e.r(90317).createAsyncLocalStorage)();
  },
  563599,
  (e, t, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "workAsyncStorage", {
        enumerable: !0,
        get: function () {
          return r.workAsyncStorageInstance;
        },
      }));
    let r = e.r(242344);
  },
  309885,
  (e, t, n) => {
    "use strict";
    function r(e) {
      return e
        .split("/")
        .map((e) => encodeURIComponent(e))
        .join("/");
    }
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "encodeURIPath", {
        enumerable: !0,
        get: function () {
          return r;
        },
      }));
  },
  667585,
  (e, t, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "BailoutToCSR", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    let r = e.r(132061);
    function a({ reason: e, children: t }) {
      if ("u" < typeof window)
        throw Object.defineProperty(
          new r.BailoutToCSRError(e),
          "__NEXT_ERROR_CODE",
          { value: "E394", enumerable: !1, configurable: !0 },
        );
      return t;
    }
  },
  652157,
  (e, t, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "PreloadChunks", {
        enumerable: !0,
        get: function () {
          return o;
        },
      }));
    let r = e.r(843476),
      a = e.r(174080),
      i = e.r(563599),
      l = e.r(309885),
      s = e.r(543369);
    function o({ moduleIds: e }) {
      if ("u" > typeof window) return null;
      let t = i.workAsyncStorage.getStore();
      if (void 0 === t) return null;
      let n = [];
      if (t.reactLoadableManifest && e) {
        let r = t.reactLoadableManifest;
        for (let t of e) {
          if (!r[t]) continue;
          let e = r[t].files;
          n.push(...e);
        }
      }
      if (0 === n.length) return null;
      let c = (0, s.getAssetTokenQuery)();
      return (0, r.jsx)(r.Fragment, {
        children: n.map((e) => {
          let n = `${t.assetPrefix}/_next/${(0, l.encodeURIPath)(e)}${c}`;
          return e.endsWith(".css")
            ? (0, r.jsx)(
                "link",
                {
                  precedence: "dynamic",
                  href: n,
                  rel: "stylesheet",
                  as: "style",
                  nonce: t.nonce,
                },
                e,
              )
            : ((0, a.preload)(n, {
                as: "script",
                fetchPriority: "low",
                nonce: t.nonce,
              }),
              null);
        }),
      });
    }
  },
  869093,
  (e, t, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "default", {
        enumerable: !0,
        get: function () {
          return c;
        },
      }));
    let r = e.r(843476),
      a = e.r(271645),
      i = e.r(667585),
      l = e.r(652157);
    function s(e) {
      return { default: e && "default" in e ? e.default : e };
    }
    let o = {
        loader: () => Promise.resolve(s(() => null)),
        loading: null,
        ssr: !0,
      },
      c = function (e) {
        let t = { ...o, ...e },
          n = (0, a.lazy)(() => t.loader().then(s)),
          c = t.loading;
        function d(e) {
          let s = c
              ? (0, r.jsx)(c, { isLoading: !0, pastDelay: !0, error: null })
              : null,
            o = !t.ssr || !!t.loading,
            d = o ? a.Suspense : a.Fragment,
            u = t.ssr
              ? (0, r.jsxs)(r.Fragment, {
                  children: [
                    "u" < typeof window
                      ? (0, r.jsx)(l.PreloadChunks, { moduleIds: t.modules })
                      : null,
                    (0, r.jsx)(n, { ...e }),
                  ],
                })
              : (0, r.jsx)(i.BailoutToCSR, {
                  reason: "next/dynamic",
                  children: (0, r.jsx)(n, { ...e }),
                });
          return (0, r.jsx)(d, { ...(o ? { fallback: s } : {}), children: u });
        }
        return ((d.displayName = "LoadableComponent"), d);
      };
  },
  770703,
  (e, t, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "default", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    let r = e.r(555682)._(e.r(869093));
    function a(e, t) {
      let n = {};
      "function" == typeof e && (n.loader = e);
      let a = { ...n, ...t };
      return (0, r.default)({ ...a, modules: a.loadableGenerated?.modules });
    }
    ("function" == typeof n.default ||
      ("object" == typeof n.default && null !== n.default)) &&
      void 0 === n.default.__esModule &&
      (Object.defineProperty(n.default, "__esModule", { value: !0 }),
      Object.assign(n.default, n),
      (t.exports = n.default));
  },
]);
