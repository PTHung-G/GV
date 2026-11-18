// Reconstructed from 33t46atd3n2zd.js, module 491915.
// deps: m247167
// exports: none


"use strict";function n(e,t={}){if(t.onlyHashChange)return void e();let r=document.documentElement;if("smooth"!==r.dataset.scrollBehavior)return void e();let l=r.style.scrollBehavior;r.style.scrollBehavior="auto",t.dontForceLayout||r.getClientRects(),e(),r.style.scrollBehavior=l}m247167,Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"disableSmoothScrollDuringRouteTransition",{enumerable:!0,get:function(){return n}})
