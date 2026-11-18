// Reconstructed from 2cv-l13l_j_z0.js, module 443486.
// deps: none
// exports: none


"use strict";e.exports=function(t,e,r,i){for(var n=65535&t,a=t>>>16&65535,s=0;0!==r;){s=r>2e3?2e3:r,r-=s;do a=a+(n=n+e[i++]|0)|0;while(--s)n%=65521,a%=65521}return n|a<<16}
