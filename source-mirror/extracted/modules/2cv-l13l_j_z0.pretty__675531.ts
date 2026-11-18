// Reconstructed from 2cv-l13l_j_z0.pretty.js, module 675531.
// deps: none
// exports: none


"use strict";
    e.exports = function (t, e) {
      
      ((r = t.state),
        (i = t.next_in),
        (C = t.input),
        (n = i + (t.avail_in - 5)),
        (a = t.next_out),
        (E = t.output),
        (s = a - (e - t.avail_out)),
        (o = a + (t.avail_out - 257)),
        (h = r.dmax),
        (u = r.wsize),
        (l = r.whave),
        (d = r.wnext),
        (f = r.window),
        (c = r.hold),
        (p = r.bits),
        (_ = r.lencode),
        (m = r.distcode),
        (g = (1 << r.lenbits) - 1),
        (v = (1 << r.distbits) - 1));
      t: do
        for (
          p < 15 &&
            ((c += C[i++] << p), (p += 8), (c += C[i++] << p), (p += 8)),
            b = _[c & g];
          ;

        ) {
          if (((c >>>= y = b >>> 24), (p -= y), 0 == (y = (b >>> 16) & 255)))
            E[a++] = 65535 & b;
          else if (16 & y)
            for (
              w = 65535 & b,
                (y &= 15) &&
                  (p < y && ((c += C[i++] << p), (p += 8)),
                  (w += c & ((1 << y) - 1)),
                  (c >>>= y),
                  (p -= y)),
                p < 15 &&
                  ((c += C[i++] << p), (p += 8), (c += C[i++] << p), (p += 8)),
                b = m[c & v];
              ;

            ) {
              if (
                ((c >>>= y = b >>> 24), (p -= y), 16 & (y = (b >>> 16) & 255))
              ) {
                if (
                  ((k = 65535 & b),
                  p < (y &= 15) &&
                    ((c += C[i++] << p),
                    (p += 8) < y && ((c += C[i++] << p), (p += 8))),
                  (k += c & ((1 << y) - 1)) > h)
                ) {
                  ((t.msg = "invalid distance too far back"), (r.mode = 30));
                  break t;
                }
                if (((c >>>= y), (p -= y), k > (y = a - s))) {
                  if ((y = k - y) > l && r.sane) {
                    ((t.msg = "invalid distance too far back"), (r.mode = 30));
                    break t;
                  }
                  if (((x = 0), (S = f), 0 === d)) {
                    if (((x += u - y), y < w)) {
                      w -= y;
                      do E[a++] = f[x++];
                      while (--y);
                      ((x = a - k), (S = E));
                    }
                  } else if (d < y) {
                    if (((x += u + d - y), (y -= d) < w)) {
                      w -= y;
                      do E[a++] = f[x++];
                      while (--y);
                      if (((x = 0), d < w)) {
                        w -= y = d;
                        do E[a++] = f[x++];
                        while (--y);
                        ((x = a - k), (S = E));
                      }
                    }
                  } else if (((x += d - y), y < w)) {
                    w -= y;
                    do E[a++] = f[x++];
                    while (--y);
                    ((x = a - k), (S = E));
                  }
                  for (; w > 2; )
                    ((E[a++] = S[x++]),
                      (E[a++] = S[x++]),
                      (E[a++] = S[x++]),
                      (w -= 3));
                  w && ((E[a++] = S[x++]), w > 1 && (E[a++] = S[x++]));
                } else {
                  x = a - k;
                  do
                    ((E[a++] = E[x++]),
                      (E[a++] = E[x++]),
                      (E[a++] = E[x++]),
                      (w -= 3));
                  while (w > 2);
                  w && ((E[a++] = E[x++]), w > 1 && (E[a++] = E[x++]));
                }
              } else if ((64 & y) == 0) {
                b = m[(65535 & b) + (c & ((1 << y) - 1))];
                continue;
              } else {
                ((t.msg = "invalid distance code"), (r.mode = 30));
                break t;
              }
              break;
            }
          else if ((64 & y) == 0) {
            b = _[(65535 & b) + (c & ((1 << y) - 1))];
            continue;
          } else if (32 & y) {
            r.mode = 12;
            break t;
          } else {
            ((t.msg = "invalid literal/length code"), (r.mode = 30));
            break t;
          }
          break;
        }
      while (i < n && a < o);
      ((i -= w = p >> 3),
        (p -= w << 3),
        (c &= (1 << p) - 1),
        (t.next_in = i),
        (t.next_out = a),
        (t.avail_in = i < n ? 5 + (n - i) : 5 - (i - n)),
        (t.avail_out = a < o ? 257 + (o - a) : 257 - (a - o)),
        (r.hold = c),
        (r.bits = p));
    };
