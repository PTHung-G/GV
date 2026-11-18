// Reconstructed from 2-_e50duc2fl9.pretty.js, module 310900.
// deps: m271645, m799887
// exports: useMetadataOptions
export { function () { let [e, s] = (0, t.useState)(null), [i, a] = (0, t.useState)(""); return ( (0, t.useEffect)(() => { let e = !0; return ( (n ??= (0, r.getMetadataOptions)().then((e) => e.options)) .then((t) => e && s(t)) .catch((t) => { ((n = null), e && a(t.message)); }), () => { e = !1; } ); }, []), { options: e, error: i } ); } as "useMetadataOptions" };

"use strict";
    var t = m271645,
      r = m799887;
    let n = null;
    ;
