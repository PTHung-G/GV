// Reconstructed from 2a9amjd4hblzn.pretty.js, module 561296.
// deps: m843476, m768877, m632781, m167881, m504251
// exports: CreateExamButton
export { function ({ label: e = "Bắt đầu soạn đề" }) { let { create: s, creating: l, error: a } = (0, o.useCreateExam)(); return (0, t.jsxs)("div", { className: "flex flex-col items-start gap-2", children: [ (0, t.jsxs)(n.Button, { size: "lg", className: "h-12 shrink-0 px-7 text-base font-semibold", onClick: s, disabled: l, children: [ e, l ? (0, t.jsx)(r.Loader2, { "aria-hidden": !0, className: "animate-spin", }) : (0, t.jsx)(i.ArrowRight, { "aria-hidden": !0 }), ], }), a && (0, t.jsx)("p", { role: "alert", className: "text-sm text-[#eb5757]", children: a, }), ], }); } as "CreateExamButton" };

"use strict";
    var t = m843476,
      i = m768877,
      r = m632781,
      n = m167881,
      o = m504251;
    ;
