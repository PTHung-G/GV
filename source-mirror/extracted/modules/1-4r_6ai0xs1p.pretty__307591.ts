// Reconstructed from 1-4r_6ai0xs1p.pretty.js, module 307591.
// deps: m271645, m775691
// exports: useSessionUser
export { function () { let [e, n] = (0, t.useState)({ user: null, ready: !1 }); return ( (0, t.useEffect)(() => { let e = () => n({ user: (0, r.readSession)()?.user ?? null, ready: !0 }); e(); let t = (t) => { (t.key === r.SESSION_KEY || null === t.key) && e(); }; return ( window.addEventListener("exam-session-change", e), window.addEventListener("storage", t), () => { (window.removeEventListener("exam-session-change", e), window.removeEventListener("storage", t)); } ); }, []), e ); } as "useSessionUser" };

"use strict";
    var t = m271645,
      r = m775691;
    ;
