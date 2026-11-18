// Reconstructed from 180c0fplvd4t3.pretty.js, module 345901.
// deps: m843476, m96892, m569644, m513797, m64801, m725981, m271645, m463415, m728231, m565594, m64805, m228742, m226091, m632781, m263676, m996296, m176782, m911825, m225913, m647163, m167881, m871813, m670495, m716327, m127923, m608532, m88653, m532181
// exports: ChatInputBar
export { function ({ input: e, onInputChange: h, onSend: m, loading: p, reasoning: f, onReasoningChange: g, references: x, onRemoveReference: b, attachments: v, documents: y, preparing: w, fileInputRef: k, documentInputRef: j, textareaRef: C, onAddFiles: N, onRemoveAttachment: S, onClearAttachments: M, onPreviewImage: R, library: E, sourceBar: P, placeholder: $ = "Nhập yêu cầu tạo, sửa, giải đề thi…", }) { let _ = (0, s.useRef)(null), q = (e.trim().length > 0 || v.length > 0 || y.length > 0) && !p && !w, z = () => { (m(), C.current && (C.current.style.height = "auto")); }; return (0, t.jsxs)("div", { className: "shrink-0 px-3 pb-2 pt-1", children: [ (0, t.jsx)(I, { attachments: v, documents: y, preparing: w, loading: p, onPreview: R, onRemove: S, onClear: M, }), P, (0, t.jsxs)("div", { className: "rounded-2xl border border-[#e3e2e0] bg-white transition-[border-color,box-shadow] focus-within:border-[#a8cff0] focus-within:shadow-[0_0_0_2px_rgb(168_199_250/0.15)]", children: [ (0, t.jsx)("input", { ref: k, type: "file", accept: "image/*", disabled: p || w, multiple: !0, className: "hidden", onChange: (e) => { (e.target.files && N(e.target.files), (e.target.value = "")); }, }), (0, t.jsx)("input", { ref: j, type: "file", accept: u.CHAT_FILE_ACCEPT, multiple: !0, disabled: p || w, "aria-label": "Chọn tệp đính kèm", className: "hidden", onChange: (e) => { (e.target.files && N(e.target.files), (e.target.value = "")); }, }), E && (0, t.jsx)("input", { ref: _, type: "file", accept: E.accept, multiple: !0, disabled: p, "aria-label": "Chọn tệp để tải lên kho tài liệu", className: "hidden", onChange: (e) => { (e.target.files && E.onUpload(Array.from(e.target.files)), (e.target.value = "")); }, }), x.length > 0 && (0, t.jsx)("div", { className: "px-3 pt-3", children: (0, t.jsx)(T.ReferenceChips, { references: x.map((e) => ({ id: e.id, label: (0, A.referenceLabel)(e), preview: e.preview, })), onRemove: b, disabled: p, }), }), (0, t.jsx)("div", { className: `px-3.5 pb-2 ${x.length > 0 ? "pt-2" : "pt-3"}`, children: (0, t.jsx)("textarea", { ref: C, value: e, onChange: (e) => { h(e.target.value); let t = e.target; ((t.style.height = "auto"), (t.style.height = `${Math.min(t.scrollHeight, 140)}px`)); }, onKeyDown: (e) => { "Enter" !== e.key || e.shiftKey || e.nativeEvent.isComposing || (e.preventDefault(), q && z()); }, placeholder: x.length > 0 ? "Hỏi hoặc nhờ AI sửa đoạn đã chọn…" : $, rows: 1, disabled: p, "aria-label": "Yêu cầu cho trợ lý AI", className: "block min-h-6 max-h-36 w-full resize-none border-0 bg-transparent p-0 font-sans text-[13px] leading-6 text-neutral-900 outline-none placeholder:text-neutral-500 disabled:opacity-60", style: { height: "auto" }, }), }), (0, t.jsxs)("div", { className: "flex min-w-0 items-center justify-between gap-2 px-2 pb-2", children: [ (0, t.jsx)("div", { className: "flex shrink-0 items-center gap-0.5", children: (0, t.jsxs)(c.TooltipProvider, { delayDuration: 150, children: [ (0, t.jsxs)(c.Tooltip, { children: [ (0, t.jsx)(c.TooltipTrigger, { asChild: !0, children: (0, t.jsx)("button", { type: "button", onClick: () => k.current?.click(), disabled: p || w || v.length >= d.MAX_CHAT_IMAGES, className: "inline-flex size-8 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2383e2]/40 active:scale-95 disabled:pointer-events-none disabled:opacity-40", "aria-label": "Thêm ảnh vào yêu cầu", children: (0, t.jsx)(a.ImagePlus, { "aria-hidden": !0, className: "size-4", }), }), }), (0, t.jsx)(c.TooltipContent, { side: "top", align: "start", children: v.length >= d.MAX_CHAT_IMAGES ? `Mỗi lượt chỉ gửi k\xe8m tối đa ${d.MAX_CHAT_IMAGES} ảnh` : "Thêm ảnh vào yêu cầu (hoặc dán Ctrl+V)", }), ], }), E ? (0, t.jsxs)(o.DropdownMenu, { children: [ (0, t.jsx)(o.DropdownMenuTrigger, { asChild: !0, children: (0, t.jsx)("button", { type: "button", disabled: p, className: "inline-flex size-8 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2383e2]/40 active:scale-95 disabled:pointer-events-none disabled:opacity-40", "aria-label": "Tài liệu", children: (0, t.jsx)(i.Paperclip, { "aria-hidden": !0, className: "size-4", }), }), }), (0, t.jsxs)(o.DropdownMenuContent, { side: "top", align: "start", className: "w-64", children: [ (0, t.jsxs)(o.DropdownMenuItem, { onSelect: () => _.current?.click(), className: "items-start", children: [ (0, t.jsx)(l.Upload, { "aria-hidden": !0, className: "mt-0.5", }), (0, t.jsxs)("span", { children: [ "Tải tệp lên kho", (0, t.jsx)("span", { className: "block text-xs text-[#787774]", children: "Lưu vào kho và dùng làm nguồn cho đề này", }), ], }), ], }), (0, t.jsxs)(o.DropdownMenuItem, { onSelect: E.onOpenPicker, children: [ (0, t.jsx)(r.FolderOpen, { "aria-hidden": !0, }), " Chọn từ kho tài liệu…", ], }), ], }), ], }) : (0, t.jsxs)(c.Tooltip, { children: [ (0, t.jsx)(c.TooltipTrigger, { asChild: !0, children: (0, t.jsx)("button", { type: "button", onClick: () => j.current?.click(), disabled: p || w || y.length >= u.MAX_CHAT_FILES, className: "inline-flex size-8 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2383e2]/40 active:scale-95 disabled:pointer-events-none disabled:opacity-40", "aria-label": "Thêm tệp vào yêu cầu", children: (0, t.jsx)(i.Paperclip, { "aria-hidden": !0, className: "size-4", }), }), }), (0, t.jsx)(c.TooltipContent, { side: "top", align: "start", className: "max-w-64", children: y.length >= u.MAX_CHAT_FILES ? `Mỗi lượt chỉ gửi k\xe8m tối đa ${u.MAX_CHAT_FILES} tệp` : `Đ\xednh k\xe8m ${u.CHAT_FILE_FORMATS}. Tối đa 10 MB/tệp (PDF 30 MB). Word chỉ đọc văn bản v\xe0 c\xf4ng thức, kh\xf4ng đọc ảnh trong tệp.`, }), ], }), ], }), }), (0, t.jsxs)("div", { className: "flex min-w-0 items-center gap-1.5", children: [ (0, t.jsx)(O, { value: f, onChange: g, disabled: p }), (0, t.jsx)("button", { type: "button", onClick: z, disabled: !q, className: "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#37352f] text-white transition-colors hover:bg-[#1f1e1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2383e2]/40 focus-visible:ring-offset-2 active:scale-95 disabled:bg-[#f1f1ef] disabled:text-neutral-400", title: "Gửi (Enter)", "aria-label": "Gửi", children: p ? (0, t.jsx)("span", { "aria-hidden": !0, className: "flex items-end gap-[3px]", children: [0, 1, 2].map((e) => (0, t.jsx)( "span", { className: "size-[5px] animate-bounce rounded-full bg-neutral-400", style: { animationDelay: `${120 * e}ms`, }, }, e, ), ), }) : (0, t.jsx)(n.ArrowUp, { "aria-hidden": !0, className: "size-4", }), }), ], }), ], }), ], }), (0, t.jsx)("p", { className: "mt-2 text-center text-[11px] text-neutral-500", children: "Trợ lý AI có thể mắc sai sót. Hãy kiểm tra kỹ nội dung nhé.", }), ], }); } as "ChatInputBar" };

"use strict";
    var t = m843476,
      n = m96892,
      r = m569644,
      a = m513797,
      i = m64801,
      l = m725981,
      s = m271645,
      o = m463415,
      c = m728231;
    m565594;
    var u = m64805,
      d = m228742,
      h = m226091,
      m = m632781,
      p = m263676,
      f = m996296;
    (m176782, m911825);
    var g = m225913,
      x = m647163,
      b = m167881;
    let v = (0, g.cva)(
      "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-xl border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/50 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed",
      {
        variants: {
          size: {
            default:
              "gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
            sm: "gap-2 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
            xs: "gap-1.5 rounded-lg text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
          },
          orientation: {
            horizontal: "min-w-36 items-center",
            vertical: "w-20 flex-col has-data-[slot=attachment-content]:w-24",
          },
        },
        defaultVariants: { size: "sm", orientation: "horizontal" },
      },
    );
    function y({
      className: e,
      state: n = "done",
      size: r = "sm",
      orientation: a = "horizontal",
      ...i
    }) {
      return (0, t.jsx)("div", {
        "data-slot": "attachment",
        "data-state": n,
        "data-size": r,
        "data-orientation": a,
        className: (0, x.cn)(v({ size: r, orientation: a }), e),
        ...i,
      });
    }
    let w = (0, g.cva)(
      "relative flex aspect-square w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
      {
        variants: {
          variant: {
            icon: "",
            image:
              "opacity-80 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
          },
        },
        defaultVariants: { variant: "icon" },
      },
    );
    function k({ className: e, variant: n = "icon", ...r }) {
      return (0, t.jsx)("div", {
        "data-slot": "attachment-media",
        "data-variant": n,
        className: (0, x.cn)(w({ variant: n }), e),
        ...r,
      });
    }
    function j({ className: e, ...n }) {
      return (0, t.jsx)("div", {
        "data-slot": "attachment-content",
        className: (0, x.cn)(
          "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
          e,
        ),
        ...n,
      });
    }
    function C({ className: e, ...n }) {
      return (0, t.jsx)("span", {
        "data-slot": "attachment-title",
        className: (0, x.cn)(
          "block max-w-full min-w-0 truncate font-medium text-xs text-slate-800",
          e,
        ),
        ...n,
      });
    }
    function N({ className: e, ...n }) {
      return (0, t.jsx)("span", {
        "data-slot": "attachment-description",
        className: (0, x.cn)(
          "mt-0.5 block min-w-0 truncate text-[10px] text-muted-foreground group-data-[state=error]/attachment:text-destructive/80 max-w-full",
          e,
        ),
        ...n,
      });
    }
    function S({ className: e, ...n }) {
      return (0, t.jsx)("div", {
        "data-slot": "attachment-actions",
        className: (0, x.cn)(
          "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-1.5 group-data-[orientation=vertical]/attachment:right-1.5 group-data-[orientation=vertical]/attachment:gap-1",
          e,
        ),
        ...n,
      });
    }
    function M({ className: e, variant: n, size: r = "icon-xs", ...a }) {
      return (0, t.jsx)(b.Button, {
        "data-slot": "attachment-action",
        variant: n ?? "ghost",
        size: r,
        className: (0, x.cn)("size-6 p-0", e),
        ...a,
      });
    }
    function R({ className: e, ...n }) {
      return (0, t.jsx)("div", {
        "data-slot": "attachment-group",
        className: (0, x.cn)(
          "flex min-w-0 flex-wrap gap-2 py-1 *:data-[slot=attachment]:flex-none",
          e,
        ),
        ...n,
      });
    }
    function I({
      attachments: e,
      documents: n,
      preparing: r,
      loading: a,
      onPreview: l,
      onRemove: s,
      onClear: o,
    }) {
      let c = e.length + n.length;
      return 0 !== c || r
        ? (0, t.jsxs)("div", {
            className: "mb-2 rounded-xl border border-neutral-200 bg-white p-2",
            children: [
              (0, t.jsxs)("div", {
                className:
                  "mb-1.5 flex items-center justify-between text-[11px] font-normal text-neutral-500",
                children: [
                  (0, t.jsxs)("span", {
                    className: "flex items-center gap-1.5",
                    children: [
                      (0, t.jsx)(i.Paperclip, { className: "size-3.5" }),
                      r
                        ? "Đang xử lý tệp..."
                        : [
                            e.length > 0
                              ? `${e.length}/${d.MAX_CHAT_IMAGES} ảnh`
                              : "",
                            n.length > 0
                              ? `${n.length}/${u.MAX_CHAT_FILES} tệp`
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" · "),
                    ],
                  }),
                  c > 0 &&
                    !r &&
                    (0, t.jsx)("button", {
                      type: "button",
                      onClick: o,
                      disabled: a,
                      className:
                        "text-neutral-400 transition-colors hover:text-rose-600 disabled:opacity-40",
                      children: "Xoá hết",
                    }),
                ],
              }),
              (0, t.jsxs)(R, {
                children: [
                  e.map((e) =>
                    (0, t.jsxs)(
                      y,
                      {
                        size: "sm",
                        className:
                          "relative cursor-pointer overflow-hidden border border-neutral-200 bg-neutral-50 pr-8 hover:bg-neutral-100",
                        onClick: () =>
                          l({ src: e.previewUrl, alt: e.name, name: e.name }),
                        children: [
                          (0, t.jsx)(k, {
                            variant: "image",
                            className: "size-8 rounded",
                            children: (0, t.jsx)("img", {
                              src: e.previewUrl,
                              alt: e.name,
                              className: "size-full object-cover",
                            }),
                          }),
                          (0, t.jsxs)(j, {
                            className: "max-w-28",
                            children: [
                              (0, t.jsx)(C, { children: e.name }),
                              (0, t.jsx)(N, {
                                children: (0, f.formatBytes)(e.bytes),
                              }),
                            ],
                          }),
                          (0, t.jsx)(S, {
                            children: (0, t.jsx)(M, {
                              variant: "ghost",
                              size: "icon-xs",
                              title: "Bỏ ảnh này",
                              disabled: a || r,
                              onClick: (t) => {
                                (t.stopPropagation(), s(e.id));
                              },
                              className:
                                "text-neutral-400 hover:bg-rose-50 hover:text-rose-600",
                              children: (0, t.jsx)(p.X, {
                                className: "size-3",
                              }),
                            }),
                          }),
                        ],
                      },
                      e.id,
                    ),
                  ),
                  n.map((e) =>
                    (0, t.jsxs)(
                      y,
                      {
                        size: "sm",
                        className:
                          "max-w-full border-neutral-200 bg-neutral-50",
                        children: [
                          (0, t.jsx)(k, {
                            variant: "icon",
                            children: (0, t.jsx)(h.FileText, {
                              "aria-hidden": !0,
                              className: "size-4 text-[#2383e2]",
                            }),
                          }),
                          (0, t.jsxs)(j, {
                            className: "max-w-36",
                            children: [
                              (0, t.jsx)(C, {
                                title: e.name,
                                children: e.name,
                              }),
                              (0, t.jsx)(N, {
                                children: (0, f.formatBytes)(e.bytes),
                              }),
                            ],
                          }),
                          (0, t.jsx)(S, {
                            children: (0, t.jsx)(M, {
                              variant: "ghost",
                              size: "icon-xs",
                              title: `Bỏ tệp ${e.name}`,
                              "aria-label": `Bỏ tệp ${e.name}`,
                              disabled: a || r,
                              onClick: () => s(e.id),
                              className:
                                "text-neutral-400 hover:bg-rose-50 hover:text-rose-600",
                              children: (0, t.jsx)(p.X, {
                                "aria-hidden": !0,
                                className: "size-3",
                              }),
                            }),
                          }),
                        ],
                      },
                      e.id,
                    ),
                  ),
                  r &&
                    (0, t.jsxs)(y, {
                      state: "uploading",
                      size: "sm",
                      className: "min-w-32 border-dashed",
                      children: [
                        (0, t.jsx)(k, {
                          variant: "icon",
                          children: (0, t.jsx)(m.Loader2, {
                            className: "size-4 animate-spin text-neutral-400",
                          }),
                        }),
                        (0, t.jsxs)(j, {
                          children: [
                            (0, t.jsx)(C, { children: "Đang đọc tệp..." }),
                            (0, t.jsx)(N, { children: "Vui lòng đợi" }),
                          ],
                        }),
                      ],
                    }),
                ],
              }),
            ],
          })
        : null;
    }
    var A = m871813,
      T = m670495,
      E = m716327,
      P = m127923,
      $ = m608532,
      _ = m88653,
      q = m532181;
    function z({ text: e, className: n }) {
      return (0, t.jsx)("span", {
        className: `relative inline-flex overflow-hidden whitespace-nowrap align-bottom ${n ?? ""}`,
        children: (0, t.jsx)(_.AnimatePresence, {
          mode: "popLayout",
          initial: !1,
          children: (0, t.jsx)(
            q.motion.span,
            {
              initial: { y: "100%", opacity: 0 },
              animate: { y: "0%", opacity: 1 },
              exit: { y: "-100%", opacity: 0 },
              transition: { duration: 0.2, ease: [0.2, 0, 0, 1] },
              className: "inline-block",
              children: e,
            },
            e,
          ),
        }),
      });
    }
    let D = (e) => `calc(14px + ${e} * (100% - 28px))`;
    function O({ value: e, onChange: n, disabled: r }) {
      let a = Math.max(
          0,
          $.REASONING_OPTIONS.findIndex((t) => t.level === e),
        ),
        i = (0, $.reasoningOption)(e),
        l = $.REASONING_OPTIONS.length - 1,
        o = (0, s.useRef)(null),
        c = (e) => {
          let t = Math.min(l, Math.max(0, e));
          t !== a && n($.REASONING_OPTIONS[t].level);
        },
        u = (e) => {
          let t = o.current?.getBoundingClientRect();
          if (!t) return;
          let n = t.width - 28;
          c(Math.round(((e - t.left - 14) / n) * l));
        };
      return (0, t.jsxs)(P.Popover.Root, {
        children: [
          (0, t.jsxs)(P.Popover.Trigger, {
            disabled: r,
            "aria-label": `Mức suy luận: ${i.label}`,
            className:
              "inline-flex h-8 min-w-0 items-center gap-1 rounded-full px-2 font-sans text-xs leading-5 font-normal text-neutral-600 outline-none transition-colors hover:bg-black/[0.06] focus-visible:ring-2 focus-visible:ring-[#2383e2]/40 data-[state=open]:bg-[#d3e5ef] data-[state=open]:text-[#2383e2] disabled:pointer-events-none disabled:opacity-40",
            children: [
              (0, t.jsxs)("span", {
                className:
                  "inline-flex min-w-0 items-center gap-1 whitespace-nowrap",
                children: ["Mức: ", (0, t.jsx)(z, { text: i.label })],
              }),
              (0, t.jsx)(E.ChevronDown, {
                "aria-hidden": !0,
                className: "size-3.5 shrink-0 opacity-70",
              }),
            ],
          }),
          (0, t.jsx)(P.Popover.Portal, {
            children: (0, t.jsxs)(P.Popover.Content, {
              side: "top",
              align: "end",
              sideOffset: 8,
              collisionPadding: 12,
              className:
                "doc-menu z-50 w-[280px] rounded-2xl border border-neutral-200 bg-white p-4 text-neutral-900 shadow-[0_2px_6px_rgba(60,64,67,0.2),0_6px_16px_4px_rgba(60,64,67,0.12)] outline-none",
              children: [
                (0, t.jsxs)("div", {
                  className: "flex items-center gap-2",
                  children: [
                    (0, t.jsx)("span", {
                      className: "text-[13px] text-neutral-500",
                      children: "Mức suy luận",
                    }),
                    (0, t.jsx)(z, {
                      text: i.label,
                      className: "text-[13px] font-medium",
                    }),
                    e === $.DEFAULT_REASONING &&
                      (0, t.jsx)("span", {
                        className:
                          "ml-auto rounded-full bg-[#d3e5ef] px-2 py-0.5 text-[11px] font-medium text-[#0b6bcb]",
                        children: "Khuyên dùng",
                      }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className:
                    "mt-4 flex items-center justify-between text-[12px] text-neutral-500",
                  children: [
                    (0, t.jsx)("span", { children: "Nhanh hơn" }),
                    (0, t.jsx)("span", { children: "Thông minh hơn" }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  ref: o,
                  role: "slider",
                  tabIndex: 0,
                  "aria-label": "Mức suy luận",
                  "aria-valuemin": 0,
                  "aria-valuemax": l,
                  "aria-valuenow": a,
                  "aria-valuetext": i.label,
                  onPointerDown: (e) => {
                    (e.currentTarget.setPointerCapture(e.pointerId),
                      u(e.clientX));
                  },
                  onPointerMove: (e) => {
                    e.currentTarget.hasPointerCapture(e.pointerId) &&
                      u(e.clientX);
                  },
                  onKeyDown: (e) => {
                    let t = {
                      ArrowRight: a + 1,
                      ArrowUp: a + 1,
                      ArrowLeft: a - 1,
                      ArrowDown: a - 1,
                      Home: 0,
                      End: l,
                    };
                    e.key in t && (e.preventDefault(), c(t[e.key]));
                  },
                  className:
                    "relative mt-2 h-6 w-full cursor-pointer touch-none select-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#2383e2]/30",
                  children: [
                    (0, t.jsx)("div", {
                      className:
                        "absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#e1e6ec]",
                    }),
                    (0, t.jsx)("div", {
                      className:
                        "absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#a8cff0] transition-[width] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                      style: { width: D(a / l) },
                    }),
                    $.REASONING_OPTIONS.map((e, n) =>
                      (0, t.jsx)(
                        "span",
                        {
                          "aria-hidden": !0,
                          className: `absolute top-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-200 ${n <= a ? "bg-white/80" : "bg-[#787774]/45"}`,
                          style: { left: D(n / l) },
                        },
                        e.level,
                      ),
                    ),
                    (0, t.jsx)("div", {
                      "aria-hidden": !0,
                      className:
                        "absolute top-1/2 h-4 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2383e2] shadow-[0_1px_3px_rgba(60,64,67,0.4)] transition-[left] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                      style: { left: D(a / l) },
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
