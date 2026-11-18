// Reconstructed from 2cv-l13l_j_z0.js, module 763494.
// deps: none
// exports: none


"use strict";var i=t.r(965464),n=function(){for(var t,e=[],r=0;r<256;r++){t=r;for(var i=0;i<8;i++)t=1&t?0xedb88320^t>>>1:t>>>1;e[r]=t}return e}();e.exports=function(t,e){return void 0!==t&&t.length?"string"!==i.getTypeOf(t)?function(t,e,r){var i=0+r;t^=-1;for(var a=0;a<i;a++)t=t>>>8^n[(t^e[a])&255];return -1^t}(0|e,t,t.length):function(t,e,r){var i=0+r;t^=-1;for(var a=0;a<i;a++)t=t>>>8^n[(t^e.charCodeAt(a))&255];return -1^t}(0|e,t,t.length):0}
