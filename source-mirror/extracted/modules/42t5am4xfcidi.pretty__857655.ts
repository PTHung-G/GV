// Reconstructed from 42t5am4xfcidi.pretty.js, module 857655.
// deps: none
// exports: none


let n = t.r(87201),
      o = n.getBCHDigit(1335);
    r.getEncodedBits = function (t, e) {
      let r = (t.bit << 3) | e,
        i = r << 10;
      for (; n.getBCHDigit(i) - o >= 0; ) i ^= 1335 << (n.getBCHDigit(i) - o);
      return ((r << 10) | i) ^ 21522;
    };
