// Reconstructed from 2ibjbohrkj52w.pretty.js, module 216978.
// deps: m843476, m770703, m271645, m647163
// exports: DocThumbnail
export { function ({ excerpt: e, className: i }) { let r = (0, n.useRef)(null), [l, o] = (0, n.useState)(!1); (0, n.useEffect)(() => { let e = r.current; if (!e || l) return; let t = new IntersectionObserver( (e) => { e.some((e) => e.isIntersecting) && o(!0); }, { rootMargin: "200px" }, ); return (t.observe(e), () => t.disconnect()); }, [l]); let d = !e?.trim(); return (0, t.jsxs)("div", { ref: r, "aria-hidden": !0, className: (0, a.cn)( "relative h-full w-full overflow-hidden bg-white", i, ), children: [ d && (0, t.jsx)("div", { className: "space-y-1.5 px-4 pt-4", children: [90, 70, 80, 60].map((e) => (0, t.jsx)( "div", { className: "h-1 rounded-full bg-[#eceff1]", style: { width: `${e}%` }, }, e, ), ), }), l && e && !d && (0, t.jsx)(s, { excerpt: e }), ], }); } as "DocThumbnail" };

"use strict";
    var t = m843476,
      i = m770703,
      n = m271645,
      a = m647163;
    let s = (0, i.default)(() => e.A(458094).then((e) => e.DocThumbnailPage), {
      loadableGenerated: { modules: [303604] },
      ssr: !1,
    });
    ;
