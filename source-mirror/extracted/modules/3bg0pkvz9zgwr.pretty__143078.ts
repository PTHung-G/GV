// Reconstructed from 3bg0pkvz9zgwr.pretty.js, module 143078.
// deps: none
// exports: none


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
