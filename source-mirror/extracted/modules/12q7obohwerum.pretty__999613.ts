// Reconstructed from 12q7obohwerum.pretty.js, module 999613.
// deps: m843476, m534947, m829691, m213269, m715760, m799887, m775691, m375727, m522016, m618566, m494499, m678631, m88653, m532181, m853138, m689664, m484308, m569644, m490985, m456420, m632781, m871315, m753596, m226091, m77071, m570937, m271645, m768877, m24071, m867927, m235381, m809584, m762368, m926894, m741120, m304585, m112092, m328623, m263676, m716400, m389567, m577509, m954206, m482534, m150321, m503561, m952907, m295692, m69193, m761719, m380669, m371406, m855146, m277573, m337161, m849487, m882505, m930800, m124007, m250832, m594069, m189622, m161961, m46794, m716327, m667259, m503490, m689765, m815170, m692630, m221216, m700883, m935829, m77043, m241999, m640460, m933641, m929272, m849635, m897306, m630505, m736469, m151216, m837817, m231240, m644677, m346795, m468132, m856423, m199883, m508734, m576248, m368308, m195780, m950786, m400169, m566595, m435184, m126930, m184270, m189904, m127923, m89011, m857444, m790670, m203602, m237482, m946311, m766887, m979693, m74724, m728231, m456539, m552131, m926787, m590582, m973134, m781947, m167881, m630374, m23750, m939717
// exports: none


"use strict";
    var t = m843476,
      n = m534947,
      r = m829691,
      i = m213269,
      a = m715760,
      s = m799887,
      l = m775691,
      o = m375727,
      c = m522016,
      d = m618566,
      u = m494499,
      h = m678631,
      m = m88653,
      p = m532181,
      x = m853138,
      g = m689664,
      f = m484308,
      b = m569644,
      y = m490985,
      w = m456420;
    let v = (0, w.default)("layers", [
      [
        "path",
        {
          d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
          key: "zw3jo",
        },
      ],
      [
        "path",
        {
          d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
          key: "1wduqc",
        },
      ],
      [
        "path",
        {
          d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
          key: "kqbvx6",
        },
      ],
    ]);
    var j = m632781;
    let k = (0, w.default)("panel-left-open", [
      [
        "rect",
        { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" },
      ],
      ["path", { d: "M9 3v18", key: "fh3hqa" }],
      ["path", { d: "m14 9 3 3-3 3", key: "8010ee" }],
    ]);
    var N = m871315,
      C = m753596,
      T = m226091,
      S = m77071,
      A = m570937,
      E = m271645;
    let M = {
        ready: "bg-[#448361]",
        needs_review: "bg-[#cb912f]",
        stale: "bg-transparent ring-[1.5px] ring-inset ring-[#a3a29e]",
        busy: "bg-[#2383e2] animate-pulse",
      },
      $ = {
        ready: "Đã kiểm",
        needs_review: "Có câu cần xem",
        stale: "Đề gốc đã sửa sau khi tạo mã này",
        busy: "Đang tạo",
      };
    function D({
      tabs: e,
      active: n,
      busy: r,
      stale: i,
      meta: a,
      onSelect: s,
      onCreate: l,
      onDelete: o,
      onExport: c,
    }) {
      let [d, u] = (0, E.useState)(null),
        h = (0, E.useRef)(null),
        m = ["base", ...e.map((e) => e.id)];
      (0, E.useEffect)(() => {
        if (!d) return;
        let e = () => u(null);
        return (
          window.addEventListener("pointerdown", e),
          window.addEventListener("keydown", e),
          () => {
            (window.removeEventListener("pointerdown", e),
              window.removeEventListener("keydown", e));
          }
        );
      }, [d]);
      let p = (e, t) => {
          if ("ArrowRight" !== e.key && "ArrowLeft" !== e.key) return;
          e.preventDefault();
          let n = m.indexOf(t),
            r =
              m[(n + ("ArrowRight" === e.key ? 1 : -1) + m.length) % m.length];
          (s(r),
            requestAnimationFrame(() =>
              h.current?.querySelector(`[data-tab="${r}"]`)?.focus(),
            ));
        },
        x = (e) =>
          `flex h-[30px] shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-[13px] font-medium transition-colors ${e ? "border-[#dcdbd8] bg-white text-[#37352f] shadow-[0_1px_2px_rgba(15,15,15,0.07)]" : "border-transparent text-[#73726e] hover:bg-black/[0.05] hover:text-[#37352f]"}`;
      return (0, t.jsxs)("div", {
        ref: h,
        className:
          "no-print flex h-11 shrink-0 items-center gap-1 overflow-x-auto border-t border-[#e9e9e7] bg-[#f7f6f3] px-2 [scrollbar-width:thin]",
        role: "tablist",
        "aria-label": "Các tab của đề",
        children: [
          (0, t.jsxs)("button", {
            type: "button",
            role: "tab",
            "data-tab": "base",
            "aria-selected": "base" === n,
            tabIndex: "base" === n ? 0 : -1,
            className: x("base" === n),
            onClick: () => s("base"),
            onKeyDown: (e) => p(e, "base"),
            title: "Đề gốc: sửa ở đây thì các mã đề được báo để cập nhật",
            children: [
              (0, t.jsx)(T.FileText, {
                "aria-hidden": !0,
                className: "size-3.5",
              }),
              "Đề gốc",
            ],
          }),
          e.length > 0 &&
            (0, t.jsx)("span", {
              "aria-hidden": !0,
              className: "mx-1 h-[18px] w-px shrink-0 bg-[#dcdbd8]",
            }),
          e.map((e) => {
            let a = n === e.id,
              l =
                r && "version" === e.kind
                  ? "busy"
                  : i && "version" === e.kind
                    ? "stale"
                    : e.status;
            return (0, t.jsxs)(
              "button",
              {
                type: "button",
                role: "tab",
                "data-tab": e.id,
                "aria-selected": a,
                tabIndex: a ? 0 : -1,
                className: x(a),
                onClick: () => s(e.id),
                onKeyDown: (t) => p(t, e.id),
                onContextMenu: (t) => {
                  "version" === e.kind &&
                    (t.preventDefault(),
                    u({ id: e.id, x: t.clientX, y: t.clientY }));
                },
                title:
                  "version" === e.kind
                    ? `${e.title} \xb7 ${$[l] ?? ""}. Chuột phải để xuất hoặc xo\xe1.`
                    : "Bảng đáp án các mã đề",
                children: [
                  "version" === e.kind
                    ? (0, t.jsx)("span", {
                        "aria-hidden": !0,
                        className: `size-[7px] shrink-0 rounded-full ${M[l] ?? M.ready}`,
                      })
                    : (0, t.jsx)(A.Table2, {
                        "aria-hidden": !0,
                        className: "size-3.5",
                      }),
                  e.title,
                ],
              },
              e.id,
            );
          }),
          (0, t.jsxs)("button", {
            type: "button",
            onClick: l,
            className:
              "ml-1 flex h-[30px] shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-[#73726e] transition-colors hover:bg-black/[0.05] hover:text-[#37352f]",
            title: "Mở Xưởng mã đề: trộn, đổi số liệu, câu tương đồng",
            children: [
              e.length
                ? (0, t.jsx)(S.Plus, { "aria-hidden": !0, className: "size-4" })
                : (0, t.jsx)(v, { "aria-hidden": !0, className: "size-4" }),
              e.length ? "" : "Tạo mã đề",
            ],
          }),
          (0, t.jsx)("span", {
            className: "ml-auto shrink-0 pl-3 text-xs text-[#a3a29e]",
            children: a,
          }),
          d &&
            (0, t.jsxs)("div", {
              className:
                "fixed z-50 min-w-44 rounded-lg border border-[#e9e9e7] bg-white p-1 text-[13px] text-[#37352f] shadow-lg",
              style: { left: d.x, top: d.y - 84 },
              onPointerDown: (e) => e.stopPropagation(),
              children: [
                (0, t.jsx)("button", {
                  type: "button",
                  className:
                    "block w-full rounded-md px-2.5 py-1.5 text-left hover:bg-[#f1f1ef]",
                  onClick: () => {
                    (c(d.id), u(null));
                  },
                  children: "Tải mã này (Word)",
                }),
                (0, t.jsx)("button", {
                  type: "button",
                  className:
                    "block w-full rounded-md px-2.5 py-1.5 text-left text-[#c4423d] hover:bg-[#fbe6e5]",
                  onClick: () => {
                    (o(d.id), u(null));
                  },
                  children: "Xoá mã này",
                }),
              ],
            }),
        ],
      });
    }
    var I = m768877,
      L = m24071,
      R = m867927,
      z = m235381,
      _ = m809584,
      P = m762368;
    let H = (0, w.default)("hash", [
      ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
      ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
      ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
      ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }],
    ]);
    var q = m926894;
    let F = (0, w.default)("pin", [
      ["path", { d: "M12 17v5", key: "bb1du9" }],
      [
        "path",
        {
          d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
          key: "1nkz8b",
        },
      ],
    ]);
    var B = m741120,
      O = m304585;
    let W = (0, w.default)("shuffle", [
      ["path", { d: "m18 14 4 4-4 4", key: "10pe0f" }],
      ["path", { d: "m18 2 4 4-4 4", key: "pucp1d" }],
      [
        "path",
        {
          d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22",
          key: "1ailkh",
        },
      ],
      ["path", { d: "M2 6h1.972a4 4 0 0 1 3.6 2.2", key: "km57vx" }],
      [
        "path",
        { d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45", key: "os18l9" },
      ],
    ]);
    var X = m112092,
      G = m328623,
      K = m263676,
      U = m716400;
    function V({ doc: e }) {
      return (0, t.jsx)(t.Fragment, {
        children: (function e(n) {
          return (n.content ?? []).map((n, r) =>
            (function (n, r) {
              let i = n.attrs;
              switch (n.type) {
                case "text":
                  return (n.marks ?? []).reduceRight(
                    (e, n) =>
                      (function (e, n, r) {
                        switch (e.type) {
                          case "bold":
                            return (0, t.jsx)("strong", { children: n }, r);
                          case "italic":
                            return (0, t.jsx)("em", { children: n }, r);
                          case "underline":
                            return (0, t.jsx)("u", { children: n }, r);
                          case "strike":
                            return (0, t.jsx)("s", { children: n }, r);
                          case "subscript":
                            return (0, t.jsx)("sub", { children: n }, r);
                          case "superscript":
                            return (0, t.jsx)("sup", { children: n }, r);
                          case "boxed":
                            return (0, t.jsx)(
                              "span",
                              { className: "doc-boxed", children: n },
                              r,
                            );
                          case "link": {
                            let i = Z(e.attrs?.href);
                            return i
                              ? (0, t.jsx)(
                                  "a",
                                  {
                                    href: i,
                                    rel: "nofollow ugc noopener",
                                    target: "_blank",
                                    children: n,
                                  },
                                  r,
                                )
                              : n;
                          }
                          default:
                            return n;
                        }
                      })(n, e, r),
                    n.text ?? "",
                  );
                case "hardBreak":
                  return (0, t.jsx)("br", {}, r);
                case "math":
                  let a = String(i?.latex ?? "");
                  try {
                    a = decodeURIComponent(a);
                  } catch {}
                  let s = !!i?.display,
                    l = U.default.renderToString(a, {
                      throwOnError: !1,
                      displayMode: s,
                      output: "mathml",
                      strict: "ignore",
                    });
                  return (0, t.jsx)(
                    "span",
                    {
                      className: s ? "doc-math doc-math-display" : "doc-math",
                      dangerouslySetInnerHTML: { __html: l },
                    },
                    r,
                  );
                case "paragraph":
                  return (0, t.jsx)("p", { style: Q(i), children: e(n) }, r);
                case "heading": {
                  let a = Math.min(6, Math.max(2, (Number(i?.level) || 1) + 1)),
                    s = `h${a}`;
                  return (0, t.jsx)(
                    s,
                    { style: Q(i), className: "font-bold", children: e(n) },
                    r,
                  );
                }
                case "examHeader":
                  return (0, t.jsx)(
                    "div",
                    {
                      className: "doc-header",
                      style: { "--header-columns": "1fr 1.4fr" },
                      children: e(n),
                    },
                    r,
                  );
                case "headerColumn":
                  return (0, t.jsx)(
                    "div",
                    { className: "doc-header-col", children: e(n) },
                    r,
                  );
                case "grid": {
                  let a = Math.min(4, Math.max(1, Number(i?.columns) || 2)),
                    s = i?.autoColumns === !0;
                  return (0, t.jsx)(
                    "div",
                    {
                      className: "doc-grid",
                      style: {
                        gridTemplateColumns: s
                          ? "repeat(auto-fit, minmax(160px, 1fr))"
                          : `repeat(${a}, minmax(0, 1fr))`,
                      },
                      children: e(n),
                    },
                    r,
                  );
                }
                case "gridCell":
                  return (0, t.jsx)(
                    "div",
                    { className: "doc-grid-cell", children: e(n) },
                    r,
                  );
                case "docColumns":
                  return (0, t.jsx)(
                    "div",
                    {
                      style: {
                        columnCount: Math.min(
                          3,
                          Math.max(1, Number(i?.columns) || 2),
                        ),
                        columnGap: 24,
                      },
                      children: e(n),
                    },
                    r,
                  );
                case "table":
                  return (0, t.jsx)(
                    "div",
                    {
                      className: "doc-table-wrapper overflow-x-auto",
                      children: (0, t.jsx)("table", {
                        className: "doc-table",
                        children: (0, t.jsx)("tbody", { children: e(n) }),
                      }),
                    },
                    r,
                  );
                case "tableRow":
                  return (0, t.jsx)("tr", { children: e(n) }, r);
                case "tableHeader":
                  return (0, t.jsx)("th", { ...Y(i), children: e(n) }, r);
                case "tableCell":
                  return (0, t.jsx)("td", { ...Y(i), children: e(n) }, r);
                case "bulletList":
                  return (0, t.jsx)(
                    "ul",
                    { className: "list-disc pl-6", children: e(n) },
                    r,
                  );
                case "orderedList":
                  return (0, t.jsx)(
                    "ol",
                    { className: "list-decimal pl-6", children: e(n) },
                    r,
                  );
                case "listItem":
                  return (0, t.jsx)("li", { children: e(n) }, r);
                case "horizontalRule":
                  return (0, t.jsx)(
                    "hr",
                    { className: "my-2 border-black" },
                    r,
                  );
                case "pageBreak":
                  return null;
                case "examImage": {
                  let e = Z(i?.src),
                    n = String(i?.alt ?? "");
                  if (!e)
                    return n
                      ? (0, t.jsxs)(
                          "p",
                          {
                            className: "text-center italic",
                            children: ["[", n, "]"],
                          },
                          r,
                        )
                      : null;
                  let a = Math.min(Number(i?.width) || 320, 661);
                  return (0, t.jsx)(
                    "img",
                    {
                      src: e,
                      alt: n,
                      width: a,
                      loading: "lazy",
                      decoding: "async",
                      className: "mx-auto my-1 block h-auto max-w-full",
                    },
                    r,
                  );
                }
                default:
                  if (J[n.type])
                    return (0, t.jsxs)(
                      "p",
                      {
                        className:
                          "my-1 text-center text-[0.9em] text-[#787774] italic",
                        children: ["[", J[n.type], "]"],
                      },
                      r,
                    );
                  return (0, t.jsx)("div", { children: e(n) }, r);
              }
            })(n, r),
          );
        })(e),
      });
    }
    let J = {
      geometryDiagram: "Hình vẽ",
      vectorDiagram: "Hình vẽ",
      functionGraph: "Đồ thị",
      statChart: "Biểu đồ",
      variationTable: "Bảng biến thiên",
    };
    function Q(e) {
      let t = e?.textAlign;
      return "string" == typeof t ? { textAlign: t } : void 0;
    }
    function Y(e) {
      let t = Number(e?.colspan) || 1,
        n = Number(e?.rowspan) || 1;
      return { colSpan: t > 1 ? t : void 0, rowSpan: n > 1 ? n : void 0 };
    }
    function Z(e) {
      return "string" == typeof e && /^https?:\/\//i.test(e) ? e : null;
    }
    var ee = m389567,
      et = m577509,
      en = m954206,
      er = m482534;
    let ei = /m[ãa] đề(?: thi)?\s*:?\s*\**\s*(\d{3,4})/gi,
      ea =
        /^(?:\d+\.\s*|[IVX]+\.\s*)?(?:bảng\s+)?(?:đáp án|hướng dẫn (?:chấm|giải)|lời giải(?: chi tiết)?|barem|thang điểm|bài làm mẫu)\b/i,
      es = /^(?:phần|part)\s+([ivx]+|\d+)\b|^[ivx]+\.\s+\S/i,
      el = /^```(?:geometry|graph|diagram|chart|variation)\b/,
      eo =
        /(?:dùng|sử dụng|căn cứ|dựa (?:vào|trên))\s+(?:các\s+)?(?:thông tin|dữ (?:kiện|liệu)|đoạn|bảng|biểu đồ|hình|văn bản)|đọc (?:đoạn|văn bản|bài|thông tin|ngữ liệu|bảng)|(?:trả lời|cho) (?:các\s+)?câu(?: hỏi)?(?: từ)?\s*\d+/i,
      ec = /câu\s*(\d+)\s*(?:đến|tới|-|–|và)\s*(?:câu\s*)?(\d+)/i,
      ed = /^\s*(?:\*\*)?\s*([A-D])\s*[.)]\s*(?:\*\*)?\s*/,
      eu = /^\s*(?:\*\*)?\s*([a-d])\s*\)\s*(?:\*\*)?\s*/,
      eh =
        /(?:cả|tất cả)\s+(?:ba\s+|bốn\s+|hai\s+)?(?:phương án|đáp án|các)|các (?:phương án|đáp án) trên|\b[A-D]\s*(?:và|,)\s*[A-D]\b|không có (?:phương án|đáp án)|đều (?:đúng|sai)/i;
    function em(e) {
      let t = [];
      for (let n of e.matchAll(ei)) t.includes(n[1]) || t.push(n[1]);
      return t;
    }
    function ep(e) {
      return (0, er.plainText)(e.replace(/\$+/g, " "))
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
    }
    function ex(e) {
      let t = 0x811c9dc5;
      for (let n = 0; n < e.length; n++)
        ((t ^= e.charCodeAt(n)), (t = Math.imul(t, 0x1000193) >>> 0));
      return t.toString(36);
    }
    function eg(e) {
      let t = e.trimStart();
      return el.test(t) || /^!\[/.test(t);
    }
    function ef(e) {
      if ((0, er.isQuestionStart)(e)) return !1;
      let t = (0, er.segmentFirstText)(e);
      return (
        !!t &&
        !(t.length > 160) &&
        ((0, er.isHeading)(e) ||
          /^\s*\*\*/.test(e) ||
          /^:::/.test(e.trimStart())) &&
        es.test(t)
      );
    }
    function eb(e) {
      let t = (0, er.plainText)(e.replace(/\n/g, " "));
      if (!eo.test(t)) return null;
      let n = ec.exec(t);
      if (n) {
        let e = Number(n[1]),
          t = Number(n[2]);
        if (t > e && t - e < 20) return [e, t];
      }
      return null;
    }
    function ey(e) {
      let t,
        n = e.split("\n"),
        r = n[0].trim();
      if (/^::: (?:choices|grid)\b/.test(r))
        t = n.slice(1, ":::" === n[n.length - 1].trim() ? -1 : void 0);
      else {
        if (!(ed.test(r) && /^\s*(?:\*\*)?\s*A\s*[.)]/.test(r))) return null;
        t = n;
      }
      let i = t.map((e) => e.trim()).filter(Boolean);
      if (i.length < 2 || i.length > 6) return null;
      let a = [];
      for (let e = 0; e < i.length; e++) {
        let t = ed.exec(i[e]);
        if ((/^::: (?:grid)\b/.test(r) && !t) || (t && t[1] !== "ABCDEF"[e]))
          return null;
        a.push(t ? i[e].slice(t[0].length).trim() : i[e]);
      }
      return a;
    }
    function ew(e) {
      let t = [];
      return (
        e.forEach((e, n) => {
          e.trimStart().startsWith("```") ||
            e.trimStart().startsWith(":::") ||
            e.split("\n").forEach((e, r) => {
              let i = eu.exec(e);
              i &&
                i[1] === "abcd"[t.length] &&
                t.push({ segment: n, line: r, text: e.slice(i[0].length) });
            });
        }),
        4 === t.length ? t : []
      );
    }
    function ev(e) {
      let t = (0, er.splitSegments)(e),
        n = t.findIndex(er.isQuestionStart),
        r = {
          head: [],
          parts: [],
          tail: [],
          answerArea: [],
          questions: [],
          codes: em(e),
          baseAnswers: {},
        };
      if (n < 0) return ((r.head = t), r);
      let i = t.findIndex(
        (e, t) =>
          t > n &&
          (function (e) {
            if ((0, er.isQuestionStart)(e)) return !1;
            let t = e.trimStart(),
              n = t.startsWith(":::")
                ? (0, er.plainText)(e.split("\n")[1] ?? "")
                : (0, er.segmentFirstText)(e);
            return (
              !!n &&
              !(n.length > 80) &&
              ea.test(n) &&
              ((0, er.isHeading)(e) ||
                /^\s*(?:\*\*|:::|#)/.test(t) ||
                n === n.toUpperCase())
            );
          })(e),
      );
      if (i >= 0) for (; i > 0 && /^\\newpage$/.test(t[i - 1].trim()); ) i--;
      else i = t.length;
      let a = t.slice(0, i);
      r.answerArea = t.slice(i);
      let s = -1;
      a.forEach((e, t) => {
        (0, er.isQuestionStart)(e) && (s = t);
      });
      let l = a.length;
      for (let e = s + 1; e < a.length; e++) {
        
        if (
          ((o = a[e]),
          /-{2,}\s*hết\s*-{2,}|^\s*\**\s*hết\s*\**\s*$/i.test(
            (0, er.plainText)(o.split("\n").find((e) => /hết/i.test(e)) ?? ""),
          ) || /^\\newpage$/.test(a[e].trim()))
        ) {
          l = e;
          break;
        }
      }
      let c = n;
      for (; c > 0 && (eg(a[c - 1]) || eb(a[c - 1])); ) c--;
      for (let e = c - 1; e >= 0; e--)
        if (ef(a[e])) {
          c = e;
          break;
        }
      ((r.head = a.slice(0, c)), (r.tail = a.slice(l)));
      let d = null,
        u = null,
        h = null,
        m = [],
        p = null,
        x = (e) => e.some((e) => ey(e)) || 4 === ew(e).length,
        g = () => {
          if (!h) return;
          let e = (function (e, t, n) {
            
            let i,
              a,
              s,
              l = Math.max(0, e.findIndex(er.isQuestionStart)),
              o =
                ((r = e[l]),
                (a = (0, er.questionLabel)(r)),
                Number.isFinite((s = Number(/(\d+)/.exec(a)?.[1]))) ? s : 0),
              c = -1,
              d = null;
            e.forEach((e, t) => {
              if (d) return;
              let n = ey(e);
              n && ((d = n), (c = t));
            });
            let u = d ? [] : ew(e);
            i = d
              ? "mc"
              : 4 === u.length && "essay" !== n
                ? "tf"
                : "sa" === n || "mc" === n || "tf" === n
                  ? "sa"
                  : /^(?:\*\*)?\s*bài\b/i.test(e[l].trimStart())
                    ? "essay"
                    : (n ?? "essay");
            let h = e.join("\n"),
              m = (0, er.questionLabel)(e[l]),
              p = [];
            for (let e of h
              .slice(h.indexOf(m) + m.length)
              .matchAll(/câu\s+(\d+)/gi)) {
              let t = Number(e[1]);
              t === o || p.includes(t) || p.push(t);
            }
            let x = d ?? [];
            return {
              id: `q${t + 1}`,
              no: o,
              kind: i,
              segments: e,
              options: d,
              optionsAt: c,
              pinned: x.map((e) => eh.test((0, er.plainText)(e))),
              statements: u,
              hasFigure: e.some(eg) || /!\[[^\]]*\]\(/.test(h),
              refs: p,
              lead: l > 0 && e.slice(0, l).some((e) => !eg(e)),
              fingerprint: ex(ep(h.replace(m, ""))),
            };
          })(h, r.questions.length, u);
          (r.questions.push(e),
            d || ((d = { intro: [], title: "", units: [] }), r.parts.push(d)),
            p && e.no <= p.until
              ? p.group.questions.push(e)
              : ((p = null), d.units.push({ kind: "q", q: e })),
            (h = null));
        };
      for (let e = c; e < l; e++) {
        let t = a[e];
        if (ef(t)) {
          (g(),
            (p = null),
            (d = {
              intro: [...m, t],
              title: (0, er.segmentFirstText)(t),
              units: [],
            }),
            (m = []),
            (u = (function (e) {
              let t = e.toLowerCase();
              return /đúng\s*(?:\/|-)?\s*sai|đúng sai/.test(t)
                ? "tf"
                : /trả lời ngắn/.test(t)
                  ? "sa"
                  : /tự luận/.test(t)
                    ? "essay"
                    : /nhiều phương án|lựa chọn|trắc nghiệm/.test(t)
                      ? "mc"
                      : null;
            })(d.title)),
            r.parts.push(d));
          continue;
        }
        if ((0, er.isQuestionStart)(t)) {
          (g(), (h = [...m, t]), (m = []));
          continue;
        }
        let n = eb(t);
        if (n) {
          (g(),
            d || ((d = { intro: [], title: "", units: [] }), r.parts.push(d)));
          let e = { context: [...m, t], questions: [] };
          ((m = []),
            (p = { group: e, until: n[1] }),
            d.units.push({ kind: "group", group: e }));
          continue;
        }
        if (eg(t)) {
          let n = e + 1;
          for (; n < l && eg(a[n]); ) n++;
          if (n < l && (0, er.isQuestionStart)(a[n]) && h) {
            m.push(t);
            continue;
          }
        }
        h && x(h) && !eg(t)
          ? m.push(t)
          : h
            ? h.push(t)
            : p && 0 === p.group.questions.length
              ? p.group.context.push(t)
              : d && 0 === d.units.length
                ? d.intro.push(t)
                : m.push(t);
      }
      for (let e of (g(), m.length && (r.tail = [...m, ...r.tail]), r.parts))
        e.units = e.units.filter(
          (e) => "q" === e.kind || e.group.questions.length > 0,
        );
      return (
        (r.baseAnswers = (function (e) {
          let t = new Map();
          for (let n of e.questions) t.has(n.no) || t.set(n.no, n);
          let n = new Map(),
            r = (e, r) => {
              let i = t.get(e),
                a = ej(i?.kind ?? "sa", r);
              i && a && !n.has(e) && n.set(e, a);
            },
            i = (e) =>
              e
                .split("\n")
                .filter(
                  (e) =>
                    e.trim().startsWith("|") && !/^\s*\|?\s*:?-{2,}/.test(e),
                )
                .map((e) =>
                  e
                    .trim()
                    .replace(/^\||\|$/g, "")
                    .split("|")
                    .map((e) => (0, er.plainText)(e)),
                );
          for (let t of e.answerArea) {
            let e = i(t);
            for (let t = 0; t + 1 < e.length; t++)
              /^câu$/i.test(e[t][0]) &&
                /đáp án|đ\/a|^đa$/i.test(e[t + 1][0]) &&
                e[t].slice(1).forEach((n, i) => {
                  let a = Number(n);
                  Number.isInteger(a) && r(a, e[t + 1][i + 1] ?? "");
                });
            if (
              e.length > 1 &&
              /^câu/i.test(e[0][0]) &&
              /đáp án/i.test(e[0][1] ?? "")
            )
              for (let t of e.slice(1)) {
                let e = Number(/(\d+)/.exec(t[0])?.[1]);
                Number.isInteger(e) && r(e, t[1] ?? "");
              }
            for (let e of t.split("\n"))
              for (let t of (0, er.plainText)(e).matchAll(
                /câu\s*(\d+)\s*[:.)-]\s*([A-D](?![a-zà-ỹ])|[ĐS]{4}|-?\d+(?:[,.]\d+)?)/gi,
              ))
                r(Number(t[1]), t[2]);
          }
          let a = {};
          for (let [e, r] of n) a[t.get(e).id] = r;
          return a;
        })(r)),
        r
      );
    }
    function ej(e, t) {
      let n = (0, er.plainText)(t).trim();
      if ("mc" === e)
        return /^[A-D]$/i.test(n)
          ? n.toUpperCase()
          : (/^([A-D])[.)\s]/i.exec(n)?.[1]?.toUpperCase() ?? "");
      if ("tf" === e) {
        let e = n
          .toUpperCase()
          .replace(/[^ĐSDT F]/g, "")
          .replace(/\s/g, "")
          .replace(/[DT]/g, "Đ")
          .replace(/F/g, "S");
        return /^[ĐS]{4}$/.test(e) ? e : "";
      }
      return "sa" === e && /^-?\d+(?:[,.]\d+)?$/.test(n)
        ? n.replace(".", ",")
        : "";
    }
    let ek = "ABCDEF",
      eN = { mc: "choice", tf: "trueFalse", sa: "shortAnswer", essay: "essay" };
    function eC(e) {
      let t = Number.parseInt(ex(e), 36) >>> 0;
      return () => {
        let e = (t = (t + 0x6d2b79f5) >>> 0);
        return (
          (e = Math.imul(e ^ (e >>> 15), 1 | e)),
          (((e ^= e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ (e >>> 14)) >>> 0) /
            0x100000000
        );
      };
    }
    function eT(e, t) {
      let n = t.slice();
      for (let t = n.length - 1; t > 0; t--) {
        let r = Math.floor(e() * (t + 1));
        [n[t], n[r]] = [n[r], n[t]];
      }
      return n;
    }
    function eS(e) {
      return {
        count: 4,
        codeStyle: "101",
        firstKeepsBase: !1,
        parts: e.parts.map((e) => {
          let t = e.units.flatMap((e) =>
            "q" === e.kind ? [e.q.kind] : e.group.questions.map((e) => e.kind),
          );
          return {
            order:
              t.length > 0 && t.every((e) => "essay" === e)
                ? "keep"
                : "shuffle",
            options: t.includes("mc") ? "shuffle" : "keep",
            content: "keep",
          };
        }),
        balance: !0,
        spread: !0,
        verify: !0,
        answers: "tab",
        salt: 1,
      };
    }
    function eA(e, t, n) {
      let r = new Set(n.lockOrder),
        i = new Map();
      e.parts.forEach((e, t) =>
        e.units.forEach((e) =>
          ("q" === e.kind ? [e.q] : e.group.questions).forEach((e) =>
            i.set(e.no, t),
          ),
        ),
      );
      let a = [];
      for (let t of e.questions)
        for (let e of t.refs) {
          if (!i.has(e)) continue;
          let n = Math.min(e, t.no),
            s = Math.max(e, t.no);
          s - n <= 4 && i.get(n) === i.get(s)
            ? a.push(Array.from({ length: s - n + 1 }, (e, t) => n + t))
            : (r.add(t.no), r.add(e));
        }
      let s = [...n.groups, ...a];
      return e.parts.map((e, n) => {
        let i = [];
        for (let t of e.units)
          "group" === t.kind
            ? i.push({
                key: t.group.questions.map((e) => e.id).join("+"),
                questions: t.group.questions,
                context: t.group.context,
                locked: !1,
              })
            : i.push({
                key: t.q.id,
                questions: [t.q],
                context: [],
                locked: !1,
              });
        for (let e of s) {
          let t = i
            .map((t, n) => (t.questions.some((t) => e.includes(t.no)) ? n : -1))
            .filter((e) => e >= 0);
          if (t.length < 2 || t[t.length - 1] - t[0] != t.length - 1) continue;
          let n = {
            key: t.map((e) => i[e].key).join("+"),
            questions: t.flatMap((e) => i[e].questions),
            context: t.flatMap((e) => i[e].context),
            locked: !1,
          };
          i.splice(t[0], t.length, n);
        }
        let a = t.parts[n]?.order === "keep";
        for (let e of i) e.locked = a || e.questions.some((e) => r.has(e.no));
        return i;
      });
    }
    function eE(e, t) {
      return e.replace(/(câu\s*)(\d+)/gi, (e, n, r) =>
        t.has(Number(r)) ? `${n}${t.get(Number(r))}` : e,
      );
    }
    function eM(e) {
      return e.join("\n\n");
    }
    function e$(e) {
      return e.questions.length > 1 || e.context.length
        ? e.key
        : e.questions[0].id;
    }
    function eD(e, t, n, r) {
      let i = [];
      return (
        eA(e, t, n).forEach((e, a) => {
          for (let s of e) {
            let e = s.questions
              .map((e) => {
                
                return (r = {
                  settings: t,
                  constraints: n,
                }).constraints.keepContent.includes(e.no)
                  ? "keep"
                  : (r.settings.parts[a]?.content ?? "keep");
              })
              .find((e) => "keep" !== e);
            if (!e) continue;
            let l = s.questions.length > 1 || s.context.length > 0,
              o = [
                ...s.context,
                ...s.questions.flatMap((e) => e.segments),
              ].join("\n\n");
            i.push({
              key: e$(s),
              kind: l ? "group" : s.questions[0].kind,
              kinds: s.questions.map((e) => e.kind),
              markdown: o,
              answer: s.questions.map((e) => r[e.id] ?? "").join(l ? "|" : ""),
              hasFigure: s.questions.some((e) => e.hasFigure),
              mode: e,
              questions: s.questions.map((e) => e.id),
            });
          }
        }),
        i
      );
    }
    function eI(e) {
      let { ir: t, settings: n, constraints: r, codes: i } = e,
        a = eA(t, n, r),
        s = a.map(() => []),
        l = n.firstKeepsBase,
        o = new Set(r.keepOptions);
      return i.map((r, i) => {
        let c = l && 0 === i,
          d = l ? i - 1 : i,
          u = eC(`${e.seed}|${r}|${n.salt}`),
          h = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 },
          m = [],
          p = [],
          x = 0;
        a.forEach((r, i) => {
          let a = n.parts[i] ?? {
            order: "keep",
            options: "keep",
            content: "keep",
          };
          m.push(...t.parts[i].intro);
          let l = c
            ? r
            : (function (e, t, n, r) {
                let i = t
                  .map((e, t) => (e.locked ? -1 : t))
                  .filter((e) => e >= 0);
                if (i.length < 2) return t;
                let a = t,
                  s = 1 / 0,
                  l = r ? 16 : 1;
                for (let r = 0; r < l; r++) {
                  let r = eT(e, i),
                    l = t.slice();
                  i.forEach((e, n) => {
                    l[e] = t[r[n]];
                  });
                  let o = 0;
                  for (let e of [t.map((e) => e.key), ...n])
                    l.forEach((t, n) => (e[n] === t.key ? o++ : 0));
                  o < s && ((a = l), (s = o));
                }
                return a;
              })(u, r, s[i], n.spread);
          for (let t of (s[i].push(l.map((e) => e.key)), l)) {
            let r = x + 1,
              i = new Map();
            t.questions.forEach((e, t) => i.set(e.no, r + t));
            let s = c || d < 0 ? void 0 : e.variants[e$(t)]?.[d],
              l = s
                ? (function (e, t) {
                    let n = ev(e);
                    if (n.questions.length !== t.length) return null;
                    let r = n.questions.map((e, n) => ({
                      ...e,
                      kind: t[n].kind,
                    }));
                    return r.every((e, n) =>
                      "mc" === t[n].kind
                        ? !!e.options &&
                          e.options.length ===
                            (t[n].options?.length ?? e.options.length)
                        : "tf" !== t[n].kind || 4 === e.statements.length,
                    )
                      ? {
                          context: [
                            ...n.head,
                            ...n.parts.flatMap((e) => e.intro),
                            ...n.parts.flatMap((e) =>
                              e.units.flatMap((e) =>
                                "group" === e.kind ? e.group.context : [],
                              ),
                            ),
                          ],
                          questions: r,
                        }
                      : null;
                  })(s.markdown, t.questions)
                : null,
              g = l ? l.context : t.context;
            m.push(
              ...g.map((e) =>
                eE(
                  e,
                  l ? new Map(l.questions.map((e, t) => [e.no, r + t])) : i,
                ),
              ),
            );
            let f = s ? s.answer.split("|") : [],
              b = l ? new Map(l.questions.map((e, t) => [e.no, r + t])) : i;
            t.questions.forEach((r, i) => {
              x++;
              let d = l ? l.questions[i] : r,
                g = { ...d, segments: d.segments.map((e) => eE(e, b)) },
                y = l
                  ? ej(g.kind, f[t.questions.length > 1 ? i : 0] ?? "")
                  : (e.answers[r.id] ?? ""),
                w = !c && "shuffle" === a.options && !o.has(r.no),
                v =
                  w && "mc" === g.kind
                    ? (function (e, t, n, r, i) {
                        if (!t.options) return;
                        let a = t.options.length,
                          s = t.options
                            .map((e, t) => t)
                            .filter((e) => !t.pinned[e]),
                          l = ek.indexOf(n),
                          o = null;
                        for (let n = 0; n < (i && l >= 0 ? 10 : 1); n++) {
                          let n = eT(e, s),
                            i = 0,
                            c = Array.from({ length: a }, (e, r) =>
                              t.pinned[r] ? r : n[i++],
                            ),
                            d = l >= 0 ? c.indexOf(l) : 0,
                            u = l >= 0 ? (r[ek[d]] ?? 0) : 0;
                          (!o || u < o.score) && (o = { order: c, score: u });
                        }
                        return o.order;
                      })(u, g, y, h, n.balance)
                    : void 0,
                j =
                  w && "tf" === g.kind && 4 === g.statements.length
                    ? eT(u, [0, 1, 2, 3])
                    : void 0,
                k = y;
              if ("mc" === g.kind && y) {
                let e = ek.indexOf(y),
                  t = v ? v.indexOf(e) : e;
                (k = t >= 0 ? ek[t] : "") && (h[k] = (h[k] ?? 0) + 1);
              }
              "tf" === g.kind &&
                4 === y.length &&
                j &&
                (k = j.map((e) => y[e]).join(""));
              let N = (function (e, t, n, r) {
                
                let s = Math.max(
                    0,
                    e.segments.findIndex((e) =>
                      /^\s*(?:\*\*|__)?\s*(?:câu|bài|question)\s+\d+/i.test(e),
                    ),
                  ),
                  l = e.segments.map((e, n) =>
                    n === s
                      ? e.replace(
                          /^(\s*(?:\*\*|__)?\s*(?:câu|bài|question)\s+)(\d+)/i,
                          (e, n) => `${n}${t}`,
                        )
                      : e,
                  );
                if (
                  (n &&
                    e.options &&
                    e.optionsAt >= 0 &&
                    (l[e.optionsAt] =
                      ((i = e.segments[e.optionsAt]),
                      (a = n.map((t) => e.options[t])),
                      [
                        i.split("\n")[0].trim().startsWith(":::")
                          ? i.split("\n")[0].trim()
                          : "::: choices",
                        ...a.map((e, t) => `**${ek[t]}.** ${e}`),
                        ":::",
                      ].join("\n"))),
                  r && 4 === e.statements.length)
                ) {
                  let t = new Map();
                  for (let [n, i] of (e.statements.forEach((e) => {
                    t.has(e.segment) ||
                      t.set(e.segment, l[e.segment].split("\n"));
                  }),
                  e.statements.forEach((n, i) => {
                    let a = e.statements[r[i]];
                    t.get(n.segment)[n.line] = `${"abcd"[i]}) ${a.text}`;
                  }),
                  t))
                    l[n] = i.join("\n");
                }
                return l;
              })(g, x, v, j);
              m.push(...N);
              let C = "mc" === g.kind ? ek.indexOf(y) : -1;
              p.push({
                qid: r.id,
                no: x,
                kind: g.kind,
                source: l && s ? s.source.kind : "base",
                optionOrder: v,
                statementOrder: j,
                answer: k,
                correctText:
                  g.options && C >= 0 ? ep(g.options[C] ?? "") : void 0,
                markdown: l ? eM(g.segments) : void 0,
                bankId: l ? s?.source.bankId : void 0,
                label: l ? s?.source.label : void 0,
                score: l ? s?.source.score : void 0,
                check: l ? s?.check : void 0,
                baseFingerprint: r.fingerprint,
                rendered: ex(
                  ep(eM(N).replace(/^(\s*(?:\*\*)?\s*(?:câu|bài)\s+\d+)/i, "")),
                ),
              });
            });
          }
        });
        let g = p.map((e) => ({
            label: `C\xe2u ${e.no}`,
            kind: eN[e.kind],
            answer: e.answer,
            solved: "base" !== e.source,
          })),
          f = [
            ...(function (e, t) {
              let n = !1,
                r = e.map((e) =>
                  e.replace(
                    /(m[ãa] đề(?: thi)?\s*:?\s*\**\s*)(\d{3,4})/gi,
                    (e, r) => ((n = !0), `${r}${t}`),
                  ),
                );
              if (n) return r;
              let i = `::: right
<box=3,24,3,24>**M\xe3 đề: ${t}**</box>
:::`,
                a = r.findIndex((e) => e.trimStart().startsWith("::: header"));
              return (r.splice(a >= 0 ? a + 1 : 0, 0, i), r);
            })(t.head, r),
            ...m,
            ...t.tail,
          ];
        return (
          "after" === n.answers &&
            f.push(
              "\\newpage",
              `::: center
**Đ\xc1P \xc1N M\xc3 ĐỀ ${r}**
:::`,
              ...(function (e, t = 10) {
                let n = [];
                for (let r = 0; r < e.length; r += t) {
                  let i = e.slice(r, r + t),
                    a = `| C\xe2u | ${i.map((e) => e.label.replace(/^Câu\s*/i, "")).join(" | ")} |`,
                    s = `|${"---|".repeat(i.length + 1)}`,
                    l = `| Đ\xe1p \xe1n | ${i.map((e) => e.answer || "?").join(" | ")} |`;
                  n.push([a, s, l].join("\n"));
                }
                return n;
              })(g),
            ),
          {
            code: r,
            markdown: f.join("\n\n"),
            spec: { v: 1, code: r, questions: p },
            key: g,
          }
        );
      });
    }
    function eL(e, t, n) {
      if (0 === t.length) return "";
      let r = Math.max(...t.map((e) => e.key.length)),
        i = `| C\xe2u | ${t.map((e) => e.code).join(" | ")} |
|${"---|".repeat(t.length + 1)}`,
        a = Array.from(
          { length: r },
          (e, n) =>
            `| ${n + 1} | ${t.map((e) => e.key[n]?.answer || "?").join(" | ")} |`,
        ).join("\n"),
        s = Array.from(
          { length: r },
          (e, r) =>
            `| ${r + 1} | ${t.map((e) => n.get(e.spec.questions[r]?.qid ?? "") ?? "").join(" | ")} |`,
        ).join("\n");
      return [
        "::: center\n**BẢNG ĐÁP ÁN CÁC MÃ ĐỀ**\n:::",
        e
          ? `::: center
*${e.replace(/\*/g, "")}*
:::`
          : "",
        `${i}
${a}`,
        "::: center\n**BẢNG ĐỐI CHIẾU VỚI ĐỀ GỐC**\n:::",
        "*Mỗi ô là số câu ở đề gốc tương ứng với câu cùng hàng của mã đề. Bảng này dành cho giáo viên, không in cho học sinh.*",
        `| C\xe2u | ${t.map((e) => e.code).join(" | ")} |
|${"---|".repeat(t.length + 1)}
${s}`,
      ]
        .filter(Boolean)
        .join("\n\n");
    }
    function eR(e, t) {
      let n = [],
        r = new Set();
      for (let i of t) {
        (/^\d{3,4}$/.test(i.code) ||
          n.push({
            code: i.code,
            level: "error",
            message: `M\xe3 đề ${i.code} cần 3 hoặc 4 chữ số.`,
          }),
          r.has(i.code) &&
            n.push({
              code: i.code,
              level: "error",
              message: `M\xe3 đề ${i.code} bị tr\xf9ng.`,
            }),
          r.add(i.code));
        let t = i.spec.questions.map((e) => e.qid);
        for (let r of ((t.length !== e.questions.length ||
          new Set(t).size !== t.length) &&
          n.push({
            code: i.code,
            level: "error",
            message: `M\xe3 ${i.code} kh\xf4ng đủ đ\xfang một lần mỗi c\xe2u của đề gốc.`,
          }),
        i.spec.questions))
          "essay" !== r.kind &&
            (r.answer
              ? "sa" !== r.kind ||
                /^-?[\d,]{1,4}$/.test(r.answer.replace(/^-/, "-")) ||
                n.push({
                  code: i.code,
                  level: "warning",
                  qid: r.qid,
                  message: `M\xe3 ${i.code} \xb7 C\xe2u ${r.no}: đ\xe1p số "${r.answer}" kh\xf4ng vừa 4 \xf4 của phiếu trả lời.`,
                })
              : n.push({
                  code: i.code,
                  level: "warning",
                  qid: r.qid,
                  message: `M\xe3 ${i.code} \xb7 C\xe2u ${r.no}: chưa c\xf3 đ\xe1p \xe1n.`,
                }),
            r.check?.status === "mismatch" &&
              n.push({
                code: i.code,
                level: "warning",
                qid: r.qid,
                message: `M\xe3 ${i.code} \xb7 C\xe2u ${r.no}: ${r.check.note ?? "đáp án giải lại không khớp."}`,
              }));
      }
      return n;
    }
    let ez = {
        mc: "nhiều lựa chọn",
        tf: "đúng sai",
        sa: "trả lời ngắn",
        essay: "tự luận",
      },
      e_ = { keep: "Giữ", numbers: "Đổi số", similar: "Tương đồng" };
    function eP() {
      return "u" > typeof crypto && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    function eH(e) {
      let t = new Set(e.parts.map((e) => e.content));
      if (1 !== t.size) return "custom";
      let n = [...t][0];
      return e.parts.some((e) => "shuffle" !== e.order && "keep" !== e.content)
        ? "custom"
        : "keep" === n
          ? "shuffle"
          : n;
    }
    function eq(e) {
      let t = [];
      return (
        e.parts.forEach((e, n) => {
          for (let r of (t.push(`PHẦN ${n + 1}: ${e.title || "(không tên)"}`),
          e.units)) {
            let e = "q" === r.kind ? [r.q] : r.group.questions;
            for (let n of ("group" === r.kind &&
              t.push(
                `  [Dữ kiện chung] ${r.group.context.join(" ").replace(/\s+/g, " ").slice(0, 160)}`,
              ),
            e)) {
              let e = n.segments.join(" ").replace(/\s+/g, " ").slice(0, 170);
              t.push(
                `  C\xe2u ${n.no} [${ez[n.kind]}${n.hasFigure ? ", có hình" : ""}${n.lead ? ", có đoạn dẫn trước" : ""}]: ${e}`,
              );
            }
          }
        }),
        t.join("\n").slice(0, 15e3)
      );
    }
    function eF(e) {
      return {
        key: e.key,
        kind: e.kind,
        kinds: e.kinds,
        markdown: e.markdown,
        answer: e.answer,
        hasFigure: e.hasFigure,
      };
    }
    function eB({ markdown: e }) {
      let n = (0, E.useMemo)(() => (0, en.parseExamMarkdown)(e), [e]);
      return (0, t.jsx)("div", {
        className:
          "versions-snippet min-w-0 font-['Times_New_Roman',serif] text-[13px] leading-[1.45] text-[#161616] [&_p]:my-0.5 [&_table]:w-full",
        children: (0, t.jsx)(V, { doc: n }),
      });
    }
    function eO({ value: e, options: n, onChange: r, label: i }) {
      return (0, t.jsx)("div", {
        role: "group",
        "aria-label": i,
        className:
          "grid auto-cols-fr grid-flow-col overflow-hidden rounded-lg border border-[#dcdbd8]",
        children: n.map(([n, i]) =>
          (0, t.jsx)(
            "button",
            {
              type: "button",
              "aria-pressed": e === n,
              onClick: () => r(n),
              className: `h-8 border-r border-[#dcdbd8] px-1.5 text-[12px] font-medium last:border-r-0 ${e === n ? "bg-[#37352f] text-white" : "bg-white text-[#73726e] hover:bg-[#f7f6f3]"}`,
              children: i,
            },
            n,
          ),
        ),
      });
    }
    function eW({ children: e }) {
      return (0, t.jsx)("div", {
        className:
          "mb-1.5 text-[11.5px] font-medium uppercase tracking-[0.05em] text-[#a3a29e]",
        children: e,
      });
    }
    function eX({
      open: e,
      title: n,
      seed: r,
      readBase: i,
      tabs: s,
      meta: o,
      loggedIn: d,
      activeTabId: u,
      request: h,
      onApply: m,
      onOpenTab: p,
      onClose: f,
      onTnmaker: b,
      onExportAll: y,
      onBusy: w,
    }) {
      let [k, N] = (0, E.useState)(""),
        [S, A] = (0, E.useState)(o && s.length ? 3 : 1),
        M = (0, E.useMemo)(() => ev(k), [k]),
        $ = (0, E.useMemo)(() => ex(k), [k]),
        [D, U] = (0, E.useState)(o?.settings ?? null),
        [V, J] = (0, E.useState)(null),
        [Q, Y] = (0, E.useState)(o?.baseAnswers ?? {}),
        [Z, en] = (0, E.useState)({}),
        [er, ei] = (0, E.useState)(
          o?.analysis
            ? {
                status: "done",
                summary: o.analysis.summary,
                notes: o.analysis.notes,
                hash: o.analysis.hash,
              }
            : { status: "idle" },
        ),
        [ea, es] = (0, E.useState)({ busy: !1 }),
        [el, eo] = (0, E.useState)(""),
        [ec, ed] = (0, E.useState)(""),
        [eu, eh] = (0, E.useState)(!1),
        [em, ep] = (0, E.useState)({
          running: !1,
          done: 0,
          total: 0,
          message: "",
          errors: [],
        }),
        [eg, ef] = (0, E.useState)(null),
        [eb, ey] = (0, E.useState)(null),
        [ew, ek] = (0, E.useState)(!1),
        eN = (0, E.useRef)(null),
        eT = (0, E.useRef)(0);
      ((0, E.useEffect)(() => {
        e && N(i());
      }, [e, i]),
        (0, E.useEffect)(() => {
          w?.(em.running);
        }, [em.running, w]));
      let eA = (0, E.useMemo)(() => {
          let e = eS(M);
          return D && D.parts.length === M.parts.length
            ? D
            : { ...(D ?? e), parts: e.parts };
        }, [D, M]),
        eE = (0, E.useMemo)(() => {
          
          return (
            (e = []),
            M.answerArea.length &&
              e.push({
                id: "answers_layout",
                text: "Đề gốc có phần đáp án ở cuối. Đáp án của các mã đề đặt ở đâu?",
                options: [
                  { value: "tab", label: "Tab Đáp án riêng" },
                  { value: "after", label: "Cuối mỗi mã đề" },
                  { value: "none", label: "Không kèm" },
                ],
              }),
            M.parts.forEach((t) => {
              let n = t.units.flatMap((e) =>
                "q" === e.kind
                  ? [{ q: e.q, grouped: !1 }]
                  : e.group.questions.map((e) => ({ q: e, grouped: !0 })),
              );
              n.forEach(({ q: t, grouped: r }, i) => {
                if (!t.lead || r) return;
                let a = [{ value: "1", label: `Chỉ C\xe2u ${t.no}` }];
                (n[i + 1] &&
                  a.push({
                    value: "2",
                    label: `C\xe2u ${t.no} v\xe0 C\xe2u ${n[i + 1].q.no}`,
                  }),
                  n[i + 2] &&
                    a.push({
                      value: "3",
                      label: `C\xe2u ${t.no} đến C\xe2u ${n[i + 2].q.no}`,
                    }),
                  a.length > 1 &&
                    e.push({
                      id: `lead:${t.no}`,
                      text: `Đoạn dẫn ngay trước C\xe2u ${t.no} d\xf9ng cho những c\xe2u n\xe0o?`,
                      options: a,
                    }));
              });
            }),
            (t = M.questions.filter((e) => e.hasFigure)).length &&
              e.push({
                id: "figures",
                text: `${t.length} c\xe2u c\xf3 h\xecnh vẽ (${t
                  .slice(0, 4)
                  .map((e) => `C\xe2u ${e.no}`)
                  .join(
                    ", ",
                  )}${t.length > 4 ? "..." : ""}). Khi đổi số liệu hay lấy c\xe2u tương đồng th\xec những c\xe2u n\xe0y thế n\xe0o?`,
                options: [
                  { value: "keep", label: "Giữ nguyên nội dung, chỉ trộn" },
                  { value: "change", label: "Vẫn cho đổi, giữ hình cũ" },
                ],
              }),
            e
          );
        }, [M]),
        eM = er.questions ?? eE,
        e$ = (0, E.useMemo)(() => {
          let e = {};
          for (let t of eM) e[t.id] = Z[t.id] ?? t.options[0]?.value ?? "";
          return e;
        }, [eM, Z]),
        ez = (0, E.useMemo)(
          () =>
            (function (e, t, n, r) {
              let i = {
                groups: [],
                lockOrder: [],
                keepOptions: [],
                keepContent: [],
              };
              n &&
                (i.groups.push(...n.groups),
                i.lockOrder.push(...n.lockOrder),
                i.keepOptions.push(...n.keepOptions));
              let a = r;
              for (let [n, r] of Object.entries(t)) {
                if (
                  ("answers_layout" === n &&
                    ("tab" === r || "after" === r || "none" === r) &&
                    (a = { ...a, answers: r }),
                  n.startsWith("lead:"))
                ) {
                  let e = Number(n.slice(5)),
                    t = Number(r);
                  t >= 2 &&
                    i.groups.push(Array.from({ length: t }, (t, n) => e + n));
                }
                "figures" === n &&
                  "keep" === r &&
                  i.keepContent.push(
                    ...e.questions.filter((e) => e.hasFigure).map((e) => e.no),
                  );
              }
              return { constraints: i, settings: a };
            })(M, e$, V, eA),
          [M, e$, V, eA],
        ),
        eG = (0, E.useMemo)(() => ({ ...M.baseAnswers, ...Q }), [M, Q]),
        eK = (0, E.useMemo)(
          () =>
            (function (e, t) {
              let n = Math.max(1, Math.min(30, e.count));
              if ("0101" === e.codeStyle)
                return Array.from({ length: n }, (e, t) =>
                  String(101 + t).padStart(4, "0"),
                );
              if ("random" === e.codeStyle) {
                let r = eC(`codes|${t}|${e.salt}`),
                  i = new Set();
                for (; i.size < n; ) i.add(100 + Math.floor(900 * r()));
                return [...i].sort((e, t) => e - t).map(String);
              }
              return Array.from({ length: n }, (e, t) => String(101 + t));
            })(ez.settings, r),
          [ez.settings, r],
        ),
        eU = Math.max(0, eK.length - !!ez.settings.firstKeepsBase),
        eV = (function (e, t) {
          let n = e.filter((e) => "numbers" === e.mode).length * t,
            r = e.filter((e) => "similar" === e.mode).length * t,
            i = n + r;
          if (!i)
            return {
              free: !0,
              head: "Miễn phí",
              sub: "Chỉ trộn câu và phương án, xong ngay",
              total: i,
            };
          let a = (e) => 50 * Math.round(e / 50),
            s = a(70 * n + 55 * r),
            l = a(110 * n + 100 * r),
            o =
              e.reduce(
                (e, t) =>
                  e +
                  ("numbers" === t.mode || "similar" === t.mode
                    ? t.kinds.length
                    : 0),
                0,
              ) * t;
          return {
            free: !1,
            head: `Khoảng ${s.toLocaleString("vi-VN")}-${l.toLocaleString("vi-VN")} điểm`,
            sub: `${o} c\xe2u do AI l\xe0m \xb7 ${i <= 12 ? "20-40 giây" : i <= 40 ? "40-90 giây" : "2-4 phút"}`,
            total: i,
          };
        })(
          (0, E.useMemo)(
            () => eD(M, ez.settings, ez.constraints, eG),
            [M, ez, eG],
          ),
          eU,
        ),
        eJ = M.questions.filter((e) => "essay" !== e.kind && !eG[e.id]),
        eQ = s.filter((e) => "version" === e.kind),
        eY = (0, E.useMemo)(
          () =>
            eQ.map((e) => ({
              code: e.code,
              markdown: e.content,
              spec: e.spec ?? { v: 1, code: e.code, questions: [] },
              key: Array.isArray(e.answerKey) ? e.answerKey : [],
            })),
          [eQ],
        );
      (0, E.useEffect)(() => {
        if (
          !e ||
          1 !== S ||
          !d ||
          M.questions.length < 2 ||
          "running" === er.status ||
          er.hash === $
        )
          return;
        let t = new AbortController();
        return (
          ei({ status: "running", hash: $ }),
          (0, C.analyzeVersions)(
            {
              title: n,
              outline: eq(M),
              questions: M.questions.length,
              parts: M.parts.map((e) => e.title),
              ambiguities: eE,
              request: "",
            },
            { signal: t.signal },
          )
            .then(({ analysis: e }) => {
              let t = [];
              (e.constraints.groups.forEach((e) =>
                t.push(
                  `C\xe2u ${e[0]} đến C\xe2u ${e[e.length - 1]} d\xf9ng chung dữ kiện: lu\xf4n đi liền nhau.`,
                ),
              ),
                e.constraints.lockOrder.length &&
                  t.push(
                    `Giữ nguy\xean vị tr\xed: ${e.constraints.lockOrder.map((e) => `C\xe2u ${e}`).join(", ")} (nhắc tới c\xe2u kh\xe1c).`,
                  ),
                e.constraints.keepOptions.length &&
                  t.push(
                    `Kh\xf4ng đảo phương \xe1n: ${e.constraints.keepOptions.map((e) => `C\xe2u ${e}`).join(", ")}.`,
                  ),
                J({ ...e.constraints, keepContent: [] }));
              let n = e.questions.map((e) => ({
                  id: e.id,
                  text: e.text,
                  options: e.options,
                })),
                r = {};
              (e.questions.forEach((e) => (r[e.id] = e.recommended)),
                en((e) => ({ ...r, ...e })),
                ei({
                  status: "done",
                  hash: $,
                  summary: e.summary,
                  notes: t,
                  questions: n.length ? n : void 0,
                }));
            })
            .catch((e) => {
              (e instanceof DOMException && "AbortError" === e.name) ||
                ei({
                  status: "error",
                  hash: $,
                  error: (0, a.formatApiError)(e),
                });
            }),
          () => t.abort()
        );
      }, [e, S, d, $]);
      let eZ = (0, E.useCallback)(
        async (e, t) => {
          let r = e.trim();
          if (r) {
            (eh(!0), ed(""));
            try {
              if (!d) throw Error("login");
              let { analysis: e } = await (0, C.analyzeVersions)({
                  title: n,
                  outline: eq(M),
                  questions: M.questions.length,
                  parts: M.parts.map((e) => e.title),
                  ambiguities: [],
                  request: r,
                }),
                i = e.settings,
                a = { ...eA },
                s = [],
                l = t ?? (i?.count || 0);
              if (
                (l > 0 &&
                  ((a.count = Math.min(30, l)), s.push(`${a.count} m\xe3`)),
                i?.codeStyle && (a.codeStyle = i.codeStyle),
                i?.answers && (a.answers = i.answers),
                i?.firstKeepsBase && (a.firstKeepsBase = !0),
                i?.parts.length)
              ) {
                let e = a.parts.map((e) => ({ ...e }));
                for (let t of i.parts) {
                  let n = (function (e, t) {
                    let n = t.toUpperCase().match(/\b([IVX]+|\d+)\b/)?.[1];
                    if (!n) return -1;
                    let r = /^\d+$/.test(n)
                        ? Number(n)
                        : { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 }[n],
                      i = e.parts.findIndex((e) =>
                        RegExp(`\\b(phần|part)\\s+${n}\\b`, "i").test(e.title),
                      );
                    return i >= 0 ? i : r && r <= e.parts.length ? r - 1 : -1;
                  })(M, t.part);
                  n < 0 ||
                    (t.order && (e[n].order = t.order),
                    t.content && (e[n].content = t.content),
                    s.push(
                      `Phần ${M.parts[n].title.match(/[IVX]+|\d+/)?.[0] ?? n + 1}: ${t.content ? e_[t.content] : "keep" === t.order ? "giữ thứ tự" : "trộn"}`,
                    ));
                }
                a = { ...a, parts: e };
              }
              (U(a),
                ed(
                  s.length
                    ? `Đ\xe3 hiểu: ${s.join(" · ")}`
                    : "Chưa đọc được thiết lập nào, thầy cô chọn ở bên dưới.",
                ));
            } catch (n) {
              let e = t ?? Number(/(\d+)\s*mã/i.exec(r)?.[1] ?? 0);
              (e > 0 && U({ ...eA, count: Math.min(30, e) }),
                ed(
                  n instanceof Error && "login" === n.message
                    ? "Đăng nhập để AI đọc mô tả; đã điền số mã."
                    : `Chưa nhờ AI đọc được: ${(0, a.formatApiError)(n)}`,
                ));
            } finally {
              eh(!1);
            }
          }
        },
        [d, n, M, eA],
      );
      (0, E.useEffect)(() => {
        e &&
          h &&
          h.nonce !== eT.current &&
          k &&
          ((eT.current = h.nonce), A(2), eo(h.text), eZ(h.text, h.count));
      }, [e, h, k, eZ]);
      let e0 = (0, E.useCallback)(
          (e, t) => {
            let n = eI({
              ir: t.ir,
              settings: t.settings,
              constraints: t.constraints,
              codes: t.codes,
              answers: t.answers,
              variants: Object.fromEntries(
                Object.entries(e).map(([e, t]) => [
                  e,
                  t.map((e) => e ?? void 0),
                ]),
              ),
              seed: r,
            });
            return { built: n, issues: eR(t.ir, n) };
          },
          [r],
        ),
        e1 = (0, E.useCallback)(
          (e, t, r, i) => {
            let a = new Map(
                s.filter((e) => "version" === e.kind).map((e) => [e.code, e]),
              ),
              l = s.find((e) => "answers" === e.kind),
              o = e.map((e) => ({
                id: a.get(e.code)?.id ?? eP(),
                kind: "version",
                code: e.code,
                title: `M\xe3 ${e.code}`,
                content: e.markdown,
                spec: e.spec,
                answerKey: e.key,
                baseHash: i,
                status: t.some((t) => t.code === e.code)
                  ? "needs_review"
                  : "ready",
              })),
              c = new Map(r.ir.questions.map((e) => [e.id, e.no]));
            return [
              ...o,
              ...("tab" === r.settings.answers
                ? [
                    {
                      id: l?.id ?? eP(),
                      kind: "answers",
                      code: "",
                      title: "Đáp án",
                      content: eL(n, e, c),
                      spec: {},
                      answerKey: null,
                      baseHash: i,
                      status: "ready",
                    },
                  ]
                : []),
            ];
          },
          [s, n],
        ),
        e2 = (0, E.useCallback)(
          (e, t, n, i) => ({
            v: 1,
            settings: t.settings,
            constraints: t.constraints,
            codes: t.codes,
            removed: i?.length ? i : void 0,
            seed: r,
            variants: e,
            baseAnswers: t.answers,
            baseHash: n,
            analysis:
              "done" === er.status && er.hash
                ? {
                    hash: er.hash,
                    summary: er.summary ?? "",
                    notes: er.notes ?? [],
                  }
                : void 0,
          }),
          [r, er],
        ),
        e3 = async () => {
          let e = s
            .filter((e) => "version" === e.kind)
            .filter(
              (e) =>
                !o ||
                !e.spec?.questions?.length ||
                e.spec.questions.some((e) => e.manual),
            );
          if (
            e.length &&
            !window.confirm(
              `C\xe1c m\xe3 ${e.map((e) => e.code).join(", ")} c\xf3 nội dung ri\xeang (t\xe1ch từ đề c\xf3 sẵn hoặc đ\xe3 sửa tay). Tạo bộ m\xe3 mới sẽ thay to\xe0n bộ c\xe1c tab m\xe3 đề hiện c\xf3. Tiếp tục?`,
            )
          )
            return;
          let t = i();
          N(t);
          let r = ev(t);
          if (!r.questions.length)
            return void ep({
              running: !1,
              done: 0,
              total: 0,
              message: "",
              errors: [
                "Đề gốc chưa có câu hỏi nào có nhãn Câu 1, Câu 2... để trộn.",
              ],
            });
          let c = ex(t),
            u = {
              ir: r,
              settings: ez.settings,
              constraints: ez.constraints,
              answers: { ...r.baseAnswers, ...Q },
              codes: eK,
            },
            h = eD(r, u.settings, u.constraints, u.answers),
            p = o && o.baseHash === c ? o.variants : {},
            x = {},
            g = [];
          for (let e of h) {
            let t = p[e.key];
            t &&
            t.length >= eU &&
            t.slice(0, eU).every((t) => t && (t.mode ?? e.mode) === e.mode)
              ? (x[e.key] = t.slice(0, eU))
              : g.push(e);
          }
          let f = Date.now(),
            b = () => {
              let { built: e, issues: t } = e0(x, u);
              m(e1(e, t, u, c), e2(x, u, c));
            };
          (b(), A(3), ef(null));
          let y = [];
          if (g.length && eU > 0) {
            
            if (!d) {
              ((0, l.requestLogin)(),
                ep({
                  running: !1,
                  done: 0,
                  total: 0,
                  message: "",
                  errors: [
                    "Đăng nhập để AI đổi số liệu hay lấy câu tương đồng; các mã hiện chỉ trộn câu.",
                  ],
                }));
              return;
            }
            eN.current = new AbortController();
            let t = [];
            for (let e of ["numbers", "similar"]) {
              let n = g.filter((t) => t.mode === e);
              for (let e = 0; e < n.length; e += 6) t.push(n.slice(e, e + 6));
            }
            let r = 0;
            ep({
              running: !0,
              done: 0,
              total: g.length,
              message: "Đang nhờ AI viết lại từng câu...",
              errors: [],
            });
            let i = () => {
                (window.clearTimeout(e), (e = window.setTimeout(b, 400)));
              },
              s = async () => {
                for (; t.length; ) {
                  let e = t.shift(),
                    s = e[0].mode;
                  try {
                    await (0, C.transformVersions)(
                      {
                        title: n,
                        mode: s,
                        count: eU,
                        verify: u.settings.verify,
                        items: e.map(eF),
                      },
                      {
                        signal: eN.current?.signal,
                        onItem: (e) => {
                          if (
                            (r++,
                            e.error && y.push(`${e.key}: ${e.error}`),
                            e.variants.length)
                          ) {
                            let t = e.variants
                              .slice(0, eU)
                              .map((e) => ({ ...e, mode: s }));
                            for (; t.length < eU; ) t.push(null);
                            x[e.key] = t;
                          }
                          (ep((e) => ({
                            ...e,
                            done: r,
                            message: `Đ\xe3 xong ${r}/${g.length} c\xe2u`,
                          })),
                            i());
                        },
                      },
                    );
                  } catch (e) {
                    if (e instanceof DOMException && "AbortError" === e.name)
                      return;
                    (e instanceof a.ApiError &&
                      401 === e.status &&
                      (0, l.requestLogin)(),
                      y.push((0, a.formatApiError)(e)),
                      e instanceof a.ApiError &&
                        "quota_exhausted" === e.code &&
                        (t.length = 0));
                  }
                }
              };
            (await Promise.all([s(), s()]), window.clearTimeout(e), b());
          }
          let w = eH(u.settings);
          ((0, ee.track)("versions_generate", {
            mode: w,
            count: String(eK.length),
            aiItems: String(g.length * eU),
            seconds: String(Math.round((Date.now() - f) / 1e3)),
          }),
            ep({
              running: !1,
              done: g.length,
              total: g.length,
              message: "",
              errors: y.map((e) => e.replace(/^q\d+(\+q\d+)*: /, "")),
            }));
        },
        e5 = async () => {
          if (!d) return void (0, l.requestLogin)();
          es({ busy: !0 });
          try {
            let e = await (0, et.requestAnswerKey)({ title: n, content: i() }),
              t = { ...Q },
              r = new Map(M.questions.map((e) => [e.no, e]));
            for (let n of e.codes[0]?.questions ?? []) {
              let e = Number(/(\d+)/.exec(n.label)?.[1]),
                i = r.get(e);
              i && n.answer && (t[i.id] = ej(i.kind, n.answer) || n.answer);
            }
            (Y(t), es({ busy: !1 }));
          } catch (e) {
            es({ busy: !1, error: (0, a.formatApiError)(e) });
          }
        },
        e7 = (0, E.useCallback)(() => {
          let e = i(),
            t = ev(e),
            n = o?.settings ?? ez.settings;
          return {
            ir: t,
            hash: ex(e),
            settings: n,
            constraints: o?.constraints ?? ez.constraints,
            answers: { ...t.baseAnswers, ...(o?.baseAnswers ?? Q) },
            codes: o?.codes ?? eK,
          };
        }, [i, o, ez, Q, eK]),
        e4 = (e) => {
          let t = e7();
          return eD(
            t.ir,
            {
              ...t.settings,
              parts: t.settings.parts.map((e) => ({
                ...e,
                content: "numbers",
              })),
            },
            t.constraints,
            t.answers,
          ).find((t) => t.questions.includes(e));
        },
        e8 = (e, t, n, r) => {
          let i = e7(),
            a = e4(t);
          if (!a) return;
          let s = i.codes.indexOf(e) - !!i.settings.firstKeepsBase;
          if (s < 0) return;
          let l = { ...(o?.variants ?? {}) },
            c = (l[a.key] ?? []).slice();
          for (; c.length < i.codes.length; ) c.push(null);
          ((c[s] =
            n && "keep" !== r
              ? { ...n, mode: "similar" === r ? "similar" : "numbers" }
              : n),
            (l[a.key] = c));
          let d = {
              ir: i.ir,
              settings: i.settings,
              constraints: i.constraints,
              answers: i.answers,
              codes: i.codes,
            },
            { built: u, issues: h } = e0(l, d);
          m(e1(u, h, d, i.hash), e2(l, d, i.hash, o?.removed), e);
        },
        e6 = async (e, t, r) => {
          let i = e4(t);
          if (!i || !d) {
            d || (0, l.requestLogin)();
            return;
          }
          ek(!0);
          try {
            let a = await (0, C.transformVersions)({
                title: n,
                mode: "similar" === r ? "similar" : "numbers",
                count: 1,
                verify: !0,
                items: [eF(i)],
              }),
              s = a.items[0]?.variants[0];
            s
              ? e8(e, t, s, r)
              : ep((e) => ({
                  ...e,
                  errors: [
                    a.items[0]?.error ??
                      "AI chưa viết được câu này, thử lại sau.",
                  ],
                }));
          } catch (e) {
            ep((t) => ({ ...t, errors: [(0, a.formatApiError)(e)] }));
          } finally {
            ek(!1);
          }
        },
        e9 = async (e) => {
          let t = e4(e);
          if (t && "group" !== t.kind) {
            if (!d) return void (0, l.requestLogin)();
            ey({ key: e, list: [], index: 0, busy: !0 });
            try {
              let r = await (0, C.versionCandidates)({
                title: n,
                item: eF(t),
                limit: 8,
              });
              ey({
                key: e,
                list: r.candidates,
                index: 0,
                busy: !1,
                error: r.candidates.length
                  ? void 0
                  : "Kho chưa có câu đủ gần cho câu này.",
              });
            } catch (t) {
              ey({
                key: e,
                list: [],
                index: 0,
                busy: !1,
                error: (0, a.formatApiError)(t),
              });
            }
          }
        },
        te = async (e, t, r) => {
          ek(!0);
          try {
            let i = r.answer,
              a = {
                status: r.hasAnswer ? "ok" : "unverified",
                note: r.hasAnswer ? "Đáp án có sẵn trong kho." : void 0,
              };
            if (!i) {
              let e = e4(t),
                s = await (0, C.transformVersions)({
                  title: n,
                  mode: "verify",
                  count: 1,
                  verify: !0,
                  items: [
                    {
                      ...eF(e),
                      markdown: r.markdown,
                      answer: "",
                      bankId: r.bankId,
                    },
                  ],
                }),
                l = s.items[0]?.variants[0];
              ((i = l?.answer ?? ""),
                (a = l?.check ?? { status: "unverified" }));
            }
            (e8(
              e,
              t,
              {
                markdown: r.markdown,
                answer: i,
                source: {
                  kind: "bank",
                  bankId: r.bankId,
                  score: r.score,
                  label: r.label,
                  hasAnswer: r.hasAnswer,
                },
                check: a,
              },
              "similar",
            ),
              ey(null));
          } catch (e) {
            ey((t) => (t ? { ...t, error: (0, a.formatApiError)(e) } : t));
          } finally {
            ek(!1);
          }
        },
        tt = eQ.find((e) => e.id === u)?.code ?? eQ[0]?.code,
        tn = (0, E.useMemo)(() => eR(ev(k), eY), [k, eY]),
        tr = M.parts.map((e, t) => {
          let n = e.units.flatMap((e) =>
            "q" === e.kind ? [e.q.kind] : e.group.questions.map((e) => e.kind),
          );
          return {
            title: e.title || `Phần ${t + 1}`,
            count: n.length,
            mc: n.includes("mc"),
            tf: n.includes("tf"),
            sa: n.every((e) => "sa" === e),
          };
        }),
        ti = M.parts.flatMap((e) =>
          e.units.filter((e) => "group" === e.kind),
        ).length,
        ta = M.questions.filter((e) => e.pinned.some(Boolean)).length,
        ts = M.questions.filter((e) => e.refs.length).length,
        tl = (0, t.jsx)("nav", {
          className: "flex gap-1 border-b border-[#e9e9e7] px-3 pb-2.5",
          "aria-label": "Các bước",
          children: [
            [1, "Đọc đề"],
            [2, "Tuỳ chọn"],
            [3, "Soát"],
          ].map(([e, n]) => {
            let r = S === e,
              i = 3 === e && !eQ.length;
            return (0, t.jsxs)(
              "button",
              {
                type: "button",
                disabled: i,
                "aria-current": r ? "step" : void 0,
                onClick: () => A(e),
                className: `flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-[12.5px] font-medium transition-colors disabled:opacity-40 ${r ? "bg-[#f0efec] text-[#37352f]" : "text-[#73726e] hover:bg-[#f7f6f3]"}`,
                children: [
                  (0, t.jsx)("span", {
                    className: `grid size-[18px] place-items-center rounded-full text-[10.5px] ${r ? "bg-[#37352f] text-white" : e < S ? "bg-[#e8f2ea] text-[#3f7d5a]" : "bg-[#f0efec] text-[#73726e]"}`,
                    children:
                      e < S && !r
                        ? (0, t.jsx)(g.Check, { className: "size-3" })
                        : e,
                  }),
                  n,
                ],
              },
              e,
            );
          }),
        }),
        to = (0, t.jsxs)("div", {
          className: "flex flex-col gap-3.5",
          children: [
            0 === M.questions.length
              ? (0, t.jsxs)("div", {
                  className:
                    "rounded-xl border border-[#e9e9e7] p-3 text-[13px] text-[#73726e]",
                  children: [
                    "Đề gốc chưa có câu hỏi nào có nhãn ",
                    (0, t.jsx)("b", { children: "Câu 1" }),
                    ", ",
                    (0, t.jsx)("b", { children: "Câu 2" }),
                    "... Hãy soạn đề trước rồi tạo mã đề.",
                  ],
                })
              : (0, t.jsxs)("div", {
                  className: "rounded-xl border border-[#e9e9e7] p-3",
                  children: [
                    (0, t.jsxs)("div", {
                      className:
                        "mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#37352f]",
                      children: [
                        (0, t.jsx)(g.Check, {
                          "aria-hidden": !0,
                          className: "size-4 text-[#3f7d5a]",
                        }),
                        " Đã đọc đề gốc",
                      ],
                    }),
                    (0, t.jsxs)("ul", {
                      className: "grid gap-1.5 text-[13px] text-[#37352f]",
                      children: [
                        (0, t.jsxs)("li", {
                          className: "flex gap-2",
                          children: [
                            (0, t.jsx)(T.FileText, {
                              "aria-hidden": !0,
                              className:
                                "mt-0.5 size-3.5 shrink-0 text-[#a3a29e]",
                            }),
                            M.questions.length,
                            " câu trong ",
                            M.parts.length,
                            " phần: ",
                            tr
                              .map((e) =>
                                `${e.count} c\xe2u ${e.title
                                  .replace(/^phần\s+[ivx\d]+\.?\s*/i, "")
                                  .replace(/^câu\s+/i, "")
                                  .toLowerCase()}`.trim(),
                              )
                              .join("; "),
                          ],
                        }),
                        ti > 0 &&
                          (0, t.jsxs)("li", {
                            className: "flex gap-2",
                            children: [
                              (0, t.jsx)(q.Link2, {
                                "aria-hidden": !0,
                                className:
                                  "mt-0.5 size-3.5 shrink-0 text-[#a3a29e]",
                              }),
                              ti,
                              " nhóm câu dùng chung dữ kiện: luôn đi liền nhau",
                            ],
                          }),
                        ta > 0 &&
                          (0, t.jsxs)("li", {
                            className: "flex gap-2",
                            children: [
                              (0, t.jsx)(F, {
                                "aria-hidden": !0,
                                className:
                                  "mt-0.5 size-3.5 shrink-0 text-[#a3a29e]",
                              }),
                              ta,
                              " câu có phương án phụ thuộc vị trí: giữ đúng chỗ",
                            ],
                          }),
                        ts > 0 &&
                          (0, t.jsxs)("li", {
                            className: "flex gap-2",
                            children: [
                              (0, t.jsx)(q.Link2, {
                                "aria-hidden": !0,
                                className:
                                  "mt-0.5 size-3.5 shrink-0 text-[#a3a29e]",
                              }),
                              ts,
                              " câu nhắc tới câu khác: đi cùng hoặc giữ chỗ",
                            ],
                          }),
                        (0, t.jsxs)("li", {
                          className: "flex gap-2",
                          children: [
                            (0, t.jsx)(z.ClipboardCheck, {
                              "aria-hidden": !0,
                              className:
                                "mt-0.5 size-3.5 shrink-0 text-[#a3a29e]",
                            }),
                            0 === eJ.length
                              ? "Đã có đáp án mọi câu trắc nghiệm"
                              : `Chưa c\xf3 đ\xe1p \xe1n ${eJ.length} c\xe2u (${eJ
                                  .slice(0, 5)
                                  .map((e) => e.no)
                                  .join(", ")}${eJ.length > 5 ? "..." : ""})`,
                          ],
                        }),
                      ],
                    }),
                    eJ.length > 0 &&
                      (0, t.jsxs)("div", {
                        className: "mt-2.5",
                        children: [
                          (0, t.jsxs)("button", {
                            type: "button",
                            onClick: () => void e5(),
                            disabled: ea.busy,
                            className:
                              "inline-flex h-7 items-center gap-1.5 rounded-lg border border-[#dcdbd8] bg-white px-2.5 text-[12.5px] font-medium hover:bg-[#f7f6f3] disabled:opacity-50",
                            children: [
                              ea.busy
                                ? (0, t.jsx)(j.Loader2, {
                                    className: "size-3.5 animate-spin",
                                  })
                                : (0, t.jsx)(G.Sparkles, {
                                    className: "size-3.5",
                                  }),
                              " Lập đáp án đề gốc bằng AI",
                            ],
                          }),
                          ea.error &&
                            (0, t.jsx)("p", {
                              className: "mt-1 text-[12px] text-[#c4423d]",
                              children: ea.error,
                            }),
                          (0, t.jsx)("p", {
                            className: "mt-1 text-[11.5px] text-[#a3a29e]",
                            children:
                              "Không có đáp án thì vẫn trộn được, nhưng bảng đáp án các mã sẽ để trống câu đó.",
                          }),
                        ],
                      }),
                    (0, t.jsx)("p", {
                      className: "mt-2.5 text-[12px] text-[#73726e]",
                      children:
                        "running" === er.status
                          ? (0, t.jsxs)("span", {
                              className: "inline-flex items-center gap-1.5",
                              children: [
                                (0, t.jsx)(j.Loader2, {
                                  className: "size-3.5 animate-spin",
                                }),
                                " AI đang soát đề...",
                              ],
                            })
                          : "done" === er.status
                            ? (0, t.jsxs)(t.Fragment, {
                                children: [
                                  "AI đã soát đề",
                                  er.summary ? `: ${er.summary}` : ".",
                                ],
                              })
                            : "error" === er.status
                              ? (0, t.jsxs)(t.Fragment, {
                                  children: [
                                    "AI chưa soát được (",
                                    er.error,
                                    "); máy vẫn đọc đủ cấu trúc ở trên.",
                                  ],
                                })
                              : d
                                ? "Máy đọc cấu trúc, không tốn điểm."
                                : "Đăng nhập để AI soát thêm những chỗ máy chưa chắc.",
                    }),
                    er.notes?.length
                      ? (0, t.jsx)("ul", {
                          className:
                            "mt-1.5 grid gap-1 text-[12px] text-[#37352f]",
                          children: er.notes.map((e) =>
                            (0, t.jsxs)(
                              "li",
                              {
                                className: "flex gap-1.5",
                                children: [
                                  (0, t.jsx)(G.Sparkles, {
                                    "aria-hidden": !0,
                                    className:
                                      "mt-0.5 size-3 shrink-0 text-[#7d52a3]",
                                  }),
                                  e,
                                ],
                              },
                              e,
                            ),
                          ),
                        })
                      : null,
                  ],
                }),
            eM.length > 0 &&
              (0, t.jsxs)("div", {
                className:
                  "flex items-center gap-2 text-[13px] font-semibold text-[#37352f]",
                children: [
                  "Cần thầy cô xác nhận ",
                  (0, t.jsx)("span", {
                    className:
                      "grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#fbf0d9] px-1 text-[11px] text-[#9a5f08]",
                    children: eM.length,
                  }),
                ],
              }),
            eM.map((e) =>
              (0, t.jsxs)(
                "div",
                {
                  className:
                    "rounded-xl border border-[#e9e9e7] p-3 text-[13px]",
                  children: [
                    (0, t.jsx)("p", {
                      className: "mb-2 text-[#37352f]",
                      children: e.text,
                    }),
                    (0, t.jsx)("div", {
                      className: "grid gap-1.5",
                      role: "radiogroup",
                      "aria-label": e.text,
                      children: e.options.map((n, r) => {
                        let i = e$[e.id] === n.value;
                        return (0, t.jsxs)(
                          "button",
                          {
                            type: "button",
                            role: "radio",
                            "aria-checked": i,
                            onClick: () =>
                              en((t) => ({ ...t, [e.id]: n.value })),
                            className: `flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left ${i ? "border-[#2383e2] bg-[#e7f0fb] shadow-[inset_0_0_0_1px_#2383e2]" : "border-[#dcdbd8] bg-white hover:border-[#a3a29e]"}`,
                            children: [
                              (0, t.jsx)("span", { children: n.label }),
                              0 === r &&
                                (0, t.jsx)("span", {
                                  className:
                                    "shrink-0 rounded-md bg-[#e8f2ea] px-1.5 py-0.5 text-[10.5px] font-medium text-[#3f7d5a]",
                                  children: "Khuyên dùng",
                                }),
                            ],
                          },
                          n.value,
                        );
                      }),
                    }),
                  ],
                },
                e.id,
              ),
            ),
          ],
        }),
        tc = eH(ez.settings),
        td = [
          [
            "shuffle",
            (0, t.jsx)(W, { className: "size-3.5" }, "s"),
            "Trộn",
            "Đảo câu và phương án, giữ nội dung",
            "Miễn phí",
          ],
          [
            "numbers",
            (0, t.jsx)(H, { className: "size-3.5" }, "n"),
            "Đổi số liệu",
            "Giữ dạng câu, AI đổi số rồi giải lại",
            "AI theo câu",
          ],
          [
            "similar",
            (0, t.jsx)(_.Database, { className: "size-3.5" }, "d"),
            "Câu tương đồng",
            "Câu cùng dạng, cùng mức độ trong kho",
            "Kho + AI",
          ],
          [
            "custom",
            (0, t.jsx)(X.SlidersHorizontal, { className: "size-3.5" }, "c"),
            "Tuỳ chỉnh",
            "Chọn riêng cho từng phần",
            "Tự chọn",
          ],
        ],
        tu = (e, t) =>
          U({
            ...ez.settings,
            parts: ez.settings.parts.map((n, r) =>
              r === e ? { ...n, ...t } : n,
            ),
          }),
        th = (0, t.jsxs)("div", {
          className: "flex flex-col gap-4",
          children: [
            (0, t.jsxs)("div", {
              children: [
                (0, t.jsx)("label", {
                  htmlFor: "versions-quick",
                  className:
                    "mb-1.5 block text-[11.5px] font-medium uppercase tracking-[0.05em] text-[#a3a29e]",
                  children: "Mô tả nhanh",
                }),
                (0, t.jsxs)("div", {
                  className: "flex gap-1.5",
                  children: [
                    (0, t.jsx)("input", {
                      id: "versions-quick",
                      value: el,
                      onChange: (e) => eo(e.target.value),
                      onKeyDown: (e) => {
                        "Enter" === e.key && (e.preventDefault(), eZ(el));
                      },
                      placeholder:
                        "Vd: 4 mã, phần III đổi số, đáp án cuối mỗi đề",
                      className:
                        "h-8 min-w-0 flex-1 rounded-lg border border-[#dcdbd8] px-2.5 text-[13px] outline-none focus:border-[#2383e2]",
                    }),
                    (0, t.jsxs)("button", {
                      type: "button",
                      onClick: () => void eZ(el),
                      disabled: eu || !el.trim(),
                      className:
                        "inline-flex h-8 items-center gap-1 rounded-lg border border-[#dcdbd8] bg-white px-2.5 text-[12.5px] font-medium hover:bg-[#f7f6f3] disabled:opacity-50",
                      children: [
                        eu
                          ? (0, t.jsx)(j.Loader2, {
                              className: "size-3.5 animate-spin",
                            })
                          : (0, t.jsx)(G.Sparkles, { className: "size-3.5" }),
                        " Điền",
                      ],
                    }),
                  ],
                }),
                ec &&
                  (0, t.jsx)("p", {
                    className: "mt-1.5 text-[12px] text-[#3f7d5a]",
                    children: ec,
                  }),
              ],
            }),
            (0, t.jsxs)("div", {
              className: "grid grid-cols-[auto_minmax(0,1fr)] items-end gap-3",
              children: [
                (0, t.jsxs)("div", {
                  children: [
                    (0, t.jsx)(eW, { children: "Số mã đề" }),
                    (0, t.jsxs)("div", {
                      className:
                        "inline-flex h-8 items-center overflow-hidden rounded-lg border border-[#dcdbd8]",
                      children: [
                        (0, t.jsx)("button", {
                          type: "button",
                          "aria-label": "Bớt một mã",
                          className: "h-full w-8 hover:bg-[#f7f6f3]",
                          onClick: () =>
                            U({
                              ...ez.settings,
                              count: Math.max(1, ez.settings.count - 1),
                            }),
                          children: "−",
                        }),
                        (0, t.jsx)("span", {
                          className:
                            "min-w-8 text-center text-[13px] font-semibold tabular-nums",
                          children: ez.settings.count,
                        }),
                        (0, t.jsx)("button", {
                          type: "button",
                          "aria-label": "Thêm một mã",
                          className: "h-full w-8 hover:bg-[#f7f6f3]",
                          onClick: () =>
                            U({
                              ...ez.settings,
                              count: Math.min(30, ez.settings.count + 1),
                            }),
                          children: "+",
                        }),
                      ],
                    }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  children: [
                    (0, t.jsx)(eW, { children: "Đánh số" }),
                    (0, t.jsxs)("select", {
                      "aria-label": "Kiểu đánh số mã đề",
                      value: ez.settings.codeStyle,
                      onChange: (e) =>
                        U({ ...ez.settings, codeStyle: e.target.value }),
                      className:
                        "h-8 w-full rounded-lg border border-[#dcdbd8] bg-white px-2 text-[13px]",
                      children: [
                        (0, t.jsx)("option", {
                          value: "101",
                          children: "101, 102, 103...",
                        }),
                        (0, t.jsx)("option", {
                          value: "0101",
                          children: "0101, 0102, 0103...",
                        }),
                        (0, t.jsx)("option", {
                          value: "random",
                          children: "Ngẫu nhiên 3 chữ số",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, t.jsxs)("label", {
              className: "flex items-start gap-2 text-[13px]",
              children: [
                (0, t.jsx)("input", {
                  type: "checkbox",
                  className: "mt-0.5 accent-[#2383e2]",
                  checked: ez.settings.firstKeepsBase,
                  onChange: (e) =>
                    U({ ...ez.settings, firstKeepsBase: e.target.checked }),
                }),
                "Mã đầu giữ nguyên thứ tự và nội dung đề gốc",
              ],
            }),
            (0, t.jsxs)("div", {
              children: [
                (0, t.jsx)(eW, { children: "Cách tạo" }),
                (0, t.jsx)("div", {
                  className: "grid grid-cols-2 gap-1.5",
                  role: "radiogroup",
                  "aria-label": "Cách tạo mã đề",
                  children: td.map(([e, n, r, i, a]) =>
                    (0, t.jsxs)(
                      "button",
                      {
                        type: "button",
                        role: "radio",
                        "aria-checked": tc === e,
                        onClick: () =>
                          U(
                            (function (e, t, n) {
                              if ("custom" === n) return t;
                              let r = eS(e);
                              return {
                                ...t,
                                parts: r.parts.map((e) => ({
                                  ...e,
                                  order: "shuffle",
                                  content: "shuffle" === n ? "keep" : n,
                                })),
                              };
                            })(M, ez.settings, e),
                          ),
                        className: `grid gap-0.5 rounded-xl border p-2.5 text-left text-[12px] ${tc === e ? "border-[#2383e2] shadow-[inset_0_0_0_1px_#2383e2]" : "border-[#dcdbd8] hover:border-[#a3a29e]"}`,
                        children: [
                          (0, t.jsxs)("span", {
                            className:
                              "flex items-center gap-1.5 text-[13px] font-semibold text-[#37352f]",
                            children: [n, r],
                          }),
                          (0, t.jsx)("span", {
                            className: "text-[#73726e]",
                            children: i,
                          }),
                          (0, t.jsx)("span", {
                            className: `mt-1 justify-self-start rounded-md px-1.5 py-0.5 text-[10.5px] font-medium ${"shuffle" === e ? "bg-[#e8f2ea] text-[#3f7d5a]" : "numbers" === e ? "bg-[#fbecdc] text-[#b8620b]" : "similar" === e ? "bg-[#f2ecf8] text-[#7d52a3]" : "bg-[#f0efec] text-[#73726e]"}`,
                            children: a,
                          }),
                        ],
                      },
                      e,
                    ),
                  ),
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              children: [
                (0, t.jsx)(eW, { children: "Từng phần" }),
                (0, t.jsx)("div", {
                  className: "grid gap-2",
                  children: ez.settings.parts.map((e, n) =>
                    (0, t.jsxs)(
                      "div",
                      {
                        className: "grid gap-1.5 rounded-lg bg-[#f7f6f3] p-2",
                        children: [
                          (0, t.jsxs)("div", {
                            className:
                              "flex items-baseline justify-between gap-2 text-[12.5px]",
                            children: [
                              (0, t.jsx)("span", {
                                className:
                                  "min-w-0 truncate font-semibold text-[#37352f]",
                                title: tr[n]?.title,
                                children: tr[n]?.title || `Phần ${n + 1}`,
                              }),
                              (0, t.jsxs)("span", {
                                className:
                                  "shrink-0 text-[11.5px] text-[#a3a29e]",
                                children: [tr[n]?.count ?? 0, " câu"],
                              }),
                            ],
                          }),
                          (0, t.jsxs)("div", {
                            className: "grid grid-cols-3 gap-1.5",
                            children: [
                              (0, t.jsx)(eO, {
                                label: "Thứ tự câu",
                                value: e.order,
                                options: [
                                  ["shuffle", "Trộn"],
                                  ["keep", "Giữ"],
                                ],
                                onChange: (e) => tu(n, { order: e }),
                              }),
                              (0, t.jsx)(eO, {
                                label: "Phương án",
                                value: e.options,
                                options:
                                  tr[n]?.tf && !tr[n]?.mc
                                    ? [
                                        ["keep", "Giữ a-d"],
                                        ["shuffle", "Trộn a-d"],
                                      ]
                                    : [
                                        ["shuffle", "Trộn"],
                                        ["keep", "Giữ"],
                                      ],
                                onChange: (e) => tu(n, { options: e }),
                              }),
                              (0, t.jsxs)("select", {
                                "aria-label": "Nội dung",
                                value: e.content,
                                onChange: (e) =>
                                  tu(n, { content: e.target.value }),
                                className:
                                  "h-8 rounded-lg border border-[#dcdbd8] bg-white px-1.5 text-[12px]",
                                children: [
                                  (0, t.jsx)("option", {
                                    value: "keep",
                                    children: "Giữ nội dung",
                                  }),
                                  (0, t.jsx)("option", {
                                    value: "numbers",
                                    children: "Đổi số liệu",
                                  }),
                                  (0, t.jsx)("option", {
                                    value: "similar",
                                    children: "Câu tương đồng",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      },
                      n,
                    ),
                  ),
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className: "grid gap-2 text-[13px]",
              children: [
                (0, t.jsx)(eW, { children: "Ràng buộc" }),
                (0, t.jsxs)("label", {
                  className: "flex items-start gap-2",
                  children: [
                    (0, t.jsx)("input", {
                      type: "checkbox",
                      className: "mt-0.5 accent-[#2383e2]",
                      checked: ez.settings.balance,
                      onChange: (e) =>
                        U({ ...ez.settings, balance: e.target.checked }),
                    }),
                    "Cân bằng đáp án A, B, C, D trong mỗi mã",
                  ],
                }),
                (0, t.jsxs)("label", {
                  className: "flex items-start gap-2",
                  children: [
                    (0, t.jsx)("input", {
                      type: "checkbox",
                      className: "mt-0.5 accent-[#2383e2]",
                      checked: ez.settings.spread,
                      onChange: (e) =>
                        U({ ...ez.settings, spread: e.target.checked }),
                    }),
                    "Hạn chế hai mã có cùng câu ở cùng vị trí",
                  ],
                }),
                (0, t.jsxs)("label", {
                  className: "flex items-start gap-2",
                  children: [
                    (0, t.jsx)("input", {
                      type: "checkbox",
                      className: "mt-0.5 accent-[#2383e2]",
                      checked: ez.settings.verify,
                      onChange: (e) =>
                        U({ ...ez.settings, verify: e.target.checked }),
                    }),
                    "Giải lại để kiểm đáp án câu do AI làm",
                  ],
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              children: [
                (0, t.jsx)(eW, { children: "Đáp án" }),
                (0, t.jsx)(eO, {
                  label: "Chỗ đặt đáp án",
                  value: ez.settings.answers,
                  options: [
                    ["tab", "Tab riêng"],
                    ["after", "Cuối mỗi mã"],
                    ["none", "Không kèm"],
                  ],
                  onChange: (e) => U({ ...ez.settings, answers: e }),
                }),
              ],
            }),
          ],
        }),
        tm = eg ? eY.find((e) => e.code === eg.code) : void 0,
        tp = tm?.spec.questions.find((e) => e.qid === eg?.qid),
        tx = M.questions.find((e) => e.id === eg?.qid),
        tg = (0, E.useMemo)(() => {
          if (!tm || !tp) return "";
          let e = ev(tm.markdown);
          return e.questions[tp.no - 1]?.segments.join("\n\n") ?? "";
        }, [tm, tp]),
        tf = (e) =>
          e.check?.status === "mismatch" || ("essay" !== e.kind && !e.answer),
        tb = eY
          .flatMap((e) =>
            e.spec.questions
              .filter((e) => "base" !== e.source || tf(e))
              .map((t) => ({ code: e.code, q: t })),
          )
          .sort((e, t) => Number(tf(t.q)) - Number(tf(e.q))),
        ty = (0, t.jsxs)("div", {
          className: "flex flex-col gap-3",
          children: [
            (0, t.jsxs)("div", {
              className: "grid grid-cols-3 gap-2",
              children: [
                (0, t.jsxs)("div", {
                  className: "rounded-lg bg-[#f7f6f3] px-2.5 py-2",
                  children: [
                    (0, t.jsx)("b", {
                      className: "block text-[17px] tabular-nums",
                      children: eY.length,
                    }),
                    (0, t.jsx)("span", {
                      className: "text-[11.5px] text-[#73726e]",
                      children: "mã đề",
                    }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className: "rounded-lg bg-[#f7f6f3] px-2.5 py-2",
                  children: [
                    (0, t.jsx)("b", {
                      className: "block text-[17px] tabular-nums",
                      children: tb.filter((e) => "base" !== e.q.source).length,
                    }),
                    (0, t.jsx)("span", {
                      className: "text-[11.5px] text-[#73726e]",
                      children: "câu AI hoặc kho",
                    }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className: "rounded-lg bg-[#f7f6f3] px-2.5 py-2",
                  children: [
                    (0, t.jsxs)("b", {
                      className: "block text-[17px] tabular-nums",
                      children: [
                        (function (e) {
                          let t = 0,
                            n = 0;
                          for (let r = 0; r < e.length; r++)
                            for (let i = r + 1; i < e.length; i++) {
                              let a = 0,
                                s = 0;
                              (e[r].key.forEach((t, n) => {
                                "choice" === t.kind &&
                                  (s++,
                                  t.answer !== e[i].key[n]?.answer && a++);
                              }),
                                s && ((t += a / s), n++));
                            }
                          return n ? Math.round((t / n) * 100) : 0;
                        })(eY),
                        "%",
                      ],
                    }),
                    (0, t.jsx)("span", {
                      className: "text-[11.5px] text-[#73726e]",
                      children: "khác đáp án giữa 2 mã",
                    }),
                  ],
                }),
              ],
            }),
            em.running &&
              (0, t.jsxs)("div", {
                className:
                  "rounded-xl border border-[#cfe0f5] bg-[#f2f7fd] p-2.5 text-[12.5px] text-[#1f3d5c]",
                children: [
                  (0, t.jsxs)("div", {
                    className: "flex items-center justify-between gap-2",
                    children: [
                      (0, t.jsxs)("span", {
                        className: "inline-flex items-center gap-1.5",
                        children: [
                          (0, t.jsx)(j.Loader2, {
                            className: "size-3.5 animate-spin",
                          }),
                          em.message,
                        ],
                      }),
                      (0, t.jsx)("button", {
                        type: "button",
                        onClick: () => {
                          (eN.current?.abort(),
                            ep((e) => ({
                              ...e,
                              running: !1,
                              message:
                                "Đã dừng. Các câu chưa xong giữ nội dung gốc.",
                            })));
                        },
                        className:
                          "rounded-md px-2 py-0.5 text-[12px] font-medium hover:bg-black/[0.05]",
                        children: "Dừng",
                      }),
                    ],
                  }),
                  (0, t.jsx)("div", {
                    className: "mt-2 h-1 overflow-hidden rounded bg-[#dbe8f7]",
                    children: (0, t.jsx)("div", {
                      className: "h-full bg-[#2383e2] transition-[width]",
                      style: {
                        width: `${em.total ? Math.round((em.done / em.total) * 100) : 5}%`,
                      },
                    }),
                  }),
                ],
              }),
            em.errors.length > 0 &&
              (0, t.jsx)("div", {
                className:
                  "rounded-xl border border-[#f2c9c6] bg-[#fbe6e5] p-2.5 text-[12.5px] text-[#9b302b]",
                children: em.errors
                  .slice(0, 3)
                  .map((e) => (0, t.jsx)("p", { children: e }, e)),
              }),
            (0, t.jsx)("ul", {
              className: "grid gap-1",
              children: eQ.map((e, n) => {
                let r = (function (e) {
                    let t = { A: 0, B: 0, C: 0, D: 0 };
                    for (let n of e)
                      "choice" === n.kind &&
                        void 0 !== t[n.answer] &&
                        t[n.answer]++;
                    return t;
                  })(eY[n]?.key ?? []),
                  i = Math.max(1, ...Object.values(r)),
                  a = tn.filter((t) => t.code === e.code);
                return (0, t.jsx)(
                  "li",
                  {
                    children: (0, t.jsxs)("button", {
                      type: "button",
                      onClick: () => p(e.id),
                      className: `grid w-full grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12.5px] ${e.id === u ? "bg-[#f0efec]" : "hover:bg-[#f7f6f3]"}`,
                      children: [
                        (0, t.jsxs)("span", {
                          className: "flex items-center gap-1.5 font-semibold",
                          children: [
                            (0, t.jsx)("span", {
                              className: `size-[7px] rounded-full ${a.length ? "bg-[#cb912f]" : "bg-[#448361]"}`,
                            }),
                            e.code,
                          ],
                        }),
                        (0, t.jsx)("span", {
                          className: "flex h-[18px] items-end gap-[3px]",
                          "aria-label": `Ph\xe2n bố đ\xe1p \xe1n A ${r.A}, B ${r.B}, C ${r.C}, D ${r.D}`,
                          children: ["A", "B", "C", "D"].map((e) =>
                            (0, t.jsx)(
                              "span",
                              {
                                className: "w-3.5 rounded-t-[2px] bg-[#5598e7]",
                                style: {
                                  height: Math.max(
                                    2,
                                    Math.round((r[e] / i) * 16),
                                  ),
                                },
                                title: `${e}: ${r[e]}`,
                              },
                              e,
                            ),
                          ),
                        }),
                        (0, t.jsx)("span", {
                          className: `text-[11.5px] ${a.length ? "text-[#9a5f08]" : "text-[#73726e]"}`,
                          children: a.length
                            ? `${a.length} điểm cần xem`
                            : "Sẵn sàng",
                        }),
                      ],
                    }),
                  },
                  e.id,
                );
              }),
            }),
            tb.length > 0 &&
              (0, t.jsxs)("div", {
                children: [
                  (0, t.jsx)(eW, {
                    children: "Câu AI hoặc kho làm, câu cần xem",
                  }),
                  (0, t.jsx)("div", {
                    className: "grid max-h-56 gap-1 overflow-y-auto pr-1",
                    children: tb.map(({ code: e, q: n }) => {
                      let r = tf(n),
                        i = eg?.code === e && eg.qid === n.qid;
                      return (0, t.jsxs)(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            (ef({ code: e, qid: n.qid }), ey(null));
                            let t = eQ.find((t) => t.code === e);
                            t && p(t.id);
                          },
                          className: `flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[12.5px] ${i ? "border-[#2383e2] bg-[#e7f0fb]" : r ? "border-[#f0d9a8] bg-[#fbf0d9]" : "border-[#e9e9e7] hover:bg-[#f7f6f3]"}`,
                          children: [
                            (0, t.jsxs)("span", {
                              children: ["Mã ", e, " · Câu ", n.no],
                            }),
                            (0, t.jsxs)("span", {
                              className: "flex gap-1",
                              children: [
                                r &&
                                  (0, t.jsx)("span", {
                                    className:
                                      "rounded bg-[#fbe6e5] px-1.5 text-[10.5px] font-medium text-[#b3332e]",
                                    children: "Cần xem",
                                  }),
                                "ai" === n.source &&
                                  (0, t.jsx)("span", {
                                    className:
                                      "rounded bg-[#e5effb] px-1.5 text-[10.5px] font-medium text-[#1b64b0]",
                                    children: "AI soạn",
                                  }),
                                "template" === n.source &&
                                  (0, t.jsx)("span", {
                                    className:
                                      "rounded bg-[#fbe9d6] px-1.5 text-[10.5px] font-medium text-[#9c5207]",
                                    children: "Khuôn số",
                                  }),
                                "bank" === n.source &&
                                  (0, t.jsx)("span", {
                                    className:
                                      "rounded bg-[#f1e9f8] px-1.5 text-[10.5px] font-medium text-[#6f4596]",
                                    children: "Kho",
                                  }),
                              ],
                            }),
                          ],
                        },
                        `${e}-${n.qid}`,
                      );
                    }),
                  }),
                ],
              }),
            eg &&
              tp &&
              tx &&
              (0, t.jsxs)("div", {
                className: "overflow-hidden rounded-xl border border-[#dcdbd8]",
                children: [
                  (0, t.jsxs)("div", {
                    className:
                      "flex items-center justify-between bg-[#f7f6f3] px-2.5 py-1.5 text-[12.5px] font-semibold",
                    children: [
                      (0, t.jsxs)("span", {
                        children: ["Mã ", eg.code, " · Câu ", tp.no],
                      }),
                      (0, t.jsx)("button", {
                        type: "button",
                        "aria-label": "Đóng so sánh",
                        onClick: () => ef(null),
                        className:
                          "grid size-6 place-items-center rounded-md hover:bg-black/[0.05]",
                        children: (0, t.jsx)(K.X, { className: "size-3.5" }),
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className:
                      "grid grid-cols-1 divide-y divide-[#e9e9e7] bg-white",
                    children: [
                      (0, t.jsxs)("div", {
                        className: "p-2.5",
                        children: [
                          (0, t.jsxs)("div", {
                            className:
                              "mb-1 text-[10.5px] font-medium uppercase tracking-[0.04em] text-[#a3a29e]",
                            children: [
                              "Đề gốc · Câu ",
                              tx.no,
                              " · đáp án ",
                              eG[tx.id] || "?",
                            ],
                          }),
                          (0, t.jsx)(eB, {
                            markdown: tx.segments.join("\n\n"),
                          }),
                        ],
                      }),
                      (0, t.jsxs)("div", {
                        className: "p-2.5",
                        children: [
                          (0, t.jsxs)("div", {
                            className:
                              "mb-1 text-[10.5px] font-medium uppercase tracking-[0.04em] text-[#a3a29e]",
                            children: [
                              "Mã ",
                              eg.code,
                              " · Câu ",
                              tp.no,
                              " · đáp án ",
                              tp.answer || "?",
                            ],
                          }),
                          (0, t.jsx)(eB, { markdown: tg }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className:
                      "grid gap-1 border-t border-[#e9e9e7] px-2.5 py-2 text-[12px] text-[#73726e]",
                    children: [
                      "base" === tp.source
                        ? (0, t.jsxs)("span", {
                            children: [
                              "Câu gốc, chỉ đổi vị trí",
                              tp.optionOrder ? " và thứ tự phương án" : "",
                              ". Đáp án tính từ hoán vị.",
                            ],
                          })
                        : null,
                      "bank" === tp.source &&
                        (0, t.jsxs)("span", {
                          children: ["Từ kho câu hỏi · ", tp.label],
                        }),
                      "template" === tp.source &&
                        (0, t.jsx)("span", {
                          children:
                            "Khuôn tham số: máy tính đáp án theo công thức.",
                        }),
                      "ai" === tp.source &&
                        (0, t.jsx)("span", {
                          children: "AI viết lại, giữ dạng câu và mức độ.",
                        }),
                      tp.check?.status === "ok" &&
                        (0, t.jsxs)("span", {
                          className: "text-[#3f7d5a]",
                          children: [
                            "✓ ",
                            tp.check.note ?? "Đã giải lại, khớp đáp án.",
                          ],
                        }),
                      tp.check?.status === "mismatch" &&
                        (0, t.jsx)("span", {
                          className: "text-[#c4423d]",
                          children: tp.check.note,
                        }),
                      tp.manual &&
                        (0, t.jsx)("span", {
                          className: "text-[#9a5f08]",
                          children: "Câu này đã được sửa tay trong tab mã đề.",
                        }),
                    ],
                  }),
                  eb?.key === eg.qid &&
                    (0, t.jsx)("div", {
                      className: "border-t border-[#e9e9e7] p-2.5",
                      children: eb.busy
                        ? (0, t.jsxs)("span", {
                            className:
                              "inline-flex items-center gap-1.5 text-[12px] text-[#73726e]",
                            children: [
                              (0, t.jsx)(j.Loader2, {
                                className: "size-3.5 animate-spin",
                              }),
                              "Đang tìm trong kho...",
                            ],
                          })
                        : eb.list.length
                          ? (0, t.jsxs)(t.Fragment, {
                              children: [
                                (0, t.jsxs)("div", {
                                  className:
                                    "mb-1.5 flex items-center justify-between text-[12px] text-[#73726e]",
                                  children: [
                                    (0, t.jsxs)("span", {
                                      className: "min-w-0 truncate",
                                      children: [
                                        "Ứng viên ",
                                        eb.index + 1,
                                        "/",
                                        eb.list.length,
                                        " · ",
                                        eb.list[eb.index].label,
                                      ],
                                    }),
                                    (0, t.jsxs)("span", {
                                      className: "flex gap-1",
                                      children: [
                                        (0, t.jsx)("button", {
                                          type: "button",
                                          "aria-label": "Ứng viên trước",
                                          className:
                                            "grid size-6 place-items-center rounded-md border border-[#dcdbd8]",
                                          onClick: () =>
                                            ey((e) =>
                                              e
                                                ? {
                                                    ...e,
                                                    index:
                                                      (e.index -
                                                        1 +
                                                        e.list.length) %
                                                      e.list.length,
                                                  }
                                                : e,
                                            ),
                                          children: (0, t.jsx)(L.ChevronLeft, {
                                            className: "size-3.5",
                                          }),
                                        }),
                                        (0, t.jsx)("button", {
                                          type: "button",
                                          "aria-label": "Ứng viên sau",
                                          className:
                                            "grid size-6 place-items-center rounded-md border border-[#dcdbd8]",
                                          onClick: () =>
                                            ey((e) =>
                                              e
                                                ? {
                                                    ...e,
                                                    index:
                                                      (e.index + 1) %
                                                      e.list.length,
                                                  }
                                                : e,
                                            ),
                                          children: (0, t.jsx)(R.ChevronRight, {
                                            className: "size-3.5",
                                          }),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, t.jsx)(eB, {
                                  markdown: eb.list[eb.index].markdown,
                                }),
                                (0, t.jsxs)("button", {
                                  type: "button",
                                  disabled: ew,
                                  onClick: () =>
                                    void te(eg.code, eg.qid, eb.list[eb.index]),
                                  className:
                                    "mt-2 inline-flex h-7 items-center gap-1.5 rounded-lg bg-[#37352f] px-2.5 text-[12px] font-medium text-white disabled:opacity-50",
                                  children: [
                                    ew
                                      ? (0, t.jsx)(j.Loader2, {
                                          className: "size-3.5 animate-spin",
                                        })
                                      : (0, t.jsx)(g.Check, {
                                          className: "size-3.5",
                                        }),
                                    " Dùng câu này cho mã ",
                                    eg.code,
                                  ],
                                }),
                              ],
                            })
                          : (0, t.jsx)("span", {
                              className: "text-[12px] text-[#73726e]",
                              children: eb.error,
                            }),
                    }),
                  (0, t.jsxs)("div", {
                    className:
                      "flex flex-wrap gap-1.5 border-t border-[#e9e9e7] px-2.5 py-2",
                    children: [
                      (0, t.jsxs)("button", {
                        type: "button",
                        disabled: ew,
                        onClick: () =>
                          void e6(
                            eg.code,
                            eg.qid,
                            "bank" === tp.source ? "similar" : "numbers",
                          ),
                        className:
                          "inline-flex h-7 items-center gap-1.5 rounded-lg border border-[#dcdbd8] bg-white px-2.5 text-[12px] font-medium hover:bg-[#f7f6f3] disabled:opacity-50",
                        children: [
                          ew
                            ? (0, t.jsx)(j.Loader2, {
                                className: "size-3.5 animate-spin",
                              })
                            : (0, t.jsx)(B.RefreshCw, {
                                className: "size-3.5",
                              }),
                          " ",
                          "base" === tp.source ? "Đổi số câu này" : "Tạo lại",
                        ],
                      }),
                      "essay" !== tx.kind &&
                        !M.parts.some((e) =>
                          e.units.some(
                            (e) =>
                              "group" === e.kind &&
                              e.group.questions.some((e) => e.id === eg.qid),
                          ),
                        ) &&
                        (0, t.jsxs)("button", {
                          type: "button",
                          disabled: ew,
                          onClick: () => void e9(eg.qid),
                          className:
                            "inline-flex h-7 items-center gap-1.5 rounded-lg border border-[#dcdbd8] bg-white px-2.5 text-[12px] font-medium hover:bg-[#f7f6f3] disabled:opacity-50",
                          children: [
                            (0, t.jsx)(_.Database, { className: "size-3.5" }),
                            " Chọn câu khác trong kho",
                          ],
                        }),
                      "base" !== tp.source &&
                        (0, t.jsx)("button", {
                          type: "button",
                          disabled: ew,
                          onClick: () => e8(eg.code, eg.qid, null, "keep"),
                          className:
                            "inline-flex h-7 items-center rounded-lg px-2.5 text-[12px] font-medium text-[#73726e] hover:bg-[#f7f6f3] disabled:opacity-50",
                          children: "Dùng câu gốc",
                        }),
                    ],
                  }),
                ],
              }),
            !eg &&
              0 === tb.length &&
              eY.length > 0 &&
              !em.running &&
              (0, t.jsxs)("p", {
                className:
                  "flex items-center gap-1.5 text-[12.5px] text-[#3f7d5a]",
                children: [
                  (0, t.jsx)(g.Check, { className: "size-4" }),
                  "Các mã chỉ trộn câu và phương án, đáp án tính sẵn. Bấm vào một tab ở đáy để xem.",
                ],
              }),
            tt &&
              !eg &&
              tb.length > 0 &&
              (0, t.jsx)("p", {
                className: "text-[12px] text-[#a3a29e]",
                children:
                  "Bấm vào một câu ở danh sách trên để so với câu gốc, tạo lại hoặc chọn câu khác trong kho.",
              }),
          ],
        }),
        tw =
          1 === S
            ? (0, t.jsxs)("div", {
                className: "flex items-center justify-between gap-2",
                children: [
                  (0, t.jsx)("span", {
                    className: "text-[12px] text-[#73726e]",
                    children: "Bước 1/3 · máy đọc đề",
                  }),
                  (0, t.jsxs)("button", {
                    type: "button",
                    disabled: !M.questions.length,
                    onClick: () => A(2),
                    className:
                      "inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#37352f] px-3 text-[13px] font-medium text-white disabled:opacity-40",
                    children: [
                      "Tiếp tục ",
                      (0, t.jsx)(I.ArrowRight, { className: "size-3.5" }),
                    ],
                  }),
                ],
              })
            : 2 === S
              ? (0, t.jsxs)("div", {
                  className: "flex items-center justify-between gap-2",
                  children: [
                    (0, t.jsxs)("span", {
                      className:
                        "min-w-0 text-[12px] leading-tight text-[#73726e]",
                      children: [
                        (0, t.jsx)("b", {
                          className: `block text-[13px] font-medium ${eV.free ? "text-[#3f7d5a]" : "text-[#37352f]"}`,
                          children: eV.head,
                        }),
                        eV.sub,
                      ],
                    }),
                    (0, t.jsxs)("button", {
                      type: "button",
                      disabled: em.running || !M.questions.length,
                      onClick: () => void e3(),
                      className:
                        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[#37352f] px-3 text-[13px] font-medium text-white disabled:opacity-40",
                      children: [
                        em.running
                          ? (0, t.jsx)(j.Loader2, {
                              className: "size-3.5 animate-spin",
                            })
                          : (0, t.jsx)(v, { className: "size-3.5" }),
                        " ",
                        eQ.length ? "Tạo lại" : "Tạo",
                        " ",
                        eK.length,
                        " mã đề",
                      ],
                    }),
                  ],
                })
              : (0, t.jsxs)("div", {
                  className: "flex items-center justify-between gap-2",
                  children: [
                    (0, t.jsxs)(c.default, {
                      href: "/grading",
                      className:
                        "inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#dcdbd8] bg-white px-2.5 text-[12.5px] font-medium hover:bg-[#f7f6f3]",
                      title: "Tạo kỳ chấm: đáp án lấy thẳng từ các mã",
                      children: [
                        (0, t.jsx)(z.ClipboardCheck, { className: "size-3.5" }),
                        " Chấm bài",
                      ],
                    }),
                    (0, t.jsxs)("span", {
                      className: "flex gap-1.5",
                      children: [
                        (0, t.jsxs)("button", {
                          type: "button",
                          disabled: !eY.length || em.running,
                          onClick: b,
                          className:
                            "inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#dcdbd8] bg-white px-2.5 text-[12.5px] font-medium hover:bg-[#f7f6f3] disabled:opacity-40",
                          title: "Đáp án cho TNMaker (QR, Excel)",
                          children: [
                            (0, t.jsx)(O.ScanLine, { className: "size-3.5" }),
                            " TNMaker",
                          ],
                        }),
                        (0, t.jsxs)("button", {
                          type: "button",
                          disabled: !eY.length || em.running,
                          onClick: y,
                          className:
                            "inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#37352f] px-2.5 text-[12.5px] font-medium text-white disabled:opacity-40",
                          children: [
                            (0, t.jsx)(P.Download, { className: "size-3.5" }),
                            " Xuất bộ đề",
                          ],
                        }),
                      ],
                    }),
                  ],
                });
      return (0, t.jsxs)("div", {
        className: "flex h-full min-h-0 flex-col bg-white",
        children: [
          (0, t.jsxs)("div", {
            className: "flex items-center justify-between gap-2 px-4 pb-2 pt-3",
            children: [
              (0, t.jsxs)("h3", {
                className:
                  "flex items-center gap-2 text-[16px] font-medium text-neutral-900",
                children: [
                  (0, t.jsx)(v, {
                    "aria-hidden": !0,
                    className: "size-[18px]",
                  }),
                  " Tạo mã đề",
                ],
              }),
              (0, t.jsx)("button", {
                type: "button",
                onClick: f,
                "aria-label": "Đóng",
                className:
                  "grid size-8 place-items-center rounded-full text-neutral-500 hover:bg-black/[0.06] hover:text-neutral-800",
                children: (0, t.jsx)(K.X, { className: "size-[18px]" }),
              }),
            ],
          }),
          tl,
          (0, t.jsx)("div", {
            className: "min-h-0 flex-1 overflow-y-auto px-4 py-3.5",
            children: 1 === S ? to : 2 === S ? th : ty,
          }),
          eJ.length > 0 &&
            2 === S &&
            (0, t.jsxs)("p", {
              className:
                "flex items-center gap-1.5 border-t border-[#f0d9a8] bg-[#fbf0d9] px-4 py-1.5 text-[11.5px] text-[#9a5f08]",
              children: [
                (0, t.jsx)(x.AlertTriangle, { className: "size-3.5 shrink-0" }),
                " Chưa có đáp án ",
                eJ.length,
                " câu của đề gốc: bảng đáp án sẽ để trống các câu đó.",
              ],
            }),
          (0, t.jsx)("div", {
            className: "border-t border-[#e9e9e7] px-4 py-2.5",
            children: tw,
          }),
        ],
      });
    }
    let eG = "exam-builder:tabs:v1:";
    function eK(e) {
      return !!e && "object" == typeof e && 1 === e.v && Array.isArray(e.codes);
    }
    let eU = /m[ãa] đề(?: thi)?\s*:?\s*\**\s*(\d{3,4})/i;
    var eV = m150321,
      eJ = m503561,
      eQ = m952907,
      eY = m295692,
      eZ = m69193,
      e0 = m761719,
      e1 = m380669,
      e2 = m371406,
      e3 = m855146,
      e5 = m277573,
      e7 = m337161,
      e4 = m849487,
      e8 = m882505,
      e6 = m930800,
      e9 = m124007,
      te = m250832,
      tt = m594069,
      tn = m189622,
      tr = m161961,
      ti = m46794,
      ta = m716327,
      ts = m667259,
      tl = m503490,
      to = m689765,
      tc = m815170,
      td = m692630,
      tu = m221216,
      th = m700883,
      tm = m935829,
      tp = m77043,
      tx = m241999,
      tg = m640460,
      tf = m933641,
      tb = m929272;
    let ty = (0, w.default)("square-dashed", [
      ["path", { d: "M5 3a2 2 0 0 0-2 2", key: "y57alp" }],
      ["path", { d: "M19 3a2 2 0 0 1 2 2", key: "18rm91" }],
      ["path", { d: "M21 19a2 2 0 0 1-2 2", key: "1j7049" }],
      ["path", { d: "M5 21a2 2 0 0 1-2-2", key: "sbafld" }],
      ["path", { d: "M9 3h1", key: "1yesri" }],
      ["path", { d: "M9 21h1", key: "15o7lz" }],
      ["path", { d: "M14 3h1", key: "1ec4yj" }],
      ["path", { d: "M14 21h1", key: "v9vybs" }],
      ["path", { d: "M3 9v1", key: "1r0deq" }],
      ["path", { d: "M21 9v1", key: "mxsmne" }],
      ["path", { d: "M3 14v1", key: "vnatye" }],
      ["path", { d: "M21 14v1", key: "169vum" }],
    ]);
    var tw = m849635,
      tv = m897306,
      tj = m630505,
      tk = m736469,
      tN = m151216,
      tC = m837817;
    m231240;
    var tT = m644677,
      tS = m346795,
      tA = m468132,
      tE = m856423,
      tM = m199883,
      t$ = m508734;
    let tD = (0, w.default)("file", [
        [
          "path",
          {
            d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
            key: "1oefj6",
          },
        ],
        ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
      ]),
      tI = (0, w.default)("file-braces", [
        [
          "path",
          {
            d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
            key: "1oefj6",
          },
        ],
        ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
        [
          "path",
          {
            d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",
            key: "1oajmo",
          },
        ],
        [
          "path",
          {
            d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",
            key: "mpwhp6",
          },
        ],
      ]),
      tL = (0, w.default)("file-plus", [
        [
          "path",
          {
            d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
            key: "1oefj6",
          },
        ],
        ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
        ["path", { d: "M9 15h6", key: "cctwl0" }],
        ["path", { d: "M12 18v-6", key: "17g6i2" }],
      ]);
    var tR = m576248,
      tz = m368308,
      t_ = m195780,
      tP = m950786,
      tH = m400169,
      tq = m566595,
      tF = m435184;
    let tB = (0, w.default)("LineSpacing", [
      ["path", { d: "M5 4v16M2 7l3-3 3 3M2 17l3 3 3-3", key: "arrows" }],
      ["path", { d: "M12 5h9M12 12h9M12 19h9", key: "lines" }],
    ]);
    function tO({ label: e, className: t }) {
      
      return (0, E.createElement)(
        ((n = [
          [/hoàn tác/i, tC.Undo2],
          [/làm lại/i, tx.Redo2],
          [/đậm/i, ti.Bold],
          [/nghiêng/i, th.Italic],
          [/gạch chân/i, tN.Underline],
          [/gạch ngang/i, tw.Strikethrough],
          [/chỉ số trên/i, tj.Superscript],
          [/chỉ số dưới/i, tv.Subscript],
          [/khung/i, tb.Square],
          [/màu chữ/i, tP.Palette],
          [/nền|tô sáng/i, e7.PaintBucket],
          [/font|phông|cỡ chữ|chữ$/i, tM.CaseSensitive],
          [/^trên$/i, e2.AlignVerticalJustifyStart],
          [/^giữa$/i, e0.AlignVerticalJustifyCenter],
          [/^dưới$/i, e1.AlignVerticalJustifyEnd],
          [/căn trái/i, tn.AlignLeft],
          [/căn giữa/i, eZ.AlignCenter],
          [/căn phải/i, tr.AlignRight],
          [/căn lề|căn đều/i, tt.AlignJustify],
          [/thụt/i, tu.IndentIncrease],
          [/giãn|khoảng cách|dòng/i, tB],
          [/x[oó]a định dạng/i, tg.RemoveFormatting],
          [/đánh số|đánh dấu|danh sách số/i, e6.ListOrdered],
          [/dấu đầu|danh sách/i, e8.List],
          [/liên kết/i, e9.Link],
          [/bảng|barem/i, tk.Table],
          [/ảnh|hình/i, tc.Image],
          [/cột|lưới/i, ts.Columns3],
          [/công thức/i, tf.Sigma],
          [/ngắt trang/i, tD],
          [/đường kẻ/i, tm.Minus],
          [/thước/i, tH.Ruler],
          [/trợ lý|ai/i, G.Sparkles],
          [/tìm|thay thế/i, tq.Search],
          [/phím tắt/i, tz.Keyboard],
          [/in$|pdf/i, tp.Printer],
          [/json/i, tI],
          [/word|markdown|tải/i, P.Download],
          [/mở/i, b.FolderOpen],
          [/mới/i, tL],
          [/sao chép/i, t$.Copy],
          [/đầu đề|thí sinh/i, t_.LayoutTemplate],
          [/thuộc tính|tùy chọn|định dạng đoạn/i, te.Settings2],
          [/tiêu đề|kiểu đoạn/i, tF.Type],
          [/ngữ liệu/i, tE.BookOpen],
          [/trợ giúp/i, tR.HelpCircle],
        ]),
        n.find(([t]) => t.test(e))?.[1] ?? T.FileText),
        { "aria-hidden": !0, className: t },
      );
    }
    var tW = m126930;
    let tX =
      "flex cursor-pointer select-none items-center gap-2 px-3 py-2 text-[13px] outline-none data-[highlighted]:bg-neutral-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-40";
    function tG({ menu: e, ...n }) {
      return "menubar" === e
        ? (0, t.jsx)(tW.Menubar.Item, { ...n })
        : (0, t.jsx)(eY.DropdownMenu.Item, { ...n });
    }
    function tK({ columns: e }) {
      let n = (60 - (e - 1) * 5) / e;
      return (0, t.jsx)("svg", {
        "aria-hidden": !0,
        viewBox: "0 0 80 96",
        className: "h-24 w-full",
        children: Array.from({ length: e }, (e, r) =>
          Array.from({ length: 12 }, (e, i) =>
            (0, t.jsx)(
              "rect",
              {
                x: 10 + r * (n + 5),
                y: 12 + 6 * i,
                width: n,
                height: 2.5,
                fill: "currentColor",
              },
              `${r}-${i}`,
            ),
          ),
        ),
      });
    }
    function tU({ menu: e, current: n, disabled: r, onSelect: i, onMore: a }) {
      return (0, t.jsxs)(t.Fragment, {
        children: [
          (0, t.jsx)("div", {
            role: "group",
            "aria-label": "Số cột văn bản",
            className: "grid w-72 grid-cols-3 gap-3 p-3",
            children: [1, 2, 3].map((a) =>
              (0, t.jsxs)(
                tG,
                {
                  menu: e,
                  disabled: r,
                  role: "menuitemradio",
                  "aria-checked": n === a,
                  "aria-label": `${a} cột`,
                  onSelect: () => i(a),
                  className: `cursor-pointer rounded-sm border-2 p-1 text-neutral-300 outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-400 data-[disabled]:opacity-40 ${n === a ? "border-neutral-600" : "border-neutral-200"}`,
                  children: [
                    (0, t.jsx)(tK, { columns: a }),
                    (0, t.jsxs)("span", {
                      className: "block text-center text-xs text-neutral-700",
                      children: [a, " cột"],
                    }),
                  ],
                },
                a,
              ),
            ),
          }),
          (0, t.jsx)("div", {
            role: "separator",
            className: "my-1 h-px bg-neutral-200",
          }),
          (0, t.jsxs)(tG, {
            menu: e,
            disabled: r,
            onSelect: a,
            className: tX,
            children: [
              (0, t.jsx)(te.Settings2, {
                "aria-hidden": !0,
                className: "size-4 text-neutral-500",
              }),
              "Tùy chọn khác",
            ],
          }),
        ],
      });
    }
    function tV({ menu: e, disabled: n, onSelect: r, onMore: i }) {
      let [a, s] = (0, E.useState)({ rows: 1, columns: 1 });
      return (0, t.jsxs)(t.Fragment, {
        children: [
          (0, t.jsxs)("div", {
            className: "w-72 px-3 pt-3",
            onPointerLeave: () => s({ rows: 1, columns: 1 }),
            children: [
              (0, t.jsx)("div", {
                role: "group",
                "aria-label": "Chọn kích thước bảng",
                className: "grid grid-cols-10 gap-1",
                children: Array.from({ length: 50 }, (i, l) => {
                  let o = Math.floor(l / 10) + 1,
                    c = (l % 10) + 1,
                    d = o <= a.rows && c <= a.columns;
                  return (0, t.jsx)(
                    tG,
                    {
                      menu: e,
                      disabled: n,
                      "data-table-size": l,
                      "aria-label": `Ch\xe8n bảng ${c} cột \xd7 ${o} h\xe0ng`,
                      onPointerEnter: () => s({ rows: o, columns: c }),
                      onFocus: () => s({ rows: o, columns: c }),
                      onSelect: () => r(o, c),
                      onKeyDown: (e) => {
                        let t = {
                          ArrowRight: 1,
                          ArrowLeft: -1,
                          ArrowDown: 10,
                          ArrowUp: -10,
                        }[e.key];
                        if (null == t) return;
                        let n = l + t;
                        n < 0 ||
                          n >= 50 ||
                          (1 === Math.abs(t) && Math.floor(n / 10) !== o - 1) ||
                          (e.preventDefault(),
                          e.stopPropagation(),
                          e.currentTarget.parentElement
                            ?.querySelector(`[data-table-size="${n}"]`)
                            ?.focus());
                      },
                      className: `aspect-square cursor-pointer border-2 outline-none data-[highlighted]:ring-1 data-[highlighted]:ring-blue-500 data-[disabled]:opacity-40 ${d ? "border-blue-400 bg-blue-100" : "border-neutral-200 bg-neutral-50"}`,
                    },
                    l,
                  );
                }),
              }),
              (0, t.jsxs)("p", {
                "aria-live": "polite",
                className: "py-2 text-center text-sm text-neutral-700",
                children: [a.columns, " × ", a.rows],
              }),
            ],
          }),
          (0, t.jsx)("div", {
            role: "separator",
            className: "my-1 h-px bg-neutral-200",
          }),
          (0, t.jsxs)(tG, {
            menu: e,
            disabled: n,
            onSelect: i,
            className: tX,
            children: [
              (0, t.jsx)(te.Settings2, {
                "aria-hidden": !0,
                className: "size-4 text-neutral-500",
              }),
              "Tùy chọn khác",
            ],
          }),
        ],
      });
    }
    var tJ = m184270,
      tQ = m189904,
      tY = m127923,
      tZ = m89011;
    let t0 = () =>
        (0, t.jsx)("span", {
          "aria-hidden": "true",
          className: "mx-1.5 h-5 w-px shrink-0 bg-[#e3e2e0]",
        }),
      t1 = (e) =>
        Array.from(
          e.querySelectorAll("button:not(:disabled), input:not(:disabled)"),
        ).filter((e) => !e.closest('[inert], [aria-hidden="true"]'));
    function t2({ segments: e }) {
      let n = (0, E.useRef)(null),
        r = (0, E.useRef)(null),
        i = (0, E.useRef)(null),
        [a, s] = (0, E.useState)({ cut: e.length, moreLeft: 0 }),
        [l, o] = (0, E.useState)(!1),
        c = a.cut,
        d = e.length,
        u = (0, E.useCallback)(() => {
          let e,
            t,
            i = n.current,
            a = r.current
              ? Array.from(r.current.querySelectorAll(":scope > [data-seg]"))
              : [];
          if (!i || 0 === a.length) return;
          let l = getComputedStyle(i),
            o =
              i.clientWidth -
              parseFloat(l.paddingLeft) -
              parseFloat(l.paddingRight),
            c = a.length;
          if ((e = a[a.length - 1]).offsetLeft + e.offsetWidth > o) {
            let e = o - 48;
            c = Math.max(
              0,
              a.findIndex((t) => t.offsetLeft + t.offsetWidth > e),
            );
          }
          let d =
            c > 0 && c < a.length
              ? Math.round((t = a[c - 1]).offsetLeft + t.offsetWidth)
              : 0;
          s((e) =>
            e.cut === c && e.moreLeft === d ? e : { cut: c, moreLeft: d },
          );
        }, []);
      ((0, E.useLayoutEffect)(u),
        (0, E.useLayoutEffect)(() => {
          if (!r.current) return;
          let e = t1(r.current),
            t = i.current,
            n = t && e.includes(t) ? t : e[0];
          e.forEach((e) => {
            e.tabIndex = e === n ? 0 : -1;
          });
        }),
        (0, E.useLayoutEffect)(() => {
          let e = n.current;
          if (!e) return;
          let t = new ResizeObserver(u);
          return (t.observe(e), () => t.disconnect());
        }, [u]));
      let h = Math.min(c, d),
        m = e.slice(h);
      return (0, t.jsx)("div", {
        ref: n,
        role: "toolbar",
        "aria-label": "Công cụ soạn thảo",
        "aria-orientation": "horizontal",
        className:
          "no-print mx-2 mb-2 flex h-12 shrink-0 items-center rounded-full bg-[#f1f1ef] px-2 sm:mx-3 sm:px-3",
        children: (0, t.jsxs)("div", {
          ref: r,
          className:
            "relative flex min-w-0 flex-1 items-center overflow-hidden",
          onFocusCapture: (e) => {
            if (!e.currentTarget.contains(e.target)) return;
            let t = t1(e.currentTarget);
            t.includes(e.target) &&
              ((i.current = e.target),
              t.forEach((t) => {
                t.tabIndex = t === e.target ? 0 : -1;
              }));
          },
          onKeyDown: (e) => {
            if (
              !e.currentTarget.contains(e.target) ||
              e.target instanceof HTMLInputElement ||
              !["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
            )
              return;
            let t = t1(e.currentTarget),
              n = t.indexOf(e.target);
            if (n < 0) return;
            e.preventDefault();
            let r =
              "Home" === e.key
                ? 0
                : "End" === e.key
                  ? t.length - 1
                  : (n + ("ArrowRight" === e.key ? 1 : t.length - 1)) %
                    t.length;
            t[r]?.focus();
          },
          children: [
            e.map((e, n) => {
              let r = n >= h;
              return (0, t.jsxs)(
                "div",
                {
                  "data-seg": !0,
                  className: `flex shrink-0 items-center gap-x-0.5 ${r ? "invisible" : ""}`,
                  "aria-hidden": r || void 0,
                  inert: r,
                  children: [n > 0 && (0, t.jsx)(t0, {}), e],
                },
                n,
              );
            }),
            m.length > 0 &&
              (0, t.jsxs)(tY.Popover.Root, {
                open: l,
                onOpenChange: o,
                children: [
                  (0, t.jsx)(tZ.ToolbarTooltip, {
                    label: "Thêm công cụ",
                    children: (0, t.jsx)(tY.Popover.Trigger, {
                      onMouseDown: (e) => e.preventDefault(),
                      "aria-label": "Thêm công cụ",
                      style: { left: a.moreLeft + 4 },
                      className:
                        "absolute top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-neutral-700 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2383e2]/40 hover:bg-black/[0.06] data-[state=open]:bg-[#d3e5ef] data-[state=open]:text-[#2383e2]",
                      children: (0, t.jsx)(tQ.MoreVertical, {
                        "aria-hidden": !0,
                        className: "size-[18px]",
                      }),
                    }),
                  }),
                  (0, t.jsx)(tY.Popover.Portal, {
                    children: (0, t.jsx)(tY.Popover.Content, {
                      side: "bottom",
                      align: "start",
                      sideOffset: 6,
                      collisionPadding: 12,
                      onOpenAutoFocus: (e) => {
                        (e.preventDefault(),
                          e.target instanceof HTMLElement &&
                            e.target
                              .querySelector("button:not(:disabled)")
                              ?.focus());
                      },
                      onKeyDown: (e) => {
                        "Escape" === e.key &&
                          e.currentTarget.contains(e.target) &&
                          o(!1);
                      },
                      onCloseAutoFocus: (e) => {
                        document.activeElement?.closest(
                          '[contenteditable="true"]',
                        ) && e.preventDefault();
                      },
                      onInteractOutside: (e) => {
                        e.target?.closest(
                          "[data-radix-popper-content-wrapper]",
                        ) && e.preventDefault();
                      },
                      "data-toolbar-overflow": !0,
                      "aria-label": "Công cụ bổ sung",
                      className:
                        "doc-menu z-50 flex max-w-[min(94vw,640px)] flex-wrap items-center gap-y-2 rounded-3xl border border-[#e3e2e0] bg-[#f4f7fc] p-3 shadow-[0_8px_30px_-8px_#59628040] outline-none",
                      children: m.map((e, n) =>
                        (0, t.jsxs)(
                          E.Fragment,
                          {
                            children: [
                              n > 0 && (0, t.jsx)(t0, {}),
                              (0, t.jsx)("div", {
                                className:
                                  "flex max-w-full flex-wrap items-center gap-x-0.5",
                                children: e,
                              }),
                            ],
                          },
                          h + n,
                        ),
                      ),
                    }),
                  }),
                ],
              }),
          ],
        }),
      });
    }
    var t3 = m857444,
      t5 = m790670,
      t7 = m203602,
      t4 = m237482,
      t8 = m946311,
      t6 = m766887,
      t9 = m979693;
    let ne = [
      {
        name: "Hình minh hoạ SVG",
        items: [
          {
            id: "cut-box",
            name: "Tấm nhôm và hộp không nắp",
            hint: "Hình khai triển, vùng cắt và hình không gian",
            markdown: () =>
              "```diagram\n" +
              JSON.stringify(
                (0, t9.parseDiagramData)({
                  width: 240,
                  height: 310,
                  viewBox: [0, 0, 240, 310],
                  align: "right",
                  alt: "Tấm nhôm 8 dm × 5 dm cắt bốn hình vuông cạnh a và hộp không nắp sau khi gấp",
                  elements: [
                    { kind: "rect", x: 42, y: 28, width: 176, height: 110 },
                    ...[
                      [42, 28],
                      [198, 28],
                      [42, 118],
                      [198, 118],
                    ].map(([e, t]) => ({
                      kind: "rect",
                      x: e,
                      y: t,
                      width: 20,
                      height: 20,
                      fill: "#cccccc",
                      hatch: !0,
                    })),
                    ...[
                      [52, 20],
                      [208, 20],
                      [32, 43],
                      [228, 43],
                      [32, 133],
                      [228, 133],
                      [52, 154],
                      [208, 154],
                    ].map((e) => ({
                      kind: "text",
                      at: e,
                      text: "a",
                      italic: !0,
                      fontSize: 14,
                    })),
                    {
                      kind: "line",
                      from: [42, 162],
                      to: [218, 162],
                      arrowStart: !0,
                      arrowEnd: !0,
                      strokeWidth: 0.8,
                    },
                    { kind: "text", at: [130, 184], text: "8 dm", italic: !0 },
                    {
                      kind: "line",
                      from: [18, 28],
                      to: [18, 138],
                      arrowStart: !0,
                      arrowEnd: !0,
                      strokeWidth: 0.8,
                    },
                    {
                      kind: "text",
                      at: [10, 88],
                      text: "5 dm",
                      rotate: -90,
                      italic: !0,
                      fontSize: 14,
                    },
                    {
                      kind: "solid",
                      origin: [65, 282],
                      scale: 20,
                      vertices: [
                        { id: "A", at: [0, 0, 0] },
                        { id: "B", at: [5, 0, 0] },
                        { id: "C", at: [5, 0, 2] },
                        { id: "D", at: [0, 0, 2] },
                        { id: "E", at: [0, 1.5, 0] },
                        { id: "F", at: [5, 1.5, 0] },
                        { id: "G", at: [5, 1.5, 2] },
                        { id: "H", at: [0, 1.5, 2] },
                      ],
                      edges: [
                        { from: "A", to: "B" },
                        { from: "B", to: "C" },
                        { from: "C", to: "D", dashed: !0 },
                        { from: "D", to: "A", dashed: !0 },
                        { from: "E", to: "F" },
                        { from: "F", to: "G" },
                        { from: "G", to: "H" },
                        { from: "H", to: "E" },
                        { from: "A", to: "E" },
                        { from: "B", to: "F" },
                        { from: "C", to: "G" },
                        { from: "D", to: "H", dashed: !0 },
                      ],
                      faces: [],
                    },
                  ],
                }),
              ) +
              "\n```",
          },
          {
            id: "heater",
            name: "Sơ đồ máy sưởi",
            hint: "Ống nước, bộ tản nhiệt và chiều dòng khí",
            markdown: () =>
              "```diagram\n" +
              JSON.stringify(
                (0, t9.parseDiagramData)({
                  width: 240,
                  height: 270,
                  viewBox: [0, 0, 240, 270],
                  align: "right",
                  alt: "Sơ đồ máy sưởi: nước nóng qua bộ tản nhiệt, quạt thổi khí lạnh thành khí nóng",
                  elements: [
                    {
                      kind: "rect",
                      x: 46,
                      y: 20,
                      width: 148,
                      height: 225,
                      fill: "#eef7fa",
                      stroke: "#4d8599",
                      strokeWidth: 2,
                    },
                    {
                      kind: "rect",
                      x: 138,
                      y: 40,
                      width: 38,
                      height: 180,
                      fill: "#eeeeee",
                      stroke: "#666666",
                    },
                    ...[145, 155, 165].map((e) => ({
                      kind: "line",
                      from: [e, 43],
                      to: [e, 215],
                      stroke: "#888888",
                      strokeWidth: 1,
                    })),
                    {
                      kind: "polyline",
                      points: [
                        [22, 32],
                        [180, 32],
                        [180, 225],
                        [22, 225],
                      ],
                      stroke: "#555555",
                      arrowEnd: !0,
                    },
                    {
                      kind: "line",
                      from: [16, 135],
                      to: [70, 135],
                      arrowEnd: !0,
                      strokeWidth: 2,
                    },
                    {
                      kind: "line",
                      from: [174, 135],
                      to: [226, 135],
                      arrowEnd: !0,
                      strokeWidth: 2,
                    },
                    ...[60, 76, 92].map((e) => ({
                      kind: "path",
                      d: `M 170 ${e} C 82 ${e} 78 ${e + 2} 70 ${e + 40}`,
                      stroke: "#e44b35",
                      dashed: !0,
                      arrowEnd: !0,
                      strokeWidth: 1,
                    })),
                    ...[185, 201, 217].map((e) => ({
                      kind: "path",
                      d: `M 72 140 C 85 ${e} 98 ${e} 138 ${e}`,
                      stroke: "#527ac5",
                      dashed: !0,
                      arrowEnd: !0,
                      strokeWidth: 1,
                    })),
                    {
                      kind: "circle",
                      center: [156, 207],
                      radius: 12,
                      fill: "#ffffff",
                    },
                    {
                      kind: "line",
                      from: [156, 196],
                      to: [156, 218],
                      strokeWidth: 2,
                    },
                    {
                      kind: "line",
                      from: [145, 207],
                      to: [167, 207],
                      strokeWidth: 2,
                    },
                    {
                      kind: "text",
                      at: [94, 45],
                      text: "Khí nóng",
                      fontSize: 14,
                    },
                    {
                      kind: "text",
                      at: [91, 233],
                      text: "Khí lạnh",
                      fontSize: 14,
                    },
                    {
                      kind: "text",
                      at: [119, 115],
                      text: "Bộ tản nhiệt",
                      fontSize: 13,
                    },
                    {
                      kind: "text",
                      at: [33, 93],
                      text: "Nước nóng",
                      fontSize: 13,
                      rotate: -90,
                    },
                    {
                      kind: "text",
                      at: [211, 88],
                      text: "Nước lạnh",
                      fontSize: 13,
                      rotate: -90,
                    },
                  ],
                }),
              ) +
              "\n```",
          },
          {
            id: "radiation",
            name: "Biển cảnh báo phóng xạ",
            hint: "Hình vector trong phương án trắc nghiệm",
            markdown: () =>
              "```diagram\n" +
              JSON.stringify(
                (0, t9.parseDiagramData)({
                  width: 100,
                  height: 100,
                  alt: "Biển cảnh báo phóng xạ",
                  elements: [
                    {
                      kind: "polygon",
                      points: [
                        [50, 9],
                        [9, 87],
                        [91, 87],
                      ],
                      fill: "#ffeb00",
                      strokeWidth: 5,
                    },
                    {
                      kind: "circle",
                      center: [50, 57],
                      radius: 5,
                      fill: "#000000",
                      strokeWidth: 0,
                    },
                    ...[-90, 30, 150].map((e) => {
                      let t = (e, t) =>
                        [
                          50 + t * Math.cos((e * Math.PI) / 180),
                          57 + t * Math.sin((e * Math.PI) / 180),
                        ]
                          .map((e) => e.toFixed(3))
                          .join(" ");
                      return {
                        kind: "path",
                        d: `M ${t(e - 30, 9)} L ${t(e - 30, 24)} A 24 24 0 0 1 ${t(e + 30, 24)} L ${t(e + 30, 9)} A 9 9 0 0 0 ${t(e - 30, 9)} Z`,
                        fill: "#000000",
                        strokeWidth: 0,
                      };
                    }),
                  ],
                }),
              ) +
              "\n```",
          },
        ],
      },
      {
        name: "Đầu đề",
        items: [
          {
            id: "header",
            name: "Đầu đề hai cột",
            hint: "Sở / trường bên trái, kỳ thi bên phải",
            markdown: () =>
              "::: header\n**SỞ GIÁO DỤC VÀ ĐÀO TẠO**\n**TỈNH …**\n[[**Đề chính thức**]]\n|||\n**KỲ THI …**\n**NĂM HỌC 20… – 20…**\n**Môn thi: …**\n*Thời gian làm bài: 90 phút (không kể thời gian phát đề)*\n:::",
          },
          {
            id: "title",
            name: "Tên đề căn giữa",
            hint: "Tiêu đề lớn in đậm",
            markdown: () => "# ĐỀ KIỂM TRA …",
          },
          {
            id: "student",
            name: "Thông tin thí sinh",
            hint: "Họ tên · Số báo danh ở cuối đề (mẫu THPT ở đầu)",
            markdown: () =>
              "::: left\nHọ và tên thí sinh: ................................................ Số báo danh: ........................\n:::",
          },
          {
            id: "rubric-header",
            name: "Đầu hướng dẫn chấm",
            hint: "Sang trang mới + tiêu đề barem",
            markdown: () =>
              "\\newpage\n\n# HƯỚNG DẪN CHẤM\n\n## A. HƯỚNG DẪN CHUNG\n\n- Thí sinh làm cách khác đúng vẫn cho điểm tối đa.\n\n## B. ĐÁP ÁN VÀ THANG ĐIỂM",
          },
        ],
      },
      {
        name: "Câu hỏi",
        items: [
          {
            id: "section",
            name: "Tiêu đề phần",
            hint: "PHẦN I. TRẮC NGHIỆM (3,0 điểm)",
            markdown: () => "## PHẦN I. TRẮC NGHIỆM (3,0 điểm)",
          },
          {
            id: "essay",
            name: "Câu tự luận",
            hint: "Câu 1 (1,0 điểm) + các ý a) b)",
            markdown: () =>
              "**Câu 1** (1,0 điểm). Nội dung câu hỏi.\na) …\nb) …",
          },
          {
            id: "choice4",
            name: "Câu trắc nghiệm (tự động xếp đáp án)",
            hint: "Tự chọn 4, 2 hoặc 1 đáp án mỗi hàng",
            markdown: () =>
              "**Câu 1.** Nội dung câu hỏi.\n\n::: choices\n**A.** …\n**B.** …\n**C.** …\n**D.** …\n:::",
          },
          {
            id: "choice2",
            name: "Câu trắc nghiệm (2 phương án 1 hàng)",
            hint: "Phương án dài",
            markdown: () =>
              "**Câu 1.** Nội dung câu hỏi.\n\n::: grid 2 fixed=true\n**A.** …\n**B.** …\n**C.** …\n**D.** …\n:::",
          },
          {
            id: "truefalse",
            name: "Câu đúng / sai",
            hint: "Lời dẫn + 4 ý a) b) c) d)",
            markdown: () => "**Câu 1.** Lời dẫn.\na) …\nb) …\nc) …\nd) …",
          },
          {
            id: "short",
            name: "Câu trả lời ngắn",
            hint: "Nội dung + dòng đáp số",
            markdown: () => "**Câu 1.** Nội dung câu hỏi.\n*Đáp số:* ……………",
          },
          {
            id: "passage",
            name: "Ngữ liệu / đoạn trích",
            hint: "Lời dẫn + đoạn thơ căn giữa",
            markdown: () =>
              "**Đọc đoạn trích sau và thực hiện các yêu cầu:**\n\n::: center\n*Câu thơ thứ nhất*\n*Câu thơ thứ hai*\n:::\n\n::: right\n*(Tác giả, Tên tác phẩm)*\n:::",
          },
        ],
      },
      {
        name: "Nội dung",
        items: [
          {
            id: "math",
            name: "Công thức riêng dòng",
            hint: "$$…$$ căn giữa",
            markdown: () => "$$y = ax^2 + bx + c$$",
          },
          {
            id: "table",
            name: "Bảng",
            hint: "Bảng 3 cột có hàng tiêu đề",
            markdown: () =>
              "| Cột 1 | Cột 2 | Cột 3 |\n|---|---|---|\n|  |  |  |\n|  |  |  |",
          },
          {
            id: "rubric-table",
            name: "Bảng barem",
            hint: "Câu · Nội dung · Điểm",
            markdown: () =>
              "| Câu | Nội dung | Điểm |\n|:---:|---|:---:|\n| 1 | Ý thứ nhất … | 0,5 |\n| ^ | Ý thứ hai … | 0,5 |\n{widths=12,73,15}",
          },
          {
            id: "image",
            name: "Hình",
            hint: "Ô chờ chèn ảnh",
            markdown: () => "![Mô tả hình]()",
          },
          {
            id: "variation",
            name: "Bảng biến thiên",
            hint: "Hàng x, y', y",
            markdown: () =>
              "```variation\n" +
              JSON.stringify((0, t4.defaultVariationData)()) +
              "\n```",
          },
          {
            id: "graph",
            name: "Đồ thị hàm số",
            hint: "Hệ trục Oxy",
            markdown: () =>
              "```graph\n" +
              JSON.stringify((0, t4.defaultGraphData)()) +
              "\n```",
          },
          {
            id: "chart",
            name: "Biểu đồ",
            hint: "Cột, đường, tròn, miền",
            markdown: () =>
              "```chart\n" +
              JSON.stringify((0, t8.defaultChartData)()) +
              "\n```",
          },
          {
            id: "geometry",
            name: "Hình học",
            hint: "Tam giác, đường phụ, góc vuông",
            markdown: () =>
              "```geometry\n" +
              JSON.stringify((0, t6.defaultGeometryData)()) +
              "\n```",
          },
          {
            id: "geometry-rubric",
            name: "Barem có hình học",
            hint: "Hình nằm trong ô nội dung như đáp án mẫu",
            markdown: () => {
              let e = (0, t6.defaultGeometryData)(),
                t = {
                  ...e,
                  bottomCaption: "Hình cho ý b: kẻ thêm đường cao AH",
                  points: [
                    ...e.points,
                    {
                      id: "H",
                      kind: "projection",
                      parents: ["A", "B", "C"],
                      labelOffset: [0, -18],
                    },
                  ],
                  segments: [...e.segments, { from: "A", to: "H", dashed: !0 }],
                  angles: [
                    ...e.angles,
                    { points: ["A", "H", "C"], right: !0, radius: 0.25 },
                  ],
                };
              return [
                "| Câu | Ý | Nội dung trình bày | Điểm |\n|---|---|---|---|",
                "| 1 | a | <geometry>" + JSON.stringify(e) + "</geometry> | |",
                "| ^ | ^ | Nội dung lời giải… | 0,25 |",
                "| ^ | b | <geometry>" + JSON.stringify(t) + "</geometry> | |",
                "| ^ | ^ | Kẻ đường cao $AH$. Nội dung lời giải… | 0,25 |\n{widths=8,8,69,15}",
              ].join("\n");
            },
          },
        ],
      },
      {
        name: "Bố cục",
        items: [
          {
            id: "end",
            name: "Dòng HẾT",
            hint: "--------- HẾT ---------",
            markdown: () => "::: center\n**--------- HẾT ---------**\n:::",
          },
          {
            id: "rule",
            name: "Đường kẻ ngang",
            hint: "Kẻ mảnh ở cuối đề",
            markdown: () => "---",
          },
          {
            id: "pagebreak",
            name: "Ngắt trang",
            hint: "Sang trang mới (Ctrl+Enter)",
            markdown: () => "\\newpage",
          },
        ],
      },
    ];
    var nt = m74724;
    function nn(e, t, n = !1) {
      if (!nt.PARAGRAPH_STYLE_OPTIONS.find((e) => e.value === t)) return;
      let r = e.chain().focus();
      (n &&
        r.command(({ tr: t }) => {
          let { from: n, to: r } = t.selection;
          return (
            t.doc.nodesBetween(n, r, (n, r) => {
              if ("paragraph" === n.type.name || "heading" === n.type.name) {
                for (let i of [
                  "fontSize",
                  "fontFamily",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "textColor",
                  "textHighlight",
                ]) {
                  let a = e.schema.marks[i];
                  a && t.removeMark(r + 1, r + n.nodeSize - 1, a);
                }
                return !1;
              }
            }),
            !0
          );
        }),
        t.startsWith("h")
          ? r.setHeading({ level: Number(t.slice(1)) })
          : r
              .setParagraph()
              .updateAttributes("paragraph", {
                paragraphStyle: "p" === t ? null : t,
              }),
        r.run());
    }
    function nr({ editor: e, value: n, disabled: r }) {
      let i =
        nt.PARAGRAPH_STYLE_OPTIONS.find((e) => e.value === n) ??
        nt.PARAGRAPH_STYLE_OPTIONS[0];
      return (0, t.jsxs)(eY.DropdownMenu.Root, {
        modal: !1,
        children: [
          (0, t.jsx)(tZ.ToolbarTooltip, {
            label: "Kiểu đoạn",
            children: (0, t.jsxs)(eY.DropdownMenu.Trigger, {
              "aria-label": "Kiểu đoạn",
              disabled: r,
              onMouseDown: (e) => e.preventDefault(),
              className:
                "flex h-9 w-[152px] shrink-0 items-center justify-between gap-1.5 rounded-full px-2.5 text-[13px] text-neutral-700 outline-none transition-colors hover:bg-black/[0.06] data-[state=open]:bg-[#d3e5ef] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2383e2]/40 disabled:opacity-40",
              children: [
                (0, t.jsx)("span", {
                  className: "truncate",
                  children: i.label,
                }),
                (0, t.jsx)(ta.ChevronDown, {
                  "aria-hidden": !0,
                  className:
                    "size-3.5 shrink-0 transition-transform [[data-state=open]_&]:rotate-180",
                }),
              ],
            }),
          }),
          (0, t.jsx)(eY.DropdownMenu.Portal, {
            children: (0, t.jsx)(eY.DropdownMenu.Content, {
              align: "start",
              sideOffset: 8,
              collisionPadding: 12,
              onCloseAutoFocus: (e) => e.preventDefault(),
              className:
                "doc-menu z-50 w-[304px] max-w-[calc(100vw-24px)] overflow-y-auto rounded-xl border border-neutral-200 bg-white py-1 shadow-[0_8px_30px_-8px_#59628040] outline-none [max-height:min(620px,var(--radix-dropdown-menu-content-available-height))]",
              children: nt.PARAGRAPH_STYLE_OPTIONS.map((r) =>
                (0, t.jsxs)(
                  "div",
                  {
                    className:
                      "flex items-stretch border-b border-neutral-200 last:border-b-0",
                    children: [
                      (0, t.jsxs)(eY.DropdownMenu.Item, {
                        "aria-label": r.label,
                        "aria-current": n === r.value ? "true" : void 0,
                        onSelect: () => nn(e, r.value),
                        className: `flex min-h-16 min-w-0 flex-1 cursor-pointer items-center gap-3 py-4 pl-3 pr-2 outline-none data-[highlighted]:bg-[#f1f1ef] ${n === r.value ? "bg-[#e9e9e7]" : ""}`,
                        children: [
                          (0, t.jsx)("span", {
                            className:
                              "flex w-5 shrink-0 items-center justify-center",
                            children:
                              n === r.value &&
                              (0, t.jsx)(g.Check, {
                                "aria-hidden": !0,
                                className: "size-4 text-neutral-600",
                              }),
                          }),
                          (0, t.jsx)("span", {
                            style: {
                              fontSize: r.size,
                              fontWeight: r.bold ? 700 : 400,
                              fontStyle: r.italics ? "italic" : "normal",
                              color: r.color,
                            },
                            className: "leading-tight",
                            children: r.label,
                          }),
                        ],
                      }),
                      (0, t.jsxs)(eY.DropdownMenu.Sub, {
                        children: [
                          (0, t.jsx)(eY.DropdownMenu.SubTrigger, {
                            "aria-label": `T\xf9y chọn ${r.label}`,
                            className: `flex w-10 shrink-0 cursor-pointer items-center justify-center text-neutral-500 outline-none data-[highlighted]:bg-[#f1f1ef] data-[state=open]:bg-[#f1f1ef] ${n === r.value ? "bg-[#e9e9e7]" : ""}`,
                            children: (0, t.jsx)(R.ChevronRight, {
                              "aria-hidden": !0,
                              className: "size-4",
                            }),
                          }),
                          (0, t.jsx)(eY.DropdownMenu.Portal, {
                            children: (0, t.jsxs)(eY.DropdownMenu.SubContent, {
                              collisionPadding: 12,
                              className:
                                "doc-menu z-50 max-w-[calc(100vw-24px)] rounded-lg border border-neutral-200 bg-white p-1 text-[13px] shadow-lg",
                              children: [
                                (0, t.jsxs)(eY.DropdownMenu.Item, {
                                  onSelect: () => nn(e, r.value),
                                  className:
                                    "cursor-pointer rounded-md px-3 py-2 outline-none data-[highlighted]:bg-[#f1f1ef]",
                                  children: ["Áp dụng ", r.label.toLowerCase()],
                                }),
                                (0, t.jsx)(eY.DropdownMenu.Item, {
                                  onSelect: () => nn(e, r.value, !0),
                                  className:
                                    "cursor-pointer rounded-md px-3 py-2 outline-none data-[highlighted]:bg-[#f1f1ef]",
                                  children: "Áp dụng và bỏ định dạng chữ riêng",
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                    ],
                  },
                  r.value,
                ),
              ),
            }),
          }),
        ],
      });
    }
    let ni = [0.5, 0.75, 0.9, 1, 1.25, 1.5, 2],
      na =
        "u" > typeof navigator && /Mac|iPhone|iPad/.test(navigator.platform)
          ? "⌘"
          : "Ctrl+",
      ns =
        "doc-menu z-50 min-w-56 rounded-lg border border-neutral-200 bg-white py-1.5 text-[13px] text-neutral-800 shadow-lg outline-none",
      nl =
        "flex cursor-default select-none items-center gap-2 px-3 py-1.5 outline-none data-[highlighted]:bg-neutral-100 data-[disabled]:pointer-events-none data-[disabled]:text-neutral-300";
    function no({
      children: e,
      onSelect: n,
      shortcut: r,
      checked: i,
      disabled: a,
    }) {
      return (0, t.jsxs)(tW.Menubar.Item, {
        className: nl,
        disabled: a,
        onSelect: n,
        children: [
          (0, t.jsx)("span", {
            className:
              "flex size-4 shrink-0 items-center justify-center text-blue-600",
            children: i
              ? (0, t.jsx)(g.Check, { className: "size-3.5" })
              : (0, t.jsx)(tO, {
                  label: "string" == typeof e ? e : "",
                  className: "size-4 text-neutral-500",
                }),
          }),
          (0, t.jsx)("span", {
            className: "flex-1 whitespace-nowrap",
            children: e,
          }),
          r
            ? (0, t.jsx)("span", {
                className: "ml-6 text-xs text-neutral-400",
                children: r,
              })
            : null,
        ],
      });
    }
    function nc({ label: e, children: n, disabled: r }) {
      return (0, t.jsxs)(tW.Menubar.Sub, {
        children: [
          (0, t.jsxs)(tW.Menubar.SubTrigger, {
            className: nl,
            disabled: r,
            children: [
              (0, t.jsx)(tO, {
                label: e,
                className: "size-4 shrink-0 text-neutral-500",
              }),
              (0, t.jsx)("span", {
                className: "flex-1 whitespace-nowrap",
                children: e,
              }),
              (0, t.jsx)(R.ChevronRight, {
                className: "size-3.5 text-neutral-400",
              }),
            ],
          }),
          (0, t.jsx)(tW.Menubar.Portal, {
            children: (0, t.jsx)(tW.Menubar.SubContent, {
              className: ns,
              sideOffset: 2,
              alignOffset: -6,
              children: n,
            }),
          }),
        ],
      });
    }
    let nd = () =>
      (0, t.jsx)(tW.Menubar.Separator, {
        className: "my-1.5 h-px bg-neutral-200",
      });
    function nu({ label: e, children: n, onClosed: r }) {
      return (0, t.jsxs)(tW.Menubar.Menu, {
        children: [
          (0, t.jsx)(tW.Menubar.Trigger, {
            className:
              "rounded-md px-2 py-0.5 text-[13px] font-normal text-neutral-600 outline-none hover:bg-[#f1f1ef] focus-visible:ring-2 focus-visible:ring-[#2383e2]/40 data-[state=open]:bg-[#e7f3f8] data-[state=open]:text-[#2383e2]",
            children: e,
          }),
          (0, t.jsx)(tW.Menubar.Portal, {
            children: (0, t.jsx)(tW.Menubar.Content, {
              className: ns,
              align: "start",
              sideOffset: 4,
              alignOffset: -2,
              onCloseAutoFocus: (e) => {
                (e.preventDefault(), r?.());
              },
              children: n,
            }),
          }),
        ],
      });
    }
    function nh(e) {
      let [n, r] = (0, E.useState)(null),
        { editor: i } = e,
        a = () => {
          i && !i.isFocused && i.commands.focus();
        },
        s = () => i?.chain().focus(),
        l = !!i && i.isEditable,
        o = (e, t) => !!i?.isActive(e, t),
        c = (e) =>
          !!i &&
          (i.getAttributes("paragraph").lineHeight ??
            i.getAttributes("heading").lineHeight ??
            null ??
            null) === e;
      return (0, t.jsxs)(t.Fragment, {
        children: [
          (0, t.jsx)(tS.FormatDialog, {
            editor: e.editor,
            kind: n,
            onClose: () => r(null),
          }),
          (0, t.jsxs)(tW.Menubar.Root, {
            className: "flex items-center gap-0.5",
            children: [
              (0, t.jsxs)(nu, {
                onClosed: a,
                label: "Tệp",
                children: [
                  (0, t.jsx)(no, {
                    onSelect: e.onNew,
                    disabled: !l,
                    children: "Đề mới",
                  }),
                  (0, t.jsx)(no, {
                    onSelect: e.onOpen,
                    disabled: !l,
                    children: "Mở file (Word, Markdown, JSON)…",
                  }),
                  (0, t.jsx)(no, {
                    onSelect: () =>
                      window.dispatchEvent(new Event(t3.OPEN_LIBRARY_EVENT)),
                    disabled: !l,
                    children: "Kho tài liệu…",
                  }),
                  (0, t.jsx)(nd, {}),
                  (0, t.jsxs)(nc, {
                    label: "Tải xuống",
                    children: [
                      (0, t.jsx)(no, {
                        onSelect: e.onExportDocx,
                        disabled: e.busy || !i,
                        children: "Microsoft Word (.docx)",
                      }),
                      (0, t.jsx)(no, {
                        onSelect: e.onExportDocxMathType,
                        disabled: e.busy || !i,
                        children: "Microsoft Word, công thức MathType (.docx)",
                      }),
                      (0, t.jsx)(no, {
                        onSelect: e.onSaveMarkdown,
                        disabled: !i,
                        children: "Markdown (.md)",
                      }),
                      (0, t.jsx)(no, {
                        onSelect: e.onSaveJson,
                        disabled: !i,
                        children: "JSON (.json)",
                      }),
                      (0, t.jsx)(nd, {}),
                      e.onExportVersions &&
                        (0, t.jsx)(no, {
                          onSelect: e.onExportVersions,
                          disabled: !i,
                          children: "Bộ mã đề (Word, .zip)",
                        }),
                      (0, t.jsx)(no, {
                        onSelect: e.onExportTnmaker,
                        disabled: !i,
                        children: "Đáp án cho TNMaker (QR, Excel)…",
                      }),
                    ],
                  }),
                  (0, t.jsx)(nd, {}),
                  (0, t.jsx)(no, {
                    onSelect: e.onPrint,
                    shortcut: `${na}P`,
                    disabled: !i,
                    children: "In",
                  }),
                ],
              }),
              (0, t.jsxs)(nu, {
                onClosed: a,
                label: "Chỉnh sửa",
                children: [
                  (0, t.jsx)(no, {
                    onSelect: () => s()?.undo().run(),
                    shortcut: `${na}Z`,
                    disabled: !l,
                    children: "Hoàn tác",
                  }),
                  (0, t.jsx)(no, {
                    onSelect: () => s()?.redo().run(),
                    shortcut: `${na}Y`,
                    disabled: !l,
                    children: "Làm lại",
                  }),
                  (0, t.jsx)(nd, {}),
                  (0, t.jsx)(no, {
                    onSelect: () => s()?.selectAll().run(),
                    shortcut: `${na}A`,
                    disabled: !i,
                    children: "Chọn tất cả",
                  }),
                  (0, t.jsx)(nd, {}),
                  (0, t.jsx)(no, {
                    onSelect: () => e.onFind(!1),
                    shortcut: `${na}F`,
                    disabled: !i,
                    children: "Tìm",
                  }),
                  (0, t.jsx)(no, {
                    onSelect: () => e.onFind(!0),
                    shortcut: `${na}H`,
                    disabled: !l,
                    children: "Tìm và thay thế",
                  }),
                  (0, t.jsx)(nd, {}),
                  (0, t.jsx)(no, {
                    onSelect: e.onRemoveExtraBlanks,
                    disabled: !l,
                    children: "Xoá đoạn trống thừa",
                  }),
                ],
              }),
              (0, t.jsxs)(nu, {
                onClosed: a,
                label: "Xem",
                children: [
                  (0, t.jsxs)(nc, {
                    label: "Thu phóng",
                    children: [
                      e.onFitZoom &&
                        (0, t.jsx)(no, {
                          onSelect: e.onFitZoom,
                          children: "Vừa màn hình",
                        }),
                      ni.map((n) =>
                        (0, t.jsxs)(
                          no,
                          {
                            checked: 0.01 > Math.abs(e.zoom - n),
                            onSelect: () => e.setZoom(n),
                            children: [Math.round(100 * n), "%"],
                          },
                          n,
                        ),
                      ),
                    ],
                  }),
                  (0, t.jsx)(nd, {}),
                  (0, t.jsx)(no, {
                    checked: e.showRuler,
                    onSelect: () => e.setShowRuler(!e.showRuler),
                    children: "Hiện thước kẻ",
                  }),
                  (0, t.jsx)(no, {
                    checked: e.showSidebar,
                    onSelect: () => e.setShowSidebar(!e.showSidebar),
                    children: "Hiện dàn ý và mẫu chèn",
                  }),
                  (0, t.jsx)(no, {
                    checked: e.aiOpen,
                    onSelect: () => e.setAiOpen(!e.aiOpen),
                    children: "Trợ lý AI",
                  }),
                ],
              }),
              (0, t.jsxs)(nu, {
                onClosed: a,
                label: "Chèn",
                children: [
                  (0, t.jsx)(no, {
                    onSelect: () =>
                      s()
                        ?.insertContent({
                          type: "math",
                          attrs: {
                            latex: encodeURIComponent("x^2"),
                            display: !1,
                            fresh: !0,
                          },
                        })
                        .run(),
                    disabled: !l,
                    children: "Công thức toán",
                  }),
                  (0, t.jsx)(no, {
                    onSelect: () =>
                      s()
                        ?.insertContent({
                          type: "math",
                          attrs: {
                            latex: encodeURIComponent("\\ce{2H2 + O2 -> 2H2O}"),
                            display: !1,
                            fresh: !0,
                          },
                        })
                        .run(),
                    disabled: !l,
                    children: "Công thức hoá học",
                  }),
                  (0, t.jsx)(nd, {}),
                  (0, t.jsx)(nc, {
                    label: "Bảng",
                    disabled: !l,
                    children: (0, t.jsx)(tV, {
                      menu: "menubar",
                      disabled: !l,
                      onSelect: (e, t) =>
                        s()
                          ?.insertTable({ rows: e, cols: t, withHeaderRow: !1 })
                          .run(),
                      onMore: () => r("insertTable"),
                    }),
                  }),
                  (0, t.jsx)(no, {
                    onSelect: () =>
                      s()
                        ?.insertContent({
                          type: "examImage",
                          attrs: {
                            src: "",
                            alt: "",
                            width: 220,
                            align: "center",
                          },
                        })
                        .run(),
                    disabled: !l,
                    children: "Hình",
                  }),
                  (0, t.jsx)(nd, {}),
                  ne.map((n) =>
                    (0, t.jsx)(
                      nc,
                      {
                        label: n.name,
                        children: n.items.map((n) =>
                          (0, t.jsx)(
                            no,
                            {
                              onSelect: () => e.onInsertSnippet(n),
                              disabled: !l,
                              children: n.name,
                            },
                            n.id,
                          ),
                        ),
                      },
                      n.name,
                    ),
                  ),
                  (0, t.jsx)(nd, {}),
                  (0, t.jsx)(no, {
                    onSelect: () => r("link"),
                    disabled: !l,
                    children: "Liên kết",
                  }),
                  (0, t.jsx)(no, {
                    onSelect: () => s()?.setPageBreak().run(),
                    shortcut: `${na}↵`,
                    disabled: !l,
                    children: "Ngắt trang",
                  }),
                  (0, t.jsx)(no, {
                    onSelect: () => i && (0, t5.insertExamFooter)(i, "---"),
                    disabled: !l,
                    children: "Đường kẻ ngang",
                  }),
                ],
              }),
              (0, t.jsxs)(nu, {
                onClosed: a,
                label: "Định dạng",
                children: [
                  (0, t.jsxs)(nc, {
                    label: "Chữ",
                    children: [
                      (0, t.jsx)(no, {
                        checked: o("bold"),
                        shortcut: `${na}B`,
                        onSelect: () => s()?.toggleBold().run(),
                        disabled: !l,
                        children: "Đậm",
                      }),
                      (0, t.jsx)(no, {
                        checked: o("italic"),
                        shortcut: `${na}I`,
                        onSelect: () => s()?.toggleItalic().run(),
                        disabled: !l,
                        children: "Nghiêng",
                      }),
                      (0, t.jsx)(no, {
                        checked: o("underline"),
                        shortcut: `${na}U`,
                        onSelect: () => s()?.toggleUnderline().run(),
                        disabled: !l,
                        children: "Gạch chân",
                      }),
                      (0, t.jsx)(no, {
                        checked: o("strike"),
                        onSelect: () => s()?.toggleStrike().run(),
                        disabled: !l,
                        children: "Gạch ngang",
                      }),
                      (0, t.jsx)(no, {
                        checked: o("superscript"),
                        onSelect: () => s()?.toggleSuperscript().run(),
                        disabled: !l,
                        children: "Chỉ số trên",
                      }),
                      (0, t.jsx)(no, {
                        checked: o("subscript"),
                        onSelect: () => s()?.toggleSubscript().run(),
                        disabled: !l,
                        children: "Chỉ số dưới",
                      }),
                      (0, t.jsx)(no, {
                        checked: o("boxed"),
                        onSelect: () => s()?.toggleBoxed().run(),
                        disabled: !l,
                        children: "Đóng khung",
                      }),
                    ],
                  }),
                  (0, t.jsx)(nc, {
                    label: "Phông chữ",
                    children: tA.FONT_FAMILIES.map((e) =>
                      (0, t.jsx)(
                        no,
                        {
                          checked: i?.getAttributes("fontFamily").family === e,
                          onSelect: () =>
                            s()?.setMark("fontFamily", { family: e }).run(),
                          disabled: !l,
                          children: e,
                        },
                        e,
                      ),
                    ),
                  }),
                  (0, t.jsxs)(nc, {
                    label: "Màu chữ",
                    children: [
                      [
                        ["#000000", "Đen"],
                        ["#ff0000", "Đỏ"],
                        ["#0b5394", "Xanh dương"],
                        ["#38761d", "Xanh lá"],
                        ["#9900ff", "Tím"],
                        ["#ff9900", "Cam"],
                      ].map(([e, n]) =>
                        (0, t.jsx)(
                          no,
                          {
                            onSelect: () =>
                              s()?.setMark("textColor", { color: e }).run(),
                            disabled: !l,
                            children: (0, t.jsxs)("span", {
                              className: "flex items-center gap-2",
                              children: [
                                (0, t.jsx)("span", {
                                  className:
                                    "size-3 rounded-sm border border-neutral-200",
                                  style: { background: e },
                                }),
                                n,
                              ],
                            }),
                          },
                          e,
                        ),
                      ),
                      (0, t.jsx)(no, {
                        onSelect: () => s()?.unsetMark("textColor").run(),
                        disabled: !l,
                        children: "Bỏ màu chữ",
                      }),
                    ],
                  }),
                  (0, t.jsxs)(nc, {
                    label: "Màu nền chữ",
                    children: [
                      [
                        ["#fff2cc", "Vàng"],
                        ["#d9ead3", "Xanh lá"],
                        ["#cfe2f3", "Xanh dương"],
                        ["#ead1dc", "Hồng"],
                      ].map(([e, n]) =>
                        (0, t.jsx)(
                          no,
                          {
                            onSelect: () =>
                              s()?.setMark("textHighlight", { color: e }).run(),
                            disabled: !l,
                            children: (0, t.jsxs)("span", {
                              className: "flex items-center gap-2",
                              children: [
                                (0, t.jsx)("span", {
                                  className:
                                    "size-3 rounded-sm border border-neutral-200",
                                  style: { background: e },
                                }),
                                n,
                              ],
                            }),
                          },
                          e,
                        ),
                      ),
                      (0, t.jsx)(no, {
                        onSelect: () => s()?.unsetMark("textHighlight").run(),
                        disabled: !l,
                        children: "Bỏ màu nền chữ",
                      }),
                    ],
                  }),
                  (0, t.jsx)(nc, {
                    label: "Kiểu đoạn",
                    children: nt.PARAGRAPH_STYLE_OPTIONS.map(
                      ({ value: e, label: n }) =>
                        (0, t.jsx)(
                          no,
                          {
                            checked: e.startsWith("h")
                              ? o("heading", { level: Number(e.slice(1)) })
                              : o("paragraph", {
                                  paragraphStyle: "p" === e ? null : e,
                                }),
                            onSelect: () => {
                              i && nn(i, e);
                            },
                            disabled: !l,
                            children: n,
                          },
                          e,
                        ),
                    ),
                  }),
                  (0, t.jsxs)(nc, {
                    label: "Căn lề",
                    children: [
                      [
                        ["left", "Căn trái"],
                        ["center", "Căn giữa"],
                        ["right", "Căn phải"],
                      ].map(([e, n]) =>
                        (0, t.jsx)(
                          no,
                          {
                            checked: !!i?.isActive({ textAlign: e }),
                            onSelect: () => s()?.setTextAlign(e).run(),
                            disabled: !l,
                            children: n,
                          },
                          e,
                        ),
                      ),
                      (0, t.jsx)(no, {
                        checked:
                          !!i &&
                          !["left", "center", "right"].some((e) =>
                            i.isActive({ textAlign: e }),
                          ),
                        onSelect: () => s()?.unsetTextAlign().run(),
                        disabled: !l,
                        children: "Căn đều hai bên",
                      }),
                    ],
                  }),
                  (0, t.jsxs)(nc, {
                    label: "Giãn dòng",
                    children: [
                      (0, t.jsx)(no, {
                        checked: c(null),
                        onSelect: () => s()?.setLineHeight(null).run(),
                        disabled: !l,
                        children: "Mặc định",
                      }),
                      [1, 1.15, 1.5, 2].map((e) =>
                        (0, t.jsx)(
                          no,
                          {
                            checked: c(e),
                            onSelect: () => s()?.setLineHeight(e).run(),
                            disabled: !l,
                            children: String(e).replace(".", ","),
                          },
                          e,
                        ),
                      ),
                    ],
                  }),
                  (0, t.jsxs)(nc, {
                    label: "Khoảng cách đoạn",
                    children: [
                      (0, t.jsx)(no, {
                        onSelect: () => s()?.setSpaceBefore(8).run(),
                        disabled: !l,
                        children: "Thêm khoảng trước đoạn",
                      }),
                      (0, t.jsx)(no, {
                        onSelect: () => s()?.setSpaceAfter(8).run(),
                        disabled: !l,
                        children: "Thêm khoảng sau đoạn",
                      }),
                      (0, t.jsx)(no, {
                        onSelect: () =>
                          s()?.setSpaceBefore(null).setSpaceAfter(null).run(),
                        disabled: !l,
                        children: "Bỏ khoảng cách",
                      }),
                    ],
                  }),
                  (0, t.jsxs)(nc, {
                    label: "Thụt lề",
                    children: [
                      (0, t.jsx)(no, {
                        onSelect: () => s()?.setIndentFirst(1).run(),
                        disabled: !l,
                        children: "Thụt đầu dòng 1 cm",
                      }),
                      (0, t.jsx)(no, {
                        onSelect: () => s()?.setIndentFirst(null).run(),
                        disabled: !l,
                        children: "Bỏ thụt đầu dòng",
                      }),
                      (0, t.jsx)(nd, {}),
                      (0, t.jsx)(no, {
                        onSelect: () => s()?.changeIndent(1).run(),
                        shortcut: `${na}]`,
                        disabled: !l,
                        children: "Tăng thụt lề",
                      }),
                      (0, t.jsx)(no, {
                        onSelect: () => s()?.changeIndent(-1).run(),
                        shortcut: `${na}[`,
                        disabled: !l,
                        children: "Giảm thụt lề",
                      }),
                    ],
                  }),
                  (0, t.jsxs)(nc, {
                    label: "Dấu đầu dòng và đánh số",
                    children: [
                      (0, t.jsx)(no, {
                        checked: o("bulletList"),
                        onSelect: () => s()?.toggleBulletList().run(),
                        disabled: !l,
                        children: "Danh sách dấu đầu dòng",
                      }),
                      (0, t.jsx)(no, {
                        checked: o("orderedList"),
                        onSelect: () => s()?.toggleOrderedList().run(),
                        disabled: !l,
                        children: "Danh sách đánh số",
                      }),
                      (0, t.jsx)(no, {
                        onSelect: () => s()?.sinkListItem("listItem").run(),
                        disabled: !l || !i?.can().sinkListItem("listItem"),
                        children: "Tăng cấp danh sách",
                      }),
                      (0, t.jsx)(no, {
                        onSelect: () => s()?.liftListItem("listItem").run(),
                        disabled: !l || !i?.can().liftListItem("listItem"),
                        children: "Giảm cấp danh sách",
                      }),
                    ],
                  }),
                  (0, t.jsx)(no, {
                    onSelect: () => r("paragraph"),
                    disabled: !l,
                    children: "Định dạng đoạn, viền và màu nền",
                  }),
                  (0, t.jsx)(nc, {
                    label: "Cột",
                    disabled: !l,
                    children: (0, t.jsx)(tU, {
                      menu: "menubar",
                      disabled: !l,
                      current: o("docColumns")
                        ? Number(i?.getAttributes("docColumns").columns)
                        : 1,
                      onSelect: (e) => {
                        i && (0, tJ.applyDocumentColumns)(i, e);
                      },
                      onMore: () => r("columns"),
                    }),
                  }),
                  (0, t.jsxs)(nc, {
                    label: "Bảng",
                    children: [
                      (0, t.jsxs)(nc, {
                        label: "Màu viền bảng",
                        disabled: !l || !o("table"),
                        children: [
                          [
                            ["#000000", "Đen"],
                            ["#ff0000", "Đỏ"],
                            ["#0b5394", "Xanh dương"],
                            ["#38761d", "Xanh lá"],
                            ["#9900ff", "Tím"],
                            ["#ff9900", "Cam"],
                          ].map(([e, n]) =>
                            (0, t.jsx)(
                              no,
                              {
                                onSelect: () => {
                                  i &&
                                    (0, tJ.applyTableAppearance)(i, {
                                      borderColor: e,
                                    });
                                },
                                disabled: !l || !o("table"),
                                children: (0, t.jsxs)("span", {
                                  className: "flex items-center gap-2",
                                  children: [
                                    (0, t.jsx)("span", {
                                      "aria-hidden": !0,
                                      className:
                                        "size-3 rounded-sm border border-neutral-200",
                                      style: { background: e },
                                    }),
                                    n,
                                  ],
                                }),
                              },
                              e,
                            ),
                          ),
                          (0, t.jsx)(no, {
                            onSelect: () => r("table"),
                            disabled: !l || !o("table"),
                            children: "Màu tùy chỉnh…",
                          }),
                        ],
                      }),
                      (0, t.jsx)(nc, {
                        label: "Độ dày viền bảng",
                        disabled: !l || !o("table"),
                        children: [0, 0.5, 1, 1.5, 2, 3, 4, 6].map((e) =>
                          (0, t.jsx)(
                            no,
                            {
                              onSelect: () => {
                                i &&
                                  (0, tJ.applyTableAppearance)(i, {
                                    borderWidth: e,
                                    ...(e > 0 &&
                                    "none" ===
                                      (0, tJ.selectedCellAttributes)(i.state)
                                        .borderStyle
                                      ? { borderStyle: "solid" }
                                      : {}),
                                  });
                              },
                              disabled: !l || !o("table"),
                              children: 0 === e ? "Không viền" : `${e} px`,
                            },
                            e,
                          ),
                        ),
                      }),
                      (0, t.jsx)(nd, {}),
                      i && l && o("table")
                        ? (0, t.jsx)(t7.TableMenuItems, {
                            kit: tW.Menubar,
                            entries: (0, t7.tableMenuEntries)(i, {
                              openDialog: r,
                            }),
                          })
                        : (0, t.jsx)(no, {
                            disabled: !0,
                            children: "Đặt con trỏ trong bảng để chỉnh sửa",
                          }),
                    ],
                  }),
                  (0, t.jsx)(nd, {}),
                  (0, t.jsx)(no, {
                    onSelect: () =>
                      s()
                        ?.unsetAllMarks()
                        .clearParagraphFormat()
                        .unsetTextAlign()
                        .run(),
                    shortcut: `${na}\\`,
                    disabled: !l,
                    children: "Xoá định dạng",
                  }),
                ],
              }),
              (0, t.jsxs)(nu, {
                onClosed: a,
                label: "Công cụ",
                children: [
                  (0, t.jsx)(no, {
                    onSelect: () => e.onFind(!1),
                    disabled: !i,
                    children: "Tìm trong đề",
                  }),
                  (0, t.jsx)(no, {
                    onSelect: () => e.setAiOpen(!e.aiOpen),
                    children: "Trợ lý AI soạn đề",
                  }),
                  (0, t.jsx)(nd, {}),
                  (0, t.jsx)(no, {
                    onSelect: e.onShortcuts,
                    children: "Phím tắt",
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    }
    var nm = m728231;
    function np({
      icon: e,
      title: n,
      onClick: r,
      active: i,
      disabled: a,
      children: s,
    }) {
      return (0, t.jsx)(tZ.ToolbarTooltip, {
        label: n,
        children: (0, t.jsxs)("button", {
          type: "button",
          "aria-label": n,
          "aria-pressed": i,
          disabled: a,
          onMouseDown: (e) => e.preventDefault(),
          onClick: r,
          className: `flex h-9 min-w-9 items-center justify-center gap-1 rounded-full px-2 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2383e2]/40 disabled:opacity-40 ${i ? "bg-[#d3e5ef] text-[#2383e2]" : "text-neutral-700 hover:bg-black/[0.06]"}`,
          children: [
            e && (0, t.jsx)(e, { "aria-hidden": !0, className: "size-[18px]" }),
            s,
          ],
        }),
      });
    }
    function nx({
      label: e,
      title: n,
      width: r,
      children: i,
      disabled: a,
      contentClassName: s,
    }) {
      return (0, t.jsxs)(eY.DropdownMenu.Root, {
        modal: !1,
        children: [
          (0, t.jsx)(tZ.ToolbarTooltip, {
            label: n,
            children: (0, t.jsxs)(eY.DropdownMenu.Trigger, {
              disabled: a,
              "aria-label": n,
              onMouseDown: (e) => e.preventDefault(),
              className: `flex h-9 shrink-0 items-center justify-between gap-1.5 rounded-full px-2.5 text-[13px] text-neutral-700 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2383e2]/40 hover:bg-black/[0.06] data-[state=open]:bg-[#d3e5ef] disabled:opacity-40 ${r ?? ""}`,
              children: [
                (0, t.jsx)("span", { className: "truncate", children: e }),
                (0, t.jsx)(ta.ChevronDown, {
                  "aria-hidden": !0,
                  className: "size-3.5 shrink-0 text-neutral-500",
                }),
              ],
            }),
          }),
          (0, t.jsx)(eY.DropdownMenu.Portal, {
            children: (0, t.jsx)(eY.DropdownMenu.Content, {
              align: "start",
              sideOffset: 4,
              onCloseAutoFocus: (e) => e.preventDefault(),
              className: `doc-menu z-50 rounded-lg border border-neutral-200 bg-white text-[13px] text-neutral-800 shadow-lg ${s ?? "min-w-40 py-1.5"}`,
              children: i,
            }),
          }),
        ],
      });
    }
    function ng({ onSelect: e, checked: n, children: r }) {
      return (0, t.jsxs)(eY.DropdownMenu.Item, {
        onSelect: e,
        className:
          "flex cursor-default items-center gap-2 px-3 py-1.5 outline-none data-[highlighted]:bg-neutral-100",
        children: [
          (0, t.jsx)("span", {
            className: "flex size-4 items-center justify-center text-blue-600",
            children: n
              ? (0, t.jsx)(g.Check, { className: "size-3.5" })
              : (0, t.jsx)(tO, {
                  label: "string" == typeof r ? r : "",
                  className: "size-3.5 text-neutral-500",
                }),
          }),
          r,
        ],
      });
    }
    let nf = [
      "#000000",
      "#434343",
      "#666666",
      "#999999",
      "#cccccc",
      "#ffffff",
      "#980000",
      "#ff0000",
      "#ff9900",
      "#ffff00",
      "#00ff00",
      "#00ffff",
      "#0000ff",
      "#9900ff",
      "#ff00ff",
      "#f4cccc",
      "#fce5cd",
      "#fff2cc",
      "#d9ead3",
      "#d0e0e3",
      "#cfe2f3",
      "#d9d2e9",
      "#ead1dc",
      "#0b5394",
    ];
    function nb({ title: e, value: n, icon: r, disabled: i, onChange: a }) {
      return (0, t.jsxs)(nx, {
        label: (0, t.jsxs)("span", {
          className: "flex flex-col items-center",
          children: [
            (0, t.jsx)(r, { "aria-hidden": !0, className: "size-[18px]" }),
            (0, t.jsx)("span", {
              className: "mt-0.5 h-1 w-5 rounded-sm",
              style: { backgroundColor: n },
            }),
          ],
        }),
        title: e,
        disabled: i,
        children: [
          (0, t.jsx)(eY.DropdownMenu.Label, {
            className: "px-3 py-1.5 font-medium",
            children: e,
          }),
          (0, t.jsx)("div", {
            className: "grid grid-cols-6 gap-1.5 px-3 py-2",
            children: nf.map((r) =>
              (0, t.jsx)(
                eY.DropdownMenu.Item,
                {
                  "aria-label": `${e}: ${r}`,
                  title: r,
                  onSelect: () => a(r),
                  className:
                    "size-6 cursor-pointer rounded border border-neutral-300 outline-none data-[highlighted]:ring-2 data-[highlighted]:ring-blue-600",
                  style: { backgroundColor: r },
                  children:
                    n === r &&
                    (0, t.jsx)(g.Check, {
                      className: "m-auto size-4",
                      style: {
                        color: [
                          "#000000",
                          "#434343",
                          "#980000",
                          "#0000ff",
                          "#9900ff",
                          "#0b5394",
                        ].includes(r)
                          ? "white"
                          : "black",
                      },
                    }),
                },
                r,
              ),
            ),
          }),
          (0, t.jsxs)("label", {
            className:
              "flex items-center justify-between gap-2 px-3 py-2 text-xs",
            children: [
              "Màu tùy chỉnh",
              (0, t.jsx)("input", {
                type: "color",
                "aria-label": `${e} t\xf9y chỉnh`,
                value: n,
                onChange: (e) => a(e.target.value),
                className: "h-7 w-10",
              }),
            ],
          }),
          (0, t.jsx)(ng, { onSelect: () => a(null), children: "Bỏ màu" }),
        ],
      });
    }
    let ny = [null, 1, 1.15, 1.5, 2],
      nw = [
        { value: "left", Icon: tn.AlignLeft, label: "Căn trái" },
        { value: "center", Icon: eZ.AlignCenter, label: "Căn giữa" },
        { value: "right", Icon: tr.AlignRight, label: "Căn phải" },
        {
          value: "justify",
          Icon: tt.AlignJustify,
          label: "Căn đều hai bên (mặc định)",
        },
      ],
      nv = [0, 0.5, 1, 1.5, 2, 3, 4, 6],
      nj = [
        ["solid", "Nét liền"],
        ["dashed", "Nét đứt"],
        ["dotted", "Chấm"],
        ["double", "Nét đôi"],
      ],
      nk = [
        { value: "top", Icon: e2.AlignVerticalJustifyStart, label: "Trên" },
        { value: "middle", Icon: e0.AlignVerticalJustifyCenter, label: "Giữa" },
        { value: "bottom", Icon: e1.AlignVerticalJustifyEnd, label: "Dưới" },
      ];
    function nN({ editor: e, size: n, disabled: r }) {
      let [i, a] = (0, E.useState)(String(n)),
        s = (t) => {
          let n = (0, tA.clampFontSize)(t);
          a(String(n));
          let r = e.chain().focus();
          n === eJ.BASE_FONT_PX
            ? r.unsetFontSize().run()
            : r.setFontSize(n).run();
        };
      return (0, t.jsxs)("span", {
        className: "flex items-center",
        children: [
          (0, t.jsx)(np, {
            icon: tm.Minus,
            title: "Giảm cỡ chữ",
            disabled: r || n <= tA.FONT_SIZE_MIN,
            onClick: () => s(n - 1),
          }),
          (0, t.jsx)(tZ.ToolbarTooltip, {
            label: "Cỡ chữ (px)",
            children: (0, t.jsx)("input", {
              value: i,
              disabled: r,
              inputMode: "decimal",
              "aria-label": "Cỡ chữ",
              onChange: (e) => a(e.target.value.replace(/[^\d.]/g, "")),
              onBlur: () => a(String(n)),
              onKeyDown: (t) => {
                if ("Enter" === t.key) {
                  t.preventDefault();
                  let n = Number(i);
                  (Number.isFinite(n) && n > 0 && s(n), e.commands.focus());
                } else "Escape" === t.key && (a(String(n)), e.commands.focus());
              },
              className:
                "h-8 w-10 rounded-full border border-[#b9c4d4] bg-white/60 text-center text-[13px] text-neutral-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:opacity-40",
            }),
          }),
          (0, t.jsx)(np, {
            icon: S.Plus,
            title: "Tăng cỡ chữ",
            disabled: r || n >= tA.FONT_SIZE_MAX,
            onClick: () => s(n + 1),
          }),
        ],
      });
    }
    function nC({ editor: e, zoom: n, setZoom: r, onFitZoom: i, onPrint: a }) {
      let [s, l] = (0, E.useState)(null),
        o = (0, u.useEditorState)({
          editor: e,
          selector: ({ editor: e }) => {
            if (!e) return null;
            let t = nt.HEADING_STYLES.find(({ level: t }) =>
                e.isActive("heading", { level: t }),
              )?.level,
              n = e.getAttributes(t ? "heading" : "paragraph"),
              r = nt.NAMED_PARAGRAPH_STYLES.find(
                (e) => e.value === n.paragraphStyle,
              ),
              i = (0, tJ.selectedCellAttributes)(e.state);
            return {
              editable: e.isEditable,
              canUndo: e.can().undo(),
              canRedo: e.can().redo(),
              style: t ? `h${t}` : (r?.value ?? "p"),
              size:
                Number(e.getAttributes("fontSize").size) ||
                nt.HEADING_STYLES.find((e) => e.level === t)?.size ||
                r?.size ||
                eJ.BASE_FONT_PX,
              family: String(
                e.getAttributes("fontFamily").family ?? "Times New Roman",
              ),
              color: String(e.getAttributes("textColor").color ?? "#000000"),
              highlight: String(
                e.getAttributes("textHighlight").color ?? "#ffff00",
              ),
              bullet: e.isActive("bulletList"),
              ordered: e.isActive("orderedList"),
              bold: e.isActive("bold"),
              italic: e.isActive("italic"),
              underline: e.isActive("underline"),
              strike: e.isActive("strike"),
              superscript: e.isActive("superscript"),
              subscript: e.isActive("subscript"),
              boxed: e.isActive("boxed"),
              align:
                ["left", "center", "right"].find((t) =>
                  e.isActive({ textAlign: t }),
                ) ?? "justify",
              lineHeight: n.lineHeight ?? null,
              inTable: e.isActive("table"),
              borderColor: String(i.borderColor ?? "#000000"),
              borderWidth: Number(i.borderWidth ?? 1),
              borderStyle: String(i.borderStyle ?? "solid"),
              cellBackground: String(i.backgroundColor ?? "#ffffff"),
              verticalAlign: String(i.verticalAlign ?? "top"),
              docColumns: e.isActive("docColumns")
                ? Number(e.getAttributes("docColumns").columns) || 2
                : 1,
              inGrid: e.isActive("grid"),
              gridColumns: Number(e.getAttributes("grid").columns) || 2,
              gridAuto: (() => {
                let { $from: t } = e.state.selection;
                for (let e = t.depth; e > 0; e--)
                  if ("grid" === t.node(e).type.name)
                    return (0, eQ.automaticChoices)(t.node(e).toJSON());
                return !1;
              })(),
            };
          },
        });
      if (!e || !o)
        return (0, t.jsx)("div", {
          className: "mx-3 mb-2 h-12 rounded-full bg-[#f1f1ef]",
        });
      let c = () => e.chain().focus(),
        d = !o.editable,
        h = nw.find((e) => e.value === o.align) ?? nw[3],
        m = nk.find((e) => e.value === o.verticalAlign) ?? nk[0],
        p = () =>
          e.state.selection instanceof tT.CellSelection ? "selection" : "table",
        [x, g, f, b, y, w, v, j, k, N, C] = [
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(np, {
                icon: tC.Undo2,
                title: "Hoàn tác (Ctrl+Z)",
                disabled: d || !o.canUndo,
                onClick: () => c().undo().run(),
              }),
              (0, t.jsx)(np, {
                icon: tx.Redo2,
                title: "Làm lại (Ctrl+Y)",
                disabled: d || !o.canRedo,
                onClick: () => c().redo().run(),
              }),
              (0, t.jsx)(np, {
                icon: tp.Printer,
                title: "In (Ctrl+P)",
                onClick: a,
              }),
              (0, t.jsxs)(nx, {
                label: `${Math.round(100 * n)}%`,
                title: "Thu phóng",
                width: "w-20",
                children: [
                  i &&
                    (0, t.jsx)(ng, { onSelect: i, children: "Vừa màn hình" }),
                  ni.map((e) =>
                    (0, t.jsxs)(
                      ng,
                      {
                        checked: 0.01 > Math.abs(n - e),
                        onSelect: () => r(e),
                        children: [Math.round(100 * e), "%"],
                      },
                      e,
                    ),
                  ),
                ],
              }),
            ],
          }),
          (0, t.jsx)(t.Fragment, {
            children: (0, t.jsx)(nr, {
              editor: e,
              value: o.style,
              disabled: d,
            }),
          }),
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(nx, {
                label: o.family,
                title: "Phông chữ",
                width: "w-[140px]",
                disabled: d,
                children: tA.FONT_FAMILIES.map((e) =>
                  (0, t.jsx)(
                    ng,
                    {
                      checked: o.family === e,
                      onSelect: () =>
                        "Times New Roman" === e
                          ? c().unsetMark("fontFamily").run()
                          : c().setMark("fontFamily", { family: e }).run(),
                      children: (0, t.jsx)("span", {
                        style: { fontFamily: e },
                        children: e,
                      }),
                    },
                    e,
                  ),
                ),
              }),
              (0, t.jsx)(nN, { editor: e, size: o.size, disabled: d }, o.size),
            ],
          }),
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(np, {
                icon: ti.Bold,
                title: "Đậm (Ctrl+B)",
                active: o.bold,
                disabled: d,
                onClick: () => c().toggleBold().run(),
              }),
              (0, t.jsx)(np, {
                icon: th.Italic,
                title: "Nghiêng (Ctrl+I)",
                active: o.italic,
                disabled: d,
                onClick: () => c().toggleItalic().run(),
              }),
              (0, t.jsx)(np, {
                icon: tN.Underline,
                title: "Gạch chân (Ctrl+U)",
                active: o.underline,
                disabled: d,
                onClick: () => c().toggleUnderline().run(),
              }),
            ],
          }),
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(np, {
                icon: tw.Strikethrough,
                title: "Gạch ngang",
                active: o.strike,
                disabled: d,
                onClick: () => c().toggleStrike().run(),
              }),
              (0, t.jsx)(np, {
                icon: tj.Superscript,
                title: "Chỉ số trên",
                active: o.superscript,
                disabled: d,
                onClick: () => c().toggleSuperscript().run(),
              }),
              (0, t.jsx)(np, {
                icon: tv.Subscript,
                title: "Chỉ số dưới",
                active: o.subscript,
                disabled: d,
                onClick: () => c().toggleSubscript().run(),
              }),
              (0, t.jsx)(np, {
                icon: ty,
                title: "Chữ đóng khung (Đề chính thức, mã đề)",
                active: o.boxed,
                disabled: d,
                onClick: () => c().toggleBoxed().run(),
              }),
              o.boxed &&
                (0, t.jsx)(np, {
                  icon: te.Settings2,
                  title: "Chỉnh khoảng đệm khung",
                  disabled: d,
                  onClick: () => l("boxed"),
                }),
            ],
          }),
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(np, {
                icon: tf.Sigma,
                title: "Chèn công thức toán",
                disabled: d,
                onClick: () =>
                  c()
                    .insertContent({
                      type: "math",
                      attrs: {
                        latex: encodeURIComponent("x^2"),
                        display: !1,
                        fresh: !0,
                      },
                    })
                    .run(),
              }),
              (0, t.jsx)(np, {
                icon: to.FlaskConical,
                title: "Chèn công thức hoá học",
                disabled: d,
                onClick: () =>
                  c()
                    .insertContent({
                      type: "math",
                      attrs: {
                        latex: encodeURIComponent("\\ce{2H2 + O2 -> 2H2O}"),
                        display: !1,
                        fresh: !0,
                      },
                    })
                    .run(),
              }),
            ],
          }),
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(nx, {
                label: (0, t.jsx)(ts.Columns3, {
                  "aria-hidden": !0,
                  className: "size-[18px]",
                }),
                title: "Cột văn bản",
                disabled: d,
                children: (0, t.jsx)(tU, {
                  menu: "dropdown",
                  current: o.docColumns,
                  disabled: d,
                  onSelect: (t) => (0, tJ.applyDocumentColumns)(e, t),
                  onMore: () => l("columns"),
                }),
              }),
              (0, t.jsx)(np, {
                icon: te.Settings2,
                title: "Định dạng đoạn văn",
                disabled: d,
                onClick: () => l("paragraph"),
              }),
            ],
          }),
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(nb, {
                title: "Màu chữ",
                value: o.color,
                icon: e3.Baseline,
                disabled: d,
                onChange: (e) =>
                  e
                    ? c().setMark("textColor", { color: e }).run()
                    : c().unsetMark("textColor").run(),
              }),
              (0, t.jsx)(nb, {
                title: "Màu nền chữ",
                value: o.highlight,
                icon: e4.Highlighter,
                disabled: d,
                onChange: (e) =>
                  e
                    ? c().setMark("textHighlight", { color: e }).run()
                    : c().unsetMark("textHighlight").run(),
              }),
              o.inTable &&
                (0, t.jsxs)(t.Fragment, {
                  children: [
                    (0, t.jsx)(nb, {
                      title: "Màu nền ô",
                      value: o.cellBackground,
                      icon: e7.PaintBucket,
                      disabled: d,
                      onChange: (t) =>
                        (0, tJ.applyTableAppearance)(
                          e,
                          { backgroundColor: t },
                          "selection",
                        ),
                    }),
                    (0, t.jsx)(nb, {
                      title: "Màu viền bảng",
                      value: o.borderColor,
                      icon: tb.Square,
                      disabled: d,
                      onChange: (t) =>
                        (0, tJ.applyTableAppearance)(
                          e,
                          { borderColor: t },
                          p(),
                        ),
                    }),
                    (0, t.jsx)(nx, {
                      label: (0, t.jsx)(e5.Equal, {
                        "aria-hidden": !0,
                        className: "size-[18px]",
                      }),
                      title: "Độ dày viền bảng",
                      disabled: d,
                      children: nv.map((n) =>
                        (0, t.jsx)(
                          ng,
                          {
                            checked: o.borderWidth === n,
                            onSelect: () =>
                              (0, tJ.applyTableAppearance)(
                                e,
                                {
                                  borderWidth: n,
                                  ...(n > 0 && "none" === o.borderStyle
                                    ? { borderStyle: "solid" }
                                    : {}),
                                },
                                p(),
                              ),
                            children: 0 === n ? "Không viền" : `${n} px`,
                          },
                          n,
                        ),
                      ),
                    }),
                    (0, t.jsx)(nx, {
                      label: (0, t.jsx)(ty, {
                        "aria-hidden": !0,
                        className: "size-[18px]",
                      }),
                      title: "Kiểu viền bảng",
                      disabled: d,
                      children: nj.map(([n, r]) =>
                        (0, t.jsx)(
                          ng,
                          {
                            checked: o.borderStyle === n,
                            onSelect: () =>
                              (0, tJ.applyTableAppearance)(
                                e,
                                { borderStyle: n },
                                p(),
                              ),
                            children: (0, t.jsxs)("span", {
                              className: "flex items-center gap-2",
                              children: [
                                (0, t.jsx)("span", {
                                  "aria-hidden": !0,
                                  className:
                                    "w-8 border-t-2 border-neutral-700",
                                  style: { borderTopStyle: n },
                                }),
                                r,
                              ],
                            }),
                          },
                          n,
                        ),
                      ),
                    }),
                    (0, t.jsx)(nx, {
                      label: (0, t.jsx)(m.Icon, {
                        "aria-hidden": !0,
                        className: "size-[18px]",
                      }),
                      title: `Căn dọc trong \xf4: ${m.label}`,
                      disabled: d,
                      children: nk.map((n) =>
                        (0, t.jsx)(
                          ng,
                          {
                            checked: m.value === n.value,
                            onSelect: () =>
                              (0, tJ.applyTableAppearance)(
                                e,
                                { verticalAlign: n.value },
                                "selection",
                              ),
                            children: n.label,
                          },
                          n.value,
                        ),
                      ),
                    }),
                  ],
                }),
            ],
          }),
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(nx, {
                label: (0, t.jsx)(h.Icon, {
                  "aria-hidden": !0,
                  className: "size-[18px]",
                }),
                title: `Căn lề: ${h.label}`,
                disabled: d,
                contentClassName: "min-w-0 p-1.5",
                children: (0, t.jsx)(eY.DropdownMenu.RadioGroup, {
                  value: o.align,
                  onValueChange: (e) =>
                    "justify" === e
                      ? c().unsetTextAlign().run()
                      : c().setTextAlign(e).run(),
                  className: "flex items-center gap-1",
                  onKeyDown: (e) => {
                    if ("ArrowLeft" !== e.key && "ArrowRight" !== e.key) return;
                    let t = Array.from(
                        e.currentTarget.querySelectorAll(
                          '[role="menuitemradio"]',
                        ),
                      ),
                      n = t.indexOf(document.activeElement);
                    n < 0 ||
                      (e.preventDefault(),
                      t[
                        (n + ("ArrowRight" === e.key ? 1 : t.length - 1)) %
                          t.length
                      ]?.focus());
                  },
                  children: nw.map(({ value: e, Icon: n, label: r }) =>
                    (0, t.jsx)(
                      tZ.ToolbarTooltip,
                      {
                        label: r,
                        children: (0, t.jsx)(eY.DropdownMenu.RadioItem, {
                          value: e,
                          "aria-label": r,
                          className:
                            "flex size-9 cursor-pointer items-center justify-center rounded-md text-neutral-700 outline-none data-[highlighted]:bg-neutral-100 data-[state=checked]:bg-[#d3e5ef] data-[state=checked]:text-[#2383e2] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2383e2]/40",
                          children: (0, t.jsx)(n, {
                            "aria-hidden": !0,
                            className: "size-5",
                          }),
                        }),
                      },
                      e,
                    ),
                  ),
                }),
              }),
              (0, t.jsxs)(nx, {
                label: (0, t.jsx)(tB, {
                  "aria-hidden": !0,
                  className: "size-[18px]",
                }),
                title: "Giãn dòng",
                disabled: d,
                children: [
                  ny.map((e) =>
                    (0, t.jsx)(
                      ng,
                      {
                        checked: o.lineHeight === e,
                        onSelect: () => c().setLineHeight(e).run(),
                        children:
                          null === e ? "Mặc định" : String(e).replace(".", ","),
                      },
                      String(e),
                    ),
                  ),
                  (0, t.jsx)(eY.DropdownMenu.Separator, {
                    className: "my-1.5 h-px bg-neutral-200",
                  }),
                  (0, t.jsx)(ng, {
                    onSelect: () => c().setSpaceBefore(8).run(),
                    children: "Thêm khoảng trước đoạn",
                  }),
                  (0, t.jsx)(ng, {
                    onSelect: () => c().setSpaceAfter(8).run(),
                    children: "Thêm khoảng sau đoạn",
                  }),
                  (0, t.jsx)(ng, {
                    onSelect: () =>
                      c().setSpaceBefore(null).setSpaceAfter(null).run(),
                    children: "Bỏ khoảng cách đoạn",
                  }),
                ],
              }),
            ],
          }),
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(np, {
                icon: e8.List,
                title: "Danh sách dấu đầu dòng",
                active: o.bullet,
                disabled: d,
                onClick: () => c().toggleBulletList().run(),
              }),
              (0, t.jsx)(np, {
                icon: e6.ListOrdered,
                title: "Danh sách đánh số",
                active: o.ordered,
                disabled: d,
                onClick: () => c().toggleOrderedList().run(),
              }),
              (0, t.jsx)(np, {
                icon: td.IndentDecrease,
                title: "Giảm thụt lề",
                disabled: d,
                onClick: () => c().changeIndent(-1).run(),
              }),
              (0, t.jsx)(np, {
                icon: tu.IndentIncrease,
                title: "Tăng thụt lề",
                disabled: d,
                onClick: () => c().changeIndent(1).run(),
              }),
            ],
          }),
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(np, {
                icon: e9.Link,
                title: "Chèn liên kết",
                disabled: d,
                onClick: () => l("link"),
              }),
              (0, t.jsx)(nx, {
                label: (0, t.jsx)(tk.Table, {
                  "aria-hidden": !0,
                  className: "size-[18px]",
                }),
                title: "Chèn bảng",
                disabled: d,
                children: (0, t.jsx)(tV, {
                  menu: "dropdown",
                  disabled: d,
                  onSelect: (e, t) =>
                    c()
                      .insertTable({ rows: e, cols: t, withHeaderRow: !1 })
                      .run(),
                  onMore: () => l("insertTable"),
                }),
              }),
              (0, t.jsx)(np, {
                icon: tc.Image,
                title: "Chèn hình",
                disabled: d,
                onClick: () =>
                  c()
                    .insertContent({
                      type: "examImage",
                      attrs: { src: "", alt: "", width: 220, align: "center" },
                    })
                    .run(),
              }),
              (0, t.jsx)(np, {
                icon: tl.BetweenHorizontalStart,
                title: "Ngắt trang (Ctrl+Enter)",
                disabled: d,
                onClick: () => c().setPageBreak().run(),
              }),
            ],
          }),
        ],
        T = [
          x,
          g,
          f,
          b,
          w,
          j,
          k,
          N,
          C,
          v,
          y,
          (0, t.jsx)(
            np,
            {
              icon: tg.RemoveFormatting,
              title: "Xoá định dạng",
              disabled: d,
              onClick: () =>
                c()
                  .unsetAllMarks()
                  .clearParagraphFormat()
                  .unsetTextAlign()
                  .run(),
            },
            "clear-format",
          ),
        ];
      return (
        o.inGrid &&
          T.push(
            (0, t.jsxs)(t.Fragment, {
              children: [
                (0, t.jsx)(ts.Columns3, {
                  "aria-hidden": !0,
                  className: "mx-1 size-4 text-neutral-500",
                }),
                (0, t.jsxs)(nx, {
                  label: o.gridAuto
                    ? "Tự động xếp đáp án"
                    : `${o.gridColumns} \xf4 / h\xe0ng`,
                  title: "Số ô một hàng",
                  disabled: d,
                  children: [
                    (0, t.jsx)(ng, {
                      checked: o.gridAuto,
                      onSelect: () => c().setGridAuto().run(),
                      children: "Tự động theo độ rộng",
                    }),
                    [1, 2, 3, 4].map((e) =>
                      (0, t.jsxs)(
                        ng,
                        {
                          checked: !o.gridAuto && o.gridColumns === e,
                          onSelect: () => c().setGridColumns(e).run(),
                          children: [e, " ô / hàng"],
                        },
                        e,
                      ),
                    ),
                  ],
                }),
                (0, t.jsx)(np, {
                  icon: S.Plus,
                  title: "Thêm ô (Tab ở ô cuối)",
                  disabled: d,
                  onClick: () => c().addGridCell().run(),
                  children: "Ô",
                }),
                (0, t.jsx)(np, {
                  icon: tm.Minus,
                  title: "Xoá ô đang đứng",
                  disabled: d,
                  onClick: () => c().removeGridCell().run(),
                  children: "Ô",
                }),
              ],
            }),
          ),
        (0, t.jsxs)(nm.TooltipProvider, {
          delayDuration: 100,
          skipDelayDuration: 300,
          disableHoverableContent: !0,
          children: [
            (0, t.jsx)(tS.FormatDialog, {
              editor: e,
              kind: s,
              onClose: () => l(null),
            }),
            (0, t.jsx)(t2, { segments: T }),
          ],
        })
      );
    }
    var nT = m456539,
      nS = m552131;
    function nA({ editor: e, open: n, replaceMode: r, onClose: i }) {
      let [a, s] = (0, E.useState)(""),
        [l, o] = (0, E.useState)(""),
        [c, d] = (0, E.useState)(!1),
        [u, h] = (0, E.useState)(null),
        x = u ?? r,
        g = () => {
          (h(null), i());
        },
        [, f] = (0, E.useReducer)((e) => e + 1, 0),
        b = (0, E.useRef)(null),
        y = (0, E.useRef)(null);
      ((0, E.useEffect)(() => {
        if (!n) return;
        let t = (t) => {
          let n = document.activeElement;
          "Escape" === t.key &&
            !t.defaultPrevented &&
            (!n || n === document.body || y.current?.contains(n)) &&
            (h(null), i(), e?.commands.focus());
        };
        return (
          document.addEventListener("keydown", t),
          () => document.removeEventListener("keydown", t)
        );
      }, [n, e, i]),
        (0, E.useEffect)(() => {
          n &&
            requestAnimationFrame(() => {
              (b.current?.focus(), b.current?.select());
            });
        }, [n]),
        (0, E.useEffect)(() => {
          if (e)
            return (
              e.on("transaction", f),
              () => {
                e.off("transaction", f);
              }
            );
        }, [e]),
        (0, E.useEffect)(() => {
          if (!e) return;
          let t = requestAnimationFrame(() => {
            n ? e.commands.setSearch(a, c) : e.commands.clearSearch();
          });
          return () => cancelAnimationFrame(t);
        }, [e, n, a, c]));
      let w = e ? nS.searchKey.getState(e.state) : void 0,
        v = w?.matches.length ?? 0,
        j = !!e?.isEditable;
      return (0, t.jsx)(m.AnimatePresence, {
        children:
          n &&
          (0, t.jsxs)(p.motion.div, {
            ref: y,
            initial: { opacity: 0, y: -12, scale: 0.98 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: -8, scale: 0.98 },
            transition: { duration: 0.16, ease: [0.2, 0, 0, 1] },
            className:
              "no-print absolute right-2 top-2 z-30 w-80 max-w-[calc(100%-1rem)] rounded-xl border border-neutral-200 bg-white p-2.5 text-[13px] shadow-lg sm:right-6",
            onKeyDown: (t) => {
              "Escape" === t.key &&
                (t.stopPropagation(), g(), e?.commands.focus());
            },
            children: [
              (0, t.jsxs)("div", {
                className: "flex items-center gap-1",
                children: [
                  (0, t.jsx)("input", {
                    ref: b,
                    value: a,
                    onChange: (e) => s(e.target.value),
                    onKeyDown: (t) => {
                      "Enter" === t.key &&
                        (t.preventDefault(),
                        e?.commands.stepSearch(t.shiftKey ? -1 : 1));
                    },
                    placeholder: "Tìm trong đề",
                    className:
                      "min-w-0 flex-1 rounded-md border border-neutral-300 px-2 py-1 outline-none focus:border-blue-600",
                  }),
                  (0, t.jsx)("span", {
                    className:
                      "w-14 shrink-0 text-center text-xs text-neutral-500",
                    children: a ? (v ? `${w.current + 1}/${v}` : "0/0") : "",
                  }),
                  (0, t.jsx)("button", {
                    type: "button",
                    title: "Kết quả trước (Shift+Enter)",
                    disabled: !v,
                    onClick: () => e?.commands.stepSearch(-1),
                    className:
                      "rounded p-1 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30",
                    children: (0, t.jsx)(nT.ChevronUp, { className: "size-4" }),
                  }),
                  (0, t.jsx)("button", {
                    type: "button",
                    title: "Kết quả sau (Enter)",
                    disabled: !v,
                    onClick: () => e?.commands.stepSearch(1),
                    className:
                      "rounded p-1 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30",
                    children: (0, t.jsx)(ta.ChevronDown, {
                      className: "size-4",
                    }),
                  }),
                  (0, t.jsx)("button", {
                    type: "button",
                    title: "Đóng (Esc)",
                    onClick: g,
                    className:
                      "rounded p-1 text-neutral-600 hover:bg-neutral-100",
                    children: (0, t.jsx)(K.X, { className: "size-4" }),
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className:
                  "mt-1.5 flex items-center justify-between text-xs text-neutral-600",
                children: [
                  (0, t.jsxs)("label", {
                    className: "flex items-center gap-1.5",
                    children: [
                      (0, t.jsx)("input", {
                        type: "checkbox",
                        checked: c,
                        onChange: (e) => d(e.target.checked),
                      }),
                      "Phân biệt hoa thường",
                    ],
                  }),
                  j &&
                    (0, t.jsx)("button", {
                      type: "button",
                      onClick: () => h(!x),
                      className: "text-blue-700 hover:underline",
                      children: x ? "Ẩn thay thế" : "Thay thế",
                    }),
                ],
              }),
              x &&
                j &&
                (0, t.jsxs)("div", {
                  className: "mt-2 space-y-1.5",
                  children: [
                    (0, t.jsx)("input", {
                      value: l,
                      onChange: (e) => o(e.target.value),
                      placeholder: "Thay bằng",
                      className:
                        "w-full rounded-md border border-neutral-300 px-2 py-1 outline-none focus:border-blue-600",
                    }),
                    (0, t.jsxs)("div", {
                      className: "flex justify-end gap-1.5",
                      children: [
                        (0, t.jsx)("button", {
                          type: "button",
                          disabled: !v,
                          onClick: () => e?.commands.replaceCurrent(l),
                          className:
                            "rounded-full border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-100 disabled:opacity-40",
                          children: "Thay",
                        }),
                        (0, t.jsx)("button", {
                          type: "button",
                          disabled: !v,
                          onClick: () => e?.commands.replaceAll(l),
                          className:
                            "rounded-full bg-[#37352f] px-3 py-1 text-xs text-white hover:bg-[#1f1e1b] disabled:opacity-40",
                          children: "Thay tất cả",
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          }),
      });
    }
    var nE = m926787,
      nM = m590582,
      n$ = m973134,
      nD = m781947,
      nI = m167881,
      nL = m630374,
      nR = m23750,
      nz = m939717;
    async function n_(e) {
      
      let n,
        r,
        i = new N.default();
      for (let [a, s] of Object.entries(
        ((t = e),
        (n = []),
        (r = (0, nz.excelRows)(t)
          .map(
            (e, t) =>
              `<row r="${t + 1}">${e
                .map((e, r) => {
                  var i;
                  let a;
                  return e
                    ? ((i = `${(function (e) {
                        let t = "";
                        for (let n = e + 1; n > 0; n = Math.floor((n - 1) / 26))
                          t = String.fromCharCode(65 + ((n - 1) % 26)) + t;
                        return t;
                      })(r)}${t + 1}`),
                      `<c r="${i}" ${/^(0|-?[1-9]\d*)$/.test(e) ? `><v>${e}</v>` : ((a = n.indexOf(e)) < 0 && (a = n.push(e) - 1), `t="s"><v>${a}</v>`)}</c>`)
                    : "";
                })
                .join("")
