// Reconstructed from 0moy4u4hwkt-l.pretty.js, module 604131.
// deps: m843476, m271645, m636607
// exports: RichText
export { function ({ text: e }) { return e ? (0, t.jsx)(t.Fragment, { children: (function (e) { if (!e) return null; let r = (function (e) { if (!e || !l(e)) return e; let t = e.split("\n"); return t.some((e) => void 0 !== i(e).align) ? t .map((e) => { let { align: t, text: n } = i(e); if (!t && s.test(n)) return n; let r = t ? ` style="text-align: ${t}"` : "", a = n ? n .replace( /\*\*([^*]+)\*\*/g, "<strong>$1</strong>", ) .replace( /(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>", ) : "<br>"; return `<p${r}>${a}</p>`; }) .join("") : e; })(e); if (l(r)) return Array.from( new DOMParser().parseFromString( `<body>${r}</body>`, "text/html", ).body.childNodes, ).map((e, r) => (function e(r, a) { if (r.nodeType === Node.TEXT_NODE) { var i; let e = r.textContent || ""; return (0, t.jsx)( n.Fragment, { children: (i = e) ? i .split(/\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g) .map((e, r) => void 0 === e ? null : r % 3 == 1 ? (0, t.jsx)( u, { math: e }, `disp-${r}`, ) : r % 3 == 2 ? (0, t.jsx)( d, { math: e }, `inl-${r}`, ) : (0, t.jsx)( n.Fragment, { children: m(e) }, `t-${r}`, ), ) : null, }, a, ); } if (r.nodeType === Node.ELEMENT_NODE) { let i = r.tagName.toLowerCase(); if ( "math" === r.getAttribute("data-type") || r.classList.contains("math-node") ) { let e = r.getAttribute("data-latex"), n = ""; if (e) n = decodeURIComponent(e); else { let e = r.textContent || "", t = /\$\$([\s\S]*?)\$\$|\$([^$]*)\$/g.exec(e); n = t ? (t[1] ?? t[2] ?? "") : e; } return "true" === r.getAttribute("data-display") ? (0, t.jsx)(u, { math: n }, a) : (0, t.jsx)(d, { math: n }, a); } let l = Array.from(r.childNodes).map((t, n) => e(t, `${a}-${n}`), ), s = {}; (r.style.textAlign && (s.textAlign = r.style.textAlign), r.style.fontSize && (s.fontSize = r.style.fontSize), r.style.lineHeight && (s.lineHeight = r.style.lineHeight), r.style.marginBottom && (s.marginBottom = r.style.marginBottom)); let o = Object.keys(s).length > 0 ? s : void 0; switch (i) { case "p": return (0, t.jsx)( "p", { style: o, className: "center" === r.style.textAlign ? "text-center" : "right" === r.style.textAlign ? "text-right" : "justify" === r.style.textAlign ? "text-justify" : void 0, children: l.length > 0 ? l : (0, t.jsx)("br", {}), }, a, ); case "strong": case "b": return (0, t.jsx)( "strong", { style: o, children: l }, a, ); case "em": case "i": return (0, t.jsx)( "em", { style: o, children: l }, a, ); case "u": return (0, t.jsx)( "u", { style: o, children: l }, a, ); case "s": case "strike": case "del": return (0, t.jsx)( "s", { style: o, children: l }, a, ); case "sub": return (0, t.jsx)( "sub", { style: o, children: l }, a, ); case "sup": return (0, t.jsx)( "sup", { style: o, children: l }, a, ); case "br": return (0, t.jsx)("br", {}, a); case "span": return (0, t.jsx)( "span", { style: o, children: l }, a, ); default: return (0, t.jsx)(n.Fragment, { children: l }, a); } } return null; })(e, r), ); if (!r) return null; let a = [], o = r .replace( /\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g, (e, n, r) => { let i = a.length; return ( void 0 !== n ? a.push((0, t.jsx)(u, { math: n }, `bm-${i}`)) : a.push( (0, t.jsx)(d, { math: r ?? "" }, `im-${i}`), ), `\u0000MATH_${i}\u0000` ); }, ) .split("\n") .map(i); return o.map((e, r) => { var i, l; let s = void 0 !== e.align, c = o[r + 1]?.align !== void 0, d = ((i = e.text), (l = a), i ? i .split(/\u0000MATH_(\d+)\u0000/g) .map((e, r) => r % 2 == 1 ? (l[parseInt(e, 10)] ?? null) : (0, t.jsx)( n.Fragment, { children: m(e) }, r, ), ) : null); return (0, t.jsxs)( n.Fragment, { children: [ s ? (0, t.jsx)("span", { className: g[e.align], children: d, }) : d, r < o.length - 1 && !s && !c && (0, t.jsx)("br", {}), ], }, r, ); }); })(e), }) : null; } as "RichText" };

"use strict";
    var t = m843476,
      n = m271645,
      r = m636607;
    let a = /^::(left|center|right|justify)::[ \t]?/;
    function i(e) {
      let t = a.exec(e);
      return t
        ? { align: t[1], text: e.slice(t[0].length) }
        : { align: void 0, text: e };
    }
    function l(e) {
      return !!e && /<[a-z][\s\S]*>/i.test(e);
    }
    let s =
      /^\s*<(?:p|div|li|blockquote|h[1-6])\b[\s\S]*<\/(?:p|div|li|blockquote|h[1-6])>\s*$/i;
    class o extends n.Component {
      constructor(e) {
        (super(e), (this.state = { hasError: !1 }));
      }
      static getDerivedStateFromError() {
        return { hasError: !0 };
      }
      render() {
        return this.state.hasError
          ? (0, t.jsxs)("span", {
              className:
                "rounded border border-rose-200 bg-rose-50 px-1 py-0.5 font-mono text-xs text-rose-600",
              children: ["$", this.props.fallbackText, "$"],
            })
          : this.props.children;
      }
    }
    let c = [
      [/\\(?:ne|neq)\b/g, "≠"],
      [/\\(?:ge|geq)\b/g, "≥"],
      [/\\(?:le|leq)\b/g, "≤"],
      [/\\pm\b/g, "±"],
      [/\\times\b/g, "×"],
      [/\\cdot\b/g, "·"],
      [/\\approx\b/g, "≈"],
      [/\\infty\b/g, "∞"],
      [/\\alpha\b/g, "α"],
      [/\\beta\b/g, "β"],
      [/\\gamma\b/g, "γ"],
      [/\\Delta\b/g, "Δ"],
      [/\\pi\b/g, "π"],
      [/\\in\b/g, "∈"],
      [/\\notin\b/g, "∉"],
      [/\\angle\b/g, "∠"],
      [/\\triangle\b/g, "△"],
      [/\\(?:circ|degree)\b/g, "°"],
      [/\\rightarrow\b/g, "→"],
      [/\\Rightarrow\b/g, "⇒"],
      [/\\Leftrightarrow\b/g, "⇔"],
    ];
    function d({ math: e }) {
      let n = e.trim();
      if (!n) return null;
      let a = n.replace(/\\ne\b/g, "\\neq");
      return (0, t.jsx)(o, {
        fallbackText: n,
        children: (0, t.jsx)(r.InlineMath, { math: a, errorColor: "#dc2626" }),
      });
    }
    function u({ math: e }) {
      let n = e.trim();
      if (!n) return null;
      let a = n.replace(/\\ne\b/g, "\\neq");
      return (0, t.jsx)(o, {
        fallbackText: n,
        children: (0, t.jsx)(r.BlockMath, { math: a, errorColor: "#dc2626" }),
      });
    }
    let g = {
      left: "block text-left",
      center: "block text-center",
      right: "block text-right",
      justify: "block text-justify",
    };
    function m(e) {
      return e
        ? (function (e) {
            let t = e;
            for (let [e, n] of c) t = t.replace(e, n);
            return t;
          })(e)
            .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
            .map((e, r) =>
              e.startsWith("**") && e.endsWith("**") && e.length > 4
                ? (0, t.jsx)("strong", { children: e.slice(2, -2) }, r)
                : e.startsWith("*") && e.endsWith("*") && e.length > 2
                  ? (0, t.jsx)("em", { children: e.slice(1, -1) }, r)
                  : (0, t.jsx)(n.Fragment, { children: e }, r),
            )
        : null;
    }
    ;
