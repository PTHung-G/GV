// Reconstructed from 2cv-l13l_j_z0.js, module 212189.
// deps: none
// exports: none


"use strict";var i=t.r(337384);function n(t){i.call(this,t);for(var e=0;e<this.data.length;e++)t[e]=255&t[e]}t.r(965464).inherits(n,i),n.prototype.byteAt=function(t){return this.data[this.zero+t]},n.prototype.lastIndexOfSignature=function(t){for(var e=t.charCodeAt(0),r=t.charCodeAt(1),i=t.charCodeAt(2),n=t.charCodeAt(3),a=this.length-4;a>=0;--a)if(this.data[a]===e&&this.data[a+1]===r&&this.data[a+2]===i&&this.data[a+3]===n)return a-this.zero;return -1},n.prototype.readAndCheckSignature=function(t){var e=t.charCodeAt(0),r=t.charCodeAt(1),i=t.charCodeAt(2),n=t.charCodeAt(3),a=this.readData(4);return e===a[0]&&r===a[1]&&i===a[2]&&n===a[3]},n.prototype.readData=function(t){if(this.checkOffset(t),0===t)return[];var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n
