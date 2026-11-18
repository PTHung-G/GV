// Reconstructed from 42t5am4xfcidi.js, module 962458.
// deps: none
// exports: none


let n=t.r(950677);function o(t){this.genPoly=void 0,this.degree=t,this.degree&&this.initialize(this.degree)}o.prototype.initialize=function(t){this.degree=t,this.genPoly=n.generateECPolynomial(this.degree)},o.prototype.encode=function(t){if(!this.genPoly)throw Error("Encoder not initialized");let e=new Uint8Array(t.length+this.degree);e.set(t);let r=n.mod(e,this.genPoly),o=this.degree-r.length;if(o>0){let t=new Uint8Array(this.degree);return t.set(r,o),t}return r},e.exports=o
