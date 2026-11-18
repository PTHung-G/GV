// Reconstructed from 1twhdx9v_bid8.pretty.js, module 606269.
// deps: m827121, m10552, m445165, m231240, m644677
// exports: PagePointer, positionAtPoint, pressOnPage, scrollParent, trackSelection, handleMathMouseDown, mathClickSelects, placeMathCaretFromMargin
export { p as "PagePointer" };
export { u as "positionAtPoint" };
export { f as "pressOnPage" };
export { s as "scrollParent" };
export { c as "trackSelection" };
export { function (e, r) { if ( ((h = !1), !e.editable || 0 !== r.button || r.ctrlKey || r.metaKey || r.altKey) ) return !1; let n = r.target instanceof Element ? r.target : null, i = n?.closest(".doc-math"); if (!i || !e.dom.contains(i)) return !1; if (r.detail > 1) return !!n?.closest(".doc-math-body") && (r.preventDefault(), !0); let a = e.posAtDOM(i, 0), o = e.state.doc.nodeAt(a); if (o?.type.name !== "math") return !1; let s = a + o.nodeSize, { selection: l } = e.state, u = document.getSelection(), f = u?.anchorNode && e.dom.contains(u.anchorNode) ? u : null; if ( !l.empty && !(l instanceof t.NodeSelection) && !f?.isCollapsed && l.from <= a && l.to >= s ) return !1; let d = i.querySelector(".doc-math-body")?.getBoundingClientRect(), p = !!(d && (r.clientX < d.left || r.clientX > d.right)), m = !d || r.clientX < (p ? d.left : (d.left + d.right) / 2), g = m ? a : s; return ( r.shiftKey && (g = f?.anchorNode ? e.posAtDOM(f.anchorNode, f.anchorOffset) : l.anchor), r.preventDefault(), e.focus(), r.shiftKey && e.dispatch( e.state.tr.setSelection( t.TextSelection.between( e.state.doc.resolve(g), e.state.doc.resolve(g <= a ? s : a), ), ), ), c(e, g, { x: r.clientX, y: r.clientY }, (n) => { if (n || r.shiftKey) { h = !0; return; } if (e.state.doc.nodeAt(a) !== o) return; let i = e.state.doc; e.dispatch( e.state.tr.setSelection( p ? t.TextSelection.create(i, m ? a : s) : t.NodeSelection.create(i, a), ), ); }), !0 ); } as "handleMathMouseDown" };
export { function () { let e = h; return ((h = !1), e); } as "mathClickSelects" };
export { function (e, t, r) { if (!e?.isEditable) return !1; for (let n of e.view.dom.querySelectorAll(".doc-math-display")) { let i = n.getBoundingClientRect(); if (r < i.top || r > i.bottom) continue; let a = n.querySelector(".doc-math-body"), o = a?.getBoundingClientRect(); if (!o || (t >= o.left && t <= o.right)) continue; let s = e.view.posAtDOM(n, 0), l = e.state.doc.nodeAt(s); if (l?.type.name === "math") return ( e .chain() .setTextSelection(s + (t > o.right ? l.nodeSize : 0)) .focus() .run(), !0 ); } return !1; } as "placeMathCaretFromMargin" };

"use strict";
    var t = m827121,
      r = m10552,
      n = m445165;
    m231240;
    var i = m644677;
    let a = (e, t, r) => Math.min(Math.max(e, t), r);
    function o(e, t, r) {
      for (let n of e.dom.querySelectorAll(".pg-spacer")) {
        let e = n.getBoundingClientRect();
        if (
          e.width > 1 &&
          e.height > 1 &&
          t >= e.left &&
          t <= e.right &&
          r >= e.top &&
          r <= e.bottom
        )
          return e;
      }
      return null;
    }
    function s(e) {
      for (let t = e.parentElement; t; t = t.parentElement) {
        let { overflowY: e } = getComputedStyle(t);
        if ("auto" === e || "scroll" === e) return t;
      }
      return null;
    }
    function l(e) {
      for (let t = e.dom.lastElementChild; t; t = t.previousElementSibling) {
        let e = t.getBoundingClientRect();
        if (e.height > 0) return e.bottom;
      }
      return e.dom.getBoundingClientRect().bottom;
    }
    function u(e, t, r, n = !1) {
      let i = e.dom.getBoundingClientRect(),
        c = a(t, i.left + 1, i.right - 1),
        f = a(r, i.top + 1, l(e) - 2);
      for (let t = 0; t < 2; t++) {
        let t = o(e, c, f);
        if (!t) break;
        f = !(function (e, t) {
          let r = Array.from(document.querySelectorAll(".doc-sheet"), (e) =>
              e.getBoundingClientRect(),
            ),
            n = r.findIndex((e) => e.top <= t && e.bottom >= t);
          return !(n <= 0) && e < (r[n - 1].bottom + r[n].top) / 2;
        })(r, t.bottom)
          ? t.bottom + 6
          : t.top - 6;
      }
      if (f < 1 || f > window.innerHeight - 1) {
        let i = s(e.dom);
        if (!i || n) return null;
        let a = f - window.innerHeight / 2;
        return ((i.scrollTop += a), u(e, t, r - a, !0));
      }
      return e.posAtCoords({ left: c, top: f });
    }
    function c(e, r, n, i) {
      let a = s(e.dom),
        o = !1,
        l = (i) => {
          if (0 === i.buttons) return c();
          if (
            !o &&
            4 >= Math.abs(i.clientX - n.x) &&
            4 >= Math.abs(i.clientY - n.y)
          )
            return;
          if (((o = !0), a)) {
            let e = a.getBoundingClientRect();
            i.clientY < e.top + 24
              ? (a.scrollTop -= 24)
              : i.clientY > e.bottom - 24 && (a.scrollTop += 24);
          }
          let s = u(e, i.clientX, i.clientY);
          if (!s) return;
          let { doc: l } = e.state,
            f = t.TextSelection.between(
              l.resolve(Math.min(r, l.content.size)),
              l.resolve(s.pos),
            );
          f.eq(e.state.selection) || e.dispatch(e.state.tr.setSelection(f));
        },
        c = () => {
          (document.removeEventListener("mousemove", l),
            document.removeEventListener("mouseup", c),
            window.removeEventListener("blur", c),
            i?.(o));
        };
      (document.addEventListener("mousemove", l),
        document.addEventListener("mouseup", c),
        window.addEventListener("blur", c));
    }
    function f(e, r) {
      if (!e.editable || 0 !== r.button || r.ctrlKey || r.metaKey || r.altKey)
        return !1;
      let { doc: i } = e.state;
      if (!r.shiftKey && r.clientY > l(e) && !i.lastChild?.isTextblock) {
        let t = e.state.schema.nodes.paragraph;
        if (t && i.canReplaceWith(i.childCount, i.childCount, t))
          return (
            r.preventDefault(),
            e.focus(),
            e.dispatch(
              e.state.tr
                .setSelection(new n.GapCursor(i.resolve(i.content.size)))
                .scrollIntoView(),
            ),
            !0
          );
      }
      let a = u(e, r.clientX, r.clientY);
      if (!a) return !1;
      (r.preventDefault(), e.focus());
      let o = (function (e, r) {
          let { doc: n } = e.state,
            i = r.inside >= 0 ? n.nodeAt(r.inside) : null;
          return i?.isAtom && !i.isInline && t.NodeSelection.isSelectable(i)
            ? t.NodeSelection.create(n, r.inside)
            : t.TextSelection.between(n.resolve(r.pos), n.resolve(r.pos));
        })(e, a),
        s = r.shiftKey ? e.state.selection.anchor : o.anchor;
      return (
        e.dispatch(
          e.state.tr
            .setSelection(
              r.shiftKey
                ? t.TextSelection.between(e.state.doc.resolve(s), o.$head)
                : o,
            )
            .scrollIntoView(),
        ),
        c(e, s, { x: r.clientX, y: r.clientY }),
        !0
      );
    }
    function d(e) {
      let r = null,
        n = () => {
          
          
          if (!r) return;
          if (
            ((r.frame = 0),
            null == r.anchor ||
              e.state.selection instanceof i.CellSelection ||
              ((n = r.x),
              (a = r.y),
              !(
                n < (s = e.dom.getBoundingClientRect()).left ||
                n > s.right ||
                a < s.top ||
                a > l(e) ||
                o(e, n, a)
              )))
          )
            return;
          let c = u(e, r.x, r.y);
          if (!c) return;
          let { doc: f } = e.state,
            d = t.TextSelection.between(
              f.resolve(Math.min(r.anchor, f.content.size)),
              f.resolve(c.pos),
            );
          d.eq(e.state.selection) || e.dispatch(e.state.tr.setSelection(d));
          let p = e.domAtPos(d.anchor),
            h = e.domAtPos(d.head);
          document
            .getSelection()
            ?.setBaseAndExtent(p.node, p.offset, h.node, h.offset);
        },
        a = (t) => {
          if (r) {
            if (0 === t.buttons) return s();
            if (null == r.anchor) {
              let t = document.getSelection();
              if (!t?.anchorNode || !e.dom.contains(t.anchorNode)) return s();
              try {
                r.anchor = e.posAtDOM(t.anchorNode, t.anchorOffset);
              } catch {
                return s();
              }
            }
            ((r.x = t.clientX),
              (r.y = t.clientY),
              r.frame || (r.frame = requestAnimationFrame(n)));
          }
        },
        s = () => {
          (r?.frame && cancelAnimationFrame(r.frame),
            (r = null),
            document.removeEventListener("mousemove", a),
            document.removeEventListener("mouseup", s),
            window.removeEventListener("blur", s));
        },
        c = (t) => {
          let n = t.target instanceof Element ? t.target : null;
          t.defaultPrevented ||
            0 !== t.button ||
            t.detail > 1 ||
            !e.editable ||
            n?.closest("[contenteditable=false]") ||
            (s(),
            (r = { anchor: null, x: t.clientX, y: t.clientY, frame: 0 }),
            document.addEventListener("mousemove", a),
            document.addEventListener("mouseup", s),
            window.addEventListener("blur", s));
        };
      return (
        e.dom.addEventListener("mousedown", c),
        {
          destroy: () => {
            (s(), e.dom.removeEventListener("mousedown", c));
          },
        }
      );
    }
    let p = r.Extension.create({
      name: "pagePointer",
      addProseMirrorPlugins: () => [
        new t.Plugin({
          props: {
            handleDOMEvents: {
              mousedown: (e, t) =>
                !(t.detail > 1) && !!o(e, t.clientX, t.clientY) && f(e, t),
            },
          },
          view: d,
        }),
      ],
    });
    ;
    let h = !1;
    ;
