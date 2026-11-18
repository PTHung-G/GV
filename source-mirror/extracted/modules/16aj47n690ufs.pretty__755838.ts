// Reconstructed from 16aj47n690ufs.pretty.js, module 755838.
// deps: none
// exports: none


"use strict";
    var n = t.r(271645),
      a =
        "function" == typeof Object.is
          ? Object.is
          : function (t, e) {
              return (
                (t === e && (0 !== t || 1 / t == 1 / e)) || (t != t && e != e)
              );
            },
      i = n.useState,
      l = n.useEffect,
      s = n.useLayoutEffect,
      o = n.useDebugValue;
    function u(t) {
      var e = t.getSnapshot;
      t = t.value;
      try {
        var r = e();
        return !a(t, r);
      } catch (t) {
        return !0;
      }
    }
    var c =
      "u" < typeof window ||
      void 0 === window.document ||
      void 0 === window.document.createElement
        ? function (t, e) {
            return e();
          }
        : function (t, e) {
            var r = e(),
              n = i({ inst: { value: r, getSnapshot: e } }),
              a = n[0].inst,
              c = n[1];
            return (
              s(
                function () {
                  ((a.value = r), (a.getSnapshot = e), u(a) && c({ inst: a }));
                },
                [t, r, e],
              ),
              l(
                function () {
                  return (
                    u(a) && c({ inst: a }),
                    t(function () {
                      u(a) && c({ inst: a });
                    })
                  );
                },
                [t],
              ),
              o(r),
              r
            );
          };
    r.useSyncExternalStore =
      void 0 !== n.useSyncExternalStore ? n.useSyncExternalStore : c;
