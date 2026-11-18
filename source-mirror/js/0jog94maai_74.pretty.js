(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  636607,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(716400),
      i = e.i(271645);
    e.i(148043);
    var s = e.i(378610);
    function r(e, t, r) {
      return (0, i.useMemo)(
        () =>
          n.default.renderToString(
            (0, s.spaceMatrixRows)((0, s.normalizeLatex)(e)),
            {
              displayMode: t,
              errorColor: r,
              throwOnError: !1,
              strict: !1,
              output: "html",
            },
          ),
        [e, t, r],
      );
    }
    e.s([
      "BlockMath",
      0,
      function ({ math: e, errorColor: n = "#dc2626" }) {
        let i = r(e, !0, n);
        return (0, t.jsx)("div", { dangerouslySetInnerHTML: { __html: i } });
      },
      "InlineMath",
      0,
      function ({ math: e, errorColor: n = "#dc2626" }) {
        let i = r(e, !1, n);
        return (0, t.jsx)("span", { dangerouslySetInnerHTML: { __html: i } });
      },
    ]);
  },
  561296,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(768877),
      i = e.i(632781),
      s = e.i(167881),
      r = e.i(504251);
    e.s([
      "CreateExamButton",
      0,
      function ({ label: e = "Bắt đầu soạn đề" }) {
        let { create: a, creating: l, error: c } = (0, r.useCreateExam)();
        return (0, t.jsxs)("div", {
          className: "flex flex-col items-start gap-2",
          children: [
            (0, t.jsxs)(s.Button, {
              size: "lg",
              className: "h-12 shrink-0 px-7 text-base font-semibold",
              onClick: a,
              disabled: l,
              children: [
                e,
                l
                  ? (0, t.jsx)(i.Loader2, {
                      "aria-hidden": !0,
                      className: "animate-spin",
                    })
                  : (0, t.jsx)(n.ArrowRight, { "aria-hidden": !0 }),
              ],
            }),
            c &&
              (0, t.jsx)("p", {
                role: "alert",
                className: "text-sm text-[#eb5757]",
                children: c,
              }),
          ],
        });
      },
    ]);
  },
  246988,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(762368),
      i = e.i(660011),
      s = e.i(988771),
      r = e.i(271645),
      a = e.i(753034),
      l = e.i(737806),
      c = e.i(947414);
    function d({ children: e, ...n }) {
      let i = (0, r.useContext)(l.MotionConfigContext);
      (((n = { ...i, ...n }).transition = (0, a.resolveTransition)(
        n.transition,
        i.transition,
      )),
        (n.isStatic = (0, c.useConstant)(() => n.isStatic)));
      let s = (0, r.useMemo)(
        () => n,
        [
          JSON.stringify(n.transition),
          n.transformPagePoint,
          n.reducedMotion,
          n.skipAnimations,
          n.isValidProp,
        ],
      );
      return (0, t.jsx)(l.MotionConfigContext.Provider, {
        value: s,
        children: e,
      });
    }
    var h = e.i(647163),
      o = e.i(561296),
      x = e.i(96892),
      m = e.i(226091),
      u = e.i(770990),
      p = e.i(64801),
      g = e.i(88653),
      f = e.i(532181),
      b = e.i(636607),
      j = e.i(689664),
      y = e.i(632781),
      v = e.i(749652);
    let w = { some: 0, all: 1 };
    var N = e.i(772328);
    function k(e, t = 4200) {
      let n = (0, r.useRef)(null),
        i = (function (
          e,
          { root: t, margin: n, amount: i, once: s = !1, initial: a = !1 } = {},
        ) {
          let [l, c] = (0, r.useState)(a);
          return (
            (0, r.useEffect)(() => {
              if (!e.current || (s && l)) return;
              let r = {
                root: (t && t.current) || void 0,
                margin: n,
                amount: i,
              };
              return (function (
                e,
                t,
                { root: n, margin: i, amount: s = "some" } = {},
              ) {
                let r = (0, v.resolveElements)(e),
                  a = new WeakMap(),
                  l = new IntersectionObserver(
                    (e) => {
                      e.forEach((e) => {
                        let n = a.get(e.target);
                        if (!!n !== e.isIntersecting)
                          if (e.isIntersecting) {
                            let n = t(e.target, e);
                            "function" == typeof n
                              ? a.set(e.target, n)
                              : l.unobserve(e.target);
                          } else
                            "function" == typeof n &&
                              (n(e), a.delete(e.target));
                      });
                    },
                    {
                      root: n,
                      rootMargin: i,
                      threshold: "number" == typeof s ? s : w[s],
                    },
                  );
                return (r.forEach((e) => l.observe(e)), () => l.disconnect());
              })(e.current, () => (c(!0), s ? void 0 : () => c(!1)), r);
            }, [t, e, n, s, i]),
            l
          );
        })(n, { amount: 0.35 }),
        s = (0, N.useReducedMotion)(),
        a = e.length,
        [l, c] = (0, r.useState)(0);
      return (
        (0, r.useEffect)(() => {
          if (s || !i) return;
          let n = 0,
            r = (i) => {
              (c(i),
                (n = window.setTimeout(
                  () => r(i < a ? i + 1 : 0),
                  i < a ? e[i] : t,
                )));
            };
          return (
            (n = window.setTimeout(() => r(0), 0)),
            () => window.clearTimeout(n)
          );
        }, [s, i, a, t, e]),
        { ref: n, step: s ? a : l, reduced: !!s }
      );
    }
    function M({ text: e, active: n, instant: i, ms: s = 34, caret: a }) {
      let l = Array.from(e),
        [c, d] = (0, r.useState)(0);
      (0, r.useEffect)(() => {
        if (!n) {
          let e = window.setTimeout(() => d(0), 0);
          return () => window.clearTimeout(e);
        }
        let e = window.setInterval(
          () => d((e) => Math.min(e + 1, l.length)),
          s,
        );
        return () => window.clearInterval(e);
      }, [n, s, l.length]);
      let h = i ? l.length : c;
      return (0, t.jsxs)(t.Fragment, {
        children: [
          l.slice(0, h).join(""),
          a && n && h < l.length && (0, t.jsx)(I, {}),
        ],
      });
    }
    function I({ className: e }) {
      return (0, t.jsx)("span", {
        "aria-hidden": !0,
        className: (0, h.cn)(
          "ml-0.5 inline-block h-[1.05em] w-px translate-y-[0.15em] animate-[caret-blink_1s_step-end_infinite] bg-current motion-reduce:animate-none",
          e,
        ),
      });
    }
    function C({ show: e, children: n, className: i }) {
      let s = (0, N.useReducedMotion)();
      return (0, t.jsx)(g.AnimatePresence, {
        initial: !1,
        children:
          e &&
          (0, t.jsx)(f.motion.div, {
            initial: { clipPath: "inset(0 100% 0 0)", opacity: 0.2 },
            animate: { clipPath: "inset(0 0% 0 0)", opacity: 1 },
            exit: { opacity: 0, transition: { duration: 0 } },
            transition: { duration: 0.85 * !s, ease: [0.3, 0.1, 0.2, 1] },
            className: i,
            children: n,
          }),
      });
    }
    function T({ show: e, children: n, className: i }) {
      return (0, t.jsx)(g.AnimatePresence, {
        initial: !1,
        children:
          e &&
          (0, t.jsx)(f.motion.div, {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, transition: { duration: 0 } },
            transition: { duration: 0.24, ease: "easeOut" },
            className: i,
            children: n,
          }),
      });
    }
    function A() {
      return (0, t.jsx)("span", {
        "aria-hidden": !0,
        className: "inline-flex items-center gap-1",
        children: [0, 1, 2].map((e) =>
          (0, t.jsx)(
            f.motion.span,
            {
              className: "size-1.5 rounded-full bg-[#9b9a97]",
              animate: { opacity: [0.25, 1, 0.25] },
              transition: { duration: 1, repeat: 1 / 0, delay: 0.18 * e },
            },
            e,
          ),
        ),
      });
    }
    function P({ id: e, children: n, done: i }) {
      return (0, t.jsx)(g.AnimatePresence, {
        mode: "wait",
        initial: !1,
        children: (0, t.jsxs)(
          f.motion.div,
          {
            initial: { opacity: 0, y: 6 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -6 },
            transition: { duration: 0.16 },
            className: "flex items-center gap-2 text-xs text-[#787774]",
            children: [
              i
                ? (0, t.jsx)(j.Check, {
                    "aria-hidden": !0,
                    className: "size-3.5 text-[#1c3829]",
                  })
                : (0, t.jsx)(y.Loader2, {
                    "aria-hidden": !0,
                    className:
                      "size-3.5 animate-spin text-[#2383e2] motion-reduce:animate-none",
                  }),
              (0, t.jsx)("span", { children: n }),
            ],
          },
          e,
        ),
      });
    }
    let R = [2700, 1e3, 1100, 1700, 1700],
      E = [2e3, 1e3, 1500, 1600],
      _ = [2200, 1100, 1400],
      S = [1900, 1100, 1100],
      z = [500, 800, 900, 1300, 1e3, 1e3],
      L = "font-[Times_New_Roman,Times,serif] text-black";
    function H({ children: e }) {
      return (0, t.jsx)("div", {
        className:
          "ml-auto w-fit max-w-[90%] rounded-lg bg-[#37352f] px-3.5 py-2 text-sm leading-relaxed text-white",
        children: e,
      });
    }
    function $({ children: e, className: n }) {
      return (0, t.jsx)("div", {
        className: (0, h.cn)(
          "max-w-[92%] rounded-lg border border-[#e3e2e0] bg-white px-3.5 py-2.5 text-sm leading-relaxed text-[#37352f] shadow-sm",
          n,
        ),
        children: e,
      });
    }
    function O({ label: e, children: n, className: i }) {
      return (0, t.jsx)("figure", {
        role: "img",
        "aria-label": e,
        className: (0, h.cn)(
          "rounded-lg border border-[#e9e9e7] bg-[#f1f1ef] p-4 sm:p-6",
          i,
        ),
        children: (0, t.jsx)("div", { "aria-hidden": !0, children: n }),
      });
    }
    let V =
        "Tạo đề kiểm tra Toán 12 chương hàm số, 5 câu trắc nghiệm và 2 câu tự luận.",
      B = {
        1: "Đang đọc yêu cầu…",
        2: "Lập dàn ý: 5 trắc nghiệm, 2 tự luận",
        3: "Đang viết câu 1…",
        4: "Đang viết câu 2…",
        5: "Đã soạn xong 7 câu. Bạn xem lại và chỉnh tiếp nhé.",
      };
    function G() {
      let { ref: e, step: n, reduced: i } = k(R),
        s = 0 === n;
      return (0, t.jsx)("figure", {
        ref: e,
        role: "img",
        "aria-label":
          "Người dùng gõ yêu cầu soạn đề Toán 12, trợ lý AI báo từng bước rồi viết đề lên trang A4",
        className:
          "relative mx-auto h-[540px] w-full max-w-[560px] sm:h-[520px]",
        children: (0, t.jsxs)("div", {
          "aria-hidden": !0,
          className: "select-none",
          children: [
            (0, t.jsxs)("div", {
              className: (0, h.cn)(
                "relative h-[420px] overflow-hidden rounded-sm border border-[#e3e2e0] bg-white px-7 pt-8 text-[15px] leading-[1.7] shadow-[0_1px_2px_rgba(55,53,47,0.08),0_12px_32px_-12px_rgba(55,53,47,0.18)] sm:h-[400px] sm:px-10 sm:pt-10",
                L,
              ),
              children: [
                n < 3 &&
                  (0, t.jsx)("p", {
                    className: "font-sans text-sm text-[#b9b8b4]",
                    children: "Đề trống. Nhờ trợ lý AI soạn giúp bạn…",
                  }),
                (0, t.jsxs)(C, {
                  show: n >= 3,
                  children: [
                    (0, t.jsxs)("div", {
                      className:
                        "grid grid-cols-2 text-center text-[13px] leading-snug",
                      children: [
                        (0, t.jsxs)("p", {
                          children: [
                            "SỞ GIÁO DỤC VÀ ĐÀO TẠO",
                            (0, t.jsx)("br", {}),
                            (0, t.jsx)("b", { children: "TRƯỜNG THPT MẪU" }),
                          ],
                        }),
                        (0, t.jsxs)("p", {
                          children: [
                            (0, t.jsx)("b", {
                              children: "KIỂM TRA GIỮA HỌC KỲ I",
                            }),
                            (0, t.jsx)("br", {}),
                            "Môn: Toán 12",
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsx)("hr", { className: "my-3 border-black" }),
                  ],
                }),
                (0, t.jsxs)(C, {
                  show: n >= 3,
                  children: [
                    (0, t.jsxs)("p", {
                      children: [
                        (0, t.jsx)("b", { children: "Câu 1." }),
                        " Cho hàm số ",
                        (0, t.jsx)(b.InlineMath, {
                          math: "y=\\dfrac{2x+1}{x-3}",
                        }),
                        ". Đường tiệm cận ngang của đồ thị hàm số là",
                        3 === n && (0, t.jsx)(I, {}),
                      ],
                    }),
                    (0, t.jsxs)("div", {
                      className: "grid grid-cols-2 gap-x-4",
                      children: [
                        (0, t.jsxs)("p", {
                          children: [
                            (0, t.jsx)("b", { children: "A." }),
                            " ",
                            (0, t.jsx)(b.InlineMath, { math: "y=2" }),
                          ],
                        }),
                        (0, t.jsxs)("p", {
                          children: [
                            (0, t.jsx)("b", { children: "B." }),
                            " ",
                            (0, t.jsx)(b.InlineMath, { math: "x=3" }),
                          ],
                        }),
                        (0, t.jsxs)("p", {
                          children: [
                            (0, t.jsx)("b", { children: "C." }),
                            " ",
                            (0, t.jsx)(b.InlineMath, { math: "y=3" }),
                          ],
                        }),
                        (0, t.jsxs)("p", {
                          children: [
                            (0, t.jsx)("b", { children: "D." }),
                            " ",
                            (0, t.jsx)(b.InlineMath, { math: "x=2" }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, t.jsx)(C, {
                  show: n >= 4,
                  className: "mt-2",
                  children: (0, t.jsxs)("p", {
                    children: [
                      (0, t.jsx)("b", { children: "Câu 2." }),
                      " Giá trị của ",
                      (0, t.jsx)(b.InlineMath, {
                        math: "\\displaystyle\\int_0^1 (2x+1)\\,dx",
                      }),
                      " bằng",
                      4 === n && (0, t.jsx)(I, {}),
                    ],
                  }),
                }),
                (0, t.jsx)(T, {
                  show: n >= 5,
                  className: "mt-3 space-y-1.5 font-sans",
                  children: [92, 74, 86].map((e, n) =>
                    (0, t.jsx)(
                      "div",
                      {
                        className: "h-1.5 rounded-full bg-[#e3e2e0]",
                        style: { width: `${e}%` },
                      },
                      n,
                    ),
                  ),
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className:
                "absolute right-0 bottom-0 flex h-[196px] w-[90%] flex-col rounded-lg border border-[#e3e2e0] bg-[#f7f6f3] p-3 shadow-[0_8px_28px_-8px_rgba(55,53,47,0.28)] sm:w-[80%]",
              children: [
                (0, t.jsxs)("div", {
                  className: "min-h-0 flex-1 space-y-2.5",
                  children: [
                    (0, t.jsx)(T, {
                      show: n >= 1,
                      children: (0, t.jsx)(H, { children: V }),
                    }),
                    n >= 1 &&
                      (0, t.jsx)(P, { id: n, done: 5 === n, children: B[n] }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className:
                    "mt-2 flex items-end gap-2 rounded-md border border-[#e3e2e0] bg-white py-1.5 pr-1.5 pl-3 text-sm",
                  children: [
                    (0, t.jsx)(p.Paperclip, {
                      "aria-hidden": !0,
                      className: "mb-1 size-4 shrink-0 text-[#9b9a97]",
                    }),
                    (0, t.jsx)("span", {
                      className: (0, h.cn)(
                        "min-h-[1.5rem] min-w-0 flex-1 leading-snug",
                        s ? "text-[#37352f]" : "text-[#b9b8b4]",
                      ),
                      children: s
                        ? (0, t.jsx)(M, {
                            text: V,
                            active: s,
                            instant: i,
                            ms: 34,
                            caret: !0,
                          })
                        : "Nhắn cho trợ lý AI…",
                    }),
                    (0, t.jsx)("span", {
                      className: (0, h.cn)(
                        "flex size-6 shrink-0 items-center justify-center rounded-md transition-colors",
                        s
                          ? "bg-[#37352f] text-white"
                          : "bg-[#f1f1ef] text-[#9b9a97]",
                      ),
                      children: (0, t.jsx)(x.ArrowUp, {
                        "aria-hidden": !0,
                        className: "size-3.5",
                      }),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      });
    }
    function U() {
      let { ref: e, step: n, reduced: i } = k(E);
      return (0, t.jsx)("div", {
        ref: e,
        children: (0, t.jsx)(O, {
          label:
            "Ví dụ: người dùng mô tả đề cần soạn và AI viết ra các câu hỏi",
          className: "min-h-[360px]",
          children: (0, t.jsxs)("div", {
            className: "space-y-3",
            children: [
              (0, t.jsx)(H, {
                children: (0, t.jsx)(M, {
                  text: "Tạo đề thi giữa kỳ Toán lớp 9 gồm 5 câu tự luận.",
                  active: 0 === n,
                  instant: i || n > 0,
                  ms: 36,
                  caret: !0,
                }),
              }),
              (0, t.jsx)(T, {
                show: 1 === n,
                children: (0, t.jsx)($, {
                  className: "w-fit",
                  children: (0, t.jsx)(A, {}),
                }),
              }),
              (0, t.jsxs)("div", {
                className: (0, h.cn)(
                  "rounded-sm border border-[#e3e2e0] bg-white px-4 py-3 text-[14px] leading-relaxed shadow-sm",
                  L,
                ),
                children: [
                  (0, t.jsx)("p", {
                    className: (0, h.cn)(
                      "font-sans text-xs text-[#b9b8b4]",
                      n >= 2 && "hidden",
                    ),
                    children: "Trang đề",
                  }),
                  (0, t.jsx)(C, {
                    show: n >= 2,
                    children: (0, t.jsxs)("p", {
                      children: [
                        (0, t.jsx)("b", { children: "Câu 1." }),
                        " Giải hệ phương trình ",
                        (0, t.jsx)(b.InlineMath, {
                          math: "\\begin{cases}2x+y=5\\\\ x-y=1\\end{cases}",
                        }),
                      ],
                    }),
                  }),
                  (0, t.jsx)(C, {
                    show: n >= 3,
                    className: "mt-1",
                    children: (0, t.jsxs)("p", {
                      children: [
                        (0, t.jsx)("b", { children: "Câu 2." }),
                        " Cho phương trình ",
                        (0, t.jsx)(b.InlineMath, { math: "x^2-4x+m=0" }),
                        ". Tìm ",
                        (0, t.jsx)(b.InlineMath, { math: "m" }),
                        " để phương trình có hai nghiệm phân biệt",
                        3 === n && (0, t.jsx)(I, {}),
                      ],
                    }),
                  }),
                ],
              }),
              (0, t.jsx)(T, {
                show: n >= 4,
                children: (0, t.jsx)($, {
                  children:
                    "Mình đã viết 5 câu tự luận về phương trình, hệ phương trình và hình học. Câu nào cần đổi, bạn cứ nói nhé.",
                }),
              }),
            ],
          }),
        }),
      });
    }
    function F() {
      let { ref: e, step: n, reduced: i } = k(_),
        s = n >= 2;
      return (0, t.jsx)("div", {
        ref: e,
        children: (0, t.jsx)(O, {
          label: "Ví dụ: nhờ AI đổi hàm số ở câu 1, các câu còn lại giữ nguyên",
          className: "min-h-[360px]",
          children: (0, t.jsxs)("div", {
            className: "space-y-3",
            children: [
              (0, t.jsx)(H, {
                children: (0, t.jsx)(M, {
                  text: "Đổi hàm số ở câu 1 thành y = (3x − 2)/(x + 1).",
                  active: 0 === n,
                  instant: i || n > 0,
                  ms: 36,
                  caret: !0,
                }),
              }),
              (0, t.jsxs)("div", {
                className: "h-5",
                children: [
                  1 === n &&
                    (0, t.jsx)(P, { id: "find", children: "Đang tìm câu 1…" }),
                  n >= 2 &&
                    (0, t.jsx)(P, {
                      id: "done",
                      done: !0,
                      children: "Đã sửa câu 1, giữ nguyên 6 câu còn lại",
                    }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: (0, h.cn)(
                  "space-y-1 rounded-sm border border-[#e3e2e0] bg-white px-4 py-3 text-[14px] leading-relaxed shadow-sm",
                  L,
                ),
                children: [
                  (0, t.jsx)(f.motion.div, {
                    animate: {
                      backgroundColor: s
                        ? ["rgba(35,131,226,0.22)", "rgba(35,131,226,0)"]
                        : 1 === n
                          ? "rgba(35,131,226,0.10)"
                          : "rgba(35,131,226,0)",
                    },
                    transition: { duration: s ? 1.4 : 0.25 },
                    className: "-mx-2 rounded px-2 py-0.5",
                    children: (0, t.jsx)(g.AnimatePresence, {
                      mode: "wait",
                      initial: !1,
                      children: (0, t.jsxs)(
                        f.motion.p,
                        {
                          initial: { opacity: 0, y: 4 },
                          animate: { opacity: 1, y: 0 },
                          exit: { opacity: 0, y: -4 },
                          transition: { duration: 0.18 },
                          children: [
                            (0, t.jsx)("b", { children: "Câu 1." }),
                            " Cho hàm số ",
                            (0, t.jsx)(b.InlineMath, {
                              math: s
                                ? "y=\\dfrac{3x-2}{x+1}"
                                : "y=\\dfrac{2x+1}{x-3}",
                            }),
                            ". Tìm tiệm cận ngang của đồ thị.",
                          ],
                        },
                        s ? "after" : "before",
                      ),
                    }),
                  }),
                  (0, t.jsxs)("p", {
                    className: "px-0 text-[#5f5e5b]",
                    children: [
                      (0, t.jsx)("b", { children: "Câu 2." }),
                      " Tính ",
                      (0, t.jsx)(b.InlineMath, {
                        math: "\\displaystyle\\int_0^1 (2x+1)\\,dx",
                      }),
                    ],
                  }),
                  (0, t.jsxs)("p", {
                    className: "text-[#5f5e5b]",
                    children: [
                      (0, t.jsx)("b", { children: "Câu 3." }),
                      " Giải phương trình ",
                      (0, t.jsx)(b.InlineMath, { math: "\\sqrt{x+1}=x-1" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      });
    }
    function q() {
      let { ref: e, step: n } = k(S);
      return (0, t.jsx)("div", {
        ref: e,
        children: (0, t.jsx)(O, {
          label:
            "Ví dụ: ảnh đề thi chụp từ giấy được chuyển thành văn bản có công thức",
          className: "min-h-[360px]",
          children: (0, t.jsxs)("div", {
            className: "grid items-center gap-4 sm:grid-cols-2",
            children: [
              (0, t.jsxs)("div", {
                className:
                  "relative overflow-hidden rounded-sm bg-[#e6e4de] p-3 shadow-sm",
                children: [
                  (0, t.jsx)(u.ImageIcon, {
                    "aria-hidden": !0,
                    className: "absolute top-2 right-2 size-4 text-[#9b9a97]",
                  }),
                  (0, t.jsx)("div", {
                    className: "space-y-2 pt-4 pb-1",
                    children: [88, 100, 72, 96, 60, 92, 78, 84].map((e, n) =>
                      (0, t.jsx)(
                        "div",
                        {
                          className: "h-1.5 rounded-full bg-[#b9b6ad]",
                          style: { width: `${e}%` },
                        },
                        n,
                      ),
                    ),
                  }),
                  (0, t.jsx)("p", {
                    className: "mt-3 text-[11px] text-[#787774]",
                    children: "de-giua-ky.jpg",
                  }),
                  (0, t.jsx)(g.AnimatePresence, {
                    children:
                      0 === n &&
                      (0, t.jsx)(
                        f.motion.div,
                        {
                          className:
                            "pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent to-[#2383e2]/25",
                          initial: { top: "-15%", opacity: 0 },
                          animate: { top: "85%", opacity: 1 },
                          exit: { opacity: 0 },
                          transition: { duration: 1.7, ease: "linear" },
                          children: (0, t.jsx)("div", {
                            className:
                              "absolute inset-x-0 bottom-0 h-px bg-[#2383e2]",
                          }),
                        },
                        "scan",
                      ),
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: (0, h.cn)(
                  "min-h-[132px] rounded-sm border border-[#e3e2e0] bg-white px-4 py-3 text-[14px] leading-relaxed shadow-sm",
                  L,
                ),
                children: [
                  (0, t.jsx)("p", {
                    className: (0, h.cn)(
                      "font-sans text-xs text-[#b9b8b4]",
                      n >= 1 && "hidden",
                    ),
                    children: "Đang đọc ảnh…",
                  }),
                  (0, t.jsx)(C, {
                    show: n >= 1,
                    children: (0, t.jsxs)("p", {
                      children: [
                        (0, t.jsx)("b", { children: "Câu 1." }),
                        " Tính ",
                        (0, t.jsx)(b.InlineMath, {
                          math: "\\displaystyle\\lim_{x\\to 2}\\dfrac{x^2-4}{x-2}",
                        }),
                      ],
                    }),
                  }),
                  (0, t.jsx)(C, {
                    show: n >= 2,
                    className: "mt-1",
                    children: (0, t.jsxs)("p", {
                      children: [
                        (0, t.jsx)("b", { children: "Câu 2." }),
                        " Giải ",
                        (0, t.jsx)(b.InlineMath, { math: "\\sqrt{x+1}=x-1" }),
                      ],
                    }),
                  }),
                  (0, t.jsx)(T, {
                    show: n >= 3,
                    className: "mt-3 font-sans",
                    children: (0, t.jsxs)("span", {
                      className:
                        "inline-flex items-center gap-1.5 rounded-md bg-[#dbeddb] px-2 py-1 text-xs font-medium text-[#1c3829]",
                      children: [
                        (0, t.jsx)(m.FileText, {
                          "aria-hidden": !0,
                          className: "size-3.5",
                        }),
                        " Đã chép 2 câu, sẵn sàng để sửa",
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
      });
    }
    function D() {
      let { ref: e, step: n } = k(z);
      return (0, t.jsx)("div", {
        ref: e,
        children: (0, t.jsx)(O, {
          label:
            "Ví dụ: tệp đề được tải lên và AI viết đáp án cùng barem chấm điểm",
          className: "min-h-[360px]",
          children: (0, t.jsxs)("div", {
            className: "space-y-3",
            children: [
              (0, t.jsxs)("div", {
                className: "flex min-h-7 flex-wrap items-center gap-2 text-xs",
                children: [
                  (0, t.jsx)(T, {
                    show: n >= 1,
                    children: (0, t.jsxs)("span", {
                      className:
                        "flex items-center gap-1.5 rounded-md border border-[#e3e2e0] bg-white px-2.5 py-1",
                      children: [
                        (0, t.jsx)(p.Paperclip, {
                          className: "size-3.5 text-[#787774]",
                        }),
                        " de-cuong.docx",
                      ],
                    }),
                  }),
                  (0, t.jsx)(T, {
                    show: n >= 1,
                    children: (0, t.jsxs)("span", {
                      className:
                        "flex items-center gap-1.5 rounded-md border border-[#e3e2e0] bg-white px-2.5 py-1",
                      children: [
                        (0, t.jsx)(u.ImageIcon, {
                          className: "size-3.5 text-[#787774]",
                        }),
                        " de-giua-ky.jpg",
                      ],
                    }),
                  }),
                ],
              }),
              (0, t.jsx)(T, {
                show: n >= 2,
                children: (0, t.jsx)(H, {
                  children:
                    "Viết đáp án và barem chấm điểm chi tiết cho đề này.",
                }),
              }),
              (0, t.jsxs)("div", {
                className: "h-5",
                children: [
                  3 === n &&
                    (0, t.jsx)(P, {
                      id: "solve",
                      children: "Đang giải từng câu…",
                    }),
                  n >= 4 &&
                    (0, t.jsx)(P, {
                      id: "write",
                      done: n >= 6,
                      children:
                        n >= 6 ? "Đã viết đáp án và barem" : "Đang viết barem…",
                    }),
                ],
              }),
              (0, t.jsx)("div", {
                className: (0, h.cn)(
                  "rounded-sm border border-[#e3e2e0] bg-white p-3 text-[13px] shadow-sm",
                  L,
                ),
                children: (0, t.jsxs)("table", {
                  className: "w-full border-collapse",
                  children: [
                    (0, t.jsx)("thead", {
                      children: (0, t.jsxs)("tr", {
                        children: [
                          (0, t.jsx)("th", {
                            className: "w-14 border border-black px-2 py-1",
                            children: "Câu",
                          }),
                          (0, t.jsx)("th", {
                            className: "border border-black px-2 py-1",
                            children: "Nội dung",
                          }),
                          (0, t.jsx)("th", {
                            className: "w-14 border border-black px-2 py-1",
                            children: "Điểm",
                          }),
                        ],
                      }),
                    }),
                    (0, t.jsxs)("tbody", {
                      children: [
                        (0, t.jsxs)("tr", {
                          children: [
                            (0, t.jsx)("td", {
                              className:
                                "border border-black px-2 py-1 text-center",
                              rowSpan: 2,
                              children: "2",
                            }),
                            (0, t.jsx)("td", {
                              className: "border border-black px-2 py-1",
                              children: (0, t.jsxs)(C, {
                                show: n >= 4,
                                children: [
                                  "Nguyên hàm: ",
                                  (0, t.jsx)(b.InlineMath, { math: "x^2+x" }),
                                ],
                              }),
                            }),
                            (0, t.jsx)("td", {
                              className:
                                "border border-black px-2 py-1 text-center",
                              children: (0, t.jsx)(T, {
                                show: n >= 4,
                                children: "0,5",
                              }),
                            }),
                          ],
                        }),
                        (0, t.jsxs)("tr", {
                          children: [
                            (0, t.jsxs)("td", {
                              className: "border border-black px-2 py-1",
                              children: [
                                (0, t.jsxs)(C, {
                                  show: n >= 5,
                                  children: [
                                    "Thay cận: ",
                                    (0, t.jsx)(b.InlineMath, {
                                      math: "\\left[x^2+x\\right]_0^1=2",
                                    }),
                                  ],
                                }),
                                n < 5 &&
                                  (0, t.jsx)("span", {
                                    className: "inline-block h-4",
                                  }),
                              ],
                            }),
                            (0, t.jsxs)("td", {
                              className:
                                "border border-black px-2 py-1 text-center",
                              children: [
                                (0, t.jsx)(T, {
                                  show: n >= 5,
                                  children: "0,5",
                                }),
                                n < 5 &&
                                  (0, t.jsx)("span", {
                                    className: "inline-block h-4",
                                  }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          }),
        }),
      });
    }
    function W() {
      return (0, t.jsxs)("section", {
        "aria-labelledby": "hero-title",
        className:
          "mx-auto grid w-full max-w-(--page-max) items-center gap-12 px-(--gutter) pt-14 pb-16 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:pb-24",
        children: [
          (0, t.jsxs)("div", {
            children: [
              (0, t.jsx)("h1", {
                id: "hero-title",
                className:
                  "font-display text-[2.75rem] leading-[1.08] font-medium tracking-tight text-balance sm:text-6xl",
                children: "Mô tả đề bạn cần AI soạn bản đầu tiên.",
              }),
              (0, t.jsx)("p", {
                className:
                  "mt-5 max-w-[34rem] text-lg leading-relaxed text-[#5f5e5b]",
                children:
                  "Soạn đề mới, chỉnh số liệu, chuyển ảnh đề thành văn bản và làm đáp án cùng barem chấm điểm. Tất cả sẽ được trợ lý AI hỗ trợ xử lý một cách mượt mà để bạn tập trung chỉnh sửa những phần khó nhất.",
              }),
              (0, t.jsx)("div", {
                className: "mt-8",
                children: (0, t.jsx)(o.CreateExamButton, {}),
              }),
            ],
          }),
          (0, t.jsx)(G, {}),
        ],
      });
    }
    function K({ title: e, body: n, visual: i, flip: s }) {
      return (0, t.jsxs)("article", {
        className:
          "grid items-center gap-8 py-12 first:pt-0 last:pb-0 lg:grid-cols-2 lg:gap-16",
        children: [
          (0, t.jsxs)("div", {
            className: (0, h.cn)(s && "lg:order-2"),
            children: [
              (0, t.jsx)("h3", {
                className:
                  "max-w-md text-2xl leading-snug font-semibold tracking-tight text-balance",
                children: e,
              }),
              (0, t.jsx)("p", {
                className:
                  "mt-3 max-w-md text-base leading-relaxed text-[#5f5e5b]",
                children: n,
              }),
            ],
          }),
          (0, t.jsx)("div", {
            className: (0, h.cn)(s && "lg:order-1"),
            children: i,
          }),
        ],
      });
    }
    e.s(
      [
        "LandingPage",
        0,
        function () {
          return (0, t.jsx)(d, {
            reducedMotion: "user",
            children: (0, t.jsxs)("div", {
              className: "text-[#37352f]",
              children: [
                (0, t.jsx)(W, {}),
                (0, t.jsx)("section", {
                  "aria-labelledby": "ai-title",
                  className: "border-t border-[#e9e9e7] bg-[#f7f6f3]/60",
                  children: (0, t.jsxs)("div", {
                    className:
                      "mx-auto w-full max-w-(--page-max) px-(--gutter) py-16 sm:py-24",
                    children: [
                      (0, t.jsx)("h2", {
                        id: "ai-title",
                        className:
                          "font-display max-w-2xl text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl",
                        children: "Những việc AI có thể hỗ trợ bạn khi soạn đề",
                      }),
                      (0, t.jsxs)("div", {
                        className: "mt-10 divide-y divide-[#e9e9e7] sm:mt-12",
                        children: [
                          (0, t.jsx)(K, {
                            title: "Soạn đề từ một lời mô tả",
                            body: "Nói bạn cần đề gì: môn, lớp, chương, số câu, dạng câu. AI sẽ soạn thẳng một đề trên trang A4, kèm công thức và hình vẽ, để bạn đọc và chỉnh sửa tiếp.",
                            visual: (0, t.jsx)(U, {}),
                          }),
                          (0, t.jsx)(K, {
                            flip: !0,
                            title:
                              "Chỉnh số liệu trong bài chỉ bằng một câu nhắn",
                            body: "Đổi hàm số, đổi con số hay đổi sang một câu tương tự. AI chỉ sửa đúng phần bạn nói, những câu còn lại giữ nguyên.",
                            visual: (0, t.jsx)(F, {}),
                          }),
                          (0, t.jsx)(K, {
                            title: "Chuyển ảnh đề thi thành văn bản để sửa",
                            body: "Chụp đề giấy hoặc tải ảnh lên. AI chép lại chữ và công thức, dựng lại hình vẽ, rồi đưa vào trình soạn để bạn sửa như một tài liệu bình thường.",
                            visual: (0, t.jsx)(q, {}),
                          }),
                          (0, t.jsx)(K, {
                            flip: !0,
                            title:
                              "Làm đáp án và cách chấm điểm cho đề bạn tải lên",
                            body: "Tải đề dưới dạng ảnh hoặc tệp như Word, TXT, Markdown, JSON. AI giải từng câu và viết đáp án cùng barem chấm chi tiết.",
                            visual: (0, t.jsx)(D, {}),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                (0, t.jsxs)("section", {
                  "aria-labelledby": "editor-title",
                  className:
                    "mx-auto w-full max-w-(--page-max) px-(--gutter) py-16 sm:py-24",
                  children: [
                    (0, t.jsx)("h2", {
                      id: "editor-title",
                      className:
                        "font-display max-w-2xl text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl",
                      children: "Hoàn thiện đề trong trình soạn đầy đủ",
                    }),
                    (0, t.jsx)("ul", {
                      className:
                        "mt-10 grid gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[#e9e9e7]",
                      children: [
                        {
                          icon: i.Shapes,
                          title: "Công thức, đồ thị, hình học",
                          body: "Gõ công thức, nhập hàm số để có đồ thị, vẽ bảng biến thiên và hình học ngay trong đề.",
                        },
                        {
                          icon: n.Download,
                          title: "Xuất Word và in đề thi",
                          body: "Trang chia theo khổ A4 khi bạn soạn, chỗ ngắt trang trên màn hình cũng là chỗ ngắt trong file Word và bản in.",
                        },
                        {
                          icon: s.UsersRound,
                          title: "Đề thi được chia sẻ",
                          body: "Tìm đề theo môn và lớp, sao về trình soạn để chỉnh theo ý, hoặc chia sẻ đề của bạn.",
                        },
                      ].map((e) =>
                        (0, t.jsxs)(
                          "li",
                          {
                            className: "sm:px-8 sm:first:pl-0 sm:last:pr-0",
                            children: [
                              (0, t.jsx)(e.icon, {
                                "aria-hidden": !0,
                                className: "size-5 text-[#787774]",
                              }),
                              (0, t.jsx)("h3", {
                                className: "mt-3 text-base font-semibold",
                                children: e.title,
                              }),
                              (0, t.jsx)("p", {
                                className:
                                  "mt-1.5 text-[15px] leading-relaxed text-[#5f5e5b]",
                                children: e.body,
                              }),
                            ],
                          },
                          e.title,
                        ),
                      ),
                    }),
                  ],
                }),
              ],
            }),
          });
        },
      ],
      246988,
    );
  },
  88653,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(271645),
      i = e.i(231178),
      s = e.i(947414),
      r = e.i(674008),
      a = e.i(821476),
      l = e.i(772846),
      c = n,
      d = e.i(737806);
    function h(e, t) {
      if ("function" == typeof e) return e(t);
      null != e && (e.current = t);
    }
    class o extends c.Component {
      getSnapshotBeforeUpdate(e) {
        let t = this.props.childRef.current;
        if (
          (0, l.isHTMLElement)(t) &&
          e.isPresent &&
          !this.props.isPresent &&
          !1 !== this.props.pop
        ) {
          let e = t.offsetParent,
            n = ((0, l.isHTMLElement)(e) && e.offsetWidth) || 0,
            i = ((0, l.isHTMLElement)(e) && e.offsetHeight) || 0,
            s = getComputedStyle(t),
            r = this.props.sizeRef.current;
          ((r.height = parseFloat(s.height)),
            (r.width = parseFloat(s.width)),
            (r.top = t.offsetTop),
            (r.left = t.offsetLeft),
            (r.right = n - r.width - r.left),
            (r.bottom = i - r.height - r.top),
            (r.direction = s.direction));
        }
        return null;
      }
      componentDidUpdate() {}
      render() {
        return this.props.children;
      }
    }
    function x({
      children: e,
      isPresent: i,
      anchorX: s,
      anchorY: r,
      root: a,
      pop: l,
    }) {
      let m = (0, c.useId)(),
        u = (0, c.useRef)(null),
        p = (0, c.useRef)({
          width: 0,
          height: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          direction: "ltr",
        }),
        { nonce: g } = (0, c.useContext)(d.MotionConfigContext),
        f = (function (...e) {
          return n.useCallback(
            (function (...e) {
              return (t) => {
                let n = !1,
                  i = e.map((e) => {
                    let i = h(e, t);
                    return (n || "function" != typeof i || (n = !0), i);
                  });
                if (n)
                  return () => {
                    for (let t = 0; t < i.length; t++) {
                      let n = i[t];
                      "function" == typeof n ? n() : h(e[t], null);
                    }
                  };
              };
            })(...e),
            e,
          );
        })(u, !1 !== l ? (e.props?.ref ?? e?.ref) : void 0);
      return (
        (0, c.useInsertionEffect)(() => {
          let {
            width: e,
            height: t,
            top: n,
            left: c,
            right: d,
            bottom: h,
            direction: o,
          } = p.current;
          if (i || !1 === l || !u.current || !e || !t) return;
          let x = "rtl" === o,
            f =
              "left" === s
                ? x
                  ? `right: ${d}`
                  : `left: ${c}`
                : x
                  ? `left: ${c}`
                  : `right: ${d}`,
            b = "bottom" === r ? `bottom: ${h}` : `top: ${n}`;
          u.current.dataset.motionPopId = m;
          let j = document.createElement("style");
          g && (j.nonce = g);
          let y = a ?? document.head;
          return (
            y.appendChild(j),
            j.sheet &&
              j.sheet.insertRule(`
          [data-motion-pop-id="${m}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${t}px !important;
            ${f}px !important;
            ${b}px !important;
          }
        `),
            () => {
              (u.current?.removeAttribute("data-motion-pop-id"),
                y.contains(j) && y.removeChild(j));
            }
          );
        }, [i]),
        (0, t.jsx)(o, {
          isPresent: i,
          childRef: u,
          sizeRef: p,
          pop: l,
          children: !1 === l ? e : c.cloneElement(e, { ref: f }),
        })
      );
    }
    let m = ({
      children: e,
      initial: i,
      isPresent: l,
      onExitComplete: c,
      custom: d,
      presenceAffectsLayout: h,
      mode: o,
      anchorX: m,
      anchorY: p,
      root: g,
    }) => {
      let f = (0, s.useConstant)(u),
        b = (0, n.useId)(),
        j = (0, n.useRef)(l),
        y = (0, n.useRef)(c);
      (0, r.useIsomorphicLayoutEffect)(() => {
        ((j.current = l), (y.current = c));
      });
      let v = !0,
        w = (0, n.useMemo)(
          () => (
            (v = !1),
            {
              id: b,
              initial: i,
              isPresent: l,
              custom: d,
              onExitComplete: (e) => {
                for (let t of (f.set(e, !0), f.values())) if (!t) return;
                c && c();
              },
              register: (e) => (
                f.set(e, !1),
                () => {
                  (f.delete(e), j.current || f.size || y.current?.());
                }
              ),
            }
          ),
          [l, f, c],
        );
      return (
        h && v && (w = { ...w }),
        (0, n.useMemo)(() => {
          f.forEach((e, t) => f.set(t, !1));
        }, [l]),
        n.useEffect(() => {
          l || f.size || !c || c();
        }, [l]),
        (e = (0, t.jsx)(x, {
          pop: "popLayout" === o,
          isPresent: l,
          anchorX: m,
          anchorY: p,
          root: g,
          children: e,
        })),
        (0, t.jsx)(a.PresenceContext.Provider, { value: w, children: e })
      );
    };
    function u() {
      return new Map();
    }
    var p = e.i(464978);
    let g = (e) => e.key || "";
    function f(e) {
      let t = [];
      return (
        n.Children.forEach(e, (e) => {
          (0, n.isValidElement)(e) && t.push(e);
        }),
        t
      );
    }
    e.s(
      [
        "AnimatePresence",
        0,
        ({
          children: e,
          custom: a,
          initial: l = !0,
          onExitComplete: c,
          presenceAffectsLayout: d = !0,
          mode: h = "sync",
          propagate: o = !1,
          anchorX: x = "left",
          anchorY: u = "top",
          root: b,
        }) => {
          let [j, y] = (0, p.usePresence)(o),
            v = (0, n.useMemo)(() => f(e), [e]),
            w = o && !j ? [] : v.map(g),
            N = (0, n.useRef)(!0),
            k = (0, s.useConstant)(() => new Map()),
            M = (0, n.useRef)(new Set()),
            [I, C] = (0, n.useState)(v),
            [T, A] = (0, n.useState)(v);
          ((0, r.useIsomorphicLayoutEffect)(() => {
            !o || j || T.length || y?.();
          }, [j, o, T.length, y]),
            (0, r.useIsomorphicLayoutEffect)(() => {
              N.current = !1;
              for (let e = 0; e < T.length; e++) {
                let t = g(T[e]);
                w.includes(t)
                  ? (k.delete(t), M.current.delete(t))
                  : !0 !== k.get(t) && k.set(t, !1);
              }
            }, [T, w.length, w.join("-")]));
          let P = [];
          if (v !== I) {
            let e = [...v],
              t = 0;
            for (let n of T) {
              let i = w.indexOf(g(n));
              -1 === i
                ? (e.splice(t++, 0, n), P.push(n))
                : (t = i + P.length + 1);
            }
            return (
              P.every((e) => k.get(g(e))) ? (e = v) : "wait" === h && (e = P),
              A(f(e)),
              C(v),
              null
            );
          }
          let { forceRender: R } = (0, n.useContext)(i.LayoutGroupContext);
          return (0, t.jsx)(t.Fragment, {
            children: T.map((e) => {
              let n = g(e),
                i = (!o || !!j) && (v === T || w.includes(n));
              return (0, t.jsx)(
                m,
                {
                  isPresent: i,
                  initial: (!N.current || !!l) && void 0,
                  custom: a,
                  presenceAffectsLayout: d,
                  mode: h,
                  root: b,
                  onExitComplete: i
                    ? void 0
                    : () => {
                        if (M.current.has(n) || !k.has(n)) return;
                        (M.current.add(n), k.set(n, !0));
                        let e = !0;
                        (k.forEach((t) => {
                          t || (e = !1);
                        }),
                          e && (R?.(), C([]), o && y?.(), c && c()));
                      },
                  anchorX: x,
                  anchorY: u,
                  children: e,
                },
                n,
              );
            }),
          });
        },
      ],
      88653,
    );
  },
  772328,
  (e) => {
    "use strict";
    e.i(247167);
    var t = e.i(571164),
      n = e.i(138544),
      i = e.i(271645);
    e.s([
      "useReducedMotion",
      0,
      function () {
        t.hasReducedMotionListener.current || (0, n.initPrefersReducedMotion)();
        let [e] = (0, i.useState)(t.prefersReducedMotion.current);
        return e;
      },
    ]);
  },
  768877,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("arrow-right", [
      ["path", { d: "M5 12h14", key: "1ays0h" }],
      ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }],
    ]);
    e.s(["ArrowRight", 0, t], 768877);
  },
  96892,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("arrow-up", [
      ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
      ["path", { d: "M12 19V5", key: "x0mq9r" }],
    ]);
    e.s(["ArrowUp", 0, t], 96892);
  },
  762368,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("download", [
      ["path", { d: "M12 15V3", key: "m9g1x1" }],
      [
        "path",
        { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" },
      ],
      ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }],
    ]);
    e.s(["Download", 0, t], 762368);
  },
  226091,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("file-text", [
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
    e.s(["FileText", 0, t], 226091);
  },
  675849,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("image", [
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
    e.s(["default", 0, t]);
  },
  770990,
  (e) => {
    "use strict";
    var t = e.i(675849);
    e.s(["ImageIcon", () => t.default]);
  },
  64801,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("paperclip", [
      [
        "path",
        {
          d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
          key: "1miecu",
        },
      ],
    ]);
    e.s(["Paperclip", 0, t], 64801);
  },
  660011,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("shapes", [
      [
        "path",
        {
          d: "M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z",
          key: "1bo67w",
        },
      ],
      [
        "rect",
        { x: "3", y: "14", width: "7", height: "7", rx: "1", key: "1bkyp8" },
      ],
      ["circle", { cx: "17.5", cy: "17.5", r: "3.5", key: "w3z12y" }],
    ]);
    e.s(["Shapes", 0, t], 660011);
  },
  988771,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("users-round", [
      ["path", { d: "M18 21a8 8 0 0 0-16 0", key: "3ypg7q" }],
      ["circle", { cx: "10", cy: "8", r: "5", key: "o932ke" }],
      [
        "path",
        { d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3", key: "10s06x" },
      ],
    ]);
    e.s(["UsersRound", 0, t], 988771);
  },
]);
