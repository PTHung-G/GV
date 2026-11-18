// Reconstructed from 1twhdx9v_bid8.pretty.js, module 979693.
// deps: m681307
// exports: hiddenSolidEdges, parseDiagramData, projectSolidVertex
export { function (e) { let t, r, n = new Set(); if (!e.autoHidden || 0 === e.faces.length) return n; let i = new Map(e.vertices.map((e) => [e.id, e.at])), a = ((t = e.projection[0]), (r = e.projection[1]), [ t[1] * r[2] - t[2] * r[1], t[2] * r[0] - t[0] * r[2], t[0] * r[1] - t[1] * r[0], ]), o = a[2] > 1e-9 || (1e-9 >= Math.abs(a[2]) && a[1] < 0) ? a.map((e) => -e) : a, s = [0, 1, 2].map( (t) => e.vertices.reduce((e, r) => e + r.at[t], 0) / e.vertices.length, ), l = e.faces.map((e) => { let t, r = e.vertices.map((e) => i.get(e)), n = [0, 0, 0]; return (r.forEach((e, t) => { let i = r[(t + 1) % r.length]; ((n[0] += (e[1] - i[1]) * (e[2] + i[2])), (n[1] += (e[2] - i[2]) * (e[0] + i[0])), (n[2] += (e[0] - i[0]) * (e[1] + i[1]))); }), 1e-12 > p(n, n)) ? null : (0 > p(n, ((t = r[0]), [t[0] - s[0], t[1] - s[1], t[2] - s[2]])) && n.forEach((e, t) => (n[t] = -n[t])), p(n, o) > 1e-9); }); return ( e.edges.forEach((t, r) => { let i = e.faces.flatMap((e, r) => e.vertices.includes(t.from) && e.vertices.includes(t.to) ? [l[r]] : [], ); i.length > 0 && !i.some((e) => !1 !== e) && n.add(r); }), n ); } as "hiddenSolidEdges" };
export { function (e) { let t = e; if ("string" == typeof e) { if (e.length > 25e4) throw Error("Dữ liệu hình vượt giới hạn 250 KB."); try { t = JSON.parse(e); } catch { throw Error("Dữ liệu hình phải là JSON hợp lệ."); } } let r = d.safeParse(t); if (!r.success) throw Error( `Dữ liệu h\xecnh kh\xf4ng hợp lệ: ${r.error.issues .slice(0, 3) .map((e) => `${e.path.join(".")}: ${e.message}`) .join("; ")}`, ); return r.data; } as "parseDiagramData" };
export { function (e, t) { let r = (e) => e.reduce((e, r, n) => e + r * t[n], 0); return [ e.origin[0] + e.scale * r(e.projection[0]), e.origin[1] + e.scale * r(e.projection[1]), ]; } as "projectSolidVertex" };

"use strict";
    var t = m681307;
    let r = t.z.number().finite().min(-1e4).max(1e4),
      n = t.z.tuple([r, r]),
      i = t.z.tuple([r, r, r]),
      a = t.z.number().finite().positive().max(1e4),
      o = t.z
        .string()
        .regex(
          /^(?:#[\da-f]{3}(?:[\da-f]{3})?|none|black|white|gray|red|blue|green|yellow)$/i,
        ),
      s = t.z.string().regex(/^[A-Za-z][A-Za-z0-9_]{0,31}$/),
      l = {
        stroke: o.default("#000000"),
        strokeWidth: t.z.number().finite().min(0).max(12).default(1.5),
        fill: o.default("none"),
        dashed: t.z.boolean().default(!1),
        hatch: t.z.boolean().default(!1),
      },
      u = {
        arrowStart: t.z.boolean().default(!1),
        arrowEnd: t.z.boolean().default(!1),
      },
      c = t.z
        .object({
          kind: t.z.literal("solid"),
          ...l,
          origin: n,
          scale: a.default(1),
          projection: t.z.tuple([i, i]).default([
            [1, 0, 0.5],
            [0, -1, -0.35],
          ]),
          vertices: t.z
            .array(
              t.z
                .object({
                  id: s,
                  at: i,
                  label: t.z.string().max(80).optional(),
                  labelOffset: n.optional(),
                })
                .strict(),
            )
            .min(3)
            .max(100),
          edges: t.z
            .array(
              t.z
                .object({ from: s, to: s, dashed: t.z.boolean().default(!1) })
                .strict(),
            )
            .min(1)
            .max(200),
          autoHidden: t.z.boolean().default(!1),
          faces: t.z
            .array(
              t.z
                .object({
                  vertices: t.z.array(s).min(3).max(100),
                  fill: o.default("none"),
                  hatch: t.z.boolean().default(!1),
                })
                .strict(),
            )
            .max(100)
            .default([]),
        })
        .strict()
        .superRefine((e, t) => {
          let r = new Set(e.vertices.map((e) => e.id));
          (r.size !== e.vertices.length &&
            t.addIssue({
              code: "custom",
              message: "Tên đỉnh hình không gian bị trùng.",
            }),
            (e.edges.some(
              (e) => !r.has(e.from) || !r.has(e.to) || e.from === e.to,
            ) ||
              e.faces.some((e) => e.vertices.some((e) => !r.has(e)))) &&
              t.addIssue({
                code: "custom",
                message: "Cạnh hoặc mặt dùng đỉnh chưa khai báo.",
              }));
          let [n, i] = e.projection;
          1e-8 >
            Math.hypot(
              n[1] * i[2] - n[2] * i[1],
              n[2] * i[0] - n[0] * i[2],
              n[0] * i[1] - n[1] * i[0],
            ) &&
            t.addIssue({
              code: "custom",
              message: "Phép chiếu hình không gian phải tạo được hai chiều.",
            });
        }),
      f = t.z.discriminatedUnion("kind", [
        t.z
          .object({ kind: t.z.literal("line"), ...l, ...u, from: n, to: n })
          .strict(),
        t.z
          .object({
            kind: t.z.literal("polyline"),
            ...l,
            ...u,
            points: t.z.array(n).min(2).max(300),
          })
          .strict(),
        t.z
          .object({
            kind: t.z.literal("polygon"),
            ...l,
            points: t.z.array(n).min(3).max(300),
          })
          .strict(),
        t.z
          .object({
            kind: t.z.literal("rect"),
            ...l,
            x: r,
            y: r,
            width: a,
            height: a,
            rx: t.z.number().finite().min(0).max(1e3).default(0),
          })
          .strict(),
        t.z
          .object({ kind: t.z.literal("circle"), ...l, center: n, radius: a })
          .strict(),
        t.z
          .object({
            kind: t.z.literal("ellipse"),
            ...l,
            center: n,
            rx: a,
            ry: a,
          })
          .strict(),
        t.z
          .object({
            kind: t.z.literal("path"),
            ...l,
            ...u,
            d: t.z.string().refine(function (e) {
              if (e.length > 12e3) return !1;
              let t =
                  /[MmLlHhVvCcSsQqTtAaZz]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g,
                r = e.match(t) ?? [];
              if (
                e.replace(t, "").replace(/[\s,]/g, "") ||
                r.length > 4e3 ||
                !/^[Mm]$/.test(r[0] ?? "")
              )
                return !1;
              let n = {
                m: 2,
                l: 2,
                h: 1,
                v: 1,
                c: 6,
                s: 4,
                q: 4,
                t: 2,
                a: 7,
                z: 0,
              };
              for (let e = 0; e < r.length; ) {
                let t = r[e++].toLowerCase();
                if (!(t in n)) return !1;
                let i = [];
                for (; e < r.length && !/^[a-z]$/i.test(r[e]); )
                  i.push(Number(r[e++]));
                let a = n[t];
                if (
                  i.some((e) => !Number.isFinite(e) || Math.abs(e) > 1e4) ||
                  (0 === a ? 0 !== i.length : i.length < a || i.length % a != 0)
                )
                  return !1;
                if ("a" === t) {
                  for (let e = 0; e < i.length; e += 7)
                    if (
                      i[e] < 0 ||
                      i[e + 1] < 0 ||
                      ![0, 1].includes(i[e + 3]) ||
                      ![0, 1].includes(i[e + 4])
                    )
                      return !1;
                }
              }
              return !0;
            }, "Đường cong SVG không hợp lệ."),
          })
          .strict(),
        t.z
          .object({
            kind: t.z.literal("text"),
            at: n,
            text: t.z.string().min(1).max(500),
            fontSize: t.z.number().finite().min(8).max(48).default(16),
            anchor: t.z.enum(["start", "middle", "end"]).default("middle"),
            rotate: t.z.number().finite().min(-360).max(360).default(0),
            color: o.default("#000000"),
            italic: t.z.boolean().default(!1),
            bold: t.z.boolean().default(!1),
          })
          .strict(),
        c,
      ]),
      d = t.z
        .object({
          width: t.z.number().finite().min(80).max(640).default(320),
          height: t.z.number().finite().min(80).max(900).default(240),
          viewBox: t.z.tuple([r, r, a, a]).optional(),
          align: t.z.enum(["left", "center", "right"]).default("center"),
          alt: t.z.string().max(1e3).default("Hình minh hoạ"),
          caption: t.z.string().max(500).default(""),
          bottomCaption: t.z.string().max(500).default(""),
          elements: t.z.array(f).min(1).max(400),
        })
        .strict(),
      p = (e, t) => e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
    ;
