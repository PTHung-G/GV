// Reconstructed from 2cv-l13l_j_z0.js, module 127024.
// deps: none
// exports: none


"use strict";var i,n,a=t.g.MutationObserver||t.g.WebKitMutationObserver;if(a){var s=0,o=new a(d),h=t.g.document.createTextNode("");o.observe(h,{characterData:!0}),i=function(){h.data=s=++s%2}}else if(t.g.setImmediate||void 0===t.g.MessageChannel)i="document"in t.g&&"onreadystatechange"in t.g.document.createElement("script")?function(){var e=t.g.document.createElement("script");e.onreadystatechange=function(){d(),e.onreadystatechange=null,e.parentNode.removeChild(e),e=null},t.g.document.documentElement.appendChild(e)}:function(){setTimeout(d,0)};else{var u=new t.g.MessageChannel;u.port1.onmessage=d,i=function(){u.port2.postMessage(0)}}var l=[];function d(){n=!0;for(var t,e,r=l.length;r;){for(e=l,l=[],t=-1;++t<r;)e[t]();r=l.length}n=!1}e.exports=function(t){1!==l.push(t)||n||i()}
