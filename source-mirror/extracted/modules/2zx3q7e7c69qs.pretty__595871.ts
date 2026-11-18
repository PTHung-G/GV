// Reconstructed from 2zx3q7e7c69qs.pretty.js, module 595871.
// deps: m247167, m522744, m813258, m756019, m451191, m787288, m941538, m388540, m548919, m494272, m760355, m620896, m509396, m496167, m663416, m33906, m856655, m179027
// exports: none


"use strict";
    (m247167, Object.defineProperty(r, "__esModule", { value: !0 }));
    var n,
      a = {
        FreshnessPolicy: function () {
          return S;
        },
        beginLockedNavigation: function () {
          return K;
        },
        createInitialCacheNodeForHydration: function () {
          return T;
        },
        getCurrentNavigationLock: function () {
          return $;
        },
        isDeferredRsc: function () {
          return B;
        },
        resetNavigationLockToPending: function () {
          return G;
        },
        spawnDynamicRequests: function () {
          return k;
        },
        startPPRNavigation: function () {
          return O;
        },
      };
    for (var l in a) Object.defineProperty(r, l, { enumerable: !0, get: a[l] });
    let u = m522744,
      i = m813258,
      o = m756019,
      c = m451191,
      s = m787288,
      f = m941538,
      d = m388540,
      h = m548919,
      p = m494272,
      y = m760355,
      g = m620896,
      _ = m509396,
      v = m496167,
      E = m663416,
      m = m33906,
      P = m856655,
      R = m179027;
    var S =
      (((n = {})[(n.Default = 0)] = "Default"),
      (n[(n.Hydration = 1)] = "Hydration"),
      (n[(n.HistoryTraversal = 2)] = "HistoryTraversal"),
      (n[(n.RefreshAll = 3)] = "RefreshAll"),
      (n[(n.HMRRefresh = 4)] = "HMRRefresh"),
      (n[(n.Gesture = 5)] = "Gesture"),
      n);
    let b = () => {};
    function T(e, t, r, n, a) {
      return w(
        e,
        t,
        null,
        1,
        r,
        n,
        a,
        !1,
        { separateRefreshUrls: null, scrollRef: null },
        g.segmentCacheMap,
        !1,
      );
    }
    function O(e, t, r, n, a, l, s, f, d, p, y, _, v, E, m) {
      let P = { canonicalUrl: (0, c.createHrefFromUrl)(t), renderedSearch: r };
      return (function e(t, r, n, a, l, c, s, f, d, p, y, _, v, E, m, P, R) {
        
        let j,
          U,
          k,
          L,
          H = a[0],
          x = C(l),
          V =
            ((S = x),
            (b = H),
            (0, o.matchSegment)(S, b)
              ? 0
              : "string" == typeof S &&
                  "string" == typeof b &&
                  S.startsWith(i.PAGE_SEGMENT_KEY) &&
                  b.startsWith(i.PAGE_SEGMENT_KEY)
                ? 2
                : 1);
        if (1 === V)
          return ((l.prefetchHints & u.PrefetchHint.IsRootLayoutOrAbove) != 0 &&
            (0, h.isNavigatingToNewRootLayout)(a, l)) ||
            x === i.NOT_FOUND_SEGMENT_KEY
            ? null
            : w(t, l, c, s, f, d, p, _, m, P, R);
        let B = l.slots,
          X = a[1],
          $ = null !== f ? f[1] : null,
          K = !1;
        switch (s) {
          case 0:
          case 2:
          case 1:
          case 5:
            K = !1;
            break;
          case 3:
          case 4:
            K = !0;
        }
        let G = null === B;
        if (void 0 === n || K || (G && y) || 2 === V) {
          let e = I(
            t,
            l,
            null !== f ? f[0] : null,
            c,
            d,
            s,
            p,
            void 0 !== n ? n.bfcacheId : D(s),
            P,
            R,
          );
          ((k = e.cacheNode),
            (L = e.needsDynamicRequest),
            G && 2 === V
              ? A(s, k, m)
              : void 0 !== n && (k.scrollRef = n.scrollRef));
        } else {
          ((T = !1),
            (k = F(
              (O = n).rsc,
              T ? null : O.prefetchRsc,
              O.head,
              T ? null : O.prefetchHead,
              O.bfcacheId,
              O.scrollRef,
            )),
            (L = !1));
        }
        let q = l.refreshState,
          Y = null != q ? q : E;
        L &&
          null !== Y &&
          ((N = m),
          (j = Y.canonicalUrl),
          null === (U = N.separateRefreshUrls)
            ? (N.separateRefreshUrls = new Set([j]))
            : U.add(j));
        let W = {},
          z = null,
          Q = !1,
          J = {},
          Z = null;
        if (null !== B) {
          let a = void 0 !== n ? n.slots : null;
          for (let [n, u] of ((k.slots = Z = {}), (z = new Map()), B)) {
            let o = X[n];
            if (void 0 === o) return null;
            let f = null !== $ ? $[n] : null,
              h = o[0],
              E = C(u),
              S = d;
            2 !== s &&
              E === i.DEFAULT_SEGMENT_KEY &&
              h !== i.DEFAULT_SEGMENT_KEY &&
              ((E = C(
                (u = (function (e, t, r, n) {
                  let a,
                    l,
                    u = n[2];
                  null != u
                    ? ((a = u[0]), (l = u[1]))
                    : ((a = r.canonicalUrl), (l = r.renderedSearch));
                  let i = (0, g.convertReusedFlightRouterStateToRouteTree)(
                    e,
                    t,
                    n,
                    l,
                    { metadataVaryPath: null, treeDivergedFromBase: !1 },
                  );
                  return (
                    (i.refreshState = { canonicalUrl: a, renderedSearch: l }),
                    i
                  );
                })(l, n, v, o)),
              )),
              (f = null),
              (S = null));
            let b = e(
              t,
              r,
              null !== a ? a[n] : void 0,
              o,
              u,
              c,
              s,
              f ?? null,
              S,
              p,
              y,
              _ || L,
              v,
              Y,
              m,
              P,
              R,
            );
            if (null === b) return null;
            (z.set(n, b), (Z[n] = b.node));
            let T = b.route;
            W[n] = T;
            let O = b.dynamicRequestTree;
            null !== O ? ((Q = !0), (J[n] = O)) : (J[n] = T);
          }
        }
        let ee = [
          C(l),
          W,
          null !== Y ? [Y.canonicalUrl, Y.renderedSearch] : null,
          null,
          l.prefetchHints,
        ];
        return {
          status: +!L,
          route: ee,
          node: k,
          dynamicRequestTree: M(ee, J, L, Q, _),
          refreshState: Y,
          children: z,
        };
      })(
        e,
        t,
        null !== n ? n : void 0,
        a,
        l,
        s,
        f,
        d,
        p,
        y,
        _,
        !1,
        P,
        null,
        v,
        E,
        m,
      );
    }
    function A(e, t, r) {
      switch (e) {
        case 0:
        case 5:
        case 3:
        case 4:
          (null === r.scrollRef && (r.scrollRef = { current: !0 }),
            (t.scrollRef = r.scrollRef));
      }
    }
    function w(e, t, r, n, a, l, u, i, o, c, s) {
      let f = C(t),
        d = t.slots,
        h = null !== a ? a[1] : null,
        p = I(e, t, null !== a ? a[0] : null, r, l, n, u, D(n), c, s),
        y = p.cacheNode,
        g = p.needsDynamicRequest;
      null === d && A(n, y, o);
      let _ = {},
        v = null,
        E = !1,
        m = {},
        P = null;
      if (null !== d)
        for (let [t, a] of ((y.slots = P = {}), (v = new Map()), d)) {
          let f = w(
            e,
            a,
            r,
            n,
            (null !== h ? h[t] : null) ?? null,
            l,
            u,
            i || g,
            o,
            c,
            s,
          );
          (v.set(t, f), (P[t] = f.node));
          let d = f.route;
          _[t] = d;
          let p = f.dynamicRequestTree;
          null !== p ? ((E = !0), (m[t] = p)) : (m[t] = d);
        }
      let R = [f, _, null, null, t.prefetchHints];
      return {
        status: +!g,
        route: R,
        node: y,
        dynamicRequestTree: M(R, m, g, E, i),
        refreshState: null,
        children: v,
      };
    }
    function C(e) {
      if (e.isPage) {
        let t = (0, P.getRenderedSearchFromVaryPath)(e.varyPath);
        if (null === t) return i.PAGE_SEGMENT_KEY;
        let r = JSON.stringify(
          (0, m.urlSearchParamsToParsedUrlQuery)(new URLSearchParams(t)),
        );
        return "{}" !== r ? i.PAGE_SEGMENT_KEY + "?" + r : i.PAGE_SEGMENT_KEY;
      }
      return e.segment;
    }
    function N(e, t) {
      let r = [e[0], t];
      return (
        2 in e && (r[2] = e[2]),
        3 in e && (r[3] = e[3]),
        4 in e && (r[4] = e[4]),
        r
      );
    }
    function M(e, t, r, n, a) {
      let l = null;
      return (
        r ? ((l = N(e, t)), a || (l[3] = "refetch")) : (l = n ? N(e, t) : null),
        l
      );
    }
    function I(e, t, r, n, a, l, u, i, o, c) {
      let s,
        f,
        d,
        h = t.isPage;
      switch (l) {
        case 0: {
          let r = (0, R.readFromBFCacheDuringRegularNavigation)(e, t.varyPath);
          if (null !== r)
            return {
              cacheNode: F(r.rsc, r.prefetchRsc, r.head, r.prefetchHead, i),
              needsDynamicRequest: !1,
            };
          break;
        }
        case 1: {
          let l = h ? a : null;
          return (
            (0, R.writeToBFCache)(e, t.varyPath, r, null, l, null, u, i),
            h && null !== n && (0, R.writeHeadToBFCache)(e, n, l, null, u, i),
            { cacheNode: F(r, null, l, null, i), needsDynamicRequest: !1 }
          );
        }
        case 2:
          let p = (0, R.readFromBFCache)(t.varyPath);
          if (null !== p) {
            let e = p.rsc,
              t = !B(e) || "pending" !== e.status;
            return {
              cacheNode: F(
                p.rsc,
                t ? null : p.prefetchRsc,
                p.head,
                t ? null : p.prefetchHead,
                p.bfcacheId,
              ),
              needsDynamicRequest: !1,
            };
          }
      }
      let y = null,
        _ = !0,
        v = (0, g.readSegmentCacheEntryForNavigation)(e, o, t.varyPath, c);
      if (null !== v)
        switch (v.status) {
          case g.EntryStatus.Fulfilled:
            ((y = v.rsc), (_ = v.isPartial));
            break;
          case g.EntryStatus.Pending:
            ((y = (0, g.waitForSegmentCacheEntry)(v).then((e) =>
              null !== e ? e.rsc : null,
            )),
              (_ = v.isPartial));
          case g.EntryStatus.Empty:
          case g.EntryStatus.Rejected:
        }
      null !== r
        ? (_ ? ((s = y), (f = r)) : ((s = null), (f = y)), (d = !1))
        : (_ ? ((s = y), (f = X())) : ((s = null), (f = y)), (d = _));
      let E = null,
        m = null,
        P = h;
      if (h) {
        let t = null,
          r = !0;
        if (null !== n) {
          let a = (0, g.readSegmentCacheEntryForNavigation)(e, o, n, c);
          if (null !== a)
            switch (a.status) {
              case g.EntryStatus.Fulfilled:
                ((t = a.rsc), (r = a.isPartial));
                break;
              case g.EntryStatus.Pending:
                ((t = (0, g.waitForSegmentCacheEntry)(a).then((e) =>
                  null !== e ? e.rsc : null,
                )),
                  (r = a.isPartial));
              case g.EntryStatus.Empty:
              case g.EntryStatus.Rejected:
            }
        }
        (r && (t = ""),
          null !== a
            ? (r ? ((E = t), (m = a)) : ((E = null), (m = t)), (P = !1))
            : (r ? ((E = t), (m = X())) : ((E = null), (m = t)), (P = r)));
      }
      return (
        5 !== l &&
          ((0, R.writeToBFCache)(e, t.varyPath, f, s, m, E, u, i),
          h && null !== n && (0, R.writeHeadToBFCache)(e, n, m, E, u, i)),
        { cacheNode: F(f, s, m, E, i), needsDynamicRequest: d || P }
      );
    }
    function F(e, t, r, n, a, l = null) {
      return {
        rsc: e,
        prefetchRsc: t,
        head: r,
        prefetchHead: n,
        slots: null,
        scrollRef: l,
        bfcacheId: a,
      };
    }
    let j = 0;
    function D(e) {
      return "u" < typeof window || 1 === e ? 0 : ++j;
    }
    let U = !1;
    function k(e, t, r, n, a, l, u, i, o, s) {
      let f = e.dynamicRequestTree;
      if (null === f) {
        U = !1;
        return;
      }
      let d = x(e, f, t, r, n, l, i, o, s),
        h = a.separateRefreshUrls,
        p = null;
      if (null !== h) {
        p = [];
        let a = (0, c.createHrefFromUrl)(t);
        for (let t of h)
          t !== a &&
            null !== f &&
            p.push(x(e, f, new URL(t, location.origin), r, n, l, i, o, s));
      }
      L(e, r, d, p, l, u).then(b, b);
    }
    async function L(e, t, r, n, a, l) {
      
      let o = await ((u = r),
      (i = n),
      new Promise((e) => {
        let t = (t) => {
            0 === t.exitStatus ? 0 == --n && e(0) : e(t.exitStatus);
          },
          r = () => e(2),
          n = 1;
        (u.then(t, r),
          null !== i && ((n += i.length), i.forEach((e) => e.then(t, r))));
      }));
      switch (
        (0 === o &&
          (o = (function e(t, r, n) {
            
            
            0 === t.status
              ? ((t.status = 2),
                (a = t.node),
                (l = r),
                (u = n),
                B((o = a.rsc)) &&
                  (null === l ? o.resolve(null, u) : o.reject(l, u)),
                B((c = a.head)) && c.resolve(null, u),
                (i = null === t.refreshState ? 1 : 2))
              : (i = 0);
            let s = t.children;
            if (null !== s)
              for (let [, t] of s) {
                let a = e(t, r, n);
                a > i && (i = a);
              }
            return i;
          })(e, null, null)),
        o)
      ) {
        case -1:
          return;
        case 0:
          U = !1;
          return;
        case 1: {
          let n = await r;
          H(!1, n.url, t, n.seed, e.route, a, l, 3);
          return;
        }
        case 3: {
          let n = await r;
          H(!1, n.url, t, n.seed, e.route, a, l, 2);
          return;
        }
        case 2: {
          let n = await r;
          H(!0, n.url, t, n.seed, e.route, a, l, 3);
          return;
        }
        default:
          return o;
      }
    }
    function H(e, t, r, n, a, l, u, i) {
      if (null !== l) (0, g.markRouteEntryAsDynamicRewrite)(l);
      else if (null !== n) {
        let e = n.metadataVaryPath;
        if (null !== e) {
          let a = Date.now();
          (0, v.discoverKnownRoute)(
            a,
            t.pathname,
            t.search,
            r,
            null,
            n.routeTree,
            e,
            !1,
            (0, c.createHrefFromUrl)(t),
            !1,
            !0,
          );
        }
      }
      ((0, g.invalidateRouteCacheEntries)(r, a), (e = e || U), (U = !0));
      let o = (0, p.getLastCommittedTree)(),
        s = null !== o && a !== o ? u : "replace",
        h = {
          type: d.ACTION_SERVER_PATCH,
          previousTree: a,
          url: t,
          nextUrl: r,
          seed: n,
          mpa: e,
          navigateType: s,
          freshnessPolicy: i,
        };
      (0, f.dispatchAppRouterAction)(h);
    }
    async function x(e, t, r, n, a, l, u, i, c) {
      try {
        let u = await (0, s.fetchServerResponse)(r, {
          flightRouterState: t,
          nextUrl: n,
          isHmrRefresh: 4 === a,
          signal: c,
        });
        if ("string" == typeof u)
          return {
            exitStatus: 2,
            url: new URL(u, location.origin),
            seed: null,
          };
        let f = Date.now(),
          d = (0, y.convertServerPatchToFullTree)(
            f,
            e.route,
            u.flightData,
            u.renderedSearch,
            u.dynamicStaleTime,
          );
        if (null !== l && null !== u.staticStageData) {
          let { response: e, isResponsePartial: r } = u.staticStageData;
          (0, g.resolveStaleAt)(f, e.s)
            .then((n) => {
              let a =
                u.responseHeaders.get(E.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? e.b;
              (0, g.writePrerenderResponseIntoCache)(
                f,
                _.FetchStrategy.PPR,
                e.f,
                a,
                e.h,
                e.r ?? null,
                n,
                t,
                u.renderedSearch,
                r,
                i,
              );
            })
            .catch(() => {});
        }
        null !== l &&
          null !== u.runtimePrefetchStream &&
          (0, g.processRuntimePrefetchStream)(
            f,
            u.runtimePrefetchStream,
            t,
            u.renderedSearch,
          )
            .then((e) => {
              null !== e &&
                (0, g.writeDynamicRenderResponseIntoCache)(
                  f,
                  _.FetchStrategy.PPRRuntime,
                  e.flightDatas,
                  e.buildId,
                  e.isResponsePartial,
                  e.headVaryParams,
                  e.rootVaryParamsIterable,
                  e.staleAt,
                  e.navigationSeed,
                  null,
                  i,
                );
            })
            .catch(() => {});
        let h = (0, R.computeDynamicStaleAt)(f, u.dynamicStaleTime),
          p = (function e(t, r, n, a, l, u, i) {
            0 === t.status &&
              null !== n &&
              ((t.status = 1),
              (function (e, t, r, n, a) {
                let l = e.rsc,
                  u = t[0];
                if (null === u) return;
                if (null === l) e.rsc = u;
                else if (B(l))
                  if (null !== a) {
                    let e = () => l.resolve(u, n);
                    a.then(e, e);
                  } else l.resolve(u, n);
                let i = e.head;
                B(i) && i.resolve(r, n);
              })(t.node, n, a, u, i),
              (0, R.updateBFCacheEntryStaleAt)(r.varyPath, l));
            let c = t.children,
              s = r.slots,
              f = null !== n ? n[1] : null,
              d = !1;
            if (null !== c)
              if (null !== s)
                for (let [t, r] of s) {
                  let n = null !== f ? f[t] : null,
                    s = c.get(t);
                  if (void 0 === s) d = !0;
                  else {
                    let t = s.route[0],
                      c = C(r);
                    (0, o.matchSegment)(c, t) &&
                      null != n &&
                      e(s, r, n, a, l, u, i) &&
                      (d = !0);
                  }
                }
              else null !== s && (d = !0);
            return d;
          })(e, d.routeTree, d.data, d.head, h, u.debugInfo, u.revealAfter),
          v = new URL(u.canonicalUrl, location.origin),
          m = !1;
        if (null !== l) {
          let e = new URL(l.canonicalUrl, location.origin);
          m = e.pathname !== v.pathname || e.search !== v.search;
        }
        return { exitStatus: p ? 1 : 3 * !!m, url: v, seed: d };
      } catch {
        if (c?.aborted) return { exitStatus: -1, url: r, seed: null };
        return { exitStatus: 2, url: r, seed: null };
      }
    }
    let V = Symbol();
    function B(e) {
      return e && "object" == typeof e && e.tag === V;
    }
    function X() {
      let e,
        t,
        r = [],
        n = new Promise((r, n) => {
          ((e = r), (t = n));
        });
      return (
        (n.status = "pending"),
        (n.resolve = (t, a) => {
          "pending" === n.status &&
            ((n.status = "fulfilled"),
            (n.value = t),
            null !== a && r.push.apply(r, a),
            e(t));
        }),
        (n.reject = (e, a) => {
          "pending" === n.status &&
            ((n.status = "rejected"),
            (n.reason = e),
            null !== a && r.push.apply(r, a),
            t(e));
        }),
        (n.tag = V),
        (n._debugInfo = r),
        n
      );
    }
    function $() {
      return null;
    }
    function K() {
      return null;
    }
    function G() {}
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
