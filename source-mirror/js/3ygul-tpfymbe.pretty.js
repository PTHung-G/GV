(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  630374,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(179862),
      r = e.i(814387),
      r = r,
      a = e.i(964053),
      i = e.i(167881);
    function o({ ...e }) {
      return (0, t.jsx)(a.Dialog.Portal, {
        "data-slot": "dialog-portal",
        ...e,
      });
    }
    function s({ className: e, ...r }) {
      return (0, t.jsx)(a.Dialog.Overlay, {
        "data-slot": "dialog-overlay",
        className: (0, n.cn)(
          "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
          e,
        ),
        ...r,
      });
    }
    e.s(
      [
        "Dialog",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(a.Dialog.Root, { "data-slot": "dialog", ...e });
        },
        "DialogClose",
        0,
        function ({ ...e }) {
          return (0, t.jsx)(a.Dialog.Close, {
            "data-slot": "dialog-close",
            ...e,
          });
        },
        "DialogContent",
        0,
        function ({
          className: e,
          children: i,
          showCloseButton: l = !0,
          ...c
        }) {
          return (0, t.jsxs)(o, {
            "data-slot": "dialog-portal",
            children: [
              (0, t.jsx)(s, {}),
              (0, t.jsxs)(a.Dialog.Content, {
                "data-slot": "dialog-content",
                className: (0, n.cn)(
                  "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg",
                  e,
                ),
                ...c,
                children: [
                  i,
                  l &&
                    (0, t.jsxs)(a.Dialog.Close, {
                      "data-slot": "dialog-close",
                      className:
                        "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                      children: [
                        (0, t.jsx)(r.default, {}),
                        (0, t.jsx)("span", {
                          className: "sr-only",
                          children: "Close",
                        }),
                      ],
                    }),
                ],
              }),
            ],
          });
        },
        "DialogDescription",
        0,
        function ({ className: e, ...r }) {
          return (0, t.jsx)(a.Dialog.Description, {
            "data-slot": "dialog-description",
            className: (0, n.cn)("text-sm text-muted-foreground", e),
            ...r,
          });
        },
        "DialogFooter",
        0,
        function ({
          className: e,
          showCloseButton: r = !1,
          children: o,
          ...s
        }) {
          return (0, t.jsxs)("div", {
            "data-slot": "dialog-footer",
            className: (0, n.cn)(
              "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
              e,
            ),
            ...s,
            children: [
              o,
              r &&
                (0, t.jsx)(a.Dialog.Close, {
                  asChild: !0,
                  children: (0, t.jsx)(i.Button, {
                    variant: "outline",
                    children: "Close",
                  }),
                }),
            ],
          });
        },
        "DialogHeader",
        0,
        function ({ className: e, ...r }) {
          return (0, t.jsx)("div", {
            "data-slot": "dialog-header",
            className: (0, n.cn)(
              "flex flex-col gap-2 text-center sm:text-left",
              e,
            ),
            ...r,
          });
        },
        "DialogTitle",
        0,
        function ({ className: e, ...r }) {
          return (0, t.jsx)(a.Dialog.Title, {
            "data-slot": "dialog-title",
            className: (0, n.cn)("text-lg leading-none font-semibold", e),
            ...r,
          });
        },
      ],
      630374,
    );
  },
  23750,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(647163);
    e.s([
      "Input",
      0,
      function ({ className: e, ...r }) {
        return (0, t.jsx)("input", {
          "data-slot": "input",
          className: (0, n.cn)(
            "flex h-10 w-full rounded-md border border-neutral-200 bg-background px-3 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-[#2383e2] focus-visible:ring-2 focus-visible:ring-[#2383e2]/15 disabled:cursor-not-allowed disabled:opacity-50",
            e,
          ),
          ...r,
        });
      },
    ]);
  },
  10708,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(647163);
    e.s([
      "Label",
      0,
      function ({ className: e, ...r }) {
        return (0, t.jsx)("label", {
          "data-slot": "label",
          className: (0, n.cn)("text-sm font-medium leading-none", e),
          ...r,
        });
      },
    ]);
  },
  728231,
  186336,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(647163),
      r = e.i(271645),
      a = e.i(981140),
      i = e.i(820783),
      o = e.i(30030),
      s = e.i(726330),
      l = e.i(610772),
      c = e.i(853660),
      d = e.i(774606),
      u = e.i(296626),
      p = e.i(248425),
      h = e.i(991918),
      g = e.i(369340),
      f = e.i(934620),
      m = e.i(959411),
      x = Object.defineProperty,
      b = (e, t) => x(e, "name", { value: t, configurable: !0 }),
      [y, v] = (0, o.createContextScope)("Tooltip", [c.createPopperScope]),
      j = (0, c.createPopperScope)(),
      w = "tooltip.open",
      [k, C] = y("TooltipProvider"),
      T = b((e) => {
        let {
            __scopeTooltip: n,
            delayDuration: a = 700,
            skipDelayDuration: i = 300,
            disableHoverableContent: o = !1,
            children: s,
          } = e,
          l = r.useRef(!0),
          c = r.useRef(!1),
          d = r.useRef(0);
        return (
          r.useEffect(() => {
            let e = d.current;
            return () => window.clearTimeout(e);
          }, []),
          (0, t.jsx)(k, {
            scope: n,
            isOpenDelayedRef: l,
            delayDuration: a,
            onOpen: r.useCallback(() => {
              i <= 0 || (window.clearTimeout(d.current), (l.current = !1));
            }, [i]),
            onClose: r.useCallback(() => {
              i <= 0 ||
                (window.clearTimeout(d.current),
                (d.current = window.setTimeout(() => (l.current = !0), i)));
            }, [i]),
            isPointerInTransitRef: c,
            onPointerInTransitChange: r.useCallback((e) => {
              c.current = e;
            }, []),
            disableHoverableContent: o,
            children: s,
          })
        );
      }, "TooltipProvider"),
      D = "Tooltip",
      [N, P] = y(D),
      E = b((e) => {
        let {
            __scopeTooltip: n,
            children: a,
            open: i,
            defaultOpen: o,
            onOpenChange: s,
            disableHoverableContent: d,
            delayDuration: u,
          } = e,
          p = C(D, e.__scopeTooltip),
          h = j(n),
          [f, m] = r.useState(null),
          [x, y] = r.useState(void 0),
          v = (0, l.useId)(),
          k = r.useRef(0),
          T = d ?? p.disableHoverableContent,
          P = u ?? p.delayDuration,
          E = r.useRef(!1),
          [R, S] = (0, g.useControllableState)({
            prop: i,
            defaultProp: o ?? !1,
            onChange: b((e) => {
              (e
                ? (p.onOpen(), document.dispatchEvent(new CustomEvent(w)))
                : p.onClose(),
                s?.(e));
            }, "onChange"),
            caller: D,
          }),
          M = r.useMemo(
            () =>
              R ? (E.current ? "delayed-open" : "instant-open") : "closed",
            [R],
          ),
          O = r.useCallback(() => {
            (window.clearTimeout(k.current),
              (k.current = 0),
              (E.current = !1),
              S(!0));
          }, [S]),
          $ = r.useCallback(() => {
            (window.clearTimeout(k.current), (k.current = 0), S(!1));
          }, [S]),
          A = r.useCallback(() => {
            (window.clearTimeout(k.current),
              (k.current = window.setTimeout(() => {
                ((E.current = !0), S(!0), (k.current = 0));
              }, P)));
          }, [P, S]);
        return (
          r.useEffect(
            () => () => {
              k.current && (window.clearTimeout(k.current), (k.current = 0));
            },
            [],
          ),
          (0, t.jsx)(c.Root, {
            ...h,
            children: (0, t.jsx)(N, {
              scope: n,
              contentId: x ?? v,
              setContentId: y,
              open: R,
              stateAttribute: M,
              trigger: f,
              onTriggerChange: m,
              onTriggerEnter: r.useCallback(() => {
                p.isOpenDelayedRef.current ? A() : O();
              }, [p.isOpenDelayedRef, A, O]),
              onTriggerLeave: r.useCallback(() => {
                T ? $() : (window.clearTimeout(k.current), (k.current = 0));
              }, [$, T]),
              onOpen: O,
              onClose: $,
              disableHoverableContent: T,
              children: a,
            }),
          })
        );
      }, "Tooltip"),
      R = "TooltipTrigger",
      S = r.forwardRef(
        b(function (e, n) {
          let { __scopeTooltip: o, ...s } = e,
            l = P(R, o),
            d = C(R, o),
            u = j(o),
            h = r.useRef(null),
            g = (0, i.useComposedRefs)(n, h, l.onTriggerChange),
            f = r.useRef(!1),
            m = r.useRef(!1),
            x = r.useCallback(() => (f.current = !1), []);
          return (
            r.useEffect(
              () => () => document.removeEventListener("pointerup", x),
              [x],
            ),
            (0, t.jsx)(c.Anchor, {
              asChild: !0,
              ...u,
              children: (0, t.jsx)(p.Primitive.button, {
                "aria-describedby": l.open ? l.contentId : void 0,
                "data-state": l.stateAttribute,
                ...s,
                ref: g,
                onPointerMove: (0, a.composeEventHandlers)(
                  e.onPointerMove,
                  (e) => {
                    "touch" !== e.pointerType &&
                      (m.current ||
                        d.isPointerInTransitRef.current ||
                        (l.onTriggerEnter(), (m.current = !0)));
                  },
                ),
                onPointerLeave: (0, a.composeEventHandlers)(
                  e.onPointerLeave,
                  () => {
                    (l.onTriggerLeave(), (m.current = !1));
                  },
                ),
                onPointerDown: (0, a.composeEventHandlers)(
                  e.onPointerDown,
                  () => {
                    (l.open && l.onClose(),
                      (f.current = !0),
                      document.addEventListener("pointerup", x, { once: !0 }));
                  },
                ),
                onFocus: (0, a.composeEventHandlers)(e.onFocus, () => {
                  f.current || l.onOpen();
                }),
                onBlur: (0, a.composeEventHandlers)(e.onBlur, l.onClose),
                onClick: (0, a.composeEventHandlers)(e.onClick, l.onClose),
              }),
            })
          );
        }, "TooltipTrigger"),
      ),
      M = "TooltipPortal",
      [O, $] = y(M, { forceMount: void 0 }),
      A = b((e) => {
        let { __scopeTooltip: n, forceMount: r, children: a, container: i } = e,
          o = P(M, n);
        return (0, t.jsx)(O, {
          scope: n,
          forceMount: r,
          children: (0, t.jsx)(u.Presence, {
            present: r || o.open,
            children: (0, t.jsx)(d.Portal, {
              asChild: !0,
              container: i,
              children: a,
            }),
          }),
        });
      }, "TooltipPortal"),
      L = "TooltipContent",
      I = r.forwardRef(
        b(function (e, n) {
          let r = $(L, e.__scopeTooltip),
            { forceMount: a = r.forceMount, side: i = "top", ...o } = e,
            s = P(L, e.__scopeTooltip);
          return (0, t.jsx)(u.Presence, {
            present: a || s.open,
            children: s.disableHoverableContent
              ? (0, t.jsx)(z, { side: i, ...o, ref: n })
              : (0, t.jsx)(_, { side: i, ...o, ref: n }),
          });
        }, "TooltipContent"),
      ),
      _ = r.forwardRef(
        b(function (e, n) {
          let a = P(L, e.__scopeTooltip),
            o = C(L, e.__scopeTooltip),
            s = r.useRef(null),
            l = (0, i.useComposedRefs)(n, s),
            [c, d] = r.useState(null),
            { trigger: u, onClose: p } = a,
            h = s.current,
            { onPointerInTransitChange: g } = o,
            f = r.useCallback(() => {
              (d(null), g(!1));
            }, [g]),
            m = r.useCallback(
              (e, t) => {
                let n = e.currentTarget,
                  r = { x: e.clientX, y: e.clientY },
                  a = q(r, n.getBoundingClientRect());
                (d(J([...B(r, a), ...V(t.getBoundingClientRect())])), g(!0));
              },
              [g],
            );
          return (
            r.useEffect(() => () => f(), [f]),
            r.useEffect(() => {
              if (u && h) {
                let e = b((e) => m(e, h), "handleTriggerLeave"),
                  t = b((e) => m(e, u), "handleContentLeave");
                return (
                  u.addEventListener("pointerleave", e),
                  h.addEventListener("pointerleave", t),
                  () => {
                    (u.removeEventListener("pointerleave", e),
                      h.removeEventListener("pointerleave", t));
                  }
                );
              }
            }, [u, h, m, f]),
            r.useEffect(() => {
              if (c) {
                let e = b((e) => {
                  let t = e.target,
                    n = { x: e.clientX, y: e.clientY },
                    r = u?.contains(t) || h?.contains(t),
                    a = !U(n, c);
                  r ? f() : a && (f(), p());
                }, "handleTrackPointerGrace");
                return (
                  document.addEventListener("pointermove", e),
                  () => document.removeEventListener("pointermove", e)
                );
              }
            }, [u, h, c, p, f]),
            (0, t.jsx)(z, { ...e, ref: l })
          );
        }, "TooltipContentHoverable"),
      ),
      H = (0, h.createSlottable)("TooltipContent"),
      z = r.forwardRef(
        b(function (e, n) {
          let {
              __scopeTooltip: a,
              children: i,
              "aria-label": o,
              id: l,
              onEscapeKeyDown: d,
              onPointerDownOutside: u,
              ...p
            } = e,
            h = P(L, a),
            g = j(a),
            { onClose: x } = h;
          (r.useEffect(
            () => (
              document.addEventListener(w, x),
              () => document.removeEventListener(w, x)
            ),
            [x],
          ),
            r.useEffect(() => {
              if (h.trigger) {
                let e = b((e) => {
                  e.target instanceof Node &&
                    e.target.contains(h.trigger) &&
                    x();
                }, "handleScroll");
                return (
                  window.addEventListener("scroll", e, { capture: !0 }),
                  () => window.removeEventListener("scroll", e, { capture: !0 })
                );
              }
            }, [h.trigger, x]));
          let { setContentId: y } = h;
          return (
            (0, f.useLayoutEffect)(
              () => (
                y(l),
                () => {
                  y(void 0);
                }
              ),
              [l, y],
            ),
            (0, t.jsx)(s.DismissableLayer, {
              asChild: !0,
              disableOutsidePointerEvents: !1,
              onEscapeKeyDown: d,
              onPointerDownOutside: u,
              onFocusOutside: (e) => e.preventDefault(),
              onDismiss: x,
              children: (0, t.jsxs)(c.Content, {
                "data-state": h.stateAttribute,
                role: o ? void 0 : "tooltip",
                id: o ? void 0 : h.contentId,
                ...g,
                ...p,
                ref: n,
                style: {
                  ...p.style,
                  "--radix-tooltip-content-transform-origin":
                    "var(--radix-popper-transform-origin)",
                  "--radix-tooltip-content-available-width":
                    "var(--radix-popper-available-width)",
                  "--radix-tooltip-content-available-height":
                    "var(--radix-popper-available-height)",
                  "--radix-tooltip-trigger-width":
                    "var(--radix-popper-anchor-width)",
                  "--radix-tooltip-trigger-height":
                    "var(--radix-popper-anchor-height)",
                },
                children: [
                  (0, t.jsx)(H, { children: i }),
                  o
                    ? (0, t.jsx)(m.Root, {
                        id: h.contentId,
                        role: "tooltip",
                        children: o,
                      })
                    : null,
                ],
              }),
            })
          );
        }, "TooltipContentImpl"),
      ),
      F = r.forwardRef(
        b(function (e, n) {
          let { __scopeTooltip: r, ...a } = e,
            i = j(r);
          return (0, t.jsx)(c.Arrow, { ...i, ...a, ref: n });
        }, "TooltipArrow"),
      );
    function q(e, t) {
      let n = Math.abs(t.top - e.y),
        r = Math.abs(t.bottom - e.y),
        a = Math.abs(t.right - e.x),
        i = Math.abs(t.left - e.x);
      switch (Math.min(n, r, a, i)) {
        case i:
          return "left";
        case a:
          return "right";
        case n:
          return "top";
        case r:
          return "bottom";
        default:
          throw Error("unreachable");
      }
    }
    function B(e, t, n = 5) {
      let r = [];
      switch (t) {
        case "top":
          r.push({ x: e.x - n, y: e.y + n }, { x: e.x + n, y: e.y + n });
          break;
        case "bottom":
          r.push({ x: e.x - n, y: e.y - n }, { x: e.x + n, y: e.y - n });
          break;
        case "left":
          r.push({ x: e.x + n, y: e.y - n }, { x: e.x + n, y: e.y + n });
          break;
        case "right":
          r.push({ x: e.x - n, y: e.y - n }, { x: e.x - n, y: e.y + n });
      }
      return r;
    }
    function V(e) {
      let { top: t, right: n, bottom: r, left: a } = e;
      return [
        { x: a, y: t },
        { x: n, y: t },
        { x: n, y: r },
        { x: a, y: r },
      ];
    }
    function U(e, t) {
      let { x: n, y: r } = e,
        a = !1;
      for (let e = 0, i = t.length - 1; e < t.length; i = e++) {
        let o = t[e],
          s = t[i],
          l = o.x,
          c = o.y,
          d = s.x,
          u = s.y;
        c > r != u > r && n < ((d - l) * (r - c)) / (u - c) + l && (a = !a);
      }
      return a;
    }
    function J(e) {
      let t = e.slice();
      return (
        t.sort((e, t) =>
          e.x < t.x ? -1 : e.x > t.x ? 1 : e.y < t.y ? -1 : 1 * !!(e.y > t.y),
        ),
        W(t)
      );
    }
    function W(e) {
      if (e.length <= 1) return e.slice();
      let t = [];
      for (let n = 0; n < e.length; n++) {
        let r = e[n];
        for (; t.length >= 2; ) {
          let e = t[t.length - 1],
            n = t[t.length - 2];
          if ((e.x - n.x) * (r.y - n.y) >= (e.y - n.y) * (r.x - n.x)) t.pop();
          else break;
        }
        t.push(r);
      }
      t.pop();
      let n = [];
      for (let t = e.length - 1; t >= 0; t--) {
        let r = e[t];
        for (; n.length >= 2; ) {
          let e = n[n.length - 1],
            t = n[n.length - 2];
          if ((e.x - t.x) * (r.y - t.y) >= (e.y - t.y) * (r.x - t.x)) n.pop();
          else break;
        }
        n.push(r);
      }
      return (n.pop(),
      1 === t.length &&
        1 === n.length &&
        t[0].x === n[0].x &&
        t[0].y === n[0].y)
        ? t
        : t.concat(n);
    }
    (b(q, "getExitSideFromRect"),
      b(B, "getPaddedExitPoints"),
      b(V, "getPointsFromRect"),
      b(U, "isPointInPolygon"),
      b(J, "getHull"),
      b(W, "getHullPresorted"),
      e.s(
        [
          "Arrow",
          0,
          F,
          "Content",
          0,
          I,
          "Portal",
          0,
          A,
          "Provider",
          0,
          T,
          "Root",
          0,
          E,
          "Tooltip",
          0,
          E,
          "TooltipArrow",
          0,
          F,
          "TooltipContent",
          0,
          I,
          "TooltipPortal",
          0,
          A,
          "TooltipProvider",
          0,
          T,
          "TooltipTrigger",
          0,
          S,
          "Trigger",
          0,
          S,
          "createTooltipScope",
          0,
          v,
        ],
        186336,
      ),
      e.s(
        [
          "Tooltip",
          0,
          function ({ ...e }) {
            return (0, t.jsx)(E, { "data-slot": "tooltip", ...e });
          },
          "TooltipContent",
          0,
          function ({ className: e, sideOffset: r = 4, children: a, ...i }) {
            return (0, t.jsx)(A, {
              children: (0, t.jsx)(I, {
                "data-slot": "tooltip-content",
                sideOffset: r,
                className: (0, n.cn)(
                  "z-50 overflow-hidden rounded-md bg-slate-900 px-2.5 py-1 text-xs text-slate-50 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                  e,
                ),
                ...i,
                children: a,
              }),
            });
          },
          "TooltipProvider",
          0,
          function ({ delayDuration: e = 150, ...n }) {
            return (0, t.jsx)(T, {
              "data-slot": "tooltip-provider",
              delayDuration: e,
              ...n,
            });
          },
          "TooltipTrigger",
          0,
          function ({ ...e }) {
            return (0, t.jsx)(S, { "data-slot": "tooltip-trigger", ...e });
          },
        ],
        728231,
      ));
  },
  239474,
  501772,
  763870,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(522016),
      r = e.i(647163);
    e.s(
      [
        "CheckoutConsent",
        0,
        function ({ className: e }) {
          return (0, t.jsxs)("p", {
            className: (0, r.cn)("text-[12.5px] leading-5 text-[#787774]", e),
            children: [
              "Chuyển khoản qua mã VietQR, giá đã bao gồm thuế. Bấm Thanh toán là thầy cô đồng ý với",
              " ",
              (0, t.jsx)(n.default, {
                href: "/terms#gia",
                target: "_blank",
                className: "text-[#2383e2] hover:underline",
                children: "Điều khoản sử dụng",
              }),
              " ",
              "và",
              " ",
              (0, t.jsx)(n.default, {
                href: "/privacy",
                target: "_blank",
                className: "text-[#2383e2] hover:underline",
                children: "Chính sách bảo mật",
              }),
              ".",
            ],
          });
        },
      ],
      239474,
    );
    var a = e.i(689664),
      i = e.i(422768),
      o = e.i(508734),
      s = e.i(762368),
      l = e.i(632781),
      c = e.i(741120),
      d = e.i(973134),
      u = e.i(271645),
      p = e.i(167881),
      h = e.i(630374),
      g = e.i(389567),
      f = e.i(407860),
      m = e.i(663756),
      x = e.i(973381);
    function b({ value: e }) {
      let [n, i] = (0, u.useState)(!1);
      return (0, t.jsxs)("button", {
        type: "button",
        onClick: () => {
          (navigator.clipboard?.writeText(e).catch(() => {}),
            i(!0),
            window.setTimeout(() => i(!1), 1400));
        },
        className: (0, r.cn)(
          "inline-flex h-7 shrink-0 items-center gap-1 rounded-md border px-2 text-xs transition-colors",
          n
            ? "border-[#c6dcc9] text-[#448361]"
            : "border-[#e3e2e0] text-[#5f5e5b] hover:bg-[#f1f1ef]",
        ),
        children: [
          n
            ? (0, t.jsx)(a.Check, { "aria-hidden": !0, className: "size-3" })
            : (0, t.jsx)(o.Copy, { "aria-hidden": !0, className: "size-3" }),
          n ? "Đã chép" : "Sao chép",
        ],
      });
    }
    function y({ label: e, value: n, copy: a, highlight: i, mono: o }) {
      return (0, t.jsxs)("div", {
        className: (0, r.cn)(
          "grid grid-cols-[96px_1fr_auto] items-center gap-2 border-t border-[#e9e9e7] px-3 py-2.5 first:border-t-0",
          i && "bg-[#fffbea]",
        ),
        children: [
          (0, t.jsx)("span", {
            className: "text-[13px] text-[#787774]",
            children: e,
          }),
          (0, t.jsx)("b", {
            className: (0, r.cn)(
              "min-w-0 text-[14.5px] break-words",
              o && "font-mono",
              i && "text-lg tracking-wider",
            ),
            children: n,
          }),
          a ? (0, t.jsx)(b, { value: a }) : (0, t.jsx)("span", {}),
        ],
      });
    }
    e.s(
      [
        "CheckoutDialog",
        0,
        function ({ order: e, onClose: o, onRecreate: b, supportZalo: v }) {
          let [j, w] = (0, u.useState)(e),
            [k, C] = (0, u.useState)(""),
            [T, D] = (0, u.useState)(!1),
            [N, P] = (0, u.useState)(!1),
            [E, R] = (0, u.useState)(null),
            [S, M] = (0, u.useState)(""),
            [O, $] = (0, u.useState)(e),
            A = (0, u.useRef)("");
          O !== e && ($(e), w(e), M(""), R(null));
          let L = (function (e) {
              let [t, n] = (0, u.useState)(() => Date.now());
              return ((0, u.useEffect)(() => {
                let e = window.setInterval(() => n(Date.now()), 1e3);
                return () => window.clearInterval(e);
              }, []),
              e)
                ? Math.max(0, Math.floor((new Date(e).getTime() - t) / 1e3))
                : 0;
            })(j?.expiresAt),
            I = j?.payment?.qrPayload;
          (0, u.useEffect)(() => {
            if (!I) return;
            let e = !0;
            return (
              d.default
                .toDataURL(I, {
                  margin: 1,
                  width: 480,
                  errorCorrectionLevel: "M",
                })
                .then((t) => e && C(t))
                .catch(() => e && C("")),
              () => {
                e = !1;
              }
            );
          }, [I]);
          let _ = j?.id,
            H = j?.status;
          async function z() {
            if (j) {
              (D(!0), M(""));
              try {
                (w(await (0, f.checkOrder)(j.id)),
                  P(!0),
                  window.setTimeout(() => P(!1), 2e4));
              } catch (e) {
                M(
                  e instanceof Error
                    ? e.message
                    : "Không kiểm tra được, hãy thử lại.",
                );
              } finally {
                D(!1);
              }
            }
          }
          async function F() {
            if (j) {
              try {
                await (0, f.cancelOrder)(j.id);
              } catch {}
              o();
            }
          }
          ((0, u.useEffect)(() => {
            if (!_ || ("pending" !== H && "expired" !== H)) return;
            let e = !0,
              t = window.setInterval(
                () => {
                  (0, f.getOrder)(_)
                    .then((t) => e && w(t))
                    .catch(() => {});
                },
                "pending" === H ? 3e3 : 1e4,
              );
            return () => {
              ((e = !1), window.clearInterval(t));
            };
          }, [_, H]),
            (0, u.useEffect)(() => {
              "paid" === H &&
                _ &&
                A.current !== _ &&
                ((A.current = _),
                window.dispatchEvent(new Event("exam-quota-change")),
                (0, g.track)("topup_paid", {
                  kind: j?.kind ?? "",
                  amount: j?.paidAmount ?? 0,
                }),
                (0, f.getWallet)()
                  .then((e) => R(e.balance))
                  .catch(() => {}));
            }, [_, H, j?.kind, j?.paidAmount]));
          let q = "expired" === H || ("pending" === H && 0 === L),
            B = "paid" === H,
            V = j?.payment,
            U =
              j?.kind === "package" && j.paidAt && j.validDays
                ? new Date(
                    new Date(j.paidAt).getTime() + 864e5 * j.validDays,
                  ).toISOString()
                : null;
          return (0, t.jsx)(h.Dialog, {
            open: null !== j,
            onOpenChange: (e) => !e && o(),
            children: (0, t.jsx)(h.DialogContent, {
              className: (0, r.cn)(
                "max-h-[92dvh] gap-0 overflow-y-auto rounded-xl border-[#e3e2e0] bg-white p-0 text-[#37352f]",
                B ? "sm:max-w-md" : "sm:max-w-3xl",
              ),
              children:
                j && B
                  ? (0, t.jsxs)("div", {
                      className: "px-7 pt-9 pb-7 text-center",
                      children: [
                        (0, t.jsx)("div", {
                          className:
                            "mx-auto grid size-14 place-items-center rounded-full bg-[#edf3ec] text-[#448361]",
                          children: (0, t.jsx)(a.Check, {
                            "aria-hidden": !0,
                            className: "size-7",
                            strokeWidth: 3,
                          }),
                        }),
                        (0, t.jsx)(h.DialogTitle, {
                          className:
                            "font-display mt-4 text-3xl font-medium tracking-tight",
                          children: "Nạp điểm thành công",
                        }),
                        (0, t.jsxs)(h.DialogDescription, {
                          className: "mt-1 text-[#787774]",
                          children: [
                            "Đã nhận ",
                            (0, m.formatVnd)(j.paidAmount),
                            j.paidAt &&
                              ` l\xfac ${new Date(j.paidAt).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}`,
                          ],
                        }),
                        (0, t.jsxs)("p", {
                          className:
                            "mt-3 text-4xl font-bold tracking-tight text-[#1c3829] tabular-nums",
                          children: [
                            "+",
                            (0, m.formatPoints)(j.creditedPoints),
                            " điểm",
                          ],
                        }),
                        (0, t.jsxs)("div", {
                          className:
                            "mx-auto mt-5 max-w-sm text-left text-[13.5px]",
                          children: [
                            (0, t.jsxs)("div", {
                              className:
                                "flex justify-between border-t border-[#e9e9e7] py-2",
                              children: [
                                (0, t.jsx)("span", {
                                  className: "text-[#787774]",
                                  children:
                                    "package" === j.kind ? "Gói" : "Loại",
                                }),
                                (0, t.jsx)("b", { children: j.label }),
                              ],
                            }),
                            (0, t.jsxs)("div", {
                              className:
                                "flex justify-between border-t border-[#e9e9e7] py-2",
                              children: [
                                (0, t.jsx)("span", {
                                  className: "text-[#787774]",
                                  children: "Hạn dùng",
                                }),
                                (0, t.jsx)("b", {
                                  children: U
                                    ? (0, m.formatDate)(U)
                                    : "Vĩnh viễn",
                                }),
                              ],
                            }),
                            null !== E &&
                              (0, t.jsxs)("div", {
                                className:
                                  "flex justify-between border-t border-[#e9e9e7] py-2",
                                children: [
                                  (0, t.jsx)("span", {
                                    className: "text-[#787774]",
                                    children: "Số dư mới",
                                  }),
                                  (0, t.jsxs)("b", {
                                    className: "tabular-nums",
                                    children: [(0, m.formatPoints)(E), " điểm"],
                                  }),
                                ],
                              }),
                            (0, t.jsxs)("div", {
                              className:
                                "flex justify-between border-t border-[#e9e9e7] py-2",
                              children: [
                                (0, t.jsx)("span", {
                                  className: "text-[#787774]",
                                  children: "Mã đơn",
                                }),
                                (0, t.jsx)("b", {
                                  className: "font-mono",
                                  children: j.code,
                                }),
                              ],
                            }),
                          ],
                        }),
                        j.note &&
                          (0, t.jsxs)("p", {
                            className:
                              "mx-auto mt-3 max-w-sm rounded-lg bg-[#fbf3db] px-3 py-2 text-left text-[12.5px] whitespace-pre-line text-[#6b5016]",
                            children: [
                              j.note,
                              "\n",
                              "Cần điều chỉnh, thầy cô nhắn ",
                              (0, t.jsx)(x.ZaloLink, { phone: v }),
                              " kèm mã đơn ",
                              j.code,
                              ".",
                            ],
                          }),
                        (0, t.jsxs)("div", {
                          className: "mt-6 flex justify-center gap-2",
                          children: [
                            (0, t.jsx)(p.Button, {
                              variant: "outline",
                              asChild: !0,
                              children: (0, t.jsx)(n.default, {
                                href: "/profile",
                                onClick: o,
                                children: "Xem ví điểm",
                              }),
                            }),
                            (0, t.jsx)(p.Button, {
                              onClick: o,
                              children: "Xong",
                            }),
                          ],
                        }),
                      ],
                    })
                  : j && V
                    ? (0, t.jsxs)(t.Fragment, {
                        children: [
                          (0, t.jsxs)("div", {
                            className:
                              "border-b border-[#e9e9e7] px-5 py-4 pr-12",
                            children: [
                              (0, t.jsx)(h.DialogTitle, {
                                className: "text-base font-semibold",
                                children: "Quét mã để thanh toán",
                              }),
                              (0, t.jsx)(h.DialogDescription, {
                                className: "sr-only",
                                children:
                                  "Chuyển khoản đúng số tiền và nội dung để được cộng điểm tự động.",
                              }),
                            ],
                          }),
                          (0, t.jsxs)("div", {
                            className: "grid sm:grid-cols-[300px_1fr]",
                            children: [
                              (0, t.jsxs)("div", {
                                className:
                                  "flex flex-col items-center border-b border-[#e9e9e7] bg-[#f7f6f3] p-5 sm:border-r sm:border-b-0",
                                children: [
                                  (0, t.jsxs)("div", {
                                    className:
                                      "relative w-[248px] rounded-xl border border-[#e3e2e0] bg-white p-3.5",
                                    children: [
                                      (0, t.jsxs)("div", {
                                        className:
                                          "mb-2 flex items-center justify-between text-[11px] text-[#787774]",
                                        children: [
                                          (0, t.jsx)("b", {
                                            className:
                                              "tracking-wide text-[#0f2f8a]",
                                            children: "VIETQR",
                                          }),
                                          (0, t.jsxs)("span", {
                                            children: [
                                              "napas 247 · ",
                                              V.bankName,
                                            ],
                                          }),
                                        ],
                                      }),
                                      k
                                        ? (0, t.jsx)("img", {
                                            src: k,
                                            alt: `M\xe3 QR chuyển ${(0, m.formatVnd)(V.amount)} tới ${V.bankName}`,
                                            className:
                                              "block size-[218px] [image-rendering:pixelated]",
                                          })
                                        : (0, t.jsx)("div", {
                                            className:
                                              "grid size-[218px] place-items-center",
                                            children: (0, t.jsx)(l.Loader2, {
                                              "aria-hidden": !0,
                                              className:
                                                "size-5 animate-spin text-[#9b9a97]",
                                            }),
                                          }),
                                      q &&
                                        (0, t.jsxs)("div", {
                                          className:
                                            "absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-xl bg-white/95 p-5 text-center",
                                          children: [
                                            (0, t.jsx)("b", {
                                              children: "Mã QR đã hết hạn",
                                            }),
                                            (0, t.jsx)("span", {
                                              className:
                                                "text-[12.5px] text-[#787774]",
                                              children:
                                                "Nếu thầy cô đã chuyển khoản, điểm vẫn được cộng khi hệ thống nhận được tiền.",
                                            }),
                                            b &&
                                              (0, t.jsxs)(p.Button, {
                                                size: "sm",
                                                onClick: () => b(j),
                                                children: [
                                                  (0, t.jsx)(c.RefreshCw, {
                                                    "aria-hidden": !0,
                                                  }),
                                                  " Tạo mã mới",
                                                ],
                                              }),
                                          ],
                                        }),
                                    ],
                                  }),
                                  (0, t.jsx)("p", {
                                    className:
                                      "mt-3 text-[13px] text-[#787774]",
                                    children: q
                                      ? (0, t.jsx)("span", {
                                          className: "text-[#eb5757]",
                                          children: "Mã đã hết hạn",
                                        })
                                      : (0, t.jsxs)(t.Fragment, {
                                          children: [
                                            "Mã hết hạn sau",
                                            " ",
                                            (0, t.jsxs)("b", {
                                              className:
                                                "text-[#37352f] tabular-nums",
                                              children: [
                                                String(
                                                  Math.floor(L / 60),
                                                ).padStart(2, "0"),
                                                ":",
                                                String(L % 60).padStart(2, "0"),
                                              ],
                                            }),
                                          ],
                                        }),
                                  }),
                                  (0, t.jsxs)(p.Button, {
                                    variant: "outline",
                                    size: "sm",
                                    className: "mt-2",
                                    disabled: !k,
                                    onClick: function () {
                                      if (!k || !j) return;
                                      let e = document.createElement("a");
                                      ((e.href = k),
                                        (e.download = `soandethi-${j.code}.png`),
                                        e.click());
                                    },
                                    children: [
                                      (0, t.jsx)(s.Download, {
                                        "aria-hidden": !0,
                                      }),
                                      " Lưu ảnh QR",
                                    ],
                                  }),
                                ],
                              }),
                              (0, t.jsxs)("div", {
                                className: "p-5",
                                children: [
                                  (0, t.jsxs)("div", {
                                    className:
                                      "overflow-hidden rounded-lg border border-[#e3e2e0]",
                                    children: [
                                      (0, t.jsx)(y, {
                                        label: "Ngân hàng",
                                        value: V.bankName,
                                      }),
                                      (0, t.jsx)(y, {
                                        label: "Số tài khoản",
                                        value: V.accountNumber,
                                        copy: V.accountNumber,
                                        mono: !0,
                                      }),
                                      (0, t.jsx)(y, {
                                        label: "Chủ tài khoản",
                                        value: V.accountName,
                                      }),
                                      (0, t.jsx)(y, {
                                        label: "Số tiền",
                                        value: (0, m.formatVnd)(V.amount),
                                        copy: String(V.amount),
                                      }),
                                      (0, t.jsx)(y, {
                                        label: "Nội dung",
                                        value: V.content,
                                        copy: V.content,
                                        highlight: !0,
                                        mono: !0,
                                      }),
                                    ],
                                  }),
                                  (0, t.jsxs)("p", {
                                    className:
                                      "mt-3 rounded-lg bg-[#fbf3db] px-3 py-2 text-[12.5px] text-[#6b5016]",
                                    children: [
                                      "Mở ứng dụng ngân hàng, chọn quét mã QR. Vui lòng ",
                                      (0, t.jsx)("b", {
                                        children:
                                          "giữ nguyên số tiền và nội dung",
                                      }),
                                      " để điểm được cộng tự động. Nếu chuyển khoản tay, thầy cô nhập nội dung y hệt ở trên.",
                                    ],
                                  }),
                                  (0, t.jsxs)("div", {
                                    role: "status",
                                    className:
                                      "mt-3 flex items-center gap-3 rounded-lg border border-[#e3e2e0] p-3",
                                    children: [
                                      (0, t.jsx)(l.Loader2, {
                                        "aria-hidden": !0,
                                        className:
                                          "size-4 shrink-0 animate-spin text-[#2383e2]",
                                      }),
                                      (0, t.jsxs)("div", {
                                        children: [
                                          (0, t.jsx)("p", {
                                            className:
                                              "text-[13.5px] font-semibold",
                                            children: N
                                              ? "Đang kiểm tra giao dịch…"
                                              : "Đang chờ thanh toán…",
                                          }),
                                          (0, t.jsx)("p", {
                                            className: "text-xs text-[#787774]",
                                            children:
                                              "Trang tự cập nhật khi nhận được tiền, thường trong khoảng 1 phút. Thầy cô có thể đóng hộp này, đơn vẫn được giữ.",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, t.jsxs)("p", {
                                    className:
                                      "mt-3 text-xs leading-5 text-[#787774]",
                                    children: [
                                      "Đã chuyển khoản hơn 5 phút mà chưa nhận được điểm? Thầy cô nhắn ",
                                      (0, t.jsx)(x.ZaloLink, { phone: v }),
                                      " kèm mã đơn ",
                                      (0, t.jsx)("b", {
                                        className: "font-mono",
                                        children: j.code,
                                      }),
                                      ".",
                                    ],
                                  }),
                                  S &&
                                    (0, t.jsxs)("p", {
                                      role: "alert",
                                      className:
                                        "mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700",
                                      children: [
                                        (0, t.jsx)(i.CircleAlert, {
                                          "aria-hidden": !0,
                                          className: "size-4",
                                        }),
                                        " ",
                                        S,
                                      ],
                                    }),
                                ],
                              }),
                            ],
                          }),
                          (0, t.jsxs)("div", {
                            className:
                              "flex flex-wrap items-center justify-between gap-3 border-t border-[#e9e9e7] px-5 py-3.5",
                            children: [
                              (0, t.jsxs)("span", {
                                className: "text-[12.5px] text-[#787774]",
                                children: [
                                  j.label,
                                  " · ",
                                  (0, m.formatPoints)(j.points + j.bonusPoints),
                                  " điểm · mã đơn ",
                                  j.code,
                                ],
                              }),
                              (0, t.jsxs)("div", {
                                className: "flex gap-2",
                                children: [
                                  "pending" === H &&
                                    (0, t.jsx)(p.Button, {
                                      variant: "outline",
                                      onClick: () => void F(),
                                      children: "Huỷ đơn",
                                    }),
                                  (0, t.jsxs)(p.Button, {
                                    disabled: T,
                                    onClick: () => void z(),
                                    children: [
                                      T &&
                                        (0, t.jsx)(l.Loader2, {
                                          "aria-hidden": !0,
                                          className: "animate-spin",
                                        }),
                                      "Tôi đã chuyển khoản",
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      })
                    : j
                      ? (0, t.jsxs)("div", {
                          className: "p-6",
                          children: [
                            (0, t.jsxs)(h.DialogTitle, {
                              className: "text-base font-semibold",
                              children: ["Đơn ", j.code],
                            }),
                            (0, t.jsx)(h.DialogDescription, {
                              className: "mt-2",
                              children:
                                "Đơn này đã huỷ. Thầy cô có thể tạo đơn mới ở trang Nạp điểm.",
                            }),
                          ],
                        })
                      : null,
            }),
          });
        },
      ],
      501772,
    );
    var v = e.i(775691);
    e.s(
      [
        "useCheckout",
        0,
        function () {
          let [e, t] = (0, u.useState)(null),
            [n, r] = (0, u.useState)(!1),
            [a, i] = (0, u.useState)(""),
            o = (0, u.useCallback)(async (e) => {
              let n = await (0, f.createOrder)(e);
              ((0, g.track)("topup_order", {
                kind: n.kind,
                amount: n.amountVnd,
              }),
                t(n));
            }, []),
            s = (0, u.useCallback)(
              async (e) => {
                if ((i(""), !(0, v.readSession)()))
                  return void (0, v.requestLogin)({
                    title: "Đăng nhập để nạp điểm",
                    action: "Tiếp tục thanh toán",
                    working: "Đang tạo mã thanh toán…",
                    run: () => o(e),
                    next: "/nap-diem",
                  });
                r(!0);
                try {
                  await o(e);
                } catch (e) {
                  i(
                    e instanceof Error
                      ? e.message
                      : "Không tạo được đơn nạp, hãy thử lại.",
                  );
                } finally {
                  r(!1);
                }
              },
              [o],
            ),
            l = (0, u.useCallback)(
              (e) => {
                (t(null),
                  s(
                    "package" === e.kind && e.packageId
                      ? { kind: "package", packageId: e.packageId }
                      : { kind: "topup", amountVnd: e.amountVnd },
                  ));
              },
              [s],
            );
          return {
            order: e,
            setOrder: t,
            start: s,
            recreate: l,
            busy: n,
            error: a,
            close: () => t(null),
          };
        },
      ],
      763870,
    );
  },
  604131,
  (e) => {
    "use strict";
    var t = e.i(843476),
      n = e.i(271645),
      r = e.i(636607);
    let a = /^::(left|center|right|justify)::[ \t]?/;
    function i(e) {
      let t = a.exec(e);
      return t
        ? { align: t[1], text: e.slice(t[0].length) }
        : { align: void 0, text: e };
    }
    function o(e) {
      return !!e && /<[a-z][\s\S]*>/i.test(e);
    }
    let s =
      /^\s*<(?:p|div|li|blockquote|h[1-6])\b[\s\S]*<\/(?:p|div|li|blockquote|h[1-6])>\s*$/i;
    class l extends n.Component {
      constructor(e) {
        (super(e), (this.state = { hasError: !1 }));
      }
      static getDerivedStateFromError() {
        return { hasError: !0 };
      }
      render() {
        return this.state.hasError
          ? (0, t.jsxs)("span", {
              className:
                "rounded border border-rose-200 bg-rose-50 px-1 py-0.5 font-mono text-xs text-rose-600",
              children: ["$", this.props.fallbackText, "$"],
            })
          : this.props.children;
      }
    }
    let c = [
      [/\\(?:ne|neq)\b/g, "≠"],
      [/\\(?:ge|geq)\b/g, "≥"],
      [/\\(?:le|leq)\b/g, "≤"],
      [/\\pm\b/g, "±"],
      [/\\times\b/g, "×"],
      [/\\cdot\b/g, "·"],
      [/\\approx\b/g, "≈"],
      [/\\infty\b/g, "∞"],
      [/\\alpha\b/g, "α"],
      [/\\beta\b/g, "β"],
      [/\\gamma\b/g, "γ"],
      [/\\Delta\b/g, "Δ"],
      [/\\pi\b/g, "π"],
      [/\\in\b/g, "∈"],
      [/\\notin\b/g, "∉"],
      [/\\angle\b/g, "∠"],
      [/\\triangle\b/g, "△"],
      [/\\(?:circ|degree)\b/g, "°"],
      [/\\rightarrow\b/g, "→"],
      [/\\Rightarrow\b/g, "⇒"],
      [/\\Leftrightarrow\b/g, "⇔"],
    ];
    function d({ math: e }) {
      let n = e.trim();
      if (!n) return null;
      let a = n.replace(/\\ne\b/g, "\\neq");
      return (0, t.jsx)(l, {
        fallbackText: n,
        children: (0, t.jsx)(r.InlineMath, { math: a, errorColor: "#dc2626" }),
      });
    }
    function u({ math: e }) {
      let n = e.trim();
      if (!n) return null;
      let a = n.replace(/\\ne\b/g, "\\neq");
      return (0, t.jsx)(l, {
        fallbackText: n,
        children: (0, t.jsx)(r.BlockMath, { math: a, errorColor: "#dc2626" }),
      });
    }
    let p = {
      left: "block text-left",
      center: "block text-center",
      right: "block text-right",
      justify: "block text-justify",
    };
    function h(e) {
      return e
        ? (function (e) {
            let t = e;
            for (let [e, n] of c) t = t.replace(e, n);
            return t;
          })(e)
            .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
            .map((e, r) =>
              e.startsWith("**") && e.endsWith("**") && e.length > 4
                ? (0, t.jsx)("strong", { children: e.slice(2, -2) }, r)
                : e.startsWith("*") && e.endsWith("*") && e.length > 2
                  ? (0, t.jsx)("em", { children: e.slice(1, -1) }, r)
                  : (0, t.jsx)(n.Fragment, { children: e }, r),
            )
        : null;
    }
    e.s(
      [
        "RichText",
        0,
        function ({ text: e }) {
          return e
            ? (0, t.jsx)(t.Fragment, {
                children: (function (e) {
                  if (!e) return null;
                  let r = (function (e) {
                    if (!e || !o(e)) return e;
                    let t = e.split("\n");
                    return t.some((e) => void 0 !== i(e).align)
                      ? t
                          .map((e) => {
                            let { align: t, text: n } = i(e);
                            if (!t && s.test(n)) return n;
                            let r = t ? ` style="text-align: ${t}"` : "",
                              a = n
                                ? n
                                    .replace(
                                      /\*\*([^*]+)\*\*/g,
                                      "<strong>$1</strong>",
                                    )
                                    .replace(
                                      /(^|[^*])\*([^*]+)\*/g,
                                      "$1<em>$2</em>",
                                    )
                                : "<br>";
                            return `<p${r}>${a}</p>`;
                          })
                          .join("")
                      : e;
                  })(e);
                  if (o(r))
                    return Array.from(
                      new DOMParser().parseFromString(
                        `<body>${r}</body>`,
                        "text/html",
                      ).body.childNodes,
                    ).map((e, r) =>
                      (function e(r, a) {
                        if (r.nodeType === Node.TEXT_NODE) {
                          var i;
                          let e = r.textContent || "";
                          return (0, t.jsx)(
                            n.Fragment,
                            {
                              children: (i = e)
                                ? i
                                    .split(/\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g)
                                    .map((e, r) =>
                                      void 0 === e
                                        ? null
                                        : r % 3 == 1
                                          ? (0, t.jsx)(
                                              u,
                                              { math: e },
                                              `disp-${r}`,
                                            )
                                          : r % 3 == 2
                                            ? (0, t.jsx)(
                                                d,
                                                { math: e },
                                                `inl-${r}`,
                                              )
                                            : (0, t.jsx)(
                                                n.Fragment,
                                                { children: h(e) },
                                                `t-${r}`,
                                              ),
                                    )
                                : null,
                            },
                            a,
                          );
                        }
                        if (r.nodeType === Node.ELEMENT_NODE) {
                          let i = r.tagName.toLowerCase();
                          if (
                            "math" === r.getAttribute("data-type") ||
                            r.classList.contains("math-node")
                          ) {
                            let e = r.getAttribute("data-latex"),
                              n = "";
                            if (e) n = decodeURIComponent(e);
                            else {
                              let e = r.textContent || "",
                                t = /\$\$([\s\S]*?)\$\$|\$([^$]*)\$/g.exec(e);
                              n = t ? (t[1] ?? t[2] ?? "") : e;
                            }
                            return "true" === r.getAttribute("data-display")
                              ? (0, t.jsx)(u, { math: n }, a)
                              : (0, t.jsx)(d, { math: n }, a);
                          }
                          let o = Array.from(r.childNodes).map((t, n) =>
                              e(t, `${a}-${n}`),
                            ),
                            s = {};
                          (r.style.textAlign &&
                            (s.textAlign = r.style.textAlign),
                            r.style.fontSize && (s.fontSize = r.style.fontSize),
                            r.style.lineHeight &&
                              (s.lineHeight = r.style.lineHeight),
                            r.style.marginBottom &&
                              (s.marginBottom = r.style.marginBottom));
                          let l = Object.keys(s).length > 0 ? s : void 0;
                          switch (i) {
                            case "p":
                              return (0, t.jsx)(
                                "p",
                                {
                                  style: l,
                                  className:
                                    "center" === r.style.textAlign
                                      ? "text-center"
                                      : "right" === r.style.textAlign
                                        ? "text-right"
                                        : "justify" === r.style.textAlign
                                          ? "text-justify"
                                          : void 0,
                                  children:
                                    o.length > 0 ? o : (0, t.jsx)("br", {}),
                                },
                                a,
                              );
                            case "strong":
                            case "b":
                              return (0, t.jsx)(
                                "strong",
                                { style: l, children: o },
                                a,
                              );
                            case "em":
                            case "i":
                              return (0, t.jsx)(
                                "em",
                                { style: l, children: o },
                                a,
                              );
                            case "u":
                              return (0, t.jsx)(
                                "u",
                                { style: l, children: o },
                                a,
                              );
                            case "s":
                            case "strike":
                            case "del":
                              return (0, t.jsx)(
                                "s",
                                { style: l, children: o },
                                a,
                              );
                            case "sub":
                              return (0, t.jsx)(
                                "sub",
                                { style: l, children: o },
                                a,
                              );
                            case "sup":
                              return (0, t.jsx)(
                                "sup",
                                { style: l, children: o },
                                a,
                              );
                            case "br":
                              return (0, t.jsx)("br", {}, a);
                            case "span":
                              return (0, t.jsx)(
                                "span",
                                { style: l, children: o },
                                a,
                              );
                            default:
                              return (0, t.jsx)(n.Fragment, { children: o }, a);
                          }
                        }
                        return null;
                      })(e, r),
                    );
                  if (!r) return null;
                  let a = [],
                    l = r
                      .replace(
                        /\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$/g,
                        (e, n, r) => {
                          let i = a.length;
                          return (
                            void 0 !== n
                              ? a.push((0, t.jsx)(u, { math: n }, `bm-${i}`))
                              : a.push(
                                  (0, t.jsx)(d, { math: r ?? "" }, `im-${i}`),
                                ),
                            `\u0000MATH_${i}\u0000`
                          );
                        },
                      )
                      .split("\n")
                      .map(i);
                  return l.map((e, r) => {
                    var i, o;
                    let s = void 0 !== e.align,
                      c = l[r + 1]?.align !== void 0,
                      d =
                        ((i = e.text),
                        (o = a),
                        i
                          ? i
                              .split(/\u0000MATH_(\d+)\u0000/g)
                              .map((e, r) =>
                                r % 2 == 1
                                  ? (o[parseInt(e, 10)] ?? null)
                                  : (0, t.jsx)(
                                      n.Fragment,
                                      { children: h(e) },
                                      r,
                                    ),
                              )
                          : null);
                    return (0, t.jsxs)(
                      n.Fragment,
                      {
                        children: [
                          s
                            ? (0, t.jsx)("span", {
                                className: p[e.align],
                                children: d,
                              })
                            : d,
                          r < l.length - 1 && !s && !c && (0, t.jsx)("br", {}),
                        ],
                      },
                      r,
                    );
                  });
                })(e),
              })
            : null;
        },
      ],
      604131,
    );
  },
  407860,
  973381,
  (e) => {
    "use strict";
    var t = e.i(715760);
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
    e.s(
      [
        "cancelOrder",
        0,
        o,
        "checkOrder",
        0,
        i,
        "createOrder",
        0,
        r,
        "getCatalog",
        0,
        n,
        "getOrder",
        0,
        a,
        "getWallet",
        0,
        l,
        "listOrders",
        0,
        s,
      ],
      407860,
    );
    var c = e.i(843476),
      d = e.i(615227),
      u = e.i(647163);
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
    e.s(
      [
        "ZaloLink",
        0,
        p,
        "ZaloSupportCard",
        0,
        function ({ phone: e, className: t }) {
          return (0, c.jsxs)("div", {
            className: (0, u.cn)(
              "flex items-start gap-3 rounded-xl border border-[#d6e6ff] bg-[#f2f7ff] px-4 py-3.5",
              t,
            ),
            children: [
              (0, c.jsx)("span", {
                className:
                  "grid size-9 shrink-0 place-items-center rounded-full bg-[#0068ff] text-white",
                children: (0, c.jsx)(d.MessageCircle, {
                  "aria-hidden": !0,
                  className: "size-4.5",
                }),
              }),
              (0, c.jsxs)("div", {
                className: "text-[13.5px] leading-6 text-[#37352f]",
                children: [
                  (0, c.jsx)("p", {
                    className: "font-semibold",
                    children: "Thầy cô cần hỗ trợ nạp điểm?",
                  }),
                  (0, c.jsxs)("p", {
                    className: "text-[#5f5e5b]",
                    children: [
                      "Nhắn tin qua ",
                      (0, c.jsx)(p, { phone: e }),
                      " để được hướng dẫn trực tiếp. Nếu đã chuyển khoản mà chưa nhận được điểm, thầy cô gửi kèm mã đơn và ảnh chụp giao dịch, chúng tôi sẽ cộng điểm ngay.",
                    ],
                  }),
                ],
              }),
            ],
          });
        },
      ],
      973381,
    );
  },
  665137,
  (e) => {
    "use strict";
    var t = e.i(715760),
      n = e.i(775691);
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
    e.s([
      "completeOAuth",
      0,
      function (e, t) {
        return a(`/api/auth/oauth/${encodeURIComponent(e)}/callback`, t);
      },
      "completeRegistration",
      0,
      function (e, t) {
        return a("/api/auth/register/verify", { email: e, code: t });
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
      r,
      "login",
      0,
      i,
      "logout",
      0,
      o,
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
        return a("/api/auth/password/reset", {
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
      s,
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
        let [n, r = ""] = e.split("T"),
          a =
            n === t ? "hôm nay" : `ng\xe0y ${n.slice(8, 10)}/${n.slice(5, 7)}`;
        if ("23:59:59" === r) return `đến hết ${a}`;
        let i = r.endsWith(":00") ? r.slice(0, 5) : r;
        return `đến ${i} ${a}`;
      },
      "topupQuote",
      0,
      function (e, t) {
        let n = Math.floor((t * e.topupPointsPer1000) / 1e3),
          r = e.promo?.percent ?? 0,
          a = Math.floor((n * r) / 100);
        return { base: n, bonus: a, total: n + a, percent: r };
      },
    ]);
  },
  326999,
  (e) => {
    "use strict";
    var t = e.i(271645),
      n = e.i(981140),
      r = e.i(820783),
      a = e.i(30030),
      i = e.i(610772),
      o = e.i(369340),
      s = e.i(726330),
      l = e.i(765491),
      c = e.i(774606),
      d = e.i(296626),
      u = e.i(248425),
      p = e.i(303536),
      h = e.i(934620),
      g = e.i(985369),
      f = e.i(186312),
      m = e.i(991918),
      x = e.i(843476),
      b = Object.defineProperty,
      y = (e, t) => b(e, "name", { value: t, configurable: !0 }),
      v = "Dialog",
      [j, w] = (0, a.createContextScope)(v),
      [k, C] = j(v),
      T = y((e) => {
        let {
            __scopeDialog: n,
            children: r,
            open: a,
            defaultOpen: s,
            onOpenChange: l,
            modal: c = !0,
          } = e,
          d = t.useRef(null),
          u = t.useRef(null),
          [p, h] = (0, o.useControllableState)({
            prop: a,
            defaultProp: s ?? !1,
            onChange: l,
            caller: v,
          }),
          [g, f] = t.useState(0),
          [m, b] = t.useState(0);
        return (0, x.jsx)(k, {
          scope: n,
          triggerRef: d,
          contentRef: u,
          contentId: (0, i.useId)(),
          titleId: (0, i.useId)(),
          descriptionId: (0, i.useId)(),
          titlePresent: g > 0,
          descriptionPresent: m > 0,
          setTitleCount: f,
          setDescriptionCount: b,
          open: p,
          onOpenChange: h,
          onOpenToggle: t.useCallback(() => h((e) => !e), [h]),
          modal: c,
          children: r,
        });
      }, "Dialog"),
      D = t.forwardRef(
        y(function (e, t) {
          let { __scopeDialog: a, ...i } = e,
            o = C("DialogTrigger", a),
            s = (0, r.useComposedRefs)(t, o.triggerRef);
          return (0, x.jsx)(u.Primitive.button, {
            type: "button",
            "aria-haspopup": "dialog",
            "aria-expanded": o.open,
            "aria-controls": o.open ? o.contentId : void 0,
            "data-state": V(o.open),
            ...i,
            ref: s,
            onClick: (0, n.composeEventHandlers)(e.onClick, o.onOpenToggle),
          });
        }, "DialogTrigger"),
      ),
      N = "DialogPortal",
      [P, E] = j(N, { forceMount: void 0 }),
      R = y((e) => {
        let { __scopeDialog: n, forceMount: r, children: a, container: i } = e,
          o = C(N, n);
        return (0, x.jsx)(P, {
          scope: n,
          forceMount: r,
          children: t.Children.map(a, (e) =>
            (0, x.jsx)(d.Presence, {
              present: r || o.open,
              children: (0, x.jsx)(c.Portal, {
                asChild: !0,
                container: i,
                children: e,
              }),
            }),
          ),
        });
      }, "DialogPortal"),
      S = "DialogOverlay",
      M = t.forwardRef(
        y(function (e, t) {
          let n = E(S, e.__scopeDialog),
            { forceMount: r = n.forceMount, ...a } = e,
            i = C(S, e.__scopeDialog);
          return i.modal
            ? (0, x.jsx)(d.Presence, {
                present: r || i.open,
                children: (0, x.jsx)($, { ...a, ref: t }),
              })
            : null;
        }, "DialogOverlay"),
      ),
      O = (0, m.createSlot)("DialogOverlay.RemoveScroll"),
      $ = t.forwardRef(
        y(function (e, t) {
          let { __scopeDialog: n, ...a } = e,
            i = C(S, n),
            o = (0, s.useDismissableLayerSurface)(),
            l = (0, r.useComposedRefs)(t, o);
          return (0, x.jsx)(g.RemoveScroll, {
            as: O,
            allowPinchZoom: !0,
            shards: [i.contentRef],
            children: (0, x.jsx)(u.Primitive.div, {
              "data-state": V(i.open),
              ...a,
              ref: l,
              style: { pointerEvents: "auto", ...a.style },
            }),
          });
        }, "DialogOverlayImpl"),
      ),
      A = "DialogContent",
      L = t.forwardRef(
        y(function (e, t) {
          let n = E(A, e.__scopeDialog),
            { forceMount: r = n.forceMount, ...a } = e,
            i = C(A, e.__scopeDialog);
          return (0, x.jsx)(d.Presence, {
            present: r || i.open,
            children: i.modal
              ? (0, x.jsx)(I, { ...a, ref: t })
              : (0, x.jsx)(_, { ...a, ref: t }),
          });
        }, "DialogContent"),
      ),
      I = t.forwardRef(
        y(function (e, a) {
          let i = C(A, e.__scopeDialog),
            o = t.useRef(null),
            s = (0, r.useComposedRefs)(a, i.contentRef, o);
          return (
            t.useEffect(() => {
              let e = o.current;
              if (e) return (0, f.hideOthers)(e);
            }, []),
            (0, x.jsx)(H, {
              ...e,
              ref: s,
              trapFocus: i.open,
              disableOutsidePointerEvents: i.open,
              onCloseAutoFocus: (0, n.composeEventHandlers)(
                e.onCloseAutoFocus,
                (e) => {
                  (e.preventDefault(), i.triggerRef.current?.focus());
                },
              ),
              onPointerDownOutside: (0, n.composeEventHandlers)(
                e.onPointerDownOutside,
                (e) => {
                  let t = e.detail.originalEvent,
                    n = 0 === t.button && !0 === t.ctrlKey;
                  (2 === t.button || n) && e.preventDefault();
                },
              ),
              onFocusOutside: (0, n.composeEventHandlers)(
                e.onFocusOutside,
                (e) => e.preventDefault(),
              ),
            })
          );
        }, "DialogContentModal"),
      ),
      _ = t.forwardRef(
        y(function (e, n) {
          let r = C(A, e.__scopeDialog),
            a = t.useRef(!1),
            i = t.useRef(!1);
          return (0, x.jsx)(H, {
            ...e,
            ref: n,
            trapFocus: !1,
            disableOutsidePointerEvents: !1,
            onCloseAutoFocus: (t) => {
              (e.onCloseAutoFocus?.(t),
                t.defaultPrevented ||
                  (a.current || r.triggerRef.current?.focus(),
                  t.preventDefault()),
                (a.current = !1),
                (i.current = !1));
            },
            onInteractOutside: (t) => {
              (e.onInteractOutside?.(t),
                t.defaultPrevented ||
                  ((a.current = !0),
                  "pointerdown" === t.detail.originalEvent.type &&
                    (i.current = !0)));
              let n = t.target;
              (r.triggerRef.current?.contains(n) && t.preventDefault(),
                "focusin" === t.detail.originalEvent.type &&
                  i.current &&
                  t.preventDefault());
            },
          });
        }, "DialogContentNonModal"),
      ),
      H = t.forwardRef(
        y(function (e, t) {
          let {
              __scopeDialog: n,
              trapFocus: r,
              onOpenAutoFocus: a,
              onCloseAutoFocus: i,
              ...o
            } = e,
            c = C(A, n);
          return (
            (0, p.useFocusGuards)(),
            (0, x.jsx)(x.Fragment, {
              children: (0, x.jsx)(l.FocusScope, {
                asChild: !0,
                loop: !0,
                trapped: r,
                onMountAutoFocus: a,
                onUnmountAutoFocus: i,
                children: (0, x.jsx)(s.DismissableLayer, {
                  role: "dialog",
                  id: c.contentId,
                  "aria-describedby": c.descriptionPresent
                    ? c.descriptionId
                    : void 0,
                  "aria-labelledby": c.titlePresent ? c.titleId : void 0,
                  "data-state": V(c.open),
                  ...o,
                  ref: t,
                  deferPointerDownOutside: !0,
                  onDismiss: () => c.onOpenChange(!1),
                }),
              }),
            })
          );
        }, "DialogContentImpl"),
      ),
      z = t.forwardRef(
        y(function (e, t) {
          let { __scopeDialog: n, ...r } = e,
            a = C("DialogTitle", n),
            { setTitleCount: i } = a;
          return (
            (0, h.useLayoutEffect)(
              () => (i((e) => e + 1), () => i((e) => e - 1)),
              [i],
            ),
            (0, x.jsx)(u.Primitive.h2, { id: a.titleId, ...r, ref: t })
          );
        }, "DialogTitle"),
      ),
      F = t.forwardRef(
        y(function (e, t) {
          let { __scopeDialog: n, ...r } = e,
            a = C("DialogDescription", n),
            { setDescriptionCount: i } = a;
          return (
            (0, h.useLayoutEffect)(
              () => (i((e) => e + 1), () => i((e) => e - 1)),
              [i],
            ),
            (0, x.jsx)(u.Primitive.p, { id: a.descriptionId, ...r, ref: t })
          );
        }, "DialogDescription"),
      ),
      q = t.forwardRef(
        y(function (e, t) {
          let { __scopeDialog: r, ...a } = e,
            i = C("DialogClose", r);
          return (0, x.jsx)(u.Primitive.button, {
            type: "button",
            ...a,
            ref: t,
            onClick: (0, n.composeEventHandlers)(e.onClick, () =>
              i.onOpenChange(!1),
            ),
          });
        }, "DialogClose"),
      ),
      B = y((e) => e.children, "WarningProvider");
    function V(e) {
      return e ? "open" : "closed";
    }
    (y(V, "getState"),
      e.s([
        "Close",
        0,
        q,
        "Content",
        0,
        L,
        "Description",
        0,
        F,
        "Dialog",
        0,
        T,
        "DialogClose",
        0,
        q,
        "DialogContent",
        0,
        L,
        "DialogDescription",
        0,
        F,
        "DialogOverlay",
        0,
        M,
        "DialogPortal",
        0,
        R,
        "DialogTitle",
        0,
        z,
        "DialogTrigger",
        0,
        D,
        "Overlay",
        0,
        M,
        "Portal",
        0,
        R,
        "Root",
        0,
        T,
        "Title",
        0,
        z,
        "Trigger",
        0,
        D,
        "WarningProvider",
        0,
        B,
        "createDialogScope",
        0,
        w,
      ]));
  },
  964053,
  (e) => {
    "use strict";
    var t = e.i(326999);
    e.s(["Dialog", 0, t]);
  },
  643957,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("check", [
      ["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }],
    ]);
    e.s(["default", 0, t]);
  },
  716327,
  (e) => {
    "use strict";
    var t = e.i(26495);
    e.s(["ChevronDown", () => t.default]);
  },
  986253,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("chevron-right", [
      ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }],
    ]);
    e.s(["default", 0, t]);
  },
  762368,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("download", [
      ["path", { d: "M12 15V3", key: "m9g1x1" }],
      [
        "path",
        { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" },
      ],
      ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }],
    ]);
    e.s(["Download", 0, t], 762368);
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
    let r = (0, t.default)("user-round", [
      ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
      ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }],
    ]);
    e.s(["UserRound", 0, r], 765649);
  },
  7891,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("pen-line", [
      ["path", { d: "M13 21h8", key: "1jsn5i" }],
      [
        "path",
        {
          d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
          key: "1a8usu",
        },
      ],
    ]);
    e.s(["default", 0, t]);
  },
  395925,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("rotate-ccw", [
      [
        "path",
        {
          d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
          key: "1357e3",
        },
      ],
      ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
    ]);
    e.s(["RotateCcw", 0, t], 395925);
  },
  929272,
  89011,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("square", [
      [
        "rect",
        { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" },
      ],
    ]);
    e.s(["Square", 0, t], 929272);
    var n = e.i(843476),
      r = e.i(728231);
    e.s(
      [
        "ToolbarTooltip",
        0,
        function ({ label: e, children: t }) {
          return (0, n.jsxs)(r.Tooltip, {
            children: [
              (0, n.jsx)(r.TooltipTrigger, { asChild: !0, children: t }),
              (0, n.jsx)(r.TooltipContent, {
                side: "bottom",
                sideOffset: 8,
                collisionPadding: 8,
                className: "pointer-events-none z-[60] max-w-64 text-center",
                children: e,
              }),
            ],
          });
        },
      ],
      89011,
    );
  },
  853138,
  (e) => {
    "use strict";
    var t = e.i(755566);
    e.s(["AlertTriangle", () => t.default]);
  },
  994533,
  524815,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("wand-sparkles", [
      [
        "path",
        {
          d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
          key: "ul74o6",
        },
      ],
      ["path", { d: "m14 7 3 3", key: "1r5n42" }],
      ["path", { d: "M5 6v4", key: "ilb8ba" }],
      ["path", { d: "M19 14v4", key: "blhpug" }],
      ["path", { d: "M10 2v2", key: "7u0qdc" }],
      ["path", { d: "M7 8H3", key: "zfb6yr" }],
      ["path", { d: "M21 16h-4", key: "1cnmox" }],
      ["path", { d: "M11 3H9", key: "1obp7u" }],
    ]);
    e.s(["Wand2", 0, t], 994533);
    var n = e.i(271645);
    let r = "boardrenderer-import";
    async function a(e) {
      let t = new Blob([e])
        .stream()
        .pipeThrough(new DecompressionStream("deflate"));
      return new TextDecoder().decode(await new Response(t).arrayBuffer());
    }
    async function i(e) {
      if (e.length < 8 || 80 !== e[1] || 78 !== e[2] || 71 !== e[3])
        return null;
      let t = new DataView(e.buffer, e.byteOffset, e.byteLength);
      for (let n = 8; n + 12 <= e.length; ) {
        let r = t.getUint32(n),
          i = String.fromCharCode(...e.subarray(n + 4, n + 8));
        if ("tEXt" === i) {
          let t = e.subarray(n + 8, n + 8 + r),
            i = t.indexOf(0);
          if (
            i > 0 &&
            "boardrenderer" === new TextDecoder().decode(t.subarray(0, i))
          )
            try {
              let e = Uint8Array.from(
                  atob(new TextDecoder().decode(t.subarray(i + 1))),
                  (e) => e.charCodeAt(0),
                ),
                n = JSON.parse(await a(e));
              return n?.clip && Array.isArray(n.clip.strokes) ? n.clip : null;
            } catch {
              break;
            }
        }
        if ("IEND" === i) break;
        n += 12 + r;
      }
      return null;
    }
    let o = new Map();
    function s(e) {
      if (!e || !(/^data:image\/png/i.test(e) || /^https?:/i.test(e)))
        return Promise.resolve(null);
      let t = o.get(e);
      return (
        t ||
          ((t = fetch(e)
            .then((e) => (e.ok ? e.arrayBuffer() : null))
            .then((e) => (e ? i(new Uint8Array(e)) : null))
            .catch(() => null)),
          o.set(e, t)),
        t
      );
    }
    async function l(e) {
      let t = await s(e);
      if (!t) return !1;
      try {
        localStorage.setItem(r, JSON.stringify({ clip: t, at: Date.now() }));
      } catch {
        return !1;
      }
      return (window.open("/board-renderer?import=1", "_blank"), !0);
    }
    e.s(
      [
        "BOARD_IMPORT_KEY",
        0,
        r,
        "boardImageFromHtml",
        0,
        function (e) {
          if (!e || !e.includes("data-boardrenderer")) return null;
          let t = e.match(/<img\b[^>]*data-boardrenderer[^>]*>/i)?.[0],
            n = t?.match(
              /\bsrc="(data:image\/png;base64,[A-Za-z0-9+/=]+)"/i,
            )?.[1];
          if (!t || !n) return null;
          let r = (e) =>
            Number(t.match(RegExp(`\\b${e}="(\\d+(?:\\.\\d+)?)"`, "i"))?.[1]) ||
            0;
          return { src: n, width: r("width"), height: r("height") };
        },
        "openInBoard",
        0,
        l,
        "useIsBoardImage",
        0,
        function (e, t = !0) {
          let [r, a] = (0, n.useState)({ src: "", yes: !1 });
          return (
            (0, n.useEffect)(() => {
              if (!t || !e) return;
              let n = !0;
              return (
                s(e).then((t) => {
                  n && a({ src: e, yes: !!t });
                }),
                () => {
                  n = !1;
                }
              );
            }, [e, t]),
            r.src === e && r.yes
          );
        },
      ],
      524815,
    );
  },
  814387,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("x", [
      ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
      ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
    ]);
    e.s(["default", 0, t]);
  },
  263676,
  (e) => {
    "use strict";
    var t = e.i(814387);
    e.s(["X", () => t.default]);
  },
]);
