(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  583350,
  (e) => {
    "use strict";
    var t = e.i(618566),
      r = e.i(271645),
      n = e.i(389567);
    e.s([
      "AnalyticsTracker",
      0,
      function () {
        let e = (0, t.usePathname)();
        return (
          (0, r.useEffect)(() => {
            ((0, n.trackPageview)(e), (0, n.startAnalytics)());
          }, [e]),
          null
        );
      },
    ]);
  },
  389567,
  (e) => {
    "use strict";
    var t = e.i(715760),
      r = e.i(775691);
    let n = "exam-visitor-id",
      a = "exam-analytics-session",
      o = !1,
      i = !1,
      s = "",
      c = [],
      u = "/",
      l = 0,
      h = 0,
      d = 0,
      m = null,
      f = !1,
      p = { path: "", at: 0 };
    function w() {
      try {
        return window.localStorage;
      } catch {
        return null;
      }
    }
    function g(e) {
      return "visible" === document.visibilityState && e - l < 3e5;
    }
    function y(e) {
      let t = Date.now();
      (e && h && (d += Math.min(t - h, 4e4)), (h = t));
    }
    function v() {
      let e = Math.round(d / 1e3);
      ((d = 0),
        e >= 1 &&
          c.push({
            name: "engage",
            path: u,
            props: { seconds: e },
            at: Date.now(),
          }));
    }
    function k(e) {
      if (i || !s) return;
      let n = c;
      c = [];
      let o = (function () {
          var e, t, r, n;
          let o,
            i = f
              ? { referrer: "", utm: { source: "", medium: "", campaign: "" } }
              : {
                  referrer: (function (e, t) {
                    if (!e) return "";
                    try {
                      let r = new URL(e);
                      return r.host === t ? "" : `${r.protocol}//${r.host}/`;
                    } catch {
                      return "";
                    }
                  })(document.referrer, window.location.host),
                  utm: (function (e) {
                    let t = new URLSearchParams(e),
                      r = (e) => (t.get(e) ?? "").trim().slice(0, 80),
                      n = {
                        source: r("utm_source"),
                        medium: r("utm_medium"),
                        campaign: r("utm_campaign"),
                      };
                    if (!n.source && !n.medium && !n.campaign) {
                      if (t.has("gclid"))
                        return {
                          source: "google",
                          medium: "cpc",
                          campaign: "",
                        };
                      if (t.has("fbclid"))
                        return {
                          source: "facebook",
                          medium: "social",
                          campaign: "",
                        };
                    }
                    return n;
                  })(window.location.search),
                };
          f = !0;
          let s =
            ((e = (function () {
              try {
                let e = JSON.parse(w()?.getItem(a) || "null");
                return e &&
                  "string" == typeof e.id &&
                  "number" == typeof e.last &&
                  e.utm
                  ? e
                  : null;
              } catch {
                return null;
              }
            })()),
            (t = Date.now()),
            (r = () => crypto.randomUUID()),
            (o =
              !((n = i.utm).source || n.medium || n.campaign) ||
              (e?.utm.source === i.utm.source &&
                e?.utm.medium === i.utm.medium &&
                e?.utm.campaign === i.utm.campaign)),
            e && t - e.last < 18e5 && o
              ? { ...e, last: t }
              : { id: r(), last: t, referrer: i.referrer, utm: i.utm });
          try {
            w()?.setItem(a, JSON.stringify(s));
          } catch {}
          return s;
        })(),
        l = Date.now(),
        h = (0, r.readSession)(),
        d = h?.expiresAt && h.expiresAt > l ? h.accessToken : null,
        m = JSON.stringify({
          visitorId: s,
          sessionId: o.id,
          path: u,
          referrer: o.referrer,
          utm: o.utm,
          leave: e,
          events: n.map((e) => ({
            name: e.name,
            path: e.path,
            props: e.props,
            agoMs: Math.max(0, l - e.at),
          })),
        });
      fetch((0, t.apiUrl)("/api/track"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(d ? { Authorization: `Bearer ${d}` } : {}),
        },
        body: m,
        keepalive: !0,
      })
        .then((e) => {
          404 === e.status && (i = !0);
        })
        .catch(() => {});
    }
    e.s([
      "startAnalytics",
      0,
      function () {
        if (o) return;
        if (navigator.webdriver) {
          i = !0;
          return;
        }
        let e = w();
        try {
          (s = e?.getItem(n) || "") ||
            ((s = crypto.randomUUID()), e?.setItem(n, s));
        } catch {
          s = crypto.randomUUID();
        }
        ((o = !0), (l = h = Date.now()));
        let t = () => {
          let e = Date.now(),
            t = e - l >= 3e5;
          ((l = e), t && ((h = e), k(!1)));
        };
        for (let e of ["pointerdown", "keydown", "scroll", "pointermove"])
          window.addEventListener(e, t, { passive: !0, capture: !0 });
        (window.setInterval(() => {
          let e = g(Date.now());
          (y(e), e && k(!1));
        }, 2e4),
          document.addEventListener("visibilitychange", () => {
            "hidden" === document.visibilityState
              ? (y(Date.now() - l < 3e5), v(), c.length && k(!1))
              : ((l = h = Date.now()), k(!1));
          }),
          window.addEventListener("pagehide", () => {
            (y(g(Date.now())), v(), k(!0));
          }),
          c.length && k(!1));
      },
      "track",
      0,
      function (e, t) {
        !i &&
          ((l = Date.now()),
          c.push({ name: e, path: u, props: t, at: Date.now() }),
          c.length >= 30
            ? k(!1)
            : o &&
              null === m &&
              (m = window.setTimeout(() => {
                ((m = null), c.length && k(!1));
              }, 5e3)));
      },
      "trackPageview",
      0,
      function (e) {
        if (i) return;
        let t = (
            (e || "/").split(/[?#]/)[0].replace(/\/+$/, "") || "/"
          ).replace(/^\/(doc|profile|submit)\/[^/]+/, "/$1/:id"),
          r = Date.now();
        (t !== p.path || !(r - p.at < 1e3)) &&
          ((p = { path: t, at: r }),
          o && (y(g(Date.now())), v()),
          (u = t),
          c.push({ name: "pageview", path: t, at: Date.now() }),
          o && k(!1));
      },
    ]);
  },
  715760,
  775691,
  (e) => {
    "use strict";
    let t = "exam-builder-session";
    function r() {
      try {
        return window.localStorage;
      } catch {
        return null;
      }
    }
    function n() {
      let e = r();
      if (!e) return null;
      try {
        let r = e.getItem(t);
        if (r) return JSON.parse(r);
        let n = window.sessionStorage?.getItem(t);
        if (!n) return null;
        return (
          e.setItem(t, n),
          window.sessionStorage.removeItem(t),
          JSON.parse(n)
        );
      } catch {
        return null;
      }
    }
    function a(e) {
      let n = r();
      if (n)
        try {
          if (e) {
            let { notices: r, isNewUser: a, redirectAfter: o, ...i } = e;
            n.setItem(
              t,
              JSON.stringify({
                ...i,
                expiresAt: Date.now() + 1e3 * e.expiresIn,
              }),
            );
          } else n.removeItem(t);
        } catch {}
      try {
        window.sessionStorage?.removeItem(t);
      } catch {}
      window.dispatchEvent(new Event("exam-session-change"));
    }
    function o(e) {
      return !!e.expiresAt && e.expiresAt > Date.now() + 3e4;
    }
    let i = null;
    async function s(e, t) {
      var r;
      let s,
        c = n();
      return c
        ? o(c) && c.accessToken !== t
          ? c.accessToken
          : (i ||
              (i = ((r = async () => {
                let r = n();
                if (!r) return null;
                if (o(r) && r.accessToken !== t) return r.accessToken;
                let i = await fetch(`${e}/api/auth/refresh`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ refreshToken: r.refreshToken }),
                });
                if (!i.ok)
                  throw (
                    401 === i.status &&
                      n()?.refreshToken === r.refreshToken &&
                      a(null),
                    Error(
                      "Không thể làm mới phiên đăng nhập. Vui lòng thử lại.",
                    )
                  );
                let s = await i.json();
                return n()?.refreshToken !== r.refreshToken
                  ? null
                  : (a(s), s.accessToken);
              }),
              (s = "u" < typeof navigator ? void 0 : navigator.locks)
                ? s.request("exam-builder-refresh", r)
                : r()).finally(() => {
                i = null;
              })),
            i)
        : null;
    }
    function c() {
      window.dispatchEvent(new Event("exam-quota-change"));
    }
    e.s(
      [
        "SESSION_KEY",
        0,
        t,
        "quotaChanged",
        0,
        c,
        "readSession",
        0,
        n,
        "requestLogin",
        0,
        function (e) {
          window.dispatchEvent(
            new CustomEvent("exam-login-request", { detail: e }),
          );
        },
        "saveSession",
        0,
        a,
        "sessionAccessToken",
        0,
        s,
      ],
      775691,
    );
    let u = 0,
      l = new Map(),
      h = !1;
    function d() {
      h ||
        ((h = !0),
        window.addEventListener("beforeunload", (e) => {
          0 !== u && (e.preventDefault(), (e.returnValue = ""));
        }),
        document.addEventListener(
          "click",
          (e) => {
            if (
              0 === u ||
              e.defaultPrevented ||
              0 !== e.button ||
              e.metaKey ||
              e.ctrlKey ||
              e.shiftKey ||
              e.altKey
            )
              return;
            let t = e.target?.closest?.("a[href]");
            if (!t || "_blank" === t.target || t.hasAttribute("download"))
              return;
            let r = new URL(t.href, window.location.href);
            r.origin !== window.location.origin ||
              ((r.pathname !== window.location.pathname ||
                r.search !== window.location.search) &&
                (window.confirm(
                  "Hệ thống đang xử lý yêu cầu của thầy cô (soạn đề, lưu đề hoặc tải tệp). Rời trang bây giờ có thể làm mất kết quả. Thầy cô vẫn muốn rời trang?",
                ) ||
                  (e.preventDefault(), e.stopPropagation())));
          },
          !0,
        ),
        window.addEventListener("pagehide", (e) => {
          if (!e.persisted)
            for (let { url: e, token: t } of l.values()) f(e, t);
        }));
    }
    function m() {
      (d(), u++);
      let e = !1;
      return () => {
        !e && ((e = !0), u--);
      };
    }
    function f(e, t) {
      try {
        fetch(e, {
          method: "POST",
          keepalive: !0,
          headers: t ? { Authorization: `Bearer ${t}` } : {},
        }).catch(() => {});
      } catch {}
    }
    let p = "https://api.soandethi.com".replace(/\/+$/, "");
    function w(e) {
      return `${p}${e.startsWith("/") ? e : `/${e}`}`;
    }
    class g extends Error {
      status;
      code;
      requestId;
      validationErrors;
      stage;
      model;
      upstreamStatus;
      upstreamReason;
      constructor(e, t) {
        (super(e),
          (this.name = "ApiError"),
          (this.status = t.status),
          (this.code = t.code),
          (this.requestId = t.requestId),
          (this.validationErrors = t.validationErrors),
          (this.stage = t.stage),
          (this.model = t.model),
          (this.upstreamStatus = t.upstreamStatus),
          (this.upstreamReason = t.upstreamReason));
      }
    }
    async function y(e, t, r, n) {
      let a = t(r),
        o = "GET" === (a.method ?? "GET").toUpperCase() ? () => {} : m();
      try {
        let o = await fetch(w(e), a);
        if (401 !== o.status || !n || !r) return o;
        let i = null;
        try {
          i = await s(p, r);
        } catch {}
        if (!i || i === r) return o;
        return (
          await o.body?.cancel().catch(() => {}),
          await fetch(w(e), t(i))
        );
      } finally {
        o();
      }
    }
    function v(e, t, r) {
      return new g(t?.error || `Dịch vụ trả về lỗi ${e.status}.`, {
        status: t?.status ?? e.status,
        code: t?.code ?? (t ? `http_${e.status}` : "invalid_api_response"),
        requestId: t?.requestId ?? e.headers.get("X-Request-ID") ?? r,
        stage: t?.stage,
        model: t?.model,
        upstreamStatus: t?.upstreamStatus,
        upstreamReason: t?.upstreamReason,
        validationErrors: t?.validationErrors,
      });
    }
    async function k(e, t, r = {}) {
      let n,
        a = void 0 === r.accessToken ? await s(p) : r.accessToken,
        o = crypto.randomUUID();
      try {
        n = await y(
          e,
          (e) => ({
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Request-ID": o,
              ...(e ? { Authorization: `Bearer ${e}` } : {}),
            },
            body: JSON.stringify(t),
            signal: r.signal,
          }),
          a,
          void 0 === r.accessToken,
        );
      } catch (e) {
        if (e instanceof DOMException && "AbortError" === e.name) throw e;
        throw new g(
          "Không kết nối được tới dịch vụ. Hãy kiểm tra mạng rồi thử lại.",
          { status: 0, code: "network_error", requestId: o },
        );
      }
      let i = await n.json().catch(() => null);
      if ((c(), !n.ok || !i || !1 === i.success)) throw v(n, i, o);
      return i;
    }
    async function E(e, t, r, n = {}) {
      let a,
        o = void 0 === n.accessToken ? await s(p) : n.accessToken,
        i = crypto.randomUUID();
      try {
        a = await y(
          t,
          (t) => ({
            method: e,
            headers: {
              ...(void 0 === r ? {} : { "Content-Type": "application/json" }),
              "X-Request-ID": i,
              ...(t ? { Authorization: `Bearer ${t}` } : {}),
            },
            body: void 0 === r ? void 0 : JSON.stringify(r),
            signal: n.signal,
            keepalive: n.keepalive,
            cache: "no-store",
          }),
          o,
          void 0 === n.accessToken,
        );
      } catch (e) {
        if (e instanceof DOMException && "AbortError" === e.name) throw e;
        throw new g(
          "Không kết nối được tới dịch vụ. Hãy kiểm tra mạng rồi thử lại.",
          { status: 0, code: "network_error", requestId: i },
        );
      }
      let c = await a.json().catch(() => null);
      if (!a.ok || !c || !1 === c.success) throw v(a, c, i);
      return c;
    }
    async function T(e, t, r = {}) {
      let n,
        a = void 0 === r.accessToken ? await s(p) : r.accessToken,
        o = crypto.randomUUID();
      try {
        n = await y(
          e,
          (e) => ({
            method: "POST",
            headers: {
              "X-Request-ID": o,
              ...(e ? { Authorization: `Bearer ${e}` } : {}),
            },
            body: t,
            signal: r.signal,
          }),
          a,
          void 0 === r.accessToken,
        );
      } catch (e) {
        if (e instanceof DOMException && "AbortError" === e.name) throw e;
        throw new g("Không tải được tệp lên. Hãy kiểm tra mạng rồi thử lại.", {
          status: 0,
          code: "network_error",
          requestId: o,
        });
      }
      let i = await n.json().catch(() => null);
      if (!n.ok || !i || !1 === i.success) throw v(n, i, o);
      return i;
    }
    async function b(e, t, r = {}) {
      let n = void 0 === r.accessToken ? await s(p) : r.accessToken,
        a = crypto.randomUUID(),
        o = "/api/chat-exam" === e || "/api/chat-exam/plan" === e,
        i = w(`/api/chat-exam/jobs/${a}/cancel`),
        u = m(),
        h = o
          ? (d(), l.set(a, { url: i, token: n }), () => l.delete(a))
          : () => {},
        y = () => {
          o && f(i, n);
        };
      r.signal?.addEventListener("abort", y, { once: !0 });
      try {
        return await x(e, t, r, n, a);
      } catch (e) {
        var v;
        if (
          !o ||
          !(
            (!((v = e) instanceof DOMException) || "AbortError" !== v.name) &&
            (v instanceof g
              ? "network_error" === v.code ||
                "stream_ended_early" === v.code ||
                "stream_interrupted" === v.code
              : v instanceof TypeError)
          ) ||
          r.signal?.aborted
        )
          throw e;
        return (
          r.onProgress?.({
            stage: "reconnect",
            message: "Mạng chập chờn, đang chờ kết quả từ máy chủ…",
          }),
          await D(a, n, e, r)
        );
      } finally {
        (r.signal?.removeEventListener("abort", y), h(), u(), c());
      }
    }
    async function D(e, t, r, n) {
      let a = Date.now(),
        o = 0;
      for (let i = 0; Date.now() - a < 9e5; i++) {
        let a;
        await (function (e, t) {
          return new Promise((r, n) => {
            if (t?.aborted) return n(new DOMException("Aborted", "AbortError"));
            let a = setTimeout(r, e);
            t?.addEventListener(
              "abort",
              () => {
                (clearTimeout(a), n(new DOMException("Aborted", "AbortError")));
              },
              { once: !0 },
            );
          });
        })(Math.min(1e3 * (i + 1), 5e3), n.signal);
        try {
          a = await y(
            `/api/chat-exam/jobs/${e}`,
            (e) => ({
              headers: e ? { Authorization: `Bearer ${e}` } : {},
              signal: n.signal,
            }),
            t,
            !0,
          );
        } catch (e) {
          if (e instanceof DOMException && "AbortError" === e.name) throw e;
          continue;
        }
        let s = a.ok ? await a.json().catch(() => null) : null;
        if (!s?.status) {
          if (401 !== a.status && ++o >= 3) throw r;
          continue;
        }
        if ("done" !== s.status) continue;
        let c = s.payload;
        if ("error" === s.event || !c || !1 === c.success) throw v(a, c, e);
        return c;
      }
      throw new g(
        "Mất kết nối quá lâu nên chưa lấy được kết quả. Vui lòng thử lại.",
        { status: 0, code: "network_error", requestId: e },
      );
    }
    async function x(e, t, r, n, a) {
      let o, i;
      try {
        o = await y(
          e,
          (e) => ({
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "text/event-stream, application/json",
              "X-Request-ID": a,
              ...(r.aiTurnId ? { "X-AI-Turn-ID": r.aiTurnId } : {}),
              ...(e ? { Authorization: `Bearer ${e}` } : {}),
            },
            body: JSON.stringify(t),
            signal: r.signal,
          }),
          n,
          void 0 === r.accessToken,
        );
      } catch (e) {
        if (e instanceof DOMException && "AbortError" === e.name) throw e;
        throw new g(
          "Không kết nối được tới dịch vụ. Hãy kiểm tra mạng rồi thử lại.",
          { status: 0, code: "network_error", requestId: a },
        );
      }
      if (
        !(o.headers.get("content-type") ?? "").includes("text/event-stream")
      ) {
        let e = await o.json().catch(() => null);
        if (!o.ok || !e || !1 === e.success) throw v(o, e, a);
        return e;
      }
      if (!o.ok || !o.body) throw v(o, null, a);
      let s = o.body.getReader(),
        c = new TextDecoder(),
        u = "",
        l = (e) => {
          let t;
          if (!e) return;
          let n = "message",
            s = [];
          for (let t of e.split("\n"))
            !t.startsWith(":") &&
              (t.startsWith("event:") && (n = t.slice(6).trim()),
              t.startsWith("data:") && s.push(t.slice(5).trimStart()));
          if (0 !== s.length) {
            try {
              t = JSON.parse(s.join("\n"));
            } catch {
              throw new g("Dịch vụ trả về một event stream không hợp lệ.", {
                status: 502,
                code: "invalid_stream_event",
                requestId: a,
              });
            }
            if ("progress" === n) {
              let e = t;
              e.message &&
                r.onProgress?.({ stage: e.stage ?? "", message: e.message });
              return;
            }
            if ("delta" === n) {
              let e = t;
              "string" == typeof e.text &&
                e.text &&
                r.onDelta?.({
                  action: "string" == typeof e.action ? e.action : "",
                  text: e.text,
                });
              return;
            }
            if ("reset" === n) {
              let e = t;
              r.onReset?.("string" == typeof e.message ? e.message : "");
              return;
            }
            if ("error" !== n && "result" !== n && "message" !== n)
              return void r.onEvent?.(n, t);
            if ("error" === n) throw v(o, t, a);
            if ("result" === n) {
              if (!t || "object" != typeof t) throw v(o, null, a);
              if (!1 === t.success) throw v(o, t, a);
              i = t;
            }
          }
        };
      try {
        for (;;) {
          let e;
          try {
            e = await s.read();
          } catch (e) {
            if (e instanceof DOMException && "AbortError" === e.name) throw e;
            throw new g("Kết nối bị ngắt giữa chừng.", {
              status: 0,
              code: "stream_interrupted",
              requestId: a,
            });
          }
          let { done: t, value: r } = e;
          u += c.decode(r, { stream: !t });
          let n = (u = u.replace(/\r\n/g, "\n")).indexOf("\n\n");
          for (; n >= 0; ) {
            if ((l(u.slice(0, n)), void 0 !== i)) return i;
            n = (u = u.slice(n + 2)).indexOf("\n\n");
          }
          if (t) break;
        }
        if ((u.trim() && l(u.trim()), void 0 === i))
          throw new g("Luồng phản hồi kết thúc trước khi có kết quả.", {
            status: 502,
            code: "stream_ended_early",
            requestId: a,
          });
        return i;
      } finally {
        (await s.cancel().catch(() => {}), s.releaseLock());
      }
    }
    e.s(
      [
        "API_BASE_URL",
        0,
        p,
        "ApiError",
        0,
        g,
        "apiUrl",
        0,
        w,
        "fetchAuthed",
        0,
        y,
        "formatApiError",
        0,
        function (e) {
          let t =
              e instanceof Error ? e.message : "Đã xảy ra lỗi không xác định.",
            r =
              e instanceof g
                ? e.code?.trim() || "api_error"
                : e instanceof Error
                  ? "client_error"
                  : "unknown_error";
          return `${t}
M\xe3 lỗi: ${r}`;
        },
        "postForm",
        0,
        T,
        "postJson",
        0,
        k,
        "postJsonStream",
        0,
        b,
        "requestJson",
        0,
        E,
      ],
      715760,
    );
  },
  618566,
  (e, t, r) => {
    t.exports = e.r(976562);
  },
]);
