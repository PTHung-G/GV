// Reconstructed from 42t5am4xfcidi.pretty.js, module 310891.
// deps: none
// exports: none


let n = t.r(125950);
    function o(t, e) {
      let r = t.a / 255,
        n = e + '="' + t.hex + '"';
      return r < 1
        ? n + " " + e + '-opacity="' + r.toFixed(2).slice(1) + '"'
        : n;
    }
    function i(t, e, r) {
      let n = t + e;
      return (void 0 !== r && (n += " " + r), n);
    }
    r.render = function (t, e, r) {
      let a = n.getOptions(e),
        s = t.modules.size,
        u = t.modules.data,
        l = s + 2 * a.margin,
        h = a.color.light.a
          ? "<path " +
            o(a.color.light, "fill") +
            ' d="M0 0h' +
            l +
            "v" +
            l +
            'H0z"/>'
          : "",
        f =
          "<path " +
          o(a.color.dark, "stroke") +
          ' d="' +
          (function (t, e, r) {
            let n = "",
              o = 0,
              a = !1,
              s = 0;
            for (let u = 0; u < t.length; u++) {
              let l = Math.floor(u % e),
                h = Math.floor(u / e);
              (l || a || (a = !0),
                t[u]
                  ? (s++,
                    (u > 0 && l > 0 && t[u - 1]) ||
                      ((n += a ? i("M", l + r, 0.5 + h + r) : i("m", o, 0)),
                      (o = 0),
                      (a = !1)),
                    (l + 1 < e && t[u + 1]) || ((n += i("h", s)), (s = 0)))
                  : o++);
            }
            return n;
          })(u, s, a.margin) +
          '"/>',
        c =
          '<svg xmlns="http://www.w3.org/2000/svg" ' +
          (a.width ? 'width="' + a.width + '" height="' + a.width + '" ' : "") +
          ('viewBox="0 0 ' + l + " ") +
          l +
          '" shape-rendering="crispEdges">' +
          h +
          f +
          "</svg>\n";
      return ("function" == typeof r && r(null, c), c);
    };
