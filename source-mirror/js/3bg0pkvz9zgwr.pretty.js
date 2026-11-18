(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  959696,
  (t) => {
    "use strict";
    var e = t.i(954206);
    let n = "[[ẢNH]]";
    function a(t) {
      return t.trim().length >= 3;
    }
    let i = new Map(),
      r = new Set(),
      o = /^\s*(?:\*\*|__)?\s*(?:Câu|Bài|Question|CÂU|BÀI)\s+\d+/,
      l = /^#{1,6}\s/,
      s = /\(data:[^)\s]*\)/g;
    t.s([
      "IMAGE_CONCURRENCY",
      0,
      2,
      "IMAGE_MARKER",
      0,
      n,
      "canDrawImage",
      0,
      a,
      "imageContext",
      0,
      function (t, a) {
        var i;
        let r = ((i = a.alt), (0, e.imageAlt)(i)),
          c = t.replace(s, "()").split("\n"),
          h = c.findIndex((t) =>
            (function (t, e, n) {
              let a = t.indexOf(`![${e}](`);
              if (a < 0) return !1;
              let i = t.slice(a + e.length + 4);
              return n ? i.startsWith(n) : i.startsWith(")");
            })(t, r, a.src),
          ),
          u = "";
        if (h < 0) {
          let t = `"src":${JSON.stringify(a.src)},"alt":${JSON.stringify(a.alt)}`;
          if ((h = c.findIndex((e) => e.startsWith("{") && e.includes(t))) < 0)
            return "";
          let e = [
              ...c[h].matchAll(
                /"type":"examImage","attrs":\{"src":("(?:[^"\\]|\\.)*"),"alt":("(?:[^"\\]|\\.)*")/g,
              ),
            ],
            i = !1;
          u = e
            .map((t, e) => {
              let r = JSON.parse(t[2]),
                o = !i && JSON.parse(t[1]) === a.src && r === a.alt;
              return (o && (i = !0), `\xd4 ảnh ${e + 1}: ${o ? n : r}`);
            })
            .join("\n");
        }
        let g = (t) => o.test(t) || l.test(t.trim()),
          d = h;
        for (; d > 0 && !g(c[d]); ) d--;
        let p = h + 1;
        for (; p < c.length && !g(c[p]); ) p++;
        if (
          p < c.length &&
          o.test(c[p]) &&
          !c.slice(h + 1, p).some((t) => t.trim())
        )
          for (p++; p < c.length && !g(c[p]); ) p++;
        let f = `![${r}](`,
          m = c
            .slice(d, p)
            .map((t, e) => {
              if (d + e !== h) return t;
              if (u) return u;
              let a = t.indexOf(f),
                i = t.indexOf(")", a + f.length),
                r = /^\{[^}\n]*\}/.exec(t.slice(i + 1));
              return t.slice(0, a) + n + t.slice(i + 1 + (r ? r[0].length : 0));
            })
            .join("\n")
            .trim();
        if (m.length <= 2800) return m;
        let y = Math.max(0, Math.min(m.indexOf(n) - 1400, m.length - 2800));
        return m.slice(y, y + 2800);
      },
      "imageJob",
      0,
      function (t) {
        return i.get(t);
      },
      "imageJobBusy",
      0,
      function (t) {
        let e = i.get(t)?.status;
        return "queued" === e || "drawing" === e;
      },
      "imageJobKey",
      0,
      function (t) {
        return `${t.src}\u0000${t.alt}`;
      },
      "newImageDescriptions",
      0,
      function (t, e, n = 8) {
        let i = new Set(t),
          r = [];
        for (let t of e)
          if (!i.has(t) && a(t) && (i.add(t), r.push(t), r.length >= n)) break;
        return r;
      },
      "setImageJob",
      0,
      function (t, e) {
        for (let n of (e ? i.set(t, e) : i.delete(t), r)) n();
      },
      "stopsImageQueue",
      0,
      function (t, e) {
        return (
          401 === e ||
          402 === e ||
          "quota_exhausted" === t ||
          "image_disabled" === t ||
          "network_error" === t
        );
      },
      "subscribeImageJobs",
      0,
      function (t) {
        return (
          r.add(t),
          () => {
            r.delete(t);
          }
        );
      },
    ]);
  },
  636607,
  (t) => {
    "use strict";
    var e = t.i(843476),
      n = t.i(716400),
      a = t.i(271645);
    t.i(148043);
    var i = t.i(378610);
    function r(t, e, r) {
      return (0, a.useMemo)(
        () =>
          n.default.renderToString(
            (0, i.spaceMatrixRows)((0, i.normalizeLatex)(t)),
            {
              displayMode: e,
              errorColor: r,
              throwOnError: !1,
              strict: !1,
              output: "html",
            },
          ),
        [t, e, r],
      );
    }
    t.s([
      "BlockMath",
      0,
      function ({ math: t, errorColor: n = "#dc2626" }) {
        let a = r(t, !0, n);
        return (0, e.jsx)("div", { dangerouslySetInnerHTML: { __html: a } });
      },
      "InlineMath",
      0,
      function ({ math: t, errorColor: n = "#dc2626" }) {
        let a = r(t, !1, n);
        return (0, e.jsx)("span", { dangerouslySetInnerHTML: { __html: a } });
      },
    ]);
  },
  954206,
  (t) => {
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
            var t, e;
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
              let t;
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
        var a;
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
      var a;
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
                let a, i, o, l, s, c, h, u, g;
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
  },
  629551,
  (t) => {
    "use strict";
    var e = t.i(843476),
      n = t.i(636607),
      a = t.i(592631),
      i = t.i(555072),
      r = t.i(745417);
    function o(t, e) {
      let n = new Map();
      return (
        t.forEach((t, a) => {
          let i = e[a];
          if (!i) return;
          let r = t.level ?? 0,
            o = i.length <= 1 ? 1.15 : 0.62 * i.length + 0.45;
          n.set(r, Math.max(n.get(r) ?? 0, o));
        }),
        new Map([...n].map(([t, e]) => [t, `${e.toFixed(2)}em`]))
      );
    }
    t.s([
      "RichText",
      0,
      function ({
        paragraphs: t,
        style: l,
        theme: s,
        markerColor: c,
        lineProps: h,
        splitChars: u,
        interactive: g,
      }) {
        let d = (0, r.listMarkers)(t, l),
          p = o(t, d),
          f = t.map(r.paragraphCharCount),
          m = f.map((t, e) => f.slice(0, e).reduce((t, e) => t + e, 0)),
          y = t.map(
            (e, n) => t.slice(0, n + 1).filter(r.paragraphHasText).length - 1,
          ),
          b = s.colors.primary;
        return (0, e.jsx)(e.Fragment, {
          children: t.map((t, o) => {
            var f;
            let x,
              k = (0, r.paragraphHasText)(t) && h ? h(y[o]) : void 0,
              v = d[o],
              M = t.list ?? l.list,
              w = h ? 0 : m[o],
              $ = t.runs.map((t, o) => {
                var c;
                let h,
                  d,
                  p,
                  f,
                  m,
                  y =
                    ((d = (0, r.effectiveMarks)(t, l)),
                    (f =
                      (p = t?.marks ?? {}).size ??
                      (d.script ? l.fontSize : void 0)),
                    (m = [
                      d.underline || d.link ? "underline" : "",
                      d.strike ? "line-through" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")),
                    {
                      fontWeight: d.bold ? 700 : 400,
                      fontStyle: d.italic ? "italic" : "normal",
                      textDecorationLine: m || void 0,
                      color: p.color
                        ? (0, a.resolveColor)(p.color, s)
                        : d.link
                          ? b
                          : void 0,
                      backgroundColor: d.highlight
                        ? (0, a.resolveColor)(d.highlight, s)
                        : void 0,
                      fontSize: f
                        ? `calc(${f}px * var(--fit, 1)${d.script ? " * 0.68" : ""})`
                        : void 0,
                      fontFamily: p.font ? (0, i.fontStack)(p.font, s) : void 0,
                      verticalAlign:
                        "super" === d.script
                          ? "super"
                          : "sub" === d.script
                            ? "sub"
                            : void 0,
                      lineHeight: d.script ? 0 : void 0,
                    }),
                  x = 700 === y.fontWeight,
                  k = `r${o}`;
                if (t.math) {
                  let a;
                  ((a = t.text),
                    (h = (0, e.jsx)(n.InlineMath, {
                      math: x
                        ? `\\boldsymbol{${a || "\\square"}}`
                        : a || "\\square",
                      errorColor: "currentColor",
                    })),
                    u &&
                      ((h = (0, e.jsx)("span", {
                        className: "sa-ch",
                        style: { "--i": w },
                        children: h,
                      })),
                      (w += 1)));
                } else if (u) {
                  let n,
                    a =
                      ((c = t.text),
                      (n = w),
                      {
                        nodes: c
                          .normalize("NFC")
                          .split(/(\s+)/)
                          .filter(Boolean)
                          .map((t, a) => {
                            if (/^\s+$/.test(t)) return t;
                            let i = Array.from(t),
                              r = (0, e.jsx)(
                                "span",
                                {
                                  className: "sa-w",
                                  children: i.map((t, a) =>
                                    (0, e.jsx)(
                                      "span",
                                      {
                                        className: "sa-ch",
                                        style: { "--i": n + a },
                                        children: t,
                                      },
                                      a,
                                    ),
                                  ),
                                },
                                `${k}${a}`,
                              );
                            return ((n += i.length), r);
                          }),
                        next: n,
                      });
                  ((w = a.next), (h = a.nodes));
                } else h = t.text;
                let v = t.marks?.link;
                return v && g
                  ? (0, e.jsx)(
                      "a",
                      {
                        href: v,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "rt-link",
                        style: y,
                        children: h,
                      },
                      k,
                    )
                  : (0, e.jsx)(
                      "span",
                      {
                        className: v ? "rt-link" : void 0,
                        style: y,
                        children: h,
                      },
                      k,
                    );
              });
            return (0, e.jsxs)(
              "p",
              {
                ...k,
                "data-marker": v ?? void 0,
                "data-list": v && "none" !== M ? M : void 0,
                className: `rt-p ${k?.className ?? ""}`,
                style: {
                  ...((f = v ? p.get(t.level ?? 0) : void 0),
                  (x = t.runs[0]),
                  {
                    textAlign: t.align ?? l.align,
                    lineHeight: t.lineHeight,
                    marginTop: t.spaceBefore
                      ? `calc(${t.spaceBefore}px * var(--fit, 1))`
                      : void 0,
                    marginBottom: t.spaceAfter
                      ? `calc(${t.spaceAfter}px * var(--fit, 1))`
                      : void 0,
                    "--rt-level": t.level || void 0,
                    "--rt-mw": f,
                    "--rt-marker-color": x?.marks?.color
                      ? (0, a.resolveColor)(x.marks.color, s)
                      : void 0,
                  }),
                  ...k?.style,
                  "--rt-marker": c,
                },
                children: [
                  t.runs.some((t) => t.math || t.text)
                    ? $
                    : (0, e.jsx)("br", {}),
                  t.runs.at(-1)?.text.endsWith("\n") &&
                    !t.runs.at(-1)?.math &&
                    (0, e.jsx)("br", {}),
                ],
              },
              o,
            );
          }),
        });
      },
      "markerWidths",
      0,
      o,
    ]);
  },
  592631,
  (t) => {
    "use strict";
    let e = [
        "@primary",
        "@secondary",
        "@accent",
        "@text",
        "@muted",
        "@surface",
        "@background",
      ],
      n = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    function a(t, e, n = "") {
      if (!t) return n;
      if (!t.startsWith("@")) return t;
      let i = t.slice(1),
        r = e.colors[i];
      return "string" == typeof r && r ? r : n;
    }
    function i(t) {
      if (!n.test(t)) return null;
      let e =
        4 === t.length
          ? t
              .slice(1)
              .split("")
              .map((t) => t + t)
              .join("")
          : t.slice(1);
      return [0, 2, 4].map((t) => parseInt(e.slice(t, t + 2), 16) / 255);
    }
    function r(t) {
      let e = i(t);
      if (!e) return null;
      let [n, a, r] = e.map((t) =>
        t <= 0.03928 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4,
      );
      return 0.2126 * n + 0.7152 * a + 0.0722 * r;
    }
    function o(t, e) {
      let n = r(t),
        a = r(e);
      return null === n || null === a
        ? 1
        : (Math.max(n, a) + 0.05) / (Math.min(n, a) + 0.05);
    }
    t.s([
      "THEME_COLOR_TOKENS",
      0,
      e,
      "isColorValue",
      0,
      function (t) {
        return "" === t || n.test(t) || e.includes(t);
      },
      "readableTextOn",
      0,
      function (t, e) {
        let n = a(t, e, "");
        if (!i(n)) return e.colors.text;
        let r = [e.colors.text, "#ffffff", e.colors.background];
        return (
          r.find((t) => o(t, n) >= 4.5) ??
          r.reduce((t, e) => (o(e, n) > o(t, n) ? e : t))
        );
      },
      "resolveColor",
      0,
      a,
    ]);
  },
  575117,
  376287,
  143078,
  (t) => {
    "use strict";
    t.s(
      ["SAFE_MARGIN", 0, 64, "SLIDE_HEIGHT", 0, 720, "SLIDE_WIDTH", 0, 1280],
      376287,
    );
    let e = [
        "fade-in",
        "fade-up",
        "fade-down",
        "fade-left",
        "fade-right",
        "zoom-in",
        "wipe",
        "pop",
        "blur-in",
        "drift",
        "tumble",
      ],
      n = [
        "type",
        "rise-text",
        "drop",
        "bounce-text",
        "burst",
        "blur-text",
        "slide-text",
      ],
      a = ["none", ...e, ...n];
    function i(t) {
      return n.includes(t);
    }
    function r(t) {
      return (
        ("text" === t.type || "shape" === t.type) && t.text.trim().length > 0
      );
    }
    function o(t, e = t.animation.effect) {
      return i(e) && !r(t) ? "fade-in" : e;
    }
    let l = {
      effect: "none",
      start: "enter",
      order: 0,
      duration: 600,
      delay: 0,
      byLine: !1,
    };
    function s(t) {
      return "string" == typeof t && a.includes(t);
    }
    let c = (t, e) =>
        "number" == typeof t && Number.isFinite(t)
          ? Math.round(Math.min(Math.max(t, 0), 1e4))
          : e,
      h = (t) =>
        "image" === t.type ||
        "icon" === t.type ||
        "graphic" === t.type ||
        "lottie" === t.type,
      u = {
        subtle: {
          decoration: "fade-in",
          heading: "fade-up",
          body: "fade-up",
          visual: "zoom-in",
          duration: 600,
        },
        lively: {
          decoration: "zoom-in",
          heading: "fade-down",
          body: "fade-left",
          visual: "zoom-in",
          duration: 600,
          byLine: !0,
        },
        stylish: {
          decoration: "fade-in",
          heading: "rise-text",
          body: "blur-in",
          visual: "drift",
          duration: 700,
        },
        party: {
          decoration: "pop",
          heading: "bounce-text",
          body: "pop",
          visual: "pop",
          duration: 600,
        },
        corporate: {
          decoration: "fade-in",
          heading: "wipe",
          body: "fade-up",
          visual: "fade-in",
          duration: 600,
        },
        chill: {
          decoration: "fade-in",
          heading: "fade-right",
          body: "drift",
          visual: "drift",
          duration: 900,
        },
      };
    function g(t, e = 900) {
      let n = new Map(),
        a = 0,
        i = (t) =>
          "text" === t.type || "shape" === t.type
            ? Math.max(1, t.text.split("\n").filter((t) => t.trim()).length)
            : 1;
      for (let e of t.elements) {
        let t = e.animation;
        if ("none" !== t.effect && "enter" === t.start)
          if (t.byLine && "text" === e.type) {
            let r = 0.5 * t.duration,
              o = Array.from({ length: i(e) }, (e, n) => ({
                at: t.delay + n * r,
                fragmentIndex: null,
              }));
            (n.set(e.id, { step: o[0], lines: o }),
              (a = Math.max(a, o[o.length - 1].at + t.duration)));
          } else
            (n.set(e.id, { step: { at: t.delay, fragmentIndex: null } }),
              (a = Math.max(a, t.delay + t.duration)));
      }
      let r = t.elements
          .map((t, e) => ({ element: t, index: e }))
          .filter(
            ({ element: t }) =>
              "none" !== t.animation.effect && "click" === t.animation.start,
          )
          .sort(
            (t, e) =>
              t.element.animation.order - e.element.animation.order ||
              t.index - e.index,
          ),
        o = -1,
        l = null,
        s = a;
      for (let { element: t } of r) {
        let r = t.animation;
        if (
          ((r.order !== l || o < 0) &&
            ((o += 1), (s = a + o * e), (l = r.order)),
          r.byLine && "text" === t.type)
        ) {
          let c = [];
          for (let n = 0; n < i(t); n++)
            (n > 0 && ((o += 1), (s = a + o * e)),
              c.push({ at: s + r.delay, fragmentIndex: o }));
          (n.set(t.id, { step: c[0], lines: c }), (l = null));
        } else n.set(t.id, { step: { at: s + r.delay, fragmentIndex: o } });
      }
      return n;
    }
    t.s(
      [
        "AI_ANIMATION_EFFECTS",
        0,
        a,
        "ANIMATION_PRESETS",
        0,
        [
          "none",
          "subtle",
          "build",
          "lively",
          "stylish",
          "party",
          "corporate",
          "chill",
        ],
        "BASIC_EFFECTS",
        0,
        e,
        "EFFECT_LABEL",
        0,
        {
          none: "Không",
          "fade-in": "Hiện dần",
          "fade-up": "Trượt lên",
          "fade-down": "Rơi xuống",
          "fade-left": "Trượt từ phải",
          "fade-right": "Trượt từ trái",
          "zoom-in": "Phóng to",
          wipe: "Quét",
          pop: "Bật ra",
          "blur-in": "Hiện mờ",
          drift: "Trôi",
          tumble: "Lăn vào",
          type: "Đánh chữ",
          "rise-text": "Trồi lên",
          drop: "Rơi",
          "bounce-text": "Nảy lên",
          burst: "Nổ",
          "blur-text": "Làm nét",
          "slide-text": "Trượt chữ",
        },
        "NO_ANIMATION",
        0,
        l,
        "PAGE_PRESETS",
        0,
        [
          "subtle",
          "build",
          "lively",
          "stylish",
          "party",
          "corporate",
          "chill",
          "none",
        ],
        "PRESET_INFO",
        0,
        {
          subtle: {
            label: "Nhẹ nhàng",
            hint: "Mọi thứ lần lượt hiện khi vào slide",
          },
          build: {
            label: "Từng ý",
            hint: "Tiêu đề hiện ngay, mỗi ý hiện khi bấm",
          },
          lively: {
            label: "Sinh động",
            hint: "Trượt, phóng to - hợp tiểu học",
          },
          stylish: {
            label: "Thời thượng",
            hint: "Tiêu đề trồi lên từng chữ, nội dung hiện mờ rồi nét",
          },
          party: { label: "Tiệc tùng", hint: "Chữ nảy lên, hình bật ra" },
          corporate: {
            label: "Doanh nghiệp",
            hint: "Tiêu đề quét ngang, nội dung trượt lên gọn gàng",
          },
          chill: { label: "Chill", hint: "Trượt và trôi chậm, êm" },
          none: { label: "Không", hint: "Bỏ mọi hiệu ứng của slide" },
        },
        "REVEAL_NATIVE_EFFECTS",
        0,
        [
          "none",
          "fade-in",
          "fade-up",
          "fade-down",
          "fade-left",
          "fade-right",
          "zoom-in",
        ],
        "TEXT_EFFECTS",
        0,
        n,
        "animationPlan",
        0,
        g,
        "applyAnimationPreset",
        0,
        function (t, e) {
          if ("none" === e)
            return t.map((t) => ({ ...t, animation: { ...l } }));
          let n = 0,
            a = 1,
            o = new Map(),
            s = "build" === e ? null : u[e];
          return t.map((t) => {
            let e,
              c = t.id,
              u = c.replace(/-(dot|num|icon|label|value)$/, ""),
              g = o.get(u),
              d =
                ("shape" === t.type && !t.text) ||
                c.startsWith("deco") ||
                c.endsWith("-card") ||
                "title-bar" === c ||
                "overlay" === c,
              p =
                "title" === c ||
                "subtitle" === c ||
                "quote-mark" === c ||
                "kicker" === c,
              f = "text" === t.type || ("shape" === t.type && !!t.text),
              m = (e) => (i(e) && !r(t) ? "fade-in" : e);
            if (d)
              e = {
                ...l,
                effect: s ? s.decoration : "fade-in",
                duration: 500,
                delay: 0,
              };
            else if (p)
              ((e = {
                ...l,
                effect: m(s ? s.heading : "fade-up"),
                duration: s?.duration ?? 600,
                delay: n,
              }),
                (n += 200));
            else if (s) {
              let a =
                "text" === t.type &&
                t.text.split("\n").filter((t) => t.trim()).length > 1;
              ((e = {
                ...l,
                effect: m(h(t) ? s.visual : s.body),
                duration: s.duration,
                delay: g?.delay ?? n,
                byLine: !!s.byLine && f && a,
              }),
                g || (o.set(u, { order: 0, delay: n }), (n += 250)));
            } else {
              let n =
                "text" === t.type &&
                t.text.split("\n").filter((t) => t.trim()).length > 1;
              ((e = {
                ...l,
                effect: h(t) ? "zoom-in" : "fade-up",
                start: "click",
                order: g?.order ?? a,
                duration: 500,
                byLine: n && !g,
              }),
                g || (o.set(u, { order: a, delay: 0 }), (a += 1)));
            }
            return { ...t, animation: e };
          });
        },
        "applyPageEffect",
        0,
        function (t, e) {
          if ("none" === e)
            return t.map((t) => ({ ...t, animation: { ...l } }));
          let n = [...t]
            .sort((t, e) => t.y - e.y || t.x - e.x)
            .map((t) => t.id);
          return t.map((t) => ({
            ...t,
            animation: {
              ...l,
              effect: o(t, e),
              delay: Math.min(150 * n.indexOf(t.id), 1500),
            },
          }));
        },
        "effectFor",
        0,
        o,
        "hasText",
        0,
        r,
        "isTextEffect",
        0,
        i,
        "normalizeAnimation",
        0,
        function (t) {
          return "string" == typeof t
            ? s(t) && "none" !== t
              ? { ...l, effect: t, start: "click" }
              : { ...l }
            : t && "object" == typeof t
              ? {
                  effect: s(t.effect) ? t.effect : "none",
                  start: "click" === t.start ? "click" : "enter",
                  order: c(t.order, 0),
                  duration: c(t.duration, 600) || 600,
                  delay: c(t.delay, 0),
                  byLine: !!t.byLine,
                }
              : { ...l };
        },
        "previewLength",
        0,
        function (t, e = 900) {
          let n = 0;
          for (let [a, i] of g(t, e)) {
            let e = t.elements.find((t) => t.id === a);
            n = Math.max(
              n,
              (i.lines?.[i.lines.length - 1] ?? i.step).at +
                (e?.animation.duration ?? 0),
            );
          }
          return n;
        },
      ],
      143078,
    );
    let d = "abcdefghijklmnopqrstuvwxyz0123456789";
    function p(t) {
      let e = new Uint8Array(8);
      crypto.getRandomValues(e);
      let n = "";
      for (let t of e) n += d[t % d.length];
      return `${t}-${n}`;
    }
    function f(t = {}) {
      return {
        fontSize: 28,
        font: "body",
        color: "",
        bold: !1,
        italic: !1,
        underline: !1,
        align: "left",
        valign: "top",
        lineHeight: 1.3,
        list: "none",
        fill: "",
        strike: !1,
        uppercase: !1,
        letterSpacing: 0,
        autofit: "shrink",
        ...t,
      };
    }
    function m() {
      return { color: "", gradientTo: "", image: "" };
    }
    function y(t) {
      return {
        id: t.id,
        x: t.x,
        y: t.y,
        width: Math.max(8, t.width),
        height: Math.max(8, t.height),
        rotation: 0,
        opacity: 1,
        locked: !1,
        groupId: "",
        animation: { ...l },
      };
    }
    t.s(
      [
        "MAX_LOTTIE_BYTES",
        0,
        6e5,
        "clampBox",
        0,
        function (t) {
          if ("line" === t.type) return t;
          let e = Math.min(Math.max(8, t.width), 2560),
            n = Math.min(Math.max(8, t.height), 1440),
            a = Math.min(Math.max(t.x, -e + 16), 1264),
            i = Math.min(Math.max(t.y, -n + 16), 704);
          return { ...t, x: a, y: i, width: e, height: n };
        },
        "createChart",
        0,
        function (t, e, n, a, i = "") {
          return {
            ...y(t),
            type: "chart",
            chart: e,
            title: "",
            labels: n,
            series: [{ name: i || "Số liệu", values: a }],
            showLegend: !1,
            showValues: !0,
          };
        },
        "createGraphic",
        0,
        function (t, e, n = "", a = "") {
          return { ...y(t), type: "graphic", graphic: e, color: n, accent: a };
        },
        "createIcon",
        0,
        function (t, e, n = "@primary") {
          return { ...y(t), type: "icon", icon: e, color: n, strokeWidth: 2 };
        },
        "createImage",
        0,
        function (t, e, n = "") {
          return {
            ...y(t),
            type: "image",
            src: n,
            prompt: e,
            fit: "cover",
            radius: 16,
          };
        },
        "createLine",
        0,
        function (t, e, n, a = {}) {
          return {
            ...y({
              id: t,
              x: Math.min(e.x, n.x),
              y: Math.min(e.y, n.y),
              width: Math.abs(n.x - e.x),
              height: Math.abs(n.y - e.y),
            }),
            type: "line",
            start: e,
            end: n,
            connector: "straight",
            stroke: "@text",
            strokeWidth: 3,
            dash: "solid",
            startCap: "none",
            endCap: "none",
            ...a,
          };
        },
        "createLottie",
        0,
        function (t, e, n) {
          return { ...y(t), type: "lottie", name: e, data: n, loop: !0 };
        },
        "createMath",
        0,
        function (t, e, n = 40) {
          return {
            ...y(t),
            type: "math",
            latex: e,
            fontSize: n,
            color: "",
            align: "center",
          };
        },
        "createShape",
        0,
        function (t, e, n = {}) {
          let { style: a, ...i } = n;
          return {
            ...y(t),
            type: "shape",
            shape: e,
            fill: "",
            fillTo: "",
            gradientAngle: 135,
            stroke: "",
            strokeWidth: 0,
            text: "",
            ...i,
            style: f({ align: "center", valign: "middle", fontSize: 24, ...a }),
          };
        },
        "createSlide",
        0,
        function (t, e = "blank") {
          return {
            id: t,
            layout: e,
            background: m(),
            elements: [],
            notes: "",
            transition: "fade",
            transitionSpeed: "default",
          };
        },
        "createTable",
        0,
        function (t, e, n = !0) {
          return { ...y(t), type: "table", rows: e, header: n, fontSize: 22 };
        },
        "createText",
        0,
        function (t, e, n = {}) {
          return { ...y(t), type: "text", text: e, style: f(n) };
        },
        "defaultBackground",
        0,
        m,
        "defaultTextStyle",
        0,
        f,
        "elementText",
        0,
        function (t) {
          switch (t.type) {
            case "text":
            case "shape":
              return t.text;
            case "image":
              return t.prompt;
            case "math":
              return `$${t.latex}$`;
            case "chart":
              return [t.title, t.labels.join(", ")].filter(Boolean).join(": ");
            case "table":
              return t.rows.map((t) => t.join(" | ")).join("\n");
            case "icon":
              return `[${t.icon}]`;
            case "graphic":
              return `[${t.graphic}]`;
            case "lottie":
              return `[${t.name}]`;
            case "line":
              return "";
          }
        },
        "isPendingImage",
        0,
        function (t) {
          return "image" === t.type && !t.src;
        },
        "shortId",
        0,
        p,
        "uniqueElementId",
        0,
        function (t, e) {
          let n = new Set(t.elements.map((t) => t.id)),
            a = (e ?? "")
              .trim()
              .replace(/[^A-Za-z0-9_-]/g, "")
              .slice(0, 40);
          if (a && !n.has(a)) return a;
          let i = p("el");
          for (; n.has(i); ) i = p("el");
          return i;
        },
      ],
      575117,
    );
  },
  555072,
  (t) => {
    "use strict";
    let e = [
        { id: "heading", label: "Tiêu đề của theme" },
        { id: "body", label: "Nội dung của theme" },
        { id: "serif", label: "Có chân của theme" },
        { id: "mono", label: "Đơn cách" },
      ],
      n = "system-ui, sans-serif",
      a = "Georgia, serif",
      i = [
        { name: "Be Vietnam Pro", category: "sans", axes: "ital", fallback: n },
        { name: "Roboto", category: "sans", axes: "ital", fallback: n },
        { name: "Open Sans", category: "sans", axes: "ital", fallback: n },
        { name: "Montserrat", category: "sans", axes: "ital", fallback: n },
        { name: "Inter", category: "sans", axes: "wght", fallback: n },
        { name: "Noto Sans", category: "sans", axes: "ital", fallback: n },
        { name: "Nunito", category: "sans", axes: "ital", fallback: n },
        { name: "Lexend", category: "sans", axes: "wght", fallback: n },
        { name: "Quicksand", category: "sans", axes: "wght", fallback: n },
        { name: "Josefin Sans", category: "sans", axes: "ital", fallback: n },
        { name: "Raleway", category: "sans", axes: "ital", fallback: n },
        { name: "Work Sans", category: "sans", axes: "ital", fallback: n },
        { name: "Source Sans 3", category: "sans", axes: "ital", fallback: n },
        { name: "Barlow", category: "sans", axes: "ital", fallback: n },
        { name: "Oswald", category: "sans", axes: "wght", fallback: n },
        { name: "Chakra Petch", category: "sans", axes: "ital", fallback: n },
        { name: "Bai Jamjuree", category: "sans", axes: "ital", fallback: n },
        { name: "Baloo 2", category: "sans", axes: "wght", fallback: n },
        { name: "Lora", category: "serif", axes: "ital", fallback: a },
        { name: "Merriweather", category: "serif", axes: "ital", fallback: a },
        {
          name: "Playfair Display",
          category: "serif",
          axes: "ital",
          fallback: a,
        },
        { name: "Noto Serif", category: "serif", axes: "ital", fallback: a },
        { name: "EB Garamond", category: "serif", axes: "ital", fallback: a },
        { name: "Alegreya", category: "serif", axes: "ital", fallback: a },
        {
          name: "Cormorant Garamond",
          category: "serif",
          axes: "ital",
          fallback: a,
        },
        { name: "Roboto Slab", category: "serif", axes: "wght", fallback: a },
        { name: "Comfortaa", category: "display", axes: "wght", fallback: n },
        {
          name: "Paytone One",
          category: "display",
          axes: "plain",
          fallback: n,
        },
        { name: "Bungee", category: "display", axes: "plain", fallback: n },
        {
          name: "Lobster",
          category: "display",
          axes: "plain",
          fallback: "cursive",
        },
        {
          name: "Pacifico",
          category: "handwriting",
          axes: "plain",
          fallback: "cursive",
        },
        {
          name: "Dancing Script",
          category: "handwriting",
          axes: "wght",
          fallback: "cursive",
        },
        {
          name: "Charm",
          category: "handwriting",
          axes: "wght",
          fallback: "cursive",
        },
        {
          name: "Patrick Hand",
          category: "handwriting",
          axes: "plain",
          fallback: "cursive",
        },
        {
          name: "Itim",
          category: "handwriting",
          axes: "plain",
          fallback: "cursive",
        },
        {
          name: "Mali",
          category: "handwriting",
          axes: "ital",
          fallback: "cursive",
        },
        {
          name: "Pangolin",
          category: "handwriting",
          axes: "plain",
          fallback: "cursive",
        },
        {
          name: "Sriracha",
          category: "handwriting",
          axes: "plain",
          fallback: "cursive",
        },
        {
          name: "Roboto Mono",
          category: "mono",
          axes: "ital",
          fallback: "monospace",
        },
        {
          name: "Source Code Pro",
          category: "mono",
          axes: "ital",
          fallback: "monospace",
        },
        {
          name: "JetBrains Mono",
          category: "mono",
          axes: "ital",
          fallback: "monospace",
        },
        { name: "Arial", category: "system", axes: "", fallback: n },
        {
          name: "Times New Roman",
          category: "system",
          axes: "",
          fallback: "serif",
        },
        { name: "Georgia", category: "system", axes: "", fallback: "serif" },
        { name: "Verdana", category: "system", axes: "", fallback: n },
        { name: "Tahoma", category: "system", axes: "", fallback: n },
        {
          name: "Courier New",
          category: "system",
          axes: "",
          fallback: "monospace",
        },
      ],
      r = new Map(i.map((t) => [t.name.toLowerCase(), t])),
      o = new Set(e.map((t) => t.id)),
      l = (t) => o.has(t);
    function s(t) {
      return r.get(t.toLowerCase());
    }
    t.s([
      "FONT_CATEGORY_LABEL",
      0,
      {
        sans: "Không chân",
        serif: "Có chân",
        display: "Trang trí",
        handwriting: "Viết tay",
        mono: "Đơn cách",
        system: "Có sẵn trên máy",
      },
      "FONT_LIBRARY",
      0,
      i,
      "FONT_ROLES",
      0,
      e,
      "fontFaceName",
      0,
      function (t, e) {
        let n = t && !l(t) ? s(t)?.name : void 0;
        if (n) return n;
        let a = e.fonts[t && l(t) ? t : "body"];
        return a.includes("slide-serif")
          ? "Lora"
          : a.includes("mono")
            ? "Consolas"
            : a.includes("slide-rounded")
              ? "Nunito"
              : "Be Vietnam Pro";
      },
      "fontInfo",
      0,
      s,
      "fontLabel",
      0,
      function (t) {
        return e.find((e) => e.id === t)?.label ?? s(t)?.name ?? t;
      },
      "fontStack",
      0,
      function (t, e) {
        if (!t) return e.fonts.body;
        if (l(t)) return e.fonts[t];
        let n = s(t);
        return n ? `"${n.name}", ${n.fallback}` : e.fonts.body;
      },
      "googleFontUrl",
      0,
      function (t) {
        if (!t.axes) return "";
        let e = t.name.replace(/ /g, "+"),
          n =
            "ital" === t.axes
              ? ":ital,wght@0,400;0,700;1,400;1,700"
              : "wght" === t.axes
                ? ":wght@400;700"
                : "";
        return `https://fonts.googleapis.com/css2?family=${e}${n}&display=swap`;
      },
      "isFontName",
      0,
      function (t) {
        return "string" == typeof t && (o.has(t) || r.has(t.toLowerCase()));
      },
      "isFontRole",
      0,
      l,
    ]);
  },
  736958,
  (t) => {
    "use strict";
    let e = [
        {
          id: "math",
          title: "Toán học",
          blurb: "thước, compa, hình khối, phân số, trục số",
        },
        {
          id: "science",
          title: "Khoa học tự nhiên",
          blurb: "thí nghiệm, vũ trụ, cơ thể, điện",
        },
        {
          id: "nature",
          title: "Thiên nhiên & động vật",
          blurb: "cây, hoa, thời tiết, con vật",
        },
        {
          id: "language",
          title: "Ngữ văn & ngoại ngữ",
          blurb: "sách, bút lông, hội thoại, chữ cái",
        },
        {
          id: "social",
          title: "Lịch sử & địa lí",
          blurb: "trống đồng, bản đồ, la bàn, di tích",
        },
        {
          id: "classroom",
          title: "Lớp học & dụng cụ",
          blurb: "cặp sách, bảng, đồng hồ, bút màu",
        },
        {
          id: "people",
          title: "Nhân vật & linh vật",
          blurb: "học sinh, thầy cô, robot, thú bông",
        },
        {
          id: "reward",
          title: "Khen thưởng & cảm xúc",
          blurb: "sao, huy chương, mặt cười, dấu tích",
        },
        {
          id: "symbol",
          title: "Số & ký hiệu",
          blurb: "số 0–9, A B C D, + − × ÷ =",
        },
        {
          id: "frame",
          title: "Khung & bong bóng",
          blurb: "băng rôn, bong bóng thoại, thẻ, ngoặc",
        },
        {
          id: "arrow",
          title: "Mũi tên & chỉ dẫn",
          blurb: "mũi tên, chu trình, bàn tay chỉ",
        },
        {
          id: "animated",
          title: "Hiệu ứng động",
          blurb: "lấp lánh, tên lửa, pháo giấy",
        },
        { id: "decor", title: "Trang trí", blurb: "nét cọ, sóng, khung góc" },
      ],
      n = [
        ["open-book", "Sách mở", 1.4, "sach doc hoc bai book"],
        ["pencil", "Bút chì", 2.4, "but chi viet pencil"],
        [
          "lightbulb",
          "Bóng đèn ý tưởng",
          0.85,
          "y tuong sang tao bong den idea",
        ],
        ["graduation", "Mũ tốt nghiệp", 1.3, "tot nghiep hoc sinh mu cap"],
        ["chalkboard", "Bảng đen", 1.45, "bang phan lop hoc giao vien board"],
        ["globe", "Quả địa cầu", 0.8, "dia ly the gioi trai dat globe"],
        ["trophy", "Cúp", 0.9, "giai thuong chien thang cup"],
        ["plant", "Chậu cây", 0.75, "cay xanh sinh hoc moi truong"],
        ["flask", "Bình thí nghiệm", 0.8, "hoa hoc thi nghiem khoa hoc"],
        ["owl", "Cú mèo", 0.85, "linh vat cu meo thong thai mascot"],
        ["sticky-note", "Giấy ghi chú", 1, "ghi chu note luu y"],
        ["ribbon", "Ruy-băng tiêu đề", 4, "bang ron tieu de banner"],
        ["badge", "Huy hiệu", 1, "con dau huy hieu chung nhan"],
      ],
      a = (t, e) =>
        e.map(([e, n, a, i]) => ({
          id: e,
          name: n,
          category: t,
          ratio: a,
          keywords: i,
        })),
      i = [
        ...a("math", [
          ["ruler", "Thước kẻ", 3.33, "thuoc ke do chieu dai cm ruler"],
          ["protractor", "Thước đo góc", 1.7, "thuoc do goc eke do protractor"],
          ["set-square", "Ê-ke", 1, "eke thuoc tam giac vuong goc"],
          ["compass-tool", "Compa", 0.9, "compa ve hinh tron vong tron"],
          [
            "calculator",
            "Máy tính",
            0.8,
            "may tinh bo tui tinh toan calculator",
          ],
          ["abacus", "Bàn tính", 1.33, "ban tinh cong tru dem hat"],
          ["number-line", "Tia số", 4.4, "tia so truc so cong tru nhay"],
          [
            "coordinate-plane",
            "Mặt phẳng toạ độ",
            1,
            "toa do truc oxy do thi ham so",
          ],
          ["cube", "Hình lập phương", 1, "khoi lap phuong hinh hoc the tich"],
          [
            "cuboid",
            "Hình hộp chữ nhật",
            1.3,
            "khoi hop chu nhat hinh hoc the tich",
          ],
          ["cylinder", "Hình trụ", 0.8, "khoi tru hinh hoc the tich lon"],
          ["cone", "Hình nón", 0.8, "khoi non hinh hoc"],
          ["sphere", "Hình cầu", 1, "khoi cau hinh hoc qua bong"],
          ["pyramid", "Hình chóp", 1.1, "kim tu thap chop hinh hoc"],
          [
            "right-triangle",
            "Tam giác vuông",
            1,
            "tam giac vuong pythagore canh huyen",
          ],
          [
            "circle-parts",
            "Hình tròn: bán kính, đường kính",
            1,
            "ban kinh duong kinh hinh tron tam",
          ],
          ["angle", "Góc", 1.25, "goc tia canh dinh do"],
          [
            "parallel-lines",
            "Hai đường song song",
            1,
            "song song cat tuyen goc so le dong vi",
          ],
          ["venn", "Biểu đồ Venn", 1.5, "venn tap hop giao hop"],
          [
            "balance",
            "Cân thăng bằng",
            1.2,
            "can bang nhau phuong trinh so sanh",
          ],
          ["dice", "Xúc xắc", 1, "xuc xac xac suat may rui"],
          ["pi", "Số Pi", 1.25, "pi hang so chu vi hinh tron"],
          ["pie-1-2", "Phân số 1/2", 1, "phan so mot nua hinh tron"],
          ["pie-1-3", "Phân số 1/3", 1, "phan so mot phan ba hinh tron"],
          ["pie-1-4", "Phân số 1/4", 1, "phan so mot phan tu hinh tron"],
          ["pie-2-3", "Phân số 2/3", 1, "phan so hai phan ba hinh tron"],
          ["pie-3-4", "Phân số 3/4", 1, "phan so ba phan tu hinh tron"],
        ]),
        ...a("science", [
          ["beaker", "Cốc đong", 0.8, "coc dong thi nghiem hoa hoc ly"],
          ["test-tubes", "Ống nghiệm", 1, "ong nghiem gia thi nghiem hoa hoc"],
          [
            "graduated-cylinder",
            "Ống đong",
            0.36,
            "ong dong the tich chia vach",
          ],
          ["alcohol-lamp", "Đèn cồn", 0.67, "den con dot nong thi nghiem lua"],
          [
            "microscope",
            "Kính hiển vi",
            0.9,
            "kinh hien vi sinh hoc te bao quan sat",
          ],
          [
            "telescope",
            "Kính thiên văn",
            1.2,
            "kinh thien van vu tru thien van hoc",
          ],
          ["dna", "ADN", 0.5, "adn di truyen sinh hoc gen xoan kep"],
          ["magnet", "Nam châm", 1, "nam cham tu truong vat ly"],
          ["planet", "Hành tinh", 1.2, "hanh tinh sao tho vu tru thien van"],
          ["solar-system", "Hệ Mặt Trời", 1.7, "he mat troi hanh tinh vu tru"],
          ["earth", "Trái Đất", 1, "trai dat hanh tinh dia ly the gioi"],
          [
            "moon-phases",
            "Các pha Mặt Trăng",
            4,
            "mat trang pha tuan trang liem",
          ],
          ["cell", "Tế bào", 1.2, "te bao nhan sinh hoc"],
          ["battery", "Pin", 2, "pin dien nguon vat ly"],
          [
            "circuit-bulb",
            "Mạch điện bóng đèn",
            1.27,
            "mach dien bong den cong tac vat ly",
          ],
          ["thermometer", "Nhiệt kế", 0.45, "nhiet ke nhiet do nong lanh"],
          ["volcano", "Núi lửa", 1.2, "nui lua dia ly dung nham"],
          [
            "water-cycle",
            "Vòng tuần hoàn nước",
            1.4,
            "vong tuan hoan nuoc mua bay hoi may",
          ],
          [
            "prism-light",
            "Lăng kính tán sắc",
            1.55,
            "lang kinh tan sac anh sang cau vong vat ly",
          ],
          ["brain", "Bộ não", 1.1, "bo nao nao than kinh co the nguoi"],
          ["heart-organ", "Tim", 1, "tim co quan tuan hoan co the nguoi"],
          ["eye", "Mắt", 1.67, "mat thi giac co quan co the nguoi"],
          ["tooth", "Răng", 0.8, "rang co the nguoi suc khoe"],
          [
            "molecule-water",
            "Phân tử nước H₂O",
            1.25,
            "phan tu nuoc h2o hoa hoc nguyen tu lien ket",
          ],
          [
            "element-tile",
            "Ô nguyên tố",
            0.875,
            "nguyen to bang tuan hoan hoa hoc ky hieu",
          ],
        ]),
        ...a("nature", [
          ["tree", "Cây", 0.8, "cay xanh thuc vat rung"],
          ["pine-tree", "Cây thông", 0.7, "cay thong rung noel"],
          ["flower", "Bông hoa", 0.8, "hoa canh hoa thuc vat"],
          ["sunflower", "Hoa hướng dương", 0.85, "hoa huong duong mat troi"],
          ["leaf", "Chiếc lá", 0.9, "la cay quang hop thuc vat"],
          ["sprout", "Mầm cây", 0.9, "mam cay hat nay mam gieo trong"],
          ["sun", "Mặt Trời cười", 1, "mat troi nang thoi tiet"],
          ["rain-cloud", "Mây mưa", 1.1, "may mua thoi tiet nuoc"],
          ["rainbow", "Cầu vồng", 1.6, "cau vong thoi tiet mau sac"],
          ["landscape", "Phong cảnh", 1.5, "phong canh nui doi dong que"],
          ["fish", "Con cá", 1.5, "ca dong vat duoi nuoc"],
          ["bird", "Con chim", 1.2, "chim dong vat bay"],
          ["butterfly", "Con bướm", 1.2, "buom con trung vong doi"],
          ["bee", "Con ong", 1.2, "ong mat con trung thu phan"],
          ["turtle", "Con rùa", 1.4, "rua dong vat"],
          ["frog", "Con ếch", 1.2, "ech dong vat luong cu"],
          ["cat", "Con mèo", 1, "meo dong vat nuoi"],
          ["dog", "Con chó", 1.1, "cho dong vat nuoi"],
          ["apple", "Quả táo", 0.9, "qua tao trai cay an uong"],
          ["water-drop", "Giọt nước", 0.8, "giot nuoc mua nuoc"],
        ]),
        ...a("language", [
          [
            "abc-blocks",
            "Khối chữ ABC",
            1.4,
            "chu cai abc khoi do choi bang chu cai",
          ],
          [
            "dialogue",
            "Hội thoại",
            1.4,
            "hoi thoai doi thoai noi chuyen tieng anh",
          ],
          ["quill", "Bút lông ngỗng", 1, "but long muc van hoc co dien"],
          ["scroll", "Cuộn giấy", 1.2, "cuon giay thu thach lich su van ban"],
          ["dictionary", "Từ điển", 0.8, "tu dien tra cuu sach"],
          ["notebook", "Vở viết", 0.8, "vo ghi chep tap viet"],
          ["envelope", "Lá thư", 1.4, "thu phong bi viet thu"],
          ["quote-marks", "Dấu trích dẫn", 1.2, "trich dan ngoac kep cau noi"],
          ["headphones", "Tai nghe", 1, "tai nghe nghe nghe hieu"],
          ["microphone", "Micro", 0.6, "micro noi thuyet trinh doc"],
          [
            "translate",
            "Dịch thuật",
            1.2,
            "dich ngon ngu tieng anh tieng viet",
          ],
          ["book-stack", "Chồng sách", 1.2, "chong sach thu vien doc"],
          ["hello", "Xin chào", 1.5, "hello xin chao chao hoi tieng anh"],
          ["a-plus", "Bài điểm A+", 0.85, "diem tot bai kiem tra a+ xuat sac"],
        ]),
        ...a("social", [
          [
            "bronze-drum",
            "Trống đồng",
            1,
            "trong dong dong son van hoa co dai lich su",
          ],
          ["conical-hat", "Nón lá", 1.3, "non la viet nam van hoa"],
          ["flag-vn", "Cờ Việt Nam", 1.5, "co do sao vang to quoc viet nam"],
          ["lotus", "Hoa sen", 1, "hoa sen quoc hoa viet nam"],
          ["pagoda", "Chùa", 1, "chua den tho kien truc di tich"],
          ["citadel", "Thành cổ", 1.4, "thanh co cong thanh lich su di tich"],
          ["junk-boat", "Thuyền buồm", 1.3, "thuyen buom ha long song nuoc"],
          ["stilt-house", "Nhà sàn", 1.3, "nha san dan toc vung cao"],
          ["map-pin", "Ghim bản đồ", 0.75, "ghim vi tri dia diem ban do"],
          ["compass-rose", "La bàn", 1, "la ban huong bac nam dong tay"],
          ["map-fold", "Bản đồ gấp", 1.4, "ban do dia ly duong di"],
          ["hourglass", "Đồng hồ cát", 0.7, "dong ho cat thoi gian lich su"],
          [
            "timeline",
            "Trục thời gian",
            3.5,
            "truc thoi gian moc su kien lich su",
          ],
          ["mountain", "Dãy núi", 1.5, "nui doi dia ly nui non"],
          ["coin", "Đồng xu", 1, "dong xu tien tien te kinh te"],
          ["lantern", "Đèn lồng", 0.8, "den long trung thu tet le hoi"],
        ]),
        ...a("classroom", [
          ["backpack", "Cặp sách", 0.85, "cap sach balo hoc sinh den truong"],
          ["school", "Ngôi trường", 1.4, "truong hoc nha truong khai giang"],
          ["desk", "Bàn học", 1.3, "ban hoc ghe lop hoc"],
          ["bell", "Chuông", 1, "chuong trong truong ra choi vao lop"],
          ["crayons", "Bút màu", 1.2, "but mau sap mau ve to mau"],
          ["scissors", "Cái kéo", 1, "keo cat thu cong"],
          ["glue", "Lọ hồ dán", 0.7, "ho dan keo dan thu cong"],
          ["eraser", "Cục tẩy", 1.5, "tay gom xoa"],
          ["palette", "Bảng màu", 1.2, "bang mau ve my thuat"],
          ["calendar", "Lịch", 0.9, "lich ngay thang tuan"],
          ["alarm-clock", "Đồng hồ báo thức", 1, "dong ho bao thuc gio hen"],
          ["whiteboard", "Bảng trắng", 1.5, "bang trang bang viet lop hoc"],
          ["pencil-case", "Hộp bút", 1.7, "hop but dung cu hoc tap"],
          ["school-bus", "Xe buýt trường", 1.7, "xe buyt xe dua don hoc sinh"],
          [
            "clipboard",
            "Bảng kẹp giấy",
            0.8,
            "ban kep giay danh sach kiem tra",
          ],
          ["clock-face", "Mặt đồng hồ", 1, "dong ho xem gio kim gio kim phut"],
        ]),
        ...a("people", [
          ["student-boy", "Bạn nam học sinh", 0.8, "hoc sinh nam be trai ban"],
          ["student-girl", "Bạn nữ học sinh", 0.8, "hoc sinh nu be gai ban"],
          ["teacher-woman", "Cô giáo", 0.8, "co giao giao vien nu"],
          ["teacher-man", "Thầy giáo", 0.8, "thay giao giao vien nam"],
          [
            "robot",
            "Robot trợ giảng",
            0.85,
            "robot may tinh cong nghe ai tro ly",
          ],
          ["bunny", "Thỏ con", 0.8, "tho thu bong linh vat de thuong"],
          ["bear", "Gấu con", 0.95, "gau thu bong linh vat de thuong"],
          [
            "thinker",
            "Bạn đang nghĩ",
            0.8,
            "suy nghi cau hoi tu duy ban hoc sinh",
          ],
        ]),
        ...a("reward", [
          ["stars-3", "Ba ngôi sao", 2.4, "ba sao danh gia diem thuong"],
          ["medal-gold", "Huy chương vàng", 0.8, "huy chuong vang giai nhat"],
          ["medal-silver", "Huy chương bạc", 0.8, "huy chuong bac giai nhi"],
          ["certificate", "Giấy khen", 1.4, "giay khen bang khen chung nhan"],
          ["thumbs-up", "Ngón cái", 1, "tuyet voi dong y thich like"],
          ["heart", "Trái tim", 1.1, "tim yeu thuong cam on"],
          ["smile", "Mặt cười", 1, "mat cuoi vui ve hanh phuc"],
          ["think-face", "Mặt suy nghĩ", 1, "suy nghi phan van hmm cau hoi"],
          ["wow-face", "Mặt ngạc nhiên", 1, "ngac nhien wow bat ngo"],
          ["question", "Dấu hỏi", 0.8, "dau hoi cau hoi thac mac"],
          [
            "exclamation",
            "Dấu chấm than",
            0.5,
            "dau cham than chu y quan trong",
          ],
          ["check", "Dấu tích xanh", 1, "dung tich chinh xac dap an"],
          ["cross", "Dấu X đỏ", 1, "sai x loi dap an"],
          ["good-job", "Làm tốt lắm", 1.8, "lam tot lam hay chuc mung gioi"],
          ["crown", "Vương miện", 1.3, "vuong mien nhat vo dich"],
          ["fire", "Ngọn lửa", 0.8, "lua chuoi hang hai noi bat"],
          ["gift", "Hộp quà", 1, "qua tang phan thuong"],
          ["balloon", "Bóng bay", 0.75, "bong bay sinh nhat chuc mung"],
          ["party-popper", "Pháo mừng", 1, "phao mung chuc mung tiec"],
        ]),
        ...a("symbol", [
          ["num-0", "Số 0", 1, "so khong 0"],
          ["num-1", "Số 1", 1, "so mot 1"],
          ["num-2", "Số 2", 1, "so hai 2"],
          ["num-3", "Số 3", 1, "so ba 3"],
          ["num-4", "Số 4", 1, "so bon 4"],
          ["num-5", "Số 5", 1, "so nam 5"],
          ["num-6", "Số 6", 1, "so sau 6"],
          ["num-7", "Số 7", 1, "so bay 7"],
          ["num-8", "Số 8", 1, "so tam 8"],
          ["num-9", "Số 9", 1, "so chin 9"],
          ["ltr-a", "Chữ A", 1, "dap an a lua chon"],
          ["ltr-b", "Chữ B", 1, "dap an b lua chon"],
          ["ltr-c", "Chữ C", 1, "dap an c lua chon"],
          ["ltr-d", "Chữ D", 1, "dap an d lua chon"],
          ["op-plus", "Dấu cộng", 1, "cong them phep cong +"],
          ["op-minus", "Dấu trừ", 1, "tru bot phep tru -"],
          ["op-times", "Dấu nhân", 1, "nhan phep nhan x"],
          ["op-divide", "Dấu chia", 1, "chia phep chia"],
          ["op-equal", "Dấu bằng", 1, "bang ket qua ="],
          ["op-percent", "Dấu phần trăm", 1, "phan tram %"],
        ]),
        ...a("frame", [
          ["banner-flag", "Băng rôn đuôi cá", 4, "bang ron tieu de ruy bang"],
          ["title-tag", "Thẻ tiêu đề", 3, "nhan the tieu de label"],
          [
            "speech-rect",
            "Bong bóng thoại vuông",
            1.5,
            "bong bong thoai hoi thoai noi",
          ],
          ["speech-cloud", "Bong bóng đám mây", 1.5, "bong bong may nghi noi"],
          [
            "thought-bubble",
            "Bong bóng suy nghĩ",
            1.3,
            "suy nghi tu duy y tuong",
          ],
          ["starburst", "Vầng sáng nổ", 1, "vang sang no noi bat tang gia"],
          ["bracket-left", "Ngoặc nhọn trái", 0.3, "ngoac nhom nhom y gom"],
          ["bracket-right", "Ngoặc nhọn phải", 0.3, "ngoac nhom nhom y gom"],
          ["polaroid", "Khung ảnh", 0.85, "khung anh anh chup ky niem"],
          ["notebook-page", "Trang vở", 0.8, "trang vo giay ke ngang ghi chep"],
          ["ticket", "Vé", 2.2, "ve phieu the bai"],
          ["stamp", "Con dấu", 1, "con dau xac nhan da kiem tra"],
        ]),
        ...a("arrow", [
          ["arrow-straight", "Mũi tên thẳng", 3, "mui ten chi huong tiep theo"],
          ["arrow-double", "Mũi tên hai chiều", 3, "mui ten hai chieu qua lai"],
          ["arrow-down-big", "Mũi tên xuống", 0.7, "mui ten xuong ket qua"],
          [
            "arrow-cycle",
            "Chu trình ba mũi tên",
            1,
            "chu trinh vong tron tuan hoan lap lai",
          ],
          [
            "arrow-curve-down",
            "Mũi tên cong xuống",
            1.4,
            "mui ten cong chuyen",
          ],
          [
            "arrow-zigzag",
            "Mũi tên ngoằn ngoèo",
            2,
            "mui ten ngoan ngoeo duong di",
          ],
          ["arrow-dashed", "Mũi tên nét đứt", 3, "mui ten net dut lien ket"],
          ["hand-point", "Bàn tay chỉ", 1.3, "ban tay chi nhin day"],
          ["cursor-click", "Con trỏ bấm", 0.9, "con tro chuot bam click"],
          ["step-chevrons", "Các bước tiến", 2.5, "buoc tien trinh qua trinh"],
          ["magnifier", "Kính lúp", 1, "kinh lup tim kiem quan sat"],
          ["target", "Bia mục tiêu", 1, "muc tieu dich bia diem"],
        ]),
        ...a("animated", [
          ["sparkles", "Lấp lánh", 1, "lap lanh sao ngoi sao sparkle"],
          ["rocket", "Tên lửa bay", 0.8, "ten lua khoi dong bat dau rocket"],
          ["atom", "Nguyên tử quay", 1, "nguyen tu vat ly hoa hoc atom"],
          ["paper-plane", "Máy bay giấy", 1.3, "may bay giay gui di plane"],
          ["check-draw", "Dấu tích", 1, "dung dap an chinh xac check"],
          ["heartbeat", "Trái tim", 1.1, "tim yeu thich heart"],
          ["clock", "Đồng hồ chạy", 1, "thoi gian dong ho bam gio"],
          ["bulb-glow", "Đèn sáng", 0.85, "y tuong sang len tia sang"],
          ["bounce-arrow", "Mũi tên nhún", 0.7, "mui ten chu y xuong"],
          ["owl-blink", "Cú mèo chớp mắt", 0.85, "cu meo linh vat chop mat"],
          ["confetti", "Pháo giấy", 1.4, "chuc mung hoan thanh confetti"],
        ]),
        ...a("decor", [
          ["brush-strokes", "Nét cọ", 2.6, "net co trang tri brush"],
          ["underline", "Gạch chân tay", 6, "gach chan nhan manh"],
          ["curved-arrow", "Mũi tên cong", 1.6, "mui ten chi huong"],
          ["blob", "Hình loang", 1.2, "nen trang tri blob"],
          ["wave", "Sóng", 5, "song chan trang"],
          ["dots", "Lưới chấm", 1, "cham hoa van pattern"],
          ["corner", "Góc khung", 1, "goc khung vien"],
          ["circle-scribble", "Khoanh tròn", 1.6, "khoanh tron danh dau"],
        ]),
        ...a(
          "classroom",
          n.filter(([t]) =>
            [
              "open-book",
              "pencil",
              "graduation",
              "chalkboard",
              "sticky-note",
            ].includes(t),
          ),
        ),
        ...a(
          "science",
          n.filter(([t]) => ["lightbulb", "flask"].includes(t)),
        ),
        ...a(
          "nature",
          n.filter(([t]) => "plant" === t),
        ),
        ...a(
          "social",
          n.filter(([t]) => "globe" === t),
        ),
        ...a(
          "reward",
          n.filter(([t]) => ["trophy", "badge"].includes(t)),
        ),
        ...a(
          "people",
          n.filter(([t]) => "owl" === t),
        ),
        ...a(
          "frame",
          n.filter(([t]) => "ribbon" === t),
        ),
      ],
      r = new Map(i.map((t) => [t.id, t])),
      o = (t) =>
        t.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase();
    function l(t) {
      return i.filter((e) => e.category === t);
    }
    t.s([
      "GRAPHIC_CATEGORIES",
      0,
      e,
      "graphicIndex",
      0,
      function () {
        return e
          .filter((t) => "decor" !== t.id)
          .map((t) => ({
            id: t.id,
            title: t.title,
            items: l(t.id).map((t) => t.id),
          }))
          .filter((t) => t.items.length);
      },
      "graphicInfo",
      0,
      function (t) {
        return r.get(t);
      },
      "graphicsOf",
      0,
      l,
      "isGraphicId",
      0,
      function (t) {
        return "string" == typeof t && r.has(t);
      },
      "searchGraphics",
      0,
      function (t) {
        let e = o(t.trim());
        return e
          ? i.filter((t) => o(`${t.name} ${t.keywords} ${t.id}`).includes(e))
          : i;
      },
    ]);
  },
  327962,
  (t) => {
    "use strict";
    let e = [
        [0.5, 0],
        [1, 0.5],
        [0.5, 1],
        [0, 0.5],
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      n = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: -Math.SQRT1_2, y: -Math.SQRT1_2 },
        { x: Math.SQRT1_2, y: -Math.SQRT1_2 },
        { x: Math.SQRT1_2, y: Math.SQRT1_2 },
        { x: -Math.SQRT1_2, y: Math.SQRT1_2 },
      ];
    function a(t, e, n) {
      if (!n) return t;
      let a = (n * Math.PI) / 180,
        i = Math.cos(a),
        r = Math.sin(a),
        o = t.x - e.x,
        l = t.y - e.y;
      return { x: e.x + o * i - l * r, y: e.y + o * r + l * i };
    }
    let i = (t) => "line" !== t.type;
    function r(t) {
      let n = { x: t.x + t.width / 2, y: t.y + t.height / 2 };
      return e.map(([e, i]) =>
        a({ x: t.x + e * t.width, y: t.y + i * t.height }, n, t.rotation),
      );
    }
    function o(t, e) {
      if (void 0 !== t.elementId && void 0 !== t.site) {
        let o = e.find((e) => e.id === t.elementId);
        if (o && i(o))
          return {
            point: r(o)[t.site] ?? { x: t.x, y: t.y },
            direction: a(n[t.site] ?? n[0], { x: 0, y: 0 }, o.rotation),
          };
      }
      return { point: { x: t.x, y: t.y }, direction: null };
    }
    let l = (t, e) => ({ x: t.x - e.x, y: t.y - e.y }),
      s = (t) => Math.hypot(t.x, t.y);
    function c(t, e) {
      let n = l(e, t);
      return Math.abs(n.x) >= Math.abs(n.y)
        ? { x: Math.sign(n.x) || 1, y: 0 }
        : { x: 0, y: Math.sign(n.y) || 1 };
    }
    let h = (t) => Math.abs(t.x) >= Math.abs(t.y);
    function u(t, e) {
      switch (t) {
        case "arrow":
        case "triangle":
          return 0.85 * g(e).length;
        case "diamond":
        case "circle":
          return 0.45 * g(e).width;
        default:
          return 0;
      }
    }
    function g(t) {
      return { length: 3.5 * t + 10, width: 3 * t + 9 };
    }
    let d = (t) => Math.round(100 * t) / 100;
    function p(t, e) {
      if ("freehand" === t.connector && t.points && t.points.length > 1) {
        let e = t.points,
          n = e[0],
          a = e[e.length - 1],
          i = `M${e.map((t) => `${d(t.x)},${d(t.y)}`).join(" L")}`,
          r = l(e[0], e[Math.min(2, e.length - 1)]),
          o = l(a, e[Math.max(0, e.length - 3)]);
        return {
          d: i,
          start: n,
          end: a,
          startAngle: Math.atan2(r.y, r.x),
          endAngle: Math.atan2(o.y, o.x),
          extent: e,
        };
      }
      let n = o(t.start, e),
        a = o(t.end, e),
        i = n.point,
        r = a.point,
        g = n.direction ?? c(i, r),
        p = a.direction ?? c(r, i);
      if ("elbow" === t.connector) {
        let e = (function (t, e, n, a) {
            let i = {
                x: t.x + Math.sign(e.x) * (24 * !!h(e)),
                y: t.y + Math.sign(e.y) * (24 * !h(e)),
              },
              r = {
                x: n.x + Math.sign(a.x) * (24 * !!h(a)),
                y: n.y + Math.sign(a.y) * (24 * !h(a)),
              },
              o = [t];
            if (h(e) && h(a)) {
              let l = (i.x + r.x) / 2;
              if (
                ((e.x > 0 && n.x > t.x) || (e.x < 0 && n.x < t.x)) &&
                Math.sign(e.x) === -Math.sign(a.x)
              )
                o.push({ x: l, y: t.y }, { x: l, y: n.y });
              else {
                let a = e.x > 0 ? Math.max(i.x, r.x) : Math.min(i.x, r.x);
                o.push({ x: a, y: t.y }, { x: a, y: n.y });
              }
            } else if (h(e) || h(a))
              h(e) ? o.push({ x: n.x, y: t.y }) : o.push({ x: t.x, y: n.y });
            else {
              let l = (i.y + r.y) / 2;
              if (
                ((e.y > 0 && n.y > t.y) || (e.y < 0 && n.y < t.y)) &&
                Math.sign(e.y) === -Math.sign(a.y)
              )
                o.push({ x: t.x, y: l }, { x: n.x, y: l });
              else {
                let a = e.y > 0 ? Math.max(i.y, r.y) : Math.min(i.y, r.y);
                o.push({ x: t.x, y: a }, { x: n.x, y: a });
              }
            }
            return (
              o.push(n),
              o.filter(
                (t, e) =>
                  0 === e ||
                  Math.hypot(t.x - o[e - 1].x, t.y - o[e - 1].y) > 0.01,
              )
            );
          })(i, g, r, p),
          n = l(e[0], e[1] ?? r),
          a = l(e[e.length - 1], e[e.length - 2] ?? i),
          o = y(e, u(t.startCap, t.strokeWidth), u(t.endCap, t.strokeWidth));
        return {
          d: `M${o.map((t) => `${d(t.x)},${d(t.y)}`).join(" L")}`,
          start: i,
          end: r,
          startAngle: Math.atan2(n.y, n.x),
          endAngle: Math.atan2(a.y, a.x),
          extent: e,
        };
      }
      if ("curve" === t.connector) {
        let e = Math.max(40, 0.45 * s(l(r, i))),
          n = { x: i.x + g.x * e, y: i.y + g.y * e },
          a = { x: r.x + p.x * e, y: r.y + p.y * e },
          o = l(i, n),
          c = l(r, a),
          h = u(t.startCap, t.strokeWidth),
          y = u(t.endCap, t.strokeWidth),
          b = h ? m(i, n, h) : i,
          x = y ? m(r, a, y) : r;
        return {
          d: `M${d(b.x)},${d(b.y)} C${d(n.x)},${d(n.y)} ${d(a.x)},${d(a.y)} ${d(x.x)},${d(x.y)}`,
          start: i,
          end: r,
          startAngle: Math.atan2(o.y, o.x),
          endAngle: Math.atan2(c.y, c.x),
          extent: [
            i,
            r,
            f(i, n, a, r, 0.25),
            f(i, n, a, r, 0.5),
            f(i, n, a, r, 0.75),
          ],
        };
      }
      let b = l(r, i),
        x = y([i, r], u(t.startCap, t.strokeWidth), u(t.endCap, t.strokeWidth));
      return {
        d: `M${d(x[0].x)},${d(x[0].y)} L${d(x[1].x)},${d(x[1].y)}`,
        start: i,
        end: r,
        startAngle: Math.atan2(-b.y, -b.x),
        endAngle: Math.atan2(b.y, b.x),
        extent: [i, r],
      };
    }
    function f(t, e, n, a, i) {
      let r = 1 - i;
      return {
        x:
          r * r * r * t.x +
          3 * r * r * i * e.x +
          3 * r * i * i * n.x +
          i * i * i * a.x,
        y:
          r * r * r * t.y +
          3 * r * r * i * e.y +
          3 * r * i * i * n.y +
          i * i * i * a.y,
      };
    }
    function m(t, e, n) {
      let a = l(e, t),
        i = s(a);
      if (i < 0.001) return t;
      let r = Math.min(n, 0.45 * i);
      return { x: t.x + (a.x / i) * r, y: t.y + (a.y / i) * r };
    }
    function y(t, e, n) {
      let a = t.map((t) => ({ ...t }));
      return (
        e && a.length > 1 && (a[0] = m(a[0], a[1], e)),
        n &&
          a.length > 1 &&
          (a[a.length - 1] = m(a[a.length - 1], a[a.length - 2], n)),
        a
      );
    }
    t.s([
      "canConnect",
      0,
      i,
      "capPath",
      0,
      function (t, e, n, a) {
        if ("none" === t) return null;
        let { length: i, width: r } = g(a),
          o = Math.cos(n),
          l = Math.sin(n),
          s = (t, n) => `${d(e.x + t * o - n * l)},${d(e.y + t * l + n * o)}`;
        switch (t) {
          case "arrow":
            return {
              d: `M${s(0, 0)} L${s(-i, r / 2)} L${s(-(0.72 * i), 0)} L${s(-i, -r / 2)} Z`,
              filled: !0,
            };
          case "triangle":
            return {
              d: `M${s(0, 0)} L${s(-i, r / 2)} L${s(-i, -r / 2)} Z`,
              filled: !0,
            };
          case "open":
            return {
              d: `M${s(-i, r / 2)} L${s(0, 0)} L${s(-i, -r / 2)}`,
              filled: !1,
            };
          case "circle": {
            let t = 0.42 * r,
              n = e.x - t * o * 0.6,
              a = e.y - t * l * 0.6;
            return {
              d: `M${d(n - t)},${d(a)} A${d(t)},${d(t)} 0 1,0 ${d(n + t)},${d(a)} A${d(t)},${d(t)} 0 1,0 ${d(n - t)},${d(a)} Z`,
              filled: !0,
            };
          }
          case "diamond":
            return {
              d: `M${s(0, 0)} L${s(-(0.5 * r), 0.42 * r)} L${s(-r, 0)} L${s(-(0.5 * r), -(0.42 * r))} Z`,
              filled: !0,
            };
          case "bar":
            return { d: `M${s(0, r / 2)} L${s(0, -r / 2)}`, filled: !1 };
        }
      },
      "capSize",
      0,
      g,
      "connectionSites",
      0,
      r,
      "dashArray",
      0,
      function (t, e) {
        let n = Math.max(1, e);
        switch (t) {
          case "dash":
            return `${4 * n} ${3 * n}`;
          case "dot":
            return `${0.01 * n} ${2.2 * n}`;
          case "dash-dot":
            return `${4 * n} ${2.2 * n} ${0.01 * n} ${2.2 * n}`;
          case "long-dash":
            return `${8 * n} ${3 * n}`;
          default:
            return;
        }
      },
      "lineGeometry",
      0,
      p,
      "nearestSite",
      0,
      function (t, e, n, a = []) {
        let o = null;
        for (let l of t)
          !i(l) ||
            a.includes(l.id) ||
            r(l).forEach((t, a) => {
              let i = Math.hypot(t.x - e.x, t.y - e.y);
              i <= n &&
                (!o || i < o.distance) &&
                (o = { elementId: l.id, site: a, point: t, distance: i });
            });
        if (!o) return null;
        let l = o;
        return { elementId: l.elementId, site: l.site, point: l.point };
      },
      "resolveEnd",
      0,
      o,
      "syncConnectors",
      0,
      function (t, e) {
        let n = !1,
          a = t.slides.map((t) => {
            if (e && e.slides.includes(t)) return t;
            let a = (function (t) {
              if (!t.elements.some((t) => "line" === t.type)) return t;
              let e = !1,
                n = t.elements.map((n) => {
                  var a, o;
                  let l, s, c, h, u;
                  if ("line" !== n.type) return n;
                  let f = n,
                    m = (e) => {
                      if (void 0 === e.elementId) return e;
                      let n = t.elements.find((t) => t.id === e.elementId);
                      if (!n || !i(n)) return { x: e.x, y: e.y };
                      let a = r(n)[e.site ?? 0];
                      return 0.01 > Math.abs(a.x - e.x) &&
                        0.01 > Math.abs(a.y - e.y)
                        ? e
                        : { ...e, x: d(a.x), y: d(a.y) };
                    },
                    y = m(f.start),
                    b = m(f.end);
                  (y !== f.start || b !== f.end) &&
                    (f = { ...f, start: y, end: b });
                  let x =
                    ((a = f),
                    (o = p(f, t.elements)),
                    (l =
                      a.strokeWidth / 2 +
                      ("none" !== a.startCap || "none" !== a.endCap
                        ? g(a.strokeWidth).width / 2
                        : 0) +
                      2),
                    (s = o.extent.map((t) => t.x)),
                    (c = o.extent.map((t) => t.y)),
                    (h = Math.min(...s) - l),
                    (u = Math.min(...c) - l),
                    {
                      x: d(h),
                      y: d(u),
                      width: d(Math.max(8, Math.max(...s) + l - h)),
                      height: d(Math.max(8, Math.max(...c) + l - u)),
                    });
                  return (
                    (x.x !== f.x ||
                      x.y !== f.y ||
                      x.width !== f.width ||
                      x.height !== f.height ||
                      f.rotation) &&
                      (f = { ...f, ...x, rotation: 0 }),
                    f !== n && (e = !0),
                    f
                  );
                });
              return e ? { ...t, elements: n } : t;
            })(t);
            return (a !== t && (n = !0), a);
          });
        return n ? { ...t, slides: a } : t;
      },
      "translateLine",
      0,
      function (t, e, n) {
        return {
          ...t,
          start: { x: d(t.start.x + e), y: d(t.start.y + n) },
          end: { x: d(t.end.x + e), y: d(t.end.y + n) },
          points: t.points?.map((t) => ({ x: d(t.x + e), y: d(t.y + n) })),
          x: t.x + e,
          y: t.y + n,
        };
      },
    ]);
  },
  745417,
  (t) => {
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
  },
  821990,
  (t) => {
    "use strict";
    var e = t.i(715760);
    t.s([
      "requestExamImage",
      0,
      function (t, n) {
        return (0, e.postJson)("/api/exam-image", t, n);
      },
    ]);
  },
  635416,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("arrow-down", [
      ["path", { d: "M12 5v14", key: "s699le" }],
      ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }],
    ]);
    t.s(["ArrowDown", 0, e], 635416);
  },
  711241,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("arrow-left", [
      ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
      ["path", { d: "M19 12H5", key: "x3x0zl" }],
    ]);
    t.s(["ArrowLeft", 0, e], 711241);
  },
  768877,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("arrow-right", [
      ["path", { d: "M5 12h14", key: "1ays0h" }],
      ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }],
    ]);
    t.s(["ArrowRight", 0, e], 768877);
  },
  96892,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("arrow-up", [
      ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
      ["path", { d: "M12 19V5", key: "x0mq9r" }],
    ]);
    t.s(["ArrowUp", 0, e], 96892);
  },
  856423,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("book-open", [
      ["path", { d: "M12 5v16", key: "1f6ucr" }],
      [
        "path",
        {
          d: "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z",
          key: "1fyvmf",
        },
      ],
    ]);
    t.s(["BookOpen", 0, e], 856423);
  },
  518515,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("camera", [
      [
        "path",
        {
          d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
          key: "18u6gg",
        },
      ],
      ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }],
    ]);
    t.s(["Camera", 0, e], 518515);
  },
  867927,
  (t) => {
    "use strict";
    var e = t.i(986253);
    t.s(["ChevronRight", () => e.default]);
  },
  422768,
  724983,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("circle-alert", [
      ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
      ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
      ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }],
    ]);
    (t.s(["default", 0, e], 724983), t.s(["CircleAlert", 0, e], 422768));
  },
  616933,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("circle-check", [
      ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
      ["path", { d: "m16 9-5.5 5.5L8 12", key: "xofnsj" }],
    ]);
    t.s(["default", 0, e]);
  },
  285595,
  (t) => {
    "use strict";
    var e = t.i(616933);
    t.s(["CircleCheck", () => e.default]);
  },
  275043,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("circle-question-mark", [
      ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
      ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
      ["path", { d: "M12 17h.01", key: "p32p05" }],
    ]);
    t.s(["default", 0, e]);
  },
  235056,
  (t) => {
    "use strict";
    var e = t.i(275043);
    t.s(["CircleHelp", () => e.default]);
  },
  809584,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("database", [
      ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
      ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
      ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }],
    ]);
    t.s(["Database", 0, e], 809584);
  },
  503678,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("earth", [
      ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54", key: "1djwo0" }],
      [
        "path",
        {
          d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",
          key: "1tzkfa",
        },
      ],
      [
        "path",
        {
          d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",
          key: "14pb5j",
        },
      ],
      ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ]);
    t.s(["default", 0, e]);
  },
  277573,
  689765,
  (t) => {
    "use strict";
    var e = t.i(456420);
    let n = (0, e.default)("equal", [
      ["line", { x1: "5", x2: "19", y1: "9", y2: "9", key: "1nwqeh" }],
      ["line", { x1: "5", x2: "19", y1: "15", y2: "15", key: "g8yjpy" }],
    ]);
    t.s(["Equal", 0, n], 277573);
    let a = (0, e.default)("flask-conical", [
      [
        "path",
        {
          d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
          key: "18mbvz",
        },
      ],
      ["path", { d: "M6.453 15h11.094", key: "3shlmq" }],
      ["path", { d: "M8.5 2h7", key: "csnxdl" }],
    ]);
    t.s(["FlaskConical", 0, a], 689765);
  },
  312900,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("eye", [
      [
        "path",
        {
          d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
          key: "1nclc0",
        },
      ],
      ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
    ]);
    t.s(["Eye", 0, e], 312900);
  },
  226091,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("file-text", [
      [
        "path",
        {
          d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
          key: "1oefj6",
        },
      ],
      ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
      ["path", { d: "M10 9H8", key: "b1mrlr" }],
      ["path", { d: "M16 13H8", key: "t4e002" }],
      ["path", { d: "M16 17H8", key: "z1uh3a" }],
    ]);
    t.s(["FileText", 0, e], 226091);
  },
  282625,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("gift", [
      ["path", { d: "M12 7v14", key: "1akyts" }],
      [
        "path",
        { d: "M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8", key: "1sqzm4" },
      ],
      [
        "path",
        {
          d: "M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5",
          key: "kc0143",
        },
      ],
      [
        "rect",
        { x: "3", y: "7", width: "18", height: "4", rx: "1", key: "1hberx" },
      ],
    ]);
    t.s(["Gift", 0, e], 282625);
  },
  675849,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("image", [
      [
        "rect",
        {
          width: "18",
          height: "18",
          x: "3",
          y: "3",
          rx: "2",
          ry: "2",
          key: "1m3agn",
        },
      ],
      ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
      [
        "path",
        { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" },
      ],
    ]);
    t.s(["default", 0, e]);
  },
  770990,
  (t) => {
    "use strict";
    var e = t.i(675849);
    t.s(["ImageIcon", () => e.default]);
  },
  124007,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("link", [
      [
        "path",
        {
          d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
          key: "1cjeqo",
        },
      ],
      [
        "path",
        {
          d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
          key: "19qd67",
        },
      ],
    ]);
    t.s(["Link", 0, e], 124007);
  },
  806537,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("lock", [
      [
        "rect",
        {
          width: "18",
          height: "11",
          x: "3",
          y: "11",
          rx: "2",
          ry: "2",
          key: "1w4ew1",
        },
      ],
      ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }],
    ]);
    t.s(["Lock", 0, e], 806537);
  },
  420865,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("map-pin", [
      [
        "path",
        {
          d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
          key: "1r0f0z",
        },
      ],
      ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
    ]);
    t.s(["MapPin", 0, e], 420865);
  },
  615227,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("message-circle", [
      [
        "path",
        {
          d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
          key: "1sd12s",
        },
      ],
    ]);
    t.s(["MessageCircle", 0, e], 615227);
  },
  638292,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("mic", [
      ["path", { d: "M12 19v3", key: "npa21l" }],
      ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
      [
        "rect",
        { x: "9", y: "2", width: "6", height: "13", rx: "3", key: "s6n7sd" },
      ],
    ]);
    t.s(["Mic", 0, e], 638292);
  },
  935829,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("minus", [
      ["path", { d: "M5 12h14", key: "1ays0h" }],
    ]);
    t.s(["Minus", 0, e], 935829);
  },
  950786,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("palette", [
      [
        "path",
        {
          d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
          key: "e79jfc",
        },
      ],
      [
        "circle",
        { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" },
      ],
      [
        "circle",
        {
          cx: "17.5",
          cy: "10.5",
          r: ".5",
          fill: "currentColor",
          key: "f64h9f",
        },
      ],
      [
        "circle",
        { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" },
      ],
      [
        "circle",
        { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" },
      ],
    ]);
    t.s(["Palette", 0, e], 950786);
  },
  741120,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("refresh-cw", [
      [
        "path",
        {
          d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
          key: "v9h5vc",
        },
      ],
      ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
      [
        "path",
        {
          d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
          key: "3uifl3",
        },
      ],
      ["path", { d: "M8 16H3v5", key: "1cv678" }],
    ]);
    t.s(["RefreshCw", 0, e], 741120);
  },
  284784,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("repeat", [
      ["path", { d: "m17 2 4 4-4 4", key: "nntrym" }],
      ["path", { d: "M3 11v-1a4 4 0 0 1 4-4h14", key: "84bu3i" }],
      ["path", { d: "m7 22-4-4 4-4", key: "1wqhfi" }],
      ["path", { d: "M21 13v1a4 4 0 0 1-4 4H3", key: "1rx37r" }],
    ]);
    t.s(["Repeat", 0, e], 284784);
  },
  400169,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("ruler", [
      [
        "path",
        {
          d: "M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z",
          key: "icamh8",
        },
      ],
      ["path", { d: "m14.5 12.5 2-2", key: "inckbg" }],
      ["path", { d: "m11.5 9.5 2-2", key: "fmmyf7" }],
      ["path", { d: "m8.5 6.5 2-2", key: "vc6u1g" }],
      ["path", { d: "m17.5 15.5 2-2", key: "wo5hmg" }],
    ]);
    t.s(["Ruler", 0, e], 400169);
  },
  933641,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("sigma", [
      [
        "path",
        {
          d: "M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2",
          key: "wuwx1p",
        },
      ],
    ]);
    t.s(["Sigma", 0, e], 933641);
  },
  755566,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("triangle-alert", [
      [
        "path",
        {
          d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
          key: "wmoenq",
        },
      ],
      ["path", { d: "M12 9v4", key: "juzpu7" }],
      ["path", { d: "M12 17h.01", key: "p32p05" }],
    ]);
    t.s(["default", 0, e]);
  },
  866627,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("wifi", [
      ["path", { d: "M12 20h.01", key: "zekei9" }],
      ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
      ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
      ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }],
    ]);
    t.s(["Wifi", 0, e], 866627);
  },
  364569,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("zap", [
      [
        "path",
        {
          d: "M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",
          key: "1v7up4",
        },
      ],
    ]);
    t.s(["Zap", 0, e], 364569);
  },
  90317,
  (t, e, n) => {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 });
    var a = {
      bindSnapshot: function () {
        return c;
      },
      createAsyncLocalStorage: function () {
        return s;
      },
      createSnapshot: function () {
        return h;
      },
    };
    for (var i in a) Object.defineProperty(n, i, { enumerable: !0, get: a[i] });
    let r = Object.defineProperty(
      Error(
        "Invariant: AsyncLocalStorage accessed in runtime where it is not available",
      ),
      "__NEXT_ERROR_CODE",
      { value: "E504", enumerable: !1, configurable: !0 },
    );
    class o {
      disable() {
        throw r;
      }
      getStore() {}
      run() {
        throw r;
      }
      exit() {
        throw r;
      }
      enterWith() {
        throw r;
      }
      static bind(t) {
        return t;
      }
    }
    let l = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
    function s() {
      return l ? new l() : new o();
    }
    function c(t) {
      return l ? l.bind(t) : o.bind(t);
    }
    function h() {
      return l
        ? l.snapshot()
        : function (t, ...e) {
            return t(...e);
          };
    }
  },
  242344,
  (t, e, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "workAsyncStorageInstance", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    let a = (0, t.r(90317).createAsyncLocalStorage)();
  },
  563599,
  (t, e, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "workAsyncStorage", {
        enumerable: !0,
        get: function () {
          return a.workAsyncStorageInstance;
        },
      }));
    let a = t.r(242344);
  },
  309885,
  (t, e, n) => {
    "use strict";
    function a(t) {
      return t
        .split("/")
        .map((t) => encodeURIComponent(t))
        .join("/");
    }
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "encodeURIPath", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
  },
  667585,
  (t, e, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "BailoutToCSR", {
        enumerable: !0,
        get: function () {
          return i;
        },
      }));
    let a = t.r(132061);
    function i({ reason: t, children: e }) {
      if ("u" < typeof window)
        throw Object.defineProperty(
          new a.BailoutToCSRError(t),
          "__NEXT_ERROR_CODE",
          { value: "E394", enumerable: !1, configurable: !0 },
        );
      return e;
    }
  },
  652157,
  (t, e, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "PreloadChunks", {
        enumerable: !0,
        get: function () {
          return s;
        },
      }));
    let a = t.r(843476),
      i = t.r(174080),
      r = t.r(563599),
      o = t.r(309885),
      l = t.r(543369);
    function s({ moduleIds: t }) {
      if ("u" > typeof window) return null;
      let e = r.workAsyncStorage.getStore();
      if (void 0 === e) return null;
      let n = [];
      if (e.reactLoadableManifest && t) {
        let a = e.reactLoadableManifest;
        for (let e of t) {
          if (!a[e]) continue;
          let t = a[e].files;
          n.push(...t);
        }
      }
      if (0 === n.length) return null;
      let c = (0, l.getAssetTokenQuery)();
      return (0, a.jsx)(a.Fragment, {
        children: n.map((t) => {
          let n = `${e.assetPrefix}/_next/${(0, o.encodeURIPath)(t)}${c}`;
          return t.endsWith(".css")
            ? (0, a.jsx)(
                "link",
                {
                  precedence: "dynamic",
                  href: n,
                  rel: "stylesheet",
                  as: "style",
                  nonce: e.nonce,
                },
                t,
              )
            : ((0, i.preload)(n, {
                as: "script",
                fetchPriority: "low",
                nonce: e.nonce,
              }),
              null);
        }),
      });
    }
  },
  869093,
  (t, e, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "default", {
        enumerable: !0,
        get: function () {
          return c;
        },
      }));
    let a = t.r(843476),
      i = t.r(271645),
      r = t.r(667585),
      o = t.r(652157);
    function l(t) {
      return { default: t && "default" in t ? t.default : t };
    }
    let s = {
        loader: () => Promise.resolve(l(() => null)),
        loading: null,
        ssr: !0,
      },
      c = function (t) {
        let e = { ...s, ...t },
          n = (0, i.lazy)(() => e.loader().then(l)),
          c = e.loading;
        function h(t) {
          let l = c
              ? (0, a.jsx)(c, { isLoading: !0, pastDelay: !0, error: null })
              : null,
            s = !e.ssr || !!e.loading,
            h = s ? i.Suspense : i.Fragment,
            u = e.ssr
              ? (0, a.jsxs)(a.Fragment, {
                  children: [
                    "u" < typeof window
                      ? (0, a.jsx)(o.PreloadChunks, { moduleIds: e.modules })
                      : null,
                    (0, a.jsx)(n, { ...t }),
                  ],
                })
              : (0, a.jsx)(r.BailoutToCSR, {
                  reason: "next/dynamic",
                  children: (0, a.jsx)(n, { ...t }),
                });
          return (0, a.jsx)(h, { ...(s ? { fallback: l } : {}), children: u });
        }
        return ((h.displayName = "LoadableComponent"), h);
      };
  },
  770703,
  (t, e, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "default", {
        enumerable: !0,
        get: function () {
          return i;
        },
      }));
    let a = t.r(555682)._(t.r(869093));
    function i(t, e) {
      let n = {};
      "function" == typeof t && (n.loader = t);
      let i = { ...n, ...e };
      return (0, a.default)({ ...i, modules: i.loadableGenerated?.modules });
    }
    ("function" == typeof n.default ||
      ("object" == typeof n.default && null !== n.default)) &&
      void 0 === n.default.__esModule &&
      (Object.defineProperty(n.default, "__esModule", { value: !0 }),
      Object.assign(n.default, n),
      (e.exports = n.default));
  },
  755838,
  (t, e, n) => {
    "use strict";
    var a = t.r(271645),
      i =
        "function" == typeof Object.is
          ? Object.is
          : function (t, e) {
              return (
                (t === e && (0 !== t || 1 / t == 1 / e)) || (t != t && e != e)
              );
            },
      r = a.useState,
      o = a.useEffect,
      l = a.useLayoutEffect,
      s = a.useDebugValue;
    function c(t) {
      var e = t.getSnapshot;
      t = t.value;
      try {
        var n = e();
        return !i(t, n);
      } catch (t) {
        return !0;
      }
    }
    var h =
      "u" < typeof window ||
      void 0 === window.document ||
      void 0 === window.document.createElement
        ? function (t, e) {
            return e();
          }
        : function (t, e) {
            var n = e(),
              a = r({ inst: { value: n, getSnapshot: e } }),
              i = a[0].inst,
              h = a[1];
            return (
              l(
                function () {
                  ((i.value = n), (i.getSnapshot = e), c(i) && h({ inst: i }));
                },
                [t, n, e],
              ),
              o(
                function () {
                  return (
                    c(i) && h({ inst: i }),
                    t(function () {
                      c(i) && h({ inst: i });
                    })
                  );
                },
                [t],
              ),
              s(n),
              n
            );
          };
    n.useSyncExternalStore =
      void 0 !== a.useSyncExternalStore ? a.useSyncExternalStore : h;
  },
  802239,
  (t, e, n) => {
    "use strict";
    (t.i(247167), (e.exports = t.r(755838)));
  },
  752822,
  (t, e, n) => {
    "use strict";
    var a = t.r(271645),
      i = t.r(802239),
      r =
        "function" == typeof Object.is
          ? Object.is
          : function (t, e) {
              return (
                (t === e && (0 !== t || 1 / t == 1 / e)) || (t != t && e != e)
              );
            },
      o = i.useSyncExternalStore,
      l = a.useRef,
      s = a.useEffect,
      c = a.useMemo,
      h = a.useDebugValue;
    n.useSyncExternalStoreWithSelector = function (t, e, n, a, i) {
      var u = l(null);
      if (null === u.current) {
        var g = { hasValue: !1, value: null };
        u.current = g;
      } else g = u.current;
      var d = o(
        t,
        (u = c(
          function () {
            function t(t) {
              if (!s) {
                if (
                  ((s = !0), (o = t), (t = a(t)), void 0 !== i && g.hasValue)
                ) {
                  var e = g.value;
                  if (i(e, t)) return (l = e);
                }
                return (l = t);
              }
              if (((e = l), r(o, t))) return e;
              var n = a(t);
              return void 0 !== i && i(e, n)
                ? ((o = t), e)
                : ((o = t), (l = n));
            }
            var o,
              l,
              s = !1,
              c = void 0 === n ? null : n;
            return [
              function () {
                return t(e());
              },
              null === c
                ? void 0
                : function () {
                    return t(c());
                  },
            ];
          },
          [e, n, a, i],
        ))[0],
        u[1],
      );
      return (
        s(
          function () {
            ((g.hasValue = !0), (g.value = d));
          },
          [d],
        ),
        h(d),
        d
      );
    };
  },
  430224,
  (t, e, n) => {
    "use strict";
    (t.i(247167), (e.exports = t.r(752822)));
  },
]);
