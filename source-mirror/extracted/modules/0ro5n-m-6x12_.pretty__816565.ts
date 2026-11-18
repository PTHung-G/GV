// Reconstructed from 0ro5n-m-6x12_.pretty.js, module 816565.
// deps: none
// exports: none


"use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      getObjectClassLabel: function () {
        return a;
      },
      isPlainObject: function () {
        return l;
      },
    };
    for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
    function a(e) {
      return Object.prototype.toString.call(e);
    }
    function l(e) {
      if ("[object Object]" !== a(e)) return !1;
      let t = Object.getPrototypeOf(e);
      return null === t || t.hasOwnProperty("isPrototypeOf");
    }
