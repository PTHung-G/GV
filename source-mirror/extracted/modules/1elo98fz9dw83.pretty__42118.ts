// Reconstructed from 1elo98fz9dw83.pretty.js, module 42118.
// deps: none
// exports: STATUS_LABEL, VERDICT_LABEL, formatBytes, formatDate, formatDateTime, formatRecent, isClaimMission, missionAttemptsText, missionAvailable, missionResetText, missionRewardText, resetPeriodText, storageLimitNote, storageRatio
export { { pending: "Chờ duyệt", reviewing: "Đang xét duyệt", awaiting_admin: "Chờ quản trị viên duyệt", approved: "Đã duyệt", rejected: "Không được duyệt", failed: "Chưa duyệt được", } as "STATUS_LABEL" };
export { { novel: "Câu mới", variant: "Gần giống câu đã có", duplicate: "Đã có trên hệ thống", common: "Nội dung phổ biến", invalid: "Không hợp lệ", } as "VERDICT_LABEL" };
export { a as "formatBytes" };
export { i as "formatDate" };
export { n as "formatDateTime" };
export { function (e, a = new Date()) { let n = new Date(e); return n.toLocaleDateString("vi-VN", { timeZone: t }) === a.toLocaleDateString("vi-VN", { timeZone: t }) ? n.toLocaleTimeString("vi-VN", { timeZone: t, hour: "2-digit", minute: "2-digit", }) : i(e); } as "formatRecent" };
export { function (e) { return "daily_checkin" === e.kind || "link_share" === e.kind; } as "isClaimMission" };
export { function (e) { return null === e.maxAttempts ? `Đ\xe3 l\xe0m ${e.attemptsUsed} lượt` : `Đ\xe3 d\xf9ng ${e.attemptsUsed}/${e.maxAttempts} lượt`; } as "missionAttemptsText" };
export { function (e) { return ( e.enabled && (null === e.attemptsRemaining || e.attemptsRemaining > 0) ); } as "missionAvailable" };
export { function (e) { return null === e.resetHours ? "Không làm mới" : `L\xe0m mới ${r(e.resetHours)} \xb7 lần tới ${n(e.nextResetAt)}`; } as "missionResetText" };
export { function (e) { return e.rewardPoints > 0 ? `+${e.rewardPoints.toLocaleString("vi-VN")} điểm t\xedn dụng AI mỗi lượt được duyệt` : "Chưa có điểm thưởng"; } as "missionRewardText" };
export { r as "resetPeriodText" };
export { function (e) { let t = e.override; return t?.active ? t.expiresAt ? `Hạn mức ${a(t.limitBytes)} đến ${n(t.expiresAt)}, sau đ\xf3 về mức ${a(e.defaultLimitBytes)}.` : `Hạn mức ${a(t.limitBytes)}, kh\xf4ng thời hạn.` : `Hạn mức ${a(e.defaultLimitBytes)}.`; } as "storageLimitNote" };
export { function (e) { return e.limitBytes <= 0 ? +(e.usedBytes > 0) : Math.min(1, e.usedBytes / e.limitBytes); } as "storageRatio" };

"use strict";
    let t = "Asia/Ho_Chi_Minh";
    function a(e) {
      let t = ["B", "KB", "MB", "GB", "TB"],
        a = Math.max(0, e),
        n = 0;
      for (; a >= 1024 && n < t.length - 1; ) ((a /= 1024), n++);
      let i = 0 === n || a >= 100 ? 0 : 1;
      return `${a.toFixed(i).replace(".", ",").replace(/,0$/, "")} ${t[n]}`;
    }
    function n(e) {
      return e
        ? new Date(e).toLocaleString("vi-VN", {
            timeZone: t,
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "";
    }
    function i(e) {
      return e
        ? new Date(e).toLocaleDateString("vi-VN", {
            timeZone: t,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "";
    }
    function r(e) {
      let t =
        e % 168 == 0
          ? { size: e / 168, label: "tuần" }
          : e % 24 == 0
            ? { size: e / 24, label: "ngày" }
            : { size: e, label: "giờ" };
      return 1 === t.size ? `mỗi ${t.label}` : `mỗi ${t.size} ${t.label}`;
    }
    ;
