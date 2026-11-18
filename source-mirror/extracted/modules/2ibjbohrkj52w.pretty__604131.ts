// Reconstructed from 2ibjbohrkj52w.pretty.js, module 604131.
// deps: m843476, m271645, m636607
// exports: RichText
export { function ({ text: e }) { return e ? (0, t.jsx)(t.Fragment, { children: (function (e) { if (!e) return null; let n = (function (e) { if (!e || !r(e)) return e; let t = e.split("\n"); return t.some((e) => void 0 !== s(e).align) ? t .map((e) => { let { align: t, text: i } = s(e); if (!t && l.test(i)) return i; let n = t ? ` style="text-align: ${t}"` : "", a = i ? i .replace( /\*\*([^*]+)\*\*/g, "<strong>$1</strong>", ) .replace( /(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>", ) : "<br>"; return `<p${n}>${a}</p>`; }) .join("") : e; })(e); if (r(n)) return Array.from( new DOMParser().parseFromString( `<body>${n}</body>`, "text/html", ).body.childNodes, ).map((e, n) => (function e(n, a) { if (n.nodeType === Node.TEXT_NODE) { var s; let e = n.textContent || ""; return (0, t.jsx)( i.Fragment, { children: (s = e) ? s .split(/\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g) .map((e, n) => void 0 === e ? null : n % 3 == 1 ? (0, t.jsx)( u, { math: e }, `disp-${n}`, ) : n % 3 == 2 ? (0, t.jsx)( c, { math: e }, `inl-${n}`, ) : (0, t.jsx)( i.Fragment, { children: g(e) }, `t-${n}`, ), ) : null, }, a, ); } if (n.nodeType === Node.ELEMENT_NODE) { let s = n.tagName.toLowerCase(); if ( "math" === n.getAttribute("data-type") || n.classList.contains("math-node") ) { let e = n.getAttribute("data-latex"), i = ""; if (e) i = decodeURIComponent(e); else { let e = n.textContent || "", t = /\$\$([\s\S]*?)\$\$|\$([^$]*)\$/g.exec(e); i = t ? (t[1] ?? t[2] ?? "") : e; } return "true" === n.getAttribute("data-display") ? (0, t.jsx)(u, { math: i }, a) : (0, t.jsx)(c, { math: i }, a); } let r = Array.from(n.childNodes).map((t, i) => e(t, `${a}-${i}`), ), l = {}; (n.style.textAlign && (l.textAlign = n.style.textAlign), n.style.fontSize && (l.fontSize = n.style.fontSize), n.style.lineHeight && (l.lineHeight = n.style.lineHeight), n.style.marginBottom && (l.marginBottom = n.style.marginBottom)); let o = Object.keys(l).length > 0 ? l : void 0; switch (s) { case "p": return (0, t.jsx)( "p", { style: o, className: "center" === n.style.textAlign ? "text-center" : "right" === n.style.textAlign ? "text-right" : "justify" === n.style.textAlign ? "text-justify" : void 0, children: r.length > 0 ? r : (0, t.jsx)("br", {}), }, a, ); case "strong": case "b": return (0, t.jsx)( "strong", { style: o, children: r }, a, ); case "em": case "i": return (0, t.jsx)( "em", { style: o, children: r }, a, ); case "u": return (0, t.jsx)( "u", { style: o, children: r }, a, ); case "s": case "strike": case "del": return (0, t.jsx)( "s", { style: o, children: r }, a, ); case "sub": return (0, t.jsx)( "sub", { style: o, children: r }, a, ); case "sup": return (0, t.jsx)( "sup", { style: o, children: r }, a, ); case "br": return (0, t.jsx)("br", {}, a); case "span": return (0, t.jsx)( "span", { style: o, children: r }, a, ); default: return (0, t.jsx)(i.Fragment, { children: r }, a); } } return null; })(e, n), ); if (!n) return null; let a = [], o = n .replace( /\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g, (e, i, n) => { let s = a.length; return ( void 0 !== i ? a.push((0, t.jsx)(u, { math: i }, `bm-${s}`)) : a.push( (0, t.jsx)(c, { math: n ?? "" }, `im-${s}`), ), `\u0000MATH_${s}\u0000` ); }, ) .split("\n") .map(s); return o.map((e, n) => { var s, r; let l = void 0 !== e.align, d = o[n + 1]?.align !== void 0, c = ((s = e.text), (r = a), s ? s .split(/\u0000MATH_(\d+)\u0000/g) .map((e, n) => n % 2 == 1 ? (r[parseInt(e, 10)] ?? null) : (0, t.jsx)( i.Fragment, { children: g(e) }, n, ), ) : null); return (0, t.jsxs)( i.Fragment, { children: [ l ? (0, t.jsx)("span", { className: m[e.align], children: c, }) : c, n < o.length - 1 && !l && !d && (0, t.jsx)("br", {}), ], }, n, ); }); })(e), }) : null; } as "RichText" };

"use strict";
    var t = m843476,
      i = m271645,
      n = m636607;
    let a = /^::(left|center|right|justify)::[ \t]?/;
    function s(e) {
      let t = a.exec(e);
      return t
        ? { align: t[1], text: e.slice(t[0].length) }
        : { align: void 0, text: e };
    }
    function r(e) {
      return !!e && /<[a-z][\s\S]*>/i.test(e);
    }
    let l =
      /^\s*<(?:p|div|li|blockquote|h[1-6])\b[\s\S]*<\/(?:p|div|li|blockquote|h[1-6])>\s*$/i;
    class o extends i.Component {
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
    let d = [
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
    function c({ math: e }) {
      let i = e.trim();
      if (!i) return null;
      let a = i.replace(/\\ne\b/g, "\\neq");
      return (0, t.jsx)(o, {
        fallbackText: i,
        children: (0, t.jsx)(n.InlineMath, { math: a, errorColor: "#dc2626" }),
      });
    }
    function u({ math: e }) {
      let i = e.trim();
      if (!i) return null;
      let a = i.replace(/\\ne\b/g, "\\neq");
      return (0, t.jsx)(o, {
        fallbackText: i,
        children: (0, t.jsx)(n.BlockMath, { math: a, errorColor: "#dc2626" }),
      });
    }
    let m = {
      left: "block text-left",
      center: "block text-center",
      right: "block text-right",
      justify: "block text-justify",
    };
    function g(e) {
      return e
        ? (function (e) {
            let t = e;
            for (let [e, i] of d) t = t.replace(e, i);
            return t;
          })(e)
            .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
            .map((e, n) =>
              e.startsWith("**") && e.endsWith("**") && e.length > 4
                ? (0, t.jsx)("strong", { children: e.slice(2, -2) }, n)
                : e.startsWith("*") && e.endsWith("*") && e.length > 2
                  ? (0, t.jsx)("em", { children: e.slice(1, -1) }, n)
                  : (0, t.jsx)(i.Fragment, { children: e }, n),
            )
        : null;
    }
    ;
