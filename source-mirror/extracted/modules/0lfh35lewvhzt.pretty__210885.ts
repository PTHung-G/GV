// Reconstructed from 0lfh35lewvhzt.pretty.js, module 210885.
// deps: m843476, m494499, m271645, m503561, m882771, m954206
// exports: DocThumbnailPage, excerptMarkdown
export { function ({ excerpt: e }) { let o = (0, n.useRef)(null), [u, p] = (0, n.useState)(0), c = (0, n.useMemo)(() => (0, i.parseExamMarkdown)(s(e)), [e]), h = (0, r.useEditor)({ immediatelyRender: !1, editable: !1, extensions: (0, l.examExtensions)({ placeholder: "" }), editorProps: { attributes: { class: "doc-content", spellcheck: "false", tabindex: "-1", }, }, content: c, }); return ( (0, n.useEffect)(() => { let e = o.current; if (!e) return; let t = new ResizeObserver(([e]) => p(e.contentRect.width)); return (t.observe(e), () => t.disconnect()); }, []), (0, t.jsx)("div", { ref: o, inert: !0, className: "pointer-events-none absolute inset-0 overflow-hidden bg-white select-none", children: !!h && u > 0 && (0, t.jsx)("div", { className: "exam-paper doc-thumb-fade", style: { width: a.PAGE_WIDTH_PX, paddingTop: a.MARGIN_TOP_PX, paddingLeft: a.MARGIN_LEFT_PX, paddingRight: a.MARGIN_RIGHT_PX, fontSize: `${(0, a.quantizedFontPx)(a.BASE_FONT_PX).toFixed(3)}px`, lineHeight: `${a.TEXT_LINE_PX.toFixed(3)}px`, transform: `scale(${u / a.PAGE_WIDTH_PX})`, transformOrigin: "top left", }, children: (0, t.jsx)(r.EditorContent, { editor: h }), }), }) ); } as "DocThumbnailPage" };
export { s as "excerptMarkdown" };

"use strict";
    var t = m843476,
      r = m494499,
      n = m271645,
      a = m503561,
      l = m882771,
      i = m954206;
    function s(e) {
      let t = e.replace(/\r\n?/g, "\n").split("\n");
      t.length > 1 && t.pop();
      let r = t.flatMap((e, t) => (e.trimStart().startsWith("```") ? [t] : []));
      return (r.length % 2 == 1 && (t.length = r[r.length - 1]), t.join("\n"));
    }
    ;
