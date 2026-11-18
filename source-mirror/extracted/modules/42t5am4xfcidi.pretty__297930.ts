// Reconstructed from 42t5am4xfcidi.pretty.js, module 297930.
// deps: none
// exports: none


let n = t.r(150882),
      o = t.r(494097),
      i = t.r(112553),
      a = t.r(882257),
      s = t.r(422644),
      u = t.r(396592),
      l = t.r(87201),
      h = t.r(245953);
    function f(t) {
      return unescape(encodeURIComponent(t)).length;
    }
    function c(t, e, r) {
      let n,
        o = [];
      for (; null !== (n = t.exec(r)); )
        o.push({ data: n[0], index: n.index, mode: e, length: n[0].length });
      return o;
    }
    function g(t) {
      let e,
        r,
        o = c(u.NUMERIC, n.NUMERIC, t),
        i = c(u.ALPHANUMERIC, n.ALPHANUMERIC, t);
      return (
        l.isKanjiModeEnabled()
          ? ((e = c(u.BYTE, n.BYTE, t)), (r = c(u.KANJI, n.KANJI, t)))
          : ((e = c(u.BYTE_KANJI, n.BYTE, t)), (r = [])),
        o
          .concat(i, e, r)
          .sort(function (t, e) {
            return t.index - e.index;
          })
          .map(function (t) {
            return { data: t.data, mode: t.mode, length: t.length };
          })
      );
    }
    function d(t, e) {
      switch (e) {
        case n.NUMERIC:
          return o.getBitsLength(t);
        case n.ALPHANUMERIC:
          return i.getBitsLength(t);
        case n.KANJI:
          return s.getBitsLength(t);
        case n.BYTE:
          return a.getBitsLength(t);
      }
    }
    function p(t, e) {
      let r,
        u = n.getBestModeForData(t);
      if ((r = n.from(e, u)) !== n.BYTE && r.bit < u.bit)
        throw Error(
          '"' +
            t +
            '" cannot be encoded with mode ' +
            n.toString(r) +
            ".\n Suggested mode is: " +
            n.toString(u),
        );
      switch ((r === n.KANJI && !l.isKanjiModeEnabled() && (r = n.BYTE), r)) {
        case n.NUMERIC:
          return new o(t);
        case n.ALPHANUMERIC:
          return new i(t);
        case n.KANJI:
          return new s(t);
        case n.BYTE:
          return new a(t);
      }
    }
    ((r.fromArray = function (t) {
      return t.reduce(function (t, e) {
        return (
          "string" == typeof e
            ? t.push(p(e, null))
            : e.data && t.push(p(e.data, e.mode)),
          t
        );
      }, []);
    }),
      (r.fromString = function (t, e) {
        let o = (function (t, e) {
            let r = {},
              o = { start: {} },
              i = ["start"];
            for (let a = 0; a < t.length; a++) {
              let s = t[a],
                u = [];
              for (let t = 0; t < s.length; t++) {
                let l = s[t],
                  h = "" + a + t;
                (u.push(h), (r[h] = { node: l, lastCount: 0 }), (o[h] = {}));
                for (let t = 0; t < i.length; t++) {
                  let a = i[t];
                  r[a] && r[a].node.mode === l.mode
                    ? ((o[a][h] =
                        d(r[a].lastCount + l.length, l.mode) -
                        d(r[a].lastCount, l.mode)),
                      (r[a].lastCount += l.length))
                    : (r[a] && (r[a].lastCount = l.length),
                      (o[a][h] =
                        d(l.length, l.mode) +
                        4 +
                        n.getCharCountIndicator(l.mode, e)));
                }
              }
              i = u;
            }
            for (let t = 0; t < i.length; t++) o[i[t]].end = 0;
            return { map: o, table: r };
          })(
            (function (t) {
              let e = [];
              for (let r = 0; r < t.length; r++) {
                let o = t[r];
                switch (o.mode) {
                  case n.NUMERIC:
                    e.push([
                      o,
                      { data: o.data, mode: n.ALPHANUMERIC, length: o.length },
                      { data: o.data, mode: n.BYTE, length: o.length },
                    ]);
                    break;
                  case n.ALPHANUMERIC:
                    e.push([
                      o,
                      { data: o.data, mode: n.BYTE, length: o.length },
                    ]);
                    break;
                  case n.KANJI:
                    e.push([
                      o,
                      { data: o.data, mode: n.BYTE, length: f(o.data) },
                    ]);
                    break;
                  case n.BYTE:
                    e.push([{ data: o.data, mode: n.BYTE, length: f(o.data) }]);
                }
              }
              return e;
            })(g(t, l.isKanjiModeEnabled())),
            e,
          ),
          i = h.find_path(o.map, "start", "end"),
          a = [];
        for (let t = 1; t < i.length - 1; t++) a.push(o.table[i[t]].node);
        return r.fromArray(
          a.reduce(function (t, e) {
            let r = t.length - 1 >= 0 ? t[t.length - 1] : null;
            return (
              r && r.mode === e.mode
                ? (t[t.length - 1].data += e.data)
                : t.push(e),
              t
            );
          }, []),
        );
      }),
      (r.rawSplit = function (t) {
        return r.fromArray(g(t, l.isKanjiModeEnabled()));
      }));
