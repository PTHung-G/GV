// Reconstructed from 1-4r_6ai0xs1p.pretty.js, module 30030.
// deps: m271645, m843476
// exports: createContextScope
export { l as "createContextScope" };

"use strict";
    var t = m271645,
      r = m843476,
      n = Object.defineProperty,
      o = (e, t) => n(e, "name", { value: t, configurable: !0 });
    function l(e, n = []) {
      let a = [];
      function s(n, l) {
        let i = t.createContext(l);
        i.displayName = n + "Context";
        let s = a.length;
        a = [...a, l];
        let u = o((n) => {
          let { scope: o, children: l, ...a } = n,
            u = o?.[e]?.[s] || i,
            c = t.useMemo(() => a, Object.values(a));
          return (0, r.jsx)(u.Provider, { value: c, children: l });
        }, "Provider");
        function c(r, o, a = {}) {
          let { optional: u = !1 } = a,
            f = o?.[e]?.[s] || i,
            d = t.useContext(f);
          if (d) return d;
          if (void 0 !== l) return l;
          if (!u) throw Error(`\`${r}\` must be used within \`${n}\``);
        }
        return ((u.displayName = n + "Provider"), o(c, "useContext"), [u, c]);
      }
      o(s, "createContext");
      let u = o(() => {
        let r = a.map((e) => t.createContext(e));
        return o(function (n) {
          let o = n?.[e] || r;
          return t.useMemo(
            () => ({ [`__scope${e}`]: { ...n, [e]: o } }),
            [n, o],
          );
        }, "useScope");
      }, "createScope");
      return ((u.scopeName = e), [s, i(u, ...n)]);
    }
    function i(...e) {
      let r = e[0];
      if (1 === e.length) return r;
      let n = o(() => {
        let n = e.map((e) => ({ useScope: e(), scopeName: e.scopeName }));
        return o(function (e) {
          let o = n.reduce((t, { useScope: r, scopeName: n }) => {
            let o = r(e)[`__scope${n}`];
            return { ...t, ...o };
          }, {});
          return t.useMemo(() => ({ [`__scope${r.scopeName}`]: o }), [o]);
        }, "useComposedScopes");
      }, "createScope");
      return ((n.scopeName = r.scopeName), n);
    }
    (o(function (e, n) {
      let l = t.createContext(n);
      l.displayName = e + "Context";
      let i = o((e) => {
        let { children: n, ...o } = e,
          i = t.useMemo(() => o, Object.values(o));
        return (0, r.jsx)(l.Provider, { value: i, children: n });
      }, "Provider");
      function a(r, o = {}) {
        let { optional: i = !1 } = o,
          s = t.useContext(l);
        if (s) return s;
        if (void 0 !== n) return n;
        if (!i) throw Error(`\`${r}\` must be used within \`${e}\``);
      }
      return ((i.displayName = e + "Provider"), o(a, "useContext"), [i, a]);
    }, "createContext"),
      o(l, "createContextScope"),
      o(i, "composeContextScopes"),
      );
