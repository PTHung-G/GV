// Reconstructed from 3zi979v0iopom.pretty.js, module 733871.
// deps: none
// exports: none


"use strict";
    var e = t.i(271645);
    let i = (0, e.createContext)({});
    t.s(["MotionContext", 0, i], 688291);
    var s = t.i(587576),
      n = t.i(732525);
    function r(t) {
      return Array.isArray(t) ? t.join(" ") : t;
    }
    t.s(
      [
        "useCreateMotionContext",
        0,
        function (t) {
          let { initial: o, animate: a } = (function (t, e) {
            if ((0, s.isControllingVariants)(t)) {
              let { initial: e, animate: i } = t;
              return {
                initial: !1 === e || (0, n.isVariantLabel)(e) ? e : void 0,
                animate: (0, n.isVariantLabel)(i) ? i : void 0,
              };
            }
            return !1 !== t.inherit ? e : {};
          })(t, (0, e.useContext)(i));
          return (0, e.useMemo)(
            () => ({ initial: o, animate: a }),
            [r(o), r(a)],
          );
        },
      ],
      582474,
    );
    var o = t.i(83411),
      a = t.i(130789),
      l = t.i(544947);
    let h = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} });
    function u(t, e, i) {
      for (let s in e)
        (0, o.isMotionValue)(e[s]) ||
          (0, a.isForcedMotionValue)(s, i) ||
          (t[s] = e[s]);
    }
    t.s(["createHtmlRenderState", 0, h], 886549);
    var c = t.i(181261),
      d = t.i(399951);
    let m = () => ({ ...h(), attrs: {} });
    t.s(["createSvgRenderState", 0, m], 911587);
    let p = new Set([
      "animate",
      "exit",
      "variants",
      "initial",
      "style",
      "values",
      "variants",
      "transition",
      "transformTemplate",
      "custom",
      "inherit",
      "onBeforeLayoutMeasure",
      "onAnimationStart",
      "onAnimationComplete",
      "onUpdate",
      "onDragStart",
      "onDrag",
      "onDragEnd",
      "onMeasureDragConstraints",
      "onDirectionLock",
      "onDragTransitionEnd",
      "_dragX",
      "_dragY",
      "onHoverStart",
      "onHoverEnd",
      "onViewportEnter",
      "onViewportLeave",
      "globalTapTarget",
      "propagate",
      "ignoreStrict",
      "viewport",
    ]);
    function f(t) {
      return (
        t.startsWith("while") ||
        (t.startsWith("drag") && "draggable" !== t) ||
        t.startsWith("layout") ||
        t.startsWith("onTap") ||
        t.startsWith("onPan") ||
        t.startsWith("onLayout") ||
        p.has(t)
      );
    }
    var g = t.i(944966);
    t.s(
      [
        "useRender",
        0,
        function (t, i, s, { latestValues: n }, r, a = !1, p, v) {
          let y = (
              (p ?? (0, g.isSVGComponent)(t))
                ? function (t, i, s, n) {
                    let r = (0, e.useMemo)(() => {
                      let e = m();
                      return (
                        (0, c.buildSVGAttrs)(
                          e,
                          i,
                          (0, d.isSVGTag)(n),
                          t.transformTemplate,
                          t.style,
                        ),
                        { ...e.attrs, style: { ...e.style } }
                      );
                    }, [i]);
                    if (t.style) {
                      let e = {};
                      (u(e, t.style, t), (r.style = { ...e, ...r.style }));
                    }
                    return r;
                  }
                : function (t, i) {
                    let s,
                      n,
                      r = {},
                      o =
                        ((s = t.style || {}),
                        u((n = {}), s, t),
                        Object.assign(
                          n,
                          (function ({ transformTemplate: t }, i) {
                            return (0, e.useMemo)(() => {
                              let e = h();
                              return (
                                (0, l.buildHTMLStyles)(e, i, t),
                                Object.assign({}, e.vars, e.style)
                              );
                            }, [i]);
                          })(t, i),
                        ),
                        n);
                    return (
                      t.drag &&
                        !1 !== t.dragListener &&
                        ((r.draggable = !1),
                        (o.userSelect =
                          o.WebkitUserSelect =
                          o.WebkitTouchCallout =
                            "none"),
                        (o.touchAction =
                          !0 === t.drag
                            ? "none"
                            : `pan-${"x" === t.drag ? "y" : "x"}`)),
                      void 0 === t.tabIndex &&
                        (t.onTap || t.onTapStart || t.whileTap) &&
                        (r.tabIndex = 0),
                      (r.style = o),
                      r
                    );
                  }
            )(i, n, r, t),
            x = (function (t, e, i, s) {
              let n = {};
              for (let r in t)
                ("values" !== r || "object" != typeof t.values) &&
                  !(0, o.isMotionValue)(t[r]) &&
                  ((r.startsWith("on") ? !f(r) : (s?.(r) ?? !f(r))) ||
                    (!0 === i && f(r)) ||
                    (!e && !f(r)) ||
                    (t.draggable && r.startsWith("onDrag"))) &&
                  (n[r] = t[r]);
              return n;
            })(i, "string" == typeof t, a, v),
            b = t !== e.Fragment ? { ...x, ...y, ref: s } : {},
            { children: T } = i,
            S = (0, e.useMemo)(
              () => ((0, o.isMotionValue)(T) ? T.get() : T),
              [T],
            );
          return (0, e.createElement)(t, { ...b, children: S });
        },
      ],
      308576,
    );
    var v = t.i(984049);
    (t.s(
      ["scrapeHTMLMotionValuesFromProps", () => v.scrapeMotionValuesFromProps],
      830665,
    ),
      t.s(
        [
          "resolveMotionValue",
          0,
          function (t) {
            return (0, o.isMotionValue)(t) ? t.get() : t;
          },
        ],
        733871,
      ));
