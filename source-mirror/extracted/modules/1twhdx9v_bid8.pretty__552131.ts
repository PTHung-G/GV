// Reconstructed from 1twhdx9v_bid8.pretty.js, module 552131.
// deps: m10552, m827121, m571141
// exports: Search, searchKey
export { s as "Search" };
export { i as "searchKey" };

"use strict";
    var t = m10552,
      r = m827121,
      n = m571141;
    let i = new r.PluginKey("examSearch");
    function a(e, t, r) {
      if (!t) return [];
      let n = r ? t : t.toLowerCase(),
        i = [];
      return (
        e.descendants((e, t) => {
          if (!e.isTextblock) return !0;
          let a = e.textBetween(0, e.content.size, void 0, "￼"),
            o = r ? a : a.toLowerCase();
          for (let e = o.indexOf(n); e >= 0; e = o.indexOf(n, e + n.length))
            i.push({ from: t + 1 + e, to: t + 1 + e + n.length });
          return !1;
        }),
        i
      );
    }
    function o(e, t, r, i) {
      let o = a(e, t, r),
        s = 0 === o.length ? 0 : Math.min(Math.max(i, 0), o.length - 1),
        l = n.DecorationSet.create(
          e,
          o.map((e, t) =>
            n.Decoration.inline(e.from, e.to, {
              class: t === s ? "doc-find doc-find-current" : "doc-find",
            }),
          ),
        );
      return {
        query: t,
        caseSensitive: r,
        current: s,
        matches: o,
        decorations: l,
      };
    }
    let s = t.Extension.create({
      name: "examSearch",
      addProseMirrorPlugins: () => [
        new r.Plugin({
          key: i,
          state: {
            init: (e, t) => o(t.doc, "", !1, 0),
            apply: (e, t) => {
              let r = e.getMeta(i);
              return r
                ? o(
                    e.doc,
                    r.query ?? t.query,
                    r.caseSensitive ?? t.caseSensitive,
                    r.current ?? 0,
                  )
                : e.docChanged
                  ? o(e.doc, t.query, t.caseSensitive, t.current)
                  : t;
            },
          },
          props: { decorations: (e) => i.getState(e)?.decorations },
        }),
      ],
      addCommands() {
        let e = (e, t) => {
          if (!t) return;
          let r = e.domAtPos(t.from).node,
            n = r instanceof Element ? r : r.parentElement;
          n?.scrollIntoView({ block: "center", behavior: "smooth" });
        };
        return {
          setSearch:
            (t, r = !1) =>
            ({ tr: n, dispatch: o, view: s }) => (
              o &&
                (o(
                  n
                    .setMeta(i, { query: t, caseSensitive: r, current: 0 })
                    .setMeta("addToHistory", !1),
                ),
                e(s, a(n.doc, t, r)[0])),
              !0
            ),
          stepSearch:
            (t) =>
            ({ tr: r, dispatch: n, state: a, view: o }) => {
              let s = i.getState(a);
              if (!s || 0 === s.matches.length) return !1;
              let l = (s.current + t + s.matches.length) % s.matches.length;
              return (
                n &&
                  (n(r.setMeta(i, { current: l }).setMeta("addToHistory", !1)),
                  e(o, i.getState(o.state)?.matches[l])),
                !0
              );
            },
          replaceCurrent:
            (e) =>
            ({ tr: t, dispatch: r, state: n }) => {
              let a = i.getState(n),
                o = a?.matches[a.current];
              return (
                !!a &&
                !!o &&
                (r &&
                  (t.insertText(e, o.from, o.to),
                  r(t.setMeta(i, { current: a.current }))),
                !0)
              );
            },
          replaceAll:
            (e) =>
            ({ tr: t, dispatch: r, state: n }) => {
              let a = i.getState(n);
              if (!a || 0 === a.matches.length) return !1;
              if (r) {
                for (let r of [...a.matches].reverse())
                  t.insertText(e, r.from, r.to);
                r(t);
              }
              return !0;
            },
          clearSearch:
            () =>
            ({ tr: e, dispatch: t }) => (
              t &&
                t(
                  e
                    .setMeta(i, { query: "", current: 0 })
                    .setMeta("addToHistory", !1),
                ),
              !0
            ),
        };
      },
    });
    ;
