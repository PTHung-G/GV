// Reconstructed from 2usolrxxp1-d5.pretty.js, module 151552.
// deps: m843476, m482022, m226091, m490985, m456420, m632781, m189904, m77071, m573474, m522016, m618566, m271645, m781947, m330009, m463415, m287336, m671428, m799887, m42118, m335073, m647163, m218842, m375727, m216978, m504251, m167881, m630374, m23750
// exports: MyDocuments
export { function ({ loadAll: e = !1, search: s = "", sort: i = "recent", view: l = "grid", onCount: d, }) { let c = (0, m.useRouter)(), { create: x, creating: g, error: D } = (0, S.useCreateExam)(), [A, L] = (0, h.useState)(null), [O, E] = (0, h.useState)(0), [P, U] = (0, h.useState)(null), [F, V] = (0, h.useState)(!1), [H, K] = (0, h.useState)(""), [G, X] = (0, h.useState)(null), [q, Z] = (0, h.useState)(null), [W, Y] = (0, h.useState)(null), J = (0, h.useCallback)( () => (0, v.listDocuments)(e || F ? 200 : 11) .then((e) => { (L(e.documents), E(e.total), U(e.storage), K("")); }) .catch((e) => K(T(e))), [e, F], ); (0, h.useEffect)(() => { J(); }, [J]); let Q = async () => { if (q) try { (await (0, v.deleteDocument)(q.id), Z(null), await J()); } catch (e) { (K(T(e)), Z(null)); } }, ee = (0, h.useMemo)(() => { let e = _(s.trim()); return [ ...(e ? (A ?? []).filter((t) => _(`${t.title} ${t.excerpt ?? ""}`).includes(e), ) : (A ?? [])), ].sort(I[i]); }, [A, s, i]); (0, h.useEffect)(() => { A && d?.({ shown: ee.length, loaded: A.length, total: O }); }, [A, ee.length, O, d]); let et = null === A && !H, es = P ? (0, y.storageRatio)(P) : 0, ea = !!P && P.usedBytes >= P.limitBytes; return (0, t.jsxs)("div", { children: [ P && (0, t.jsxs)("div", { className: "mb-5 max-w-sm text-xs text-[#5f5e5b]", title: (0, y.storageLimitNote)(P), children: [ (0, t.jsxs)("div", { className: "mb-1.5 flex items-center justify-between gap-2", children: [ (0, t.jsxs)("span", { className: "flex items-center gap-1.5 font-medium", children: [ (0, t.jsx)(n, { "aria-hidden": !0, className: "size-3.5", }), " Dung lượng", ], }), (0, t.jsxs)("span", { className: (0, w.cn)( "tabular-nums", ea && "font-semibold text-[#eb5757]", ), children: [ (0, y.formatBytes)(P.usedBytes), " / ", (0, y.formatBytes)(P.limitBytes), ], }), ], }), (0, t.jsx)(b.Progress, { value: 100 * es, className: (0, w.cn)( "h-1.5 bg-[#e3e2e0]", ea && "[&>div]:bg-[#eb5757]", ), }), ], }), "list" === l && (0, t.jsxs)("div", { className: "divide-y divide-[#e9e9e7] border-y border-[#e9e9e7]", "aria-busy": et, children: [ (0, t.jsxs)("button", { type: "button", onClick: x, disabled: g || ea, className: "flex w-full items-center gap-3 px-2 py-3 text-left text-sm font-medium text-[#37352f] hover:bg-[#f7f6f3] disabled:cursor-not-allowed disabled:opacity-60", children: [ g ? (0, t.jsx)(r.Loader2, { "aria-hidden": !0, className: "size-5 animate-spin", }) : (0, t.jsx)(o.Plus, { "aria-hidden": !0, className: "size-5", }), " Tạo đề thi mới", ], }), ee.map((e) => (0, t.jsxs)( "div", { className: "flex items-center gap-3 px-2 py-2.5 hover:bg-[#f7f6f3]", children: [ (0, t.jsx)(a.FileText, { "aria-hidden": !0, className: "size-5 shrink-0 text-[#787774]", }), (0, t.jsx)(u.default, { href: `/doc/${e.id}`, className: "min-w-0 flex-1 truncate text-sm font-medium text-[#37352f] hover:underline", children: e.title || "Đề không tên", }), (0, t.jsx)("span", { className: "hidden shrink-0 text-xs text-[#787774] sm:block", children: (0, y.formatRecent)(e.updatedAt), }), (0, t.jsx)("span", { className: "hidden w-16 shrink-0 text-right text-xs text-[#787774] tabular-nums sm:block", children: (0, y.formatBytes)(e.sizeBytes), }), (0, t.jsx)(B, { doc: e, onOpen: () => c.push(`/doc/${e.id}`), onRename: () => Y(e), onShare: () => X(e), onRemove: () => Z(e), }), ], }, e.id, ), ), et && (0, t.jsx)(j.Skeleton, { className: "h-12 w-full rounded-none", }), ], }), (0, t.jsxs)("div", { className: (0, w.cn)(k.CARD_GRID, "list" === l && "hidden"), "aria-busy": et, children: [ "grid" === l && (0, t.jsx)($, { label: "Tạo đề thi mới", meta: "Đề trống", onClick: x, disabled: g || ea, children: (0, t.jsx)("div", { className: "flex h-full items-center justify-center bg-white", children: g ? (0, t.jsx)(r.Loader2, { "aria-hidden": !0, className: "size-12 animate-spin text-[#37352f]", }) : (0, t.jsx)(R, {}), }), }), "grid" === l && ee.map((e) => (0, t.jsx)( $, { label: e.title || "Đề không tên", meta: `${(0, y.formatRecent)(e.updatedAt)} \xb7 ${(0, y.formatBytes)(e.sizeBytes)}`, href: `/doc/${e.id}`, menu: (0, t.jsx)(B, { doc: e, onOpen: () => c.push(`/doc/${e.id}`), onRename: () => Y(e), onShare: () => X(e), onRemove: () => Z(e), }), children: (0, t.jsx)(z.DocThumbnail, { excerpt: e.excerpt, }), }, e.id, ), ), et && Array.from({ length: 4 }, (e, s) => (0, t.jsx)( j.Skeleton, { className: "aspect-[210/340] w-full rounded", "aria-hidden": !0, }, s, ), ), ], }), (0, t.jsxs)("div", { className: "mt-3 min-h-6", children: [ A && 0 === ee.length && s.trim() && (0, t.jsxs)("p", { className: "rounded-lg border border-dashed border-[#e3e2e0] p-8 text-center text-[15px] text-[#5f5e5b]", children: ["Không có đề nào khớp “", s.trim(), "”."], }), !e && O > 11 && (0, t.jsx)("button", { type: "button", className: "text-sm font-medium text-[#2383e2] hover:underline", onClick: () => V(!F), children: F ? "Chỉ hiện đề gần đây" : `Xem tất cả đề của t\xf4i (${O})`, }), ea && (0, t.jsxs)("p", { className: "mt-3 text-sm text-[#eb5757]", children: [ "Dung lượng đã đầy: xoá bớt đề cũ hoặc liên hệ quản trị viên qua", " ", (0, t.jsx)("a", { href: N.ZALO_GROUP_URL, target: "_blank", rel: "noopener noreferrer", className: "underline underline-offset-2", children: "nhóm Zalo", }), " ", "để nới hạn mức.", ], }), (H || D) && (0, t.jsx)(p.Alert, { variant: "destructive", className: "mt-3 bg-white", children: (0, t.jsx)(p.AlertDescription, { children: H || D, }), }), ], }), W && (0, t.jsx)( M, { doc: W, onClose: () => Y(null), onRenamed: (e, t) => { (L( (t) => t?.map((t) => t.id === e.id ? { ...t, title: e.title, sizeBytes: e.sizeBytes, updatedAt: e.updatedAt, } : t, ) ?? t, ), U(t), Y(null)); }, }, W.id, ), G && (0, t.jsx)(C.ShareExamDialog, { open: !0, onOpenChange: (e) => !e && X(null), documentId: G.id, title: G.title, }), (0, t.jsx)(f.AlertDialog, { open: !!q, onOpenChange: (e) => !e && Z(null), children: (0, t.jsxs)(f.AlertDialogContent, { children: [ (0, t.jsxs)(f.AlertDialogHeader, { children: [ (0, t.jsxs)(f.AlertDialogTitle, { children: ["Xoá “", q?.title, "”?"], }), (0, t.jsxs)(f.AlertDialogDescription, { children: [ "Đề bị xoá vĩnh viễn và giải phóng ", (0, y.formatBytes)(q?.sizeBytes ?? 0), ".", ], }), ], }), (0, t.jsxs)(f.AlertDialogFooter, { children: [ (0, t.jsx)(f.AlertDialogCancel, { children: "Huỷ" }), (0, t.jsx)(f.AlertDialogAction, { className: "bg-[#eb5757] hover:bg-[#c4403f]", onClick: Q, children: "Xoá", }), ], }), ], }), }), ], }); } as "MyDocuments" };

"use strict";
    var t = m843476,
      s = m482022,
      a = m226091,
      i = m490985,
      l = m456420;
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
    var r = m632781,
      d = m189904;
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
    var o = m77071,
      x = m573474,
      u = m522016,
      m = m618566,
      h = m271645,
      p = m781947,
      f = m330009,
      g = m463415,
      b = m287336,
      j = m671428,
      v = m799887,
      y = m42118,
      N = m335073,
      w = m647163,
      k = m218842,
      C = m375727,
      z = m216978,
      S = m504251,
      D = m167881,
      A = m630374,
      L = m23750;
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
    ;
