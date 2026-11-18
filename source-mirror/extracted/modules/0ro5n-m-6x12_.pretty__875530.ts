// Reconstructed from 0ro5n-m-6x12_.pretty.js, module 875530.
// deps: m247167, m555682, m190809, m843476, m271645, m8372, m388540, m451191, m261994, m941538, m494272, m762634, m358442, m425018, m201244, m387250, m652817, m734727, m178377, m699781, m124063, m968391, m91949, m794109, m168027, m897367, m543369
// exports: none


"use strict";
    (m247167,
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "default", {
        enumerable: !0,
        get: function () {
          return N;
        },
      }));
    let n = m555682,
      o = m190809,
      a = m843476,
      l = o._(m271645),
      i = m8372,
      u = m388540,
      d = m451191,
      s = m261994,
      c = m941538,
      f = m494272,
      p = m762634,
      h = m358442,
      _ = m425018,
      y = m201244,
      b = m387250,
      m = m652817,
      v = m734727,
      E = m178377,
      g = m699781,
      w = m124063,
      P = m968391,
      j = m91949,
      R = n._(m794109),
      S = n._(m168027),
      O = m897367;
    m543369;
    let x = {};
    function M({ appRouterState: e }) {
      return (
        (0, l.useInsertionEffect)(() => {
          let { tree: t, pushRef: r, canonicalUrl: n, renderedSearch: o } = e,
            a = {
              ...(r.preserveCustomHistoryState ? window.history.state : {}),
              __NA: !0,
              __PRIVATE_NEXTJS_INTERNALS_TREE: { tree: t, renderedSearch: o },
            };
          (r.pendingPush &&
          (0, d.createHrefFromUrl)(new URL(window.location.href)) !== n
            ? ((r.pendingPush = !1), window.history.pushState(a, "", n))
            : window.history.replaceState(a, "", n),
            (0, f.setLastCommittedTree)(t));
        }, [e]),
        (0, l.useEffect)(() => {
          (0, j.pingVisibleLinks)(e.nextUrl, e.tree);
        }, [e.nextUrl, e.tree]),
        null
      );
    }
    function T(e) {
      null == e && (e = {});
      let t = window.history.state,
        r = t?.__NA;
      r && (e.__NA = r);
      let n = t?.__PRIVATE_NEXTJS_INTERNALS_TREE;
      return (n && (e.__PRIVATE_NEXTJS_INTERNALS_TREE = n), e);
    }
    function A({ headCacheNode: e }) {
      let t = null !== e ? e.head : null,
        r = null !== e ? e.prefetchHead : null,
        n = null !== r ? r : t;
      return (0, l.useDeferredValue)(t, n);
    }
    function C({
      actionQueue: e,
      globalError: t,
      webSocket: r,
      staticIndicatorState: n,
    }) {
      let o,
        d = (0, c.useActionQueue)(e),
        { canonicalUrl: f } = d,
        { searchParams: E, pathname: j } = (0, l.useMemo)(() => {
          let e = new URL(
            f,
            "u" < typeof window ? "http://n" : window.location.href,
          );
          return {
            searchParams: e.searchParams,
            pathname: (0, m.hasBasePath)(e.pathname)
              ? (0, b.removeBasePath)(e.pathname)
              : e.pathname,
          };
        }, [f]);
      ((0, l.useEffect)(() => {
        let e = (0, v.extractSourcePageFromFlightRouterState)(d.tree);
        void 0 !== e
          ? (window.next.__internal_src_page = e)
          : delete window.next.__internal_src_page;
      }, [d.tree]),
        (0, l.useEffect)(() => {
          function e(e) {
            e.persisted &&
              window.history.state?.__PRIVATE_NEXTJS_INTERNALS_TREE &&
              ((x.pendingMpaPath = void 0),
              (0, c.dispatchAppRouterAction)({
                type: u.ACTION_RESTORE,
                url: new URL(window.location.href),
                historyState:
                  window.history.state.__PRIVATE_NEXTJS_INTERNALS_TREE,
              }));
          }
          return (
            window.addEventListener("pageshow", e),
            () => {
              window.removeEventListener("pageshow", e);
            }
          );
        }, []),
        (0, l.useEffect)(() => {
          function e(e) {
            let t = "reason" in e ? e.reason : e.error;
            if ((0, P.isRedirectError)(t)) {
              e.preventDefault();
              let r = (0, w.getURLFromRedirectError)(t);
              "push" === (0, w.getRedirectTypeFromError)(t)
                ? g.publicAppRouterInstance.push(r, {})
                : g.publicAppRouterInstance.replace(r, {});
            }
          }
          return (
            window.addEventListener("error", e),
            window.addEventListener("unhandledrejection", e),
            () => {
              (window.removeEventListener("error", e),
                window.removeEventListener("unhandledrejection", e));
            }
          );
        }, []));
      let { pushRef: S } = d;
      if (S.mpaNavigation) {
        if (x.pendingMpaPath !== f) {
          let e = window.location;
          (S.pendingPush ? e.assign(f) : e.replace(f), (x.pendingMpaPath = f));
        }
        throw y.unresolvedThenable;
      }
      (0, l.useEffect)(() => {
        let e = window.history.pushState.bind(window.history),
          t = window.history.replaceState.bind(window.history),
          r = (e) => {
            let t = window.location.href,
              r = window.history.state?.__PRIVATE_NEXTJS_INTERNALS_TREE;
            (0, l.startTransition)(() => {
              (0, c.dispatchAppRouterAction)({
                type: u.ACTION_RESTORE,
                url: new URL(e ?? t, t),
                historyState: r,
              });
            });
          };
        ((window.history.pushState = function (t, n, o) {
          return (t?.__NA || t?._N || ((t = T(t)), o && r(o)), e(t, n, o));
        }),
          (window.history.replaceState = function (e, n, o) {
            return (e?.__NA || e?._N || ((e = T(e)), o && r(o)), t(e, n, o));
          }));
        let n = (e) => {
          if (e.state) {
            if (!e.state.__NA) return void window.location.reload();
            (0, l.startTransition)(() => {
              (0, g.dispatchTraverseAction)(
                window.location.href,
                e.state.__PRIVATE_NEXTJS_INTERNALS_TREE,
              );
            });
          }
        };
        return (
          window.addEventListener("popstate", n),
          () => {
            ((window.history.pushState = e),
              (window.history.replaceState = t),
              window.removeEventListener("popstate", n));
          }
        );
      }, []);
      let {
          cache: N,
          tree: L,
          nextUrl: I,
          focusAndScrollRef: D,
          previousNextUrl: F,
        } = d,
        U = (0, l.useMemo)(() => (0, _.findHeadInCache)(N, L[1]), [N, L]),
        B = (0, l.useMemo)(() => (0, v.getSelectedParams)(L), [L]),
        H = (0, l.useMemo)(
          () => ({
            parentTree: L,
            parentCacheNode: N,
            parentSegmentPath: null,
            parentParams: {},
            parentLoadingData: null,
            debugNameContext: "/",
            url: f,
            isActive: !0,
          }),
          [L, N, f],
        ),
        X = (0, l.useMemo)(
          () => ({
            tree: L,
            focusAndScrollRef: D,
            nextUrl: I,
            previousNextUrl: F,
          }),
          [L, D, I, F],
        );
      if (null !== U) {
        let [e, t, r] = U;
        o = (0, a.jsx)(A, { headCacheNode: e }, "u" < typeof window ? r : t);
      } else o = null;
      let k = (0, a.jsxs)(h.RedirectBoundary, {
        children: [
          o,
          (0, a.jsx)(O.RootLayoutBoundary, { children: N.rsc }),
          (0, a.jsx)(p.AppRouterAnnouncer, { tree: L }),
        ],
      });
      return (
        (k = (0, a.jsx)(R.default, {
          errorComponent: t[0],
          errorStyles: t[1],
          children: k,
        })),
        (0, a.jsxs)(a.Fragment, {
          children: [
            (0, a.jsx)(M, { appRouterState: d }),
            null,
            (0, a.jsx)(s.NavigationPromisesContext.Provider, {
              value: null,
              children: (0, a.jsx)(s.PathParamsContext.Provider, {
                value: B,
                children: (0, a.jsx)(s.PathnameContext.Provider, {
                  value: j,
                  children: (0, a.jsx)(s.SearchParamsContext.Provider, {
                    value: E,
                    children: (0, a.jsx)(i.GlobalLayoutRouterContext.Provider, {
                      value: X,
                      children: (0, a.jsx)(i.AppRouterContext.Provider, {
                        value: g.publicAppRouterInstance,
                        children: (0, a.jsx)(i.LayoutRouterContext.Provider, {
                          value: H,
                          children: k,
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          ],
        })
      );
    }
    function N({
      actionQueue: e,
      globalErrorState: t,
      webSocket: r,
      staticIndicatorState: n,
    }) {
      (0, E.useNavFailureHandler)();
      let o = (0, a.jsx)(C, {
        actionQueue: e,
        globalError: t,
        webSocket: r,
        staticIndicatorState: n,
      });
      return (0, a.jsx)(R.default, { errorComponent: S.default, children: o });
    }
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
