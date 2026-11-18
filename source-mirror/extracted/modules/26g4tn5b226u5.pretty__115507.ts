// Reconstructed from 26g4tn5b226u5.pretty.js, module 115507.
// deps: m132061, m265713
// exports: none


"use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "unstable_rethrow", {
        enumerable: !0,
        get: function () {
          return function e(t) {
            if ((0, o.isNextRouterError)(t) || (0, n.isBailoutToCSRError)(t))
              throw t;
            t instanceof Error && "cause" in t && e(t.cause);
          };
        },
      }));
    let n = m132061,
      o = m265713;
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
