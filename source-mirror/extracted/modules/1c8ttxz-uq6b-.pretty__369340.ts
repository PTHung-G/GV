// Reconstructed from 1c8ttxz-uq6b-.pretty.js, module 369340.
// deps: m271645, m705844, m934620
// exports: useControllableState
export { d as "useControllableState" };

"use strict";
    var t = m271645,
      n = m705844,
      r = m934620,
      o = Object.defineProperty,
      i = t[" useEffectEvent ".trim().toString()],
      u = t[" useInsertionEffect ".trim().toString()];
    function a(e) {
      if ("function" == typeof i) return i(e);
      let n = t.useRef(() => {
        throw Error("Cannot call an event handler while rendering.");
      });
      return (
        "function" == typeof u
          ? u(() => {
              n.current = e;
            })
          : (0, r.useLayoutEffect)(() => {
              n.current = e;
            }),
        t.useMemo(
          () =>
            (...e) =>
              n.current?.(...e),
          [],
        )
      );
    }
    o(a, "name", { value: "useEffectEvent", configurable: !0 });
    var c = Object.defineProperty,
      s = (e, t) => c(e, "name", { value: t, configurable: !0 }),
      l = t[" useInsertionEffect ".trim().toString()] || r.useLayoutEffect;
    function d({
      prop: e,
      defaultProp: r,
      onChange: o = s(() => {}, "onChange"),
      caller: i,
    }) {
      let [u, a, c] = f({ defaultProp: r, onChange: o }),
        l = void 0 !== e,
        v = l ? e : u;
      if (n.IS_DEVELOPMENT) {
        let n = t.useRef(void 0 !== e);
        t.useEffect(() => {
          let e = n.current;
          if (e !== l) {
            let t = l ? "controlled" : "uncontrolled";
            console.warn(
              `${i} is changing from ${e ? "controlled" : "uncontrolled"} to ${t}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
            );
          }
          n.current = l;
        }, [l, i]);
      }
      return [
        v,
        t.useCallback(
          (t) => {
            if (l) {
              let n = m(t) ? t(e) : t;
              n !== e && c.current?.(n);
            } else a(t);
          },
          [l, e, a, c],
        ),
      ];
    }
    function f({ defaultProp: e, onChange: n }) {
      let [r, o] = t.useState(e),
        i = t.useRef(r),
        u = t.useRef(n);
      return (
        l(() => {
          u.current = n;
        }, [n]),
        t.useEffect(() => {
          i.current !== r && (u.current?.(r), (i.current = r));
        }, [r, i]),
        [r, o, u]
      );
    }
    function m(e) {
      return "function" == typeof e;
    }
    (s(d, "useControllableState"),
      s(f, "useUncontrolledState"),
      s(m, "isFunction"));
    var v = Symbol("RADIX:SYNC_STATE");
    (s(function (e, r, o, i) {
      let { prop: u, defaultProp: c, onChange: s, caller: l } = r,
        d = void 0 !== u,
        f = a(s);
      if (n.IS_DEVELOPMENT) {
        let e = t.useRef(void 0 !== u);
        t.useEffect(() => {
          let t = e.current;
          if (t !== d) {
            let e = d ? "controlled" : "uncontrolled";
            console.warn(
              `${l} is changing from ${t ? "controlled" : "uncontrolled"} to ${e}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
            );
          }
          e.current = d;
        }, [d, l]);
      }
      let m = [{ ...o, state: c }];
      i && m.push(i);
      let [p, h] = t.useReducer(
          (t, n) => {
            if (n.type === v) return { ...t, state: n.state };
            let r = e(t, n);
            return (d && !Object.is(r.state, t.state) && f(r.state), r);
          },
          ...m,
        ),
        E = p.state,
        y = t.useRef(E);
      t.useEffect(() => {
        y.current !== E && ((y.current = E), d || f(E));
      }, [E, y, d]);
      let b = t.useMemo(() => (void 0 !== u ? { ...p, state: u } : p), [p, u]);
      return (
        t.useEffect(() => {
          d && !Object.is(u, p.state) && h({ type: v, state: u });
        }, [u, p.state, d]),
        [b, h]
      );
    }, "useControllableStateReducer"),
      );
