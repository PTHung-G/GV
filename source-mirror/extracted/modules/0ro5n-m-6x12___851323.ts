// Reconstructed from 0ro5n-m-6x12_.js, module 851323.
// deps: m247167, m555682, m265713, m132061, m528279, m972383, m168027
// exports: none


"use strict";m247167,Object.defineProperty(r,"__esModule",{value:!0});var n={onCaughtError:function(){return f},onUncaughtError:function(){return p}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let a=m555682,l=m265713,i=m132061,u=m528279,d=m972383,s=a._(m168027),c={decorateDevError:e=>e,handleClientError:()=>{},originConsoleError:console.error.bind(console)};function f(e,t){let r,n=t.errorBoundary?.constructor;if(r=r||n===d.ErrorBoundaryHandler&&t.errorBoundary.props.errorComponent===s.default)return p(e);(0,i.isBailoutToCSRError)(e)||(0,l.isNextRouterError)(e)||c.originConsoleError(e)}function p(e){(0,i.isBailoutToCSRError)(e)||(0,l.isNextRouterError)(e)||(0,u.reportGlobalError)(e)}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)
