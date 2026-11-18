// Reconstructed from 42t5am4xfcidi.pretty.js, module 396592.
// deps: none
// exports: none


let n = "[0-9]+",
      o =
        "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+",
      i =
        "(?:(?![A-Z0-9 $%*+\\-./:]|" +
        (o = o.replace(/u/g, "\\u")) +
        ")(?:.|[\r\n]))+";
    ((r.KANJI = RegExp(o, "g")),
      (r.BYTE_KANJI = RegExp("[^A-Z0-9 $%*+\\-./:]+", "g")),
      (r.BYTE = RegExp(i, "g")),
      (r.NUMERIC = RegExp(n, "g")),
      (r.ALPHANUMERIC = RegExp("[A-Z $%*+\\-./:]+", "g")));
    let a = RegExp("^" + o + "$"),
      s = RegExp("^" + n + "$"),
      u = RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    ((r.testKanji = function (t) {
      return a.test(t);
    }),
      (r.testNumeric = function (t) {
        return s.test(t);
      }),
      (r.testAlphanumeric = function (t) {
        return u.test(t);
      }));
