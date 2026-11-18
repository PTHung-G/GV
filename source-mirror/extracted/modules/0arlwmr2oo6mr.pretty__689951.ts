// Reconstructed from 0arlwmr2oo6mr.pretty.js, module 689951.
// deps: m271645, m665137
// exports: useQuotaBalance
export { function (e) { let [a, s] = (0, t.useState)(null); return ( (0, t.useEffect)(() => { if (!e) return; let t = !0, a = () => { (0, n.getAccount)("/api/auth/quota") .then((e) => t && s(e.balance)) .catch(() => {}); }; return ( a(), window.addEventListener("exam-quota-change", a), window.addEventListener("focus", a), () => { ((t = !1), window.removeEventListener("exam-quota-change", a), window.removeEventListener("focus", a)); } ); }, [e]), e ? a : null ); } as "useQuotaBalance" };

"use strict";
    var t = m271645,
      n = m665137;
    ;
