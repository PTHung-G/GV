// Reconstructed from 2cv-l13l_j_z0.pretty.js, module 757235.
// deps: none
// exports: none


"use strict";
    var i,
      n,
      a = t.r(779148),
      s = t.r(443486),
      o = t.r(63327),
      h = t.r(675531),
      u = t.r(273012);
    function l(t) {
      return (
        ((t >>> 24) & 255) +
        ((t >>> 8) & 65280) +
        ((65280 & t) << 8) +
        ((255 & t) << 24)
      );
    }
    function d() {
      ((this.mode = 0),
        (this.last = !1),
        (this.wrap = 0),
        (this.havedict = !1),
        (this.flags = 0),
        (this.dmax = 0),
        (this.check = 0),
        (this.total = 0),
        (this.head = null),
        (this.wbits = 0),
        (this.wsize = 0),
        (this.whave = 0),
        (this.wnext = 0),
        (this.window = null),
        (this.hold = 0),
        (this.bits = 0),
        (this.length = 0),
        (this.offset = 0),
        (this.extra = 0),
        (this.lencode = null),
        (this.distcode = null),
        (this.lenbits = 0),
        (this.distbits = 0),
        (this.ncode = 0),
        (this.nlen = 0),
        (this.ndist = 0),
        (this.have = 0),
        (this.next = null),
        (this.lens = new a.Buf16(320)),
        (this.work = new a.Buf16(288)),
        (this.lendyn = null),
        (this.distdyn = null),
        (this.sane = 0),
        (this.back = 0),
        (this.was = 0));
    }
    function f(t) {
      
      return t && t.state
        ? ((e = t.state),
          (t.total_in = t.total_out = e.total = 0),
          (t.msg = ""),
          e.wrap && (t.adler = 1 & e.wrap),
          (e.mode = 1),
          (e.last = 0),
          (e.havedict = 0),
          (e.dmax = 32768),
          (e.head = null),
          (e.hold = 0),
          (e.bits = 0),
          (e.lencode = e.lendyn = new a.Buf32(852)),
          (e.distcode = e.distdyn = new a.Buf32(592)),
          (e.sane = 1),
          (e.back = -1),
          0)
        : -2;
    }
    function c(t) {
      
      return t && t.state
        ? (((e = t.state).wsize = 0), (e.whave = 0), (e.wnext = 0), f(t))
        : -2;
    }
    function p(t, e) {
      
      return t && t.state
        ? ((i = t.state),
          e < 0
            ? ((r = 0), (e = -e))
            : ((r = (e >> 4) + 1), e < 48 && (e &= 15)),
          e && (e < 8 || e > 15))
          ? -2
          : (null !== i.window && i.wbits !== e && (i.window = null),
            (i.wrap = r),
            (i.wbits = e),
            c(t))
        : -2;
    }
    function _(t, e) {
      
      return t
        ? ((t.state = i = new d()),
          (i.window = null),
          0 !== (r = p(t, e)) && (t.state = null),
          r)
        : -2;
    }
    var m = !0;
    function g(t, e, r, i) {
      var n,
        s = t.state;
      return (
        null === s.window &&
          ((s.wsize = 1 << s.wbits),
          (s.wnext = 0),
          (s.whave = 0),
          (s.window = new a.Buf8(s.wsize))),
        i >= s.wsize
          ? (a.arraySet(s.window, e, r - s.wsize, s.wsize, 0),
            (s.wnext = 0),
            (s.whave = s.wsize))
          : ((n = s.wsize - s.wnext) > i && (n = i),
            a.arraySet(s.window, e, r - i, n, s.wnext),
            (i -= n)
              ? (a.arraySet(s.window, e, r - i, i, 0),
                (s.wnext = i),
                (s.whave = s.wsize))
              : ((s.wnext += n),
                s.wnext === s.wsize && (s.wnext = 0),
                s.whave < s.wsize && (s.whave += n))),
        0
      );
    }
    ((r.inflateReset = c),
      (r.inflateReset2 = p),
      (r.inflateResetKeep = f),
      (r.inflateInit = function (t) {
        return _(t, 15);
      }),
      (r.inflateInit2 = _),
      (r.inflate = function (t, e) {
        var r,
          d,
          f,
          c,
          p,
          _,
          v,
          b,
          y,
          w,
          k,
          x,
          S,
          C,
          E,
          z,
          A,
          I,
          O,
          B,
          T,
          R,
          D,
          F,
          N = 0,
          P = new a.Buf8(4),
          U = [
            16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
          ];
        if (!t || !t.state || !t.output || (!t.input && 0 !== t.avail_in))
          return -2;
        (12 === (r = t.state).mode && (r.mode = 13),
          (p = t.next_out),
          (f = t.output),
          (v = t.avail_out),
          (c = t.next_in),
          (d = t.input),
          (_ = t.avail_in),
          (b = r.hold),
          (y = r.bits),
          (w = _),
          (k = v),
          (R = 0));
        e: for (;;)
          switch (r.mode) {
            case 1:
              if (0 === r.wrap) {
                r.mode = 13;
                break;
              }
              for (; y < 16; ) {
                if (0 === _) break e;
                (_--, (b += d[c++] << y), (y += 8));
              }
              if (2 & r.wrap && 35615 === b) {
                ((r.check = 0),
                  (P[0] = 255 & b),
                  (P[1] = (b >>> 8) & 255),
                  (r.check = o(r.check, P, 2, 0)),
                  (b = 0),
                  (y = 0),
                  (r.mode = 2));
                break;
              }
              if (
                ((r.flags = 0),
                r.head && (r.head.done = !1),
                !(1 & r.wrap) || (((255 & b) << 8) + (b >> 8)) % 31)
              ) {
                ((t.msg = "incorrect header check"), (r.mode = 30));
                break;
              }
              if ((15 & b) != 8) {
                ((t.msg = "unknown compression method"), (r.mode = 30));
                break;
              }
              if (((b >>>= 4), (y -= 4), (T = (15 & b) + 8), 0 === r.wbits))
                r.wbits = T;
              else if (T > r.wbits) {
                ((t.msg = "invalid window size"), (r.mode = 30));
                break;
              }
              ((r.dmax = 1 << T),
                (t.adler = r.check = 1),
                (r.mode = 512 & b ? 10 : 12),
                (b = 0),
                (y = 0));
              break;
            case 2:
              for (; y < 16; ) {
                if (0 === _) break e;
                (_--, (b += d[c++] << y), (y += 8));
              }
              if (((r.flags = b), (255 & r.flags) != 8)) {
                ((t.msg = "unknown compression method"), (r.mode = 30));
                break;
              }
              if (57344 & r.flags) {
                ((t.msg = "unknown header flags set"), (r.mode = 30));
                break;
              }
              (r.head && (r.head.text = (b >> 8) & 1),
                512 & r.flags &&
                  ((P[0] = 255 & b),
                  (P[1] = (b >>> 8) & 255),
                  (r.check = o(r.check, P, 2, 0))),
                (b = 0),
                (y = 0),
                (r.mode = 3));
            case 3:
              for (; y < 32; ) {
                if (0 === _) break e;
                (_--, (b += d[c++] << y), (y += 8));
              }
              (r.head && (r.head.time = b),
                512 & r.flags &&
                  ((P[0] = 255 & b),
                  (P[1] = (b >>> 8) & 255),
                  (P[2] = (b >>> 16) & 255),
                  (P[3] = (b >>> 24) & 255),
                  (r.check = o(r.check, P, 4, 0))),
                (b = 0),
                (y = 0),
                (r.mode = 4));
            case 4:
              for (; y < 16; ) {
                if (0 === _) break e;
                (_--, (b += d[c++] << y), (y += 8));
              }
              (r.head && ((r.head.xflags = 255 & b), (r.head.os = b >> 8)),
                512 & r.flags &&
                  ((P[0] = 255 & b),
                  (P[1] = (b >>> 8) & 255),
                  (r.check = o(r.check, P, 2, 0))),
                (b = 0),
                (y = 0),
                (r.mode = 5));
            case 5:
              if (1024 & r.flags) {
                for (; y < 16; ) {
                  if (0 === _) break e;
                  (_--, (b += d[c++] << y), (y += 8));
                }
                ((r.length = b),
                  r.head && (r.head.extra_len = b),
                  512 & r.flags &&
                    ((P[0] = 255 & b),
                    (P[1] = (b >>> 8) & 255),
                    (r.check = o(r.check, P, 2, 0))),
                  (b = 0),
                  (y = 0));
              } else r.head && (r.head.extra = null);
              r.mode = 6;
            case 6:
              if (
                1024 & r.flags &&
                ((x = r.length) > _ && (x = _),
                x &&
                  (r.head &&
                    ((T = r.head.extra_len - r.length),
                    r.head.extra || (r.head.extra = Array(r.head.extra_len)),
                    a.arraySet(r.head.extra, d, c, x, T)),
                  512 & r.flags && (r.check = o(r.check, d, x, c)),
                  (_ -= x),
                  (c += x),
                  (r.length -= x)),
                r.length)
              )
                break e;
              ((r.length = 0), (r.mode = 7));
            case 7:
              if (2048 & r.flags) {
                if (0 === _) break e;
                x = 0;
                do
                  ((T = d[c + x++]),
                    r.head &&
                      T &&
                      r.length < 65536 &&
                      (r.head.name += String.fromCharCode(T)));
                while (T && x < _);
                if (
                  (512 & r.flags && (r.check = o(r.check, d, x, c)),
                  (_ -= x),
                  (c += x),
                  T)
                )
                  break e;
              } else r.head && (r.head.name = null);
              ((r.length = 0), (r.mode = 8));
            case 8:
              if (4096 & r.flags) {
                if (0 === _) break e;
                x = 0;
                do
                  ((T = d[c + x++]),
                    r.head &&
                      T &&
                      r.length < 65536 &&
                      (r.head.comment += String.fromCharCode(T)));
                while (T && x < _);
                if (
                  (512 & r.flags && (r.check = o(r.check, d, x, c)),
                  (_ -= x),
                  (c += x),
                  T)
                )
                  break e;
              } else r.head && (r.head.comment = null);
              r.mode = 9;
            case 9:
              if (512 & r.flags) {
                for (; y < 16; ) {
                  if (0 === _) break e;
                  (_--, (b += d[c++] << y), (y += 8));
                }
                if (b !== (65535 & r.check)) {
                  ((t.msg = "header crc mismatch"), (r.mode = 30));
                  break;
                }
                ((b = 0), (y = 0));
              }
              (r.head &&
                ((r.head.hcrc = (r.flags >> 9) & 1), (r.head.done = !0)),
                (t.adler = r.check = 0),
                (r.mode = 12));
              break;
            case 10:
              for (; y < 32; ) {
                if (0 === _) break e;
                (_--, (b += d[c++] << y), (y += 8));
              }
              ((t.adler = r.check = l(b)), (b = 0), (y = 0), (r.mode = 11));
            case 11:
              if (0 === r.havedict)
                return (
                  (t.next_out = p),
                  (t.avail_out = v),
                  (t.next_in = c),
                  (t.avail_in = _),
                  (r.hold = b),
                  (r.bits = y),
                  2
                );
              ((t.adler = r.check = 1), (r.mode = 12));
            case 12:
              if (5 === e || 6 === e) break e;
            case 13:
              if (r.last) {
                ((b >>>= 7 & y), (y -= 7 & y), (r.mode = 27));
                break;
              }
              for (; y < 3; ) {
                if (0 === _) break e;
                (_--, (b += d[c++] << y), (y += 8));
              }
              switch (((r.last = 1 & b), (y -= 1), 3 & (b >>>= 1))) {
                case 0:
                  r.mode = 14;
                  break;
                case 1:
                  if (
                    (!(function (t) {
                      if (m) {
                        
                        for (
                          i = new a.Buf32(512), n = new a.Buf32(32), e = 0;
                          e < 144;

                        )
                          t.lens[e++] = 8;
                        for (; e < 256; ) t.lens[e++] = 9;
                        for (; e < 280; ) t.lens[e++] = 7;
                        for (; e < 288; ) t.lens[e++] = 8;
                        for (
                          u(1, t.lens, 0, 288, i, 0, t.work, { bits: 9 }),
                            e = 0;
                          e < 32;

                        )
                          t.lens[e++] = 5;
                        (u(2, t.lens, 0, 32, n, 0, t.work, { bits: 5 }),
                          (m = !1));
                      }
                      ((t.lencode = i),
                        (t.lenbits = 9),
                        (t.distcode = n),
                        (t.distbits = 5));
                    })(r),
                    (r.mode = 20),
                    6 === e)
                  ) {
                    ((b >>>= 2), (y -= 2));
                    break e;
                  }
                  break;
                case 2:
                  r.mode = 17;
                  break;
                case 3:
                  ((t.msg = "invalid block type"), (r.mode = 30));
              }
              ((b >>>= 2), (y -= 2));
              break;
            case 14:
              for (b >>>= 7 & y, y -= 7 & y; y < 32; ) {
                if (0 === _) break e;
                (_--, (b += d[c++] << y), (y += 8));
              }
              if ((65535 & b) != ((b >>> 16) ^ 65535)) {
                ((t.msg = "invalid stored block lengths"), (r.mode = 30));
                break;
              }
              if (
                ((r.length = 65535 & b),
                (b = 0),
                (y = 0),
                (r.mode = 15),
                6 === e)
              )
                break e;
            case 15:
              r.mode = 16;
            case 16:
              if ((x = r.length)) {
                if ((x > _ && (x = _), x > v && (x = v), 0 === x)) break e;
                (a.arraySet(f, d, c, x, p),
                  (_ -= x),
                  (c += x),
                  (v -= x),
                  (p += x),
                  (r.length -= x));
                break;
              }
              r.mode = 12;
              break;
            case 17:
              for (; y < 14; ) {
                if (0 === _) break e;
                (_--, (b += d[c++] << y), (y += 8));
              }
              if (
                ((r.nlen = (31 & b) + 257),
                (y -= 5),
                (r.ndist = (31 & (b >>>= 5)) + 1),
                (y -= 5),
                (r.ncode = (15 & (b >>>= 5)) + 4),
                (b >>>= 4),
                (y -= 4),
                r.nlen > 286 || r.ndist > 30)
              ) {
                ((t.msg = "too many length or distance symbols"),
                  (r.mode = 30));
                break;
              }
              ((r.have = 0), (r.mode = 18));
            case 18:
              for (; r.have < r.ncode; ) {
                for (; y < 3; ) {
                  if (0 === _) break e;
                  (_--, (b += d[c++] << y), (y += 8));
                }
                ((r.lens[U[r.have++]] = 7 & b), (b >>>= 3), (y -= 3));
              }
              for (; r.have < 19; ) r.lens[U[r.have++]] = 0;
              if (
                ((r.lencode = r.lendyn),
                (r.lenbits = 7),
                (D = { bits: r.lenbits }),
                (R = u(0, r.lens, 0, 19, r.lencode, 0, r.work, D)),
                (r.lenbits = D.bits),
                R)
              ) {
                ((t.msg = "invalid code lengths set"), (r.mode = 30));
                break;
              }
              ((r.have = 0), (r.mode = 19));
            case 19:
              for (; r.have < r.nlen + r.ndist; ) {
                for (
                  ;
                  (E = (N = r.lencode[b & ((1 << r.lenbits) - 1)]) >>> 24),
                    (z = (N >>> 16) & 255),
                    (A = 65535 & N),
                    !(E <= y);

                ) {
                  if (0 === _) break e;
                  (_--, (b += d[c++] << y), (y += 8));
                }
                if (A < 16) ((b >>>= E), (y -= E), (r.lens[r.have++] = A));
                else {
                  if (16 === A) {
                    for (F = E + 2; y < F; ) {
                      if (0 === _) break e;
                      (_--, (b += d[c++] << y), (y += 8));
                    }
                    if (((b >>>= E), (y -= E), 0 === r.have)) {
                      ((t.msg = "invalid bit length repeat"), (r.mode = 30));
                      break;
                    }
                    ((T = r.lens[r.have - 1]),
                      (x = 3 + (3 & b)),
                      (b >>>= 2),
                      (y -= 2));
                  } else if (17 === A) {
                    for (F = E + 3; y < F; ) {
                      if (0 === _) break e;
                      (_--, (b += d[c++] << y), (y += 8));
                    }
                    ((b >>>= E),
                      (y -= E),
                      (T = 0),
                      (x = 3 + (7 & b)),
                      (b >>>= 3),
                      (y -= 3));
                  } else {
                    for (F = E + 7; y < F; ) {
                      if (0 === _) break e;
                      (_--, (b += d[c++] << y), (y += 8));
                    }
                    ((b >>>= E),
                      (y -= E),
                      (T = 0),
                      (x = 11 + (127 & b)),
                      (b >>>= 7),
                      (y -= 7));
                  }
                  if (r.have + x > r.nlen + r.ndist) {
                    ((t.msg = "invalid bit length repeat"), (r.mode = 30));
                    break;
                  }
                  for (; x--; ) r.lens[r.have++] = T;
                }
              }
              if (30 === r.mode) break;
              if (0 === r.lens[256]) {
                ((t.msg = "invalid code -- missing end-of-block"),
                  (r.mode = 30));
                break;
              }
              if (
                ((r.lenbits = 9),
                (D = { bits: r.lenbits }),
                (R = u(1, r.lens, 0, r.nlen, r.lencode, 0, r.work, D)),
                (r.lenbits = D.bits),
                R)
              ) {
                ((t.msg = "invalid literal/lengths set"), (r.mode = 30));
                break;
              }
              if (
                ((r.distbits = 6),
                (r.distcode = r.distdyn),
                (D = { bits: r.distbits }),
                (R = u(2, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, D)),
                (r.distbits = D.bits),
                R)
              ) {
                ((t.msg = "invalid distances set"), (r.mode = 30));
                break;
              }
              if (((r.mode = 20), 6 === e)) break e;
            case 20:
              r.mode = 21;
            case 21:
              if (_ >= 6 && v >= 258) {
                ((t.next_out = p),
                  (t.avail_out = v),
                  (t.next_in = c),
                  (t.avail_in = _),
                  (r.hold = b),
                  (r.bits = y),
                  h(t, k),
                  (p = t.next_out),
                  (f = t.output),
                  (v = t.avail_out),
                  (c = t.next_in),
                  (d = t.input),
                  (_ = t.avail_in),
                  (b = r.hold),
                  (y = r.bits),
                  12 === r.mode && (r.back = -1));
                break;
              }
              for (
                r.back = 0;
                (E = (N = r.lencode[b & ((1 << r.lenbits) - 1)]) >>> 24),
                  (z = (N >>> 16) & 255),
                  (A = 65535 & N),
                  !(E <= y);

              ) {
                if (0 === _) break e;
                (_--, (b += d[c++] << y), (y += 8));
              }
              if (z && (240 & z) == 0) {
                for (
                  I = E, O = z, B = A;
                  (E =
                    (N = r.lencode[B + ((b & ((1 << (I + O)) - 1)) >> I)]) >>>
                    24),
                    (z = (N >>> 16) & 255),
                    (A = 65535 & N),
                    !(I + E <= y);

                ) {
                  if (0 === _) break e;
                  (_--, (b += d[c++] << y), (y += 8));
                }
                ((b >>>= I), (y -= I), (r.back += I));
              }
              if (
                ((b >>>= E), (y -= E), (r.back += E), (r.length = A), 0 === z)
              ) {
                r.mode = 26;
                break;
              }
              if (32 & z) {
                ((r.back = -1), (r.mode = 12));
                break;
              }
              if (64 & z) {
                ((t.msg = "invalid literal/length code"), (r.mode = 30));
                break;
              }
              ((r.extra = 15 & z), (r.mode = 22));
            case 22:
              if (r.extra) {
                for (F = r.extra; y < F; ) {
                  if (0 === _) break e;
                  (_--, (b += d[c++] << y), (y += 8));
                }
                ((r.length += b & ((1 << r.extra) - 1)),
                  (b >>>= r.extra),
                  (y -= r.extra),
                  (r.back += r.extra));
              }
              ((r.was = r.length), (r.mode = 23));
            case 23:
              for (
                ;
                (E = (N = r.distcode[b & ((1 << r.distbits) - 1)]) >>> 24),
                  (z = (N >>> 16) & 255),
                  (A = 65535 & N),
                  !(E <= y);

              ) {
                if (0 === _) break e;
                (_--, (b += d[c++] << y), (y += 8));
              }
              if ((240 & z) == 0) {
                for (
                  I = E, O = z, B = A;
                  (E =
                    (N = r.distcode[B + ((b & ((1 << (I + O)) - 1)) >> I)]) >>>
                    24),
                    (z = (N >>> 16) & 255),
                    (A = 65535 & N),
                    !(I + E <= y);

                ) {
                  if (0 === _) break e;
                  (_--, (b += d[c++] << y), (y += 8));
                }
                ((b >>>= I), (y -= I), (r.back += I));
              }
              if (((b >>>= E), (y -= E), (r.back += E), 64 & z)) {
                ((t.msg = "invalid distance code"), (r.mode = 30));
                break;
              }
              ((r.offset = A), (r.extra = 15 & z), (r.mode = 24));
            case 24:
              if (r.extra) {
                for (F = r.extra; y < F; ) {
                  if (0 === _) break e;
                  (_--, (b += d[c++] << y), (y += 8));
                }
                ((r.offset += b & ((1 << r.extra) - 1)),
                  (b >>>= r.extra),
                  (y -= r.extra),
                  (r.back += r.extra));
              }
              if (r.offset > r.dmax) {
                ((t.msg = "invalid distance too far back"), (r.mode = 30));
                break;
              }
              r.mode = 25;
            case 25:
              if (0 === v) break e;
              if (((x = k - v), r.offset > x)) {
                if ((x = r.offset - x) > r.whave && r.sane) {
                  ((t.msg = "invalid distance too far back"), (r.mode = 30));
                  break;
                }
                (x > r.wnext
                  ? ((x -= r.wnext), (S = r.wsize - x))
                  : (S = r.wnext - x),
                  x > r.length && (x = r.length),
                  (C = r.window));
              } else ((C = f), (S = p - r.offset), (x = r.length));
              (x > v && (x = v), (v -= x), (r.length -= x));
              do f[p++] = C[S++];
              while (--x);
              0 === r.length && (r.mode = 21);
              break;
            case 26:
              if (0 === v) break e;
              ((f[p++] = r.length), v--, (r.mode = 21));
              break;
            case 27:
              if (r.wrap) {
                for (; y < 32; ) {
                  if (0 === _) break e;
                  (_--, (b |= d[c++] << y), (y += 8));
                }
                if (
                  ((k -= v),
                  (t.total_out += k),
                  (r.total += k),
                  k &&
                    (t.adler = r.check =
                      r.flags
                        ? o(r.check, f, k, p - k)
                        : s(r.check, f, k, p - k)),
                  (k = v),
                  (r.flags ? b : l(b)) !== r.check)
                ) {
                  ((t.msg = "incorrect data check"), (r.mode = 30));
                  break;
                }
                ((b = 0), (y = 0));
              }
              r.mode = 28;
            case 28:
              if (r.wrap && r.flags) {
                for (; y < 32; ) {
                  if (0 === _) break e;
                  (_--, (b += d[c++] << y), (y += 8));
                }
                if (b !== (0 | r.total)) {
                  ((t.msg = "incorrect length check"), (r.mode = 30));
                  break;
                }
                ((b = 0), (y = 0));
              }
              r.mode = 29;
            case 29:
              R = 1;
              break e;
            case 30:
              R = -3;
              break e;
            case 31:
              return -4;
            default:
              return -2;
          }
        return (
          (t.next_out = p),
          (t.avail_out = v),
          (t.next_in = c),
          (t.avail_in = _),
          (r.hold = b),
          (r.bits = y),
          (r.wsize ||
            (k !== t.avail_out && r.mode < 30 && (r.mode < 27 || 4 !== e))) &&
            g(t, t.output, t.next_out, k - t.avail_out),
          (w -= t.avail_in),
          (k -= t.avail_out),
          (t.total_in += w),
          (t.total_out += k),
          (r.total += k),
          r.wrap &&
            k &&
            (t.adler = r.check =
              r.flags
                ? o(r.check, f, k, t.next_out - k)
                : s(r.check, f, k, t.next_out - k)),
          (t.data_type =
            r.bits +
            64 * !!r.last +
            128 * (12 === r.mode) +
            256 * (20 === r.mode || 15 === r.mode)),
          ((0 === w && 0 === k) || 4 === e) && 0 === R && (R = -5),
          R
        );
      }),
      (r.inflateEnd = function (t) {
        if (!t || !t.state) return -2;
        var e = t.state;
        return (e.window && (e.window = null), (t.state = null), 0);
      }),
      (r.inflateGetHeader = function (t, e) {
        
        return t && t.state && (2 & (r = t.state).wrap) != 0
          ? ((r.head = e), (e.done = !1), 0)
          : -2;
      }),
      (r.inflateSetDictionary = function (t, e) {
        var r,
          i = e.length;
        return t && t.state && (0 === (r = t.state).wrap || 11 === r.mode)
          ? 11 === r.mode && s(1, e, i, 0) !== r.check
            ? -3
            : g(t, e, i, i)
              ? ((r.mode = 31), -4)
              : ((r.havedict = 1), 0)
          : -2;
      }),
      (r.inflateInfo = "pako inflate (from Nodeca project)"));
