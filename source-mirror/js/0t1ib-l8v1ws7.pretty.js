(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  470152,
  999682,
  (e) => {
    "use strict";
    function t(e, [r, n]) {
      return Math.min(n, Math.max(r, e));
    }
    ((0, Object.defineProperty)(t, "name", {
      value: "clamp",
      configurable: !0,
    }),
      e.s(["clamp", 0, t], 470152));
    var r = e.i(271645);
    function n(e) {
      let t = r.useRef({ value: e, previous: e });
      return r.useMemo(
        () => (
          t.current.value !== e &&
            ((t.current.previous = t.current.value), (t.current.value = e)),
          t.current.previous
        ),
        [e],
      );
    }
    ((0, Object.defineProperty)(n, "name", {
      value: "usePrevious",
      configurable: !0,
    }),
      e.s(["usePrevious", 0, n], 999682));
  },
  129402,
  (e) => {
    "use strict";
    var t = e.i(271645),
      r = e.i(174080),
      n = e.i(470152),
      o = e.i(981140),
      l = e.i(75830),
      i = e.i(820783),
      a = e.i(30030),
      s = e.i(586318),
      c = e.i(726330),
      u = e.i(303536),
      d = e.i(765491),
      p = e.i(610772),
      f = e.i(853660),
      v = e.i(774606),
      h = e.i(296626),
      m = e.i(248425),
      S = e.i(991918),
      g = e.i(30207),
      w = e.i(369340),
      x = e.i(934620),
      y = e.i(999682),
      b = e.i(959411),
      C = e.i(186312),
      P = e.i(985369),
      E = e.i(843476),
      I = Object.defineProperty,
      R = (e, t) => I(e, "name", { value: t, configurable: !0 }),
      j = [" ", "Enter", "ArrowUp", "ArrowDown"],
      T = [" ", "Enter"],
      L = "Select",
      [k, D, H] = (0, l.createCollection)(L),
      [M, B] = (0, a.createContextScope)(L, [H, f.createPopperScope]),
      A = (0, f.createPopperScope)(),
      [_, V] = M(L),
      [O, F] = M(L);
    function K(e) {
      let {
          __scopeSelect: r,
          children: n,
          open: o,
          defaultOpen: l,
          onOpenChange: i,
          value: a,
          defaultValue: c,
          onValueChange: u,
          dir: d,
          name: v,
          autoComplete: h,
          disabled: m,
          required: S,
          form: g,
          internal_do_not_use_render: x,
        } = e,
        y = A(r),
        [b, C] = t.useState(null),
        [P, I] = t.useState(null),
        [j, T] = t.useState(!1),
        D = (0, s.useDirection)(d),
        [H, M] = (0, w.useControllableState)({
          prop: o,
          defaultProp: l ?? !1,
          onChange: i,
          caller: L,
        }),
        [B, V] = (0, w.useControllableState)({
          prop: a,
          defaultProp: c,
          onChange: u,
          caller: L,
        }),
        F = t.useRef(null),
        K = t.useRef(B);
      t.useEffect(() => {
        let e = g ? b?.ownerDocument.getElementById(g) : b?.form;
        if (e instanceof HTMLFormElement) {
          let t = R(() => V(K.current), "reset");
          return (
            e.addEventListener("reset", t),
            () => e.removeEventListener("reset", t)
          );
        }
      }, [g, b, V]);
      let U = !b || !!g || !!b.closest("form"),
        [N, W] = t.useState(new Set()),
        z = (0, p.useId)(),
        G = Array.from(N)
          .map((e) => e.props.value)
          .join(";"),
        Y = t.useCallback((e) => {
          W((t) => new Set(t).add(e));
        }, []),
        q = t.useCallback((e) => {
          W((t) => {
            let r = new Set(t);
            return (r.delete(e), r);
          });
        }, []),
        X = {
          required: S,
          trigger: b,
          onTriggerChange: C,
          valueNode: P,
          onValueNodeChange: I,
          valueNodeHasChildren: j,
          onValueNodeHasChildrenChange: T,
          contentId: z,
          value: B,
          onValueChange: V,
          open: H,
          onOpenChange: M,
          dir: D,
          triggerPointerDownPosRef: F,
          disabled: m,
          name: v,
          autoComplete: h,
          form: g,
          nativeOptions: N,
          nativeSelectKey: G,
          isFormControl: U,
        };
      return (0, E.jsx)(f.Root, {
        ...y,
        children: (0, E.jsx)(_, {
          scope: r,
          ...X,
          children: (0, E.jsx)(k.Provider, {
            scope: r,
            children: (0, E.jsx)(O, {
              scope: r,
              onNativeOptionAdd: Y,
              onNativeOptionRemove: q,
              children: eR(x) ? x(X) : n,
            }),
          }),
        }),
      });
    }
    R(K, "SelectProvider");
    var U = R((e) => {
        let { __scopeSelect: t, children: r, ...n } = e;
        return (0, E.jsx)(K, {
          __scopeSelect: t,
          ...n,
          internal_do_not_use_render: ({ isFormControl: e }) =>
            (0, E.jsxs)(E.Fragment, {
              children: [r, e ? (0, E.jsx)(eI, { __scopeSelect: t }) : null],
            }),
        });
      }, "Select"),
      N = t.forwardRef(
        R(function (e, r) {
          let { __scopeSelect: n, disabled: l = !1, ...a } = e,
            s = A(n),
            c = V("SelectTrigger", n),
            u = c.disabled || l,
            d = (0, i.useComposedRefs)(r, c.onTriggerChange),
            p = D(n),
            v = t.useRef("touch"),
            [h, S, g] = eT((e) => {
              let t = p().filter((e) => !e.disabled),
                r = t.find((e) => e.value === c.value),
                n = eL(t, e, r);
              void 0 !== n && c.onValueChange(n.value);
            }),
            w = R((e) => {
              (u || (c.onOpenChange(!0), g()),
                e &&
                  (c.triggerPointerDownPosRef.current = {
                    x: Math.round(e.pageX),
                    y: Math.round(e.pageY),
                  }));
            }, "handleOpen");
          return (0, E.jsx)(f.Anchor, {
            asChild: !0,
            ...s,
            children: (0, E.jsx)(m.Primitive.button, {
              type: "button",
              role: "combobox",
              "aria-controls": c.open ? c.contentId : void 0,
              "aria-expanded": c.open,
              "aria-required": c.required,
              "aria-autocomplete": "none",
              dir: c.dir,
              "data-state": c.open ? "open" : "closed",
              disabled: u,
              "data-disabled": u ? "" : void 0,
              "data-placeholder": ej(c.value) ? "" : void 0,
              ...a,
              ref: d,
              onClick: (0, o.composeEventHandlers)(a.onClick, (e) => {
                (e.currentTarget.focus(), "mouse" !== v.current && w(e));
              }),
              onPointerDown: (0, o.composeEventHandlers)(
                a.onPointerDown,
                (e) => {
                  v.current = e.pointerType;
                  let t = e.target;
                  (t.hasPointerCapture(e.pointerId) &&
                    t.releasePointerCapture(e.pointerId),
                    0 === e.button &&
                      !1 === e.ctrlKey &&
                      "mouse" === e.pointerType &&
                      (w(e), e.preventDefault()));
                },
              ),
              onKeyDown: (0, o.composeEventHandlers)(a.onKeyDown, (e) => {
                let t = "" !== h.current;
                (e.ctrlKey ||
                  e.altKey ||
                  e.metaKey ||
                  1 !== e.key.length ||
                  S(e.key),
                  (!t || " " !== e.key) &&
                    j.includes(e.key) &&
                    (w(), e.preventDefault()));
              }),
            }),
          });
        }, "SelectTrigger"),
      ),
      W = t.forwardRef(
        R(function (e, r) {
          let {
              __scopeSelect: n,
              className: o,
              style: l,
              children: a,
              placeholder: s = "",
              ...c
            } = e,
            u = V("SelectValue", n),
            { onValueNodeHasChildrenChange: d } = u,
            p = void 0 !== a,
            f = (0, i.useComposedRefs)(r, u.onValueNodeChange);
          (0, x.useLayoutEffect)(() => {
            d(p);
          }, [d, p]);
          let v = ej(u.value);
          return (0, E.jsx)(m.Primitive.span, {
            ...c,
            asChild: !v && c.asChild,
            ref: f,
            style: { pointerEvents: "none" },
            children: (0, E.jsx)(
              t.Fragment,
              { children: v ? s : a },
              v ? "placeholder" : "value",
            ),
          });
        }, "SelectValue"),
      ),
      z = t.forwardRef(
        R(function (e, t) {
          let { __scopeSelect: r, children: n, ...o } = e;
          return (0, E.jsx)(m.Primitive.span, {
            "aria-hidden": !0,
            ...o,
            ref: t,
            children: n || "▼",
          });
        }, "SelectIcon"),
      ),
      [G, Y] = M("SelectPortal", { forceMount: void 0 }),
      q = R((e) => {
        let { __scopeSelect: t, forceMount: r, ...n } = e;
        return (0, E.jsx)(G, {
          scope: e.__scopeSelect,
          forceMount: r,
          children: (0, E.jsx)(v.Portal, { asChild: !0, ...n }),
        });
      }, "SelectPortal"),
      X = "SelectContent",
      Z = t.forwardRef(
        R(function (e, r) {
          let n = Y(X, e.__scopeSelect),
            { forceMount: o = n.forceMount, ...l } = e,
            i = V(X, e.__scopeSelect),
            [a, s] = t.useState();
          return (
            (0, x.useLayoutEffect)(() => {
              s(new DocumentFragment());
            }, []),
            (0, E.jsx)(h.Presence, {
              present: o || i.open,
              children: ({ present: e }) =>
                e
                  ? (0, E.jsx)(et, { ...l, ref: r })
                  : (0, E.jsx)(J, { ...l, fragment: a }),
            })
          );
        }, "SelectContent"),
      ),
      J = t.forwardRef(
        R(function (e, t) {
          let { __scopeSelect: n, children: o, fragment: l } = e;
          return l
            ? r.createPortal(
                (0, E.jsx)(Q, {
                  scope: n,
                  children: (0, E.jsx)(k.Slot, {
                    scope: n,
                    children: (0, E.jsx)("div", { ref: t, children: o }),
                  }),
                }),
                l,
              )
            : null;
        }, "SelectContentFragment"),
      ),
      [Q, $] = M(X),
      ee = (0, S.createSlot)("SelectContent.RemoveScroll"),
      et = t.forwardRef(
        R(function (e, r) {
          let { __scopeSelect: n } = e,
            {
              position: l = "item-aligned",
              onCloseAutoFocus: a,
              onEscapeKeyDown: s,
              onPointerDownOutside: p,
              side: f,
              sideOffset: v,
              align: h,
              alignOffset: m,
              arrowPadding: S,
              collisionBoundary: g,
              collisionPadding: w,
              sticky: x,
              hideWhenDetached: y,
              avoidCollisions: b,
              ...I
            } = e,
            j = V(X, n),
            [T, L] = t.useState(null),
            [k, H] = t.useState(null),
            M = (0, i.useComposedRefs)(r, L),
            [B, A] = t.useState(null),
            [_, O] = t.useState(null),
            F = D(n),
            [K, U] = t.useState(!1),
            N = t.useRef(!1);
          (t.useEffect(() => {
            if (T) return (0, C.hideOthers)(T);
          }, [T]),
            (0, u.useFocusGuards)());
          let W = t.useCallback(
              (e) => {
                let [t, ...r] = F().map((e) => e.ref.current),
                  [n] = r.slice(-1),
                  o = document.activeElement;
                for (let r of e)
                  if (
                    r === o ||
                    (r?.scrollIntoView({ block: "nearest" }),
                    r === t && k && (k.scrollTop = 0),
                    r === n && k && (k.scrollTop = k.scrollHeight),
                    r?.focus(),
                    document.activeElement !== o)
                  )
                    return;
              },
              [F, k],
            ),
            z = t.useCallback(() => W([B, T]), [W, B, T]);
          t.useEffect(() => {
            K && z();
          }, [K, z]);
          let { onOpenChange: G, triggerPointerDownPosRef: Y } = j;
          (t.useEffect(() => {
            if (T) {
              let e = { x: 0, y: 0 },
                t = R((t) => {
                  e = {
                    x: Math.abs(Math.round(t.pageX) - (Y.current?.x ?? 0)),
                    y: Math.abs(Math.round(t.pageY) - (Y.current?.y ?? 0)),
                  };
                }, "handlePointerMove"),
                r = R((r) => {
                  (e.x <= 10 && e.y <= 10
                    ? r.preventDefault()
                    : r.composedPath().includes(T) || G(!1),
                    document.removeEventListener("pointermove", t),
                    (Y.current = null));
                }, "handlePointerUp");
              return (
                null !== Y.current &&
                  (document.addEventListener("pointermove", t),
                  document.addEventListener("pointerup", r, {
                    capture: !0,
                    once: !0,
                  })),
                () => {
                  (document.removeEventListener("pointermove", t),
                    document.removeEventListener("pointerup", r, {
                      capture: !0,
                    }));
                }
              );
            }
          }, [T, G, Y]),
            t.useEffect(() => {
              let e = R(() => G(!1), "close");
              return (
                window.addEventListener("blur", e),
                window.addEventListener("resize", e),
                () => {
                  (window.removeEventListener("blur", e),
                    window.removeEventListener("resize", e));
                }
              );
            }, [G]));
          let [q, Z] = eT((e) => {
              let t = F().filter((e) => !e.disabled),
                r = t.find((e) => e.ref.current === document.activeElement),
                n = eL(t, e, r);
              n && setTimeout(() => n.ref.current?.focus());
            }),
            J = t.useCallback(
              (e, t, r) => {
                let n = !N.current && !r;
                ((void 0 !== j.value && j.value === t) || n) &&
                  (A(e), n && (N.current = !0));
              },
              [j.value],
            ),
            $ = t.useCallback(() => T?.focus(), [T]),
            et = t.useCallback(
              (e, t, r) => {
                let n = !N.current && !r;
                ((void 0 !== j.value && j.value === t) || n) && O(e);
              },
              [j.value],
            ),
            eo = "popper" === l ? en : er;
          return (0, E.jsx)(Q, {
            scope: n,
            content: T,
            viewport: k,
            onViewportChange: H,
            itemRefCallback: J,
            selectedItem: B,
            onItemLeave: $,
            itemTextRefCallback: et,
            focusSelectedItem: z,
            selectedItemText: _,
            position: l,
            isPositioned: K,
            searchRef: q,
            children: (0, E.jsx)(P.RemoveScroll, {
              as: ee,
              allowPinchZoom: !0,
              children: (0, E.jsx)(d.FocusScope, {
                asChild: !0,
                trapped: j.open,
                onMountAutoFocus: (e) => {
                  e.preventDefault();
                },
                onUnmountAutoFocus: (0, o.composeEventHandlers)(a, (e) => {
                  (j.trigger?.focus({ preventScroll: !0 }), e.preventDefault());
                }),
                children: (0, E.jsx)(c.DismissableLayer, {
                  asChild: !0,
                  disableOutsidePointerEvents: !0,
                  onEscapeKeyDown: s,
                  onPointerDownOutside: p,
                  onFocusOutside: (e) => e.preventDefault(),
                  onDismiss: () => j.onOpenChange(!1),
                  children: (0, E.jsx)(eo, {
                    role: "listbox",
                    id: j.contentId,
                    "data-state": j.open ? "open" : "closed",
                    dir: j.dir,
                    onContextMenu: (e) => e.preventDefault(),
                    ...I,
                    ...(eo === en
                      ? {
                          side: f,
                          sideOffset: v,
                          align: h,
                          alignOffset: m,
                          arrowPadding: S,
                          collisionBoundary: g,
                          collisionPadding: w,
                          sticky: x,
                          hideWhenDetached: y,
                          avoidCollisions: b,
                        }
                      : {}),
                    onPlaced: () => U(!0),
                    ref: M,
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      outline: "none",
                      ...I.style,
                    },
                    onKeyDown: (0, o.composeEventHandlers)(I.onKeyDown, (e) => {
                      let t = e.ctrlKey || e.altKey || e.metaKey;
                      if (
                        ("Tab" === e.key && e.preventDefault(),
                        t || 1 !== e.key.length || Z(e.key),
                        ["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key))
                      ) {
                        let t = F()
                          .filter((e) => !e.disabled)
                          .map((e) => e.ref.current);
                        if (
                          (["ArrowUp", "End"].includes(e.key) &&
                            (t = t.slice().reverse()),
                          ["ArrowUp", "ArrowDown"].includes(e.key))
                        ) {
                          let r = e.target,
                            n = t.indexOf(r);
                          t = t.slice(n + 1);
                        }
                        (setTimeout(() => W(t)), e.preventDefault());
                      }
                    }),
                  }),
                }),
              }),
            }),
          });
        }, "SelectContentImpl"),
      ),
      er = t.forwardRef(
        R(function (e, r) {
          let { __scopeSelect: o, onPlaced: l, ...a } = e,
            s = V(X, o),
            c = $(X, o),
            [u, d] = t.useState(null),
            [p, f] = t.useState(null),
            v = (0, i.useComposedRefs)(r, f),
            h = D(o),
            S = t.useRef(!1),
            g = t.useRef(!0),
            {
              viewport: w,
              selectedItem: y,
              selectedItemText: b,
              focusSelectedItem: C,
            } = c,
            P = t.useCallback(() => {
              if (s.trigger && s.valueNode && u && p && w && y && b) {
                let e = s.trigger.getBoundingClientRect(),
                  t = p.getBoundingClientRect(),
                  r = s.valueNode.getBoundingClientRect(),
                  o = b.getBoundingClientRect();
                if ("rtl" !== s.dir) {
                  let l = o.left - t.left,
                    i = r.left - l,
                    a = e.left - i,
                    s = e.width + a,
                    c = Math.max(s, t.width),
                    d = window.innerWidth - 10,
                    p = (0, n.clamp)(i, [10, Math.max(10, d - c)]);
                  ((u.style.minWidth = s + "px"), (u.style.left = p + "px"));
                } else {
                  let l = t.right - o.right,
                    i = window.innerWidth - r.right - l,
                    a = window.innerWidth - e.right - i,
                    s = e.width + a,
                    c = Math.max(s, t.width),
                    d = window.innerWidth - 10,
                    p = (0, n.clamp)(i, [10, Math.max(10, d - c)]);
                  ((u.style.minWidth = s + "px"), (u.style.right = p + "px"));
                }
                let i = h(),
                  a = window.innerHeight - 20,
                  c = w.scrollHeight,
                  d = window.getComputedStyle(p),
                  f = parseInt(d.borderTopWidth, 10),
                  v = parseInt(d.paddingTop, 10),
                  m = parseInt(d.borderBottomWidth, 10),
                  g = f + v + c + parseInt(d.paddingBottom, 10) + m,
                  x = Math.min(5 * y.offsetHeight, g),
                  C = window.getComputedStyle(w),
                  P = parseInt(C.paddingTop, 10),
                  E = parseInt(C.paddingBottom, 10),
                  I = e.top + e.height / 2 - 10,
                  R = y.offsetHeight / 2,
                  j = f + v + (y.offsetTop + R);
                if (j <= I) {
                  let e = i.length > 0 && y === i[i.length - 1].ref.current;
                  u.style.bottom = "0px";
                  let t = Math.max(
                    a - I,
                    R +
                      (e ? E : 0) +
                      (p.clientHeight - w.offsetTop - w.offsetHeight) +
                      m,
                  );
                  u.style.height = j + t + "px";
                } else {
                  let e = i.length > 0 && y === i[0].ref.current;
                  u.style.top = "0px";
                  let t = Math.max(I, f + w.offsetTop + (e ? P : 0) + R);
                  ((u.style.height = t + (g - j) + "px"),
                    (w.scrollTop = j - I + w.offsetTop));
                }
                ((u.style.margin = "10px 0"),
                  (u.style.minHeight = x + "px"),
                  (u.style.maxHeight = a + "px"),
                  l?.(),
                  requestAnimationFrame(() => (S.current = !0)));
              }
            }, [h, s.trigger, s.valueNode, u, p, w, y, b, s.dir, l]);
          (0, x.useLayoutEffect)(() => P(), [P]);
          let [I, R] = t.useState();
          (0, x.useLayoutEffect)(() => {
            p && R(window.getComputedStyle(p).zIndex);
          }, [p]);
          let j = t.useCallback(
            (e) => {
              e && !0 === g.current && (P(), C?.(), (g.current = !1));
            },
            [P, C],
          );
          return (0, E.jsx)(eo, {
            scope: o,
            contentWrapper: u,
            shouldExpandOnScrollRef: S,
            onScrollButtonChange: j,
            children: (0, E.jsx)("div", {
              ref: d,
              style: {
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                zIndex: I,
              },
              children: (0, E.jsx)(m.Primitive.div, {
                ...a,
                ref: v,
                style: {
                  boxSizing: "border-box",
                  maxHeight: "100%",
                  ...a.style,
                },
              }),
            }),
          });
        }, "SelectItemAlignedPosition"),
      ),
      en = t.forwardRef(
        R(function (e, t) {
          let {
              __scopeSelect: r,
              align: n = "start",
              collisionPadding: o = 10,
              ...l
            } = e,
            i = A(r);
          return (0, E.jsx)(f.Content, {
            ...i,
            ...l,
            ref: t,
            align: n,
            collisionPadding: o,
            style: {
              boxSizing: "border-box",
              ...l.style,
              "--radix-select-content-transform-origin":
                "var(--radix-popper-transform-origin)",
              "--radix-select-content-available-width":
                "var(--radix-popper-available-width)",
              "--radix-select-content-available-height":
                "var(--radix-popper-available-height)",
              "--radix-select-trigger-width":
                "var(--radix-popper-anchor-width)",
              "--radix-select-trigger-height":
                "var(--radix-popper-anchor-height)",
            },
          });
        }, "SelectPopperPosition"),
      ),
      [eo, el] = M(X, {}),
      ei = "SelectViewport",
      ea = t.forwardRef(
        R(function (e, r) {
          let { __scopeSelect: n, nonce: l, ...a } = e,
            s = $(ei, n),
            c = el(ei, n),
            u = (0, i.useComposedRefs)(r, s.onViewportChange),
            d = t.useRef(0);
          return (0, E.jsxs)(E.Fragment, {
            children: [
              (0, E.jsx)("style", {
                dangerouslySetInnerHTML: {
                  __html:
                    "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}",
                },
                nonce: l,
              }),
              (0, E.jsx)(k.Slot, {
                scope: n,
                children: (0, E.jsx)(m.Primitive.div, {
                  "data-radix-select-viewport": "",
                  role: "presentation",
                  ...a,
                  ref: u,
                  style: {
                    position: "relative",
                    flex: 1,
                    overflow: "hidden auto",
                    ...a.style,
                  },
                  onScroll: (0, o.composeEventHandlers)(a.onScroll, (e) => {
                    let t = e.currentTarget,
                      { contentWrapper: r, shouldExpandOnScrollRef: n } = c;
                    if (n?.current && r) {
                      let e = Math.abs(d.current - t.scrollTop);
                      if (e > 0) {
                        let n = window.innerHeight - 20,
                          o = Math.max(
                            parseFloat(r.style.minHeight),
                            parseFloat(r.style.height),
                          );
                        if (o < n) {
                          let l = o + e,
                            i = Math.min(n, l),
                            a = l - i;
                          ((r.style.height = i + "px"),
                            "0px" === r.style.bottom &&
                              ((t.scrollTop = a > 0 ? a : 0),
                              (r.style.justifyContent = "flex-end")));
                        }
                      }
                    }
                    d.current = t.scrollTop;
                  }),
                }),
              }),
            ],
          });
        }, "SelectViewport"),
      ),
      [es, ec] = M("SelectGroup"),
      eu = t.forwardRef(
        R(function (e, t) {
          let { __scopeSelect: r, ...n } = e,
            o = (0, p.useId)();
          return (0, E.jsx)(es, {
            scope: r,
            id: o,
            children: (0, E.jsx)(m.Primitive.div, {
              role: "group",
              "aria-labelledby": o,
              ...n,
              ref: t,
            }),
          });
        }, "SelectGroup"),
      ),
      ed = t.forwardRef(
        R(function (e, t) {
          let { __scopeSelect: r, ...n } = e,
            o = ec("SelectLabel", r);
          return (0, E.jsx)(m.Primitive.div, { id: o.id, ...n, ref: t });
        }, "SelectLabel"),
      ),
      ep = "SelectItem",
      [ef, ev] = M(ep),
      eh = t.forwardRef(
        R(function (e, r) {
          let {
              __scopeSelect: n,
              value: l,
              disabled: a = !1,
              textValue: s,
              ...c
            } = e,
            u = V(ep, n),
            d = $(ep, n),
            f = u.value === l,
            [v, h] = t.useState(s ?? ""),
            [S, w] = t.useState(!1),
            x = (0, g.useCallbackRef)((e) => d.itemRefCallback?.(e, l, a)),
            y = (0, i.useComposedRefs)(r, x),
            b = (0, p.useId)(),
            C = t.useRef("touch"),
            P = R(() => {
              a || (u.onValueChange(l), u.onOpenChange(!1));
            }, "handleSelect");
          return (0, E.jsx)(ef, {
            scope: n,
            value: l,
            disabled: a,
            textId: b,
            isSelected: f,
            onItemTextChange: t.useCallback((e) => {
              h((t) => t || (e?.textContent ?? "").trim());
            }, []),
            children: (0, E.jsx)(k.ItemSlot, {
              scope: n,
              value: l,
              disabled: a,
              textValue: v,
              children: (0, E.jsx)(m.Primitive.div, {
                role: "option",
                "aria-labelledby": b,
                "data-highlighted": S ? "" : void 0,
                "aria-selected": f && S,
                "data-state": f ? "checked" : "unchecked",
                "aria-disabled": a || void 0,
                "data-disabled": a ? "" : void 0,
                tabIndex: a ? void 0 : -1,
                ...c,
                ref: y,
                onFocus: (0, o.composeEventHandlers)(c.onFocus, () => w(!0)),
                onBlur: (0, o.composeEventHandlers)(c.onBlur, () => w(!1)),
                onClick: (0, o.composeEventHandlers)(c.onClick, () => {
                  "mouse" !== C.current && P();
                }),
                onPointerUp: (0, o.composeEventHandlers)(c.onPointerUp, () => {
                  "mouse" === C.current && P();
                }),
                onPointerDown: (0, o.composeEventHandlers)(
                  c.onPointerDown,
                  (e) => {
                    C.current = e.pointerType;
                  },
                ),
                onPointerMove: (0, o.composeEventHandlers)(
                  c.onPointerMove,
                  (e) => {
                    ((C.current = e.pointerType),
                      a
                        ? d.onItemLeave?.()
                        : "mouse" === C.current &&
                          e.currentTarget.focus({ preventScroll: !0 }));
                  },
                ),
                onPointerLeave: (0, o.composeEventHandlers)(
                  c.onPointerLeave,
                  (e) => {
                    e.currentTarget === document.activeElement &&
                      d.onItemLeave?.();
                  },
                ),
                onKeyDown: (0, o.composeEventHandlers)(c.onKeyDown, (e) => {
                  a ||
                    e.target !== e.currentTarget ||
                    ((d.searchRef?.current === "" || " " !== e.key) &&
                      (T.includes(e.key) && P(),
                      " " === e.key && e.preventDefault()));
                }),
              }),
            }),
          });
        }, "SelectItem"),
      ),
      em = "SelectItemText",
      eS = t.forwardRef(
        R(function (e, n) {
          let { __scopeSelect: o, className: l, style: a, ...s } = e,
            c = V(em, o),
            u = $(em, o),
            d = ev(em, o),
            p = F(em, o),
            [f, v] = t.useState(null),
            h = (0, g.useCallbackRef)((e) =>
              u.itemTextRefCallback?.(e, d.value, d.disabled),
            ),
            S = (0, i.useComposedRefs)(n, v, d.onItemTextChange, h),
            w = f?.textContent,
            y = t.useMemo(
              () =>
                (0, E.jsx)(
                  "option",
                  { value: d.value, disabled: d.disabled, children: w },
                  d.value,
                ),
              [d.disabled, d.value, w],
            ),
            { onNativeOptionAdd: b, onNativeOptionRemove: C } = p;
          return (
            (0, x.useLayoutEffect)(() => (b(y), () => C(y)), [b, C, y]),
            (0, E.jsxs)(E.Fragment, {
              children: [
                (0, E.jsx)(m.Primitive.span, { id: d.textId, ...s, ref: S }),
                d.isSelected &&
                c.valueNode &&
                !c.valueNodeHasChildren &&
                !ej(c.value)
                  ? r.createPortal(s.children, c.valueNode)
                  : null,
              ],
            })
          );
        }, "SelectItemText"),
      ),
      eg = t.forwardRef(
        R(function (e, t) {
          let { __scopeSelect: r, ...n } = e;
          return ev("SelectItemIndicator", r).isSelected
            ? (0, E.jsx)(m.Primitive.span, { "aria-hidden": !0, ...n, ref: t })
            : null;
        }, "SelectItemIndicator"),
      ),
      ew = "SelectScrollUpButton",
      ex = t.forwardRef(
        R(function (e, r) {
          let n = $(ew, e.__scopeSelect),
            o = el(ew, e.__scopeSelect),
            [l, a] = t.useState(!1),
            s = (0, i.useComposedRefs)(r, o.onScrollButtonChange);
          return (
            (0, x.useLayoutEffect)(() => {
              if (n.viewport && n.isPositioned) {
                let e = function () {
                  a(t.scrollTop > 0);
                };
                R(e, "handleScroll");
                let t = n.viewport;
                return (
                  e(),
                  t.addEventListener("scroll", e),
                  () => t.removeEventListener("scroll", e)
                );
              }
            }, [n.viewport, n.isPositioned]),
            l
              ? (0, E.jsx)(eC, {
                  ...e,
                  ref: s,
                  onAutoScroll: () => {
                    let { viewport: e, selectedItem: t } = n;
                    e && t && (e.scrollTop = e.scrollTop - t.offsetHeight);
                  },
                })
              : null
          );
        }, "SelectScrollUpButton"),
      ),
      ey = "SelectScrollDownButton",
      eb = t.forwardRef(
        R(function (e, r) {
          let n = $(ey, e.__scopeSelect),
            o = el(ey, e.__scopeSelect),
            [l, a] = t.useState(!1),
            s = (0, i.useComposedRefs)(r, o.onScrollButtonChange);
          return (
            (0, x.useLayoutEffect)(() => {
              if (n.viewport && n.isPositioned) {
                let e = function () {
                  let e = t.scrollHeight - t.clientHeight;
                  a(Math.ceil(t.scrollTop) < e);
                };
                R(e, "handleScroll");
                let t = n.viewport;
                return (
                  e(),
                  t.addEventListener("scroll", e),
                  () => t.removeEventListener("scroll", e)
                );
              }
            }, [n.viewport, n.isPositioned]),
            l
              ? (0, E.jsx)(eC, {
                  ...e,
                  ref: s,
                  onAutoScroll: () => {
                    let { viewport: e, selectedItem: t } = n;
                    e && t && (e.scrollTop = e.scrollTop + t.offsetHeight);
                  },
                })
              : null
          );
        }, "SelectScrollDownButton"),
      ),
      eC = t.forwardRef(
        R(function (e, r) {
          let { __scopeSelect: n, onAutoScroll: l, ...i } = e,
            a = $("SelectScrollButton", n),
            s = t.useRef(null),
            c = D(n),
            u = t.useCallback(() => {
              null !== s.current &&
                (window.clearInterval(s.current), (s.current = null));
            }, []);
          return (
            t.useEffect(() => () => u(), [u]),
            (0, x.useLayoutEffect)(() => {
              let e = c().find((e) => e.ref.current === document.activeElement);
              e?.ref.current?.scrollIntoView({ block: "nearest" });
            }, [c]),
            (0, E.jsx)(m.Primitive.div, {
              "aria-hidden": !0,
              ...i,
              ref: r,
              style: { flexShrink: 0, ...i.style },
              onPointerDown: (0, o.composeEventHandlers)(
                i.onPointerDown,
                () => {
                  null === s.current && (s.current = window.setInterval(l, 50));
                },
              ),
              onPointerMove: (0, o.composeEventHandlers)(
                i.onPointerMove,
                () => {
                  (a.onItemLeave?.(),
                    null === s.current &&
                      (s.current = window.setInterval(l, 50)));
                },
              ),
              onPointerLeave: (0, o.composeEventHandlers)(
                i.onPointerLeave,
                () => {
                  u();
                },
              ),
            })
          );
        }, "SelectScrollButtonImpl"),
      ),
      eP = t.forwardRef(
        R(function (e, t) {
          let { __scopeSelect: r, ...n } = e;
          return (0, E.jsx)(m.Primitive.div, {
            "aria-hidden": !0,
            ...n,
            ref: t,
          });
        }, "SelectSeparator"),
      ),
      eE = t.forwardRef(
        R(function (e, t) {
          let { __scopeSelect: r, ...n } = e,
            o = A(r);
          return "popper" === $("SelectArrow", r).position
            ? (0, E.jsx)(f.Arrow, { ...o, ...n, ref: t })
            : null;
        }, "SelectArrow"),
      ),
      eI = t.forwardRef(
        R(function ({ __scopeSelect: e, ...r }, n) {
          let o = V("SelectBubbleInput", e),
            {
              value: l,
              onValueChange: a,
              required: s,
              disabled: c,
              name: u,
              autoComplete: d,
              form: p,
            } = o,
            { nativeOptions: f, nativeSelectKey: v } = o,
            h = t.useRef(null),
            S = (0, i.useComposedRefs)(n, h),
            g = l ?? "",
            w = (0, y.usePrevious)(g),
            x = Array.from(f).some((e) => (e.props.value ?? "") === "");
          return (
            t.useEffect(() => {
              let e = h.current;
              if (!e) return;
              let t = Object.getOwnPropertyDescriptor(
                window.HTMLSelectElement.prototype,
                "value",
              ).set;
              if (w !== g && t) {
                let r = new Event("change", { bubbles: !0 });
                (t.call(e, g), e.dispatchEvent(r));
              }
            }, [w, g]),
            (0, E.jsxs)(
              m.Primitive.select,
              {
                "aria-hidden": !0,
                required: s,
                tabIndex: -1,
                name: u,
                autoComplete: d,
                disabled: c,
                form: p,
                onChange: (e) => a(e.target.value),
                ...r,
                style: { ...b.VISUALLY_HIDDEN_STYLES, ...r.style },
                ref: S,
                defaultValue: g,
                children: [
                  ej(l) && !x ? (0, E.jsx)("option", { value: "" }) : null,
                  Array.from(f),
                ],
              },
              v,
            )
          );
        }, "SelectBubbleInput"),
      );
    function eR(e) {
      return "function" == typeof e;
    }
    function ej(e) {
      return "" === e || void 0 === e;
    }
    function eT(e) {
      let r = (0, g.useCallbackRef)(e),
        n = t.useRef(""),
        o = t.useRef(0),
        l = t.useCallback(
          (e) => {
            r(n.current + e);
          },
          [r],
        ),
        i = t.useCallback(() => {
          ((n.current = ""), window.clearTimeout(o.current));
        }, []);
      return (
        t.useEffect(() => () => window.clearTimeout(o.current), []),
        [n, l, i]
      );
    }
    function eL(e, t, r) {
      let n = t.length > 1 && Array.from(t).every((e) => e === t[0]) ? t[0] : t,
        o = r ? e.indexOf(r) : -1,
        l = ek(e, Math.max(o, 0));
      1 === n.length && (l = l.filter((e) => e !== r));
      let i = l.find((e) =>
        e.textValue.toLowerCase().startsWith(n.toLowerCase()),
      );
      return i !== r ? i : void 0;
    }
    function ek(e, t) {
      return e.map((r, n) => e[(t + n) % e.length]);
    }
    (R(eR, "isFunction"),
      R(ej, "shouldShowPlaceholder"),
      R(eT, "useTypeaheadSearch"),
      R(eL, "findNextItem"),
      R(ek, "wrapArray"),
      e.s([
        "Arrow",
        0,
        eE,
        "Content",
        0,
        Z,
        "Group",
        0,
        eu,
        "Icon",
        0,
        z,
        "Item",
        0,
        eh,
        "ItemIndicator",
        0,
        eg,
        "ItemText",
        0,
        eS,
        "Label",
        0,
        ed,
        "Portal",
        0,
        q,
        "Root",
        0,
        U,
        "ScrollDownButton",
        0,
        eb,
        "ScrollUpButton",
        0,
        ex,
        "Select",
        0,
        U,
        "SelectArrow",
        0,
        eE,
        "SelectContent",
        0,
        Z,
        "SelectGroup",
        0,
        eu,
        "SelectIcon",
        0,
        z,
        "SelectItem",
        0,
        eh,
        "SelectItemIndicator",
        0,
        eg,
        "SelectItemText",
        0,
        eS,
        "SelectLabel",
        0,
        ed,
        "SelectPortal",
        0,
        q,
        "SelectScrollDownButton",
        0,
        eb,
        "SelectScrollUpButton",
        0,
        ex,
        "SelectSeparator",
        0,
        eP,
        "SelectTrigger",
        0,
        N,
        "SelectValue",
        0,
        W,
        "SelectViewport",
        0,
        ea,
        "Separator",
        0,
        eP,
        "Trigger",
        0,
        N,
        "Value",
        0,
        W,
        "Viewport",
        0,
        ea,
        "createSelectScope",
        0,
        B,
        "unstable_BubbleInput",
        0,
        eI,
        "unstable_Provider",
        0,
        K,
        "unstable_SelectBubbleInput",
        0,
        eI,
        "unstable_SelectProvider",
        0,
        K,
      ]));
  },
  144716,
  (e) => {
    "use strict";
    let t = (0, e.i(456420).default)("chevron-up", [
      ["path", { d: "m18 15-6-6-6 6", key: "153udz" }],
    ]);
    e.s(["default", 0, t]);
  },
]);
