// Reconstructed from 0ro5n-m-6x12_.pretty.js, module 302023.
// deps: m247167, m816565
// exports: none


"use strict";
    (m247167, Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      default: function () {
        return l;
      },
      getProperError: function () {
        return i;
      },
    };
    for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
    let a = m816565;
    function l(e) {
      return (
        "object" == typeof e && null !== e && "name" in e && "message" in e
      );
    }
    function i(e) {
      
      return l(e)
        ? e
        : Object.defineProperty(
            Error(
              (0, a.isPlainObject)(e)
                ? ((t = new WeakSet()),
                  JSON.stringify(e, (e, r) => {
                    if ("object" == typeof r && null !== r) {
                      if (t.has(r)) return "[Circular]";
                      t.add(r);
                    }
                    return r;
                  }))
                : e + "",
            ),
            "__NEXT_ERROR_CODE",
            { value: "E394", enumerable: !1, configurable: !0 },
          );
    }
