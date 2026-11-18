// Reconstructed from 1yutqy473-l5a.pretty.js, module 636607.
// deps: m843476, m716400, m271645, m148043, m378610
// exports: BlockMath, InlineMath
export { function ({ math: e, errorColor: n = "#dc2626" }) { let r = i(e, !0, n); return (0, t.jsx)("div", { dangerouslySetInnerHTML: { __html: r } }); } as "BlockMath" };
export { function ({ math: e, errorColor: n = "#dc2626" }) { let r = i(e, !1, n); return (0, t.jsx)("span", { dangerouslySetInnerHTML: { __html: r } }); } as "InlineMath" };

"use strict";
    var t = m843476,
      n = m716400,
      r = m271645;
    m148043;
    var a = m378610;
    function i(e, t, i) {
      return (0, r.useMemo)(
        () =>
          n.default.renderToString(
            (0, a.spaceMatrixRows)((0, a.normalizeLatex)(e)),
            {
              displayMode: t,
              errorColor: i,
              throwOnError: !1,
              strict: !1,
              output: "html",
            },
          ),
        [e, t, i],
      );
    }
    ;
