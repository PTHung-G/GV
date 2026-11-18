// Reconstructed from 2cv-l13l_j_z0.pretty.js, module 41370.
// deps: none
// exports: none


"use strict";
    var i = t.r(337384);
    function n(t) {
      i.call(this, t);
    }
    (t.r(965464).inherits(n, i),
      (n.prototype.byteAt = function (t) {
        return this.data.charCodeAt(this.zero + t);
      }),
      (n.prototype.lastIndexOfSignature = function (t) {
        return this.data.lastIndexOf(t) - this.zero;
      }),
      (n.prototype.readAndCheckSignature = function (t) {
        return t === this.readData(4);
      }),
      (n.prototype.readData = function (t) {
        this.checkOffset(t);
        var e = this.data.slice(
          this.zero + this.index,
          this.zero + this.index + t,
        );
        return ((this.index += t), e);
      }),
      (e.exports = n));
