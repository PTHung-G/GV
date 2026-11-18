// Reconstructed from 3bg0pkvz9zgwr.js, module 752822.
// deps: none
// exports: none


"use strict";var a=t.r(271645),i=t.r(802239),r="function"==typeof Object.is?Object.is:function(t,e){return t===e&&(0!==t||1/t==1/e)||t!=t&&e!=e},o=i.useSyncExternalStore,l=a.useRef,s=a.useEffect,c=a.useMemo,h=a.useDebugValue;n.useSyncExternalStoreWithSelector=function(t,e,n,a,i){var u=l(null);if(null===u.current){var g={hasValue:!1,value:null};u.current=g}else g=u.current;var d=o(t,(u=c(function(){function t(t){if(!s){if(s=!0,o=t,t=a(t),void 0!==i&&g.hasValue){var e=g.value;if(i(e,t))return l=e}return l=t}if(e=l,r(o,t))return e;var n=a(t);return void 0!==i&&i(e,n)?(o=t,e):(o=t,l=n)}var o,l,s=!1,c=void 0===n?null:n;return[function(){return t(e())},null===c?void 0:function(){return t(c())}]},[e,n,a,i]))[0],u[1]);return s(function(){g.hasValue=!0,g.value=d},[d]),h(d),d}
