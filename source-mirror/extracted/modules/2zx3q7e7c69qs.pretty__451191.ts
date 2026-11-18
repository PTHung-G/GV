// Reconstructed from 2zx3q7e7c69qs.pretty.js, module 451191.
// deps: none
// exports: none


"use strict";
    function n(e, t = !0) {
      return e.pathname + e.search + (t ? e.hash : "");
    }
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "createHrefFromUrl", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }),
      ("function" == typeof r.default ||
        ("object" == typeof r.default && null !== r.default)) &&
        void 0 === r.default.__esModule &&
        (Object.defineProperty(r.default, "__esModule", { value: !0 }),
        Object.assign(r.default, r),
        (t.exports = r.default)));
