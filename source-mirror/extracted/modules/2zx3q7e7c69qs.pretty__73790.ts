// Reconstructed from 2zx3q7e7c69qs.pretty.js, module 73790.
// deps: m734727, m595871, m760355, m620896, m179027
// exports: none


"use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "restoreReducer", {
        enumerable: !0,
        get: function () {
          return o;
        },
      }));
    let n = m734727,
      a = m595871,
      l = m760355,
      u = m620896,
      i = m179027;
    function o(e, t) {
      let r,
        o,
        c = t.historyState;
      c
        ? ((r = c.tree), (o = c.renderedSearch))
        : ((r = e.tree), (o = e.renderedSearch));
      let s = new URL(e.canonicalUrl, location.origin),
        f = t.url,
        d = (0, n.extractPathFromFlightRouterState)(r) ?? f.pathname,
        h = Date.now(),
        p = { separateRefreshUrls: null, scrollRef: null },
        y = (0, l.convertServerPatchToFullTree)(
          h,
          r,
          null,
          o,
          i.UnknownDynamicStaleTime,
        ),
        g = (0, a.startPPRNavigation)(
          h,
          s,
          e.renderedSearch,
          e.cache,
          e.tree,
          y.routeTree,
          y.metadataVaryPath,
          a.FreshnessPolicy.HistoryTraversal,
          null,
          null,
          y.dynamicStaleAt,
          !1,
          p,
          u.segmentCacheMap,
          !1,
        );
      return null === g
        ? (0, l.completeHardNavigation)(e, f, "replace")
        : ((0, a.spawnDynamicRequests)(
            g,
            f,
            d,
            a.FreshnessPolicy.HistoryTraversal,
            p,
            null,
            "replace",
            null,
            u.segmentCacheMap,
            void 0,
          ),
          (0, a.resetNavigationLockToPending)(),
          (0, l.completeTraverseNavigation)(e, f, o, g.node, g.route, d));
    }
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
