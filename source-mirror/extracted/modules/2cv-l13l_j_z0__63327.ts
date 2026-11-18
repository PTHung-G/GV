// Reconstructed from 2cv-l13l_j_z0.js, module 63327.
// deps: none
// exports: none


"use strict";var i=function(){for(var t,e=[],r=0;r<256;r++){t=r;for(var i=0;i<8;i++)t=1&t?0xedb88320^t>>>1:t>>>1;e[r]=t}return e}();e.exports=function(t,e,r,n){var a=n+r;t^=-1;for(var s=n;s<a;s++)t=t>>>8^i[(t^e[s])&255];return -1^t}
