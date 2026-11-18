// Reconstructed from 2zx3q7e7c69qs.pretty.js, module 76138.
// deps: m247167, m813258, m734727
// exports: none


"use strict";
    (m247167, Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      initializeRouterTransitionModules: function () {
        return u;
      },
      startRouterTransition: function () {
        return i;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    (m813258, m734727);
    let l = [];
    function u(e) {
      l = e.filter((e) => null != e);
    }
    function i(e, t, r, n) {
      for (let r of l)
        try {
          
          ((n = r), n.onRouterTransitionStart?.(e, t, null));
        } catch (e) {
          console.error(
            "An instrumentation-client router transition hook failed",
            e,
          );
        }
    }
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
