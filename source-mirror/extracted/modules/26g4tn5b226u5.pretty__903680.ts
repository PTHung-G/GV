// Reconstructed from 26g4tn5b226u5.pretty.js, module 903680.
// deps: none
// exports: none


"use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "ReadonlyURLSearchParams", {
        enumerable: !0,
        get: function () {
          return o;
        },
      }));
    class n extends Error {
      constructor() {
        (super(
          "Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams",
        ),
          Object.defineProperty(this, "__NEXT_ERROR_CODE", {
            value: "E1174",
            enumerable: !1,
            configurable: !0,
          }));
      }
    }
    class o extends URLSearchParams {
      append() {
        throw new n();
      }
      delete() {
        throw new n();
      }
      set() {
        throw new n();
      }
      sort() {
        throw new n();
      }
    }
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
