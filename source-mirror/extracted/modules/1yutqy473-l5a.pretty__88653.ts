// Reconstructed from 1yutqy473-l5a.pretty.js, module 88653.
// deps: m843476, m271645, m231178, m947414, m674008, m821476, m772846, m737806, m464978
// exports: AnimatePresence
export { ({ children: e, custom: l, initial: s = !0, onExitComplete: o, presenceAffectsLayout: c = !0, mode: d = "sync", propagate: u = !1, anchorX: h = "left", anchorY: f = "top", root: b, }) => { let [y, v] = (0, g.usePresence)(u), k = (0, n.useMemo)(() => m(e), [e]), w = u && !y ? [] : k.map(x), j = (0, n.useRef)(!0), M = (0, a.useConstant)(() => new Map()), N = (0, n.useRef)(new Set()), [C, T] = (0, n.useState)(k), [E, S] = (0, n.useState)(k); ((0, i.useIsomorphicLayoutEffect)(() => { !u || y || E.length || v?.(); }, [y, u, E.length, v]), (0, i.useIsomorphicLayoutEffect)(() => { j.current = !1; for (let e = 0; e < E.length; e++) { let t = x(E[e]); w.includes(t) ? (M.delete(t), N.current.delete(t)) : !0 !== M.get(t) && M.set(t, !1); } }, [E, w.length, w.join("-")])); let _ = []; if (k !== C) { let e = [...k], t = 0; for (let n of E) { let r = w.indexOf(x(n)); -1 === r ? (e.splice(t++, 0, n), _.push(n)) : (t = r + _.length + 1); } return ( _.every((e) => M.get(x(e))) ? (e = k) : "wait" === d && (e = _), S(m(e)), T(k), null ); } let { forceRender: A } = (0, n.useContext)(r.LayoutGroupContext); return (0, t.jsx)(t.Fragment, { children: E.map((e) => { let n = x(e), r = (!u || !!y) && (k === E || w.includes(n)); return (0, t.jsx)( p, { isPresent: r, initial: (!j.current || !!s) && void 0, custom: l, presenceAffectsLayout: c, mode: d, root: b, onExitComplete: r ? void 0 : () => { if (N.current.has(n) || !M.has(n)) return; (N.current.add(n), M.set(n, !0)); let e = !0; (M.forEach((t) => { t || (e = !1); }), e && (A?.(), T([]), u && v?.(), o && o())); }, anchorX: h, anchorY: f, children: e, }, n, ); }), }); } as "AnimatePresence" };

"use strict";
    var t = m843476,
      n = m271645,
      r = m231178,
      a = m947414,
      i = m674008,
      l = m821476,
      s = m772846,
      o = n,
      c = m737806;
    function d(e, t) {
      if ("function" == typeof e) return e(t);
      null != e && (e.current = t);
    }
    class u extends o.Component {
      getSnapshotBeforeUpdate(e) {
        let t = this.props.childRef.current;
        if (
          (0, s.isHTMLElement)(t) &&
          e.isPresent &&
          !this.props.isPresent &&
          !1 !== this.props.pop
        ) {
          let e = t.offsetParent,
            n = ((0, s.isHTMLElement)(e) && e.offsetWidth) || 0,
            r = ((0, s.isHTMLElement)(e) && e.offsetHeight) || 0,
            a = getComputedStyle(t),
            i = this.props.sizeRef.current;
          ((i.height = parseFloat(a.height)),
            (i.width = parseFloat(a.width)),
            (i.top = t.offsetTop),
            (i.left = t.offsetLeft),
            (i.right = n - i.width - i.left),
            (i.bottom = r - i.height - i.top),
            (i.direction = a.direction));
        }
        return null;
      }
      componentDidUpdate() {}
      render() {
        return this.props.children;
      }
    }
    function h({
      children: e,
      isPresent: r,
      anchorX: a,
      anchorY: i,
      root: l,
      pop: s,
    }) {
      let p = (0, o.useId)(),
        f = (0, o.useRef)(null),
        g = (0, o.useRef)({
          width: 0,
          height: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          direction: "ltr",
        }),
        { nonce: x } = (0, o.useContext)(c.MotionConfigContext),
        m = (function (...e) {
          return n.useCallback(
            (function (...e) {
              return (t) => {
                let n = !1,
                  r = e.map((e) => {
                    let r = d(e, t);
                    return (n || "function" != typeof r || (n = !0), r);
                  });
                if (n)
                  return () => {
                    for (let t = 0; t < r.length; t++) {
                      let n = r[t];
                      "function" == typeof n ? n() : d(e[t], null);
                    }
                  };
              };
            })(...e),
            e,
          );
        })(f, !1 !== s ? (e.props?.ref ?? e?.ref) : void 0);
      return (
        (0, o.useInsertionEffect)(() => {
          let {
            width: e,
            height: t,
            top: n,
            left: o,
            right: c,
            bottom: d,
            direction: u,
          } = g.current;
          if (r || !1 === s || !f.current || !e || !t) return;
          let h = "rtl" === u,
            m =
              "left" === a
                ? h
                  ? `right: ${c}`
                  : `left: ${o}`
                : h
                  ? `left: ${o}`
                  : `right: ${c}`,
            b = "bottom" === i ? `bottom: ${d}` : `top: ${n}`;
          f.current.dataset.motionPopId = p;
          let y = document.createElement("style");
          x && (y.nonce = x);
          let v = l ?? document.head;
          return (
            v.appendChild(y),
            y.sheet &&
              y.sheet.insertRule(`
          [data-motion-pop-id="${p}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${t}px !important;
            ${m}px !important;
            ${b}px !important;
          }
        `),
            () => {
              (f.current?.removeAttribute("data-motion-pop-id"),
                v.contains(y) && v.removeChild(y));
            }
          );
        }, [r]),
        (0, t.jsx)(u, {
          isPresent: r,
          childRef: f,
          sizeRef: g,
          pop: s,
          children: !1 === s ? e : o.cloneElement(e, { ref: m }),
        })
      );
    }
    let p = ({
      children: e,
      initial: r,
      isPresent: s,
      onExitComplete: o,
      custom: c,
      presenceAffectsLayout: d,
      mode: u,
      anchorX: p,
      anchorY: g,
      root: x,
    }) => {
      let m = (0, a.useConstant)(f),
        b = (0, n.useId)(),
        y = (0, n.useRef)(s),
        v = (0, n.useRef)(o);
      (0, i.useIsomorphicLayoutEffect)(() => {
        ((y.current = s), (v.current = o));
      });
      let k = !0,
        w = (0, n.useMemo)(
          () => (
            (k = !1),
            {
              id: b,
              initial: r,
              isPresent: s,
              custom: c,
              onExitComplete: (e) => {
                for (let t of (m.set(e, !0), m.values())) if (!t) return;
                o && o();
              },
              register: (e) => (
                m.set(e, !1),
                () => {
                  (m.delete(e), y.current || m.size || v.current?.());
                }
              ),
            }
          ),
          [s, m, o],
        );
      return (
        d && k && (w = { ...w }),
        (0, n.useMemo)(() => {
          m.forEach((e, t) => m.set(t, !1));
        }, [s]),
        n.useEffect(() => {
          s || m.size || !o || o();
        }, [s]),
        (e = (0, t.jsx)(h, {
          pop: "popLayout" === u,
          isPresent: s,
          anchorX: p,
          anchorY: g,
          root: x,
          children: e,
        })),
        (0, t.jsx)(l.PresenceContext.Provider, { value: w, children: e })
      );
    };
    function f() {
      return new Map();
    }
    var g = m464978;
    let x = (e) => e.key || "";
    function m(e) {
      let t = [];
      return (
        n.Children.forEach(e, (e) => {
          (0, n.isValidElement)(e) && t.push(e);
        }),
        t
      );
    }
    ;
