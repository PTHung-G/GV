// Reconstructed from 2usolrxxp1-d5.pretty.js, module 218842.
// deps: m843476, m508734, m522016, m63270, m140979, m263662, m647163, m216978
// exports: CARD_COLUMNS, CARD_GRID, PUBLIC_CARD_SKELETON, PublicExamCard, PublicExamListHeader, PublicExamRow
export { "w-full min-[520px]:mx-auto min-[520px]:w-[calc(round(down,100%_+_20px,230px)_-_20px)]" as "CARD_COLUMNS" };
export { "grid grid-cols-2 gap-3 min-[520px]:grid-cols-[repeat(auto-fill,210px)] min-[520px]:gap-5" as "CARD_GRID" };
export { "aspect-[210/390] w-full rounded" as "PUBLIC_CARD_SKELETON" };
export { function ({ exam: e, subject: l, onOpen: r, showAuthor: o = !0 }) { let x = Number(e.metadata?.grade) || 0; return (0, t.jsxs)(a.default, { href: (0, n.examPath)(e), prefetch: !1, onClick: c(e, r), className: "flex w-full min-w-0 flex-col overflow-hidden rounded border border-[#c4c7c5] bg-white text-left transition-colors hover:border-[#5f5e5b] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#5f5e5b]", children: [ (0, t.jsx)("div", { className: "aspect-[208/263] w-full shrink-0", children: (0, t.jsx)(d.DocThumbnail, { excerpt: e.excerpt }), }), (0, t.jsxs)("div", { className: "min-w-0 border-t border-[#c4c7c5] pt-4 pr-2 pb-3.5 pl-4 max-[519px]:pt-3 max-[519px]:pb-2.5 max-[519px]:pl-3", children: [ (0, t.jsx)("p", { className: "ml-0.5 line-clamp-2 h-9 pr-1 text-sm leading-[18px] font-medium text-[#1f1f1f]", title: e.title, children: e.title, }), (0, t.jsxs)("div", { className: "mt-2 flex h-[22px] items-center gap-1 overflow-hidden", children: [ l && (0, t.jsx)("span", { className: "min-w-0 truncate rounded-md bg-[#f1f1ef] px-2 py-[3px] text-xs font-medium text-[#37352f]", title: l, children: l, }), x > 0 && (0, t.jsxs)("span", { className: "shrink-0 rounded-md bg-[#f1f1ef] px-2 py-[3px] text-xs font-medium text-[#37352f]", children: ["Lớp ", x], }), ], }), (0, t.jsxs)("div", { className: "mt-2.5 flex h-[18px] items-center gap-1.5 pr-2 text-xs text-[#5f5e5b]", children: [ o ? (0, t.jsxs)(t.Fragment, { children: [ (0, t.jsxs)(i.Avatar, { className: "size-[18px]", children: [ (0, t.jsx)(i.AvatarImage, { src: e.authorAvatarUrl, alt: "", }), (0, t.jsx)(i.AvatarFallback, { className: "bg-[#e7f3f8] text-[10px] text-[#2383e2]", children: (e.authorName || "?") .slice(0, 1) .toUpperCase(), }), ], }), (0, t.jsx)("span", { className: "min-w-0 flex-1 truncate", children: e.authorName || "Người dùng", }), ], }) : (0, t.jsx)("span", { className: "flex-1" }), (0, t.jsxs)("span", { className: "flex shrink-0 items-center gap-0.5", title: "Lượt sử dụng đề", children: [ (0, t.jsx)(s.Copy, { "aria-hidden": !0, className: "size-3", }), " ", e.copyCount, ], }), ], }), ], }), ], }); } as "PublicExamCard" };
export { function ({ showAuthor: e = !0 }) { return (0, t.jsxs)("div", { "aria-hidden": !0, className: (0, r.cn)( "hidden items-center gap-4 border-b border-[#e9e9e7] px-3 pb-2 text-[13px] font-medium text-[#787774] sm:grid", o, ), children: [ (0, t.jsx)("span", { children: "Tên đề" }), (0, t.jsx)("span", { children: "Môn" }), (0, t.jsx)("span", { children: "Lớp" }), (0, t.jsx)("span", { children: e ? "Tác giả" : "" }), (0, t.jsx)("span", { className: "text-right", children: "Lượt sử dụng đề", }), ], }); } as "PublicExamListHeader" };
export { function ({ exam: e, subject: l, onOpen: d, showAuthor: x = !0 }) { let u = Number(e.metadata?.grade) || 0; return (0, t.jsxs)(a.default, { href: (0, n.examPath)(e), prefetch: !1, onClick: c(e, d), className: (0, r.cn)( "grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 rounded-md px-3 py-3 text-left transition-colors hover:bg-[#f7f6f3] focus-visible:outline-2 focus-visible:outline-[#2383e2]", o, ), children: [ (0, t.jsxs)("span", { className: "min-w-0", children: [ (0, t.jsx)("span", { className: "block truncate text-[15px] font-semibold text-[#37352f]", title: e.title, children: e.title, }), (0, t.jsx)("span", { className: "mt-0.5 block truncate text-[13px] text-[#5f5e5b] sm:hidden", children: [l, u > 0 && `Lớp ${u}`] .filter(Boolean) .join(" · "), }), ], }), (0, t.jsx)("span", { className: "hidden truncate text-sm text-[#37352f] sm:block", children: l, }), (0, t.jsx)("span", { className: "hidden text-sm text-[#37352f] sm:block", children: u > 0 ? `Lớp ${u}` : "", }), (0, t.jsx)("span", { className: "hidden min-w-0 items-center gap-2 text-[13px] text-[#5f5e5b] sm:flex", children: x && (0, t.jsxs)(t.Fragment, { children: [ (0, t.jsxs)(i.Avatar, { className: "size-5 shrink-0", children: [ (0, t.jsx)(i.AvatarImage, { src: e.authorAvatarUrl, alt: "", }), (0, t.jsx)(i.AvatarFallback, { className: "bg-[#e7f3f8] text-[10px] text-[#2383e2]", children: (e.authorName || "?") .slice(0, 1) .toUpperCase(), }), ], }), (0, t.jsx)("span", { className: "truncate", children: e.authorName || "Người dùng", }), ], }), }), (0, t.jsxs)("span", { className: "flex items-center justify-end gap-1 text-[13px] text-[#5f5e5b]", title: "Lượt sử dụng đề", children: [ (0, t.jsx)(s.Copy, { "aria-hidden": !0, className: "size-3" }), " ", e.copyCount, ], }), ], }); } as "PublicExamRow" };

"use strict";
    var t = m843476,
      s = m508734,
      a = m522016,
      i = m63270,
      l = m140979,
      n = m263662,
      r = m647163,
      d = m216978;
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
    ;
