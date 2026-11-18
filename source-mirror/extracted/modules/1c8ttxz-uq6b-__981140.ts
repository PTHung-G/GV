// Reconstructed from 1c8ttxz-uq6b-.js, module 981140.
// deps: none
// exports: composeEventHandlers
export { o as "composeEventHandlers" };

"use strict";var t=Object.defineProperty,n=(e,n)=>t(e,"name",{value:n,configurable:!0}),r=!!("u">typeof window&&window.document&&window.document.createElement);function o(e,t,{checkForDefaultPrevented:r=!0}={}){return n(function(n){if(e?.(n),!1===r||!n||!n.defaultPrevented)return t?.(n)},"handleEvent")}function i(e){if(!r)throw Error("Cannot access document outside of the DOM");return e?.ownerDocument??document}function u(e){return"IFRAME"===e.tagName}n(o,"composeEventHandlers"),n(function(e){if(!r)throw Error("Cannot access window outside of the DOM");return e?.ownerDocument?.defaultView??window},"getOwnerWindow"),n(i,"getOwnerDocument"),n(function e(t,n=!1){let{activeElement:r}=i(t);if(!r?.nodeName)return null;if(u(r)&&r.contentDocument)return e(r.contentDocument.body,n);if(n){let e=r.getAttribute("aria-activedescendant");if(e){let t=i(r).getElementById(e);if(t)return t}}return r},"getActiveElement"),n(u,"isFrame"),
