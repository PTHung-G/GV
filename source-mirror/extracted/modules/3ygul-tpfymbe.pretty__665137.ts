// Reconstructed from 3ygul-tpfymbe.pretty.js, module 665137.
// deps: m715760, m775691
// exports: completeOAuth, completeRegistration, forgotPassword, getAccount, login, logout, resendCode, resetPassword, setPassword, startOAuth, startRegistration
export { function (e, t) { return a(`/api/auth/oauth/${encodeURIComponent(e)}/callback`, t); } as "completeOAuth" };
export { function (e, t) { return a("/api/auth/register/verify", { email: e, code: t }); } as "completeRegistration" };
export { function (e) { return (0, t.postJson)( "/api/auth/password/forgot", { email: e }, { accessToken: null }, ); } as "forgotPassword" };
export { r as "getAccount" };
export { i as "login" };
export { o as "logout" };
export { function (e, n) { return (0, t.postJson)( `/api/auth/${e}/resend`, { email: n }, { accessToken: null }, ); } as "resendCode" };
export { function (e, t, n) { return a("/api/auth/password/reset", { email: e, code: t, newPassword: n, }); } as "resetPassword" };
export { function (e, n) { return (0, t.requestJson)("PUT", "/api/auth/password", { currentPassword: e, newPassword: n, }); } as "setPassword" };
export { s as "startOAuth" };
export { function (e) { return (0, t.postJson)("/api/auth/register/start", e, { accessToken: null, }); } as "startRegistration" };

"use strict";
    var t = m715760,
      n = m775691;
    async function r(e) {
      let r = await (0, n.sessionAccessToken)(t.API_BASE_URL),
        a = await (0, t.fetchAuthed)(
          e,
          (e) => ({
            headers: e ? { Authorization: `Bearer ${e}` } : {},
            cache: "no-store",
          }),
          r,
          !0,
        ),
        i = await a.json();
      if (!a.ok)
        throw new t.ApiError(i.error || "Không tải được thông tin tài khoản.", {
          status: a.status,
          code: i.code,
        });
      return i;
    }
    async function a(e, r) {
      let a = await (0, t.postJson)(e, r, { accessToken: null });
      return ((0, n.saveSession)(a), a);
    }
    async function i(e, t) {
      return a(
        "google" === e ? "/api/auth/oauth/google/token" : "/api/auth/login",
        t,
      );
    }
    async function o() {
      let e = (0, n.readSession)();
      ((0, n.saveSession)(null),
        e &&
          (await (0, t.postJson)(
            "/api/auth/logout",
            { refreshToken: e.refreshToken },
            { accessToken: null },
          )));
    }
    async function s(e, t) {
      let n = new URLSearchParams({ redirect_after: t });
      return (await r(`/api/auth/oauth/${e}/start?${n}`)).url;
    }
    ;
