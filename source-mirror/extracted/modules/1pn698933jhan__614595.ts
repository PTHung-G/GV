// Reconstructed from 1pn698933jhan.js, module 614595.
// deps: m271645
// exports: none


"use strict";var n=m271645,i="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},a=n.useSyncExternalStore,l=n.useRef,o=n.useEffect,c=n.useMemo,s=n.useDebugValue;r.useSyncExternalStoreWithSelector=function(e,t,r,n,u){var f=l(null);if(null===f.current){var d={hasValue:!1,value:null};f.current=d}else d=f.current;var h=a(e,(f=c(function(){function e(e){if(!o){if(o=!0,a=e,e=n(e),void 0!==u&&d.hasValue){var t=d.value;if(u(t,e))return l=t}return l=e}if(t=l,i(a,e))return t;var r=n(e);return void 0!==u&&u(t,r)?(a=e,t):(a=e,l=r)}var a,l,o=!1,c=void 0===r?null:r;return[function(){return e(t())},null===c?void 0:function(){return e(c())}]},[t,r,n,u]))[0],f[1]);return o(function(){d.hasValue=!0,d.value=h},[h]),s(h),h}
