// Reconstructed from 04xc202ii67m6.pretty.js, module 842319.
// deps: m843476, m981658, m263676, m522016, m271645, m665137, m775691, m663756
// exports: ExpiryBanner
export { function () { let [e, c] = (0, s.useState)(null); if ( ((0, s.useEffect)(() => { let e = !0, t = () => { (0, o.readSession)() ? (0, a.getAccount)("/api/auth/quota") .then( (t) => e && c( t.expiring && !(function (e) { try { return ( localStorage.getItem(d) === `${e}|${new Date().toDateString()}` ); } catch { return !1; } })(t.expiring.at) ? t.expiring : null, ), ) .catch(() => {}) : c(null); }; t(); let n = (e) => { e.key === o.SESSION_KEY && t(); }; return ( window.addEventListener("exam-session-change", t), window.addEventListener("exam-quota-change", t), window.addEventListener("storage", n), () => { ((e = !1), window.removeEventListener("exam-session-change", t), window.removeEventListener("exam-quota-change", t), window.removeEventListener("storage", n)); } ); }, []), !e) ) return null; let u = (0, l.daysUntil)(e.at); return (0, t.jsx)("div", { role: "status", className: "border-b border-[#f1e2b4] bg-[#fbf3db]", children: (0, t.jsxs)("div", { className: "mx-auto flex max-w-(--page-max) items-center gap-2.5 px-(--gutter) py-2 text-[13.5px] text-[#6b5016]", children: [ (0, t.jsx)(n.Hourglass, { "aria-hidden": !0, className: "size-4 shrink-0", }), (0, t.jsxs)("p", { className: "min-w-0 flex-1", children: [ (0, t.jsxs)("b", { children: [(0, l.formatPoints)(e.points), " điểm"], }), " của thầy cô sẽ hết hạn ", u <= 1 ? "trong hôm nay hoặc ngày mai" : `sau ${u} ng\xe0y`, " (", (0, l.formatDate)(e.at), ").", " ", (0, t.jsx)(r.default, { href: "/profile#vi-diem", className: "font-medium underline underline-offset-2", children: "Xem ví điểm", }), ], }), (0, t.jsx)("button", { type: "button", "aria-label": "Ẩn thông báo hôm nay", className: "grid size-7 shrink-0 place-items-center rounded-md hover:bg-[#f3e6bd]", onClick: () => { try { localStorage.setItem( d, `${e.at}|${new Date().toDateString()}`, ); } catch {} c(null); }, children: (0, t.jsx)(i.X, { "aria-hidden": !0, className: "size-4", }), }), ], }), }); } as "ExpiryBanner" };

"use strict";
    var t = m843476,
      n = m981658,
      i = m263676,
      r = m522016,
      s = m271645,
      a = m665137,
      o = m775691,
      l = m663756;
    let d = "exam-expiry-banner-dismissed";
    ;
