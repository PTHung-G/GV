// Reconstructed from 2a9amjd4hblzn.pretty.js, module 572032.
// deps: m843476, m716327, m88653, m532181, m772328, m271645, m647163
// exports: Faq
export { function ({ items: e }) { let [a, u] = (0, s.useState)(0), c = (0, o.useReducedMotion)(); return (0, t.jsx)("ul", { className: "divide-y divide-[#e9e9e7] border-y border-[#e9e9e7]", children: e.map((e, o) => { let s = a === o; return (0, t.jsxs)( "li", { children: [ (0, t.jsx)("h3", { children: (0, t.jsxs)("button", { type: "button", "aria-expanded": s, "aria-controls": `faq-${o}`, onClick: () => u(s ? null : o), className: "flex w-full items-center justify-between gap-4 py-4 text-left text-base font-medium text-[#37352f] transition-colors hover:text-[#2383e2]", children: [ e.question, (0, t.jsx)(i.ChevronDown, { "aria-hidden": !0, className: (0, l.cn)( "size-4 shrink-0 text-[#9b9a97] transition-transform duration-200", s && "rotate-180", ), }), ], }), }), (0, t.jsx)(r.AnimatePresence, { initial: !1, children: s && (0, t.jsx)(n.motion.div, { id: `faq-${o}`, role: "region", initial: !c && { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: c ? { opacity: 0 } : { height: 0, opacity: 0 }, transition: { duration: 0.22, ease: [0.2, 0, 0, 1] }, className: "overflow-hidden", children: (0, t.jsx)("p", { className: "max-w-2xl pb-5 text-[15px] leading-relaxed text-[#5f5e5b]", children: e.answer, }), }), }), ], }, e.question, ); }), }); } as "Faq" };

"use strict";
    var t = m843476,
      i = m716327,
      r = m88653,
      n = m532181,
      o = m772328,
      s = m271645,
      l = m647163;
    ;
