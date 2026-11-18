// Reconstructed from 0ro5n-m-6x12_.pretty.js, module 597238.
// deps: m247167, m555682, m132061, m302023, m528279
// exports: none


"use strict";
    (m247167, Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      isRecoverableError: function () {
        return s;
      },
      onRecoverableError: function () {
        return c;
      },
    };
    for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
    let a = m555682,
      l = m132061,
      i = a._(m302023),
      u = m528279,
      d = new WeakSet();
    function s(e) {
      return d.has(e);
    }
    let c = (e) => {
      let t = (0, i.default)(e) && "cause" in e ? e.cause : e;
      (0, l.isBailoutToCSRError)(t) || (0, u.reportGlobalError)(t);
    };
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
