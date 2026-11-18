// Reconstructed from 2zx3q7e7c69qs.pretty.js, module 760355.
// deps: m247167, m522744, m787288, m595871, m451191, m663416, m620896, m496167, m477048, m777709, m509396, m91949, m388540, m734727, m948277, m179027, m644305, m756019, m813258
// exports: none


"use strict";
    (m247167, Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      completeHardNavigation: function () {
        return b;
      },
      completeSoftNavigation: function () {
        return T;
      },
      completeTraverseNavigation: function () {
        return O;
      },
      convertServerPatchToFullTree: function () {
        return A;
      },
      navigate: function () {
        return m;
      },
      navigateToKnownRoute: function () {
        return P;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    let l = m522744,
      u = m787288,
      i = m595871,
      o = m451191,
      c = m663416,
      s = m620896,
      f = m496167,
      d = m477048;
    m777709;
    let h = m509396;
    m91949;
    let p = m388540,
      y = m734727,
      g = m948277,
      _ = m179027;
    m644305;
    let v = m756019,
      E = m813258;
    function m(e, t, r, n, a, l, u, i, o, c) {
      
      
      return (
        (f = e),
        (h = t),
        (p = r),
        (y = n),
        (g = a),
        (v = l),
        (E = u),
        (m = i),
        (R = o),
        (b = c),
        (T = s.segmentCacheMap),
        (x = Date.now()),
        (V = h.href),
        (B = (0, d.createCacheKey)(V, E)),
        null !== (X = (0, s.readRouteCacheEntry)(x, B)) &&
        X.status === s.EntryStatus.Fulfilled
          ? ((O = x),
            (A = f),
            (w = h),
            (C = p),
            (N = y),
            (M = E),
            (I = g),
            (F = v),
            (j = m),
            (D = R),
            (U = b),
            (k = X),
            (L = null),
            (H = T),
            ($ = k.tree),
            (K = k.canonicalUrl + w.hash),
            (G = {
              renderedSearch: k.renderedSearch,
              routeTree: $,
              metadataVaryPath: k.metadata.varyPath,
              data: null,
              head: null,
              dynamicStaleAt: (0, _.computeDynamicStaleAt)(
                O,
                _.UnknownDynamicStaleTime,
              ),
              treeDivergedFromBase: !1,
            }),
            P(O, A, w, K, G, C, N, I, F, j, M, D, U, L, H, null, k, void 0))
          : S(x, f, h, p, y, E, g, v, m, R, b, null, T).catch(() => f)
      );
    }
    function P(e, t, r, n, a, l, u, o, c, s, f, d, h, p, y, g, _, v) {
      let E = { separateRefreshUrls: null, scrollRef: null },
        m = r.href === l.href,
        P = (0, i.startPPRNavigation)(
          e,
          l,
          u,
          o,
          c,
          a.routeTree,
          a.metadataVaryPath,
          s,
          a.data,
          a.head,
          a.dynamicStaleAt,
          m,
          E,
          y,
          !1,
        );
      return null !== P
        ? (s !== i.FreshnessPolicy.Gesture &&
            (0, i.spawnDynamicRequests)(P, r, f, s, E, _, h, p, y, v),
          T(
            t,
            r,
            f,
            P.route,
            P.node,
            a.renderedSearch,
            n,
            h,
            d,
            E.scrollRef,
            g,
          ))
        : b(t, r, h);
    }
    let R = ["", {}, null, "refetch"];
    async function S(e, t, r, n, a, l, d, p, y, g, _, v, E) {
      
      switch (y) {
        case i.FreshnessPolicy.Default:
        case i.FreshnessPolicy.HistoryTraversal:
        case i.FreshnessPolicy.Gesture:
          m = p;
          break;
        case i.FreshnessPolicy.Hydration:
        case i.FreshnessPolicy.RefreshAll:
        case i.FreshnessPolicy.HMRRefresh:
          m = R;
          break;
        default:
          m = p;
      }
      let S = (0, u.fetchServerResponse)(r, {
          flightRouterState: m,
          nextUrl: l,
        }),
        T = await S;
      if ("string" == typeof T) return b(t, new URL(T, location.origin), _);
      let {
          flightData: O,
          canonicalUrl: w,
          renderedSearch: C,
          couldBeIntercepted: N,
          supportsPerSegmentPrefetching: M,
          dynamicStaleTime: I,
          staticStageData: F,
          runtimePrefetchStream: j,
          responseHeaders: D,
          debugInfo: U,
        } = T,
        k = A(e, p, O, C, I),
        L = k.metadataVaryPath;
      if (null !== L) {
        if (
          ((0, f.discoverKnownRoute)(
            e,
            r.pathname,
            r.search,
            l,
            null,
            k.routeTree,
            L,
            N,
            (0, o.createHrefFromUrl)(w, !1),
            M,
            !1,
          ),
          null !== F)
        ) {
          let { response: t, isResponsePartial: r } = F;
          (0, s.resolveStaleAt)(e, t.s)
            .then((n) => {
              let a = D.get(c.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? t.b;
              (0, s.writePrerenderResponseIntoCache)(
                e,
                h.FetchStrategy.PPR,
                t.f,
                a,
                t.h,
                t.r ?? null,
                n,
                p,
                C,
                r,
                E,
              );
            })
            .catch(() => {});
        }
        null !== j &&
          (0, s.processRuntimePrefetchStream)(e, j, p, C)
            .then((t) => {
              null !== t &&
                (0, s.writeDynamicRenderResponseIntoCache)(
                  e,
                  h.FetchStrategy.PPRRuntime,
                  t.flightDatas,
                  t.buildId,
                  t.isResponsePartial,
                  t.headVaryParams,
                  t.rootVaryParamsIterable,
                  t.staleAt,
                  t.navigationSeed,
                  null,
                  E,
                );
            })
            .catch(() => {});
      }
      return (
        null !== T.revealAfter && (await T.revealAfter),
        P(
          e,
          t,
          r,
          (0, o.createHrefFromUrl)(w),
          k,
          n,
          a,
          d,
          p,
          y,
          l,
          g,
          _,
          v,
          E,
          U,
          null,
          void 0,
        )
      );
    }
    function b(e, t, r) {
      return (0, g.isJavaScriptURLString)(t.href)
        ? (console.error(
            "Next.js has blocked a javascript: URL as a security precaution.",
          ),
          e)
        : {
            canonicalUrl:
              t.origin === location.origin
                ? (0, o.createHrefFromUrl)(t)
                : t.href,
            pushRef: {
              pendingPush: "push" === r,
              mpaNavigation: !0,
              preserveCustomHistoryState: !1,
            },
            renderedSearch: e.renderedSearch,
            focusAndScrollRef: e.focusAndScrollRef,
            cache: e.cache,
            tree: e.tree,
            nextUrl: e.nextUrl,
            previousNextUrl: e.previousNextUrl,
            debugInfo: null,
          };
    }
    function T(e, t, r, n, a, l, u, i, o, c, s) {
      let f,
        d,
        h = (0, y.computeChangedPath)(e.tree, n) || e.nextUrl,
        g = new URL(e.canonicalUrl, t),
        _ =
          t.pathname === g.pathname &&
          t.search === g.search &&
          t.hash !== g.hash;
      if (o === p.ScrollBehavior.NoScroll)
        (null !== c && (c.current = !1),
          (f = e.focusAndScrollRef.scrollRef),
          (d = !1));
      else if (_) {
        let t = e.focusAndScrollRef.scrollRef;
        (null !== t && (t.current = !1),
          null !== c && (c.current = !1),
          (f = { current: !0 }),
          (d = !0));
      } else {
        if (((f = c), null !== c)) {
          let t = e.focusAndScrollRef.scrollRef;
          null !== t && (t.current = !1);
        }
        d = !1;
      }
      return {
        canonicalUrl: u,
        renderedSearch: l,
        pushRef: {
          pendingPush: "push" === i,
          mpaNavigation: !1,
          preserveCustomHistoryState: !1,
        },
        focusAndScrollRef: {
          scrollRef: f,
          forceScroll: d,
          onlyHashChange: _,
          hashFragment:
            o !== p.ScrollBehavior.NoScroll && "" !== t.hash
              ? decodeURIComponent(t.hash.slice(1))
              : e.focusAndScrollRef.hashFragment,
        },
        cache: a,
        tree: n,
        nextUrl: h,
        previousNextUrl: r,
        debugInfo: s,
      };
    }
    function O(e, t, r, n, a, l) {
      return {
        canonicalUrl: (0, o.createHrefFromUrl)(t),
        renderedSearch: r,
        pushRef: {
          pendingPush: !1,
          mpaNavigation: !1,
          preserveCustomHistoryState: !0,
        },
        focusAndScrollRef: e.focusAndScrollRef,
        cache: n,
        tree: a,
        nextUrl: l,
        previousNextUrl: null,
        debugInfo: null,
      };
    }
    function A(e, t, r, n, a) {
      let u = t,
        i = null,
        o = null,
        c = !1;
      if (null !== r)
        for (let { segmentPath: e, tree: a, seedData: s, head: f } of r) {
          c ||
            (c = (function (e, t, r) {
              let n = e;
              for (let e = 0; e + 1 < t.length; e += 2) {
                let r = t[e],
                  a = t[e + 1],
                  l = n[1][r];
                if (void 0 === l) return a !== E.DEFAULT_SEGMENT_KEY;
                if (w(a, l[0])) return !0;
                n = l;
              }
              return (function e(t, r) {
                if (w(t[0], r[0])) return !0;
                let n = t[1],
                  a = r[1];
                for (let t in n) {
                  let r = n[t],
                    l = a[t];
                  if (void 0 === l) {
                    if (r[0] !== E.DEFAULT_SEGMENT_KEY) return !0;
                  } else if ((l[2] ?? null) !== null);
                  else if (e(r, l)) return !0;
                }
                return !1;
              })(r, n);
            })(t, e, a));
          let r = (function e(t, r, n, a, u, i, o) {
            
            if (o === u.length) return { tree: n, data: a };
            let s = u[o],
              f = t[1],
              d = null !== r ? r[1] : null,
              h = {},
              p = {};
            for (let t in f) {
              let r = f[t],
                l = null !== d ? (d[t] ?? null) : null;
              if (t === s) {
                let c = e(r, l, n, a, u, i, o + 2);
                ((h[t] = c.tree), (p[t] = c.data));
              } else ((h[t] = r), (p[t] = l));
            }
            if (((c = [t[0], h]), 2 in t)) {
              let e = t[2];
              null != e && (c[2] = [e[0], i]);
            }
            3 in t && (c[3] = t[3]);
            let y = (t[4] ?? 0) & ~l.SubtreePrefetchHints;
            for (let e in h) {
              let t = h[e][4];
              void 0 !== t && (y = (0, l.propagateSubtreeBits)(y, t));
            }
            return (
              0 !== y && (c[4] = y),
              { tree: c, data: [null, p, null, !0, null] }
            );
          })(u, i, a, s, e, n, 0);
          ((u = r.tree), (i = r.data), (o = f));
        }
      let f = u,
        d = { metadataVaryPath: null, treeDivergedFromBase: !1 };
      return {
        routeTree: (0, s.convertRootFlightRouterStateToRouteTree)(f, n, d),
        metadataVaryPath: d.metadataVaryPath,
        data: i,
        renderedSearch: n,
        head: o,
        dynamicStaleAt: (0, _.computeDynamicStaleAt)(e, a),
        treeDivergedFromBase: c,
      };
    }
    function w(e, t) {
      return (
        !(
          "string" == typeof e &&
          "string" == typeof t &&
          e.startsWith(E.PAGE_SEGMENT_KEY) &&
          t.startsWith(E.PAGE_SEGMENT_KEY)
        ) &&
        e !== E.DEFAULT_SEGMENT_KEY &&
        !(0, v.matchSegment)(t, e)
      );
    }
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
