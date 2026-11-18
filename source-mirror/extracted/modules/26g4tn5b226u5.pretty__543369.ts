// Reconstructed from 26g4tn5b226u5.pretty.js, module 543369.
// deps: m247167
// exports: none


"use strict";
    
    (m247167, Object.defineProperty(r, "__esModule", { value: !0 }));
    var o = {
      getAssetToken: function () {
        return c;
      },
      getAssetTokenQuery: function () {
        return l;
      },
      getDeploymentId: function () {
        return i;
      },
      getDeploymentIdQuery: function () {
        return a;
      },
    };
    for (var u in o) Object.defineProperty(r, u, { enumerable: !0, get: o[u] });
    function i() {
      return n;
    }
    function a(e = !1) {
      let t = n;
      return t ? `${e ? "&" : "?"}dpl=${t}` : "";
    }
    function c() {
      return !1;
    }
    function l(e = !1) {
      return "";
    }
    "u" > typeof window
      ? ((n = document.documentElement.dataset.dplId),
        delete document.documentElement.dataset.dplId)
      : (n = void 0);
