// Reconstructed from 26g4tn5b226u5.pretty.js, module 976562.
// deps: m247167, m190809, m271645, m8372, m261994, m813258, m314502, m13957, m292838, m592805
// exports: none


"use strict";
    (m247167, Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      ReadonlyURLSearchParams: function () {
        return a.ReadonlyURLSearchParams;
      },
      RedirectType: function () {
        return d.RedirectType;
      },
      ServerInsertedHTMLContext: function () {
        return s.ServerInsertedHTMLContext;
      },
      forbidden: function () {
        return d.forbidden;
      },
      notFound: function () {
        return d.notFound;
      },
      permanentRedirect: function () {
        return d.permanentRedirect;
      },
      redirect: function () {
        return d.redirect;
      },
      unauthorized: function () {
        return d.unauthorized;
      },
      unstable_isUnrecognizedActionError: function () {
        return f.unstable_isUnrecognizedActionError;
      },
      unstable_rethrow: function () {
        return d.unstable_rethrow;
      },
      useParams: function () {
        return g;
      },
      usePathname: function () {
        return m;
      },
      useRouter: function () {
        return v;
      },
      useSearchParams: function () {
        return b;
      },
      useSelectedLayoutSegment: function () {
        return O;
      },
      useSelectedLayoutSegments: function () {
        return h;
      },
      useServerInsertedHTML: function () {
        return s.useServerInsertedHTML;
      },
    };
    for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
    let u = m190809._(m271645),
      i = m8372,
      a = m261994,
      c = m813258,
      l = m314502,
      s = m13957,
      f = m292838,
      d = m592805,
      {
        instrumentParamsForClientValidation: p,
        instrumentSearchParamsForClientValidation: y,
        expectCompleteParamsInClientValidation: _,
      } = {};
    function b() {
      l.useDynamicSearchParams?.("useSearchParams()");
      let e = (0, u.useContext)(a.SearchParamsContext);
      return (0, u.useMemo)(
        () => (e ? new a.ReadonlyURLSearchParams(e) : null),
        [e],
      );
    }
    function m() {
      return (
        l.useDynamicRouteParams?.("usePathname()"),
        (0, u.useContext)(a.PathnameContext)
      );
    }
    function v() {
      let e = (0, u.useContext)(i.AppRouterContext);
      if (null === e)
        throw Object.defineProperty(
          Error("invariant expected app router to be mounted"),
          "__NEXT_ERROR_CODE",
          { value: "E238", enumerable: !1, configurable: !0 },
        );
      let t = (0, u.useContext)(i.LayoutRouterContext),
        r = t?.parentCacheNode.bfcacheId ?? 0;
      return (0, u.useMemo)(
        () => ({
          back: e.back,
          forward: e.forward,
          refresh: e.refresh,
          hmrRefresh: e.hmrRefresh,
          push: e.push,
          replace: e.replace,
          prefetch: e.prefetch,
          experimental_gesturePush: e.experimental_gesturePush,
          bfcacheId: "_b_" + r + "_",
        }),
        [e, r],
      );
    }
    function g() {
      return (
        l.useDynamicRouteParams?.("useParams()"),
        (0, u.useContext)(a.PathParamsContext)
      );
    }
    function h(e = "children") {
      l.useDynamicRouteParams?.("useSelectedLayoutSegments()");
      let t = (0, u.useContext)(i.LayoutRouterContext);
      return t ? (0, c.getSelectedLayoutSegmentPath)(t.parentTree, e) : null;
    }
    function O(e = "children") {
      (l.useDynamicRouteParams?.("useSelectedLayoutSegment()"),
        (0, u.useContext)(a.NavigationPromisesContext));
      let t = h(e);
      return (0, c.computeSelectedLayoutSegment)(t, e);
    }
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
