// Reconstructed from 2cv-l13l_j_z0.js, module 941087.
// deps: none
// exports: none


"use strict";var i=t.r(965464),n=t.r(48913);function a(t){n.call(this,"DataLengthProbe for "+t),this.propName=t,this.withStreamInfo(t,0)}i.inherits(a,n),a.prototype.processChunk=function(t){if(t){var e=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=e+t.data.length}n.prototype.processChunk.call(this,t)},e.exports=a
