// Reconstructed from 2-_e50duc2fl9.pretty.js, module 667585.
// deps: m132061
// exports: none


"use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "BailoutToCSR", {
        enumerable: !0,
        get: function () {
          return s;
        },
      }));
    let n = m132061;
    function s({ reason: e, children: t }) {
      if ("u" < typeof window)
        throw Object.defineProperty(
          new n.BailoutToCSRError(e),
          "__NEXT_ERROR_CODE",
          { value: "E394", enumerable: !1, configurable: !0 },
        );
      return t;
    }
