// Reconstructed from 1em08pi09_cer.pretty.js, module 287336.
// deps: m843476, m179862, m271645, m30030, m248425, m676027
// exports: Indicator, Progress, ProgressIndicator, Root, createProgressScope, Progress
export { m as "Indicator" };
export { f as "Progress" };
export { m as "ProgressIndicator" };
export { f as "Root" };
export { c as "createProgressScope" };
export { function ({ className: e, value: r, ...i }) { return (0, t.jsx)(D.Root, { "data-slot": "progress", className: (0, a.cn)( "relative h-2 w-full overflow-hidden rounded-full bg-primary/20", e, ), ...i, children: (0, t.jsx)(D.Indicator, { "data-slot": "progress-indicator", className: "h-full w-full flex-1 bg-primary transition-all", style: { transform: `translateX(-${100 - (r || 0)}%)` }, }), }); } as "Progress" };

"use strict";
    var t = m843476,
      a = m179862,
      r = m271645,
      i = m30030,
      n = m248425,
      l = Object.defineProperty,
      o = (e, t) => l(e, "name", { value: t, configurable: !0 }),
      s = "Progress",
      [d, c] = (0, i.createContextScope)(s),
      [u, g] = d(s),
      f = r.forwardRef(
        o(function (e, a) {
          let {
            __scopeProgress: r,
            value: i = null,
            max: l,
            getValueLabel: o = p,
            ...s
          } = e;
          (l || 0 === l) && !h(l) && console.error(j(`${l}`, "Progress"));
          let d = h(l) ? l : 100;
          null === i || y(i, d) || console.error(b(`${i}`, "Progress"));
          let c = y(i, d) ? i : null,
            g = v(c) ? o(c, d) : void 0;
          return (0, t.jsx)(u, {
            scope: r,
            value: c,
            max: d,
            children: (0, t.jsx)(n.Primitive.div, {
              "aria-valuemax": d,
              "aria-valuemin": 0,
              "aria-valuenow": v(c) ? c : void 0,
              "aria-valuetext": g,
              role: "progressbar",
              "data-state": x(c, d),
              "data-value": c ?? void 0,
              "data-max": d,
              ...s,
              ref: a,
            }),
          });
        }, "Progress"),
      ),
      m = r.forwardRef(
        o(function (e, a) {
          let { __scopeProgress: r, ...i } = e,
            l = g("ProgressIndicator", r);
          return (0, t.jsx)(n.Primitive.div, {
            "data-state": x(l.value, l.max),
            "data-value": l.value ?? void 0,
            "data-max": l.max,
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
    function v(e) {
      return "number" == typeof e;
    }
    function h(e) {
      return v(e) && !isNaN(e) && e > 0;
    }
    function y(e, t) {
      return v(e) && !isNaN(e) && e <= t && e >= 0;
    }
    function j(e, t) {
      return `Invalid prop \`max\` of value \`${e}\` supplied to \`${t}\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`;
    }
    function b(e, t) {
      return `Invalid prop \`value\` of value \`${e}\` supplied to \`${t}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
    }
    (o(p, "defaultGetValueLabel"),
      o(x, "getProgressState"),
      o(v, "isNumber"),
      o(h, "isValidMaxNumber"),
      o(y, "isValidValueNumber"),
      o(j, "getInvalidMaxError"),
      o(b, "getInvalidValueError"),
      );
    var D = m676027,
      D = D;
    ;
