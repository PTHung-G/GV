// Reconstructed from 2cv-l13l_j_z0.js, module 101648.
// deps: none
// exports: none


"use strict";var i=t.r(48913),n=t.r(763494);function a(){i.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}t.r(965464).inherits(a,i),a.prototype.processChunk=function(t){this.streamInfo.crc32=n(t.data,this.streamInfo.crc32||0),this.push(t)},e.exports=a
