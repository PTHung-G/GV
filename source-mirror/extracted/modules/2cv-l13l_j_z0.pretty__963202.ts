// Reconstructed from 2cv-l13l_j_z0.pretty.js, module 963202.
// deps: none
// exports: none


"use strict";
    var i = t.r(779148),
      n = !0,
      a = !0;
    try {
      String.fromCharCode.apply(null, [0]);
    } catch (t) {
      n = !1;
    }
    try {
      String.fromCharCode.apply(null, new Uint8Array(1));
    } catch (t) {
      a = !1;
    }
    for (var s = new i.Buf8(256), o = 0; o < 256; o++)
      s[o] =
        o >= 252
          ? 6
          : o >= 248
            ? 5
            : o >= 240
              ? 4
              : o >= 224
                ? 3
                : o >= 192
                  ? 2
                  : 1;
    function h(t, e) {
      if (e < 65534 && ((t.subarray && a) || (!t.subarray && n)))
        return String.fromCharCode.apply(null, i.shrinkBuf(t, e));
      for (var r = "", s = 0; s < e; s++) r += String.fromCharCode(t[s]);
      return r;
    }
    ((s[254] = s[254] = 1),
      (r.string2buf = function (t) {
        var e,
          r,
          n,
          a,
          s,
          o = t.length,
          h = 0;
        for (a = 0; a < o; a++)
          ((64512 & (r = t.charCodeAt(a))) == 55296 &&
            a + 1 < o &&
            (64512 & (n = t.charCodeAt(a + 1))) == 56320 &&
            ((r = 65536 + ((r - 55296) << 10) + (n - 56320)), a++),
            (h += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4));
        for (e = new i.Buf8(h), s = 0, a = 0; s < h; a++)
          ((64512 & (r = t.charCodeAt(a))) == 55296 &&
            a + 1 < o &&
            (64512 & (n = t.charCodeAt(a + 1))) == 56320 &&
            ((r = 65536 + ((r - 55296) << 10) + (n - 56320)), a++),
            r < 128
              ? (e[s++] = r)
              : (r < 2048
                  ? (e[s++] = 192 | (r >>> 6))
                  : (r < 65536
                      ? (e[s++] = 224 | (r >>> 12))
                      : ((e[s++] = 240 | (r >>> 18)),
                        (e[s++] = 128 | ((r >>> 12) & 63))),
                    (e[s++] = 128 | ((r >>> 6) & 63))),
                (e[s++] = 128 | (63 & r))));
        return e;
      }),
      (r.buf2binstring = function (t) {
        return h(t, t.length);
      }),
      (r.binstring2buf = function (t) {
        for (var e = new i.Buf8(t.length), r = 0, n = e.length; r < n; r++)
          e[r] = t.charCodeAt(r);
        return e;
      }),
      (r.buf2string = function (t, e) {
        var r,
          i,
          n,
          a,
          o = e || t.length,
          u = Array(2 * o);
        for (i = 0, r = 0; r < o; ) {
          if ((n = t[r++]) < 128) {
            u[i++] = n;
            continue;
          }
          if ((a = s[n]) > 4) {
            ((u[i++] = 65533), (r += a - 1));
            continue;
          }
          for (n &= 2 === a ? 31 : 3 === a ? 15 : 7; a > 1 && r < o; )
            ((n = (n << 6) | (63 & t[r++])), a--);
          if (a > 1) {
            u[i++] = 65533;
            continue;
          }
          n < 65536
            ? (u[i++] = n)
            : ((n -= 65536),
              (u[i++] = 55296 | ((n >> 10) & 1023)),
              (u[i++] = 56320 | (1023 & n)));
        }
        return h(u, i);
      }),
      (r.utf8border = function (t, e) {
        
        for (
          (e = e || t.length) > t.length && (e = t.length), r = e - 1;
          r >= 0 && (192 & t[r]) == 128;

        )
          r--;
        return r < 0 || 0 === r ? e : r + s[t[r]] > e ? r : e;
      }));
