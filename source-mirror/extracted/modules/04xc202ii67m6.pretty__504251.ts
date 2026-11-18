// Reconstructed from 04xc202ii67m6.pretty.js, module 504251.
// deps: m618566, m271645, m799887, m389567, m775691, m307591
// exports: NEW_EXAM_LOGIN_TITLE, openNewExam, useCreateExam
export { o as "NEW_EXAM_LOGIN_TITLE" };
export { l as "openNewExam" };
export { function () { let e = (0, t.useRouter)(), { user: i } = (0, a.useSessionUser)(), [r, d] = (0, n.useState)(!1), [c, u] = (0, n.useState)(""); return { create: async () => { if (!r) { if (!i) return void (0, s.requestLogin)({ title: o, action: "Tiếp tục soạn đề", working: "Đang mở trình soạn…", run: () => l(e), next: "/doc/new", }); (d(!0), u("")); try { await l(e); } catch (e) { (u(e instanceof Error ? e.message : "Đã xảy ra lỗi."), d(!1)); } } }, creating: r, error: c, }; } as "useCreateExam" };

"use strict";
    var t = m618566,
      n = m271645,
      i = m799887,
      r = m389567,
      s = m775691,
      a = m307591;
    let o = "Đăng nhập để bắt đầu soạn đề";
    async function l(e, t = !1) {
      let { document: n } = await (0, i.createDocument)("Đề thi mới", "");
      ((0, r.track)("doc_create", { source: "blank" }),
        t ? e.replace(`/doc/${n.id}`) : e.push(`/doc/${n.id}`));
    }
    ;
