(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  944642,
  (e) => {
    "use strict";
    var t = e.i(716400);
    e.i(148043);
    let r = t.default.__parse;
    class n extends Error {}
    let a = {
        "\\xrightarrow": {
          latex: "\\rightarrow",
          plain: "→",
          stretchy: "\\xrightarrow",
        },
        "\\xleftarrow": {
          latex: "\\leftarrow",
          plain: "←",
          stretchy: "\\xleftarrow",
        },
        "\\xleftrightarrow": { latex: "\\leftrightarrow", plain: "↔" },
        "\\xrightleftharpoons": { latex: "\\rightleftharpoons", plain: "⇌" },
        "\\xrightequilibrium": { latex: "\\rightleftharpoons", plain: "⇌" },
        "\\xleftequilibrium": { latex: "\\rightleftharpoons", plain: "⇌" },
        "\\xrightleftarrows": { latex: "\\rightleftarrows", plain: "⇄" },
      },
      l = {
        "\\equiv": "≡",
        "\\cdot": "·",
        "\\bullet": "•",
        "\\uparrow": "↑",
        "\\downarrow": "↓",
        "\\circ": "°",
        "\\times": "×",
        "\\pm": "±",
        "\\approx": "≈",
        "\\sim": "~",
        "\\ll": "≪",
        "\\gg": "≫",
        "\\prime": "′",
        "\\ldots": "…",
        "\\rightarrow": "→",
        "\\leftarrow": "←",
        "-": "-",
      },
      i = new Set(["\\uparrow", "\\downarrow"]),
      s = {
        "\\acute": "́",
        "\\grave": "̀",
        "\\hat": "̂",
        "\\tilde": "̃",
        "\\ddot": "̈",
        "\\bar": "̄",
        "\\dot": "̇",
        "\\breve": "̆",
        "\\check": "̌",
        "\\mathring": "̊",
        "\\'": "́",
        "\\`": "̀",
        "\\^": "̂",
        "\\~": "̃",
        '\\"': "̈",
        "\\=": "̄",
        "\\.": "̇",
        "\\u": "̆",
        "\\v": "̌",
        "\\r": "̊",
      },
      o = {
        "{": "\\{",
        "}": "\\}",
        "%": "\\%",
        "#": "\\#",
        "&": "\\&",
        $: "\\$",
        _: "\\_",
      };
    function u(e) {
      return e ? (Array.isArray(e) ? e : [e]) : [];
    }
    let p = (e) => String(e.text ?? "");
    function c(e) {
      return e.startsWith("\\") ? (l[e] ?? e.slice(1)) : e;
    }
    function h(e) {
      return u(e).some(
        (e) => "lap" === e.type || ["body", "sub", "sup"].some((t) => h(e[t])),
      );
    }
    function f(e) {
      if ("spacing" === e.type) return " ";
      if (
        ("textord" === e.type || "mathord" === e.type) &&
        !p(e).startsWith("\\")
      )
        return p(e).replace("ı", "i").replace("ȷ", "j");
      if ("ordgroup" === e.type) return u(e.body).map(f).join("");
      let t = "accent" === e.type ? s[String(e.label)] : void 0;
      if (!t) throw new n(`text ${e.type}`);
      return (u(e.base).map(f).join("") + t).normalize("NFC");
    }
    function d(e, t) {
      return {
        ...(e.length ? { sub: e } : {}),
        ...(t.length ? { sup: t } : {}),
      };
    }
    function g(e) {
      return e
        .map((e) => {
          if (e.arrow)
            return (function (e) {
              let { latex: t, stretchy: r } = a[e.name],
                n = g(e.above),
                l = g(e.below);
              if (!n && !l) return t;
              if (r) return `${r}${l ? `[${l}]` : ""}{${n}}`;
              let i = n ? `\\overset{${n}}{${t}}` : t;
              return l ? `\\underset{${l}}{${i}}` : i;
            })(e.arrow);
          let t = e.latex;
          return (
            (e.sub || e.sup) &&
              !/^(.|\\[a-zA-Z]+|\\[a-zA-Z]+\{[^{}]*\}|\{.*\})$/.test(t) &&
              (t = `{${t}}`),
            t +
              (e.sub ? `_{${g(e.sub)}}` : "") +
              (e.sup ? `^{${g(e.sup)}}` : "")
          );
        })
        .reduce(
          (e, t) =>
            /\\[a-zA-Z]+$/.test(e) && /^[a-zA-Z]/.test(t) ? `${e} ${t}` : e + t,
          "",
        );
    }
    function x(e) {
      try {
        return (function e(t) {
          let r = [];
          for (let l of t)
            !(function (t, r) {
              switch (r.type) {
                case "ordgroup": {
                  let n = u(r.body);
                  if (1 === n.length && "atom" === n[0].type)
                    return t.push({ latex: `{${p(n[0])}}`, plain: c(p(n[0])) });
                  t.push(...e(n));
                  return;
                }
                case "font": {
                  let a = e(u(r.body));
                  if (a.some((e) => e.sub || e.sup || e.arrow || e.pre))
                    throw new n("font");
                  t.push({
                    latex: `\\${String(r.font)}{${g(a)}}`,
                    plain: "",
                    inner: a,
                  });
                  return;
                }
                case "mathord":
                case "textord":
                  t.push({ latex: p(r), plain: c(p(r)) });
                  return;
                case "atom": {
                  let e = p(r),
                    n = ("bin" === r.family || "rel" === r.family) && !i.has(e);
                  t.push({ latex: e, plain: c(e), op: n });
                  return;
                }
                case "supsub": {
                  let n = e(u(r.sub)),
                    a = e(u(r.sup));
                  if (
                    !(function e(t) {
                      return u(t).every((t) =>
                        "ordgroup" === t.type
                          ? e(t.body)
                          : ["vphantom", "hphantom", "phantom"].includes(
                              t.type,
                            ),
                      );
                    })(r.base)
                  ) {
                    let l = e(u(r.base));
                    t.push({
                      latex: `{${g(l)}}`,
                      plain: "",
                      inner: l,
                      ...d(n, a),
                    });
                    return;
                  }
                  if (!n.length && !a.length) return;
                  let l = t[t.length - 1];
                  if (h(r) || !l || l.op || l.pre)
                    return t.push({
                      latex: "{}",
                      plain: "",
                      pre: h(r),
                      ...d(n, a),
                    });
                  if ((n.length && l.sub) || (a.length && l.sup)) {
                    t[t.length - 1] = {
                      latex: `{${g([l])}}`,
                      plain: "",
                      inner: [l],
                      ...d(n, a),
                    };
                    return;
                  }
                  Object.assign(l, d(n, a));
                  return;
                }
                case "smash":
                case "lap":
                case "styling":
                case "color":
                  t.push(...e(u(r.body)));
                  return;
                case "mathchoice":
                  t.push(...e(u(r.text)));
                  return;
                case "vphantom":
                case "hphantom":
                case "phantom":
                case "kern":
                  return;
                case "spacing":
                  t.push({ latex: "\\,", plain: " " });
                  return;
                case "text": {
                  let e = u(r.body).map(f).join("");
                  t.push({
                    latex: `\\text{${e.replace(/[{}%#&$_]/g, (e) => o[e])}}`,
                    plain: e,
                  });
                  return;
                }
                case "xArrow": {
                  let l = String(r.label);
                  if (!a[l]) throw new n(l);
                  t.push({
                    latex: "",
                    plain: "",
                    op: !0,
                    arrow: {
                      name: l,
                      above: e(u(r.body)),
                      below: e(u(r.below)),
                    },
                  });
                  return;
                }
                case "genfrac": {
                  if (!r.hasBarLine || r.leftDelim || r.rightDelim)
                    throw new n("genfrac");
                  let a = e(u(r.numer)),
                    l = e(u(r.denom));
                  t.push({
                    latex: `\\frac{${g(a)}}{${g(l)}}`,
                    plain: "",
                    frac: [a, l],
                  });
                  return;
                }
                case "mclass": {
                  let n = u(r.body),
                    [a] = n,
                    l = a?.type === "supsub" ? u(a.base)[0] : void 0;
                  if (
                    1 === n.length &&
                    l?.type === "op" &&
                    l.suppressBaseShift
                  ) {
                    let r = e(u(l.body)),
                      n = e(u(a.sup)),
                      i = e(u(a.sub)),
                      s = g(r);
                    (n.length && (s = `\\overset{${g(n)}}{${s}}`),
                      i.length && (s = `\\underset{${g(i)}}{${s}}`),
                      t.push({ latex: s, plain: "", inner: r }));
                    return;
                  }
                  t.push(...e(n));
                  return;
                }
                case "accent": {
                  let n = (function (e) {
                    try {
                      let t = f(e);
                      return 1 == [...t].length ? t : void 0;
                    } catch {
                      return;
                    }
                  })(r);
                  if (n) return t.push({ latex: `\\text{${n}}`, plain: n });
                  let a = e(u(r.base));
                  t.push({
                    latex: `${String(r.label)}{${g(a)}}`,
                    plain: "",
                    inner: a,
                  });
                  return;
                }
                case "overline":
                case "underline": {
                  let n = e(u(r.body));
                  t.push({
                    latex: `\\${r.type}{${g(n)}}`,
                    plain: "",
                    inner: n,
                  });
                  return;
                }
                default:
                  throw new n(r.type);
              }
            })(r, l);
          return r;
        })(r(`\\ce{${e}}`, { strict: !1, throwOnError: !0 }));
      } catch {
        return null;
      }
    }
    function b(e) {
      let t = [],
        r = /\\ce\s*\{/g;
      for (let n = r.exec(e); n; n = r.exec(e)) {
        let a = n.index + n[0].length,
          l = 1,
          i = a;
        for (; i < e.length && l > 0; i++)
          "\\" === e[i] ? i++ : "{" === e[i] ? l++ : "}" === e[i] && l--;
        if (l > 0) break;
        (t.push({ start: n.index, end: i, body: e.slice(a, i - 1) }),
          (r.lastIndex = i));
      }
      return t;
    }
    e.s([
      "chemToUnicode",
      0,
      function (e, t) {
        let r = x(e);
        return r
          ? (function e(t, r, n = !1) {
              return t
                .map((t) => {
                  if (t.arrow) {
                    let n = [e(t.arrow.above, r), e(t.arrow.below, r)]
                      .filter(Boolean)
                      .join("; ");
                    return ` ${a[t.arrow.name].plain}${n ? `(${n})` : ""} `;
                  }
                  let l = t.inner ? e(t.inner, r) : t.plain;
                  (t.frac && (l = `${e(t.frac[0], r)}/${e(t.frac[1], r)}`),
                    t.op && n && (l = ` ${l} `));
                  let i = t.sub ? r.sub(e(t.sub, r)) : "",
                    s = t.sup ? r.sup(e(t.sup, r)) : "";
                  return t.pre ? s + i : l + i + s;
                })
                .join("");
            })(r, t, !0)
              .replace(/\s+/g, " ")
              .trim()
          : null;
      },
      "expandChem",
      0,
      function (e) {
        let t = b(e),
          r = "",
          n = 0;
        for (let { start: a, end: l, body: i } of t) {
          let t = x(i);
          if (!t) return null;
          ((r += `${e.slice(n, a)}{${g(t)}}`), (n = l));
        }
        return ((r += e.slice(n)), /\\ce(?![a-zA-Z])/.test(r) ? null : r);
      },
      "findChem",
      0,
      b,
    ]);
  },
  210885,
  (e) => {
    "use strict";
    var t = e.i(843476),
      r = e.i(494499),
      n = e.i(271645),
      a = e.i(503561),
      l = e.i(882771),
      i = e.i(954206);
    function s(e) {
      let t = e.replace(/\r\n?/g, "\n").split("\n");
      t.length > 1 && t.pop();
      let r = t.flatMap((e, t) => (e.trimStart().startsWith("```") ? [t] : []));
      return (r.length % 2 == 1 && (t.length = r[r.length - 1]), t.join("\n"));
    }
    e.s([
      "DocThumbnailPage",
      0,
      function ({ excerpt: e }) {
        let o = (0, n.useRef)(null),
          [u, p] = (0, n.useState)(0),
          c = (0, n.useMemo)(() => (0, i.parseExamMarkdown)(s(e)), [e]),
          h = (0, r.useEditor)({
            immediatelyRender: !1,
            editable: !1,
            extensions: (0, l.examExtensions)({ placeholder: "" }),
            editorProps: {
              attributes: {
                class: "doc-content",
                spellcheck: "false",
                tabindex: "-1",
              },
            },
            content: c,
          });
        return (
          (0, n.useEffect)(() => {
            let e = o.current;
            if (!e) return;
            let t = new ResizeObserver(([e]) => p(e.contentRect.width));
            return (t.observe(e), () => t.disconnect());
          }, []),
          (0, t.jsx)("div", {
            ref: o,
            inert: !0,
            className:
              "pointer-events-none absolute inset-0 overflow-hidden bg-white select-none",
            children:
              !!h &&
              u > 0 &&
              (0, t.jsx)("div", {
                className: "exam-paper doc-thumb-fade",
                style: {
                  width: a.PAGE_WIDTH_PX,
                  paddingTop: a.MARGIN_TOP_PX,
                  paddingLeft: a.MARGIN_LEFT_PX,
                  paddingRight: a.MARGIN_RIGHT_PX,
                  fontSize: `${(0, a.quantizedFontPx)(a.BASE_FONT_PX).toFixed(3)}px`,
                  lineHeight: `${a.TEXT_LINE_PX.toFixed(3)}px`,
                  transform: `scale(${u / a.PAGE_WIDTH_PX})`,
                  transformOrigin: "top left",
                },
                children: (0, t.jsx)(r.EditorContent, { editor: h }),
              }),
          })
        );
      },
      "excerptMarkdown",
      0,
      s,
    ]);
  },
  303604,
  function (e) {
    e.n(e.i(210885));
  },
  773069,
  (e) => {
    e.v((t) =>
      Promise.all(["static/chunks/3lg7mb1l1rlak.js"].map((t) => e.l(t))).then(
        () => t(649495),
      ),
    );
  },
  200785,
  (e) => {
    e.v((t) =>
      Promise.all(["static/chunks/37gpt69w-sxvw.js"].map((t) => e.l(t))).then(
        () => t(966893),
      ),
    );
  },
]);
