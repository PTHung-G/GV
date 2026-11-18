// Reconstructed from 16aj47n690ufs.pretty.js, module 636607.
// deps: none
// exports: none


"use strict";
    var e = t.i(843476),
      r = t.i(716400),
      n = t.i(271645);
    t.i(148043);
    var a = t.i(378610);
    function i(t, e, i) {
      return (0, n.useMemo)(
        () =>
          r.default.renderToString(
            (0, a.spaceMatrixRows)((0, a.normalizeLatex)(t)),
            {
              displayMode: e,
              errorColor: i,
              throwOnError: !1,
              strict: !1,
              output: "html",
            },
          ),
        [t, e, i],
      );
    }
    t.s([
      "BlockMath",
      0,
      function ({ math: t, errorColor: r = "#dc2626" }) {
        let n = i(t, !0, r);
        return (0, e.jsx)("div", { dangerouslySetInnerHTML: { __html: n } });
      },
      "InlineMath",
      0,
      function ({ math: t, errorColor: r = "#dc2626" }) {
        let n = i(t, !1, r);
        return (0, e.jsx)("span", { dangerouslySetInnerHTML: { __html: n } });
      },
    ]);
