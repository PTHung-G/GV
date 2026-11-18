// Reconstructed from 2zx3q7e7c69qs.pretty.js, module 179027.
// deps: m754069, m511
// exports: none


"use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      UnknownDynamicStaleTime: function () {
        return i;
      },
      computeDynamicStaleAt: function () {
        return o;
      },
      invalidateBfCache: function () {
        return f;
      },
      readFromBFCache: function () {
        return y;
      },
      readFromBFCacheDuringRegularNavigation: function () {
        return g;
      },
      updateBFCacheEntryStaleAt: function () {
        return p;
      },
      writeHeadToBFCache: function () {
        return h;
      },
      writeToBFCache: function () {
        return d;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    let l = m754069,
      u = m511,
      i = -1;
    function o(e, t) {
      return t !== i ? e + 1e3 * t : e + l.DYNAMIC_STALETIME_MS;
    }
    let c = (0, u.createCacheMap)(),
      s = 0;
    function f() {
      "u" > typeof window && s++;
    }
    function d(e, t, r, n, a, l, i, o) {
      if ("u" < typeof window) return;
      let f = {
        rsc: r,
        prefetchRsc: n,
        head: a,
        prefetchHead: l,
        bfcacheId: o,
        ref: null,
        size: 100,
        navigatedAt: e,
        staleAt: i,
        version: s,
        status: u.EntryStatus.Fulfilled,
      };
      (0, u.setInCacheMap)(c, t, f, !1);
    }
    function h(e, t, r, n, a, l) {
      d(e, t, r, n, null, null, a, l);
    }
    function p(e, t) {
      if ("u" < typeof window) return;
      let r = (0, u.getFromCacheMap)(-1, s, c, e, !1, !1);
      null !== r && (r.staleAt = t);
    }
    function y(e) {
      return "u" < typeof window
        ? null
        : (0, u.getFromCacheMap)(-1, s, c, e, !1, !1);
    }
    function g(e, t) {
      return "u" < typeof window
        ? null
        : (0, u.getFromCacheMap)(e, s, c, t, !1, !1);
    }
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
