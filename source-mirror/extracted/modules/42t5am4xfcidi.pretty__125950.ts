// Reconstructed from 42t5am4xfcidi.pretty.js, module 125950.
// deps: none
// exports: none


function n(t) {
      if (("number" == typeof t && (t = t.toString()), "string" != typeof t))
        throw Error("Color should be defined as hex string");
      let e = t.slice().replace("#", "").split("");
      if (e.length < 3 || 5 === e.length || e.length > 8)
        throw Error("Invalid hex color: " + t);
      ((3 === e.length || 4 === e.length) &&
        (e = Array.prototype.concat.apply(
          [],
          e.map(function (t) {
            return [t, t];
          }),
        )),
        6 === e.length && e.push("F", "F"));
      let r = parseInt(e.join(""), 16);
      return {
        r: (r >> 24) & 255,
        g: (r >> 16) & 255,
        b: (r >> 8) & 255,
        a: 255 & r,
        hex: "#" + e.slice(0, 6).join(""),
      };
    }
    ((r.getOptions = function (t) {
      (t || (t = {}), t.color || (t.color = {}));
      let e =
          void 0 === t.margin || null === t.margin || t.margin < 0
            ? 4
            : t.margin,
        r = t.width && t.width >= 21 ? t.width : void 0,
        o = t.scale || 4;
      return {
        width: r,
        scale: r ? 4 : o,
        margin: e,
        color: {
          dark: n(t.color.dark || "#000000ff"),
          light: n(t.color.light || "#ffffffff"),
        },
        type: t.type,
        rendererOpts: t.rendererOpts || {},
      };
    }),
      (r.getScale = function (t, e) {
        return e.width && e.width >= t + 2 * e.margin
          ? e.width / (t + 2 * e.margin)
          : e.scale;
      }),
      (r.getImageWidth = function (t, e) {
        let n = r.getScale(t, e);
        return Math.floor((t + 2 * e.margin) * n);
      }),
      (r.qrToImageData = function (t, e, n) {
        let o = e.modules.size,
          i = e.modules.data,
          a = r.getScale(o, n),
          s = Math.floor((o + 2 * n.margin) * a),
          u = n.margin * a,
          l = [n.color.light, n.color.dark];
        for (let e = 0; e < s; e++)
          for (let r = 0; r < s; r++) {
            let h = (e * s + r) * 4,
              f = n.color.light;
            (e >= u &&
              r >= u &&
              e < s - u &&
              r < s - u &&
              (f =
                l[+!!i[Math.floor((e - u) / a) * o + Math.floor((r - u) / a)]]),
              (t[h++] = f.r),
              (t[h++] = f.g),
              (t[h++] = f.b),
              (t[h] = f.a));
          }
      }));
