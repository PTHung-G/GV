// Reconstructed from 42t5am4xfcidi.js, module 973134.
// deps: none
// exports: none


let n=t.r(738750),o=t.r(30671),i=t.r(563037),a=t.r(310891);function s(t,e,r,i,a){let s=[].slice.call(arguments,1),u=s.length,l="function"==typeof s[u-1];if(!l&&!n())throw Error("Callback required as last argument");if(l){if(u<2)throw Error("Too few arguments provided");2===u?(a=r,r=e,e=i=void 0):3===u&&(e.getContext&&void 0===a?(a=i,i=void 0):(a=i,i=r,r=e,e=void 0))}else{if(u<1)throw Error("Too few arguments provided");return 1===u?(r=e,e=i=void 0):2!==u||e.getContext||(i=r,r=e,e=void 0),new Promise(function(n,a){try{let a=o.create(r,i);n(t(a,e,i))}catch(t){a(t)}})}try{let n=o.create(r,i);a(null,t(n,e,i))}catch(t){a(t)}}r.create=o.create,r.toCanvas=s.bind(null,i.render),r.toDataURL=s.bind(null,i.renderToDataURL),r.toString=s.bind(null,function(t,e,r){return a.render(t,r)})
