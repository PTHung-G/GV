// Reconstructed from 0arlwmr2oo6mr.pretty.js, module 681177.
// deps: none
// exports: docCost, estimateNotice, formatPoints, rememberEstimate, reusedNotice, uploadEstimate
export { function (e, t) { return e.reused ? { kind: "reused" } : "failed" === e.status ? { kind: "failed" } : "queued" === e.status || "processing" === e.status ? t && t.points > 0 ? { kind: "estimate", points: t.points, pages: t.pages, known: t.known, } : { kind: "pending" } : (e.pointsCharged ?? 0) > 0 ? { kind: "charged", points: e.pointsCharged, pages: e.pageCount, truncated: e.truncated, } : { kind: "free" }; } as "docCost" };
export { function (e, n) { let a = n.known ? ` (khoảng ${n.pages} trang)` : "", s = n.known ? `khoảng ${t(n.points)} điểm` : `\xedt nhất ${t(n.points)} điểm`; return `Đ\xe3 nhận “${e}”${a}. Sẽ trừ ${s} khi đọc xong.`; } as "estimateNotice" };
export { t as "formatPoints" };
export { function (e, t) { t && t.points > 0 && n.set(e, t); } as "rememberEstimate" };
export { function (e) { return `“${e}” đ\xe3 c\xf3 sẵn kết quả đọc n\xean d\xf9ng được ngay, kh\xf4ng tốn điểm.`; } as "reusedNotice" };
export { function (e) { return n.get(e); } as "uploadEstimate" };

"use strict";
    function t(e) {
      return Math.abs(e).toLocaleString("vi-VN");
    }
    let n = new Map();
    ;
