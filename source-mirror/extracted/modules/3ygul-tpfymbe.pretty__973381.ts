// Reconstructed from 3ygul-tpfymbe.pretty.js, module 973381.
// deps: m715760, m843476, m615227, m647163
// exports: cancelOrder, checkOrder, createOrder, getCatalog, getOrder, getWallet, listOrders, ZaloLink, ZaloSupportCard
export { o as "cancelOrder" };
export { i as "checkOrder" };
export { r as "createOrder" };
export { n as "getCatalog" };
export { a as "getOrder" };
export { l as "getWallet" };
export { s as "listOrders" };
export { p as "ZaloLink" };
export { function ({ phone: e, className: t }) { return (0, c.jsxs)("div", { className: (0, u.cn)( "flex items-start gap-3 rounded-xl border border-[#d6e6ff] bg-[#f2f7ff] px-4 py-3.5", t, ), children: [ (0, c.jsx)("span", { className: "grid size-9 shrink-0 place-items-center rounded-full bg-[#0068ff] text-white", children: (0, c.jsx)(d.MessageCircle, { "aria-hidden": !0, className: "size-4.5", }), }), (0, c.jsxs)("div", { className: "text-[13.5px] leading-6 text-[#37352f]", children: [ (0, c.jsx)("p", { className: "font-semibold", children: "Thầy cô cần hỗ trợ nạp điểm?", }), (0, c.jsxs)("p", { className: "text-[#5f5e5b]", children: [ "Nhắn tin qua ", (0, c.jsx)(p, { phone: e }), " để được hướng dẫn trực tiếp. Nếu đã chuyển khoản mà chưa nhận được điểm, thầy cô gửi kèm mã đơn và ảnh chụp giao dịch, chúng tôi sẽ cộng điểm ngay.", ], }), ], }), ], }); } as "ZaloSupportCard" };

"use strict";
    var t = m715760;
    async function n() {
      return (
        await (0, t.requestJson)("GET", "/api/billing/catalog", void 0, {
          accessToken: null,
        })
      ).catalog;
    }
    async function r(e) {
      return (await (0, t.requestJson)("POST", "/api/billing/orders", e)).order;
    }
    async function a(e) {
      return (
        await (0, t.requestJson)(
          "GET",
          `/api/billing/orders/${encodeURIComponent(e)}`,
        )
      ).order;
    }
    async function i(e) {
      return (
        await (0, t.requestJson)(
          "POST",
          `/api/billing/orders/${encodeURIComponent(e)}/check`,
        )
      ).order;
    }
    async function o(e) {
      await (0, t.requestJson)(
        "DELETE",
        `/api/billing/orders/${encodeURIComponent(e)}`,
      );
    }
    async function s(e = 30) {
      return (await (0, t.requestJson)("GET", `/api/billing/orders?limit=${e}`))
        .orders;
    }
    async function l() {
      let e = await (0, t.requestJson)("GET", "/api/auth/quota");
      return {
        balance: e.balance,
        debt: e.debt ?? 0,
        lots: e.lots ?? [],
        expiring: e.expiring ?? null,
      };
    }
    ;
    var c = m843476,
      d = m615227,
      u = m647163;
    function p({ phone: e, className: t }) {
      let n = e || "0858562678";
      return (0, c.jsxs)("a", {
        href: `https://zalo.me/${n}`,
        target: "_blank",
        rel: "noopener noreferrer",
        className: (0, u.cn)(
          "font-semibold whitespace-nowrap text-[#0068ff] underline-offset-2 hover:underline",
          t,
        ),
        children: ["Zalo ", n.replace(/(\d{4})(\d{3})(\d+)/, "$1 $2 $3")],
      });
    }
    ;
