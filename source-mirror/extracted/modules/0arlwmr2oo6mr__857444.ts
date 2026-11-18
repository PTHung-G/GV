// Reconstructed from 0arlwmr2oo6mr.js, module 857444.
// deps: none
// exports: MAX_SOURCES, OPEN_LIBRARY_EVENT, loadSources, saveSources
export { 8 as "MAX_SOURCES" };
export { "exam-open-library" as "OPEN_LIBRARY_EVENT" };
export { function(e){try{let n=localStorage.getItem(t(e)),a=n?JSON.parse(n):[];return Array.isArray(a)?a.filter(e=>"string"==typeof e).slice(0,8):[]}catch{return[]}} as "loadSources" };
export { function(e,n){try{0===n.length?localStorage.removeItem(t(e)):localStorage.setItem(t(e),JSON.stringify(n.slice(0,8)))}catch{}} as "saveSources" };

"use strict";let t=e=>`library-sources:${e}`;
