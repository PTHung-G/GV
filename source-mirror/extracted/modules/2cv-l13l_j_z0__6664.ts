// Reconstructed from 2cv-l13l_j_z0.js, module 6664.
// deps: none
// exports: none


"use strict";var i=t.r(436462),n=t.r(821908),a=function(t,e){var r=t||e,n=i[r];if(!n)throw Error(r+" is not a valid compression method !");return n};r.generateWorker=function(t,e,r){var i=new n(e.streamFiles,r,e.platform,e.encodeFileName),s=0;try{t.forEach(function(t,r){s++;var n=a(r.options.compression,e.compression),o=r.options.compressionOptions||e.compressionOptions||{},h=r.dir,u=r.date;r._compressWorker(n,o).withStreamInfo("file",{name:t,dir:h,date:u,comment:r.comment||"",unixPermissions:r.unixPermissions,dosPermissions:r.dosPermissions}).pipe(i)}),i.entriesCount=s}catch(t){i.error(t)}return i}
