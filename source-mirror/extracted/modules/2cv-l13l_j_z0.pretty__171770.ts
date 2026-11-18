// Reconstructed from 2cv-l13l_j_z0.pretty.js, module 171770.
// deps: none
// exports: none


"use strict";
    var i = t.r(965464),
      n = t.r(687780),
      a = t.r(212189),
      s = t.r(41370),
      o = t.r(744429),
      h = t.r(715841);
    e.exports = function (t) {
      var e = i.getTypeOf(t);
      return (i.checkSupport(e), "string" !== e || n.uint8array)
        ? "nodebuffer" === e
          ? new o(t)
          : n.uint8array
            ? new h(i.transformTo("uint8array", t))
            : new a(i.transformTo("array", t))
        : new s(t);
    };
