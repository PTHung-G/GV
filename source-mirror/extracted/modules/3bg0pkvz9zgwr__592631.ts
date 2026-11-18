// Reconstructed from 3bg0pkvz9zgwr.js, module 592631.
// deps: none
// exports: none


"use strict";let e=["@primary","@secondary","@accent","@text","@muted","@surface","@background"],n=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;function a(t,e,n=""){if(!t)return n;if(!t.startsWith("@"))return t;let i=t.slice(1),r=e.colors[i];return"string"==typeof r&&r?r:n}function i(t){if(!n.test(t))return null;let e=4===t.length?t.slice(1).split("").map(t=>t+t).join(""):t.slice(1);return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16)/255)}function r(t){let e=i(t);if(!e)return null;let[n,a,r]=e.map(t=>t<=.03928?t/12.92:((t+.055)/1.055)**2.4);return .2126*n+.7152*a+.0722*r}function o(t,e){let n=r(t),a=r(e);return null===n||null===a?1:(Math.max(n,a)+.05)/(Math.min(n,a)+.05)}t.s(["THEME_COLOR_TOKENS",0,e,"isColorValue",0,function(t){return""===t||n.test(t)||e.includes(t)},"readableTextOn",0,function(t,e){let n=a(t,e,"");if(!i(n))return e.colors.text;let r=[e.colors.text,"#ffffff",e.colors.background];return r.find(t=>o(t,n)>=4.5)??r.reduce((t,e)=>o(e,n)>o(t,n)?e:t)},"resolveColor",0,a])
