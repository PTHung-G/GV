(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  781947,
  (e) => {
    "use strict";
    var t = e.i(843476),
      i = e.i(225913),
      n = e.i(647163);
    let a = (0, i.cva)(
      "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
      {
        variants: {
          variant: {
            default: "bg-card text-card-foreground",
            destructive:
              "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current",
          },
        },
        defaultVariants: { variant: "default" },
      },
    );
    e.s([
      "Alert",
      0,
      function ({ className: e, variant: i, ...s }) {
        return (0, t.jsx)("div", {
          "data-slot": "alert",
          role: "alert",
          className: (0, n.cn)(a({ variant: i }), e),
          ...s,
        });
      },
      "AlertDescription",
      0,
      function ({ className: e, ...i }) {
        return (0, t.jsx)("div", {
          "data-slot": "alert-description",
          className: (0, n.cn)(
            "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
            e,
          ),
          ...i,
        });
      },
      "AlertTitle",
      0,
      function ({ className: e, ...i }) {
        return (0, t.jsx)("div", {
          "data-slot": "alert-title",
          className: (0, n.cn)(
            "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
            e,
          ),
          ...i,
        });
      },
    ]);
  },
  994179,
  (e) => {
    "use strict";
    var t = e.i(843476),
      i = e.i(225913),
      n = e.i(179862),
      a = e.i(586011);
    let s = (0, i.cva)(
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
        variant: i = "default",
        asChild: r = !1,
        ...l
      }) {
        let o = r ? a.Slot.Root : "span";
        return (0, t.jsx)(o, {
          "data-slot": "badge",
          "data-variant": i,
          className: (0, n.cn)(s({ variant: i }), e),
          ...l,
        });
      },
    ]);
  },
  287336,
  (e) => {
    "use strict";
    var t = e.i(843476),
      i = e.i(179862),
      n = e.i(271645),
      a = e.i(30030),
      s = e.i(248425),
      r = Object.defineProperty,
      l = (e, t) => r(e, "name", { value: t, configurable: !0 }),
      o = "Progress",
      [d, c] = (0, a.createContextScope)(o),
      [u, m] = d(o),
      g = n.forwardRef(
        l(function (e, i) {
          let {
            __scopeProgress: n,
            value: a = null,
            max: r,
            getValueLabel: l = h,
            ...o
          } = e;
          (r || 0 === r) && !v(r) && console.error(j(`${r}`, "Progress"));
          let d = v(r) ? r : 100;
          null === a || b(a, d) || console.error(y(`${a}`, "Progress"));
          let c = b(a, d) ? a : null,
            m = p(c) ? l(c, d) : void 0;
          return (0, t.jsx)(u, {
            scope: n,
            value: c,
            max: d,
            children: (0, t.jsx)(s.Primitive.div, {
              "aria-valuemax": d,
              "aria-valuemin": 0,
              "aria-valuenow": p(c) ? c : void 0,
              "aria-valuetext": m,
              role: "progressbar",
              "data-state": f(c, d),
              "data-value": c ?? void 0,
              "data-max": d,
              ...o,
              ref: i,
            }),
          });
        }, "Progress"),
      ),
      x = n.forwardRef(
        l(function (e, i) {
          let { __scopeProgress: n, ...a } = e,
            r = m("ProgressIndicator", n);
          return (0, t.jsx)(s.Primitive.div, {
            "data-state": f(r.value, r.max),
            "data-value": r.value ?? void 0,
            "data-max": r.max,
            ...a,
            ref: i,
          });
        }, "ProgressIndicator"),
      );
    function h(e, t) {
      return `${Math.round((e / t) * 100)}%`;
    }
    function f(e, t) {
      return null == e ? "indeterminate" : e === t ? "complete" : "loading";
    }
    function p(e) {
      return "number" == typeof e;
    }
    function v(e) {
      return p(e) && !isNaN(e) && e > 0;
    }
    function b(e, t) {
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
    (l(h, "defaultGetValueLabel"),
      l(f, "getProgressState"),
      l(p, "isNumber"),
      l(v, "isValidMaxNumber"),
      l(b, "isValidValueNumber"),
      l(j, "getInvalidMaxError"),
      l(y, "getInvalidValueError"),
      e.s(
        [
          "Indicator",
          0,
          x,
          "Progress",
          0,
          g,
          "ProgressIndicator",
          0,
          x,
          "Root",
          0,
          g,
          "createProgressScope",
          0,
          c,
        ],
        676027,
      ));
    var N = e.i(676027),
      N = N;
    e.s(
      [
        "Progress",
        0,
        function ({ className: e, value: n, ...a }) {
          return (0, t.jsx)(N.Root, {
            "data-slot": "progress",
            className: (0, i.cn)(
              "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
              e,
            ),
            ...a,
            children: (0, t.jsx)(N.Indicator, {
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
  62870,
  (e) => {
    "use strict";
    var t = e.i(843476),
      i = e.i(179862),
      n = e.i(593698),
      a = e.i(26495),
      a = a,
      s = e.i(144716),
      s = s,
      r = e.i(129402),
      r = r;
    function l({ className: e, ...n }) {
      return (0, t.jsx)(r.ScrollUpButton, {
        "data-slot": "select-scroll-up-button",
        className: (0, i.cn)(
          "flex cursor-default items-center justify-center py-1",
          e,
        ),
        ...n,
        children: (0, t.jsx)(s.default, { className: "size-4" }),
      });
    }
    function o({ className: e, ...n }) {
      return (0, t.jsx)(r.ScrollDownButton, {
        "data-slot": "select-scroll-down-button",
        className: (0, i.cn)(
          "flex cursor-default items-center justify-center py-1",
          e,
        ),
        ...n,
        children: (0, t.jsx)(a.default, { className: "size-4" }),
      });
    }
    e.s(
      [
        "Select",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(r.Root, { "data-slot": "select", ...e });
        },
        "SelectContent",
        0,
        function ({
          className: e,
          children: n,
          position: a = "item-aligned",
          align: s = "center",
          ...d
        }) {
          return (0, t.jsx)(r.Portal, {
            children: (0, t.jsxs)(r.Content, {
              "data-slot": "select-content",
              className: (0, i.cn)(
                "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                "popper" === a &&
                  "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                e,
              ),
              position: a,
              align: s,
              ...d,
              children: [
                (0, t.jsx)(l, {}),
                (0, t.jsx)(r.Viewport, {
                  className: (0, i.cn)(
                    "p-1",
                    "popper" === a &&
                      "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
                  ),
                  children: n,
                }),
                (0, t.jsx)(o, {}),
              ],
            }),
          });
        },
        "SelectItem",
        0,
        function ({ className: e, children: a, ...s }) {
          return (0, t.jsxs)(r.Item, {
            "data-slot": "select-item",
            className: (0, i.cn)(
              "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
              e,
            ),
            ...s,
            children: [
              (0, t.jsx)("span", {
                "data-slot": "select-item-indicator",
                className:
                  "absolute right-2 flex size-3.5 items-center justify-center",
                children: (0, t.jsx)(r.ItemIndicator, {
                  children: (0, t.jsx)(n.CheckIcon, { className: "size-4" }),
                }),
              }),
              (0, t.jsx)(r.ItemText, { children: a }),
            ],
          });
        },
        "SelectTrigger",
        0,
        function ({ className: e, size: n = "default", children: s, ...l }) {
          return (0, t.jsxs)(r.Trigger, {
            "data-slot": "select-trigger",
            "data-size": n,
            className: (0, i.cn)(
              "flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
              e,
            ),
            ...l,
            children: [
              s,
              (0, t.jsx)(r.Icon, {
                asChild: !0,
                children: (0, t.jsx)(a.default, {
                  className: "size-4 opacity-50",
                }),
              }),
            ],
          });
        },
        "SelectValue",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(r.Value, { "data-slot": "select-value", ...e });
        },
      ],
      62870,
    );
  },
  671428,
  (e) => {
    "use strict";
    var t = e.i(843476),
      i = e.i(179862);
    e.s([
      "Skeleton",
      0,
      function ({ className: e, ...n }) {
        return (0, t.jsx)("div", {
          "data-slot": "skeleton",
          className: (0, i.cn)("animate-pulse rounded-md bg-accent", e),
          ...n,
        });
      },
    ]);
  },
  604131,
  (e) => {
    "use strict";
    var t = e.i(843476),
      i = e.i(271645),
      n = e.i(636607);
    let a = /^::(left|center|right|justify)::[ \t]?/;
    function s(e) {
      let t = a.exec(e);
      return t
        ? { align: t[1], text: e.slice(t[0].length) }
        : { align: void 0, text: e };
    }
    function r(e) {
      return !!e && /<[a-z][\s\S]*>/i.test(e);
    }
    let l =
      /^\s*<(?:p|div|li|blockquote|h[1-6])\b[\s\S]*<\/(?:p|div|li|blockquote|h[1-6])>\s*$/i;
    class o extends i.Component {
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
      let i = e.trim();
      if (!i) return null;
      let a = i.replace(/\\ne\b/g, "\\neq");
      return (0, t.jsx)(o, {
        fallbackText: i,
        children: (0, t.jsx)(n.InlineMath, { math: a, errorColor: "#dc2626" }),
      });
    }
    function u({ math: e }) {
      let i = e.trim();
      if (!i) return null;
      let a = i.replace(/\\ne\b/g, "\\neq");
      return (0, t.jsx)(o, {
        fallbackText: i,
        children: (0, t.jsx)(n.BlockMath, { math: a, errorColor: "#dc2626" }),
      });
    }
    let m = {
      left: "block text-left",
      center: "block text-center",
      right: "block text-right",
      justify: "block text-justify",
    };
    function g(e) {
      return e
        ? (function (e) {
            let t = e;
            for (let [e, i] of d) t = t.replace(e, i);
            return t;
          })(e)
            .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
            .map((e, n) =>
              e.startsWith("**") && e.endsWith("**") && e.length > 4
                ? (0, t.jsx)("strong", { children: e.slice(2, -2) }, n)
                : e.startsWith("*") && e.endsWith("*") && e.length > 2
                  ? (0, t.jsx)("em", { children: e.slice(1, -1) }, n)
                  : (0, t.jsx)(i.Fragment, { children: e }, n),
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
                    if (!e || !r(e)) return e;
                    let t = e.split("\n");
                    return t.some((e) => void 0 !== s(e).align)
                      ? t
                          .map((e) => {
                            let { align: t, text: i } = s(e);
                            if (!t && l.test(i)) return i;
                            let n = t ? ` style="text-align: ${t}"` : "",
                              a = i
                                ? i
                                    .replace(
                                      /\*\*([^*]+)\*\*/g,
                                      "<strong>$1</strong>",
                                    )
                                    .replace(
                                      /(^|[^*])\*([^*]+)\*/g,
                                      "$1<em>$2</em>",
                                    )
                                : "<br>";
                            return `<p${n}>${a}</p>`;
                          })
                          .join("")
                      : e;
                  })(e);
                  if (r(n))
                    return Array.from(
                      new DOMParser().parseFromString(
                        `<body>${n}</body>`,
                        "text/html",
                      ).body.childNodes,
                    ).map((e, n) =>
                      (function e(n, a) {
                        if (n.nodeType === Node.TEXT_NODE) {
                          var s;
                          let e = n.textContent || "";
                          return (0, t.jsx)(
                            i.Fragment,
                            {
                              children: (s = e)
                                ? s
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
                                                i.Fragment,
                                                { children: g(e) },
                                                `t-${n}`,
                                              ),
                                    )
                                : null,
                            },
                            a,
                          );
                        }
                        if (n.nodeType === Node.ELEMENT_NODE) {
                          let s = n.tagName.toLowerCase();
                          if (
                            "math" === n.getAttribute("data-type") ||
                            n.classList.contains("math-node")
                          ) {
                            let e = n.getAttribute("data-latex"),
                              i = "";
                            if (e) i = decodeURIComponent(e);
                            else {
                              let e = n.textContent || "",
                                t = /\$\$([\s\S]*?)\$\$|\$([^$]*)\$/g.exec(e);
                              i = t ? (t[1] ?? t[2] ?? "") : e;
                            }
                            return "true" === n.getAttribute("data-display")
                              ? (0, t.jsx)(u, { math: i }, a)
                              : (0, t.jsx)(c, { math: i }, a);
                          }
                          let r = Array.from(n.childNodes).map((t, i) =>
                              e(t, `${a}-${i}`),
                            ),
                            l = {};
                          (n.style.textAlign &&
                            (l.textAlign = n.style.textAlign),
                            n.style.fontSize && (l.fontSize = n.style.fontSize),
                            n.style.lineHeight &&
                              (l.lineHeight = n.style.lineHeight),
                            n.style.marginBottom &&
                              (l.marginBottom = n.style.marginBottom));
                          let o = Object.keys(l).length > 0 ? l : void 0;
                          switch (s) {
                            case "p":
                              return (0, t.jsx)(
                                "p",
                                {
                                  style: o,
                                  className:
                                    "center" === n.style.textAlign
                                      ? "text-center"
                                      : "right" === n.style.textAlign
                                        ? "text-right"
                                        : "justify" === n.style.textAlign
                                          ? "text-justify"
                                          : void 0,
                                  children:
                                    r.length > 0 ? r : (0, t.jsx)("br", {}),
                                },
                                a,
                              );
                            case "strong":
                            case "b":
                              return (0, t.jsx)(
                                "strong",
                                { style: o, children: r },
                                a,
                              );
                            case "em":
                            case "i":
                              return (0, t.jsx)(
                                "em",
                                { style: o, children: r },
                                a,
                              );
                            case "u":
                              return (0, t.jsx)(
                                "u",
                                { style: o, children: r },
                                a,
                              );
                            case "s":
                            case "strike":
                            case "del":
                              return (0, t.jsx)(
                                "s",
                                { style: o, children: r },
                                a,
                              );
                            case "sub":
                              return (0, t.jsx)(
                                "sub",
                                { style: o, children: r },
                                a,
                              );
                            case "sup":
                              return (0, t.jsx)(
                                "sup",
                                { style: o, children: r },
                                a,
                              );
                            case "br":
                              return (0, t.jsx)("br", {}, a);
                            case "span":
                              return (0, t.jsx)(
                                "span",
                                { style: o, children: r },
                                a,
                              );
                            default:
                              return (0, t.jsx)(i.Fragment, { children: r }, a);
                          }
                        }
                        return null;
                      })(e, n),
                    );
                  if (!n) return null;
                  let a = [],
                    o = n
                      .replace(
                        /\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g,
                        (e, i, n) => {
                          let s = a.length;
                          return (
                            void 0 !== i
                              ? a.push((0, t.jsx)(u, { math: i }, `bm-${s}`))
                              : a.push(
                                  (0, t.jsx)(c, { math: n ?? "" }, `im-${s}`),
                                ),
                            `\u0000MATH_${s}\u0000`
                          );
                        },
                      )
                      .split("\n")
                      .map(s);
                  return o.map((e, n) => {
                    var s, r;
                    let l = void 0 !== e.align,
                      d = o[n + 1]?.align !== void 0,
                      c =
                        ((s = e.text),
                        (r = a),
                        s
                          ? s
                              .split(/\u0000MATH_(\d+)\u0000/g)
                              .map((e, n) =>
                                n % 2 == 1
                                  ? (r[parseInt(e, 10)] ?? null)
                                  : (0, t.jsx)(
                                      i.Fragment,
                                      { children: g(e) },
                                      n,
                                    ),
                              )
                          : null);
                    return (0, t.jsxs)(
                      i.Fragment,
                      {
                        children: [
                          l
                            ? (0, t.jsx)("span", {
                                className: m[e.align],
                                children: c,
                              })
                            : c,
                          n < o.length - 1 && !l && !d && (0, t.jsx)("br", {}),
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
      i = e.i(490985),
      n = e.i(632781),
      a = e.i(328623),
      s = e.i(522016),
      r = e.i(271645),
      l = e.i(781947),
      o = e.i(167881),
      d = e.i(630374),
      c = e.i(715760),
      u = e.i(799887),
      m = e.i(775691),
      g = e.i(42118),
      x = e.i(452022),
      h = e.i(11485),
      f = e.i(310900),
      p = e.i(389567);
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
        let { options: N } = (0, f.useMetadataOptions)(),
          [w, C] = (0, r.useState)(""),
          [S, $] = (0, r.useState)(""),
          [T, k] = (0, r.useState)(""),
          [A, D] = (0, r.useState)(null),
          [R, L] = (0, r.useState)([]),
          [B, I] = (0, r.useState)(!1),
          [_, z] = (0, r.useState)(""),
          [P, E] = (0, r.useState)(""),
          M = (0, r.useCallback)(
            () =>
              Promise.all([
                (0, u.getMissions)().catch(() => null),
                (0, u.listSubmissions)({
                  documentId: b,
                  kind: "exam",
                  limit: 10,
                }),
              ]).then(([e, t]) => {
                (D(e?.missions.find((e) => "share_exam" === e.id) ?? null),
                  L(t.submissions));
              }),
            [b],
          );
        (0, r.useEffect)(() => {
          e && M().catch((e) => z(e.message));
        }, [e, M]);
        let V = (e) => {
            B || (e || (z(""), E("")), v(e));
          },
          O = R.some((e) => "pending" === e.status || "reviewing" === e.status);
        (0, r.useEffect)(() => {
          if (!e || !O) return;
          let t = window.setInterval(() => void M().catch(() => {}), 5e3);
          return () => window.clearInterval(t);
        }, [e, O, M]);
        let H = async () => {
          (I(!0), z(""), E(""));
          try {
            await y?.();
            let e = await (0, u.shareDocument)(b, {
              subject: w || void 0,
              grade: S ? Number(S) : void 0,
              examType: T || void 0,
            });
            ((0, p.track)("exam_share", { missionCounted: e.missionCounted }),
              E(
                e.missionCounted
                  ? "Đã gửi đề để xét duyệt. Lượt này được tính cho nhiệm vụ “Chia sẻ đề thi”."
                  : "Đã gửi đề để xét duyệt. Lượt này không được tính thưởng (nhiệm vụ đã hết lượt hoặc đang tắt).",
              ),
              await M());
          } catch (e) {
            (e instanceof c.ApiError &&
              401 === e.status &&
              (0, m.requestLogin)(),
              z(e instanceof Error ? e.message : "Không chia sẻ được đề."));
          } finally {
            I(!1);
          }
        };
        return (0, t.jsx)(d.Dialog, {
          open: e,
          onOpenChange: V,
          children: (0, t.jsxs)(d.DialogContent, {
            className: "max-h-[90dvh] overflow-y-auto sm:max-w-2xl",
            children: [
              (0, t.jsxs)(d.DialogHeader, {
                children: [
                  (0, t.jsxs)(d.DialogTitle, {
                    className: "flex items-center gap-2 text-xl font-normal",
                    children: [
                      (0, t.jsx)(i.Globe2, {
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
              A &&
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
                        A.title,
                      ],
                    }),
                    (0, t.jsx)("p", {
                      className: "mt-1 text-[#5f5e5b]",
                      children: (0, g.missionRewardText)(A),
                    }),
                    (0, t.jsxs)("p", {
                      className: "text-[#5f5e5b]",
                      children: [
                        (0, g.missionAttemptsText)(A),
                        " · ",
                        (0, g.missionResetText)(A),
                      ],
                    }),
                    !(0, g.missionAvailable)(A) &&
                      (0, t.jsx)("p", {
                        className: "mt-1 text-[#8a5a00]",
                        children:
                          "Bạn đã hết lượt trong chu kỳ này: vẫn chia sẻ được nhưng không nhận thưởng.",
                      }),
                    (0, t.jsx)(s.default, {
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
                  (0, t.jsx)(x.MetadataSelect, {
                    label: "Môn học",
                    value: w,
                    options: N?.subjects ?? [],
                    onChange: C,
                    noneLabel: "Tự động nhận diện",
                  }),
                  (0, t.jsx)(x.MetadataSelect, {
                    label: "Lớp",
                    value: S,
                    options: (0, x.gradeOptions)(N?.grades ?? []),
                    onChange: $,
                    noneLabel: "Tự động nhận diện",
                  }),
                  (0, t.jsx)(x.MetadataSelect, {
                    label: "Loại đề",
                    value: T,
                    options: N?.examTypes ?? [],
                    onChange: k,
                    noneLabel: "Tự động nhận diện",
                  }),
                ],
              }),
              _ &&
                (0, t.jsx)(l.Alert, {
                  variant: "destructive",
                  children: (0, t.jsx)(l.AlertDescription, { children: _ }),
                }),
              P &&
                (0, t.jsx)(l.Alert, {
                  children: (0, t.jsx)(l.AlertDescription, { children: P }),
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
                        h.SubmissionCard,
                        { submission: e, compact: !0 },
                        e.id,
                      ),
                    ),
                  ],
                }),
              (0, t.jsxs)(d.DialogFooter, {
                children: [
                  (0, t.jsx)(o.Button, {
                    variant: "outline",
                    onClick: () => V(!1),
                    disabled: B,
                    children: "Đóng",
                  }),
                  (0, t.jsxs)(o.Button, {
                    onClick: H,
                    disabled: B || O,
                    children: [
                      B &&
                        (0, t.jsx)(n.Loader2, {
                          "aria-hidden": !0,
                          className: "animate-spin",
                        }),
                      O ? "Đang chờ duyệt…" : "Gửi chia sẻ",
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
      i = e.i(716327),
      n = e.i(226091),
      a = e.i(576248),
      s = e.i(328623),
      r = e.i(271645),
      l = e.i(994179),
      o = e.i(981140),
      d = e.i(30030),
      c = e.i(369340),
      u = e.i(934620),
      m = e.i(820783),
      g = e.i(248425),
      x = e.i(296626),
      h = e.i(610772),
      f = Object.defineProperty,
      p = (e, t) => f(e, "name", { value: t, configurable: !0 }),
      v = "Collapsible",
      [b, j] = (0, d.createContextScope)(v),
      [y, N] = b(v),
      w = r.forwardRef(
        p(function (e, i) {
          let {
              __scopeCollapsible: n,
              open: a,
              defaultOpen: s,
              disabled: l,
              onOpenChange: o,
              ...d
            } = e,
            [u, m] = (0, c.useControllableState)({
              prop: a,
              defaultProp: s ?? !1,
              onChange: o,
              caller: v,
            });
          return (0, t.jsx)(y, {
            scope: n,
            disabled: l,
            contentId: (0, h.useId)(),
            open: u,
            onOpenToggle: r.useCallback(() => m((e) => !e), [m]),
            children: (0, t.jsx)(g.Primitive.div, {
              "data-state": k(u),
              "data-disabled": l ? "" : void 0,
              ...d,
              ref: i,
            }),
          });
        }, "Collapsible"),
      ),
      C = r.forwardRef(
        p(function (e, i) {
          let { __scopeCollapsible: n, ...a } = e,
            s = N("CollapsibleTrigger", n);
          return (0, t.jsx)(g.Primitive.button, {
            type: "button",
            "aria-controls": s.open ? s.contentId : void 0,
            "aria-expanded": s.open || !1,
            "data-state": k(s.open),
            "data-disabled": s.disabled ? "" : void 0,
            disabled: s.disabled,
            ...a,
            ref: i,
            onClick: (0, o.composeEventHandlers)(e.onClick, s.onOpenToggle),
          });
        }, "CollapsibleTrigger"),
      ),
      S = "CollapsibleContent",
      $ = r.forwardRef(
        p(function (e, i) {
          let { forceMount: n, ...a } = e,
            s = N(S, e.__scopeCollapsible);
          return (0, t.jsx)(x.Presence, {
            present: n || s.open,
            children: ({ present: e }) =>
              (0, t.jsx)(T, { ...a, ref: i, present: e }),
          });
        }, "CollapsibleContent"),
      ),
      T = r.forwardRef(
        p(function (e, i) {
          let { __scopeCollapsible: n, present: a, children: s, ...l } = e,
            o = N(S, n),
            [d, c] = r.useState(a),
            x = r.useRef(null),
            h = (0, m.useComposedRefs)(i, x),
            f = r.useRef(0),
            p = f.current,
            v = r.useRef(0),
            b = v.current,
            j = o.open || d,
            y = r.useRef(j),
            w = r.useRef(void 0);
          return (
            r.useEffect(() => {
              let e = requestAnimationFrame(() => (y.current = !1));
              return () => cancelAnimationFrame(e);
            }, []),
            (0, u.useLayoutEffect)(() => {
              let e = x.current;
              if (e) {
                ((w.current = w.current || {
                  transitionDuration: e.style.transitionDuration,
                  animationName: e.style.animationName,
                }),
                  (e.style.transitionDuration = "0s"),
                  (e.style.animationName = "none"));
                let t = e.getBoundingClientRect();
                ((f.current = t.height),
                  (v.current = t.width),
                  y.current ||
                    ((e.style.transitionDuration =
                      w.current.transitionDuration),
                    (e.style.animationName = w.current.animationName)),
                  c(a));
              }
            }, [o.open, a]),
            (0, t.jsx)(g.Primitive.div, {
              "data-state": k(o.open),
              "data-disabled": o.disabled ? "" : void 0,
              id: o.contentId,
              hidden: !j,
              ...l,
              ref: h,
              style: {
                "--radix-collapsible-content-height": p ? `${p}px` : void 0,
                "--radix-collapsible-content-width": b ? `${b}px` : void 0,
                ...e.style,
              },
              children: j && s,
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
          w,
          "CollapsibleContent",
          0,
          $,
          "CollapsibleTrigger",
          0,
          C,
          "Content",
          0,
          $,
          "Root",
          0,
          w,
          "Trigger",
          0,
          C,
          "createCollapsibleScope",
          0,
          j,
        ],
        687607,
      ));
    var A = e.i(687607),
      A = A;
    function D({ ...e }) {
      return (0, t.jsx)(A.Root, { "data-slot": "collapsible", ...e });
    }
    function R({ ...e }) {
      return (0, t.jsx)(A.CollapsibleTrigger, {
        "data-slot": "collapsible-trigger",
        ...e,
      });
    }
    function L({ ...e }) {
      return (0, t.jsx)(A.CollapsibleContent, {
        "data-slot": "collapsible-content",
        ...e,
      });
    }
    var B = e.i(604131),
      I = e.i(42118),
      _ = e.i(647163);
    let z = {
        pending: "bg-[#fef7e0] text-[#8a5a00]",
        reviewing: "bg-[#e7f3f8] text-[#2383e2]",
        awaiting_admin: "bg-[#fef7e0] text-[#8a5a00]",
        approved: "bg-[#dbeddb] text-[#1c3829]",
        rejected: "bg-[#fdebec] text-[#a50e0e]",
        failed: "bg-[#fdebec] text-[#a50e0e]",
      },
      P = {
        novel: "bg-[#dbeddb] text-[#1c3829]",
        variant: "bg-[#fef7e0] text-[#8a5a00]",
        duplicate: "bg-[#fdebec] text-[#a50e0e]",
        common: "bg-[#f1f1ef] text-[#5f5e5b]",
        invalid: "bg-[#fdebec] text-[#a50e0e]",
      };
    function E({ status: e }) {
      return (0, t.jsx)(l.Badge, {
        className: (0, _.cn)("border-0 font-medium", z[e]),
        children: I.STATUS_LABEL[e],
      });
    }
    e.s(
      [
        "SubmissionCard",
        0,
        function ({ submission: e, compact: o }) {
          let [d, c] = (0, r.useState)(!1),
            u = e.review?.questions ?? [],
            m =
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
                            (0, t.jsxs)(l.Badge, {
                              className: "border-0 bg-[#dbeddb] text-[#1c3829]",
                              children: [
                                (0, t.jsx)(s.Sparkles, { "aria-hidden": !0 }),
                                " +",
                                e.rewardPoints.toLocaleString("vi-VN"),
                                " điểm",
                              ],
                            }),
                          "approved" === e.status &&
                            "exam" === e.kind &&
                            !e.published &&
                            (0, t.jsx)(l.Badge, {
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
                          (0, I.formatDateTime)(e.createdAt),
                          e.reviewedAt &&
                            ` \xb7 duyệt ${(0, I.formatDateTime)(e.reviewedAt)}`,
                          e.missionId
                            ? " · tính cho nhiệm vụ"
                            : " · không tính nhiệm vụ",
                        ],
                      }),
                      (e.reason || m) &&
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
                          children: (0, t.jsx)(B.RichText, { text: e.excerpt }),
                        }),
                    ],
                  }),
                ],
              }),
              u.length > 0 &&
                (0, t.jsxs)(D, {
                  open: d,
                  onOpenChange: c,
                  className: "mt-3",
                  children: [
                    (0, t.jsxs)(R, {
                      className:
                        "flex items-center gap-1 text-sm font-medium text-[#2383e2] hover:underline",
                      children: [
                        (0, t.jsx)(i.ChevronDown, {
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
                    (0, t.jsx)(L, {
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
                                    (0, t.jsx)(l.Badge, {
                                      className: (0, _.cn)(
                                        "border-0",
                                        P[e.verdict] ?? P.variant,
                                      ),
                                      children:
                                        I.VERDICT_LABEL[e.verdict] ?? e.verdict,
                                    }),
                                  ],
                                }),
                                (0, t.jsx)("p", {
                                  className:
                                    "mt-1 line-clamp-3 text-sm text-[#787774]",
                                  children: (0, t.jsx)(B.RichText, {
                                    text: e.stem,
                                  }),
                                }),
                                e.reason &&
                                  (0, t.jsx)("p", {
                                    className: "mt-1 text-sm text-[#37352f]",
                                    children: (0, t.jsx)(B.RichText, {
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
  310900,
  (e) => {
    "use strict";
    var t = e.i(271645),
      i = e.i(799887);
    let n = null;
    e.s([
      "useMetadataOptions",
      0,
      function () {
        let [e, a] = (0, t.useState)(null),
          [s, r] = (0, t.useState)("");
        return (
          (0, t.useEffect)(() => {
            let e = !0;
            return (
              (n ??= (0, i.getMetadataOptions)().then((e) => e.options))
                .then((t) => e && a(t))
                .catch((t) => {
                  ((n = null), e && r(t.message));
                }),
              () => {
                e = !1;
              }
            );
          }, []),
          { options: e, error: s }
        );
      },
    ]);
  },
  216978,
  (e) => {
    "use strict";
    var t = e.i(843476),
      i = e.i(770703),
      n = e.i(271645),
      a = e.i(647163);
    let s = (0, i.default)(() => e.A(458094).then((e) => e.DocThumbnailPage), {
      loadableGenerated: { modules: [303604] },
      ssr: !1,
    });
    e.s([
      "DocThumbnail",
      0,
      function ({ excerpt: e, className: i }) {
        let r = (0, n.useRef)(null),
          [l, o] = (0, n.useState)(!1);
        (0, n.useEffect)(() => {
          let e = r.current;
          if (!e || l) return;
          let t = new IntersectionObserver(
            (e) => {
              e.some((e) => e.isIntersecting) && o(!0);
            },
            { rootMargin: "200px" },
          );
          return (t.observe(e), () => t.disconnect());
        }, [l]);
        let d = !e?.trim();
        return (0, t.jsxs)("div", {
          ref: r,
          "aria-hidden": !0,
          className: (0, a.cn)(
            "relative h-full w-full overflow-hidden bg-white",
            i,
          ),
          children: [
            d &&
              (0, t.jsx)("div", {
                className: "space-y-1.5 px-4 pt-4",
                children: [90, 70, 80, 60].map((e) =>
                  (0, t.jsx)(
                    "div",
                    {
                      className: "h-1 rounded-full bg-[#eceff1]",
                      style: { width: `${e}%` },
                    },
                    e,
                  ),
                ),
              }),
            l && e && !d && (0, t.jsx)(s, { excerpt: e }),
          ],
        });
      },
    ]);
  },
  42118,
  (e) => {
    "use strict";
    let t = "Asia/Ho_Chi_Minh";
    function i(e) {
      let t = ["B", "KB", "MB", "GB", "TB"],
        i = Math.max(0, e),
        n = 0;
      for (; i >= 1024 && n < t.length - 1; ) ((i /= 1024), n++);
      let a = 0 === n || i >= 100 ? 0 : 1;
      return `${i.toFixed(a).replace(".", ",").replace(/,0$/, "")} ${t[n]}`;
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
    function s(e) {
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
      i,
      "formatDate",
      0,
      a,
      "formatDateTime",
      0,
      n,
      "formatRecent",
      0,
      function (e, i = new Date()) {
        let n = new Date(e);
        return n.toLocaleDateString("vi-VN", { timeZone: t }) ===
          i.toLocaleDateString("vi-VN", { timeZone: t })
          ? n.toLocaleTimeString("vi-VN", {
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
          : `L\xe0m mới ${s(e.resetHours)} \xb7 lần tới ${n(e.nextResetAt)}`;
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
      s,
      "storageLimitNote",
      0,
      function (e) {
        let t = e.override;
        return t?.active
          ? t.expiresAt
            ? `Hạn mức ${i(t.limitBytes)} đến ${n(t.expiresAt)}, sau đ\xf3 về mức ${i(e.defaultLimitBytes)}.`
            : `Hạn mức ${i(t.limitBytes)}, kh\xf4ng thời hạn.`
          : `Hạn mức ${i(e.defaultLimitBytes)}.`;
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
  959411,
  (e) => {
    "use strict";
    var t = e.i(271645),
      i = e.i(248425),
      n = e.i(843476),
      a = Object.defineProperty,
      s = Object.freeze({
        position: "absolute",
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        wordWrap: "normal",
      }),
      r = t.forwardRef(
        a(
          function (e, t) {
            return (0, n.jsx)(i.Primitive.span, {
              ...e,
              ref: t,
              style: { ...s, ...e.style },
            });
          },
          "name",
          { value: "VisuallyHidden", configurable: !0 },
        ),
      );
    e.s(["Root", 0, r, "VISUALLY_HIDDEN_STYLES", 0, s]);
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
    var i = e.i(843476),
      n = e.i(10708),
      a = e.i(62870);
    let s = "__none__";
    e.s(
      [
        "MetadataSelect",
        0,
        function ({
          label: e,
          value: t,
          options: r,
          onChange: l,
          placeholder: o = "Chọn",
          noneLabel: d,
          required: c,
          disabled: u,
        }) {
          return (0, i.jsxs)(n.Label, {
            className: "grid gap-1.5 text-[13px] font-medium text-[#5f5e5b]",
            children: [
              (0, i.jsxs)("span", {
                children: [
                  e,
                  c &&
                    (0, i.jsx)("span", {
                      className: "text-[#eb5757]",
                      children: " *",
                    }),
                ],
              }),
              (0, i.jsxs)(a.Select, {
                value: "" === t ? (d ? s : "") : t,
                onValueChange: (e) => l(e === s ? "" : e),
                disabled: u,
                children: [
                  (0, i.jsx)(a.SelectTrigger, {
                    className: "w-full bg-white",
                    "aria-label": e,
                    children: (0, i.jsx)(a.SelectValue, { placeholder: o }),
                  }),
                  (0, i.jsxs)(a.SelectContent, {
                    className: "max-h-72",
                    children: [
                      d && (0, i.jsx)(a.SelectItem, { value: s, children: d }),
                      r.map((e) =>
                        (0, i.jsx)(
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
]);
