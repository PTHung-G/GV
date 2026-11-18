// Reconstructed from 1twhdx9v_bid8.pretty.js, module 714639.
// deps: m10552, m411929, m731530, m231240, m644677, m503561, m827121, m571141
// exports: applyTableLayout, lineStart, mathRect, measureTable, resetTableLayout, COLUMN_RESIZING_CLASS, PAGINATION_NOW_EVENT, PAGINATION_RESUME_EVENT, Pagination, RESIZING_CLASS
export { p as "applyTableLayout" };
export { l as "lineStart" };
export { o as "mathRect" };
export { m as "measureTable" };
export { c as "resetTableLayout" };
export { w as "COLUMN_RESIZING_CLASS" };
export { A as "PAGINATION_NOW_EVENT" };
export { N as "PAGINATION_RESUME_EVENT" };
export { C as "Pagination" };
export { v as "RESIZING_CLASS" };

"use strict";
    var t = m10552,
      r = m411929,
      n = m731530;
    m231240;
    var i = m644677,
      a = m503561;
    function o(e) {
      let t = e.getBoundingClientRect(),
        r = t.top,
        n = t.bottom,
        i = t.left,
        a = t.right;
      for (let t of e.querySelectorAll(
        ".katex-html > .katex-base, .katex-html > .base",
      )) {
        let e = t.getBoundingClientRect();
        (e.width || e.height) &&
          ((r = Math.min(r, e.top)),
          (n = Math.max(n, e.bottom)),
          (i = Math.min(i, e.left)),
          (a = Math.max(a, e.right)));
      }
      return new DOMRect(i, r, a - i, n - r);
    }
    let s = /[\p{L}\p{M}\p{N}]/u;
    function l(e, t, r) {
      let n = document.createTreeWalker(t, NodeFilter.SHOW_TEXT),
        i = document.createRange(),
        a = null;
      for (let t = n.nextNode(); t; t = n.nextNode()) {
        let n = t.textContent ?? "";
        if (
          !n ||
          t.parentElement?.closest(".pg-spacer, .no-print, .node-math") ||
          (i.selectNodeContents(t),
          !Array.from(i.getClientRects()).some(
            (e) => e.bottom > r.top + 1 && e.top < r.bottom - 1,
          ))
        )
          continue;
        let o = 0,
          l = n.length;
        for (; o < l; ) {
          let e = Math.floor((o + l) / 2);
          (i.setStart(t, e),
            i.setEnd(t, e + 1),
            i.getBoundingClientRect().bottom <= r.top + 1
              ? (o = e + 1)
              : (l = e));
        }
        if (o < n.length) {
          let r = e.posAtDOM(t, o);
          (!a || r < a.pos) &&
            (a = { pos: r, glued: o > 0 && s.test(n[o - 1]) && s.test(n[o]) });
        }
      }
      for (let n of t.querySelectorAll(".doc-math")) {
        let t = o(n);
        if (t.bottom <= r.top + 1 || t.top >= r.bottom - 1) continue;
        let i = e.posAtDOM(n, 0);
        (!a || i < a.pos) && (a = { pos: i, glued: !1 });
      }
      return a;
    }
    let u = (e) => e.querySelector(":scope > table");
    function c(e) {
      (e.dom.querySelectorAll(".pg-table-gap").forEach((e) => e.remove()),
        e.dom.querySelectorAll("table[data-pg-masked]").forEach((e) => {
          (e.style.removeProperty("mask-image"),
            e.style.removeProperty("-webkit-mask-image"),
            e.removeAttribute("data-pg-masked"));
        }),
        e.dom.querySelectorAll("[data-pg-row]").forEach((e) => {
          (e.style.removeProperty("--pg-row-height"),
            e.removeAttribute("data-pg-row"));
        }),
        e.dom.querySelectorAll("[data-pg-rowspan]").forEach((e) => {
          ((e.rowSpan = Number(e.dataset.pgRowspan) || 1),
            e.removeAttribute("data-pg-rowspan"));
        }));
    }
    function f(e, t, r) {
      let { width: n, style: i, color: a } = e.side,
        o = document.createElement("div");
      return (
        (o.className = "pg-table-edge"),
        (o.style.left = `${e.left - n / 2}px`),
        (o.style.width = `${e.right - e.left + n}px`),
        (o.style.top = `${t - n / 2 - Math.min(0, r)}px`),
        (o.style.borderTop = `${n + Math.abs(r)}px ${i} ${a}`),
        o
      );
    }
    function d(e, t, r, n, i) {
      let a = document.createElement("div"),
        o = 1 + 1 / 128,
        s = 1 + 1 / 128 + n,
        [l, u] = i ? ["transparent", "#fff"] : ["#fff", "transparent"];
      return (
        (a.className = "pg-table-edge"),
        (a.style.left = `${t - n / 2}px`),
        (a.style.width = `${e - 2 * t + n}px`),
        (a.style.top = `${r - n / 2 - 1}px`),
        (a.style.height = "4px"),
        (a.style.background = `linear-gradient(${l} ${o}px, #000 ${o}px, #000 ${s}px, ${u} ${s}px)`),
        a
      );
    }
    function p(e, t) {
      for (let r of t) {
        let t = e.state.doc.nodeAt(r.pos),
          n = e.nodeDOM(r.pos),
          a = n instanceof HTMLElement ? u(n) : null;
        if (t?.type.name !== "table" || !(n instanceof HTMLElement) || !a)
          continue;
        let o = i.TableMap.get(t);
        for (let t of new Set(o.map)) {
          let n = e.nodeDOM(r.pos + 1 + t);
          if (!(n instanceof HTMLTableCellElement)) continue;
          let i = o.findCell(t),
            a = r.gaps.filter(
              (e) => e.betweenRows && e.row > i.top && e.row < i.bottom,
            ).length;
          a &&
            ((n.dataset.pgRowspan = String(i.bottom - i.top)),
            (n.rowSpan = i.bottom - i.top + a));
        }
        for (let [t, n] of r.rows.entries()) {
          let r = e.nodeDOM(n.pos);
          r instanceof HTMLElement &&
            ((r.dataset.pgRow = String(t)),
            r.style.setProperty("--pg-row-height", `${n.height}px`));
        }
        if (
          (n
            .querySelectorAll(":scope > .pg-table-gap")
            .forEach((e) => e.remove()),
          !r.gaps.length)
        )
          continue;
        let s = r.border / 2,
          l =
            1 /
            ((a.getBoundingClientRect().width / (a.offsetWidth || 1) || 1) *
              (window.devicePixelRatio || 1)),
          c = "none" !== getComputedStyle(a, "::after").content,
          p = c
            ? parseFloat(getComputedStyle(a).getPropertyValue("--hairline")) ||
              l
            : 0,
          h = [];
        for (let e of r.gaps) {
          let t = e.end + (c ? 0 : s + l),
            n = e.next + (e.header ? r.header : 0) - (c ? 0 : s + l);
          n > t &&
            h.push(
              `#000 ${t}px, transparent ${t}px, transparent ${n}px, #000 ${n}px`,
            );
        }
        if (h.length) {
          let e = `linear-gradient(to bottom, #000 0px, ${h.join(", ")}, #000 100%)`;
          (a.style.setProperty("mask-image", e),
            a.style.setProperty("-webkit-mask-image", e),
            (a.dataset.pgMasked = ""));
        }
        for (let e of r.gaps) {
          let t = document.createElement("div");
          if (
            ((t.className = "pg-table-gap"),
            (t.dataset.pgGap = e.id),
            (t.dataset.pgRowIndex = String(e.row)),
            (t.dataset.pgBetweenRows = String(e.betweenRows)),
            (t.dataset.pgHeader = String(e.header ? r.headerRows : 0)),
            t.setAttribute("aria-hidden", "true"),
            (t.contentEditable = "false"),
            c)
          )
            (t.appendChild(d(r.width, s, e.end, p, !0)),
              e.header || t.appendChild(d(r.width, s, e.next, p, !1)));
          else {
            for (let r of e.bottoms) t.appendChild(f(r, e.end, l));
            for (let r of e.tops) t.appendChild(f(r, e.next, -l));
          }
          let i = e.header
            ? (function (e, t, r) {
                let n = Array.from(
                  e.tBodies[0]?.querySelectorAll(
                    ":scope > tr:not(.pg-spacer)",
                  ) ?? [],
                ).slice(0, r.length);
                if (n.length < r.length) return null;
                let i = e.cloneNode(!1);
                (i.removeAttribute("data-pg-masked"),
                  i.style.removeProperty("mask-image"),
                  i.style.removeProperty("-webkit-mask-image"),
                  i.classList.add("pg-table-header"),
                  (i.style.top = `${t}px`));
                let a = e.querySelector(":scope > colgroup");
                a && i.appendChild(a.cloneNode(!0));
                let o = i.appendChild(document.createElement("tbody"));
                return (
                  n.forEach((e, t) => {
                    let n = o.appendChild(e.cloneNode(!0));
                    (n.removeAttribute("data-pg-row"),
                      (n.style.height = `${r[t]}px`),
                      n
                        .querySelectorAll("[id]")
                        .forEach((e) => e.removeAttribute("id")),
                      n
                        .querySelectorAll(
                          ".selectedCell, .ProseMirror-selectednode",
                        )
                        .forEach((e) =>
                          e.classList.remove(
                            "selectedCell",
                            "ProseMirror-selectednode",
                          ),
                        ),
                      n
                        .querySelectorAll("[contenteditable]")
                        .forEach((e) =>
                          e.setAttribute("contenteditable", "false"),
                        ),
                      n
                        .querySelectorAll(".pg-spacer")
                        .forEach((e) => e.remove()));
                  }),
                  i
                );
              })(
                a,
                e.next - r.lead,
                r.rows.slice(0, r.headerRows).map((e) => e.height),
              )
            : null;
          (i && t.appendChild(i), n.appendChild(t));
        }
      }
    }
    function h(e, t) {
      let r =
          parseFloat(e.getPropertyValue(`border-${t.toLowerCase()}-width`)) ||
          0,
        n = e.getPropertyValue(`border-${t.toLowerCase()}-style`);
      return r <= 0 || "none" === n || "hidden" === n
        ? null
        : {
            width: r,
            style: n,
            color: e.getPropertyValue(`border-${t.toLowerCase()}-color`),
          };
    }
    function m(e, t, r, n, o, s, c, f) {
      let d = i.TableMap.get(t),
        p = [];
      t.forEach((t, n) => {
        let i = r + 1 + n,
          a = e.nodeDOM(i);
        a instanceof HTMLElement && p.push({ pos: i, dom: a });
      });
      let m = e.nodeDOM(r),
        g = m instanceof HTMLElement ? u(m) : null;
      if (!g || !p.length || p.length !== t.childCount)
        return {
          spacers: [],
          layout: {
            pos: r,
            rows: [],
            gaps: [],
            header: 0,
            headerRows: 0,
            border: 0,
            lead: 0,
            width: 0,
          },
          added: 0,
        };
      let x = g.getBoundingClientRect(),
        y = p[0].dom.getBoundingClientRect().top,
        b = (y - x.top) / o,
        v = (e) => {
          let t = e.getBoundingClientRect();
          return { top: (t.top - y) / o, bottom: (t.bottom - y) / o };
        },
        w = p.map(({ dom: e }) => v(e)),
        N = 1,
        A = 0,
        M = 0,
        D = [],
        C = [...new Set(d.map)].flatMap((n) => {
          let i = t.nodeAt(n),
            s = r + 1 + n,
            u = e.nodeDOM(s);
          if (!i || !(u instanceof HTMLElement)) return [];
          let c = getComputedStyle(u);
          ((N = Math.max(
            N,
            parseFloat(c.borderTopWidth) || 0,
            parseFloat(c.borderBottomWidth) || 0,
          )),
            (A = Math.max(A, parseFloat(c.paddingTop) || 0)),
            (M = Math.max(M, parseFloat(c.paddingBottom) || 0)));
          let p = [],
            m = v(u),
            g = (e, t) => ({
              top: Math.max(e, m.top),
              bottom: Math.min(t, m.bottom),
            });
          i.forEach((t, r) => {
            let n = s + 1 + r,
              i = e.nodeDOM(n);
            if (i instanceof HTMLElement)
              if (t.isTextblock && t.content.size > 0) {
                let t = f(i, 2 * o),
                  r =
                    parseFloat(getComputedStyle(i).lineHeight) ||
                    a.TEXT_LINE_PX;
                t.forEach((t, a) => {
                  let { top: s, bottom: u } = g(
                      (t.top - y) / o,
                      (t.bottom - y) / o,
                    ),
                    c = 0 === a ? { pos: n, glued: !1 } : l(e, i, t),
                    f = p[p.length - 1];
                  if (!c) {
                    f && a > 0 && (f.bottom = Math.max(f.bottom, u));
                    return;
                  }
                  (c.glued && f && a > 0 && D.push({ top: f.top, bottom: u }),
                    p.push({
                      top: s,
                      bottom: u,
                      pos: c.pos,
                      glued: c.glued,
                      line: r,
                    }));
                });
              } else {
                let e = v(i);
                p.push({ ...g(e.top, e.bottom), pos: n });
              }
          });
          let b = u.getBoundingClientRect();
          return [
            {
              ...d.findCell(n),
              box: m,
              units: p,
              end: s + i.nodeSize - 1,
              x: { left: (b.left - x.left) / o, right: (b.right - x.left) / o },
              valign: c.verticalAlign,
              bottomSide: h(c, "Bottom"),
              topSide: h(c, "Top"),
            },
          ];
        }),
        E = (function (e, t) {
          let r = 0;
          for (let n = 1; n <= t.height && n > r; )
            for (let i of ((r = n), new Set(t.map.slice(0, r * t.width)))) {
              if (e.nodeAt(i)?.type.name !== "tableHeader") return 0;
              n = Math.max(n, t.findCell(i).bottom);
            }
          return r;
        })(t, d),
        S = E && w.length > E && w[E - 1].bottom < s / 3 ? w[E - 1].bottom : 0,
        T = w.map(
          (e, t) =>
            !C.some((e) => e.bottom - e.top > 1 && e.top <= t && e.bottom > t),
        ),
        k = (function (e, t, r, n, i, a = {}) {
          if (!e.length) return [];
          let {
              headerHeight: o = 0,
              headerRows: s = 1,
              splittable: l = [],
              minPart: u = 0,
              padTop: c = 0,
              padBottom: f = 0,
              glued: d = [],
            } = a,
            p = [],
            h = e[e.length - 1].bottom,
            m = d.length ? [...t, ...d] : t,
            g = (e, t = m) =>
              t.filter((t) => t.top < e - 0.5 && t.bottom > e + 0.5),
            x = (e, t) => {
              for (;;) {
                let r = g(e, t);
                if (!r.length) return e;
                let n = Math.min(...r.map((e) => e.top));
                if (n >= e - 0.5) return e;
                e = n;
              }
            },
            y = 0,
            b = 0;
          for (; y < h - 0.5; ) {
            let a = Math.max(0, Math.floor((r + y + b + 0.5) / i)),
              d = a * i + n - r - b;
            if (h <= d + 0.5) break;
            let v = e.findIndex((e) => e.bottom > d + 0.5);
            if (v < 0) break;
            let w = e[v].top,
              N = e[v].bottom,
              A = Math.max(w, y),
              M = (e) => {
                let r = x(e, m);
                return m === t || r > A + 0.5 ? r : Math.max(r, x(e, t));
              },
              D = w <= y + 0.5,
              C = N - w > n - (v >= s ? o : 0) - c - f,
              E = w,
              S = !0;
            if (D || C || l[v]) {
              let e = M(d - f),
                t = e - A,
                r = N - e;
              (D || (t >= u && (C || r >= u))) && ((E = e), (S = !1));
            }
            if (S && g(E).length) {
              for (let t = v; t > 0 && e[t].top > y + 0.5; t--)
                if (!g(e[t].top).length) {
                  E = e[t].top;
                  break;
                }
            }
            let T = (t) => {
                let r = t,
                  n = -1,
                  i = !1;
                for (let t = 0; t < 8; t++) {
                  ((r = M(r)), (n = e.findIndex((e) => e.bottom > r + 0.5)));
                  let t = e.findIndex((e) => e.top > r - 0.5);
                  if (
                    ((i =
                      t >= 0 &&
                      0.5 > Math.abs(e[t].top - r) &&
                      (n < 0 || t <= n)) && (n = t),
                    n < 0 || i || r + f <= d + 0.5)
                  )
                    break;
                  r = d - f;
                }
                return { at: r, index: n, between: i };
              },
              k = T(E);
            (S && (k.index < 0 || k.at <= y + 0.5) && (k = T(d - f)),
              (E = k.at),
              (v = k.index));
            let F = k.between;
            if (v < 0 || E <= y + 0.5) break;
            let B = o > 0 && v >= s,
              O = (a + 1) * i - r - b,
              z = O - E + (F ? 0 : c);
            (p.push({
              cut: E,
              end: E + (F ? 0 : f),
              height: z,
              next: O + b,
              row: v,
              betweenRows: F,
              repeatHeader: B,
            }),
              (b += z + (B ? o : 0)),
              (y = E));
          }
          return p;
        })(
          w,
          C.flatMap((e) => e.units),
          n + b,
          s,
          c,
          {
            headerHeight: S,
            headerRows: E,
            splittable: T,
            minPart: 2 * a.TEXT_LINE_PX,
            padTop: A,
            padBottom: M,
            glued: D,
          },
        ),
        F = [],
        B = 0,
        O = {
          pos: r,
          rows: p.map(({ pos: e }, t) => ({
            pos: e,
            height: w[t].bottom - w[t].top,
          })),
          gaps: [],
          header: S,
          headerRows: S ? E : 0,
          border: N,
          lead: b,
          width: x.width / o,
        };
      return (
        k.forEach((e, t) => {
          let n = `${r}:${t}`,
            i = e.height + (e.repeatHeader ? S : 0),
            o = C.filter((t) =>
              e.betweenRows
                ? t.top < e.row && t.bottom > e.row
                : t.top <= e.row && t.bottom > e.row,
            );
          if (
            (O.gaps.push({
              id: n,
              row: e.row,
              betweenRows: e.betweenRows,
              header: e.repeatHeader,
              end: b + e.end + B,
              next: b + e.next,
              bottoms: o.flatMap((e) =>
                e.bottomSide ? [{ ...e.x, side: e.bottomSide }] : [],
              ),
              tops: e.repeatHeader
                ? []
                : o.flatMap((e) =>
                    e.topSide ? [{ ...e.x, side: e.topSide }] : [],
                  ),
            }),
            e.betweenRows)
          ) {
            let t = new Set();
            o.forEach((e) => {
              for (let r = e.left; r < e.right; r++) t.add(r);
            });
            let r = [],
              a = 0;
            for (let e = 0; e <= d.width; e++)
              e < d.width && !t.has(e) ? a++ : a && (r.push(a), (a = 0));
            F.push({
              kind: "row",
              pos: p[e.row].pos,
              height: i,
              gap: n,
              columns: r,
            });
          } else O.rows[e.row].height += i;
          for (let t of o) {
            let r = t.units.find((t) => t.top >= e.cut - 0.5);
            r?.glued
              ? F.push({
                  kind: "cell",
                  pos: r.pos + 1,
                  height: i + (r.line ?? a.TEXT_LINE_PX),
                  gap: n,
                  lift: !0,
                })
              : r
                ? F.push({ kind: "cell", pos: r.pos, height: i, gap: n })
                : ("middle" === t.valign || "bottom" === t.valign) &&
                  F.push({ kind: "cell", pos: t.end, height: i, gap: n });
          }
          B += i;
        }),
        { spacers: F, layout: O, added: B }
      );
    }
    ;
    var g = m827121,
      x = m571141;
    let y = new g.PluginKey("examPagination"),
      b = "pg-spacer",
      v = "doc-resizing",
      w = "doc-column-resizing",
      N = "pg-resume",
      A = "pg-now";
    function M(e, t) {
      let r = t.flatMap((t) => {
        let r = `${t.kind}:${t.pos}:${t.height}:${t.gap ?? ""}:${t.columns?.join(",") ?? t.colspan ?? 0}`;
        if ("break" === t.kind) {
          let r = e.nodeAt(t.pos);
          return r
            ? [
                x.Decoration.node(t.pos, t.pos + r.nodeSize, {
                  class: b,
                  style: `height: ${t.height}px`,
                }),
              ]
            : [];
        }
        let n = "row" === t.kind ? "tr" : "div";
        return [
          x.Decoration.widget(
            t.pos,
            () => {
              let e = (function (e, t, r) {
                let n = document.createElement(e);
                if (
                  ((n.className = b),
                  n.setAttribute("contenteditable", "false"),
                  n.setAttribute("aria-hidden", "true"),
                  "tr" === e)
                ) {
                  let e = document.createElement("td");
                  ((e.colSpan = r ?? 1),
                    (e.style.height = `${t}px`),
                    n.appendChild(e));
                } else n.style.height = `${t}px`;
                return n;
              })(n, t.height, t.colspan);
              return (
                t.lift && e.classList.add("pg-lift-spacer"),
                t.gap && (e.dataset.pgGap = t.gap),
                "cell" === t.kind && e.classList.add("pg-cell-spacer"),
                "columns" === t.kind && e.classList.add("pg-column-spacer"),
                "tr" === n &&
                  t.columns &&
                  (e.replaceChildren(
                    ...t.columns.map((e) => {
                      let r = document.createElement("td");
                      return (
                        (r.colSpan = e),
                        (r.style.height = `${t.height}px`),
                        r
                      );
                    }),
                  ),
                  (e.style.height = `${t.height}px`)),
                e
              );
            },
            {
              side: -2,
              relaxedSide: "line" === t.kind,
              key: t.lift ? `${r}:lift` : r,
              ignoreSelection: !0,
            },
          ),
        ];
      });
      return x.DecorationSet.create(e, r);
    }
    function D(e, t = 2) {
      let r = [],
        n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT),
        i = document.createRange();
      for (let e = n.nextNode(); e; e = n.nextNode())
        if (
          !(
            !e.textContent ||
            (e.parentElement &&
              e.parentElement.closest(`.${b}, .no-print, .node-math`))
          )
        )
          for (let t of (i.selectNodeContents(e),
          Array.from(i.getClientRects())))
            t.width > 0 && t.height > 0 && r.push(t);
      for (let t of e.querySelectorAll(".doc-math")) {
        let e = o(t);
        e.width > 0 && e.height > 0 && r.push(e);
      }
      r.sort((e, t) => e.top - t.top || e.left - t.left);
      let a = [];
      for (let e of r) {
        let r = a[a.length - 1];
        r && e.top < r.bottom - t
          ? ((r.bottom = Math.max(r.bottom, e.bottom)),
            e.left < r.screenX && (r.screenX = e.left))
          : a.push({
              top: e.top,
              bottom: e.bottom,
              screenX: e.left,
              screenY: 0,
            });
      }
      for (let e of a) e.screenY = (e.top + e.bottom) / 2;
      return a;
    }
    let C = t.Extension.create({
      name: "examPagination",
      addOptions: () => ({
        metrics: { contentHeight: 1e3, pitch: 1100 },
        onPages: void 0,
      }),
      addProseMirrorPlugins() {
        let e = this.options;
        return [
          new g.Plugin({
            key: y,
            state: {
              init: (e, t) => ({
                spacers: [],
                tables: [],
                decorations: x.DecorationSet.create(t.doc, []),
              }),
              apply: (e, t) => {
                let r = e.getMeta(y);
                if (r) return { ...r, decorations: M(e.doc, r.spacers) };
                if (!e.docChanged) return t;
                let n = t.spacers.flatMap((t) => {
                  let r = e.mapping.mapResult(t.pos, 1);
                  return r.deleted ||
                    ("break" === t.kind &&
                      e.doc.nodeAt(r.pos)?.type.name !== "pageBreak")
                    ? []
                    : [{ ...t, pos: r.pos }];
                });
                return { spacers: n, tables: [], decorations: M(e.doc, n) };
              },
            },
            props: { decorations: (e) => y.getState(e)?.decorations },
            view: (t) => {
              let a = 0,
                o = 0,
                s = !1,
                u = 0,
                f = () => {
                  
                  if (
                    ((a = 0),
                    s ||
                      !t.dom.isConnected ||
                      (t.dom.classList.contains(v) &&
                        !t.dom.classList.contains(w)) ||
                      0 === t.dom.getClientRects().length ||
                      window.matchMedia?.("print").matches)
                  )
                    return;
                  (0, r.layoutChoiceGrids)(t);
                  let h = (function (e, t) {
                    let r = e.dom;
                    (c(e), r.classList.add("pg-measuring"));
                    try {
                      return (function (e, t) {
                        let r = e.dom,
                          a = r.getBoundingClientRect(),
                          o = a.top,
                          s = a.width / (t.contentWidth ?? r.offsetWidth) || 1,
                          { pitch: u, contentHeight: c } = t,
                          f = (e) => (e - o) / s,
                          d = (e) => Math.max(0, Math.floor((e + 0.5) / u)),
                          p = (e) => e * u + c,
                          h = (e) => (e + 1) * u,
                          g = [],
                          x = [],
                          y = 0,
                          b = 0,
                          v = [],
                          w = (e, t) => {
                            ["bulletList", "orderedList", "listItem"].includes(
                              e.type.name,
                            )
                              ? e.forEach((e, r) => w(e, t + 1 + r))
                              : v.push({ node: e, pos: t });
                          };
                        e.state.doc.forEach(w);
                        let N = (t) => {
                            let r = e.nodeDOM(t);
                            if (!(r instanceof HTMLElement)) return null;
                            let n = r.getBoundingClientRect();
                            return {
                              element: r,
                              top: f(n.top),
                              bottom: f(n.bottom),
                            };
                          },
                          A = (e, t) => {
                            let r = d(t);
                            if (t - r * u < 1) return !1;
                            let n = h(r) - t;
                            return (
                              g.push({ kind: "block", pos: e, height: n }),
                              (y += n),
                              !0
                            );
                          };
                        return (
                          v.forEach(({ node: t, pos: r }, a) => {
                            let o = N(r);
                            if (!o) return;
                            let w = o.top + y,
                              M = o.bottom + y;
                            if ("pageBreak" === t.type.name) {
                              let e = h(d(w)) - w;
                              (g.push({ kind: "break", pos: r, height: e }),
                                (y += e),
                                (b = w + e));
                              return;
                            }
                            let C = d(w);
                            if (M <= p(C) + 0.5 && w < p(C)) {
                              if (
                                "heading" === t.type.name &&
                                a + 1 < v.length
                              ) {
                                let t = N(v[a + 1].pos);
                                if (t) {
                                  let n = v[a + 1],
                                    i = t.bottom - t.top;
                                  if (
                                    n.node.isTextblock &&
                                    n.node.content.size > 0
                                  )
                                    i =
                                      ((D(t.element, 2 * s)[0]?.bottom ?? 0) -
                                        t.element.getBoundingClientRect().top) /
                                      s;
                                  else if ("table" === n.node.type.name) {
                                    let r = e.nodeDOM(
                                        n.pos +
                                          1 +
                                          n.node.child(0).nodeSize +
                                          (n.node.childCount > 1 ? 0 : -1),
                                      ),
                                      a =
                                        r instanceof HTMLElement &&
                                        n.node.childCount > 1
                                          ? r
                                          : e.nodeDOM(n.pos + 1);
                                    a instanceof HTMLElement &&
                                      (i =
                                        (a.getBoundingClientRect().bottom -
                                          t.element.getBoundingClientRect()
                                            .top) /
                                        s);
                                  }
                                  i < c &&
                                    t.top + y + i > p(C) + 0.5 &&
                                    A(r, w);
                                }
                              }
                              b = Math.max(b, o.bottom + y);
                              return;
                            }
                            if (
                              "paragraph" === t.type.name &&
                              t.content.size > 0
                            ) {
                              let n = D(o.element, 2 * s),
                                i = !0;
                              for (let a of n) {
                                let n = f(a.top) + y,
                                  s = f(a.bottom) + y,
                                  u = d(n);
                                if (s <= p(u) + 0.5 && n < p(u)) {
                                  i = !1;
                                  continue;
                                }
                                let c = getComputedStyle(o.element),
                                  m =
                                    n -
                                    (o.element.querySelector(
                                      ".doc-paragraph-content",
                                    )
                                      ? 0
                                      : Math.max(
                                          0,
                                          (parseFloat(c.lineHeight) -
                                            1.15 * parseFloat(c.fontSize)) /
                                            2,
                                        ) || 0);
                                if (i) {
                                  (A(r, w), (i = !1));
                                  continue;
                                }
                                let x = l(e, o.element, a);
                                if (
                                  !(
                                    x &&
                                    x.pos > r + 1 &&
                                    x.pos < r + t.nodeSize - 1
                                  )
                                )
                                  continue;
                                let b = h(d(m)) - m;
                                b <= 0 ||
                                  (g.push({
                                    kind: "line",
                                    pos: x.pos,
                                    height: b,
                                  }),
                                  (y += b));
                              }
                              b = Math.max(b, o.bottom + y);
                              return;
                            }
                            if ("table" === t.type.name) {
                              let n = i.TableMap.get(t),
                                a = N(r + 1),
                                l =
                                  t.childCount > 1
                                    ? N(r + 1 + t.child(0).nodeSize)
                                    : null,
                                f =
                                  (function (e, t) {
                                    let r = e.firstChild;
                                    if (!r) return !1;
                                    let n = !0;
                                    return (
                                      r.forEach((e) => {
                                        ("tableHeader" !== e.type.name ||
                                          Number(e.attrs.rowspan) > 1) &&
                                          (n = !1);
                                      }),
                                      n && t.width > 0
                                    );
                                  })(t, n) && l
                                    ? l.bottom
                                    : a?.bottom;
                              null != f &&
                                f - o.top < c &&
                                f + y > p(C) + 0.5 &&
                                A(r, w);
                              let d = m(e, t, r, o.top + y, s, c, u, D),
                                h = d.layout.gaps[0];
                              (h?.betweenRows &&
                                h.row > 0 &&
                                h.row <= d.layout.headerRows &&
                                A(r, o.top + y) &&
                                (d = m(e, t, r, o.top + y, s, c, u, D)),
                                g.push(...d.spacers),
                                d.layout.gaps.length && x.push(d.layout),
                                (y += d.added),
                                (b = Math.max(b, o.bottom + y)));
                              return;
                            }
                            if ("docColumns" === t.type.name) {
                              let i = (0, n.measureColumns)(
                                e,
                                t,
                                r,
                                w,
                                s,
                                c,
                                u,
                              );
                              (g.push(...i.spacers),
                                (y += i.height - (o.bottom - o.top)),
                                (b = Math.max(b, o.bottom + y)));
                              return;
                            }
                            (A(r, w), (b = Math.max(b, o.bottom + y)));
                          }),
                          {
                            spacers: g,
                            pages: Math.max(1, d(Math.max(0, b - 1)) + 1),
                            tables: x,
                          }
                        );
                      })(e, t);
                    } finally {
                      (r.classList.remove("pg-measuring"),
                        p(e, y.getState(e.state)?.tables ?? []));
                    }
                  })(t, e.metrics);
                  if (
                    (h.pages !== o && ((o = h.pages), e.onPages?.(o)),
                    (f = y.getState(t.state)?.spacers ?? []),
                    (d = h.spacers),
                    !(
                      f.length === d.length &&
                      f.every(
                        (e, t) =>
                          e.kind === d[t].kind &&
                          e.pos === d[t].pos &&
                          e.colspan === d[t].colspan &&
                          e.gap === d[t].gap &&
                          e.lift === d[t].lift &&
                          JSON.stringify(e.columns) ===
                            JSON.stringify(d[t].columns) &&
                          1 > Math.abs(e.height - d[t].height),
                      )
                    ) ||
                      JSON.stringify(y.getState(t.state)?.tables) !==
                        JSON.stringify(h.tables))
                  ) {
                    let e = t.hasFocus() && performance.now() - u < 1e3;
                    (t.dispatch(
                      t.state.tr.setMeta(y, h).setMeta("addToHistory", !1),
                    ),
                      c(t),
                      p(t, h.tables),
                      e &&
                        t.dispatch(
                          t.state.tr
                            .scrollIntoView()
                            .setMeta("addToHistory", !1),
                        ));
                  }
                  M();
                },
                d = () => {
                  s || a || (a = requestAnimationFrame(f));
                },
                h = "u" < typeof ResizeObserver ? null : new ResizeObserver(d);
              h?.observe(t.dom);
              let g = new Set(),
                x = new WeakSet(),
                b =
                  "u" < typeof ResizeObserver
                    ? null
                    : new ResizeObserver((e) => {
                        e.some((e) => !x.delete(e.target)) && d();
                      }),
                M = () => {
                  if (!b) return;
                  let e = new Set();
                  for (let r of (t.dom
                    .querySelectorAll(".doc-table td > *, .doc-table th > *")
                    .forEach((t) => {
                      t.classList.contains("pg-spacer") ||
                        t.closest(".pg-table-gap") ||
                        e.add(t);
                    }),
                  g))
                    e.has(r) || (b.unobserve(r), g.delete(r));
                  for (let t of e)
                    g.has(t) || (g.add(t), x.add(t), b.observe(t));
                };
              (t.dom.addEventListener("load", d, !0),
                t.dom.addEventListener(N, d));
              let C = () => {
                (a && cancelAnimationFrame(a), (a = 0), f());
              };
              return (
                t.dom.addEventListener(A, C),
                document.fonts?.ready.then(d),
                window.addEventListener("resize", d),
                window.visualViewport?.addEventListener("resize", d),
                document.fonts?.addEventListener("loadingdone", d),
                d(),
                {
                  update: (e, r) => {
                    (!r.doc.eq(t.state.doc) &&
                      t.hasFocus() &&
                      (u = performance.now()),
                      r.doc.eq(t.state.doc) && y.getState(r)
                        ? y.getState(r)?.spacers !==
                            y.getState(t.state)?.spacers && d()
                        : d());
                  },
                  destroy: () => {
                    ((s = !0),
                      a && cancelAnimationFrame(a),
                      h?.disconnect(),
                      b?.disconnect(),
                      t.dom.removeEventListener("load", d, !0),
                      t.dom.removeEventListener(N, d),
                      t.dom.removeEventListener(A, C),
                      window.removeEventListener("resize", d),
                      window.visualViewport?.removeEventListener("resize", d),
                      document.fonts?.removeEventListener("loadingdone", d));
                  },
                }
              );
            },
          }),
        ];
      },
    });
    ;
