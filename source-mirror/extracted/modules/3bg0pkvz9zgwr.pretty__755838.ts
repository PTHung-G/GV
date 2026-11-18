// Reconstructed from 3bg0pkvz9zgwr.pretty.js, module 755838.
// deps: none
// exports: none


"use strict";
    var a = t.r(271645),
      i =
        "function" == typeof Object.is
          ? Object.is
          : function (t, e) {
              return (
                (t === e && (0 !== t || 1 / t == 1 / e)) || (t != t && e != e)
              );
            },
      r = a.useState,
      o = a.useEffect,
      l = a.useLayoutEffect,
      s = a.useDebugValue;
    function c(t) {
      var e = t.getSnapshot;
      t = t.value;
      try {
        var n = e();
        return !i(t, n);
      } catch (t) {
        return !0;
      }
    }
    var h =
      "u" < typeof window ||
      void 0 === window.document ||
      void 0 === window.document.createElement
        ? function (t, e) {
            return e();
          }
        : function (t, e) {
            var n = e(),
              a = r({ inst: { value: n, getSnapshot: e } }),
              i = a[0].inst,
              h = a[1];
            return (
              l(
                function () {
                  ((i.value = n), (i.getSnapshot = e), c(i) && h({ inst: i }));
                },
                [t, n, e],
              ),
              o(
                function () {
                  return (
                    c(i) && h({ inst: i }),
                    t(function () {
                      c(i) && h({ inst: i });
                    })
                  );
                },
                [t],
              ),
              s(n),
              n
            );
          };
    n.useSyncExternalStore =
      void 0 !== a.useSyncExternalStore ? a.useSyncExternalStore : h;
