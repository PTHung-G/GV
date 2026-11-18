// Reconstructed from 2-_e50duc2fl9.js, module 90317.
// deps: none
// exports: none


"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={bindSnapshot:function(){return u},createAsyncLocalStorage:function(){return l},createSnapshot:function(){return c}};for(var s in n)Object.defineProperty(r,s,{enumerable:!0,get:n[s]});let i=Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"),"__NEXT_ERROR_CODE",{value:"E504",enumerable:!1,configurable:!0});class a{disable(){throw i}getStore(){}run(){throw i}exit(){throw i}enterWith(){throw i}static bind(e){return e}}let o="u">typeof globalThis&&globalThis.AsyncLocalStorage;function l(){return o?new o:new a}function u(e){return o?o.bind(e):a.bind(e)}function c(){return o?o.snapshot():function(e,...t){return e(...t)}}
