// Reconstructed from 3bg0pkvz9zgwr.pretty.js, module 745417.
// deps: none
// exports: none


"use strict";
    function e(t, e) {
      for (let n = e + 1; n < t.length; n++) {
        if ("\\" === t[n]) {
          n++;
          continue;
        }
        if ("$" === t[n]) return n;
      }
      return -1;
    }
    function n(t) {
      let n = [],
        a = "",
        i = !1,
        r = () => {
          (a && n.push({ text: a, math: !1, bold: i }), (a = ""));
        };
      for (let o = 0; o < t.length; o++) {
        let l = t[o],
          s = t[o + 1];
        if ("\\" === l && ("$" === s || "*" === s)) {
          ((a += s), o++);
          continue;
        }
        if ("$" === l) {
          let a = e(t, o);
          if (a > o + 1) {
            (r(),
              n.push({ text: t.slice(o + 1, a), math: !0, bold: i }),
              (o = a));
            continue;
          }
        }
        if (
          "*" === l &&
          "*" === s &&
          (i ||
            (function (t, n) {
              for (let a = n; a < t.length; a++) {
                let i = t[a];
                if ("\\" === i) {
                  a++;
                  continue;
                }
                if ("$" === i) {
                  let n = e(t, a);
                  if (n > a + 1) {
                    a = n;
                    continue;
                  }
                }
                if ("*" === i && "*" === t[a + 1]) return a > n;
              }
              return !1;
            })(t, o + 2))
        ) {
          (r(), (i = !i), o++);
          continue;
        }
        a += l;
      }
      return (r(), n);
    }
    function a(t) {
      return t.replace(/^\s*(?:[-•*–]\s+|\d+[.)]\s+)/, "");
    }
    let i = [
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "highlight",
      "size",
      "font",
      "script",
      "link",
    ];
    function r(t, e) {
      let i =
        "none" === e
          ? t.split("\n")
          : t
              .split("\n")
              .filter((t) => t.trim())
              .map(a);
      return i.length
        ? i.map((t) => ({
            runs: n(t).map((t) => ({
              text: t.text,
              ...(t.math ? { math: !0 } : {}),
              ...(t.bold ? { marks: { bold: !0 } } : {}),
            })),
          }))
        : [{ runs: [] }];
    }
    function o(t) {
      return t.rich?.length ? t.rich : r(t.text, t.style.list);
    }
    function l(t, e) {
      let n = t?.marks ?? {};
      return {
        bold: n.bold ?? e.bold,
        italic: n.italic ?? e.italic,
        underline: n.underline ?? e.underline,
        strike: n.strike ?? e.strike,
        color: n.color ?? e.color,
        highlight: n.highlight ?? "",
        size: n.size ?? e.fontSize,
        font: n.font ?? e.font,
        script: n.script,
        link: n.link ?? "",
      };
    }
    let s = (t) => Math.max(0, Math.min(4, Math.round(t ?? 0)));
    function c(t, e) {
      let n = t.map((t) => {
        let n = {
          runs: (function (t) {
            let e = [];
            for (let n of t) {
              if (!n.math && !n.text) continue;
              let t = e[e.length - 1];
              if (
                t &&
                !t.math &&
                !n.math &&
                (function (t, e) {
                  return i.every(
                    (n) => (t?.[n] ?? void 0) === (e?.[n] ?? void 0),
                  );
                })(t.marks, n.marks)
              ) {
                e[e.length - 1] = { ...t, text: t.text + n.text };
                continue;
              }
              let a = { text: n.text };
              (n.math && (a.math = !0),
                n.marks && (a.marks = n.marks),
                e.push(a));
            }
            return e;
          })(
            t.runs.map((t) => {
              let n = (function (t, e) {
                if (!t) return;
                let n = {};
                for (let a of i) {
                  let i = t[a];
                  null != i &&
                    (("highlight" !== a && "link" !== a) || i) &&
                    i !==
                      (function (t, e) {
                        switch (e) {
                          case "bold":
                            return t.bold;
                          case "italic":
                            return t.italic;
                          case "underline":
                            return t.underline;
                          case "strike":
                            return t.strike;
                          case "color":
                            return t.color;
                          case "size":
                            return t.fontSize;
                          case "font":
                            return t.font;
                          case "highlight":
                          case "link":
                            return "";
                          case "script":
                            return;
                        }
                      })(e, a) &&
                    (n[a] = i);
                }
                return Object.keys(n).length ? n : void 0;
              })(t.marks, e);
              return n
                ? { ...t, marks: n }
                : { text: t.text, ...(t.math ? { math: !0 } : {}) };
            }),
          ),
        };
        (t.align && t.align !== e.align && (n.align = t.align),
          t.list && t.list !== e.list && (n.list = t.list));
        let a = s(t.level);
        return (
          a && (n.level = a),
          t.lineHeight &&
            t.lineHeight !== e.lineHeight &&
            (n.lineHeight = t.lineHeight),
          t.spaceBefore && (n.spaceBefore = t.spaceBefore),
          t.spaceAfter && (n.spaceAfter = t.spaceAfter),
          n
        );
      });
      return n.length ? n : [{ runs: [] }];
    }
    function h(t) {
      return (function (t) {
        let e = "",
          n = 0,
          a = (t) =>
            t.math
              ? `$${t.text.replace(/\$/g, "")}$`
              : t.text
                  .replace(/\$/g, "\\$")
                  .replace(/\*{2,}/g, (t) => t.replace(/\*/g, "\\*"));
        for (; n < t.length; ) {
          let i = t[n];
          if (!i.bold || (!i.math && !i.text)) {
            ((i.math ? i.text.trim() : i.text) && (e += a(i)), n++);
            continue;
          }
          let r = [];
          for (; n < t.length && t[n].bold; ) r.push(t[n++]);
          let o = r.map(a).join(""),
            l = o.match(/^\s*/)[0],
            s = o.slice(l.length).match(/\s*$/)[0],
            c = o.slice(l.length, o.length - s.length);
          e += c ? `${l}**${c}**${s}` : o;
        }
        return e;
      })(
        t.runs.map((t) => ({
          text: t.math ? t.text : t.text.replace(/\n/g, " "),
          math: !!t.math,
          bold: t.marks?.bold === !0,
        })),
      );
    }
    function u(t, e) {
      let n,
        a = c(e, t.style),
        i = (function (t, e) {
          let n,
            a = c(t, e);
          if (
            a.some((t) => t.runs.some((t) => !t.math && t.text.includes("\n")))
          )
            return null;
          let i = a.map(h).join("\n");
          return ((n = c(r(i, e.list), e)),
          JSON.stringify(n) === JSON.stringify(a))
            ? i
            : null;
        })(a, t.style);
      return null !== i
        ? { text: i, rich: void 0 }
        : {
            text: (n = a.map(h)).every((t) => !t.trim()) ? "" : n.join("\n"),
            rich: a,
          };
    }
    function g(t) {
      return t.length && t.every((e) => e === t[0]) ? t[0] : null;
    }
    function d(t, e) {
      let n = { ...t };
      return (delete n[e], n);
    }
    let p = {
        bold: "bold",
        italic: "italic",
        underline: "underline",
        strike: "strike",
        color: "color",
        size: "fontSize",
        font: "font",
      },
      f = ["•", "◦", "▪", "•", "◦"];
    function m(t) {
      return t.runs.reduce(
        (t, e) =>
          t + (e.math ? 1 : Array.from(e.text.replace(/\s+/g, "")).length),
        0,
      );
    }
    let y = new Set(["left", "center", "right", "justify"]),
      b = new Set(["none", "bullet", "number"]),
      x = (t, e, n) =>
        "number" == typeof t && Number.isFinite(t)
          ? Math.min(n, Math.max(e, t))
          : void 0,
      k = (t, e = 2e3) => ("string" == typeof t && t.length <= e ? t : void 0);
    t.s([
      "MAX_LEVEL",
      0,
      4,
      "applyParagraphs",
      0,
      u,
      "clearWholeFormatting",
      0,
      function (t) {
        return u(
          t,
          o(t).map((t) => ({
            runs: t.runs.map((t) => ({
              ...t,
              marks: t.marks?.link ? { link: t.marks.link } : void 0,
            })),
            ...(t.list ? { list: t.list } : {}),
            ...(t.level ? { level: t.level } : {}),
          })),
        );
      },
      "effectiveMarks",
      0,
      l,
      "formatWholeText",
      0,
      function (t, e) {
        let n = { ...t.style },
          a = o(t);
        for (let [t, i] of Object.entries(e.marks ?? {})) {
          let e = p[t];
          e
            ? ((n[e] =
                i ??
                (("color" === e || "font" === e) &&
                  ("font" === e ? "body" : ""))),
              (a = a.map((e) => ({
                ...e,
                runs: e.runs.map((e) => {
                  if (!e.marks || !(t in e.marks)) return e;
                  let n = { ...e.marks };
                  return (delete n[t], { ...e, marks: n });
                }),
              }))))
            : (a = a.map((e) => ({
                ...e,
                runs: e.runs.map((e) => {
                  let n = { ...e.marks };
                  return (
                    null === i || "" === i || void 0 === i
                      ? delete n[t]
                      : (n[t] = i),
                    { ...e, marks: n }
                  );
                }),
              })));
        }
        return (
          e.align && ((n.align = e.align), (a = a.map((t) => d(t, "align")))),
          e.list && ((n.list = e.list), (a = a.map((t) => d(t, "list")))),
          e.lineHeight &&
            ((n.lineHeight = e.lineHeight),
            (a = a.map((t) => d(t, "lineHeight")))),
          e.indent &&
            (a = a.map((t) => ({ ...t, level: s((t.level ?? 0) + e.indent) }))),
          void 0 !== e.spaceBefore &&
            (a = a.map((t) => ({ ...t, spaceBefore: e.spaceBefore }))),
          void 0 !== e.spaceAfter &&
            (a = a.map((t) => ({ ...t, spaceAfter: e.spaceAfter }))),
          { style: n, ...u({ ...t, style: n }, a) }
        );
      },
      "hasRichMath",
      0,
      function (t) {
        return t.split("\n").some((t) => n(t).some((t) => t.math));
      },
      "holderHasMath",
      0,
      function (t) {
        return o(t).some((t) => t.runs.some((t) => t.math));
      },
      "listMarkers",
      0,
      function (t, e) {
        let n = [, , , , ,].fill(0);
        return t.map((t) => {
          let a = t.list ?? e.list,
            i = s(t.level);
          for (let t = i + 1; t <= 4; t++) n[t] = 0;
          if ("number" !== a) return ((n[i] = 0), "bullet" === a ? f[i] : null);
          n[i] += 1;
          let r = n[i];
          return `${
            i % 3 == 1
              ? (function (t) {
                  let e = "",
                    n = t;
                  for (; n > 0; )
                    ((n -= 1),
                      (e = String.fromCharCode(97 + (n % 26)) + e),
                      (n = Math.floor(n / 26)));
                  return e;
                })(r)
              : i % 3 == 2
                ? (function (t) {
                    let e = t,
                      n = "";
                    for (let [t, a] of [
                      [1e3, "m"],
                      [900, "cm"],
                      [500, "d"],
                      [400, "cd"],
                      [100, "c"],
                      [90, "xc"],
                      [50, "l"],
                      [40, "xl"],
                      [10, "x"],
                      [9, "ix"],
                      [5, "v"],
                      [4, "iv"],
                      [1, "i"],
                    ])
                      for (; e >= t; ) ((n += a), (e -= t));
                    return n;
                  })(r)
                : r
          }.`;
        });
      },
      "normalizeRich",
      0,
      function (t) {
        if (!Array.isArray(t) || !t.length) return;
        let e = t.slice(0, 2e3).flatMap((t) => {
          if (!t || "object" != typeof t || !Array.isArray(t.runs)) return [];
          let e = {
            runs: t.runs.slice(0, 2e3).flatMap((t) => {
              if (!t || "object" != typeof t || "string" != typeof t.text)
                return [];
              let e = { text: t.text.slice(0, 2e4) };
              !0 === t.math && (e.math = !0);
              let n = t.marks && "object" == typeof t.marks ? t.marks : void 0;
              if (n) {
                let t = {};
                for (let e of ["bold", "italic", "underline", "strike"])
                  "boolean" == typeof n[e] && (t[e] = n[e]);
                for (let e of ["color", "highlight", "font"]) {
                  let a = k(n[e], 80);
                  a && (t[e] = a);
                }
                let a = x(n.size, 4, 400);
                (a && (t.size = a),
                  ("super" === n.script || "sub" === n.script) &&
                    (t.script = n.script));
                let i = k(n.link);
                (i && /^(https?:|mailto:|#slide=)/i.test(i) && (t.link = i),
                  Object.keys(t).length && (e.marks = t));
              }
              return [e];
            }),
          };
          (y.has(t.align) && (e.align = t.align),
            b.has(t.list) && (e.list = t.list));
          let n = x(t.level, 0, 4);
          n && (e.level = Math.round(n));
          let a = x(t.lineHeight, 0.5, 4);
          a && (e.lineHeight = a);
          let i = x(t.spaceBefore, 0, 400);
          i && (e.spaceBefore = i);
          let r = x(t.spaceAfter, 0, 400);
          return (r && (e.spaceAfter = r), [e]);
        });
        return e.length ? e : void 0;
      },
      "paragraphCharCount",
      0,
      m,
      "paragraphHasText",
      0,
      function (t) {
        return t.runs.some((t) => (t.math, t.text.trim()));
      },
      "paragraphsOf",
      0,
      o,
      "parseLegacyText",
      0,
      r,
      "parseRichLine",
      0,
      n,
      "plainTextOf",
      0,
      function (t) {
        return o(t)
          .map((t) => t.runs.map((t) => (t.math, t.text)).join(""))
          .join("\n");
      },
      "summarizeText",
      0,
      function (t) {
        let e = t.style,
          n = o(t),
          a = n.flatMap((t) => t.runs),
          i = (a.length ? a : [void 0]).map((t) => l(t, e));
        return {
          bold: i.every((t) => t.bold),
          italic: i.every((t) => t.italic),
          underline: i.every((t) => t.underline),
          strike: i.every((t) => t.strike),
          color: g(i.map((t) => t.color)),
          highlight: g(i.map((t) => t.highlight)),
          size: g(i.map((t) => t.size)),
          font: g(i.map((t) => t.font)),
          script: g(i.map((t) => t.script ?? null)),
          link: g(i.map((t) => t.link)),
          align: g(n.map((t) => t.align ?? e.align)),
          list: g(n.map((t) => t.list ?? e.list)),
          lineHeight: g(n.map((t) => t.lineHeight ?? e.lineHeight)),
        };
      },
      "textCharCount",
      0,
      function (t) {
        return o(t).reduce((t, e) => t + m(e), 0);
      },
    ]);
