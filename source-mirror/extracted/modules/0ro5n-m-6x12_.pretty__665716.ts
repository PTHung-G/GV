// Reconstructed from 0ro5n-m-6x12_.pretty.js, module 665716.
// deps: m451191, m734727, m450590, m595871, m620896, m509396, m179027, m787288, m496167
// exports: none


"use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "createInitialRouterState", {
        enumerable: !0,
        get: function () {
          return f;
        },
      }));
    let n = m451191,
      o = m734727,
      a = m450590,
      l = m595871,
      i = m620896,
      u = m509396,
      d = m179027,
      s = m787288,
      c = m496167;
    function f({
      navigatedAt: e,
      initialRSCPayload: t,
      initialFlightStreamForCache: r,
      location: p,
    }) {
      let {
          c: h,
          f: _,
          q: y,
          i: b,
          S: m,
          s: v,
          l: E,
          h: g,
          r: w,
          p: P,
          d: j,
        } = t,
        R = h.join("/"),
        {
          tree: S,
          seedData: O,
          head: x,
        } = (0, a.getFlightDataPartsFromPath)(_[0]),
        M = p ? (0, n.createHrefFromUrl)(p) : R,
        T = { metadataVaryPath: null, treeDivergedFromBase: !1 },
        A = (0, i.convertRootFlightRouterStateToRouteTree)(S, y, T),
        C = T.metadataVaryPath,
        N = (0, l.createInitialCacheNodeForHydration)(
          e,
          A,
          O,
          x,
          (0, d.computeDynamicStaleAt)(e, j ?? d.UnknownDynamicStaleTime),
        );
      if (null !== p && null !== C) {
        if (
          ((0, c.discoverKnownRoute)(
            Date.now(),
            p.pathname,
            p.search,
            null,
            null,
            A,
            C,
            b,
            M,
            m,
            !1,
          ),
          null !== O && void 0 !== v)
        )
          if (void 0 !== E && null != r)
            Promise.resolve(E)
              .then(async (e) => {
                let t = await (0, s.decodeStageUntilBoundary)(r, e, void 0),
                  n = Date.now(),
                  o = await (0, i.resolveStaleAt)(n, t.s);
                (0, i.writePrerenderResponseIntoCache)(
                  n,
                  u.FetchStrategy.PPR,
                  t.f,
                  void 0,
                  t.h,
                  t.r ?? null,
                  o,
                  S,
                  y,
                  !0,
                  i.segmentCacheMap,
                );
              })
              .catch(() => {});
          else {
            let e = Date.now();
            ((0, i.resolveStaleAt)(e, v)
              .then((t) => {
                (0, i.writePrerenderResponseIntoCache)(
                  e,
                  u.FetchStrategy.PPR,
                  _,
                  void 0,
                  g,
                  w ?? null,
                  t,
                  S,
                  y,
                  !1,
                  i.segmentCacheMap,
                );
              })
              .catch(() => {}),
              r?.cancel());
          }
        else r?.cancel();
        null != P &&
          (0, i.processRuntimePrefetchStream)(Date.now(), P, S, y)
            .then((e) => {
              null !== e &&
                (0, i.writeDynamicRenderResponseIntoCache)(
                  Date.now(),
                  u.FetchStrategy.PPRRuntime,
                  e.flightDatas,
                  e.buildId,
                  e.isResponsePartial,
                  e.headVaryParams,
                  e.rootVaryParamsIterable,
                  e.staleAt,
                  e.navigationSeed,
                  null,
                  i.segmentCacheMap,
                );
            })
            .catch(() => {});
      }
      return {
        tree: N.route,
        cache: N.node,
        pushRef: {
          pendingPush: !1,
          mpaNavigation: !1,
          preserveCustomHistoryState: !0,
        },
        focusAndScrollRef: {
          scrollRef: null,
          forceScroll: !1,
          onlyHashChange: !1,
          hashFragment: null,
        },
        canonicalUrl: M,
        renderedSearch: y,
        nextUrl:
          ((0, o.extractPathFromFlightRouterState)(S) || p?.pathname) ?? null,
        previousNextUrl: null,
        debugInfo: null,
      };
    }
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
