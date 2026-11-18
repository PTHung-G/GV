// Reconstructed from 3zi979v0iopom.pretty.js, module 464978.
// deps: none
// exports: none


"use strict";
    var e = t.i(271645),
      i = t.i(821476);
    t.s([
      "usePresence",
      0,
      function (t = !0) {
        let s = (0, e.useContext)(i.PresenceContext);
        if (null === s) return [!0, null];
        let { isPresent: n, onExitComplete: r, register: o } = s,
          a = (0, e.useId)();
        (0, e.useEffect)(() => {
          if (t) return o(a);
        }, [t]);
        let l = (0, e.useCallback)(() => t && r && r(a), [a, r, t]);
        return !n && r ? [!1, l] : [!0];
      },
    ]);
