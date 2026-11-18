// Reconstructed from 1twhdx9v_bid8.pretty.js, module 369421.
// deps: m843476, m271645, m515281, m766887, m650957, m604131
// exports: buildGeometrySvg, GeometryView
export { a as "buildGeometrySvg" };
export { function ({ data: e, onUpdate: o }) { let s, [l, u] = (0, r.useState)(!1), [c, f] = (0, r.useState)({ data: e }); try { s = (0, i.parseGeometryData)(e); } catch {} let d = o && s ? (0, i.resolveGeometry)(s).problems.filter( (e) => "error" === e.level, ).length : 0; (0, r.useEffect)(() => { let t = !0; return ( a(e).then( ({ svg: r }) => { t && f({ data: e, svg: r }); }, (r) => { t && f({ data: e, error: r instanceof Error ? r.message : "Không dựng được hình học.", }); }, ), () => { t = !1; } ); }, [e]); let p = c.data === e ? c : null; return (0, t.jsxs)("div", { className: "geometry-wrap relative mx-auto my-1 break-inside-avoid", style: { width: s?.width ?? 440, maxWidth: "100%", breakInside: "avoid", }, children: [ s?.caption && (0, t.jsx)("div", { className: "mb-1 text-center text-sm font-bold", children: (0, t.jsx)(M.RichText, { text: s.caption }), }), (0, t.jsxs)("div", { className: "relative group/geometry", children: [ p?.svg ? (0, t.jsx)("div", { role: "img", "aria-label": s?.caption || "Hình học", className: "[&>svg]:block [&>svg]:h-auto [&>svg]:w-full", dangerouslySetInnerHTML: { __html: p.svg }, }) : (0, t.jsx)("div", { role: p?.error ? "alert" : "status", className: "flex items-center justify-center border border-dashed p-4 text-sm text-neutral-600", style: { minHeight: s?.height ?? 120 }, children: p?.error ?? "Đang dựng hình học…", }), o && (0, t.jsxs)("button", { type: "button", onClick: () => u((e) => !e), className: "no-print absolute right-0 top-0 flex items-center gap-1 rounded border bg-white px-2 py-1 font-sans text-xs text-neutral-600 shadow-sm", title: "Sửa hình học", children: [ (0, t.jsx)(n.Pencil, { className: "size-3", "aria-hidden": !0, }), " Sửa hình", ], }), o && (0, t.jsx)(A.InlinePanel, { open: l, onClose: () => u(!1), title: "Hình học", width: 470, children: (0, t.jsx)(N, { data: e, onChange: o }), }), ], }), s?.bottomCaption && (0, t.jsx)("div", { className: "mt-1 text-center text-sm italic", children: (0, t.jsx)(M.RichText, { text: s.bottomCaption }), }), d > 0 && (0, t.jsxs)("button", { type: "button", onClick: () => u(!0), className: "no-print mt-1 block w-full text-center font-sans text-xs text-amber-700 underline", children: [d, " phần của hình chưa vẽ được - bấm để xem"], }), ], }); } as "GeometryView" };

"use strict";
    var t = m843476,
      r = m271645,
      n = m515281,
      i = m766887;
    async function a(t) {
      let r,
        n = (0, i.resolveGeometry)((0, i.parseGeometryData)(t)),
        a = n.data,
        { positions: o } = n,
        s = (0, i.geometryFrame)(a, n),
        l = (await e.A(773069)).default,
        u = document.createElement("div");
      ((u.id = `geometry-${crypto.randomUUID()}`),
        Object.assign(u.style, {
          position: "fixed",
          left: "-20000px",
          top: "0",
          width: `${a.width}px`,
          height: `${a.height}px`,
          visibility: "hidden",
          overflow: "hidden",
        }),
        document.body.appendChild(u));
      try {
        r = l.JSXGraph.initBoard(u.id, {
          boundingbox: s.box,
          keepaspectratio: !0,
          axis: !1,
          grid: !1,
          renderer: "svg",
          showCopyright: !1,
          showNavigation: !1,
          registerEvents: !1,
          resize: { enabled: !1, throttle: 0 },
          pan: { enabled: !1 },
          zoom: !1,
        });
        let e = {
            fixed: !0,
            highlight: !1,
            strokeColor: "#000000",
            strokeWidth: 1.5,
            fillColor: "none",
          },
          t = new Map();
        for (let n of a.points) {
          let i = o.get(n.id);
          !i ||
            t.has(n.id) ||
            t.set(
              n.id,
              r.create("point", [i.x, i.y], {
                ...e,
                name: "",
                withLabel: !1,
                size: 1.5,
                fillColor: "#000000",
                visible: !n.hidden,
              }),
            );
        }
        for (let { circle: i, center: a, radius: o } of n.circles) {
          let n =
            "center" in i
              ? t.get(i.center)
              : r.create("point", [a.x, a.y], {
                  ...e,
                  visible: !1,
                  name: "",
                  withLabel: !1,
                });
          r.create("circle", [n, o], { ...e, dash: 2 * !!i.dashed });
        }
        for (let i of n.segments)
          r.create("segment", [t.get(i.from), t.get(i.to)], {
            ...e,
            dash: 2 * !!i.dashed,
          });
        let c = (s.box[2] - s.box[0]) * 0.045;
        for (let a of n.angles)
          r.create(
            "angle",
            a.points.map((e) => t.get(e)),
            {
              ...e,
              name: a.label ?? "",
              withLabel: !!a.label,
              selection: "minor",
              radius: (0, i.angleMarkRadius)(a, o, r.unitX, c),
              type: a.right ? "square" : "sector",
              orthoType: a.right ? "square" : "sector",
              fillOpacity: 0,
              label: {
                display: "internal",
                parse: !1,
                useMathJax: !1,
                useKatex: !1,
                fontSize: 14,
              },
            },
          );
        for (let e of a.points) {
          let t = s.labelOffsets.get(e.id),
            n = o.get(e.id);
          t &&
            n &&
            !e.hidden &&
            "" !== e.label &&
            r.create(
              "text",
              [n.x + t[0] / r.unitX, n.y + t[1] / r.unitY, e.label ?? e.id],
              {
                fixed: !0,
                highlight: !1,
                display: "internal",
                parse: !1,
                useMathJax: !1,
                useKatex: !1,
                fontSize: 16,
                strokeColor: "#000000",
                anchorX: "middle",
                anchorY: "middle",
                cssStyle: "font-family: Times New Roman, serif;",
              },
            );
        }
        r.fullUpdate();
        let f = u.querySelector("svg");
        if (!f) throw Error("Không dựng được hình học.");
        (f.setAttribute("width", String(a.width)),
          f.setAttribute("height", String(a.height)),
          f.setAttribute("viewBox", `0 0 ${a.width} ${a.height}`));
        let d = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        return (
          d.setAttribute("width", "100%"),
          d.setAttribute("height", "100%"),
          d.setAttribute("fill", "#ffffff"),
          f.insertBefore(d, f.firstChild),
          {
            svg: new XMLSerializer().serializeToString(f),
            width: a.width,
            height: a.height,
          }
        );
      } finally {
        (r && l.JSXGraph.freeBoard(r), u.remove());
      }
    }
    ;
    let o = (e, t) => ({ x: e.x - t.x, y: e.y - t.y }),
      s = (e, t) => ({ x: e.x + t.x, y: e.y + t.y }),
      l = (e, t) => ({ x: e.x * t, y: e.y * t }),
      u = (e, t) => e.x * t.x + e.y * t.y,
      c = (e, t) => Math.hypot(e.x - t.x, e.y - t.y),
      f = (e, t) => ({ x: (e.x + t.x) / 2, y: (e.y + t.y) / 2 });
    function d(e, t) {
      if ("point" === e.kind) return e.at;
      if ("line" === e.kind) {
        let r = o(e.b, e.a),
          n = u(r, r);
        return n < 1e-9 ? e.a : s(e.a, l(r, u(o(t, e.a), r) / n));
      }
      let r = o(t, e.center),
        n = Math.hypot(r.x, r.y);
      return n < 1e-9
        ? s(e.center, { x: e.radius, y: 0 })
        : s(e.center, l(r, e.radius / n));
    }
    function p(e, t) {
      if ("point" === e.kind || "point" === t.kind) {
        let [r, n] = "point" === e.kind ? [e.at, t] : [t.at, e];
        return c(d(n, r), r) < 1e-7 * Math.max(1, Math.hypot(r.x, r.y))
          ? [r]
          : [];
      }
      if ("line" === e.kind && "line" === t.kind) {
        let r = o(e.b, e.a),
          n = o(t.b, t.a),
          i = r.x * n.y - r.y * n.x;
        if (Math.abs(i) < 1e-9 * Math.max(1, u(r, r), u(n, n))) return [];
        let a = ((t.a.x - e.a.x) * n.y - (t.a.y - e.a.y) * n.x) / i;
        return [s(e.a, l(r, a))];
      }
      if ("circle" === e.kind && "circle" === t.kind) {
        let r = c(e.center, t.center);
        if (
          r < 1e-9 ||
          r > e.radius + t.radius + 1e-9 ||
          r < Math.abs(e.radius - t.radius) - 1e-9
        )
          return [];
        let n = (e.radius ** 2 - t.radius ** 2 + r * r) / (2 * r),
          i = Math.sqrt(Math.max(0, e.radius ** 2 - n * n)),
          a = l(o(t.center, e.center), 1 / r),
          u = s(e.center, l(a, n));
        return i < 1e-9
          ? [u]
          : [
              s(u, { x: -a.y * i, y: a.x * i }),
              s(u, { x: a.y * i, y: -a.x * i }),
            ];
      }
      let r = "line" === e.kind ? e : t,
        n = "circle" === e.kind ? e : t,
        i = d(r, n.center),
        a = n.radius ** 2 - c(i, n.center) ** 2;
      if (a < -1e-9 * Math.max(1, n.radius ** 2)) return [];
      let f = o(r.b, r.a),
        p = Math.hypot(f.x, f.y);
      if (p < 1e-9) return [];
      let h = Math.sqrt(Math.max(0, a)),
        m = l(f, 1 / p);
      return h < 1e-9 ? [i] : [s(i, l(m, h)), s(i, l(m, -h))];
    }
    function h(e) {
      return "x" in e
        ? "free"
        : "onCircle" === e.kind
          ? "onCircle"
          : "ratio" === e.kind
            ? "ratio"
            : null;
    }
    let m = (e, t, r) => `∠${e}${t}${r}`,
      g = [
        [0.5, "1/2"],
        [1 / 3, "1/3"],
        [2 / 3, "2/3"],
        [0.25, "1/4"],
        [0.75, "3/4"],
        [0, "0"],
        [1, "1"],
        [2, "2"],
        [-1, "-1"],
      ],
      x = (e, t) => Math.round(e * 10 ** t) / 10 ** t,
      y = (e) => (0, i.resolveGeometry)(e, { checkAngles: !1 }),
      b = (e) => e.problems.filter((e) => "error" === e.level).length;
    function v(e, t, r) {
      return {
        ...e,
        points: e.points.map((e) => (e.id === t ? { ...e, ...r } : e)),
      };
    }
    function w({ data: e, onCommit: n, width: a = 420 }) {
      let N = Math.round((a * e.height) / e.width),
        [A, M] = (0, r.useState)(null),
        D = A?.from === e ? A.next : null,
        C = (t) => M(t ? { from: e, next: t } : null),
        [E, S] = (0, r.useState)(null),
        [T, k] = (0, r.useState)(null),
        [F, B] = (0, r.useState)(""),
        O = (0, r.useRef)(null),
        z = (0, r.useMemo)(() => y(e), [e]),
        _ = (0, r.useMemo)(() => {
          let t = (0, i.geometryFrame)(e, z, a, N),
            [r, n, o, s] = t.box,
            l = t.scale,
            u = (r + o) / 2,
            c = (n + s) / 2;
          return {
            scale: l,
            labelOffsets: t.labelOffsets,
            toPx: (e) => ({
              x: a / 2 + (e.x - u) * l,
              y: N / 2 - (e.y - c) * l,
            }),
            fromPx: (e, t) => ({
              x: u + (e - a / 2) / l,
              y: c - (t - N / 2) / l,
            }),
            defaultAngleRadius: (o - r) * 0.045,
          };
        }, [e, z, a, N]),
        j = D ?? e,
        $ = (0, r.useMemo)(() => (D ? y(D) : z), [D, z]),
        { positions: R } = $;
      if (!R.size)
        return (0, t.jsx)("p", {
          className: "text-neutral-500",
          children: "Hình chưa dựng được nên chưa kéo thả được.",
        });
      let { toPx: I, fromPx: L, scale: P } = _,
        q = (e) => I(R.get(e)),
        H = (e) => {
          if (!e) return;
          let t = n(e);
          (B(t ?? ""), t && C(null));
        },
        U = (e, t, r) => {
          let [n, i] = [I(e), I(t)];
          if (r) {
            let e = i.x - n.x,
              t = i.y - n.y,
              r = Math.hypot(e, t) || 1,
              o = a + N;
            [n, i] = [
              { x: n.x - (e / r) * o, y: n.y - (t / r) * o },
              { x: n.x + (e / r) * o, y: n.y + (t / r) * o },
            ];
          }
          return { x1: n.x, y1: n.y, x2: i.x, y2: i.y };
        },
        G = D ? (0, i.defaultLabelOffsets)(j, R, P) : _.labelOffsets,
        W = E ? q(E.id) : null;
      return (0, t.jsxs)("div", {
        className: "space-y-1",
        children: [
          (0, t.jsxs)("svg", {
            ref: O,
            width: a,
            height: N,
            viewBox: `0 0 ${a} ${N}`,
            className:
              "block max-w-full touch-none select-none rounded border bg-white",
            onPointerMove: (t) => {
              
              if (!E) return;
              let n = ((t, r, n) => {
                let a = e.points.find((e) => e.id === t.id),
                  y = n ? 0 : 9 / P,
                  b = h(a);
                if ("free" === b) {
                  let n = (function (e, t, r, n, a) {
                      let u = (function (e, t) {
                          let r = new Map();
                          for (let t of e.points)
                            if ("parents" in t)
                              for (let e of t.parents)
                                r.set(e, [...(r.get(e) ?? []), t.id]);
                          let n = new Set([t]),
                            i = [t];
                          for (; i.length; )
                            for (let e of r.get(i.pop()) ?? [])
                              n.has(e) || (n.add(e), i.push(e));
                          return n;
                        })(e, r),
                        h = (e) => (u.has(e) ? void 0 : t.get(e)),
                        g = (e) =>
                          e.reduce(
                            (e, t) => (!e || c(t, n) < c(e, n) ? t : e),
                            null,
                          ),
                        x = (function (e, t, r) {
                          let n = [];
                          for (let i of e.angles) {
                            if (!i.right) continue;
                            let [e, a, l] = i.points,
                              u = m(e, a, l);
                            if (a === t) {
                              let t = r(e),
                                i = r(l);
                              t &&
                                i &&
                                n.push({
                                  locus: {
                                    kind: "circle",
                                    center: f(t, i),
                                    radius: c(t, i) / 2,
                                  },
                                  label: `${u} = 90\xb0`,
                                });
                            } else if (e === t || l === t) {
                              let i = r(a),
                                c = r(e === t ? l : e);
                              if (i && c) {
                                let e = o(c, i);
                                n.push({
                                  locus: {
                                    kind: "line",
                                    a: i,
                                    b: s(i, { x: -e.y, y: e.x }),
                                  },
                                  label: `${u} = 90\xb0`,
                                });
                              }
                            }
                          }
                          return n;
                        })(e, r, h),
                        y = n,
                        b = [],
                        v = null;
                      if (
                        (1 === x.length
                          ? ((y = d(x[0].locus, n)), (v = x[0].locus))
                          : x.length > 1 &&
                            (y =
                              g(p(x[0].locus, x[1].locus)) ?? d(x[0].locus, n)),
                        x.length && b.push(...x.map((e) => e.label)),
                        x.length > 1)
                      )
                        return {
                          at: y,
                          labels: b,
                          loci: x.map((e) => e.locus),
                        };
                      let w = (function (e, t, r) {
                        let n = [],
                          a = (function (e) {
                            let t = new Map(),
                              r = (e, r) => {
                                (t.has(e) || t.set(e, new Set()),
                                  t.get(e).add(r));
                              };
                            for (let t of e.segments)
                              (r(t.from, t.to), r(t.to, t.from));
                            return t;
                          })(e),
                          u = [...(a.get(t) ?? [])].filter((e) => r(e));
                        for (let e = 0; e < u.length; e++)
                          for (let i = e + 1; i < u.length; i++) {
                            let a = r(u[e]),
                              l = r(u[i]);
                            if (1e-9 > c(a, l)) continue;
                            n.push({
                              locus: {
                                kind: "circle",
                                center: f(a, l),
                                radius: c(a, l) / 2,
                              },
                              label: `${m(u[e], t, u[i])} = 90\xb0`,
                            });
                            let d = f(a, l),
                              p = o(l, a);
                            n.push({
                              locus: {
                                kind: "line",
                                a: d,
                                b: s(d, { x: -p.y, y: p.x }),
                              },
                              label: `${t}${u[e]} = ${t}${u[i]}`,
                            });
                          }
                        for (let e of u) {
                          let i = r(e);
                          (n.push({
                            locus: {
                              kind: "line",
                              a: i,
                              b: s(i, { x: 1, y: 0 }),
                            },
                            label: `${t}${e} nằm ngang (song song m\xe9p tr\xean, dưới của giấy)`,
                          }),
                            n.push({
                              locus: {
                                kind: "line",
                                a: i,
                                b: s(i, { x: 0, y: 1 }),
                              },
                              label: `${t}${e} thẳng đứng (song song m\xe9p tr\xe1i, phải của giấy)`,
                            }));
                          let u = [...(a.get(e) ?? [])].filter(
                            (e) => e !== t && r(e),
                          );
                          for (let a of u) {
                            let l = o(r(a), i);
                            1e-9 > Math.hypot(l.x, l.y) ||
                              n.push({
                                locus: {
                                  kind: "line",
                                  a: i,
                                  b: s(i, { x: -l.y, y: l.x }),
                                },
                                label: `${m(t, e, a)} = 90\xb0`,
                              });
                          }
                          for (let c = 0; c < u.length; c++)
                            for (let d = c + 1; d < u.length; d++) {
                              let p = r(u[c]),
                                h = r(u[d]),
                                g = o(p, i),
                                x = o(h, i),
                                y = Math.hypot(g.x, g.y),
                                b = Math.hypot(x.x, x.y);
                              if (y < 1e-9 || b < 1e-9) continue;
                              let v = s(l(g, 1 / y), l(x, 1 / b));
                              (Math.hypot(v.x, v.y) > 1e-9 &&
                                n.push({
                                  locus: { kind: "line", a: i, b: s(i, v) },
                                  label: `${t}${e} l\xe0 ph\xe2n gi\xe1c ${m(u[c], e, u[d])}`,
                                }),
                                a.get(u[c])?.has(u[d]) &&
                                  n.push({
                                    locus: { kind: "line", a: i, b: f(p, h) },
                                    label: `${t}${e} l\xe0 trung tuyến của tam gi\xe1c ${e}${u[c]}${u[d]}`,
                                  }));
                            }
                        }
                        for (let i of e.segments) {
                          if (i.from === t || i.to === t) continue;
                          let e = r(i.from),
                            a = r(i.to);
                          !e ||
                            !a ||
                            1e-9 > c(e, a) ||
                            (n.push({
                              locus: { kind: "point", at: f(e, a) },
                              label: `${t} l\xe0 trung điểm ${i.from}${i.to}`,
                            }),
                            n.push({
                              locus: { kind: "line", a: e, b: a },
                              label: `${t} nằm tr\xean đường thẳng ${i.from}${i.to}`,
                            }));
                        }
                        for (let a of e.circles) {
                          let e,
                            o = (0, i.circlePoints)(a);
                          if (o.includes(t) || o.some((e) => !r(e))) continue;
                          try {
                            e = (0, i.resolveCircle)(
                              a,
                              new Map(o.map((e) => [e, r(e)])),
                            );
                          } catch {
                            continue;
                          }
                          let { center: s, radius: l } = e;
                          n.push({
                            locus: { kind: "circle", center: s, radius: l },
                            label: `${t} nằm tr\xean đường tr\xf2n${"center" in a ? ` (${a.center})` : ""}`,
                          });
                        }
                        return n;
                      })(e, r, h)
                        .map((e) => {
                          let t = v ? g(p(e.locus, v)) : d(e.locus, y);
                          return t && { ...e, p: t, d: c(t, y) };
                        })
                        .filter((e) => !!e && e.d <= a)
                        .sort((e, t) => e.d - t.d);
                      if (!w.length)
                        return {
                          at: y,
                          labels: b,
                          loci: x.map((e) => e.locus),
                        };
                      if (!v) {
                        let e = null;
                        for (let t = 0; t < w.length; t++)
                          for (let r = t + 1; r < w.length; r++) {
                            if (
                              "point" === w[t].locus.kind &&
                              "point" === w[r].locus.kind
                            )
                              continue;
                            let i = g(p(w[t].locus, w[r].locus));
                            i &&
                              c(i, n) <= 1.5 * a &&
                              (!e || c(i, n) < c(e.p, n)) &&
                              (e = { p: i, pair: [w[t], w[r]] });
                          }
                        if (e) {
                          let [t, r] = e.pair;
                          return {
                            at: e.p,
                            labels: [t.label, r.label],
                            loci: [t.locus, r.locus],
                          };
                        }
                      }
                      return {
                        at: w[0].p,
                        labels: [...b, w[0].label],
                        loci: [...x.map((e) => e.locus), w[0].locus],
                      };
                    })(e, t.base, t.id, r, y),
                    a = n.labels.length > 0;
                  return (
                    k(a ? { labels: n.labels, loci: n.loci } : null),
                    v(e, t.id, {
                      x: x(n.at.x, a ? 9 : 2),
                      y: x(n.at.y, a ? 9 : 2),
                    })
                  );
                }
                if ("onCircle" === b && "parents" in a) {
                  let [n, i] = a.parents.map((e) => t.base.get(e)),
                    o = (function (e, t, r, n) {
                      let i = c(e, t),
                        a = Math.atan2(t.y - e.y, t.x - e.x),
                        o =
                          ((Math.atan2(r.y - e.y, r.x - e.x) - a) * 180) /
                          Math.PI,
                        s = 15 * Math.round((o = ((o % 360) + 360) % 360) / 15);
                      if (
                        i > 1e-9 &&
                        (Math.abs(s - o) * Math.PI * i) / 180 <= n
                      ) {
                        let e = s % 360;
                        return {
                          angle: e,
                          label:
                            180 === e
                              ? "Hai điểm đối xứng qua tâm (đường kính)"
                              : `G\xf3c ở t\xe2m ${e}\xb0`,
                        };
                      }
                      return { angle: Math.round(10 * o) / 10 };
                    })(n, i, r, y);
                  return (
                    k(
                      o.label
                        ? {
                            labels: [o.label],
                            loci: [
                              {
                                kind: "circle",
                                center: n,
                                radius: Math.hypot(i.x - n.x, i.y - n.y),
                              },
                            ],
                          }
                        : null,
                    ),
                    v(e, t.id, { angle: o.angle })
                  );
                }
                if ("ratio" === b && "parents" in a) {
                  let [n, i] = a.parents.map((e) => t.base.get(e)),
                    s = (function (e, t, r, n, i) {
                      let a = o(t, e),
                        s = u(a, a);
                      if (s < 1e-9) return { ratio: 0.5 };
                      let l = Math.max(-10, Math.min(10, u(o(r, e), a) / s)),
                        c = Math.sqrt(s);
                      for (let [e, t] of g)
                        if (Math.abs(e - l) * c <= n)
                          return {
                            ratio: e,
                            label:
                              0.5 === e
                                ? `${i[0]} l\xe0 trung điểm ${i[1]}${i[2]}`
                                : `${i[1]}${i[0]} = ${t} ${i[1]}${i[2]}`,
                          };
                      return { ratio: Math.round(1e3 * l) / 1e3 };
                    })(n, i, r, y, [t.id, a.parents[0], a.parents[1]]);
                  return (
                    k(
                      s.label
                        ? {
                            labels: [s.label],
                            loci: [{ kind: "line", a: n, b: i }],
                          }
                        : null,
                    ),
                    v(e, t.id, { ratio: s.ratio })
                  );
                }
                return null;
              })(
                E,
                ((r = O.current.getBoundingClientRect()),
                L(
                  ((t.clientX - r.left) * a) / r.width,
                  ((t.clientY - r.top) * N) / r.height,
                )),
                t.altKey,
              );
              if (!n) return;
              let w = y(n);
              w.positions.has(E.id) && b(w) <= b(z) && C(n);
            },
            onPointerUp: () => {
              E && (S(null), k(null), H(D));
            },
            onPointerCancel: () => {
              (S(null), k(null), C(null));
            },
            children: [
              T?.loci.map((e, r) =>
                "circle" === e.kind
                  ? (0, t.jsx)(
                      "circle",
                      {
                        cx: I(e.center).x,
                        cy: I(e.center).y,
                        r: e.radius * P,
                        fill: "none",
                        stroke: "#2563eb",
                        strokeWidth: 1,
                        strokeDasharray: "4 3",
                      },
                      r,
                    )
                  : "line" === e.kind
                    ? (0, t.jsx)(
                        "line",
                        {
                          ...U(e.a, e.b, !0),
                          stroke: "#2563eb",
                          strokeWidth: 1,
                          strokeDasharray: "4 3",
                        },
                        r,
                      )
                    : (0, t.jsx)(
                        "circle",
                        {
                          cx: I(e.at).x,
                          cy: I(e.at).y,
                          r: 7,
                          fill: "none",
                          stroke: "#2563eb",
                          strokeWidth: 1.5,
                        },
                        r,
                      ),
              ),
              $.circles.map(({ circle: e, center: r, radius: n }, i) => {
                let a = I(r);
                return (0, t.jsx)(
                  "circle",
                  {
                    cx: a.x,
                    cy: a.y,
                    r: n * P,
                    fill: "none",
                    stroke: "#000",
                    strokeWidth: 1.3,
                    strokeDasharray: e.dashed ? "4 3" : void 0,
                  },
                  i,
                );
              }),
              $.segments.map((e, r) =>
                (0, t.jsx)(
                  "line",
                  {
                    ...U(R.get(e.from), R.get(e.to), !1),
                    stroke: "#000",
                    strokeWidth: 1.3,
                    strokeDasharray: e.dashed ? "4 3" : void 0,
                  },
                  r,
                ),
              ),
              $.angles.map((e, r) => {
                let [n, a, o] = e.points.map(q),
                  s = { x: n.x - a.x, y: n.y - a.y },
                  l = { x: o.x - a.x, y: o.y - a.y },
                  u = Math.hypot(s.x, s.y),
                  c = Math.hypot(l.x, l.y);
                if (u < 1e-6 || c < 1e-6) return null;
                let f =
                    (0, i.angleMarkRadius)(e, R, P, _.defaultAngleRadius) * P,
                  d = { x: a.x + (s.x / u) * f, y: a.y + (s.y / u) * f },
                  p = { x: a.x + (l.x / c) * f, y: a.y + (l.y / c) * f };
                if (e.right) {
                  let e = 0.75 * f,
                    n = { x: (s.x / u) * e, y: (s.y / u) * e },
                    i = { x: (l.x / c) * e, y: (l.y / c) * e };
                  return (0, t.jsx)(
                    "path",
                    {
                      d: `M${a.x + n.x},${a.y + n.y} L${a.x + n.x + i.x},${a.y + n.y + i.y} L${a.x + i.x},${a.y + i.y}`,
                      fill: "none",
                      stroke: "#000",
                      strokeWidth: 1,
                    },
                    r,
                  );
                }
                let h = +(s.x * l.y - s.y * l.x > 0);
                return (0, t.jsx)(
                  "path",
                  {
                    d: `M${d.x},${d.y} A${f},${f} 0 0 ${h} ${p.x},${p.y}`,
                    fill: "none",
                    stroke: "#000",
                    strokeWidth: 1,
                  },
                  r,
                );
              }),
              j.points
                .filter(
                  (e, t, r) =>
                    R.has(e.id) && r.findIndex((t) => t.id === e.id) === t,
                )
                .map((r) => {
                  let n,
                    i = q(r.id),
                    a = h(r),
                    o = r.hidden || "" === r.label ? null : (r.label ?? r.id),
                    [s, l] = G.get(r.id) ?? [0, 0];
                  return (0, t.jsxs)(
                    "g",
                    {
                      children: [
                        o &&
                          (0, t.jsx)("text", {
                            x: i.x + s,
                            y: i.y - l,
                            textAnchor: "middle",
                            dominantBaseline: "central",
                            fontFamily: "Times New Roman, serif",
                            fontSize: 15,
                            children: o,
                          }),
                        !r.hidden &&
                          (0, t.jsx)("circle", {
                            cx: i.x,
                            cy: i.y,
                            r: a ? 4.5 : 2.2,
                            fill:
                              "free" === a ? "#2563eb" : a ? "#fff" : "#000",
                            stroke: a && "free" !== a ? "#059669" : "none",
                            strokeWidth: 1.5,
                          }),
                        a &&
                          (0, t.jsx)("circle", {
                            cx: i.x,
                            cy: i.y,
                            r: 12,
                            fill: "transparent",
                            className:
                              E?.id === r.id
                                ? "cursor-grabbing"
                                : "cursor-grab",
                            tabIndex: "free" === a ? 0 : void 0,
                            role: "button",
                            "aria-label": `K\xe9o điểm ${r.id}`,
                            onKeyDown:
                              ((n = r.id),
                              (t) => {
                                let r = t.shiftKey ? 1 : 0.1,
                                  i = {
                                    ArrowLeft: [-r, 0],
                                    ArrowRight: [r, 0],
                                    ArrowUp: [0, r],
                                    ArrowDown: [0, -r],
                                  }[t.key],
                                  a = e.points.find((e) => e.id === n);
                                i &&
                                  a &&
                                  "x" in a &&
                                  (t.preventDefault(),
                                  H(
                                    v(e, n, {
                                      x: x(a.x + i[0], 2),
                                      y: x(a.y + i[1], 2),
                                    }),
                                  ));
                              }),
                            onPointerDown: (e) => {
                              0 === e.button &&
                                (e.preventDefault(),
                                e.target.setPointerCapture?.(e.pointerId),
                                B(""),
                                S({ id: r.id, base: z.positions }));
                            },
                            children: (0, t.jsx)("title", {
                              children:
                                "free" === a
                                  ? `K\xe9o ${r.id}; giữ Alt để kh\xf4ng h\xedt v\xe0o vị tr\xed đặc biệt`
                                  : `K\xe9o ${r.id} dọc theo ${"onCircle" === a ? "đường tròn" : "đường thẳng"} của n\xf3`,
                            }),
                          }),
                      ],
                    },
                    r.id,
                  );
                }),
              T &&
                W &&
                (0, t.jsx)("g", {
                  pointerEvents: "none",
                  children: T.labels.map((e, r) => {
                    let n = Math.min(
                        N - 8 - (T.labels.length - 1 - r) * 16,
                        Math.max(
                          14 + 16 * r,
                          W.y - 18 - (T.labels.length - 1 - r) * 16,
                        ),
                      ),
                      i = Math.min(a - 4, Math.max(4, W.x + 12));
                    return (0, t.jsx)(
                      "text",
                      {
                        x: i,
                        y: n,
                        textAnchor: W.x > 0.6 * a ? "end" : "start",
                        fontSize: 12,
                        fill: "#1d4ed8",
                        stroke: "#fff",
                        strokeWidth: 3,
                        paintOrder: "stroke",
                        fontFamily: "system-ui, sans-serif",
                        children: e,
                      },
                      r,
                    );
                  }),
                }),
            ],
          }),
          F &&
            (0, t.jsx)("p", {
              role: "alert",
              className: "text-red-600",
              children: F,
            }),
        ],
      });
    }
    function N({ data: e, onChange: n }) {
      let a = (0, r.useMemo)(() => {
          try {
            return (0, i.parseGeometryData)(e);
          } catch {
            return;
          }
        }, [e]),
        [o, s] = (0, r.useState)(() => (a ? JSON.stringify(a, null, 2) : e)),
        [l, u] = (0, r.useState)(""),
        c = (0, r.useMemo)(() => (a ? (0, i.resolveGeometry)(a) : null), [a]),
        f =
          c?.problems
            .filter((e) => "error" === e.level)
            .map((e) => e.message) ?? [],
        d =
          c?.problems
            .filter((e) => "adjusted" === e.level)
            .map((e) => e.message) ?? [],
        p = (0, r.useMemo)(() => {
          
          return a && c
            ? [
                ...c.problems
                  .filter((e) => "warning" === e.level)
                  .map((e) => e.message),
                ...((e = c.positions),
                (0, i.farPoints)(a, e).map(
                  (e) =>
                    `Điểm ${e} nằm rất xa phần c\xf2n lại của h\xecnh (thường do hai đường dựng n\xf3 gần như song song) n\xean kh\xf4ng nằm trong khung; k\xe9o điểm tự do để đưa n\xf3 lại gần.`,
                )),
              ]
            : [];
        }, [a, c]),
        h = (e) => {
          try {
            let t = (0, i.resolveGeometry)((0, i.parseGeometryData)(e)).data;
            (s(JSON.stringify(t, null, 2)), n(JSON.stringify(t)), u(""));
          } catch (e) {
            u(
              e instanceof Error ? e.message : "Dữ liệu hình học không hợp lệ.",
            );
          }
        },
        m = (e, t) => {
          try {
            let r = JSON.stringify({ ...JSON.parse(o), [e]: t }, null, 2);
            (s(r), h(r));
          } catch {
            u("Hãy sửa dữ liệu hình trước khi đổi kích thước hoặc chú thích.");
          }
        };
      return (0, t.jsxs)("div", {
        className: "space-y-3 text-xs",
        children: [
          a &&
            (0, t.jsxs)(t.Fragment, {
              children: [
                (0, t.jsx)(w, {
                  data: c.data,
                  onCommit: (e) => {
                    try {
                      let t = (0, i.parseGeometryData)(e),
                        r =
                          c?.problems.filter((e) => "error" === e.level)
                            .length ?? 0,
                        a = (0, i.resolveGeometry)(t).problems.filter(
                          (e) => "error" === e.level,
                        );
                      if (a.length > r) return a[a.length - 1].message;
                      return (
                        s(JSON.stringify(t, null, 2)),
                        n(JSON.stringify(t)),
                        u(""),
                        null
                      );
                    } catch (e) {
                      return e instanceof Error
                        ? e.message
                        : "Không dựng được hình ở vị trí này.";
                    }
                  },
                  width: 436,
                }),
                (0, t.jsxs)("p", {
                  className: "text-neutral-600",
                  children: [
                    "Kéo ",
                    (0, t.jsx)("span", {
                      className: "font-medium text-blue-700",
                      children: "chấm xanh",
                    }),
                    " (điểm tự do) hoặc ",
                    (0, t.jsx)("span", {
                      className: "font-medium text-emerald-700",
                      children: "chấm rỗng",
                    }),
                    " (điểm trên đường tròn/đoạn thẳng); điểm dựng và đường phụ đi theo. Gần góc vuông, trung điểm, đường tròn, trung tuyến, phân giác, vị trí tam giác cân, hay khi một cạnh gần nằm ngang / thẳng đứng theo mép giấy, thì điểm tự hít vào đúng vị trí (giữ Alt để đặt tự do). Phím mũi tên dịch điểm đang chọn.",
                  ],
                }),
                f.length > 0 &&
                  (0, t.jsxs)("div", {
                    role: "alert",
                    className:
                      "rounded border border-red-300 bg-red-50 p-2 text-red-900",
                    children: [
                      (0, t.jsx)("p", {
                        className: "font-medium",
                        children: "Phần hình chưa vẽ được:",
                      }),
                      (0, t.jsx)("ul", {
                        className: "ml-4 list-disc",
                        children: f.map((e) =>
                          (0, t.jsx)("li", { children: e }, e),
                        ),
                      }),
                      (0, t.jsx)("p", {
                        className: "mt-1",
                        children:
                          "Phần còn lại vẫn được vẽ. Sửa điểm cha, hoặc mở “Sửa điểm và đường vẽ” để sửa dữ liệu.",
                      }),
                    ],
                  }),
                d.length > 0 &&
                  (0, t.jsxs)("div", {
                    role: "status",
                    className:
                      "rounded border border-blue-200 bg-blue-50 p-2 text-blue-900",
                    children: [
                      (0, t.jsx)("p", {
                        className: "font-medium",
                        children: "Đã dựng lại cho khớp với hình:",
                      }),
                      (0, t.jsx)("ul", {
                        className: "ml-4 list-disc",
                        children: d.map((e) =>
                          (0, t.jsx)("li", { children: e }, e),
                        ),
                      }),
                      (0, t.jsx)("button", {
                        type: "button",
                        className:
                          "mt-2 rounded border border-blue-300 bg-white px-2 py-1",
                        onClick: () => h(JSON.stringify(c.data)),
                        children: "Lưu dữ liệu hình đã sửa",
                      }),
                    ],
                  }),
                p.length > 0 &&
                  (0, t.jsxs)("div", {
                    role: "status",
                    className:
                      "rounded border border-amber-300 bg-amber-50 p-2 text-amber-900",
                    children: [
                      (0, t.jsx)("p", {
                        className: "font-medium",
                        children: "Lưu ý:",
                      }),
                      (0, t.jsx)("ul", {
                        className: "ml-4 list-disc",
                        children: p.map((e) =>
                          (0, t.jsx)("li", { children: e }, e),
                        ),
                      }),
                    ],
                  }),
              ],
            }),
          (0, t.jsxs)("div", {
            className: "grid grid-cols-2 gap-2",
            children: [
              (0, t.jsxs)("label", {
                children: [
                  "Rộng (px)",
                  (0, t.jsx)("input", {
                    className: "mt-1 w-full rounded border p-1.5",
                    type: "number",
                    min: 160,
                    max: 640,
                    defaultValue: a?.width ?? 440,
                    onChange: (e) => m("width", Number(e.target.value)),
                  }),
                ],
              }),
              (0, t.jsxs)("label", {
                children: [
                  "Cao (px)",
                  (0, t.jsx)("input", {
                    className: "mt-1 w-full rounded border p-1.5",
                    type: "number",
                    min: 120,
                    max: 520,
                    defaultValue: a?.height ?? 300,
                    onChange: (e) => m("height", Number(e.target.value)),
                  }),
                ],
              }),
            ],
          }),
          (0, t.jsxs)("label", {
            className: "block",
            children: [
              "Chú thích",
              (0, t.jsx)("input", {
                className: "mt-1 w-full rounded border p-1.5",
                defaultValue: a?.bottomCaption ?? "",
                onChange: (e) => m("bottomCaption", e.target.value),
              }),
            ],
          }),
          (0, t.jsxs)("label", {
            className: "block",
            children: [
              "Vị trí",
              (0, t.jsxs)("select", {
                className: "ml-2 rounded border p-1.5",
                defaultValue: a?.align ?? "center",
                onChange: (e) => m("align", e.target.value),
                children: [
                  (0, t.jsx)("option", { value: "center", children: "Giữa" }),
                  (0, t.jsx)("option", {
                    value: "left",
                    children: "Bên trái, chữ chạy quanh",
                  }),
                  (0, t.jsx)("option", {
                    value: "right",
                    children: "Bên phải, chữ chạy quanh",
                  }),
                ],
              }),
            ],
          }),
          (0, t.jsxs)("details", {
            children: [
              (0, t.jsx)("summary", {
                className: "cursor-pointer text-blue-700",
                children: "Sửa điểm và đường vẽ",
              }),
              (0, t.jsxs)("p", {
                className: "my-2 text-neutral-600",
                children: [
                  "Mỗi điểm có một id duy nhất. Đoạn thẳng: ",
                  '{"from":"A","to":"B","dashed":true}',
                  ". Chân vuông góc từ D xuống AB: ",
                  '{"id":"E","kind":"projection","parents":["D","A","B"]}',
                  ". Giao hai tiếp tuyến tại A và B của đường tròn tâm O: ",
                  '{"id":"D","kind":"tangentIntersection","parents":["O","A","B"]}',
                  ". tangent chỉ dựng tiếp điểm.",
                ],
              }),
              (0, t.jsx)("textarea", {
                "aria-label": "Dữ liệu hình học",
                value: o,
                onChange: (e) => s(e.target.value),
                className:
                  "h-64 w-full resize-y rounded border p-2 font-mono text-[11px]",
                spellCheck: !1,
              }),
              (0, t.jsx)("button", {
                type: "button",
                onClick: () => h(o),
                className: "mt-2 rounded bg-[#37352f] px-3 py-1.5 text-white",
                children: "Áp dụng hình",
              }),
            ],
          }),
          (0, t.jsx)("button", {
            type: "button",
            className: "text-blue-700 underline",
            onClick: () => {
              let e = JSON.stringify((0, i.defaultGeometryData)(), null, 2);
              (s(e), h(e));
            },
            children: "Dùng mẫu tam giác và đường phụ",
          }),
          l &&
            (0, t.jsx)("p", {
              role: "alert",
              className: "text-red-600",
              children: l,
            }),
        ],
      });
    }
    var A = m650957,
      M = m604131;
    ;
