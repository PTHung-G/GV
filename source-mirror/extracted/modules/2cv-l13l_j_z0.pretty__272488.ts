// Reconstructed from 2cv-l13l_j_z0.pretty.js, module 272488.
// deps: none
// exports: none


"use strict";
    var i =
        "u" > typeof Uint8Array &&
        "u" > typeof Uint16Array &&
        "u" > typeof Uint32Array,
      n = t.r(209643),
      a = t.r(965464),
      s = t.r(48913),
      o = i ? "uint8array" : "array";
    function h(t, e) {
      (s.call(this, "FlateWorker/" + t),
        (this._pako = null),
        (this._pakoAction = t),
        (this._pakoOptions = e),
        (this.meta = {}));
    }
    ((r.magic = "\b\0"),
      a.inherits(h, s),
      (h.prototype.processChunk = function (t) {
        ((this.meta = t.meta),
          null === this._pako && this._createPako(),
          this._pako.push(a.transformTo(o, t.data), !1));
      }),
      (h.prototype.flush = function () {
        (s.prototype.flush.call(this),
          null === this._pako && this._createPako(),
          this._pako.push([], !0));
      }),
      (h.prototype.cleanUp = function () {
        (s.prototype.cleanUp.call(this), (this._pako = null));
      }),
      (h.prototype._createPako = function () {
        this._pako = new n[this._pakoAction]({
          raw: !0,
          level: this._pakoOptions.level || -1,
        });
        var t = this;
        this._pako.onData = function (e) {
          t.push({ data: e, meta: t.meta });
        };
      }),
      (r.compressWorker = function (t) {
        return new h("Deflate", t);
      }),
      (r.uncompressWorker = function () {
        return new h("Inflate", {});
      }));
