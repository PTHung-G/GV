// Reconstructed from 2cv-l13l_j_z0.js, module 779148.
// deps: none
// exports: none


"use strict";var i="u">typeof Uint8Array&&"u">typeof Uint16Array&&"u">typeof Int32Array;r.assign=function(t){for(var e=Array.prototype.slice.call(arguments,1);e.length;){var r=e.shift();if(r){if("object"!=typeof r)throw TypeError(r+"must be non-object");for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}}return t},r.shrinkBuf=function(t,e){return t.length===e?t:t.subarray?t.subarray(0,e):(t.length=e,t)};var n={arraySet:function(t,e,r,i,n){if(e.subarray&&t.subarray)return void t.set(e.subarray(r,r+i),n);for(var a=0;a<i;a++)t[n+a]=e[r+a]},flattenChunks:function(t){for(e=0,i=0,r=t.length;e<r;e++)i+=t[e].length;for(s=new Uint8Array(i),n=0,e=0,r=t.length;e<r;e++)a=t[e],s.set(a,n),n+=a.length;return s}},a={arraySet:function(t,e,r,i,n){for(var a=0;a<i;a++)t[n+a]=e[r+a]},flattenChunks:function(t){return[].concat.apply([],t)}};r.setTyped=function(t){t?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,n)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,a))},r.setTyped(i)
