(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  871813,
  482534,
  (t) => {
    "use strict";
    function e(t) {
      let e = [],
        r = -1,
        n = 0,
        i = 0,
        a = !1,
        l = 0,
        s = () => {
          (r >= 0 && e.push({ from: r, to: n }), (r = -1));
        },
        o = t.split(/(\r\n|\r|\n)/);
      for (let t = 0; t < o.length; t += 2) {
        let e = o[t],
          c = e.trim();
        (/^```/.test(c)
          ? (a = !a)
          : !a &&
            c.startsWith(":::") &&
            (":::" === c ? (l = Math.max(0, l - 1)) : l++),
          "" !== c || a || 0 !== l
            ? (r < 0 && (r = i), (n = i + e.length))
            : s(),
          (i += e.length + (o[t + 1]?.length ?? 0)));
      }
      return (s(), e);
    }
    function r(t) {
      return t
        .trim()
        .replace(/^#{1,6}\s+/, "")
        .replace(/\[\[(.*?)\]\]/g, "$1")
        .replace(
          /<\/?(?:size|color|highlight|font|link|box|u|sup|sub|s|br)(?:=[^>]*)?\s*\/?>/gi,
          "",
        )
        .replace(/\*\*|\*|~~|\\(?=[\\$*|[\]_#`~<>!:])/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }
    let n = /^(câu|bài)\s+\d+[a-zđ]?\b/i;
    function i(t) {
      for (let e of t.split("\n").slice(1)) {
        let t = r(e);
        if (t && "|||" !== t && !t.startsWith(":::")) return t;
      }
      return "";
    }
    function a(t) {
      let e = s(t);
      if (e) {
        let t = o(e);
        return {
          kind:
            "table" === e.type
              ? "bảng"
              : "examHeader" === e.type
                ? "đầu đề"
                : "grid" === e.type
                  ? "lưới"
                  : "heading" === e.type
                    ? "tiêu đề"
                    : ["bulletList", "orderedList"].includes(e.type ?? "")
                      ? "danh sách"
                      : n.test(t)
                        ? "câu hỏi"
                        : "đoạn",
          label: t,
        };
      }
      let a = t.split("\n", 1)[0].trim(),
        l = r(a);
      return "\\newpage" === a
        ? { kind: "ngắt trang", label: "" }
        : a.startsWith("::: columns")
          ? { kind: "cột văn bản", label: i(t) }
          : a.startsWith("::: header")
            ? { kind: "đầu đề", label: i(t) }
            : a.startsWith("::: grid") || a.startsWith("::: choices")
              ? { kind: "lưới", label: i(t) }
              : a.startsWith(":::")
                ? { kind: "căn lề", label: i(t) }
                : a.startsWith("```variation")
                  ? { kind: "bảng biến thiên", label: "" }
                  : a.startsWith("```graph")
                    ? { kind: "đồ thị", label: "" }
                    : a.startsWith("```geometry")
                      ? { kind: "hình học", label: "" }
                      : a.startsWith("```diagram")
                        ? { kind: "hình", label: "" }
                        : a.startsWith("```")
                          ? { kind: "khối code", label: "" }
                          : a.startsWith("|")
                            ? { kind: "bảng", label: l }
                            : a.startsWith("![")
                              ? { kind: "hình", label: l }
                              : a.startsWith("#")
                                ? { kind: "tiêu đề", label: l }
                                : n.test(l)
                                  ? { kind: "câu hỏi", label: l }
                                  : { kind: "đoạn", label: l };
    }
    let l =
      /^#{1,6}\s+.*(hướng dẫn chấm|đáp án|lời giải|barem|thang điểm|bài làm mẫu)/i;
    function s(t) {
      if (!t.trimStart().startsWith("```rich-block\n")) return null;
      try {
        let e = JSON.parse(t.trim().split("\n").slice(1, -1).join("\n"));
        return e && "object" == typeof e ? e : null;
      } catch {
        return null;
      }
    }
    function o(t, e = 0) {
      return e > 32
        ? ""
        : "string" == typeof t.text
          ? t.text
          : Array.isArray(t.content)
            ? t.content
                .map((t) => o(t, e + 1))
                .join(
                  ["paragraph", "heading"].includes(t.type ?? "") ? "" : " ",
                )
                .trim()
            : "";
    }
    function c(t) {
      let e = s(t);
      return e ? o(e) : r(t.split("\n", 1)[0]);
    }
    t.s(
      [
        "describeSegment",
        0,
        a,
        "isHeading",
        0,
        function (t) {
          return /^#{1,6}\s/.test(t.trimStart()) || s(t)?.type === "heading";
        },
        "isQuestionStart",
        0,
        function (t) {
          return n.test(c(t));
        },
        "plainText",
        0,
        r,
        "questionLabel",
        0,
        function (t) {
          let e = n.exec(c(t));
          return e ? e[0].replace(/\s+/g, " ") : "";
        },
        "segmentFirstText",
        0,
        c,
        "solutionStart",
        0,
        function (t) {
          let e = t.findIndex(
            (t, e) =>
              e > 0 &&
              (l.test(t.trimStart()) ||
                (s(t)?.type === "heading" &&
                  /hướng dẫn chấm|đáp án|lời giải|barem|thang điểm|bài làm mẫu/i.test(
                    c(t),
                  ))),
          );
          if (e < 0) return -1;
          let r = e;
          for (; r > 0; ) {
            let e = a(t[r - 1]).kind;
            if ("ngắt trang" !== e && "đầu đề" !== e) break;
            r--;
          }
          return r;
        },
        "splitSegmentRanges",
        0,
        e,
        "splitSegments",
        0,
        function (t) {
          return e(t).map(({ from: e, to: r }) =>
            t.slice(e, r).replace(/\r\n?/g, "\n"),
          );
        },
      ],
      482534,
    );
    let u = (t, e) => {
        let r = 1;
        for (
          let n = t.indexOf("\n");
          n >= 0 && n < e;
          n = t.indexOf("\n", n + 1)
        )
          r++;
        return r;
      },
      h = "exam-chat-add-reference",
      d = "exam-chat-send";
    t.s(
      [
        "ADD_REFERENCE_EVENT",
        0,
        h,
        "MAX_REFERENCES",
        0,
        5,
        "SEND_CHAT_EVENT",
        0,
        d,
        "locateReference",
        0,
        function (t, r, n) {
          let i,
            a = r.trim();
          if (!a) return null;
          let l = -1,
            s = -1,
            o = t.indexOf(a);
          if (o >= 0) ((l = o), (s = o + a.length));
          else {
            let e = a
                .split("\n")
                .map((t) => t.trim())
                .filter(Boolean),
              r = e[0] ?? "",
              i = e[e.length - 1] ?? "",
              o = r ? t.indexOf(r) : -1,
              c = i && o >= 0 ? t.indexOf(i, o) : -1;
            o >= 0 && c >= o
              ? ((l = o), (s = c + i.length))
              : n &&
                ((l = Math.max(0, n.start)),
                (s = Math.min(t.length, Math.max(n.end, l + 1))));
          }
          if (l < 0) return null;
          let c = e(t),
            h = c.flatMap((t, e) => (t.from < s && t.to > l ? [e + 1] : [])),
            d = h[0] ?? Math.max(1, c.findIndex((t) => t.from >= l) + 1),
            p = h[h.length - 1] ?? d;
          return {
            startLine: u(t, l),
            endLine: u(t, Math.max(l, s - 1)),
            fromSegment: d,
            toSegment: p,
            preview:
              (i = a
                .replace(
                  /<(geometry|diagram|graph|chart)>[\s\S]*?<\/\1>/g,
                  "[hình]",
                )
                .replace(/\s+/g, " ")
                .trim()).length > 140
                ? `${i.slice(0, 140)}…`
                : i,
            text:
              a.length > 6e3
                ? `${a.slice(0, 6e3)}
…(đ\xe3 cắt)`
                : a,
          };
        },
        "readLines",
        0,
        function (t, e, r) {
          let n = t.split(/\r\n|\r|\n/),
            i = Math.min(Math.max(1, Math.floor(e) || 1), n.length),
            a = Math.min(Math.max(i, Math.floor(r) || i), n.length);
          return {
            text: n.slice(i - 1, a).join("\n"),
            from: i,
            to: a,
            total: n.length,
          };
        },
        "referenceLabel",
        0,
        function (t) {
          return t.startLine === t.endLine
            ? `D\xf2ng ${t.startLine}`
            : `D\xf2ng ${t.startLine}–${t.endLine}`;
        },
        "referencesPayload",
        0,
        function (t) {
          return (t ?? [])
            .slice(0, 5)
            .map(
              ({
                id: t,
                startLine: e,
                endLine: r,
                fromSegment: n,
                toSegment: i,
                preview: a,
              }) => ({
                ref: t,
                startLine: e,
                endLine: r,
                fromSegment: n,
                toSegment: i,
                preview: a,
              }),
            );
        },
        "requestAddReference",
        0,
        function (t) {
          window.dispatchEvent(new CustomEvent(h, { detail: t }));
        },
        "requestChatSend",
        0,
        function (t) {
          window.dispatchEvent(new CustomEvent(d, { detail: t }));
        },
        "sameReference",
        0,
        function (t, e) {
          return (
            t.startLine === e.startLine &&
            t.endLine === e.endLine &&
            t.text === e.text
          );
        },
      ],
      871813,
    );
  },
  959696,
  (t) => {
    "use strict";
    var e = t.i(954206);
    let r = "[[ẢNH]]";
    function n(t) {
      return t.trim().length >= 3;
    }
    let i = new Map(),
      a = new Set(),
      l = /^\s*(?:\*\*|__)?\s*(?:Câu|Bài|Question|CÂU|BÀI)\s+\d+/,
      s = /^#{1,6}\s/,
      o = /\(data:[^)\s]*\)/g;
    t.s([
      "IMAGE_CONCURRENCY",
      0,
      2,
      "IMAGE_MARKER",
      0,
      r,
      "canDrawImage",
      0,
      n,
      "imageContext",
      0,
      function (t, n) {
        var i;
        let a = ((i = n.alt), (0, e.imageAlt)(i)),
          c = t.replace(o, "()").split("\n"),
          u = c.findIndex((t) =>
            (function (t, e, r) {
              let n = t.indexOf(`![${e}](`);
              if (n < 0) return !1;
              let i = t.slice(n + e.length + 4);
              return r ? i.startsWith(r) : i.startsWith(")");
            })(t, a, n.src),
          ),
          h = "";
        if (u < 0) {
          let t = `"src":${JSON.stringify(n.src)},"alt":${JSON.stringify(n.alt)}`;
          if ((u = c.findIndex((e) => e.startsWith("{") && e.includes(t))) < 0)
            return "";
          let e = [
              ...c[u].matchAll(
                /"type":"examImage","attrs":\{"src":("(?:[^"\\]|\\.)*"),"alt":("(?:[^"\\]|\\.)*")/g,
              ),
            ],
            i = !1;
          h = e
            .map((t, e) => {
              let a = JSON.parse(t[2]),
                l = !i && JSON.parse(t[1]) === n.src && a === n.alt;
              return (l && (i = !0), `\xd4 ảnh ${e + 1}: ${l ? r : a}`);
            })
            .join("\n");
        }
        let d = (t) => l.test(t) || s.test(t.trim()),
          p = u;
        for (; p > 0 && !d(c[p]); ) p--;
        let f = u + 1;
        for (; f < c.length && !d(c[f]); ) f++;
        if (
          f < c.length &&
          l.test(c[f]) &&
          !c.slice(u + 1, f).some((t) => t.trim())
        )
          for (f++; f < c.length && !d(c[f]); ) f++;
        let m = `![${a}](`,
          g = c
            .slice(p, f)
            .map((t, e) => {
              if (p + e !== u) return t;
              if (h) return h;
              let n = t.indexOf(m),
                i = t.indexOf(")", n + m.length),
                a = /^\{[^}\n]*\}/.exec(t.slice(i + 1));
              return t.slice(0, n) + r + t.slice(i + 1 + (a ? a[0].length : 0));
            })
            .join("\n")
            .trim();
        if (g.length <= 2800) return g;
        let b = Math.max(0, Math.min(g.indexOf(r) - 1400, g.length - 2800));
        return g.slice(b, b + 2800);
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
      function (t, e, r = 8) {
        let i = new Set(t),
          a = [];
        for (let t of e)
          if (!i.has(t) && n(t) && (i.add(t), a.push(t), a.length >= r)) break;
        return a;
      },
      "setImageJob",
      0,
      function (t, e) {
        for (let r of (e ? i.set(t, e) : i.delete(t), a)) r();
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
          a.add(t),
          () => {
            a.delete(t);
          }
        );
      },
    ]);
  },
  636607,
  (t) => {
    "use strict";
    var e = t.i(843476),
      r = t.i(716400),
      n = t.i(271645);
    t.i(148043);
    var i = t.i(378610);
    function a(t, e, a) {
      return (0, n.useMemo)(
        () =>
          r.default.renderToString(
            (0, i.spaceMatrixRows)((0, i.normalizeLatex)(t)),
            {
              displayMode: e,
              errorColor: a,
              throwOnError: !1,
              strict: !1,
              output: "html",
            },
          ),
        [t, e, a],
      );
    }
    t.s([
      "BlockMath",
      0,
      function ({ math: t, errorColor: r = "#dc2626" }) {
        let n = a(t, !0, r);
        return (0, e.jsx)("div", { dangerouslySetInnerHTML: { __html: n } });
      },
      "InlineMath",
      0,
      function ({ math: t, errorColor: r = "#dc2626" }) {
        let n = a(t, !1, r);
        return (0, e.jsx)("span", { dangerouslySetInnerHTML: { __html: n } });
      },
    ]);
  },
  743232,
  119076,
  627380,
  (t) => {
    "use strict";
    var e = t.i(843476),
      r = t.i(271645);
    let n = 0,
      i = !1,
      a = new Set();
    function l() {
      if (i || !window.mathVirtualKeyboard) return;
      i = !0;
      let t = window.mathVirtualKeyboard,
        e = () => {
          let e = t.visible ? Math.round(t.boundingRect.height) : 0;
          if (e !== n)
            for (let t of ((n = e),
            document.documentElement.style.setProperty(
              "--math-keyboard-height",
              `${e}px`,
            ),
            a))
              t();
        };
      (t.addEventListener("geometrychange", e),
        t.addEventListener("virtual-keyboard-toggle", e),
        e());
    }
    t.s(
      [
        "bindMathKeyboard",
        0,
        l,
        "mathKeyboardHeight",
        0,
        () => n,
        "subscribeMathKeyboard",
        0,
        function (t) {
          return (a.add(t), () => a.delete(t));
        },
      ],
      119076,
    );
    let s = "\\placeholder{}",
      o = {
        sqrt: 1,
        frac: 2,
        dfrac: 2,
        tfrac: 2,
        cfrac: 2,
        binom: 2,
        dbinom: 2,
        tbinom: 2,
        overline: 1,
        underline: 1,
        widehat: 1,
        widetilde: 1,
        hat: 1,
        bar: 1,
        vec: 1,
        dot: 1,
        ddot: 1,
        overrightarrow: 1,
        overleftarrow: 1,
        overleftrightarrow: 1,
      },
      c = new Set([
        "text",
        "textrm",
        "textsf",
        "texttt",
        "textnormal",
        "textbf",
        "textit",
        "textup",
        "operatorname",
        "mbox",
        "hbox",
        "ce",
        "url",
        "href",
      ]);
    function u(t, e) {
      let r = t[e],
        n = "[" === r ? "]" : "}",
        i = 1;
      for (let a = e + 1; a < t.length; a++) {
        if ("\\" === t[a]) {
          a++;
          continue;
        }
        if (t[a] === r) i++;
        else if (t[a] === n && 0 == --i) return a;
      }
      return -1;
    }
    function h(t) {
      let e = new Map(),
        r = (e) => {
          for (; /\s/.test(t[e] ?? "") && e < t.length; ) e++;
          return e;
        },
        n = (r, n) => {
          t.slice(r + 1, n).trim() || e.set(r + 1, n);
        };
      for (let e = 0; e < t.length; e++) {
        if ("^" === t[e] || "_" === t[e]) {
          let i = r(e + 1);
          if ("{" === t[i]) {
            let e = u(t, i);
            e >= 0 && n(i, e);
          }
          continue;
        }
        if ("\\" !== t[e]) continue;
        let i = /^[a-zA-Z]+/.exec(t.slice(e + 1))?.[0];
        if (!i) {
          e++;
          continue;
        }
        let a = r((e += i.length) + 1);
        if (c.has(i) && "{" === t[a]) {
          let r = u(t, a);
          r >= 0 && (e = r);
          continue;
        }
        if ("sqrt" === i && "[" === t[a]) {
          let e = u(t, a);
          if (e < 0) continue;
          (n(a, e), (a = r(e + 1)));
        }
        for (let e = 0; e < (o[i] ?? 0) && "{" === t[a]; e++) {
          let e = u(t, a);
          if (e < 0) break;
          (n(a, e), (a = r(e + 1)));
        }
      }
      let i = t;
      for (let [t, r] of [...e].sort(([t], [e]) => e - t))
        i = i.slice(0, t) + s + i.slice(r);
      return i;
    }
    var d = t.i(368308),
      p = t.i(636607);
    let f = (t, e, r) => ({ latex: t, title: e, preview: r }),
      m = [
        {
          id: "basic",
          label: "Cơ bản",
          symbols: [
            f("\\frac{#@}{#?}", "Phân số", "\\frac{a}{b}"),
            f("\\sqrt{#?}", "Căn bậc hai", "\\sqrt{x}"),
            f("\\sqrt[#?]{#?}", "Căn bậc n", "\\sqrt[n]{x}"),
            f("^{#?}", "Luỹ thừa", "x^{n}"),
            f("_{#?}", "Chỉ số dưới", "x_{n}"),
            f("^{2}", "Bình phương", "x^{2}"),
            f("\\left|#?\\right|", "Giá trị tuyệt đối", "|x|"),
            f("\\left(#?\\right)", "Ngoặc tròn", "(\\ )"),
            f("\\cdot ", "Nhân", "\\cdot"),
            f("\\times ", "Nhân chéo", "\\times"),
            f("\\div ", "Chia", "\\div"),
            f("\\pm ", "Cộng trừ", "\\pm"),
            f("\\infty ", "Vô cùng", "\\infty"),
            f("\\%", "Phần trăm", "\\%"),
          ],
        },
        {
          id: "relation",
          label: "So sánh",
          symbols: [
            f("\\ne ", "Khác", "\\ne"),
            f("\\le ", "Nhỏ hơn hoặc bằng", "\\le"),
            f("\\ge ", "Lớn hơn hoặc bằng", "\\ge"),
            f("\\approx ", "Xấp xỉ", "\\approx"),
            f("\\equiv ", "Đồng dư", "\\equiv"),
            f("\\Rightarrow ", "Suy ra", "\\Rightarrow"),
            f("\\Leftrightarrow ", "Tương đương", "\\Leftrightarrow"),
            f("\\rightarrow ", "Mũi tên", "\\rightarrow"),
            f("\\in ", "Thuộc", "\\in"),
            f("\\notin ", "Không thuộc", "\\notin"),
            f("\\subset ", "Tập con", "\\subset"),
            f("\\cup ", "Hợp", "\\cup"),
            f("\\cap ", "Giao", "\\cap"),
            f("\\emptyset ", "Tập rỗng", "\\emptyset"),
            f("\\forall ", "Với mọi", "\\forall"),
            f("\\exists ", "Tồn tại", "\\exists"),
          ],
        },
        {
          id: "calculus",
          label: "Hàm & giải tích",
          symbols: [
            f("\\sin\\left(#?\\right)", "Sin", "\\sin"),
            f("\\cos\\left(#?\\right)", "Cos", "\\cos"),
            f("\\tan\\left(#?\\right)", "Tan", "\\tan"),
            f("\\log_{#?}\\left(#?\\right)", "Logarit", "\\log_a"),
            f("\\ln\\left(#?\\right)", "Logarit tự nhiên", "\\ln"),
            f("\\lim_{x\\to #?}", "Giới hạn", "\\lim"),
            f("\\sum_{i=#?}^{#?}", "Tổng", "\\sum"),
            f("\\prod_{i=#?}^{#?}", "Tích", "\\prod"),
            f("\\int_{#?}^{#?}", "Tích phân", "\\int"),
            f("\\frac{d}{dx}", "Đạo hàm", "\\frac{d}{dx}"),
            f("f'\\left(x\\right)", "f phẩy", "f'"),
            f("C_{#?}^{#?}", "Tổ hợp chập k của n", "C_n^k"),
            f("A_{#?}^{#?}", "Chỉnh hợp chập k của n", "A_n^k"),
            f("!", "Giai thừa", "n!"),
            f("\\binom{#?}{#?}", "Nhị thức", "\\binom{n}{k}"),
          ],
        },
        {
          id: "greek",
          label: "Chữ Hy Lạp",
          symbols: [
            "alpha",
            "beta",
            "gamma",
            "delta",
            "varepsilon",
            "theta",
            "lambda",
            "mu",
            "pi",
            "rho",
            "sigma",
            "varphi",
            "omega",
            "Delta",
            "Sigma",
            "Omega",
          ].map((t) => f(`\\${t} `, t, `\\${t}`)),
        },
        {
          id: "geometry",
          label: "Hình học",
          symbols: [
            f("\\widehat{#?}", "Góc", "\\widehat{A}"),
            f("\\angle ", "Ký hiệu góc", "\\angle"),
            f("\\overrightarrow{#?}", "Vectơ", "\\vec{v}"),
            f("\\overline{#?}", "Đoạn thẳng", "\\overline{AB}"),
            f("^{\\circ}", "Độ", "^{\\circ}"),
            f("\\perp ", "Vuông góc", "\\perp"),
            f("\\parallel ", "Song song", "\\parallel"),
            f("\\triangle ", "Tam giác", "\\triangle"),
            f("\\cong ", "Bằng nhau", "\\cong"),
            f("\\sim ", "Đồng dạng", "\\sim"),
          ],
        },
      ];
    function g({ onInsert: t, onToggleKeyboard: n, size: i = "md" }) {
      let [a, l] = (0, r.useState)(m[0].id),
        s = "sm" === i;
      return (0, e.jsxs)("div", {
        className:
          "shrink-0 overflow-hidden rounded-lg border border-neutral-200",
        children: [
          (0, e.jsxs)("div", {
            className:
              "flex items-center border-b border-neutral-200 bg-neutral-50",
            children: [
              (0, e.jsx)("div", {
                className:
                  "flex min-w-0 flex-1 gap-1 overflow-x-auto p-1 [scrollbar-width:none] max-sm:pr-6 max-sm:[mask-image:linear-gradient(to_right,#000_calc(100%-1.5rem),transparent)] [&::-webkit-scrollbar]:hidden",
                role: "tablist",
                "aria-label": "Nhóm ký hiệu",
                children: m.map((t) =>
                  (0, e.jsx)(
                    "button",
                    {
                      type: "button",
                      role: "tab",
                      "aria-selected": a === t.id,
                      onMouseDown: (t) => t.preventDefault(),
                      onClick: () => l(t.id),
                      className: `shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-colors [@media(pointer:coarse)]:py-2 [@media(pointer:coarse)]:text-sm ${a === t.id ? "bg-white text-blue-700 shadow-xs" : "text-neutral-600 hover:bg-neutral-200/70"}`,
                      children: t.label,
                    },
                    t.id,
                  ),
                ),
              }),
              n &&
                (0, e.jsx)("button", {
                  type: "button",
                  onMouseDown: (t) => t.preventDefault(),
                  onClick: n,
                  title: "Bàn phím toán",
                  "aria-label": "Bật/tắt bàn phím toán",
                  className:
                    "mr-1 hidden shrink-0 items-center gap-1 rounded-md px-2 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200/70 [@media(pointer:coarse)]:flex",
                  children: (0, e.jsx)(d.Keyboard, {
                    "aria-hidden": !0,
                    className: "size-4",
                  }),
                }),
            ],
          }),
          (0, e.jsx)("div", {
            className: s
              ? "grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-0.5 p-1"
              : "grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1 p-1.5 sm:grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] sm:p-2",
            role: "tabpanel",
            children: m
              .find((t) => t.id === a)
              ?.symbols.map((r) =>
                (0, e.jsx)(
                  "button",
                  {
                    type: "button",
                    title: r.title,
                    "aria-label": r.title,
                    onMouseDown: (t) => t.preventDefault(),
                    onClick: () => t(r.latex),
                    className: `flex items-center justify-center overflow-hidden rounded-md border border-transparent text-neutral-800 transition-colors hover:border-blue-200 hover:bg-blue-50 active:bg-blue-100 [@media(pointer:coarse)]:h-11 ${s ? "h-9 text-sm" : "h-10 text-base"}`,
                    children: (0, e.jsx)(p.InlineMath, {
                      math: r.preview ?? r.latex,
                    }),
                  },
                  r.latex,
                ),
              ),
          }),
        ],
      });
    }
    function b(t) {
      let e = window.mathVirtualKeyboard;
      e && (e.visible ? e.hide() : (t(), e.show()));
    }
    t.s(["FormulaPalette", 0, g, "toggleMathKeyboard", 0, b], 627380);
    let x = `
:host { --eb-math-caret-width: clamp(1px, 0.045em, 2px); }
.ML__content .ML__caret::after, .ML__content .ML__text-caret::after {
  --_caret-width: var(--eb-math-caret-width);
  height: 0.66em;
  left: 0;
  bottom: -0.02em;
}
.ML__content .ML__latex-caret::after { --_caret-width: var(--eb-math-caret-width); }
:is(span:has(> .ML__sqrt-sign), .ML__mfrac, .ML__msubsup, .ML__left-right) + .ML__caret {
  margin-left: 0.18em;
}
.ML__focused .ML__contains-highlight {
  background: hsl(212, 95%, 95%);
  box-shadow: inset 0 0 0 1px hsl(212, 75%, 78%);
  border-radius: 4px;
}
/* Font IME v\xe0 \xf4 trống thay đổi sau khi MathLive đo overlay. Đặt khung l\xean
   nh\xf3m thật để n\xf3 lu\xf4n \xf4m đ\xfang c\xf4ng thức đang gh\xe9p, kể cả khi cuộn/ph\xf3ng to. */
.ML__content:has(.ML__composition) > .ML__contains-highlight { display: none; }
.ML__focused .eb-ime-group {
  background: hsl(212, 95%, 95%);
  box-shadow: inset 0 0 0 1px hsl(212, 75%, 78%);
  border-radius: 4px;
}
.ML__content-placeholder .ML__text { background: transparent !important; }
.ML__selection, .ML__contains-highlight { pointer-events: none; }
/* MathLive d\xf9ng font hệ thống + nền v\xe0ng cho chữ IME chưa chốt. Giữ c\xf9ng
   font to\xe1n khi g\xf5 tiếng Việt, nhưng vẫn để bộ g\xf5 tự gh\xe9p v\xe0 chốt chữ. */
.ML__composition.eb-ime-math {
  font-family: KaTeX_Main, "Times New Roman", serif;
  font-style: normal;
  background: transparent;
  color: var(--selection-color, #000);
  text-decoration: none;
}
.ML__composition.eb-ime-variable {
  font-family: KaTeX_Math, "Times New Roman", serif;
  font-style: italic;
}
.eb-ph {
  color: transparent !important;
  opacity: 1 !important;
  position: relative;
  display: inline-block;
  width: max(0.72em, 8px);
  height: max(0.84em, 10px);
  margin: 0 0.06em;
  vertical-align: -0.16em;
}
.eb-ph::before {
  content: '';
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  border: 1.5px dashed hsl(215, 14%, 66%);
  border-radius: 3px;
  background: hsl(215, 30%, 97%);
  pointer-events: none;
}
/* \xd4 trống vẫn nằm trong m\xf4 h\xecnh để huỷ nhập/undo giữ nguy\xean cấu tr\xfac.
   Chỉ ẩn phần vẽ khi bộ g\xf5 đang ch\xe8n chữ ngay trước n\xf3. */
.ML__composition:not(:empty) + .eb-ph,
.ML__composition:not(:empty) + .ML__caret + .eb-ph { display: none; }
.ML__composition:empty,
.ML__composition:empty + .ML__caret { display: none; }
:host([data-placeholder-caret]) .ML__selection { display: none !important; }
:host([data-placeholder-caret]) .eb-ph.ML__selected::before,
.ML__composition:empty + .ML__caret + .eb-ph::before {
  border: 1.5px solid hsl(212, 80%, 52%);
  background: hsl(212, 90%, 96%);
}
.ML__focused .eb-ph.ML__selected::after,
.ML__focused .ML__composition:empty + .ML__caret + .eb-ph::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 14%;
  bottom: 14%;
  width: var(--eb-math-caret-width);
  margin-left: calc(-0.5 * var(--eb-math-caret-width));
  border-radius: 1px;
  background: hsl(212, 80%, 45%);
  animation: ML__caret-blink 1.05s step-end infinite;
  pointer-events: none;
}
`,
      y = ["AA", "EE", "ee", "oo", "xx"];
    t.s(
      [
        "MathLiveInput",
        0,
        function ({
          value: n,
          onChange: i,
          autoFocus: a,
          className: o,
          compact: c,
          placeholder: u,
          placeholderText: d,
          title: p,
          toolbar: f = !0,
          handleRef: m,
        }) {
          let v = (0, r.useRef)(null),
            w = (0, r.useRef)(null),
            k = (0, r.useRef)(i),
            M = (0, r.useRef)(n),
            $ = (t) => {
              let e = t.getValue("latex-without-placeholders");
              ((M.current = e), k.current(e));
            };
          ((0, r.useEffect)(() => {
            k.current = i;
          }, [i]),
            (0, r.useEffect)(() => {
              let e = !1,
                r = () => {},
                i = v.current;
              return (
                t.A(200785).then(({ MathfieldElement: t }) => {
                  let f, m, g, b, v, k, M, L, _, j, S;
                  if (e || !i) return;
                  ((t.fontsDirectory = "/fonts"),
                    (t.soundsDirectory = null),
                    l());
                  let C = new t();
                  ((C.className =
                    o ??
                    (c
                      ? "block w-full rounded-md border border-neutral-300 bg-white px-1.5 py-0.5 text-sm leading-tight text-neutral-900 focus:border-blue-500"
                      : "block w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-base text-neutral-900 focus:border-blue-500")),
                    u && C.setAttribute("placeholder", d ? `\\text{${u}}` : u),
                    p && C.setAttribute("title", p),
                    i.replaceChildren(C));
                  try {
                    ((C.mathVirtualKeyboardPolicy = window.matchMedia(
                      "(pointer: coarse)",
                    ).matches
                      ? "auto"
                      : "manual"),
                      (C.menuItems = []),
                      (C.inlineShortcuts = Object.fromEntries(
                        Object.entries(C.inlineShortcuts).filter(
                          ([t]) => !y.includes(t),
                        ),
                      )));
                  } catch {}
                  ((C.value = h(n)),
                    C.addEventListener("input", (t) => {
                      (t.inputType?.startsWith("delete") &&
                        (function (t) {
                          if ("math" !== t.mode || !t.selectionIsCollapsed)
                            return;
                          let e = t.getElementInfo(t.position),
                            r = t.getElementInfo(t.position + 1);
                          e?.latex === "" &&
                            e.depth &&
                            r &&
                            void 0 !== r.depth &&
                            (r.depth < e.depth ||
                              (r.depth === e.depth && "" === r.latex)) &&
                            t.insert(s, {
                              selectionMode: "placeholder",
                              silenceNotifications: !0,
                            });
                        })(C),
                        $(C));
                    }));
                  let E = (function (t) {
                      let e = t.shadowRoot;
                      if (!e) return () => {};
                      let r = document.createElement("style");
                      ((r.textContent = x), e.append(r));
                      let n = () => {
                          let r = e.querySelector(".ML__content");
                          if (!r) return;
                          for (let t of Array.from(r.querySelectorAll("span")))
                            0 === t.childElementCount &&
                              "▢" === t.textContent &&
                              t.classList.add("eb-ph");
                          for (let t of Array.from(
                            r.querySelectorAll(".eb-ime-group"),
                          ))
                            t.classList.remove("eb-ime-group");
                          for (let e of Array.from(
                            r.querySelectorAll(".ML__composition"),
                          )) {
                            let r = "math" === t.mode;
                            (e.classList.toggle("eb-ime-math", r),
                              e.classList.toggle(
                                "eb-ime-variable",
                                r && /^[a-z]+$/i.test(e.textContent ?? ""),
                              ),
                              r &&
                                e
                                  .closest(".ML__contains-caret")
                                  ?.classList.add("eb-ime-group"));
                          }
                          let n = Array.from(
                            r.querySelectorAll(".ML__selected"),
                          ).filter((t) => 0 === t.childElementCount);
                          t.toggleAttribute(
                            "data-placeholder-caret",
                            n.length > 0 &&
                              n.every((t) => t.classList.contains("eb-ph")),
                          );
                        },
                        i = new MutationObserver(n);
                      return (
                        i.observe(e, {
                          childList: !0,
                          characterData: !0,
                          subtree: !0,
                        }),
                        n(),
                        () => {
                          (i.disconnect(), r.remove());
                        }
                      );
                    })(C),
                    A =
                      ((b = !1),
                      (v = !1),
                      (k = () => {
                        ((m = void 0), clearTimeout(g));
                      }),
                      (M = () => {
                        ((b = !1), (v = !1), clearTimeout(f), k());
                      }),
                      (L = () => {
                        (M(),
                          (b = !0),
                          "math" !== C.mode ||
                            C.selectionIsCollapsed ||
                            ("\\placeholder{}" ===
                              C.getValue(C.selection, "latex") &&
                              (C.position = Math.min(
                                ...C.selection.ranges[0],
                              ))));
                      }),
                      (_ = (t) => {
                        (k(),
                          clearTimeout(f),
                          (v =
                            ("Space" === t.code ||
                              " " === t.key ||
                              "Spacebar" === t.key ||
                              32 === t.keyCode) &&
                            (b || t.isComposing || 229 === t.keyCode) &&
                            !t.ctrlKey &&
                            !t.metaKey &&
                            !t.altKey &&
                            "math" === C.mode));
                      }),
                      (j = (t) => {
                        let e = v;
                        ((b = !1),
                          (v = !1),
                          k(),
                          t.data && ((m = t.data), (g = setTimeout(k))),
                          !e ||
                            !t.data ||
                            t.data.endsWith(" ") ||
                            (f = setTimeout(() => {
                              C.isConnected &&
                                "math" === C.mode &&
                                C.executeCommand("moveAfterParent");
                            })));
                      }),
                      (S = (t) => {
                        let e = t.composedPath()[0];
                        if (
                          !e?.matches?.('[part="keyboard-sink"]') ||
                          void 0 === m ||
                          ("insertCompositionText" === t.inputType &&
                            t.data === m)
                        )
                          return;
                        let r =
                          t.data === m &&
                          ("insertText" === t.inputType ||
                            "insertFromComposition" === t.inputType ||
                            "" === t.inputType);
                        (k(),
                          r &&
                            ((e.textContent = ""),
                            t.stopImmediatePropagation()));
                      }),
                      C.addEventListener("keydown", _, { capture: !0 }),
                      C.addEventListener("compositionstart", L, {
                        capture: !0,
                      }),
                      C.addEventListener("compositionend", j, { capture: !0 }),
                      C.addEventListener("input", S, { capture: !0 }),
                      C.addEventListener("pointerdown", k, { capture: !0 }),
                      C.addEventListener("blur", M, { capture: !0 }),
                      () => {
                        (M(),
                          C.removeEventListener("keydown", _, { capture: !0 }),
                          C.removeEventListener("compositionstart", L, {
                            capture: !0,
                          }),
                          C.removeEventListener("compositionend", j, {
                            capture: !0,
                          }),
                          C.removeEventListener("input", S, { capture: !0 }),
                          C.removeEventListener("pointerdown", k, {
                            capture: !0,
                          }),
                          C.removeEventListener("blur", M, { capture: !0 }));
                      });
                  ((r = () => {
                    (E(), A());
                  }),
                    a && C.focus(),
                    (w.current = C));
                }),
                () => {
                  ((e = !0),
                    r(),
                    (w.current = null),
                    i?.replaceChildren(),
                    document.querySelector("math-field") ||
                      window.mathVirtualKeyboard?.hide());
                }
              );
            }, []),
            (0, r.useEffect)(() => {
              let t = w.current;
              t &&
                n !== M.current &&
                ((M.current = n),
                t.getValue("latex-without-placeholders") !== n &&
                  (t.value = h(n)));
            }, [n]));
          let L = (t) => {
            let e = w.current;
            e && (e.insert(h(t), { focus: !0 }), $(e));
          };
          return ((0, r.useEffect)(() => {
            if (m)
              return (
                (m.current = { insert: L, focus: () => w.current?.focus() }),
                () => {
                  m.current = null;
                }
              );
          }),
          c)
            ? (0, e.jsx)("div", {
                ref: v,
                className: "w-full [&>math-field]:min-h-0",
              })
            : (0, e.jsxs)("div", {
                className: "flex w-full flex-col gap-2",
                children: [
                  (0, e.jsx)("div", {
                    ref: v,
                    className: "min-h-[46px] w-full",
                  }),
                  f &&
                    (0, e.jsx)(g, {
                      size: "sm",
                      onInsert: L,
                      onToggleKeyboard: () => b(() => w.current?.focus()),
                    }),
                ],
              });
        },
      ],
      743232,
    );
  },
  604131,
  (t) => {
    "use strict";
    var e = t.i(843476),
      r = t.i(271645),
      n = t.i(636607);
    let i = /^::(left|center|right|justify)::[ \t]?/;
    function a(t) {
      let e = i.exec(t);
      return e
        ? { align: e[1], text: t.slice(e[0].length) }
        : { align: void 0, text: t };
    }
    function l(t) {
      return !!t && /<[a-z][\s\S]*>/i.test(t);
    }
    let s =
      /^\s*<(?:p|div|li|blockquote|h[1-6])\b[\s\S]*<\/(?:p|div|li|blockquote|h[1-6])>\s*$/i;
    class o extends r.Component {
      constructor(t) {
        (super(t), (this.state = { hasError: !1 }));
      }
      static getDerivedStateFromError() {
        return { hasError: !0 };
      }
      render() {
        return this.state.hasError
          ? (0, e.jsxs)("span", {
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
    function u({ math: t }) {
      let r = t.trim();
      if (!r) return null;
      let i = r.replace(/\\ne\b/g, "\\neq");
      return (0, e.jsx)(o, {
        fallbackText: r,
        children: (0, e.jsx)(n.InlineMath, { math: i, errorColor: "#dc2626" }),
      });
    }
    function h({ math: t }) {
      let r = t.trim();
      if (!r) return null;
      let i = r.replace(/\\ne\b/g, "\\neq");
      return (0, e.jsx)(o, {
        fallbackText: r,
        children: (0, e.jsx)(n.BlockMath, { math: i, errorColor: "#dc2626" }),
      });
    }
    let d = {
      left: "block text-left",
      center: "block text-center",
      right: "block text-right",
      justify: "block text-justify",
    };
    function p(t) {
      return t
        ? (function (t) {
            let e = t;
            for (let [t, r] of c) e = e.replace(t, r);
            return e;
          })(t)
            .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
            .map((t, n) =>
              t.startsWith("**") && t.endsWith("**") && t.length > 4
                ? (0, e.jsx)("strong", { children: t.slice(2, -2) }, n)
                : t.startsWith("*") && t.endsWith("*") && t.length > 2
                  ? (0, e.jsx)("em", { children: t.slice(1, -1) }, n)
                  : (0, e.jsx)(r.Fragment, { children: t }, n),
            )
        : null;
    }
    t.s(
      [
        "RichText",
        0,
        function ({ text: t }) {
          return t
            ? (0, e.jsx)(e.Fragment, {
                children: (function (t) {
                  if (!t) return null;
                  let n = (function (t) {
                    if (!t || !l(t)) return t;
                    let e = t.split("\n");
                    return e.some((t) => void 0 !== a(t).align)
                      ? e
                          .map((t) => {
                            let { align: e, text: r } = a(t);
                            if (!e && s.test(r)) return r;
                            let n = e ? ` style="text-align: ${e}"` : "",
                              i = r
                                ? r
                                    .replace(
                                      /\*\*([^*]+)\*\*/g,
                                      "<strong>$1</strong>",
                                    )
                                    .replace(
                                      /(^|[^*])\*([^*]+)\*/g,
                                      "$1<em>$2</em>",
                                    )
                                : "<br>";
                            return `<p${n}>${i}</p>`;
                          })
                          .join("")
                      : t;
                  })(t);
                  if (l(n))
                    return Array.from(
                      new DOMParser().parseFromString(
                        `<body>${n}</body>`,
                        "text/html",
                      ).body.childNodes,
                    ).map((t, n) =>
                      (function t(n, i) {
                        if (n.nodeType === Node.TEXT_NODE) {
                          var a;
                          let t = n.textContent || "";
                          return (0, e.jsx)(
                            r.Fragment,
                            {
                              children: (a = t)
                                ? a
                                    .split(/\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g)
                                    .map((t, n) =>
                                      void 0 === t
                                        ? null
                                        : n % 3 == 1
                                          ? (0, e.jsx)(
                                              h,
                                              { math: t },
                                              `disp-${n}`,
                                            )
                                          : n % 3 == 2
                                            ? (0, e.jsx)(
                                                u,
                                                { math: t },
                                                `inl-${n}`,
                                              )
                                            : (0, e.jsx)(
                                                r.Fragment,
                                                { children: p(t) },
                                                `t-${n}`,
                                              ),
                                    )
                                : null,
                            },
                            i,
                          );
                        }
                        if (n.nodeType === Node.ELEMENT_NODE) {
                          let a = n.tagName.toLowerCase();
                          if (
                            "math" === n.getAttribute("data-type") ||
                            n.classList.contains("math-node")
                          ) {
                            let t = n.getAttribute("data-latex"),
                              r = "";
                            if (t) r = decodeURIComponent(t);
                            else {
                              let t = n.textContent || "",
                                e = /\$\$([\s\S]*?)\$\$|\$([^$]*)\$/g.exec(t);
                              r = e ? (e[1] ?? e[2] ?? "") : t;
                            }
                            return "true" === n.getAttribute("data-display")
                              ? (0, e.jsx)(h, { math: r }, i)
                              : (0, e.jsx)(u, { math: r }, i);
                          }
                          let l = Array.from(n.childNodes).map((e, r) =>
                              t(e, `${i}-${r}`),
                            ),
                            s = {};
                          (n.style.textAlign &&
                            (s.textAlign = n.style.textAlign),
                            n.style.fontSize && (s.fontSize = n.style.fontSize),
                            n.style.lineHeight &&
                              (s.lineHeight = n.style.lineHeight),
                            n.style.marginBottom &&
                              (s.marginBottom = n.style.marginBottom));
                          let o = Object.keys(s).length > 0 ? s : void 0;
                          switch (a) {
                            case "p":
                              return (0, e.jsx)(
                                "p",
                                {
                                  style: o,
                                  className:
                                    "center" === n.style.textAlign
                                      ? "text-center"
                                      : "right" === n.style.textAlign
                                        ? "text-right"
                                        : "justify" === n.style.textAlign
                                          ? "text-justify"
                                          : void 0,
                                  children:
                                    l.length > 0 ? l : (0, e.jsx)("br", {}),
                                },
                                i,
                              );
                            case "strong":
                            case "b":
                              return (0, e.jsx)(
                                "strong",
                                { style: o, children: l },
                                i,
                              );
                            case "em":
                            case "i":
                              return (0, e.jsx)(
                                "em",
                                { style: o, children: l },
                                i,
                              );
                            case "u":
                              return (0, e.jsx)(
                                "u",
                                { style: o, children: l },
                                i,
                              );
                            case "s":
                            case "strike":
                            case "del":
                              return (0, e.jsx)(
                                "s",
                                { style: o, children: l },
                                i,
                              );
                            case "sub":
                              return (0, e.jsx)(
                                "sub",
                                { style: o, children: l },
                                i,
                              );
                            case "sup":
                              return (0, e.jsx)(
                                "sup",
                                { style: o, children: l },
                                i,
                              );
                            case "br":
                              return (0, e.jsx)("br", {}, i);
                            case "span":
                              return (0, e.jsx)(
                                "span",
                                { style: o, children: l },
                                i,
                              );
                            default:
                              return (0, e.jsx)(r.Fragment, { children: l }, i);
                          }
                        }
                        return null;
                      })(t, n),
                    );
                  if (!n) return null;
                  let i = [],
                    o = n
                      .replace(
                        /\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g,
                        (t, r, n) => {
                          let a = i.length;
                          return (
                            void 0 !== r
                              ? i.push((0, e.jsx)(h, { math: r }, `bm-${a}`))
                              : i.push(
                                  (0, e.jsx)(u, { math: n ?? "" }, `im-${a}`),
                                ),
                            `\u0000MATH_${a}\u0000`
                          );
                        },
                      )
                      .split("\n")
                      .map(a);
                  return o.map((t, n) => {
                    var a, l;
                    let s = void 0 !== t.align,
                      c = o[n + 1]?.align !== void 0,
                      u =
                        ((a = t.text),
                        (l = i),
                        a
                          ? a
                              .split(/\u0000MATH_(\d+)\u0000/g)
                              .map((t, n) =>
                                n % 2 == 1
                                  ? (l[parseInt(t, 10)] ?? null)
                                  : (0, e.jsx)(
                                      r.Fragment,
                                      { children: p(t) },
                                      n,
                                    ),
                              )
                          : null);
                    return (0, e.jsxs)(
                      r.Fragment,
                      {
                        children: [
                          s
                            ? (0, e.jsx)("span", {
                                className: d[t.align],
                                children: u,
                              })
                            : u,
                          n < o.length - 1 && !s && !c && (0, e.jsx)("br", {}),
                        ],
                      },
                      n,
                    );
                  });
                })(t),
              })
            : null;
        },
      ],
      604131,
    );
  },
  235447,
  (t) => {
    "use strict";
    let e = ["ML__", "MLK__", "ML-"],
      r =
        ".ML__keyboard, .MLK__backdrop, .ML__menu, .ML__popover, #mathlive-suggestion-popover";
    function n(t) {
      if (!t || "object" != typeof t || 1 !== t.nodeType) return !1;
      if ("MATH-FIELD" === t.tagName) return !0;
      for (let r of Array.from(t.classList ?? []))
        if (e.some((t) => r.startsWith(t))) return !0;
      return !1;
    }
    t.s([
      "isMathLiveSurface",
      0,
      function (t) {
        if (
          ("function" == typeof t.composedPath ? t.composedPath() : []).some(n)
        )
          return !0;
        let e = t.target;
        if (!e || 1 !== e.nodeType) return !1;
        if (n(e) || ("function" == typeof e.closest && e.closest(r))) return !0;
        if ("u" > typeof document) {
          for (let t of Array.from(document.querySelectorAll(r)))
            if (t.contains(e)) return !0;
        }
        return !1;
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
      r = Object.values(e),
      n = {
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
    function a(t) {
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
                      (n) =>
                        n.type !==
                          (0 === (t.content ?? []).indexOf(e)
                            ? "tableHeader"
                            : "tableCell") ||
                        (Number(n.attrs?.colspan ?? 1) > 1 &&
                          Number(n.attrs?.rowspan ?? 1) > 1) ||
                        (n.content ?? []).length > 1 ||
                        Object.entries(n.attrs ?? {}).some(
                          ([t, e]) =>
                            !["colspan", "rowspan", "colwidth"].includes(t) &&
                            null != e,
                        ) ||
                        (n.content ?? []).some(
                          (t) =>
                            !r.includes(t.type) &&
                            Object.entries(t.attrs ?? {}).some(
                              ([t, e]) => "textAlign" !== t && null != e,
                            ),
                        ),
                    ),
                  )
                : !!["grid", "examHeader"].includes(t.type) &&
                  (t.content ?? []).some((e) =>
                    (e.content ?? []).some(
                      (r) =>
                        Object.entries(r.attrs ?? {}).some(
                          ([t, e]) => "textAlign" !== t && null != e,
                        ) ||
                        (r.attrs?.textAlign != null &&
                          r.attrs.textAlign !==
                            ("grid" === t.type ? "left" : "center")) ||
                        ((e.content ?? []).length > 1 && "grid" === t.type),
                    ),
                  ));
    }
    let l = {
      u: "underline",
      sup: "superscript",
      sub: "subscript",
      s: "strike",
    };
    function s(t) {
      let [e, r] = t.split(":");
      if (!r) return { type: e };
      let n = decodeURIComponent(r);
      if ("boxed" === e) {
        let [t, n, i, a] = r.split(",").map(Number);
        return {
          type: e,
          attrs: {
            paddingTop: t,
            paddingRight: n,
            paddingBottom: i,
            paddingLeft: a,
          },
        };
      }
      return {
        type: e,
        attrs:
          "fontSize" === e
            ? { size: Number(r) }
            : "fontFamily" === e
              ? { family: n }
              : "link" === e
                ? { href: n }
                : { color: n },
      };
    }
    function o(t) {
      if (
        "boxed" === t.type &&
        ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"].some(
          (e) => t.attrs?.[e] != null,
        )
      )
        return (
          "boxed:" +
          ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]
            .map((e, r) => t.attrs?.[e] ?? (r % 2 ? 8 : 3))
            .join(",")
        );
      let e = t.attrs?.size;
      if ("fontSize" === t.type && e) return `fontSize:${e}`;
      let r =
        "fontFamily" === t.type
          ? t.attrs?.family
          : "link" === t.type
            ? t.attrs?.href
            : t.attrs?.color;
      return r ? `${t.type}:${encodeURIComponent(String(r))}` : t.type;
    }
    function c(t, e) {
      return {
        type: "math",
        attrs: { latex: encodeURIComponent(t.trim()), display: e },
      };
    }
    function u(t, e, r) {
      let n = r ? "$$" : "$";
      for (let i = e; i < t.length; i++) {
        if ("\\" === t[i]) {
          i++;
          continue;
        }
        if (t.startsWith(n, i)) {
          if (!r && "$" === t[i + 1]) return -1;
          return i > e ? i : -1;
        }
      }
      return -1;
    }
    function h(t) {
      let e = t.includes("\\*\\*")
          ? t.replace(
              /\*\*([^*\n]*?)\s\*\*(\$[^$\n]+\$)\\\*\\\*([^*\n]*?)\\\*\\\*/g,
              "**$1 $2$3**",
            )
          : t,
        r = [],
        n = [],
        i = "",
        a = () => {
          if (i) {
            var t, e;
            let a = r[r.length - 1],
              l = [...n];
            if (
              a?.type === "text" &&
              ((t = a.marks),
              (e = l),
              (t ?? []).map(o).sort().join(",") === [...e].sort().join(","))
            )
              a.text += i;
            else {
              let t;
              r.push(
                ((t = { type: "text", text: i }),
                l.length > 0 &&
                  (t.marks = [...l]
                    .sort(
                      (t, e) =>
                        O.indexOf(t.split(":")[0]) - O.indexOf(e.split(":")[0]),
                    )
                    .map(s)),
                t),
              );
            }
            i = "";
          }
        },
        h = (t, e) => {
          a();
          let r = n.indexOf(t);
          (e && r < 0 && n.push(t), !e && r >= 0 && n.splice(r, 1));
        },
        d = 0;
      for (; d < e.length; ) {
        let t = e[d];
        if (
          "\\" === t &&
          d + 1 < e.length &&
          "\\$*|[]_#`~<>!:".includes(e[d + 1])
        ) {
          ((i += e[d + 1]), (d += 2));
          continue;
        }
        if ("$" === t) {
          let t = e.startsWith("$$", d),
            n = t ? 2 : 1,
            l = u(e, d + n, t);
          if (l >= 0) {
            (a(), r.push(c(e.slice(d + n, l), t)), (d = l + n));
            continue;
          }
          ((i += t ? "$$" : "$"), (d += n));
          continue;
        }
        if ("<" === t) {
          let t = /^<(color|highlight|font|link)=([^>]+)>/i.exec(e.slice(d));
          if (t) {
            let e = {
                color: "textColor",
                highlight: "textHighlight",
                font: "fontFamily",
                link: "link",
              }[t[1].toLowerCase()],
              r = !1;
            try {
              let n = decodeURIComponent(t[2]);
              r =
                "textColor" === e || "textHighlight" === e
                  ? /^#[0-9a-f]{6}$/i.test(n)
                  : "link" === e
                    ? /^(https?:|mailto:)/i.test(n)
                    : [
                        "Times New Roman",
                        "Arial",
                        "Calibri",
                        "Cambria",
                        "Georgia",
                        "Verdana",
                        "Courier New",
                      ].includes(n);
            } catch {}
            if (r) {
              for (let t of n.filter((t) => t.startsWith(e + ":"))) h(t, !1);
              (h(`${e}:${t[2]}`, !0), (d += t[0].length));
              continue;
            }
          }
          let i = /^<\/(color|highlight|font|link)>/i.exec(e.slice(d));
          if (i) {
            let t = {
              color: "textColor",
              highlight: "textHighlight",
              font: "fontFamily",
              link: "link",
            }[i[1].toLowerCase()];
            for (let e of n.filter((e) => e.startsWith(t + ":"))) h(e, !1);
            d += i[0].length;
            continue;
          }
          let s =
            /^<box=(\d+(?:\.\d+)?),(\d+(?:\.\d+)?),(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)>/i.exec(
              e.slice(d),
            );
          if (s && s.slice(1).every((t) => 96 >= Number(t))) {
            for (let t of n.filter(
              (t) => "boxed" === t || t.startsWith("boxed:"),
            ))
              h(t, !1);
            (h(`boxed:${s.slice(1).join(",")}`, !0), (d += s[0].length));
            continue;
          }
          if (
            e.startsWith("</box>", d) &&
            n.some((t) => "boxed" === t || t.startsWith("boxed:"))
          ) {
            for (let t of n.filter(
              (t) => "boxed" === t || t.startsWith("boxed:"),
            ))
              h(t, !1);
            d += 6;
            continue;
          }
          let o = /^<size=(\d+(?:\.\d+)?)>/i.exec(e.slice(d));
          if (o) {
            for (let t of n.filter((t) => t.startsWith("fontSize:"))) h(t, !1);
            (h(`fontSize:${o[1]}`, !0), (d += o[0].length));
            continue;
          }
          if (e.startsWith("</size>", d)) {
            for (let t of n.filter((t) => t.startsWith("fontSize:"))) h(t, !1);
            d += 7;
            continue;
          }
          let c = /^<(\/?)(u|sup|sub|s|br)\s*\/?>/i.exec(e.slice(d));
          if (c) {
            let t = c[2].toLowerCase();
            ("br" === t
              ? (a(), r.push({ type: "hardBreak" }))
              : h(l[t], "/" !== c[1]),
              (d += c[0].length));
            continue;
          }
        }
        if (
          e.startsWith("[[", d) &&
          !n.some((t) => "boxed" === t || t.startsWith("boxed:")) &&
          e.indexOf("]]", d + 2) > d + 2
        ) {
          let t = e
            .slice(d + 2, e.indexOf("]]", d + 2))
            .replace(/^(?:\*+|<[^>]+>)+/, "");
          (h(/^Mã (?:số )?đề/i.test(t) ? "boxed:3,24,3,24" : "boxed", !0),
            (d += 2));
          continue;
        }
        if (
          e.startsWith("]]", d) &&
          n.some((t) => "boxed" === t || t.startsWith("boxed:"))
        ) {
          for (let t of n.filter(
            (t) => "boxed" === t || t.startsWith("boxed:"),
          ))
            h(t, !1);
          d += 2;
          continue;
        }
        if (e.startsWith("~~", d)) {
          if (n.includes("strike")) {
            (h("strike", !1), (d += 2));
            continue;
          }
          if (e.indexOf("~~", d + 2) > d + 2) {
            (h("strike", !0), (d += 2));
            continue;
          }
        }
        if (e.startsWith("**", d)) {
          if (n.includes("bold")) {
            (h("bold", !1), (d += 2));
            continue;
          }
          let t = e.indexOf("**", d + 2);
          if (
            ((e[d + 2] && !/\s/.test(e[d + 2])) ||
              (d > 0 && !/\s/.test(e[d - 1]))) &&
            t > d + 2 &&
            e.slice(d + 2, t).trim()
          ) {
            (h("bold", !0), (d += 2));
            continue;
          }
        }
        if ("*" === t) {
          if (n.includes("italic")) {
            (h("italic", !1), (d += 1));
            continue;
          }
          let t = e[d + 1];
          if (
            t &&
            " " !== t &&
            "*" !== t &&
            (function (t, e) {
              for (let r = e; r < t.length; r++) {
                if ("\\" === t[r]) {
                  r++;
                  continue;
                }
                if ("$" === t[r]) {
                  let e = t.startsWith("$$", r),
                    n = u(t, r + (e ? 2 : 1), e);
                  if (n >= 0) {
                    r = n + +!!e;
                    continue;
                  }
                }
                if ("*" === t[r]) {
                  if ("*" === t[r + 1]) {
                    r++;
                    continue;
                  }
                  return !0;
                }
              }
              return !1;
            })(e, d + 1)
          ) {
            (h("italic", !0), (d += 1));
            continue;
          }
        }
        ((i += t), (d += 1));
      }
      return (a(), r);
    }
    let d = /^(#{1,6})\s+(.*)$/,
      p = /^```\s*([\w-]*)\s*$/,
      f = /^:::\s*([\w-]+)\s*(.*)$/,
      m = String.raw`((?:[^\]\n]|\]+[^\](\n])*\]*)`,
      g = String.raw`!\[${m}\]\(\s*([^)\s]*)\s*\)\s*(\{[^}]*\})?`,
      b = new RegExp(String.raw`^${g}\s*$`),
      x = /^\s*\|.*\|\s*$/,
      y = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/,
      v = /^\s*\{\s*widths\s*=\s*([\d.,\s]+)\}\s*$/,
      w = /^(-{3,}|\*{3,}|_{3,})$/,
      k = /^\\newpage\s*$/,
      M = new Set(["left", "center", "right", "justify"]),
      $ = {
        first: "indentFirst",
        left: "indentLeft",
        right: "indentRight",
        line: "lineHeight",
        before: "spaceBefore",
        after: "spaceAfter",
      };
    function L(t, e = null) {
      let r = { type: "paragraph", attrs: { textAlign: e } };
      return (t.length > 0 && (r.content = t), r);
    }
    function _(t, e = null) {
      let r = [];
      t.forEach((t, e) => {
        var n;
        (e > 0 && r.push({ type: "hardBreak" }),
          r.push(...h(((n = t), /^\\[#|:!`$-]/.test(n) ? n.slice(1) : n))));
      });
      let n = 1 === r.length && "math" === r[0].type && r[0].attrs?.display;
      return L(r, e ?? (n ? "center" : null));
    }
    function j(t) {
      let e = {};
      if (!t) return e;
      for (let r of t
        .replace(/^\{|\}$/g, "")
        .matchAll(/([\w-]+)\s*=\s*("([^"]*)"|[^\s]+)/g))
        e[r[1]] = r[3] ?? r[2];
      return e;
    }
    function S(t) {
      let e = t.trim();
      (e.startsWith("|") && (e = e.slice(1)),
        e.endsWith("|") && !e.endsWith("\\|") && (e = e.slice(0, -1)));
      let r = [],
        n = "",
        i = !1,
        a = !1;
      for (let t = 0; t < e.length; t++) {
        ((e.startsWith("<geometry>", t) ||
          e.startsWith("<diagram>", t) ||
          e.startsWith("<graph>", t)) &&
          (a = !0),
          (e.startsWith("</geometry>", t) ||
            e.startsWith("</diagram>", t) ||
            e.startsWith("</graph>", t)) &&
            (a = !1));
        let l = e[t];
        if ("\\" === l && "|" === e[t + 1]) {
          ((n += "|"), t++);
          continue;
        }
        if (("$" !== l || a || (i = !i), "|" === l && !i && !a)) {
          (r.push(n.trim()), (n = ""));
          continue;
        }
        n += l;
      }
      return (r.push(n.trim()), r);
    }
    function C(t) {
      let e = t.trim(),
        r = e.startsWith(":"),
        n = e.endsWith(":");
      return r && n ? "center" : n ? "right" : r ? "left" : null;
    }
    let E = RegExp(
      String.raw`<(geometry|diagram|graph|chart)>([\s\S]*?)<\/\1>|${g}`,
      "g",
    );
    function A(t, r) {
      let n = [],
        i = 0,
        a = (t) => {
          let e = t
            .replace(/^(?:\s*<br\s*\/?>)+|(?:<br\s*\/?>\s*)+$/gi, "")
            .trim();
          e && n.push(_(e.split(/<br\s*\/?>/i), r));
        };
      for (let r of t.matchAll(E)) {
        if ((a(t.slice(i, r.index)), r[1]))
          n.push({ type: e[r[1]], attrs: { data: r[2].trim() } });
        else {
          let t = Number.parseFloat(j(r[5]).width ?? "");
          n.push({
            type: "examImage",
            attrs: {
              src: r[4] || "",
              alt: r[3] || "",
              width: Number.isFinite(t) ? t : 220,
              align: "center",
            },
          });
        }
        i = r.index + r[0].length;
      }
      return (a(t.slice(i)), n.length ? n : [L([], r)]);
    }
    function N(t) {
      let e = [],
        r = !1,
        n = !1;
      for (let i of t.replace(/\r\n?/g, "\n").split("\n")) {
        /^```/.test(i.trim()) && (r = !r);
        let t = !r && "" === i.trim();
        (t && n) || ((n = t), e.push(i));
      }
      return e.join("\n");
    }
    function T(t, e = {}) {
      let r = (function t(e) {
        let r = [],
          a = 0,
          l = 0,
          s = (t) => {
            if (r.length > 0) for (let t = 1; t < l; t++) r.push(L([]));
            ((l = 0), r.push(t));
          };
        for (; a < e.length; ) {
          let o = e[a],
            u = o.trim();
          if ("" === u) {
            (l++, a++);
            continue;
          }
          if (k.test(u)) {
            (s({ type: "pageBreak" }), a++);
            continue;
          }
          if (w.test(u)) {
            (s({ type: "horizontalRule" }), a++);
            continue;
          }
          let m = d.exec(u);
          if (m) {
            let t = {
                type: "heading",
                attrs: { level: m[1].length, textAlign: null },
              },
              e = h(m[2]);
            (e.length > 0 && (t.content = e), s(t), a++);
            continue;
          }
          let g = p.exec(u);
          if (g) {
            let t = [];
            for (a++; a < e.length && !/^```\s*$/.test(e[a].trim()); )
              t.push(e[a++]);
            a++;
            let r = g[1].toLowerCase();
            if (
              "variation" === r ||
              "graph" === r ||
              "geometry" === r ||
              "diagram" === r ||
              "chart" === r
            )
              s({
                type:
                  "variation" === r
                    ? "variationTable"
                    : "geometry" === r
                      ? "geometryDiagram"
                      : "diagram" === r
                        ? "vectorDiagram"
                        : "chart" === r
                          ? "statChart"
                          : "functionGraph",
                attrs: { data: t.join("\n").trim() },
              });
            else if ("rich-block" === r)
              try {
                let e = JSON.parse(t.join("\n"));
                !(function (t) {
                  let e = 0,
                    r = (t, i) =>
                      !(!t || "object" != typeof t || i > 32 || ++e > 1e4) &&
                      !(
                        !Object.hasOwn(n, t.type) ||
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
                            (e) => n[t.type].includes(e.type) && r(e, i + 1),
                          )));
                  return !!t && i.has(t.type) && r(t, 0);
                })(e)
                  ? s(L([{ type: "text", text: t.join("\n") }], "left"))
                  : s(e);
              } catch {
                s(L([{ type: "text", text: t.join("\n") }], "left"));
              }
            else if (t.length > 0) {
              let e = [];
              (t.forEach((t, r) => {
                (r > 0 && e.push({ type: "hardBreak" }),
                  t && e.push({ type: "text", text: t }));
              }),
                s(L(e, "left")));
            }
            continue;
          }
          if (u.length > 4 && u.startsWith("$$") && u.endsWith("$$")) {
            (s(L([c(u.slice(2, -2), !0)], "center")), a++);
            continue;
          }
          if (u.startsWith("$$") && 0 > u.indexOf("$$", 2)) {
            let t = [u.slice(2)];
            for (a++; a < e.length && !e[a].includes("$$"); ) t.push(e[a++]);
            (a < e.length && t.push(e[a].slice(0, e[a].indexOf("$$"))),
              a++,
              s(L([c(t.join("\n"), !0)], "center")));
            continue;
          }
          let E = f.exec(u);
          if (E) {
            let { inner: n, end: i } = (function (t, e) {
              let r = 1,
                n = !1,
                i = [],
                a = e + 1;
              for (; a < t.length; a++) {
                let e = t[a].trim();
                if ((p.test(e) && (n = !n), !n))
                  if (":::" === e) {
                    if (0 == --r) break;
                  } else f.test(e) && r++;
                i.push(t[a]);
              }
              return { inner: i, end: a };
            })(e, a);
            a = i + 1;
            let l = E[1].toLowerCase();
            if ("columns" === l) {
              let e = j(E[2]),
                r = t(n);
              s({
                type: "docColumns",
                attrs: {
                  columns: Math.min(3, Math.max(1, parseInt(E[2], 10) || 2)),
                  gap: Math.min(96, Math.max(0, Number(e.gap ?? 24))),
                  separator: "true" === e.separator,
                },
                content: r.length ? r : [L([])],
              });
            } else if ("header" === l) {
              let t = n.findIndex((t) => "|||" === t.trim()),
                e = t >= 0 ? n.slice(0, t) : n,
                r = t >= 0 ? n.slice(t + 1) : [],
                i = (t) => {
                  let e = t
                    .filter(
                      (t) =>
                        t.trim() &&
                        !/^:::(?:\s+(?:center|left|right|justify|para)(?:\s+.*)?)?$/.test(
                          t.trim(),
                        ),
                    )
                    .map((t) => _([t.trim()], "center"));
                  return {
                    type: "headerColumn",
                    content: e.length > 0 ? e : [L([], "center")],
                  };
                };
              s({ type: "examHeader", content: [i(e), i(r)] });
            } else if ("grid" === l || "choices" === l) {
              let t = Math.min(4, Math.max(1, Number.parseInt(E[2], 10) || 2)),
                e = n
                  .filter((t) => t.trim())
                  .map((t) => ({
                    type: "gridCell",
                    content: A(t.trim(), "left"),
                  })),
                r = n.filter((t) => t.trim());
              2 === t &&
              2 === r.length &&
              /^Họ(?: và tên| tên|, tên)/i.test(r[0]) &&
              /^Số báo danh:/i.test(r[1])
                ? s(_([r.join(" ")], "left"))
                : e.length > 0 &&
                  s({
                    type: "grid",
                    attrs:
                      "choices" === l
                        ? { columns: 1, autoColumns: !0 }
                        : {
                            columns: t,
                            ...("true" === j(E[2]).fixed
                              ? { autoColumns: !1 }
                              : {}),
                          },
                    content: e,
                  });
            } else
              M.has(l) || "para" === l
                ? (function (t, e, r = {}) {
                    return t.map((t) => {
                      if ("paragraph" === t.type || "heading" === t.type) {
                        let n = { ...t.attrs };
                        for (let [t, i] of (e &&
                          !n.textAlign &&
                          (n.textAlign = e),
                        Object.entries(r)))
                          null == n[t] && (n[t] = i);
                        return { ...t, attrs: n };
                      }
                      return e &&
                        "examImage" === t.type &&
                        t.attrs?.align === "center" &&
                        "justify" !== e
                        ? { ...t, attrs: { ...t.attrs, align: e } }
                        : t;
                    });
                  })(
                    t(n),
                    "para" === l ? null : l,
                    (function (t) {
                      let e = {},
                        r = j(t);
                      for (let [t, n] of Object.entries($)) {
                        let i = Number.parseFloat(r[t] ?? "");
                        Number.isFinite(i) &&
                          (i >= 0 || "first" === t) &&
                          (e[n] = i);
                      }
                      return e;
                    })(E[2]),
                  ).forEach((t, e) => {
                    0 === e ? s(t) : r.push(t);
                  })
                : t(n).forEach((t, e) => {
                    0 === e ? s(t) : r.push(t);
                  });
            continue;
          }
          let N = b.exec(u);
          if (N) {
            let t = j(N[3]),
              e = Number.parseFloat(t.width ?? ""),
              r =
                t.align && ["left", "center", "right"].includes(t.align)
                  ? t.align
                  : "center";
            (s({
              type: "examImage",
              attrs: {
                src: N[2] || "",
                alt: N[1] || "",
                width: Number.isFinite(e) ? e : 220,
                align: r,
              },
            }),
              a++);
            continue;
          }
          if (x.test(u) && a + 1 < e.length && y.test(e[a + 1].trim())) {
            let t,
              r = [e[a], e[a + 1]];
            for (a += 2; a < e.length && x.test(e[a].trim()); ) r.push(e[a++]);
            for (let r = a; ; r++) {
              for (; r < e.length && "" === e[r].trim(); ) r++;
              if (r >= e.length || !v.test(e[r])) break;
              ((t ??= e[r]), (a = r + 1));
            }
            s(
              (function (t, e) {
                let r = S(t[0]),
                  n = S(t[1]).map(C),
                  i = t.slice(2).map(S),
                  a = Math.max(r.length, ...i.map((t) => t.length)),
                  l = [r, ...i].map((t) =>
                    Array.from({ length: a }, (e, r) => t[r] ?? ""),
                  ),
                  s = Array.from({ length: a }, () => null),
                  o = l.map((t, e) => {
                    let r = [],
                      i = null;
                    return (
                      t.forEach((t, a) => {
                        let l = s[a];
                        if ("^" === t && e > 0 && l) {
                          ((l.attrs.rowspan = l.attrs.rowspan + 1), (i = null));
                          return;
                        }
                        if ("<" === t && i && 1 === i.attrs.rowspan) {
                          ((i.attrs.colspan = i.attrs.colspan + 1),
                            (s[a] = null));
                          return;
                        }
                        let o = {
                          type: 0 === e ? "tableHeader" : "tableCell",
                          attrs: { colspan: 1, rowspan: 1, colwidth: null },
                          content: A(t, n[a] ?? null),
                        };
                        ((s[a] = o), (i = o), r.push(o));
                      }),
                      { type: "tableRow", content: r }
                    );
                  }),
                  c = e
                    ? (v.exec(e)?.[1] ?? "")
                        .split(",")
                        .map((t) => Number.parseFloat(t))
                        .filter((t) => Number.isFinite(t) && t > 0)
                    : [];
                return {
                  type: "table",
                  attrs: { widths: c.length === a ? c : null },
                  content: o,
                };
              })(r, t),
            );
            continue;
          }
          let T = [o.trimEnd()];
          for (
            a++;
            a < e.length &&
            "" !== e[a].trim() &&
            !(function (t, e) {
              let r = t.trim();
              return (
                d.test(r) ||
                p.test(r) ||
                f.test(r) ||
                ":::" === r ||
                b.test(r) ||
                k.test(r) ||
                w.test(r) ||
                r.startsWith("$$") ||
                (x.test(r) && void 0 !== e && y.test(e.trim()))
              );
            })(e[a], e[a + 1]);

          )
            (T.push(e[a].trimEnd()), a++);
          let I =
            1 === T.length
              ? /^(Họ(?: và tên| tên|, tên) (?:thí sinh|học sinh):\s*.*?)\s+(Số báo danh:.*)$/i.exec(
                  T[0],
                )
              : null;
          I && /[.…]{3}/.test(I[1])
            ? s(
                _(
                  [
                    I.slice(1)
                      .map((t) => t.trim())
                      .join(" "),
                  ],
                  "left",
                ),
              )
            : s(_(T));
        }
        return r;
      })((e.collapseBlank ? N(t) : t).replace(/\r\n?/g, "\n").split("\n"));
      return { type: "doc", content: r.length > 0 ? r : [L([])] };
    }
    let I = {
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
      O = Object.keys(I);
    function R(t) {
      let [e, r] = t.split(":"),
        [n, i] = I[e];
      return "boxed" === e && r
        ? [`<box=${r}>`, "</box>"]
        : [r ? n.replace(/<([^>]+)>/, `<$1=${r}>`) : n, i];
    }
    let W = new Set(["bold", "italic", "strike"]);
    function D(t, e = "\n", r = !1) {
      var n;
      let i,
        a,
        l,
        s,
        c = "",
        u = [],
        h = (t) => {
          for (; u.length > 0 && !t.includes(u[u.length - 1]); )
            c += R(u.pop())[1];
          let e = u.findIndex((e) => !t.includes(e));
          if (e >= 0) for (; u.length > e; ) c += R(u.pop())[1];
        };
      for (let d of ((n = t ?? []),
      (i = (t, e) => {
        for (let r = t + e; r >= 0 && r < n.length; r += e)
          if ("math" !== n[r].type) return "text" === n[r].type ? n[r] : void 0;
      }),
      (a = (t, ...e) =>
        (t.marks ?? []).filter(
          (t) =>
            !W.has(t.type) ||
            e.every((e) => e?.marks?.some((e) => e.type === t.type)),
        )),
      (l = (t, e) =>
        e?.length
          ? { type: "text", text: t, marks: e }
          : { type: "text", text: t }),
      (s = []),
      n.forEach((t, e) => {
        if (
          "text" !== t.type ||
          !t.text ||
          !t.marks?.some((t) => W.has(t.type))
        )
          return void s.push(t);
        let [, r, n, o] = /^(\s*)([\s\S]*?)(\s*)$/.exec(t.text),
          c = i(e, -1),
          u = i(e, 1);
        n
          ? (r && s.push(l(r, a(t, c))),
            s.push(l(n, t.marks)),
            o && s.push(l(o, a(t, u))))
          : s.push(l(t.text, a(t, c, u)));
      }),
      s)) {
        if ("hardBreak" === d.type) {
          (h([]), (c += e));
          continue;
        }
        if ("math" === d.type) {
          let t = decodeURIComponent(String(d.attrs?.latex ?? ""));
          c += d.attrs?.display ? `$$${t}$$` : `$${t}$`;
          continue;
        }
        if ("text" !== d.type || !d.text) continue;
        let t = (d.marks ?? [])
          .filter((t) => t.type in I)
          .map(o)
          .sort(
            (t, e) => O.indexOf(t.split(":")[0]) - O.indexOf(e.split(":")[0]),
          );
        for (let e of (h(t), t))
          u.includes(e) || ((c += R(e)[0]), (u = [...u, e]));
        c += (function (t, e) {
          let r = t
            .replace(/\\/g, "\\\\")
            .replace(/\$/g, "\\$")
            .replace(/\*/g, "\\*")
            .replace(/~~/g, "\\~\\~");
          return (
            (r = r
              .replace(/\[\[/g, "\\[\\[")
              .replace(
                /<(\/?(u|sup|sub|s|br|size|color|highlight|font|link|box)\b)/gi,
                "\\<$1",
              )),
            e && (r = r.replace(/\|/g, "\\|")),
            r
          );
        })(d.text, r);
      }
      return (h([]), c);
    }
    function B(t) {
      return /^(#{1,6}\s|\||:::|!\[|```|\\newpage|-{3,}$|\*{3,}$|_{3,}$)/.test(
        t,
      )
        ? "\\" + t
        : t;
    }
    function H(t) {
      return t.replace(/\n/g, " ").replace(/\]\(/g, "] (");
    }
    function z(t) {
      let r = String(t.attrs?.data ?? "{}");
      try {
        r = JSON.stringify(JSON.parse(r));
      } catch {
        r = r.replace(/\r?\n/g, " ");
      }
      let n = Object.keys(e).find((r) => e[r] === t.type) ?? "geometry";
      return (
        `<${n}>` +
        r.replace(/</g, "\\u003c").replace(/\|/g, "\\u007c") +
        `</${n}>`
      );
    }
    function F(t) {
      let e = Array.isArray(t) ? t : (t.content ?? []),
        n = "",
        i = 0,
        l = null,
        s = (t) => {
          (n && (n += "\n\n" + "\n".repeat(i)), (n += t), (i = 0));
        },
        o = () => {
          l &&
            (s(`${l.head}
${l.parts.join("\n\n")}
:::`),
            (l = null));
        };
      for (let t of e) {
        if ("paragraph" === t.type && (!t.content || 0 === t.content.length)) {
          l ? l.parts.push("") : n && i++;
          continue;
        }
        let e = a(t)
            ? null
            : (function (t) {
                let e = t.attrs?.textAlign;
                if ("heading" === t.type)
                  return e && null !== e && "justify" !== e ? e : null;
                if ("paragraph" !== t.type || !e || "justify" === e)
                  return null;
                let r = t.content ?? [];
                return "center" === e &&
                  1 === r.length &&
                  "math" === r[0].type &&
                  r[0].attrs?.display
                  ? null
                  : e;
              })(t),
          c = a(t)
            ? {}
            : (function (t) {
                let e = {};
                if ("paragraph" !== t.type && "heading" !== t.type) return e;
                for (let [r, n] of Object.entries($)) {
                  let i = Number(t.attrs?.[n]);
                  t.attrs?.[n] != null &&
                    Number.isFinite(i) &&
                    (i >= 0 || "first" === r) &&
                    (e[r] = Math.round(100 * i) / 100);
                }
                return e;
              })(t),
          u = (function t(e) {
            if (a(e)) return "```rich-block\n" + JSON.stringify(e) + "\n```";
            switch (e.type) {
              case "paragraph":
                return D(e.content).split("\n").map(B).join("\n");
              case "heading": {
                let t = Math.min(6, Math.max(1, Number(e.attrs?.level ?? 2)));
                return "#".repeat(t) + " " + D(e.content, " ");
              }
              case "pageBreak":
                return "\\newpage";
              case "horizontalRule":
                return "---";
              case "examHeader": {
                let [t, r] = e.content ?? [],
                  n = (t) =>
                    (t?.content ?? [])
                      .map((t) => D(t.content, " "))
                      .filter((t) => t.trim());
                return ["::: header", ...n(t), "|||", ...n(r), ":::"].join(
                  "\n",
                );
              }
              case "docColumns":
                return [
                  `::: columns ${e.attrs?.columns ?? 2} gap=${e.attrs?.gap ?? 24} separator=${!!e.attrs?.separator}`,
                  F(e.content ?? []),
                  ":::",
                ].join("\n");
              case "grid": {
                let n = (e.content ?? []).map(
                  (e) =>
                    (e.content ?? [])
                      .map((e) =>
                        "examImage" === e.type
                          ? t(e)
                          : r.includes(e.type)
                            ? z(e)
                            : D(e.content, " <br> "),
                      )
                      .join(" <br> ") || " ",
                );
                return [
                  e.attrs?.autoColumns === !0
                    ? "::: choices"
                    : `::: grid ${e.attrs?.columns ?? 2}${e.attrs?.autoColumns === !1 ? " fixed=true" : ""}`,
                  ...n,
                  ":::",
                ].join("\n");
              }
              case "table":
                let n, i, l, s, o, c, u, h, d;
                return (
                  (n = e.content ?? []),
                  (i = []),
                  (l = []),
                  (s = []),
                  n.forEach((e, n) => {
                    i[n] = i[n] ?? [];
                    let a = 0;
                    for (let o of e.content ?? []) {
                      for (; s[a] > 0; ) ((i[n][a] = "^"), s[a]--, a++);
                      let e = (o.content ?? [])
                        .map((e) =>
                          "examImage" === e.type
                            ? t(e)
                            : r.includes(e.type)
                              ? z(e)
                              : D(e.content, "<br>", !0),
                        )
                        .filter(Boolean)
                        .join("<br>");
                      if (((i[n][a] = e || " "), n > 0 && void 0 === l[a])) {
                        let t = o.content?.[0]?.attrs?.textAlign;
                        l[a] = t ?? null;
                      }
                      let c = Number(o.attrs?.rowspan ?? 1);
                      c > 1 && (s[a] = c - 1);
                      let u = Number(o.attrs?.colspan ?? 1);
                      for (let t = 1; t < u; t++) i[n][a + t] = "<";
                      a += u;
                    }
                    for (; s[a] > 0; ) ((i[n][a] = "^"), s[a]--, a++);
                  }),
                  (o = Math.max(...i.map((t) => t.length))),
                  (c = (t) =>
                    "| " +
                    Array.from({ length: o }, (e, r) => t[r] ?? " ").join(
                      " | ",
                    ) +
                    " |"),
                  (u =
                    "|" +
                    Array.from({ length: o }, (t, e) => {
                      let r = l[e];
                      return "center" === r
                        ? ":---:"
                        : "right" === r
                          ? "---:"
                          : "left" === r
                            ? ":---"
                            : "---";
                    }).join("|") +
                    "|"),
                  (h = [c(i[0] ?? []), u, ...i.slice(1).map(c)]),
                  Array.isArray((d = e.attrs?.widths)) &&
                    d.length === o &&
                    h.push(
                      `{widths=${d.map((t) => Math.round(10 * t) / 10).join(",")}}`,
                    ),
                  h.join("\n")
                );
              case "examImage": {
                let t = e.attrs ?? {},
                  r = [];
                return (
                  t.width &&
                    220 !== Math.round(Number(t.width)) &&
                    r.push(`width=${Math.round(Number(t.width))}`),
                  t.align && "center" !== t.align && r.push(`align=${t.align}`),
                  `![${H(String(t.alt ?? ""))}](${t.src ?? ""})${r.length ? `{${r.join(" ")}}` : ""}`
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
          l && l.head === t
            ? l.parts.push(u)
            : (o(), (l = { key: t, head: t, parts: [u] }));
          continue;
        }
        (o(), s(u));
      }
      return (o(), n);
    }
    t.s([
      "collapseBlankLines",
      0,
      N,
      "imageAlt",
      0,
      H,
      "parseExamBlocks",
      0,
      function (t, e = {}) {
        return T(t, e).content ?? [];
      },
      "parseExamMarkdown",
      0,
      T,
      "parseInline",
      0,
      h,
      "serializeExamMarkdown",
      0,
      F,
    ]);
  },
  996296,
  (t) => {
    "use strict";
    async function e(t) {
      if ("function" == typeof createImageBitmap)
        try {
          let e = await createImageBitmap(t);
          return {
            source: e,
            width: e.width,
            height: e.height,
            release: () => e.close(),
          };
        } catch {}
      let e = URL.createObjectURL(t);
      try {
        let t = await new Promise((t, r) => {
          let n = new Image();
          ((n.onload = () => t(n)),
            (n.onerror = () => r(Error("Trình duyệt không đọc được ảnh này."))),
            (n.src = e));
        });
        return {
          source: t,
          width: t.naturalWidth,
          height: t.naturalHeight,
          release: () => URL.revokeObjectURL(e),
        };
      } catch {
        return (URL.revokeObjectURL(e), null);
      }
    }
    function r(t) {
      return new Promise((e, r) => {
        let n = new FileReader();
        ((n.onload = () => e(n.result)),
          (n.onerror = () => r(Error("Không đọc được dữ liệu ảnh."))),
          n.readAsDataURL(t));
      });
    }
    function n(t) {
      let e = t.indexOf(",");
      return -1 === e ? t : t.slice(e + 1);
    }
    async function i(t) {
      let e = await r(t);
      return {
        dataUrl: e,
        base64: n(e),
        mimeType: t.type || "image/jpeg",
        bytes: t.size,
        originalBytes: t.size,
        width: 0,
        height: 0,
        compressed: !1,
      };
    }
    async function a(t, l = {}) {
      let s = l.maxDimension ?? 1600,
        o = l.maxBytes ?? 921600,
        c = l.mimeType ?? "image/jpeg",
        u = l.skipBelowBytes ?? 204800,
        h = Math.max(0.1, Math.min(1, l.minQuality ?? 0.45));
      if (t.size <= u) return i(t);
      let d = await e(t);
      if (!d || 0 === d.width || 0 === d.height) return i(t);
      try {
        let e = Math.min(1, s / Math.max(d.width, d.height)),
          a = Math.min(e, (l.minDimension ?? 1) / Math.max(d.width, d.height)),
          u = Math.max(h, l.quality ?? 0.82),
          p = null;
        for (let t = 0; t < 6; t += 1) {
          let t = Math.max(1, Math.round(d.width * e)),
            r = Math.max(1, Math.round(d.height * e)),
            n = await (function (t, e, r) {
              return new Promise((n, i) => {
                t.toBlob(
                  (t) => (t ? n(t) : i(Error("Không mã hoá lại được ảnh."))),
                  e,
                  r,
                );
              });
            })(
              (function (t, e, r) {
                let n = document.createElement("canvas");
                ((n.width = e), (n.height = r));
                let i = n.getContext("2d");
                if (!i) throw Error("Trình duyệt không hỗ trợ canvas 2D.");
                return (
                  (i.fillStyle = "#ffffff"),
                  i.fillRect(0, 0, e, r),
                  (i.imageSmoothingEnabled = !0),
                  (i.imageSmoothingQuality = "high"),
                  i.drawImage(t.source, 0, 0, e, r),
                  n
                );
              })(d, t, r),
              c,
              u,
            );
          if (((p = { blob: n, width: t, height: r }), n.size <= o)) break;
          if (u > h) u = Math.max(h, u - 0.12);
          else {
            let t = Math.max(a, 0.8 * e);
            if (t === e) break;
            e = t;
          }
        }
        if (!p || p.blob.size >= t.size) return i(t);
        let f = await r(p.blob);
        return {
          dataUrl: f,
          base64: n(f),
          mimeType: c,
          bytes: p.blob.size,
          originalBytes: t.size,
          width: p.width,
          height: p.height,
          compressed: !0,
        };
      } catch {
        return i(t);
      } finally {
        d.release();
      }
    }
    t.s([
      "blobToDataURL",
      0,
      r,
      "compressImageFile",
      0,
      a,
      "formatBytes",
      0,
      function (t) {
        return t < 1024
          ? `${t} B`
          : t < 1048576
            ? `${Math.round(t / 1024)} KB`
            : `${(t / 1048576).toFixed(1).replace(".", ",")} MB`;
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
      function (t, r) {
        return (0, e.postJson)("/api/exam-image", t, r);
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
  96892,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("arrow-up", [
      ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
      ["path", { d: "M12 19V5", key: "x0mq9r" }],
    ]);
    t.s(["ArrowUp", 0, e], 96892);
  },
  762368,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("download", [
      ["path", { d: "M12 15V3", key: "m9g1x1" }],
      [
        "path",
        { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" },
      ],
      ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }],
    ]);
    t.s(["Download", 0, e], 762368);
  },
  513797,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("image-plus", [
      ["path", { d: "M16 5h6", key: "1vod17" }],
      ["path", { d: "M19 2v6", key: "4bpg5p" }],
      [
        "path",
        {
          d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",
          key: "1ue2ih",
        },
      ],
      [
        "path",
        { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" },
      ],
      ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
    ]);
    t.s(["ImagePlus", 0, e], 513797);
  },
  368308,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("keyboard", [
      ["path", { d: "M10 8h.01", key: "1r9ogq" }],
      ["path", { d: "M12 12h.01", key: "1mp3jc" }],
      ["path", { d: "M14 8h.01", key: "1primd" }],
      ["path", { d: "M16 12h.01", key: "1l6xoz" }],
      ["path", { d: "M18 8h.01", key: "emo2bl" }],
      ["path", { d: "M6 8h.01", key: "x9i8wu" }],
      ["path", { d: "M7 16h10", key: "wp8him" }],
      ["path", { d: "M8 12h.01", key: "czm47f" }],
      [
        "rect",
        { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" },
      ],
    ]);
    t.s(["Keyboard", 0, e], 368308);
  },
  7891,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("pen-line", [
      ["path", { d: "M13 21h8", key: "1jsn5i" }],
      [
        "path",
        {
          d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
          key: "1a8usu",
        },
      ],
    ]);
    t.s(["default", 0, e]);
  },
  515281,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("pencil", [
      [
        "path",
        {
          d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
          key: "1a8usu",
        },
      ],
      ["path", { d: "m15 5 4 4", key: "1mk7zo" }],
    ]);
    t.s(["Pencil", 0, e], 515281);
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
  69193,
  189622,
  161961,
  456539,
  (t) => {
    "use strict";
    var e = t.i(456420);
    let r = (0, e.default)("text-align-center", [
      ["path", { d: "M21 5H3", key: "1fi0y6" }],
      ["path", { d: "M17 12H7", key: "16if0g" }],
      ["path", { d: "M19 19H5", key: "vjpgq2" }],
    ]);
    t.s(["AlignCenter", 0, r], 69193);
    let n = (0, e.default)("text-align-start", [
      ["path", { d: "M21 5H3", key: "1fi0y6" }],
      ["path", { d: "M15 12H3", key: "6jk70r" }],
      ["path", { d: "M17 19H3", key: "z6ezky" }],
    ]);
    t.s(["AlignLeft", 0, n], 189622);
    let i = (0, e.default)("text-align-end", [
      ["path", { d: "M21 5H3", key: "1fi0y6" }],
      ["path", { d: "M21 12H9", key: "dn1m92" }],
      ["path", { d: "M21 19H7", key: "4cu937" }],
    ]);
    t.s(["AlignRight", 0, i], 161961);
    var a = t.i(144716);
    t.s(["ChevronUp", () => a.default], 456539);
  },
  573474,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("trash-2", [
      ["path", { d: "M10 11v6", key: "nco0om" }],
      ["path", { d: "M14 11v6", key: "outv1u" }],
      [
        "path",
        { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" },
      ],
      ["path", { d: "M3 6h18", key: "d0wm0j" }],
      ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }],
    ]);
    t.s(["Trash2", 0, e], 573474);
  },
  994533,
  524815,
  (t) => {
    "use strict";
    let e = (0, t.i(456420).default)("wand-sparkles", [
      [
        "path",
        {
          d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
          key: "ul74o6",
        },
      ],
      ["path", { d: "m14 7 3 3", key: "1r5n42" }],
      ["path", { d: "M5 6v4", key: "ilb8ba" }],
      ["path", { d: "M19 14v4", key: "blhpug" }],
      ["path", { d: "M10 2v2", key: "7u0qdc" }],
      ["path", { d: "M7 8H3", key: "zfb6yr" }],
      ["path", { d: "M21 16h-4", key: "1cnmox" }],
      ["path", { d: "M11 3H9", key: "1obp7u" }],
    ]);
    t.s(["Wand2", 0, e], 994533);
    var r = t.i(271645);
    let n = "boardrenderer-import";
    async function i(t) {
      let e = new Blob([t])
        .stream()
        .pipeThrough(new DecompressionStream("deflate"));
      return new TextDecoder().decode(await new Response(e).arrayBuffer());
    }
    async function a(t) {
      if (t.length < 8 || 80 !== t[1] || 78 !== t[2] || 71 !== t[3])
        return null;
      let e = new DataView(t.buffer, t.byteOffset, t.byteLength);
      for (let r = 8; r + 12 <= t.length; ) {
        let n = e.getUint32(r),
          a = String.fromCharCode(...t.subarray(r + 4, r + 8));
        if ("tEXt" === a) {
          let e = t.subarray(r + 8, r + 8 + n),
            a = e.indexOf(0);
          if (
            a > 0 &&
            "boardrenderer" === new TextDecoder().decode(e.subarray(0, a))
          )
            try {
              let t = Uint8Array.from(
                  atob(new TextDecoder().decode(e.subarray(a + 1))),
                  (t) => t.charCodeAt(0),
                ),
                r = JSON.parse(await i(t));
              return r?.clip && Array.isArray(r.clip.strokes) ? r.clip : null;
            } catch {
              break;
            }
        }
        if ("IEND" === a) break;
        r += 12 + n;
      }
      return null;
    }
    let l = new Map();
    function s(t) {
      if (!t || !(/^data:image\/png/i.test(t) || /^https?:/i.test(t)))
        return Promise.resolve(null);
      let e = l.get(t);
      return (
        e ||
          ((e = fetch(t)
            .then((t) => (t.ok ? t.arrayBuffer() : null))
            .then((t) => (t ? a(new Uint8Array(t)) : null))
            .catch(() => null)),
          l.set(t, e)),
        e
      );
    }
    async function o(t) {
      let e = await s(t);
      if (!e) return !1;
      try {
        localStorage.setItem(n, JSON.stringify({ clip: e, at: Date.now() }));
      } catch {
        return !1;
      }
      return (window.open("/board-renderer?import=1", "_blank"), !0);
    }
    t.s(
      [
        "BOARD_IMPORT_KEY",
        0,
        n,
        "boardImageFromHtml",
        0,
        function (t) {
          if (!t || !t.includes("data-boardrenderer")) return null;
          let e = t.match(/<img\b[^>]*data-boardrenderer[^>]*>/i)?.[0],
            r = e?.match(
              /\bsrc="(data:image\/png;base64,[A-Za-z0-9+/=]+)"/i,
            )?.[1];
          if (!e || !r) return null;
          let n = (t) =>
            Number(e.match(RegExp(`\\b${t}="(\\d+(?:\\.\\d+)?)"`, "i"))?.[1]) ||
            0;
          return { src: r, width: n("width"), height: n("height") };
        },
        "openInBoard",
        0,
        o,
        "useIsBoardImage",
        0,
        function (t, e = !0) {
          let [n, i] = (0, r.useState)({ src: "", yes: !1 });
          return (
            (0, r.useEffect)(() => {
              if (!e || !t) return;
              let r = !0;
              return (
                s(t).then((e) => {
                  r && i({ src: t, yes: !!e });
                }),
                () => {
                  r = !1;
                }
              );
            }, [t, e]),
            n.src === t && n.yes
          );
        },
      ],
      524815,
    );
  },
  755838,
  (t, e, r) => {
    "use strict";
    var n = t.r(271645),
      i =
        "function" == typeof Object.is
          ? Object.is
          : function (t, e) {
              return (
                (t === e && (0 !== t || 1 / t == 1 / e)) || (t != t && e != e)
              );
            },
      a = n.useState,
      l = n.useEffect,
      s = n.useLayoutEffect,
      o = n.useDebugValue;
    function c(t) {
      var e = t.getSnapshot;
      t = t.value;
      try {
        var r = e();
        return !i(t, r);
      } catch (t) {
        return !0;
      }
    }
    var u =
      "u" < typeof window ||
      void 0 === window.document ||
      void 0 === window.document.createElement
        ? function (t, e) {
            return e();
          }
        : function (t, e) {
            var r = e(),
              n = a({ inst: { value: r, getSnapshot: e } }),
              i = n[0].inst,
              u = n[1];
            return (
              s(
                function () {
                  ((i.value = r), (i.getSnapshot = e), c(i) && u({ inst: i }));
                },
                [t, r, e],
              ),
              l(
                function () {
                  return (
                    c(i) && u({ inst: i }),
                    t(function () {
                      c(i) && u({ inst: i });
                    })
                  );
                },
                [t],
              ),
              o(r),
              r
            );
          };
    r.useSyncExternalStore =
      void 0 !== n.useSyncExternalStore ? n.useSyncExternalStore : u;
  },
  802239,
  (t, e, r) => {
    "use strict";
    (t.i(247167), (e.exports = t.r(755838)));
  },
  752822,
  (t, e, r) => {
    "use strict";
    var n = t.r(271645),
      i = t.r(802239),
      a =
        "function" == typeof Object.is
          ? Object.is
          : function (t, e) {
              return (
                (t === e && (0 !== t || 1 / t == 1 / e)) || (t != t && e != e)
              );
            },
      l = i.useSyncExternalStore,
      s = n.useRef,
      o = n.useEffect,
      c = n.useMemo,
      u = n.useDebugValue;
    r.useSyncExternalStoreWithSelector = function (t, e, r, n, i) {
      var h = s(null);
      if (null === h.current) {
        var d = { hasValue: !1, value: null };
        h.current = d;
      } else d = h.current;
      var p = l(
        t,
        (h = c(
          function () {
            function t(t) {
              if (!o) {
                if (
                  ((o = !0), (l = t), (t = n(t)), void 0 !== i && d.hasValue)
                ) {
                  var e = d.value;
                  if (i(e, t)) return (s = e);
                }
                return (s = t);
              }
              if (((e = s), a(l, t))) return e;
              var r = n(t);
              return void 0 !== i && i(e, r)
                ? ((l = t), e)
                : ((l = t), (s = r));
            }
            var l,
              s,
              o = !1,
              c = void 0 === r ? null : r;
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
          [e, r, n, i],
        ))[0],
        h[1],
      );
      return (
        o(
          function () {
            ((d.hasValue = !0), (d.value = p));
          },
          [p],
        ),
        u(p),
        p
      );
    };
  },
  430224,
  (t, e, r) => {
    "use strict";
    (t.i(247167), (e.exports = t.r(752822)));
  },
]);
