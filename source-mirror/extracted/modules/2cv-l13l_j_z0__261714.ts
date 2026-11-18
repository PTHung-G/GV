// Reconstructed from 2cv-l13l_j_z0.js, module 261714.
// deps: none
// exports: none


"use strict";var i=t.r(531032).Readable;function n(t,e,r){i.call(this,e),this._helper=t;var n=this;t.on("data",function(t,e){n.push(t)||n._helper.pause(),r&&r(e)}).on("error",function(t){n.emit("error",t)}).on("end",function(){n.push(null)})}t.r(965464).inherits(n,i),n.prototype._read=function(){this._helper.resume()},e.exports=n
