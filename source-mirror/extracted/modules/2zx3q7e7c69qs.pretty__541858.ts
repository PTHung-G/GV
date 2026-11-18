// Reconstructed from 2zx3q7e7c69qs.pretty.js, module 541858.
// deps: m572463
// exports: none


"use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "addPathPrefix", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    let n = m572463;
    function a(e, t) {
      if (!e.startsWith("/") || !t) return e;
      let { pathname: r, query: a, hash: l } = (0, n.parsePath)(e);
      return `${t}${r}${a}${l}`;
    }
