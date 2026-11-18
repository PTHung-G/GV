// Reconstructed from 42t5am4xfcidi.pretty.js, module 882257.
// deps: none
// exports: none


let n = t.r(150882);
    function o(t) {
      ((this.mode = n.BYTE),
        "string" == typeof t
          ? (this.data = new TextEncoder().encode(t))
          : (this.data = new Uint8Array(t)));
    }
    ((o.getBitsLength = function (t) {
      return 8 * t;
    }),
      (o.prototype.getLength = function () {
        return this.data.length;
      }),
      (o.prototype.getBitsLength = function () {
        return o.getBitsLength(this.data.length);
      }),
      (o.prototype.write = function (t) {
        for (let e = 0, r = this.data.length; e < r; e++)
          t.put(this.data[e], 8);
      }),
      (e.exports = o));
