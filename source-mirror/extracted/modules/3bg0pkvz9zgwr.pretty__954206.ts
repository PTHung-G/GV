// Reconstructed from 3bg0pkvz9zgwr.pretty.js, module 954206.
// deps: none
// exports: none


"use strict";
    let e = {
        geometry: "geometryDiagram",
        diagram: "vectorDiagram",
        graph: "functionGraph",
        chart: "statChart",
      },
      n = Object.values(e),
      a = {
        paragraph: ["text", "math", "hardBreak"],
        heading: ["text", "math", "hardBreak"],
        table: ["tableRow"],
        tableRow: ["tableCell", "tableHeader"],
        tableCell: [
          "paragraph",
          "geometryDiagram",
          "vectorDiagram",
          "functionGraph",
          "statChart",
          "examImage",
        ],
        tableHeader: [
          "paragraph",
          "geometryDiagram",
          "vectorDiagram",
          "functionGraph",
          "statChart",
          "examImage",
        ],
        examHeader: ["headerColumn"],
        headerColumn: ["paragraph"],
        grid: ["gridCell"],
        gridCell: [
          "paragraph",
          "geometryDiagram",
          "vectorDiagram",
          "functionGraph",
          "statChart",
          "examImage",
        ],
        bulletList: ["listItem"],
        orderedList: ["listItem"],
        listItem: ["paragraph", "bulletList", "orderedList"],
        docColumns: [
          "paragraph",
          "heading",
          "table",
          "grid",
          "examImage",
          "bulletList",
          "orderedList",
          "horizontalRule",
          "variationTable",
          "functionGraph",
          "geometryDiagram",
          "vectorDiagram",
          "statChart",
        ],
        text: [],
        math: [],
        hardBreak: [],
        horizontalRule: [],
        examImage: [],
        variationTable: [],
        functionGraph: [],
        geometryDiagram: [],
        vectorDiagram: [],
        statChart: [],
      },
      i = new Set([
        "paragraph",
        "heading",
        "horizontalRule",
        "table",
        "examHeader",
        "grid",
        "bulletList",
        "orderedList",
        "docColumns",
      ]);
    function r(t) {
      return "horizontalRule" === t.type
        ? ["indentLeft", "indentRight"].some((e) => Number(t.attrs?.[e]) > 0)
        : !!["bulletList", "orderedList"].includes(t.type) ||
            (["paragraph", "heading"].includes(t.type)
              ? [
                  "paragraphStyle",
                  "paragraphBackground",
                  "paragraphBorderColor",
                  "paragraphBorderWidth",
                ].some((e) => t.attrs?.[e] != null)
              : "table" === t.type
                ? (t.content ?? []).some((e) =>
                    (e.content ?? []).some(
                      (a) =>
                        a.type !==
                          (0 === (t.content ?? []).indexOf(e)
                            ? "tableHeader"
                            : "tableCell") ||
                        (Number(a.attrs?.colspan ?? 1) > 1 &&
                          Number(a.attrs?.rowspan ?? 1) > 1) ||
                        (a.content ?? []).length > 1 ||
                        Object.entries(a.attrs ?? {}).some(
                          ([t, e]) =>
                            !["colspan", "rowspan", "colwidth"].includes(t) &&
                            null != e,
                        ) ||
                        (a.content ?? []).some(
                          (t) =>
                            !n.includes(t.type) &&
                            Object.entries(t.attrs ?? {}).some(
                              ([t, e]) => "textAlign" !== t && null != e,
                            ),
                        ),
                    ),
                  )
                : !!["grid", "examHeader"].includes(t.type) &&
                  (t.content ?? []).some((e) =>
                    (e.content ?? []).some(
                      (n) =>
                        Object.entries(n.attrs ?? {}).some(
                          ([t, e]) => "textAlign" !== t && null != e,
                        ) ||
                        (n.attrs?.textAlign != null &&
                          n.attrs.textAlign !==
                            ("grid" === t.type ? "left" : "center")) ||
                        ((e.content ?? []).length > 1 && "grid" === t.type),
                    ),
                  ));
    }
    let o = {
      u: "underline",
      sup: "superscript",
      sub: "subscript",
      s: "strike",
    };
    function l(t) {
      let [e, n] = t.split(":");
      if (!n) return { type: e };
      let a = decodeURIComponent(n);
      if ("boxed" === e) {
        let [t, a, i, r] = n.split(",").map(Number);
        return {
          type: e,
          attrs: {
            paddingTop: t,
            paddingRight: a,
            paddingBottom: i,
            paddingLeft: r,
          },
        };
      }
      return {
        type: e,
        attrs:
          "fontSize" === e
            ? { size: Number(n) }
            : "fontFamily" === e
              ? { family: a }
              : "link" === e
                ? { href: a }
                : { color: a },
      };
    }
    function s(t) {
      if (
        "boxed" === t.type &&
        ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"].some(
          (e) => t.attrs?.[e] != null,
        )
      )
        return (
          "boxed:" +
          ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]
            .map((e, n) => t.attrs?.[e] ?? (n % 2 ? 8 : 3))
            .join(",")
        );
      let e = t.attrs?.size;
      if ("fontSize" === t.type && e) return `fontSize:${e}`;
      let n =
        "fontFamily" === t.type
          ? t.attrs?.family
          : "link" === t.type
            ? t.attrs?.href
            : t.attrs?.color;
      return n ? `${t.type}:${encodeURIComponent(String(n))}` : t.type;
    }
    function c(t, e) {
      return {
        type: "math",
        attrs: { latex: encodeURIComponent(t.trim()), display: e },
      };
    }
    function h(t, e, n) {
      let a = n ? "$$" : "$";
      for (let i = e; i < t.length; i++) {
        if ("\\" === t[i]) {
          i++;
          continue;
        }
        if (t.startsWith(a, i)) {
          if (!n && "$" === t[i + 1]) return -1;
          return i > e ? i : -1;
        }
      }
      return -1;
    }
    function u(t) {
      let e = t.includes("\\*\\*")
          ? t.replace(
              /\*\*([^*\n]*?)\s\*\*(\$[^$\n]+\$)\\\*\\\*([^*\n]*?)\\\*\\\*/g,
              "**$1 $2$3**",
            )
          : t,
        n = [],
        a = [],
        i = "",
        r = () => {
          if (i) {
            
            let r = n[n.length - 1],
              o = [...a];
            if (
              r?.type === "text" &&
              ((t = r.marks),
              (e = o),
              (t ?? []).map(s).sort().join(",") === [...e].sort().join(","))
            )
              r.text += i;
            else {
              
              n.push(
                ((t = { type: "text", text: i }),
                o.length > 0 &&
                  (t.marks = [...o]
                    .sort(
                      (t, e) =>
                        H.indexOf(t.split(":")[0]) - H.indexOf(e.split(":")[0]),
                    )
                    .map(l)),
                t),
              );
            }
            i = "";
          }
        },
        u = (t, e) => {
          r();
          let n = a.indexOf(t);
          (e && n < 0 && a.push(t), !e && n >= 0 && a.splice(n, 1));
        },
        g = 0;
      for (; g < e.length; ) {
        let t = e[g];
        if (
          "\\" === t &&
          g + 1 < e.length &&
          "\\$*|[]_#`~<>!:".includes(e[g + 1])
        ) {
          ((i += e[g + 1]), (g += 2));
          continue;
        }
        if ("$" === t) {
          let t = e.startsWith("$$", g),
            a = t ? 2 : 1,
            o = h(e, g + a, t);
          if (o >= 0) {
            (r(), n.push(c(e.slice(g + a, o), t)), (g = o + a));
            continue;
          }
          ((i += t ? "$$" : "$"), (g += a));
          continue;
        }
        if ("<" === t) {
          let t = /^<(color|highlight|font|link)=([^>]+)>/i.exec(e.slice(g));
          if (t) {
            let e = {
                color: "textColor",
                highlight: "textHighlight",
                font: "fontFamily",
                link: "link",
              }[t[1].toLowerCase()],
              n = !1;
            try {
              let a = decodeURIComponent(t[2]);
              n =
                "textColor" === e || "textHighlight" === e
                  ? /^#[0-9a-f]{6}$/i.test(a)
                  : "link" === e
                    ? /^(https?:|mailto:)/i.test(a)
                    : [
                        "Times New Roman",
                        "Arial",
                        "Calibri",
                        "Cambria",
                        "Georgia",
                        "Verdana",
                        "Courier New",
                      ].includes(a);
            } catch {}
            if (n) {
              for (let t of a.filter((t) => t.startsWith(e + ":"))) u(t, !1);
              (u(`${e}:${t[2]}`, !0), (g += t[0].length));
              continue;
            }
          }
          let i = /^<\/(color|highlight|font|link)>/i.exec(e.slice(g));
          if (i) {
            let t = {
              color: "textColor",
              highlight: "textHighlight",
              font: "fontFamily",
              link: "link",
            }[i[1].toLowerCase()];
            for (let e of a.filter((e) => e.startsWith(t + ":"))) u(e, !1);
            g += i[0].length;
            continue;
          }
          let l =
            /^<box=(\d+(?:\.\d+)?),(\d+(?:\.\d+)?),(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)>/i.exec(
              e.slice(g),
            );
          if (l && l.slice(1).every((t) => 96 >= Number(t))) {
            for (let t of a.filter(
              (t) => "boxed" === t || t.startsWith("boxed:"),
            ))
              u(t, !1);
            (u(`boxed:${l.slice(1).join(",")}`, !0), (g += l[0].length));
            continue;
          }
          if (
            e.startsWith("</box>", g) &&
            a.some((t) => "boxed" === t || t.startsWith("boxed:"))
          ) {
            for (let t of a.filter(
              (t) => "boxed" === t || t.startsWith("boxed:"),
            ))
              u(t, !1);
            g += 6;
            continue;
          }
          let s = /^<size=(\d+(?:\.\d+)?)>/i.exec(e.slice(g));
          if (s) {
            for (let t of a.filter((t) => t.startsWith("fontSize:"))) u(t, !1);
            (u(`fontSize:${s[1]}`, !0), (g += s[0].length));
            continue;
          }
          if (e.startsWith("</size>", g)) {
            for (let t of a.filter((t) => t.startsWith("fontSize:"))) u(t, !1);
            g += 7;
            continue;
          }
          let c = /^<(\/?)(u|sup|sub|s|br)\s*\/?>/i.exec(e.slice(g));
          if (c) {
            let t = c[2].toLowerCase();
            ("br" === t
              ? (r(), n.push({ type: "hardBreak" }))
              : u(o[t], "/" !== c[1]),
              (g += c[0].length));
            continue;
          }
        }
        if (
          e.startsWith("[[", g) &&
          !a.some((t) => "boxed" === t || t.startsWith("boxed:")) &&
          e.indexOf("]]", g + 2) > g + 2
        ) {
          let t = e
            .slice(g + 2, e.indexOf("]]", g + 2))
            .replace(/^(?:\*+|<[^>]+>)+/, "");
          (u(/^Mã (?:số )?đề/i.test(t) ? "boxed:3,24,3,24" : "boxed", !0),
            (g += 2));
          continue;
        }
        if (
          e.startsWith("]]", g) &&
          a.some((t) => "boxed" === t || t.startsWith("boxed:"))
        ) {
          for (let t of a.filter(
            (t) => "boxed" === t || t.startsWith("boxed:"),
          ))
            u(t, !1);
          g += 2;
          continue;
        }
        if (e.startsWith("~~", g)) {
          if (a.includes("strike")) {
            (u("strike", !1), (g += 2));
            continue;
          }
          if (e.indexOf("~~", g + 2) > g + 2) {
            (u("strike", !0), (g += 2));
            continue;
          }
        }
        if (e.startsWith("**", g)) {
          if (a.includes("bold")) {
            (u("bold", !1), (g += 2));
            continue;
          }
          let t = e.indexOf("**", g + 2);
          if (
            ((e[g + 2] && !/\s/.test(e[g + 2])) ||
              (g > 0 && !/\s/.test(e[g - 1]))) &&
            t > g + 2 &&
            e.slice(g + 2, t).trim()
          ) {
            (u("bold", !0), (g += 2));
            continue;
          }
        }
        if ("*" === t) {
          if (a.includes("italic")) {
            (u("italic", !1), (g += 1));
            continue;
          }
          let t = e[g + 1];
          if (
            t &&
            " " !== t &&
            "*" !== t &&
            (function (t, e) {
              for (let n = e; n < t.length; n++) {
                if ("\\" === t[n]) {
                  n++;
                  continue;
                }
                if ("$" === t[n]) {
                  let e = t.startsWith("$$", n),
                    a = h(t, n + (e ? 2 : 1), e);
                  if (a >= 0) {
                    n = a + +!!e;
                    continue;
                  }
                }
                if ("*" === t[n]) {
                  if ("*" === t[n + 1]) {
                    n++;
                    continue;
                  }
                  return !0;
                }
              }
              return !1;
            })(e, g + 1)
          ) {
            (u("italic", !0), (g += 1));
            continue;
          }
        }
        ((i += t), (g += 1));
      }
      return (r(), n);
    }
    let g = /^(#{1,6})\s+(.*)$/,
      d = /^```\s*([\w-]*)\s*$/,
      p = /^:::\s*([\w-]+)\s*(.*)$/,
      f = String.raw`((?:[^\]\n]|\]+[^\](\n])*\]*)`,
      m = String.raw`!\[${f}\]\(\s*([^)\s]*)\s*\)\s*(\{[^}]*\})?`,
      y = new RegExp(String.raw`^${m}\s*$`),
      b = /^\s*\|.*\|\s*$/,
      x = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/,
      k = /^\s*\{\s*widths\s*=\s*([\d.,\s]+)\}\s*$/,
      v = /^(-{3,}|\*{3,}|_{3,})$/,
      M = /^\\newpage\s*$/,
      w = new Set(["left", "center", "right", "justify"]),
      $ = {
        first: "indentFirst",
        left: "indentLeft",
        right: "indentRight",
        line: "lineHeight",
        before: "spaceBefore",
        after: "spaceAfter",
      };
    function C(t, e = null) {
      let n = { type: "paragraph", attrs: { textAlign: e } };
      return (t.length > 0 && (n.content = t), n);
    }
    function S(t, e = null) {
      let n = [];
      t.forEach((t, e) => {
        
        (e > 0 && n.push({ type: "hardBreak" }),
          n.push(...u(((a = t), /^\\[#|:!`$-]/.test(a) ? a.slice(1) : a))));
      });
      let a = 1 === n.length && "math" === n[0].type && n[0].attrs?.display;
      return C(n, e ?? (a ? "center" : null));
    }
    function j(t) {
      let e = {};
      if (!t) return e;
      for (let n of t
        .replace(/^\{|\}$/g, "")
        .matchAll(/([\w-]+)\s*=\s*("([^"]*)"|[^\s]+)/g))
        e[n[1]] = n[3] ?? n[2];
      return e;
    }
    function A(t) {
      let e = t.trim();
      (e.startsWith("|") && (e = e.slice(1)),
        e.endsWith("|") && !e.endsWith("\\|") && (e = e.slice(0, -1)));
      let n = [],
        a = "",
        i = !1,
        r = !1;
      for (let t = 0; t < e.length; t++) {
        ((e.startsWith("<geometry>", t) ||
          e.startsWith("<diagram>", t) ||
          e.startsWith("<graph>", t)) &&
          (r = !0),
          (e.startsWith("</geometry>", t) ||
            e.startsWith("</diagram>", t) ||
            e.startsWith("</graph>", t)) &&
            (r = !1));
        let o = e[t];
        if ("\\" === o && "|" === e[t + 1]) {
          ((a += "|"), t++);
          continue;
        }
        if (("$" !== o || r || (i = !i), "|" === o && !i && !r)) {
          (n.push(a.trim()), (a = ""));
          continue;
        }
        a += o;
      }
      return (n.push(a.trim()), n);
    }
    function T(t) {
      let e = t.trim(),
        n = e.startsWith(":"),
        a = e.endsWith(":");
      return n && a ? "center" : a ? "right" : n ? "left" : null;
    }
    let L = RegExp(
      String.raw`<(geometry|diagram|graph|chart)>([\s\S]*?)<\/\1>|${m}`,
      "g",
    );
    function O(t, n) {
      let a = [],
        i = 0,
        r = (t) => {
          let e = t
            .replace(/^(?:\s*<br\s*\/?>)+|(?:<br\s*\/?>\s*)+$/gi, "")
            .trim();
          e && a.push(S(e.split(/<br\s*\/?>/i), n));
        };
      for (let n of t.matchAll(L)) {
        if ((r(t.slice(i, n.index)), n[1]))
          a.push({ type: e[n[1]], attrs: { data: n[2].trim() } });
        else {
          let t = Number.parseFloat(j(n[5]).width ?? "");
          a.push({
            type: "examImage",
            attrs: {
              src: n[4] || "",
              alt: n[3] || "",
              width: Number.isFinite(t) ? t : 220,
              align: "center",
            },
          });
        }
        i = n.index + n[0].length;
      }
      return (r(t.slice(i)), a.length ? a : [C([], n)]);
    }
    function I(t) {
      let e = [],
        n = !1,
        a = !1;
      for (let i of t.replace(/\r\n?/g, "\n").split("\n")) {
        /^```/.test(i.trim()) && (n = !n);
        let t = !n && "" === i.trim();
        (t && a) || ((a = t), e.push(i));
      }
      return e.join("\n");
    }
    function N(t, e = {}) {
      let n = (function t(e) {
        let n = [],
          r = 0,
          o = 0,
          l = (t) => {
            if (n.length > 0) for (let t = 1; t < o; t++) n.push(C([]));
            ((o = 0), n.push(t));
          };
        for (; r < e.length; ) {
          let s = e[r],
            h = s.trim();
          if ("" === h) {
            (o++, r++);
            continue;
          }
          if (M.test(h)) {
            (l({ type: "pageBreak" }), r++);
            continue;
          }
          if (v.test(h)) {
            (l({ type: "horizontalRule" }), r++);
            continue;
          }
          let f = g.exec(h);
          if (f) {
            let t = {
                type: "heading",
                attrs: { level: f[1].length, textAlign: null },
              },
              e = u(f[2]);
            (e.length > 0 && (t.content = e), l(t), r++);
            continue;
          }
          let m = d.exec(h);
          if (m) {
            let t = [];
            for (r++; r < e.length && !/^```\s*$/.test(e[r].trim()); )
              t.push(e[r++]);
            r++;
            let n = m[1].toLowerCase();
            if (
              "variation" === n ||
              "graph" === n ||
              "geometry" === n ||
              "diagram" === n ||
              "chart" === n
            )
              l({
                type:
                  "variation" === n
                    ? "variationTable"
                    : "geometry" === n
                      ? "geometryDiagram"
                      : "diagram" === n
                        ? "vectorDiagram"
                        : "chart" === n
                          ? "statChart"
                          : "functionGraph",
                attrs: { data: t.join("\n").trim() },
              });
            else if ("rich-block" === n)
              try {
                let e = JSON.parse(t.join("\n"));
                !(function (t) {
                  let e = 0,
                    n = (t, i) =>
                      !(!t || "object" != typeof t || i > 32 || ++e > 1e4) &&
                      !(
                        !Object.hasOwn(a, t.type) ||
                        ("text" === t.type &&
                          ("string" != typeof t.text || !t.text)) ||
                        (null != t.attrs &&
                          ("object" != typeof t.attrs ||
                            Array.isArray(t.attrs))) ||
                        ("heading" === t.type &&
                          ![1, 2, 3, 4, 5, 6].includes(
                            Number(t.attrs?.level),
                          )) ||
                        ("paragraph" === t.type &&
                          t.attrs?.paragraphStyle != null &&
                          !["title", "subtitle"].includes(
                            String(t.attrs.paragraphStyle),
                          )) ||
                        ("examHeader" === t.type && t.content?.length !== 2) ||
                        (!1 ===
                          [
                            "paragraph",
                            "heading",
                            "text",
                            "math",
                            "hardBreak",
                            "horizontalRule",
                            "examImage",
                            "variationTable",
                            "functionGraph",
                            "geometryDiagram",
                            "vectorDiagram",
                            "statChart",
                          ].includes(t.type) &&
                          !t.content?.length) ||
                        ("listItem" === t.type &&
                          t.content?.[0]?.type !== "paragraph") ||
                        (t.marks &&
                          (!Array.isArray(t.marks) ||
                            t.marks.some(
                              (t) =>
                                !t ||
                                ![
                                  "bold",
                                  "italic",
                                  "underline",
                                  "strike",
                                  "boxed",
                                  "fontSize",
                                  "superscript",
                                  "subscript",
                                  "textColor",
                                  "textHighlight",
                                  "fontFamily",
                                  "link",
                                ].includes(t.type),
                            )))
                      ) &&
                      (null == t.content ||
                        (Array.isArray(t.content) &&
                          t.content.every(
                            (e) => a[t.type].includes(e.type) && n(e, i + 1),
                          )));
                  return !!t && i.has(t.type) && n(t, 0);
                })(e)
                  ? l(C([{ type: "text", text: t.join("\n") }], "left"))
                  : l(e);
              } catch {
                l(C([{ type: "text", text: t.join("\n") }], "left"));
              }
            else if (t.length > 0) {
              let e = [];
              (t.forEach((t, n) => {
                (n > 0 && e.push({ type: "hardBreak" }),
                  t && e.push({ type: "text", text: t }));
              }),
                l(C(e, "left")));
            }
            continue;
          }
          if (h.length > 4 && h.startsWith("$$") && h.endsWith("$$")) {
            (l(C([c(h.slice(2, -2), !0)], "center")), r++);
            continue;
          }
          if (h.startsWith("$$") && 0 > h.indexOf("$$", 2)) {
            let t = [h.slice(2)];
            for (r++; r < e.length && !e[r].includes("$$"); ) t.push(e[r++]);
            (r < e.length && t.push(e[r].slice(0, e[r].indexOf("$$"))),
              r++,
              l(C([c(t.join("\n"), !0)], "center")));
            continue;
          }
          let L = p.exec(h);
          if (L) {
            let { inner: a, end: i } = (function (t, e) {
              let n = 1,
                a = !1,
                i = [],
                r = e + 1;
              for (; r < t.length; r++) {
                let e = t[r].trim();
                if ((d.test(e) && (a = !a), !a))
                  if (":::" === e) {
                    if (0 == --n) break;
                  } else p.test(e) && n++;
                i.push(t[r]);
              }
              return { inner: i, end: r };
            })(e, r);
            r = i + 1;
            let o = L[1].toLowerCase();
            if ("columns" === o) {
              let e = j(L[2]),
                n = t(a);
              l({
                type: "docColumns",
                attrs: {
                  columns: Math.min(3, Math.max(1, parseInt(L[2], 10) || 2)),
                  gap: Math.min(96, Math.max(0, Number(e.gap ?? 24))),
                  separator: "true" === e.separator,
                },
                content: n.length ? n : [C([])],
              });
            } else if ("header" === o) {
              let t = a.findIndex((t) => "|||" === t.trim()),
                e = t >= 0 ? a.slice(0, t) : a,
                n = t >= 0 ? a.slice(t + 1) : [],
                i = (t) => {
                  let e = t
                    .filter(
                      (t) =>
                        t.trim() &&
                        !/^:::(?:\s+(?:center|left|right|justify|para)(?:\s+.*)?)?$/.test(
                          t.trim(),
                        ),
                    )
                    .map((t) => S([t.trim()], "center"));
                  return {
                    type: "headerColumn",
                    content: e.length > 0 ? e : [C([], "center")],
                  };
                };
              l({ type: "examHeader", content: [i(e), i(n)] });
            } else if ("grid" === o || "choices" === o) {
              let t = Math.min(4, Math.max(1, Number.parseInt(L[2], 10) || 2)),
                e = a
                  .filter((t) => t.trim())
                  .map((t) => ({
                    type: "gridCell",
                    content: O(t.trim(), "left"),
                  })),
                n = a.filter((t) => t.trim());
              2 === t &&
              2 === n.length &&
              /^Họ(?: và tên| tên|, tên)/i.test(n[0]) &&
              /^Số báo danh:/i.test(n[1])
                ? l(S([n.join(" ")], "left"))
                : e.length > 0 &&
                  l({
                    type: "grid",
                    attrs:
                      "choices" === o
                        ? { columns: 1, autoColumns: !0 }
                        : {
                            columns: t,
                            ...("true" === j(L[2]).fixed
                              ? { autoColumns: !1 }
                              : {}),
                          },
                    content: e,
                  });
            } else
              w.has(o) || "para" === o
                ? (function (t, e, n = {}) {
                    return t.map((t) => {
                      if ("paragraph" === t.type || "heading" === t.type) {
                        let a = { ...t.attrs };
                        for (let [t, i] of (e &&
                          !a.textAlign &&
                          (a.textAlign = e),
                        Object.entries(n)))
                          null == a[t] && (a[t] = i);
                        return { ...t, attrs: a };
                      }
                      return e &&
                        "examImage" === t.type &&
                        t.attrs?.align === "center" &&
                        "justify" !== e
                        ? { ...t, attrs: { ...t.attrs, align: e } }
                        : t;
                    });
                  })(
                    t(a),
                    "para" === o ? null : o,
                    (function (t) {
                      let e = {},
                        n = j(t);
                      for (let [t, a] of Object.entries($)) {
                        let i = Number.parseFloat(n[t] ?? "");
                        Number.isFinite(i) &&
                          (i >= 0 || "first" === t) &&
                          (e[a] = i);
                      }
                      return e;
                    })(L[2]),
                  ).forEach((t, e) => {
                    0 === e ? l(t) : n.push(t);
                  })
                : t(a).forEach((t, e) => {
                    0 === e ? l(t) : n.push(t);
                  });
            continue;
          }
          let I = y.exec(h);
          if (I) {
            let t = j(I[3]),
              e = Number.parseFloat(t.width ?? ""),
              n =
                t.align && ["left", "center", "right"].includes(t.align)
                  ? t.align
                  : "center";
            (l({
              type: "examImage",
              attrs: {
                src: I[2] || "",
                alt: I[1] || "",
                width: Number.isFinite(e) ? e : 220,
                align: n,
              },
            }),
              r++);
            continue;
          }
          if (b.test(h) && r + 1 < e.length && x.test(e[r + 1].trim())) {
            let t,
              n = [e[r], e[r + 1]];
            for (r += 2; r < e.length && b.test(e[r].trim()); ) n.push(e[r++]);
            for (let n = r; ; n++) {
              for (; n < e.length && "" === e[n].trim(); ) n++;
              if (n >= e.length || !k.test(e[n])) break;
              ((t ??= e[n]), (r = n + 1));
            }
            l(
              (function (t, e) {
                let n = A(t[0]),
                  a = A(t[1]).map(T),
                  i = t.slice(2).map(A),
                  r = Math.max(n.length, ...i.map((t) => t.length)),
                  o = [n, ...i].map((t) =>
                    Array.from({ length: r }, (e, n) => t[n] ?? ""),
                  ),
                  l = Array.from({ length: r }, () => null),
                  s = o.map((t, e) => {
                    let n = [],
                      i = null;
                    return (
                      t.forEach((t, r) => {
                        let o = l[r];
                        if ("^" === t && e > 0 && o) {
                          ((o.attrs.rowspan = o.attrs.rowspan + 1), (i = null));
                          return;
                        }
                        if ("<" === t && i && 1 === i.attrs.rowspan) {
                          ((i.attrs.colspan = i.attrs.colspan + 1),
                            (l[r] = null));
                          return;
                        }
                        let s = {
                          type: 0 === e ? "tableHeader" : "tableCell",
                          attrs: { colspan: 1, rowspan: 1, colwidth: null },
                          content: O(t, a[r] ?? null),
                        };
                        ((l[r] = s), (i = s), n.push(s));
                      }),
                      { type: "tableRow", content: n }
                    );
                  }),
                  c = e
                    ? (k.exec(e)?.[1] ?? "")
                        .split(",")
                        .map((t) => Number.parseFloat(t))
                        .filter((t) => Number.isFinite(t) && t > 0)
                    : [];
                return {
                  type: "table",
                  attrs: { widths: c.length === r ? c : null },
                  content: s,
                };
              })(n, t),
            );
            continue;
          }
          let N = [s.trimEnd()];
          for (
            r++;
            r < e.length &&
            "" !== e[r].trim() &&
            !(function (t, e) {
              let n = t.trim();
              return (
                g.test(n) ||
                d.test(n) ||
                p.test(n) ||
                ":::" === n ||
                y.test(n) ||
                M.test(n) ||
                v.test(n) ||
                n.startsWith("$$") ||
                (b.test(n) && void 0 !== e && x.test(e.trim()))
              );
            })(e[r], e[r + 1]);

          )
            (N.push(e[r].trimEnd()), r++);
          let B =
            1 === N.length
              ? /^(Họ(?: và tên| tên|, tên) (?:thí sinh|học sinh):\s*.*?)\s+(Số báo danh:.*)$/i.exec(
                  N[0],
                )
              : null;
          B && /[.…]{3}/.test(B[1])
            ? l(
                S(
                  [
                    B.slice(1)
                      .map((t) => t.trim())
                      .join(" "),
                  ],
                  "left",
                ),
              )
            : l(S(N));
        }
        return n;
      })((e.collapseBlank ? I(t) : t).replace(/\r\n?/g, "\n").split("\n"));
      return { type: "doc", content: n.length > 0 ? n : [C([])] };
    }
    let B = {
        textColor: ["<color>", "</color>"],
        textHighlight: ["<highlight>", "</highlight>"],
        fontFamily: ["<font>", "</font>"],
        link: ["<link>", "</link>"],
        boxed: ["[[", "]]"],
        fontSize: ["<size>", "</size>"],
        bold: ["**", "**"],
        italic: ["*", "*"],
        underline: ["<u>", "</u>"],
        strike: ["~~", "~~"],
        superscript: ["<sup>", "</sup>"],
        subscript: ["<sub>", "</sub>"],
      },
      H = Object.keys(B);
    function E(t) {
      let [e, n] = t.split(":"),
        [a, i] = B[e];
      return "boxed" === e && n
        ? [`<box=${n}>`, "</box>"]
        : [n ? a.replace(/<([^>]+)>/, `<$1=${n}>`) : a, i];
    }
    let R = new Set(["bold", "italic", "strike"]);
    function z(t, e = "\n", n = !1) {
      
      let i,
        r,
        o,
        l,
        c = "",
        h = [],
        u = (t) => {
          for (; h.length > 0 && !t.includes(h[h.length - 1]); )
            c += E(h.pop())[1];
          let e = h.findIndex((e) => !t.includes(e));
          if (e >= 0) for (; h.length > e; ) c += E(h.pop())[1];
        };
      for (let g of ((a = t ?? []),
      (i = (t, e) => {
        for (let n = t + e; n >= 0 && n < a.length; n += e)
          if ("math" !== a[n].type) return "text" === a[n].type ? a[n] : void 0;
      }),
      (r = (t, ...e) =>
        (t.marks ?? []).filter(
          (t) =>
            !R.has(t.type) ||
            e.every((e) => e?.marks?.some((e) => e.type === t.type)),
        )),
      (o = (t, e) =>
        e?.length
          ? { type: "text", text: t, marks: e }
          : { type: "text", text: t }),
      (l = []),
      a.forEach((t, e) => {
        if (
          "text" !== t.type ||
          !t.text ||
          !t.marks?.some((t) => R.has(t.type))
        )
          return void l.push(t);
        let [, n, a, s] = /^(\s*)([\s\S]*?)(\s*)$/.exec(t.text),
          c = i(e, -1),
          h = i(e, 1);
        a
          ? (n && l.push(o(n, r(t, c))),
            l.push(o(a, t.marks)),
            s && l.push(o(s, r(t, h))))
          : l.push(o(t.text, r(t, c, h)));
      }),
      l)) {
        if ("hardBreak" === g.type) {
          (u([]), (c += e));
          continue;
        }
        if ("math" === g.type) {
          let t = decodeURIComponent(String(g.attrs?.latex ?? ""));
          c += g.attrs?.display ? `$$${t}$$` : `$${t}$`;
          continue;
        }
        if ("text" !== g.type || !g.text) continue;
        let t = (g.marks ?? [])
          .filter((t) => t.type in B)
          .map(s)
          .sort(
            (t, e) => H.indexOf(t.split(":")[0]) - H.indexOf(e.split(":")[0]),
          );
        for (let e of (u(t), t))
          h.includes(e) || ((c += E(e)[0]), (h = [...h, e]));
        c += (function (t, e) {
          let n = t
            .replace(/\\/g, "\\\\")
            .replace(/\$/g, "\\$")
            .replace(/\*/g, "\\*")
            .replace(/~~/g, "\\~\\~");
          return (
            (n = n
              .replace(/\[\[/g, "\\[\\[")
              .replace(
                /<(\/?(u|sup|sub|s|br|size|color|highlight|font|link|box)\b)/gi,
                "\\<$1",
              )),
            e && (n = n.replace(/\|/g, "\\|")),
            n
          );
        })(g.text, n);
      }
      return (u([]), c);
    }
    function _(t) {
      return /^(#{1,6}\s|\||:::|!\[|```|\\newpage|-{3,}$|\*{3,}$|_{3,}$)/.test(
        t,
      )
        ? "\\" + t
        : t;
    }
    function W(t) {
      return t.replace(/\n/g, " ").replace(/\]\(/g, "] (");
    }
    function P(t) {
      let n = String(t.attrs?.data ?? "{}");
      try {
        n = JSON.stringify(JSON.parse(n));
      } catch {
        n = n.replace(/\r?\n/g, " ");
      }
      let a = Object.keys(e).find((n) => e[n] === t.type) ?? "geometry";
      return (
        `<${a}>` +
        n.replace(/</g, "\\u003c").replace(/\|/g, "\\u007c") +
        `</${a}>`
      );
    }
    function D(t) {
      let e = Array.isArray(t) ? t : (t.content ?? []),
        a = "",
        i = 0,
        o = null,
        l = (t) => {
          (a && (a += "\n\n" + "\n".repeat(i)), (a += t), (i = 0));
        },
        s = () => {
          o &&
            (l(`${o.head}
${o.parts.join("\n\n")}
:::`),
            (o = null));
        };
      for (let t of e) {
        if ("paragraph" === t.type && (!t.content || 0 === t.content.length)) {
          o ? o.parts.push("") : a && i++;
          continue;
        }
        let e = r(t)
            ? null
            : (function (t) {
                let e = t.attrs?.textAlign;
                if ("heading" === t.type)
                  return e && null !== e && "justify" !== e ? e : null;
                if ("paragraph" !== t.type || !e || "justify" === e)
                  return null;
                let n = t.content ?? [];
                return "center" === e &&
                  1 === n.length &&
                  "math" === n[0].type &&
                  n[0].attrs?.display
                  ? null
                  : e;
              })(t),
          c = r(t)
            ? {}
            : (function (t) {
                let e = {};
                if ("paragraph" !== t.type && "heading" !== t.type) return e;
                for (let [n, a] of Object.entries($)) {
                  let i = Number(t.attrs?.[a]);
                  t.attrs?.[a] != null &&
                    Number.isFinite(i) &&
                    (i >= 0 || "first" === n) &&
                    (e[n] = Math.round(100 * i) / 100);
                }
                return e;
              })(t),
          h = (function t(e) {
            if (r(e)) return "```rich-block\n" + JSON.stringify(e) + "\n```";
            switch (e.type) {
              case "paragraph":
                return z(e.content).split("\n").map(_).join("\n");
              case "heading": {
                let t = Math.min(6, Math.max(1, Number(e.attrs?.level ?? 2)));
                return "#".repeat(t) + " " + z(e.content, " ");
              }
              case "pageBreak":
                return "\\newpage";
              case "horizontalRule":
                return "---";
              case "examHeader": {
                let [t, n] = e.content ?? [],
                  a = (t) =>
                    (t?.content ?? [])
                      .map((t) => z(t.content, " "))
                      .filter((t) => t.trim());
                return ["::: header", ...a(t), "|||", ...a(n), ":::"].join(
                  "\n",
                );
              }
              case "docColumns":
                return [
                  `::: columns ${e.attrs?.columns ?? 2} gap=${e.attrs?.gap ?? 24} separator=${!!e.attrs?.separator}`,
                  D(e.content ?? []),
                  ":::",
                ].join("\n");
              case "grid": {
                let a = (e.content ?? []).map(
                  (e) =>
                    (e.content ?? [])
                      .map((e) =>
                        "examImage" === e.type
                          ? t(e)
                          : n.includes(e.type)
                            ? P(e)
                            : z(e.content, " <br> "),
                      )
                      .join(" <br> ") || " ",
                );
                return [
                  e.attrs?.autoColumns === !0
                    ? "::: choices"
                    : `::: grid ${e.attrs?.columns ?? 2}${e.attrs?.autoColumns === !1 ? " fixed=true" : ""}`,
                  ...a,
                  ":::",
                ].join("\n");
              }
              case "table":
                
                return (
                  (a = e.content ?? []),
                  (i = []),
                  (o = []),
                  (l = []),
                  a.forEach((e, a) => {
                    i[a] = i[a] ?? [];
                    let r = 0;
                    for (let s of e.content ?? []) {
                      for (; l[r] > 0; ) ((i[a][r] = "^"), l[r]--, r++);
                      let e = (s.content ?? [])
                        .map((e) =>
                          "examImage" === e.type
                            ? t(e)
                            : n.includes(e.type)
                              ? P(e)
                              : z(e.content, "<br>", !0),
                        )
                        .filter(Boolean)
                        .join("<br>");
                      if (((i[a][r] = e || " "), a > 0 && void 0 === o[r])) {
                        let t = s.content?.[0]?.attrs?.textAlign;
                        o[r] = t ?? null;
                      }
                      let c = Number(s.attrs?.rowspan ?? 1);
                      c > 1 && (l[r] = c - 1);
                      let h = Number(s.attrs?.colspan ?? 1);
                      for (let t = 1; t < h; t++) i[a][r + t] = "<";
                      r += h;
                    }
                    for (; l[r] > 0; ) ((i[a][r] = "^"), l[r]--, r++);
                  }),
                  (s = Math.max(...i.map((t) => t.length))),
                  (c = (t) =>
                    "| " +
                    Array.from({ length: s }, (e, n) => t[n] ?? " ").join(
                      " | ",
                    ) +
                    " |"),
                  (h =
                    "|" +
                    Array.from({ length: s }, (t, e) => {
                      let n = o[e];
                      return "center" === n
                        ? ":---:"
                        : "right" === n
                          ? "---:"
                          : "left" === n
                            ? ":---"
                            : "---";
                    }).join("|") +
                    "|"),
                  (u = [c(i[0] ?? []), h, ...i.slice(1).map(c)]),
                  Array.isArray((g = e.attrs?.widths)) &&
                    g.length === s &&
                    u.push(
                      `{widths=${g.map((t) => Math.round(10 * t) / 10).join(",")}}`,
                    ),
                  u.join("\n")
                );
              case "examImage": {
                let t = e.attrs ?? {},
                  n = [];
                return (
                  t.width &&
                    220 !== Math.round(Number(t.width)) &&
                    n.push(`width=${Math.round(Number(t.width))}`),
                  t.align && "center" !== t.align && n.push(`align=${t.align}`),
                  `![${W(String(t.alt ?? ""))}](${t.src ?? ""})${n.length ? `{${n.join(" ")}}` : ""}`
                );
              }
              case "variationTable":
                return (
                  "```variation\n" + String(e.attrs?.data ?? "{}") + "\n```"
                );
              case "functionGraph":
                return "```graph\n" + String(e.attrs?.data ?? "{}") + "\n```";
              case "geometryDiagram":
                return (
                  "```geometry\n" + String(e.attrs?.data ?? "{}") + "\n```"
                );
              case "vectorDiagram":
                return "```diagram\n" + String(e.attrs?.data ?? "{}") + "\n```";
              case "statChart":
                return "```chart\n" + String(e.attrs?.data ?? "{}") + "\n```";
              default:
                return (e.content ?? []).map(t).filter(Boolean).join("\n\n");
            }
          })(t);
        if (e || Object.keys(c).length > 0) {
          let t = `::: ${e ?? "para"}${Object.entries(c)
            .map(([t, e]) => ` ${t}=${e}`)
            .join("")}`;
          o && o.head === t
            ? o.parts.push(h)
            : (s(), (o = { key: t, head: t, parts: [h] }));
          continue;
        }
        (s(), l(h));
      }
      return (s(), a);
    }
    t.s([
      "collapseBlankLines",
      0,
      I,
      "imageAlt",
      0,
      W,
      "parseExamBlocks",
      0,
      function (t, e = {}) {
        return N(t, e).content ?? [];
      },
      "parseExamMarkdown",
      0,
      N,
      "parseInline",
      0,
      u,
      "serializeExamMarkdown",
      0,
      D,
    ]);
