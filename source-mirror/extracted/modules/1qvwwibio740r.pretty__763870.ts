// Reconstructed from 1qvwwibio740r.pretty.js, module 763870.
// deps: m843476, m522016, m647163, m689664, m422768, m508734, m762368, m632781, m741120, m973134, m271645, m167881, m630374, m389567, m407860, m663756, m973381, m775691
// exports: CheckoutConsent, CheckoutDialog, useCheckout
export { function ({ className: e }) { return (0, t.jsxs)("p", { className: (0, a.cn)("text-[12.5px] leading-5 text-[#787774]", e), children: [ "Chuyển khoản qua mã VietQR, giá đã bao gồm thuế. Bấm Thanh toán là thầy cô đồng ý với", " ", (0, t.jsx)(n.default, { href: "/terms#gia", target: "_blank", className: "text-[#2383e2] hover:underline", children: "Điều khoản sử dụng", }), " ", "và", " ", (0, t.jsx)(n.default, { href: "/privacy", target: "_blank", className: "text-[#2383e2] hover:underline", children: "Chính sách bảo mật", }), ".", ], }); } as "CheckoutConsent" };
export { function ({ order: e, onClose: r, onRecreate: b, supportZalo: N }) { let [v, k] = (0, m.useState)(e), [y, w] = (0, m.useState)(""), [C, S] = (0, m.useState)(!1), [T, D] = (0, m.useState)(!1), [V, M] = (0, m.useState)(null), [P, A] = (0, m.useState)(""), [E, L] = (0, m.useState)(e), R = (0, m.useRef)(""); E !== e && (L(e), k(e), A(""), M(null)); let $ = (function (e) { let [t, n] = (0, m.useState)(() => Date.now()); return ((0, m.useEffect)(() => { let e = window.setInterval(() => n(Date.now()), 1e3); return () => window.clearInterval(e); }, []), e) ? Math.max(0, Math.floor((new Date(e).getTime() - t) / 1e3)) : 0; })(v?.expiresAt), q = v?.payment?.qrPayload; (0, m.useEffect)(() => { if (!q) return; let e = !0; return ( o.default .toDataURL(q, { margin: 1, width: 480, errorCorrectionLevel: "M", }) .then((t) => e && w(t)) .catch(() => e && w("")), () => { e = !1; } ); }, [q]); let z = v?.id, _ = v?.status; async function O() { if (v) { (S(!0), A("")); try { (k(await (0, u.checkOrder)(v.id)), D(!0), window.setTimeout(() => D(!1), 2e4)); } catch (e) { A( e instanceof Error ? e.message : "Không kiểm tra được, hãy thử lại.", ); } finally { S(!1); } } } async function I() { if (v) { try { await (0, u.cancelOrder)(v.id); } catch {} r(); } } ((0, m.useEffect)(() => { if (!z || ("pending" !== _ && "expired" !== _)) return; let e = !0, t = window.setInterval( () => { (0, u.getOrder)(z) .then((t) => e && k(t)) .catch(() => {}); }, "pending" === _ ? 3e3 : 1e4, ); return () => { ((e = !1), window.clearInterval(t)); }; }, [z, _]), (0, m.useEffect)(() => { "paid" === _ && z && R.current !== z && ((R.current = z), window.dispatchEvent(new Event("exam-quota-change")), (0, p.track)("topup_paid", { kind: v?.kind ?? "", amount: v?.paidAmount ?? 0, }), (0, u.getWallet)() .then((e) => M(e.balance)) .catch(() => {})); }, [z, _, v?.kind, v?.paidAmount])); let Q = "expired" === _ || ("pending" === _ && 0 === $), B = "paid" === _, U = v?.payment, Z = v?.kind === "package" && v.paidAt && v.validDays ? new Date( new Date(v.paidAt).getTime() + 864e5 * v.validDays, ).toISOString() : null; return (0, t.jsx)(h.Dialog, { open: null !== v, onOpenChange: (e) => !e && r(), children: (0, t.jsx)(h.DialogContent, { className: (0, a.cn)( "max-h-[92dvh] gap-0 overflow-y-auto rounded-xl border-[#e3e2e0] bg-white p-0 text-[#37352f]", B ? "sm:max-w-md" : "sm:max-w-3xl", ), children: v && B ? (0, t.jsxs)("div", { className: "px-7 pt-9 pb-7 text-center", children: [ (0, t.jsx)("div", { className: "mx-auto grid size-14 place-items-center rounded-full bg-[#edf3ec] text-[#448361]", children: (0, t.jsx)(s.Check, { "aria-hidden": !0, className: "size-7", strokeWidth: 3, }), }), (0, t.jsx)(h.DialogTitle, { className: "font-display mt-4 text-3xl font-medium tracking-tight", children: "Nạp điểm thành công", }), (0, t.jsxs)(h.DialogDescription, { className: "mt-1 text-[#787774]", children: [ "Đã nhận ", (0, g.formatVnd)(v.paidAmount), v.paidAt && ` l\xfac ${new Date(v.paidAt).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}`, ], }), (0, t.jsxs)("p", { className: "mt-3 text-4xl font-bold tracking-tight text-[#1c3829] tabular-nums", children: [ "+", (0, g.formatPoints)(v.creditedPoints), " điểm", ], }), (0, t.jsxs)("div", { className: "mx-auto mt-5 max-w-sm text-left text-[13.5px]", children: [ (0, t.jsxs)("div", { className: "flex justify-between border-t border-[#e9e9e7] py-2", children: [ (0, t.jsx)("span", { className: "text-[#787774]", children: "package" === v.kind ? "Gói" : "Loại", }), (0, t.jsx)("b", { children: v.label }), ], }), (0, t.jsxs)("div", { className: "flex justify-between border-t border-[#e9e9e7] py-2", children: [ (0, t.jsx)("span", { className: "text-[#787774]", children: "Hạn dùng", }), (0, t.jsx)("b", { children: Z ? (0, g.formatDate)(Z) : "Vĩnh viễn", }), ], }), null !== V && (0, t.jsxs)("div", { className: "flex justify-between border-t border-[#e9e9e7] py-2", children: [ (0, t.jsx)("span", { className: "text-[#787774]", children: "Số dư mới", }), (0, t.jsxs)("b", { className: "tabular-nums", children: [(0, g.formatPoints)(V), " điểm"], }), ], }), (0, t.jsxs)("div", { className: "flex justify-between border-t border-[#e9e9e7] py-2", children: [ (0, t.jsx)("span", { className: "text-[#787774]", children: "Mã đơn", }), (0, t.jsx)("b", { className: "font-mono", children: v.code, }), ], }), ], }), v.note && (0, t.jsxs)("p", { className: "mx-auto mt-3 max-w-sm rounded-lg bg-[#fbf3db] px-3 py-2 text-left text-[12.5px] whitespace-pre-line text-[#6b5016]", children: [ v.note, "\n", "Cần điều chỉnh, thầy cô nhắn ", (0, t.jsx)(f.ZaloLink, { phone: N }), " kèm mã đơn ", v.code, ".", ], }), (0, t.jsxs)("div", { className: "mt-6 flex justify-center gap-2", children: [ (0, t.jsx)(x.Button, { variant: "outline", asChild: !0, children: (0, t.jsx)(n.default, { href: "/profile", onClick: r, children: "Xem ví điểm", }), }), (0, t.jsx)(x.Button, { onClick: r, children: "Xong", }), ], }), ], }) : v && U ? (0, t.jsxs)(t.Fragment, { children: [ (0, t.jsxs)("div", { className: "border-b border-[#e9e9e7] px-5 py-4 pr-12", children: [ (0, t.jsx)(h.DialogTitle, { className: "text-base font-semibold", children: "Quét mã để thanh toán", }), (0, t.jsx)(h.DialogDescription, { className: "sr-only", children: "Chuyển khoản đúng số tiền và nội dung để được cộng điểm tự động.", }), ], }), (0, t.jsxs)("div", { className: "grid sm:grid-cols-[300px_1fr]", children: [ (0, t.jsxs)("div", { className: "flex flex-col items-center border-b border-[#e9e9e7] bg-[#f7f6f3] p-5 sm:border-r sm:border-b-0", children: [ (0, t.jsxs)("div", { className: "relative w-[248px] rounded-xl border border-[#e3e2e0] bg-white p-3.5", children: [ (0, t.jsxs)("div", { className: "mb-2 flex items-center justify-between text-[11px] text-[#787774]", children: [ (0, t.jsx)("b", { className: "tracking-wide text-[#0f2f8a]", children: "VIETQR", }), (0, t.jsxs)("span", { children: [ "napas 247 · ", U.bankName, ], }), ], }), y ? (0, t.jsx)("img", { src: y, alt: `M\xe3 QR chuyển ${(0, g.formatVnd)(U.amount)} tới ${U.bankName}`, className: "block size-[218px] [image-rendering:pixelated]", }) : (0, t.jsx)("div", { className: "grid size-[218px] place-items-center", children: (0, t.jsx)(c.Loader2, { "aria-hidden": !0, className: "size-5 animate-spin text-[#9b9a97]", }), }), Q && (0, t.jsxs)("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-xl bg-white/95 p-5 text-center", children: [ (0, t.jsx)("b", { children: "Mã QR đã hết hạn", }), (0, t.jsx)("span", { className: "text-[12.5px] text-[#787774]", children: "Nếu thầy cô đã chuyển khoản, điểm vẫn được cộng khi hệ thống nhận được tiền.", }), b && (0, t.jsxs)(x.Button, { size: "sm", onClick: () => b(v), children: [ (0, t.jsx)(d.RefreshCw, { "aria-hidden": !0, }), " Tạo mã mới", ], }), ], }), ], }), (0, t.jsx)("p", { className: "mt-3 text-[13px] text-[#787774]", children: Q ? (0, t.jsx)("span", { className: "text-[#eb5757]", children: "Mã đã hết hạn", }) : (0, t.jsxs)(t.Fragment, { children: [ "Mã hết hạn sau", " ", (0, t.jsxs)("b", { className: "text-[#37352f] tabular-nums", children: [ String( Math.floor($ / 60), ).padStart(2, "0"), ":", String($ % 60).padStart(2, "0"), ], }), ], }), }), (0, t.jsxs)(x.Button, { variant: "outline", size: "sm", className: "mt-2", disabled: !y, onClick: function () { if (!y || !v) return; let e = document.createElement("a"); ((e.href = y), (e.download = `soandethi-${v.code}.png`), e.click()); }, children: [ (0, t.jsx)(l.Download, { "aria-hidden": !0, }), " Lưu ảnh QR", ], }), ], }), (0, t.jsxs)("div", { className: "p-5", children: [ (0, t.jsxs)("div", { className: "overflow-hidden rounded-lg border border-[#e3e2e0]", children: [ (0, t.jsx)(j, { label: "Ngân hàng", value: U.bankName, }), (0, t.jsx)(j, { label: "Số tài khoản", value: U.accountNumber, copy: U.accountNumber, mono: !0, }), (0, t.jsx)(j, { label: "Chủ tài khoản", value: U.accountName, }), (0, t.jsx)(j, { label: "Số tiền", value: (0, g.formatVnd)(U.amount), copy: String(U.amount), }), (0, t.jsx)(j, { label: "Nội dung", value: U.content, copy: U.content, highlight: !0, mono: !0, }), ], }), (0, t.jsxs)("p", { className: "mt-3 rounded-lg bg-[#fbf3db] px-3 py-2 text-[12.5px] text-[#6b5016]", children: [ "Mở ứng dụng ngân hàng, chọn quét mã QR. Vui lòng ", (0, t.jsx)("b", { children: "giữ nguyên số tiền và nội dung", }), " để điểm được cộng tự động. Nếu chuyển khoản tay, thầy cô nhập nội dung y hệt ở trên.", ], }), (0, t.jsxs)("div", { role: "status", className: "mt-3 flex items-center gap-3 rounded-lg border border-[#e3e2e0] p-3", children: [ (0, t.jsx)(c.Loader2, { "aria-hidden": !0, className: "size-4 shrink-0 animate-spin text-[#2383e2]", }), (0, t.jsxs)("div", { children: [ (0, t.jsx)("p", { className: "text-[13.5px] font-semibold", children: T ? "Đang kiểm tra giao dịch…" : "Đang chờ thanh toán…", }), (0, t.jsx)("p", { className: "text-xs text-[#787774]", children: "Trang tự cập nhật khi nhận được tiền, thường trong khoảng 1 phút. Thầy cô có thể đóng hộp này, đơn vẫn được giữ.", }), ], }), ], }), (0, t.jsxs)("p", { className: "mt-3 text-xs leading-5 text-[#787774]", children: [ "Đã chuyển khoản hơn 5 phút mà chưa nhận được điểm? Thầy cô nhắn ", (0, t.jsx)(f.ZaloLink, { phone: N }), " kèm mã đơn ", (0, t.jsx)("b", { className: "font-mono", children: v.code, }), ".", ], }), P && (0, t.jsxs)("p", { role: "alert", className: "mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700", children: [ (0, t.jsx)(i.CircleAlert, { "aria-hidden": !0, className: "size-4", }), " ", P, ], }), ], }), ], }), (0, t.jsxs)("div", { className: "flex flex-wrap items-center justify-between gap-3 border-t border-[#e9e9e7] px-5 py-3.5", children: [ (0, t.jsxs)("span", { className: "text-[12.5px] text-[#787774]", children: [ v.label, " · ", (0, g.formatPoints)(v.points + v.bonusPoints), " điểm · mã đơn ", v.code, ], }), (0, t.jsxs)("div", { className: "flex gap-2", children: [ "pending" === _ && (0, t.jsx)(x.Button, { variant: "outline", onClick: () => void I(), children: "Huỷ đơn", }), (0, t.jsxs)(x.Button, { disabled: C, onClick: () => void O(), children: [ C && (0, t.jsx)(c.Loader2, { "aria-hidden": !0, className: "animate-spin", }), "Tôi đã chuyển khoản", ], }), ], }), ], }), ], }) : v ? (0, t.jsxs)("div", { className: "p-6", children: [ (0, t.jsxs)(h.DialogTitle, { className: "text-base font-semibold", children: ["Đơn ", v.code], }), (0, t.jsx)(h.DialogDescription, { className: "mt-2", children: "Đơn này đã huỷ. Thầy cô có thể tạo đơn mới ở trang Nạp điểm.", }), ], }) : null, }), }); } as "CheckoutDialog" };
export { function () { let [e, t] = (0, m.useState)(null), [n, a] = (0, m.useState)(!1), [s, i] = (0, m.useState)(""), r = (0, m.useCallback)(async (e) => { let n = await (0, u.createOrder)(e); ((0, p.track)("topup_order", { kind: n.kind, amount: n.amountVnd, }), t(n)); }, []), l = (0, m.useCallback)( async (e) => { if ((i(""), !(0, N.readSession)())) return void (0, N.requestLogin)({ title: "Đăng nhập để nạp điểm", action: "Tiếp tục thanh toán", working: "Đang tạo mã thanh toán…", run: () => r(e), next: "/nap-diem", }); a(!0); try { await r(e); } catch (e) { i( e instanceof Error ? e.message : "Không tạo được đơn nạp, hãy thử lại.", ); } finally { a(!1); } }, [r], ), c = (0, m.useCallback)( (e) => { (t(null), l( "package" === e.kind && e.packageId ? { kind: "package", packageId: e.packageId } : { kind: "topup", amountVnd: e.amountVnd }, )); }, [l], ); return { order: e, setOrder: t, start: l, recreate: c, busy: n, error: s, close: () => t(null), }; } as "useCheckout" };

"use strict";
    var t = m843476,
      n = m522016,
      a = m647163;
    ;
    var s = m689664,
      i = m422768,
      r = m508734,
      l = m762368,
      c = m632781,
      d = m741120,
      o = m973134,
      m = m271645,
      x = m167881,
      h = m630374,
      p = m389567,
      u = m407860,
      g = m663756,
      f = m973381;
    function b({ value: e }) {
      let [n, i] = (0, m.useState)(!1);
      return (0, t.jsxs)("button", {
        type: "button",
        onClick: () => {
          (navigator.clipboard?.writeText(e).catch(() => {}),
            i(!0),
            window.setTimeout(() => i(!1), 1400));
        },
        className: (0, a.cn)(
          "inline-flex h-7 shrink-0 items-center gap-1 rounded-md border px-2 text-xs transition-colors",
          n
            ? "border-[#c6dcc9] text-[#448361]"
            : "border-[#e3e2e0] text-[#5f5e5b] hover:bg-[#f1f1ef]",
        ),
        children: [
          n
            ? (0, t.jsx)(s.Check, { "aria-hidden": !0, className: "size-3" })
            : (0, t.jsx)(r.Copy, { "aria-hidden": !0, className: "size-3" }),
          n ? "Đã chép" : "Sao chép",
        ],
      });
    }
    function j({ label: e, value: n, copy: s, highlight: i, mono: r }) {
      return (0, t.jsxs)("div", {
        className: (0, a.cn)(
          "grid grid-cols-[96px_1fr_auto] items-center gap-2 border-t border-[#e9e9e7] px-3 py-2.5 first:border-t-0",
          i && "bg-[#fffbea]",
        ),
        children: [
          (0, t.jsx)("span", {
            className: "text-[13px] text-[#787774]",
            children: e,
          }),
          (0, t.jsx)("b", {
            className: (0, a.cn)(
              "min-w-0 text-[14.5px] break-words",
              r && "font-mono",
              i && "text-lg tracking-wider",
            ),
            children: n,
          }),
          s ? (0, t.jsx)(b, { value: s }) : (0, t.jsx)("span", {}),
        ],
      });
    }
    ;
    var N = m775691;
    ;
