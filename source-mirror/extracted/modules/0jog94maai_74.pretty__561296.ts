// Reconstructed from 0jog94maai_74.pretty.js, module 561296.
// deps: m843476, m768877, m632781, m167881, m504251
// exports: CreateExamButton
export { function ({ label: e = "Bắt đầu soạn đề" }) { let { create: a, creating: l, error: c } = (0, r.useCreateExam)(); return (0, t.jsxs)("div", { className: "flex flex-col items-start gap-2", children: [ (0, t.jsxs)(s.Button, { size: "lg", className: "h-12 shrink-0 px-7 text-base font-semibold", onClick: a, disabled: l, children: [ e, l ? (0, t.jsx)(i.Loader2, { "aria-hidden": !0, className: "animate-spin", }) : (0, t.jsx)(n.ArrowRight, { "aria-hidden": !0 }), ], }), c && (0, t.jsx)("p", { role: "alert", className: "text-sm text-[#eb5757]", children: c, }), ], }); } as "CreateExamButton" };

"use strict";
    var t = m843476,
      n = m768877,
      i = m632781,
      s = m167881,
      r = m504251;
    ;
