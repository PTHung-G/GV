// Reconstructed from 180c0fplvd4t3.pretty.js, module 93306.
// deps: m843476, m954808, m271645, m635416, m647163, m167881
// exports: MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport
export { function ({ className: e, ...n }) { return (0, t.jsx)(C, { "data-slot": "message-scroller", className: (0, A.cn)( "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden", e, ), ...n, }); } as "MessageScroller" };
export { function ({ direction: e = "end", className: n, children: r, render: a, variant: i = "outline", size: l = "icon-xs", ...s }) { return (0, t.jsx)(R, { "data-slot": "message-scroller-button", "data-direction": e, "data-variant": i, "data-size": l, direction: e, className: (0, A.cn)( "absolute left-1/2 -translate-x-1/2 z-20 rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-md backdrop-blur-xs transition-[translate,scale,opacity] duration-200 hover:bg-slate-100 hover:text-slate-900 data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[direction=end]:bottom-3 data-[direction=end]:data-[active=false]:translate-y-4 data-[direction=start]:top-3 data-[direction=start]:data-[active=false]:-translate-y-4", n, ), render: a ?? (0, t.jsx)(T.Button, { variant: i, size: l, className: "rounded-full shadow-sm", }), ...s, children: r ?? (0, t.jsxs)(t.Fragment, { children: [ (0, t.jsx)(I.ArrowDown, { className: `size-3.5 ${"start" === e ? "rotate-180" : ""}`, }), (0, t.jsx)("span", { className: "sr-only", children: "end" === e ? "Cuộn xuống cuối" : "Cuộn lên đầu", }), ], }), }); } as "MessageScrollerButton" };
export { function ({ className: e, ...n }) { return (0, t.jsx)(S, { "data-slot": "message-scroller-content", className: (0, A.cn)( "flex h-max min-h-full flex-col gap-3.5 p-4", e, ), ...n, }); } as "MessageScrollerContent" };
export { function ({ className: e, scrollAnchor: n = !1, ...r }) { return (0, t.jsx)(M, { "data-slot": "message-scroller-item", scrollAnchor: n, className: (0, A.cn)("min-w-0 shrink-0", e), ...r, }); } as "MessageScrollerItem" };
export { function (e) { return (0, t.jsx)(j, { ...e }); } as "MessageScrollerProvider" };
export { function ({ className: e, ...n }) { return (0, t.jsx)(N, { "data-slot": "message-scroller-viewport", className: (0, A.cn)( "size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain contain-content data-pending-scroll:invisible", e, ), ...n, }); } as "MessageScrollerViewport" };

"use strict";
    var t = m843476,
      n = m954808,
      r = m271645,
      a = new Set([
        "ArrowDown",
        "ArrowUp",
        "End",
        "Home",
        "PageDown",
        "PageUp",
        " ",
      ]),
      i = { start: !1, end: !1 },
      l = { currentAnchorId: null, visibleMessageIds: [] };
    function s(e, t) {
      return Array.from(e.children).filter(
        (e) => e instanceof HTMLElement && e !== t,
      );
    }
    function o(e, t) {
      let n = e.getBoundingClientRect(),
        r = t.getBoundingClientRect();
      return n.top - r.top + t.scrollTop;
    }
    function c(e, t) {
      return e.getBoundingClientRect().top - t.getBoundingClientRect().top;
    }
    function u({ content: e, spacer: t, viewport: n }) {
      let r = s(e, t),
        a = d(e),
        i = n.getBoundingClientRect(),
        l = n.scrollTop,
        o = a.start + a.end;
      for (let e of r)
        o = Math.max(o, e.getBoundingClientRect().bottom - i.top + l + a.end);
      return o;
    }
    function d(e) {
      let t = window.getComputedStyle(e);
      return {
        end: h(t.paddingBlockEnd || t.paddingBottom),
        start: h(t.paddingBlockStart || t.paddingTop),
      };
    }
    function h(e) {
      if (!e) return 0;
      let t = Number.parseFloat(e);
      return Number.isFinite(t) ? t : 0;
    }
    function m(e, t) {
      let n = e,
        r = new Set();
      return {
        getSnapshot: () => n,
        hasListeners: () => r.size > 0,
        setSnapshot: (e) => {
          t(n, e) || ((n = e), r.forEach((e) => e()));
        },
        subscribe: (e, t, n) => {
          let a = 0 === r.size;
          return (
            r.add(e),
            a && t?.(),
            () => {
              (r.delete(e), 0 === r.size && n?.());
            }
          );
        },
      };
    }
    function p(e, t) {
      return e.start === t.start && e.end === t.end;
    }
    function f(e, t) {
      return (
        e.currentAnchorId === t.currentAnchorId &&
        e.visibleMessageIds.length === t.visibleMessageIds.length &&
        e.visibleMessageIds.every((e, n) => e === t.visibleMessageIds[n])
      );
    }
    function g(e) {
      e.pendingDefaultScrollStore.setSnapshot(!1);
    }
    function x(e) {
      ((e.defaultScrollPositionAppliedRef.current = !0), g(e));
    }
    function b(e, t) {
      return r.useCallback(
        (n) => {
          ((e.current = n), n && t());
        },
        [e, t],
      );
    }
    var v = r.createContext(null),
      y = r.createContext(null);
    function w() {
      let e = r.useContext(v);
      if (!e)
        throw Error(
          "useMessageScroller must be used within a MessageScroller.",
        );
      return e;
    }
    function k() {
      let { pendingDefaultScrollStore: e } = w();
      return r.useSyncExternalStore(e.subscribe, e.getSnapshot, e.getSnapshot);
    }
    var j = function ({
        autoScroll: e = !1,
        children: n,
        defaultScrollPosition: a = "end",
        scrollEdgeThreshold: w,
        scrollPreviousItemPeek: k,
        scrollMargin: j,
      }) {
        let { context: C, registerMessage: N } = (function ({
          autoScroll: e = !1,
          defaultScrollPosition: t = "end",
          scrollEdgeThreshold: n = 8,
          scrollPreviousItemPeek: a = 64,
          scrollMargin: v = 0,
        }) {
          let y = (function ({
              autoScroll: e,
              defaultScrollPosition: t,
              scrollEdgeThreshold: n,
              scrollMargin: a,
              scrollPreviousItemPeek: s,
            }) {
              let o = r.useRef(e),
                c = r.useRef(!1),
                u = r.useRef(null),
                d = r.useRef(!1),
                h = r.useRef(n),
                g = r.useRef(0),
                x = r.useRef(null),
                b = r.useRef(0),
                v = r.useRef(e ? "following-bottom" : "free-scrolling"),
                y = r.useRef(new Map()),
                w = r.useRef(null),
                k = r.useRef(null),
                j = r.useRef(null),
                C = r.useRef(s),
                N = r.useRef(!0),
                S = r.useRef(null),
                M = r.useRef(a),
                R = r.useRef(null),
                I = r.useRef(0),
                A = r.useRef(0),
                T = r.useRef(null),
                E = r.useRef(null),
                P = r.useRef(null),
                $ = r.useRef(null),
                _ = r.useRef(null),
                q = r.useRef(null),
                z = r.useRef(null),
                D = r.useRef(null),
                O = r.useRef(null),
                L = r.useRef(new Set()),
                F = r.useRef(new WeakSet());
              return (
                null === P.current &&
                  (P.current = m(
                    "end" === t || "last-anchor" === t,
                    (e, t) => e === t,
                  )),
                null === $.current && ($.current = m(i, p)),
                null === O.current && (O.current = m(l, f)),
                (o.current = e),
                (h.current = n),
                (M.current = a),
                (C.current = s),
                {
                  autoScrollRef: o,
                  autoscrollingRef: c,
                  autoscrollingTimeoutRef: _,
                  streamingTurnRef: j,
                  contentRef: u,
                  defaultScrollPositionAppliedRef: d,
                  firstItemRef: x,
                  itemCountRef: g,
                  lastScrollTopRef: b,
                  messageElementsRef: y,
                  modeRef: v,
                  pendingScrollFrameRef: R,
                  pendingScrollToMessageRef: w,
                  prependRestoreRef: k,
                  preserveScrollOnPrependRef: N,
                  pendingDefaultScrollStore: P.current,
                  rootRef: S,
                  scrollEdgeThresholdRef: h,
                  scrollMarginRef: M,
                  scrollPreviousItemPeekRef: C,
                  spacerGapRef: I,
                  spacerHeightRef: A,
                  spacerRef: T,
                  stateFrameRef: E,
                  stateStore: $.current,
                  viewportRef: q,
                  visibilityFrameRef: z,
                  visibilityObserverRef: D,
                  visibilityStore: O.current,
                  visibleMessageIdsRef: L,
                  handledScrollAnchorsRef: F,
                }
              );
            })({
              autoScroll: e,
              defaultScrollPosition: t,
              scrollEdgeThreshold: n,
              scrollMargin: v,
              scrollPreviousItemPeek: a,
            }),
            {
              streamingTurnRef: w,
              autoScrollRef: k,
              autoscrollingRef: j,
              autoscrollingTimeoutRef: C,
              contentRef: N,
              defaultScrollPositionAppliedRef: S,
              firstItemRef: M,
              itemCountRef: R,
              lastScrollTopRef: I,
              messageElementsRef: A,
              modeRef: T,
              pendingScrollFrameRef: E,
              pendingScrollToMessageRef: P,
              prependRestoreRef: $,
              preserveScrollOnPrependRef: _,
              pendingDefaultScrollStore: q,
              rootRef: z,
              scrollEdgeThresholdRef: D,
              scrollMarginRef: O,
              scrollPreviousItemPeekRef: L,
              spacerGapRef: F,
              spacerHeightRef: H,
              spacerRef: B,
              stateFrameRef: K,
              stateStore: V,
              viewportRef: U,
              visibilityFrameRef: G,
              visibilityObserverRef: X,
              visibilityStore: Q,
              visibleMessageIdsRef: W,
              handledScrollAnchorsRef: J,
            } = y,
            Y = r.useRef(t);
          Y.current !== t && ((Y.current = t), (S.current = !1));
          let Z = r.useCallback((e) => {
              let t = z.current,
                n = U.current,
                r = [e.start && "start", e.end && "end"]
                  .filter(Boolean)
                  .join(" "),
                a = j.current;
              for (let e of [t, n])
                e &&
                  (r
                    ? e.setAttribute("data-scrollable", r)
                    : e.removeAttribute("data-scrollable"),
                  e.toggleAttribute("data-autoscrolling", a));
            }, []),
            ee = r.useCallback((e) => {
              let t = U.current?.scrollTop ?? 0,
                n = t < I.current - 0.5;
              ((I.current = t),
                k.current &&
                !e.end &&
                "settling-jump" !== T.current &&
                "anchored-to-message" !== T.current
                  ? (T.current = "following-bottom")
                  : "following-bottom" === T.current &&
                    e.end &&
                    n &&
                    !j.current &&
                    (T.current = "free-scrolling"));
            }, []),
            et = r.useCallback(() => {
              let e = (function ({
                content: e,
                scrollEdgeThreshold: t,
                spacer: n,
                viewport: r,
              }) {
                if (!r || !e) return i;
                let a = u({ content: e, spacer: n, viewport: r });
                return {
                  start: r.scrollTop > t,
                  end: a - r.scrollTop - r.clientHeight > t,
                };
              })({
                content: N.current,
                scrollEdgeThreshold: D.current,
                spacer: B.current,
                viewport: U.current,
              });
              ee(e);
              let t = "following-bottom" === T.current ? { ...e, end: !1 } : e;
              (Z(t), V.setSnapshot(t));
            }, [ee, V, Z]),
            en = r.useCallback(() => {
              null === K.current &&
                (K.current = window.requestAnimationFrame(() => {
                  ((K.current = null), et());
                }));
            }, [et]),
            er = r.useCallback(() => {
              Q.hasListeners() &&
                null === G.current &&
                (G.current = window.requestAnimationFrame(() => {
                  ((G.current = null),
                    Q.hasListeners() &&
                      Q.setSnapshot(
                        (function ({
                          content: e,
                          scrollMargin: t,
                          scrollPreviousItemPeek: n,
                          spacer: r,
                          viewport: a,
                          visibleMessageIds: i,
                        }) {
                          if (!e || !a) return l;
                          let o = a.getBoundingClientRect(),
                            c = o.top + t + n,
                            u = typeof IntersectionObserver > "u",
                            d = [],
                            h = null;
                          for (let t of s(e, r)) {
                            let e = t.dataset.messageId;
                            if (!e) continue;
                            let n = "true" === t.dataset.scrollAnchor,
                              r = n || u ? t.getBoundingClientRect() : null;
                            ((u && r
                              ? r.bottom > c && r.top < o.bottom
                              : i.has(e)) && d.push(e),
                              n && r && r.top <= c + 0.5 && (h = e));
                          }
                          return 0 === d.length && null === h
                            ? l
                            : { currentAnchorId: h, visibleMessageIds: d };
                        })({
                          content: N.current,
                          scrollMargin: O.current,
                          scrollPreviousItemPeek: L.current,
                          spacer: B.current,
                          viewport: U.current,
                          visibleMessageIds: W.current,
                        }),
                      ));
                }));
            }, [Q]),
            {
              flushPendingScrollToMessage: ea,
              reanchorToAnchoredMessage: ei,
              scrollToElement: el,
              scrollToEnd: es,
              scrollToMessage: eo,
              scrollToStart: ec,
            } = (function ({
              refs: e,
              commitScrollState: t,
              scheduleStateCommit: n,
              scheduleVisibilitySync: a,
            }) {
              let {
                  streamingTurnRef: i,
                  autoScrollRef: l,
                  autoscrollingRef: s,
                  autoscrollingTimeoutRef: h,
                  contentRef: m,
                  itemCountRef: p,
                  messageElementsRef: f,
                  modeRef: g,
                  pendingScrollToMessageRef: b,
                  prependRestoreRef: v,
                  scrollMarginRef: y,
                  scrollPreviousItemPeekRef: w,
                  spacerGapRef: k,
                  spacerHeightRef: j,
                  spacerRef: C,
                  viewportRef: N,
                } = e,
                S = r.useCallback(
                  (e) => {
                    (null !== h.current &&
                      (window.clearTimeout(h.current), (h.current = null)),
                      s.current !== e && ((s.current = e), t()),
                      e &&
                        (h.current = window.setTimeout(() => {
                          ((h.current = null), (s.current = !1), t());
                        }, 180)));
                  },
                  [t],
                ),
                M = r.useCallback((e) => {
                  let t = C.current;
                  if (!t) return;
                  let n = Math.max(0, Math.ceil(e));
                  j.current !== n &&
                    ((j.current = n),
                    (t.hidden = 0 === n),
                    (t.style.height = `${n}px`),
                    (t.style.marginTop = n > 0 ? `${-k.current}px` : ""));
                }, []),
                R = r.useCallback(
                  (e, { behavior: r = "auto", autoscrolling: a = !1 } = {}) => {
                    let i = N.current;
                    if (!i) return;
                    let l = Math.max(0, e);
                    if (0.5 >= Math.abs(i.scrollTop - l)) {
                      ((i.scrollTop = l), t());
                      return;
                    }
                    (a && S(!0), i.scrollTo({ top: l, behavior: r }), n());
                  },
                  [t, n, S],
                ),
                I = r.useCallback(
                  ({ behavior: e = "auto" } = {}) =>
                    !!N.current &&
                    (M(0),
                    (i.current = null),
                    (g.current = "free-scrolling"),
                    R(0, { behavior: e }),
                    a(),
                    !0),
                  [a, R, M],
                ),
                A = r.useCallback(
                  ({ behavior: e = "auto" } = {}) => {
                    let t = N.current;
                    return (
                      !!t &&
                      (M(0),
                      (i.current = null),
                      (g.current = l.current
                        ? "following-bottom"
                        : "free-scrolling"),
                      R(Math.max(0, t.scrollHeight - t.clientHeight), {
                        autoscrolling: !0,
                        behavior: e,
                      }),
                      a(),
                      !0)
                    );
                  },
                  [a, R, M],
                ),
                T = r.useCallback(
                  (
                    e,
                    {
                      align: t = "start",
                      behavior: n = "auto",
                      scrollMargin: r = y.current,
                    } = {},
                    { keepPreviousPeek: l = !1 } = {},
                  ) => {
                    let s = m.current,
                      h = N.current;
                    if (!s || !h || !s.contains(e)) return !1;
                    let p = (function ({
                      align: e,
                      element: t,
                      scrollMargin: n,
                      spacer: r,
                      viewport: a,
                    }) {
                      
                      let l,
                        s = o(t, a),
                        c = t.getBoundingClientRect().height,
                        u =
                          ((i = r),
                          (l = i?.parentElement) ? d(l) : { end: 0, start: 0 });
                      if ("center" === e) {
                        let e = Math.max(0, a.clientHeight - u.start - u.end);
                        return s - u.start - (e - c) / 2 - n;
                      }
                      if ("end" === e)
                        return s - a.clientHeight + c + u.end + n;
                      if ("nearest" === e) {
                        let e = s + c,
                          t = a.scrollTop + u.start,
                          r = a.scrollTop + a.clientHeight - u.end;
                        return s >= t && e <= r
                          ? a.scrollTop
                          : s < t
                            ? s - u.start - n
                            : e - a.clientHeight + u.end + n;
                      }
                      return s - u.start - n;
                    })({
                      align: t,
                      element: e,
                      scrollMargin: l ? r + w.current : r,
                      spacer: C.current,
                      viewport: h,
                    });
                    return (
                      M(
                        (function ({
                          content: e,
                          scrollTop: t,
                          spacer: n,
                          viewport: r,
                        }) {
                          let a = u({ content: e, spacer: n, viewport: r });
                          return t + r.clientHeight - a;
                        })({
                          content: s,
                          scrollTop: p,
                          spacer: C.current,
                          viewport: h,
                        }),
                      ),
                      (v.current = { element: e, viewportTop: c(e, h) }),
                      (g.current = l ? "anchored-to-message" : "settling-jump"),
                      (i.current = l ? e : null),
                      R(p, { behavior: n }),
                      a(),
                      !0
                    );
                  },
                  [a, R, M],
                ),
                E = r.useCallback(() => {
                  let e = i.current;
                  return (
                    !!e &&
                    !!e.isConnected &&
                    "anchored-to-message" === g.current &&
                    T(e, { align: "start" }, { keepPreviousPeek: !0 })
                  );
                }, [T]),
                P = r.useCallback(
                  (t, n) => {
                    let r = f.current.get(t);
                    return r
                      ? (x(e),
                        T(r, n)
                          ? (b.current = null)
                          : (b.current = { messageId: t, options: n }),
                        !0)
                      : 0 === p.current &&
                          ((b.current = { messageId: t, options: n }),
                          x(e),
                          !0);
                  },
                  [T],
                );
              return {
                flushPendingScrollToMessage: r.useCallback(() => {
                  let t = b.current;
                  if (!t) return !1;
                  let n = f.current.get(t.messageId);
                  return (
                    !!n && !!T(n, t.options) && ((b.current = null), x(e), !0)
                  );
                }, [T]),
                reanchorToAnchoredMessage: E,
                scrollToElement: T,
                scrollToEnd: A,
                scrollToMessage: P,
                scrollToStart: I,
              };
            })({
              refs: y,
              commitScrollState: et,
              scheduleStateCommit: en,
              scheduleVisibilitySync: er,
            }),
            eu = r.useCallback(() => {
              let e = $.current,
                t = U.current;
              if (!e || !t || !e.element.isConnected) return !1;
              let n = c(e.element, t) - e.viewportTop;
              return (
                !(0.5 >= Math.abs(n)) &&
                ((t.scrollTop += n),
                (e.viewportTop = c(e.element, t)),
                en(),
                er(),
                !0)
              );
            }, [en, er]),
            ed = r.useCallback(() => {
              let e = N.current,
                t = U.current;
              if (!e || !t) {
                $.current = null;
                return;
              }
              let n = (function ({ content: e, spacer: t, viewport: n }) {
                let r = n.getBoundingClientRect();
                for (let n of s(e, t)) {
                  if (!n.dataset.messageId) continue;
                  let e = n.getBoundingClientRect();
                  if (e.bottom > r.top && e.top < r.bottom) return n;
                }
                return null;
              })({ content: e, spacer: B.current, viewport: t });
              $.current = n ? { element: n, viewportTop: c(n, t) } : null;
            }, []),
            eh = r.useCallback(() => {
              null === E.current &&
                (E.current = window.requestAnimationFrame(() => {
                  ((E.current = null), ea() && ed());
                }));
            }, [ed, ea]),
            em = r.useCallback(() => {
              if (!t || S.current || 0 === R.current) return !1;
              let e = !1;
              if ("last-anchor" === t) {
                let t = N.current,
                  n = U.current,
                  r =
                    t && n
                      ? (function (e) {
                          for (let t = e.length - 1; t >= 0; t--) {
                            let n = e[t];
                            if (n?.dataset.scrollAnchor === "true") return n;
                          }
                          return null;
                        })(s(t, B.current))
                      : null;
                if (t && n && r) {
                  let a = o(r, n);
                  e =
                    u({ content: t, spacer: B.current, viewport: n }) - a <=
                    n.clientHeight
                      ? es({ behavior: "auto" })
                      : el(r, { align: "start" }, { keepPreviousPeek: !0 });
                } else e = es({ behavior: "auto" });
              } else
                e =
                  "end" === t
                    ? es({ behavior: "auto" })
                    : ec({ behavior: "auto" });
              return !!e && (x(y), !0);
            }, [t, el, es, ec]),
            ep = r.useCallback(() => {
              let e = N.current;
              if (!e) return;
              let t = s(e, B.current),
                n = R.current,
                r = M.current;
              ((R.current = t.length),
                (M.current = t[0] ?? null),
                (() => {
                  if (ea()) return;
                  if (0 === n) {
                    if (
                      em() ||
                      (t.length > 0 && k.current && es({ behavior: "auto" }))
                    )
                      return;
                    (et(), er());
                    return;
                  }
                  let e = r ? t.indexOf(r) : -1;
                  if (_.current && e > 0) return eu();
                  if (t.length > n) {
                    let e = (function (e, t) {
                      for (let n = t; n < e.length; n++) {
                        let t = e[n];
                        if (t?.dataset.scrollAnchor === "true") return t;
                      }
                      return null;
                    })(t, n);
                    if (e)
                      return k.current &&
                        "following-bottom" === T.current &&
                        (function (e, t) {
                          let n = 0;
                          for (let r = t; r < e.length; r++)
                            if (
                              e[r]?.dataset.scrollAnchor === "true" &&
                              (n += 1) > 1
                            )
                              return !0;
                          return !1;
                        })(t, n)
                        ? es({ behavior: "auto" })
                        : (el(e, { align: "start" }, { keepPreviousPeek: !0 }),
                          J.current.add(e));
                  }
                  if (t.length === n) {
                    let e = (function (e, t) {
                      for (let n of e)
                        if ("true" === n.dataset.scrollAnchor && !t.has(n))
                          return n;
                      return null;
                    })(t, J.current);
                    if (e) {
                      (el(e, { align: "start" }, { keepPreviousPeek: !0 }),
                        J.current.add(e));
                      return;
                    }
                  }
                  "following-bottom" === T.current && k.current
                    ? es({ behavior: "auto" })
                    : (et(), er());
                })(),
                ed());
            }, [em, ed, et, ea, eu, er, el, es]),
            ef = r.useCallback(() => {
              if ("following-bottom" === T.current && k.current)
                return void es({ behavior: "auto" });
              let e = H.current;
              if (ei()) {
                k.current &&
                  e > 0 &&
                  0 === H.current &&
                  es({ behavior: "auto" });
                return;
              }
              (en(), er());
            }, [ei, en, er, es]),
            eg = r.useCallback(() => {
              let e = U.current;
              if (!(!e || !Q.hasListeners())) {
                if (typeof IntersectionObserver > "u") return void er();
                (X.current ||
                  (X.current = new IntersectionObserver(
                    (e) => {
                      for (let t of e) {
                        let e = t.target.dataset.messageId;
                        e &&
                          (t.isIntersecting
                            ? W.current.add(e)
                            : W.current.delete(e));
                      }
                      er();
                    },
                    {
                      root: e,
                      rootMargin: `${-(O.current + L.current)}px 0px 0px 0px`,
                      threshold: [0, 0.01, 0.5, 1],
                    },
                  )),
                  A.current.forEach((e) => {
                    X.current?.observe(e);
                  }),
                  er());
              }
            }, [er, Q]),
            ex = r.useCallback(() => {
              (null !== G.current &&
                (window.cancelAnimationFrame(G.current), (G.current = null)),
                X.current?.disconnect(),
                (X.current = null),
                W.current.clear(),
                Q.setSnapshot(l));
            }, [Q]),
            eb = r.useCallback(
              (e, t, n) => {
                if (t) {
                  (A.current.set(e, t),
                    X.current?.observe(t),
                    er(),
                    P.current?.messageId === e && eh());
                  return;
                }
                n &&
                  A.current.get(e) === n &&
                  (A.current.delete(e),
                  W.current.delete(e),
                  X.current?.unobserve(n),
                  er());
              },
              [eh, er],
            ),
            ev = r.useCallback(() => {
              ("following-bottom" === T.current ||
                "anchored-to-message" === T.current ||
                "settling-jump" === T.current) &&
                ((w.current = null), (T.current = "free-scrolling"));
            }, []),
            ey = r.useCallback(() => Z(V.getSnapshot()), [V, Z]),
            ew = b(z, ey),
            ek = b(U, ey),
            ej = r.useCallback((e) => {
              N.current = e;
            }, []),
            eC = r.useCallback((e) => {
              ((B.current = e),
                (F.current = (function (e) {
                  if (!e) return 0;
                  let t = window.getComputedStyle(e);
                  return h("normal" === t.rowGap ? t.gap : t.rowGap);
                })(e?.parentElement ?? null)));
            }, []),
            eN = r.useCallback(() => {
              (et(), er(), ed());
            }, [ed, et, er]),
            eS = r.useMemo(
              () => ({
                handleContentChange: ep,
                handleResize: ef,
                observeVisibility: eg,
                pendingDefaultScrollStore: q,
                preserveScrollOnPrependRef: _,
                scrollToEnd: es,
                scrollToMessage: eo,
                scrollToStart: ec,
                setContentElement: ej,
                setRootElement: ew,
                setSpacerElement: eC,
                setViewportElement: ek,
                stateStore: V,
                syncAfterScroll: eN,
                unobserveVisibility: ex,
                userScrollIntent: ev,
                viewportRef: U,
                visibilityStore: Q,
              }),
              [ep, ef, eg, q, es, eo, ec, ej, ew, eC, ek, V, eN, ex, ev, Q],
            );
          return (
            r.useLayoutEffect(() => {
              em() || (0 === R.current && g(y));
            }, [em]),
            r.useEffect(
              () => () => {
                (null !== K.current &&
                  (window.cancelAnimationFrame(K.current), (K.current = null)),
                  null !== G.current &&
                    (window.cancelAnimationFrame(G.current),
                    (G.current = null)),
                  null !== C.current &&
                    (window.clearTimeout(C.current), (C.current = null)),
                  null !== E.current &&
                    (window.cancelAnimationFrame(E.current),
                    (E.current = null)),
                  X.current?.disconnect(),
                  (X.current = null));
              },
              [],
            ),
            r.useLayoutEffect(() => {
              e && "following-bottom" === T.current && R.current > 0
                ? es({ behavior: "auto" })
                : et();
            }, [e, et, es]),
            { context: eS, registerMessage: eb }
          );
        })({
          autoScroll: e,
          defaultScrollPosition: a,
          scrollEdgeThreshold: w,
          scrollPreviousItemPeek: k,
          scrollMargin: j,
        });
        return (0, t.jsx)(v.Provider, {
          value: C,
          children: (0, t.jsx)(y.Provider, { value: N, children: n }),
        });
      },
      C = function ({ children: e, ...n }) {
        let { setRootElement: r } = w(),
          a = k();
        return (0, t.jsx)("div", {
          ref: r,
          ...n,
          ...(a ? { "data-pending-scroll": "" } : null),
          children: e,
        });
      },
      N = function ({
        "aria-label": e,
        children: i,
        onKeyDown: l,
        onScroll: s,
        onTouchMove: o,
        onWheel: c,
        preserveScrollOnPrepend: u = !0,
        ref: d,
        role: h,
        tabIndex: m,
        ...p
      }) {
        let {
            handleResize: f,
            preserveScrollOnPrependRef: g,
            setViewportElement: x,
            syncAfterScroll: b,
            userScrollIntent: v,
            viewportRef: y,
          } = w(),
          j = k();
        g.current = u;
        let C = r.useCallback(
          (e) => {
            (x(e), (0, n.c)(d)?.(e));
          },
          [d, x],
        );
        return (
          r.useEffect(() => {
            let e = y.current;
            if (!e || typeof ResizeObserver > "u") return;
            let t = 0,
              n = new ResizeObserver(() => {
                (window.cancelAnimationFrame(t),
                  (t = window.requestAnimationFrame(f)));
              });
            return (
              n.observe(e),
              () => {
                (window.cancelAnimationFrame(t), n.disconnect());
              }
            );
          }, [f, y]),
          (0, t.jsx)("div", {
            ref: C,
            role: h ?? "region",
            "aria-label": e ?? "Messages",
            tabIndex: m ?? 0,
            onKeyDown: function (e) {
              (a.has(e.key) && v(), l?.(e));
            },
            onScroll: function (e) {
              (b(), s?.(e));
            },
            onTouchMove: function (e) {
              (v(), o?.(e));
            },
            onWheel: function (e) {
              (v(), c?.(e));
            },
            ...p,
            ...(j ? { "data-pending-scroll": "" } : null),
            children: i,
          })
        );
      },
      S = function ({
        "aria-relevant": e,
        children: a,
        ref: i,
        role: l,
        spacerClassName: s,
        ...o
      }) {
        let {
            handleContentChange: c,
            handleResize: u,
            setContentElement: d,
            setSpacerElement: h,
          } = w(),
          m = r.useRef(null),
          p = r.useCallback(
            (e) => {
              ((m.current = e), d(e), (0, n.c)(i)?.(e));
            },
            [i, d],
          );
        return (
          r.useLayoutEffect(() => {
            let e = m.current;
            if (!e || (c(), typeof MutationObserver > "u")) return;
            let t = new MutationObserver(() => {
              c();
            });
            return (t.observe(e, { childList: !0 }), () => t.disconnect());
          }, [c]),
          r.useEffect(() => {
            let e = m.current;
            if (!e || typeof ResizeObserver > "u") return;
            let t = 0,
              n = new ResizeObserver(() => {
                (window.cancelAnimationFrame(t),
                  (t = window.requestAnimationFrame(u)));
              });
            return (
              n.observe(e),
              () => {
                (window.cancelAnimationFrame(t), n.disconnect());
              }
            );
          }, [u]),
          (0, t.jsxs)("div", {
            ref: p,
            role: l ?? "log",
            "aria-relevant": e ?? "additions",
            ...o,
            children: [
              a,
              (0, t.jsx)("div", {
                ref: h,
                "aria-hidden": "true",
                "data-message-scroller-spacer": "",
                hidden: !0,
                className: s,
              }),
            ],
          })
        );
      },
      M = function ({ messageId: e, ref: a, scrollAnchor: i = !1, ...l }) {
        let s = (function () {
            let e = r.useContext(y);
            if (!e)
              throw Error(
                "MessageScrollerItem must be used within a MessageScroller.",
              );
            return e;
          })(),
          o = r.useRef(null),
          c = r.useCallback(
            (t) => {
              let r = o.current;
              ((o.current = t), e && s(e, t, r), (0, n.c)(a)?.(t));
            },
            [e, a, s],
          );
        return (0, t.jsx)("div", {
          ref: c,
          "data-message-id": e,
          "data-scroll-anchor": i ? "true" : "false",
          ...l,
        });
      },
      R = function ({
        behavior: e = "smooth",
        children: a,
        direction: i = "end",
        onClick: l,
        render: s,
        tabIndex: o,
        type: c = "button",
        ...u
      }) {
        let d,
          { scrollToEnd: h, scrollToStart: m, stateStore: p } = w(),
          f = (((d = r.useRef(l)).current = l), d),
          g = r.useCallback((e) => p.subscribe(e), [p]),
          x = r.useCallback(() => {
            let e = p.getSnapshot();
            return "start" === i ? e.start : e.end;
          }, [i, p]),
          b = r.useSyncExternalStore(g, x, x),
          v = r.useCallback(
            (t) => {
              b &&
                (f.current?.(t),
                t.defaultPrevented ||
                  (t.currentTarget.blur(),
                  "start" === i ? m({ behavior: e }) : h({ behavior: e })));
            },
            [e, i, b, f, h, m],
          );
        return (0, n.a)({
          defaultTagName: "button",
          props: (0, n.b)(
            {
              type: c,
              inert: !b,
              tabIndex: b ? o : -1,
              children:
                a ?? (0, t.jsxs)("span", { children: ["Scroll to ", i] }),
              onClick: v,
            },
            u,
          ),
          render: s,
          state: { active: b, direction: i },
          stateAttributesMapping: {
            active: (e) => ({ "data-active": e ? "true" : "false" }),
          },
        });
      },
      I = m635416,
      A = m647163,
      T = m167881;
    ;
