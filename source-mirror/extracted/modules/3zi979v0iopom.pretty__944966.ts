// Reconstructed from 3zi979v0iopom.pretty.js, module 944966.
// deps: none
// exports: none


"use strict";
    let e,
      i,
      s = [
        "transformPerspective",
        "x",
        "y",
        "z",
        "translateX",
        "translateY",
        "translateZ",
        "scale",
        "scaleX",
        "scaleY",
        "rotate",
        "rotateX",
        "rotateY",
        "rotateZ",
        "skew",
        "skewX",
        "skewY",
      ],
      n = new Set([...s, "pathRotation"]);
    t.s(["transformPropOrder", 0, s, "transformProps", 0, n], 157788);
    let r = (t, e, i) => (i > e ? e : i < t ? t : i);
    t.s(["clamp", 0, r], 476959);
    let o = {
        test: (t) => "number" == typeof t,
        parse: parseFloat,
        transform: (t) => t,
      },
      a = { ...o, transform: (t) => r(0, 1, t) },
      l = { ...o, default: 1 },
      h = (t) => Math.round(1e5 * t) / 1e5;
    t.s(["sanitize", 0, h], 560720);
    let u = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu,
      c =
        /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
      d = (t, e) => (i) =>
        !!(
          ("string" == typeof i && c.test(i) && i.startsWith(t)) ||
          (e && null != i && Object.prototype.hasOwnProperty.call(i, e))
        ),
      m = (t, e, i) => (s) => {
        if ("string" != typeof s) return s;
        let [n, r, o, a] = s.match(u);
        return {
          [t]: parseFloat(n),
          [e]: parseFloat(r),
          [i]: parseFloat(o),
          alpha: void 0 !== a ? parseFloat(a) : 1,
        };
      },
      p = { ...o, transform: (t) => Math.round(r(0, 255, t)) },
      f = {
        test: d("rgb", "red"),
        parse: m("red", "green", "blue"),
        transform: ({ red: t, green: e, blue: i, alpha: s = 1 }) =>
          "rgba(" +
          p.transform(t) +
          ", " +
          p.transform(e) +
          ", " +
          p.transform(i) +
          ", " +
          h(a.transform(s)) +
          ")",
      };
    t.s(["rgba", 0, f], 766820);
    let g = {
      test: d("#"),
      parse: function (t) {
        let e = "",
          i = "",
          s = "",
          n = "";
        return (
          t.length > 5
            ? ((e = t.substring(1, 3)),
              (i = t.substring(3, 5)),
              (s = t.substring(5, 7)),
              (n = t.substring(7, 9)))
            : ((e = t.substring(1, 2)),
              (i = t.substring(2, 3)),
              (s = t.substring(3, 4)),
              (n = t.substring(4, 5)),
              (e += e),
              (i += i),
              (s += s),
              (n += n)),
          {
            red: parseInt(e, 16),
            green: parseInt(i, 16),
            blue: parseInt(s, 16),
            alpha: n ? parseInt(n, 16) / 255 : 1,
          }
        );
      },
      transform: f.transform,
    };
    t.s(["hex", 0, g], 463011);
    let v = (t) => ({
        test: (e) =>
          "string" == typeof e && e.endsWith(t) && 1 === e.split(" ").length,
        parse: parseFloat,
        transform: (e) => `${e}${t}`,
      }),
      y = v("deg"),
      x = v("%"),
      b = v("px"),
      T = v("vh"),
      S = v("vw"),
      w = {
        ...x,
        parse: (t) => x.parse(t) / 100,
        transform: (t) => x.transform(100 * t),
      };
    t.s(
      [
        "degrees",
        0,
        y,
        "percent",
        0,
        x,
        "progressPercentage",
        0,
        w,
        "px",
        0,
        b,
        "vh",
        0,
        T,
        "vw",
        0,
        S,
      ],
      265091,
    );
    let P = {
      test: d("hsl", "hue"),
      parse: m("hue", "saturation", "lightness"),
      transform: ({ hue: t, saturation: e, lightness: i, alpha: s = 1 }) =>
        "hsla(" +
        Math.round(t) +
        ", " +
        x.transform(h(e)) +
        ", " +
        x.transform(h(i)) +
        ", " +
        h(a.transform(s)) +
        ")",
    };
    t.s(["hsla", 0, P], 22660);
    let A = {
      test: (t) => f.test(t) || g.test(t) || P.test(t),
      parse: (t) =>
        f.test(t) ? f.parse(t) : P.test(t) ? P.parse(t) : g.parse(t),
      transform: (t) =>
        "string" == typeof t
          ? t
          : t.hasOwnProperty("red")
            ? f.transform(t)
            : P.transform(t),
      getAnimatableNone: (t) => {
        let e = A.parse(t);
        return ((e.alpha = 0), A.transform(e));
      },
    };
    t.s(["color", 0, A], 279444);
    let M = new RegExp(u.source),
      V = RegExp(
        /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu
          .source,
        "i",
      ),
      C = "number",
      E = "color",
      D =
        /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
    function k(t) {
      let e = t.toString();
      return M.test(e) || V.test(e);
    }
    function R(t) {
      let e = t.toString(),
        i = [],
        s = { color: [], number: [], var: [] },
        n = [],
        r = 0,
        o = e
          .replace(
            D,
            (t) => (
              A.test(t)
                ? (s.color.push(r), n.push(E), i.push(A.parse(t)))
                : t.startsWith("var(")
                  ? (s.var.push(r), n.push("var"), i.push(t))
                  : (s.number.push(r), n.push(C), i.push(parseFloat(t))),
              ++r,
              "${}"
            ),
          )
          .split("${}");
      return { values: i, split: o, indexes: s, types: n };
    }
    function L({ split: t, types: e }) {
      let i = t.length;
      return (s) => {
        let n = "";
        for (let r = 0; r < i; r++)
          if (((n += t[r]), void 0 !== s[r])) {
            let t = e[r];
            t === C
              ? (n += h(s[r]))
              : t === E
                ? (n += A.transform(s[r]))
                : (n += s[r]);
          }
        return n;
      };
    }
    let B = {
      test: function (t) {
        return isNaN(t) && "string" == typeof t && (M.test(t) || V.test(t));
      },
      parse: function (t) {
        return R(t).values;
      },
      createTransformer: function (t) {
        return L(R(t));
      },
      getAnimatableNone: function (t) {
        let e = R(t);
        return L(e)(
          e.values.map((t, i) =>
            ((t, e) =>
              "number" == typeof t
                ? e?.trim().endsWith("/")
                  ? t
                  : 0
                : "number" == typeof t
                  ? 0
                  : A.test(t)
                    ? A.getAnimatableNone(t)
                    : t)(t, e.split[i]),
          ),
        );
      },
    };
    t.s(
      ["analyseComplexValue", 0, R, "complex", 0, B, "hasComplexValues", 0, k],
      569577,
    );
    let F = new Set(["brightness", "contrast", "saturate", "opacity"]);
    function j(t) {
      let [e, i] = t.slice(0, -1).split("(");
      if ("drop-shadow" === e) return t;
      let [s] = i.match(u) || [];
      if (!s) return t;
      let n = i.replace(s, ""),
        r = +!!F.has(e);
      return (s !== i && (r *= 100), e + "(" + r + n + ")");
    }
    let I = /\b([a-z-]*)\(.*?\)/gu,
      O = {
        ...B,
        getAnimatableNone: (t) => {
          let e = t.match(I);
          return e ? e.map(j).join(" ") : t;
        },
      },
      N = {
        ...B,
        getAnimatableNone: (t) => {
          let e = B.parse(t);
          return B.createTransformer(t)(
            e.map((t) =>
              "number" == typeof t
                ? 0
                : "object" == typeof t
                  ? { ...t, alpha: 1 }
                  : t,
            ),
          );
        },
      },
      U = { ...o, transform: Math.round },
      W = {
        borderWidth: b,
        borderTopWidth: b,
        borderRightWidth: b,
        borderBottomWidth: b,
        borderLeftWidth: b,
        borderRadius: b,
        borderTopLeftRadius: b,
        borderTopRightRadius: b,
        borderBottomRightRadius: b,
        borderBottomLeftRadius: b,
        width: b,
        maxWidth: b,
        height: b,
        maxHeight: b,
        top: b,
        right: b,
        bottom: b,
        left: b,
        inset: b,
        insetBlock: b,
        insetBlockStart: b,
        insetBlockEnd: b,
        insetInline: b,
        insetInlineStart: b,
        insetInlineEnd: b,
        padding: b,
        paddingTop: b,
        paddingRight: b,
        paddingBottom: b,
        paddingLeft: b,
        paddingBlock: b,
        paddingBlockStart: b,
        paddingBlockEnd: b,
        paddingInline: b,
        paddingInlineStart: b,
        paddingInlineEnd: b,
        margin: b,
        marginTop: b,
        marginRight: b,
        marginBottom: b,
        marginLeft: b,
        marginBlock: b,
        marginBlockStart: b,
        marginBlockEnd: b,
        marginInline: b,
        marginInlineStart: b,
        marginInlineEnd: b,
        fontSize: b,
        backgroundPositionX: b,
        backgroundPositionY: b,
        rotate: y,
        pathRotation: y,
        rotateX: y,
        rotateY: y,
        rotateZ: y,
        scale: l,
        scaleX: l,
        scaleY: l,
        scaleZ: l,
        skew: y,
        skewX: y,
        skewY: y,
        distance: b,
        translateX: b,
        translateY: b,
        translateZ: b,
        x: b,
        y: b,
        z: b,
        perspective: b,
        transformPerspective: b,
        opacity: a,
        originX: w,
        originY: w,
        originZ: b,
        zIndex: U,
        fillOpacity: a,
        strokeOpacity: a,
        numOctaves: U,
      },
      $ = {
        ...W,
        color: A,
        backgroundColor: A,
        outlineColor: A,
        fill: A,
        stroke: A,
        borderColor: A,
        borderTopColor: A,
        borderRightColor: A,
        borderBottomColor: A,
        borderLeftColor: A,
        filter: O,
        WebkitFilter: O,
        mask: N,
        WebkitMask: N,
      },
      G = (t) => $[t],
      z = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }),
      H = () => ({ min: 0, max: 0 }),
      K = () => ({ x: H(), y: H() });
    t.s(
      ["createBox", 0, K, "createDelta", 0, () => ({ x: z(), y: z() })],
      130162,
    );
    let Y = (t) => !!(t && t.getVelocity);
    t.s(["isMotionValue", 0, Y], 83411);
    let X = new Set([
      "width",
      "height",
      "top",
      "left",
      "right",
      "bottom",
      ...s,
    ]);
    t.s(["positionalKeys", 0, X], 864440);
    let _ = [o, b, x, y, S, T, { test: (t) => "auto" === t, parse: (t) => t }],
      q = (t) => _.find((e) => e.test(t));
    var Z = t.i(247167);
    let J = () => {};
    (Z.default, t.s(["invariant", 0, J, "warning", 0, () => {}], 965566));
    let Q = (t) => (e) => "string" == typeof e && e.startsWith(t),
      tt = Q("--"),
      te = Q("var(--"),
      ti = (t) => !!te(t) && ts.test(t.split("/*")[0].trim()),
      ts =
        /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
    function tn(t) {
      return "string" == typeof t && t.split("/*")[0].includes("var(--");
    }
    t.s(
      [
        "containsCSSVariable",
        0,
        tn,
        "isCSSVariableName",
        0,
        tt,
        "isCSSVariableToken",
        0,
        ti,
      ],
      19928,
    );
    let tr = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u,
      to = new Set([O, N]);
    function ta(t, e) {
      let i = G(t);
      return (
        to.has(i) || (i = B),
        i.getAnimatableNone ? i.getAnimatableNone(e) : void 0
      );
    }
    let tl = (t) => (180 * t) / Math.PI,
      th = (t) => tc(tl(Math.atan2(t[1], t[0]))),
      tu = {
        x: 4,
        y: 5,
        translateX: 4,
        translateY: 5,
        scaleX: 0,
        scaleY: 3,
        scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
        rotate: th,
        rotateZ: th,
        skewX: (t) => tl(Math.atan(t[1])),
        skewY: (t) => tl(Math.atan(t[2])),
        skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2,
      },
      tc = (t) => ((t %= 360) < 0 && (t += 360), t),
      td = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]),
      tm = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]),
      tp = {
        x: 12,
        y: 13,
        z: 14,
        translateX: 12,
        translateY: 13,
        translateZ: 14,
        scaleX: td,
        scaleY: tm,
        scale: (t) => (td(t) + tm(t)) / 2,
        rotateX: (t) => tc(tl(Math.atan2(t[6], t[5]))),
        rotateY: (t) => tc(tl(Math.atan2(-t[2], t[0]))),
        rotateZ: th,
        rotate: th,
        skewX: (t) => tl(Math.atan(t[4])),
        skewY: (t) => tl(Math.atan(t[1])),
        skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2,
      };
    function tf(t) {
      return +!!t.includes("scale");
    }
    function tg(t, e) {
      
      if (!t || "none" === t) return tf(e);
      let n = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
      if (n) ((i = tp), (s = n));
      else {
        let e = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
        ((i = tu), (s = e));
      }
      if (!s) return tf(e);
      let r = i[e],
        o = s[1].split(",").map(tv);
      return "function" == typeof r ? r(o) : o[r];
    }
    function tv(t) {
      return parseFloat(t.trim());
    }
    let ty = (t) => t === o || t === b,
      tx = new Set(["x", "y", "z"]),
      tb = s.filter((t) => !tx.has(t)),
      tT = new Set(["bottom", "right"]);
    function tS(t, e, i, s, n, r) {
      let o = parseFloat(t);
      if (!isNaN(o)) return o;
      let { min: a, max: l } = e()[i],
        h = l - a;
      return "border-box" === r ? h : h - parseFloat(s) - parseFloat(n);
    }
    let tw = {
      width: (
        { width: t, paddingLeft: e = "0", paddingRight: i = "0", boxSizing: s },
        n,
      ) => tS(t, n, "x", e, i, s),
      height: (
        {
          height: t,
          paddingTop: e = "0",
          paddingBottom: i = "0",
          boxSizing: s,
        },
        n,
      ) => tS(t, n, "y", e, i, s),
      top: ({ top: t }) => parseFloat(t),
      left: ({ left: t }) => parseFloat(t),
      bottom: ({ top: t }, e) => {
        let { y: i } = e();
        return parseFloat(t) + (i.max - i.min);
      },
      right: ({ left: t }, e) => {
        let { x: i } = e();
        return parseFloat(t) + (i.max - i.min);
      },
      x: ({ transform: t }) => tg(t, "x"),
      y: ({ transform: t }) => tg(t, "y"),
    };
    ((tw.translateX = tw.x), (tw.translateY = tw.y));
    let tP = (t) => t;
    t.s(["noop", 0, tP], 260830);
    let tA = {};
    t.s(["MotionGlobalConfig", 0, tA], 846791);
    let tM = [
      "setup",
      "read",
      "resolveKeyframes",
      "preUpdate",
      "update",
      "preRender",
      "render",
      "postRender",
    ];
    function tV(t, e) {
      let i = !1,
        s = !0,
        n = { delta: 0, timestamp: 0, isProcessing: !1 },
        r = () => (i = !0),
        o = tM.reduce(
          (t, e) => (
            (t[e] = (function (t) {
              let e = new Set(),
                i = new Set(),
                s = !1,
                n = !1,
                r = new Set(),
                o = { delta: 0, timestamp: 0, isProcessing: !1 };
              function a(e) {
                (r.has(e) && (i.add(e), t()), e(o));
              }
              let l = {
                schedule: (t, n = !1, o = !1) => {
                  let a = o && s ? e : i;
                  return (n && r.add(t), a.add(t), t);
                },
                cancel: (t) => {
                  (i.delete(t), r.delete(t));
                },
                process: (t) => {
                  if (((o = t), s)) {
                    n = !0;
                    return;
                  }
                  s = !0;
                  let r = e;
                  ((e = i),
                    (i = r),
                    e.forEach(a),
                    e.clear(),
                    (s = !1),
                    n && ((n = !1), l.process(t)));
                },
              };
              return l;
            })(r)),
            t
          ),
          {},
        ),
        {
          setup: a,
          read: l,
          resolveKeyframes: h,
          preUpdate: u,
          update: c,
          preRender: d,
          render: m,
          postRender: p,
        } = o,
        f = () => {
          let r = tA.useManualTiming,
            o = r ? n.timestamp : performance.now();
          ((i = !1),
            r ||
              (n.delta = s
                ? 1e3 / 60
                : Math.max(Math.min(o - n.timestamp, 40), 1)),
            (n.timestamp = o),
            (n.isProcessing = !0),
            a.process(n),
            l.process(n),
            h.process(n),
            u.process(n),
            c.process(n),
            d.process(n),
            m.process(n),
            p.process(n),
            (n.isProcessing = !1),
            i && e && ((s = !1), t(f)));
        };
      return {
        schedule: tM.reduce((e, r) => {
          let a = o[r];
          return (
            (e[r] = (e, r = !1, o = !1) => (
              !i && ((i = !0), (s = !0), n.isProcessing || t(f)),
              a.schedule(e, r, o)
            )),
            e
          );
        }, {}),
        cancel: (t) => {
          for (let e = 0; e < tM.length; e++) o[tM[e]].cancel(t);
        },
        state: n,
        steps: o,
      };
    }
    let {
      schedule: tC,
      cancel: tE,
      state: tD,
      steps: tk,
    } = tV("u" > typeof requestAnimationFrame ? requestAnimationFrame : tP, !0);
    t.s(
      [
        "cancelFrame",
        0,
        tE,
        "frame",
        0,
        tC,
        "frameData",
        0,
        tD,
        "frameSteps",
        0,
        tk,
      ],
      287022,
    );
    let tR = new Set(),
      tL = !1,
      tB = !1,
      tF = !1;
    function tj() {
      if (tB) {
        let t = [],
          e = new Set(),
          i = new Set();
        tR.forEach((s) => {
          s.needsMeasurement &&
            (t.push(s), e.add(s.element), tT.has(s.name) && i.add(s.element));
        });
        let s = new Map();
        (i.forEach((t) => {
          let e,
            i =
              ((e = []),
              tb.forEach((i) => {
                let s = t.getValue(i);
                if (void 0 !== s) {
                  let t = s.get(),
                    n = +!!i.startsWith("scale");
                  if (t === n) return;
                  (e.push([i, t]), s.set(n));
                }
              }),
              e);
          i.length && (s.set(t, i), t.render());
        }),
          t.forEach((t) => t.measureInitialState()),
          e.forEach((t) => {
            t.render();
            let e = s.get(t);
            e &&
              e.forEach(([e, i]) => {
                t.getValue(e)?.set(i);
              });
          }),
          t.forEach((t) => t.measureEndState()),
          t.forEach((t) => {
            void 0 !== t.suspendedScrollY &&
              window.scrollTo(0, t.suspendedScrollY);
          }));
      }
      ((tB = !1), (tL = !1), tR.forEach((t) => t.complete(tF)), tR.clear());
    }
    function tI() {
      tR.forEach((t) => {
        (t.readKeyframes(), t.needsMeasurement && (tB = !0));
      });
    }
    class tO {
      constructor(t, e, i, s, n, r = !1) {
        ((this.state = "pending"),
          (this.isAsync = !1),
          (this.needsMeasurement = !1),
          (this.unresolvedKeyframes = [...t]),
          (this.onComplete = e),
          (this.name = i),
          (this.motionValue = s),
          (this.element = n),
          (this.isAsync = r));
      }
      scheduleResolve() {
        ((this.state = "scheduled"),
          this.isAsync
            ? (tR.add(this),
              tL || ((tL = !0), tC.read(tI), tC.resolveKeyframes(tj)))
            : (this.readKeyframes(), this.complete()));
      }
      readKeyframes() {
        let {
          unresolvedKeyframes: t,
          name: e,
          element: i,
          motionValue: s,
        } = this;
        if (null === t[0]) {
          let n = s?.get(),
            r = t[t.length - 1];
          if (void 0 !== n) t[0] = n;
          else if (i && e) {
            let s = (function (t, e, i) {
              if ("string" == typeof t) {
                if (
                  /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t) ||
                  /^0[^.\s]+$/u.test(t)
                )
                  return parseFloat(t);
                if (!B.test(t) && B.test(i)) return ta(e, i);
              }
              return t ?? void 0;
            })(i.readValue(e, r), e, r);
            void 0 !== s && (t[0] = s);
          }
          (void 0 === t[0] && (t[0] = r), s && void 0 === n && s.set(t[0]));
        }
        for (let e = 1; e < t.length; e++) t[e] ?? (t[e] = t[e - 1]);
      }
      setFinalKeyframe() {}
      measureInitialState() {}
      renderEndStyles() {}
      measureEndState() {}
      complete(t = !1) {
        ((this.state = "complete"),
          this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, t),
          tR.delete(this));
      }
      cancel() {
        "scheduled" === this.state &&
          (tR.delete(this), (this.state = "pending"));
      }
      resume() {
        "pending" === this.state && this.scheduleResolve();
      }
    }
    t.s(
      [
        "KeyframeResolver",
        0,
        tO,
        "flushKeyframeResolvers",
        0,
        function () {
          ((tF = !0), tI(), tj(), (tF = !1));
        },
      ],
      921012,
    );
    let tN = new Set(["auto", "none", "0"]);
    class tU extends tO {
      constructor(t, e, i, s, n) {
        super(t, e, i, s, n, !0);
      }
      readKeyframes() {
        let { unresolvedKeyframes: t, element: e, name: i } = this;
        if (!e || !e.current) return;
        super.readKeyframes();
        for (let i = 0; i < t.length; i++) {
          let s = t[i];
          if ("string" == typeof s && ti((s = s.trim()))) {
            let n = (function t(e, i, s = 1) {
              J(
                `Max CSS variable fallback depth detected in property "${e}". This may indicate a circular fallback dependency.`,
              );
              let [n, r] = (function (t) {
                let e = tr.exec(t);
                if (!e) return [,];
                let [, i, s, n] = e;
                return [`--${i ?? s}`, n];
              })(e);
              if (!n) return;
              let o = window.getComputedStyle(i).getPropertyValue(n);
              if (o) {
                let t = o.trim();
                return /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t)
                  ? parseFloat(t)
                  : t;
              }
              return ti(r) ? t(r, i, s + 1) : r;
            })(s, e.current);
            (void 0 !== n && (t[i] = n),
              i === t.length - 1 && (this.finalKeyframe = s));
          }
        }
        if ((this.resolveNoneKeyframes(), !X.has(i) || 2 !== t.length)) return;
        let [s, n] = t;
        if ("number" == typeof s && "number" == typeof n) return;
        let r = q(s),
          o = q(n);
        if (tn(s) !== tn(n) && tw[i]) {
          this.needsMeasurement = !0;
          return;
        }
        if (r !== o)
          if (ty(r) && ty(o))
            for (let e = 0; e < t.length; e++) {
              let i = t[e];
              "string" == typeof i && (t[e] = parseFloat(i));
            }
          else tw[i] && (this.needsMeasurement = !0);
      }
      resolveNoneKeyframes() {
        let { unresolvedKeyframes: t, name: e } = this,
          i = [];
        for (let e = 0; e < t.length; e++)
          (null === t[e] ||
            (function (t) {
              if ("number" == typeof t) return 0 === t;
              if (null === t) return !0;
              return "none" === t || "0" === t || /^0[^.\s]+$/u.test(t);
            })(t[e])) &&
            i.push(e);
        i.length &&
          (function (t, e, i) {
            let s,
              n = 0;
            for (; n < t.length && !s; ) {
              let e = t[n];
              ("string" == typeof e && !tN.has(e) && k(e) && (s = t[n]), n++);
            }
            if (s && i) for (let n of e) t[n] !== s && (t[n] = ta(i, s));
          })(t, i, e);
      }
      measure() {
        let { element: t, name: e } = this;
        return tw[e](window.getComputedStyle(t.current), () =>
          t.measureViewportBox(),
        );
      }
      measureInitialState() {
        let { element: t, unresolvedKeyframes: e, name: i } = this;
        if (!t || !t.current) return;
        ("height" === i && (this.suspendedScrollY = window.pageYOffset),
          (this.measuredOrigin = this.measure()),
          (e[0] = this.measuredOrigin));
        let s = e[e.length - 1];
        void 0 !== s && this.motionValue?.jump(s, !1);
      }
      measureEndState() {
        let { element: t, unresolvedKeyframes: e } = this;
        if (!t || !t.current) return;
        this.motionValue?.jump(this.measuredOrigin, !1);
        let i = e.length - 1,
          s = e[i];
        ((e[i] = this.measure()),
          null !== s &&
            void 0 === this.finalKeyframe &&
            (this.finalKeyframe = s),
          this.removedTransforms?.length &&
            this.removedTransforms.forEach(([e, i]) => {
              t.getValue(e).set(i);
            }),
          this.resolveNoneKeyframes());
      }
    }
    let tW = (t) => 1e3 * t,
      t$ = (t) => t / 1e3;
    function tG(t, e) {
      -1 === t.indexOf(e) && t.push(e);
    }
    function tz(t, e) {
      let i = t.indexOf(e);
      i > -1 && t.splice(i, 1);
    }
    (t.s(
      ["millisecondsToSeconds", 0, t$, "secondsToMilliseconds", 0, tW],
      763074,
    ),
      t.s(["addUniqueItem", 0, tG, "removeItem", 0, tz], 133887));
    class tH {
      constructor() {
        this.subscriptions = [];
      }
      add(t) {
        return (tG(this.subscriptions, t), () => this.remove(t));
      }
      remove(t) {
        tz(this.subscriptions, t);
      }
      notify(t, e, i) {
        let s = this.subscriptions.length;
        if (s)
          if (1 === s) this.subscriptions[0](t, e, i);
          else
            for (let n = 0; n < s; n++) {
              let s = this.subscriptions[n];
              s && s(t, e, i);
            }
      }
      getSize() {
        return this.subscriptions.length;
      }
      clear() {
        this.subscriptions.length = 0;
      }
    }
    function tK(t, e, i) {
      e.startsWith("--") ? t.style.setProperty(e, i) : (t.style[e] = i);
    }
    function tY(t) {
      
      return () => (void 0 === e && (e = t()), e);
    }
    (t.s(["SubscriptionManager", 0, tH], 570596),
      t.s(["setStyle", 0, tK], 794581),
      t.s(["memo", 0, tY], 260900));
    let tX = {};
    function t_(t, e) {
      let i = tY(t);
      return () => tX[e] ?? i();
    }
    let tq = t_(() => void 0 !== window.ScrollTimeline, "scrollTimeline"),
      tZ = (t) => null !== t;
    function tJ(t, { repeat: e, repeatType: i = "loop" }, s, n = 1) {
      let r = t.filter(tZ),
        o = n < 0 || (e && "loop" !== i && e % 2 == 1) ? 0 : r.length - 1;
      return o && void 0 !== s ? s : r[o];
    }
    t.s(["getFinalKeyframe", 0, tJ], 414229);
    class tQ {
      constructor() {
        this.isResolved = !1;
      }
      get finished() {
        return (
          this._finished ||
            (this._finished = this.isResolved
              ? Promise.resolve()
              : new Promise((t) => {
                  this._resolve = t;
                })),
          this._finished
        );
      }
      updateFinished() {
        ((this._finished = this._resolve = void 0), (this.isResolved = !1));
      }
      notifyFinished() {
        ((this.isResolved = !0), this._resolve?.());
      }
      then(t, e) {
        return this.finished.then(t, e);
      }
    }
    function t0() {
      i = void 0;
    }
    t.s(["WithPromise", 0, tQ], 779294);
    let t1 = {
      now: () => (
        void 0 === i &&
          t1.set(
            tD.isProcessing || tA.useManualTiming
              ? tD.timestamp
              : performance.now(),
          ),
        i
      ),
      set: (t) => {
        ((i = t), queueMicrotask(t0));
      },
    };
    function t5(t, e) {
      return {
        kind: t,
        animation: e,
        timestamp: t1.now(),
        frameTimestamp: tD.timestamp,
        frameIsProcessing: tD.isProcessing,
      };
    }
    function t7(t, e, i) {
      let s = globalThis.__MOTION_INSPECT__;
      if (s)
        try {
          s({ ...t5("animation-start", t), options: i ? { ...e, ...i } : e });
        } catch {}
    }
    (t.s(["time", 0, t1], 496173),
      t.s(
        [
          "notifyAnimationStart",
          0,
          t7,
          "notifyLayoutAnimationStart",
          0,
          function (t, e) {
            let i = globalThis.__MOTION_INSPECT__;
            if (i)
              try {
                i({ ...t5("layout-animation-start", t), node: e });
              } catch {}
          },
        ],
        349404,
      ));
    let t6 = (t) => Array.isArray(t) && "number" == typeof t[0];
    t.s(["isBezierDefinition", 0, t6], 960855);
    let t2 = t_(() => {
        try {
          document
            .createElement("div")
            .animate({ opacity: 0 }, { easing: "linear(0, 1)" });
        } catch (t) {
          return !1;
        }
        return !0;
      }, "linearEasing"),
      t9 = (t, e, i = 10) => {
        let s = "",
          n = Math.max(Math.round(e / i), 2);
        for (let e = 0; e < n; e++)
          s += Math.round(1e4 * t(e / (n - 1))) / 1e4 + ", ";
        return `linear(${s.substring(0, s.length - 2)})`;
      };
    t.s(["generateLinearEasing", 0, t9], 756512);
    let t3 = ([t, e, i, s]) => `cubic-bezier(${t}, ${e}, ${i}, ${s})`,
      t4 = {
        linear: "linear",
        ease: "ease",
        easeIn: "ease-in",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
        circIn: t3([0, 0.65, 0.55, 1]),
        circOut: t3([0.55, 0, 1, 0.45]),
        backIn: t3([0.31, 0.01, 0.66, -0.59]),
        backOut: t3([0.33, 1.53, 0.69, 0.99]),
      };
    function t8(t) {
      return "function" == typeof t && "applyToOptions" in t;
    }
    t.s(["isGenerator", 0, t8], 997307);
    class et extends tQ {
      constructor(t) {
        if (
          (super(),
          (this.finishedTime = null),
          (this.isStopped = !1),
          (this.manualStartTime = null),
          !t)
        )
          return;
        const {
          element: e,
          name: i,
          keyframes: s,
          pseudoElement: n,
          allowFlatten: r = !1,
          finalKeyframe: o,
          onComplete: a,
        } = t;
        ((this.isPseudoElement = !!n),
          (this.allowFlatten = r),
          (this.options = t),
          J(t.type));
        const l = (function ({ type: t, ...e }) {
          return t8(t) && t2()
            ? t.applyToOptions(e)
            : (e.duration ?? (e.duration = 300),
              e.ease ?? (e.ease = "easeOut"),
              e);
        })(t);
        ((this.animation = (function (
          t,
          e,
          i,
          {
            delay: s = 0,
            duration: n = 300,
            repeat: r = 0,
            repeatType: o = "loop",
            ease: a = "easeOut",
            times: l,
          } = {},
          h,
        ) {
          let u = { [e]: i };
          l && (u.offset = l);
          let c = (function t(e, i) {
            if (e)
              return "function" == typeof e
                ? t2()
                  ? t9(e, i)
                  : "ease-out"
                : t6(e)
                  ? t3(e)
                  : Array.isArray(e)
                    ? e.map((e) => t(e, i) || t4.easeOut)
                    : t4[e];
          })(a, n);
          Array.isArray(c) && (u.easing = c);
          let d = {
            delay: s,
            duration: n,
            easing: Array.isArray(c) ? "linear" : c,
            fill: "both",
            iterations: r + 1,
            direction: "reverse" === o ? "alternate" : "normal",
          };
          return (h && (d.pseudoElement = h), t.animate(u, d));
        })(e, i, s, l, n)),
          !1 === l.autoplay && this.animation.pause(),
          (this.animation.onfinish = () => {
            if (((this.finishedTime = this.time), !n)) {
              let t = tJ(s, this.options, o, this.speed);
              (this.updateMotionValue && this.updateMotionValue(t),
                tK(e, i, t),
                this.animation.cancel());
            }
            (a?.(), this.notifyFinished());
          }),
          t7(this, t, l));
      }
      play() {
        this.isStopped ||
          ((this.manualStartTime = null),
          this.animation.play(),
          "finished" === this.state && this.updateFinished());
      }
      pause() {
        this.animation.pause();
      }
      complete() {
        this.animation.finish?.();
      }
      cancel() {
        try {
          this.animation.cancel();
        } catch (t) {}
      }
      stop() {
        if (this.isStopped) return;
        this.isStopped = !0;
        let { state: t } = this;
        "idle" !== t &&
          "finished" !== t &&
          (this.updateMotionValue
            ? this.updateMotionValue()
            : this.commitStyles(),
          this.isPseudoElement || this.cancel());
      }
      commitStyles() {
        let t = this.options?.element;
        !this.isPseudoElement &&
          t?.isConnected &&
          this.animation.commitStyles?.();
      }
      get duration() {
        return t$(
          Number(this.animation.effect?.getComputedTiming?.().duration || 0),
        );
      }
      get iterationDuration() {
        let { delay: t = 0 } = this.options || {};
        return this.duration + t$(t);
      }
      get time() {
        return t$(Number(this.animation.currentTime) || 0);
      }
      set time(t) {
        let e = null !== this.finishedTime;
        ((this.manualStartTime = null),
          (this.finishedTime = null),
          (this.animation.currentTime = tW(t)),
          e && this.animation.pause());
      }
      get speed() {
        return this.animation.playbackRate;
      }
      set speed(t) {
        (t < 0 && (this.finishedTime = null),
          (this.animation.playbackRate = t));
      }
      get state() {
        return null !== this.finishedTime
          ? "finished"
          : this.animation.playState;
      }
      get startTime() {
        return this.manualStartTime ?? Number(this.animation.startTime);
      }
      set startTime(t) {
        this.manualStartTime = this.animation.startTime = t;
      }
      attachTimeline({ timeline: t, rangeStart: e, rangeEnd: i, observe: s }) {
        return (this.allowFlatten &&
          this.animation.effect?.updateTiming({ easing: "linear" }),
        (this.animation.onfinish = null),
        t && tq())
          ? ((this.animation.timeline = t),
            e && (this.animation.rangeStart = e),
            i && (this.animation.rangeEnd = i),
            tP)
          : s(this);
      }
    }
    t.s(["NativeAnimation", 0, et], 368e3);
    let ee = new Set([
      "opacity",
      "clipPath",
      "filter",
      "transform",
      "backgroundColor",
    ]);
    t.s(["acceleratedValues", 0, ee], 962118);
    let { schedule: ei } = tV(queueMicrotask, !1);
    t.s(["microtask", 0, ei], 560140);
    let es = (t, e) => (e ? (1e3 / e) * t : 0);
    t.s(["velocityPerSecond", 0, es], 325791);
    class en {
      constructor(t, e = {}) {
        ((this.canTrackVelocity = null),
          (this.events = {}),
          (this.updateAndNotify = (t) => {
            let e = t1.now();
            if (
              (this.updatedAt !== e && this.setPrevFrameValue(),
              (this.prev = this.current),
              this.setCurrent(t),
              this.current !== this.prev &&
                (this.notifyChange(), this.dependents))
            )
              for (let t of this.dependents) t.dirty();
          }),
          (this.hasAnimated = !1),
          this.setCurrent(t),
          (this.owner = e.owner));
      }
      setCurrent(t) {
        ((this.current = t),
          (this.updatedAt = t1.now()),
          null === this.canTrackVelocity &&
            void 0 !== t &&
            (this.canTrackVelocity = !isNaN(parseFloat(this.current))));
      }
      setPrevFrameValue(t = this.current) {
        ((this.prevFrameValue = t), (this.prevUpdatedAt = this.updatedAt));
      }
      onChange(t) {
        return this.on("change", t);
      }
      on(t, e) {
        
        return "change" === t
          ? this.onChangeSubscribe(e)
          : ((i = this.events)[t] || (i[t] = new tH())).add(e);
      }
      onChangeSubscribe(t) {
        let { events: e } = this;
        return (
          e.change || this.changeSubscriber
            ? (e.change ||
                ((e.change = new tH()),
                e.change.add(this.changeSubscriber),
                (this.changeSubscriber = void 0)),
              e.change.add(t))
            : (this.changeSubscriber = t),
          () => {
            (this.changeSubscriber === t
              ? (this.changeSubscriber = void 0)
              : e.change?.remove(t),
              this.stopIfUnobserved());
          }
        );
      }
      stopIfUnobserved() {
        tC.read(() => {
          this.changeSubscriber || this.events.change?.getSize() || this.stop();
        });
      }
      clearListeners() {
        for (let t in ((this.changeSubscriber = void 0), this.events))
          this.events[t].clear();
      }
      attach(t, e) {
        ((this.passiveEffect = t), (this.stopPassiveEffect = e));
      }
      set(t) {
        this.passiveEffect
          ? this.passiveEffect(t, this.updateAndNotify)
          : this.updateAndNotify(t);
      }
      setWithVelocity(t, e, i) {
        (this.set(e),
          (this.prev = void 0),
          (this.prevFrameValue = t),
          (this.prevUpdatedAt = this.updatedAt - i));
      }
      jump(t, e = !0) {
        (this.updateAndNotify(t),
          (this.prev = t),
          (this.prevUpdatedAt = this.prevFrameValue = void 0),
          e && this.stop(),
          this.stopPassiveEffect && this.stopPassiveEffect());
      }
      dirty() {
        this.notifyChange();
      }
      notifyChange() {
        let { current: t, changeSubscriber: e } = this;
        e ? e(t) : this.events.change?.notify(t);
      }
      addDependent(t) {
        (this.dependents || (this.dependents = new Set()),
          this.dependents.add(t));
      }
      removeDependent(t) {
        this.dependents && this.dependents.delete(t);
      }
      get() {
        return (e && e.push(this), this.current);
      }
      getPrevious() {
        return this.prev;
      }
      getVelocity() {
        let t = t1.now();
        if (
          !this.canTrackVelocity ||
          void 0 === this.prevFrameValue ||
          t - this.updatedAt > 30
        )
          return 0;
        let e = Math.min(this.updatedAt - this.prevUpdatedAt, 30);
        return es(
          parseFloat(this.current) - parseFloat(this.prevFrameValue),
          e,
        );
      }
      start(t) {
        return (
          this.stop(),
          new Promise((e) => {
            
            this.hasAnimated = !0;
            let s = !1;
            ((i = t(() => {
              ((s = !0),
                this.events.animationComplete?.notify(),
                this.animation === i && this.clearAnimation(),
                e());
            })),
              s || (this.animation = i),
              this.events.animationStart?.notify());
          })
        );
      }
      stop() {
        (this.animation &&
          (this.animation.stop(),
          this.events.animationCancel && this.events.animationCancel.notify()),
          this.clearAnimation());
      }
      isAnimating() {
        return !!this.animation;
      }
      clearAnimation() {
        this.animation = void 0;
      }
      destroy() {
        (this.dependents?.clear(),
          this.events.destroy?.notify(),
          this.clearListeners(),
          this.stop(),
          this.stopPassiveEffect && this.stopPassiveEffect());
      }
    }
    function er(t, e) {
      return new en(t, e);
    }
    t.s(["motionValue", 0, er], 486427);
    let eo = new WeakMap();
    function ea(t) {
      return null !== t && "object" == typeof t && "function" == typeof t.start;
    }
    function el(t) {
      return "string" == typeof t || Array.isArray(t);
    }
    (t.s(["isAnimationControls", 0, ea], 885983),
      t.s(["isVariantLabel", 0, el], 732525));
    let eh = [
        "animate",
        "whileInView",
        "whileFocus",
        "whileHover",
        "whileTap",
        "whileDrag",
        "exit",
      ],
      eu = ["initial", ...eh];
    function ec(t) {
      if (ea(t.animate)) return !0;
      for (let e = 0; e < eu.length; e++) if (el(t[eu[e]])) return !0;
      return !1;
    }
    function ed(t) {
      return !!(ec(t) || t.variants);
    }
    (t.s(["variantPriorityOrder", 0, eh, "variantProps", 0, eu], 706840),
      t.s(["isControllingVariants", 0, ec, "isVariantNode", 0, ed], 587576));
    let em = { current: null },
      ep = { current: !1 };
    t.s(
      ["hasReducedMotionListener", 0, ep, "prefersReducedMotion", 0, em],
      571164,
    );
    let ef = "u" > typeof window;
    function eg() {
      if (((ep.current = !0), ef))
        if (window.matchMedia) {
          let t = window.matchMedia("(prefers-reduced-motion)"),
            e = () => (em.current = t.matches);
          (t.addEventListener("change", e), e());
        } else em.current = !1;
    }
    function ev(t) {
      let e = [{}, {}];
      return (
        t?.values.forEach((t, i) => {
          ((e[0][i] = t.get()), (e[1][i] = t.getVelocity()));
        }),
        e
      );
    }
    function ey(t, e, i, s) {
      if ("function" == typeof e) {
        let [n, r] = ev(s);
        e = e(void 0 !== i ? i : t.custom, n, r);
      }
      if (
        ("string" == typeof e && (e = t.variants && t.variants[e]),
        "function" == typeof e)
      ) {
        let [n, r] = ev(s);
        e = e(void 0 !== i ? i : t.custom, n, r);
      }
      return e;
    }
    (t.s(["initPrefersReducedMotion", 0, eg], 138544),
      t.s(["resolveVariantFromProps", 0, ey], 386579));
    let ex = [
        "AnimationStart",
        "AnimationComplete",
        "Update",
        "BeforeLayoutMeasure",
        "LayoutMeasure",
        "LayoutAnimationStart",
        "LayoutAnimationComplete",
      ],
      eb = {};
    class eT {
      scrapeMotionValuesFromProps(t, e, i) {
        return {};
      }
      constructor(
        {
          parent: t,
          props: e,
          presenceContext: i,
          reducedMotionConfig: s,
          skipAnimations: n,
          blockInitialAnimation: r,
          visualState: o,
        },
        a = {},
      ) {
        ((this.current = null),
          (this.children = new Set()),
          (this.isVariantNode = !1),
          (this.isControllingVariants = !1),
          (this.shouldReduceMotion = null),
          (this.shouldSkipAnimations = !1),
          (this.values = new Map()),
          (this.KeyframeResolver = tO),
          (this.features = {}),
          (this.valueSubscriptions = new Map()),
          (this.prevMotionValues = {}),
          (this.hasBeenMounted = !1),
          (this.events = {}),
          (this.propEventSubscriptions = {}),
          (this.notifyUpdate = () => this.notify("Update", this.latestValues)),
          (this.render = () => {
            this.current &&
              (this.triggerBuild(),
              this.renderInstance(
                this.current,
                this.renderState,
                this.props.style,
                this.projection,
              ));
          }),
          (this.renderScheduledAt = 0),
          (this.scheduleRender = () => {
            let t = t1.now();
            this.renderScheduledAt < t &&
              ((this.renderScheduledAt = t), tC.render(this.render, !1, !0));
          }));
        const { latestValues: l, renderState: h } = o;
        ((this.latestValues = l),
          (this.baseTarget = { ...l }),
          (this.initialValues = e.initial ? { ...l } : {}),
          (this.renderState = h),
          (this.parent = t),
          (this.props = e),
          (this.presenceContext = i),
          (this.depth = t ? t.depth + 1 : 0),
          (this.reducedMotionConfig = s),
          (this.skipAnimationsConfig = n),
          (this.options = a),
          (this.blockInitialAnimation = !!r),
          (this.isControllingVariants = ec(e)),
          (this.isVariantNode = ed(e)),
          this.isVariantNode && (this.variantChildren = new Set()),
          (this.manuallyAnimateOnMount = !!(t && t.current)));
        const { willChange: u, ...c } = this.scrapeMotionValuesFromProps(
          e,
          {},
          this,
        );
        for (const t in c) {
          const e = c[t];
          void 0 !== l[t] && Y(e) && e.set(l[t]);
        }
      }
      mount(t) {
        if (this.hasBeenMounted)
          for (let t in this.initialValues)
            (this.values.get(t)?.jump(this.initialValues[t]),
              (this.latestValues[t] = this.initialValues[t]));
        ((this.current = t),
          eo.set(t, this),
          this.projection &&
            !this.projection.instance &&
            this.projection.mount(t),
          this.parent &&
            this.isVariantNode &&
            !this.isControllingVariants &&
            (this.removeFromVariantTree = this.parent.addVariantChild(this)),
          this.values.forEach((t, e) => this.bindToMotionValue(e, t)),
          "never" === this.reducedMotionConfig
            ? (this.shouldReduceMotion = !1)
            : "always" === this.reducedMotionConfig
              ? (this.shouldReduceMotion = !0)
              : (ep.current || eg(), (this.shouldReduceMotion = em.current)),
          (this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1),
          this.parent?.addChild(this),
          this.update(this.props, this.presenceContext),
          (this.hasBeenMounted = !0));
      }
      unmount() {
        for (let t in (this.projection && this.projection.unmount(),
        tE(this.notifyUpdate),
        tE(this.render),
        this.valueSubscriptions.forEach((t) => t()),
        this.valueSubscriptions.clear(),
        this.removeFromVariantTree && this.removeFromVariantTree(),
        this.parent?.removeChild(this),
        this.events))
          this.events[t].clear();
        for (let t in this.features) {
          let e = this.features[t];
          e && (e.unmount(), (e.isMounted = !1));
        }
        this.current = null;
      }
      addChild(t) {
        (this.children.add(t),
          this.enteringChildren ?? (this.enteringChildren = new Set()),
          this.enteringChildren.add(t));
      }
      removeChild(t) {
        (this.children.delete(t),
          this.enteringChildren && this.enteringChildren.delete(t));
      }
      bindToMotionValue(t, e) {
        
        if (
          (this.valueSubscriptions.has(t) && this.valueSubscriptions.get(t)(),
          e.accelerate && ee.has(t) && this.current instanceof HTMLElement)
        ) {
          let {
              factory: i,
              keyframes: s,
              times: n,
              ease: r,
              duration: o,
            } = e.accelerate,
            a = new et({
              element: this.current,
              name: t,
              keyframes: s,
              times: n,
              ease: r,
              duration: tW(o),
            }),
            l = i(a);
          this.valueSubscriptions.set(t, () => {
            (l(), a.cancel());
          });
          return;
        }
        let s = n.has(t);
        s && this.onBindTransform && this.onBindTransform();
        let r = e.on("change", (e) => {
          ((this.latestValues[t] = e),
            this.props.onUpdate && tC.preRender(this.notifyUpdate),
            s && this.projection && (this.projection.isTransformDirty = !0),
            this.scheduleRender());
        });
        ("u" > typeof window &&
          window.MotionCheckAppearSync &&
          (i = window.MotionCheckAppearSync(this, t, e)),
          this.valueSubscriptions.set(t, () => {
            (r(), i && i());
          }));
      }
      sortNodePosition(t) {
        return this.current &&
          this.sortInstanceNodePosition &&
          this.type === t.type
          ? this.sortInstanceNodePosition(this.current, t.current)
          : 0;
      }
      updateFeatures() {
        let t = "animation";
        for (t in eb) {
          let e = eb[t];
          if (!e) continue;
          let { isEnabled: i, Feature: s } = e;
          if (
            (!this.features[t] &&
              s &&
              i(this.props) &&
              (this.features[t] = new s(this)),
            this.features[t])
          ) {
            let e = this.features[t];
            e.isMounted ? e.update() : (e.mount(), (e.isMounted = !0));
          }
        }
      }
      triggerBuild() {
        this.build(this.renderState, this.latestValues, this.props);
      }
      measureViewportBox() {
        return this.current
          ? this.measureInstanceViewportBox(this.current, this.props)
          : K();
      }
      getStaticValue(t) {
        return this.latestValues[t];
      }
      setStaticValue(t, e) {
        this.latestValues[t] = e;
      }
      update(t, e) {
        ((t.transformTemplate || this.props.transformTemplate) &&
          this.scheduleRender(),
          (this.prevProps = this.props),
          (this.props = t),
          (this.prevPresenceContext = this.presenceContext),
          (this.presenceContext = e));
        for (let e = 0; e < ex.length; e++) {
          let i = ex[e];
          this.propEventSubscriptions[i] &&
            (this.propEventSubscriptions[i](),
            delete this.propEventSubscriptions[i]);
          let s = t["on" + i];
          s && (this.propEventSubscriptions[i] = this.on(i, s));
        }
        ((this.prevMotionValues = (function (t, e, i) {
          for (let s in e) {
            let n = e[s],
              r = i[s];
            if (Y(n)) t.addValue(s, n);
            else if (Y(r)) t.addValue(s, er(n, { owner: t }));
            else if (r !== n)
              if (t.hasValue(s)) {
                let e = t.getValue(s);
                !0 === e.liveStyle ? e.jump(n) : e.hasAnimated || e.set(n);
              } else {
                let e = t.getStaticValue(s);
                t.addValue(s, er(void 0 !== e ? e : n, { owner: t }));
              }
          }
          for (let s in i) void 0 === e[s] && t.removeValue(s);
          return e;
        })(
          this,
          this.scrapeMotionValuesFromProps(t, this.prevProps || {}, this),
          this.prevMotionValues,
        )),
          this.handleChildMotionValue && this.handleChildMotionValue());
      }
      getProps() {
        return this.props;
      }
      getVariant(t) {
        return this.props.variants ? this.props.variants[t] : void 0;
      }
      getDefaultTransition() {
        return this.props.transition;
      }
      getTransformPagePoint() {
        return this.props.transformPagePoint;
      }
      getClosestVariantNode() {
        return this.isVariantNode
          ? this
          : this.parent
            ? this.parent.getClosestVariantNode()
            : void 0;
      }
      addVariantChild(t) {
        let e = this.getClosestVariantNode();
        if (e)
          return (
            e.variantChildren && e.variantChildren.add(t),
            () => e.variantChildren.delete(t)
          );
      }
      addValue(t, e) {
        let i = this.values.get(t);
        e !== i &&
          (i && this.removeValue(t),
          this.bindToMotionValue(t, e),
          this.values.set(t, e),
          (this.latestValues[t] = e.get()));
      }
      removeValue(t) {
        this.values.delete(t);
        let e = this.valueSubscriptions.get(t);
        (e && (e(), this.valueSubscriptions.delete(t)),
          delete this.latestValues[t],
          this.removeValueFromRenderState(t, this.renderState));
      }
      hasValue(t) {
        return this.values.has(t);
      }
      getValue(t, e) {
        if (this.props.values && this.props.values[t])
          return this.props.values[t];
        let i = this.values.get(t);
        return (
          void 0 === i &&
            void 0 !== e &&
            ((i = er(null === e ? void 0 : e, { owner: this })),
            this.addValue(t, i)),
          i
        );
      }
      readValue(t, e) {
        let i =
          void 0 === this.latestValues[t] && this.current
            ? (this.getBaseTargetFromProps(this.props, t) ??
              this.readValueFromInstance(this.current, t, this.options))
            : this.latestValues[t];
        if (null != i) {
          
          ("string" == typeof i &&
          ((s = i),
          /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(s) ||
            ((n = i), /^0[^.\s]+$/u.test(n)))
            ? (i = parseFloat(i))
            : "number" != typeof i && !B.test(i) && B.test(e) && (i = ta(t, e)),
            this.setBaseTarget(t, Y(i) ? i.get() : i));
        }
        return Y(i) ? i.get() : i;
      }
      setBaseTarget(t, e) {
        this.baseTarget[t] = e;
      }
      getBaseTarget(t) {
        let e,
          { initial: i } = this.props;
        if ("string" == typeof i || "object" == typeof i) {
          let s = ey(this.props, i, this.presenceContext?.custom);
          s && (e = s[t]);
        }
        if (i && void 0 !== e) return e;
        let s = this.getBaseTargetFromProps(this.props, t);
        return void 0 === s || Y(s)
          ? void 0 !== this.initialValues[t] && void 0 === e
            ? void 0
            : this.baseTarget[t]
          : s;
      }
      on(t, e) {
        return (
          this.events[t] || (this.events[t] = new tH()),
          this.events[t].add(e)
        );
      }
      notify(t, ...e) {
        this.events[t] && this.events[t].notify(...e);
      }
      scheduleRenderMicrotask() {
        ei.render(this.render);
      }
    }
    t.s(
      [
        "VisualElement",
        0,
        eT,
        "getFeatureDefinitions",
        0,
        function () {
          return eb;
        },
        "setFeatureDefinitions",
        0,
        function (t) {
          eb = t;
        },
      ],
      617218,
    );
    class eS extends eT {
      constructor() {
        (super(...arguments), (this.KeyframeResolver = tU));
      }
      sortInstanceNodePosition(t, e) {
        return 2 & t.compareDocumentPosition(e) ? 1 : -1;
      }
      getBaseTargetFromProps(t, e) {
        let i = t.style;
        return i ? i[e] : void 0;
      }
      removeValueFromRenderState(t, { vars: e, style: i }) {
        (delete e[t], delete i[t]);
      }
      handleChildMotionValue() {
        this.childSubscription &&
          (this.childSubscription(), delete this.childSubscription);
        let { children: t } = this.props;
        Y(t) &&
          (this.childSubscription = t.on("change", (t) => {
            this.current && (this.current.textContent = `${t}`);
          }));
      }
    }
    function ew(t) {
      return t.replace(/([A-Z])/g, (t) => `-${t.toLowerCase()}`);
    }
    t.s(["camelToDash", 0, ew], 793787);
    let eP = (t, e) => (e && "number" == typeof t ? e.transform(t) : t),
      eA = {
        x: "translateX",
        y: "translateY",
        z: "translateZ",
        transformPerspective: "perspective",
      },
      eM = s.length;
    function eV(t, e, i) {
      let { style: r, vars: o, transformOrigin: a } = t,
        l = !1,
        h = !1;
      for (let t in e) {
        let i = e[t];
        if (n.has(t)) {
          l = !0;
          continue;
        }
        if (tt(t)) {
          o[t] = i;
          continue;
        }
        {
          let e = eP(i, W[t]);
          t.startsWith("origin") ? ((h = !0), (a[t] = e)) : (r[t] = e);
        }
      }
      if (
        (!e.transform &&
          (l || i
            ? (r.transform = (function (t, e, i) {
                let n = "",
                  r = !0;
                for (let o = 0; o < eM; o++) {
                  let a = s[o],
                    l = t[a];
                  if (void 0 === l) continue;
                  let h = !0;
                  if ("number" == typeof l) h = l === +!!a.startsWith("scale");
                  else {
                    let t = parseFloat(l);
                    h = a.startsWith("scale") ? 1 === t : 0 === t;
                  }
                  if (!h || i) {
                    let t = eP(l, W[a]);
                    if (!h) {
                      r = !1;
                      let e = eA[a] || a;
                      n += `${e}(${t}) `;
                    }
                    i && (e[a] = t);
                  }
                }
                let o = t.pathRotation;
                return (
                  o && ((r = !1), (n += `rotate(${eP(o, W.pathRotation)}) `)),
                  (n = n.trim()),
                  i ? (n = i(e, r ? "" : n)) : r && (n = "none"),
                  n
                );
              })(e, t.transform, i))
            : r.transform && (r.transform = "none")),
        h)
      ) {
        let { originX: t = "50%", originY: e = "50%", originZ: i = 0 } = a;
        r.transformOrigin = `${t} ${e} ${i}`;
      }
    }
    t.s(["buildHTMLStyles", 0, eV], 544947);
    let eC = { offset: "stroke-dashoffset", array: "stroke-dasharray" },
      eE = { offset: "strokeDashoffset", array: "strokeDasharray" },
      eD = [
        "transform",
        "opacity",
        "offsetDistance",
        "offsetPath",
        "offsetRotate",
        "offsetAnchor",
      ];
    function ek(
      t,
      {
        attrX: e,
        attrY: i,
        attrScale: s,
        pathLength: n,
        pathSpacing: r = 1,
        pathOffset: o = 0,
        ...a
      },
      l,
      h,
      u,
    ) {
      if ((eV(t, a, h), l)) {
        t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
        return;
      }
      ((t.attrs = t.style), (t.style = {}));
      let { attrs: c, style: d } = t;
      for (let t of eD) void 0 !== c[t] && ((d[t] = c[t]), delete c[t]);
      ((d.transform || c.transformOrigin) &&
        ((d.transformOrigin = c.transformOrigin ?? "50% 50%"),
        delete c.transformOrigin),
        d.transform &&
          ((d.transformBox = u?.transformBox ?? "fill-box"),
          delete c.transformBox),
        void 0 !== e && (c.x = e),
        void 0 !== i && (c.y = i),
        void 0 !== s && (c.scale = s),
        void 0 !== n &&
          (function (t, e, i = 1, s = 0, n = !0) {
            t.pathLength = 1;
            let r = n ? eC : eE;
            ((t[r.offset] = `${-s}`), (t[r.array] = `${e} ${i}`));
          })(c, n, r, o, !1));
    }
    t.s(["buildSVGAttrs", 0, ek, "cssStyleProperties", 0, eD], 181261);
    let eR = new Set([
        "baseFrequency",
        "diffuseConstant",
        "kernelMatrix",
        "kernelUnitLength",
        "keySplines",
        "keyTimes",
        "limitingConeAngle",
        "markerHeight",
        "markerWidth",
        "numOctaves",
        "targetX",
        "targetY",
        "surfaceScale",
        "specularConstant",
        "specularExponent",
        "stdDeviation",
        "tableValues",
        "viewBox",
        "gradientTransform",
        "pathLength",
        "startOffset",
        "textLength",
        "lengthAdjust",
      ]),
      eL = (t) => "string" == typeof t && "svg" === t.toLowerCase();
    function eB(t, { style: e, vars: i }, s, n) {
      let r,
        o = t.style;
      for (r in e) o[r] = e[r];
      for (r in (n?.applyProjectionStyles(o, s), i)) o.setProperty(r, i[r]);
    }
    t.s(["isSVGTag", 0, eL], 399951);
    let eF = [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomRightRadius",
      "borderBottomLeftRadius",
    ];
    function ej(t, e) {
      return e.max === e.min ? 0 : (t / (e.max - e.min)) * 100;
    }
    t.s(["cornerRadiusProps", 0, eF], 895051);
    let eI = {
        correct: (t, e) => {
          if (!e.target) return t;
          if ("string" == typeof t)
            if (!b.test(t)) return t;
            else t = parseFloat(t);
          let i = ej(t, e.target.x),
            s = ej(t, e.target.y);
          return `${i}% ${s}%`;
        },
      },
      eO = (t, e, i) => t + (e - t) * i;
    t.s(["mixNumber", 0, eO], 100706);
    let eN = {
      borderRadius: { ...eI, applyTo: [...eF] },
      borderTopLeftRadius: eI,
      borderTopRightRadius: eI,
      borderBottomLeftRadius: eI,
      borderBottomRightRadius: eI,
      boxShadow: {
        correct: (t, { treeScale: e, projectionDelta: i }) => {
          let s = B.parse(t);
          if (s.length > 5) return t;
          let n = B.createTransformer(t),
            r = +("number" != typeof s[0]),
            o = i.x.scale * e.x,
            a = i.y.scale * e.y;
          ((s[0 + r] /= o), (s[1 + r] /= a));
          let l = eO(o, a, 0.5);
          return (
            "number" == typeof s[2 + r] && (s[2 + r] /= l),
            "number" == typeof s[3 + r] && (s[3 + r] /= l),
            n(s)
          );
        },
      },
    };
    function eU(t, { layout: e, layoutId: i }) {
      return (
        n.has(t) ||
        t.startsWith("origin") ||
        ((e || void 0 !== i) && (!!eN[t] || "opacity" === t))
      );
    }
    function eW(t, e, i) {
      let s = t.style,
        n = e?.style,
        r = {};
      if (!s) return r;
      for (let e in s)
        (Y(s[e]) ||
          (n && Y(n[e])) ||
          eU(e, t) ||
          i?.getValue(e)?.liveStyle !== void 0) &&
          (r[e] = s[e]);
      return r;
    }
    function e$(t, e, i) {
      let n = eW(t, e, i);
      for (let i in t)
        (Y(t[i]) || Y(e[i])) &&
          (n[
            -1 !== s.indexOf(i)
              ? "attr" + i.charAt(0).toUpperCase() + i.substring(1)
              : i
          ] = t[i]);
      return n;
    }
    (t.s(["scaleCorrectors", 0, eN], 924463),
      t.s(["isForcedMotionValue", 0, eU], 130789),
      t.s(["scrapeMotionValuesFromProps", 0, eW], 984049),
      t.s(["scrapeMotionValuesFromProps", 0, e$], 767926));
    class eG extends eS {
      constructor() {
        (super(...arguments),
          (this.type = "svg"),
          (this.isSVGTag = !1),
          (this.measureInstanceViewportBox = K));
      }
      getBaseTargetFromProps(t, e) {
        return t[e];
      }
      readValueFromInstance(t, e) {
        if (n.has(e)) {
          let t = G(e);
          return (t && t.default) || 0;
        }
        if (eD.includes(e)) {
          let i = getComputedStyle(t)[e];
          if ("string" == typeof i && i) return i.trim();
        }
        return ((e = eR.has(e) ? e : ew(e)), t.getAttribute(e));
      }
      scrapeMotionValuesFromProps(t, e, i) {
        return e$(t, e, i);
      }
      build(t, e, i) {
        ek(t, e, this.isSVGTag, i.transformTemplate, i.style);
      }
      renderInstance(t, e, i, s) {
        for (let i in (eB(t, e, void 0, s), e.attrs))
          t.setAttribute(eR.has(i) ? i : ew(i), e.attrs[i]);
      }
      mount(t) {
        ((this.isSVGTag = eL(t.tagName)), super.mount(t));
      }
    }
    function ez({ top: t, left: e, right: i, bottom: s }) {
      return { x: { min: e, max: i }, y: { min: t, max: s } };
    }
    function eH(t, e) {
      if (!e) return t;
      let i = e({ x: t.left, y: t.top }),
        s = e({ x: t.right, y: t.bottom });
      return { top: i.y, left: i.x, bottom: s.y, right: s.x };
    }
    function eK(t) {
      return void 0 === t || 1 === t;
    }
    function eY({ scale: t, scaleX: e, scaleY: i }) {
      return !eK(t) || !eK(e) || !eK(i);
    }
    function eX(t) {
      return (
        eY(t) ||
        e_(t) ||
        t.z ||
        t.rotate ||
        t.rotateX ||
        t.rotateY ||
        t.skewX ||
        t.skewY
      );
    }
    function e_(t) {
      
      return ((e = t.x) && "0%" !== e) || ((i = t.y) && "0%" !== i);
    }
    function eq(t, e, i) {
      return i + e * (t - i);
    }
    function eZ(t, e, i, s, n) {
      return (void 0 !== n && (t = eq(t, n, s)), eq(t, i, s) + e);
    }
    function eJ(t, e = 0, i = 1, s, n) {
      ((t.min = eZ(t.min, e, i, s, n)), (t.max = eZ(t.max, e, i, s, n)));
    }
    function eQ(t, { x: e, y: i }) {
      (eJ(t.x, e.translate, e.scale, e.originPoint),
        eJ(t.y, i.translate, i.scale, i.originPoint));
    }
    function e0(t, e) {
      ((t.min += e), (t.max += e));
    }
    function e1(t, e, i, s, n = 0.5) {
      let r = eO(t.min, t.max, n);
      eJ(t, e, i, r, s);
    }
    function e5(t, e) {
      return "string" == typeof t ? (parseFloat(t) / 100) * (e.max - e.min) : t;
    }
    function e7(t, e, i) {
      let s = i ?? t;
      (e1(t.x, e5(e.x, s.x), e.scaleX, e.scale, e.originX),
        e1(t.y, e5(e.y, s.y), e.scaleY, e.scale, e.originY));
    }
    function e6(t, e) {
      return ez(eH(t.getBoundingClientRect(), e));
    }
    (t.s(
      [
        "convertBoundingBoxToBox",
        0,
        ez,
        "convertBoxToBoundingBox",
        0,
        function ({ x: t, y: e }) {
          return { top: e.min, right: t.max, bottom: e.max, left: t.min };
        },
        "transformBoxPoints",
        0,
        eH,
      ],
      27677,
    ),
      t.s(
        ["has2DTranslate", 0, e_, "hasScale", 0, eY, "hasTransform", 0, eX],
        177777,
      ),
      t.s(
        [
          "applyBoxDelta",
          0,
          eQ,
          "applyTreeDeltas",
          0,
          function (t, e, i, s = !1) {
            let n,
              r,
              o = i.length;
            if (o) {
              e.x = e.y = 1;
              for (let a = 0; a < o; a++) {
                r = (n = i[a]).projectionDelta;
                let { visualElement: o } = n.options;
                (!o ||
                  !o.props.style ||
                  "contents" !== o.props.style.display) &&
                  (s &&
                    n.options.layoutScroll &&
                    n.scroll &&
                    n !== n.root &&
                    (e0(t.x, -n.scroll.offset.x), e0(t.y, -n.scroll.offset.y)),
                  r && ((e.x *= r.x.scale), (e.y *= r.y.scale), eQ(t, r)),
                  s &&
                    eX(n.latestValues) &&
                    e7(t, n.latestValues, n.layout?.layoutBox));
              }
              (e.x < 1.0000000000001 && e.x > 0.999999999999 && (e.x = 1),
                e.y < 1.0000000000001 && e.y > 0.999999999999 && (e.y = 1));
            }
          },
          "scalePoint",
          0,
          eq,
          "transformBox",
          0,
          e7,
          "translateAxis",
          0,
          e0,
        ],
        135636,
      ),
      t.s(
        [
          "measurePageBox",
          0,
          function (t, e, i) {
            let s = e6(t, i),
              { scroll: n } = e;
            return (n && (e0(s.x, n.offset.x), e0(s.y, n.offset.y)), s);
          },
          "measureViewportBox",
          0,
          e6,
        ],
        153689,
      ));
    class e2 extends eS {
      constructor() {
        (super(...arguments), (this.type = "html"), (this.renderInstance = eB));
      }
      mount(t) {
        (J(t.style), super.mount(t));
      }
      readValueFromInstance(t, e) {
        if (n.has(e))
          return this.projection?.isProjecting
            ? tf(e)
            : ((t, e) => {
                let { transform: i = "none" } = getComputedStyle(t);
                return tg(i, e);
              })(t, e);
        {
          let i = window.getComputedStyle(t),
            s = (tt(e) ? i.getPropertyValue(e) : i[e]) || 0;
          return "string" == typeof s ? s.trim() : s;
        }
      }
      measureInstanceViewportBox(t, { transformPagePoint: e }) {
        return e6(t, e);
      }
      build(t, e, i) {
        eV(t, e, i.transformTemplate);
      }
      scrapeMotionValuesFromProps(t, e, i) {
        return eW(t, e, i);
      }
    }
    var e9 = t.i(271645);
    let e3 = [
      "animate",
      "circle",
      "defs",
      "desc",
      "ellipse",
      "g",
      "image",
      "line",
      "filter",
      "marker",
      "mask",
      "metadata",
      "path",
      "pattern",
      "polygon",
      "polyline",
      "rect",
      "stop",
      "switch",
      "symbol",
      "svg",
      "text",
      "tspan",
      "use",
      "view",
    ];
    function e4(t) {
      if ("string" != typeof t || t.includes("-"));
      else if (e3.indexOf(t) > -1 || /[A-Z]/u.test(t)) return !0;
      return !1;
    }
    (t.s(["isSVGComponent", 0, e4], 944966),
      t.s(
        [
          "createDomVisualElement",
          0,
          (t, e) =>
            (e.isSVG ?? e4(t))
              ? new eG(e)
              : new e2(e, { allowProjection: t !== e9.Fragment }),
        ],
        154505,
      ));
