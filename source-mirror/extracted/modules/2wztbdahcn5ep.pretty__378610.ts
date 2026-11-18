// Reconstructed from 2wztbdahcn5ep.pretty.js, module 378610.
// deps: none
// exports: markEmptySlots, normalizeLatex, spaceMatrixRows
export { function (e) { return e.replace(/\{\}/g, (t, r) => !(function (e, t) { let r = e[t - 1]; if (void 0 === r) return !1; if ("^_}]".includes(r)) return !0; let a = t; for (; a > 0 && /[a-zA-Z]/.test(e[a - 1]); ) a--; return a < t && "\\" === e[a - 1]; })(e, r) ? t : "{\\color{#a3a3a3}\\square}", ); } as "markEmptySlots" };
export { function (e) { return e .replace(/\\placeholder(?:\[[^\]]*\])?\{[^{}]*\}/g, "") .replace( /\\(?:overparen|wideparen|overarc)(?![a-zA-Z])/g, "\\overgroup", ) .replace(/\\underparen(?![a-zA-Z])/g, "\\undergroup"); } as "normalizeLatex" };
export { function (e, r = 10) { return e.includes("\\begin{") ? e.replace(t, (e, t, a) => { let n = a.replace(/\\\\(?!\s*\[)/g, `\\\\[${r}pt]`); return `\\begin{${t}}${n}\\end{${t}}`; }) : e; } as "spaceMatrixRows" };

"use strict";
    let t = /\\begin\{(cases|array|aligned|gathered)\}([\s\S]*?)\\end\{\1\}/g;
    ;
