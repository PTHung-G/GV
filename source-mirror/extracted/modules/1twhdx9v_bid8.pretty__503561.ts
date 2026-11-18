// Reconstructed from 1twhdx9v_bid8.pretty.js, module 503561.
// deps: none
// exports: BASE_FONT_PX, BASE_LINE_HEIGHT, CELL_PADDING_X_PX, CELL_PADDING_Y_PX, CONTENT_HEIGHT_PX, CONTENT_WIDTH_PX, CONTENT_WIDTH_TWIP, MARGIN_LEFT_PX, MARGIN_RIGHT_PX, MARGIN_TOP_PX, MATH_FONT_SCALE, PAGE_HEIGHT_PX, PAGE_MARGIN_TWIP, PAGE_MM, PAGE_WIDTH_PX, PX_PER_MM, TABLE_SPACE_AFTER_PX, TEXT_LINE_PX, fontHalfPoints, lineAuto, mmToTwip, pxToTwip, quantizedFontPx
export { 15 as "BASE_FONT_PX" };
export { 1.87 as "BASE_LINE_HEIGHT" };
export { 8 as "CELL_PADDING_X_PX" };
export { 4 as "CELL_PADDING_Y_PX" };
export { o - s - l as "CONTENT_HEIGHT_PX" };
export { a - u - c as "CONTENT_WIDTH_PX" };
export { d as "CONTENT_WIDTH_TWIP" };
export { u as "MARGIN_LEFT_PX" };
export { c as "MARGIN_RIGHT_PX" };
export { s as "MARGIN_TOP_PX" };
export { 1.05 as "MATH_FONT_SCALE" };
export { o as "PAGE_HEIGHT_PX" };
export { f as "PAGE_MARGIN_TWIP" };
export { i as "PAGE_MM" };
export { a as "PAGE_WIDTH_PX" };
export { t as "PX_PER_MM" };
export { 8 as "TABLE_SPACE_AFTER_PX" };
export { m as "TEXT_LINE_PX" };
export { p as "fontHalfPoints" };
export { (e) => Math.max(20, Math.round((240 * e) / 1.15)) as "lineAuto" };
export { n as "mmToTwip" };
export { (e) => Math.round(15 * e) as "pxToTwip" };
export { h as "quantizedFontPx" };

"use strict";
    let t = 96 / 25.4,
      r = 1440 / 25.4,
      n = (e) => Math.round(e * r),
      i = {
        width: 210,
        height: 297,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 15,
      },
      a = i.width * t,
      o = i.height * t,
      s = i.marginTop * t,
      l = i.marginBottom * t,
      u = i.marginLeft * t,
      c = i.marginRight * t,
      f = {
        top: n(i.marginTop),
        bottom: n(i.marginBottom),
        left: n(i.marginLeft),
        right: n(i.marginRight),
      },
      d = n(i.width - i.marginLeft - i.marginRight),
      p = (e) => Math.max(2, Math.round(1.5 * e)),
      h = (e) => p(e) / 1.5,
      m = Math.max(15, Math.round(1.87 * h(15) * 15)) / 15;
    ;
