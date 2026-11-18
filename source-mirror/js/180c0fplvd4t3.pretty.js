(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  93306,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(954808),
      r = e.i(271645),
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
                      var i;
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
      I = e.i(635416),
      A = e.i(647163),
      T = e.i(167881);
    e.s(
      [
        "MessageScroller",
        0,
        function ({ className: e, ...n }) {
          return (0, t.jsx)(C, {
            "data-slot": "message-scroller",
            className: (0, A.cn)(
              "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
              e,
            ),
            ...n,
          });
        },
        "MessageScrollerButton",
        0,
        function ({
          direction: e = "end",
          className: n,
          children: r,
          render: a,
          variant: i = "outline",
          size: l = "icon-xs",
          ...s
        }) {
          return (0, t.jsx)(R, {
            "data-slot": "message-scroller-button",
            "data-direction": e,
            "data-variant": i,
            "data-size": l,
            direction: e,
            className: (0, A.cn)(
              "absolute left-1/2 -translate-x-1/2 z-20 rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-md backdrop-blur-xs transition-[translate,scale,opacity] duration-200 hover:bg-slate-100 hover:text-slate-900 data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[direction=end]:bottom-3 data-[direction=end]:data-[active=false]:translate-y-4 data-[direction=start]:top-3 data-[direction=start]:data-[active=false]:-translate-y-4",
              n,
            ),
            render:
              a ??
              (0, t.jsx)(T.Button, {
                variant: i,
                size: l,
                className: "rounded-full shadow-sm",
              }),
            ...s,
            children:
              r ??
              (0, t.jsxs)(t.Fragment, {
                children: [
                  (0, t.jsx)(I.ArrowDown, {
                    className: `size-3.5 ${"start" === e ? "rotate-180" : ""}`,
                  }),
                  (0, t.jsx)("span", {
                    className: "sr-only",
                    children: "end" === e ? "Cuộn xuống cuối" : "Cuộn lên đầu",
                  }),
                ],
              }),
          });
        },
        "MessageScrollerContent",
        0,
        function ({ className: e, ...n }) {
          return (0, t.jsx)(S, {
            "data-slot": "message-scroller-content",
            className: (0, A.cn)(
              "flex h-max min-h-full flex-col gap-3.5 p-4",
              e,
            ),
            ...n,
          });
        },
        "MessageScrollerItem",
        0,
        function ({ className: e, scrollAnchor: n = !1, ...r }) {
          return (0, t.jsx)(M, {
            "data-slot": "message-scroller-item",
            scrollAnchor: n,
            className: (0, A.cn)("min-w-0 shrink-0", e),
            ...r,
          });
        },
        "MessageScrollerProvider",
        0,
        function (e) {
          return (0, t.jsx)(j, { ...e });
        },
        "MessageScrollerViewport",
        0,
        function ({ className: e, ...n }) {
          return (0, t.jsx)(N, {
            "data-slot": "message-scroller-viewport",
            className: (0, A.cn)(
              "size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain contain-content data-pending-scroll:invisible",
              e,
            ),
            ...n,
          });
        },
      ],
      93306,
    );
  },
  816186,
  176782,
  911825,
  815731,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(647163);
    function r(e, t) {
      return e && !t ? e : !e && t ? t : e || t ? { ...e, ...t } : void 0;
    }
    e.s(
      [
        "Message",
        0,
        function ({ className: e, align: r = "start", ...a }) {
          return (0, t.jsx)("div", {
            "data-slot": "message",
            "data-align": r,
            className: (0, n.cn)(
              "group/message relative flex w-full min-w-0 gap-2.5 text-xs sm:text-sm data-[align=end]:flex-row-reverse",
              e,
            ),
            ...a,
          });
        },
        "MessageAvatar",
        0,
        function ({ className: e, ...r }) {
          return (0, t.jsx)("div", {
            "data-slot": "message-avatar",
            className: (0, n.cn)(
              "flex size-7 shrink-0 items-center justify-center self-start overflow-hidden rounded-full mt-0.5",
              e,
            ),
            ...r,
          });
        },
        "MessageContent",
        0,
        function ({ className: e, ...r }) {
          return (0, t.jsx)("div", {
            "data-slot": "message-content",
            className: (0, n.cn)(
              "flex w-full min-w-0 flex-col gap-2 break-words group-data-[align=end]/message:items-end",
              e,
            ),
            ...r,
          });
        },
      ],
      816186,
    );
    let a = {};
    function i(e, t, n, r, a) {
      if (!n && !r && !a && !e) return s(t);
      let i = s(e);
      return (
        t && (i = o(i, t)),
        n && (i = o(i, n)),
        r && (i = o(i, r)),
        a && (i = o(i, a)),
        i
      );
    }
    function l(e) {
      if (0 === e.length) return a;
      if (1 === e.length) return s(e[0]);
      let t = s(e[0]);
      for (let n = 1; n < e.length; n += 1) t = o(t, e[n]);
      return t;
    }
    function s(e) {
      return u(e)
        ? { ...d(e, a) }
        : (function (e) {
            let t = { ...e };
            for (let e in t) {
              let n = t[e];
              c(e, n) && (t[e] = h(n));
            }
            return t;
          })(e);
    }
    function o(e, t) {
      return u(t)
        ? d(t, e)
        : (function (e, t) {
            if (!t) return e;
            for (let n in t) {
              let a = t[n];
              switch (n) {
                case "style":
                  e[n] = r(e.style, a);
                  break;
                case "className":
                  e[n] = p(e.className, a);
                  break;
                default:
                  c(n, a)
                    ? (e[n] = (function (e, t) {
                        return t
                          ? e
                            ? (...n) => {
                                let r = n[0];
                                if (f(r)) {
                                  m(r);
                                  let a = t(...n);
                                  return (
                                    r.baseUIHandlerPrevented || e?.(...n),
                                    a
                                  );
                                }
                                let a = t(...n);
                                return (e?.(...n), a);
                              }
                            : h(t)
                          : e;
                      })(e[n], a))
                    : (e[n] = a);
              }
            }
            return e;
          })(e, t);
    }
    function c(e, t) {
      let n = e.charCodeAt(0),
        r = e.charCodeAt(1),
        a = e.charCodeAt(2);
      return (
        111 === n &&
        110 === r &&
        a >= 65 &&
        a <= 90 &&
        ("function" == typeof t || void 0 === t)
      );
    }
    function u(e) {
      return "function" == typeof e;
    }
    function d(e, t) {
      return u(e) ? e(t) : (e ?? a);
    }
    function h(e) {
      return e
        ? (...t) => {
            let n = t[0];
            return (f(n) && m(n), e(...t));
          }
        : e;
    }
    function m(e) {
      return (
        (e.preventBaseUIHandler = () => {
          e.baseUIHandlerPrevented = !0;
        }),
        e
      );
    }
    function p(e, t) {
      return t ? (e ? t + " " + e : t) : e;
    }
    function f(e) {
      return null != e && "object" == typeof e && "nativeEvent" in e;
    }
    e.s(
      ["mergeClassNames", 0, p, "mergeProps", 0, i, "mergePropsN", 0, l],
      176782,
    );
    let g = function (e, ...t) {
      let n = new URL("https://base-ui.com/production-error");
      return (
        n.searchParams.set("code", e.toString()),
        t.forEach((e) => n.searchParams.append("args[]", e)),
        `Base UI error #${e}; visit ${n} for the full message.`
      );
    };
    var x = e.i(271645);
    let b = {};
    function v(e, t) {
      let n = x.useRef(b);
      return (n.current === b && (n.current = e(t)), n);
    }
    function y(e, t, n, r) {
      var a, i, l, s, o;
      let c = v(w).current;
      return (
        (a = c),
        (i = e),
        (l = t),
        (s = n),
        (o = r),
        (a.refs[0] !== i ||
          a.refs[1] !== l ||
          a.refs[2] !== s ||
          a.refs[3] !== o) &&
          k(c, [e, t, n, r]),
        c.callback
      );
    }
    function w() {
      return { callback: null, cleanup: null, refs: [] };
    }
    function k(e, t) {
      if (((e.refs = t), t.every((e) => null == e))) {
        e.callback = null;
        return;
      }
      e.callback = (n) => {
        if ((e.cleanup && (e.cleanup(), (e.cleanup = null)), null != n)) {
          let r = Array(t.length).fill(null);
          for (let e = 0; e < t.length; e += 1) {
            let a = t[e];
            if (null != a)
              switch (typeof a) {
                case "function": {
                  let t = a(n);
                  "function" == typeof t && (r[e] = t);
                  break;
                }
                case "object":
                  a.current = n;
              }
          }
          e.cleanup = () => {
            for (let e = 0; e < t.length; e += 1) {
              let n = t[e];
              if (null != n)
                switch (typeof n) {
                  case "function": {
                    let t = r[e];
                    "function" == typeof t ? t() : n(null);
                    break;
                  }
                  case "object":
                    n.current = null;
                }
            }
          };
        }
      };
    }
    let j = parseInt(x.version, 10);
    function C(e) {
      if (!x.isValidElement(e)) return null;
      let t = e.props;
      return (j >= 19 ? t?.ref : e.ref) ?? null;
    }
    Object.freeze([]);
    let N = Object.freeze({}),
      S = Symbol.for("react.lazy");
    function M(e) {
      return (function (e, t, n = {}) {
        let a = t.render;
        !1 !== n.enabled &&
          (a = (function (e) {
            if (e?.$$typeof !== S) return e;
            let t = x.Children.toArray(e)[0];
            return x.isValidElement(t) ? t : e;
          })(a));
        let s = (function (e, t, n) {
          var a, s, o, c;
          let { className: u, style: d } = e,
            {
              state: h = N,
              ref: m,
              props: f,
              stateAttributesMapping: g,
              enabled: x = !0,
            } = t,
            b = x ? ("function" == typeof u ? u(h) : u) : void 0,
            j = x ? ("function" == typeof d ? d(h) : d) : void 0,
            S = x
              ? (function (e, t) {
                  let n = {};
                  for (let r in e) {
                    let a = e[r];
                    if (t?.hasOwnProperty(r)) {
                      let e = t[r](a);
                      null != e && Object.assign(n, e);
                      continue;
                    }
                    !0 === a
                      ? (n[`data-${r.toLowerCase()}`] = "")
                      : a && (n[`data-${r.toLowerCase()}`] = a.toString());
                  }
                  return n;
                })(h, g)
              : N,
            M =
              x && f ? (Array.isArray((s = f)) ? l(s) : i(void 0, s)) : void 0,
            R = x ? (r(S, M) ?? {}) : N;
          if ("u" > typeof document)
            if (x)
              if (Array.isArray(m)) {
                let e;
                ((a = [R.ref, C(n), ...m]),
                  (o = e = v(w).current),
                  (c = a),
                  (o.refs.length !== c.length ||
                    o.refs.some((e, t) => e !== c[t])) &&
                    k(e, a),
                  (R.ref = e.callback));
              } else R.ref = y(R.ref, C(n), m);
            else y(null, null);
          return x
            ? (void 0 !== b && (R.className = p(R.className, b)),
              void 0 !== j && (R.style = r(R.style, j)),
              R)
            : N;
        })(t, n, a);
        return !1 === n.enabled
          ? null
          : (function (e, t, n, r) {
              if (t) {
                if ("function" == typeof t) return t(n, r);
                let e = i(n, t.props);
                return ((e.ref = n.ref), x.cloneElement(t, e));
              }
              if (e && "string" == typeof e) {
                var a, l;
                return (
                  (a = e),
                  (l = n),
                  "button" === a
                    ? (0, x.createElement)("button", {
                        type: "button",
                        ...l,
                        key: l.key,
                      })
                    : "img" === a
                      ? (0, x.createElement)("img", {
                          alt: "",
                          ...l,
                          key: l.key,
                        })
                      : x.createElement(a, l)
                );
              }
              throw Error(g(8));
            })(e, a, s, n.state ?? N);
      })(e.defaultTagName ?? "div", e, e);
    }
    e.s(["useRender", 0, M], 911825);
    let R = (0, e.i(225913).cva)(
      "group/bubble relative flex w-fit max-w-[85%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end",
      {
        variants: {
          variant: {
            default:
              "*:data-[slot=bubble-content]:bg-[#f1f1ef] *:data-[slot=bubble-content]:text-neutral-900",
            secondary:
              "*:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:text-neutral-900 *:data-[slot=bubble-content]:border-transparent",
            muted:
              "*:data-[slot=bubble-content]:bg-muted *:data-[slot=bubble-content]:text-foreground",
            outline:
              "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background",
            destructive:
              "*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive",
          },
        },
        defaultVariants: { variant: "default" },
      },
    );
    e.s(
      [
        "Bubble",
        0,
        function ({
          variant: e = "default",
          align: r = "start",
          className: a,
          ...i
        }) {
          return (0, t.jsx)("div", {
            "data-slot": "bubble",
            "data-variant": e,
            "data-align": r,
            className: (0, n.cn)(R({ variant: e }), a),
            ...i,
          });
        },
        "BubbleContent",
        0,
        function ({ className: e, render: t, ...r }) {
          return M({
            defaultTagName: "div",
            props: i(
              {
                className: (0, n.cn)(
                  "w-fit max-w-full min-w-0 overflow-hidden rounded-2xl border border-transparent px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed break-words shadow-xs group-data-[align=end]/bubble:self-end group-data-[align=end]/bubble:rounded-br-xs group-data-[align=start]/bubble:rounded-bl-xs",
                  e,
                ),
              },
              r,
            ),
            render: t,
            state: { slot: "bubble-content" },
          });
        },
      ],
      815731,
    );
  },
  228742,
  (e) => {
    "use strict";
    var t = e.i(996296);
    let n = {
        maxDimension: 2400,
        maxBytes: 2097152,
        quality: 0.9,
        minQuality: 0.72,
        minDimension: 2e3,
      },
      r = new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif",
      ]),
      a = 0;
    async function i(e, i) {
      let l = [],
        s = [],
        o = Math.max(0, 6 - i);
      for (let i of e) {
        if (!i.type.startsWith("image/")) {
          s.push(`"${i.name}" kh\xf4ng phải ảnh n\xean đ\xe3 bỏ qua.`);
          continue;
        }
        if (0 === o) {
          s.push(
            `Mỗi lượt hỏi chỉ gửi k\xe8m tối đa 6 ảnh, "${i.name}" đ\xe3 bị bỏ.`,
          );
          continue;
        }
        let e = await (0, t.compressImageFile)(i, n);
        if (!r.has(e.mimeType)) {
          s.push(
            `"${i.name}" c\xf3 định dạng ${e.mimeType} kh\xf4ng được hỗ trợ.`,
          );
          continue;
        }
        if (e.bytes > 4194304) {
          s.push(
            `"${i.name}" vẫn nặng ${(0, t.formatBytes)(e.bytes)} sau khi n\xe9n, vượt mức ${(0, t.formatBytes)(4194304)}.`,
          );
          continue;
        }
        ((o -= 1),
          l.push({
            id: ((a += 1), `img_${Date.now().toString(36)}_${a}`),
            data: e.base64,
            mimeType: e.mimeType,
            previewUrl: e.dataUrl,
            name: i.name || "anh-dan.png",
            bytes: e.bytes,
            originalBytes: e.originalBytes,
          }));
      }
      return { images: l, errors: s };
    }
    e.s([
      "MAX_CHAT_IMAGES",
      0,
      6,
      "imagesFromClipboard",
      0,
      function (e) {
        if (!e) return [];
        let t = [];
        for (let n of Array.from(e.items)) {
          if ("file" !== n.kind || !n.type.startsWith("image/")) continue;
          let e = n.getAsFile();
          e && t.push(e);
        }
        return t;
      },
      "prepareChatImages",
      0,
      i,
    ]);
  },
  878984,
  (e) => {
    "use strict";
    var t = e.i(482534);
    function n(e) {
      let n = (0, t.splitSegments)(e.content),
        r = 0,
        a = n.map((e, n) => {
          let { kind: a, label: i } = (0, t.describeSegment)(e);
          "câu hỏi" === a && r++;
          let l = i.length > 60 ? `${i.slice(0, 60)}…` : i;
          return `#${n + 1}|${a}|${l}`;
        }),
        i = a;
      if (a.length > 120) {
        let e = Math.ceil(84),
          t = 120 - e;
        i = [
          ...a.slice(0, e),
          `…(c\xf2n ${a.length - 120} đoạn ở giữa kh\xf4ng liệt k\xea — d\xf9ng h\xe0m search hoặc questionRange để lấy)`,
          ...a.slice(a.length - t),
        ];
      }
      return {
        title: e.title,
        blockCount: n.length,
        questionCount: r,
        outline: i.length > 0 ? ["#stt|loại|nhãn", ...i].join("\n") : "",
      };
    }
    e.s([
      "buildContextIndex",
      0,
      function (e, t) {
        return {
          exam: n(e),
          notes: t
            .slice(-12)
            .map((e, t) => ({
              ref: `N${t + 1}`,
              turn: e.turn,
              kind: e.kind,
              preview: e.text.length > 96 ? `${e.text.slice(0, 96)}…` : e.text,
            })),
        };
      },
      "buildExamIndex",
      0,
      n,
    ]);
  },
  743300,
  283990,
  67874,
  608532,
  64805,
  (e) => {
    "use strict";
    var t = e.i(482534);
    function n(e, t) {
      return (
        Number.isSafeInteger(e.from) &&
        Number.isSafeInteger(e.to) &&
        e.from >= 1 &&
        e.to >= e.from &&
        e.to <= t
      );
    }
    e.s(
      [
        "applyExamPatches",
        0,
        function (e, r, a, i = e) {
          if (i.id !== e.id || i.content !== e.content)
            throw Error(
              "Đề đã thay đổi trong lúc AI xử lý. Hãy gửi lại yêu cầu trên đề hiện tại.",
            );
          let l = (0, t.splitSegmentRanges)(e.content);
          if (
            !Array.isArray(r) ||
            0 === r.length ||
            r.length > 24 ||
            0 === a.length ||
            a.some((e) => !n(e, l.length))
          )
            throw Error(
              "AI trả về phạm vi chỉnh sửa không hợp lệ nên chưa áp dụng vào đề.",
            );
          let s = [...r].sort((e, t) => e.from - t.from);
          for (let e = 0; e < s.length; e++) {
            let t = s[e];
            if (
              !t ||
              !n(t, l.length) ||
              "string" != typeof t.content ||
              !a.some((e) => t.from >= e.from && t.to <= e.to) ||
              (e > 0 && t.from <= s[e - 1].to)
            )
              throw Error(
                "AI trả về chỉnh sửa ngoài phạm vi hoặc chồng lấn nên chưa áp dụng vào đề.",
              );
          }
          let o = e.content;
          for (let e of s.reverse()) {
            let t = l[e.from - 1].from,
              n = l[e.to - 1].to;
            o = o.slice(0, t) + e.content + o.slice(n);
          }
          return { ...i, content: o };
        },
        "validEditRange",
        0,
        n,
      ],
      283990,
    );
    var r = e.i(871813);
    function a(e) {
      return (0, t.plainText)(e)
        .toLowerCase()
        .replace(/[.:)]+$/, "")
        .replace(/\s+/g, " ")
        .trim();
    }
    function i(e) {
      return e.join("\n\n");
    }
    function l(e) {
      let n = (0, t.splitSegments)(e),
        r = (0, t.solutionStart)(n);
      return r < 0 ? n : n.slice(0, r);
    }
    function s(e) {
      return e.flatMap((e, n) => ((0, t.isQuestionStart)(e) ? [n] : []));
    }
    function o(e, n) {
      let r = n + 1;
      for (; r < e.length; ) {
        let n = e[r];
        if (
          (0, t.isQuestionStart)(n) ||
          (0, t.isHeading)(n) ||
          "\\newpage" === n.trim()
        )
          break;
        r++;
      }
      return r;
    }
    function c(e) {
      return (
        s(e)
          .map((n) => (0, t.questionLabel)(e[n]))
          .join(", ") || "(không có)"
      );
    }
    function u(e, t) {
      return e.trim() ? e : t;
    }
    let d = [
        {
          name: "editContext",
          description:
            "Các đoạn cần SỬA/XÓA theo #stt trong dàn ý, kèm số đoạn để trả action patch. Ưu tiên sửa một câu/ý: chỉ lấy phạm vi nhỏ nhất chứa nội dung cần thay; KHÔNG lấy cả đề. Muốn thêm ý vào câu thì lấy đoạn câu đó và trả bản thay thế có ý mới. Ngữ liệu chỉ để tham khảo lấy riêng bằng question/search.",
          params: [
            {
              name: "from",
              required: !0,
              description: "#stt đoạn đầu cần sửa trong dàn ý, từ 1.",
            },
            {
              name: "to",
              required: !0,
              description:
                "#stt đoạn cuối cần sửa (bao gồm); sửa một đoạn thì to=from.",
            },
          ],
          cost: "thấp",
          example: "{{editContext(5, 5)}}",
          run: ({ exam: e }, [r, a]) => {
            let i = (0, t.splitSegments)(e.content),
              l = { from: Number(r), to: Number(a) };
            if (!n(l, i.length))
              throw Error("Phạm vi đoạn cần sửa không hợp lệ.");
            return i
              .slice(l.from - 1, l.to)
              .map(
                (e, t) => `[#${l.from + t}]
${e}`,
              )
              .join("\n\n");
          },
          whole: !0,
        },
        {
          name: "examOverview",
          description:
            "Tên đề, số câu hỏi, các tiêu đề phần và nhãn từng câu. Dùng khi cần biết quy mô / cấu trúc đề mà không đọc nội dung.",
          params: [],
          cost: "thấp",
          example: "{{examOverview}}",
          run: ({ exam: e }) => {
            let n = (0, t.splitSegments)(e.content);
            if (0 === n.length) return `Đề "${e.title}" đang trống.`;
            let r = n.filter(t.isHeading).map(t.plainText),
              a = c(n);
            return `T\xean đề: ${e.title}
Số c\xe2u hỏi: ${s(n).length}
C\xe1c phần: ${r.join(" · ") || "(không có tiêu đề phần)"}
C\xe1c c\xe2u: ${a}`;
          },
        },
        {
          name: "examOutline",
          description:
            "Dàn ý từng đoạn của đề, mỗi đoạn một dòng `#stt|loại|nhãn`.",
          params: [],
          cost: "thấp",
          example: "{{examOutline}}",
          run: ({ exam: e }) =>
            u(
              (0, t.splitSegments)(e.content)
                .map((e, n) => {
                  let { kind: r, label: a } = (0, t.describeSegment)(e);
                  return `#${n + 1}|${r}|${a.slice(0, 60)}`;
                })
                .join("\n"),
              "Đề đang trống.",
            ),
        },
        {
          name: "questionList",
          description: "Danh sách câu hỏi: nhãn và dòng đầu của từng câu.",
          params: [],
          cost: "thấp",
          example: "{{questionList}}",
          run: ({ exam: e }) => {
            let n = (0, t.splitSegments)(e.content);
            return u(
              s(n)
                .map((e) =>
                  (0, t.plainText)(n[e].split("\n", 1)[0]).slice(0, 120),
                )
                .join("\n"),
              "Đề chưa có câu hỏi nào.",
            );
          },
        },
        {
          name: "question",
          description:
            "Markdown trọn một câu theo nhãn (cả các ý, lựa chọn, bảng, hình đi kèm), KÈM ngữ liệu / lời dẫn chung đứng đầu phần chứa câu đó.",
          params: [
            {
              name: "label",
              required: !0,
              description:
                'Nhãn câu đúng như in trong đề, vd "Câu 3", "Bài 2".',
            },
          ],
          cost: "trung bình",
          example: '{{question("Câu 3")}}',
          run: ({ exam: e }, [n = ""]) => {
            let r = l(e.content),
              u = (function (e, n) {
                let r = a(n);
                if (!r) return -1;
                let i = s(e),
                  l = i.find((n) => a((0, t.questionLabel)(e[n])) === r);
                if (void 0 !== l) return l;
                if (/^\d+$/.test(r)) {
                  let n = i.find((n) =>
                    a((0, t.questionLabel)(e[n])).endsWith(` ${r}`),
                  );
                  if (void 0 !== n) return n;
                }
                return i.find((t) => a(e[t]).startsWith(r)) ?? -1;
              })(r, n);
            return u < 0
              ? `Kh\xf4ng t\xecm thấy "${n}". C\xe1c c\xe2u đang c\xf3: ${c(r)}.`
              : i([
                  ...(function (e, n) {
                    let r = n - 1;
                    for (; r >= 0 && !(0, t.isHeading)(e[r]); ) r--;
                    r < 0 && (r = 0);
                    let a = [];
                    for (let i = r; i < n && !(0, t.isQuestionStart)(e[i]); i++)
                      a.push(e[i]);
                    return a;
                  })(r, u),
                  ...r.slice(u, o(r, u)),
                ]);
          },
          whole: !0,
        },
        {
          name: "questionRange",
          description:
            "Markdown các câu từ câu thứ `from` tới câu thứ `to` (đếm theo thứ tự xuất hiện, từ 1).",
          params: [
            {
              name: "from",
              required: !0,
              description: "Số thứ tự câu đầu, tính từ 1.",
            },
            {
              name: "to",
              required: !0,
              description: "Số thứ tự câu cuối, tính từ 1.",
            },
          ],
          cost: "trung bình",
          example: "{{questionRange(2, 4)}}",
          run: ({ exam: e }, [t = "1", n = t]) => {
            let r = l(e.content),
              a = s(r),
              c = Math.max(1, Number.parseInt(t, 10) || 1),
              u = Math.min(a.length, Number.parseInt(n, 10) || c);
            return 0 === a.length || c > u
              ? `Đề c\xf3 ${a.length} c\xe2u, kh\xf4ng c\xf3 c\xe2u ${t}–${n}.`
              : i(r.slice(a[c - 1], o(r, a[u - 1])));
          },
        },
        {
          name: "examMarkdown",
          description:
            "TOÀN BỘ đề dạng Exam Markdown, nguyên vẹn. Chỉ dùng khi sửa toàn đề cần action replace; sửa một câu/ý dùng editContext và action patch để giảm token.",
          params: [],
          cost: "cao",
          example: "{{examMarkdown}}",
          run: ({ exam: e }) => u(e.content, "Đề đang trống."),
          whole: !0,
        },
        {
          name: "examForSolving",
          description:
            "Toàn bộ ĐỀ GỐC dạng Markdown, đã tự bỏ phần lời giải / đáp án / hướng dẫn chấm nối ở cuối. Dùng khi giải đề hoặc làm đáp án / barem cho cả đề.",
          params: [],
          cost: "cao",
          example: "{{examForSolving}}",
          run: ({ exam: e }) =>
            u(i(l(e.content)), "Đề hiện không có nội dung để giải."),
          whole: !0,
        },
        {
          name: "solutionPart",
          description:
            "Phần lời giải / đáp án / hướng dẫn chấm đang có ở cuối đề (Markdown). Dùng khi soát hoặc sửa barem, lời giải đã có.",
          params: [],
          cost: "cao",
          example: "{{solutionPart}}",
          run: ({ exam: e }) => {
            var n;
            let r, a;
            return u(
              i(
                ((n = e.content),
                (r = (0, t.splitSegments)(n)),
                (a = (0, t.solutionStart)(r)) < 0 ? [] : r.slice(a)),
              ),
              "Đề chưa có phần lời giải hay hướng dẫn chấm.",
            );
          },
          whole: !0,
        },
        {
          name: "search",
          description:
            "Các đoạn của đề có chứa từ khoá (không phân biệt hoa thường), kèm số thứ tự đoạn.",
          params: [
            {
              name: "keyword",
              required: !0,
              description: "Từ hoặc cụm từ cần tìm.",
            },
          ],
          cost: "trung bình",
          example: '{{search("bảng biến thiên")}}',
          run: ({ exam: e }, [n = ""]) => {
            let r = n.trim().toLowerCase();
            if (!r) return "Chưa có từ khoá để tìm.";
            let a = (0, t.splitSegments)(e.content).flatMap((e, n) =>
              e.toLowerCase().includes(r) ||
              (0, t.plainText)(e).toLowerCase().includes(r)
                ? [
                    `[#${n + 1}]
${e}`,
                  ]
                : [],
            );
            return a.length > 0
              ? a.join("\n\n")
              : `Kh\xf4ng c\xf3 đoạn n\xe0o chứa "${n}".`;
          },
        },
        {
          name: "reference",
          description:
            'Đúng đoạn người dùng đã gắn vào ô chat (mã R1, R2… trong danh sách tham chiếu), Markdown như lúc chọn, kèm số dòng và số đoạn. Dùng khi người dùng nói "đoạn này", "chỗ này", "đây" mà có tham chiếu đính kèm.',
          params: [
            { name: "ref", required: !0, description: "Mã tham chiếu, vd R1." },
          ],
          cost: "thấp",
          example: '{{reference("R1")}}',
          run: ({ references: e }, [t = ""]) => {
            let n = t.trim().toUpperCase(),
              a = e?.find((e) => e.id.toUpperCase() === n);
            return a
              ? `[${(0, r.referenceLabel)(a)} \xb7 đoạn #${a.fromSegment}${a.toSegment !== a.fromSegment ? `–#${a.toSegment}` : ""}]
${a.text}`
              : `Kh\xf4ng c\xf3 tham chiếu n\xe0o m\xe3 "${t}"${e?.length ? ` (đang c\xf3 ${e.map((e) => e.id).join(", ")})` : ""}.`;
          },
          whole: !0,
        },
        {
          name: "lines",
          description:
            "Các dòng từ a đến b (tính từ 1, hai đầu bao gồm) của đề hiện tại, Markdown gốc. Dùng để lấy thêm ngữ cảnh quanh một tham chiếu (vd tham chiếu ở dòng 12–15 thì lấy 8–20).",
          params: [
            { name: "from", required: !0, description: "Dòng đầu." },
            { name: "to", required: !0, description: "Dòng cuối." },
          ],
          cost: "trung bình",
          example: "{{lines(8, 20)}}",
          run: ({ exam: e }, [t = "", n = ""]) => {
            let a = Number.parseInt(t, 10),
              i = Number.parseInt(n || t, 10);
            if (!Number.isFinite(a) || !Number.isFinite(i))
              return "Cần hai số dòng, vd {{lines(8, 20)}}.";
            if (!e.content.trim()) return "Đề chưa có nội dung.";
            let l = (0, r.readLines)(e.content, a, i);
            return `[D\xf2ng ${l.from}–${l.to} / ${l.total}]
${l.text}`;
          },
        },
        {
          name: "selection",
          description:
            'Đoạn người dùng đang bôi đen trong trình soạn (Markdown). Dùng khi người dùng nói "câu này", "đoạn đang chọn", "chỗ này".',
          params: [],
          cost: "thấp",
          example: "{{selection}}",
          run: ({ selection: e }) =>
            u(e ?? "", "Người dùng chưa bôi đen đoạn nào."),
          whole: !0,
        },
      ],
      h = new Map(d.map((e) => [e.name, e])),
      m = d.map(
        ({ name: e, description: t, params: n, cost: r, example: a }) => ({
          name: e,
          description: t,
          params: n,
          cost: r,
          example: a,
        }),
      );
    function p(e) {
      return h.has(e);
    }
    function f(e, t, n) {
      let r = h.get(e);
      if (!r) return null;
      try {
        let e = r.run(n, t);
        return r.whole || e.length <= 8e3
          ? e
          : `${e.slice(0, 8e3)}
…(đ\xe3 cắt, c\xf2n ${e.length - 8e3} k\xfd tự)`;
      } catch (t) {
        return `Kh\xf4ng đọc được dữ liệu cho ${e}(): ${t instanceof Error ? t.message : "lỗi không xác định"}`;
      }
    }
    e.s(
      [
        "EXAM_FUNCTION_SPECS",
        0,
        m,
        "hasExamFunction",
        0,
        p,
        "runExamFunction",
        0,
        f,
      ],
      743300,
    );
    let g = /\{\{\s*([^{}]+?)\s*\}\}/g;
    e.s(
      [
        "resolvePlaceholders",
        0,
        function (e, t) {
          let n = [],
            r = [],
            a = new Map();
          return {
            prompt: e.replace(g, (e, i) => {
              let { name: l, args: s } = (function (e) {
                let t = e.indexOf("(");
                if (t < 0) return { name: e.trim(), args: [] };
                let n = e.lastIndexOf(")");
                return {
                  name: e.slice(0, t).trim(),
                  args: (function (e) {
                    let t = [],
                      n = "",
                      r = null;
                    for (let a = 0; a < e.length; a += 1) {
                      let i = e[a];
                      if (r) {
                        if ("\\" === i && e[a + 1] === r) {
                          ((n += r), (a += 1));
                          continue;
                        }
                        if (i === r) {
                          r = null;
                          continue;
                        }
                        n += i;
                        continue;
                      }
                      if ('"' === i || "'" === i) {
                        r = i;
                        continue;
                      }
                      if ("," === i) {
                        (t.push(n.trim()), (n = ""));
                        continue;
                      }
                      n += i;
                    }
                    let a = n.trim();
                    return (("" !== a || t.length > 0) && t.push(a), t);
                  })(n > t ? e.slice(t + 1, n) : e.slice(t + 1)),
                };
              })(i);
              if (!l) return e;
              if (!p(l)) {
                r.push(l);
                let t = `[kh\xf4ng c\xf3 h\xe0m đọc dữ liệu n\xe0o t\xean "${l}", h\xe3y l\xe0m việc với dữ liệu đ\xe3 c\xf3]`;
                return (
                  n.push({
                    raw: e,
                    name: l,
                    args: s,
                    ok: !1,
                    value: t,
                    chars: t.length,
                  }),
                  t
                );
              }
              let o = `${l}(${s.join(" ")})`,
                c = a.get(o);
              return (
                void 0 === c && ((c = f(l, s, t) ?? ""), a.set(o, c)),
                n.push({
                  raw: e,
                  name: l,
                  args: s,
                  ok: !0,
                  value: c,
                  chars: c.length,
                }),
                c
              );
            }),
            resolved: n,
            unknown: r,
            injectedChars: n.reduce((e, t) => e + t.chars, 0),
          };
        },
      ],
      67874,
    );
    let x = [
        {
          level: "low",
          label: "Thấp",
          hint: "Chỉ cho phép agent mức thấp. Phù hợp sửa chữ, đổi định dạng và việc máy móc.",
          eta: "~5 giây",
        },
        {
          level: "medium",
          label: "Trung bình",
          hint: "Cho phép tối đa mức trung bình. Planner vẫn có thể chọn mức thấp để tiết kiệm.",
          eta: "~15 giây",
        },
        {
          level: "high",
          label: "Cao",
          hint: "Cho phép agent suy luận sâu khi phải giải đề, làm barem hoặc kiểm tra đáp án.",
          eta: "~40 giây",
        },
        {
          level: "ultra",
          label: "Siêu cao",
          hint: "Cho phép model mạnh nhất; planner chỉ dùng khi bài thật sự cần mức này.",
          eta: "1 - 2 phút",
        },
      ],
      b = "medium",
      v = new Map(x.map((e) => [e.level, e]));
    e.s(
      [
        "DEFAULT_REASONING",
        0,
        b,
        "REASONING_OPTIONS",
        0,
        x,
        "isReasoningLevel",
        0,
        function (e) {
          return v.has(e);
        },
        "reasoningOption",
        0,
        function (e) {
          return v.get(e) ?? v.get(b);
        },
      ],
      608532,
    );
    var y = e.i(715760);
    let w =
        ".pdf,.docx,.json,.txt,.md,.csv,.tsv,.xml,.html,.htm,.yaml,.yml,.tex",
      k =
        "PDF, Word (.docx), JSON, TXT, Markdown, CSV, TSV, XML, HTML, YAML, LaTeX";
    async function j(e, t) {
      let n = e.name.slice(e.name.lastIndexOf(".")).toLowerCase(),
        r = ".pdf" === n ? 0x1e00000 : 0xa00000;
      if (e.size > r)
        throw Error(`“${e.name}” vượt giới hạn ${r / 1024 / 1024} MB mỗi tệp.`);
      if (!w.split(",").includes(n))
        throw Error(
          ".doc" === n
            ? `“${e.name}”: h\xe3y lưu Word .doc th\xe0nh .docx rồi tải lại.`
            : `“${e.name}” chưa được hỗ trợ. C\xe1c định dạng hỗ trợ: ${k}.`,
        );
      let a = new FormData();
      a.append("file", e);
      let i = await (0, y.postForm)("/api/chat-exam/files", a, { signal: t });
      if (!i.file?.content?.trim())
        throw Error(`Kh\xf4ng đọc được nội dung của “${e.name}”.`);
      return { ...i.file, id: `file_${crypto.randomUUID()}` };
    }
    e.s(
      [
        "CHAT_FILE_ACCEPT",
        0,
        w,
        "CHAT_FILE_FORMATS",
        0,
        k,
        "MAX_CHAT_FILES",
        0,
        6,
        "MAX_CHAT_FILE_TEXT_BYTES",
        0,
        12e4,
        "chatFilesPayload",
        0,
        function (e) {
          return e?.map(({ name: e, content: t }) => ({ name: e, content: t }));
        },
        "uploadChatFile",
        0,
        j,
      ],
      64805,
    );
  },
  565594,
  155415,
  (e) => {
    "use strict";
    var t = e.i(743300),
      n = e.i(67874),
      r = e.i(608532),
      a = e.i(715760),
      i = e.i(64805),
      l = e.i(871813),
      s = e.i(878984),
      o = e.i(792868),
      c = e.i(534947),
      u = e.i(283990);
    let d = new Set([
        "editContext",
        "question",
        "questionRange",
        "examMarkdown",
        "examForSolving",
        "solutionPart",
        "search",
        "reference",
        "lines",
        "selection",
      ]),
      h = new Set(["none", "partial", "full"]);
    function m(e, t, n, r = !1) {
      let a = [],
        i = e?.some((e) => "ocr" === e || "chat" === e) ?? !1;
      return (
        t > 0
          ? (a.push("ocr"),
            (r || e?.includes("chat") || (!i && !n)) && a.push("chat"))
          : a.push("chat"),
        a
      );
    }
    function p(e) {
      let t = e.images?.length ?? 0;
      return t > 0 ? t : (e.extracted?.imageCount ?? 0);
    }
    async function f(e, n, r) {
      let s = await (0, a.postJsonStream)(
          "/api/chat-exam/plan",
          {
            message: e.message,
            files: (0, i.chatFilesPayload)(e.files),
            libraryIds: e.libraryIds?.length ? e.libraryIds : void 0,
            requireApproval: e.requireApproval ?? !0,
            uiActions: (0, c.uiActionCatalog)(e.uiActions ?? []),
            reasoning: e.reasoning,
            plannerHistory: e.plannerHistory ?? [],
            functions:
              n.exam.blockCount > 0 ||
              e.selection?.trim() ||
              e.references?.length
                ? [...t.EXAM_FUNCTION_SPECS]
                : [],
            references: (0, l.referencesPayload)(
              e.references?.filter((t) => e.newReferenceIds?.includes(t.id)),
            ),
            exam: n.exam,
            noteIndex: [],
            selection: e.selection ?? "",
            imageCount: p(e),
            images: e.images?.map((e) => ({
              data: e.data,
              mimeType: e.mimeType,
            })),
            extractedExam: e.extracted?.exam,
            imageAnalysis: e.extracted?.analysis,
            ocrWarnings: e.extracted?.warnings,
            ocrModel: e.extracted?.model,
            ocrImageCount: e.extracted?.imageCount,
            clarificationAnswers: e.clarificationAnswers,
          },
          r,
        ),
        o = "ui_action" === s.taskKind || "direct_reply" === s.taskKind;
      if (
        o &&
        "proceed" === s.decision &&
        (s.templatePrompt?.trim() || s.operations?.length || s.agents?.length)
      )
        throw Error(
          "Kế hoạch thao tác giao diện không hợp lệ nên chưa được thực hiện.",
        );
      let u =
        "proceed" !== s.decision || o
          ? []
          : m(s.operations, p(e), !e.message.trim(), !!e.files?.length);
      if (
        "proceed" === s.decision &&
        u.includes("chat") &&
        !s.templatePrompt?.trim()
      )
        throw Error("Bước lập kế hoạch không trả về lời nhắc nào.");
      let d = s.contextCompacted
          ? (s.compactedHistory ?? [])
          : (e.plannerHistory ?? []),
        h =
          s.plannerInput && s.plannerReply
            ? [
                ...d,
                { role: "user", content: s.plannerInput },
                { role: "assistant", content: s.plannerReply },
              ]
            : d;
      return { ...s, operations: u, nextPlannerHistory: h };
    }
    async function g(e, t, n) {
      let r = await (0, a.postJsonStream)(
        "/api/chat-exam",
        {
          messages: [{ role: "user", content: e.message }],
          files: (0, i.chatFilesPayload)(e.files),
          libraryIds: e.libraryIds?.length ? e.libraryIds : void 0,
          currentExam: t.includeExam ? e.exam : void 0,
          examTitle:
            "current_exam" === t.contextSource || "both" === t.contextSource
              ? e.exam?.title
              : void 0,
          contextSource: t.contextSource,
          intent: t.intent,
          editRanges: t.editRanges,
          prompt: t.prompt,
          verificationToken: t.verificationToken,
          resolvedContext: t.resolvedContext,
          planned: t.planned ?? !1,
          reasoning: e.reasoning,
          agents: t.agents,
          contextNotes: t.contextNotes,
          images: t.extracted
            ? void 0
            : e.images?.map((e) => ({ data: e.data, mimeType: e.mimeType })),
          extractedExam: t.extracted?.exam,
          imageAnalysis: t.extracted?.analysis,
          ocrModel: t.extracted?.model,
          ocrImageCount: t.extracted?.imageCount,
          knowledgeRefs: t.knowledgeRefs,
          instructionRefs: t.instructionRefs,
          operations: t.operations,
        },
        n,
      );
      if ("replace" === r.action && !r.exam?.content?.trim())
        throw new a.ApiError(
          "AI trả về một đề không có nội dung nên hệ thống đã không áp dụng.",
          { status: 502, code: "empty_generated_exam", stage: "chat_parse" },
        );
      if ("append" === r.action && !r.content?.trim())
        throw new a.ApiError(
          "AI yêu cầu chèn nội dung nhưng không trả về gì.",
          { status: 502, code: "empty_generated_content", stage: "chat_parse" },
        );
      return r;
    }
    async function x(e, t = {}) {
      var i;
      let l,
        {
          onStage: b,
          onPlannerHistory: v,
          onProgress: y,
          onDelta: w,
          onReset: k,
          ...j
        } = t,
        C = { ...j, aiTurnId: crypto.randomUUID() },
        N = { exam: e.exam, selection: e.selection, references: e.references },
        S = (0, s.buildContextIndex)(e.exam, e.notes),
        M = null,
        R = !!e.images?.length,
        I = p(e) > 0;
      (!e.skipPlanning || I) &&
        (b?.(R ? "ocr" : "plan"),
        ("ui_action" !==
          (M = await f(e, S, {
            ...C,
            onProgress: ({ stage: e, message: t }) => {
              (b?.("ocr" === e ? "ocr" : "plan"), y?.(t));
            },
          })).taskKind ||
          "proceed" !== M.decision) &&
          v?.(M.nextPlannerHistory));
      let A = e.extracted ?? null;
      if (
        (M?.extractedExam &&
          (A = {
            exam: M.extractedExam,
            sourceImages: R ? e.images : e.extracted?.sourceImages,
            analysis: M.imageAnalysis ?? {
              documentType: "exam",
              subject: "",
              grade: "",
              examType: "",
              summary: `T\xe0i liệu OCR “${M.extractedExam.title}”, gồm ${M.extractedExam.content.length} k\xfd tự.`,
            },
            warnings: M.ocrWarnings ?? [],
            model: M.ocrModel,
            imageCount: p(e),
          }),
        I && !A && M?.decision !== "reject")
      )
        throw new a.ApiError(
          "API phân tích không trả về đề đã OCR nên đã dừng trước bước tạo đề.",
          { status: 502, code: "plan_missing_ocr", stage: "planner" },
        );
      if (!M) {
        let t = ["chat"];
        b?.("solve");
        let n = await g(
          e,
          {
            includeExam: !0,
            contextSource: "current_exam",
            contextNotes: [],
            operations: t,
            extracted: null,
          },
          {
            ...C,
            onProgress: ({ message: e }) => y?.(e),
            onDelta: w,
            onReset: k,
          },
        );
        return {
          reply: n.reply,
          action: n.action,
          chooseApply: n.chooseApply,
          rejected: !1,
          exam: n.exam,
          content: n.content,
          summary: n.summary ?? "",
          warnings: n.warnings ?? [],
          grounding: n.grounding,
          trace: {
            contextSource: n.contextSource ?? "current_exam",
            templatePrompt: "",
            resolvedPrompt: e.message,
            decision: "proceed",
            intent: "advice",
            operations: t,
            reasoning: e.reasoning,
            agents: [],
            agentRuns: n.agents ?? [],
            plannerContextCompacted: !1,
            plannerCachedTokens: 0,
            examScope: "full",
            examForced: !0,
            placeholders: [],
            unknownFunctions: [],
            injectedChars: 0,
            noteIndex: [],
            noteRefs: [],
            knowledgeRefs: [],
            imageCount: 0,
            solverModel: n.model,
            fellBack: !0,
          },
        };
      }
      let T = I
          ? "current_exam" === M.contextSource || "both" === M.contextSource
            ? M.contextSource
            : "images"
          : "none" === M.contextSource
            ? "none"
            : "current_exam",
        E = "current_exam" === T || "both" === T,
        P = "images" !== T && Array.isArray(M.noteRefs) ? M.noteRefs : [],
        $ = Array.isArray(M.knowledgeRefs) ? M.knowledgeRefs : [],
        _ = Array.isArray(M.agents) ? M.agents : [],
        q =
          "proceed" !== M.decision ||
          "ui_action" === M.taskKind ||
          "direct_reply" === M.taskKind
            ? []
            : m(M.operations, p(e), !e.message.trim(), !!e.files?.length),
        z = E ? ((i = M.examScope) && h.has(i) ? i : "partial") : "none",
        D = {
          taskKind: M.taskKind,
          uiCalls: M.uiCalls ?? [],
          contextSource: T,
          templatePrompt: M.templatePrompt ?? "",
          decision: M.decision,
          intent: M.intent,
          operations: q,
          reasoning: e.reasoning,
          suggestedReasoning: (0, r.isReasoningLevel)(M.suggestedReasoning)
            ? M.suggestedReasoning
            : r.DEFAULT_REASONING,
          agents: _,
          agentRuns: [],
          plannerContextCompacted: !!M.contextCompacted,
          plannerCachedTokens: M.usage?.cachedContentTokenCount ?? 0,
          noteIndex: [],
          noteRefs: P,
          knowledgeRefs: $,
          imageCount: p(e),
          plannerModel: M.model,
          ocrModel: A?.model,
          imageAnalysis: A?.analysis,
          fellBack: !1,
        };
      if ("clarify" === M.decision) {
        let e = M.clarifications ?? [],
          t = M.reply?.trim() ?? "";
        if ((0 === e.length && !t) || e.some((e) => e.options.length < 2))
          throw new a.ApiError(
            "Agent điều phối chưa gửi câu hỏi làm rõ hợp lệ.",
            {
              status: 502,
              code: "plan_invalid_clarification",
              stage: "planner_parse",
            },
          );
        return {
          reply: 1 === e.length && "confirm" === e[0].kind ? "" : t,
          action: "none",
          rejected: !1,
          clarifications: e,
          clarificationContext: A ?? void 0,
          summary: "",
          planSummary: M.summary,
          notes: M.notes,
          warnings: A?.warnings ?? [],
          trace: {
            ...D,
            resolvedPrompt: "",
            examScope: "none",
            examForced: !1,
            placeholders: [],
            unknownFunctions: [],
            injectedChars: 0,
          },
        };
      }
      if ("reject" === M.decision)
        return {
          reply:
            M.reply?.trim() ||
            "Tôi chỉ hỗ trợ các việc liên quan tới soạn và sửa đề thi.",
          action: "none",
          rejected: !0,
          summary: "",
          planSummary: M.summary,
          notes: M.notes,
          warnings: A?.warnings ?? [],
          trace: {
            ...D,
            resolvedPrompt: "",
            examScope: "none",
            examForced: !1,
            placeholders: [],
            unknownFunctions: [],
            injectedChars: 0,
          },
        };
      if ("ui_action" === M.taskKind || "direct_reply" === M.taskKind) {
        if (
          M.templatePrompt?.trim() ||
          M.agents?.length ||
          M.operations?.length
        )
          throw Error(
            "Kế hoạch thao tác giao diện không hợp lệ nên chưa được thực hiện.",
          );
        let t = M.uiCalls ?? [];
        if ("ui_action" === M.taskKind)
          ((0, c.executeUICalls)(t, e.uiActions ?? [], C.signal),
            v?.(M.nextPlannerHistory));
        else if (t.length || !M.reply?.trim())
          throw Error("Phản hồi trực tiếp của trợ lý không hợp lệ.");
        return {
          reply: M.reply?.trim() || "Đã thực hiện thao tác giao diện.",
          action: "none",
          rejected: !1,
          summary: M.summary,
          planSummary: M.summary,
          notes: M.notes,
          warnings: A?.warnings ?? [],
          trace: {
            ...D,
            contextSource: "none",
            resolvedPrompt: "",
            examScope: "none",
            examForced: !1,
            placeholders: [],
            unknownFunctions: [],
            injectedChars: 0,
          },
        };
      }
      if (M.uiCalls?.length)
        throw Error(
          "Kế hoạch trộn thao tác giao diện với soạn đề chưa được hỗ trợ.",
        );
      let O = M.templatePrompt ?? "",
        L =
          !E && /\{\{[^{}]+\}\}/.test(O)
            ? `Thực hiện y\xeau cầu sau tr\xean ExamDocument OCR của ảnh mới, kh\xf4ng d\xf9ng đề tr\xean UI: ${e.message}`
            : O,
        F = E
          ? (0, n.resolvePlaceholders)(L, N)
          : { prompt: L, resolved: [], unknown: [], injectedChars: 0 };
      if (F.resolved.some((e) => !e.ok))
        throw new a.ApiError(
          "Không đọc được ngữ cảnh mà kế hoạch yêu cầu. Hãy chọn lại câu hoặc gửi lại yêu cầu.",
          { status: 0, code: "context_resolution_failed", stage: "context" },
        );
      let H = F.resolved.some((e) => e.ok && "examMarkdown" === e.name),
        B = F.resolved
          .filter((e) => e.ok && "editContext" === e.name)
          .map((e) => ({ from: Number(e.args[0]), to: Number(e.args[1]) })),
        K = E && "edit" === M.intent && B.length > 0;
      if (
        B.length > 0 &&
        (!K ||
          H ||
          B.length > 24 ||
          B.some((e) => !(0, u.validEditRange)(e, S.exam.blockCount)))
      )
        throw new a.ApiError(
          "Kế hoạch trả về phạm vi chỉnh sửa không hợp lệ.",
          { status: 0, code: "invalid_edit_range", stage: "context" },
        );
      let V = F.resolved.some((e) => e.ok && d.has(e.name)),
        U = ("solve" === M.intent || "rubric" === M.intent) && !V,
        G =
          E &&
          !H &&
          !K &&
          ("full" === z ||
            U ||
            ("edit" === M.intent && !!e.exam.content.trim())) &&
          !!(e.exam.content.trim() || "full" === z);
      q.includes("chat") && b?.("solve");
      let X = await g(
        e,
        {
          prompt: F.prompt,
          verificationToken: M.verificationToken,
          instructionRefs: M.instructionRefs,
          resolvedContext: M.verificationToken
            ? F.resolved.map(({ raw: e, value: t }) => ({ raw: e, value: t }))
            : void 0,
          planned: !0,
          includeExam: E && G,
          contextSource: T,
          intent: M.intent,
          editRanges: K ? B : void 0,
          contextNotes: [],
          knowledgeRefs: $,
          agents: _,
          operations: q,
          extracted: A,
        },
        {
          ...C,
          onProgress: ({ message: e }) => y?.(e),
          onDelta: K ? void 0 : w,
          onReset: K ? void 0 : k,
        },
      );
      if (K && "patch" !== X.action && "none" !== X.action)
        throw new a.ApiError(
          "AI chưa trả về chỉnh sửa từng đoạn hợp lệ nên chưa áp dụng vào đề.",
          { status: 502, code: "invalid_exam_patch", stage: "chat_parse" },
        );
      if ("patch" === X.action) {
        if (!K)
          throw new a.ApiError(
            "AI trả về chỉnh sửa không có phạm vi được chọn.",
            { status: 502, code: "invalid_exam_patch", stage: "chat_parse" },
          );
        l = (0, u.applyExamPatches)(e.exam, X.patches ?? [], B);
      }
      let Q = l ?? X.exam,
        W = A?.sourceImages ?? e.images ?? [],
        J = Q ? await (0, o.resolveOcrFigureCrops)(Q.content, W) : void 0,
        Y = X.content
          ? await (0, o.resolveOcrFigureCrops)(X.content, W)
          : void 0;
      return {
        reply: X.reply,
        action: X.action,
        chooseApply: X.chooseApply,
        rejected: !1,
        exam: Q && J ? { ...Q, content: J.content } : Q,
        patches: X.patches,
        editRanges: K ? B : void 0,
        content: Y?.content ?? X.content,
        summary: X.summary ?? "",
        planSummary: M.summary,
        notes: M.notes,
        warnings: [
          ...(A?.warnings ?? []),
          ...(X.warnings ?? []),
          ...(J?.warnings ?? []),
          ...(Y?.warnings ?? []),
        ],
        grounding: X.grounding,
        trace: {
          ...D,
          reasoning: (0, r.isReasoningLevel)(X.reasoning ?? "")
            ? X.reasoning
            : e.reasoning,
          agentRuns: X.agents ?? [],
          resolvedPrompt: F.prompt,
          examScope: K ? "partial" : G ? "full" : z,
          examForced: G,
          placeholders: F.resolved,
          unknownFunctions: F.unknown,
          injectedChars: F.injectedChars,
          solverModel: q.includes("chat") ? X.model : void 0,
          ocrModel: A?.model ?? X.ocrModel,
        },
      };
    }
    (e.s(["runChatTurn", 0, x], 155415), e.s([], 565594));
  },
  792868,
  (e) => {
    "use strict";
    async function t(e, t) {
      let n = await new Promise((t, n) => {
          let r = new Image();
          ((r.onload = () => t(r)),
            (r.onerror = () => n(Error("Không giải mã được ảnh nguồn."))),
            (r.src = `data:${e.mimeType};base64,${e.data}`));
        }),
        r = Math.floor(t.x * n.naturalWidth),
        a = Math.floor(t.y * n.naturalHeight),
        i = Math.min(
          n.naturalWidth - r,
          Math.ceil((t.x + t.width) * n.naturalWidth) - r,
        ),
        l = Math.min(
          n.naturalHeight - a,
          Math.ceil((t.y + t.height) * n.naturalHeight) - a,
        );
      if (i <= 0 || l <= 0)
        throw Error("Vùng hình không có kích thước hợp lệ.");
      let s = document.createElement("canvas");
      ((s.width = i), (s.height = l));
      let o = s.getContext("2d");
      if (!o) throw Error("Không tạo được vùng ảnh.");
      return (o.drawImage(n, r, a, i, l, 0, 0, i, l), s.toDataURL("image/png"));
    }
    async function n(e, r, a = t) {
      let i = [],
        l = new Map(),
        s = "",
        o = 0;
      for (let t of e.matchAll(/!\[([^\]\n]*)\]\((ocr-crop:[^)\n]+)\)/g)) {
        let n = t[2];
        if (!l.has(n)) {
          let e = (function (e) {
            let t = /^ocr-crop:(\d+):([\d.]+),([\d.]+),([\d.]+),([\d.]+)$/.exec(
              e,
            );
            if (!t) return null;
            let [n, r, a, i, l] = t.slice(1).map(Number);
            return !Number.isSafeInteger(n) ||
              n < 1 ||
              [r, a, i, l].some((e) => !Number.isFinite(e) || e < 0 || e > 1) ||
              i <= 0 ||
              l <= 0 ||
              r + i > 1.000001 ||
              a + l > 1.000001
              ? null
              : { page: n, x: r, y: a, width: i, height: l };
          })(n);
          try {
            if (!e || !r[e.page - 1])
              throw Error("OCR trả vùng hình hoặc số trang không hợp lệ.");
            l.set(n, await a(r[e.page - 1], e));
          } catch (e) {
            (i.push(
              `H\xecnh “${t[1]}” chưa lấy được từ ảnh: ${e instanceof Error ? e.message : "Không cắt được hình."}`,
            ),
              l.set(n, ""));
          }
        }
        ((s += e.slice(o, t.index) + `![${t[1]}](${l.get(n)})`),
          (o = t.index + t[0].length));
      }
      return { content: s + e.slice(o), warnings: i };
    }
    e.s(["resolveOcrFigureCrops", 0, n]);
  },
  534947,
  (e) => {
    "use strict";
    e.s([
      "editorUIActions",
      0,
      function (e) {
        return [
          ...(e.openVersionStudio
            ? [
                {
                  name: "openVersionStudio",
                  description:
                    "Mở Xưởng mã đề để tạo nhiều mã đề từ đề đang mở (trộn câu và phương án, đổi số liệu, câu tương đồng); mỗi mã thành một tab riêng có đáp án, đề gốc giữ nguyên. Dùng khi người dùng muốn thêm mã đề, trộn đề, đổi số hay câu tương tự cho các mã khác.",
                  params: [
                    {
                      name: "request",
                      description:
                        "Yêu cầu nguyên văn của người dùng về các mã đề.",
                      type: "string",
                      required: !0,
                    },
                    {
                      name: "count",
                      description: "Số mã đề người dùng nêu, từ 1 đến 30.",
                      type: "number",
                      required: !1,
                      minimum: 1,
                      maximum: 30,
                    },
                  ],
                  run: ([t, n]) =>
                    e.openVersionStudio(
                      String(t ?? ""),
                      "number" == typeof n ? n : void 0,
                    ),
                },
              ]
            : []),
          {
            name: "renameDocument",
            description:
              "Đổi tên tài liệu đang mở, giữ nguyên nội dung. Chỉ gọi khi người dùng yêu cầu đổi tên rõ ràng.",
            params: [
              {
                name: "title",
                description: "Tên mới, từ 1 đến 200 ký tự.",
                type: "string",
                required: !0,
              },
            ],
            validate: ([e]) => {
              if ("string" != typeof e || !e.trim() || e.trim().length > 200)
                throw Error("Tên tài liệu cần từ 1 đến 200 ký tự.");
            },
            run: ([t]) => e.renameDocument(String(t).trim()),
          },
          {
            name: "setZoom",
            description: "Đặt mức thu phóng trang soạn thảo theo phần trăm.",
            params: [
              {
                name: "percent",
                description: "Từ 50 đến 200, ví dụ 125 cho 125%.",
                type: "number",
                required: !0,
                minimum: 50,
                maximum: 200,
              },
            ],
            run: ([t]) => e.setZoom(Number(t) / 100),
          },
          {
            name: "setRulerVisible",
            description: "Hiện hoặc ẩn thước trên trang soạn thảo.",
            params: [
              {
                name: "visible",
                description: "true để hiện, false để ẩn.",
                type: "boolean",
                required: !0,
              },
            ],
            run: ([t]) => e.setRulerVisible(!!t),
          },
          {
            name: "setOutlineVisible",
            description: "Hiện hoặc ẩn bảng dàn ý bên trái trang soạn thảo.",
            params: [
              {
                name: "visible",
                description: "true để hiện, false để ẩn.",
                type: "boolean",
                required: !0,
              },
            ],
            run: ([t]) => e.setOutlineVisible(!!t),
          },
        ];
      },
      "executeUICalls",
      0,
      function (e, t, n) {
        let r = new Map(t.map((e) => [e.name, e]));
        if (
          !Array.isArray(e) ||
          0 === e.length ||
          e.length > 8 ||
          r.size !== t.length
        )
          throw Error(
            "Kế hoạch thao tác giao diện không hợp lệ nên chưa được thực hiện.",
          );
        let a = e.map((e) => {
          let t = r.get(e.name);
          if (!t || !Array.isArray(e.args) || e.args.length > t.params.length)
            throw Error(
              "Kế hoạch thao tác giao diện không hợp lệ nên chưa được thực hiện.",
            );
          return (
            t.params.forEach((t, n) => {
              if (n >= e.args.length) {
                if (t.required)
                  throw Error(
                    "Kế hoạch thao tác giao diện không hợp lệ nên chưa được thực hiện.",
                  );
                return;
              }
              let r = e.args[n];
              if (
                typeof r !== t.type ||
                ("string" == typeof r && r.length > 8e3) ||
                ("number" == typeof r &&
                  (!Number.isFinite(r) ||
                    (void 0 !== t.minimum && r < t.minimum) ||
                    (void 0 !== t.maximum && r > t.maximum)))
              )
                throw Error(
                  "Kế hoạch thao tác giao diện không hợp lệ nên chưa được thực hiện.",
                );
            }),
            t.validate?.(e.args),
            { action: t, args: e.args }
          );
        });
        for (let { action: e, args: t } of (n?.throwIfAborted(), a)) e.run(t);
      },
      "uiActionCatalog",
      0,
      function (e) {
        return e.map(({ name: e, description: t, params: n }) => ({
          name: e,
          description: t,
          params: n,
        }));
      },
    ]);
  },
  349776,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(328623),
      r = e.i(522016),
      a = e.i(604131),
      i = e.i(653779),
      l = e.i(561309),
      s = e.i(816186),
      o = e.i(815731);
    e.s([
      "AssistantBubble",
      0,
      function ({ message: e, loading: c, onSend: u }) {
        return (0, t.jsxs)(s.Message, {
          align: "start",
          children: [
            (0, t.jsx)(s.MessageAvatar, {
              className:
                "size-7 rounded-full bg-linear-to-br from-[#d3e5ef] to-[#e8dcf9] text-[#2383e2]",
              children: (0, t.jsx)(n.Sparkles, {
                "aria-hidden": !0,
                className: "size-3.5",
              }),
            }),
            (0, t.jsx)(s.MessageContent, {
              children: (0, t.jsx)(o.Bubble, {
                align: "start",
                variant: "secondary",
                className: "max-w-none w-full",
                children: (0, t.jsxs)(o.BubbleContent, {
                  className:
                    "rounded-none border-0 bg-transparent px-0 py-0.5 text-neutral-900 shadow-none",
                  children: [
                    e.content &&
                      (0, t.jsx)("div", {
                        className:
                          "prose prose-xs max-w-none break-words leading-relaxed",
                        children: (0, t.jsx)(a.RichText, { text: e.content }),
                      }),
                    e.clarifications &&
                      e.clarifications.length > 0 &&
                      (0, t.jsx)(i.ClarificationWizard, {
                        clarifications: e.clarifications,
                        disabled: c,
                        answered: e.clarificationAnswered,
                        onSubmit: (t, n) =>
                          void u(`${n}`, e.id, e.clarificationContext, t),
                      }),
                    e.remembered &&
                      (0, t.jsxs)(r.default, {
                        href: "/memory",
                        target: "_blank",
                        className:
                          "mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full border border-transparent px-2.5 py-0.5 text-[12px] text-[#37352f] [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(100deg,#2383e2,#9b72cb)_border-box]",
                        title: "Xem và sửa trong Trí nhớ của trợ lý",
                        children: [
                          (0, t.jsx)(n.Sparkles, {
                            "aria-hidden": !0,
                            className: "size-3 shrink-0 text-[#9b72cb]",
                          }),
                          (0, t.jsxs)("span", {
                            className: "truncate",
                            children: ["Đã ghi nhớ: ", e.remembered],
                          }),
                        ],
                      }),
                    e.sources &&
                      e.sources.length > 0 &&
                      (0, t.jsxs)("div", {
                        className:
                          "mt-2 flex flex-wrap items-center gap-1.5 border-t border-dashed border-[#dfdfdd] pt-2 text-[11.5px] text-[#787774]",
                        children: [
                          (0, t.jsx)("span", { children: "Nguồn đã dùng:" }),
                          e.sources.map((e) =>
                            (0, t.jsx)(
                              r.default,
                              {
                                href: `/library/${e.id}`,
                                target: "_blank",
                                title: e.name,
                                className:
                                  "max-w-48 truncate rounded-md border border-[#e9e9e7] bg-[#f7f6f3] px-1.5 py-px text-[#5f5e5b] hover:text-[#37352f]",
                                children: e.name,
                              },
                              e.id,
                            ),
                          ),
                        ],
                      }),
                    (0, t.jsx)(l.GroundingPanel, {
                      message: e,
                      loading: c,
                      onFix: (e) => void u(e),
                    }),
                    e.warnings &&
                      e.warnings.length > 0 &&
                      (0, t.jsx)("ul", {
                        className:
                          "mt-2 space-y-0.5 rounded-lg bg-amber-50 p-2 text-[11px] text-amber-800",
                        children: e.warnings.map((e, n) =>
                          (0, t.jsxs)("li", { children: ["• ", e] }, n),
                        ),
                      }),
                  ],
                }),
              }),
            }),
          ],
        });
      },
    ]);
  },
  165358,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(96892),
      r = e.i(129768),
      a = e.i(226091),
      i = e.i(779266),
      l = e.i(325597),
      s = e.i(271645),
      o = e.i(647163);
    let c = [
        "Tạo đề thi giữa kỳ Toán lớp 9 gồm 5 câu tự luận",
        "Giải đề trong trang và viết đáp án, barem chi tiết",
        "Soát lỗi chính tả và định dạng của đề này",
      ],
      u = [
        "Tạo đề thi, đáp án và cách chấm điểm chi tiết",
        "Chuyển hình ảnh đề thi thành văn bản để chỉnh sửa",
        "Sáng tạo các câu hỏi mới cho đề thi theo ý tưởng của bạn",
        "Chỉnh sửa số liệu hoặc đổi câu hỏi tương tự cho đề thi",
      ],
      d = {
        src: { className: "bg-[#dbeddb] text-[#0f7b6c]", Icon: a.FileText },
        mem: { className: "bg-[#f1ebf8] text-[#6940a5]", Icon: i.History },
        season: {
          className: "bg-[#fbecdd] text-[#b25e09]",
          Icon: r.CalendarDays,
        },
        state: { className: "bg-[#e7f3f8] text-[#0b6bcb]", Icon: l.PenLine },
      };
    e.s([
      "ChatEmptyState",
      0,
      function ({
        onPick: e,
        onFill: r,
        onAction: a,
        disabled: i,
        sourceKinds: l = [],
        result: h,
        loading: m = !1,
        headlines: p = u,
        defaults: f = c,
      }) {
        let g = (e) => !!e.action && !!a?.(e.action, e.text),
          x = h?.headline ?? "",
          b = (0, s.useMemo)(() => (x ? [x] : p), [x, p]),
          { text: v, typing: y } = (function (e) {
            let [t, n] = (0, s.useState)({ text: "", typing: !0 });
            return (
              (0, s.useEffect)(() => {
                let t,
                  r = window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches,
                  a = e.map((e) => Array.from(e.normalize("NFC"))),
                  i = 0,
                  l = 0,
                  s = (e, n) => {
                    t = window.setTimeout(e, n);
                  },
                  o = (e, t) =>
                    n({ text: a[i].slice(0, e).join(""), typing: t }),
                  c = () => {
                    let e = a[i].length;
                    (o((l = r ? e : l + 1), l < e),
                      l < e
                        ? s(c, 52 + 40 * Math.random())
                        : a.length > 1 && s(u, 2500));
                  },
                  u = () => {
                    (o((l = r ? 0 : l - 1), !0),
                      l > 0 ? s(u, 24) : ((i = (i + 1) % a.length), s(c, 380)));
                  };
                return (s(c, 250), () => window.clearTimeout(t));
              }, [e]),
              t
            );
          })(b),
          w = h?.suggestions.length
            ? h.suggestions
            : (function (e, t = c) {
                let n = e.some((e) => "matrix" === e || "spec" === e),
                  r = e.includes("exam"),
                  a = [];
                return (
                  n &&
                    r &&
                    a.push({
                      text: "Soạn đề theo ma trận đã chọn, lấy dạng câu và văn phong của đề mẫu",
                      why: "src",
                      reason: "Từ ma trận và đề mẫu",
                    }),
                  n &&
                    a.push({
                      text: "Soạn đề theo ma trận đã chọn, kèm đáp án và barem",
                      why: "src",
                      reason: "Từ ma trận đã chọn",
                    }),
                  r &&
                    a.push({
                      text: "Soạn một đề tương tự đề mẫu, đổi số liệu và giữ độ khó",
                      why: "src",
                      reason: "Từ đề mẫu đã chọn",
                    }),
                  e.includes("answer") &&
                    a.push({
                      text: "Soạn barem theo cách trình bày của đáp án đã chọn",
                      why: "src",
                      reason: "Từ đáp án đã chọn",
                    }),
                  [
                    ...a,
                    ...t.map((e) => ({ text: e, why: "state", reason: "" })),
                  ].slice(0, 3)
                );
              })(l, f),
          k = w.map((e) => e.text).join("|");
        return (0, t.jsxs)("div", {
          className: "flex min-h-0 flex-1 flex-col overflow-y-auto",
          children: [
            (0, t.jsx)("div", {
              className:
                "flex flex-1 flex-col items-center justify-center gap-1.5 px-6",
              children: (0, t.jsx)("h2", {
                className:
                  "flex min-h-[3.2rem] max-w-full items-center justify-center text-center text-2xl font-medium leading-[1.3] tracking-tight text-balance",
                "aria-label": b[0],
                children: (0, t.jsxs)("span", {
                  className:
                    "bg-linear-to-r from-[#2383e2] via-[#5b8def] to-[#9b72cb] bg-clip-text text-transparent",
                  children: [
                    v,
                    (0, t.jsx)("span", {
                      "aria-hidden": !0,
                      className:
                        "ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] rounded-full bg-[#2383e2]",
                      style: y
                        ? void 0
                        : { animation: "caret-blink 1s steps(1) infinite" },
                    }),
                  ],
                }),
              }),
            }),
            (0, t.jsx)("div", {
              className: "shrink-0 px-3 pb-2",
              children: (0, t.jsx)(
                "ul",
                {
                  className: "grid gap-1.5",
                  children: w.map((a, l) => {
                    let s = d[a.why] ?? d.state;
                    return (0, t.jsxs)(
                      "li",
                      {
                        className:
                          "gen-rise relative overflow-hidden rounded-xl border border-transparent [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(100deg,#cfe3f7,#e4dbf3)_border-box] hover:[background:linear-gradient(#fbfcff,#fbfcff)_padding-box,linear-gradient(100deg,#2383e2,#9b72cb)_border-box]",
                        style: { animationDelay: `${90 * l}ms` },
                        children: [
                          m &&
                            (0, t.jsx)("span", {
                              "aria-hidden": !0,
                              className:
                                "gen-sweep pointer-events-none absolute inset-0",
                            }),
                          (0, t.jsxs)("div", {
                            className:
                              "flex items-start gap-2 py-2 pr-1.5 pl-2.5",
                            children: [
                              (0, t.jsxs)("button", {
                                type: "button",
                                disabled: i,
                                onClick: () =>
                                  g(a) || (r ? r(a.text) : e(a.text)),
                                className:
                                  "min-w-0 flex-1 text-left disabled:opacity-50",
                                title: r
                                  ? "Đưa vào ô nhập để sửa trước khi gửi"
                                  : void 0,
                                children: [
                                  (0, t.jsx)("span", {
                                    className:
                                      "block text-[13px] leading-snug text-neutral-800",
                                    children: a.text,
                                  }),
                                  a.reason &&
                                    (0, t.jsxs)("span", {
                                      className: (0, o.cn)(
                                        "mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-px text-[10.5px] font-medium",
                                        s.className,
                                      ),
                                      children: [
                                        (0, t.jsx)(s.Icon, {
                                          "aria-hidden": !0,
                                          className: "size-3",
                                        }),
                                        a.reason,
                                      ],
                                    }),
                                ],
                              }),
                              r &&
                                (0, t.jsx)("button", {
                                  type: "button",
                                  disabled: i,
                                  onClick: () => g(a) || e(a.text),
                                  "aria-label": `Gửi ngay: ${a.text}`,
                                  title: "Gửi ngay",
                                  className:
                                    "grid size-7 shrink-0 place-items-center rounded-full text-[#9b9a97] transition-colors hover:bg-[#f1f1ef] hover:text-[#37352f] disabled:opacity-50",
                                  children: (0, t.jsx)(n.ArrowUp, {
                                    "aria-hidden": !0,
                                    className: "size-3.5",
                                  }),
                                }),
                            ],
                          }),
                        ],
                      },
                      a.text,
                    );
                  }),
                },
                k,
              ),
            }),
          ],
        });
      },
    ]);
  },
  345901,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(96892),
      r = e.i(569644),
      a = e.i(513797),
      i = e.i(64801),
      l = e.i(725981),
      s = e.i(271645),
      o = e.i(463415),
      c = e.i(728231);
    e.i(565594);
    var u = e.i(64805),
      d = e.i(228742),
      h = e.i(226091),
      m = e.i(632781),
      p = e.i(263676),
      f = e.i(996296);
    (e.i(176782), e.i(911825));
    var g = e.i(225913),
      x = e.i(647163),
      b = e.i(167881);
    let v = (0, g.cva)(
      "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-xl border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/50 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed",
      {
        variants: {
          size: {
            default:
              "gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
            sm: "gap-2 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
            xs: "gap-1.5 rounded-lg text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
          },
          orientation: {
            horizontal: "min-w-36 items-center",
            vertical: "w-20 flex-col has-data-[slot=attachment-content]:w-24",
          },
        },
        defaultVariants: { size: "sm", orientation: "horizontal" },
      },
    );
    function y({
      className: e,
      state: n = "done",
      size: r = "sm",
      orientation: a = "horizontal",
      ...i
    }) {
      return (0, t.jsx)("div", {
        "data-slot": "attachment",
        "data-state": n,
        "data-size": r,
        "data-orientation": a,
        className: (0, x.cn)(v({ size: r, orientation: a }), e),
        ...i,
      });
    }
    let w = (0, g.cva)(
      "relative flex aspect-square w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
      {
        variants: {
          variant: {
            icon: "",
            image:
              "opacity-80 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
          },
        },
        defaultVariants: { variant: "icon" },
      },
    );
    function k({ className: e, variant: n = "icon", ...r }) {
      return (0, t.jsx)("div", {
        "data-slot": "attachment-media",
        "data-variant": n,
        className: (0, x.cn)(w({ variant: n }), e),
        ...r,
      });
    }
    function j({ className: e, ...n }) {
      return (0, t.jsx)("div", {
        "data-slot": "attachment-content",
        className: (0, x.cn)(
          "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
          e,
        ),
        ...n,
      });
    }
    function C({ className: e, ...n }) {
      return (0, t.jsx)("span", {
        "data-slot": "attachment-title",
        className: (0, x.cn)(
          "block max-w-full min-w-0 truncate font-medium text-xs text-slate-800",
          e,
        ),
        ...n,
      });
    }
    function N({ className: e, ...n }) {
      return (0, t.jsx)("span", {
        "data-slot": "attachment-description",
        className: (0, x.cn)(
          "mt-0.5 block min-w-0 truncate text-[10px] text-muted-foreground group-data-[state=error]/attachment:text-destructive/80 max-w-full",
          e,
        ),
        ...n,
      });
    }
    function S({ className: e, ...n }) {
      return (0, t.jsx)("div", {
        "data-slot": "attachment-actions",
        className: (0, x.cn)(
          "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-1.5 group-data-[orientation=vertical]/attachment:right-1.5 group-data-[orientation=vertical]/attachment:gap-1",
          e,
        ),
        ...n,
      });
    }
    function M({ className: e, variant: n, size: r = "icon-xs", ...a }) {
      return (0, t.jsx)(b.Button, {
        "data-slot": "attachment-action",
        variant: n ?? "ghost",
        size: r,
        className: (0, x.cn)("size-6 p-0", e),
        ...a,
      });
    }
    function R({ className: e, ...n }) {
      return (0, t.jsx)("div", {
        "data-slot": "attachment-group",
        className: (0, x.cn)(
          "flex min-w-0 flex-wrap gap-2 py-1 *:data-[slot=attachment]:flex-none",
          e,
        ),
        ...n,
      });
    }
    function I({
      attachments: e,
      documents: n,
      preparing: r,
      loading: a,
      onPreview: l,
      onRemove: s,
      onClear: o,
    }) {
      let c = e.length + n.length;
      return 0 !== c || r
        ? (0, t.jsxs)("div", {
            className: "mb-2 rounded-xl border border-neutral-200 bg-white p-2",
            children: [
              (0, t.jsxs)("div", {
                className:
                  "mb-1.5 flex items-center justify-between text-[11px] font-normal text-neutral-500",
                children: [
                  (0, t.jsxs)("span", {
                    className: "flex items-center gap-1.5",
                    children: [
                      (0, t.jsx)(i.Paperclip, { className: "size-3.5" }),
                      r
                        ? "Đang xử lý tệp..."
                        : [
                            e.length > 0
                              ? `${e.length}/${d.MAX_CHAT_IMAGES} ảnh`
                              : "",
                            n.length > 0
                              ? `${n.length}/${u.MAX_CHAT_FILES} tệp`
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" · "),
                    ],
                  }),
                  c > 0 &&
                    !r &&
                    (0, t.jsx)("button", {
                      type: "button",
                      onClick: o,
                      disabled: a,
                      className:
                        "text-neutral-400 transition-colors hover:text-rose-600 disabled:opacity-40",
                      children: "Xoá hết",
                    }),
                ],
              }),
              (0, t.jsxs)(R, {
                children: [
                  e.map((e) =>
                    (0, t.jsxs)(
                      y,
                      {
                        size: "sm",
                        className:
                          "relative cursor-pointer overflow-hidden border border-neutral-200 bg-neutral-50 pr-8 hover:bg-neutral-100",
                        onClick: () =>
                          l({ src: e.previewUrl, alt: e.name, name: e.name }),
                        children: [
                          (0, t.jsx)(k, {
                            variant: "image",
                            className: "size-8 rounded",
                            children: (0, t.jsx)("img", {
                              src: e.previewUrl,
                              alt: e.name,
                              className: "size-full object-cover",
                            }),
                          }),
                          (0, t.jsxs)(j, {
                            className: "max-w-28",
                            children: [
                              (0, t.jsx)(C, { children: e.name }),
                              (0, t.jsx)(N, {
                                children: (0, f.formatBytes)(e.bytes),
                              }),
                            ],
                          }),
                          (0, t.jsx)(S, {
                            children: (0, t.jsx)(M, {
                              variant: "ghost",
                              size: "icon-xs",
                              title: "Bỏ ảnh này",
                              disabled: a || r,
                              onClick: (t) => {
                                (t.stopPropagation(), s(e.id));
                              },
                              className:
                                "text-neutral-400 hover:bg-rose-50 hover:text-rose-600",
                              children: (0, t.jsx)(p.X, {
                                className: "size-3",
                              }),
                            }),
                          }),
                        ],
                      },
                      e.id,
                    ),
                  ),
                  n.map((e) =>
                    (0, t.jsxs)(
                      y,
                      {
                        size: "sm",
                        className:
                          "max-w-full border-neutral-200 bg-neutral-50",
                        children: [
                          (0, t.jsx)(k, {
                            variant: "icon",
                            children: (0, t.jsx)(h.FileText, {
                              "aria-hidden": !0,
                              className: "size-4 text-[#2383e2]",
                            }),
                          }),
                          (0, t.jsxs)(j, {
                            className: "max-w-36",
                            children: [
                              (0, t.jsx)(C, {
                                title: e.name,
                                children: e.name,
                              }),
                              (0, t.jsx)(N, {
                                children: (0, f.formatBytes)(e.bytes),
                              }),
                            ],
                          }),
                          (0, t.jsx)(S, {
                            children: (0, t.jsx)(M, {
                              variant: "ghost",
                              size: "icon-xs",
                              title: `Bỏ tệp ${e.name}`,
                              "aria-label": `Bỏ tệp ${e.name}`,
                              disabled: a || r,
                              onClick: () => s(e.id),
                              className:
                                "text-neutral-400 hover:bg-rose-50 hover:text-rose-600",
                              children: (0, t.jsx)(p.X, {
                                "aria-hidden": !0,
                                className: "size-3",
                              }),
                            }),
                          }),
                        ],
                      },
                      e.id,
                    ),
                  ),
                  r &&
                    (0, t.jsxs)(y, {
                      state: "uploading",
                      size: "sm",
                      className: "min-w-32 border-dashed",
                      children: [
                        (0, t.jsx)(k, {
                          variant: "icon",
                          children: (0, t.jsx)(m.Loader2, {
                            className: "size-4 animate-spin text-neutral-400",
                          }),
                        }),
                        (0, t.jsxs)(j, {
                          children: [
                            (0, t.jsx)(C, { children: "Đang đọc tệp..." }),
                            (0, t.jsx)(N, { children: "Vui lòng đợi" }),
                          ],
                        }),
                      ],
                    }),
                ],
              }),
            ],
          })
        : null;
    }
    var A = e.i(871813),
      T = e.i(670495),
      E = e.i(716327),
      P = e.i(127923),
      $ = e.i(608532),
      _ = e.i(88653),
      q = e.i(532181);
    function z({ text: e, className: n }) {
      return (0, t.jsx)("span", {
        className: `relative inline-flex overflow-hidden whitespace-nowrap align-bottom ${n ?? ""}`,
        children: (0, t.jsx)(_.AnimatePresence, {
          mode: "popLayout",
          initial: !1,
          children: (0, t.jsx)(
            q.motion.span,
            {
              initial: { y: "100%", opacity: 0 },
              animate: { y: "0%", opacity: 1 },
              exit: { y: "-100%", opacity: 0 },
              transition: { duration: 0.2, ease: [0.2, 0, 0, 1] },
              className: "inline-block",
              children: e,
            },
            e,
          ),
        }),
      });
    }
    let D = (e) => `calc(14px + ${e} * (100% - 28px))`;
    function O({ value: e, onChange: n, disabled: r }) {
      let a = Math.max(
          0,
          $.REASONING_OPTIONS.findIndex((t) => t.level === e),
        ),
        i = (0, $.reasoningOption)(e),
        l = $.REASONING_OPTIONS.length - 1,
        o = (0, s.useRef)(null),
        c = (e) => {
          let t = Math.min(l, Math.max(0, e));
          t !== a && n($.REASONING_OPTIONS[t].level);
        },
        u = (e) => {
          let t = o.current?.getBoundingClientRect();
          if (!t) return;
          let n = t.width - 28;
          c(Math.round(((e - t.left - 14) / n) * l));
        };
      return (0, t.jsxs)(P.Popover.Root, {
        children: [
          (0, t.jsxs)(P.Popover.Trigger, {
            disabled: r,
            "aria-label": `Mức suy luận: ${i.label}`,
            className:
              "inline-flex h-8 min-w-0 items-center gap-1 rounded-full px-2 font-sans text-xs leading-5 font-normal text-neutral-600 outline-none transition-colors hover:bg-black/[0.06] focus-visible:ring-2 focus-visible:ring-[#2383e2]/40 data-[state=open]:bg-[#d3e5ef] data-[state=open]:text-[#2383e2] disabled:pointer-events-none disabled:opacity-40",
            children: [
              (0, t.jsxs)("span", {
                className:
                  "inline-flex min-w-0 items-center gap-1 whitespace-nowrap",
                children: ["Mức: ", (0, t.jsx)(z, { text: i.label })],
              }),
              (0, t.jsx)(E.ChevronDown, {
                "aria-hidden": !0,
                className: "size-3.5 shrink-0 opacity-70",
              }),
            ],
          }),
          (0, t.jsx)(P.Popover.Portal, {
            children: (0, t.jsxs)(P.Popover.Content, {
              side: "top",
              align: "end",
              sideOffset: 8,
              collisionPadding: 12,
              className:
                "doc-menu z-50 w-[280px] rounded-2xl border border-neutral-200 bg-white p-4 text-neutral-900 shadow-[0_2px_6px_rgba(60,64,67,0.2),0_6px_16px_4px_rgba(60,64,67,0.12)] outline-none",
              children: [
                (0, t.jsxs)("div", {
                  className: "flex items-center gap-2",
                  children: [
                    (0, t.jsx)("span", {
                      className: "text-[13px] text-neutral-500",
                      children: "Mức suy luận",
                    }),
                    (0, t.jsx)(z, {
                      text: i.label,
                      className: "text-[13px] font-medium",
                    }),
                    e === $.DEFAULT_REASONING &&
                      (0, t.jsx)("span", {
                        className:
                          "ml-auto rounded-full bg-[#d3e5ef] px-2 py-0.5 text-[11px] font-medium text-[#0b6bcb]",
                        children: "Khuyên dùng",
                      }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className:
                    "mt-4 flex items-center justify-between text-[12px] text-neutral-500",
                  children: [
                    (0, t.jsx)("span", { children: "Nhanh hơn" }),
                    (0, t.jsx)("span", { children: "Thông minh hơn" }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  ref: o,
                  role: "slider",
                  tabIndex: 0,
                  "aria-label": "Mức suy luận",
                  "aria-valuemin": 0,
                  "aria-valuemax": l,
                  "aria-valuenow": a,
                  "aria-valuetext": i.label,
                  onPointerDown: (e) => {
                    (e.currentTarget.setPointerCapture(e.pointerId),
                      u(e.clientX));
                  },
                  onPointerMove: (e) => {
                    e.currentTarget.hasPointerCapture(e.pointerId) &&
                      u(e.clientX);
                  },
                  onKeyDown: (e) => {
                    let t = {
                      ArrowRight: a + 1,
                      ArrowUp: a + 1,
                      ArrowLeft: a - 1,
                      ArrowDown: a - 1,
                      Home: 0,
                      End: l,
                    };
                    e.key in t && (e.preventDefault(), c(t[e.key]));
                  },
                  className:
                    "relative mt-2 h-6 w-full cursor-pointer touch-none select-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#2383e2]/30",
                  children: [
                    (0, t.jsx)("div", {
                      className:
                        "absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#e1e6ec]",
                    }),
                    (0, t.jsx)("div", {
                      className:
                        "absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#a8cff0] transition-[width] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                      style: { width: D(a / l) },
                    }),
                    $.REASONING_OPTIONS.map((e, n) =>
                      (0, t.jsx)(
                        "span",
                        {
                          "aria-hidden": !0,
                          className: `absolute top-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-200 ${n <= a ? "bg-white/80" : "bg-[#787774]/45"}`,
                          style: { left: D(n / l) },
                        },
                        e.level,
                      ),
                    ),
                    (0, t.jsx)("div", {
                      "aria-hidden": !0,
                      className:
                        "absolute top-1/2 h-4 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2383e2] shadow-[0_1px_3px_rgba(60,64,67,0.4)] transition-[left] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                      style: { left: D(a / l) },
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      });
    }
    e.s(
      [
        "ChatInputBar",
        0,
        function ({
          input: e,
          onInputChange: h,
          onSend: m,
          loading: p,
          reasoning: f,
          onReasoningChange: g,
          references: x,
          onRemoveReference: b,
          attachments: v,
          documents: y,
          preparing: w,
          fileInputRef: k,
          documentInputRef: j,
          textareaRef: C,
          onAddFiles: N,
          onRemoveAttachment: S,
          onClearAttachments: M,
          onPreviewImage: R,
          library: E,
          sourceBar: P,
          placeholder: $ = "Nhập yêu cầu tạo, sửa, giải đề thi…",
        }) {
          let _ = (0, s.useRef)(null),
            q =
              (e.trim().length > 0 || v.length > 0 || y.length > 0) && !p && !w,
            z = () => {
              (m(), C.current && (C.current.style.height = "auto"));
            };
          return (0, t.jsxs)("div", {
            className: "shrink-0 px-3 pb-2 pt-1",
            children: [
              (0, t.jsx)(I, {
                attachments: v,
                documents: y,
                preparing: w,
                loading: p,
                onPreview: R,
                onRemove: S,
                onClear: M,
              }),
              P,
              (0, t.jsxs)("div", {
                className:
                  "rounded-2xl border border-[#e3e2e0] bg-white transition-[border-color,box-shadow] focus-within:border-[#a8cff0] focus-within:shadow-[0_0_0_2px_rgb(168_199_250/0.15)]",
                children: [
                  (0, t.jsx)("input", {
                    ref: k,
                    type: "file",
                    accept: "image/*",
                    disabled: p || w,
                    multiple: !0,
                    className: "hidden",
                    onChange: (e) => {
                      (e.target.files && N(e.target.files),
                        (e.target.value = ""));
                    },
                  }),
                  (0, t.jsx)("input", {
                    ref: j,
                    type: "file",
                    accept: u.CHAT_FILE_ACCEPT,
                    multiple: !0,
                    disabled: p || w,
                    "aria-label": "Chọn tệp đính kèm",
                    className: "hidden",
                    onChange: (e) => {
                      (e.target.files && N(e.target.files),
                        (e.target.value = ""));
                    },
                  }),
                  E &&
                    (0, t.jsx)("input", {
                      ref: _,
                      type: "file",
                      accept: E.accept,
                      multiple: !0,
                      disabled: p,
                      "aria-label": "Chọn tệp để tải lên kho tài liệu",
                      className: "hidden",
                      onChange: (e) => {
                        (e.target.files &&
                          E.onUpload(Array.from(e.target.files)),
                          (e.target.value = ""));
                      },
                    }),
                  x.length > 0 &&
                    (0, t.jsx)("div", {
                      className: "px-3 pt-3",
                      children: (0, t.jsx)(T.ReferenceChips, {
                        references: x.map((e) => ({
                          id: e.id,
                          label: (0, A.referenceLabel)(e),
                          preview: e.preview,
                        })),
                        onRemove: b,
                        disabled: p,
                      }),
                    }),
                  (0, t.jsx)("div", {
                    className: `px-3.5 pb-2 ${x.length > 0 ? "pt-2" : "pt-3"}`,
                    children: (0, t.jsx)("textarea", {
                      ref: C,
                      value: e,
                      onChange: (e) => {
                        h(e.target.value);
                        let t = e.target;
                        ((t.style.height = "auto"),
                          (t.style.height = `${Math.min(t.scrollHeight, 140)}px`));
                      },
                      onKeyDown: (e) => {
                        "Enter" !== e.key ||
                          e.shiftKey ||
                          e.nativeEvent.isComposing ||
                          (e.preventDefault(), q && z());
                      },
                      placeholder:
                        x.length > 0 ? "Hỏi hoặc nhờ AI sửa đoạn đã chọn…" : $,
                      rows: 1,
                      disabled: p,
                      "aria-label": "Yêu cầu cho trợ lý AI",
                      className:
                        "block min-h-6 max-h-36 w-full resize-none border-0 bg-transparent p-0 font-sans text-[13px] leading-6 text-neutral-900 outline-none placeholder:text-neutral-500 disabled:opacity-60",
                      style: { height: "auto" },
                    }),
                  }),
                  (0, t.jsxs)("div", {
                    className:
                      "flex min-w-0 items-center justify-between gap-2 px-2 pb-2",
                    children: [
                      (0, t.jsx)("div", {
                        className: "flex shrink-0 items-center gap-0.5",
                        children: (0, t.jsxs)(c.TooltipProvider, {
                          delayDuration: 150,
                          children: [
                            (0, t.jsxs)(c.Tooltip, {
                              children: [
                                (0, t.jsx)(c.TooltipTrigger, {
                                  asChild: !0,
                                  children: (0, t.jsx)("button", {
                                    type: "button",
                                    onClick: () => k.current?.click(),
                                    disabled:
                                      p || w || v.length >= d.MAX_CHAT_IMAGES,
                                    className:
                                      "inline-flex size-8 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2383e2]/40 active:scale-95 disabled:pointer-events-none disabled:opacity-40",
                                    "aria-label": "Thêm ảnh vào yêu cầu",
                                    children: (0, t.jsx)(a.ImagePlus, {
                                      "aria-hidden": !0,
                                      className: "size-4",
                                    }),
                                  }),
                                }),
                                (0, t.jsx)(c.TooltipContent, {
                                  side: "top",
                                  align: "start",
                                  children:
                                    v.length >= d.MAX_CHAT_IMAGES
                                      ? `Mỗi lượt chỉ gửi k\xe8m tối đa ${d.MAX_CHAT_IMAGES} ảnh`
                                      : "Thêm ảnh vào yêu cầu (hoặc dán Ctrl+V)",
                                }),
                              ],
                            }),
                            E
                              ? (0, t.jsxs)(o.DropdownMenu, {
                                  children: [
                                    (0, t.jsx)(o.DropdownMenuTrigger, {
                                      asChild: !0,
                                      children: (0, t.jsx)("button", {
                                        type: "button",
                                        disabled: p,
                                        className:
                                          "inline-flex size-8 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2383e2]/40 active:scale-95 disabled:pointer-events-none disabled:opacity-40",
                                        "aria-label": "Tài liệu",
                                        children: (0, t.jsx)(i.Paperclip, {
                                          "aria-hidden": !0,
                                          className: "size-4",
                                        }),
                                      }),
                                    }),
                                    (0, t.jsxs)(o.DropdownMenuContent, {
                                      side: "top",
                                      align: "start",
                                      className: "w-64",
                                      children: [
                                        (0, t.jsxs)(o.DropdownMenuItem, {
                                          onSelect: () => _.current?.click(),
                                          className: "items-start",
                                          children: [
                                            (0, t.jsx)(l.Upload, {
                                              "aria-hidden": !0,
                                              className: "mt-0.5",
                                            }),
                                            (0, t.jsxs)("span", {
                                              children: [
                                                "Tải tệp lên kho",
                                                (0, t.jsx)("span", {
                                                  className:
                                                    "block text-xs text-[#787774]",
                                                  children:
                                                    "Lưu vào kho và dùng làm nguồn cho đề này",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        (0, t.jsxs)(o.DropdownMenuItem, {
                                          onSelect: E.onOpenPicker,
                                          children: [
                                            (0, t.jsx)(r.FolderOpen, {
                                              "aria-hidden": !0,
                                            }),
                                            " Chọn từ kho tài liệu…",
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                })
                              : (0, t.jsxs)(c.Tooltip, {
                                  children: [
                                    (0, t.jsx)(c.TooltipTrigger, {
                                      asChild: !0,
                                      children: (0, t.jsx)("button", {
                                        type: "button",
                                        onClick: () => j.current?.click(),
                                        disabled:
                                          p ||
                                          w ||
                                          y.length >= u.MAX_CHAT_FILES,
                                        className:
                                          "inline-flex size-8 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2383e2]/40 active:scale-95 disabled:pointer-events-none disabled:opacity-40",
                                        "aria-label": "Thêm tệp vào yêu cầu",
                                        children: (0, t.jsx)(i.Paperclip, {
                                          "aria-hidden": !0,
                                          className: "size-4",
                                        }),
                                      }),
                                    }),
                                    (0, t.jsx)(c.TooltipContent, {
                                      side: "top",
                                      align: "start",
                                      className: "max-w-64",
                                      children:
                                        y.length >= u.MAX_CHAT_FILES
                                          ? `Mỗi lượt chỉ gửi k\xe8m tối đa ${u.MAX_CHAT_FILES} tệp`
                                          : `Đ\xednh k\xe8m ${u.CHAT_FILE_FORMATS}. Tối đa 10 MB/tệp (PDF 30 MB). Word chỉ đọc văn bản v\xe0 c\xf4ng thức, kh\xf4ng đọc ảnh trong tệp.`,
                                    }),
                                  ],
                                }),
                          ],
                        }),
                      }),
                      (0, t.jsxs)("div", {
                        className: "flex min-w-0 items-center gap-1.5",
                        children: [
                          (0, t.jsx)(O, { value: f, onChange: g, disabled: p }),
                          (0, t.jsx)("button", {
                            type: "button",
                            onClick: z,
                            disabled: !q,
                            className:
                              "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#37352f] text-white transition-colors hover:bg-[#1f1e1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2383e2]/40 focus-visible:ring-offset-2 active:scale-95 disabled:bg-[#f1f1ef] disabled:text-neutral-400",
                            title: "Gửi (Enter)",
                            "aria-label": "Gửi",
                            children: p
                              ? (0, t.jsx)("span", {
                                  "aria-hidden": !0,
                                  className: "flex items-end gap-[3px]",
                                  children: [0, 1, 2].map((e) =>
                                    (0, t.jsx)(
                                      "span",
                                      {
                                        className:
                                          "size-[5px] animate-bounce rounded-full bg-neutral-400",
                                        style: {
                                          animationDelay: `${120 * e}ms`,
                                        },
                                      },
                                      e,
                                    ),
                                  ),
                                })
                              : (0, t.jsx)(n.ArrowUp, {
                                  "aria-hidden": !0,
                                  className: "size-4",
                                }),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, t.jsx)("p", {
                className: "mt-2 text-center text-[11px] text-neutral-500",
                children:
                  "Trợ lý AI có thể mắc sai sót. Hãy kiểm tra kỹ nội dung nhé.",
              }),
            ],
          });
        },
      ],
      345901,
    );
  },
  653779,
  516306,
  747925,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(271645),
      r = e.i(689664),
      a = e.i(576248),
      i = e.i(632781),
      l = e.i(954808),
      s = n.createContext(null),
      o = n.createContext(null),
      c = n.createContext(null);
    function u(e) {
      let t = n.useContext(o);
      if (!t)
        throw Error(`${e} must be used within a Questionnaire.Root component.`);
      return t;
    }
    function d(e) {
      let t = n.useContext(s);
      if (!t)
        throw Error(
          `${e} must be used within a Questionnaire.Choice component.`,
        );
      return t;
    }
    function h(e) {
      let t = n.useContext(c);
      if (!t)
        throw Error(`${e} must be used within a Questionnaire.Item component.`);
      return t;
    }
    function m(e) {
      return Array.isArray(e)
        ? e.some((e) => String(e).trim().length > 0)
        : null != e && String(e).trim().length > 0;
    }
    function p(e) {
      return "letters" === e
        ? Array.from({ length: 26 }, (e, t) => String.fromCharCode(65 + t))
        : "numbers" === e
          ? Array.from({ length: 9 }, (e, t) => String(t + 1))
          : [];
    }
    function f(e, t) {
      return [e, t ? "Enter" : null].filter(Boolean).join(" ") || void 0;
    }
    function g(e) {
      return "choice" === e.type
        ? e.element.checked
        : e.element.hasAttribute("name") && m(e.element.value);
    }
    function x(e) {
      return (
        !!(
          e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement
        ) ||
        (e instanceof HTMLInputElement
          ? !["button", "checkbox", "radio", "reset", "submit"].includes(e.type)
          : e instanceof HTMLElement && e.isContentEditable)
      );
    }
    function b(e) {
      return e instanceof HTMLInputElement && "radio" === e.type;
    }
    function v(e, t) {
      if (e.element === t.element) return 0;
      let n = e.element.compareDocumentPosition(t.element);
      return n & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : n & Node.DOCUMENT_POSITION_PRECEDING
          ? 1
          : 0;
    }
    function y(e, t) {
      if (e.element === t.element) return 0;
      let n = e.element.compareDocumentPosition(t.element);
      return n & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : n & Node.DOCUMENT_POSITION_PRECEDING
          ? 1
          : 0;
    }
    function w(e, t) {
      if (!e) return t ?? null;
      let n = t ? e.itemByName.get(t) : void 0;
      return n && !n.disabled ? n.name : (e.enabledItems[0]?.name ?? null);
    }
    function k({
      children: e,
      disabled: t,
      onClick: n,
      props: r,
      render: a,
      shortcut: i,
      status: s,
      tabIndex: o,
      type: c,
      visible: u,
    }) {
      let d = u && !t ? (i ?? null) : null;
      return (0, l.a)({
        defaultTagName: "button",
        props: (0, l.b)(
          {
            "aria-hidden": !u || void 0,
            "aria-keyshortcuts": d ?? void 0,
            children: e,
            disabled: t,
            hidden: !u,
            inert: !u,
            onClick: n,
            tabIndex: u ? o : -1,
            type: c,
          },
          r,
        ),
        render: a,
        state: { disabled: t, shortcut: d, status: s, visible: u },
        stateAttributesMapping: {
          visible: (e) => ({
            "data-hidden": e ? void 0 : "",
            "data-visible": e ? "" : void 0,
          }),
        },
      });
    }
    var j = function ({
        defaultItem: e,
        item: r,
        items: a,
        noValidate: i = !0,
        onItemChange: s,
        onReset: c,
        onSubmit: u,
        ref: d,
        shortcuts: h,
        ...m
      }) {
        let {
            context: f,
            rootProps: y,
            state: k,
          } = (function ({
            defaultItem: e,
            item: t,
            items: r,
            noValidate: a,
            onItemChange: i,
            onReset: s,
            onSubmit: o,
            ref: c,
            shortcuts: u,
          }) {
            let d = n.useMemo(
                () =>
                  void 0 === r
                    ? null
                    : {
                        enabledItems: r.filter((e) => !e.disabled),
                        itemByName: new Map(r.map((e) => [e.name, e])),
                        items: r,
                      },
                [r],
              ),
              [h, m] = n.useState([]),
              [f, y] = n.useState(() => w(d, e)),
              [k, j] = n.useState(null),
              [C, N] = n.useState(0),
              S = n.useRef(null),
              M = void 0 !== t,
              R = M ? t : f,
              I = n.useRef(R),
              A = !1 === a,
              T = u ?? null;
            (n.useRef(new Set()),
              n.useLayoutEffect(() => {}, [d, e, h, k, T]),
              n.useLayoutEffect(() => {
                if (!k || typeof MutationObserver > "u") return;
                let e = new MutationObserver(() => {
                  N((e) => e + 1);
                });
                return (
                  e.observe(k, { childList: !0, subtree: !0 }),
                  () => e.disconnect()
                );
              }, [k]));
            let E = n.useMemo(
                () => h.filter((e) => !e.disabled).sort(v),
                [C, h],
              ),
              P = n.useMemo(() => new Map(E.map((e) => [e.name, e])), [E]),
              $ = d?.enabledItems ?? E,
              _ = $.findIndex((e) => e.name === R),
              q = _ < 0 || !R ? null : (P.get(R) ?? null),
              z = R ? d?.itemByName.get(R) : void 0,
              D = _ < 0 ? null : z ? !!z.required : (q?.required ?? !1),
              O = _ < 0 ? null : (q?.status ?? (R ? "unanswered" : null)),
              L = n.useMemo(
                () =>
                  d
                    ? d.enabledItems.flatMap((e) => {
                        let t = P.get(e.name);
                        return t ? [t] : [];
                      })
                    : E,
                [d, P, E],
              ),
              F = $.length,
              H = _ < 0 ? 0 : _ + 1,
              B = F > 0 && 0 === _,
              K = F > 0 && _ === F - 1,
              V = n.useCallback(
                (e, t = "item") => {
                  e !== R &&
                    ((S.current = { name: e, target: t }), M || y(e), i?.(e));
                },
                [R, M, i],
              );
            n.useLayoutEffect(() => {
              if (0 === F) return;
              if (_ < 0)
                return M || null !== R ? void V($[0].name) : void y($[0].name);
              let e = S.current,
                t = I.current !== R;
              if (((I.current = R), !e || e.name !== R)) {
                M && t && ((S.current = null), q?.focus());
                return;
              }
              ("invalid" === e.target ? q?.focusInvalid() : q?.focus(),
                (S.current = null));
            }, [q, R, M, _, $, V, F]);
            let U = n.useCallback(
                (e) => (
                  m((t) => [
                    ...t.filter(
                      (t) => t.element !== e.element && t.name !== e.name,
                    ),
                    e,
                  ]),
                  () => {
                    m((t) => t.filter((t) => t !== e));
                  }
                ),
                [],
              ),
              G = n.useCallback(() => {
                _ <= 0 || V($[_ - 1].name);
              }, [_, $, V]),
              X = n.useCallback(() => {
                if (!(!q || _ >= F - 1)) {
                  if (!q.validate()) return void q.focusInvalid();
                  V($[_ + 1].name);
                }
              }, [q, _, $, V, F]),
              Q = n.useCallback(() => {
                if (q) {
                  if (!q.validate()) return void q.focusInvalid();
                  if (K) return void k?.requestSubmit();
                  V($[_ + 1].name);
                }
              }, [q, _, K, $, k, V]),
              W = n.useCallback(() => {
                if (!(!q || q.required)) {
                  if ((q.skip(), !K)) return void V($[_ + 1].name);
                  queueMicrotask(() => {
                    k?.requestSubmit();
                  });
                }
              }, [q, _, K, $, k, V]),
              J = { current: H, first: B, last: K, total: F };
            return {
              context: n.useMemo(
                () => ({
                  ...J,
                  activeItem: q,
                  activeItemName: R,
                  activeItemRequired: D,
                  activeItemStatus: O,
                  domVersion: C,
                  goNext: X,
                  goPrevious: G,
                  itemDefinitionByName: d?.itemByName ?? null,
                  nativeValidation: A,
                  registerItem: U,
                  shortcuts: T,
                  skipCurrent: W,
                }),
                [q, R, D, O, d, H, C, B, X, G, K, A, U, T, W, F],
              ),
              rootProps: {
                "data-shortcuts": T ?? void 0,
                onKeyDown: function (e) {
                  var t;
                  let n;
                  if (
                    e.defaultPrevented ||
                    e.nativeEvent.isComposing ||
                    229 === e.keyCode ||
                    !q ||
                    !(e.target instanceof Element)
                  )
                    return;
                  if (
                    "Enter" === e.key &&
                    (e.metaKey || e.ctrlKey) &&
                    !e.altKey &&
                    !e.shiftKey
                  ) {
                    (e.preventDefault(), e.repeat || Q());
                    return;
                  }
                  if (e.metaKey || e.ctrlKey || e.altKey) return;
                  if (
                    ("ArrowUp" === e.key || "ArrowDown" === e.key) &&
                    q.moveAnswerFocus(
                      e.target,
                      "ArrowDown" === e.key ? "next" : "previous",
                    )
                  )
                    return void e.preventDefault();
                  if (
                    ("ArrowLeft" === e.key || "ArrowRight" === e.key) &&
                    !x(e.target) &&
                    !b(e.target)
                  ) {
                    if ((e.preventDefault(), e.repeat)) return;
                    "ArrowLeft" === e.key
                      ? G()
                      : "unanswered" !== q.status && X();
                    return;
                  }
                  if ("Enter" === e.key) {
                    let t = q.getAnswerByElement(e.target);
                    if (!t) return;
                    (e.preventDefault(), !e.repeat && g(t) && Q());
                    return;
                  }
                  if (!T || x(e.target)) return;
                  let r =
                      ((t = e.key),
                      (n = "letters" === T ? t.toUpperCase() : t),
                      p(T).includes(n) ? n : null),
                    a = r ? q.getAnswerByShortcut(r) : null;
                  a &&
                    (e.preventDefault(),
                    e.repeat ||
                      (a.element.focus(),
                      "choice" === a.type && a.element.click()));
                },
                onReset: function (t) {
                  if ((s?.(t), t.defaultPrevented)) return;
                  for (let e of h) e.reset();
                  let n = d
                    ? w(d, e)
                    : (E.find((t) => t.name === e)?.name ?? E[0]?.name);
                  n && V(n);
                },
                onSubmit: function (e) {
                  let t = L.find((e) => !e.validate());
                  if (t) {
                    (e.preventDefault(),
                      V(t.name, "invalid"),
                      t.name === R && (t.focusInvalid(), (S.current = null)));
                    return;
                  }
                  o?.(e);
                },
                ref: n.useCallback(
                  (e) => {
                    (j(e), (0, l.c)(c)?.(e));
                  },
                  [c],
                ),
              },
              state: J,
            };
          })({
            defaultItem: e,
            item: r,
            items: a,
            noValidate: i,
            onItemChange: s,
            onReset: c,
            onSubmit: u,
            ref: d,
            shortcuts: h,
          }),
          j = (0, l.a)({
            defaultTagName: "form",
            props: (0, l.b)({ ...y, noValidate: i }, m),
            state: k,
          });
        return (0, t.jsx)(o.Provider, { value: f, children: j });
      },
      C = function ({ children: e, render: t, ...n }) {
        let {
            current: r,
            first: a,
            last: i,
            total: s,
          } = u("Questionnaire.Progress"),
          o = s ? `Question ${r} of ${s}` : void 0;
        return (0, l.a)({
          defaultTagName: "div",
          props: (0, l.b)(
            {
              "aria-label": "Questionnaire progress",
              "aria-live": "polite",
              "aria-valuemax": s || void 0,
              "aria-valuemin": s ? 1 : void 0,
              "aria-valuenow": s ? r : void 0,
              "aria-valuetext": o,
              children: e ?? o,
              role: "progressbar",
            },
            n,
          ),
          render: t,
          state: { current: r, first: a, last: i, total: s },
        });
      },
      N = function ({
        "aria-describedby": e,
        "aria-keyshortcuts": r,
        children: a,
        disabled: i = !1,
        invalid: s = !1,
        multiple: o = !1,
        name: d,
        onStatusChange: h,
        ref: f,
        required: v = !1,
        ...w
      }) {
        let {
            context: k,
            itemProps: j,
            state: C,
          } = (function ({
            "aria-describedby": e,
            "aria-keyshortcuts": t,
            disabled: r = !1,
            invalid: a = !1,
            multiple: i = !1,
            name: s,
            onStatusChange: o,
            ref: c,
            required: d = !1,
          }) {
            let {
                activeItemName: h,
                domVersion: f,
                first: v,
                itemDefinitionByName: w,
                last: k,
                nativeValidation: j,
                registerItem: C,
                shortcuts: N,
              } = u("Questionnaire.Item"),
              [S, M] = n.useState(null),
              [R, I] = n.useState([]),
              [A, T] = n.useState(!1),
              [E, P] = n.useState([]),
              [$, _] = n.useState(!1),
              [q, z] = n.useState(0),
              [D, O] = n.useState([]),
              [L, F] = n.useState([]),
              H = n.useRef([]),
              B = n.useRef(i),
              K = n.useRef(i);
            B.current = i;
            let V = !r && h === s,
              U = n.useMemo(() => [...R].sort(y), [R, f]),
              G = n.useMemo(() => U.filter((e) => !e.disabled), [U]),
              X = G.some((e) => E.includes(e.id)),
              Q = $ ? "skipped" : X ? "answered" : "unanswered",
              W = "skipped" === Q && !d,
              J = r || W || (!a && "answered" === Q),
              Y = !r && !W && (a || (A && !J)),
              Z = G.some((e) => "input" === e.type),
              ee = n.useRef(Q),
              et = w?.get(s),
              en = n.useMemo(
                () =>
                  w
                    ? (function (e, t) {
                        let n = new Map();
                        if (!e || !t) return n;
                        let r = p(t),
                          a = 0;
                        for (let t of e.choices ?? []) {
                          if (t.disabled) continue;
                          let e = r[a];
                          if (!e) break;
                          (n.set(t.value, e), (a += 1));
                        }
                        return n;
                      })(et, N)
                    : null,
                [et, w, N],
              ),
              er = n.useMemo(() => {
                if (en) return new Map();
                let e = p(N);
                return new Map(
                  G.filter((e) => "choice" === e.type)
                    .slice(0, e.length)
                    .map((t, n) => [t.id, e[n]]),
                );
              }, [G, en, N]),
              ea = n.useCallback(
                (e) => (
                  I((t) => [
                    ...t.filter(
                      (t) => t.element !== e.element && t.id !== e.id,
                    ),
                    e,
                  ]),
                  () => {
                    I((t) => t.filter((t) => t !== e));
                  }
                ),
                [],
              );
            n.useLayoutEffect(() => {
              ee.current !== Q && ((ee.current = Q), o?.(Q));
            }, [o, Q]);
            let ei = n.useCallback(
                (e, t) => {
                  P((n) =>
                    t
                      ? i
                        ? n.includes(e)
                          ? n
                          : [...n, e]
                        : [e]
                      : n.filter((t) => t !== e),
                  );
                },
                [i],
              ),
              el = n.useCallback(
                (e, t) => {
                  (_(!1), ei(e, t));
                },
                [ei],
              ),
              es = n.useCallback(
                (e, t) => {
                  (t && _(!1), ei(e, t));
                },
                [ei],
              ),
              eo = n.useCallback(
                (e, t) => (
                  t &&
                    ((H.current = [...H.current.filter((t) => t !== e), e]),
                    P((t) =>
                      B.current
                        ? t.includes(e)
                          ? t
                          : [...t, e]
                        : t.length
                          ? t
                          : [e],
                    )),
                  () => {
                    ((H.current = H.current.filter((t) => t !== e)),
                      P((t) => t.filter((t) => t !== e)));
                  }
                ),
                [],
              ),
              ec = n.useCallback((e, t) => {
                if (t) {
                  H.current = H.current.includes(e)
                    ? H.current
                    : [...H.current, e];
                  return;
                }
                H.current = H.current.filter((t) => t !== e);
              }, []),
              eu = n.useCallback(
                (e) => (
                  O((t) => (t.includes(e) ? t : [...t, e])),
                  () => {
                    O((t) => t.filter((t) => t !== e));
                  }
                ),
                [],
              ),
              ed = n.useCallback(
                (e) => (
                  F((t) => (t.includes(e) ? t : [...t, e])),
                  () => {
                    F((t) => t.filter((t) => t !== e));
                  }
                ),
                [],
              ),
              eh = n.useCallback(() => {
                if ((T(!0), !J)) return !1;
                if (!j) return !0;
                let e = G.find(
                  (e) =>
                    g(e) && e.element.willValidate && !e.element.validity.valid,
                );
                return (
                  !e || (e.element.focus(), e.element.reportValidity(), !1)
                );
              }, [G, j, J]),
              em = n.useCallback(() => {
                S?.focus();
              }, [S]),
              ep = n.useCallback(() => {
                let e = S?.querySelector(
                    "input[data-filled][name]:not(:disabled)",
                  ),
                  t = S?.querySelector(
                    "input:not([type=hidden]):not(:disabled), textarea:not(:disabled)",
                  );
                (e ?? t ?? S)?.focus();
              }, [S]),
              ef = n.useCallback(() => {
                (T(!1),
                  _(!1),
                  P(i ? [...H.current] : H.current.slice(0, 1)),
                  z((e) => e + 1));
              }, [i]),
              eg = n.useCallback(() => {
                d || (P([]), _(!0));
              }, [d]);
            n.useLayoutEffect(() => {
              let e = K.current;
              ((K.current = i),
                !e ||
                  i ||
                  P((e) => {
                    let t = G.find((t) => e.includes(t.id));
                    return t ? [t.id] : [];
                  }));
            }, [G, i]);
            let ex = n.useCallback(
                (e) => G.find((t) => t.element === e) ?? null,
                [G],
              ),
              eb = n.useCallback(
                (e) => {
                  if (en) {
                    let t = Array.from(en.entries()).find(
                      ([, t]) => t === e,
                    )?.[0];
                    return (
                      G.find((e) => "choice" === e.type && e.value === t) ??
                      null
                    );
                  }
                  let t = Array.from(er.entries()).find(
                    ([, t]) => t === e,
                  )?.[0];
                  return G.find((e) => e.id === t) ?? null;
                },
                [G, er, en],
              ),
              ev = n.useCallback(
                (e, t) => {
                  let n = G.findIndex((t) => t.element === e),
                    r = n < 0 ? null : (G[n] ?? null);
                  if (
                    !G.length ||
                    (x(e) &&
                      (!(
                        r?.type === "input" &&
                        [
                          "email",
                          "password",
                          "search",
                          "tel",
                          "text",
                          "url",
                        ].includes(r.element.type)
                      ) ||
                        m(r.element.value))) ||
                    (n < 0 && e !== S)
                  )
                    return !1;
                  let a =
                    n < 0
                      ? (G.find(g) ?? ("next" === t ? G[0] : G[G.length - 1]))
                      : G[(n + ("next" === t ? 1 : -1) + G.length) % G.length];
                  return (
                    !(
                      !a ||
                      a.element === e ||
                      (n >= 0 && b(e) && b(a.element))
                    ) &&
                    (a.element.focus(),
                    "choice" === a.type && b(a.element) && a.element.click(),
                    !0)
                  );
                },
                [G, S],
              );
            n.useLayoutEffect(() => {
              if (S)
                return C({
                  choices: U.flatMap((e) =>
                    "choice" === e.type
                      ? [{ disabled: e.ownDisabled, value: e.value }]
                      : [],
                  ),
                  disabled: r,
                  element: S,
                  focus: em,
                  focusInvalid: ep,
                  getAnswerByElement: ex,
                  getAnswerByShortcut: eb,
                  moveAnswerFocus: ev,
                  name: s,
                  required: d,
                  reset: ef,
                  skip: eg,
                  status: Q,
                  validate: eh,
                });
            }, [U, r, S, em, ep, ex, eb, ev, s, C, d, ef, eg, Q, eh]);
            let ey = n.useMemo(
                () => ({
                  active: V,
                  disabled: r,
                  hasInputAnswer: Z,
                  invalid: Y,
                  multiple: i,
                  name: s,
                  registerAnswerControl: ea,
                  registerAnswerSelection: eo,
                  registerDescription: eu,
                  registerError: ed,
                  required: d,
                  resetVersion: q,
                  selectedAnswerIds: E,
                  setAnswerDefault: ec,
                  setAnswerSelectionFromInteraction: el,
                  shortcutByAnswerId: er,
                  shortcutByChoiceValue: en,
                  shortcuts: N,
                  status: Q,
                  syncControlledAnswerSelection: es,
                }),
                [
                  V,
                  r,
                  Z,
                  Y,
                  i,
                  s,
                  ea,
                  eo,
                  eu,
                  ed,
                  d,
                  q,
                  E,
                  ec,
                  el,
                  er,
                  en,
                  N,
                  Q,
                  es,
                ],
              ),
              ew = n.useCallback(
                (e) => {
                  (M(e), (0, l.c)(c)?.(e));
                },
                [c],
              );
            return {
              context: ey,
              itemProps: {
                "aria-describedby":
                  [...D, ...(Y ? L : []), e].filter(Boolean).join(" ") ||
                  void 0,
                "aria-invalid": Y || void 0,
                "aria-keyshortcuts":
                  [
                    t,
                    V ? "Meta+Enter Control+Enter" : void 0,
                    V && G.length ? "ArrowUp ArrowDown" : void 0,
                    V && !v ? "ArrowLeft" : void 0,
                    V && !k && "unanswered" !== Q ? "ArrowRight" : void 0,
                  ]
                    .filter(Boolean)
                    .join(" ") || void 0,
                disabled: r,
                hidden: !V,
                inert: !V,
                ref: ew,
                tabIndex: -1,
              },
              state: {
                active: V,
                disabled: r,
                invalid: Y,
                multiple: i,
                required: d,
                status: Q,
              },
            };
          })({
            "aria-describedby": e,
            "aria-keyshortcuts": r,
            disabled: i,
            invalid: s,
            multiple: o,
            name: d,
            onStatusChange: h,
            ref: f,
            required: v,
          }),
          N = (0, l.a)({
            defaultTagName: "fieldset",
            props: (0, l.b)({ ...j, children: a }, w),
            state: C,
            stateAttributesMapping: {
              active: (e) => ({ "data-active": e ? "" : void 0 }),
            },
          });
        return (0, t.jsx)(c.Provider, { value: k, children: N });
      },
      S = function ({ render: e, ...t }) {
        return (
          h("Questionnaire.Title"),
          (0, l.a)({ defaultTagName: "legend", props: t, render: e })
        );
      },
      M = function ({ render: e, ...t }) {
        let { shortcuts: n } = h("Questionnaire.Choices");
        return (0, l.a)({
          defaultTagName: "div",
          props: t,
          render: e,
          state: { shortcuts: n },
        });
      },
      R = function ({
        checked: e,
        children: r,
        defaultChecked: a = !1,
        disabled: i = !1,
        onChange: o,
        render: c,
        value: u,
        ...d
      }) {
        let { inputProps: m, state: p } = (function ({
            checked: e,
            defaultChecked: t = !1,
            disabled: r = !1,
            onChange: a,
            value: i,
          }) {
            let {
                disabled: l,
                hasInputAnswer: s,
                invalid: o,
                multiple: c,
                name: u,
                registerAnswerControl: d,
                registerAnswerSelection: m,
                required: p,
                resetVersion: g,
                selectedAnswerIds: x,
                setAnswerDefault: b,
                setAnswerSelectionFromInteraction: v,
                shortcutByAnswerId: y,
                shortcutByChoiceValue: w,
                status: k,
                syncControlledAnswerSelection: j,
              } = h("Questionnaire.Choice"),
              C = n.useId(),
              [N, S] = n.useState(null),
              M = n.useRef(t),
              R = void 0 !== e,
              I = l || r,
              A = x.includes(C),
              T = R ? "skipped" !== k && e : A,
              E = c ? "checkbox" : "radio",
              P = w?.get(i) ?? y.get(C) ?? null;
            return (
              n.useLayoutEffect(() => m(C, M.current), [C, m]),
              n.useLayoutEffect(() => b(C, t), [C, t, b]),
              n.useLayoutEffect(() => {
                if (N)
                  return d({
                    disabled: I,
                    element: N,
                    id: C,
                    ownDisabled: r,
                    type: "choice",
                    value: i,
                  });
              }, [C, r, I, N, d, i]),
              n.useLayoutEffect(() => {
                R && j(C, e);
              }, [C, R, e, g, j]),
              n.useLayoutEffect(() => {
                N && ((N.defaultChecked = R ? e : t), g > 0 && (N.checked = T));
              }, [T, R, e, t, N, g]),
              {
                inputProps: {
                  ref: S,
                  "aria-invalid": o || void 0,
                  "aria-keyshortcuts": f(P, !I && T),
                  checked: T,
                  disabled: I,
                  id: C,
                  name: "skipped" === k ? void 0 : u,
                  onChange: function (t) {
                    if ((a?.(t), !t.defaultPrevented)) {
                      if (!R) return void v(C, t.target.checked);
                      "skipped" === k && e === t.target.checked && v(C, e);
                    }
                  },
                  required: p && !c && !s,
                  type: E,
                  value: i,
                },
                state: {
                  checked: T,
                  disabled: I,
                  invalid: o,
                  shortcut: P,
                  type: E,
                },
              }
            );
          })({
            checked: e,
            defaultChecked: a,
            disabled: i,
            onChange: o,
            value: u,
          }),
          g = (0, l.a)({
            defaultTagName: "label",
            props: (0, l.b)({ children: r }, d),
            render: c,
            state: p,
            stateAttributesMapping: {
              checked: (e) => ({
                "data-checked": e ? "" : void 0,
                "data-unchecked": e ? void 0 : "",
              }),
            },
          });
        return (0, t.jsx)(s.Provider, {
          value: { inputProps: m, state: p },
          children: g,
        });
      },
      I = function ({ render: e, ...t }) {
        let { inputProps: n, state: r } = d("Questionnaire.ChoiceInput");
        return (0, l.a)({
          defaultTagName: "input",
          props: (0, l.b)(n, t),
          render: e,
          state: r,
          stateAttributesMapping: {
            checked: (e) => ({
              "data-checked": e ? "" : void 0,
              "data-unchecked": e ? void 0 : "",
            }),
          },
        });
      },
      A = function ({ render: e, ...t }) {
        return (
          d("Questionnaire.ChoiceLabel"),
          (0, l.a)({ defaultTagName: "span", props: t, render: e })
        );
      },
      T = function ({ children: e, render: t, ...n }) {
        let { state: r } = d("Questionnaire.ChoiceShortcut"),
          a = { shortcut: r.shortcut };
        return (0, l.a)({
          defaultTagName: "span",
          props: (0, l.b)(
            {
              "aria-hidden": !0,
              children: e ?? r.shortcut,
              hidden: null === r.shortcut,
            },
            n,
          ),
          render: t,
          state: a,
        });
      },
      E = function ({
        defaultValue: e,
        disabled: t = !1,
        onChange: r,
        ref: a,
        render: i,
        type: s = "text",
        value: o,
        ...c
      }) {
        let { inputProps: u, state: d } = (function ({
          defaultValue: e,
          disabled: t = !1,
          onChange: r,
          ref: a,
          type: i = "text",
          value: s,
        }) {
          let {
              disabled: o,
              invalid: c,
              name: u,
              registerAnswerControl: d,
              registerAnswerSelection: p,
              resetVersion: g,
              selectedAnswerIds: x,
              setAnswerDefault: b,
              setAnswerSelectionFromInteraction: v,
              syncControlledAnswerSelection: y,
            } = h("Questionnaire.Input"),
            w = n.useId(),
            k = n.useRef(null),
            j = n.useRef(m(e)),
            C = void 0 !== s,
            N = m(e),
            S = m(s),
            [M, R] = n.useState(N),
            I = o || t,
            A = C ? S : M,
            T = x.includes(w);
          (n.useLayoutEffect(() => p(w, j.current), [w, p]),
            n.useLayoutEffect(() => b(w, N), [N, w, b]),
            n.useLayoutEffect(() => {
              let e = k.current;
              if (e)
                return d({ disabled: I, element: e, id: w, type: "input" });
            }, [I, w, d]),
            n.useLayoutEffect(() => {
              C ? y(w, S) : g > 0 && R(N);
            }, [C, S, s, N, w, g, y]),
            n.useLayoutEffect(() => {
              let e = k.current;
              e && C && (e.defaultValue = String(s));
            }, [C, s]));
          let E = n.useCallback(
            (e) => {
              ((k.current = e), (0, l.c)(a)?.(e));
            },
            [a],
          );
          return {
            inputProps: {
              "aria-invalid": c || void 0,
              "aria-keyshortcuts": f(null, !I && A && T),
              defaultValue: C ? void 0 : e,
              disabled: I,
              form: T ? void 0 : "",
              id: w,
              name: T ? u : void 0,
              onChange: function (e) {
                if ((r?.(e), e.defaultPrevented)) return;
                let t = e.target.value.trim().length > 0;
                C || (R(t), v(w, t));
              },
              ref: E,
              type: i,
              value: C ? s : void 0,
            },
            state: { disabled: I, filled: A, invalid: c },
          };
        })({
          defaultValue: e,
          disabled: t,
          onChange: r,
          ref: a,
          type: s,
          value: o,
        });
        return (0, l.a)({
          defaultTagName: "input",
          props: (0, l.b)(u, c),
          render: i,
          state: d,
          stateAttributesMapping: {
            filled: (e) => ({
              "data-empty": e ? void 0 : "",
              "data-filled": e ? "" : void 0,
            }),
          },
        });
      },
      P = function ({ children: e, id: t, render: r, ...a }) {
        let {
            invalid: i,
            registerError: s,
            required: o,
          } = h("Questionnaire.Error"),
          c = n.useId(),
          u = t ?? c;
        return (
          n.useLayoutEffect(() => s(u), [u, s]),
          (0, l.a)({
            defaultTagName: "p",
            props: (0, l.b)(
              {
                children:
                  e ??
                  (o
                    ? "Choose an answer to continue."
                    : "Choose an answer or skip this question."),
                hidden: !i,
                id: u,
                role: i ? "alert" : void 0,
              },
              a,
            ),
            render: r,
            state: { invalid: i },
          })
        );
      },
      $ = function ({
        children: e,
        disabled: t = !1,
        onClick: n,
        render: r,
        tabIndex: a,
        type: i = "button",
        ...l
      }) {
        let s = u("Questionnaire.Previous"),
          o = s.total > 1 && !s.first;
        return k({
          children: e ?? "Previous",
          disabled: t,
          onClick: function (e) {
            (n?.(e), e.defaultPrevented || s.goPrevious());
          },
          props: l,
          render: r,
          status: s.activeItemStatus,
          tabIndex: a,
          type: i,
          visible: o,
        });
      },
      _ = function ({
        children: e,
        disabled: t = !1,
        onClick: n,
        render: r,
        tabIndex: a,
        type: i = "button",
        ...l
      }) {
        let s = u("Questionnaire.Next"),
          o = s.total > 1 && !s.last;
        return k({
          children: e ?? "Next",
          disabled: t,
          onClick: function (e) {
            (n?.(e), e.defaultPrevented || s.goNext());
          },
          props: l,
          render: r,
          shortcut: "Enter",
          status: s.activeItemStatus,
          tabIndex: a,
          type: i,
          visible: o,
        });
      },
      q = function ({
        children: e,
        disabled: t = !1,
        render: n,
        tabIndex: r,
        type: a = "submit",
        ...i
      }) {
        let l = u("Questionnaire.Submit"),
          s = l.total > 0 && l.last;
        return k({
          children: e ?? "Submit",
          disabled: t,
          props: i,
          render: n,
          shortcut: "Enter",
          status: l.activeItemStatus,
          tabIndex: r,
          type: a,
          visible: s,
        });
      },
      z = e.i(647163),
      D = e.i(167881);
    function O({ className: e, ...n }) {
      return (0, t.jsx)(j, {
        "data-slot": "questionnaire",
        className: (0, z.cn)("flex w-full min-w-0 flex-col gap-3.5", e),
        ...n,
      });
    }
    function L({ className: e, ...n }) {
      return (0, t.jsx)(C, {
        "data-slot": "questionnaire-progress",
        className: (0, z.cn)(
          "min-h-[1lh] w-fit min-w-[8ch] text-[11px] font-medium text-neutral-500 tabular-nums",
          e,
        ),
        ...n,
      });
    }
    function F({ className: e, ...n }) {
      return (0, t.jsx)(N, {
        "data-slot": "questionnaire-item",
        className: (0, z.cn)(
          "flex min-w-0 flex-col gap-2.5 border-0 p-0 outline-none data-[hidden]:hidden",
          e,
        ),
        ...n,
      });
    }
    function H({ className: e, ...n }) {
      return (0, t.jsx)(S, {
        "data-slot": "questionnaire-title",
        className: (0, z.cn)(
          "text-xs font-semibold leading-snug text-neutral-900",
          e,
        ),
        ...n,
      });
    }
    function B({ className: e, ...n }) {
      return (0, t.jsx)(M, {
        "data-slot": "questionnaire-choices",
        className: (0, z.cn)(
          "group/questionnaire-choices grid min-w-0 gap-1.5",
          e,
        ),
        ...n,
      });
    }
    function K({ children: e, className: n, ...a }) {
      return (0, t.jsxs)(R, {
        "data-slot": "questionnaire-choice",
        className: (0, z.cn)(
          "group/questionnaire-choice relative flex min-h-10 cursor-pointer items-start gap-2.5 rounded-lg border border-neutral-200/90 bg-white px-3 py-2 text-start text-xs transition-colors outline-none select-none hover:bg-neutral-50/80 has-[>input:focus-visible]:border-[#2383e2] has-[>input:focus-visible]:ring-2 has-[>input:focus-visible]:ring-[#2383e2]/20 data-invalid:border-rose-500 group-has-[[data-slot=questionnaire-input][data-filled]]/questionnaire-choices:data-invalid:border-neutral-200/90 data-checked:border-[#2383e2] data-checked:bg-[#f7f6f3]/60",
          "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
          n,
        ),
        ...a,
        children: [
          (0, t.jsx)(I, {
            "data-slot": "questionnaire-choice-input",
            className:
              "absolute inset-0 z-10 size-full cursor-pointer opacity-0",
          }),
          (0, t.jsxs)("span", {
            "aria-hidden": "true",
            "data-slot": "questionnaire-choice-indicator",
            className:
              "pointer-events-none relative flex size-4 shrink-0 translate-y-0.5 items-center justify-center rounded-[4px] border border-neutral-300 bg-white group-data-[type=radio]/questionnaire-choice:rounded-full group-data-checked/questionnaire-choice:border-[#2383e2] group-data-checked/questionnaire-choice:bg-[#37352f] group-data-checked/questionnaire-choice:text-white",
            children: [
              (0, t.jsx)("span", {
                "data-slot": "questionnaire-choice-indicator-dot",
                className:
                  "hidden size-1.5 rounded-full bg-white group-data-[type=checkbox]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block",
              }),
              (0, t.jsx)(r.Check, {
                "data-slot": "questionnaire-choice-indicator-check",
                className:
                  "hidden size-3 text-white group-data-[type=radio]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block",
              }),
            ],
          }),
          (0, t.jsx)(A, {
            "data-slot": "questionnaire-choice-label",
            className: "flex min-w-0 flex-1 flex-col gap-0.5 leading-snug",
            children: e,
          }),
          (0, t.jsx)(T, {
            "data-slot": "questionnaire-choice-shortcut",
            className:
              "pointer-events-none ms-auto hidden size-5 shrink-0 translate-y-0.5 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 font-mono text-[0.625rem] leading-none font-medium text-neutral-500 group-data-[shortcut]/questionnaire-choice:inline-flex",
          }),
        ],
      });
    }
    function V({ className: e, ...n }) {
      return (0, t.jsx)("span", {
        "data-slot": "questionnaire-choice-description",
        className: (0, z.cn)("text-[11px] leading-relaxed text-neutral-500", e),
        ...n,
      });
    }
    function U({ className: e, ...n }) {
      return (0, t.jsx)("div", {
        "data-slot": "questionnaire-input-wrapper",
        className: "group/questionnaire-input relative w-full min-w-0 pt-0.5",
        children: (0, t.jsx)(E, {
          "data-slot": "questionnaire-input",
          className: (0, z.cn)(
            "h-9 min-h-9 w-full min-w-0 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-800 transition-all outline-none focus-visible:border-[#2383e2] focus-visible:ring-2 focus-visible:ring-[#2383e2]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-rose-500 placeholder:text-neutral-400 data-filled:border-[#2383e2] data-filled:bg-[#f7f6f3]/30",
            e,
          ),
          ...n,
        }),
      });
    }
    function G({ className: e, ...n }) {
      return (0, t.jsx)(P, {
        "data-slot": "questionnaire-error",
        className: (0, z.cn)(
          "mt-1 text-xs text-rose-600 group-has-[[data-slot=questionnaire-input][data-filled]]:hidden",
          e,
        ),
        ...n,
      });
    }
    function X({ className: e, ...n }) {
      return (0, t.jsx)("div", {
        "data-slot": "questionnaire-actions",
        className: (0, z.cn)(
          "flex w-full items-center justify-between gap-2 border-t border-neutral-100 pt-2.5",
          e,
        ),
        ...n,
      });
    }
    function Q({
      children: e,
      className: n,
      size: r = "sm",
      variant: a = "outline",
      ...i
    }) {
      return (0, t.jsx)($, {
        "data-slot": "questionnaire-previous",
        "data-size": r,
        "data-variant": a,
        className: (0, z.cn)(
          (0, D.buttonVariants)({ size: r, variant: a }),
          "cursor-pointer text-xs text-neutral-600 hover:text-neutral-800 disabled:pointer-events-none disabled:opacity-50 data-[hidden]:hidden data-[visible]:inline-flex",
          n,
        ),
        ...i,
        children: e ?? "Quay lại",
      });
    }
    function W({
      children: e,
      className: n,
      size: r = "sm",
      variant: a = "default",
      ...i
    }) {
      return (0, t.jsx)(_, {
        "data-slot": "questionnaire-next",
        "data-size": r,
        "data-variant": a,
        className: (0, z.cn)(
          (0, D.buttonVariants)({ size: r, variant: a }),
          "cursor-pointer bg-[#37352f] text-xs text-white hover:bg-[#1f1e1b] disabled:pointer-events-none disabled:opacity-50 data-[hidden]:hidden data-[visible]:inline-flex",
          n,
        ),
        ...i,
        children: e ?? "Tiếp theo",
      });
    }
    function J({
      children: e,
      className: n,
      size: r = "sm",
      variant: a = "default",
      ...i
    }) {
      return (0, t.jsx)(q, {
        "data-slot": "questionnaire-submit",
        "data-size": r,
        "data-variant": a,
        className: (0, z.cn)(
          (0, D.buttonVariants)({ size: r, variant: a }),
          "cursor-pointer bg-[#37352f] text-xs text-white shadow-xs hover:bg-[#1f1e1b] disabled:pointer-events-none disabled:opacity-50 data-[hidden]:hidden data-[visible]:inline-flex",
          n,
        ),
        ...i,
        children: e ?? "Gửi câu trả lời",
      });
    }
    function Y(e) {
      if (e.followUp?.label) return e.followUp;
      if (!/\s+cụ thể$/i.test(e.label) || /^không\s+/i.test(e.label))
        return null;
      let t = e.label
        .replace(/\s+cụ thể$/i, "")
        .replace(/^(?:chọn|theo|dùng|sử dụng)(?: một)?\s+/i, "")
        .replace(/^một\s+/i, "")
        .trim();
      return t
        ? {
            label: t[0].toUpperCase() + t.slice(1),
            placeholder: `Ghi r\xf5 ${t.toLowerCase()} bạn muốn`,
          }
        : null;
    }
    e.s(
      [
        "ClarificationWizard",
        0,
        function ({
          clarifications: e,
          disabled: l = !1,
          answered: s = !1,
          onSubmit: o,
        }) {
          let [c, u] = n.useState({}),
            [d, h] = n.useState({}),
            [m, p] = n.useState({}),
            [f, g] = n.useState({}),
            [x, b] = n.useState(""),
            v = n.useMemo(
              () =>
                (e || []).map((e) => ({
                  name: e.id,
                  required: !1,
                  choices: e.options.map((e) => ({ value: e.label })),
                })),
              [e],
            );
          if (!e || 0 === e.length) return null;
          if (1 === e.length && "confirm" === e[0].kind) {
            let n = e[0],
              r = (e) => {
                l ||
                  s ||
                  c[n.id] ||
                  (u({ [n.id]: e }),
                  o(
                    [
                      {
                        id: n.id,
                        question: n.question,
                        proposal: n.proposal,
                        kind: "confirm",
                        answer: e,
                      },
                    ],
                    e,
                  ));
              },
              a = c[n.id];
            return (0, t.jsxs)("div", {
              className: "space-y-2 text-sm",
              children: [
                (0, t.jsx)("p", { children: n.proposal }),
                s || a
                  ? (0, t.jsx)("p", {
                      className: "text-xs text-neutral-500",
                      children: a || "Đã trả lời",
                    })
                  : (0, t.jsxs)(t.Fragment, {
                      children: [
                        (0, t.jsx)("p", { children: n.question }),
                        (0, t.jsxs)("div", {
                          className: "flex gap-2",
                          children: [
                            (0, t.jsx)("button", {
                              type: "button",
                              disabled: l,
                              onClick: () => r("Đồng ý"),
                              className:
                                "rounded-lg bg-[#37352f] px-4 py-1.5 text-white disabled:opacity-50",
                              children: "Có",
                            }),
                            (0, t.jsx)("button", {
                              type: "button",
                              disabled: l,
                              onClick: () => r("Không đồng ý"),
                              className:
                                "rounded-lg border border-neutral-300 px-4 py-1.5 disabled:opacity-50",
                              children: "Không",
                            }),
                          ],
                        }),
                      ],
                    }),
              ],
            });
          }
          return (0, t.jsx)("div", {
            className:
              "mt-3 rounded-xl border border-[#a8cff0]/80 bg-white p-3.5 shadow-xs transition-all",
            children: s
              ? (0, t.jsxs)("div", {
                  className: "space-y-2 py-1",
                  children: [
                    (0, t.jsxs)("div", {
                      className:
                        "flex items-center gap-2 rounded-lg bg-[#f7f6f3] border border-[#a8cff0]/60 px-3 py-2 text-xs font-medium text-[#0b6bcb]",
                      children: [
                        (0, t.jsx)(r.Check, {
                          className: "size-4 shrink-0 text-[#2383e2]",
                        }),
                        (0, t.jsx)("span", {
                          children: e.some((e) => "confirm" === e.kind)
                            ? "Đã gửi xác nhận kế hoạch."
                            : "Đã gửi lựa chọn.",
                        }),
                      ],
                    }),
                    (0, t.jsx)("div", {
                      className: "space-y-1.5 pt-1",
                      children: e.map((n, r) => {
                        let a = c[n.id];
                        return (0, t.jsxs)(
                          "div",
                          {
                            className:
                              "text-[11px] leading-relaxed text-neutral-600",
                            children: [
                              (0, t.jsxs)("span", {
                                className: "font-medium text-neutral-700",
                                children: [
                                  e.length > 1 ? `${r + 1}. ` : "",
                                  n.question,
                                  ":",
                                ],
                              }),
                              " ",
                              (0, t.jsx)("span", {
                                className: "font-medium text-[#0b6bcb]",
                                children: a || "Đã gửi",
                              }),
                            ],
                          },
                          n.id,
                        );
                      }),
                    }),
                  ],
                })
              : (0, t.jsxs)(O, {
                  items: v,
                  shortcuts: "letters",
                  onSubmit: (t) => {
                    if ((t.preventDefault(), l || s)) return;
                    let n = new FormData(t.currentTarget),
                      r = {};
                    for (let t of e) {
                      let e = n
                          .getAll(t.id)
                          .map(String)
                          .map((e) => e.trim())
                          .filter((e) => t.options.some((t) => t.label === e)),
                        a = (d[t.id] || "").trim();
                      if ("confirm" === t.kind) {
                        let n = e[0] || f[t.id]?.[0];
                        if ("Đồng ý" !== n && "Không đồng ý" !== n)
                          return void b(
                            `Vui l\xf2ng x\xe1c nhận: ${t.question}`,
                          );
                        r[t.id] = n;
                        continue;
                      }
                      let i = f[t.id] ?? e;
                      if (0 === i.length && !a)
                        return void b(
                          `Vui l\xf2ng chọn hoặc nhập \xfd kiến: ${t.question}`,
                        );
                      let l = [];
                      for (let e of i) {
                        let n = t.options.find((t) => t.label === e),
                          r = n && Y(n);
                        if (r) {
                          let n = (m[t.id]?.[e] || "").trim();
                          if (!n)
                            return void b(
                              `Vui l\xf2ng nhập ${r.label.toLowerCase()} cho lựa chọn “${e}”.`,
                            );
                          l.push(`${e} — ${r.label}: ${n}`);
                        } else l.push(e);
                      }
                      (a && l.push(`\xdd kiến kh\xe1c: ${a}`),
                        (r[t.id] = l.join("; ")));
                    }
                    (b(""),
                      u(r),
                      o(
                        e.map((e) => ({
                          id: e.id,
                          question: e.question,
                          answer: r[e.id] || "",
                          kind: e.kind || "choice",
                          proposal: e.proposal,
                        })),
                        e
                          .map(
                            (e, t) =>
                              `${t + 1}. ${e.question}: ${r[e.id] || ""}`,
                          )
                          .join("\n"),
                      ));
                  },
                  children: [
                    (0, t.jsxs)("div", {
                      className:
                        "mb-3 flex items-center justify-between border-b border-neutral-100 pb-2.5",
                      children: [
                        (0, t.jsxs)("div", {
                          className:
                            "flex items-center gap-1.5 text-xs font-medium text-[#0b6bcb]",
                          children: [
                            (0, t.jsx)(a.HelpCircle, {
                              className: "size-4 text-[#2383e2]",
                            }),
                            (0, t.jsx)("span", {
                              children: e.some((e) => "confirm" === e.kind)
                                ? "Duyệt kế hoạch tạo đề"
                                : "Thông tin cần làm rõ",
                            }),
                          ],
                        }),
                        e.length > 1 &&
                          (0, t.jsx)(L, {
                            render: (e, n) =>
                              (0, t.jsxs)("div", {
                                ...e,
                                className: "flex items-center gap-2",
                                children: [
                                  (0, t.jsxs)("span", {
                                    className:
                                      "text-[11px] font-medium text-neutral-500 tabular-nums",
                                    children: [
                                      "Câu ",
                                      n.current,
                                      " / ",
                                      n.total,
                                    ],
                                  }),
                                  (0, t.jsx)("div", {
                                    className: "flex items-center gap-1",
                                    children: Array.from({
                                      length: n.total,
                                    }).map((e, r) =>
                                      (0, t.jsx)(
                                        "span",
                                        {
                                          className: `h-1.5 rounded-full transition-all ${r + 1 === n.current ? "w-3.5 bg-[#2383e2]" : r + 1 < n.current ? "w-1.5 bg-[#7cacf8]" : "w-1.5 bg-neutral-200"}`,
                                        },
                                        r,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                          }),
                      ],
                    }),
                    e.map((e) => {
                      let n = (d[e.id] || "").trim(),
                        r = f[e.id] || [],
                        a = "confirm" === e.kind,
                        i = r.every((t) => {
                          let n = e.options.find((e) => e.label === t);
                          return !(n && Y(n)) || !!m[e.id]?.[t]?.trim();
                        }),
                        s = a
                          ? r.includes("Đồng ý") || r.includes("Không đồng ý")
                          : (r.length > 0 || n.length > 0) && i;
                      return (0, t.jsxs)(
                        F,
                        {
                          name: e.id,
                          multiple: e.multiSelect,
                          required: !s,
                          children: [
                            (0, t.jsx)(H, { children: e.question }),
                            e.proposal &&
                              (0, t.jsx)("div", {
                                className:
                                  "my-2 whitespace-pre-wrap rounded-lg border border-[#d3e5ef] bg-[#f7f6f3]/70 p-2.5 text-xs leading-relaxed text-neutral-700",
                                children: e.proposal,
                              }),
                            (0, t.jsxs)(B, {
                              children: [
                                e.options.map((n) =>
                                  (0, t.jsxs)(
                                    K,
                                    {
                                      value: n.label,
                                      checked: r.includes(n.label),
                                      onChange: (t) => {
                                        let r = t.currentTarget.checked;
                                        (e.multiSelect ||
                                          a ||
                                          !r ||
                                          h((t) => ({ ...t, [e.id]: "" })),
                                          g((t) => {
                                            let a = t[e.id] || [];
                                            return e.multiSelect
                                              ? {
                                                  ...t,
                                                  [e.id]: r
                                                    ? [
                                                        ...a.filter(
                                                          (e) => e !== n.label,
                                                        ),
                                                        n.label,
                                                      ]
                                                    : a.filter(
                                                        (e) => e !== n.label,
                                                      ),
                                                }
                                              : {
                                                  ...t,
                                                  [e.id]: r ? [n.label] : [],
                                                };
                                          }));
                                      },
                                      children: [
                                        (0, t.jsx)("span", {
                                          className:
                                            "font-medium text-xs text-neutral-800",
                                          children: n.label,
                                        }),
                                        n.description
                                          ? (0, t.jsx)(V, {
                                              className:
                                                "text-[11px] text-neutral-500",
                                              children: n.description,
                                            })
                                          : null,
                                      ],
                                    },
                                    n.label,
                                  ),
                                ),
                                !a &&
                                  (0, t.jsx)(U, {
                                    placeholder:
                                      e.customPlaceholder ||
                                      "Mô tả phương án khác bạn muốn...",
                                    "aria-label": "Lựa chọn khác",
                                    disabled: l,
                                    value: d[e.id] || "",
                                    onChange: (t) => {
                                      let n = t.target.value;
                                      (h((t) => ({ ...t, [e.id]: n })),
                                        !e.multiSelect &&
                                          !a &&
                                          n.trim() &&
                                          g((t) => ({ ...t, [e.id]: [] })));
                                    },
                                  }),
                                r.map((n) => {
                                  let r = e.options.find((e) => e.label === n),
                                    a = r && Y(r);
                                  return a
                                    ? (0, t.jsxs)(
                                        "label",
                                        {
                                          className:
                                            "block space-y-1.5 pt-1 text-xs font-medium text-neutral-700",
                                          children: [
                                            (0, t.jsx)("span", {
                                              children: a.label,
                                            }),
                                            (0, t.jsx)("input", {
                                              type: "text",
                                              placeholder:
                                                a.placeholder ||
                                                `Nhập ${a.label.toLowerCase()}...`,
                                              "aria-label": `${a.label} cho lựa chọn ${n}`,
                                              disabled: l,
                                              value: m[e.id]?.[n] || "",
                                              onChange: (t) =>
                                                p((r) => ({
                                                  ...r,
                                                  [e.id]: {
                                                    ...r[e.id],
                                                    [n]: t.target.value,
                                                  },
                                                })),
                                              className:
                                                "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-normal outline-none focus:border-[#2383e2] focus:ring-2 focus:ring-[#2383e2]/15",
                                            }),
                                          ],
                                        },
                                        n,
                                      )
                                    : null;
                                }),
                              ],
                            }),
                            (0, t.jsx)(G, {
                              children:
                                "Vui lòng chọn hoặc nhập câu trả lời để tiếp tục.",
                            }),
                          ],
                        },
                        e.id,
                      );
                    }),
                    x &&
                      (0, t.jsx)("p", {
                        role: "alert",
                        className: "mt-2 text-xs text-rose-600",
                        children: x,
                      }),
                    (0, t.jsxs)(X, {
                      children: [
                        (0, t.jsx)(Q, { disabled: l, children: "Quay lại" }),
                        (0, t.jsxs)("div", {
                          className: "ml-auto flex items-center gap-2",
                          children: [
                            (0, t.jsx)(W, {
                              disabled: l,
                              children: "Tiếp theo",
                            }),
                            (0, t.jsx)(J, {
                              disabled: l,
                              children: l
                                ? (0, t.jsxs)("span", {
                                    className: "flex items-center gap-1.5",
                                    children: [
                                      (0, t.jsx)(i.Loader2, {
                                        className: "size-3.5 animate-spin",
                                      }),
                                      (0, t.jsx)("span", {
                                        children: "Đang gửi...",
                                      }),
                                    ],
                                  })
                                : e.some((e) => "confirm" === e.kind)
                                  ? "Xác nhận kế hoạch"
                                  : "Gửi lựa chọn",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
          });
        },
      ],
      653779,
    );
    var Z = e.i(456420);
    let ee = (0, Z.default)("shield-alert", [
      [
        "path",
        {
          d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
          key: "oel41y",
        },
      ],
      ["path", { d: "M12 8v4", key: "1got3b" }],
      ["path", { d: "M12 16h.01", key: "1drbdi" }],
    ]);
    e.s(["ShieldAlert", 0, ee], 516306);
    let et = (0, Z.default)("wrench", [
      [
        "path",
        {
          d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
          key: "1ngwbx",
        },
      ],
    ]);
    e.s(["Wrench", 0, et], 747925);
  },
  561309,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(271645),
      r = e.i(856423),
      a = e.i(716327),
      i = e.i(482022),
      l = e.i(632781),
      s = e.i(516306),
      o = e.i(584026),
      c = e.i(747925),
      u = e.i(569190);
    let d = {
        verified: {
          label: "Khớp nguồn",
          className: "bg-emerald-50 text-emerald-700",
        },
        contradicted: {
          label: "Sai so với nguồn",
          className: "bg-rose-50 text-rose-700",
        },
        not_found: {
          label: "Không thấy nguồn",
          className: "bg-amber-50 text-amber-800",
        },
        unclear: {
          label: "Chưa đủ căn cứ",
          className: "bg-[#f1f1ef] text-[#787774]",
        },
      },
      h =
        "inline-flex max-w-56 items-center gap-1 truncate rounded-md border border-[#e9e9e7] bg-[#f7f6f3] px-1.5 py-px text-[#5f5e5b]",
      m = (e, t) => e.corpusId || e.url || `${e.domain}-${t}`;
    function p({ source: e, label: n }) {
      return e.url
        ? (0, t.jsxs)("a", {
            href: e.url,
            target: "_blank",
            rel: "noopener noreferrer",
            title: e.url,
            className: `${h} hover:text-[#37352f]`,
            children: [
              (0, t.jsx)("span", { className: "truncate", children: n }),
              (0, t.jsx)(i.ExternalLink, {
                "aria-hidden": !0,
                className: "size-3 shrink-0 opacity-60",
              }),
            ],
          })
        : (0, t.jsxs)("span", {
            title: "Lấy từ kho ngữ liệu đã duyệt",
            className: h,
            children: [
              (0, t.jsx)(r.BookOpen, {
                "aria-hidden": !0,
                className: "size-3 shrink-0 opacity-60",
              }),
              (0, t.jsx)("span", { className: "truncate", children: n }),
            ],
          });
    }
    function f({ claim: e }) {
      let n = d[e.verdict ?? ""] ?? {
          label: "Chưa kiểm",
          className: "bg-[#f1f1ef] text-[#787774]",
        },
        r = e.text.split("\n")[0];
      return (0, t.jsxs)("li", {
        className: "space-y-1 py-1.5",
        children: [
          (0, t.jsxs)("div", {
            className: "flex items-start gap-1.5",
            children: [
              (0, t.jsx)("span", {
                className: `shrink-0 rounded px-1.5 py-px text-[10.5px] font-medium ${n.className}`,
                children: n.label,
              }),
              (0, t.jsx)("span", {
                className: "min-w-0 text-[#37352f]",
                children:
                  "passage" === e.kind
                    ? (0, t.jsxs)(t.Fragment, {
                        children: [
                          (0, t.jsxs)("span", {
                            className: "italic",
                            children: [
                              "“",
                              r,
                              e.text.includes("\n") ? "…" : "",
                              "”",
                            ],
                          }),
                          (e.author || e.work) &&
                            (0, t.jsxs)("span", {
                              className: "text-[#787774]",
                              children: [
                                " - ",
                                [e.author, e.work].filter(Boolean).join(", "),
                              ],
                            }),
                        ],
                      })
                    : e.text,
              }),
            ],
          }),
          e.note &&
            (0, t.jsx)("p", {
              className: "pl-1 text-[#787774]",
              children: e.note,
            }),
          e.sources.length > 0 &&
            (0, t.jsx)("div", {
              className: "flex flex-wrap gap-1 pl-1",
              children: e.sources.map((e, n) =>
                (0, t.jsx)(p, { source: e, label: e.domain }, m(e, n)),
              ),
            }),
        ],
      });
    }
    e.s([
      "GroundingPanel",
      0,
      function ({ message: e, loading: r, onFix: i }) {
        let [d, h] = n.useState(!1),
          g = e.grounding,
          x = e.verification,
          b = g?.sources.filter((e) => "passage" === e.kind) ?? [],
          v = g?.sources.filter((e) => "lookup" === e.kind) ?? [];
        if (!g && !x) return null;
        let y = x?.report,
          w = y?.claims ?? [];
        return (0, t.jsxs)("div", {
          className:
            "mt-2 space-y-1.5 border-t border-dashed border-[#dfdfdd] pt-2 text-[11.5px] text-[#787774]",
          children: [
            b.length > 0 &&
              (0, t.jsxs)("div", {
                className: "flex flex-wrap items-center gap-1.5",
                children: [
                  (0, t.jsx)("span", { children: "Ngữ liệu thật:" }),
                  b.map((e, n) =>
                    (0, t.jsx)(
                      p,
                      {
                        source: e,
                        label:
                          [e.author, e.work].filter(Boolean).join(", ") ||
                          e.domain,
                      },
                      m(e, n),
                    ),
                  ),
                ],
              }),
            v.length > 0 &&
              (0, t.jsxs)("div", {
                className: "flex flex-wrap items-center gap-1.5",
                children: [
                  (0, t.jsx)("span", { children: "Tư liệu tra cứu:" }),
                  v.map((e, n) =>
                    (0, t.jsx)(p, { source: e, label: e.domain }, m(e, n)),
                  ),
                ],
              }),
            g &&
              g.missing > 0 &&
              (0, t.jsxs)("p", {
                children: [
                  "Có ",
                  g.missing,
                  " ngữ liệu chưa tìm được bản gốc trong kho ngữ liệu và trên web; trợ lý được dặn ghi là ngữ liệu tự biên soạn.",
                ],
              }),
            x?.status === "running" &&
              (0, t.jsxs)("p", {
                className: "inline-flex items-center gap-1.5",
                children: [
                  (0, t.jsx)(l.Loader2, {
                    "aria-hidden": !0,
                    className: "size-3 animate-spin",
                  }),
                  "Đang kiểm chứng ngữ liệu và dữ kiện trong đề…",
                ],
              }),
            x?.status === "error" &&
              (0, t.jsxs)("p", {
                children: ["Chưa kiểm chứng được: ", x.error],
              }),
            x?.status === "done" &&
              y &&
              0 === w.length &&
              (0, t.jsxs)("p", {
                className: "inline-flex items-center gap-1.5",
                children: [
                  (0, t.jsx)(o.ShieldCheck, {
                    "aria-hidden": !0,
                    className: "size-3.5 text-emerald-600",
                  }),
                  "Không có ngữ liệu hay dữ kiện cần kiểm chứng.",
                ],
              }),
            x?.status === "done" &&
              y &&
              w.length > 0 &&
              (0, t.jsxs)("div", {
                className: "rounded-lg border border-[#e9e9e7] bg-white",
                children: [
                  (0, t.jsxs)("button", {
                    type: "button",
                    onClick: () => h((e) => !e),
                    "aria-expanded": d,
                    className:
                      "flex w-full items-center gap-1.5 px-2 py-1.5 text-left",
                    children: [
                      y.issues > 0
                        ? (0, t.jsx)(s.ShieldAlert, {
                            "aria-hidden": !0,
                            className: "size-3.5 shrink-0 text-amber-600",
                          })
                        : (0, t.jsx)(o.ShieldCheck, {
                            "aria-hidden": !0,
                            className: "size-3.5 shrink-0 text-emerald-600",
                          }),
                      (0, t.jsx)("span", {
                        className: "font-medium text-[#37352f]",
                        children:
                          y.issues > 0
                            ? `${y.issues} chỗ cần xem lại`
                            : `Đ\xe3 kiểm chứng ${y.verified}/${y.checked} ngữ liệu v\xe0 dữ kiện`,
                      }),
                      y.issues > 0 &&
                        (0, t.jsxs)("span", {
                          children: [
                            "· khớp nguồn ",
                            y.verified,
                            "/",
                            y.checked,
                          ],
                        }),
                      y.limited &&
                        (0, t.jsx)("span", { children: "· chưa kiểm hết" }),
                      (0, t.jsx)(a.ChevronDown, {
                        "aria-hidden": !0,
                        className: `ml-auto size-3.5 shrink-0 transition-transform ${d ? "rotate-180" : ""}`,
                      }),
                    ],
                  }),
                  d &&
                    (0, t.jsxs)("div", {
                      className: "border-t border-[#f1f1ef] px-2 pb-2",
                      children: [
                        (0, t.jsx)("ul", {
                          className: "divide-y divide-[#f1f1ef]",
                          children: w.map((e, n) =>
                            (0, t.jsx)(f, { claim: e }, n),
                          ),
                        }),
                        y.issues > 0 &&
                          (0, t.jsxs)("button", {
                            type: "button",
                            disabled: r,
                            onClick: () => i((0, u.fixRequest)(y)),
                            className:
                              "mt-1.5 inline-flex items-center gap-1 rounded-md border border-[#e9e9e7] px-2 py-1 text-[#37352f] hover:bg-[#f7f6f3] disabled:opacity-50",
                            children: [
                              (0, t.jsx)(c.Wrench, {
                                "aria-hidden": !0,
                                className: "size-3",
                              }),
                              "Sửa theo nguồn",
                            ],
                          }),
                        (0, t.jsx)("p", {
                          className: "mt-1.5 text-[10.5px]",
                          children:
                            "Kiểm chứng bằng tìm kiếm web, có thể sót; giáo viên vẫn nên đọc lại.",
                        }),
                      ],
                    }),
                ],
              }),
          ],
        });
      },
    ]);
  },
  99570,
  670495,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(630374),
      r = e.i(762368),
      a = e.i(482022),
      i = e.i(456420);
    let l = (0, i.default)("zoom-in", [
      ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
      ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
      ["line", { x1: "11", x2: "11", y1: "8", y2: "14", key: "1vmskp" }],
      ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }],
    ]);
    e.s(
      [
        "ImagePreviewModal",
        0,
        function ({ image: e, onClose: i }) {
          return e
            ? (0, t.jsx)(n.Dialog, {
                open: !!e,
                onOpenChange: (e) => !e && i(),
                children: (0, t.jsxs)(n.DialogContent, {
                  "data-keep-editing": !0,
                  onOpenAutoFocus: (e) => e.preventDefault(),
                  className:
                    "max-w-4xl p-2 sm:p-4 bg-neutral-950/95 border-neutral-800 text-neutral-100 shadow-2xl backdrop-blur-md focus:outline-none focus-visible:outline-none",
                  children: [
                    (0, t.jsxs)(n.DialogHeader, {
                      className:
                        "px-2 pt-1 pb-2 border-b border-neutral-800/80 flex flex-row items-center justify-between gap-4",
                      children: [
                        (0, t.jsxs)("div", {
                          className: "truncate pr-6",
                          children: [
                            (0, t.jsx)(n.DialogTitle, {
                              className:
                                "text-sm font-medium text-neutral-200 truncate",
                              children: e.name || e.alt || "Chi tiết ảnh",
                            }),
                            e.details &&
                              (0, t.jsx)(n.DialogDescription, {
                                className:
                                  "text-xs text-neutral-400 truncate mt-0.5",
                                children: e.details,
                              }),
                          ],
                        }),
                        (0, t.jsxs)("div", {
                          className: "flex items-center gap-1 shrink-0 mr-6",
                          children: [
                            (0, t.jsx)("a", {
                              href: e.src,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className:
                                "inline-flex items-center gap-1 rounded-md p-1.5 text-xs text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors",
                              title: "Mở ảnh tab mới",
                              children: (0, t.jsx)(a.ExternalLink, {
                                className: "size-3.5",
                              }),
                            }),
                            (0, t.jsx)("a", {
                              href: e.src,
                              download: e.name || "anh-de-thi.png",
                              className:
                                "inline-flex items-center gap-1 rounded-md p-1.5 text-xs text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors",
                              title: "Tải ảnh về",
                              children: (0, t.jsx)(r.Download, {
                                className: "size-3.5",
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsx)("div", {
                      className:
                        "relative flex items-center justify-center min-h-[260px] max-h-[75vh] overflow-hidden rounded-lg bg-black/40 p-1",
                      children: (0, t.jsx)("img", {
                        src: e.src,
                        alt: e.alt || e.name || "Ảnh",
                        className:
                          "max-h-[72vh] w-auto max-w-full rounded object-contain select-none shadow-md transition-transform duration-200",
                      }),
                    }),
                  ],
                }),
              })
            : null;
        },
        "ImageThumbnailPreview",
        0,
        function ({
          src: e,
          alt: n,
          name: r,
          details: a,
          className: i = "",
          imageClassName: s = "",
          onPreview: o,
          children: c,
        }) {
          let u = (t) => {
            (t.stopPropagation(),
              o({ src: e, alt: n || r, name: r || n, details: a }));
          };
          return (0, t.jsxs)("div", {
            onClick: u,
            role: "button",
            tabIndex: 0,
            onKeyDown: (e) => {
              ("Enter" === e.key || " " === e.key) &&
                (e.preventDefault(), u(e));
            },
            className: `group relative cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-[#2383e2]/80 active:scale-[0.98] ${i}`,
            children: [
              (0, t.jsx)("img", {
                src: e,
                alt: n || r || "Ảnh",
                className: `size-full object-cover transition-transform duration-300 group-hover:scale-105 ${s}`,
              }),
              (0, t.jsxs)("div", {
                className:
                  "pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/40 opacity-0 backdrop-blur-[1.5px] transition-all duration-200 group-hover:opacity-100",
                children: [
                  (0, t.jsx)("div", {
                    className:
                      "flex size-7 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm transition-transform duration-200 group-hover:scale-110",
                    children: (0, t.jsx)(l, { className: "size-3.5" }),
                  }),
                  (0, t.jsx)("span", {
                    className:
                      "mt-1 text-[10px] font-medium text-white drop-shadow-sm select-none",
                    children: "Xem ảnh",
                  }),
                ],
              }),
              c,
            ],
          });
        },
      ],
      99570,
    );
    let s = (0, i.default)("text-quote", [
      ["path", { d: "M17 5H3", key: "1cn7zz" }],
      ["path", { d: "M21 12H8", key: "scolzb" }],
      ["path", { d: "M21 19H8", key: "13qgcb" }],
      ["path", { d: "M3 12v7", key: "1ri8j3" }],
    ]);
    var o = e.i(263676);
    e.s(
      [
        "ReferenceChips",
        0,
        function ({ references: e, onRemove: n, disabled: r }) {
          return 0 === e.length
            ? null
            : (0, t.jsx)("ul", {
                className: "flex flex-wrap gap-1.5",
                "aria-label": "Đoạn trong đề đã gắn vào yêu cầu",
                children: e.map((e) =>
                  (0, t.jsxs)(
                    "li",
                    {
                      title: e.preview,
                      className:
                        "flex max-w-full min-w-0 items-center gap-1.5 rounded-lg border border-[#c9e0f5] bg-[#f7f6f3] py-1 pl-2 pr-1.5 text-[11px] text-neutral-700",
                      children: [
                        (0, t.jsx)(s, {
                          "aria-hidden": !0,
                          className: "size-3.5 shrink-0 text-[#2383e2]",
                        }),
                        (0, t.jsx)("span", {
                          className: "shrink-0 font-medium text-[#0b6bcb]",
                          children: e.label,
                        }),
                        (0, t.jsx)("span", {
                          className:
                            "min-w-0 max-w-44 truncate text-neutral-500",
                          children: e.preview,
                        }),
                        n &&
                          (0, t.jsx)("button", {
                            type: "button",
                            onClick: () => n(e.id),
                            disabled: r,
                            "aria-label": `Bỏ ${e.label} khỏi y\xeau cầu`,
                            className:
                              "ml-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-black/[0.08] hover:text-neutral-700 disabled:pointer-events-none disabled:opacity-40",
                            children: (0, t.jsx)(o.X, {
                              "aria-hidden": !0,
                              className: "size-3",
                            }),
                          }),
                      ],
                    },
                    e.id,
                  ),
                ),
              });
        },
      ],
      670495,
    );
  },
  160523,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(99570),
      r = e.i(604131),
      a = e.i(670495),
      i = e.i(816186),
      l = e.i(815731),
      s = e.i(226091);
    e.i(565594);
    var o = e.i(996296);
    e.s([
      "UserBubble",
      0,
      function ({ message: e, onPreviewImage: c }) {
        return (0, t.jsx)(i.Message, {
          align: "end",
          children: (0, t.jsx)(i.MessageContent, {
            children: (0, t.jsx)(l.Bubble, {
              align: "end",
              variant: "default",
              children: (0, t.jsxs)(l.BubbleContent, {
                className:
                  "rounded-3xl rounded-br-lg bg-[#f1f1ef] px-4 py-2.5 text-neutral-900 shadow-none",
                children: [
                  !!e.references?.length &&
                    (0, t.jsx)("div", {
                      className:
                        e.content || e.images?.length || e.files?.length
                          ? "mb-2"
                          : "",
                      children: (0, t.jsx)(a.ReferenceChips, {
                        references: e.references,
                      }),
                    }),
                  e.images &&
                    e.images.length > 0 &&
                    (0, t.jsx)("div", {
                      className: `grid gap-1.5 ${1 === e.images.length ? "grid-cols-1" : "grid-cols-2"} ${e.content || e.files?.length ? "mb-2" : ""}`,
                      children: e.images.map((e) =>
                        (0, t.jsx)(
                          n.ImageThumbnailPreview,
                          {
                            src: e.previewUrl,
                            alt: e.name,
                            name: e.name,
                            onPreview: c,
                            className:
                              "max-h-40 w-full rounded-lg border border-black/10",
                            imageClassName: "max-h-40 w-full",
                          },
                          e.id,
                        ),
                      ),
                    }),
                  !!e.files?.length &&
                    (0, t.jsx)("div", {
                      className: `flex flex-col gap-1.5 ${e.content ? "mb-2" : ""}`,
                      children: e.files?.map((e) =>
                        (0, t.jsxs)(
                          "div",
                          {
                            className:
                              "flex min-w-0 items-center gap-2 rounded-xl border border-black/10 bg-white/60 px-2.5 py-2",
                            children: [
                              (0, t.jsx)(s.FileText, {
                                "aria-hidden": !0,
                                className: "size-5 shrink-0 text-[#2383e2]",
                              }),
                              (0, t.jsxs)("div", {
                                className: "min-w-0",
                                children: [
                                  (0, t.jsx)("p", {
                                    title: e.name,
                                    className: "truncate text-xs font-medium",
                                    children: e.name,
                                  }),
                                  (0, t.jsx)("p", {
                                    className: "text-[10px] text-neutral-500",
                                    children: (0, o.formatBytes)(e.bytes),
                                  }),
                                ],
                              }),
                            ],
                          },
                          e.id,
                        ),
                      ),
                    }),
                  e.content &&
                    (0, t.jsx)("div", {
                      className:
                        "prose prose-xs max-w-none break-words leading-relaxed text-neutral-900",
                      children: (0, t.jsx)(r.RichText, { text: e.content }),
                    }),
                ],
              }),
            }),
          }),
        });
      },
    ]);
  },
  569190,
  (e) => {
    "use strict";
    var t = e.i(715760);
    e.s([
      "fixRequest",
      0,
      function (e) {
        let t = (e.claims ?? [])
          .filter(
            (e) => "contradicted" === e.verdict || "not_found" === e.verdict,
          )
          .map((e) =>
            "passage" === e.kind
              ? `- Ngữ liệu ghi của ${[e.author, e.work].filter(Boolean).join(", ") || "tác giả có thật"} ("${e.text.split("\n")[0]}…") kh\xf4ng t\xecm thấy nguy\xean văn: thay bằng ngữ liệu thật c\xf3 nguồn (giữ chủ đề, thể loại v\xe0 c\xe2u hỏi tương ứng), hoặc ghi r\xf5 l\xe0 ngữ liệu tự bi\xean soạn.`
              : `- "${e.text}"${e.note ? `: ${e.note}` : ""}`,
          );
        return `Sửa c\xe1c chỗ sau trong đề cho đ\xfang theo nguồn đ\xe3 kiểm chứng, giữ nguy\xean c\xe1c phần kh\xe1c:
${t.join("\n")}`;
      },
      "verifyContent",
      0,
      function (e, n, r) {
        return (0, t.postJson)(
          "/api/chat-exam/verify",
          { content: e, subject: n },
          { signal: r },
        );
      },
    ]);
  },
  126930,
  (e) => {
    "use strict";
    var t = e.i(271645),
      n = e.i(75830),
      r = e.i(586318),
      a = e.i(981140),
      i = e.i(820783),
      l = e.i(30030),
      s = e.i(610772),
      o = e.i(832006),
      c = e.i(842727),
      u = e.i(248425),
      d = e.i(369340),
      h = e.i(843476),
      m = Object.defineProperty,
      p = (e, t) => m(e, "name", { value: t, configurable: !0 }),
      f = "Menubar",
      [g, x, b] = (0, n.createCollection)(f),
      [v, y] = (0, l.createContextScope)(f, [b, c.createRovingFocusGroupScope]),
      w = (0, o.createMenuScope)(),
      k = (0, c.createRovingFocusGroupScope)(),
      [j, C] = v(f),
      N = t.forwardRef(
        p(function (e, n) {
          let {
              __scopeMenubar: a,
              value: i,
              onValueChange: l,
              defaultValue: s,
              loop: o = !0,
              dir: m,
              ...p
            } = e,
            x = (0, r.useDirection)(m),
            b = k(a),
            [v, y] = (0, d.useControllableState)({
              prop: i,
              onChange: l,
              defaultProp: s ?? "",
              caller: f,
            }),
            [w, C] = t.useState(null);
          return (0, h.jsx)(j, {
            scope: a,
            value: v,
            onMenuOpen: t.useCallback(
              (e) => {
                (y(e), C(e));
              },
              [y],
            ),
            onMenuClose: t.useCallback(() => y(""), [y]),
            onMenuToggle: t.useCallback(
              (e) => {
                (y((t) => (t ? "" : e)), C(e));
              },
              [y],
            ),
            dir: x,
            loop: o,
            children: (0, h.jsx)(g.Provider, {
              scope: a,
              children: (0, h.jsx)(g.Slot, {
                scope: a,
                children: (0, h.jsx)(c.Root, {
                  asChild: !0,
                  ...b,
                  orientation: "horizontal",
                  loop: o,
                  dir: x,
                  currentTabStopId: w,
                  onCurrentTabStopIdChange: C,
                  children: (0, h.jsx)(u.Primitive.div, {
                    role: "menubar",
                    ...p,
                    ref: n,
                  }),
                }),
              }),
            }),
          });
        }, "Menubar"),
      ),
      S = "MenubarMenu",
      [M, R] = v(S),
      I = p((e) => {
        let { __scopeMenubar: n, value: r, ...a } = e,
          i = (0, s.useId)(),
          l = r || i || "LEGACY_REACT_AUTO_VALUE",
          c = C(S, n),
          u = w(n),
          d = t.useRef(null),
          m = t.useRef(!1),
          p = c.value === l;
        return (
          t.useEffect(() => {
            p || (m.current = !1);
          }, [p]),
          (0, h.jsx)(M, {
            scope: n,
            value: l,
            triggerId: (0, s.useId)(),
            triggerRef: d,
            contentId: (0, s.useId)(),
            wasKeyboardTriggerOpenRef: m,
            children: (0, h.jsx)(o.Root, {
              ...u,
              open: p,
              onOpenChange: (e) => {
                e || c.onMenuClose();
              },
              modal: !1,
              dir: c.dir,
              ...a,
            }),
          })
        );
      }, "MenubarMenu"),
      A = "MenubarTrigger",
      T = t.forwardRef(
        p(function (e, n) {
          let { __scopeMenubar: r, disabled: l = !1, ...s } = e,
            d = k(r),
            m = w(r),
            p = C(A, r),
            f = R(A, r),
            x = t.useRef(null),
            b = (0, i.useComposedRefs)(n, x, f.triggerRef),
            [v, y] = t.useState(!1),
            j = p.value === f.value;
          return (0, h.jsx)(g.ItemSlot, {
            scope: r,
            value: f.value,
            disabled: l,
            children: (0, h.jsx)(c.Item, {
              asChild: !0,
              ...d,
              focusable: !l,
              tabStopId: f.value,
              children: (0, h.jsx)(o.Anchor, {
                asChild: !0,
                ...m,
                children: (0, h.jsx)(u.Primitive.button, {
                  type: "button",
                  role: "menuitem",
                  id: f.triggerId,
                  "aria-haspopup": "menu",
                  "aria-expanded": j,
                  "aria-controls": j ? f.contentId : void 0,
                  "data-highlighted": v ? "" : void 0,
                  "data-state": j ? "open" : "closed",
                  "data-disabled": l ? "" : void 0,
                  disabled: l,
                  ...s,
                  ref: b,
                  onPointerDown: (0, a.composeEventHandlers)(
                    e.onPointerDown,
                    (e) => {
                      !l &&
                        0 === e.button &&
                        !1 === e.ctrlKey &&
                        (p.onMenuOpen(f.value), j || e.preventDefault());
                    },
                  ),
                  onPointerEnter: (0, a.composeEventHandlers)(
                    e.onPointerEnter,
                    () => {
                      p.value &&
                        !j &&
                        (p.onMenuOpen(f.value), x.current?.focus());
                    },
                  ),
                  onKeyDown: (0, a.composeEventHandlers)(e.onKeyDown, (e) => {
                    !l &&
                      (["Enter", " "].includes(e.key) &&
                        p.onMenuToggle(f.value),
                      "ArrowDown" === e.key && p.onMenuOpen(f.value),
                      ["Enter", " ", "ArrowDown"].includes(e.key) &&
                        ((f.wasKeyboardTriggerOpenRef.current = !0),
                        e.preventDefault()));
                  }),
                  onFocus: (0, a.composeEventHandlers)(e.onFocus, () => y(!0)),
                  onBlur: (0, a.composeEventHandlers)(e.onBlur, () => y(!1)),
                }),
              }),
            }),
          });
        }, "MenubarTrigger"),
      ),
      E = p((e) => {
        let { __scopeMenubar: t, ...n } = e,
          r = w(t);
        return (0, h.jsx)(o.Portal, { ...r, ...n });
      }, "MenubarPortal"),
      P = "MenubarContent",
      $ = t.forwardRef(
        p(function (e, n) {
          let { __scopeMenubar: r, align: i = "start", ...l } = e,
            s = w(r),
            c = C(P, r),
            u = R(P, r),
            d = x(r),
            m = t.useRef(!1);
          return (0, h.jsx)(o.Content, {
            id: u.contentId,
            "aria-labelledby": u.triggerId,
            "data-radix-menubar-content": "",
            ...s,
            ...l,
            ref: n,
            align: i,
            onCloseAutoFocus: (0, a.composeEventHandlers)(
              e.onCloseAutoFocus,
              (e) => {
                (c.value || m.current || u.triggerRef.current?.focus(),
                  (m.current = !1),
                  e.preventDefault());
              },
            ),
            onFocusOutside: (0, a.composeEventHandlers)(
              e.onFocusOutside,
              (e) => {
                let t = e.target;
                d().some((e) => e.ref.current?.contains(t)) &&
                  e.preventDefault();
              },
            ),
            onInteractOutside: (0, a.composeEventHandlers)(
              e.onInteractOutside,
              () => {
                m.current = !0;
              },
            ),
            onEntryFocus: (e) => {
              u.wasKeyboardTriggerOpenRef.current || e.preventDefault();
            },
            onKeyDown: (0, a.composeEventHandlers)(
              e.onKeyDown,
              (e) => {
                if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
                  let t = e.target,
                    n = t.hasAttribute("data-radix-menubar-subtrigger"),
                    r =
                      t.closest("[data-radix-menubar-content]") !==
                      e.currentTarget,
                    a =
                      ("rtl" === c.dir ? "ArrowRight" : "ArrowLeft") === e.key;
                  if ((!a && n) || (r && a)) return;
                  let i = d()
                    .filter((e) => !e.disabled)
                    .map((e) => e.value);
                  a && i.reverse();
                  let l = i.indexOf(u.value),
                    [s] = (i = c.loop ? G(i, l + 1) : i.slice(l + 1));
                  s && c.onMenuOpen(s);
                }
              },
              { checkForDefaultPrevented: !1 },
            ),
            style: {
              ...e.style,
              "--radix-menubar-content-transform-origin":
                "var(--radix-popper-transform-origin)",
              "--radix-menubar-content-available-width":
                "var(--radix-popper-available-width)",
              "--radix-menubar-content-available-height":
                "var(--radix-popper-available-height)",
              "--radix-menubar-trigger-width":
                "var(--radix-popper-anchor-width)",
              "--radix-menubar-trigger-height":
                "var(--radix-popper-anchor-height)",
            },
          });
        }, "MenubarContent"),
      ),
      _ = t.forwardRef(
        p(function (e, t) {
          let { __scopeMenubar: n, ...r } = e,
            a = w(n);
          return (0, h.jsx)(o.Group, { ...a, ...r, ref: t });
        }, "MenubarGroup"),
      ),
      q = t.forwardRef(
        p(function (e, t) {
          let { __scopeMenubar: n, ...r } = e,
            a = w(n);
          return (0, h.jsx)(o.Label, { ...a, ...r, ref: t });
        }, "MenubarLabel"),
      ),
      z = t.forwardRef(
        p(function (e, t) {
          let { __scopeMenubar: n, ...r } = e,
            a = w(n);
          return (0, h.jsx)(o.Item, { ...a, ...r, ref: t });
        }, "MenubarItem"),
      ),
      D = t.forwardRef(
        p(function (e, t) {
          let { __scopeMenubar: n, ...r } = e,
            a = w(n);
          return (0, h.jsx)(o.CheckboxItem, { ...a, ...r, ref: t });
        }, "MenubarCheckboxItem"),
      ),
      O = t.forwardRef(
        p(function (e, t) {
          let { __scopeMenubar: n, ...r } = e,
            a = w(n);
          return (0, h.jsx)(o.RadioGroup, { ...a, ...r, ref: t });
        }, "MenubarRadioGroup"),
      ),
      L = t.forwardRef(
        p(function (e, t) {
          let { __scopeMenubar: n, ...r } = e,
            a = w(n);
          return (0, h.jsx)(o.RadioItem, { ...a, ...r, ref: t });
        }, "MenubarRadioItem"),
      ),
      F = t.forwardRef(
        p(function (e, t) {
          let { __scopeMenubar: n, ...r } = e,
            a = w(n);
          return (0, h.jsx)(o.ItemIndicator, { ...a, ...r, ref: t });
        }, "MenubarItemIndicator"),
      ),
      H = t.forwardRef(
        p(function (e, t) {
          let { __scopeMenubar: n, ...r } = e,
            a = w(n);
          return (0, h.jsx)(o.Separator, { ...a, ...r, ref: t });
        }, "MenubarSeparator"),
      ),
      B = t.forwardRef(
        p(function (e, t) {
          let { __scopeMenubar: n, ...r } = e,
            a = w(n);
          return (0, h.jsx)(o.Arrow, { ...a, ...r, ref: t });
        }, "MenubarArrow"),
      ),
      K = p((e) => {
        let {
            __scopeMenubar: t,
            children: n,
            open: r,
            onOpenChange: a,
            defaultOpen: i,
          } = e,
          l = w(t),
          [s, c] = (0, d.useControllableState)({
            prop: r,
            defaultProp: i ?? !1,
            onChange: a,
            caller: "MenubarSub",
          });
        return (0, h.jsx)(o.Sub, {
          ...l,
          open: s,
          onOpenChange: c,
          children: n,
        });
      }, "MenubarSub"),
      V = t.forwardRef(
        p(function (e, t) {
          let { __scopeMenubar: n, ...r } = e,
            a = w(n);
          return (0, h.jsx)(o.SubTrigger, {
            "data-radix-menubar-subtrigger": "",
            ...a,
            ...r,
            ref: t,
          });
        }, "MenubarSubTrigger"),
      ),
      U = t.forwardRef(
        p(function (e, t) {
          let { __scopeMenubar: n, ...r } = e,
            a = w(n);
          return (0, h.jsx)(o.SubContent, {
            ...a,
            "data-radix-menubar-content": "",
            ...r,
            ref: t,
            style: {
              ...e.style,
              "--radix-menubar-content-transform-origin":
                "var(--radix-popper-transform-origin)",
              "--radix-menubar-content-available-width":
                "var(--radix-popper-available-width)",
              "--radix-menubar-content-available-height":
                "var(--radix-popper-available-height)",
              "--radix-menubar-trigger-width":
                "var(--radix-popper-anchor-width)",
              "--radix-menubar-trigger-height":
                "var(--radix-popper-anchor-height)",
            },
          });
        }, "MenubarSubContent"),
      );
    function G(e, t) {
      return e.map((n, r) => e[(t + r) % e.length]);
    }
    (p(G, "wrapArray"),
      e.s(
        [
          "Arrow",
          0,
          B,
          "CheckboxItem",
          0,
          D,
          "Content",
          0,
          $,
          "Group",
          0,
          _,
          "Item",
          0,
          z,
          "ItemIndicator",
          0,
          F,
          "Label",
          0,
          q,
          "Menu",
          0,
          I,
          "Menubar",
          0,
          N,
          "MenubarArrow",
          0,
          B,
          "MenubarCheckboxItem",
          0,
          D,
          "MenubarContent",
          0,
          $,
          "MenubarGroup",
          0,
          _,
          "MenubarItem",
          0,
          z,
          "MenubarItemIndicator",
          0,
          F,
          "MenubarLabel",
          0,
          q,
          "MenubarMenu",
          0,
          I,
          "MenubarPortal",
          0,
          E,
          "MenubarRadioGroup",
          0,
          O,
          "MenubarRadioItem",
          0,
          L,
          "MenubarSeparator",
          0,
          H,
          "MenubarSub",
          0,
          K,
          "MenubarSubContent",
          0,
          U,
          "MenubarSubTrigger",
          0,
          V,
          "MenubarTrigger",
          0,
          T,
          "Portal",
          0,
          E,
          "RadioGroup",
          0,
          O,
          "RadioItem",
          0,
          L,
          "Root",
          0,
          N,
          "Separator",
          0,
          H,
          "Sub",
          0,
          K,
          "SubContent",
          0,
          U,
          "SubTrigger",
          0,
          V,
          "Trigger",
          0,
          T,
          "createMenubarScope",
          0,
          y,
        ],
        709715,
      ));
    var X = e.i(709715);
    e.s(["Menubar", 0, X], 126930);
  },
  954808,
  (e) => {
    "use strict";
    var t = e.i(271645);
    function n(...e) {
      let t = {};
      for (let n of e)
        if (n)
          for (let e of Object.keys(n)) {
            var a;
            let i = n[e];
            if (void 0 === i) continue;
            let l = t[e];
            "className" === e
              ? (t[e] = [l, i].filter(Boolean).join(" "))
              : "style" === e
                ? (t[e] = { ...l, ...i })
                : "ref" === e
                  ? (t[e] = r(l, i))
                  : ((a = e),
                      /^on[A-Z]/.test(a) &&
                        "function" == typeof l &&
                        "function" == typeof i)
                    ? (t[e] = (function (e, t) {
                        return function (n) {
                          (e(n), n.defaultPrevented || t(n));
                        };
                      })(i, l))
                    : (t[e] = i);
          }
      return t;
    }
    function r(...e) {
      let t = e.filter(Boolean);
      if (0 !== t.length)
        return (e) => {
          for (let n of t) "function" == typeof n ? n(e) : n && (n.current = e);
        };
    }
    e.s([
      "a",
      0,
      function ({
        defaultTagName: e,
        props: a,
        render: i,
        state: l = {},
        stateAttributesMapping: s,
      }) {
        let o = n(
          (function (e, t) {
            let n = {};
            for (let r of Object.keys(e)) {
              let a = e[r],
                i = t?.[r]?.(a);
              if (i) {
                Object.assign(n, i);
                continue;
              }
              if ("slot" === r) {
                n["data-slot"] = a;
                continue;
              }
              let l = `data-${String(r).replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`)}`;
              "boolean" == typeof a
                ? (n[l] = a ? "" : void 0)
                : null != a && (n[l] = String(a));
            }
            return n;
          })(l, s),
          a,
        );
        if (!i) return t.createElement(e, o);
        if ("function" == typeof i) return i(o, l);
        if (!t.isValidElement(i)) return null;
        let c = i.props,
          u = { ...n(o, c), ref: r(o.ref, c.ref) };
        return t.cloneElement(i, u);
      },
      "b",
      0,
      n,
      "c",
      0,
      r,
    ]);
  },
  855146,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("baseline", [
      ["path", { d: "M4 20h16", key: "14thso" }],
      ["path", { d: "m6 16 6-12 6 12", key: "1b4byz" }],
      ["path", { d: "M8 12h8", key: "1wcyev" }],
    ]);
    e.s(["Baseline", 0, t], 855146);
  },
  46794,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("bold", [
      [
        "path",
        {
          d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",
          key: "mg9rjx",
        },
      ],
    ]);
    e.s(["Bold", 0, t], 46794);
  },
  129768,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("calendar-days", [
      ["path", { d: "M8 2v3", key: "1ioesn" }],
      ["path", { d: "M16 2v3", key: "otl347" }],
      [
        "rect",
        { x: "3", y: "3", width: "18", height: "18", rx: "2", key: "h1oib" },
      ],
      ["path", { d: "M3 9h18", key: "1pudct" }],
      ["path", { d: "M8 13h.01", key: "1sbv64" }],
      ["path", { d: "M12 13h.01", key: "y0uutt" }],
      ["path", { d: "M16 13h.01", key: "wip0gl" }],
      ["path", { d: "M8 17h.01", key: "p3bg7i" }],
      ["path", { d: "M12 17h.01", key: "p32p05" }],
      ["path", { d: "M16 17h.01", key: "ql8jdd" }],
    ]);
    e.s(["CalendarDays", 0, t], 129768);
  },
  199883,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("case-sensitive", [
      [
        "path",
        { d: "m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16", key: "d5nyq2" },
      ],
      ["path", { d: "M22 9v7", key: "pvm9v3" }],
      ["path", { d: "M3.304 13h6.392", key: "1q3zxz" }],
      ["circle", { cx: "18.5", cy: "12.5", r: "3.5", key: "z97x68" }],
    ]);
    e.s(["CaseSensitive", 0, t], 199883);
  },
  399847,
  (e) => {
    "use strict";
    var t = e.i(724983);
    e.s(["AlertCircle", () => t.default]);
  },
  849487,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("highlighter", [
      ["path", { d: "m9 11-6 6v3h9l3-3", key: "1a3l36" }],
      [
        "path",
        {
          d: "m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4",
          key: "14a9rk",
        },
      ],
    ]);
    e.s(["Highlighter", 0, t], 849487);
  },
  815170,
  (e) => {
    "use strict";
    var t = e.i(675849);
    e.s(["Image", () => t.default]);
  },
  195780,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("layout-template", [
      [
        "rect",
        { width: "18", height: "7", x: "3", y: "3", rx: "1", key: "f1a2em" },
      ],
      [
        "rect",
        { width: "9", height: "7", x: "3", y: "14", rx: "1", key: "jqznyg" },
      ],
      [
        "rect",
        { width: "5", height: "7", x: "16", y: "14", rx: "1", key: "q5h2i8" },
      ],
    ]);
    e.s(["LayoutTemplate", 0, t], 195780);
  },
  692630,
  221216,
  700883,
  (e) => {
    "use strict";
    var t = e.i(456420);
    let n = (0, t.default)("list-indent-decrease", [
      ["path", { d: "M21 5H11", key: "us1j55" }],
      ["path", { d: "M21 12H11", key: "wd7e0v" }],
      ["path", { d: "M21 19H11", key: "saa85w" }],
      ["path", { d: "m7 8-4 4 4 4", key: "o5hrat" }],
    ]);
    e.s(["IndentDecrease", 0, n], 692630);
    let r = (0, t.default)("list-indent-increase", [
      ["path", { d: "M21 5H11", key: "us1j55" }],
      ["path", { d: "M21 12H11", key: "wd7e0v" }],
      ["path", { d: "M21 19H11", key: "saa85w" }],
      ["path", { d: "m3 8 4 4-4 4", key: "1a3j6y" }],
    ]);
    e.s(["IndentIncrease", 0, r], 221216);
    let a = (0, t.default)("italic", [
      ["line", { x1: "19", x2: "10", y1: "4", y2: "4", key: "15jd3p" }],
      ["line", { x1: "14", x2: "5", y1: "20", y2: "20", key: "bu0au3" }],
      ["line", { x1: "15", x2: "9", y1: "4", y2: "20", key: "uljnxc" }],
    ]);
    e.s(["Italic", 0, a], 700883);
  },
  930800,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("list-ordered", [
      ["path", { d: "M11 5h10", key: "1cz7ny" }],
      ["path", { d: "M11 12h10", key: "1438ji" }],
      ["path", { d: "M11 19h10", key: "11t30w" }],
      ["path", { d: "M4 4h1v5", key: "10yrso" }],
      ["path", { d: "M4 9h2", key: "r1h2o0" }],
      [
        "path",
        {
          d: "M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02",
          key: "xtkcd5",
        },
      ],
    ]);
    e.s(["ListOrdered", 0, t], 930800);
  },
  241999,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("redo-2", [
      ["path", { d: "m15 14 5-5-5-5", key: "12vg1m" }],
      [
        "path",
        {
          d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
          key: "6uklza",
        },
      ],
    ]);
    e.s(["Redo2", 0, t], 241999);
  },
  640460,
  849635,
  897306,
  630505,
  151216,
  (e) => {
    "use strict";
    var t = e.i(456420);
    let n = (0, t.default)("remove-formatting", [
      ["path", { d: "M4 7V4h16v3", key: "9msm58" }],
      ["path", { d: "M5 20h6", key: "1h6pxn" }],
      ["path", { d: "M13 4 8 20", key: "kqq6aj" }],
      ["path", { d: "m15 15 5 5", key: "me55sn" }],
      ["path", { d: "m20 15-5 5", key: "11p7ol" }],
    ]);
    e.s(["RemoveFormatting", 0, n], 640460);
    let r = (0, t.default)("strikethrough", [
      ["path", { d: "M16 4H9a3 3 0 0 0-2.83 4", key: "43sutm" }],
      ["path", { d: "M14 12a4 4 0 0 1 0 8H6", key: "nlfj13" }],
      ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
    ]);
    e.s(["Strikethrough", 0, r], 849635);
    let a = (0, t.default)("subscript", [
      ["path", { d: "m4 5 8 8", key: "1eunvl" }],
      ["path", { d: "m12 5-8 8", key: "1ah0jp" }],
      [
        "path",
        {
          d: "M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07",
          key: "e8ta8j",
        },
      ],
    ]);
    e.s(["Subscript", 0, a], 897306);
    let i = (0, t.default)("superscript", [
      ["path", { d: "m4 19 8-8", key: "hr47gm" }],
      ["path", { d: "m12 19-8-8", key: "1dhhmo" }],
      [
        "path",
        {
          d: "M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06",
          key: "1dfcux",
        },
      ],
    ]);
    e.s(["Superscript", 0, i], 630505);
    let l = (0, t.default)("underline", [
      ["path", { d: "M6 4v6a6 6 0 0 0 12 0V4", key: "9kb039" }],
      ["line", { x1: "4", x2: "20", y1: "20", y2: "20", key: "nun2al" }],
    ]);
    e.s(["Underline", 0, l], 151216);
  },
  779266,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("rotate-ccw-clock", [
      [
        "path",
        {
          d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
          key: "1357e3",
        },
      ],
      ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
      ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }],
    ]);
    e.s(["History", 0, t], 779266);
  },
  570937,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("table-2", [
      [
        "path",
        {
          d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
          key: "gugj83",
        },
      ],
    ]);
    e.s(["Table2", 0, t], 570937);
  },
  594069,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("text-align-justify", [
      ["path", { d: "M3 5h18", key: "1u36vt" }],
      ["path", { d: "M3 12h18", key: "1i2n21" }],
      ["path", { d: "M3 19h18", key: "awlh7x" }],
    ]);
    e.s(["AlignJustify", 0, t], 594069);
  },
]);
