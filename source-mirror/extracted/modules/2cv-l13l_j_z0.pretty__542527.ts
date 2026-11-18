// Reconstructed from 2cv-l13l_j_z0.pretty.js, module 542527.
// deps: none
// exports: none


"use strict";
    var i = t.i(467034);
    e.exports = {
      isNode: void 0 !== i.Buffer,
      newBufferFrom: function (t, e) {
        if (i.Buffer.from && i.Buffer.from !== Uint8Array.from)
          return i.Buffer.from(t, e);
        if ("number" == typeof t)
          throw Error('The "data" argument must not be a number');
        return new i.Buffer(t, e);
      },
      allocBuffer: function (t) {
        if (i.Buffer.alloc) return i.Buffer.alloc(t);
        var e = new i.Buffer(t);
        return (e.fill(0), e);
      },
      isBuffer: function (t) {
        return i.Buffer.isBuffer(t);
      },
      isStream: function (t) {
        return (
          t &&
          "function" == typeof t.on &&
          "function" == typeof t.pause &&
          "function" == typeof t.resume
        );
      },
    };
