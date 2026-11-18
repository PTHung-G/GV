// Reconstructed from 2cv-l13l_j_z0.pretty.js, module 852929.
// deps: none
// exports: none


"use strict";
    var i = t.r(500846),
      n = t.r(525625),
      a = t.r(646253),
      s = t.r(643220),
      o = t.r(48913),
      h = function (t, e, r) {
        ((this.name = t),
          (this.dir = r.dir),
          (this.date = r.date),
          (this.comment = r.comment),
          (this.unixPermissions = r.unixPermissions),
          (this.dosPermissions = r.dosPermissions),
          (this._data = e),
          (this._dataBinary = r.binary),
          (this.options = {
            compression: r.compression,
            compressionOptions: r.compressionOptions,
          }));
      };
    h.prototype = {
      internalStream: function (t) {
        var e = null,
          r = "string";
        try {
          if (!t) throw Error("No output type specified.");
          r = t.toLowerCase();
          var n = "string" === r || "text" === r;
          (("binarystring" === r || "text" === r) && (r = "string"),
            (e = this._decompressWorker()));
          var s = !this._dataBinary;
          (s && !n && (e = e.pipe(new a.Utf8EncodeWorker())),
            !s && n && (e = e.pipe(new a.Utf8DecodeWorker())));
        } catch (t) {
          (e = new o("error")).error(t);
        }
        return new i(e, r, "");
      },
      async: function (t, e) {
        return this.internalStream(t).accumulate(e);
      },
      nodeStream: function (t, e) {
        return this.internalStream(t || "nodebuffer").toNodejsStream(e);
      },
      _compressWorker: function (t, e) {
        if (this._data instanceof s && this._data.compression.magic === t.magic)
          return this._data.getCompressedWorker();
        var r = this._decompressWorker();
        return (
          this._dataBinary || (r = r.pipe(new a.Utf8EncodeWorker())),
          s.createWorkerFrom(r, t, e)
        );
      },
      _decompressWorker: function () {
        return this._data instanceof s
          ? this._data.getContentWorker()
          : this._data instanceof o
            ? this._data
            : new n(this._data);
      },
    };
    for (
      var u = [
          "asText",
          "asBinary",
          "asNodeBuffer",
          "asUint8Array",
          "asArrayBuffer",
        ],
        l = function () {
          throw Error(
            "This method has been removed in JSZip 3.0, please check the upgrade guide.",
          );
        },
        d = 0;
      d < u.length;
      d++
    )
      h.prototype[u[d]] = l;
    e.exports = h;
