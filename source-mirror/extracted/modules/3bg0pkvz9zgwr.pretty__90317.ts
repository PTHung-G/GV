// Reconstructed from 3bg0pkvz9zgwr.pretty.js, module 90317.
// deps: none
// exports: none


"use strict";
    Object.defineProperty(n, "__esModule", { value: !0 });
    var a = {
      bindSnapshot: function () {
        return c;
      },
      createAsyncLocalStorage: function () {
        return s;
      },
      createSnapshot: function () {
        return h;
      },
    };
    for (var i in a) Object.defineProperty(n, i, { enumerable: !0, get: a[i] });
    let r = Object.defineProperty(
      Error(
        "Invariant: AsyncLocalStorage accessed in runtime where it is not available",
      ),
      "__NEXT_ERROR_CODE",
      { value: "E504", enumerable: !1, configurable: !0 },
    );
    class o {
      disable() {
        throw r;
      }
      getStore() {}
      run() {
        throw r;
      }
      exit() {
        throw r;
      }
      enterWith() {
        throw r;
      }
      static bind(t) {
        return t;
      }
    }
    let l = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
    function s() {
      return l ? new l() : new o();
    }
    function c(t) {
      return l ? l.bind(t) : o.bind(t);
    }
    function h() {
      return l
        ? l.snapshot()
        : function (t, ...e) {
            return t(...e);
          };
    }
