// Reconstructed from 2-_e50duc2fl9.pretty.js, module 869093.
// deps: m843476, m271645, m667585, m652157
// exports: none


"use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "default", {
        enumerable: !0,
        get: function () {
          return u;
        },
      }));
    let n = m843476,
      s = m271645,
      i = m667585,
      a = m652157;
    function o(e) {
      return { default: e && "default" in e ? e.default : e };
    }
    let l = {
        loader: () => Promise.resolve(o(() => null)),
        loading: null,
        ssr: !0,
      },
      u = function (e) {
        let t = { ...l, ...e },
          r = (0, s.lazy)(() => t.loader().then(o)),
          u = t.loading;
        function c(e) {
          let o = u
              ? (0, n.jsx)(u, { isLoading: !0, pastDelay: !0, error: null })
              : null,
            l = !t.ssr || !!t.loading,
            c = l ? s.Suspense : s.Fragment,
            d = t.ssr
              ? (0, n.jsxs)(n.Fragment, {
                  children: [
                    "u" < typeof window
                      ? (0, n.jsx)(a.PreloadChunks, { moduleIds: t.modules })
                      : null,
                    (0, n.jsx)(r, { ...e }),
                  ],
                })
              : (0, n.jsx)(i.BailoutToCSR, {
                  reason: "next/dynamic",
                  children: (0, n.jsx)(r, { ...e }),
                });
          return (0, n.jsx)(c, { ...(l ? { fallback: o } : {}), children: d });
        }
        return ((c.displayName = "LoadableComponent"), c);
      };
