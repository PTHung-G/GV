// Reconstructed from 1c8ttxz-uq6b-.pretty.js, module 774606.
// deps: m271645, m174080, m248425, m934620, m843476
// exports: Portal
export { a as "Portal" };

"use strict";
    var t = m271645,
      n = m174080,
      r = m248425,
      o = m934620,
      i = m843476,
      u = Object.defineProperty,
      a = t.forwardRef(
        u(
          function (e, u) {
            let { container: a, ...c } = e,
              [s, l] = t.useState(!1);
            (0, o.useLayoutEffect)(() => l(!0), []);
            let d = a || (s && globalThis?.document?.body);
            return d
              ? n.createPortal((0, i.jsx)(r.Primitive.div, { ...c, ref: u }), d)
              : null;
          },
          "name",
          { value: "Portal", configurable: !0 },
        ),
      );
    ;
