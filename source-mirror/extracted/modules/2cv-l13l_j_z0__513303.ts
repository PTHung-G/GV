// Reconstructed from 2cv-l13l_j_z0.js, module 513303.
// deps: none
// exports: none


"use strict";var i=t.r(965464),n=t.r(48913);function a(t,e){n.call(this,"Nodejs stream input adapter for "+t),this._upstreamEnded=!1,this._bindStream(e)}i.inherits(a,n),a.prototype._bindStream=function(t){var e=this;this._stream=t,t.pause(),t.on("data",function(t){e.push({data:t,meta:{percent:0}})}).on("error",function(t){e.isPaused?this.generatedError=t:e.error(t)}).on("end",function(){e.isPaused?e._upstreamEnded=!0:e.end()})},a.prototype.pause=function(){return!!n.prototype.pause.call(this)&&(this._stream.pause(),!0)},a.prototype.resume=function(){return!!n.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},e.exports=a
