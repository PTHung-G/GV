(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  781947,
  (e) => {
    "use strict";
    var t = e.i(843476),
      s = e.i(225913),
      a = e.i(647163);
    let i = (0, s.cva)(
      "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
      {
        variants: {
          variant: {
            default: "bg-card text-card-foreground",
            destructive:
              "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current",
          },
        },
        defaultVariants: { variant: "default" },
      },
    );
    e.s([
      "Alert",
      0,
      function ({ className: e, variant: s, ...l }) {
        return (0, t.jsx)("div", {
          "data-slot": "alert",
          role: "alert",
          className: (0, a.cn)(i({ variant: s }), e),
          ...l,
        });
      },
      "AlertDescription",
      0,
      function ({ className: e, ...s }) {
        return (0, t.jsx)("div", {
          "data-slot": "alert-description",
          className: (0, a.cn)(
            "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
            e,
          ),
          ...s,
        });
      },
      "AlertTitle",
      0,
      function ({ className: e, ...s }) {
        return (0, t.jsx)("div", {
          "data-slot": "alert-title",
          className: (0, a.cn)(
            "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
            e,
          ),
          ...s,
        });
      },
    ]);
  },
  62870,
  (e) => {
    "use strict";
    var t = e.i(843476),
      s = e.i(179862),
      a = e.i(593698),
      i = e.i(26495),
      i = i,
      l = e.i(144716),
      l = l,
      n = e.i(129402),
      n = n;
    function r({ className: e, ...a }) {
      return (0, t.jsx)(n.ScrollUpButton, {
        "data-slot": "select-scroll-up-button",
        className: (0, s.cn)(
          "flex cursor-default items-center justify-center py-1",
          e,
        ),
        ...a,
        children: (0, t.jsx)(l.default, { className: "size-4" }),
      });
    }
    function d({ className: e, ...a }) {
      return (0, t.jsx)(n.ScrollDownButton, {
        "data-slot": "select-scroll-down-button",
        className: (0, s.cn)(
          "flex cursor-default items-center justify-center py-1",
          e,
        ),
        ...a,
        children: (0, t.jsx)(i.default, { className: "size-4" }),
      });
    }
    e.s(
      [
        "Select",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(n.Root, { "data-slot": "select", ...e });
        },
        "SelectContent",
        0,
        function ({
          className: e,
          children: a,
          position: i = "item-aligned",
          align: l = "center",
          ...c
        }) {
          return (0, t.jsx)(n.Portal, {
            children: (0, t.jsxs)(n.Content, {
              "data-slot": "select-content",
              className: (0, s.cn)(
                "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                "popper" === i &&
                  "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                e,
              ),
              position: i,
              align: l,
              ...c,
              children: [
                (0, t.jsx)(r, {}),
                (0, t.jsx)(n.Viewport, {
                  className: (0, s.cn)(
                    "p-1",
                    "popper" === i &&
                      "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
                  ),
                  children: a,
                }),
                (0, t.jsx)(d, {}),
              ],
            }),
          });
        },
        "SelectItem",
        0,
        function ({ className: e, children: i, ...l }) {
          return (0, t.jsxs)(n.Item, {
            "data-slot": "select-item",
            className: (0, s.cn)(
              "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
              e,
            ),
            ...l,
            children: [
              (0, t.jsx)("span", {
                "data-slot": "select-item-indicator",
                className:
                  "absolute right-2 flex size-3.5 items-center justify-center",
                children: (0, t.jsx)(n.ItemIndicator, {
                  children: (0, t.jsx)(a.CheckIcon, { className: "size-4" }),
                }),
              }),
              (0, t.jsx)(n.ItemText, { children: i }),
            ],
          });
        },
        "SelectTrigger",
        0,
        function ({ className: e, size: a = "default", children: l, ...r }) {
          return (0, t.jsxs)(n.Trigger, {
            "data-slot": "select-trigger",
            "data-size": a,
            className: (0, s.cn)(
              "flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
              e,
            ),
            ...r,
            children: [
              l,
              (0, t.jsx)(n.Icon, {
                asChild: !0,
                children: (0, t.jsx)(i.default, {
                  className: "size-4 opacity-50",
                }),
              }),
            ],
          });
        },
        "SelectValue",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(n.Value, { "data-slot": "select-value", ...e });
        },
      ],
      62870,
    );
  },
  671428,
  (e) => {
    "use strict";
    var t = e.i(843476),
      s = e.i(179862);
    e.s([
      "Skeleton",
      0,
      function ({ className: e, ...a }) {
        return (0, t.jsx)("div", {
          "data-slot": "skeleton",
          className: (0, s.cn)("animate-pulse rounded-md bg-accent", e),
          ...a,
        });
      },
    ]);
  },
  218842,
  (e) => {
    "use strict";
    var t = e.i(843476),
      s = e.i(508734),
      a = e.i(522016),
      i = e.i(63270),
      l = e.i(140979),
      n = e.i(263662),
      r = e.i(647163),
      d = e.i(216978);
    function c(e, t) {
      return (s) => {
        ((0, l.rememberExams)([e]),
          !t ||
            s.metaKey ||
            s.ctrlKey ||
            s.shiftKey ||
            0 !== s.button ||
            (s.preventDefault(), t(e)));
      };
    }
    let o = "sm:grid-cols-[minmax(0,1fr)_96px_72px_170px_112px]";
    e.s([
      "CARD_COLUMNS",
      0,
      "w-full min-[520px]:mx-auto min-[520px]:w-[calc(round(down,100%_+_20px,230px)_-_20px)]",
      "CARD_GRID",
      0,
      "grid grid-cols-2 gap-3 min-[520px]:grid-cols-[repeat(auto-fill,210px)] min-[520px]:gap-5",
      "PUBLIC_CARD_SKELETON",
      0,
      "aspect-[210/390] w-full rounded",
      "PublicExamCard",
      0,
      function ({ exam: e, subject: l, onOpen: r, showAuthor: o = !0 }) {
        let x = Number(e.metadata?.grade) || 0;
        return (0, t.jsxs)(a.default, {
          href: (0, n.examPath)(e),
          prefetch: !1,
          onClick: c(e, r),
          className:
            "flex w-full min-w-0 flex-col overflow-hidden rounded border border-[#c4c7c5] bg-white text-left transition-colors hover:border-[#5f5e5b] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#5f5e5b]",
          children: [
            (0, t.jsx)("div", {
              className: "aspect-[208/263] w-full shrink-0",
              children: (0, t.jsx)(d.DocThumbnail, { excerpt: e.excerpt }),
            }),
            (0, t.jsxs)("div", {
              className:
                "min-w-0 border-t border-[#c4c7c5] pt-4 pr-2 pb-3.5 pl-4 max-[519px]:pt-3 max-[519px]:pb-2.5 max-[519px]:pl-3",
              children: [
                (0, t.jsx)("p", {
                  className:
                    "ml-0.5 line-clamp-2 h-9 pr-1 text-sm leading-[18px] font-medium text-[#1f1f1f]",
                  title: e.title,
                  children: e.title,
                }),
                (0, t.jsxs)("div", {
                  className:
                    "mt-2 flex h-[22px] items-center gap-1 overflow-hidden",
                  children: [
                    l &&
                      (0, t.jsx)("span", {
                        className:
                          "min-w-0 truncate rounded-md bg-[#f1f1ef] px-2 py-[3px] text-xs font-medium text-[#37352f]",
                        title: l,
                        children: l,
                      }),
                    x > 0 &&
                      (0, t.jsxs)("span", {
                        className:
                          "shrink-0 rounded-md bg-[#f1f1ef] px-2 py-[3px] text-xs font-medium text-[#37352f]",
                        children: ["Lớp ", x],
                      }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className:
                    "mt-2.5 flex h-[18px] items-center gap-1.5 pr-2 text-xs text-[#5f5e5b]",
                  children: [
                    o
                      ? (0, t.jsxs)(t.Fragment, {
                          children: [
                            (0, t.jsxs)(i.Avatar, {
                              className: "size-[18px]",
                              children: [
                                (0, t.jsx)(i.AvatarImage, {
                                  src: e.authorAvatarUrl,
                                  alt: "",
                                }),
                                (0, t.jsx)(i.AvatarFallback, {
                                  className:
                                    "bg-[#e7f3f8] text-[10px] text-[#2383e2]",
                                  children: (e.authorName || "?")
                                    .slice(0, 1)
                                    .toUpperCase(),
                                }),
                              ],
                            }),
                            (0, t.jsx)("span", {
                              className: "min-w-0 flex-1 truncate",
                              children: e.authorName || "Người dùng",
                            }),
                          ],
                        })
                      : (0, t.jsx)("span", { className: "flex-1" }),
                    (0, t.jsxs)("span", {
                      className: "flex shrink-0 items-center gap-0.5",
                      title: "Lượt sử dụng đề",
                      children: [
                        (0, t.jsx)(s.Copy, {
                          "aria-hidden": !0,
                          className: "size-3",
                        }),
                        " ",
                        e.copyCount,
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      },
      "PublicExamListHeader",
      0,
      function ({ showAuthor: e = !0 }) {
        return (0, t.jsxs)("div", {
          "aria-hidden": !0,
          className: (0, r.cn)(
            "hidden items-center gap-4 border-b border-[#e9e9e7] px-3 pb-2 text-[13px] font-medium text-[#787774] sm:grid",
            o,
          ),
          children: [
            (0, t.jsx)("span", { children: "Tên đề" }),
            (0, t.jsx)("span", { children: "Môn" }),
            (0, t.jsx)("span", { children: "Lớp" }),
            (0, t.jsx)("span", { children: e ? "Tác giả" : "" }),
            (0, t.jsx)("span", {
              className: "text-right",
              children: "Lượt sử dụng đề",
            }),
          ],
        });
      },
      "PublicExamRow",
      0,
      function ({ exam: e, subject: l, onOpen: d, showAuthor: x = !0 }) {
        let u = Number(e.metadata?.grade) || 0;
        return (0, t.jsxs)(a.default, {
          href: (0, n.examPath)(e),
          prefetch: !1,
          onClick: c(e, d),
          className: (0, r.cn)(
            "grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 rounded-md px-3 py-3 text-left transition-colors hover:bg-[#f7f6f3] focus-visible:outline-2 focus-visible:outline-[#2383e2]",
            o,
          ),
          children: [
            (0, t.jsxs)("span", {
              className: "min-w-0",
              children: [
                (0, t.jsx)("span", {
                  className:
                    "block truncate text-[15px] font-semibold text-[#37352f]",
                  title: e.title,
                  children: e.title,
                }),
                (0, t.jsx)("span", {
                  className:
                    "mt-0.5 block truncate text-[13px] text-[#5f5e5b] sm:hidden",
                  children: [l, u > 0 && `Lớp ${u}`]
                    .filter(Boolean)
                    .join(" · "),
                }),
              ],
            }),
            (0, t.jsx)("span", {
              className: "hidden truncate text-sm text-[#37352f] sm:block",
              children: l,
            }),
            (0, t.jsx)("span", {
              className: "hidden text-sm text-[#37352f] sm:block",
              children: u > 0 ? `Lớp ${u}` : "",
            }),
            (0, t.jsx)("span", {
              className:
                "hidden min-w-0 items-center gap-2 text-[13px] text-[#5f5e5b] sm:flex",
              children:
                x &&
                (0, t.jsxs)(t.Fragment, {
                  children: [
                    (0, t.jsxs)(i.Avatar, {
                      className: "size-5 shrink-0",
                      children: [
                        (0, t.jsx)(i.AvatarImage, {
                          src: e.authorAvatarUrl,
                          alt: "",
                        }),
                        (0, t.jsx)(i.AvatarFallback, {
                          className: "bg-[#e7f3f8] text-[10px] text-[#2383e2]",
                          children: (e.authorName || "?")
                            .slice(0, 1)
                            .toUpperCase(),
                        }),
                      ],
                    }),
                    (0, t.jsx)("span", {
                      className: "truncate",
                      children: e.authorName || "Người dùng",
                    }),
                  ],
                }),
            }),
            (0, t.jsxs)("span", {
              className:
                "flex items-center justify-end gap-1 text-[13px] text-[#5f5e5b]",
              title: "Lượt sử dụng đề",
              children: [
                (0, t.jsx)(s.Copy, { "aria-hidden": !0, className: "size-3" }),
                " ",
                e.copyCount,
              ],
            }),
          ],
        });
      },
    ]);
  },
  310900,
  (e) => {
    "use strict";
    var t = e.i(271645),
      s = e.i(799887);
    let a = null;
    e.s([
      "useMetadataOptions",
      0,
      function () {
        let [e, i] = (0, t.useState)(null),
          [l, n] = (0, t.useState)("");
        return (
          (0, t.useEffect)(() => {
            let e = !0;
            return (
              (a ??= (0, s.getMetadataOptions)().then((e) => e.options))
                .then((t) => e && i(t))
                .catch((t) => {
                  ((a = null), e && n(t.message));
                }),
              () => {
                e = !1;
              }
            );
          }, []),
          { options: e, error: l }
        );
      },
    ]);
  },
  216978,
  (e) => {
    "use strict";
    var t = e.i(843476),
      s = e.i(770703),
      a = e.i(271645),
      i = e.i(647163);
    let l = (0, s.default)(() => e.A(458094).then((e) => e.DocThumbnailPage), {
      loadableGenerated: { modules: [303604] },
      ssr: !1,
    });
    e.s([
      "DocThumbnail",
      0,
      function ({ excerpt: e, className: s }) {
        let n = (0, a.useRef)(null),
          [r, d] = (0, a.useState)(!1);
        (0, a.useEffect)(() => {
          let e = n.current;
          if (!e || r) return;
          let t = new IntersectionObserver(
            (e) => {
              e.some((e) => e.isIntersecting) && d(!0);
            },
            { rootMargin: "200px" },
          );
          return (t.observe(e), () => t.disconnect());
        }, [r]);
        let c = !e?.trim();
        return (0, t.jsxs)("div", {
          ref: n,
          "aria-hidden": !0,
          className: (0, i.cn)(
            "relative h-full w-full overflow-hidden bg-white",
            s,
          ),
          children: [
            c &&
              (0, t.jsx)("div", {
                className: "space-y-1.5 px-4 pt-4",
                children: [90, 70, 80, 60].map((e) =>
                  (0, t.jsx)(
                    "div",
                    {
                      className: "h-1 rounded-full bg-[#eceff1]",
                      style: { width: `${e}%` },
                    },
                    e,
                  ),
                ),
              }),
            r && e && !c && (0, t.jsx)(l, { excerpt: e }),
          ],
        });
      },
    ]);
  },
  151552,
  (e) => {
    "use strict";
    var t = e.i(843476),
      s = e.i(482022),
      a = e.i(226091),
      i = e.i(490985),
      l = e.i(456420);
    let n = (0, l.default)("hard-drive", [
      ["path", { d: "M10 16h.01", key: "1bzywj" }],
      [
        "path",
        {
          d: "M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
          key: "18tbho",
        },
      ],
      ["path", { d: "M21.946 12.013H2.054", key: "zqlbp7" }],
      ["path", { d: "M6 16h.01", key: "1pmjb7" }],
    ]);
    var r = e.i(632781),
      d = e.i(189904);
    let c = (0, l.default)("pencil-line", [
      ["path", { d: "M13 21h8", key: "1jsn5i" }],
      ["path", { d: "m15 5 4 4", key: "1mk7zo" }],
      [
        "path",
        {
          d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
          key: "1a8usu",
        },
      ],
    ]);
    var o = e.i(77071),
      x = e.i(573474),
      u = e.i(522016),
      m = e.i(618566),
      h = e.i(271645),
      p = e.i(781947),
      f = e.i(330009),
      g = e.i(463415),
      b = e.i(287336),
      j = e.i(671428),
      v = e.i(799887),
      y = e.i(42118),
      N = e.i(335073),
      w = e.i(647163),
      k = e.i(218842),
      C = e.i(375727),
      z = e.i(216978),
      S = e.i(504251),
      D = e.i(167881),
      A = e.i(630374),
      L = e.i(23750);
    function M({ doc: e, onClose: s, onRenamed: a }) {
      let [i, l] = (0, h.useState)(e.title),
        [n, d] = (0, h.useState)(!1),
        [c, o] = (0, h.useState)(""),
        x = i.trim(),
        u = x === e.title.trim(),
        m = async (t) => {
          if ((t.preventDefault(), x && !n)) {
            if (u) return void s();
            (d(!0), o(""));
            try {
              let { document: t } = await (0, v.getDocument)(e.id),
                s = await (0, v.saveDocument)(e.id, x, t.content);
              a(s.document, s.storage);
            } catch (e) {
              (o(e instanceof Error ? e.message : "Đã xảy ra lỗi."), d(!1));
            }
          }
        };
      return (0, t.jsx)(A.Dialog, {
        open: !0,
        onOpenChange: (e) => !e && !n && s(),
        children: (0, t.jsx)(A.DialogContent, {
          className: "sm:max-w-[420px]",
          children: (0, t.jsxs)("form", {
            onSubmit: m,
            className: "grid gap-4",
            children: [
              (0, t.jsxs)(A.DialogHeader, {
                children: [
                  (0, t.jsx)(A.DialogTitle, { children: "Đổi tên" }),
                  (0, t.jsx)(A.DialogDescription, {
                    children: "Nhập tên mới cho đề.",
                  }),
                ],
              }),
              (0, t.jsx)(L.Input, {
                autoFocus: !0,
                value: i,
                maxLength: 300,
                onChange: (e) => l(e.target.value),
                onFocus: (e) => e.target.select(),
                disabled: n,
                "aria-label": "Tên đề",
                "aria-invalid": !x || void 0,
              }),
              c &&
                (0, t.jsx)("p", {
                  className: "text-sm text-[#eb5757]",
                  children: c,
                }),
              (0, t.jsxs)(A.DialogFooter, {
                children: [
                  (0, t.jsx)(D.Button, {
                    type: "button",
                    variant: "outline",
                    onClick: s,
                    disabled: n,
                    children: "Huỷ",
                  }),
                  (0, t.jsxs)(D.Button, {
                    type: "submit",
                    disabled: !x || n,
                    children: [
                      n &&
                        (0, t.jsx)(r.Loader2, {
                          "aria-hidden": !0,
                          className: "animate-spin",
                        }),
                      " OK",
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      });
    }
    function T(e) {
      return e instanceof Error ? e.message : "Đã xảy ra lỗi.";
    }
    function _(e) {
      return e
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/gi, "d")
        .toLowerCase();
    }
    let I = {
      recent: (e, t) => t.updatedAt.localeCompare(e.updatedAt),
      oldest: (e, t) => e.createdAt.localeCompare(t.createdAt),
      name: (e, t) => (e.title || "").localeCompare(t.title || "", "vi"),
      size: (e, t) => t.sizeBytes - e.sizeBytes,
    };
    function B({ doc: e, onOpen: a, onRename: l, onShare: n, onRemove: r }) {
      return (0, t.jsxs)(g.DropdownMenu, {
        children: [
          (0, t.jsx)(g.DropdownMenuTrigger, {
            asChild: !0,
            children: (0, t.jsx)("button", {
              type: "button",
              "aria-label": `Tuỳ chọn cho ${e.title}`,
              className:
                "relative z-10 grid size-[30px] shrink-0 place-items-center rounded-full text-[#444746] hover:bg-[#f1f1ef]",
              children: (0, t.jsx)(d.MoreVertical, {
                "aria-hidden": !0,
                className: "size-4",
              }),
            }),
          }),
          (0, t.jsxs)(g.DropdownMenuContent, {
            align: "end",
            children: [
              (0, t.jsxs)(g.DropdownMenuItem, {
                onSelect: a,
                children: [
                  (0, t.jsx)(s.ExternalLink, { "aria-hidden": !0 }),
                  " Mở",
                ],
              }),
              (0, t.jsxs)(g.DropdownMenuItem, {
                onSelect: l,
                children: [(0, t.jsx)(c, { "aria-hidden": !0 }), " Đổi tên"],
              }),
              (0, t.jsxs)(g.DropdownMenuItem, {
                onSelect: n,
                children: [
                  (0, t.jsx)(i.Globe2, { "aria-hidden": !0 }),
                  " Chia sẻ lên cộng đồng",
                ],
              }),
              (0, t.jsx)(g.DropdownMenuSeparator, {}),
              (0, t.jsxs)(g.DropdownMenuItem, {
                variant: "destructive",
                onSelect: r,
                children: [(0, t.jsx)(x.Trash2, { "aria-hidden": !0 }), " Xoá"],
              }),
            ],
          }),
        ],
      });
    }
    function R() {
      return (0, t.jsxs)("svg", {
        "aria-hidden": !0,
        viewBox: "0 0 48 48",
        className: "size-[72px]",
        children: [
          (0, t.jsx)("rect", {
            x: "26",
            y: "21",
            width: "14",
            height: "6",
            fill: "#787774",
          }),
          (0, t.jsx)("rect", {
            x: "21",
            y: "26",
            width: "6",
            height: "14",
            fill: "#b4b3b0",
          }),
          (0, t.jsx)("rect", {
            x: "8",
            y: "21",
            width: "14",
            height: "6",
            fill: "#d6d5d2",
          }),
          (0, t.jsx)("rect", {
            x: "21",
            y: "8",
            width: "6",
            height: "19",
            fill: "#37352f",
          }),
        ],
      });
    }
    function $({
      label: e,
      meta: s,
      href: i,
      onClick: l,
      disabled: n,
      menu: r,
      children: d,
    }) {
      let c = "after:absolute after:inset-0 focus-visible:outline-none";
      return (0, t.jsxs)("div", {
        className: (0, w.cn)(
          "relative flex w-full min-w-0 flex-col overflow-hidden rounded border border-[#c4c7c5] bg-white transition-colors hover:border-[#5f5e5b] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-[#5f5e5b]",
          n && "opacity-60",
        ),
        children: [
          (0, t.jsx)("div", {
            className: "aspect-[208/263] w-full shrink-0",
            children: d,
          }),
          (0, t.jsxs)("div", {
            className:
              "min-w-0 border-t border-[#c4c7c5] pt-4 pr-2 pb-3.5 pl-4 max-[519px]:pt-3 max-[519px]:pb-2.5 max-[519px]:pl-3",
            children: [
              i
                ? (0, t.jsx)(u.default, {
                    href: i,
                    className: (0, w.cn)(
                      "ml-0.5 block truncate pr-1 text-sm leading-[18px] font-medium text-[#1f1f1f]",
                      c,
                    ),
                    title: e,
                    children: e,
                  })
                : (0, t.jsx)("button", {
                    type: "button",
                    onClick: l,
                    disabled: n,
                    className: (0, w.cn)(
                      "ml-0.5 block w-full truncate pr-1 text-left text-sm leading-[18px] font-medium text-[#1f1f1f] disabled:cursor-not-allowed",
                      c,
                    ),
                    children: e,
                  }),
              (0, t.jsxs)("div", {
                className: "mt-0.5 flex h-6 min-w-0 items-center gap-1.5",
                children: [
                  i &&
                    (0, t.jsx)(a.FileText, {
                      "aria-hidden": !0,
                      className: "size-[18px] shrink-0 text-[#787774]",
                      strokeWidth: 1.75,
                    }),
                  (0, t.jsx)("span", {
                    className: "min-w-0 flex-1 truncate text-xs text-[#5e5e5e]",
                    children: s,
                  }),
                  r,
                ],
              }),
            ],
          }),
        ],
      });
    }
    e.s(
      [
        "MyDocuments",
        0,
        function ({
          loadAll: e = !1,
          search: s = "",
          sort: i = "recent",
          view: l = "grid",
          onCount: d,
        }) {
          let c = (0, m.useRouter)(),
            { create: x, creating: g, error: D } = (0, S.useCreateExam)(),
            [A, L] = (0, h.useState)(null),
            [O, E] = (0, h.useState)(0),
            [P, U] = (0, h.useState)(null),
            [F, V] = (0, h.useState)(!1),
            [H, K] = (0, h.useState)(""),
            [G, X] = (0, h.useState)(null),
            [q, Z] = (0, h.useState)(null),
            [W, Y] = (0, h.useState)(null),
            J = (0, h.useCallback)(
              () =>
                (0, v.listDocuments)(e || F ? 200 : 11)
                  .then((e) => {
                    (L(e.documents), E(e.total), U(e.storage), K(""));
                  })
                  .catch((e) => K(T(e))),
              [e, F],
            );
          (0, h.useEffect)(() => {
            J();
          }, [J]);
          let Q = async () => {
              if (q)
                try {
                  (await (0, v.deleteDocument)(q.id), Z(null), await J());
                } catch (e) {
                  (K(T(e)), Z(null));
                }
            },
            ee = (0, h.useMemo)(() => {
              let e = _(s.trim());
              return [
                ...(e
                  ? (A ?? []).filter((t) =>
                      _(`${t.title} ${t.excerpt ?? ""}`).includes(e),
                    )
                  : (A ?? [])),
              ].sort(I[i]);
            }, [A, s, i]);
          (0, h.useEffect)(() => {
            A && d?.({ shown: ee.length, loaded: A.length, total: O });
          }, [A, ee.length, O, d]);
          let et = null === A && !H,
            es = P ? (0, y.storageRatio)(P) : 0,
            ea = !!P && P.usedBytes >= P.limitBytes;
          return (0, t.jsxs)("div", {
            children: [
              P &&
                (0, t.jsxs)("div", {
                  className: "mb-5 max-w-sm text-xs text-[#5f5e5b]",
                  title: (0, y.storageLimitNote)(P),
                  children: [
                    (0, t.jsxs)("div", {
                      className:
                        "mb-1.5 flex items-center justify-between gap-2",
                      children: [
                        (0, t.jsxs)("span", {
                          className: "flex items-center gap-1.5 font-medium",
                          children: [
                            (0, t.jsx)(n, {
                              "aria-hidden": !0,
                              className: "size-3.5",
                            }),
                            " Dung lượng",
                          ],
                        }),
                        (0, t.jsxs)("span", {
                          className: (0, w.cn)(
                            "tabular-nums",
                            ea && "font-semibold text-[#eb5757]",
                          ),
                          children: [
                            (0, y.formatBytes)(P.usedBytes),
                            " / ",
                            (0, y.formatBytes)(P.limitBytes),
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsx)(b.Progress, {
                      value: 100 * es,
                      className: (0, w.cn)(
                        "h-1.5 bg-[#e3e2e0]",
                        ea && "[&>div]:bg-[#eb5757]",
                      ),
                    }),
                  ],
                }),
              "list" === l &&
                (0, t.jsxs)("div", {
                  className:
                    "divide-y divide-[#e9e9e7] border-y border-[#e9e9e7]",
                  "aria-busy": et,
                  children: [
                    (0, t.jsxs)("button", {
                      type: "button",
                      onClick: x,
                      disabled: g || ea,
                      className:
                        "flex w-full items-center gap-3 px-2 py-3 text-left text-sm font-medium text-[#37352f] hover:bg-[#f7f6f3] disabled:cursor-not-allowed disabled:opacity-60",
                      children: [
                        g
                          ? (0, t.jsx)(r.Loader2, {
                              "aria-hidden": !0,
                              className: "size-5 animate-spin",
                            })
                          : (0, t.jsx)(o.Plus, {
                              "aria-hidden": !0,
                              className: "size-5",
                            }),
                        " Tạo đề thi mới",
                      ],
                    }),
                    ee.map((e) =>
                      (0, t.jsxs)(
                        "div",
                        {
                          className:
                            "flex items-center gap-3 px-2 py-2.5 hover:bg-[#f7f6f3]",
                          children: [
                            (0, t.jsx)(a.FileText, {
                              "aria-hidden": !0,
                              className: "size-5 shrink-0 text-[#787774]",
                            }),
                            (0, t.jsx)(u.default, {
                              href: `/doc/${e.id}`,
                              className:
                                "min-w-0 flex-1 truncate text-sm font-medium text-[#37352f] hover:underline",
                              children: e.title || "Đề không tên",
                            }),
                            (0, t.jsx)("span", {
                              className:
                                "hidden shrink-0 text-xs text-[#787774] sm:block",
                              children: (0, y.formatRecent)(e.updatedAt),
                            }),
                            (0, t.jsx)("span", {
                              className:
                                "hidden w-16 shrink-0 text-right text-xs text-[#787774] tabular-nums sm:block",
                              children: (0, y.formatBytes)(e.sizeBytes),
                            }),
                            (0, t.jsx)(B, {
                              doc: e,
                              onOpen: () => c.push(`/doc/${e.id}`),
                              onRename: () => Y(e),
                              onShare: () => X(e),
                              onRemove: () => Z(e),
                            }),
                          ],
                        },
                        e.id,
                      ),
                    ),
                    et &&
                      (0, t.jsx)(j.Skeleton, {
                        className: "h-12 w-full rounded-none",
                      }),
                  ],
                }),
              (0, t.jsxs)("div", {
                className: (0, w.cn)(k.CARD_GRID, "list" === l && "hidden"),
                "aria-busy": et,
                children: [
                  "grid" === l &&
                    (0, t.jsx)($, {
                      label: "Tạo đề thi mới",
                      meta: "Đề trống",
                      onClick: x,
                      disabled: g || ea,
                      children: (0, t.jsx)("div", {
                        className:
                          "flex h-full items-center justify-center bg-white",
                        children: g
                          ? (0, t.jsx)(r.Loader2, {
                              "aria-hidden": !0,
                              className: "size-12 animate-spin text-[#37352f]",
                            })
                          : (0, t.jsx)(R, {}),
                      }),
                    }),
                  "grid" === l &&
                    ee.map((e) =>
                      (0, t.jsx)(
                        $,
                        {
                          label: e.title || "Đề không tên",
                          meta: `${(0, y.formatRecent)(e.updatedAt)} \xb7 ${(0, y.formatBytes)(e.sizeBytes)}`,
                          href: `/doc/${e.id}`,
                          menu: (0, t.jsx)(B, {
                            doc: e,
                            onOpen: () => c.push(`/doc/${e.id}`),
                            onRename: () => Y(e),
                            onShare: () => X(e),
                            onRemove: () => Z(e),
                          }),
                          children: (0, t.jsx)(z.DocThumbnail, {
                            excerpt: e.excerpt,
                          }),
                        },
                        e.id,
                      ),
                    ),
                  et &&
                    Array.from({ length: 4 }, (e, s) =>
                      (0, t.jsx)(
                        j.Skeleton,
                        {
                          className: "aspect-[210/340] w-full rounded",
                          "aria-hidden": !0,
                        },
                        s,
                      ),
                    ),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "mt-3 min-h-6",
                children: [
                  A &&
                    0 === ee.length &&
                    s.trim() &&
                    (0, t.jsxs)("p", {
                      className:
                        "rounded-lg border border-dashed border-[#e3e2e0] p-8 text-center text-[15px] text-[#5f5e5b]",
                      children: ["Không có đề nào khớp “", s.trim(), "”."],
                    }),
                  !e &&
                    O > 11 &&
                    (0, t.jsx)("button", {
                      type: "button",
                      className:
                        "text-sm font-medium text-[#2383e2] hover:underline",
                      onClick: () => V(!F),
                      children: F
                        ? "Chỉ hiện đề gần đây"
                        : `Xem tất cả đề của t\xf4i (${O})`,
                    }),
                  ea &&
                    (0, t.jsxs)("p", {
                      className: "mt-3 text-sm text-[#eb5757]",
                      children: [
                        "Dung lượng đã đầy: xoá bớt đề cũ hoặc liên hệ quản trị viên qua",
                        " ",
                        (0, t.jsx)("a", {
                          href: N.ZALO_GROUP_URL,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "underline underline-offset-2",
                          children: "nhóm Zalo",
                        }),
                        " ",
                        "để nới hạn mức.",
                      ],
                    }),
                  (H || D) &&
                    (0, t.jsx)(p.Alert, {
                      variant: "destructive",
                      className: "mt-3 bg-white",
                      children: (0, t.jsx)(p.AlertDescription, {
                        children: H || D,
                      }),
                    }),
                ],
              }),
              W &&
                (0, t.jsx)(
                  M,
                  {
                    doc: W,
                    onClose: () => Y(null),
                    onRenamed: (e, t) => {
                      (L(
                        (t) =>
                          t?.map((t) =>
                            t.id === e.id
                              ? {
                                  ...t,
                                  title: e.title,
                                  sizeBytes: e.sizeBytes,
                                  updatedAt: e.updatedAt,
                                }
                              : t,
                          ) ?? t,
                      ),
                        U(t),
                        Y(null));
                    },
                  },
                  W.id,
                ),
              G &&
                (0, t.jsx)(C.ShareExamDialog, {
                  open: !0,
                  onOpenChange: (e) => !e && X(null),
                  documentId: G.id,
                  title: G.title,
                }),
              (0, t.jsx)(f.AlertDialog, {
                open: !!q,
                onOpenChange: (e) => !e && Z(null),
                children: (0, t.jsxs)(f.AlertDialogContent, {
                  children: [
                    (0, t.jsxs)(f.AlertDialogHeader, {
                      children: [
                        (0, t.jsxs)(f.AlertDialogTitle, {
                          children: ["Xoá “", q?.title, "”?"],
                        }),
                        (0, t.jsxs)(f.AlertDialogDescription, {
                          children: [
                            "Đề bị xoá vĩnh viễn và giải phóng ",
                            (0, y.formatBytes)(q?.sizeBytes ?? 0),
                            ".",
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsxs)(f.AlertDialogFooter, {
                      children: [
                        (0, t.jsx)(f.AlertDialogCancel, { children: "Huỷ" }),
                        (0, t.jsx)(f.AlertDialogAction, {
                          className: "bg-[#eb5757] hover:bg-[#c4403f]",
                          onClick: Q,
                          children: "Xoá",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          });
        },
      ],
      151552,
    );
  },
  802503,
  (e) => {
    "use strict";
    var t = e.i(843476),
      s = e.i(569644),
      a = e.i(309642),
      i = e.i(882505),
      l = e.i(566595),
      n = e.i(263676),
      r = e.i(271645),
      d = e.i(167881),
      c = e.i(23750),
      o = e.i(62870),
      x = e.i(671428),
      u = e.i(775691),
      m = e.i(307591),
      h = e.i(647163),
      p = e.i(218842),
      f = e.i(151552);
    let g = [
      { value: "recent", label: "Mới sửa gần đây" },
      { value: "oldest", label: "Tạo cũ nhất" },
      { value: "name", label: "Tên A–Z" },
      { value: "size", label: "Dung lượng lớn nhất" },
    ];
    e.s([
      "MyExamsPage",
      0,
      function () {
        let { user: e, ready: b } = (0, m.useSessionUser)(),
          [j, v] = (0, r.useState)(""),
          [y, N] = (0, r.useState)("recent"),
          [w, k] = (0, r.useState)("grid"),
          [C, z] = (0, r.useState)(null);
        if (!b)
          return (0, t.jsx)("div", {
            className: "mx-auto w-full max-w-(--page-max) px-(--gutter) py-12",
            "aria-busy": !0,
            children: (0, t.jsx)(x.Skeleton, { className: "h-10 w-64" }),
          });
        if (!e)
          return (0, t.jsxs)("div", {
            className:
              "mx-auto w-full max-w-[720px] px-(--gutter) py-24 text-center",
            children: [
              (0, t.jsx)(s.FolderOpen, {
                "aria-hidden": !0,
                className: "mx-auto size-10 text-[#9b9a97]",
              }),
              (0, t.jsx)("h1", {
                className:
                  "font-display mt-4 text-3xl font-medium tracking-tight",
                children: "Đề thi của tôi",
              }),
              (0, t.jsx)("p", {
                className: "mt-2 text-[15px] text-[#787774]",
                children: "Đăng nhập để xem các đề bạn đã tạo.",
              }),
              (0, t.jsx)(d.Button, {
                className: "mt-6",
                onClick: () => (0, u.requestLogin)(),
                children: "Đăng nhập ngay",
              }),
            ],
          });
        let S = !!j.trim() || "recent" !== y;
        return (0, t.jsx)("div", {
          className:
            "mx-auto w-full max-w-(--page-max) px-(--gutter) pt-8 pb-16 sm:pt-12",
          children: (0, t.jsxs)("div", {
            className: p.CARD_COLUMNS,
            children: [
              (0, t.jsx)("h1", {
                className:
                  "font-display text-4xl leading-none font-semibold tracking-tight text-[#37352f] sm:text-[2.75rem]",
                children: "Đề thi của tôi",
              }),
              (0, t.jsxs)("div", {
                role: "search",
                className: "mt-7 flex flex-wrap items-center gap-2.5",
                children: [
                  (0, t.jsxs)("label", {
                    className: "relative min-w-[220px] flex-1",
                    children: [
                      (0, t.jsx)(l.Search, {
                        "aria-hidden": !0,
                        className:
                          "pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#787774]",
                      }),
                      (0, t.jsx)(c.Input, {
                        value: j,
                        onChange: (e) => v(e.target.value),
                        placeholder: "Tìm đề theo tên hoặc nội dung",
                        "aria-label": "Tìm đề thi của tôi",
                        className: "h-11 pl-10 text-[15px]",
                      }),
                    ],
                  }),
                  (0, t.jsxs)(o.Select, {
                    value: y,
                    onValueChange: (e) => N(e),
                    children: [
                      (0, t.jsx)(o.SelectTrigger, {
                        "aria-label": "Sắp xếp",
                        className:
                          "h-11 w-[200px] text-[15px] font-medium data-[size=default]:h-11",
                        children: (0, t.jsx)(o.SelectValue, {}),
                      }),
                      (0, t.jsx)(o.SelectContent, {
                        children: g.map((e) =>
                          (0, t.jsx)(
                            o.SelectItem,
                            { value: e.value, children: e.label },
                            e.value,
                          ),
                        ),
                      }),
                    ],
                  }),
                  (0, t.jsx)("div", {
                    role: "group",
                    "aria-label": "Cách xem",
                    className:
                      "flex h-11 items-center rounded-md border border-[#dfdfdd] p-1",
                    children: [
                      ["grid", "Dạng lưới", a.LayoutGrid],
                      ["list", "Dạng danh sách", i.List],
                    ].map(([e, s, a]) =>
                      (0, t.jsx)(
                        "button",
                        {
                          type: "button",
                          "aria-label": s,
                          "aria-pressed": w === e,
                          onClick: () => k(e),
                          className: (0, h.cn)(
                            "flex size-8 items-center justify-center rounded text-[#787774] transition-colors hover:text-[#37352f]",
                            w === e && "bg-[#f1f1ef] text-[#37352f]",
                          ),
                          children: (0, t.jsx)(a, {
                            "aria-hidden": !0,
                            className: "size-[18px]",
                          }),
                        },
                        e,
                      ),
                    ),
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className:
                  "mt-6 mb-4 flex min-h-6 items-center justify-between gap-3 border-b border-[#e9e9e7] pb-3",
                children: [
                  (0, t.jsx)("p", {
                    className: "text-sm font-semibold text-[#37352f]",
                    "aria-live": "polite",
                    children:
                      null === C
                        ? ""
                        : j.trim()
                          ? `${C.shown} đề khớp trong ${C.loaded} đề`
                          : `${C.total.toLocaleString("vi-VN")} đề`,
                  }),
                  S &&
                    (0, t.jsxs)(d.Button, {
                      variant: "ghost",
                      size: "sm",
                      className: "font-medium text-[#5f5e5b]",
                      onClick: () => {
                        (v(""), N("recent"));
                      },
                      children: [
                        (0, t.jsx)(n.X, { "aria-hidden": !0 }),
                        " Xoá bộ lọc",
                      ],
                    }),
                ],
              }),
              (0, t.jsx)(f.MyDocuments, {
                loadAll: !0,
                search: j,
                sort: y,
                view: w,
                onCount: z,
              }),
            ],
          }),
        });
      },
    ]);
  },
  140979,
  263662,
  (e) => {
    "use strict";
    let t = new Map();
    e.s(
      [
        "rememberExams",
        0,
        function (e) {
          for (let s of e) t.get(s.id)?.content || t.set(s.id, s);
        },
        "rememberedExam",
        0,
        function (e) {
          return t.get(e);
        },
      ],
      140979,
    );
    let s = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
    e.s(
      [
        "examIdFromSlug",
        0,
        function (e) {
          return s.exec(decodeURIComponent(e))?.[1].toLowerCase() ?? null;
        },
        "examPath",
        0,
        function (e) {
          let t = (function (e) {
            let t = e
              .normalize("NFD")
              .replace(/[̀-ͯ]/g, "")
              .replace(/[đĐ]/g, "d")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");
            if (t.length <= 80) return t;
            let s = t.slice(0, 81);
            return s
              .slice(0, s.lastIndexOf("-") > 20 ? s.lastIndexOf("-") : 80)
              .replace(/-+$/, "");
          })(e.title);
          return `/exams/${t ? `${t}-` : ""}${e.id.toLowerCase()}`;
        },
      ],
      263662,
    );
  },
  959411,
  (e) => {
    "use strict";
    var t = e.i(271645),
      s = e.i(248425),
      a = e.i(843476),
      i = Object.defineProperty,
      l = Object.freeze({
        position: "absolute",
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        wordWrap: "normal",
      }),
      n = t.forwardRef(
        i(
          function (e, t) {
            return (0, a.jsx)(s.Primitive.span, {
              ...e,
              ref: t,
              style: { ...l, ...e.style },
            });
          },
          "name",
          { value: "VisuallyHidden", configurable: !0 },
        ),
      );
    e.s(["Root", 0, n, "VISUALLY_HIDDEN_STYLES", 0, l]);
  },
  309642,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("layout-grid", [
      [
        "rect",
        { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" },
      ],
      [
        "rect",
        { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" },
      ],
      [
        "rect",
        { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" },
      ],
      [
        "rect",
        { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" },
      ],
    ]);
    e.s(["LayoutGrid", 0, t], 309642);
  },
  882505,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("list", [
      ["path", { d: "M3 5h.01", key: "18ugdj" }],
      ["path", { d: "M3 12h.01", key: "nlz23k" }],
      ["path", { d: "M3 19h.01", key: "noohij" }],
      ["path", { d: "M8 5h13", key: "1pao27" }],
      ["path", { d: "M8 12h13", key: "1za7za" }],
      ["path", { d: "M8 19h13", key: "m83p4d" }],
    ]);
    e.s(["List", 0, t], 882505);
  },
  566595,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("search", [
      ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
      ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
    ]);
    e.s(["Search", 0, t], 566595);
  },
]);
