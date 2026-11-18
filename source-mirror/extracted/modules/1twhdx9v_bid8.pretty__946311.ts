// Reconstructed from 1twhdx9v_bid8.pretty.js, module 946311.
// deps: none
// exports: CHART_TYPES, MAX_CATEGORIES, MAX_SERIES, defaultChartData, formatNumber, niceScale, parseChartData, plottedValues
export { [ { value: "bar", label: "Cột" }, { value: "line", label: "Đường" }, { value: "area", label: "Miền" }, { value: "pie", label: "Tròn" }, { value: "combo", label: "Kết hợp cột – đường" }, { value: "histogram", label: "Tần số ghép nhóm" }, ] as "CHART_TYPES" };
export { 40 as "MAX_CATEGORIES" };
export { 8 as "MAX_SERIES" };
export { function () { return { type: "bar", width: 420, height: 270, categories: ["2010", "2015", "2020"], series: [{ name: "Dãy 1", values: [12, 18, 25] }], unit: "", bottomCaption: "", }; } as "defaultChartData" };
export { function (e, t = 2) { let r = Number(e.toFixed(t)), [n, i] = Math.abs(r).toString().split("."); return ( (r < 0 ? "−" : "") + (n.length > 4 ? n.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : n) + (i ? "," + i : "") ); } as "formatNumber" };
export { function (e, t, r = {}) { let n = r.min ?? Math.min(0, e), i = r.max ?? Math.max(0, t); i <= n && (i = n + 1); let a = r.step; if (!("number" == typeof a && a > 0 && (i - n) / a <= 20)) { let e = (i - n) / 5, t = 10 ** Math.floor(Math.log10(e)), r = e / t; a = (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * t; } return ( void 0 === r.min && (n = Math.floor(n / a + 1e-9) * a), void 0 === r.max && (i = Math.ceil(i / a - 1e-9) * a), { min: n, max: i, step: a } ); } as "niceScale" };
export { function (e) { let a = e; if ("string" == typeof e) try { a = JSON.parse(e || "{}"); } catch { throw Error("Dữ liệu biểu đồ không phải JSON hợp lệ."); } if (!a || "object" != typeof a || Array.isArray(a)) throw Error("Dữ liệu biểu đồ không hợp lệ."); let o = a, s = t[n(o.type).toLowerCase()] ?? "bar", l = (Array.isArray(o.categories) ? o.categories : []) .slice(0, 40) .map((e) => n(e, 60)), u = Array.isArray(o.series) ? o.series : Array.isArray(o.values) ? [{ name: "", values: o.values }] : [], c = []; for (let e of u.slice(0, 8)) { if (!e || "object" != typeof e) continue; let t = e; if (!Array.isArray(t.values)) continue; let a = l.map((e, n) => r(t.values[n])); if (a.every((e) => null === e)) continue; let o = { name: n(t.name, 60), values: a }; ("line" === t.as || "bar" === t.as ? (o.as = t.as) : ("line" === t.type || "bar" === t.type) && (o.as = t.type), "right" === t.axis && (o.axis = "right")); let s = r(t.radius); (null !== s && (o.radius = i(s, 0.5, 1)), c.push(o)); } if (!l.length || !c.length) throw Error( "Biểu đồ chưa có số liệu: cần categories và ít nhất một dãy values.", ); if ( "pie" === s && c.some((e) => e.values.some((e) => null !== e && e < 0)) ) throw Error("Biểu đồ tròn không nhận giá trị âm."); let f = c.reduce( (e, t) => e + t.values.filter((e) => null !== e).length, 0, ), d = (e) => r(o[e]) ?? void 0, p = "left" === o.align || "right" === o.align ? o.align : "center"; return { type: s, width: i( Math.round( r(o.width) ?? ("pie" === s && 1 === c.length ? 360 : 440), ), 200, 640, ), height: i(Math.round(r(o.height) ?? 280), 160, 520), categories: l, series: c, stacked: !0 === o.stacked || "area" === s, percent: !0 === o.percent, showValues: "boolean" == typeof o.showValues ? o.showValues : f <= 24, showLegend: "boolean" == typeof o.showLegend ? o.showLegend : "pie" === s || c.length > 1, showGrid: !1 !== o.showGrid, unit: n(o.unit, 40), unitRight: n(o.unitRight, 40), xLabel: n(o.xLabel, 40), yMin: d("yMin"), yMax: d("yMax"), yStep: d("yStep"), yRightMin: d("yRightMin"), yRightMax: d("yRightMax"), yRightStep: d("yRightStep"), caption: n(o.caption, 300), bottomCaption: n(o.bottomCaption, 300), alt: n(o.alt, 300), align: p, }; } as "parseChartData" };
export { function (e) { if (!(e.percent && e.stacked) || "pie" === e.type) return e.series.map((e) => e.values); let t = e.categories.map((t, r) => e.series.reduce((e, t) => e + Math.abs(t.values[r] ?? 0), 0), ); return e.series.map((e) => e.values.map((e, r) => null !== e && t[r] ? (Math.abs(e) / t[r]) * 100 : null, ), ); } as "plottedValues" };

"use strict";
    let t = {
      bar: "bar",
      column: "bar",
      cot: "bar",
      line: "line",
      duong: "line",
      area: "area",
      mien: "area",
      pie: "pie",
      tron: "pie",
      circle: "pie",
      combo: "combo",
      mixed: "combo",
      histogram: "histogram",
    };
    function r(e) {
      let t =
        "string" == typeof e
          ? Number(e.trim().replace(/\s/g, "").replace(",", "."))
          : e;
      return "number" == typeof t && Number.isFinite(t) && 1e12 >= Math.abs(t)
        ? t
        : null;
    }
    function n(e, t = 120) {
      return "string" == typeof e || "number" == typeof e
        ? String(e).replace(/\s+/g, " ").trim().slice(0, t)
        : "";
    }
    let i = (e, t, r) => Math.min(r, Math.max(t, e));
    ;
