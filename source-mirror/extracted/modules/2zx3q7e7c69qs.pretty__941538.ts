// Reconstructed from 2zx3q7e7c69qs.pretty.js, module 941538.
// deps: m247167, m190809, m271645, m564245, m388540
// exports: none


"use strict";
    (m247167, Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      dispatchAppRouterAction: function () {
        return c;
      },
      dispatchGestureState: function () {
        return f;
      },
      refreshOnInstantNavigationUnlock: function () {
        return o;
      },
      useActionQueue: function () {
        return d;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    let l = m190809._(m271645),
      u = m564245;
    m388540;
    let i = null;
    function o() {}
    function c(e) {
      if (null === i)
        throw Object.defineProperty(
          Error(
            "Internal Next.js error: Router action dispatched before initialization.",
          ),
          "__NEXT_ERROR_CODE",
          { value: "E668", enumerable: !1, configurable: !0 },
        );
      i(e);
    }
    let s = null;
    function f(e) {
      if (null === s)
        throw Object.defineProperty(
          Error(
            "Internal Next.js error: Router action dispatched before initialization.",
          ),
          "__NEXT_ERROR_CODE",
          { value: "E668", enumerable: !1, configurable: !0 },
        );
      s(e);
    }
    function d(e) {
      let [t, r] = l.default.useState(e.state),
        [n, a] = (0, l.useOptimistic)(t);
      ("u" > typeof window && (s = a),
        "u" > typeof window && (i = (t) => e.dispatch(t, r)));
      let o = (0, l.useMemo)(() => n, [n]);
      return (0, u.isThenable)(o) ? (0, l.use)(o) : o;
    }
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
