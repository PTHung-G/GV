(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  325919,
  181826,
  (t) => {
    "use strict";
    var e = t.i(376287),
      i = t.i(575117),
      n = t.i(736958);
    let a = {
        "Học tập": [
          "book-open",
          "notebook-pen",
          "graduation-cap",
          "school",
          "pencil",
          "pen-tool",
          "ruler",
          "backpack",
          "library",
          "presentation",
          "clipboard-list",
          "file-text",
          "bookmark",
          "lightbulb",
          "brain",
          "puzzle",
        ],
        "Toán & khoa học": [
          "calculator",
          "sigma",
          "pi",
          "percent",
          "divide",
          "plus",
          "minus",
          "x",
          "equal",
          "infinity",
          "atom",
          "flask-conical",
          "microscope",
          "dna",
          "magnet",
          "zap",
          "thermometer",
          "triangle-right",
        ],
        "Thiên nhiên": [
          "leaf",
          "tree-pine",
          "flower-2",
          "sun",
          "moon",
          "cloud",
          "cloud-rain",
          "snowflake",
          "droplet",
          "flame",
          "mountain",
          "waves",
          "globe",
          "earth",
          "sprout",
          "bug",
          "bird",
          "fish",
          "dog",
          "cat",
          "apple",
        ],
        "Đời sống": [
          "house",
          "building-2",
          "landmark",
          "car",
          "bus",
          "bike",
          "plane",
          "rocket",
          "map",
          "map-pin",
          "compass",
          "flag",
          "music",
          "palette",
          "camera",
          "gift",
          "heart",
          "shopping-cart",
          "coins",
          "clock",
          "calendar",
        ],
        "Người & giao tiếp": [
          "user",
          "users",
          "smile",
          "hand",
          "thumbs-up",
          "message-circle",
          "messages-square",
          "mic",
          "megaphone",
          "eye",
          "ear",
        ],
        "Công nghệ": [
          "monitor",
          "laptop",
          "smartphone",
          "code",
          "database",
          "cpu",
          "wifi",
          "bot",
        ],
        "Ký hiệu": [
          "star",
          "sparkles",
          "trophy",
          "medal",
          "target",
          "check",
          "circle-check",
          "circle-x",
          "circle-help",
          "circle-alert",
          "info",
          "arrow-right",
          "arrow-left",
          "arrow-up",
          "arrow-down",
          "move-right",
          "chevron-right",
          "repeat",
          "refresh-cw",
          "search",
          "lock",
          "key",
          "link",
          "timer",
          "hourglass",
        ],
      },
      r = new Set(Object.values(a).flat());
    function h(t) {
      return "string" == typeof t && r.has(t);
    }
    t.s(["ICON_GROUPS", 0, a, "isIconName", 0, h], 181826);
    var l = t.i(143078);
    let o = [
        {
          id: "title",
          name: "Tiêu đề",
          description:
            "Slide bìa: title (tên bài) + subtitle (lớp, môn, giáo viên) + kicker; graphic (đồ hoạ môn học) làm bìa có hình. Mặc định nền màu nhấn.",
        },
        {
          id: "section",
          name: "Chương mục",
          description:
            'Mở một phần mới: title + subtitle ngắn + kicker ("02" hiện thành số lớn); graphic tuỳ chọn. Mặc định nền màu nhấn.',
        },
        {
          id: "agenda",
          name: "Mục lục",
          description:
            'Tiến trình bài hoặc các phần của một chủ đề: kicker + title ở nửa màu bên trái, items (3–6 mục "Tên phần: mô tả ngắn") đánh số lớn bên phải.',
        },
        {
          id: "bullets",
          name: "Gạch đầu dòng",
          description:
            "title + bullets (3–6 ý); thêm graphic (đồ hoạ có sẵn) hoặc imagePrompt để có hình bên phải.",
        },
        {
          id: "cards",
          name: "Thẻ ý",
          description:
            '2–6 ý song song (đặc điểm, vai trò, khái niệm, mục tiêu) thành lưới thẻ có biểu tượng: title + items (mỗi ý "Tiêu đề ngắn: mô tả ≤ 14 từ") + icons (tên biểu tượng cho từng thẻ, theo thứ tự).',
        },
        {
          id: "split",
          name: "Nửa trang màu",
          description:
            "Một nhận định/khái niệm lớn: kicker + title + subtitle ở nửa trái nền màu, bullets hoặc body giải thích ở nửa phải; graphic tuỳ chọn (nằm trong nửa màu).",
        },
        {
          id: "two-column",
          name: "Hai cột",
          description:
            "So sánh/đối chiếu: title + leftTitle/leftBullets + rightTitle/rightBullets.",
        },
        {
          id: "venn",
          name: "Giao nhau",
          description:
            "So sánh có điểm chung: title + leftTitle/leftBullets (riêng A) + rightTitle/rightBullets (riêng B) + bullets (điểm chung, ở giữa); mỗi phần ≤ 4 ý ngắn.",
        },
        {
          id: "table",
          name: "Bảng",
          description:
            'Đối chiếu nhiều tiêu chí: title + items (mỗi mục một hàng, các ô cách nhau bằng "|", hàng đầu là tiêu đề cột; ≤ 6 cột, ≤ 8 hàng) + body (ghi chú).',
        },
        {
          id: "image-left",
          name: "Ảnh trái",
          description:
            "Hình minh hoạ lớn bên trái: graphic hoặc imagePrompt + title + bullets hoặc body.",
        },
        {
          id: "image-right",
          name: "Ảnh phải",
          description:
            "Hình minh hoạ lớn bên phải: graphic hoặc imagePrompt + title + bullets hoặc body.",
        },
        {
          id: "image-full",
          name: "Ảnh tràn",
          description:
            "Ảnh phủ kín slide gây ấn tượng: imagePrompt + title + caption.",
        },
        {
          id: "quote",
          name: "Trích dẫn",
          description: "Câu nói/định nghĩa nổi bật: quote + author.",
        },
        {
          id: "big-number",
          name: "Con số lớn",
          description:
            "Một số liệu ấn tượng: title + statValue + statLabel + body.",
        },
        {
          id: "stats",
          name: "Bộ số liệu",
          description:
            '2–4 con số cạnh nhau: title + items (mỗi mục "Số: ý nghĩa", vd "70%: bề mặt Trái Đất là nước") + body (nguồn số liệu).',
        },
        {
          id: "timeline",
          name: "Các bước",
          description:
            "Quy trình/dòng thời gian: title + steps (3–6 bước ngắn).",
        },
        {
          id: "cycle",
          name: "Vòng tuần hoàn",
          description:
            "Chu trình lặp lại (vòng tuần hoàn nước, vòng đời, chu trình carbon): title + steps (3–6 giai đoạn ngắn, theo chiều kim đồng hồ) + subtitle (chữ ở tâm vòng, tuỳ chọn).",
        },
        {
          id: "pyramid",
          name: "Kim tự tháp",
          description:
            'Thứ bậc từ hẹp đến rộng (tháp dinh dưỡng, cấp tổ chức sống, tháp nhu cầu): title + items (3–5 tầng từ đỉnh xuống đáy, "Tầng: giải thích").',
        },
        {
          id: "mindmap",
          name: "Sơ đồ tư duy",
          description:
            'Một chủ đề toả 3–6 nhánh: title (chủ đề, nằm ở tâm — không có tiêu đề trên cùng) + items ("Nhánh: chi tiết") + icons; kicker tuỳ chọn.',
        },
        {
          id: "example",
          name: "Ví dụ mẫu",
          description:
            "Bài giải mẫu: title + question (đề bài, thẻ bên trái) + steps (2–6 bước giải, hiện lần lượt khi bấm) + answer (kết quả, hiện sau cùng); graphic tuỳ chọn dưới đề.",
        },
        {
          id: "quiz",
          name: "Câu hỏi",
          description:
            'Câu hỏi trắc nghiệm có ô phương án màu: title + question + items (2–4 phương án, không ghi A./B.) + answer (chữ cái đúng, vd "B") + body (giải thích ngắn). Đáp án tự hiện khi bấm.',
        },
        {
          id: "discussion",
          name: "Thảo luận",
          description:
            "Câu hỏi mở, thảo luận nhóm, tình huống: kicker + question (trong bóng thoại lớn) + items (≤ 3 gợi ý ngắn); graphic tuỳ chọn. Mặc định nền nhạt.",
        },
        {
          id: "formula",
          name: "Công thức",
          description:
            "Công thức trọng tâm: title + formula (LaTeX, không có $) + bullets giải thích ký hiệu.",
        },
        {
          id: "chart",
          name: "Biểu đồ",
          description:
            "Số liệu trực quan: title + chartType + labels + values (+ seriesName) + bullets nhận xét.",
        },
        {
          id: "closing",
          name: "Tổng kết",
          description:
            "Kết bài: title + bullets các ý cần nhớ hoặc câu hỏi củng cố.",
        },
        {
          id: "blank",
          name: "Trống",
          description:
            "Slide trống để tự đặt phần tử bằng addText/addShape/addImage…",
        },
      ],
      c = o.map((t) => t.id),
      d = ["theme", "soft", "accent"],
      s = new Set(["title", "section", "big-number", "quote"]),
      g = {
        title: "accent",
        section: "accent",
        "big-number": "soft",
        quote: "soft",
        closing: "soft",
        quiz: "soft",
        discussion: "soft",
      },
      u = "mindmap-image",
      m = (t) => (t ?? []).map((t) => t.trim()).filter(Boolean),
      p = (...t) => m(t.find((t) => m(t).length > 0)),
      f = (t) => Math.round(10 * t) / 10,
      b = (t, e, i) => Math.min(Math.max(t, e), i);
    function S(t, e = 28) {
      return t <= 3 ? e + 4 : 4 === t ? e + 2 : 5 === t ? e : e - 2;
    }
    function x(t, e, i, n = 1.4, a = 0.35) {
      let r = Math.max(8, Math.floor(e / (0.52 * i)));
      return (
        t.reduce(
          (t, e) =>
            t +
            Math.max(
              1,
              Math.ceil(
                e.replace(/\$[^$]*\$/g, "xxxx").replace(/\*\*/g, "").length / r,
              ),
            ),
          0,
        ) *
          i *
          n +
        Math.max(0, t.length - 1) * i * a
      );
    }
    let I = new Set([
        "agenda",
        "split",
        "stats",
        "table",
        "cycle",
        "pyramid",
        "venn",
        "mindmap",
      ]),
      M = new Set(["quiz", "example", "discussion"]),
      $ = { agenda: 440, split: 520 };
    function y(t, e, n) {
      return (0, i.createShape)(
        { id: (0, i.uniqueElementId)(t, "callout"), ...e },
        "round-rect",
        {
          fill: "@surface",
          stroke: "@accent",
          strokeWidth: 3,
          text: n,
          style: { fontSize: 24, color: "@text", lineHeight: 1.35 },
        },
      );
    }
    let A = (t) => t.replace(/^\s*[A-Da-d][.):]\s+/, "");
    function w(t) {
      let e = t.indexOf(":");
      return e > 0 && e <= 48 && !t.slice(0, e).includes("$")
        ? { label: t.slice(0, e).trim(), text: t.slice(e + 1).trim() }
        : { label: t.trim(), text: "" };
    }
    t.s(
      [
        "LAYOUTS",
        0,
        o,
        "LAYOUT_IDS",
        0,
        c,
        "MINDMAP_IMAGE_ID",
        0,
        u,
        "NATIVE_MINDMAP_PART",
        0,
        /^(center|branch-\d+(-card|-dot|-icon|-label)?|deco-link-\d+)$/,
        "SLIDE_TONES",
        0,
        d,
        "composeLayout",
        0,
        function (t, a, r) {
          var o;
          let c,
            d = r.callout?.trim() ?? "",
            s = (function (t, a, r) {
              let l = { ...t, elements: [] },
                o = [],
                c = (t) => {
                  let e = { ...t, id: (0, i.uniqueElementId)(l, t.id) };
                  return (l.elements.push(e), o.push(e), e);
                },
                d = r.title?.trim() ?? "",
                s = m(r.bullets),
                g = r.body?.trim() ?? "",
                M = (r.kicker ?? "").trim().slice(0, 48),
                y = r.callout?.trim() ?? "",
                E =
                  y && I.has(a)
                    ? e.SLIDE_HEIGHT - 40 - 104 - 16
                    : e.SLIDE_HEIGHT - e.SAFE_MARGIN,
                k = r.tone ?? "theme",
                T = "accent" === k,
                _ = T ? "@background" : "",
                H = T ? "@background" : "@muted",
                D = T ? "@background" : "@primary",
                L = "soft" === k ? "@background" : "@surface",
                G = (t, e = "left", n = D) =>
                  c(
                    (0, i.createText)({ id: "kicker", ...t }, M, {
                      fontSize: 20,
                      font: "heading",
                      bold: !0,
                      uppercase: !0,
                      letterSpacing: 0.12,
                      color: n,
                      align: e,
                      valign: "bottom",
                    }),
                  ),
                v = () => {
                  (M &&
                    G({
                      x: e.SAFE_MARGIN,
                      y: 28,
                      width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                      height: 32,
                    }),
                    (d || r.placeholders) &&
                      c(
                        (0, i.createText)(
                          {
                            id: "title",
                            ...(M
                              ? {
                                  x: e.SAFE_MARGIN,
                                  y: 64,
                                  width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                                  height: 100,
                                }
                              : {
                                  x: e.SAFE_MARGIN,
                                  y: 48,
                                  width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                                  height: 104,
                                }),
                          },
                          d,
                          {
                            fontSize: 44,
                            font: "heading",
                            bold: !0,
                            valign: "middle",
                            lineHeight: 1.15,
                            color: _,
                          },
                        ),
                      ));
                },
                N = (t, e, n = 28) => {
                  s.length > 0
                    ? c(
                        (0, i.createText)({ id: t, ...e }, s.join("\n"), {
                          fontSize: S(s.length, n),
                          list: "bullet",
                          lineHeight: 1.4,
                          color: _,
                        }),
                      )
                    : g
                      ? c(
                          (0, i.createText)({ id: t, ...e }, g, {
                            fontSize: n,
                            lineHeight: 1.45,
                            color: _,
                          }),
                        )
                      : r.placeholders &&
                        c(
                          (0, i.createText)({ id: t, ...e }, "", {
                            fontSize: n,
                            list: "bullet",
                            lineHeight: 1.4,
                            color: _,
                          }),
                        );
                },
                R = r.graphic?.trim() ?? "",
                F =
                  (0, n.isGraphicId)(R) &&
                  !r.imagePrompt?.trim() &&
                  !r.imageSrc?.trim(),
                W = F || !!(r.imagePrompt?.trim() || r.imageSrc?.trim()),
                z = (t, e) => {
                  let a = (0, n.graphicInfo)(R)?.ratio ?? 1,
                    r = t.width - 2 * e,
                    h = r / a;
                  (h > t.height - 2 * e && (r = (h = t.height - 2 * e) * a),
                    c(
                      (0, i.createGraphic)(
                        {
                          id: "image",
                          x: t.x + (t.width - r) / 2,
                          y: t.y + (t.height - h) / 2,
                          width: r,
                          height: h,
                        },
                        R,
                      ),
                    ));
                },
                C = (t, e = 24) => {
                  if (!F) return q(t, e);
                  (c(
                    (0, i.createShape)(
                      { id: "image-card", ...t },
                      e ? "round-rect" : "rect",
                      { fill: L },
                    ),
                  ),
                    z(t, e ? 36 : 56));
                },
                q = (t, e = 24) => {
                  let n = r.imagePrompt?.trim() || r.caption?.trim() || d;
                  c({
                    ...(0, i.createImage)(
                      { id: "image", ...t },
                      n,
                      r.imageSrc?.trim() ?? "",
                    ),
                    radius: e,
                  });
                },
                B = () => {
                  T &&
                    (c(
                      (0, i.createShape)(
                        {
                          id: "deco-circle",
                          x: e.SLIDE_WIDTH - 420,
                          y: -180,
                          width: 620,
                          height: 620,
                        },
                        "ellipse",
                        { fill: "@background", opacity: 0.1 },
                      ),
                    ),
                    c(
                      (0, i.createShape)(
                        {
                          id: "deco-circle-2",
                          x: -130,
                          y: e.SLIDE_HEIGHT - 230,
                          width: 320,
                          height: 320,
                        },
                        "ellipse",
                        { fill: "@background", opacity: 0.08 },
                      ),
                    ));
                },
                P = (t, n, a, h, l, s = T, g = e.SLIDE_HEIGHT) => {
                  let u = r.subtitle?.trim() ?? "",
                    m = s ? "@background" : _,
                    p = s ? "@background" : H,
                    f = s ? "@background" : D,
                    b = [];
                  if (
                    (M && l
                      ? b.push({
                          height: 132,
                          make: (e, r) =>
                            c(
                              (0, i.createText)(
                                {
                                  id: "kicker",
                                  x: t,
                                  y: e,
                                  width: n,
                                  height: r,
                                },
                                M,
                                {
                                  fontSize: 120,
                                  font: "heading",
                                  bold: !0,
                                  color: f,
                                  align: a,
                                  valign: "bottom",
                                  lineHeight: 1,
                                },
                              ),
                            ),
                        })
                      : M &&
                        b.push({
                          height: 32,
                          make: (e, i) =>
                            G({ x: t, y: e, width: n, height: i }, a, f),
                        }),
                    d || r.placeholders)
                  ) {
                    let e = Math.min(
                      320,
                      Math.round(x([d || "Tiêu đề"], 0.85 * n, h, 1.12) + 12),
                    );
                    b.push({
                      height: e,
                      make: (e, r) =>
                        c(
                          (0, i.createText)(
                            { id: "title", x: t, y: e, width: n, height: r },
                            d,
                            {
                              fontSize: h,
                              font: "heading",
                              bold: !0,
                              align: a,
                              valign: "middle",
                              lineHeight: 1.12,
                              color: m,
                            },
                          ),
                        ),
                    });
                  }
                  if (u || r.placeholders) {
                    let e = Math.min(
                      140,
                      Math.round(x([u || "Phụ đề"], n, 28, 1.35) + 12),
                    );
                    b.push({
                      height: e,
                      make: (e, r) =>
                        c(
                          (0, i.createText)(
                            { id: "subtitle", x: t, y: e, width: n, height: r },
                            u,
                            {
                              fontSize: 28,
                              align: a,
                              color: p,
                              lineHeight: 1.35,
                            },
                          ),
                        ),
                    });
                  }
                  let S =
                      b.reduce((t, e) => t + e.height, 0) +
                      20 * Math.max(0, b.length - 1),
                    I = Math.max(e.SAFE_MARGIN, Math.round((g - S) / 2));
                  for (let t of b) (t.make(I, t.height), (I += t.height + 20));
                  if (s) {
                    for (let t of o)
                      ("subtitle" !== t.id && ("kicker" !== t.id || l)) ||
                        (t.opacity = 0.85);
                    if (l)
                      for (let t of o) "kicker" === t.id && (t.opacity = 0.35);
                  }
                },
                O = () => {
                  (c(
                    (0, i.createShape)(
                      {
                        id: "image-card",
                        x: 790,
                        y: 150,
                        width: 420,
                        height: 420,
                      },
                      "ellipse",
                      {
                        fill: T ? "@background" : "@surface",
                        opacity: T ? 0.16 : 1,
                      },
                    ),
                  ),
                    z({ x: 830, y: 190, width: 340, height: 340 }, 20));
                },
                Z = (t, n, a = e.SLIDE_HEIGHT) => {
                  let h = !r.dark;
                  (c(
                    (0, i.createShape)(
                      {
                        id: "panel-card",
                        x: 0,
                        y: 0,
                        width: t,
                        height: e.SLIDE_HEIGHT,
                      },
                      "rect",
                      {
                        fill: h ? "@primary" : "@surface",
                        opacity: h ? 1 : 0.85,
                      },
                    ),
                  ),
                    h &&
                      c(
                        (0, i.createShape)(
                          {
                            id: "deco-panel-circle",
                            x: -120,
                            y: e.SLIDE_HEIGHT - 220,
                            width: 340,
                            height: 340,
                          },
                          "ellipse",
                          { fill: "@background", opacity: 0.1 },
                        ),
                      ),
                    P(
                      56,
                      t - 112,
                      "left",
                      n,
                      /^(\d{1,2}|[IVX]{1,4})$/.test(M),
                      h,
                      a,
                    ));
                };
              switch (a) {
                case "title":
                  (B(),
                    F
                      ? (O(), P(e.SAFE_MARGIN + 16, 690, "left", 60, !1))
                      : P(
                          e.SAFE_MARGIN + 40,
                          e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN - 80,
                          "center",
                          66,
                          !1,
                        ));
                  break;
                case "section": {
                  B();
                  let t = /^(\d{1,2}|[IVX]{1,4})$/.test(M);
                  (F && O(),
                    P(
                      e.SAFE_MARGIN + 40,
                      F ? 660 : e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN - 80,
                      "left",
                      60,
                      t,
                    ));
                  break;
                }
                case "bullets":
                  (v(),
                    N("bullets", {
                      x: e.SAFE_MARGIN,
                      y: 180,
                      width: W ? 660 : e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                      height: e.SLIDE_HEIGHT - 180 - e.SAFE_MARGIN,
                    }),
                    W &&
                      C({
                        x: 768,
                        y: 180,
                        width: e.SLIDE_WIDTH - 768 - e.SAFE_MARGIN,
                        height: e.SLIDE_HEIGHT - 180 - e.SAFE_MARGIN,
                      }));
                  break;
                case "cards": {
                  v();
                  let t = p(r.items, r.bullets).slice(0, 6);
                  if (!t.length) break;
                  let n = t.length,
                    a = n <= 3 ? n : 4 === n ? 2 : 3,
                    l = Math.ceil(n / a),
                    o = (e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN - 24 * (a - 1)) / a,
                    d = { top: 180, bottom: e.SLIDE_HEIGHT - e.SAFE_MARGIN },
                    s = l > 1,
                    g = t.map(w),
                    u = s ? 23 : 24,
                    m = Math.max(
                      ...g.map((t) => x([t.text || " "], o - 48, u, 1.35)),
                    ),
                    f = s
                      ? (d.bottom - d.top - 24) / 2
                      : Math.min(
                          d.bottom - d.top,
                          Math.max(
                            220,
                            Math.round(m + (g.some((t) => t.text) ? 196 : 150)),
                          ),
                        ),
                    b = s
                      ? d.top
                      : d.top + Math.round((d.bottom - d.top - f) / 2);
                  g.forEach((t, n) => {
                    let l = `item-${n + 1}`,
                      d = e.SAFE_MARGIN + (n % a) * (o + 24),
                      g = b + Math.floor(n / a) * (f + 24);
                    c(
                      (0, i.createShape)(
                        { id: `${l}-card`, x: d, y: g, width: o, height: f },
                        "round-rect",
                        { fill: L },
                      ),
                    );
                    let m = s ? 56 : 68,
                      p = r.icons?.[n]?.trim() ?? "";
                    h(p)
                      ? (c(
                          (0, i.createShape)(
                            {
                              id: `${l}-dot`,
                              x: d + 24,
                              y: g + 24,
                              width: m,
                              height: m,
                            },
                            "ellipse",
                            { fill: "@primary" },
                          ),
                        ),
                        c(
                          (0, i.createIcon)(
                            {
                              id: `${l}-icon`,
                              x: d + 24 + 0.24 * m,
                              y: g + 24 + 0.24 * m,
                              width: 0.52 * m,
                              height: 0.52 * m,
                            },
                            p,
                            "@background",
                          ),
                        ))
                      : c(
                          (0, i.createShape)(
                            {
                              id: `${l}-num`,
                              x: d + 24,
                              y: g + 24,
                              width: m,
                              height: m,
                            },
                            "ellipse",
                            {
                              fill: "@primary",
                              text: String(n + 1),
                              style: {
                                fontSize: 0.42 * m,
                                bold: !0,
                                color: "@background",
                                font: "heading",
                              },
                            },
                          ),
                        );
                    let S = s
                      ? {
                          x: d + 24 + m + 16,
                          y: g + 24,
                          width: o - 48 - m - 16,
                          height: m,
                        }
                      : {
                          x: d + 24,
                          y: g + 24 + m + 18,
                          width: o - 48,
                          height: t.text ? 48 : f - m - 66,
                        };
                    if (
                      (c(
                        (0, i.createText)({ id: `${l}-label`, ...S }, t.label, {
                          fontSize: s ? 26 : 28,
                          font: "heading",
                          bold: !0,
                          valign: s ? "middle" : "top",
                          lineHeight: 1.2,
                        }),
                      ),
                      t.text)
                    ) {
                      let e = s ? g + 24 + m + 14 : S.y + S.height + 10;
                      c(
                        (0, i.createText)(
                          {
                            id: l,
                            x: d + 24,
                            y: e,
                            width: o - 48,
                            height: g + f - 24 - e,
                          },
                          t.text,
                          { fontSize: u, lineHeight: 1.35, color: "@muted" },
                        ),
                      );
                    }
                  });
                  break;
                }
                case "two-column": {
                  v();
                  let t = (e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN - 48) / 2,
                    n = [
                      [
                        "left",
                        e.SAFE_MARGIN,
                        r.leftTitle?.trim() ?? "",
                        m(r.leftBullets),
                      ],
                      [
                        "right",
                        e.SAFE_MARGIN + t + 48,
                        r.rightTitle?.trim() ?? "",
                        m(r.rightBullets),
                      ],
                    ],
                    a = S(Math.max(...n.map(([, , , t]) => t.length)), 26),
                    h = { top: 180, bottom: e.SLIDE_HEIGHT - e.SAFE_MARGIN },
                    l = Math.max(...n.map(([, , , e]) => x(e, t - 56, a))),
                    o = Math.min(
                      h.bottom - h.top,
                      Math.max(240, Math.round(l + 128)),
                    ),
                    d = h.top + Math.round((h.bottom - h.top - o) / 2);
                  n.forEach(([e, n, r, h]) => {
                    (c(
                      (0, i.createShape)(
                        { id: `${e}-card`, x: n, y: d, width: t, height: o },
                        "round-rect",
                        { fill: L },
                      ),
                    ),
                      r &&
                        c(
                          (0, i.createText)(
                            {
                              id: `${e}-title`,
                              x: n + 28,
                              y: d + 20,
                              width: t - 56,
                              height: 60,
                            },
                            r,
                            {
                              fontSize: 30,
                              font: "heading",
                              bold: !0,
                              color: "@primary",
                              valign: "middle",
                            },
                          ),
                        ),
                      h.length &&
                        c(
                          (0, i.createText)(
                            {
                              id: `${e}-bullets`,
                              x: n + 28,
                              y: d + 92,
                              width: t - 56,
                              height: o - 112,
                            },
                            h.join("\n"),
                            { fontSize: a, list: "bullet", lineHeight: 1.4 },
                          ),
                        ));
                  });
                  break;
                }
                case "image-left":
                case "image-right": {
                  let t = "image-left" === a;
                  C(
                    {
                      x: t ? 0 : e.SLIDE_WIDTH - 540,
                      y: 0,
                      width: 540,
                      height: e.SLIDE_HEIGHT,
                    },
                    0,
                  );
                  let n = t ? 596 : e.SAFE_MARGIN,
                    h = e.SLIDE_WIDTH - 540 - 56 - e.SAFE_MARGIN;
                  (M && G({ x: n, y: 80, width: h, height: 32 }),
                    (d || r.placeholders) &&
                      c(
                        (0, i.createText)(
                          {
                            id: "title",
                            x: n,
                            y: M ? 118 : 72,
                            width: h,
                            height: M ? 130 : 160,
                          },
                          d,
                          {
                            fontSize: 44,
                            font: "heading",
                            bold: !0,
                            valign: M ? "top" : "bottom",
                            lineHeight: 1.15,
                          },
                        ),
                      ),
                    N(
                      "bullets",
                      {
                        x: n,
                        y: 264,
                        width: h,
                        height: e.SLIDE_HEIGHT - 264 - e.SAFE_MARGIN,
                      },
                      26,
                    ));
                  break;
                }
                case "image-full": {
                  (q(
                    {
                      x: 0,
                      y: 0,
                      width: e.SLIDE_WIDTH,
                      height: e.SLIDE_HEIGHT,
                    },
                    0,
                  ),
                    c(
                      (0, i.createShape)(
                        {
                          id: "overlay",
                          x: 0,
                          y: e.SLIDE_HEIGHT - 250,
                          width: e.SLIDE_WIDTH,
                          height: 250,
                        },
                        "rect",
                        { fill: "#000000", opacity: 0.55 },
                      ),
                    ),
                    M &&
                      c(
                        (0, i.createText)(
                          {
                            id: "kicker",
                            x: e.SAFE_MARGIN,
                            y: e.SLIDE_HEIGHT - 262,
                            width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                            height: 30,
                          },
                          M,
                          {
                            fontSize: 18,
                            font: "heading",
                            bold: !0,
                            uppercase: !0,
                            letterSpacing: 0.14,
                            color: "#ffffff",
                            valign: "bottom",
                          },
                        ),
                      ),
                    d &&
                      c(
                        (0, i.createText)(
                          {
                            id: "title",
                            x: e.SAFE_MARGIN,
                            y: e.SLIDE_HEIGHT - 230,
                            width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                            height: 100,
                          },
                          d,
                          {
                            fontSize: 48,
                            font: "heading",
                            bold: !0,
                            color: "#ffffff",
                            valign: "middle",
                          },
                        ),
                      ));
                  let t = r.caption?.trim() || g;
                  t &&
                    c(
                      (0, i.createText)(
                        {
                          id: "caption",
                          x: e.SAFE_MARGIN,
                          y: e.SLIDE_HEIGHT - 126,
                          width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                          height: 80,
                        },
                        t,
                        { fontSize: 26, color: "#f5f5f5" },
                      ),
                    );
                  break;
                }
                case "quote":
                  (B(),
                    c(
                      (0, i.createText)(
                        {
                          id: "quote-mark",
                          x: e.SAFE_MARGIN,
                          y: 40,
                          width: 220,
                          height: 220,
                        },
                        "“",
                        {
                          fontSize: 220,
                          font: "serif",
                          bold: !0,
                          color: D,
                          lineHeight: 1,
                        },
                      ),
                    ),
                    M &&
                      G(
                        {
                          x: 170,
                          y: 150,
                          width: e.SLIDE_WIDTH - 340,
                          height: 32,
                        },
                        "center",
                      ),
                    c(
                      (0, i.createText)(
                        {
                          id: "quote",
                          x: 170,
                          y: 190,
                          width: e.SLIDE_WIDTH - 340,
                          height: 300,
                        },
                        r.quote?.trim() || d || g,
                        {
                          fontSize: 40,
                          font: "serif",
                          italic: !0,
                          align: "center",
                          valign: "middle",
                          lineHeight: 1.35,
                          color: _,
                        },
                      ),
                    ),
                    r.author?.trim() &&
                      c(
                        (0, i.createText)(
                          {
                            id: "author",
                            x: 170,
                            y: 510,
                            width: e.SLIDE_WIDTH - 340,
                            height: 60,
                          },
                          `— ${r.author.trim()}`,
                          { fontSize: 26, align: "right", color: H },
                        ),
                      ));
                  break;
                case "big-number":
                  (B(),
                    v(),
                    c(
                      (0, i.createText)(
                        {
                          id: "stat",
                          x: e.SAFE_MARGIN,
                          y: 190,
                          width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                          height: 220,
                        },
                        r.statValue?.trim() || "?",
                        {
                          fontSize: 150,
                          font: "heading",
                          bold: !0,
                          color: D,
                          align: "center",
                          valign: "middle",
                          lineHeight: 1,
                        },
                      ),
                    ),
                    r.statLabel?.trim() &&
                      c(
                        (0, i.createText)(
                          {
                            id: "stat-label",
                            x: e.SAFE_MARGIN,
                            y: 420,
                            width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                            height: 70,
                          },
                          r.statLabel.trim(),
                          {
                            fontSize: 34,
                            bold: !0,
                            align: "center",
                            valign: "middle",
                            color: _,
                          },
                        ),
                      ),
                    g &&
                      c(
                        (0, i.createText)(
                          {
                            id: "body",
                            x: 180,
                            y: 500,
                            width: e.SLIDE_WIDTH - 360,
                            height: 150,
                          },
                          g,
                          { fontSize: 24, align: "center", color: H },
                        ),
                      ));
                  break;
                case "timeline": {
                  v();
                  let t = (m(r.steps).length ? m(r.steps) : m(r.bullets)).slice(
                      0,
                      6,
                    ),
                    n = Math.max(t.length, 1),
                    a = (e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN) / n;
                  c(
                    (0, i.createShape)(
                      {
                        id: "line",
                        x: e.SAFE_MARGIN + a / 2,
                        y: 330,
                        width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN - a,
                        height: 6,
                      },
                      "rect",
                      { fill: "@primary", opacity: 0.35 },
                    ),
                  );
                  let h = n > 4 ? 21 : 25,
                    l = Math.min(
                      e.SLIDE_HEIGHT - e.SAFE_MARGIN - 400,
                      Math.max(
                        132,
                        Math.round(
                          Math.max(...t.map((t) => x([t], a - 64, h, 1.35))) +
                            48,
                        ),
                      ),
                    );
                  t.forEach((t, n) => {
                    let r = e.SAFE_MARGIN + a * n + a / 2;
                    (c(
                      (0, i.createShape)(
                        {
                          id: `step-${n + 1}-card`,
                          x: r - a / 2 + 10,
                          y: 400,
                          width: a - 20,
                          height: l,
                        },
                        "round-rect",
                        { fill: L },
                      ),
                    ),
                      c(
                        (0, i.createShape)(
                          {
                            id: `step-${n + 1}-dot`,
                            x: r - 40,
                            y: 293,
                            width: 80,
                            height: 80,
                          },
                          "ellipse",
                          {
                            fill: "@primary",
                            text: String(n + 1),
                            style: {
                              fontSize: 32,
                              bold: !0,
                              color: "@background",
                              font: "heading",
                            },
                          },
                        ),
                      ),
                      c(
                        (0, i.createText)(
                          {
                            id: `step-${n + 1}`,
                            x: r - a / 2 + 26,
                            y: 420,
                            width: a - 52,
                            height: l - 40,
                          },
                          t,
                          {
                            fontSize: h,
                            align: "center",
                            valign: "middle",
                            lineHeight: 1.35,
                          },
                        ),
                      ));
                  });
                  break;
                }
                case "quiz": {
                  v();
                  let t = r.question?.trim() || (d ? "" : g),
                    n = p(r.items, r.bullets).map(A).slice(0, 4),
                    a = d || M ? 176 : 64;
                  t &&
                    c(
                      (0, i.createText)(
                        {
                          id: "question",
                          x: e.SAFE_MARGIN,
                          y: a,
                          width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                          height: 112,
                        },
                        t,
                        {
                          fontSize: 30,
                          bold: !0,
                          valign: "middle",
                          lineHeight: 1.3,
                        },
                      ),
                    );
                  let h = a + 128 * !!t,
                    l = e.SLIDE_HEIGHT - e.SAFE_MARGIN - 72;
                  if (n.length) {
                    let t = 3 === n.length ? 3 : 2,
                      a = Math.ceil(n.length / t),
                      r =
                        (e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN - 20 * (t - 1)) / t,
                      o = Math.min(150, (l - 20 - h - 20 * (a - 1)) / a);
                    n.forEach((n, a) => {
                      let l = "ABCD"[a],
                        d = `option-${l.toLowerCase()}`,
                        s = e.SAFE_MARGIN + (a % t) * (r + 20),
                        g = h + Math.floor(a / t) * (o + 20);
                      (c(
                        (0, i.createShape)(
                          { id: `${d}-card`, x: s, y: g, width: r, height: o },
                          "round-rect",
                          { fill: L, stroke: "@primary", strokeWidth: 2 },
                        ),
                      ),
                        c(
                          (0, i.createShape)(
                            {
                              id: `${d}-num`,
                              x: s + 20,
                              y: g + (o - 56) / 2,
                              width: 56,
                              height: 56,
                            },
                            "ellipse",
                            {
                              fill: "@primary",
                              text: l,
                              style: {
                                fontSize: 26,
                                bold: !0,
                                color: "@background",
                                font: "heading",
                              },
                            },
                          ),
                        ),
                        c(
                          (0, i.createText)(
                            {
                              id: d,
                              x: s + 92,
                              y: g + 12,
                              width: r - 112,
                              height: o - 24,
                            },
                            n,
                            { fontSize: 25, valign: "middle", lineHeight: 1.3 },
                          ),
                        ));
                    });
                  }
                  let o = r.answer?.trim() ?? "",
                    s = /^[A-Da-d]$/.test(o)
                      ? o.toUpperCase()
                      : n.findIndex(
                          (t) => t.toLowerCase() === A(o).toLowerCase(),
                        ),
                    u =
                      "string" == typeof s
                        ? `Đ\xe1p \xe1n: ${s}`
                        : s >= 0
                          ? `Đ\xe1p \xe1n: ${"ABCD"[s]}`
                          : o
                            ? `Đ\xe1p \xe1n: ${o}`
                            : "",
                    m = (g && t !== g ? g : "") || y;
                  (u || m) &&
                    c(
                      (0, i.createShape)(
                        {
                          id: "answer",
                          x: e.SAFE_MARGIN,
                          y: l,
                          width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                          height: 72,
                        },
                        "round-rect",
                        {
                          fill: "@primary",
                          text: [u, m].filter(Boolean).join(" — "),
                          style: { fontSize: 24, bold: !0, lineHeight: 1.3 },
                        },
                      ),
                    );
                  break;
                }
                case "formula":
                  (v(),
                    c(
                      (0, i.createShape)(
                        {
                          id: "formula-card",
                          x: 160,
                          y: 190,
                          width: e.SLIDE_WIDTH - 320,
                          height: 200,
                        },
                        "round-rect",
                        { fill: L },
                      ),
                    ),
                    c(
                      (0, i.createMath)(
                        {
                          id: "formula",
                          x: 180,
                          y: 200,
                          width: e.SLIDE_WIDTH - 360,
                          height: 180,
                        },
                        r.formula?.trim() || "",
                        56,
                      ),
                    ),
                    N(
                      "bullets",
                      {
                        x: 180,
                        y: 420,
                        width: e.SLIDE_WIDTH - 360,
                        height: e.SLIDE_HEIGHT - 420 - e.SAFE_MARGIN + 20,
                      },
                      26,
                    ));
                  break;
                case "chart": {
                  v();
                  let t = s.length > 0 || !!g;
                  (c(
                    (0, i.createChart)(
                      {
                        id: "chart",
                        x: e.SAFE_MARGIN,
                        y: 180,
                        width: t ? 720 : e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                        height: e.SLIDE_HEIGHT - 180 - e.SAFE_MARGIN,
                      },
                      r.chartType ?? "bar",
                      m(r.labels),
                      (r.values ?? []).filter((t) => Number.isFinite(t)),
                      r.seriesName?.trim(),
                    ),
                  ),
                    t &&
                      N(
                        "bullets",
                        {
                          x: 824,
                          y: 200,
                          width: e.SLIDE_WIDTH - 824 - e.SAFE_MARGIN,
                          height: e.SLIDE_HEIGHT - 200 - e.SAFE_MARGIN,
                        },
                        24,
                      ));
                  break;
                }
                case "closing": {
                  (M &&
                    G(
                      {
                        x: e.SAFE_MARGIN,
                        y: 40,
                        width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                        height: 32,
                      },
                      "center",
                    ),
                    d &&
                      c(
                        (0, i.createText)(
                          {
                            id: "title",
                            x: e.SAFE_MARGIN,
                            y: M ? 72 : 56,
                            width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                            height: 110,
                          },
                          d,
                          {
                            fontSize: 52,
                            font: "heading",
                            bold: !0,
                            align: "center",
                            valign: "middle",
                          },
                        ),
                      ));
                  let t = s.length ? s : g ? [g] : [],
                    n = s.length ? S(s.length, 28) : 28,
                    a = Math.min(
                      e.SLIDE_HEIGHT - 196 - e.SAFE_MARGIN,
                      Math.max(
                        200,
                        Math.round(x(t, e.SLIDE_WIDTH - 400, n) + 88),
                      ),
                    ),
                    r =
                      196 +
                      Math.round(
                        (e.SLIDE_HEIGHT - 196 - e.SAFE_MARGIN - a) / 2,
                      );
                  (c(
                    (0, i.createShape)(
                      {
                        id: "summary-card",
                        x: 160,
                        y: r,
                        width: e.SLIDE_WIDTH - 320,
                        height: a,
                      },
                      "round-rect",
                      { fill: L },
                    ),
                  ),
                    N(
                      "bullets",
                      {
                        x: 200,
                        y: r + 40,
                        width: e.SLIDE_WIDTH - 400,
                        height: a - 80,
                      },
                      28,
                    ));
                  break;
                }
                case "agenda": {
                  let t = $.agenda;
                  Z(t, d.length > 24 ? 40 : 46);
                  let n = p(r.items, r.steps, r.bullets).slice(0, 6);
                  if (!n.length) break;
                  let a = t + 64,
                    h = e.SLIDE_WIDTH - a - e.SAFE_MARGIN,
                    l = Math.min(
                      112,
                      (E - e.SAFE_MARGIN - 18 * (n.length - 1)) / n.length,
                    ),
                    o = l < 96,
                    s =
                      e.SAFE_MARGIN +
                      Math.round(
                        (E -
                          e.SAFE_MARGIN -
                          (l * n.length + 18 * (n.length - 1))) /
                          2,
                      );
                  n.forEach((t, e) => {
                    let n = `item-${e + 1}`,
                      r = s + e * (l + 18),
                      d = w(t);
                    (c(
                      (0, i.createShape)(
                        { id: `${n}-card`, x: a, y: r, width: h, height: l },
                        "round-rect",
                        { fill: L },
                      ),
                    ),
                      c(
                        (0, i.createText)(
                          {
                            id: `${n}-num`,
                            x: a + 24,
                            y: r,
                            width: 96,
                            height: l,
                          },
                          String(e + 1).padStart(2, "0"),
                          {
                            fontSize: Math.round(Math.min(48, 0.5 * l)),
                            font: "heading",
                            bold: !0,
                            color: "@primary",
                            valign: "middle",
                            lineHeight: 1,
                          },
                        ),
                      ));
                    let g = a + 128,
                      u = h - 128 - 24;
                    d.text
                      ? (c(
                          (0, i.createText)(
                            {
                              id: `${n}-label`,
                              x: g,
                              y: r + 8,
                              width: u,
                              height: l / 2 - 6,
                            },
                            d.label,
                            {
                              fontSize: o ? 24 : 28,
                              font: "heading",
                              bold: !0,
                              valign: "bottom",
                              lineHeight: 1.2,
                            },
                          ),
                        ),
                        c(
                          (0, i.createText)(
                            {
                              id: n,
                              x: g,
                              y: r + l / 2 + 2,
                              width: u,
                              height: l / 2 - 10,
                            },
                            d.text,
                            {
                              fontSize: o ? 19 : 21,
                              color: "@muted",
                              valign: "top",
                              lineHeight: 1.3,
                            },
                          ),
                        ))
                      : c(
                          (0, i.createText)(
                            { id: n, x: g, y: r, width: u, height: l },
                            d.label,
                            {
                              fontSize: o ? 24 : 28,
                              font: "heading",
                              bold: !0,
                              valign: "middle",
                              lineHeight: 1.2,
                            },
                          ),
                        );
                  });
                  break;
                }
                case "split": {
                  let t = $.split,
                    i = s.length > 0 || !!g,
                    n = F && i;
                  (Z(
                    t,
                    d.length > 28 ? 42 : 50,
                    n ? e.SLIDE_HEIGHT - 290 : e.SLIDE_HEIGHT,
                  ),
                    n &&
                      z(
                        {
                          x: 80,
                          y: e.SLIDE_HEIGHT - 280,
                          width: t - 160,
                          height: 220,
                        },
                        0,
                      ));
                  let a = t + 64,
                    r = e.SLIDE_WIDTH - a - e.SAFE_MARGIN;
                  if (i) {
                    let t = s.length ? S(s.length, 28) : 28,
                      i = Math.min(
                        E - e.SAFE_MARGIN,
                        Math.round(x(s.length ? s : [g], r, t, 1.45) + 24),
                      );
                    N(
                      "bullets",
                      {
                        x: a,
                        y:
                          e.SAFE_MARGIN +
                          Math.round((E - e.SAFE_MARGIN - i) / 2),
                        width: r,
                        height: i,
                      },
                      28,
                    );
                  } else
                    W &&
                      C({
                        x: a,
                        y: e.SAFE_MARGIN + 24,
                        width: r,
                        height: E - e.SAFE_MARGIN - 48,
                      });
                  break;
                }
                case "stats": {
                  v();
                  let t = p(r.items, r.bullets).slice(0, 4).map(w);
                  if (!t.length) break;
                  let n = t.length,
                    a = (e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN - 24 * (n - 1)) / n,
                    h = { top: 180, bottom: E - 76 * !!g },
                    l = n <= 2 ? 104 : 3 === n ? 88 : 72,
                    o = Math.round(1.15 * l),
                    d = n <= 3 ? 26 : 23,
                    s = Math.max(
                      ...t.map((t) =>
                        t.text ? x([t.text], a - 48, d, 1.3) : 0,
                      ),
                    ),
                    u = Math.min(h.bottom - h.top, Math.round(o + s + 88)),
                    m = h.top + Math.round((h.bottom - h.top - u) / 2);
                  (t.forEach((t, n) => {
                    let r = `item-${n + 1}`,
                      h = e.SAFE_MARGIN + n * (a + 24);
                    c(
                      (0, i.createShape)(
                        { id: `${r}-card`, x: h, y: m, width: a, height: u },
                        "round-rect",
                        { fill: L },
                      ),
                    );
                    let s = Math.min(
                      l,
                      Math.floor((a - 40) / Math.max(1, 0.7 * t.label.length)),
                    );
                    (c(
                      (0, i.createText)(
                        {
                          id: `${r}-value`,
                          x: h + 20,
                          y: m + 32,
                          width: a - 40,
                          height: o,
                        },
                        t.label,
                        {
                          fontSize: s,
                          font: "heading",
                          bold: !0,
                          color: "@primary",
                          align: "center",
                          valign: "middle",
                          lineHeight: 1,
                        },
                      ),
                    ),
                      t.text &&
                        c(
                          (0, i.createText)(
                            {
                              id: r,
                              x: h + 24,
                              y: m + 40 + o,
                              width: a - 48,
                              height: u - o - 64,
                            },
                            t.text,
                            { fontSize: d, align: "center", lineHeight: 1.3 },
                          ),
                        ));
                  }),
                    g &&
                      c(
                        (0, i.createText)(
                          {
                            id: "body",
                            x: e.SAFE_MARGIN,
                            y: h.bottom + 12,
                            width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                            height: 64,
                          },
                          g,
                          {
                            fontSize: 20,
                            italic: !0,
                            color: H,
                            align: "center",
                            valign: "middle",
                          },
                        ),
                      ));
                  break;
                }
                case "cycle": {
                  v();
                  let t = p(r.steps, r.items, r.bullets).slice(0, 6);
                  if (!t.length) break;
                  let n = t.length,
                    a = n <= 4 ? 104 : 92,
                    h = n <= 4 ? 300 : 264,
                    l = e.SLIDE_WIDTH / 2,
                    o = (180 + E) / 2,
                    d = (E - 180 - a) / 2,
                    s = n <= 4 ? 400 : 380,
                    g = (t) => -Math.PI / 2 + (2 * Math.PI * t) / n;
                  if (
                    (c(
                      (0, i.createShape)(
                        {
                          id: "deco-ring",
                          x: l - s,
                          y: o - d,
                          width: 2 * s,
                          height: 2 * d,
                        },
                        "ellipse",
                        { stroke: "@primary", strokeWidth: 4, opacity: 0.3 },
                      ),
                    ),
                    n > 1)
                  )
                    for (let t = 0; t < n; t++) {
                      let e = g(t + 0.5),
                        n = f(
                          (180 *
                            Math.atan2(d * Math.cos(e), -s * Math.sin(e))) /
                            Math.PI,
                        );
                      c(
                        (0, i.createShape)(
                          {
                            id: `deco-arrow-${t + 1}`,
                            x: f(l + s * Math.cos(e) - 18),
                            y: f(o + d * Math.sin(e) - 18),
                            width: 36,
                            height: 36,
                          },
                          "chevron",
                          { fill: "@primary", rotation: n },
                        ),
                      );
                    }
                  let u = r.subtitle?.trim() ?? "";
                  (u &&
                    c(
                      (0, i.createShape)(
                        {
                          id: "center",
                          x: l - 100,
                          y: o - 100,
                          width: 200,
                          height: 200,
                        },
                        "ellipse",
                        {
                          fill: "@primary",
                          text: u,
                          style: {
                            fontSize: u.length > 16 ? 22 : 26,
                            bold: !0,
                            color: "@background",
                            font: "heading",
                            lineHeight: 1.2,
                          },
                        },
                      ),
                    ),
                    t.forEach((t, r) => {
                      let u = g(r),
                        m = b(
                          f(l + s * Math.cos(u) - h / 2),
                          e.SAFE_MARGIN,
                          e.SLIDE_WIDTH - e.SAFE_MARGIN - h,
                        ),
                        p = b(f(o + d * Math.sin(u) - a / 2), 180, E - a),
                        S = `step-${r + 1}`;
                      (c(
                        (0, i.createShape)(
                          { id: `${S}-card`, x: m, y: p, width: h, height: a },
                          "round-rect",
                          { fill: L, stroke: "@primary", strokeWidth: 2 },
                        ),
                      ),
                        c(
                          (0, i.createShape)(
                            {
                              id: `${S}-num`,
                              x: m + 16,
                              y: p + (a - 48) / 2,
                              width: 48,
                              height: 48,
                            },
                            "ellipse",
                            {
                              fill: "@primary",
                              text: String(r + 1),
                              style: {
                                fontSize: 22,
                                bold: !0,
                                color: "@background",
                                font: "heading",
                              },
                            },
                          ),
                        ),
                        c(
                          (0, i.createText)(
                            {
                              id: S,
                              x: m + 76,
                              y: p + 8,
                              width: h - 92,
                              height: a - 16,
                            },
                            t,
                            {
                              fontSize: n <= 4 ? 24 : 22,
                              valign: "middle",
                              lineHeight: 1.25,
                            },
                          ),
                        ));
                    }));
                  break;
                }
                case "pyramid": {
                  v();
                  let t = p(r.items, r.steps, r.bullets).slice(0, 5).map(w);
                  if (!t.length) break;
                  let n = t.length,
                    a = t.some((t) => t.text),
                    h = Math.min(120, (E - 180 - 10 * (n - 1)) / n),
                    l =
                      180 + Math.round((E - 180 - (h * n + 10 * (n - 1))) / 2),
                    o = a ? 620 : 820,
                    d = a ? 220 : 300,
                    s = a ? e.SAFE_MARGIN + o / 2 : e.SLIDE_WIDTH / 2,
                    g = e.SAFE_MARGIN + o + 72;
                  t.forEach((t, a) => {
                    let r =
                        1 === n ? o : Math.round(d + ((o - d) * a) / (n - 1)),
                      u = l + a * (h + 10),
                      m = `level-${a + 1}`;
                    if (
                      (c(
                        (0, i.createShape)(
                          {
                            id: `${m}-label`,
                            x: s - r / 2,
                            y: u,
                            width: r,
                            height: h,
                          },
                          "round-rect",
                          {
                            fill: "@primary",
                            text: t.label,
                            style: {
                              fontSize: Math.round(Math.min(28, 0.3 * h)),
                              bold: !0,
                              color: "@background",
                              font: "heading",
                              lineHeight: 1.2,
                            },
                          },
                        ),
                      ),
                      t.text)
                    ) {
                      let l = s + r / 2 + 12;
                      (c(
                        (0, i.createShape)(
                          {
                            id: `deco-link-${a + 1}`,
                            x: l,
                            y: u + h / 2 - 1.5,
                            width: g - 16 - l,
                            height: 3,
                          },
                          "line",
                          { fill: "@primary", opacity: 0.4 },
                        ),
                      ),
                        c(
                          (0, i.createText)(
                            {
                              id: m,
                              x: g,
                              y: u,
                              width: e.SLIDE_WIDTH - e.SAFE_MARGIN - g,
                              height: h,
                            },
                            t.text,
                            {
                              fontSize: n >= 5 ? 21 : 23,
                              valign: "middle",
                              lineHeight: 1.3,
                              color: _,
                            },
                          ),
                        ));
                    }
                  });
                  break;
                }
                case "venn": {
                  v();
                  let t = E - 176,
                    n = Math.min(620, Math.round(1.3 * t)),
                    a = Math.round(0.29 * n),
                    h = [e.SLIDE_WIDTH / 2 - a, e.SLIDE_WIDTH / 2 + a],
                    l = ["@primary", "@secondary"];
                  h.forEach((e, a) => {
                    let r = 0 === a ? "left" : "right";
                    (c(
                      (0, i.createShape)(
                        {
                          id: `${r}-card`,
                          x: e - n / 2,
                          y: 176,
                          width: n,
                          height: t,
                        },
                        "ellipse",
                        { fill: l[a], opacity: 0.14 },
                      ),
                    ),
                      c(
                        (0, i.createShape)(
                          {
                            id: `deco-${r}-ring`,
                            x: e - n / 2,
                            y: 176,
                            width: n,
                            height: t,
                          },
                          "ellipse",
                          { stroke: l[a], strokeWidth: 3, opacity: 0.55 },
                        ),
                      ));
                  });
                  let o = Math.round(0.14 * n),
                    d = h[1] - n / 2,
                    s = h[0] + n / 2,
                    g = [
                      {
                        side: "left",
                        x: h[0] - n / 2 + o,
                        right: d - 16,
                        title: r.leftTitle?.trim() ?? "",
                        items: m(r.leftBullets),
                      },
                      {
                        side: "right",
                        x: s + 16,
                        right: h[1] + n / 2 - o,
                        title: r.rightTitle?.trim() ?? "",
                        items: m(r.rightBullets),
                      },
                    ],
                    u = 176 + Math.round(0.15 * t),
                    f = 176 + Math.round(0.29 * t),
                    b = Math.round(0.52 * t);
                  for (let t of g)
                    (t.title &&
                      c(
                        (0, i.createText)(
                          {
                            id: `${t.side}-title`,
                            x: t.x,
                            y: u,
                            width: t.right - t.x,
                            height: 48,
                          },
                          t.title,
                          {
                            fontSize: 28,
                            font: "heading",
                            bold: !0,
                            color: "@primary",
                            align: "center",
                            valign: "middle",
                          },
                        ),
                      ),
                      t.items.length &&
                        c(
                          (0, i.createText)(
                            {
                              id: `${t.side}-bullets`,
                              x: t.x,
                              y: f,
                              width: t.right - t.x,
                              height: b,
                            },
                            t.items.join("\n"),
                            {
                              fontSize: t.items.length > 3 ? 21 : 23,
                              list: "bullet",
                              lineHeight: 1.35,
                              valign: "middle",
                            },
                          ),
                        ));
                  let S = p(r.items, r.bullets);
                  S.length &&
                    (c(
                      (0, i.createText)(
                        {
                          id: "common-label",
                          x: d + 10,
                          y: u,
                          width: s - d - 20,
                          height: 48,
                        },
                        "Điểm chung",
                        {
                          fontSize: 18,
                          font: "heading",
                          bold: !0,
                          uppercase: !0,
                          letterSpacing: 0.1,
                          color: "@primary",
                          align: "center",
                          valign: "middle",
                        },
                      ),
                    ),
                    c(
                      (0, i.createText)(
                        {
                          id: "common",
                          x: d + 14,
                          y: f,
                          width: s - d - 28,
                          height: b,
                        },
                        S.join("\n"),
                        {
                          fontSize: S.length > 3 ? 20 : 22,
                          align: "center",
                          lineHeight: 1.35,
                          valign: "middle",
                        },
                      ),
                    ));
                  break;
                }
                case "mindmap": {
                  M &&
                    G({
                      x: e.SAFE_MARGIN,
                      y: 28,
                      width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                      height: 32,
                    });
                  let t = p(r.items, r.bullets).slice(0, 6).map(w),
                    n = { top: M ? 76 : e.SAFE_MARGIN, bottom: E },
                    a = e.SLIDE_WIDTH / 2,
                    l = (n.top + n.bottom) / 2,
                    o = Math.ceil(t.length / 2),
                    s = [];
                  for (let { x: r, y: h, height: d, index: g } of ([
                    t.slice(0, o),
                    t.slice(o),
                  ].forEach((t, i) => {
                    if (!t.length) return;
                    let a = Math.min(
                        Math.max(
                          96,
                          Math.max(
                            ...t.map(
                              (t) =>
                                44 +
                                Math.max(48, x([t.label], 252, 26, 1.2)) +
                                (t.text ? 12 + x([t.text], 320, 22, 1.3) : 0),
                            ),
                          ),
                        ),
                        (n.bottom - n.top - 24 * (t.length - 1)) / t.length,
                      ),
                      r =
                        n.top +
                        Math.round(
                          (n.bottom -
                            n.top -
                            (a * t.length + 24 * (t.length - 1))) /
                            2,
                        );
                    t.forEach((t, n) =>
                      s.push({
                        part: t,
                        x:
                          0 === i
                            ? e.SAFE_MARGIN
                            : e.SLIDE_WIDTH - e.SAFE_MARGIN - 360,
                        y: r + n * (a + 24),
                        height: a,
                        index: 0 === i ? n : o + n,
                      }),
                    );
                  }),
                  s)) {
                    let t = (r < a ? r + 360 : r) - a,
                      e = h + d / 2 - l,
                      n = Math.hypot(t, e);
                    c(
                      (0, i.createShape)(
                        {
                          id: `deco-link-${g + 1}`,
                          x: f(a + t / 2 - n / 2),
                          y: f(l + e / 2 - 2),
                          width: f(n),
                          height: 4,
                        },
                        "line",
                        {
                          fill: "@primary",
                          opacity: 0.45,
                          rotation: f((180 * Math.atan2(e, t)) / Math.PI),
                        },
                      ),
                    );
                  }
                  for (let { part: t, x: e, y: n, height: o, index: g } of (c(
                    (0, i.createShape)(
                      {
                        id: "center",
                        x: a - 170,
                        y: l - 95,
                        width: 340,
                        height: 190,
                      },
                      "ellipse",
                      {
                        fill: "@primary",
                        text: d,
                        style: {
                          fontSize: d.length > 26 ? 28 : 34,
                          bold: !0,
                          color: "@background",
                          font: "heading",
                          lineHeight: 1.2,
                        },
                      },
                    ),
                  ),
                  s)) {
                    let a = `branch-${g + 1}`;
                    c(
                      (0, i.createShape)(
                        { id: `${a}-card`, x: e, y: n, width: 360, height: o },
                        "round-rect",
                        { fill: L, stroke: "@primary", strokeWidth: 2 },
                      ),
                    );
                    let l = r.icons?.[g]?.trim() ?? "",
                      d = 48 * !!h(l);
                    d &&
                      (c(
                        (0, i.createShape)(
                          {
                            id: `${a}-dot`,
                            x: e + 20,
                            y: n + 20,
                            width: d,
                            height: d,
                          },
                          "ellipse",
                          { fill: "@primary" },
                        ),
                      ),
                      c(
                        (0, i.createIcon)(
                          {
                            id: `${a}-icon`,
                            x: e + 20 + 0.24 * d,
                            y: n + 20 + 0.24 * d,
                            width: 0.52 * d,
                            height: 0.52 * d,
                          },
                          l,
                          "@background",
                        ),
                      ));
                    let s = e + 20 + (d ? d + 14 : 0),
                      u = Math.max(
                        d,
                        Math.round(x([t.label], e + 360 - 20 - s, 26, 1.2)),
                      );
                    if (
                      (c(
                        (0, i.createText)(
                          {
                            id: t.text ? `${a}-label` : a,
                            x: s,
                            y: n + 20,
                            width: e + 360 - 20 - s,
                            height: t.text ? u : o - 40,
                          },
                          t.label,
                          {
                            fontSize: 26,
                            font: "heading",
                            bold: !0,
                            valign: "middle",
                            lineHeight: 1.2,
                          },
                        ),
                      ),
                      t.text)
                    ) {
                      let r = n + 20 + u + 8;
                      c(
                        (0, i.createText)(
                          {
                            id: a,
                            x: e + 20,
                            y: r,
                            width: 320,
                            height: Math.max(32, n + o - 16 - r),
                          },
                          t.text,
                          { fontSize: 22, color: "@muted", lineHeight: 1.3 },
                        ),
                      );
                    }
                  }
                  let g = r.imagePrompt?.trim() ?? "";
                  if (g && d && t.length) {
                    var j;
                    let a,
                      r,
                      h =
                        ((j = t.map((t) => t.label)),
                        (a = j.map((t) => `"${t.slice(0, 40)}"`).join(", ")),
                        (r = `Sơ đồ tư duy tổng kết b\xe0i học, tranh m\xe0u, khung ngang 16:9, nền trắng trơn: chủ đề "${d.slice(0, 60)}" ở giữa, ${j.length} nh\xe1nh toả ra ${a}; mỗi nh\xe1nh một m\xe0u, k\xe8m một h\xecnh minh hoạ nhỏ đ\xfang \xfd. Chỉ ghi đ\xfang c\xe1c chữ trong ngoặc k\xe9p, đủ dấu, đ\xfang ch\xednh tả, kh\xf4ng th\xeam chữ n\xe0o kh\xe1c.`),
                        `${r} ${g.trim().slice(0, Math.max(0, 590 - r.length))}`.trim());
                    c({
                      ...(0, i.createImage)(
                        {
                          id: u,
                          x: e.SAFE_MARGIN,
                          y: n.top,
                          width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                          height: n.bottom - n.top,
                        },
                        h,
                      ),
                      fit: "contain",
                      radius: 16,
                    });
                  }
                  break;
                }
                case "table": {
                  v();
                  let t = p(r.items, r.bullets)
                    .slice(0, 9)
                    .map((t) => t.split("|").map((t) => t.trim()));
                  if (!t.length) break;
                  let n = Math.min(6, Math.max(...t.map((t) => t.length))),
                    a = t.map((t) =>
                      Array.from({ length: n }, (e, i) => t[i] ?? ""),
                    ),
                    h = a.length <= 4 ? 26 : a.length <= 6 ? 24 : 21,
                    l = { top: 180, bottom: E - 76 * !!g },
                    o = (e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN) / n - 1.2 * h,
                    d = a.reduce(
                      (t, e) =>
                        t +
                        Math.max(...e.map((t) => x([t || " "], o, h, 1.3))) +
                        0.9 * h,
                      0,
                    ),
                    s = Math.min(l.bottom - l.top, Math.round(d + 8)),
                    u = l.top + Math.round((l.bottom - l.top - s) / 2);
                  (c({
                    ...(0, i.createTable)(
                      {
                        id: "table",
                        x: e.SAFE_MARGIN,
                        y: u,
                        width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                        height: s,
                      },
                      a,
                      !0,
                    ),
                    fontSize: h,
                  }),
                    g &&
                      c(
                        (0, i.createText)(
                          {
                            id: "body",
                            x: e.SAFE_MARGIN,
                            y: l.bottom + 12,
                            width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                            height: 64,
                          },
                          g,
                          { fontSize: 22, color: H, valign: "middle" },
                        ),
                      ));
                  break;
                }
                case "example": {
                  v();
                  let t = r.question?.trim() || g,
                    n = p(r.steps, r.bullets, r.items).slice(0, 6),
                    a = r.answer?.trim() ?? "",
                    h = [
                      a && !/^(kết quả|đáp số|đáp án|vậy)/i.test(a)
                        ? `Kết quả: ${a}`
                        : a,
                      y,
                    ]
                      .filter(Boolean)
                      .join(" — "),
                    l = { top: 180, bottom: e.SLIDE_HEIGHT - e.SAFE_MARGIN };
                  (c(
                    (0, i.createShape)(
                      {
                        id: "question-card",
                        x: e.SAFE_MARGIN,
                        y: l.top,
                        width: 470,
                        height: l.bottom - l.top,
                      },
                      "round-rect",
                      { fill: L },
                    ),
                  ),
                    c(
                      (0, i.createText)(
                        {
                          id: "question-label",
                          x: e.SAFE_MARGIN + 32,
                          y: l.top + 28,
                          width: 406,
                          height: 30,
                        },
                        "Đề bài",
                        {
                          fontSize: 20,
                          font: "heading",
                          bold: !0,
                          uppercase: !0,
                          letterSpacing: 0.12,
                          color: D,
                        },
                      ),
                    ),
                    t &&
                      c(
                        (0, i.createText)(
                          {
                            id: "question",
                            x: e.SAFE_MARGIN + 32,
                            y: l.top + 70,
                            width: 406,
                            height: F ? 196 : l.bottom - l.top - 100,
                          },
                          t,
                          { fontSize: 26, lineHeight: 1.4, color: _ },
                        ),
                      ),
                    F &&
                      z(
                        {
                          x: e.SAFE_MARGIN + 32,
                          y: l.top + 280,
                          width: 406,
                          height: l.bottom - l.top - 300,
                        },
                        8,
                      ));
                  let o = e.SAFE_MARGIN + 470 + 40,
                    d = e.SLIDE_WIDTH - e.SAFE_MARGIN - o,
                    s = 80 * !!h,
                    u = l.bottom - l.top - (h ? s + 20 : 0),
                    m = n.length > 4 ? 22 : 24,
                    f = n.map((t) =>
                      Math.max(52, x([t], d - 64, m, 1.35) + 10),
                    ),
                    b = Math.min(
                      1,
                      (u - 14 * Math.max(0, n.length - 1)) /
                        Math.max(
                          1,
                          f.reduce((t, e) => t + e, 0),
                        ),
                    ),
                    S = l.top;
                  (n.forEach((t, e) => {
                    let n = `step-${e + 1}`,
                      a = Math.floor(f[e] * b);
                    (c(
                      (0, i.createShape)(
                        {
                          id: `${n}-num`,
                          x: o,
                          y: S + 2,
                          width: 44,
                          height: 44,
                        },
                        "ellipse",
                        {
                          fill: "@primary",
                          text: String(e + 1),
                          style: {
                            fontSize: 20,
                            bold: !0,
                            color: "@background",
                            font: "heading",
                          },
                        },
                      ),
                    ),
                      c(
                        (0, i.createText)(
                          { id: n, x: o + 64, y: S, width: d - 64, height: a },
                          t,
                          { fontSize: m, lineHeight: 1.35, color: _ },
                        ),
                      ),
                      (S += a + 14));
                  }),
                    h &&
                      c(
                        (0, i.createShape)(
                          {
                            id: "answer",
                            x: o,
                            y: l.bottom - s,
                            width: d,
                            height: s,
                          },
                          "round-rect",
                          {
                            fill: "@primary",
                            text: h,
                            style: { fontSize: 24, bold: !0, lineHeight: 1.3 },
                          },
                        ),
                      ));
                  break;
                }
                case "discussion": {
                  let t = r.question?.trim() || d || g,
                    n = e.SAFE_MARGIN;
                  (M &&
                    (G(
                      {
                        x: e.SAFE_MARGIN,
                        y: 32,
                        width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                        height: 32,
                      },
                      "center",
                    ),
                    (n = 76)),
                    d &&
                      r.question?.trim() &&
                      (c(
                        (0, i.createText)(
                          {
                            id: "title",
                            x: e.SAFE_MARGIN,
                            y: n,
                            width: e.SLIDE_WIDTH - 2 * e.SAFE_MARGIN,
                            height: 56,
                          },
                          d,
                          {
                            fontSize: 34,
                            font: "heading",
                            bold: !0,
                            align: "center",
                            valign: "middle",
                            color: _,
                          },
                        ),
                      ),
                      (n += 68)));
                  let a = [
                      ...p(r.items, r.bullets).slice(0, 3),
                      ...(y ? [y] : []),
                    ].slice(0, 3),
                    h = a.length || F ? 150 : 0,
                    l = e.SLIDE_HEIGHT - e.SAFE_MARGIN - h;
                  c(
                    (0, i.createShape)(
                      {
                        id: "bubble",
                        x: 150,
                        y: n + 8,
                        width: e.SLIDE_WIDTH - 300,
                        height: l - n - 8,
                      },
                      "speech",
                      {
                        fill: L,
                        stroke: "@primary",
                        strokeWidth: 3,
                        text: t,
                        style: {
                          fontSize:
                            t.length > 140 ? 28 : t.length > 70 ? 34 : 40,
                          bold: !0,
                          font: "heading",
                          lineHeight: 1.3,
                          color: _,
                        },
                      },
                    ),
                  );
                  let o = 150;
                  if (
                    (F &&
                      (z({ x: 210, y: l + 12, width: 190, height: h - 12 }, 0),
                      (o = 440)),
                    a.length)
                  ) {
                    let t =
                      (e.SLIDE_WIDTH - 150 - o - 20 * (a.length - 1)) /
                      a.length;
                    a.forEach((e, n) => {
                      c(
                        (0, i.createShape)(
                          {
                            id: `hint-${n + 1}`,
                            x: o + n * (t + 20),
                            y: l + 40,
                            width: t,
                            height: h - 52,
                          },
                          "round-rect",
                          {
                            fill: "@primary",
                            text: e,
                            style: {
                              fontSize: e.length > 50 ? 19 : 22,
                              bold: !0,
                              lineHeight: 1.3,
                            },
                          },
                        ),
                      );
                    });
                  }
                }
              }
              return o;
            })(t, a, r),
            g = s;
          if (d && I.has(a)) {
            let i = $[a] ? $[a] + 64 : e.SAFE_MARGIN;
            g = [
              ...s,
              y(
                { ...t, elements: s },
                {
                  x: i,
                  y: e.SLIDE_HEIGHT - 40 - 104,
                  width: e.SLIDE_WIDTH - e.SAFE_MARGIN - i,
                  height: 104,
                },
                d,
              ),
            ];
          } else
            d &&
              !M.has(a) &&
              (g = (function (t, i, n, a) {
                let r = { ...t, elements: n };
                if ("image-full" === i)
                  return [
                    ...n,
                    y(
                      r,
                      {
                        x: e.SLIDE_WIDTH - e.SAFE_MARGIN - 460,
                        y: e.SAFE_MARGIN,
                        width: 460,
                        height: 140,
                      },
                      a,
                    ),
                  ];
                let h = n.some(
                  (t) => "image" === t.type || "graphic" === t.type,
                );
                if ("bullets" === i && !h)
                  return [
                    ...n.map((t) =>
                      "bullets" === t.id ? { ...t, width: 660 } : t,
                    ),
                    y(
                      r,
                      {
                        x: 768,
                        y: 200,
                        width: e.SLIDE_WIDTH - 768 - e.SAFE_MARGIN,
                        height: 280,
                      },
                      a,
                    ),
                  ];
                let l = e.SAFE_MARGIN,
                  o = e.SLIDE_WIDTH - e.SAFE_MARGIN;
                ("image-left" === i && (l = 596),
                  "image-right" === i &&
                    (o = e.SLIDE_WIDTH - 540 - e.SAFE_MARGIN + 8),
                  "bullets" === i && (o = e.SAFE_MARGIN + 660));
                let c = e.SLIDE_HEIGHT - 40 - 104;
                return [
                  ...n.map((t) => {
                    let i = t.height >= e.SLIDE_HEIGHT - 20,
                      n = t.x < o && t.x + t.width > l;
                    return i || !n || t.y >= c || t.y + t.height <= c - 12
                      ? t
                      : { ...t, height: Math.max(48, c - 12 - t.y) };
                  }),
                  y(r, { x: l, y: c, width: o - l, height: 104 }, a),
                ];
              })(t, a, s, d));
          let E = r.animation ?? "subtle",
            k = (0, l.applyAnimationPreset)(g, E);
          return "quiz" === a
            ? ((c = Math.max(
                0,
                ...(o = k)
                  .filter((t) => "click" === t.animation.start)
                  .map((t) => t.animation.order),
              )),
              o.map((t) =>
                "answer" === t.id
                  ? {
                      ...t,
                      animation: {
                        ...l.NO_ANIMATION,
                        effect: "zoom-in",
                        start: "click",
                        order: c + 1,
                        duration: 500,
                      },
                    }
                  : t,
              ))
            : "example" === a
              ? (function (t, e) {
                  if ("none" === e) return t;
                  let i = Math.max(
                      0,
                      ...t
                        .filter((t) => {
                          let e;
                          return (
                            "click" === t.animation.start &&
                            ((e = t.id), !/^step-(\d+)(-num)?$/.exec(e)) &&
                            "answer" !== t.id
                          );
                        })
                        .map((t) => t.animation.order),
                    ),
                    n = Math.max(
                      0,
                      ...t.map((t) => {
                        let e;
                        return Number(
                          ((e = t.id), /^step-(\d+)(-num)?$/.exec(e))?.[1] ?? 0,
                        );
                      }),
                    );
                  return t.map((t) => {
                    let e,
                      a = ((e = t.id), /^step-(\d+)(-num)?$/.exec(e));
                    if (!a && "answer" !== t.id) return t;
                    let r = i + (a ? Number(a[1]) : n + 1),
                      h =
                        "none" === t.animation.effect
                          ? "fade-up"
                          : t.animation.effect;
                    return {
                      ...t,
                      animation: {
                        ...t.animation,
                        effect: h,
                        start: "click",
                        order: r,
                        delay: 0,
                        byLine: !1,
                      },
                    };
                  });
                })(k, E)
              : k;
        },
        "isLayoutId",
        0,
        function (t) {
          return "string" == typeof t && c.includes(t);
        },
        "resolveTone",
        0,
        function (t, e, i = !1) {
          let n = d.includes(e ?? "") ? e : (g[t] ?? "theme");
          return "accent" !== n
            ? n
            : i
              ? "theme"
              : s.has(t)
                ? "accent"
                : "soft";
        },
        "toneBackground",
        0,
        function (t) {
          return {
            color: "accent" === t ? "@primary" : "soft" === t ? "@surface" : "",
            gradientTo: "",
            image: "",
          };
        },
      ],
      325919,
    );
  },
  935917,
  (t) => {
    "use strict";
    let e = [
        {
          id: "basic",
          title: "Hình cơ bản",
          shapes: [
            { id: "rect", label: "Hình chữ nhật", pptx: "rect" },
            { id: "round-rect", label: "Chữ nhật bo góc", pptx: "roundRect" },
            { id: "snip-rect", label: "Chữ nhật cắt góc", pptx: "snip1Rect" },
            { id: "ellipse", label: "Hình bầu dục", pptx: "ellipse" },
            { id: "triangle", label: "Tam giác", pptx: "triangle" },
            {
              id: "right-triangle",
              label: "Tam giác vuông",
              pptx: "rtTriangle",
            },
            { id: "diamond", label: "Hình thoi", pptx: "diamond" },
            {
              id: "parallelogram",
              label: "Hình bình hành",
              pptx: "parallelogram",
            },
            { id: "trapezoid", label: "Hình thang", pptx: "trapezoid" },
            { id: "pentagon", label: "Ngũ giác", pptx: "pentagon" },
            { id: "hexagon", label: "Lục giác", pptx: "hexagon" },
            { id: "octagon", label: "Bát giác", pptx: "octagon" },
            { id: "plus", label: "Dấu cộng", pptx: "plus" },
            { id: "donut", label: "Hình vành khuyên", pptx: "donut" },
            { id: "frame", label: "Khung", pptx: "frame" },
            { id: "cube", label: "Hình hộp", pptx: "cube" },
            { id: "can", label: "Hình trụ", pptx: "can" },
            { id: "heart", label: "Trái tim", pptx: "heart" },
            { id: "cloud", label: "Đám mây", pptx: "cloud" },
            { id: "lightning", label: "Tia chớp", pptx: "lightningBolt" },
            { id: "sun", label: "Mặt trời", pptx: "sun" },
            { id: "moon", label: "Mặt trăng", pptx: "moon" },
            { id: "teardrop", label: "Giọt nước", pptx: "teardrop" },
          ],
        },
        {
          id: "arrows",
          title: "Mũi tên khối",
          shapes: [
            { id: "arrow-right", label: "Mũi tên phải", pptx: "rightArrow" },
            { id: "arrow-left", label: "Mũi tên trái", pptx: "leftArrow" },
            { id: "arrow-up", label: "Mũi tên lên", pptx: "upArrow" },
            { id: "arrow-down", label: "Mũi tên xuống", pptx: "downArrow" },
            {
              id: "arrow-left-right",
              label: "Mũi tên hai chiều ngang",
              pptx: "leftRightArrow",
            },
            {
              id: "arrow-up-down",
              label: "Mũi tên hai chiều dọc",
              pptx: "upDownArrow",
            },
            { id: "chevron", label: "Chữ V", pptx: "chevron" },
            { id: "home-plate", label: "Ngũ giác mũi tên", pptx: "homePlate" },
          ],
        },
        {
          id: "callouts",
          title: "Chú thích",
          shapes: [
            {
              id: "speech",
              label: "Chú thích hình chữ nhật",
              pptx: "wedgeRectCallout",
            },
            {
              id: "callout-round",
              label: "Chú thích bo góc",
              pptx: "wedgeRoundRectCallout",
            },
            {
              id: "callout-oval",
              label: "Chú thích bầu dục",
              pptx: "wedgeEllipseCallout",
            },
            {
              id: "callout-cloud",
              label: "Chú thích đám mây",
              pptx: "cloudCallout",
            },
          ],
        },
        {
          id: "stars",
          title: "Sao và băng rôn",
          shapes: [
            { id: "star-4", label: "Sao 4 cánh", pptx: "star4" },
            { id: "star", label: "Sao 5 cánh", pptx: "star5" },
            { id: "star-6", label: "Sao 6 cánh", pptx: "star6" },
            { id: "star-8", label: "Sao 8 cánh", pptx: "star8" },
            { id: "star-12", label: "Sao 12 cánh", pptx: "star12" },
            { id: "burst", label: "Nổ", pptx: "irregularSeal1" },
            { id: "ribbon", label: "Băng rôn", pptx: "ribbon2" },
          ],
        },
        {
          id: "flowchart",
          title: "Lưu đồ",
          shapes: [
            {
              id: "flow-process",
              label: "Quy trình",
              pptx: "flowChartProcess",
            },
            {
              id: "flow-decision",
              label: "Quyết định",
              pptx: "flowChartDecision",
            },
            {
              id: "flow-terminator",
              label: "Bắt đầu / kết thúc",
              pptx: "flowChartTerminator",
            },
            {
              id: "flow-data",
              label: "Dữ liệu vào/ra",
              pptx: "flowChartInputOutput",
            },
            {
              id: "flow-document",
              label: "Tài liệu",
              pptx: "flowChartDocument",
            },
            {
              id: "flow-predefined",
              label: "Quy trình định sẵn",
              pptx: "flowChartPredefinedProcess",
            },
            {
              id: "flow-manual-input",
              label: "Nhập thủ công",
              pptx: "flowChartManualInput",
            },
            {
              id: "flow-preparation",
              label: "Chuẩn bị",
              pptx: "flowChartPreparation",
            },
            {
              id: "flow-connector",
              label: "Điểm nối",
              pptx: "flowChartConnector",
            },
            { id: "flow-delay", label: "Trì hoãn", pptx: "flowChartDelay" },
            { id: "flow-merge", label: "Hợp nhất", pptx: "flowChartMerge" },
          ],
        },
        {
          id: "equation",
          title: "Phương trình",
          shapes: [
            { id: "math-plus", label: "Cộng", pptx: "mathPlus" },
            { id: "math-minus", label: "Trừ", pptx: "mathMinus" },
            { id: "math-multiply", label: "Nhân", pptx: "mathMultiply" },
            { id: "math-divide", label: "Chia", pptx: "mathDivide" },
            { id: "math-equal", label: "Bằng", pptx: "mathEqual" },
            { id: "math-not-equal", label: "Khác", pptx: "mathNotEqual" },
          ],
        },
      ],
      i = new Map(e.flatMap((t) => t.shapes.map((t) => [t.id, t])));
    (i.set("line", { id: "line", label: "Đường thẳng", pptx: "line" }),
      [...i.keys()]);
    let n = (t) => (Math.round(100 * t) / 100).toString();
    function a(t, e, i) {
      return `M${t.map(([t, a]) => `${n(t * e)},${n(a * i)}`).join(" L")} Z`;
    }
    function r(t, e, i, a) {
      return `M${n(t - i)},${n(e)} A${n(i)},${n(a)} 0 1,0 ${n(t + i)},${n(e)} A${n(i)},${n(a)} 0 1,0 ${n(t - i)},${n(e)} Z`;
    }
    function h(t, e, i, a, r) {
      let h = Math.max(0, Math.min(r, i / 2, a / 2));
      return `M${n(t + h)},${n(e)} L${n(t + i - h)},${n(e)} Q${n(t + i)},${n(e)} ${n(t + i)},${n(e + h)} L${n(t + i)},${n(e + a - h)} Q${n(t + i)},${n(e + a)} ${n(t + i - h)},${n(e + a)} L${n(t + h)},${n(e + a)} Q${n(t)},${n(e + a)} ${n(t)},${n(e + a - h)} L${n(t)},${n(e + h)} Q${n(t)},${n(e)} ${n(t + h)},${n(e)} Z`;
    }
    function l(t, e, i, a) {
      let r = [];
      for (let h = 0; h < 2 * t; h++) {
        let l = -Math.PI / 2 + (h * Math.PI) / t,
          o = h % 2 == 0 ? 0.5 : e;
        r.push(
          `${n(i / 2 + Math.cos(l) * o * i)},${n(a / 2 + Math.sin(l) * o * a)}`,
        );
      }
      return `M${r.join(" L")} Z`;
    }
    function o(t, e) {
      return [
        [0.25, 0.62, 0.2],
        [0.18, 0.4, 0.16],
        [0.33, 0.24, 0.17],
        [0.55, 0.2, 0.2],
        [0.76, 0.3, 0.17],
        [0.83, 0.52, 0.16],
        [0.68, 0.7, 0.18],
        [0.45, 0.72, 0.2],
      ]
        .map(([i, n, a]) => r(i * t, n * e, a * t, a * e * 1.15))
        .join(" ");
    }
    function c(t, e, i) {
      let a = "right" === t || "left" === t,
        r = a ? e : i,
        h = a ? i : e,
        l = Math.min(0.45 * r, h),
        o = 0.3 * h;
      return `M${[
        [0, o],
        [r - l, o],
        [r - l, 0],
        [r, h / 2],
        [r - l, h],
        [r - l, h - o],
        [0, h - o],
      ]
        .map(([e, i]) => {
          switch (t) {
            case "right":
              return [e, i];
            case "left":
              return [r - e, i];
            case "down":
              return [i, e];
            case "up":
              return [i, r - e];
          }
        })
        .map(([t, e]) => `${n(t)},${n(e)}`)
        .join(" L")} Z`;
    }
    function d(t, e, i) {
      let a = t ? i : e,
        r = t ? e : i,
        h = Math.min(0.3 * a, r),
        l = 0.3 * r;
      return `M${[
        [0, r / 2],
        [h, 0],
        [h, l],
        [a - h, l],
        [a - h, 0],
        [a, r / 2],
        [a - h, r],
        [a - h, r - l],
        [h, r - l],
        [h, r],
      ]
        .map(([e, i]) => (t ? `${n(i)},${n(e)}` : `${n(e)},${n(i)}`))
        .join(" L")} Z`;
    }
    function s(t, e, i) {
      return `L${n(0.36 * t)},${n(i)} L${n(0.18 * t)},${n(e)} L${n(0.22 * t)},${n(i)}`;
    }
    t.s([
      "SHAPE_GROUPS",
      0,
      e,
      "SHAPE_INFO",
      0,
      i,
      "isShapeKind",
      0,
      function (t) {
        return "string" == typeof t && i.has(t);
      },
      "shapeGeometry",
      0,
      function (t, e, i) {
        switch (t) {
          case "rect":
          case "flow-process":
            return { d: `M0,0 L${n(e)},0 L${n(e)},${n(i)} L0,${n(i)} Z` };
          case "round-rect":
            return { d: h(0, 0, e, i, Math.min(28, e / 2, i / 2)) };
          case "snip-rect": {
            let t = 0.2 * Math.min(e, i);
            return {
              d: `M0,0 L${n(e - t)},0 L${n(e)},${n(t)} L${n(e)},${n(i)} L0,${n(i)} Z`,
            };
          }
          case "ellipse":
          case "flow-connector":
            return { d: r(e / 2, i / 2, e / 2, i / 2) };
          case "triangle":
            return {
              d: a(
                [
                  [0.5, 0],
                  [1, 1],
                  [0, 1],
                ],
                e,
                i,
              ),
            };
          case "right-triangle":
            return {
              d: a(
                [
                  [0, 0],
                  [1, 1],
                  [0, 1],
                ],
                e,
                i,
              ),
            };
          case "diamond":
          case "flow-decision":
            return {
              d: a(
                [
                  [0.5, 0],
                  [1, 0.5],
                  [0.5, 1],
                  [0, 0.5],
                ],
                e,
                i,
              ),
            };
          case "parallelogram":
          case "flow-data":
            return {
              d: a(
                [
                  [0.22, 0],
                  [1, 0],
                  [0.78, 1],
                  [0, 1],
                ],
                e,
                i,
              ),
            };
          case "trapezoid":
            return {
              d: a(
                [
                  [0.22, 0],
                  [0.78, 0],
                  [1, 1],
                  [0, 1],
                ],
                e,
                i,
              ),
            };
          case "pentagon":
            return {
              d: a(
                [
                  [0.5, 0],
                  [1, 0.38],
                  [0.81, 1],
                  [0.19, 1],
                  [0, 0.38],
                ],
                e,
                i,
              ),
            };
          case "hexagon":
          case "flow-preparation":
            return {
              d: a(
                [
                  [0.25, 0],
                  [0.75, 0],
                  [1, 0.5],
                  [0.75, 1],
                  [0.25, 1],
                  [0, 0.5],
                ],
                e,
                i,
              ),
            };
          case "octagon":
            return {
              d: a(
                [
                  [0.29, 0],
                  [0.71, 0],
                  [1, 0.29],
                  [1, 0.71],
                  [0.71, 1],
                  [0.29, 1],
                  [0, 0.71],
                  [0, 0.29],
                ],
                e,
                i,
              ),
            };
          case "plus":
          case "math-plus": {
            let n = "plus" === t ? 0.33 : 0.38,
              r = 1 - n;
            return {
              d: a(
                [
                  [n, 0],
                  [r, 0],
                  [r, n],
                  [1, n],
                  [1, r],
                  [r, r],
                  [r, 1],
                  [n, 1],
                  [n, r],
                  [0, r],
                  [0, n],
                  [n, n],
                ],
                e,
                i,
              ),
            };
          }
          case "donut":
            return {
              d: `${r(e / 2, i / 2, e / 2, i / 2)} ${r(e / 2, i / 2, 0.3 * e, 0.3 * i)}`,
              evenOdd: !0,
            };
          case "frame": {
            let t = 0.14 * Math.min(e, i);
            return {
              d: `M0,0 L${n(e)},0 L${n(e)},${n(i)} L0,${n(i)} Z M${n(t)},${n(t)} L${n(t)},${n(i - t)} L${n(e - t)},${n(i - t)} L${n(e - t)},${n(t)} Z`,
              evenOdd: !0,
            };
          }
          case "cube": {
            let t = 0.25 * Math.min(e, i);
            return {
              d: `M0,${n(t)} L${n(t)},0 L${n(e)},0 L${n(e)},${n(i - t)} L${n(e - t)},${n(i)} L0,${n(i)} Z`,
              detail: `M0,${n(t)} L${n(e - t)},${n(t)} L${n(e)},0 M${n(e - t)},${n(t)} L${n(e - t)},${n(i)}`,
            };
          }
          case "can": {
            let t = Math.min(0.15 * i, 0.25 * e);
            return {
              d: `M0,${n(t)} A${n(e / 2)},${n(t)} 0 0,1 ${n(e)},${n(t)} L${n(e)},${n(i - t)} A${n(e / 2)},${n(t)} 0 0,1 0,${n(i - t)} Z`,
              detail: `M0,${n(t)} A${n(e / 2)},${n(t)} 0 0,0 ${n(e)},${n(t)}`,
            };
          }
          case "heart":
            return {
              d: `M${n(e / 2)},${n(0.28 * i)} C${n(0.5 * e)},${n(0.05 * i)} ${n(0.05 * e)},${n(-(0.02 * i))} ${n(0.02 * e)},${n(0.3 * i)} C${n(0)},${n(0.55 * i)} ${n(0.3 * e)},${n(0.75 * i)} ${n(e / 2)},${n(i)} C${n(0.7 * e)},${n(0.75 * i)} ${n(e)},${n(0.55 * i)} ${n(0.98 * e)},${n(0.3 * i)} C${n(0.95 * e)},${n(-(0.02 * i))} ${n(0.5 * e)},${n(0.05 * i)} ${n(e / 2)},${n(0.28 * i)} Z`,
            };
          case "cloud":
            return { d: o(e, i) };
          case "lightning":
            return {
              d: a(
                [
                  [0.38, 0],
                  [0.62, 0],
                  [0.5, 0.36],
                  [0.78, 0.36],
                  [0.3, 1],
                  [0.42, 0.52],
                  [0.18, 0.52],
                ],
                e,
                i,
              ),
            };
          case "sun": {
            let t = [];
            for (let a = 0; a < 8; a++) {
              let r = (a * Math.PI) / 4,
                h = [
                  e / 2 + Math.cos(r) * e * 0.5,
                  i / 2 + Math.sin(r) * i * 0.5,
                ],
                l = [
                  e / 2 + Math.cos(r - 0.18) * e * 0.33,
                  i / 2 + Math.sin(r - 0.18) * i * 0.33,
                ],
                o = [
                  e / 2 + Math.cos(r + 0.18) * e * 0.33,
                  i / 2 + Math.sin(r + 0.18) * i * 0.33,
                ];
              t.push(
                `M${n(l[0])},${n(l[1])} L${n(h[0])},${n(h[1])} L${n(o[0])},${n(o[1])} Z`,
              );
            }
            return {
              d: `${r(e / 2, i / 2, 0.27 * e, 0.27 * i)} ${t.join(" ")}`,
            };
          }
          case "moon":
            return {
              d: `M${n(0.7 * e)},0 A${n(0.5 * e)},${n(0.5 * i)} 0 1,0 ${n(0.7 * e)},${n(i)} A${n(0.42 * e)},${n(0.5 * i)} 0 1,1 ${n(0.7 * e)},0 Z`,
            };
          case "teardrop":
            return {
              d: `M${n(e)},0 L${n(e)},${n(i / 2)} A${n(e / 2)},${n(i / 2)} 0 1,1 ${n(e / 2)},0 Z`,
            };
          case "arrow-right":
            return { d: c("right", e, i) };
          case "arrow-left":
            return { d: c("left", e, i) };
          case "arrow-up":
            return { d: c("up", e, i) };
          case "arrow-down":
            return { d: c("down", e, i) };
          case "arrow-left-right":
            return { d: d(!1, e, i) };
          case "arrow-up-down":
            return { d: d(!0, e, i) };
          case "chevron":
            return {
              d: a(
                [
                  [0, 0],
                  [0.7, 0],
                  [1, 0.5],
                  [0.7, 1],
                  [0, 1],
                  [0.3, 0.5],
                ],
                e,
                i,
              ),
            };
          case "home-plate":
            return {
              d: a(
                [
                  [0, 0],
                  [0.75, 0],
                  [1, 0.5],
                  [0.75, 1],
                  [0, 1],
                ],
                e,
                i,
              ),
            };
          case "speech": {
            let t = Math.min(24, e / 6, i / 6),
              a = 0.78 * i;
            return {
              d: `M${n(t)},0 L${n(e - t)},0 Q${n(e)},0 ${n(e)},${n(t)} L${n(e)},${n(a - t)} Q${n(e)},${n(a)} ${n(e - t)},${n(a)} ${s(e, i, a)} L${n(t)},${n(a)} Q0,${n(a)} 0,${n(a - t)} L0,${n(t)} Q0,0 ${n(t)},0 Z`,
            };
          }
          case "callout-round": {
            let t = 0.78 * i,
              a = Math.min(0.3 * t, 0.15 * e);
            return {
              d: `M${n(a)},0 L${n(e - a)},0 A${n(a)},${n(a)} 0 0,1 ${n(e)},${n(a)} L${n(e)},${n(t - a)} A${n(a)},${n(a)} 0 0,1 ${n(e - a)},${n(t)} ${s(e, i, t)} L${n(a)},${n(t)} A${n(a)},${n(a)} 0 0,1 0,${n(t - a)} L0,${n(a)} A${n(a)},${n(a)} 0 0,1 ${n(a)},0 Z`,
            };
          }
          case "callout-oval": {
            let t = 0.8 * i;
            return {
              d: `M${n(0.2 * e)},${n(0.87 * t)} A${n(e / 2)},${n(t / 2)} 0 1,1 ${n(0.36 * e)},${n(0.97 * t)} L${n(0.12 * e)},${n(i)} Z`,
            };
          }
          case "callout-cloud": {
            let t = o(e, 0.82 * i);
            return {
              d: `${t} ${r(0.2 * e, 0.86 * i, 0.05 * e, 0.05 * i)} ${r(0.1 * e, 0.96 * i, 0.03 * e, 0.03 * i)}`,
            };
          }
          case "star-4":
            return { d: l(4, 0.16, e, i) };
          case "star":
            return { d: l(5, 0.21, e, i) };
          case "star-6":
            return { d: l(6, 0.3, e, i) };
          case "star-8":
            return { d: l(8, 0.36, e, i) };
          case "star-12":
            return { d: l(12, 0.4, e, i) };
          case "burst":
            return {
              d: a(
                [
                  [0.5, 0],
                  [0.6, 0.22],
                  [0.82, 0.08],
                  [0.76, 0.32],
                  [1, 0.36],
                  [0.8, 0.52],
                  [0.96, 0.74],
                  [0.7, 0.7],
                  [0.68, 0.96],
                  [0.5, 0.78],
                  [0.3, 1],
                  [0.3, 0.74],
                  [0.04, 0.8],
                  [0.18, 0.56],
                  [0, 0.4],
                  [0.24, 0.34],
                  [0.16, 0.1],
                  [0.38, 0.22],
                ],
                e,
                i,
              ),
            };
          case "ribbon":
            return {
              d: a(
                [
                  [0, 0.25],
                  [0.18, 0.25],
                  [0.18, 0],
                  [0.82, 0],
                  [0.82, 0.25],
                  [1, 0.25],
                  [0.92, 0.5],
                  [1, 0.75],
                  [0.82, 0.75],
                  [0.82, 1],
                  [0.18, 1],
                  [0.18, 0.75],
                  [0, 0.75],
                  [0.08, 0.5],
                ],
                e,
                i,
              ),
              detail: `M${n(0.18 * e)},${n(0.25 * i)} L${n(0.18 * e)},${n(0.75 * i)} M${n(0.82 * e)},${n(0.25 * i)} L${n(0.82 * e)},${n(0.75 * i)}`,
            };
          case "flow-terminator":
            return { d: h(0, 0, e, i, i / 2) };
          case "flow-document":
            return {
              d: `M0,0 L${n(e)},0 L${n(e)},${n(0.82 * i)} C${n(0.75 * e)},${n(0.7 * i)} ${n(0.6 * e)},${n(1.08 * i)} ${n(0.35 * e)},${n(0.92 * i)} C${n(0.2 * e)},${n(0.82 * i)} ${n(0.1 * e)},${n(0.84 * i)} 0,${n(0.9 * i)} Z`,
            };
          case "flow-predefined":
            return {
              d: `M0,0 L${n(e)},0 L${n(e)},${n(i)} L0,${n(i)} Z`,
              detail: `M${n(0.1 * e)},0 L${n(0.1 * e)},${n(i)} M${n(0.9 * e)},0 L${n(0.9 * e)},${n(i)}`,
            };
          case "flow-manual-input":
            return {
              d: a(
                [
                  [0, 0.25],
                  [1, 0],
                  [1, 1],
                  [0, 1],
                ],
                e,
                i,
              ),
            };
          case "flow-delay":
            return {
              d: `M0,0 L${n(e / 2)},0 A${n(e / 2)},${n(i / 2)} 0 0,1 ${n(e / 2)},${n(i)} L0,${n(i)} Z`,
            };
          case "flow-merge":
            return {
              d: a(
                [
                  [0, 0],
                  [1, 0],
                  [0.5, 1],
                ],
                e,
                i,
              ),
            };
          case "math-minus":
            return {
              d: a(
                [
                  [0, 0.38],
                  [1, 0.38],
                  [1, 0.62],
                  [0, 0.62],
                ],
                e,
                i,
              ),
            };
          case "math-multiply":
            return {
              d: a(
                [
                  [0.12, 0],
                  [0.5, 0.38],
                  [0.88, 0],
                  [1, 0.12],
                  [0.62, 0.5],
                  [1, 0.88],
                  [0.88, 1],
                  [0.5, 0.62],
                  [0.12, 1],
                  [0, 0.88],
                  [0.38, 0.5],
                  [0, 0.12],
                ],
                e,
                i,
              ),
            };
          case "math-divide":
            return {
              d: `${a(
                [
                  [0, 0.42],
                  [1, 0.42],
                  [1, 0.58],
                  [0, 0.58],
                ],
                e,
                i,
              )} ${r(e / 2, 0.18 * i, 0.12 * Math.min(e, i), 0.12 * Math.min(e, i))} ${r(e / 2, 0.82 * i, 0.12 * Math.min(e, i), 0.12 * Math.min(e, i))}`,
            };
          case "math-equal":
            return {
              d: `${a(
                [
                  [0, 0.22],
                  [1, 0.22],
                  [1, 0.42],
                  [0, 0.42],
                ],
                e,
                i,
              )} ${a(
                [
                  [0, 0.58],
                  [1, 0.58],
                  [1, 0.78],
                  [0, 0.78],
                ],
                e,
                i,
              )}`,
            };
          case "math-not-equal":
            return {
              d: `${a(
                [
                  [0, 0.22],
                  [1, 0.22],
                  [1, 0.42],
                  [0, 0.42],
                ],
                e,
                i,
              )} ${a(
                [
                  [0, 0.58],
                  [1, 0.58],
                  [1, 0.78],
                  [0, 0.78],
                ],
                e,
                i,
              )} ${a(
                [
                  [0.62, 0],
                  [0.76, 0.04],
                  [0.38, 1],
                  [0.24, 0.96],
                ],
                e,
                i,
              )}`,
            };
          case "line":
            return { d: `M0,${n(i / 2)} L${n(e)},${n(i / 2)}` };
        }
      },
      "shapeTextInset",
      0,
      function (t) {
        switch (t) {
          case "ellipse":
          case "flow-connector":
          case "donut":
            return [0.15, 0.15, 0.15, 0.15];
          case "triangle":
            return [0.45, 0.22, 0.04, 0.22];
          case "right-triangle":
            return [0.45, 0.45, 0.04, 0.04];
          case "flow-merge":
            return [0.04, 0.22, 0.45, 0.22];
          case "diamond":
          case "flow-decision":
            return [0.25, 0.25, 0.25, 0.25];
          case "parallelogram":
          case "flow-data":
          case "trapezoid":
            return [0.04, 0.2, 0.04, 0.2];
          case "pentagon":
          case "hexagon":
          case "octagon":
          case "flow-preparation":
            return [0.18, 0.12, 0.1, 0.12];
          case "speech":
          case "callout-round":
            return [0.02, 0.02, 0.22, 0.02];
          case "callout-oval":
            return [0.12, 0.15, 0.3, 0.15];
          case "callout-cloud":
          case "cloud":
            return [0.22, 0.2, 0.3, 0.2];
          case "star":
          case "star-4":
          case "star-6":
          case "star-8":
          case "star-12":
          case "burst":
          case "sun":
            return [0.3, 0.3, 0.3, 0.3];
          case "heart":
            return [0.2, 0.18, 0.3, 0.18];
          case "chevron":
            return [0.04, 0.3, 0.04, 0.3];
          case "home-plate":
            return [0.04, 0.25, 0.04, 0.04];
          case "arrow-right":
          case "arrow-left":
          case "arrow-left-right":
            return [0.3, 0.2, 0.3, 0.2];
          case "arrow-up":
          case "arrow-down":
          case "arrow-up-down":
            return [0.2, 0.3, 0.2, 0.3];
          case "cube":
            return [0.27, 0.27, 0.04, 0.04];
          case "can":
            return [0.3, 0.04, 0.1, 0.04];
          case "frame":
            return [0.16, 0.16, 0.16, 0.16];
          case "ribbon":
            return [0.06, 0.2, 0.06, 0.2];
          case "flow-document":
            return [0.04, 0.04, 0.2, 0.04];
          case "flow-predefined":
            return [0.04, 0.12, 0.04, 0.12];
          case "flow-manual-input":
            return [0.28, 0.04, 0.04, 0.04];
          case "flow-delay":
            return [0.04, 0.2, 0.04, 0.04];
          default:
            return [0, 0, 0, 0];
        }
      },
    ]);
  },
  23991,
  (t) => {
    "use strict";
    let e = (t, e) => `${t}:${e}`;
    function i(t) {
      return Math.max(1, ...t.rows.map((t) => t.length));
    }
    function n(t) {
      let e = i(t),
        n = t.rows.length
          ? t.rows.map((t) => Array.from({ length: e }, (e, i) => t[i] ?? ""))
          : [[""]];
      return { ...t, rows: n };
    }
    function a(t) {
      let e = i(t),
        n = t.colWidths;
      if (!n || n.length !== e || n.some((t) => !(t > 0)))
        return Array.from({ length: e }, () => 1 / e);
      let a = n.reduce((t, e) => t + e, 0);
      return n.map((t) => t / a);
    }
    function r(t, e, i) {
      return t.merges?.find(
        (t) =>
          e >= t.row &&
          e < t.row + t.rowSpan &&
          i >= t.col &&
          i < t.col + t.colSpan,
      );
    }
    function h(t, e) {
      let i = { ...e },
        n = !0;
      for (; n; )
        for (let e of ((n = !1), t.merges ?? [])) {
          if (
            !(
              e.row <= i.r1 &&
              e.row + e.rowSpan - 1 >= i.r0 &&
              e.col <= i.c1 &&
              e.col + e.colSpan - 1 >= i.c0
            )
          )
            continue;
          let t = {
            r0: Math.min(i.r0, e.row),
            c0: Math.min(i.c0, e.col),
            r1: Math.max(i.r1, e.row + e.rowSpan - 1),
            c1: Math.max(i.c1, e.col + e.colSpan - 1),
          };
          (t.r0 !== i.r0 || t.c0 !== i.c0 || t.r1 !== i.r1 || t.c1 !== i.c1) &&
            ((i = t), (n = !0));
        }
      return i;
    }
    function l(t, i) {
      if (!t) return;
      let n = {};
      for (let [a, r] of Object.entries(t)) {
        let [t, h] = a.split(":").map(Number),
          l = i(t, h);
        l && (n[e(l[0], l[1])] = r);
      }
      return Object.keys(n).length ? n : void 0;
    }
    t.s([
      "cellKey",
      0,
      e,
      "columnCount",
      0,
      i,
      "columnWidths",
      0,
      a,
      "deleteColumns",
      0,
      function (t, e, r) {
        let h = n(t);
        if (r - e + 1 >= i(h)) return h;
        let o = r - e + 1,
          c = h.rows.map((t) => t.filter((t, i) => i < e || i > r)),
          d = a(h).filter((t, i) => i < e || i > r),
          s = d.reduce((t, e) => t + e, 0),
          g = (h.merges ?? []).flatMap((t) => {
            let i = t.col + t.colSpan - 1;
            if (i < e) return [t];
            if (t.col > r) return [{ ...t, col: t.col - o }];
            let n = Math.max(0, e - t.col) + Math.max(0, i - r);
            if (n <= 0) return [];
            let a = { ...t, col: t.col < e ? t.col : e, colSpan: n };
            return a.rowSpan * a.colSpan > 1 ? [a] : [];
          }),
          u = l(h.cells, (t, i) =>
            i < e ? [t, i] : i > r ? [t, i - o] : null,
          );
        return {
          ...h,
          rows: c,
          colWidths: d.map((t) => t / s),
          merges: g.length ? g : void 0,
          cells: u,
        };
      },
      "deleteRows",
      0,
      function (t, e, i) {
        let a = n(t);
        if (i - e + 1 >= a.rows.length) return a;
        let r = i - e + 1,
          h = a.rows.filter((t, n) => n < e || n > i),
          o = (a.merges ?? []).flatMap((t) => {
            let n = t.row + t.rowSpan - 1;
            if (n < e) return [t];
            if (t.row > i) return [{ ...t, row: t.row - r }];
            let a = Math.max(0, e - t.row) + Math.max(0, n - i);
            if (a <= 0) return [];
            let h = { ...t, row: t.row < e ? t.row : e, rowSpan: a };
            return h.rowSpan * h.colSpan > 1 ? [h] : [];
          }),
          c = l(a.cells, (t, n) =>
            t < e ? [t, n] : t > i ? [t - r, n] : null,
          );
        return { ...a, rows: h, merges: o.length ? o : void 0, cells: c };
      },
      "distributeColumns",
      0,
      function (t) {
        return { ...t, colWidths: void 0 };
      },
      "expandRange",
      0,
      h,
      "insertColumn",
      0,
      function (t, e) {
        let r = n(t),
          h = i(r),
          o = Math.max(0, Math.min(h, e)),
          c = r.rows.map((t) => [...t.slice(0, o), "", ...t.slice(o)]),
          d = a(r),
          s = 1 / (h + 1),
          g = [
            ...d.slice(0, o).map((t) => t * (1 - s)),
            s,
            ...d.slice(o).map((t) => t * (1 - s)),
          ],
          u = r.merges?.map((t) =>
            t.col >= o
              ? { ...t, col: t.col + 1 }
              : t.col + t.colSpan > o
                ? { ...t, colSpan: t.colSpan + 1 }
                : t,
          ),
          m = l(r.cells, (t, e) => [t, e >= o ? e + 1 : e]);
        return { ...r, rows: c, colWidths: g, merges: u, cells: m };
      },
      "insertRow",
      0,
      function (t, e) {
        let a = n(t),
          r = i(a),
          h = Math.max(0, Math.min(a.rows.length, e)),
          o = [
            ...a.rows.slice(0, h),
            Array.from({ length: r }, () => ""),
            ...a.rows.slice(h),
          ],
          c = a.merges?.map((t) =>
            t.row >= h
              ? { ...t, row: t.row + 1 }
              : t.row + t.rowSpan > h
                ? { ...t, rowSpan: t.rowSpan + 1 }
                : t,
          ),
          d = l(a.cells, (t, e) => [t >= h ? t + 1 : t, e]);
        return { ...a, rows: o, merges: c, cells: d };
      },
      "mergeAt",
      0,
      r,
      "mergeCells",
      0,
      function (t, e) {
        let i = n(t),
          a = h(i, e);
        if (a.r0 === a.r1 && a.c0 === a.c1) return i;
        let r = [];
        for (let t = a.r0; t <= a.r1; t++)
          for (let e = a.c0; e <= a.c1; e++) {
            let n = i.rows[t]?.[e]?.trim();
            n && r.push(n);
          }
        let l = i.rows.map((t, e) =>
            t.map((t, i) =>
              e < a.r0 || e > a.r1 || i < a.c0 || i > a.c1
                ? t
                : e === a.r0 && i === a.c0
                  ? r.join("\n")
                  : "",
            ),
          ),
          o = [
            ...(i.merges ?? []).filter(
              (t) =>
                t.row > a.r1 ||
                t.row + t.rowSpan - 1 < a.r0 ||
                t.col > a.c1 ||
                t.col + t.colSpan - 1 < a.c0,
            ),
            {
              row: a.r0,
              col: a.c0,
              rowSpan: a.r1 - a.r0 + 1,
              colSpan: a.c1 - a.c0 + 1,
            },
          ];
        return { ...i, rows: l, merges: o };
      },
      "nextCell",
      0,
      function (t, e, n, a) {
        let h = i(t),
          l = e * h + n,
          o = t.rows.length * h;
        for (;;) {
          if ((l += a) < 0 || l >= o) return null;
          let e = Math.floor(l / h),
            i = l % h,
            n = r(t, e, i);
          if (!n || (n.row === e && n.col === i)) return { row: e, col: i };
        }
      },
      "normalizeTable",
      0,
      n,
      "rangeOf",
      0,
      function (t, e) {
        return {
          r0: Math.min(t.row, e.row),
          c0: Math.min(t.col, e.col),
          r1: Math.max(t.row, e.row),
          c1: Math.max(t.col, e.col),
        };
      },
      "resizeColumn",
      0,
      function (t, e, i, n = 0.04) {
        let r = a(t);
        if (e < 0 || e >= r.length - 1) return t;
        let h = r[e] + r[e + 1],
          l = Math.max(n, Math.min(h - n, r[e] + i)),
          o = [...r];
        return (
          (o[e] = l),
          (o[e + 1] = h - l),
          { ...t, colWidths: o.map((t) => Math.round(1e4 * t) / 1e4) }
        );
      },
      "setCellText",
      0,
      function (t, e, i, a) {
        let r = n(t);
        return {
          ...r,
          rows: r.rows.map((t, n) =>
            n === e ? t.map((t, e) => (e === i ? a : t)) : t,
          ),
        };
      },
      "setCellsStyle",
      0,
      function (t, i, n) {
        let a = { ...(t.cells ?? {}) };
        for (let t = i.r0; t <= i.r1; t++)
          for (let r = i.c0; r <= i.c1; r++) {
            let i = { ...a[e(t, r)], ...n };
            for (let t of Object.keys(i))
              (void 0 === i[t] || "" === i[t]) && delete i[t];
            Object.keys(i).length ? (a[e(t, r)] = i) : delete a[e(t, r)];
          }
        return { ...t, cells: Object.keys(a).length ? a : void 0 };
      },
      "unmergeCells",
      0,
      function (t, e) {
        let i = (t.merges ?? []).filter(
          (t) =>
            t.row > e.r1 ||
            t.row + t.rowSpan - 1 < e.r0 ||
            t.col > e.c1 ||
            t.col + t.colSpan - 1 < e.c0,
        );
        return { ...t, merges: i.length ? i : void 0 };
      },
    ]);
  },
  17295,
  (t) => {
    "use strict";
    let e =
        'var(--font-slide-sans), var(--font-inter), "Segoe UI", system-ui, sans-serif',
      i =
        'var(--font-slide-rounded), var(--font-inter), "Segoe UI", system-ui, sans-serif',
      n =
        'var(--font-slide-serif), var(--font-newsreader), "Times New Roman", serif',
      a = (t, i = e) => ({
        heading: t,
        body: i,
        serif: n,
        mono: "var(--font-geist-mono), ui-monospace, monospace",
      }),
      r = [
        {
          id: "classroom",
          name: "Lớp học",
          description:
            "Nền trắng, nhấn xanh dương, hình khối nhẹ ở góc; trung tính, dùng khi môn không rõ hoặc bài tổng hợp nhiều môn.",
          tags: [
            "tổng hợp",
            "sinh hoạt lớp",
            "hoạt động trải nghiệm",
            "hướng nghiệp",
            "giáo dục địa phương",
          ],
          dark: !1,
          decor: "shapes",
          colors: {
            background: "#ffffff",
            backgroundTo: "",
            surface: "#f1f6fd",
            text: "#1f2a37",
            muted: "#5b6675",
            primary: "#2563eb",
            secondary: "#0ea5e9",
            accent: "#f59e0b",
            chart: [
              "#2563eb",
              "#0ea5e9",
              "#f59e0b",
              "#10b981",
              "#ef4444",
              "#8b5cf6",
            ],
          },
          fonts: a(e),
        },
        {
          id: "chalkboard",
          name: "Bảng đen",
          description:
            "Bảng xanh khung gỗ, chữ phấn; hoài niệm lớp học. Hợp tiết ôn tập, luyện giải bài, chữa đề; không dùng mặc định cho mọi bài.",
          tags: ["ôn tập", "chữa đề", "giải bài tập", "luyện thi"],
          dark: !0,
          decor: "chalk",
          colors: {
            background: "#1f3a2e",
            backgroundTo: "#16291f",
            surface: "#28473a",
            text: "#f4f1e8",
            muted: "#c9d3c4",
            primary: "#fde68a",
            secondary: "#93c5fd",
            accent: "#fca5a5",
            chart: [
              "#fde68a",
              "#93c5fd",
              "#fca5a5",
              "#a7f3d0",
              "#f9a8d4",
              "#ddd6fe",
            ],
          },
          fonts: a(i, i),
        },
        {
          id: "sunrise",
          name: "Bình minh",
          description:
            "Chuyển sắc cam hồng, mặt trời và đồi thoải; ấm áp, giàu cảm xúc. Hợp Văn thơ hiện đại, kỹ năng sống, bài mở đầu năm học.",
          tags: [
            "ngữ văn",
            "văn học",
            "thơ",
            "kỹ năng sống",
            "cảm xúc",
            "gia đình",
            "quê hương",
            "mùa xuân",
            "khai giảng",
          ],
          dark: !1,
          decor: "sunrise",
          colors: {
            background: "#fff7ed",
            backgroundTo: "#ffe4e6",
            surface: "#ffffff",
            text: "#3b1f1a",
            muted: "#7c5a52",
            primary: "#ea580c",
            secondary: "#db2777",
            accent: "#7c3aed",
            chart: [
              "#ea580c",
              "#db2777",
              "#7c3aed",
              "#f59e0b",
              "#0891b2",
              "#16a34a",
            ],
          },
          fonts: a(n),
        },
        {
          id: "ocean",
          name: "Đại dương",
          description:
            "Xanh biển sâu, sóng và bọt nước; tương phản cao. Hợp biển đảo, sông ngòi, khí hậu, sinh vật biển, vòng tuần hoàn nước.",
          tags: [
            "biển",
            "đại dương",
            "biển đảo",
            "sông",
            "khí hậu",
            "thuỷ văn",
            "sinh vật biển",
            "địa lí tự nhiên",
            "địa lý tự nhiên",
          ],
          dark: !0,
          decor: "waves",
          colors: {
            background: "#0c2a43",
            backgroundTo: "#0e4c6e",
            surface: "#123b5c",
            text: "#eef7ff",
            muted: "#a9c7dd",
            primary: "#38bdf8",
            secondary: "#2dd4bf",
            accent: "#fbbf24",
            chart: [
              "#38bdf8",
              "#2dd4bf",
              "#fbbf24",
              "#f472b6",
              "#a78bfa",
              "#4ade80",
            ],
          },
          fonts: a(e),
        },
        {
          id: "forest",
          name: "Rừng xanh",
          description:
            "Nền kem, lá cây ở góc, nhấn xanh lá; dịu mắt. Hợp thực vật, môi trường, nông nghiệp, Công nghệ trồng trọt, Tự nhiên – Xã hội.",
          tags: [
            "thực vật",
            "môi trường",
            "nông nghiệp",
            "trồng trọt",
            "sinh thái",
            "tự nhiên và xã hội",
            "quang hợp",
            "rừng",
          ],
          dark: !1,
          decor: "leaves",
          colors: {
            background: "#f7f5ec",
            backgroundTo: "",
            surface: "#e8efe0",
            text: "#1f2d1f",
            muted: "#5c6b58",
            primary: "#15803d",
            secondary: "#65a30d",
            accent: "#b45309",
            chart: [
              "#15803d",
              "#65a30d",
              "#b45309",
              "#0f766e",
              "#a16207",
              "#be123c",
            ],
          },
          fonts: a(n),
        },
        {
          id: "minimal",
          name: "Tối giản",
          description:
            "Đen trắng, nhiều khoảng trống; nghiêm túc. Hợp báo cáo chuyên đề, họp tổ chuyên môn, sinh hoạt hội đồng, đại học.",
          tags: [
            "báo cáo",
            "chuyên đề",
            "tổ chuyên môn",
            "đại học",
            "nghiên cứu khoa học",
            "thuyết trình",
          ],
          dark: !1,
          decor: "none",
          colors: {
            background: "#fafafa",
            backgroundTo: "",
            surface: "#f0f0f0",
            text: "#111111",
            muted: "#666666",
            primary: "#111111",
            secondary: "#525252",
            accent: "#dc2626",
            chart: [
              "#111111",
              "#737373",
              "#dc2626",
              "#a3a3a3",
              "#404040",
              "#d4d4d4",
            ],
          },
          fonts: a(e),
        },
        {
          id: "playful",
          name: "Vui nhộn",
          description:
            "Màu kẹo ngọt, pháo giấy, font tròn. Hợp mầm non, lớp 1–3, trò chơi, ôn tập vui, làm quen chữ cái và số đếm.",
          tags: [
            "mầm non",
            "lớp 1",
            "lớp 2",
            "lớp 3",
            "trò chơi",
            "chữ cái",
            "học vần",
          ],
          dark: !1,
          decor: "confetti",
          colors: {
            background: "#fffbea",
            backgroundTo: "#e0f2fe",
            surface: "#ffffff",
            text: "#2b2250",
            muted: "#6b6394",
            primary: "#f43f5e",
            secondary: "#8b5cf6",
            accent: "#22c55e",
            chart: [
              "#f43f5e",
              "#8b5cf6",
              "#22c55e",
              "#f59e0b",
              "#06b6d4",
              "#ec4899",
            ],
          },
          fonts: a(i, i),
        },
        {
          id: "galaxy",
          name: "Thiên hà",
          description:
            "Tím than chuyển sắc, sao lấp lánh, hành tinh; huyền bí. Hợp thiên văn, vũ trụ, Hệ Mặt Trời, Vật lý hiện đại, khoa học viễn tưởng.",
          tags: [
            "vũ trụ",
            "thiên văn",
            "hệ mặt trời",
            "hành tinh",
            "trái đất và bầu trời",
            "hạt nhân",
            "ánh sáng",
            "lực hấp dẫn",
          ],
          dark: !0,
          decor: "stars",
          colors: {
            background: "#1e1b4b",
            backgroundTo: "#0f172a",
            surface: "#2a2566",
            text: "#f5f3ff",
            muted: "#c4b5fd",
            primary: "#a78bfa",
            secondary: "#22d3ee",
            accent: "#f472b6",
            chart: [
              "#a78bfa",
              "#22d3ee",
              "#f472b6",
              "#facc15",
              "#34d399",
              "#fb923c",
            ],
          },
          fonts: a(e),
        },
        {
          id: "notebook",
          name: "Vở ô li",
          description:
            "Trang vở kẻ dòng, lề đỏ, mực xanh; gần gũi. Hợp Tiếng Việt tiểu học, tập làm văn, chính tả, luyện viết, ngữ pháp.",
          tags: [
            "tiếng việt",
            "chính tả",
            "tập làm văn",
            "luyện viết",
            "tập viết",
            "luyện từ và câu",
            "ngữ pháp",
            "đọc hiểu",
            "tập đọc",
          ],
          dark: !1,
          decor: "notebook",
          colors: {
            background: "#fffdf6",
            backgroundTo: "",
            surface: "#f3eedf",
            text: "#22304a",
            muted: "#68718a",
            primary: "#2f5fd0",
            secondary: "#e5484d",
            accent: "#f29d0c",
            chart: [
              "#2f5fd0",
              "#e5484d",
              "#f29d0c",
              "#16a34a",
              "#7c3aed",
              "#0891b2",
            ],
          },
          fonts: a(i, i),
        },
        {
          id: "graph",
          name: "Giấy ô vuông",
          description:
            "Giấy kẻ ô như vở toán, nhấn chàm và cam; rõ ràng, chính xác. Hợp Toán: số học, đại số, hình học, hàm số, thống kê.",
          tags: [
            "toán",
            "số học",
            "đại số",
            "hình học",
            "hàm số",
            "phương trình",
            "phân số",
            "thống kê",
            "xác suất",
            "giải tích",
            "lượng giác",
            "đạo hàm",
            "tích phân",
          ],
          dark: !1,
          decor: "grid",
          colors: {
            background: "#ffffff",
            backgroundTo: "",
            surface: "#eef2fb",
            text: "#1b2440",
            muted: "#5a6481",
            primary: "#3b5bdb",
            secondary: "#0ca678",
            accent: "#f76707",
            chart: [
              "#3b5bdb",
              "#0ca678",
              "#f76707",
              "#e8590c",
              "#ae3ec9",
              "#1098ad",
            ],
          },
          fonts: a(e),
        },
        {
          id: "blueprint",
          name: "Bản vẽ kỹ thuật",
          description:
            "Nền xanh bản vẽ, lưới trắng, dấu kỹ thuật; kỹ sư. Hợp Vật lý cơ – điện, Công nghệ, kỹ thuật, STEM, chế tạo, robot.",
          tags: [
            "vật lí",
            "vật lý",
            "cơ học",
            "điện học",
            "dòng điện",
            "chuyển động",
            "công nghệ",
            "kĩ thuật",
            "kỹ thuật",
            "stem",
            "robot",
            "cơ khí",
          ],
          dark: !0,
          decor: "blueprint",
          colors: {
            background: "#14396b",
            backgroundTo: "#0c2648",
            surface: "#1d4a82",
            text: "#f1f6ff",
            muted: "#a9c1e0",
            primary: "#7cc4ff",
            secondary: "#ffd166",
            accent: "#ff8a80",
            chart: [
              "#7cc4ff",
              "#ffd166",
              "#ff8a80",
              "#9be7b0",
              "#c3a6ff",
              "#ffb86b",
            ],
          },
          fonts: a(e),
        },
        {
          id: "lab",
          name: "Phòng thí nghiệm",
          description:
            "Xanh bạc hà, hoạ tiết phân tử lục giác; tươi, khoa học. Hợp Hoá học, Sinh học tế bào, Khoa học tự nhiên, thí nghiệm, y học.",
          tags: [
            "hoá học",
            "hóa học",
            "phân tử",
            "nguyên tử",
            "phản ứng",
            "dung dịch",
            "sinh học",
            "tế bào",
            "di truyền",
            "khoa học tự nhiên",
            "thí nghiệm",
            "y học",
            "vi khuẩn",
          ],
          dark: !1,
          decor: "hexagons",
          colors: {
            background: "#f2fbf8",
            backgroundTo: "#e6f6f8",
            surface: "#ffffff",
            text: "#123c36",
            muted: "#4a6c65",
            primary: "#0b8a79",
            secondary: "#7c5cff",
            accent: "#ff6b6b",
            chart: [
              "#0b8a79",
              "#7c5cff",
              "#ff6b6b",
              "#f59f00",
              "#1c7ed6",
              "#e64980",
            ],
          },
          fonts: a(e),
        },
        {
          id: "heritage",
          name: "Di sản Việt",
          description:
            "Giấy dó, đỏ son – vàng đồng, hoa văn trống đồng; trang trọng, dân tộc. Hợp Lịch sử Việt Nam, GDCD, văn học trung đại, văn hoá, lễ hội.",
          tags: [
            "lịch sử",
            "lịch sử việt nam",
            "đông sơn",
            "kháng chiến",
            "triều đại",
            "gdcd",
            "giáo dục công dân",
            "văn hoá",
            "văn hóa",
            "lễ hội",
            "văn học trung đại",
          ],
          dark: !1,
          decor: "heritage",
          colors: {
            background: "#f8efdd",
            backgroundTo: "#f1e2c3",
            surface: "#fcf6ea",
            text: "#3a2316",
            muted: "#7a5a43",
            primary: "#a8322d",
            secondary: "#b98424",
            accent: "#2f5d50",
            chart: [
              "#a8322d",
              "#b98424",
              "#2f5d50",
              "#6d4c41",
              "#d9822b",
              "#4e6e8e",
            ],
          },
          fonts: a(n),
        },
        {
          id: "atlas",
          name: "Bản đồ",
          description:
            "Giấy bản đồ cổ, đường đồng mức, la bàn; khám phá. Hợp Địa lý: tự nhiên, dân cư, kinh tế vùng, châu lục; Lịch sử thế giới, du lịch.",
          tags: [
            "địa lí",
            "địa lý",
            "bản đồ",
            "châu lục",
            "quốc gia",
            "dân cư",
            "kinh tế",
            "vùng kinh tế",
            "địa hình",
            "lịch sử thế giới",
            "khám phá",
            "du lịch",
          ],
          dark: !1,
          decor: "contour",
          colors: {
            background: "#f5eedb",
            backgroundTo: "",
            surface: "#fbf7ea",
            text: "#2c3a2f",
            muted: "#6b6a52",
            primary: "#2b7a78",
            secondary: "#c0632b",
            accent: "#3d6fb6",
            chart: [
              "#2b7a78",
              "#c0632b",
              "#3d6fb6",
              "#8a9a5b",
              "#b5838d",
              "#e0a458",
            ],
          },
          fonts: a(n),
        },
        {
          id: "watercolor",
          name: "Màu nước",
          description:
            "Loang màu nước tím hồng ngọc; mềm mại, nghệ thuật. Hợp Mỹ thuật, văn học, thơ ca, cảm thụ, kể chuyện, chủ đề tình cảm.",
          tags: [
            "mĩ thuật",
            "mỹ thuật",
            "hội hoạ",
            "hội họa",
            "vẽ tranh",
            "tô màu",
            "nghệ thuật",
            "thơ ca",
            "cảm thụ",
            "kể chuyện",
          ],
          dark: !1,
          decor: "watercolor",
          colors: {
            background: "#fffaf7",
            backgroundTo: "",
            surface: "#f7effa",
            text: "#3b2f4a",
            muted: "#716485",
            primary: "#7e57c2",
            secondary: "#e8598f",
            accent: "#20a39e",
            chart: [
              "#7e57c2",
              "#e8598f",
              "#20a39e",
              "#f4a259",
              "#5b8def",
              "#bc4b51",
            ],
          },
          fonts: a(n),
        },
        {
          id: "melody",
          name: "Giai điệu",
          description:
            "Tím đêm, khuông nhạc và nốt nhạc; bay bổng. Hợp Âm nhạc, hát, nhạc cụ, cảm thụ âm nhạc, văn nghệ, ngày hội.",
          tags: [
            "âm nhạc",
            "hát",
            "bài hát",
            "nhạc cụ",
            "nốt nhạc",
            "văn nghệ",
          ],
          dark: !0,
          decor: "music",
          colors: {
            background: "#24184a",
            backgroundTo: "#3a2468",
            surface: "#33255f",
            text: "#f7f1ff",
            muted: "#cbbbea",
            primary: "#ff9ecf",
            secondary: "#8ee3ff",
            accent: "#ffd166",
            chart: [
              "#ff9ecf",
              "#8ee3ff",
              "#ffd166",
              "#b9f6ca",
              "#c3a6ff",
              "#ffab91",
            ],
          },
          fonts: a(i, i),
        },
        {
          id: "sport",
          name: "Năng động",
          description:
            "Trắng với dải chéo cam – xanh than mạnh mẽ; sôi nổi. Hợp Giáo dục thể chất, thể thao, sức khoẻ, Olympic, hoạt động ngoài trời.",
          tags: [
            "thể dục",
            "giáo dục thể chất",
            "gdtc",
            "thể chất",
            "thể thao",
            "bóng đá",
            "điền kinh",
            "olympic",
            "vận động",
            "sức khoẻ",
            "sức khỏe",
            "dinh dưỡng",
          ],
          dark: !1,
          decor: "stripes",
          colors: {
            background: "#ffffff",
            backgroundTo: "",
            surface: "#fff1eb",
            text: "#14213d",
            muted: "#56627a",
            primary: "#e64a19",
            secondary: "#14213d",
            accent: "#13b5a6",
            chart: [
              "#e64a19",
              "#14213d",
              "#13b5a6",
              "#ffb703",
              "#8338ec",
              "#3a86ff",
            ],
          },
          fonts: a(e),
        },
        {
          id: "code",
          name: "Lập trình",
          description:
            "Nền tối như trình soạn mã, chấm lưới và dấu ngoặc nhọn, nhấn xanh neon. Hợp Tin học, lập trình, thuật toán, AI, an toàn mạng.",
          tags: [
            "tin học",
            "lập trình",
            "thuật toán",
            "máy tính",
            "python",
            "scratch",
            "dữ liệu",
            "internet",
            "trí tuệ nhân tạo",
            "an toàn thông tin",
            "công nghệ thông tin",
          ],
          dark: !0,
          decor: "code",
          colors: {
            background: "#0f172a",
            backgroundTo: "#111c33",
            surface: "#1b2538",
            text: "#e6edf3",
            muted: "#94a3b8",
            primary: "#3ddc97",
            secondary: "#7aa2ff",
            accent: "#ffcb6b",
            chart: [
              "#3ddc97",
              "#7aa2ff",
              "#ffcb6b",
              "#ff7b9c",
              "#c792ea",
              "#5ccfe6",
            ],
          },
          fonts: a(e),
        },
        {
          id: "postcard",
          name: "Bưu thiếp",
          description:
            "Viền thư máy bay đỏ – xanh, tem và dấu bưu điện; quốc tế. Hợp Tiếng Anh và ngoại ngữ, văn hoá các nước, giao tiếp, du học.",
          tags: [
            "tiếng anh",
            "english",
            "ngoại ngữ",
            "tiếng pháp",
            "tiếng trung",
            "tiếng nhật",
            "tiếng hàn",
            "văn hoá thế giới",
            "du học",
          ],
          dark: !1,
          decor: "airmail",
          colors: {
            background: "#fdf8ef",
            backgroundTo: "",
            surface: "#ffffff",
            text: "#22304a",
            muted: "#68708a",
            primary: "#d64545",
            secondary: "#2d5fa8",
            accent: "#f2b134",
            chart: [
              "#d64545",
              "#2d5fa8",
              "#f2b134",
              "#2a9d8f",
              "#8e5ea2",
              "#e76f51",
            ],
          },
          fonts: a(e),
        },
      ],
      h = new Map(r.map((t) => [t.id, t]));
    t.s([
      "DEFAULT_THEME",
      0,
      "classroom",
      "THEMES",
      0,
      r,
      "getTheme",
      0,
      function (t) {
        return h.get(t) ?? r[0];
      },
      "isThemeId",
      0,
      function (t) {
        return "string" == typeof t && h.has(t);
      },
    ]);
  },
]);
