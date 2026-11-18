// Reconstructed from 42t5am4xfcidi.js, module 563037.
// deps: none
// exports: none


let n=t.r(125950);r.render=function(t,e,r){let i=r,a=e;void 0!==i||e&&e.getContext||(i=e,e=void 0),e||(a=function(){try{return document.createElement("canvas")}catch(t){throw Error("You need to specify a canvas element")}}()),i=n.getOptions(i);let s=n.getImageWidth(t.modules.size,i),u=a.getContext("2d"),l=u.createImageData(s,s);return n.qrToImageData(l.data,t,i),o=a,u.clearRect(0,0,o.width,o.height),o.style||(o.style={}),o.height=s,o.width=s,o.style.height=s+"px",o.style.width=s+"px",u.putImageData(l,0,0),a},r.renderToDataURL=function(t,e,n){let o=n;void 0!==o||e&&e.getContext||(o=e,e=void 0),o||(o={});let i=r.render(t,e,o),a=o.type||"image/png",s=o.rendererOpts||{};return i.toDataURL(a,s.quality)}
