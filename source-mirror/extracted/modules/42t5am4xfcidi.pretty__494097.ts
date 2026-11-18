// Reconstructed from 42t5am4xfcidi.pretty.js, module 494097.
// deps: none
// exports: none


let n = t.r(150882);
    function o(t) {
      ((this.mode = n.NUMERIC), (this.data = t.toString()));
    }
    ((o.getBitsLength = function (t) {
      return 10 * Math.floor(t / 3) + (t % 3 ? (t % 3) * 3 + 1 : 0);
    }),
      (o.prototype.getLength = function () {
        return this.data.length;
      }),
      (o.prototype.getBitsLength = function () {
        return o.getBitsLength(this.data.length);
      }),
      (o.prototype.write = function (t) {
        
        for (e = 0; e + 3 <= this.data.length; e += 3)
          ((r = parseInt(this.data.substr(e, 3), 10)), t.put(r, 10));
        let n = this.data.length - e;
        n > 0 && ((r = parseInt(this.data.substr(e), 10)), t.put(r, 3 * n + 1));
      }),
      (e.exports = o));
