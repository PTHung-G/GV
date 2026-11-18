// Reconstructed from 1twhdx9v_bid8.pretty.js, module 112405.
// deps: m428762, m802071, m142725, m876219
// exports: ExamTablePartView, ExamTableView, htmlColumnWidths
export { class { dom; contentDOM; node; constructor(e) { this.node = e; const r = t.DOMSerializer.renderSpec( document, e.type.spec.toDOM(e), ); ((this.dom = r.dom), (this.contentDOM = r.contentDOM)); } update(e) { if (e.type !== this.node.type) return !1; this.node = e; let r = t.DOMSerializer.renderSpec( document, e.type.spec.toDOM(e), ).dom, n = this.dom.style.getPropertyValue("--pg-row-height"), i = this.dom.dataset.pgRowspan, a = this.dom instanceof HTMLTableCellElement ? this.dom.rowSpan : 0; for (let e of Array.from(this.dom.attributes)) e.name.startsWith("data-pg-") || r.hasAttribute(e.name) || this.dom.removeAttribute(e.name); for (let e of Array.from(r.attributes)) this.dom.setAttribute(e.name, e.value); return ( n && this.dom.style.setProperty("--pg-row-height", n), this.dom instanceof HTMLTableCellElement && null != i && (String(Number(e.attrs.rowspan) || 1) === i ? (this.dom.rowSpan = a) : this.dom.removeAttribute("data-pg-rowspan")), !0 ); } ignoreMutation(e) { return ( "selection" !== e.type && (!!( ("attributes" === e.type && e.attributeName?.startsWith("data-pg-")) || ("tableRow" === this.node.type.name && "attributes" === e.type && e.target === this.dom && "style" === e.attributeName) || a(e) || ("attributes" === e.type && "rowspan" === e.attributeName) || (e.target instanceof Element && e.target.closest("[data-pg-continuation]")) ) || ("childList" === e.type && [...e.addedNodes, ...e.removedNodes].every( (e) => e instanceof Element && e.hasAttribute("data-pg-continuation"), ))) ); } } as "ExamTablePartView" };
export { class { dom; contentDOM; table; cols; node; constructor(e) { ((this.node = e), (this.dom = document.createElement("div")), (this.dom.className = "doc-table-wrapper"), (this.table = this.dom.appendChild( document.createElement("table"), )), (this.table.className = "doc-table"), (this.cols = this.table.appendChild( document.createElement("colgroup"), )), (this.contentDOM = this.table.appendChild( document.createElement("tbody"), )), this.update(e)); } update(e) { if (e.type !== this.node.type) return !1; if ( e === this.node && this.dom.closest(`.${r.COLUMN_RESIZING_CLASS}`) ) return !0; this.node = e; let t = (0, i.tableWeights)(e); for (; this.cols.childElementCount > t.length; ) this.cols.lastElementChild?.remove(); t.forEach((e, t) => { ( this.cols.children[t] ?? this.cols.appendChild(document.createElement("col")) ).style.width = `${e}%`; }); let a = (0, n.rubricStyle)((0, i.headerTexts)(e) ?? []); return ( a ? (this.table.dataset.rubric = a) : delete this.table.dataset.rubric, Array.isArray(e.attrs.widths) ? (this.table.dataset.widths = e.attrs.widths.join(",")) : delete this.table.dataset.widths, !0 ); } ignoreMutation(e) { return ( "selection" !== e.type && (!!( a(e) || ("attributes" === e.type && "rowspan" === e.attributeName) || (e.target instanceof Element && e.target.closest("[data-pg-continuation]")) || ("childList" === e.type && [...e.addedNodes, ...e.removedNodes].every( (e) => e instanceof Element && e.hasAttribute("data-pg-continuation"), )) ) || !this.contentDOM.contains(e.target)) ); } } as "ExamTableView" };
export { function (e) { let t = Array.from( e.querySelectorAll(":scope > colgroup > col, :scope > col"), ), r = []; if (t.length > 0) { for (let e of t) { let t = Math.max(1, Number(e.getAttribute("span")) || 1), n = u(e); for (let e = 0; e < t; e++) r.push(null == n ? null : n / t); } return l(r); } let n = e.querySelector("tr"); if (!n) return null; for (let e of Array.from(n.children)) { if (!/^t[dh]$/i.test(e.tagName)) continue; let t = Math.max(1, Number(e.getAttribute("colspan")) || 1), n = u(e); for (let e = 0; e < t; e++) r.push(null == n ? null : n / t); } return l(r); } as "htmlColumnWidths" };

"use strict";
    var t = m428762,
      r = m802071,
      n = m142725,
      i = m876219;
    function a(e) {
      return (
        "attributes" === e.type &&
        "style" === e.attributeName &&
        e.target instanceof Element &&
        null !== e.target.closest(`.${r.RESIZING_CLASS}`)
      );
    }
    ;
    let o = {
      "": 1,
      px: 1,
      pt: 4 / 3,
      pc: 16,
      in: 96,
      cm: 96 / 2.54,
      mm: 96 / 25.4,
      "%": 1,
    };
    function s(e) {
      let t = /^\s*([\d.]+)\s*(px|pt|pc|in|cm|mm|%)?\s*$/i.exec(e ?? "");
      if (!t) return null;
      let r = Number.parseFloat(t[1]) * o[(t[2] ?? "").toLowerCase()];
      return Number.isFinite(r) && r > 0 ? r : null;
    }
    function l(e) {
      if (e.length < 1 || e.some((e) => null == e)) return null;
      let t = e.reduce((e, t) => e + t, 0);
      return t > 0 ? e.map((e) => Math.round((e / t) * 1e3) / 10) : null;
    }
    let u = (e) =>
      s(
        /(?:^|;)\s*width\s*:\s*([^;]+)/i.exec(
          e.getAttribute("style") ?? "",
        )?.[1] ?? null,
      ) ?? s(e.getAttribute("width"));
    ;
