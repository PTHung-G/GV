// Reconstructed from 3x2egdq4l2jk7.pretty.js, module 216978.
// deps: m843476, m770703, m271645, m647163
// exports: DocThumbnail
export { function ({ excerpt: e, className: a }) { let i = (0, s.useRef)(null), [l, c] = (0, s.useState)(!1); (0, s.useEffect)(() => { let e = i.current; if (!e || l) return; let t = new IntersectionObserver( (e) => { e.some((e) => e.isIntersecting) && c(!0); }, { rootMargin: "200px" }, ); return (t.observe(e), () => t.disconnect()); }, [l]); let o = !e?.trim(); return (0, t.jsxs)("div", { ref: i, "aria-hidden": !0, className: (0, r.cn)( "relative h-full w-full overflow-hidden bg-white", a, ), children: [ o && (0, t.jsx)("div", { className: "space-y-1.5 px-4 pt-4", children: [90, 70, 80, 60].map((e) => (0, t.jsx)( "div", { className: "h-1 rounded-full bg-[#eceff1]", style: { width: `${e}%` }, }, e, ), ), }), l && e && !o && (0, t.jsx)(n, { excerpt: e }), ], }); } as "DocThumbnail" };

"use strict";
    var t = m843476,
      a = m770703,
      s = m271645,
      r = m647163;
    let n = (0, a.default)(() => e.A(458094).then((e) => e.DocThumbnailPage), {
      loadableGenerated: { modules: [303604] },
      ssr: !1,
    });
    ;
