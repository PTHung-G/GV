// Reconstructed from 3zi979v0iopom.pretty.js, module 325522.
// deps: none
// exports: none


"use strict";
    var e = t.i(830665),
      i = t.i(733871),
      s = t.i(587576),
      n = t.i(885983),
      r = t.i(386579),
      o = t.i(271645),
      a = t.i(688291),
      l = t.i(821476),
      h = t.i(947414);
    let u = (t) => (e, u) => {
      let c = (0, o.useContext)(a.MotionContext),
        d = (0, o.useContext)(l.PresenceContext),
        m = () =>
          (function (
            { scrapeMotionValuesFromProps: t, createRenderState: e },
            o,
            a,
            l,
          ) {
            return {
              latestValues: (function (t, e, o, a) {
                let l = {},
                  h = a(t, {});
                for (let t in h) l[t] = (0, i.resolveMotionValue)(h[t]);
                let { initial: u, animate: c } = t,
                  d = (0, s.isControllingVariants)(t),
                  m = (0, s.isVariantNode)(t);
                e &&
                  m &&
                  !d &&
                  !1 !== t.inherit &&
                  (void 0 === u && (u = e.initial),
                  void 0 === c && (c = e.animate));
                let p = !!o && !1 === o.initial,
                  f = (p = p || !1 === u) ? c : u;
                if (
                  f &&
                  "boolean" != typeof f &&
                  !(0, n.isAnimationControls)(f)
                ) {
                  let e = Array.isArray(f) ? f : [f];
                  for (let i = 0; i < e.length; i++) {
                    let s = (0, r.resolveVariantFromProps)(t, e[i]);
                    if (s) {
                      let { transitionEnd: t, transition: e, ...i } = s;
                      for (let t in i) {
                        let e = i[t];
                        if (Array.isArray(e)) {
                          let t = p ? e.length - 1 : 0;
                          e = e[t];
                        }
                        null !== e && (l[t] = e);
                      }
                      for (let e in t) l[e] = t[e];
                    }
                  }
                }
                return l;
              })(o, a, l, t),
              renderState: e(),
            };
          })(t, e, c, d);
      return u ? m() : (0, h.useConstant)(m);
    };
    var c = t.i(886549);
    let d = u({
      scrapeMotionValuesFromProps: e.scrapeHTMLMotionValuesFromProps,
      createRenderState: c.createHtmlRenderState,
    });
    t.s(["useHTMLVisualState", 0, d], 711805);
    var m = t.i(767926),
      m = m,
      p = t.i(911587);
    let f = u({
      scrapeMotionValuesFromProps: m.scrapeMotionValuesFromProps,
      createRenderState: p.createSvgRenderState,
    });
    t.s(["useSVGVisualState", 0, f], 501664);
    var g = t.i(617218);
    let v = {
        animation: [
          "animate",
          "variants",
          "whileHover",
          "whileTap",
          "exit",
          "whileInView",
          "whileFocus",
          "whileDrag",
        ],
        exit: ["exit"],
        drag: ["drag", "dragControls"],
        focus: ["whileFocus"],
        hover: ["whileHover", "onHoverStart", "onHoverEnd"],
        tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
        pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
        inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
        layout: ["layout", "layoutId"],
      },
      y = !1;
    function x() {
      return (
        !(function () {
          if (y) return;
          let t = {};
          for (let e in v)
            t[e] = { isEnabled: (t) => v[e].some((e) => !!t[e]) };
          ((0, g.setFeatureDefinitions)(t), (y = !0));
        })(),
        (0, g.getFeatureDefinitions)()
      );
    }
    (t.s(["getInitializedFeatureDefinitions", 0, x], 476948),
      t.s(
        [
          "loadFeatures",
          0,
          function (t) {
            let e = x();
            for (let i in t) e[i] = { ...e[i], ...t[i] };
            (0, g.setFeatureDefinitions)(e);
          },
        ],
        513565,
      ));
    let b = Symbol.for("motionComponentSymbol");
    (t.s(["motionComponentSymbol", 0, b], 321967),
      t.s(
        [
          "useMotionRef",
          0,
          function (t, e, i) {
            let s = (0, o.useRef)(i);
            (0, o.useInsertionEffect)(() => {
              s.current = i;
            });
            let n = (0, o.useRef)(null);
            return (0, o.useCallback)(
              (i) => {
                (i && t.onMount?.(i), e && (i ? e.mount(i) : e.unmount()));
                let r = s.current;
                if ("function" == typeof r)
                  if (i) {
                    let t = r(i);
                    "function" == typeof t && (n.current = t);
                  } else n.current ? (n.current(), (n.current = null)) : r(i);
                else r && (r.current = i);
              },
              [e],
            );
          },
        ],
        683640,
      ));
    let T = "data-" + (0, t.i(793787).camelToDash)("framerAppearId");
    t.s(["optimizedAppearDataAttribute", 0, T], 535043);
    let S = (0, o.createContext)({});
    (t.s(["SwitchLayoutGroupContext", 0, S], 104035),
      t.s(
        [
          "isRefObject",
          0,
          function (t) {
            return (
              t &&
              "object" == typeof t &&
              Object.prototype.hasOwnProperty.call(t, "current")
            );
          },
        ],
        325522,
      ));
