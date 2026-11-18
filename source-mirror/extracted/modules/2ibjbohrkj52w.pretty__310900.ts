// Reconstructed from 2ibjbohrkj52w.pretty.js, module 310900.
// deps: m271645, m799887
// exports: useMetadataOptions
export { function () { let [e, a] = (0, t.useState)(null), [s, r] = (0, t.useState)(""); return ( (0, t.useEffect)(() => { let e = !0; return ( (n ??= (0, i.getMetadataOptions)().then((e) => e.options)) .then((t) => e && a(t)) .catch((t) => { ((n = null), e && r(t.message)); }), () => { e = !1; } ); }, []), { options: e, error: s } ); } as "useMetadataOptions" };

"use strict";
    var t = m271645,
      i = m799887;
    let n = null;
    ;
