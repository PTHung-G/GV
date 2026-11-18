// Reconstructed from 3bg0pkvz9zgwr.pretty.js, module 652157.
// deps: none
// exports: none


"use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "PreloadChunks", {
        enumerable: !0,
        get: function () {
          return s;
        },
      }));
    let a = t.r(843476),
      i = t.r(174080),
      r = t.r(563599),
      o = t.r(309885),
      l = t.r(543369);
    function s({ moduleIds: t }) {
      if ("u" > typeof window) return null;
      let e = r.workAsyncStorage.getStore();
      if (void 0 === e) return null;
      let n = [];
      if (e.reactLoadableManifest && t) {
        let a = e.reactLoadableManifest;
        for (let e of t) {
          if (!a[e]) continue;
          let t = a[e].files;
          n.push(...t);
        }
      }
      if (0 === n.length) return null;
      let c = (0, l.getAssetTokenQuery)();
      return (0, a.jsx)(a.Fragment, {
        children: n.map((t) => {
          let n = `${e.assetPrefix}/_next/${(0, o.encodeURIPath)(t)}${c}`;
          return t.endsWith(".css")
            ? (0, a.jsx)(
                "link",
                {
                  precedence: "dynamic",
                  href: n,
                  rel: "stylesheet",
                  as: "style",
                  nonce: e.nonce,
                },
                t,
              )
            : ((0, i.preload)(n, {
                as: "script",
                fetchPriority: "low",
                nonce: e.nonce,
              }),
              null);
        }),
      });
    }
