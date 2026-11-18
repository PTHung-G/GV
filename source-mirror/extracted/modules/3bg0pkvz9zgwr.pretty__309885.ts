// Reconstructed from 3bg0pkvz9zgwr.pretty.js, module 309885.
// deps: none
// exports: none


"use strict";
    function a(t) {
      return t
        .split("/")
        .map((t) => encodeURIComponent(t))
        .join("/");
    }
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "encodeURIPath", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
