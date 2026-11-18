// Reconstructed from 1twhdx9v_bid8.pretty.js, module 766887.
// deps: m681307
// exports: angleMarkRadius, circlePoints, defaultGeometryData, defaultLabelOffsets, farPoints, geometryFrame, parseGeometryData, resolveCircle, resolveGeometry
export { function (e, t, r, n) { let [i, a, o] = e.points.map((e) => t.get(e)), s = Math.min(p(i, a), p(o, a)) * r; return ( Math.min( Math.max((e.radius ?? n) * r, 8), 28, Math.max(4, 0.45 * s), ) / r ); } as "angleMarkRadius" };
export { g as "circlePoints" };
export { function () { return D({ width: 440, height: 300, points: [ { id: "A", x: 2, y: 4, labelOffset: [-6, 16] }, { id: "B", x: 0, y: 0, labelOffset: [-16, -10] }, { id: "C", x: 10, y: 0, labelOffset: [12, -6] }, { id: "D", kind: "bisectorFoot", parents: ["B", "A", "C"], labelOffset: [-4, -18], }, { id: "M", kind: "midpoint", parents: ["B", "C"], labelOffset: [0, -18], }, { id: "E", kind: "projection", parents: ["D", "A", "B"], labelOffset: [-18, 6], }, { id: "F", kind: "projection", parents: ["D", "A", "C"], labelOffset: [8, 14], }, ], segments: [ ["A", "B"], ["A", "C"], ["B", "C"], ["A", "D"], ["A", "M"], ["D", "E"], ["D", "F"], ].map(([e, t]) => ({ from: e, to: t })), angles: [ { points: ["B", "A", "C"], right: !0, radius: 0.3 }, { points: ["A", "E", "D"], right: !0, radius: 0.28 }, { points: ["D", "F", "A"], right: !0, radius: 0.28 }, { points: ["B", "A", "D"], radius: 0.65 }, { points: ["D", "A", "C"], radius: 0.65 }, ], }); } as "defaultGeometryData" };
export { T as "defaultLabelOffsets" };
export { S as "farPoints" };
export { function (e, t, r = e.width, n = e.height) { let i = t.data, { positions: a } = t, o = S(i, a), s = C(i), l = [...a] .filter(([e]) => s.has(e) && !o.includes(e)) .map(([, e]) => e); for (let { center: e, radius: r } of (l.length || l.push(...a.values()), l.length || l.push({ x: 0, y: 0 }), t.circles)) l.push({ x: e.x - r, y: e.y - r }, { x: e.x + r, y: e.y + r }); let u = E(l), c = Math.max(u.right - u.left, u.top - u.bottom, 1e-6), f = (e, t) => { let i = E(e), a = [i.left - t, i.top + t, i.right + t, i.bottom - t]; return { box: a, scale: Math.min(r / (a[2] - a[0]), n / (a[1] - a[3])), }; }, { box: d, scale: p } = f(l, 0.14 * c), h = T(i, a, p); for (let e = 0; e < 2; e++) { let e = [...l]; for (let t of i.points) { let r = h.get(t.id); if (!r || o.includes(t.id)) continue; let n = a.get(t.id), i = { w: Math.max(8, 8.5 * (t.label ?? t.id).length), h: 16 }, s = n.x + r[0] / p, l = n.y + r[1] / p, u = (i.w / 2 + 3) / p, c = (i.h / 2 + 3) / p; e.push({ x: s - u, y: l - c }, { x: s + u, y: l + c }); } ({ box: d, scale: p } = f(e, Math.max(0.06 * c, 6 / p))); } return { box: d, scale: p, labelOffsets: h, far: o }; } as "geometryFrame" };
export { D as "parseGeometryData" };
export { x as "resolveCircle" };
export { w as "resolveGeometry" };

"use strict";
    var t = m681307;
    let r = {
        midpoint: "[A,B]",
        ratio: "[A,B]",
        projection: "[P,A,B]",
        bisectorFoot: "[B,A,C]",
        intersection: "[A,B,C,D]",
        circumcenter: "[A,B,C]",
        orthocenter: "[A,B,C]",
        centroid: "[A,B,C]",
        incenter: "[A,B,C]",
        tangent: "[P,O,T]",
        tangentIntersection: "[O,A,B]",
        onCircle: "[O,T]",
        lineCircle: "[A,B,O,T]",
        parallel: "[P,A,B,C,D]",
        perpendicular: "[P,A,B,C,D]",
      },
      n = (e) =>
        "string" == typeof e &&
        /^\s*-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?\s*$/i.test(e)
          ? Number(e)
          : e,
      i = (e, t) => (r) => {
        let i = n(r);
        return "number" == typeof i && Number.isFinite(i)
          ? Math.min(t, Math.max(e, i))
          : i;
      },
      a = (e) => (t) =>
        "number" == typeof t
          ? String(t)
          : "string" == typeof t
            ? t.slice(0, e)
            : t,
      o = t.z.preprocess(n, t.z.number().finite().min(-1e4).max(1e4)),
      s = t.z
        .preprocess((e) => "true" === e || ("false" !== e && e), t.z.boolean())
        .optional(),
      l = t.z
        .string()
        .regex(
          /^[A-Za-z][A-Za-z0-9_]{0,31}$/,
          "Tên điểm phải bắt đầu bằng chữ, chỉ gồm chữ, số và dấu gạch dưới.",
        ),
      u = t.z.object({
        id: l,
        label: t.z.preprocess(a(80), t.z.string()).optional(),
        labelOffset: t.z
          .tuple([
            t.z.preprocess(i(-80, 80), t.z.number()),
            t.z.preprocess(i(-80, 80), t.z.number()),
          ])
          .optional(),
        hidden: s,
      }),
      c = t.z.union([
        u.extend({ kind: t.z.literal("point").optional(), x: o, y: o }),
        u.extend({ kind: t.z.literal("midpoint"), parents: t.z.tuple([l, l]) }),
        u.extend({
          kind: t.z.literal("ratio"),
          parents: t.z.tuple([l, l]),
          ratio: t.z.preprocess(i(-10, 10), t.z.number()),
        }),
        u.extend({
          kind: t.z.literal("projection"),
          parents: t.z.tuple([l, l, l]),
        }),
        u.extend({
          kind: t.z.literal("bisectorFoot"),
          parents: t.z.tuple([l, l, l]),
        }),
        u.extend({
          kind: t.z.literal("intersection"),
          parents: t.z.tuple([l, l, l, l]),
        }),
        u.extend({
          kind: t.z.literal("circumcenter"),
          parents: t.z.tuple([l, l, l]),
        }),
        u.extend({
          kind: t.z.literal("orthocenter"),
          parents: t.z.tuple([l, l, l]),
        }),
        u.extend({
          kind: t.z.literal("centroid"),
          parents: t.z.tuple([l, l, l]),
        }),
        u.extend({
          kind: t.z.literal("incenter"),
          parents: t.z.tuple([l, l, l]),
        }),
        u.extend({
          kind: t.z.literal("tangent"),
          parents: t.z.tuple([l, l, l]),
          side: t.z
            .preprocess(
              (e) => {
                let t = n(e);
                return "number" == typeof t ? (t < 0 ? -1 : 1) : t;
              },
              t.z.union([t.z.literal(1), t.z.literal(-1)]),
            )
            .default(1),
        }),
        u.extend({
          kind: t.z.literal("tangentIntersection"),
          parents: t.z.tuple([l, l, l]),
        }),
        u.extend({
          kind: t.z.literal("onCircle"),
          parents: t.z.tuple([l, l]),
          angle: t.z.preprocess(i(-3600, 3600), t.z.number()),
        }),
        u.extend({
          kind: t.z.literal("lineCircle"),
          parents: t.z.tuple([l, l, l, l]),
          which: t.z
            .preprocess(
              (e) => {
                let t = n(e);
                return "number" == typeof t ? +(t >= 1) : t;
              },
              t.z.union([t.z.literal(0), t.z.literal(1)]),
            )
            .default(0),
        }),
        u.extend({
          kind: t.z.literal("parallel"),
          parents: t.z.tuple([l, l, l, l, l]),
        }),
        u.extend({
          kind: t.z.literal("perpendicular"),
          parents: t.z.tuple([l, l, l, l, l]),
        }),
      ]),
      f = t.z.preprocess(
        (e) =>
          Array.isArray(e) && e.length >= 2
            ? {
                from: e[0],
                to: e[1],
                ...(!0 === e[2] || "dashed" === e[2] ? { dashed: !0 } : {}),
              }
            : e,
        t.z.object({ from: l, to: l, dashed: s }),
      ),
      d = t.z.object({
        align: t.z.enum(["left", "center", "right"]).default("center"),
        caption: t.z.preprocess(a(500), t.z.string()).default(""),
        bottomCaption: t.z.preprocess(a(500), t.z.string()).default(""),
        width: t.z.preprocess(i(160, 640), t.z.number().finite()).default(440),
        height: t.z.preprocess(i(120, 520), t.z.number().finite()).default(300),
        points: t.z.array(c).min(2).max(100),
        segments: t.z.array(f).max(200).default([]),
        circles: t.z
          .array(
            t.z.union([
              t.z.object({ center: l, through: l, dashed: s }),
              t.z.object({
                center: l,
                radius: t.z.preprocess(
                  n,
                  t.z.number().finite().positive().max(1e4),
                ),
                dashed: s,
              }),
              t.z.object({ circumscribed: t.z.tuple([l, l, l]), dashed: s }),
              t.z.object({ inscribed: t.z.tuple([l, l, l]), dashed: s }),
            ]),
          )
          .max(30)
          .default([]),
        angles: t.z
          .array(
            t.z.object({
              points: t.z.tuple([l, l, l]),
              right: s,
              radius: t.z
                .preprocess((e) => {
                  let t = n(e);
                  return "number" == typeof t && Number.isFinite(t) && t > 0
                    ? Math.min(100, t)
                    : void 0;
                }, t.z.number().optional())
                .optional(),
              label: t.z.preprocess(a(80), t.z.string()).optional(),
            }),
          )
          .max(60)
          .default([]),
      }),
      p = (e, t) => Math.hypot(e.x - t.x, e.y - t.y);
    function h(e, t, r) {
      let n = 2 * (e.x * (t.y - r.y) + t.x * (r.y - e.y) + r.x * (e.y - t.y)),
        i = Math.max(p(e, t), p(t, r), p(e, r));
      if (Math.abs(n) < 1e-10 * Math.max(1, i * i)) return null;
      let a = e.x * e.x + e.y * e.y,
        o = t.x * t.x + t.y * t.y,
        s = r.x * r.x + r.y * r.y;
      return {
        x: (a * (t.y - r.y) + o * (r.y - e.y) + s * (e.y - t.y)) / n,
        y: (a * (r.x - t.x) + o * (e.x - r.x) + s * (t.x - e.x)) / n,
      };
    }
    function m(e, t, r) {
      let n = p(t, r),
        i = p(e, r),
        a = p(e, t);
      if (
        Math.abs((t.x - e.x) * (r.y - e.y) - (t.y - e.y) * (r.x - e.x)) <
        1e-10 * Math.max(1e-12, i * a)
      )
        return null;
      let o = n + i + a;
      return {
        x: (n * e.x + i * t.x + a * r.x) / o,
        y: (n * e.y + i * t.y + a * r.y) / o,
      };
    }
    function g(e) {
      return "circumscribed" in e
        ? [...e.circumscribed]
        : "inscribed" in e
          ? [...e.inscribed]
          : "through" in e
            ? [e.center, e.through]
            : [e.center];
    }
    function x(e, t) {
      let r = g(e).find((e) => !t.has(e));
      if (r) throw Error(`Đường tr\xf2n d\xf9ng điểm ${r} chưa dựng được.`);
      if ("inscribed" in e) {
        let [r, n, i] = e.inscribed.map((e) => t.get(e)),
          a = m(r, n, i);
        if (!a)
          throw Error(
            `Ba điểm ${e.inscribed.join("")} thẳng h\xe0ng n\xean kh\xf4ng c\xf3 đường tr\xf2n nội tiếp.`,
          );
        let o = p(r, n);
        return {
          center: a,
          radius:
            Math.abs((n.x - r.x) * (a.y - r.y) - (n.y - r.y) * (a.x - r.x)) / o,
        };
      }
      if ("circumscribed" in e) {
        let [r, n, i] = e.circumscribed.map((e) => t.get(e)),
          a = h(r, n, i);
        if (!a)
          throw Error(
            `Ba điểm ${e.circumscribed.join("")} thẳng h\xe0ng n\xean kh\xf4ng c\xf3 đường tr\xf2n đi qua.`,
          );
        return { center: a, radius: p(a, r) };
      }
      let n = t.get(e.center);
      return {
        center: n,
        radius: "radius" in e ? e.radius : p(n, t.get(e.through)),
      };
    }
    function y(e, t, r, n, i) {
      let a = t.x * n.y - t.y * n.x;
      if (
        Math.abs(a) <
        1e-10 * Math.max(1e-12, Math.hypot(t.x, t.y) * Math.hypot(n.x, n.y))
      )
        throw Error(i);
      let o = ((r.x - e.x) * n.y - (r.y - e.y) * n.x) / a;
      return { x: e.x + o * t.x, y: e.y + o * t.y };
    }
    class b extends Error {}
    class v extends Error {
      point;
      constructor(e) {
        (super(`Kh\xf4ng t\xecm thấy điểm ${e}.`), (this.point = e));
      }
    }
    function w(e, t = {}) {
      
      let i,
        a,
        o = (function (e) {
          let t = [],
            r = new Map();
          for (let t of e.points) {
            if (!("parents" in t) || !(t.kind in N)) continue;
            let n = t.kind,
              i = new Set();
            for (let r of e.circles)
              ("circumscribed" in r &&
                A(t.parents, r.circumscribed) &&
                i.add("circumcenter"),
                "inscribed" in r &&
                  A(t.parents, r.inscribed) &&
                  i.add("incenter"));
            let a = e.circles.some((e) => "center" in e && e.center === t.id);
            (/^O(\d|_|$)/.test(t.id) &&
              !a &&
              i.size &&
              !i.has(n) &&
              r.set(t.id, i.has("circumcenter") ? "circumcenter" : "incenter"),
              "circumcenter" !== n &&
                e.circles.some(
                  (e) =>
                    "through" in e &&
                    e.center === t.id &&
                    t.parents.includes(e.through),
                ) &&
                r.set(t.id, "circumcenter"));
          }
          if (!r.size) return { data: e, changes: t };
          let n = e.points.map((e) => {
            let n = r.get(e.id);
            return n && "parents" in e
              ? (t.push(
                  `Điểm ${e.id} được dựng l\xe0 ${N[e.kind]} tam gi\xe1c ${e.parents.join("")} nhưng lại l\xe0 t\xe2m của đường tr\xf2n trong h\xecnh; đ\xe3 dựng lại ${e.id} l\xe0 ${N[n]}.`,
                ),
                { ...e, kind: n })
              : e;
          });
          return { data: { ...e, points: n }, changes: t };
        })(e),
        s = (function (e) {
          let t = new Map();
          for (let r of e.points) t.set(r.id, [...(t.get(r.id) ?? []), r]);
          let r = (e, r) => {
              let n = t.get(r)?.length === 1 ? t.get(r)[0] : void 0;
              return n?.kind === "tangent" &&
                n.hidden &&
                n.parents[0] === e &&
                n.parents[2] === e
                ? { endpoint: e, center: n.parents[1] }
                : void 0;
            },
            n = new Map(),
            i = new Set(),
            a = new Map(),
            o = [];
          for (let s of e.points) {
            if ("intersection" !== s.kind || s.hidden) continue;
            let [l, u, c, f] = s.parents,
              d = r(l, u) ?? r(u, l),
              p = r(c, f) ?? r(f, c);
            if (!d || !p || d.center !== p.center || d.endpoint === p.endpoint)
              continue;
            let h = d.center,
              m = e.circles.filter((e) => "center" in e && e.center === h);
            if (1 !== m.length) continue;
            let g = m[0];
            if (
              !("through" in g) ||
              ![d.endpoint, p.endpoint].includes(g.through)
            )
              continue;
            let x = t.get(s.id);
            if (x.length > 1) {
              let e = x.find((e) => {
                if (e === s || !e.hidden || "intersection" !== e.kind)
                  return !1;
                let t = [e.parents.slice(0, 2), e.parents.slice(2, 4)];
                return (
                  t.every((e) => e.includes(h)) &&
                  t.some((e) => e.includes(d.endpoint)) &&
                  t.some((e) => e.includes(p.endpoint))
                );
              });
              if (2 !== x.length || !e) continue;
              (i.add(e),
                o.push(
                  `Bỏ định nghĩa ẩn tr\xf9ng t\xean ${s.id} đang lấy giao hai b\xe1n k\xednh tại ${h}; giữ ph\xe9p dựng giao hai tiếp tuyến.`,
                ));
            }
            for (let e of (n.set(s, {
              ...s,
              kind: "tangentIntersection",
              parents: [h, d.endpoint, p.endpoint],
            }),
            [d.endpoint, p.endpoint]))
              a.set(e, { center: h, through: g.through });
            o.push(
              `Dựng ${s.id} bằng giao hai tiếp tuyến tại ${d.endpoint}, ${p.endpoint}; tangent trả về tiếp điểm, kh\xf4ng phải đường thẳng.`,
            );
          }
          if (!n.size) return { data: e, changes: o };
          let s = {
              ...e,
              points: e.points
                .filter((e) => !i.has(e))
                .map((e) => n.get(e) ?? e),
            },
            l = M(s, { checkAngles: !1 }).positions;
          return {
            data: (s = {
              ...s,
              points: s.points.map((e) => {
                let r = a.get(e.id);
                if (
                  !r ||
                  !("x" in e) ||
                  t.get(e.id)?.length !== 1 ||
                  e.id === r.through
                )
                  return e;
                let n = l.get(r.center),
                  i = l.get(r.through);
                if (!n || !i) return e;
                let s = p(n, i),
                  u = p(n, e);
                return 1e-8 > Math.min(s, u) ||
                  Math.abs(u - s) <= 1e-7 * s ||
                  Math.abs(u - s) > 0.005 * s
                  ? e
                  : (o.push(
                      `Đưa ${e.id} l\xean đ\xfang đường tr\xf2n t\xe2m ${r.center} qua ${r.through} (sai số b\xe1n k\xednh do toạ độ l\xe0m tr\xf2n dưới 0,5%).`,
                    ),
                    {
                      ...e,
                      x: n.x + ((e.x - n.x) * s) / u,
                      y: n.y + ((e.y - n.y) * s) / u,
                    });
              }),
            }),
            changes: o,
          };
        })(o.data),
        l = M(s.data, t),
        { settled: u, changes: c } =
          ((r = s.data),
          (n = l.positions),
          (i = []),
          (a = r.circles.map((e) => {
            if (!("radius" in e)) return e;
            let t = r.points.find((t) => t.id === e.center);
            if (
              !t ||
              !("parents" in t) ||
              "circumcenter" !== t.kind ||
              !n.has(t.parents[0])
            )
              return e;
            let a = p(n.get(e.center), n.get(t.parents[0]));
            return Math.abs(e.radius - a) < 1e-9 * a ||
              Math.abs(e.radius - a) > 0.15 * a
              ? e
              : (i.push(
                  `B\xe1n k\xednh đường tr\xf2n t\xe2m ${e.center} được đặt đ\xfang bằng ${e.center}${t.parents[0]} để đường tr\xf2n đi qua ${t.parents.join(", ")} (b\xe1n k\xednh nhập ${e.radius}).`,
                ),
                {
                  center: e.center,
                  through: t.parents[0],
                  ...(e.dashed ? { dashed: !0 } : {}),
                });
          })).every((e, t) => e === r.circles[t])
            ? { settled: r, changes: i }
            : { settled: { ...r, circles: a }, changes: i }),
        f = c.length ? M(u, t) : l;
      return (
        f.problems.push(
          ...[...o.changes, ...s.changes, ...c].map((e) => ({
            level: "adjusted",
            message: e,
          })),
        ),
        f
      );
    }
    let N = {
        circumcenter: "tâm đường tròn ngoại tiếp",
        incenter: "tâm đường tròn nội tiếp",
        centroid: "trọng tâm",
        orthocenter: "trực tâm",
      },
      A = (e, t) =>
        3 === e.length &&
        3 === t.length &&
        [...e].sort().join() === [...t].sort().join();
    function M(e, { checkAngles: t = !0 } = {}) {
      let r = [],
        n = (e) => r.push({ level: "error", message: e }),
        i = new Map(),
        a = new Set();
      for (let t of e.points) i.has(t.id) ? a.add(t.id) : i.set(t.id, t);
      for (let e of a)
        n(
          `T\xean điểm ${e} bị tr\xf9ng; kh\xf4ng dựng điểm n\xe0y v\xe0 c\xe1c phần phụ thuộc cho đến khi chỉ c\xf2n một định nghĩa.`,
        );
      let o = new Map(),
        s = new Set(a),
        l = new Set(),
        u = [],
        c = (e) => {
          let t = o.get(e);
          if (t) return t;
          if (s.has(e)) throw new b(e);
          let r = i.get(e);
          if (!r) throw new v(e);
          if (l.has(e)) throw Error(`C\xe1c điểm phụ thuộc v\xf2ng tại ${e}.`);
          l.add(e);
          try {
            let t =
              "x" in r
                ? { x: r.x, y: r.y }
                : (function (e, t, r) {
                    let [n, i, a, o] = r,
                      s = (n, i) => {
                        if (
                          p(r[n], r[i]) <
                          1e-12 * Math.max(1, Math.hypot(r[n].x, r[n].y))
                        )
                          throw Error(
                            `Hai điểm ${t.parents[n]}, ${t.parents[i]} tr\xf9ng nhau n\xean kh\xf4ng x\xe1c định đường thẳng để dựng ${e}.`,
                          );
                        return { x: r[i].x - r[n].x, y: r[i].y - r[n].y };
                      };
                    switch (t.kind) {
                      case "midpoint":
                      case "ratio": {
                        let e = "midpoint" === t.kind ? 0.5 : t.ratio;
                        return {
                          x: n.x + e * (i.x - n.x),
                          y: n.y + e * (i.y - n.y),
                        };
                      }
                      case "bisectorFoot": {
                        let r = p(n, i),
                          o = p(i, a),
                          s =
                            (n.x - i.x) * (a.y - i.y) -
                            (n.y - i.y) * (a.x - i.x);
                        if (
                          1e-8 > Math.min(r, o, p(n, a)) ||
                          Math.abs(s) < 1e-10 * r * o
                        )
                          throw Error(
                            `Ba điểm ${t.parents.join("")} thẳng h\xe0ng hoặc tr\xf9ng nhau n\xean kh\xf4ng dựng được ph\xe2n gi\xe1c tại ${e}.`,
                          );
                        let l = r / (r + o);
                        return {
                          x: n.x + l * (a.x - n.x),
                          y: n.y + l * (a.y - n.y),
                        };
                      }
                      case "projection": {
                        let e = s(1, 2),
                          t =
                            ((n.x - i.x) * e.x + (n.y - i.y) * e.y) /
                            (e.x * e.x + e.y * e.y);
                        return { x: i.x + t * e.x, y: i.y + t * e.y };
                      }
                      case "tangent": {
                        let r = p(i, a),
                          o = p(n, i);
                        if (r < 1e-8)
                          throw Error(
                            `Đường tr\xf2n dựng tiếp điểm ${e} c\xf3 b\xe1n k\xednh bằng 0.`,
                          );
                        if (Math.abs(o - r) <= 1e-9 * r) return { ...n };
                        if (o < r)
                          throw Error(
                            `Điểm ${t.parents[0]} phải nằm ngo\xe0i đường tr\xf2n để kẻ tiếp tuyến tới ${e}.`,
                          );
                        let s = Math.acos(r / o) * t.side,
                          l = (n.x - i.x) / o,
                          u = (n.y - i.y) / o;
                        return {
                          x: i.x + r * (l * Math.cos(s) - u * Math.sin(s)),
                          y: i.y + r * (l * Math.sin(s) + u * Math.cos(s)),
                        };
                      }
                      case "tangentIntersection": {
                        let r = p(n, i),
                          o = p(n, a);
                        if (1e-8 > Math.min(r, o))
                          throw Error(
                            `Kh\xf4ng dựng được ${e}: tiếp điểm tr\xf9ng t\xe2m ${t.parents[0]}.`,
                          );
                        if (Math.abs(r - o) > 1e-7 * Math.max(r, o))
                          throw Error(
                            `Kh\xf4ng dựng được ${e}: ${t.parents[1]}, ${t.parents[2]} kh\xf4ng c\xf9ng đường tr\xf2n t\xe2m ${t.parents[0]}. D\xf9ng circumcenter hoặc onCircle thay v\xec ước lượng toạ độ.`,
                          );
                        return y(
                          i,
                          { x: -(i.y - n.y), y: i.x - n.x },
                          a,
                          { x: -(a.y - n.y), y: a.x - n.x },
                          `Hai tiếp tuyến tại ${t.parents[1]}, ${t.parents[2]} dựng ${e} song song hoặc tr\xf9ng nhau.`,
                        );
                      }
                      case "onCircle": {
                        let r = p(n, i);
                        if (r < 1e-8)
                          throw Error(
                            `Đường tr\xf2n tại ${e} c\xf3 b\xe1n k\xednh bằng 0.`,
                          );
                        let a =
                          Math.atan2(i.y - n.y, i.x - n.x) +
                          (t.angle * Math.PI) / 180;
                        return {
                          x: n.x + r * Math.cos(a),
                          y: n.y + r * Math.sin(a),
                        };
                      }
                      case "lineCircle": {
                        let r = s(0, 1),
                          l = p(a, o),
                          u = r.x * r.x + r.y * r.y;
                        if (l < 1e-8)
                          throw Error(
                            `Kh\xf4ng dựng được giao điểm ${e}: đường tr\xf2n c\xf3 b\xe1n k\xednh bằng 0.`,
                          );
                        let c = ((a.x - n.x) * r.x + (a.y - n.y) * r.y) / u,
                          f = n.x + c * r.x - a.x,
                          d = n.y + c * r.y - a.y,
                          h = l * l - (f * f + d * d);
                        if (h < -1e-9 * l * l)
                          throw Error(
                            `Đường thẳng ${t.parents[0]}${t.parents[1]} kh\xf4ng cắt đường tr\xf2n n\xean kh\xf4ng dựng được ${e}.`,
                          );
                        let m = Math.sqrt(Math.max(0, h) / u),
                          g = (e) =>
                            Math.abs(p(e, a) - l) < 1e-6 * Math.max(1, l),
                          x = [c - m, c + m].sort(
                            (e, t) => Math.abs(e) - Math.abs(t),
                          ),
                          y = g(i)
                            ? ((i.x - n.x) * r.x + (i.y - n.y) * r.y) / u
                            : g(n)
                              ? 0
                              : null;
                        if (null !== y && m < 1e-6)
                          throw Error(
                            `Đường thẳng ${t.parents[0]}${t.parents[1]} tiếp x\xfac đường tr\xf2n n\xean ${e} tr\xf9ng điểm đ\xe3 c\xf3.`,
                          );
                        let b =
                          null !== y
                            ? Math.abs(x[0] - y) < Math.abs(x[1] - y)
                              ? x[1]
                              : x[0]
                            : x[t.which];
                        return { x: n.x + b * r.x, y: n.y + b * r.y };
                      }
                      case "parallel":
                      case "perpendicular": {
                        let r = "parallel" === t.kind,
                          i = s(1, 2);
                        return y(
                          n,
                          r ? i : { x: -i.y, y: i.x },
                          o,
                          s(3, 4),
                          `Đường ${r ? "song song" : "vuông góc"} dựng ${e} song song hoặc tr\xf9ng với đường ${t.parents[3]}${t.parents[4]} cần cắt.`,
                        );
                      }
                      case "centroid":
                        return {
                          x: (n.x + i.x + a.x) / 3,
                          y: (n.y + i.y + a.y) / 3,
                        };
                      case "incenter": {
                        let r = m(n, i, a);
                        if (!r)
                          throw Error(
                            `Ba điểm ${t.parents.join("")} thẳng h\xe0ng n\xean kh\xf4ng dựng được t\xe2m nội tiếp ${e}.`,
                          );
                        return r;
                      }
                      case "circumcenter":
                      case "orthocenter": {
                        let r = h(n, i, a);
                        if (!r)
                          throw Error(
                            `Ba điểm ${t.parents.join("")} thẳng h\xe0ng n\xean kh\xf4ng dựng được ${e}.`,
                          );
                        return "circumcenter" === t.kind
                          ? r
                          : {
                              x: n.x + i.x + a.x - 2 * r.x,
                              y: n.y + i.y + a.y - 2 * r.y,
                            };
                      }
                      case "intersection":
                        return y(
                          n,
                          s(0, 1),
                          a,
                          s(2, 3),
                          `Hai đường ${t.parents[0]}${t.parents[1]} v\xe0 ${t.parents[2]}${t.parents[3]} dựng ${e} song song hoặc tr\xf9ng nhau.`,
                        );
                    }
                  })(e, r, r.parents.map(c));
            if (
              !Number.isFinite(t.x) ||
              !Number.isFinite(t.y) ||
              Math.max(Math.abs(t.x), Math.abs(t.y)) > 1e4
            )
              throw Error(`Toạ độ điểm ${e} vượt giới hạn.`);
            return (o.set(e, t), t);
          } catch (t) {
            throw (
              s.add(e),
              t instanceof b
                ? u.push(e)
                : t instanceof v
                  ? n(
                      `Điểm ${e} d\xf9ng điểm ${t.point} chưa khai b\xe1o (Kh\xf4ng t\xecm thấy điểm ${t.point}).`,
                    )
                  : n(
                      t instanceof Error
                        ? t.message
                        : `Kh\xf4ng dựng được điểm ${e}.`,
                    ),
              new b(e)
            );
          } finally {
            l.delete(e);
          }
        };
      for (let e of i.keys())
        try {
          c(e);
        } catch {}
      u.length &&
        n(
          `Kh\xf4ng vẽ c\xe1c điểm phụ thuộc v\xe0o điểm hỏng: ${u.join(", ")}.`,
        );
      let f = (e, t) => {
          let r = e.find((e) => !i.has(e));
          return r
            ? (n(`Kh\xf4ng t\xecm thấy điểm ${r} của ${t}.`), !1)
            : e.every((e) => o.has(e));
        },
        d = e.segments.filter((e) => {
          let t = `đoạn thẳng ${e.from}${e.to}`;
          return (
            !!f([e.from, e.to], t) &&
            (!(1e-8 > p(o.get(e.from), o.get(e.to))) ||
              (n(
                `Đoạn thẳng ${e.from}${e.to} c\xf3 hai đầu tr\xf9ng nhau n\xean kh\xf4ng vẽ.`,
              ),
              !1))
          );
        }),
        w = [];
      for (let t of e.circles)
        if (f(g(t), "đường tròn"))
          try {
            let { center: e, radius: r } = x(t, o);
            r < 1e-8
              ? n("Đường tròn có bán kính bằng 0 nên không vẽ.")
              : w.push({ circle: t, center: e, radius: r });
          } catch (e) {
            n(e instanceof Error ? e.message : "Không dựng được đường tròn.");
          }
      let N = e.angles.filter((e) => {
        let i = e.points.join("");
        if (!f(e.points, `g\xf3c ${i}`)) return !1;
        let [a, s, l] = e.points.map((e) => o.get(e)),
          u = p(a, s),
          c = p(l, s);
        if (1e-8 > Math.min(u, c))
          return (
            n(`G\xf3c ${i} c\xf3 cạnh d\xe0i bằng 0 n\xean kh\xf4ng vẽ.`),
            !1
          );
        let d =
          ((a.x - s.x) * (l.x - s.x) + (a.y - s.y) * (l.y - s.y)) / (u * c);
        return (
          t &&
            e.right &&
            Math.abs(d) > 0.02 &&
            r.push({
              level: "warning",
              message: `G\xf3c ${i} được đ\xe1nh dấu vu\xf4ng nhưng chưa vu\xf4ng (đo được ≈ ${((180 * Math.acos(Math.max(-1, Math.min(1, d)))) / Math.PI).toFixed(1).replace(".", ",")}\xb0).`,
            }),
          !0
        );
      });
      return {
        data: e,
        positions: o,
        segments: d,
        circles: w,
        angles: N,
        problems: r,
      };
    }
    function D(e) {
      let t =
        "string" == typeof e
          ? (function (e) {
              try {
                return JSON.parse(e);
              } catch (r) {
                let t = e
                  .replace(/\/\*[\s\S]*?\*\//g, "")
                  .replace(/(^|\s)\/\/[^\n]*/g, "$1")
                  .replace(/,(\s*[}\]])/g, "$1");
                try {
                  return JSON.parse(t);
                } catch {
                  throw Error(
                    `JSON h\xecnh học sai c\xfa ph\xe1p: ${r instanceof Error ? r.message : String(r)}`,
                  );
                }
              }
            })(e)
          : e;
      try {
        let e = t?.points;
        if (Array.isArray(e))
          for (let t of e) {
            if (!t || "object" != typeof t) continue;
            let e = "string" == typeof t.id ? t.id : "?";
            if (void 0 !== t.kind && "point" !== t.kind) {
              let n = r[t.kind];
              if (!n)
                throw Error(
                  `Điểm ${e}: kiểu "${String(t.kind)}" kh\xf4ng được hỗ trợ; d\xf9ng một trong ${Object.keys(r).join(", ")}.`,
                );
              let i = n.split(",").length;
              if (!Array.isArray(t.parents) || t.parents.length !== i)
                throw Error(
                  `Điểm ${e} (${String(t.kind)}) cần đ\xfang ${i} điểm cha ${n}.`,
                );
            } else if (void 0 === t.x || void 0 === t.y)
              throw Error(
                `Điểm ${e} thiếu toạ độ x, y (điểm dựng th\xec cần kind v\xe0 parents).`,
              );
          }
      } catch (e) {
        throw Error(`Dữ liệu h\xecnh học kh\xf4ng hợp lệ: ${e.message}`);
      }
      let n = d.safeParse(t);
      if (!n.success) {
        let e = n.error.issues[0];
        throw Error(
          `Dữ liệu h\xecnh học kh\xf4ng hợp lệ (${e.path.join(".") || "hình"}): ${e.message}`,
        );
      }
      let { positions: i, problems: a } = w(n.data);
      if (0 === i.size)
        throw Error(a[0]?.message ?? "Không dựng được điểm nào của hình.");
      return n.data;
    }
    function C(e) {
      let t = new Set(e.points.filter((e) => !e.hidden).map((e) => e.id));
      for (let r of e.segments) t.add(r.from).add(r.to);
      for (let r of e.angles) r.points.forEach((e) => t.add(e));
      return t;
    }
    let E = (e) => ({
      left: Math.min(...e.map((e) => e.x)),
      right: Math.max(...e.map((e) => e.x)),
      bottom: Math.min(...e.map((e) => e.y)),
      top: Math.max(...e.map((e) => e.y)),
    });
    function S(e, t) {
      let r = C(e),
        n = e.points.filter((e) => "x" in e && t.has(e.id)),
        i =
          n.filter((e) => r.has(e.id)).length >= 2
            ? n.filter((e) => r.has(e.id))
            : n;
      if (i.length < 2) return [];
      let a = E(i.map((e) => t.get(e.id))),
        o = Math.max(a.right - a.left, a.top - a.bottom, 1e-9);
      return e.points
        .filter((e) => !("x" in e) && r.has(e.id) && t.has(e.id))
        .filter((e) => {
          let r = t.get(e.id);
          return (
            Math.max(a.left - r.x, r.x - a.right, a.bottom - r.y, r.y - a.top) >
            2.5 * o
          );
        })
        .map((e) => e.id);
    }
    function T(e, t, r) {
      let n = e.points.filter(
          (e) => !e.hidden && "" !== e.label && t.has(e.id),
        ),
        i = (e) => ({ x: t.get(e).x * r, y: t.get(e).y * r }),
        a = e.points.filter((e) => !e.hidden && t.has(e.id)),
        o = a.map((e) => i(e.id)),
        s = {
          x: o.reduce((e, t) => e + t.x, 0) / Math.max(1, o.length),
          y: o.reduce((e, t) => e + t.y, 0) / Math.max(1, o.length),
        },
        l = (r) => {
          let n = i(r),
            a = n.x - s.x,
            o = n.y - s.y,
            l = Math.hypot(a, o);
          l < 1e-6
            ? ((a = Math.SQRT1_2), (o = Math.SQRT1_2))
            : ((a /= l), (o /= l));
          let u = (function (e, t, r) {
            let n = r.get(e),
              i = [];
            for (let a of t.segments) {
              let t = r.get(a.from),
                o = r.get(a.to);
              if (!t || !o) continue;
              let s = p(t, o);
              if (s < 1e-9) continue;
              if (a.from === e || a.to === e) {
                let r = a.from === e ? o : t;
                i.push(Math.atan2(r.y - n.y, r.x - n.x));
                continue;
              }
              let l =
                  ((n.x - t.x) * (o.x - t.x) + (n.y - t.y) * (o.y - t.y)) /
                  (s * s),
                u =
                  Math.abs(
                    (o.x - t.x) * (n.y - t.y) - (o.y - t.y) * (n.x - t.x),
                  ) / s;
              if (l > 1e-6 && l < 1 - 1e-6 && u < 1e-6 * Math.max(1, s)) {
                let e = Math.atan2(o.y - t.y, o.x - t.x);
                i.push(e, e + Math.PI);
              }
            }
            for (let e of t.circles) {
              
              try {
                t = x(e, r);
              } catch {
                continue;
              }
              if (
                Math.abs(p(n, t.center) - t.radius) <
                1e-6 * Math.max(1, t.radius)
              ) {
                let e = Math.atan2(n.y - t.center.y, n.x - t.center.x);
                i.push(e + Math.PI / 2, e - Math.PI / 2);
              }
            }
            return i;
          })(r, e, t)
            .map((e) => ((e % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI))
            .sort((e, t) => e - t);
          if (!u.length) return [13 * a, 13 * o];
          let c = u.map((e, t) => {
              let r = t + 1 < u.length ? u[t + 1] : u[0] + 2 * Math.PI;
              return { size: r - e, middle: e + (r - e) / 2 };
            }),
            f = Math.max(...c.map((e) => e.size)),
            d = c
              .filter((e) => e.size >= f - 0.2)
              .reduce((e, t) =>
                Math.cos(t.middle) * a + Math.sin(t.middle) * o >
                Math.cos(e.middle) * a + Math.sin(e.middle) * o
                  ? t
                  : e,
              ),
            h = Math.min(
              26,
              Math.max(13, 8 / Math.sin(Math.min(d.size, Math.PI) / 2)),
            );
          return [Math.cos(d.middle) * h, Math.sin(d.middle) * h];
        },
        u = new Map(),
        c = new Set();
      for (let e of n)
        e.labelOffset
          ? u.set(e.id, [e.labelOffset[0], e.labelOffset[1]])
          : (u.set(e.id, l(e.id)), c.add(e.id));
      let f = (e) => {
        let t = i(e),
          [r, n] = u.get(e);
        return { x: t.x + r, y: t.y + n };
      };
      for (let e of n) {
        if (c.has(e.id)) continue;
        let t = f(e.id);
        n.some(
          (r) =>
            r.id !== e.id && 13 > Math.hypot(f(r.id).x - t.x, f(r.id).y - t.y),
        ) && (u.set(e.id, l(e.id)), c.add(e.id));
      }
      let d = (e, t, r, n) => {
        let [i, a] = u.get(e);
        u.set(e, [i + t * n, a + r * n]);
      };
      for (let e = 0; e < 30 && c.size; e++) {
        let e = !1;
        for (let t = 0; t < n.length; t++)
          for (let r = t + 1; r < n.length; r++) {
            let i = n[t].id,
              a = n[r].id;
            if (!c.has(i) && !c.has(a)) continue;
            let o = f(i),
              s = f(a),
              l = o.x - s.x,
              u = o.y - s.y,
              p = Math.hypot(l, u);
            if (p >= 17) continue;
            p < 1e-6 ? ((l = 1), (u = 0)) : ((l /= p), (u /= p));
            let h = (17 - p) / (c.has(i) && c.has(a) ? 2 : 1);
            (c.has(i) && d(i, l, u, h), c.has(a) && d(a, -l, -u, h), (e = !0));
          }
        for (let t of c)
          for (let r of a) {
            if (r.id === t) continue;
            let n = f(t),
              a = i(r.id),
              o = n.x - a.x,
              s = n.y - a.y,
              l = Math.hypot(o, s);
            l >= 11 ||
              (l < 1e-6 ? ((o = 0), (s = 1)) : ((o /= l), (s /= l)),
              d(t, o, s, 11 - l),
              (e = !0));
          }
        if (!e) break;
      }
      for (let e of c) {
        let [t, r] = u.get(e),
          n = Math.hypot(t, r);
        n > 40 && u.set(e, [(40 * t) / n, (40 * r) / n]);
      }
      return u;
    }
    ;
