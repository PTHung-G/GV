// Reconstructed from 2-_e50duc2fl9.pretty.js, module 309885.
// deps: none
// exports: none


"use strict";
    function n(e) {
      return e
        .split("/")
        .map((e) => encodeURIComponent(e))
        .join("/");
    }
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "encodeURIPath", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
