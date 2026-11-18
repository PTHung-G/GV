(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  829691,
  97923,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(522016),
      a = e.i(618566),
      r = e.i(271645),
      s = e.i(728574),
      i = e.i(716327),
      o = e.i(632781),
      l = e.i(456420);
    let c = (0, l.default)("log-in", [
      ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
      ["path", { d: "M15 12H3", key: "6jk70r" }],
      [
        "path",
        { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" },
      ],
    ]);
    e.s(["LogIn", 0, c], 97923);
    var d = e.i(367784),
      u = e.i(77071),
      h = e.i(328623),
      p = e.i(474816),
      m = e.i(765649);
    let g = (0, l.default)("wallet", [
      [
        "path",
        {
          d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
          key: "18etb6",
        },
      ],
      [
        "path",
        { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" },
      ],
    ]);
    var x = e.i(127923),
      f = e.i(63270),
      v = e.i(167881),
      b = e.i(630374);
    let w = null;
    function j() {
      return window.google
        ? Promise.resolve()
        : (w ||
            (w = new Promise((e, t) => {
              let n = document.createElement("script");
              ((n.src = "https://accounts.google.com/gsi/client"),
                (n.async = !0),
                (n.onload = () => e()),
                (n.onerror = () => {
                  ((w = null),
                    n.remove(),
                    t(Error("Không tải được đăng nhập Google.")));
                }),
                document.head.appendChild(n));
            })),
          w);
    }
    let y = "exam-google-client-id";
    function k() {
      try {
        return localStorage.getItem(y) || "";
      } catch {
        return "";
      }
    }
    function N({ clientId: e, onCredential: n }) {
      let a = (0, r.useRef)(null),
        s = (0, r.useRef)(n),
        [i, o] = (0, r.useState)(""),
        [l, c] = (0, r.useState)(!1);
      return (
        (0, r.useEffect)(() => {
          s.current = n;
        }, [n]),
        (0, r.useEffect)(() => {
          let t = !0;
          return (
            j()
              .then(() => {
                t &&
                  a.current &&
                  window.google &&
                  (window.google.accounts.id.initialize({
                    client_id: e,
                    auto_select: !1,
                    callback: ({ credential: e }) => {
                      t && s.current(e);
                    },
                  }),
                  a.current.replaceChildren(),
                  window.google.accounts.id.renderButton(a.current, {
                    theme: "filled_blue",
                    size: "large",
                    width: Math.min(
                      320,
                      a.current.parentElement?.clientWidth || 320,
                    ),
                    text: "signin_with",
                    locale: "vi",
                  }),
                  c(!0));
              })
              .catch((e) => {
                t && o(e.message);
              }),
            () => {
              t = !1;
            }
          );
        }, [e]),
        (0, t.jsxs)("div", {
          className: "relative min-h-10 w-full max-w-80",
          children: [
            !l &&
              !i &&
              (0, t.jsx)("div", {
                "aria-busy": "true",
                className:
                  "absolute inset-0 flex animate-pulse items-center justify-center rounded-full bg-neutral-100 text-sm text-neutral-500",
                children: "Đang tải đăng nhập Google…",
              }),
            (0, t.jsx)("div", { ref: a, className: "flex justify-center" }),
            i &&
              (0, t.jsx)("p", {
                role: "alert",
                className: "text-sm text-red-600",
                children: i,
              }),
          ],
        })
      );
    }
    var C = e.i(665137),
      S = e.i(775691);
    let P = [
        [/Barcelona/, "Threads"],
        [/Instagram/, "Instagram"],
        [/FBAN\/Messenger|MessengerForiOS|FB_IAB\/Orca/, "Messenger"],
        [/FBAN|FBAV|FB_IAB|FBIOS|FB4A/, "Facebook"],
        [/Zalo/i, "Zalo"],
        [/musical_ly|BytedanceWebview|TikTok/, "TikTok"],
        [/\bLine\//, "LINE"],
      ],
      A = "dang-nhap";
    function E() {
      return (function (e, t = "") {
        let n = /Android/i.test(e)
            ? "android"
            : /iPhone|iPad|iPod/i.test(e)
              ? "ios"
              : "other",
          a = P.find(([t]) => t.test(e));
        return a
          ? { app: a[1], os: n }
          : /IABMV/.test(e)
            ? { app: /threads\./.test(t) ? "Threads" : "Facebook", os: n }
            : "android" === n && /; wv\)/.test(e)
              ? { app: "", os: n }
              : null;
      })(navigator.userAgent, document.referrer);
    }
    var _ = e.i(384185),
      I = e.i(689664),
      M = e.i(508734),
      L = e.i(482022),
      R = e.i(389567);
    function F({ provider: e, className: n = "size-4" }) {
      return "google" === e
        ? (0, t.jsxs)("svg", {
            viewBox: "0 0 24 24",
            role: "img",
            "aria-label": "Google",
            className: n,
            children: [
              (0, t.jsx)("path", {
                fill: "#2383e2",
                d: "M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.3 3-7.4Z",
              }),
              (0, t.jsx)("path", {
                fill: "#34A853",
                d: "M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4H3.1v2.6A10 10 0 0 0 12 22Z",
              }),
              (0, t.jsx)("path", {
                fill: "#FBBC05",
                d: "M6.4 14.1a6 6 0 0 1 0-4.2V7.3H3.1a10 10 0 0 0 0 9.4l3.3-2.6Z",
              }),
              (0, t.jsx)("path", {
                fill: "#EA4335",
                d: "M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 12 2a10 10 0 0 0-8.9 5.3l3.3 2.6c.8-2.3 3-4 5.6-4Z",
              }),
            ],
          })
        : "facebook" === e
          ? (0, t.jsxs)("svg", {
              viewBox: "0 0 24 24",
              role: "img",
              "aria-label": "Facebook",
              className: n,
              children: [
                (0, t.jsx)("circle", {
                  cx: "12",
                  cy: "12",
                  r: "11",
                  fill: "#1877F2",
                }),
                (0, t.jsx)("path", {
                  fill: "white",
                  d: "M13.6 23v-9h3l.5-3.5h-3.5V8.3c0-1 .3-1.7 1.8-1.7h1.8V3.5c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6v2.5H7V14h3v9Z",
                }),
              ],
            })
          : (0, t.jsx)(m.UserRound, {
              role: "img",
              "aria-label": "Tài khoản",
              className: n,
            });
    }
    function T({ browser: e, next: n, busy: a, onGoogle: s }) {
      let i,
        [l, c] = (0, r.useState)(!1),
        d = e.app || "ứng dụng",
        u =
          "ios" === e.os
            ? "Safari"
            : "android" === e.os
              ? "Chrome"
              : "trình duyệt",
        h =
          ((i = new URL(n, window.location.origin)).searchParams.set(A, "1"),
          i.toString()),
        p = (function (e, { app: t, os: n }) {
          let a = new URL(e),
            r = `${a.host}${a.pathname}${a.search}${a.hash}`;
          return "android" === n
            ? `intent://${r}#Intent;scheme=${a.protocol.slice(0, -1)};package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(e)};end`
            : "ios" !== n
              ? null
              : "Threads" === t
                ? `barcelona://extbrowser/?url=${encodeURIComponent(e)}`
                : "Instagram" === t
                  ? `instagram://extbrowser/?url=${encodeURIComponent(e)}`
                  : `x-safari-${a.protocol.slice(0, -1)}://${r}`;
        })(h, e),
        m = "ios" === e.os ? s : void 0;
      async function g() {
        (0, R.track)("inapp_open_external", { app: e.app, how: "copy" });
        try {
          (await navigator.clipboard.writeText(h), c(!0));
        } catch {
          window.prompt("Sao chép liên kết này rồi dán vào trình duyệt:", h);
        }
      }
      return (
        (0, r.useEffect)(() => {
          (0, R.track)("inapp_browser", { app: e.app, os: e.os });
        }, [e]),
        (0, t.jsxs)("div", {
          className:
            "grid w-full gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-[#37352f]",
          children: [
            m
              ? (0, t.jsxs)(t.Fragment, {
                  children: [
                    (0, t.jsxs)("p", {
                      children: [
                        "Bạn đang xem trang trong ",
                        (0, t.jsx)("b", { children: d }),
                        ". Bấm nút dưới để đăng nhập Google ngay tại đây.",
                      ],
                    }),
                    (0, t.jsxs)(v.Button, {
                      className: `h-10 gap-2 ${_.inkButton}`,
                      disabled: a,
                      onClick: () => {
                        ((0, R.track)("inapp_google_redirect", { app: e.app }),
                          m());
                      },
                      children: [
                        a
                          ? (0, t.jsx)(o.Loader2, {
                              className: "size-4 animate-spin",
                              "aria-hidden": !0,
                            })
                          : (0, t.jsx)(F, {
                              provider: "google",
                              className: "size-4",
                            }),
                        "Tiếp tục với Google",
                      ],
                    }),
                    (0, t.jsxs)("p", {
                      className: "text-xs text-neutral-600",
                      children: [
                        "Google báo lỗi hoặc không quay lại được? Mở trang bằng ",
                        u,
                        ":",
                      ],
                    }),
                  ],
                })
              : (0, t.jsxs)("p", {
                  children: [
                    "Bạn đang xem trang trong ",
                    (0, t.jsx)("b", { children: d }),
                    ". Google không cho đăng nhập ở đây, hãy mở trang bằng ",
                    (0, t.jsx)("b", { children: u }),
                    " để đăng nhập bằng Google.",
                  ],
                }),
            p &&
              (0, t.jsx)(v.Button, {
                asChild: !0,
                variant: m ? "outline" : "default",
                className: m
                  ? "h-10 gap-2 bg-white"
                  : `h-10 gap-2 ${_.inkButton}`,
                onClick: () =>
                  (0, R.track)("inapp_open_external", {
                    app: e.app,
                    how: "button",
                  }),
                children: (0, t.jsxs)("a", {
                  href: p,
                  children: [
                    (0, t.jsx)(L.ExternalLink, {
                      className: "size-4",
                      "aria-hidden": !0,
                    }),
                    "Mở bằng ",
                    u,
                  ],
                }),
              }),
            (0, t.jsxs)(v.Button, {
              variant: "outline",
              className: "h-10 gap-2 bg-white",
              onClick: () => void g(),
              children: [
                l
                  ? (0, t.jsx)(I.Check, {
                      className: "size-4",
                      "aria-hidden": !0,
                    })
                  : (0, t.jsx)(M.Copy, {
                      className: "size-4",
                      "aria-hidden": !0,
                    }),
                l
                  ? `Đ\xe3 sao ch\xe9p - d\xe1n v\xe0o ${u}`
                  : "Sao chép liên kết",
              ],
            }),
            (0, t.jsxs)("p", {
              className: "text-xs text-neutral-600",
              children: [
                "Không mở được? Bấm nút ",
                (0, t.jsx)("b", { children: "•••" }),
                " hoặc ",
                (0, t.jsx)("b", { children: "⋮" }),
                " ở góc trên màn hình rồi chọn ",
                (0, t.jsx)("b", { children: "Mở bằng trình duyệt" }),
                ".",
              ],
            }),
          ],
        })
      );
    }
    var B = e.i(647163);
    function D({ enabled: e, children: n }) {
      return e
        ? (0, t.jsx)("div", {
            className: "flex items-center gap-1.5",
            children: n,
          })
        : (0, t.jsx)(t.Fragment, { children: n });
    }
    function $({ href: e, icon: a, onNavigate: r, children: s }) {
      return (0, t.jsxs)(n.default, {
        href: e,
        onClick: r,
        className:
          "flex h-8 items-center gap-2 rounded-md px-2 text-sm text-[#37352f] hover:bg-[#f1f1ef] [&_svg]:size-4 [&_svg]:text-[#787774]",
        children: [a, s],
      });
    }
    e.s(
      [
        "AccountMenu",
        0,
        function ({ className: e, topup: l = !0, compact: w = !1 } = {}) {
          let [P, I] = (0, r.useState)(null),
            [M, L] = (0, r.useState)(!1),
            [O, V] = (0, r.useState)(null),
            [z, q] = (0, r.useState)(null),
            [U, G] = (0, r.useState)(!1),
            [H, Z] = (0, r.useState)(0),
            [K, J] = (0, r.useState)(!1),
            [Q, W] = (0, r.useState)({}),
            [X, Y] = (0, r.useState)([]),
            [ee, et] = (0, r.useState)(""),
            [en, ea] = (0, r.useState)(null),
            [er, es] = (0, r.useState)(null),
            ei = (0, a.usePathname)(),
            [eo, el] = (0, r.useState)(ei);
          eo !== ei && (el(ei), G(!1));
          let [ec, ed] = (0, r.useState)(k),
            [eu, eh] = (0, r.useState)(!1),
            [ep] = (0, r.useState)(E),
            em = (0, r.useCallback)(() => {
              let e = (0, S.readSession)()?.user.id;
              if (!e) {
                (V(null), q(null));
                return;
              }
              (0, C.getAccount)("/api/auth/quota")
                .then((t) => {
                  (0, S.readSession)()?.user.id === e &&
                    (V(t.balance), q(t.expiring ?? null));
                })
                .catch(() => {
                  (0, S.readSession)()?.user.id === e && V(null);
                });
            }, []),
            eg = (0, r.useCallback)((e) => {
              (ea(e), es(null), et(""), Y([]), Z((e) => e + 1), G(!0));
            }, []);
          (0, r.useEffect)(() => {
            let e = () => {
              (I((0, S.readSession)()?.user ?? null), L(!0), em());
            };
            e();
            let t = E();
            (0, S.readSession)() || t || j().catch(() => {});
            let n = new URL(window.location.href),
              a = n.searchParams.has(A);
            (a &&
              (n.searchParams.delete(A),
              window.history.replaceState(window.history.state, "", n),
              (0, R.track)("inapp_arrived", { embedded: !!t })),
              (0, C.getAccount)("/api/auth/providers")
                .then((e) => {
                  var t = e.googleClientId;
                  try {
                    t && localStorage.setItem(y, t);
                  } catch {}
                  (ed(e.googleClientId),
                    W({ facebook: e.facebook, emailCodes: e.emailCodes }));
                })
                .catch((e) => et(e.message)));
            let r = (e) => {
                (0, S.readSession)() ||
                  (eg(e.detail ?? null), (0, R.track)("login_prompt"));
              },
              s = (t) => {
                t.key === S.SESSION_KEY && e();
              };
            (window.addEventListener("exam-session-change", e),
              window.addEventListener("storage", s),
              window.addEventListener("exam-login-request", r),
              window.addEventListener("exam-quota-change", em),
              window.addEventListener("focus", em));
            let i = window.setInterval(em, 3e4);
            return (
              a && (0, S.requestLogin)(),
              () => {
                (window.removeEventListener("exam-session-change", e),
                  window.removeEventListener("storage", s),
                  window.removeEventListener("exam-login-request", r),
                  window.removeEventListener("exam-quota-change", em),
                  window.removeEventListener("focus", em),
                  window.clearInterval(i));
              }
            );
          }, [em, eg]);
          let ex = en && "run" in en ? en : null,
            ef = U
              ? (ex?.next ?? window.location.pathname + window.location.search)
              : "/";
          async function ev(e) {
            (es("working"), et(""));
            try {
              await e.run();
            } catch (e) {
              (et(e instanceof Error ? e.message : "Đã xảy ra lỗi."),
                es("failed"));
            }
          }
          function eb(e) {
            e.notices?.length ? Y(e.notices) : ex ? ev(ex) : G(!1);
          }
          function ew(e) {
            e || "working" === er || G(!1);
          }
          async function ej(e) {
            if (!K) {
              (J(!0), et(""));
              try {
                let t = await (0, C.login)("google", { idToken: e });
                ((0, R.track)("login_success", { method: "google" }), eb(t));
              } catch (e) {
                et(e instanceof Error ? e.message : "Đăng nhập thất bại.");
              } finally {
                J(!1);
              }
            }
          }
          async function ey(e) {
            if (!K) {
              (J(!0), et(""));
              try {
                window.location.assign(await (0, C.startOAuth)(e, ef));
              } catch (t) {
                (et(
                  t instanceof Error
                    ? t.message
                    : `Kh\xf4ng mở được đăng nhập ${"google" === e ? "Google" : "Facebook"}.`,
                ),
                  J(!1));
              }
            }
          }
          let ek = P?.displayName || P?.email || "Tài khoản",
            eN = null !== O && O < 0;
          return (0, t.jsxs)(t.Fragment, {
            children: [
              M
                ? P
                  ? (0, t.jsxs)(D, {
                      enabled: l,
                      children: [
                        l &&
                          (0, t.jsxs)(n.default, {
                            href: "/nap-diem",
                            title: "Nạp điểm",
                            "aria-label": "Nạp điểm",
                            className: (0, B.cn)(
                              "hidden h-8 shrink-0 items-center gap-1.5 rounded-md border border-[#e3e2e0] bg-white px-2.5 text-[13px] font-medium text-[#37352f] hover:bg-[#f1f1ef]",
                              w ? "md:flex md:px-2 xl:px-2.5" : "sm:flex",
                            ),
                            children: [
                              (0, t.jsx)("span", {
                                className:
                                  "grid size-4 place-items-center rounded bg-[#37352f] text-white",
                                children: (0, t.jsx)(u.Plus, {
                                  "aria-hidden": !0,
                                  className: "size-3",
                                  strokeWidth: 3,
                                }),
                              }),
                              (0, t.jsx)("span", {
                                className: w ? "hidden xl:inline" : void 0,
                                children: "Nạp điểm",
                              }),
                            ],
                          }),
                        (0, t.jsxs)(x.Popover.Root, {
                          open: eu,
                          onOpenChange: eh,
                          children: [
                            (0, t.jsx)(x.Popover.Trigger, {
                              asChild: !0,
                              children: (0, t.jsxs)(v.Button, {
                                variant: "ghost",
                                className: (0, B.cn)(
                                  "group h-9 w-9 justify-center gap-2 rounded-md px-0 text-[#37352f] hover:bg-[#f1f1ef] data-[open=true]:bg-[#f1f1ef]",
                                  w
                                    ? "xl:w-[168px] xl:justify-start xl:px-1.5 xl:pr-2"
                                    : "sm:w-[168px] sm:justify-start sm:px-1.5 sm:pr-2",
                                  e,
                                ),
                                "data-open": eu,
                                "aria-haspopup": "menu",
                                "aria-label": `${ek}, ${null === O ? "đang tải" : O.toLocaleString("vi-VN")} điểm`,
                                children: [
                                  (0, t.jsxs)(f.Avatar, {
                                    className: "size-7 shrink-0 rounded-md",
                                    children: [
                                      (0, t.jsx)(f.AvatarImage, {
                                        src: P.avatarUrl,
                                        alt: "",
                                        className: "rounded-md",
                                      }),
                                      (0, t.jsx)(f.AvatarFallback, {
                                        className:
                                          "rounded-md bg-[#e7f3f8] text-[11px] font-semibold text-[#0b6bcb]",
                                        children: ek.slice(0, 2).toUpperCase(),
                                      }),
                                    ],
                                  }),
                                  (0, t.jsxs)("span", {
                                    className: (0, B.cn)(
                                      "hidden min-w-0 flex-1 flex-col text-left",
                                      w ? "xl:flex" : "sm:flex",
                                    ),
                                    children: [
                                      (0, t.jsx)("span", {
                                        className:
                                          "truncate text-[13px] leading-tight font-medium",
                                        title: ek,
                                        children: ek,
                                      }),
                                      (0, t.jsxs)("span", {
                                        className: (0, B.cn)(
                                          "mt-0.5 flex items-center gap-1 text-[11px] leading-none tabular-nums",
                                          eN
                                            ? "text-[#eb5757]"
                                            : "text-[#787774]",
                                        ),
                                        children: [
                                          (0, t.jsx)(h.Sparkles, {
                                            className: "size-2.5 shrink-0",
                                            "aria-hidden": !0,
                                          }),
                                          (0, t.jsxs)("span", {
                                            children: [
                                              null === O
                                                ? "…"
                                                : O.toLocaleString("vi-VN"),
                                              " điểm",
                                            ],
                                          }),
                                          z &&
                                            (0, t.jsx)("span", {
                                              "aria-label":
                                                "Có điểm sắp hết hạn",
                                              className:
                                                "size-1.5 shrink-0 rounded-full bg-[#cb912f]",
                                            }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, t.jsx)(i.ChevronDown, {
                                    className: (0, B.cn)(
                                      "hidden size-3.5 shrink-0 text-[#9b9a97] transition-transform duration-200",
                                      w ? "xl:block" : "sm:block",
                                      eu && "rotate-180",
                                    ),
                                    "aria-hidden": !0,
                                  }),
                                ],
                              }),
                            }),
                            (0, t.jsx)(x.Popover.Portal, {
                              children: (0, t.jsxs)(x.Popover.Content, {
                                align: "end",
                                sideOffset: 6,
                                collisionPadding: 12,
                                onOpenAutoFocus: (e) => e.preventDefault(),
                                className:
                                  "doc-menu z-50 w-72 rounded-lg border border-[#e3e2e0] bg-white p-1.5 text-[#37352f] shadow-[0_8px_28px_-8px_rgba(55,53,47,0.28)] outline-none",
                                children: [
                                  (0, t.jsxs)("div", {
                                    className:
                                      "flex items-center gap-3 px-2 pt-2 pb-3",
                                    children: [
                                      (0, t.jsxs)(f.Avatar, {
                                        className:
                                          "size-10 shrink-0 rounded-md",
                                        children: [
                                          (0, t.jsx)(f.AvatarImage, {
                                            src: P.avatarUrl,
                                            alt: "",
                                            className: "rounded-md",
                                          }),
                                          (0, t.jsx)(f.AvatarFallback, {
                                            className:
                                              "rounded-md bg-[#e7f3f8] text-xs font-semibold text-[#0b6bcb]",
                                            children: ek
                                              .slice(0, 2)
                                              .toUpperCase(),
                                          }),
                                        ],
                                      }),
                                      (0, t.jsxs)("div", {
                                        className: "min-w-0",
                                        children: [
                                          (0, t.jsx)("p", {
                                            className:
                                              "truncate text-sm font-semibold",
                                            children: ek,
                                          }),
                                          P.email &&
                                            (0, t.jsx)("p", {
                                              className:
                                                "truncate text-xs text-[#787774]",
                                              children: P.email,
                                            }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, t.jsxs)("div", {
                                    className:
                                      "mx-1.5 mb-1.5 rounded-md bg-[#f7f6f3] px-3 py-2.5 text-sm",
                                    children: [
                                      (0, t.jsxs)("div", {
                                        className:
                                          "flex items-center justify-between",
                                        children: [
                                          (0, t.jsxs)("span", {
                                            className:
                                              "flex items-center gap-1.5 text-[#787774]",
                                            children: [
                                              (0, t.jsx)(h.Sparkles, {
                                                "aria-hidden": !0,
                                                className: "size-3.5",
                                              }),
                                              " Điểm tín dụng AI",
                                            ],
                                          }),
                                          (0, t.jsx)("strong", {
                                            className: (0, B.cn)(
                                              "text-base tabular-nums",
                                              eN && "text-[#eb5757]",
                                            ),
                                            children:
                                              null === O
                                                ? "…"
                                                : O.toLocaleString("vi-VN"),
                                          }),
                                        ],
                                      }),
                                      z &&
                                        (0, t.jsxs)("p", {
                                          className:
                                            "mt-1.5 rounded bg-[#fbf3db] px-2 py-1 text-xs text-[#8a6a1f]",
                                          children: [
                                            z.points.toLocaleString("vi-VN"),
                                            " điểm hết hạn ngày",
                                            " ",
                                            new Date(z.at).toLocaleDateString(
                                              "vi-VN",
                                              {
                                                day: "2-digit",
                                                month: "2-digit",
                                                timeZone: "Asia/Ho_Chi_Minh",
                                              },
                                            ),
                                          ],
                                        }),
                                      (0, t.jsx)(v.Button, {
                                        asChild: !0,
                                        className: "mt-2.5 h-8 w-full",
                                        children: (0, t.jsxs)(n.default, {
                                          href: "/nap-diem",
                                          onClick: () => eh(!1),
                                          children: [
                                            (0, t.jsx)(u.Plus, {
                                              "aria-hidden": !0,
                                            }),
                                            " Nạp điểm",
                                          ],
                                        }),
                                      }),
                                    ],
                                  }),
                                  (0, t.jsx)($, {
                                    href: "/profile",
                                    icon: (0, t.jsx)(m.UserRound, {
                                      "aria-hidden": !0,
                                    }),
                                    onNavigate: () => eh(!1),
                                    children: "Trang cá nhân",
                                  }),
                                  (0, t.jsx)($, {
                                    href: "/profile#vi-diem",
                                    icon: (0, t.jsx)(g, { "aria-hidden": !0 }),
                                    onNavigate: () => eh(!1),
                                    children: "Ví điểm & lịch sử nạp",
                                  }),
                                  (0, t.jsx)($, {
                                    href: "/missions",
                                    icon: (0, t.jsx)(p.Trophy, {
                                      "aria-hidden": !0,
                                    }),
                                    onNavigate: () => eh(!1),
                                    children: "Nhiệm vụ",
                                  }),
                                  (0, t.jsx)($, {
                                    href: "/memory",
                                    icon: (0, t.jsx)(s.BrainCircuit, {
                                      "aria-hidden": !0,
                                    }),
                                    onNavigate: () => eh(!1),
                                    children: "Trí nhớ của trợ lý",
                                  }),
                                  (0, t.jsx)("div", {
                                    className: "my-1 border-t border-[#e9e9e7]",
                                  }),
                                  (0, t.jsxs)("button", {
                                    type: "button",
                                    disabled: K,
                                    className:
                                      "flex h-8 w-full items-center gap-2 rounded-md px-2 text-sm text-[#5f5e5b] hover:bg-[#f1f1ef] disabled:opacity-50 [&_svg]:size-4",
                                    onClick: async () => {
                                      J(!0);
                                      try {
                                        (await (0, C.logout)(), eh(!1));
                                      } finally {
                                        J(!1);
                                      }
                                    },
                                    children: [
                                      (0, t.jsx)(d.LogOut, {
                                        "aria-hidden": !0,
                                      }),
                                      " Đăng xuất",
                                    ],
                                  }),
                                ],
                              }),
                            }),
                          ],
                        }),
                      ],
                    })
                  : (0, t.jsx)("div", {
                      className: (0, B.cn)(
                        "flex h-9 w-9 justify-end sm:w-[168px]",
                        e,
                      ),
                      children: (0, t.jsxs)(v.Button, {
                        className: (0, B.cn)(
                          "h-9 w-9 gap-1.5 rounded-md px-0 sm:w-auto sm:px-3",
                          _.inkButton,
                        ),
                        title: "Đăng nhập",
                        "aria-label": "Đăng nhập",
                        onClick: () => eg(null),
                        children: [
                          (0, t.jsx)(c, {
                            className: "size-4",
                            "aria-hidden": !0,
                          }),
                          (0, t.jsx)("span", {
                            className: "hidden sm:inline",
                            children: "Đăng nhập",
                          }),
                        ],
                      }),
                    })
                : (0, t.jsx)("div", {
                    "aria-hidden": !0,
                    className: (0, B.cn)(
                      "h-9 w-9 rounded-md bg-[#f1f1ef]",
                      w ? "xl:w-[168px]" : "sm:w-[168px]",
                      e,
                    ),
                  }),
              (0, t.jsx)(b.Dialog, {
                open: U,
                onOpenChange: ew,
                children: (0, t.jsxs)(b.DialogContent, {
                  className:
                    "max-h-[90dvh] gap-6 overflow-y-auto rounded-xl border-[#e3e2e0] bg-white p-6 text-[#37352f] sm:max-w-md sm:p-8",
                  children: [
                    (0, t.jsxs)(b.DialogHeader, {
                      className:
                        "shrink-0 items-center text-center sm:text-center",
                      children: [
                        (0, t.jsx)(b.DialogTitle, {
                          className: "text-2xl font-semibold tracking-tight",
                          children:
                            er || X.length
                              ? "Đăng nhập thành công"
                              : (en?.title ?? "Chào mừng bạn"),
                        }),
                        (0, t.jsx)(b.DialogDescription, {
                          className: "text-neutral-500",
                          children: er
                            ? "Đang tiếp tục việc bạn vừa chọn."
                            : X.length
                              ? "Có vài điều bạn nên biết về tài khoản của mình."
                              : "Đăng nhập để tạo đề và làm việc cùng trợ lý AI.",
                        }),
                      ],
                    }),
                    er && ex
                      ? "working" === er
                        ? (0, t.jsxs)("p", {
                            role: "status",
                            className:
                              "flex items-center justify-center gap-2 text-sm font-medium text-neutral-700",
                            children: [
                              (0, t.jsx)(o.Loader2, {
                                className: "size-4 animate-spin",
                                "aria-hidden": !0,
                              }),
                              ex.working,
                            ],
                          })
                        : (0, t.jsxs)(t.Fragment, {
                            children: [
                              (0, t.jsx)("p", {
                                role: "alert",
                                className:
                                  "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700",
                                children: ee,
                              }),
                              (0, t.jsx)(v.Button, {
                                className: `h-10 ${_.inkButton}`,
                                onClick: () => void ev(ex),
                                children: "Thử lại",
                              }),
                            ],
                          })
                      : X.length > 0
                        ? (0, t.jsxs)(t.Fragment, {
                            children: [
                              (0, t.jsx)("ul", {
                                className: "grid gap-2",
                                children: X.map((e) =>
                                  (0, t.jsx)(
                                    "li",
                                    {
                                      className:
                                        "rounded-lg border border-[#e3e2e0] bg-[#f7f6f3] px-3 py-2 text-sm leading-6",
                                      children: e,
                                    },
                                    e,
                                  ),
                                ),
                              }),
                              (0, t.jsx)(v.Button, {
                                className: `h-10 ${_.inkButton}`,
                                onClick: () => (ex ? void ev(ex) : ew(!1)),
                                children: ex?.action ?? "Đã hiểu",
                              }),
                            ],
                          })
                        : (0, t.jsxs)(t.Fragment, {
                            children: [
                              ee &&
                                (0, t.jsx)("p", {
                                  role: "alert",
                                  className:
                                    "shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700",
                                  children: ee,
                                }),
                              (0, t.jsxs)("div", {
                                className: "grid justify-items-center gap-3",
                                children: [
                                  ep
                                    ? (0, t.jsx)(T, {
                                        browser: ep,
                                        next: ef,
                                        busy: K,
                                        onGoogle: ec
                                          ? () => void ey("google")
                                          : void 0,
                                      })
                                    : ec
                                      ? (0, t.jsxs)("div", {
                                          className:
                                            "relative flex w-full justify-center",
                                          children: [
                                            (0, t.jsx)("div", {
                                              className: `flex w-full justify-center ${K ? "pointer-events-none opacity-30" : ""}`,
                                              children: (0, t.jsx)(N, {
                                                clientId: ec,
                                                onCredential: (e) => void ej(e),
                                              }),
                                            }),
                                            K &&
                                              (0, t.jsxs)("div", {
                                                role: "status",
                                                className:
                                                  "absolute inset-0 flex items-center justify-center gap-2 text-sm font-medium text-neutral-700",
                                                children: [
                                                  (0, t.jsx)(o.Loader2, {
                                                    className:
                                                      "size-4 animate-spin",
                                                  }),
                                                  "Đang đăng nhập…",
                                                ],
                                              }),
                                          ],
                                        })
                                      : (0, t.jsx)("p", {
                                          className:
                                            "text-center text-sm text-neutral-500",
                                          children:
                                            "Đăng nhập Google chưa được cấu hình.",
                                        }),
                                  Q.facebook &&
                                    (0, t.jsxs)(v.Button, {
                                      variant: "outline",
                                      className:
                                        "h-10 w-full max-w-80 gap-2 rounded-full",
                                      disabled: K,
                                      onClick: () => void ey("facebook"),
                                      children: [
                                        (0, t.jsx)(F, {
                                          provider: "facebook",
                                          className: "size-5",
                                        }),
                                        "Tiếp tục với Facebook",
                                      ],
                                    }),
                                ],
                              }),
                              (0, t.jsxs)("div", {
                                className:
                                  "relative text-center text-xs text-neutral-400",
                                children: [
                                  (0, t.jsx)("div", {
                                    className:
                                      "absolute inset-x-0 top-1/2 border-t border-neutral-200",
                                  }),
                                  (0, t.jsx)("span", {
                                    className: "relative bg-white px-3",
                                    children: "hoặc tiếp tục với email",
                                  }),
                                ],
                              }),
                              (0, t.jsx)(
                                _.EmailAuth,
                                {
                                  emailCodes: !!Q.emailCodes,
                                  busy: K,
                                  setBusy: J,
                                  setError: et,
                                  onSession: eb,
                                },
                                H,
                              ),
                              (0, t.jsxs)("p", {
                                className:
                                  "text-center text-xs text-neutral-500",
                                children: [
                                  "Khi tiếp tục, bạn đồng ý với",
                                  " ",
                                  (0, t.jsx)(n.default, {
                                    href: "/terms",
                                    className:
                                      "text-[#2383e2] underline-offset-2 hover:underline",
                                    onClick: () => G(!1),
                                    children: "Điều khoản sử dụng",
                                  }),
                                  " ",
                                  "và",
                                  " ",
                                  (0, t.jsx)(n.default, {
                                    href: "/privacy",
                                    className:
                                      "text-[#2383e2] underline-offset-2 hover:underline",
                                    onClick: () => G(!1),
                                    children: "Chính sách bảo mật",
                                  }),
                                  ".",
                                ],
                              }),
                            ],
                          }),
                  ],
                }),
              }),
            ],
          });
        },
      ],
      829691,
    );
  },
  384185,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(271645),
      a = e.i(167881),
      r = e.i(23750),
      s = e.i(10708),
      i = e.i(715760),
      o = e.i(665137),
      l = e.i(389567),
      c = e.i(647163);
    function d({
      id: e,
      name: a,
      length: r = 6,
      disabled: s,
      autoFocus: i,
      onComplete: o,
    }) {
      let [l, u] = (0, n.useState)(""),
        [h, p] = (0, n.useState)(!1),
        m = (0, n.useRef)(null),
        g = Math.min(l.length, r - 1);
      return (0, t.jsxs)("div", {
        className: "relative mx-auto w-full max-w-xs",
        onClick: () => m.current?.focus(),
        children: [
          (0, t.jsx)("div", {
            "aria-hidden": !0,
            className: "grid gap-2",
            style: { gridTemplateColumns: `repeat(${r}, minmax(0, 1fr))` },
            children: Array.from({ length: r }, (e, n) => {
              let a = l[n],
                i = h && n === g && (n !== r - 1 || l.length !== r);
              return (0, t.jsx)(
                "div",
                {
                  className: (0, c.cn)(
                    "flex aspect-[4/5] items-center justify-center rounded-lg border bg-white font-mono text-2xl font-semibold text-[#37352f] transition-colors",
                    a ? "border-[#37352f]/40" : "border-[#e3e2e0]",
                    i && "border-[#37352f] ring-2 ring-[#37352f]/15",
                    s && "opacity-50",
                  ),
                  children:
                    a ??
                    (i
                      ? (0, t.jsx)(
                          "span",
                          {
                            className:
                              "h-7 w-0.5 rounded-full bg-[#37352f] animate-[caret-blink_1.06s_infinite] motion-reduce:animate-none",
                          },
                          l.length,
                        )
                      : (0, t.jsx)("span", {
                          className: "text-[#c7c6c3]",
                          children: "_",
                        })),
                },
                n,
              );
            }),
          }),
          (0, t.jsx)("input", {
            ref: m,
            id: e,
            name: a,
            value: l,
            inputMode: "numeric",
            autoComplete: "one-time-code",
            pattern: `\\d{${r}}`,
            required: !0,
            autoFocus: i,
            disabled: s,
            "aria-label": `M\xe3 x\xe1c minh ${r} chữ số`,
            className:
              "absolute inset-0 h-full w-full cursor-text bg-transparent text-transparent caret-transparent opacity-0 outline-none selection:bg-transparent",
            onFocus: () => p(!0),
            onBlur: () => p(!1),
            onChange: (e) => {
              let t = e.target.value.replace(/\D/g, "").slice(0, r);
              (u(t), t.length === r && t !== l && o?.(t));
            },
          }),
        ],
      });
    }
    let u =
        "bg-[#37352f] font-semibold text-white hover:bg-[#1f1e1b] focus-visible:ring-[#37352f]/30",
      h =
        "font-medium text-[#2383e2] underline-offset-4 hover:underline disabled:opacity-50";
    function p({ label: e, htmlFor: n, aside: a, children: r }) {
      return (0, t.jsxs)("div", {
        className: "grid gap-2",
        children: [
          (0, t.jsxs)("div", {
            className: "flex items-center justify-between",
            children: [(0, t.jsx)(s.Label, { htmlFor: n, children: e }), a],
          }),
          r,
        ],
      });
    }
    function m({ defaultValue: e, busy: n }) {
      return (0, t.jsx)(p, {
        label: "Email",
        htmlFor: "auth-email",
        children: (0, t.jsx)(r.Input, {
          id: "auth-email",
          name: "email",
          type: "email",
          placeholder: "ban@example.com",
          required: !0,
          defaultValue: e,
          autoComplete: "email",
          disabled: n,
        }),
      });
    }
    e.s(
      [
        "EmailAuth",
        0,
        function ({
          emailCodes: e,
          busy: s,
          setBusy: c,
          setError: g,
          onSession: x,
          initialMode: f = "login",
        }) {
          let [v, b] = (0, n.useState)(f),
            [w, j] = (0, n.useState)(""),
            [y, k] = (0, n.useState)(null),
            [N, C] = (0, n.useState)(0),
            [S, P] = (0, n.useState)(() => Date.now()),
            [A, E] = (0, n.useState)(!1),
            _ = (0, n.useRef)(null);
          function I(e) {
            (g(""), E(!1), b(e));
          }
          async function M(t) {
            if (!s) {
              (c(!0), g(""));
              try {
                await t();
              } catch (t) {
                (t instanceof i.ApiError &&
                  "no_password" === t.code &&
                  e &&
                  E(!0),
                  g(
                    t instanceof Error
                      ? t.message
                      : "Đã có lỗi xảy ra. Vui lòng thử lại.",
                  ));
              } finally {
                c(!1);
              }
            }
          }
          function L(e, t) {
            (k(e), C(Date.now() + 1e3 * e.resendAfter), P(Date.now()), I(t));
          }
          function R(e, t) {
            return String(new FormData(e.currentTarget).get(t) ?? "");
          }
          if (
            ((0, n.useEffect)(() => {
              if (N <= Date.now()) return;
              let e = window.setInterval(() => P(Date.now()), 1e3);
              return () => window.clearInterval(e);
            }, [N]),
            "register-code" === v || "reset" === v)
          ) {
            let e = "register-code" === v ? "register" : "password",
              n = Math.max(0, Math.ceil((N - S) / 1e3));
            return (0, t.jsxs)("form", {
              ref: _,
              className: "grid gap-4",
              onSubmit: (e) => {
                e.preventDefault();
                let t = R(e, "code").replace(/\D/g, ""),
                  n = R(e, "password");
                M(async () => {
                  if ("register-code" === v) {
                    let e = await (0, o.completeRegistration)(w, t);
                    ((0, l.track)("signup_success", { method: "password" }),
                      x(e, "register"));
                  } else {
                    let e = await (0, o.resetPassword)(w, t, n);
                    ((0, l.track)("password_reset_success"), x(e, "reset"));
                  }
                });
              },
              children: [
                (0, t.jsxs)("p", {
                  className: "text-sm leading-6 text-neutral-600",
                  children: [
                    "Đã gửi mã 6 chữ số tới ",
                    (0, t.jsx)("span", {
                      className: "font-medium text-[#37352f]",
                      children: y?.email ?? w,
                    }),
                    ".",
                    "reset" === v &&
                      " Nếu email này có tài khoản, mã sẽ tới trong giây lát.",
                    " Không thấy thư thì hãy xem cả mục Spam hoặc Quảng cáo.",
                  ],
                }),
                (0, t.jsx)(d, {
                  id: "auth-code",
                  name: "code",
                  autoFocus: !0,
                  disabled: s,
                  onComplete: () => {
                    "register-code" === v
                      ? _.current?.requestSubmit()
                      : document.getElementById("auth-new-password")?.focus();
                  },
                }),
                "reset" === v &&
                  (0, t.jsx)(p, {
                    label: "Mật khẩu mới",
                    htmlFor: "auth-new-password",
                    children: (0, t.jsx)(r.Input, {
                      id: "auth-new-password",
                      name: "password",
                      type: "password",
                      placeholder: "Ít nhất 8 ký tự",
                      minLength: 8,
                      required: !0,
                      autoComplete: "new-password",
                      disabled: s,
                    }),
                  }),
                (0, t.jsx)(a.Button, {
                  className: `h-10 ${u}`,
                  disabled: s,
                  children: s
                    ? "Đang xử lý…"
                    : "reset" === v
                      ? "Đặt mật khẩu mới"
                      : "Xác minh và tạo tài khoản",
                }),
                (0, t.jsxs)("div", {
                  className: "flex items-center justify-between text-sm",
                  children: [
                    (0, t.jsx)("button", {
                      type: "button",
                      className: h,
                      disabled: s,
                      onClick: () => I("reset" === v ? "forgot" : "register"),
                      children: "Đổi email",
                    }),
                    (0, t.jsx)("button", {
                      type: "button",
                      className: h,
                      disabled: s || n > 0,
                      onClick: () =>
                        void M(async () => {
                          L(await (0, o.resendCode)(e, w), v);
                        }),
                      children:
                        n > 0 ? `Gửi lại m\xe3 sau ${n} gi\xe2y` : "Gửi lại mã",
                    }),
                  ],
                }),
              ],
            });
          }
          if ("forgot" === v)
            return (0, t.jsxs)("form", {
              className: "grid gap-4",
              onSubmit: (e) => {
                e.preventDefault();
                let t = R(e, "email").trim();
                M(async () => {
                  (j(t),
                    L(await (0, o.forgotPassword)(t), "reset"),
                    (0, l.track)("password_reset_requested"));
                });
              },
              children: [
                (0, t.jsx)("p", {
                  className: "text-sm leading-6 text-neutral-600",
                  children:
                    "Nhập email của tài khoản. Chúng tôi sẽ gửi mã để bạn đặt mật khẩu mới.",
                }),
                (0, t.jsx)(m, { defaultValue: w, busy: s }),
                (0, t.jsx)(a.Button, {
                  className: `h-10 ${u}`,
                  disabled: s,
                  children: s ? "Đang gửi…" : "Gửi mã",
                }),
                (0, t.jsx)("p", {
                  className: "text-center text-sm text-neutral-500",
                  children: (0, t.jsx)("button", {
                    type: "button",
                    className: h,
                    disabled: s,
                    onClick: () => I("login"),
                    children: "Quay lại đăng nhập",
                  }),
                }),
              ],
            });
          let F = "register" === v;
          return (0, t.jsxs)("form", {
            className: "grid gap-4",
            onSubmit: (e) => {
              e.preventDefault();
              let t = R(e, "email").trim(),
                n = R(e, "password"),
                a = R(e, "displayName").trim();
              M(async () => {
                if ((j(t), F))
                  (L(
                    await (0, o.startRegistration)({
                      email: t,
                      password: n,
                      displayName: a,
                    }),
                    "register-code",
                  ),
                    (0, l.track)("signup_otp_sent"));
                else {
                  let e = await (0, o.login)("password", {
                    email: t,
                    password: n,
                  });
                  ((0, l.track)("login_success", { method: "password" }),
                    x(e, "password"));
                }
              });
            },
            children: [
              F &&
                (0, t.jsx)(p, {
                  label: "Tên hiển thị",
                  htmlFor: "auth-display-name",
                  children: (0, t.jsx)(r.Input, {
                    id: "auth-display-name",
                    name: "displayName",
                    placeholder: "Tên của bạn",
                    required: !0,
                    maxLength: 80,
                    autoComplete: "name",
                    disabled: s,
                  }),
                }),
              (0, t.jsx)(m, { defaultValue: w, busy: s }),
              (0, t.jsx)(p, {
                label: "Mật khẩu",
                htmlFor: "auth-password",
                aside:
                  !F && e
                    ? (0, t.jsx)("button", {
                        type: "button",
                        className: `text-xs ${h}`,
                        disabled: s,
                        onClick: () => I("forgot"),
                        children: "Quên mật khẩu?",
                      })
                    : null,
                children: (0, t.jsx)(r.Input, {
                  id: "auth-password",
                  name: "password",
                  type: "password",
                  placeholder: F ? "Ít nhất 8 ký tự" : "Nhập mật khẩu",
                  required: !0,
                  minLength: F ? 8 : 1,
                  autoComplete: F ? "new-password" : "current-password",
                  disabled: s,
                }),
              }),
              A &&
                (0, t.jsxs)("button", {
                  type: "button",
                  className:
                    "rounded-lg border border-[#e3e2e0] px-3 py-2 text-left text-sm text-[#37352f] hover:bg-[#f7f6f3]",
                  disabled: s,
                  onClick: () =>
                    void M(async () => {
                      (L(await (0, o.forgotPassword)(w), "reset"),
                        (0, l.track)("password_reset_requested", {
                          source: "no_password",
                        }));
                    }),
                  children: [
                    (0, t.jsx)("span", {
                      className: "font-medium",
                      children: "Đặt mật khẩu qua email →",
                    }),
                    (0, t.jsxs)("span", {
                      className: "block text-neutral-500",
                      children: [
                        "Gửi mã tới ",
                        w,
                        " để đặt mật khẩu cho tài khoản này.",
                      ],
                    }),
                  ],
                }),
              (0, t.jsx)(a.Button, {
                className: `h-10 ${u}`,
                disabled: s,
                children: s
                  ? "Đang xử lý…"
                  : F
                    ? "Gửi mã xác minh"
                    : "Đăng nhập",
              }),
              e &&
                (0, t.jsxs)("p", {
                  className: "text-center text-sm text-neutral-500",
                  children: [
                    F ? "Đã có tài khoản?" : "Chưa có tài khoản?",
                    " ",
                    (0, t.jsx)("button", {
                      type: "button",
                      className: h,
                      disabled: s,
                      onClick: () => I(F ? "login" : "register"),
                      children: F ? "Đăng nhập" : "Đăng ký bằng email",
                    }),
                  ],
                }),
            ],
          });
        },
        "inkButton",
        0,
        u,
      ],
      384185,
    );
  },
  63270,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(271645),
      a = e.i(705844),
      r = e.i(30030),
      s = e.i(30207),
      i = e.i(934620),
      o = e.i(248425),
      l = Object.defineProperty,
      c = (e, t) => l(e, "name", { value: t, configurable: !0 }),
      d = "Avatar",
      [u, h] = (0, r.createContextScope)(d),
      p = [0, () => void 0],
      [m, g] = u(d),
      x = n.forwardRef(
        c(function (e, a) {
          let { __scopeAvatar: r, ...s } = e,
            [i, l] = n.useState("idle"),
            [c, d] = j();
          return (0, t.jsx)(m, {
            scope: r,
            imageLoadingStatus: i,
            setImageLoadingStatus: l,
            imageCount: c,
            setImageCount: d,
            children: (0, t.jsx)(o.Primitive.span, { ...s, ref: a }),
          });
        }, "Avatar"),
      ),
      f = n.forwardRef(
        c(function (e, a) {
          let { __scopeAvatar: r, src: l, onLoadingStatusChange: c, ...d } = e,
            u = g("AvatarImage", r);
          y(u.setImageCount);
          let h = b(l, {
              referrerPolicy: d.referrerPolicy,
              crossOrigin: d.crossOrigin,
              loadingStatus: u.imageLoadingStatus,
              setLoadingStatus: u.setImageLoadingStatus,
            }),
            p = (0, s.useCallbackRef)((e) => {
              c?.(e);
            }),
            m = n.useRef(h);
          return (
            (0, i.useLayoutEffect)(() => {
              let e = m.current;
              ((m.current = h), h !== e && p(h));
            }, [h, p]),
            "loaded" === h
              ? (0, t.jsx)(o.Primitive.img, { ...d, ref: a, src: l })
              : null
          );
        }, "AvatarImage"),
      ),
      v = n.forwardRef(
        c(function (e, a) {
          let { __scopeAvatar: r, delayMs: s, ...i } = e,
            l = g("AvatarFallback", r),
            [c, d] = n.useState(void 0 === s);
          return (
            n.useEffect(() => {
              if (void 0 !== s) {
                let e = window.setTimeout(() => d(!0), s);
                return () => window.clearTimeout(e);
              }
            }, [s]),
            c && "loaded" !== l.imageLoadingStatus
              ? (0, t.jsx)(o.Primitive.span, { ...i, ref: a })
              : null
          );
        }, "AvatarFallback"),
      );
    function b(
      e,
      {
        loadingStatus: t,
        setLoadingStatus: n,
        referrerPolicy: a,
        crossOrigin: r,
      },
    ) {
      return (
        (0, i.useLayoutEffect)(() => {
          if (!e) return void n("error");
          let t = new window.Image(),
            s = c((e) => {
              n(w(e.currentTarget));
            }, "handleLoad"),
            i = c(() => n("error"), "handleError");
          return (
            t.addEventListener("load", s),
            t.addEventListener("error", i),
            a && (t.referrerPolicy = a),
            (t.crossOrigin = r ?? null),
            (t.src = e),
            n(w(t)),
            () => {
              (t.removeEventListener("load", s),
                t.removeEventListener("error", i),
                n("idle"));
            }
          );
        }, [e, r, a, n]),
        t
      );
    }
    function w(e) {
      return e.complete ? (e.naturalWidth > 0 ? "loaded" : "error") : "loading";
    }
    function j() {
      let e = p;
      if (a.IS_DEVELOPMENT) {
        let [t] = (e = n.useState(0)),
          a = n.useRef(!1);
        n.useEffect(() => {
          t > 1 &&
            !a.current &&
            ((a.current = !0),
            console.warn(
              "Avatar: Only one `Avatar.Image` component should be rendered per `Avatar.Root`, but multiple were detected. This will lead to unexpected behavior.",
            ));
        }, [t]);
      }
      return e;
    }
    function y(e) {
      a.IS_DEVELOPMENT &&
        n.useEffect(
          () => (
            e((e) => e + 1),
            () => {
              e((e) => e - 1);
            }
          ),
          [e],
        );
    }
    (c(b, "useImageLoadingStatus"),
      c(w, "getImageLoadingStatus"),
      c(j, "useImageCount"),
      c(y, "useUpdateImageCount"),
      e.s(
        [
          "Avatar",
          0,
          x,
          "AvatarFallback",
          0,
          v,
          "AvatarImage",
          0,
          f,
          "Fallback",
          0,
          v,
          "Image",
          0,
          f,
          "Root",
          0,
          x,
          "createAvatarScope",
          0,
          h,
        ],
        97456,
      ));
    var k = e.i(97456),
      k = k,
      N = e.i(647163);
    e.s(
      [
        "Avatar",
        0,
        function ({ className: e, ...n }) {
          return (0, t.jsx)(k.Root, {
            "data-slot": "avatar",
            className: (0, N.cn)(
              "relative flex size-9 shrink-0 overflow-hidden rounded-full",
              e,
            ),
            ...n,
          });
        },
        "AvatarFallback",
        0,
        function ({ className: e, ...n }) {
          return (0, t.jsx)(k.Fallback, {
            "data-slot": "avatar-fallback",
            className: (0, N.cn)(
              "flex size-full items-center justify-center rounded-full bg-[#f1f1ef] text-sm font-medium text-[#2383e2]",
              e,
            ),
            ...n,
          });
        },
        "AvatarImage",
        0,
        function ({ className: e, ...n }) {
          return (0, t.jsx)(k.Image, {
            "data-slot": "avatar-image",
            referrerPolicy: "no-referrer",
            className: (0, N.cn)("aspect-square size-full object-cover", e),
            ...n,
          });
        },
      ],
      63270,
    );
  },
  665137,
  (e) => {
    "use strict";
    var t = e.i(715760),
      n = e.i(775691);
    async function a(e) {
      let a = await (0, n.sessionAccessToken)(t.API_BASE_URL),
        r = await (0, t.fetchAuthed)(
          e,
          (e) => ({
            headers: e ? { Authorization: `Bearer ${e}` } : {},
            cache: "no-store",
          }),
          a,
          !0,
        ),
        s = await r.json();
      if (!r.ok)
        throw new t.ApiError(s.error || "Không tải được thông tin tài khoản.", {
          status: r.status,
          code: s.code,
        });
      return s;
    }
    async function r(e, a) {
      let r = await (0, t.postJson)(e, a, { accessToken: null });
      return ((0, n.saveSession)(r), r);
    }
    async function s(e, t) {
      return r(
        "google" === e ? "/api/auth/oauth/google/token" : "/api/auth/login",
        t,
      );
    }
    async function i() {
      let e = (0, n.readSession)();
      ((0, n.saveSession)(null),
        e &&
          (await (0, t.postJson)(
            "/api/auth/logout",
            { refreshToken: e.refreshToken },
            { accessToken: null },
          )));
    }
    async function o(e, t) {
      let n = new URLSearchParams({ redirect_after: t });
      return (await a(`/api/auth/oauth/${e}/start?${n}`)).url;
    }
    e.s([
      "completeOAuth",
      0,
      function (e, t) {
        return r(`/api/auth/oauth/${encodeURIComponent(e)}/callback`, t);
      },
      "completeRegistration",
      0,
      function (e, t) {
        return r("/api/auth/register/verify", { email: e, code: t });
      },
      "forgotPassword",
      0,
      function (e) {
        return (0, t.postJson)(
          "/api/auth/password/forgot",
          { email: e },
          { accessToken: null },
        );
      },
      "getAccount",
      0,
      a,
      "login",
      0,
      s,
      "logout",
      0,
      i,
      "resendCode",
      0,
      function (e, n) {
        return (0, t.postJson)(
          `/api/auth/${e}/resend`,
          { email: n },
          { accessToken: null },
        );
      },
      "resetPassword",
      0,
      function (e, t, n) {
        return r("/api/auth/password/reset", {
          email: e,
          code: t,
          newPassword: n,
        });
      },
      "setPassword",
      0,
      function (e, n) {
        return (0, t.requestJson)("PUT", "/api/auth/password", {
          currentPassword: e,
          newPassword: n,
        });
      },
      "startOAuth",
      0,
      o,
      "startRegistration",
      0,
      function (e) {
        return (0, t.postJson)("/api/auth/register/start", e, {
          accessToken: null,
        });
      },
    ]);
  },
  663756,
  (e) => {
    "use strict";
    e.s([
      "daysUntil",
      0,
      function (e, t = Date.now()) {
        return Math.max(0, Math.ceil((new Date(e).getTime() - t) / 864e5));
      },
      "estimatedTurns",
      0,
      function (e) {
        return Math.max(1, Math.round(e / 2e3));
      },
      "formatDate",
      0,
      function (e) {
        return new Date(e).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "Asia/Ho_Chi_Minh",
        });
      },
      "formatPoints",
      0,
      function (e) {
        return e.toLocaleString("vi-VN");
      },
      "formatVnd",
      0,
      function (e) {
        return `${e.toLocaleString("vi-VN")}đ`;
      },
      "lotSourceLabel",
      0,
      function (e) {
        switch (e) {
          case "package":
            return "Gói tháng";
          case "topup":
            return "Nạp lẻ";
          case "promo":
            return "Thưởng khuyến mãi";
          case "reward":
            return "Thưởng nhiệm vụ";
          case "initial":
            return "Điểm tặng ban đầu";
          case "adjustment":
            return "Quản trị viên cộng";
          case "legacy":
            return "Điểm hiện có";
          default:
            return "Điểm";
        }
      },
      "orderStatusLabel",
      0,
      function (e) {
        switch (e) {
          case "pending":
            return "Đang chờ";
          case "paid":
            return "Thành công";
          case "expired":
            return "Hết hạn";
          case "cancelled":
            return "Đã huỷ";
          default:
            return e;
        }
      },
      "packageBonusPercent",
      0,
      function (e, t) {
        let n = t.reduce(
          (e, t) => (!e || t.priceVnd < e.priceVnd ? t : e),
          null,
        );
        return n && n.id !== e.id
          ? Math.round(
              (e.points / e.priceVnd / (n.points / n.priceVnd) - 1) * 100,
            )
          : 0;
      },
      "parseAmountInput",
      0,
      function (e) {
        let t = e.replace(/\D/g, "").slice(0, 9);
        return t ? Number(t) : 0;
      },
      "promoUntil",
      0,
      function (e, t) {
        if (!e) return "";
        let [n, a = ""] = e.split("T"),
          r =
            n === t ? "hôm nay" : `ng\xe0y ${n.slice(8, 10)}/${n.slice(5, 7)}`;
        if ("23:59:59" === a) return `đến hết ${r}`;
        let s = a.endsWith(":00") ? a.slice(0, 5) : a;
        return `đến ${s} ${r}`;
      },
      "topupQuote",
      0,
      function (e, t) {
        let n = Math.floor((t * e.topupPointsPer1000) / 1e3),
          a = e.promo?.percent ?? 0,
          r = Math.floor((n * a) / 100);
        return { base: n, bonus: r, total: n + r, percent: a };
      },
    ]);
  },
  127923,
  (e) => {
    "use strict";
    var t = e.i(271645),
      n = e.i(981140),
      a = e.i(820783),
      r = e.i(30030),
      s = e.i(726330),
      i = e.i(303536),
      o = e.i(765491),
      l = e.i(610772),
      c = e.i(853660),
      d = e.i(774606),
      u = e.i(296626),
      h = e.i(248425),
      p = e.i(991918),
      m = e.i(369340),
      g = e.i(186312),
      x = e.i(985369),
      f = e.i(843476),
      v = Object.defineProperty,
      b = (e, t) => v(e, "name", { value: t, configurable: !0 }),
      w = "Popover",
      [j, y] = (0, r.createContextScope)(w, [c.createPopperScope]),
      k = (0, c.createPopperScope)(),
      [N, C] = j(w),
      S = b((e) => {
        let {
            __scopePopover: n,
            children: a,
            open: r,
            defaultOpen: s,
            onOpenChange: i,
            modal: o = !1,
          } = e,
          d = k(n),
          u = t.useRef(null),
          [h, p] = t.useState(!1),
          [g, x] = (0, m.useControllableState)({
            prop: r,
            defaultProp: s ?? !1,
            onChange: i,
            caller: w,
          });
        return (0, f.jsx)(c.Root, {
          ...d,
          children: (0, f.jsx)(N, {
            scope: n,
            contentId: (0, l.useId)(),
            triggerRef: u,
            open: g,
            onOpenChange: x,
            onOpenToggle: t.useCallback(() => x((e) => !e), [x]),
            hasCustomAnchor: h,
            onCustomAnchorAdd: t.useCallback(() => p(!0), []),
            onCustomAnchorRemove: t.useCallback(() => p(!1), []),
            modal: o,
            children: a,
          }),
        });
      }, "Popover"),
      P = t.forwardRef(
        b(function (e, n) {
          let { __scopePopover: a, ...r } = e,
            s = C("PopoverAnchor", a),
            i = k(a),
            { onCustomAnchorAdd: o, onCustomAnchorRemove: l } = s;
          return (
            t.useEffect(() => (o(), () => l()), [o, l]),
            (0, f.jsx)(c.Anchor, { ...i, ...r, ref: n })
          );
        }, "PopoverAnchor"),
      ),
      A = t.forwardRef(
        b(function (e, t) {
          let { __scopePopover: r, ...s } = e,
            i = C("PopoverTrigger", r),
            o = k(r),
            l = (0, a.useComposedRefs)(t, i.triggerRef),
            d = (0, f.jsx)(h.Primitive.button, {
              type: "button",
              "aria-haspopup": "dialog",
              "aria-expanded": i.open,
              "aria-controls": i.open ? i.contentId : void 0,
              "data-state": V(i.open),
              ...s,
              ref: l,
              onClick: (0, n.composeEventHandlers)(e.onClick, i.onOpenToggle),
            });
          return i.hasCustomAnchor
            ? d
            : (0, f.jsx)(c.Anchor, { asChild: !0, ...o, children: d });
        }, "PopoverTrigger"),
      ),
      E = "PopoverPortal",
      [_, I] = j(E, { forceMount: void 0 }),
      M = b((e) => {
        let { __scopePopover: t, forceMount: n, children: a, container: r } = e,
          s = C(E, t);
        return (0, f.jsx)(_, {
          scope: t,
          forceMount: n,
          children: (0, f.jsx)(u.Presence, {
            present: n || s.open,
            children: (0, f.jsx)(d.Portal, {
              asChild: !0,
              container: r,
              children: a,
            }),
          }),
        });
      }, "PopoverPortal"),
      L = "PopoverContent",
      R = t.forwardRef(
        b(function (e, t) {
          let n = I(L, e.__scopePopover),
            { forceMount: a = n.forceMount, ...r } = e,
            s = C(L, e.__scopePopover);
          return (0, f.jsx)(u.Presence, {
            present: a || s.open,
            children: s.modal
              ? (0, f.jsx)(T, { ...r, ref: t })
              : (0, f.jsx)(B, { ...r, ref: t }),
          });
        }, "PopoverContent"),
      ),
      F = (0, p.createSlot)("PopoverContent.RemoveScroll"),
      T = t.forwardRef(
        b(function (e, r) {
          let s = C(L, e.__scopePopover),
            i = t.useRef(null),
            o = (0, a.useComposedRefs)(r, i),
            l = t.useRef(!1);
          return (
            t.useEffect(() => {
              let e = i.current;
              if (e) return (0, g.hideOthers)(e);
            }, []),
            (0, f.jsx)(x.RemoveScroll, {
              as: F,
              allowPinchZoom: !0,
              children: (0, f.jsx)(D, {
                ...e,
                ref: o,
                trapFocus: s.open,
                disableOutsidePointerEvents: !0,
                onCloseAutoFocus: (0, n.composeEventHandlers)(
                  e.onCloseAutoFocus,
                  (e) => {
                    (e.preventDefault(),
                      l.current || s.triggerRef.current?.focus());
                  },
                ),
                onPointerDownOutside: (0, n.composeEventHandlers)(
                  e.onPointerDownOutside,
                  (e) => {
                    let t = e.detail.originalEvent,
                      n = 0 === t.button && !0 === t.ctrlKey;
                    l.current = 2 === t.button || n;
                  },
                  { checkForDefaultPrevented: !1 },
                ),
                onFocusOutside: (0, n.composeEventHandlers)(
                  e.onFocusOutside,
                  (e) => e.preventDefault(),
                  { checkForDefaultPrevented: !1 },
                ),
              }),
            })
          );
        }, "PopoverContentModal"),
      ),
      B = t.forwardRef(
        b(function (e, n) {
          let a = C(L, e.__scopePopover),
            r = t.useRef(!1),
            s = t.useRef(!1);
          return (0, f.jsx)(D, {
            ...e,
            ref: n,
            trapFocus: !1,
            disableOutsidePointerEvents: !1,
            onCloseAutoFocus: (t) => {
              (e.onCloseAutoFocus?.(t),
                t.defaultPrevented ||
                  (r.current || a.triggerRef.current?.focus(),
                  t.preventDefault()),
                (r.current = !1),
                (s.current = !1));
            },
            onInteractOutside: (t) => {
              (e.onInteractOutside?.(t),
                t.defaultPrevented ||
                  ((r.current = !0),
                  "pointerdown" === t.detail.originalEvent.type &&
                    (s.current = !0)));
              let n = t.target;
              (a.triggerRef.current?.contains(n) && t.preventDefault(),
                "focusin" === t.detail.originalEvent.type &&
                  s.current &&
                  t.preventDefault());
            },
          });
        }, "PopoverContentNonModal"),
      ),
      D = t.forwardRef(
        b(function (e, t) {
          let {
              __scopePopover: n,
              trapFocus: a,
              onOpenAutoFocus: r,
              onCloseAutoFocus: l,
              disableOutsidePointerEvents: d,
              onEscapeKeyDown: u,
              onPointerDownOutside: h,
              onFocusOutside: p,
              onInteractOutside: m,
              ...g
            } = e,
            x = C(L, n),
            v = k(n);
          return (
            (0, i.useFocusGuards)(),
            (0, f.jsx)(o.FocusScope, {
              asChild: !0,
              loop: !0,
              trapped: a,
              onMountAutoFocus: r,
              onUnmountAutoFocus: l,
              children: (0, f.jsx)(s.DismissableLayer, {
                asChild: !0,
                disableOutsidePointerEvents: d,
                onInteractOutside: m,
                onEscapeKeyDown: u,
                onPointerDownOutside: h,
                onFocusOutside: p,
                onDismiss: () => x.onOpenChange(!1),
                deferPointerDownOutside: !0,
                children: (0, f.jsx)(c.Content, {
                  "data-state": V(x.open),
                  role: "dialog",
                  id: x.contentId,
                  ...v,
                  ...g,
                  ref: t,
                  style: {
                    ...g.style,
                    "--radix-popover-content-transform-origin":
                      "var(--radix-popper-transform-origin)",
                    "--radix-popover-content-available-width":
                      "var(--radix-popper-available-width)",
                    "--radix-popover-content-available-height":
                      "var(--radix-popper-available-height)",
                    "--radix-popover-trigger-width":
                      "var(--radix-popper-anchor-width)",
                    "--radix-popover-trigger-height":
                      "var(--radix-popper-anchor-height)",
                  },
                }),
              }),
            })
          );
        }, "PopoverContentImpl"),
      ),
      $ = t.forwardRef(
        b(function (e, t) {
          let { __scopePopover: a, ...r } = e,
            s = C("PopoverClose", a);
          return (0, f.jsx)(h.Primitive.button, {
            type: "button",
            ...r,
            ref: t,
            onClick: (0, n.composeEventHandlers)(e.onClick, () =>
              s.onOpenChange(!1),
            ),
          });
        }, "PopoverClose"),
      ),
      O = t.forwardRef(
        b(function (e, t) {
          let { __scopePopover: n, ...a } = e,
            r = k(n);
          return (0, f.jsx)(c.Arrow, { ...r, ...a, ref: t });
        }, "PopoverArrow"),
      );
    function V(e) {
      return e ? "open" : "closed";
    }
    (b(V, "getState"),
      e.s(
        [
          "Anchor",
          0,
          P,
          "Arrow",
          0,
          O,
          "Close",
          0,
          $,
          "Content",
          0,
          R,
          "Popover",
          0,
          S,
          "PopoverAnchor",
          0,
          P,
          "PopoverArrow",
          0,
          O,
          "PopoverClose",
          0,
          $,
          "PopoverContent",
          0,
          R,
          "PopoverPortal",
          0,
          M,
          "PopoverTrigger",
          0,
          A,
          "Portal",
          0,
          M,
          "Root",
          0,
          S,
          "Trigger",
          0,
          A,
          "createPopoverScope",
          0,
          y,
        ],
        178761,
      ));
    var z = e.i(178761);
    e.s(["Popover", 0, z], 127923);
  },
  728574,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("brain-circuit", [
      [
        "path",
        {
          d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
          key: "l5xja",
        },
      ],
      ["path", { d: "M9 13a4.5 4.5 0 0 0 3-4", key: "10igwf" }],
      ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5", key: "105sqy" }],
      ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396", key: "ql3yin" }],
      ["path", { d: "M6 18a4 4 0 0 1-1.967-.516", key: "2e4loj" }],
      ["path", { d: "M12 13h4", key: "1ku699" }],
      ["path", { d: "M12 18h6a2 2 0 0 1 2 2v1", key: "105ag5" }],
      ["path", { d: "M12 8h8", key: "1lhi5i" }],
      ["path", { d: "M16 8V5a2 2 0 0 1 2-2", key: "u6izg6" }],
      ["circle", { cx: "16", cy: "13", r: ".5", key: "ry7gng" }],
      ["circle", { cx: "18", cy: "3", r: ".5", key: "1aiba7" }],
      ["circle", { cx: "20", cy: "21", r: ".5", key: "yhc1fs" }],
      ["circle", { cx: "20", cy: "8", r: ".5", key: "1e43v0" }],
    ]);
    e.s(["BrainCircuit", 0, t], 728574);
  },
  508734,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("copy", [
      [
        "rect",
        {
          width: "14",
          height: "14",
          x: "8",
          y: "8",
          rx: "2",
          ry: "2",
          key: "17jyea",
        },
      ],
      [
        "path",
        {
          d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
          key: "zix9uf",
        },
      ],
    ]);
    e.s(["Copy", 0, t], 508734);
  },
  482022,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("external-link", [
      ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
      ["path", { d: "M10 14 21 3", key: "gplh6r" }],
      [
        "path",
        {
          d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
          key: "a6xqqp",
        },
      ],
    ]);
    e.s(["ExternalLink", 0, t], 482022);
  },
  367784,
  765649,
  (e) => {
    "use strict";
    var t = e.i(456420);
    let n = (0, t.default)("log-out", [
      ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
      ["path", { d: "M21 12H9", key: "dn1m92" }],
      ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }],
    ]);
    e.s(["LogOut", 0, n], 367784);
    let a = (0, t.default)("user-round", [
      ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
      ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }],
    ]);
    e.s(["UserRound", 0, a], 765649);
  },
]);
