// Reconstructed from 0moy4u4hwkt-l.pretty.js, module 287336.
// deps: m843476, m179862, m271645, m30030, m248425, m676027
// exports: Indicator, Progress, ProgressIndicator, Root, createProgressScope, Progress
export { f as "Indicator" };
export { m as "Progress" };
export { f as "ProgressIndicator" };
export { m as "Root" };
export { d as "createProgressScope" };
export { function ({ className: e, value: r, ...a }) { return (0, t.jsx)(w.Root, { "data-slot": "progress", className: (0, n.cn)( "relative h-2 w-full overflow-hidden rounded-full bg-primary/20", e, ), ...a, children: (0, t.jsx)(w.Indicator, { "data-slot": "progress-indicator", className: "h-full w-full flex-1 bg-primary transition-all", style: { transform: `translateX(-${100 - (r || 0)}%)` }, }), }); } as "Progress" };

"use strict";
    var t = m843476,
      n = m179862,
      r = m271645,
      a = m30030,
      i = m248425,
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
      );
    var w = m676027,
      w = w;
    ;
