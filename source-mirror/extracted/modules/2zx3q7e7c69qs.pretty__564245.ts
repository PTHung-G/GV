// Reconstructed from 2zx3q7e7c69qs.pretty.js, module 564245.
// deps: none
// exports: none


"use strict";
    function n(e) {
      return (
        null !== e &&
        "object" == typeof e &&
        "then" in e &&
        "function" == typeof e.then
      );
    }
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "isThenable", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
