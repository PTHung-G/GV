// Reconstructed from 0arlwmr2oo6mr.pretty.js, module 603447.
// deps: m843476, m632781, m519159, m681177, m647163
// exports: CostLabel, FileBadge, KindBadge, PointsCell, StatusChip, subjectGrade
export { function ({ doc: e, compact: n = !1 }) { let a = (0, s.docCost)(e, (0, s.uploadEstimate)(e.id)); switch (a.kind) { case "estimate": return n ? (0, t.jsxs)("span", { className: "text-[#0b6bcb] tabular-nums", children: ["≈ ", (0, s.formatPoints)(a.points), " điểm"], }) : (0, t.jsxs)("span", { className: "inline-flex items-center gap-1 rounded-lg border border-[#e9e9e7] px-2 py-0.5 text-[12.5px] text-[#0b6bcb]", children: [ "Dự kiến ", (0, t.jsxs)("b", { className: "tabular-nums", children: ["≈ ", (0, s.formatPoints)(a.points), " điểm"], }), (0, t.jsxs)("span", { className: "text-[#787774]", children: [ a.known ? `(khoảng ${a.pages} trang), ` : "", "trừ khi đọc xong", ], }), ], }); case "charged": return n ? (0, t.jsxs)("span", { className: "tabular-nums", children: ["đã trừ ", (0, s.formatPoints)(a.points), " điểm"], }) : (0, t.jsxs)("span", { className: "inline-flex items-center gap-1 rounded-lg border border-[#e9e9e7] px-2 py-0.5 text-[12.5px] text-[#37352f]", children: [ "Đã trừ ", (0, t.jsxs)("b", { className: "tabular-nums", children: [(0, s.formatPoints)(a.points), " điểm"], }), (0, t.jsxs)("span", { className: "text-[#787774]", children: [ "(", a.truncated ? `${a.pages} trang đầu; phần sau kh\xf4ng t\xednh` : `${a.pages} trang`, ")", ], }), ], }); case "reused": return n ? (0, t.jsx)("span", { className: "rounded bg-[#dbeddb] px-1.5 text-[11px] font-medium text-[#0f7b6c]", children: "Có sẵn · 0 điểm", }) : (0, t.jsx)("span", { className: "inline-flex items-center rounded-lg border border-[#b7dcc0] bg-[#f3faf4] px-2 py-0.5 text-[12.5px] text-[#0f7b6c]", children: "Có sẵn kết quả đọc · không tốn điểm", }); case "failed": return n ? null : (0, t.jsx)("span", { className: "text-[12.5px] text-[#787774]", children: "Chưa trừ điểm", }); default: return null; } } as "CostLabel" };
export { function ({ format: e, small: n = !1 }) { return (0, t.jsx)("span", { "aria-label": a.FORMAT_LABELS[e], className: (0, i.cn)( "relative inline-flex shrink-0 items-end justify-center rounded-[3px] font-bold tracking-wide text-white", "before:absolute before:top-0 before:right-0 before:size-2 before:bg-[linear-gradient(225deg,#fff_50%,rgb(0_0_0/0.18)_50%)]", n ? "h-[18px] w-[15px] pb-0 text-[0px]" : "h-9 w-[30px] pb-1 text-[8.5px]", r[e] ?? "bg-[#8a8780]", ), children: n ? null : a.FORMAT_LABELS[e], }); } as "FileBadge" };
export { function ({ doc: e, className: n }) { let s = e.kind && e.kind in l; return (0, t.jsx)("span", { className: (0, i.cn)( "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap", s ? l[e.kind] : "border border-dashed border-[#dfdfdd] text-[#9b9a97]", n, ), children: (0, a.kindLabel)(e.kind, (0, a.isProcessing)(e)), }); } as "KindBadge" };
export { function ({ doc: e }) { let n = (0, s.docCost)(e, (0, s.uploadEstimate)(e.id)); switch (n.kind) { case "estimate": return (0, t.jsxs)("span", { className: "grid leading-tight whitespace-nowrap", title: `Ước t\xednh ${n.pages} trang. Trừ theo số trang thật khi đọc xong.`, children: [ (0, t.jsxs)("span", { className: "font-medium text-[#0b6bcb] tabular-nums", children: ["≈ ", (0, s.formatPoints)(n.points)], }), (0, t.jsx)("span", { className: "text-[11.5px] text-[#787774]", children: "trừ khi đọc xong", }), ], }); case "pending": return (0, t.jsx)("span", { className: "text-xs whitespace-nowrap text-[#787774]", children: "Tính khi đọc xong", }); case "charged": return (0, t.jsxs)("span", { className: "grid leading-tight whitespace-nowrap", title: `Đ\xe3 trừ ${(0, s.formatPoints)(n.points)} điểm cho ${n.pages} trang đ\xe3 đọc.`, children: [ (0, t.jsxs)("span", { className: "font-semibold text-[#37352f] tabular-nums", children: ["−", (0, s.formatPoints)(n.points)], }), (0, t.jsx)("span", { className: "text-[11.5px] text-[#787774]", children: n.truncated ? `${n.pages} trang đầu` : `${n.pages} trang`, }), ], }); case "reused": return (0, t.jsx)("span", { className: "inline-flex rounded bg-[#dbeddb] px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-[#0f7b6c]", title: "Tệp này đã có kết quả đọc trên hệ thống nên dùng lại, không quét lại và không tốn điểm.", children: "Có sẵn · 0 điểm", }); case "failed": return (0, t.jsx)("span", { className: "inline-flex rounded bg-[#f1f1ef] px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-[#5f5e5b]", title: "Đọc lỗi nên không trừ điểm.", children: "Không trừ", }); default: return (0, t.jsx)("span", { className: "inline-flex rounded bg-[#f1f1ef] px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-[#5f5e5b]", children: "Miễn phí", }); } } as "PointsCell" };
export { function ({ doc: e, compact: s = !1 }) { return (0, a.isProcessing)(e) ? (0, t.jsxs)("span", { className: "inline-flex flex-col", children: [ (0, t.jsxs)("span", { className: "inline-flex items-center gap-1.5 text-[12.5px] font-medium whitespace-nowrap text-[#0b6bcb]", children: [ (0, t.jsx)(n.Loader2, { "aria-hidden": !0, className: "size-3 animate-spin", }), (0, a.progressLabel)(e), ], }), !s && (0, t.jsx)("span", { className: "mt-1 h-[3px] w-28 overflow-hidden rounded-full bg-[#e7f3f8]", children: (0, t.jsx)("span", { className: "block h-full rounded-full bg-[#2383e2] transition-[width] duration-500", style: { width: `${(0, a.progressPercent)(e)}%` }, }), }), ], }) : "failed" === e.status ? (0, t.jsxs)("span", { className: "inline-flex flex-col", children: [ (0, t.jsxs)("span", { className: "inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#c4332b]", children: [ (0, t.jsx)("i", { "aria-hidden": !0, className: "size-[7px] rounded-full bg-[#c4332b]", }), "Lỗi", ], }), !s && e.errorMessage && (0, t.jsx)("span", { className: "mt-0.5 max-w-64 text-xs text-[#c4332b]", children: e.errorMessage, }), ], }) : e.truncated ? (0, t.jsxs)("span", { className: "inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#b25e09]", title: `Chỉ đọc ${e.pageCount} trang đầu`, children: [ (0, t.jsx)("i", { "aria-hidden": !0, className: "size-[7px] rounded-full bg-[#b25e09]", }), "Một phần", ], }) : (0, t.jsxs)("span", { className: "inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#0f7b6c]", children: [ (0, t.jsx)("i", { "aria-hidden": !0, className: "size-[7px] rounded-full bg-[#0f7b6c]", }), "Sẵn sàng", ], }); } as "StatusChip" };
export { function (e) { return [e.subject, e.grade ? `Lớp ${e.grade}` : ""] .filter(Boolean) .join(" · "); } as "subjectGrade" };

"use strict";
    var t = m843476,
      n = m632781,
      a = m519159,
      s = m681177,
      i = m647163;
    let r = {
        pdf: "bg-[#d44c3f]",
        docx: "bg-[#2b6cc4]",
        doc: "bg-[#2b6cc4]",
        odt: "bg-[#2b6cc4]",
        epub: "bg-[#6b7f3a]",
        pptx: "bg-[#d0682a]",
        xlsx: "bg-[#1f8a4c]",
        csv: "bg-[#1f8a4c]",
        text: "bg-[#8a8780]",
        image: "bg-[#7b5ea7]",
      },
      l = {
        exam: "bg-[#e7f3f8] text-[#0b6bcb]",
        matrix: "bg-[#dbeddb] text-[#0f7b6c]",
        spec: "bg-[#e1f1ee] text-[#186b5f]",
        answer: "bg-[#eae4f2] text-[#6940a5]",
        ref: "bg-[#f1f1ef] text-[#5f5e5b]",
        other: "bg-[#f1f1ef] text-[#787774]",
      };
    ;
