// Reconstructed from 3x2egdq4l2jk7.pretty.js, module 310900.
// deps: m271645, m799887
// exports: useMetadataOptions
export { function () { let [e, r] = (0, t.useState)(null), [n, i] = (0, t.useState)(""); return ( (0, t.useEffect)(() => { let e = !0; return ( (s ??= (0, a.getMetadataOptions)().then((e) => e.options)) .then((t) => e && r(t)) .catch((t) => { ((s = null), e && i(t.message)); }), () => { e = !1; } ); }, []), { options: e, error: n } ); } as "useMetadataOptions" };

"use strict";
    var t = m271645,
      a = m799887;
    let s = null;
    ;
