// Reconstructed from 1edfvwc5_eck-.pretty.js, module 590373.
// deps: m271645, m261994, m901425
// exports: none


"use strict";
    (Object.defineProperty(t, "__esModule", { value: !0 }),
      Object.defineProperty(t, "useUntrackedPathname", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    let n = m271645,
      o = m261994,
      i = m901425;
    function a() {
      return !(function () {
        if ("u" < typeof window) {
          let e = i.workUnitAsyncStorage.getStore();
          if (!e) return !1;
          switch (e.type) {
            case "prerender":
            case "prerender-client":
            case "prerender-ppr":
            case "validation-client":
              let r = e.fallbackRouteParams;
              return !!r && r.size > 0;
          }
        }
        return !1;
      })()
        ? (0, n.useContext)(o.PathnameContext)
        : null;
    }
    ("function" == typeof t.default ||
      ("object" == typeof t.default && null !== t.default)) &&
      void 0 === t.default.__esModule &&
      (Object.defineProperty(t.default, "__esModule", { value: !0 }),
      Object.assign(t.default, t),
      (r.exports = t.default));
