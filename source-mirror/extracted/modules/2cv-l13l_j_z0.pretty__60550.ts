// Reconstructed from 2cv-l13l_j_z0.pretty.js, module 60550.
// deps: none
// exports: none


"use strict";
    var i = t.r(48913),
      n = t.r(965464);
    function a(t) {
      (i.call(this, "ConvertWorker to " + t), (this.destType = t));
    }
    (n.inherits(a, i),
      (a.prototype.processChunk = function (t) {
        this.push({ data: n.transformTo(this.destType, t.data), meta: t.meta });
      }),
      (e.exports = a));
