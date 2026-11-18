// Reconstructed from 42t5am4xfcidi.pretty.js, module 30671.
// deps: none
// exports: none


let n = t.r(87201),
      o = t.r(473133),
      i = t.r(173666),
      a = t.r(811421),
      s = t.r(720637),
      u = t.r(814002),
      l = t.r(237692),
      h = t.r(848125),
      f = t.r(962458),
      c = t.r(93547),
      g = t.r(857655),
      d = t.r(150882),
      p = t.r(297930);
    function m(t, e, r) {
      let n,
        o,
        i = t.size,
        a = g.getEncodedBits(e, r);
      for (n = 0; n < 15; n++)
        ((o = ((a >> n) & 1) == 1),
          n < 6
            ? t.set(n, 8, o, !0)
            : n < 8
              ? t.set(n + 1, 8, o, !0)
              : t.set(i - 15 + n, 8, o, !0),
          n < 8
            ? t.set(8, i - n - 1, o, !0)
            : n < 9
              ? t.set(8, 15 - n - 1 + 1, o, !0)
              : t.set(8, 15 - n - 1, o, !0));
      t.set(i - 8, 8, 1, !0);
    }
    r.create = function (t, e) {
      
      if (void 0 === t || "" === t) throw Error("No input text");
      let E = o.M;
      return (
        void 0 !== e &&
          ((E = o.from(e.errorCorrectionLevel, o.M)),
          (r = c.from(e.version)),
          (g = l.from(e.maskPattern)),
          e.toSJISFunc && n.setToSJISFunction(e.toSJISFunc)),
        (function (t, e, r, o) {
          
          if (Array.isArray(t)) g = p.fromArray(t);
          else if ("string" == typeof t) {
            let n = e;
            if (!n) {
              let e = p.rawSplit(t);
              n = c.getBestVersionForData(e, r);
            }
            g = p.fromString(t, n || 40);
          } else throw Error("Invalid data");
          let E = c.getBestVersionForData(g, r);
          if (!E)
            throw Error(
              "The amount of data is too big to be stored in a QR Code",
            );
          if (e) {
            if (e < E)
              throw Error(
                "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " +
                  E +
                  ".\n",
              );
          } else e = E;
          let y = (function (t, e, r) {
              let o = new i();
              r.forEach(function (e) {
                (o.put(e.mode.bit, 4),
                  o.put(e.getLength(), d.getCharCountIndicator(e.mode, t)),
                  e.write(o));
              });
              let a =
                (n.getSymbolTotalCodewords(t) -
                  h.getTotalCodewordsCount(t, e)) *
                8;
              for (
                o.getLengthInBits() + 4 <= a && o.put(0, 4);
                o.getLengthInBits() % 8 != 0;

              )
                o.putBit(0);
              let s = (a - o.getLengthInBits()) / 8;
              for (let t = 0; t < s; t++) o.put(t % 2 ? 17 : 236, 8);
              return (function (t, e, r) {
                let o,
                  i,
                  a = n.getSymbolTotalCodewords(e),
                  s = a - h.getTotalCodewordsCount(e, r),
                  u = h.getBlocksCount(e, r),
                  l = a % u,
                  c = u - l,
                  g = Math.floor(a / u),
                  d = Math.floor(s / u),
                  p = d + 1,
                  m = g - d,
                  E = new f(m),
                  y = 0,
                  w = Array(u),
                  A = Array(u),
                  C = 0,
                  B = new Uint8Array(t.buffer);
                for (let t = 0; t < u; t++) {
                  let e = t < c ? d : p;
                  ((w[t] = B.slice(y, y + e)),
                    (A[t] = E.encode(w[t])),
                    (y += e),
                    (C = Math.max(C, e)));
                }
                let T = new Uint8Array(a),
                  I = 0;
                for (o = 0; o < C; o++)
                  for (i = 0; i < u; i++) o < w[i].length && (T[I++] = w[i][o]);
                for (o = 0; o < m; o++)
                  for (i = 0; i < u; i++) T[I++] = A[i][o];
                return T;
              })(o, t, e);
            })(e, r, g),
            w = new a(n.getSymbolSize(e));
          !(function (t, e) {
            let r = t.size,
              n = u.getPositions(e);
            for (let e = 0; e < n.length; e++) {
              let o = n[e][0],
                i = n[e][1];
              for (let e = -1; e <= 7; e++)
                if (!(o + e <= -1) && !(r <= o + e))
                  for (let n = -1; n <= 7; n++)
                    i + n <= -1 ||
                      r <= i + n ||
                      ((e >= 0 && e <= 6 && (0 === n || 6 === n)) ||
                      (n >= 0 && n <= 6 && (0 === e || 6 === e)) ||
                      (e >= 2 && e <= 4 && n >= 2 && n <= 4)
                        ? t.set(o + e, i + n, !0, !0)
                        : t.set(o + e, i + n, !1, !0));
            }
          })(w, e);
          let A = w.size;
          for (let t = 8; t < A - 8; t++) {
            let e = t % 2 == 0;
            (w.set(t, 6, e, !0), w.set(6, t, e, !0));
          }
          return (
            !(function (t, e) {
              let r = s.getPositions(e);
              for (let e = 0; e < r.length; e++) {
                let n = r[e][0],
                  o = r[e][1];
                for (let e = -2; e <= 2; e++)
                  for (let r = -2; r <= 2; r++)
                    -2 === e ||
                    2 === e ||
                    -2 === r ||
                    2 === r ||
                    (0 === e && 0 === r)
                      ? t.set(n + e, o + r, !0, !0)
                      : t.set(n + e, o + r, !1, !0);
              }
            })(w, e),
            m(w, r, 0),
            e >= 7 &&
              (function (t, e) {
                let r,
                  n,
                  o,
                  i = t.size,
                  a = c.getEncodedBits(e);
                for (let e = 0; e < 18; e++)
                  ((r = Math.floor(e / 3)),
                    (n = (e % 3) + i - 8 - 3),
                    (o = ((a >> e) & 1) == 1),
                    t.set(r, n, o, !0),
                    t.set(n, r, o, !0));
              })(w, e),
            !(function (t, e) {
              let r = t.size,
                n = -1,
                o = r - 1,
                i = 7,
                a = 0;
              for (let s = r - 1; s > 0; s -= 2)
                for (6 === s && s--; ; ) {
                  for (let r = 0; r < 2; r++)
                    if (!t.isReserved(o, s - r)) {
                      let n = !1;
                      (a < e.length && (n = ((e[a] >>> i) & 1) == 1),
                        t.set(o, s - r, n),
                        -1 == --i && (a++, (i = 7)));
                    }
                  if ((o += n) < 0 || r <= o) {
                    ((o -= n), (n = -n));
                    break;
                  }
                }
            })(w, y),
            isNaN(o) && (o = l.getBestMask(w, m.bind(null, w, r))),
            l.applyMask(o, w),
            m(w, r, o),
            {
              modules: w,
              version: e,
              errorCorrectionLevel: r,
              maskPattern: o,
              segments: g,
            }
          );
        })(t, r, E, g)
      );
    };
