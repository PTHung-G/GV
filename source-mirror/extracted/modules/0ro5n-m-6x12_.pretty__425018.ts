// Reconstructed from 0ro5n-m-6x12_.pretty.js, module 425018.
// deps: m813258, m270725
// exports: none


"use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "findHeadInCache", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    let n = m813258,
      o = m270725;
    function a(e, t) {
      return (function e(t, r, a, l) {
        if (0 === Object.keys(r).length) return [t, a, l];
        let i = Object.keys(r).filter((e) => "children" !== e);
        "children" in r && i.unshift("children");
        let u = t.slots;
        if (null !== u)
          for (let t of i) {
            let [l, i] = r[t];
            if (l === n.DEFAULT_SEGMENT_KEY) continue;
            let d = u[t];
            if (!d) continue;
            let s = e(
              d,
              i,
              a + "/" + (0, o.createRouterCacheKey)(l),
              a + "/" + (0, o.createRouterCacheKey)(l, !0),
            );
            if (s) return s;
          }
        return null;
      })(e, t, "", "");
    }
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
