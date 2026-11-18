// Reconstructed from 16aj47n690ufs.js, module 752822.
// deps: none
// exports: none


"use strict";var n=t.r(271645),a=t.r(802239),i="function"==typeof Object.is?Object.is:function(t,e){return t===e&&(0!==t||1/t==1/e)||t!=t&&e!=e},l=a.useSyncExternalStore,s=n.useRef,o=n.useEffect,u=n.useMemo,c=n.useDebugValue;r.useSyncExternalStoreWithSelector=function(t,e,r,n,a){var h=s(null);if(null===h.current){var p={hasValue:!1,value:null};h.current=p}else p=h.current;var f=l(t,(h=u(function(){function t(t){if(!o){if(o=!0,l=t,t=n(t),void 0!==a&&p.hasValue){var e=p.value;if(a(e,t))return s=e}return s=t}if(e=s,i(l,t))return e;var r=n(t);return void 0!==a&&a(e,r)?(l=t,e):(l=t,s=r)}var l,s,o=!1,u=void 0===r?null:r;return[function(){return t(e())},null===u?void 0:function(){return t(u())}]},[e,r,n,a]))[0],h[1]);return o(function(){p.hasValue=!0,p.value=f},[f]),c(f),f}
