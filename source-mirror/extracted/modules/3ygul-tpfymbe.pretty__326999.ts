// Reconstructed from 3ygul-tpfymbe.pretty.js, module 326999.
// deps: m271645, m981140, m820783, m30030, m610772, m369340, m726330, m765491, m774606, m296626, m248425, m303536, m934620, m985369, m186312, m991918, m843476
// exports: Close, Content, Description, Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, Overlay, Portal, Root, Title, Trigger, WarningProvider, createDialogScope
export { q as "Close" };
export { L as "Content" };
export { F as "Description" };
export { T as "Dialog" };
export { q as "DialogClose" };
export { L as "DialogContent" };
export { F as "DialogDescription" };
export { M as "DialogOverlay" };
export { R as "DialogPortal" };
export { z as "DialogTitle" };
export { D as "DialogTrigger" };
export { M as "Overlay" };
export { R as "Portal" };
export { T as "Root" };
export { z as "Title" };
export { D as "Trigger" };
export { B as "WarningProvider" };
export { w as "createDialogScope" };

"use strict";
    var t = m271645,
      n = m981140,
      r = m820783,
      a = m30030,
      i = m610772,
      o = m369340,
      s = m726330,
      l = m765491,
      c = m774606,
      d = m296626,
      u = m248425,
      p = m303536,
      h = m934620,
      g = m985369,
      f = m186312,
      m = m991918,
      x = m843476,
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
      );
