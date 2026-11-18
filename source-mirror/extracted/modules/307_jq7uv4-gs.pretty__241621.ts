// Reconstructed from 307_jq7uv4-gs.pretty.js, module 241621.
// deps: m843476, m522016, m618566, m271645, m484308, m456420, m632781, m77071, m609374, m573474, m167881, m970065, m330009, m671428, m389567, m715760, m725678, m775691, m307591, m366499, m376287, m464527, m695327, m552097
// exports: SlideDecksPage
export { function () { let { user: e, ready: a } = (0, k.useSessionUser)(); return a ? e ? (0, t.jsx)(w, {}, e.id) : (0, t.jsxs)("div", { className: "mx-auto w-full max-w-[720px] px-(--gutter) py-24 text-center", children: [ (0, t.jsx)(d.Presentation, { "aria-hidden": !0, className: "mx-auto size-10 text-[#9b9a97]", }), (0, t.jsx)("h1", { className: "font-display mt-4 text-3xl font-medium tracking-tight", children: "Slide bài giảng", }), (0, t.jsxs)("p", { className: "mt-2 text-[15px] text-[#787774]", children: [ "Đăng nhập để soạn slide với trợ lý AI. Bộ slide lưu trong tài khoản, mở được trên mọi máy.", (0, v.hasLocalDecks)() && " Các bộ slide bạn đã soạn trên trình duyệt này sẽ tự chuyển vào tài khoản.", ], }), (0, t.jsx)(u.Button, { className: "mt-6", onClick: () => (0, y.requestLogin)(), children: "Đăng nhập ngay", }), ], }) : (0, t.jsx)("div", { className: "mx-auto w-full max-w-(--page-max) px-(--gutter) py-12", "aria-busy": !0, children: (0, t.jsx)(m.Skeleton, { className: "h-10 w-64" }), }); } as "SlideDecksPage" };

"use strict";
    var t = m843476,
      a = m522016,
      i = m618566,
      r = m271645,
      n = m484308;
    let s = (0, m456420.default)("file-up", [
      [
        "path",
        {
          d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
          key: "1oefj6",
        },
      ],
      ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
      ["path", { d: "M12 12v6", key: "3ahymv" }],
      ["path", { d: "m15 15-3-3-3 3", key: "15xj92" }],
    ]);
    var l = m632781,
      o = m77071,
      d = m609374,
      c = m573474,
      u = m167881,
      p = m970065,
      g = m330009,
      m = m671428,
      f = m389567,
      h = m715760,
      x = m725678,
      y = m775691,
      k = m307591,
      D = m366499,
      j = m376287,
      v = m464527,
      A = m695327,
      b = m552097;
    function w() {
      let k = (0, i.useRouter)(),
        [w, S] = (0, r.useState)(null),
        [N, C] = (0, r.useState)(null),
        [T, I] = (0, r.useState)(!1),
        [P, z] = (0, r.useState)(""),
        [O, $] = (0, r.useState)(null),
        E = (0, r.useRef)(null),
        R = (0, r.useCallback)(async () => {
          try {
            S((await (0, x.listSlideDecks)()).decks);
          } catch (e) {
            (z((0, h.formatApiError)(e)),
              e instanceof h.ApiError &&
                401 === e.status &&
                (0, y.requestLogin)());
          }
        }, []);
      (0, r.useEffect)(() => {
        let e = !1;
        return (
          (async () => {
            if ((0, v.hasLocalDecks)()) {
              $("Đang chuyển các bộ slide trên trình duyệt này vào tài khoản…");
              let { moved: t, error: a } = await (0, v.migrateLocalDecks)();
              if (e) return;
              $(
                a
                  ? `Đ\xe3 chuyển ${t} bộ slide v\xe0o t\xe0i khoản; phần c\xf2n lại chưa chuyển được (${(0, h.formatApiError)(a)}) - vẫn nằm trong tr\xecnh duyệt, sẽ thử lại lần sau.`
                  : t
                    ? `Đ\xe3 chuyển ${t} bộ slide từ tr\xecnh duyệt n\xe0y v\xe0o t\xe0i khoản của bạn.`
                    : null,
              );
            }
            e || (await R());
          })(),
          () => {
            e = !0;
          }
        );
      }, [R]);
      let J = async (e, t) => {
          (I(!0), z(""));
          try {
            let a = await e();
            ((0, f.track)("slide_create", { source: t }),
              k.push(`/slides/${a}`));
          } catch (e) {
            (z((0, h.formatApiError)(e)),
              e instanceof h.ApiError &&
                401 === e.status &&
                (0, y.requestLogin)(),
              I(!1));
          }
        },
        M = () => void J(() => (0, v.uploadDeck)((0, D.createDeck)()), "blank"),
        U = w ? w.length > 0 : !!P,
        L = T
          ? (0, t.jsx)(l.Loader2, { className: "animate-spin" })
          : (0, t.jsx)(o.Plus, {});
      return (0, t.jsxs)(t.Fragment, {
        children: [
          (0, t.jsxs)("div", {
            className:
              "mx-auto w-full max-w-(--page-max) px-(--gutter) pt-8 pb-28 sm:pt-12",
            children: [
              (0, t.jsxs)("div", {
                className:
                  "mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4",
                children: [
                  (0, t.jsxs)("div", {
                    children: [
                      (0, t.jsx)("h1", {
                        className:
                          "font-display text-4xl leading-none font-semibold tracking-tight text-[#37352f] sm:text-[2.75rem]",
                        children: "Slide bài giảng",
                      }),
                      (0, t.jsx)("p", {
                        className:
                          "mt-3 max-w-[62ch] text-[15px] text-[#787774]",
                        children:
                          "Trợ lý AI lập dàn ý, dựng slide, rồi trình chiếu ngay bài giảng cho bạn.",
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className: "flex gap-2",
                    children: [
                      (0, t.jsx)("input", {
                        ref: E,
                        type: "file",
                        accept:
                          ".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation,.ppt,.json,application/json",
                        className: "hidden",
                        onChange: async (t) => {
                          let a = t.target.files?.[0];
                          if (((t.target.value = ""), a)) {
                            if (/\.ppt$/i.test(a.name))
                              return void z(
                                "Tệp .ppt đời cũ chưa đọc được - hãy mở bằng PowerPoint và lưu lại thành .pptx.",
                              );
                            if (/\.pptx$/i.test(a.name)) {
                              ($("Đang đọc tệp PowerPoint và tải ảnh lên…"),
                                J(async () => {
                                  try {
                                    let [
                                        { importPptx: t, skippedSummary: i },
                                        { storeImportedImage: r },
                                      ] = await Promise.all([
                                        e.A(803505),
                                        e.A(535847),
                                      ]),
                                      { deck: n, skipped: s } = await t(
                                        await a.arrayBuffer(),
                                        {
                                          title: a.name.replace(/\.pptx$/i, ""),
                                          storeImage: r,
                                        },
                                      ),
                                      l = await (0, v.uploadDeck)(n),
                                      o = i(s);
                                    return (
                                      (0, A.rememberImportNotice)(
                                        l,
                                        o
                                          ? {
                                              message: `Đ\xe3 nhập ${n.slides.length} slide từ PowerPoint. ${o}`,
                                              tone: "error",
                                            }
                                          : {
                                              message: `Đ\xe3 nhập ${n.slides.length} slide từ PowerPoint.`,
                                              tone: "done",
                                            },
                                      ),
                                      l
                                    );
                                  } finally {
                                    $(null);
                                  }
                                }, "pptx"));
                              return;
                            }
                            try {
                              let e = (0, D.normalizeDeck)(
                                JSON.parse(await a.text()),
                              );
                              if (!e) throw Error();
                              J(
                                () =>
                                  (0, v.uploadDeck)({
                                    ...e,
                                    updatedAt: new Date().toISOString(),
                                  }),
                                "import",
                              );
                            } catch {
                              z(
                                "Tệp không đọc được - hãy chọn tệp PowerPoint (.pptx) hoặc tệp bài giảng (.json) đã lưu từ soandethi.com.",
                              );
                            }
                          }
                        },
                      }),
                      (0, t.jsxs)(u.Button, {
                        variant: "outline",
                        disabled: T,
                        onClick: () => E.current?.click(),
                        title:
                          "Tệp PowerPoint (.pptx) hoặc tệp bài giảng (.json) đã lưu từ soandethi.com",
                        children: [(0, t.jsx)(s, {}), " Tải bài giảng lên"],
                      }),
                      U &&
                        (0, t.jsxs)(u.Button, {
                          disabled: T,
                          onClick: M,
                          children: [L, " Tạo bài giảng mới"],
                        }),
                    ],
                  }),
                ],
              }),
              O &&
                (0, t.jsxs)("p", {
                  role: "status",
                  className:
                    "mb-4 flex items-center gap-2 rounded-lg bg-[#f1f7fd] px-3 py-2 text-sm text-[#1d5d99]",
                  children: [
                    (0, t.jsx)(n.CloudUpload, { className: "size-4 shrink-0" }),
                    " ",
                    O,
                  ],
                }),
              P &&
                (0, t.jsx)("p", {
                  role: "alert",
                  className: "mb-4 text-sm text-[#eb5757]",
                  children: P,
                }),
              !w &&
                !P &&
                (0, t.jsx)("ul", {
                  className:
                    "grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(288px,1fr))]",
                  "aria-busy": !0,
                  children: [0, 1, 2].map((e) =>
                    (0, t.jsx)(
                      "li",
                      {
                        children: (0, t.jsx)(m.Skeleton, {
                          className: "aspect-video w-full rounded-xl",
                        }),
                      },
                      e,
                    ),
                  ),
                }),
              w &&
                0 === w.length &&
                (0, t.jsxs)(p.Card, {
                  className:
                    "flex flex-col items-center gap-3 border-dashed px-6 py-14 text-center",
                  children: [
                    (0, t.jsx)(d.Presentation, {
                      className: "size-10 text-[#9b9a97]",
                    }),
                    (0, t.jsx)("p", {
                      className: "text-base font-medium text-[#37352f]",
                      children: "Chưa có bộ slide nào",
                    }),
                    (0, t.jsx)("p", {
                      className: "max-w-md text-sm text-neutral-500",
                      children:
                        "Tạo bài giảng mới rồi đính kèm tài liệu (Word, PDF…) vào ô trợ lý AI để có bộ slide đầu tiên.",
                    }),
                    (0, t.jsxs)(u.Button, {
                      disabled: T,
                      onClick: M,
                      children: [L, " Tạo bài giảng mới"],
                    }),
                  ],
                }),
              (0, t.jsx)("ul", {
                className:
                  "grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(288px,1fr))]",
                children: w?.map((e) => {
                  let i = (0, v.previewDeck)(e);
                  return (0, t.jsxs)(
                    "li",
                    {
                      className: "group relative",
                      children: [
                        (0, t.jsxs)(a.default, {
                          href: `/slides/${e.id}`,
                          className:
                            "block overflow-hidden rounded-xl ring-1 ring-black/10 transition-shadow hover:shadow-md",
                          children: [
                            i &&
                              (0, t.jsx)(b.SlideView, {
                                slide: i.slides[0],
                                theme: i.theme,
                                scale: 288 / j.SLIDE_WIDTH,
                                still: !0,
                                className: "pointer-events-none !w-full",
                              }),
                            (0, t.jsxs)("div", {
                              className: "border-t border-[#efefed] px-3 py-2",
                              children: [
                                (0, t.jsx)("p", {
                                  className:
                                    "truncate text-sm font-medium text-[#37352f]",
                                  children: e.title,
                                }),
                                (0, t.jsxs)("p", {
                                  className: "text-xs text-neutral-500",
                                  children: [
                                    e.slideCount,
                                    " slide · ",
                                    new Date(e.updatedAt).toLocaleDateString(
                                      "vi-VN",
                                    ),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, t.jsx)(u.Button, {
                          variant: "ghost",
                          size: "icon-sm",
                          "aria-label": `Xo\xe1 ${e.title}`,
                          onClick: () => C(e),
                          className:
                            "absolute right-2 top-2 bg-white/90 opacity-0 shadow-sm group-hover:opacity-100 focus-visible:opacity-100",
                          children: (0, t.jsx)(c.Trash2, {
                            className: "text-[#eb5757]",
                          }),
                        }),
                      ],
                    },
                    e.id,
                  );
                }),
              }),
            ],
          }),
          (0, t.jsx)(g.AlertDialog, {
            open: !!N,
            onOpenChange: (e) => !e && C(null),
            children: (0, t.jsxs)(g.AlertDialogContent, {
              children: [
                (0, t.jsxs)(g.AlertDialogHeader, {
                  children: [
                    (0, t.jsx)(g.AlertDialogTitle, {
                      children: "Xoá bài giảng?",
                    }),
                    (0, t.jsxs)(g.AlertDialogDescription, {
                      children: [
                        "“",
                        N?.title,
                        "” sẽ bị xoá khỏi tài khoản và không khôi phục được.",
                      ],
                    }),
                  ],
                }),
                (0, t.jsxs)(g.AlertDialogFooter, {
                  children: [
                    (0, t.jsx)(g.AlertDialogCancel, { children: "Huỷ" }),
                    (0, t.jsx)(g.AlertDialogAction, {
                      onClick: () => {
                        (C(null),
                          N &&
                            (S((e) => e?.filter((e) => e.id !== N.id) ?? null),
                            (0, x.deleteSlideDeck)(N.id).catch((e) => {
                              (z((0, h.formatApiError)(e)), R());
                            })));
                      },
                      children: "Xoá",
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      });
    }
    ;
