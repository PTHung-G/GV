// Reconstructed from 1c8ttxz-uq6b-.pretty.js, module 186312.
// deps: none
// exports: hideOthers
export { function (e, t, n) { void 0 === n && (n = "data-aria-hidden"); var r = Array.from(Array.isArray(e) ? e : [e]), o = t || ("u" < typeof document ? null : (Array.isArray(e) ? e[0] : e).ownerDocument.body); return o ? (r.push.apply( r, Array.from(o.querySelectorAll("[aria-live], script")), ), u(r, o, n, "aria-hidden")) : function () { return null; }; } as "hideOthers" };

"use strict";
    var t = new WeakMap(),
      n = new WeakMap(),
      r = {},
      o = 0,
      i = function (e) {
        return e && (e.host || i(e.parentNode));
      },
      u = function (e, u, a, c) {
        var s = (Array.isArray(e) ? e : [e])
          .map(function (e) {
            if (u.contains(e)) return e;
            var t = i(e);
            return t && u.contains(t)
              ? t
              : (console.error(
                  "aria-hidden",
                  e,
                  "in not contained inside",
                  u,
                  ". Doing nothing",
                ),
                null);
          })
          .filter(function (e) {
            return !!e;
          });
        r[a] || (r[a] = new WeakMap());
        var l = r[a],
          d = [],
          f = new Set(),
          m = new Set(s),
          v = function (e) {
            !e || f.has(e) || (f.add(e), v(e.parentNode));
          };
        s.forEach(v);
        var p = function (e) {
          !e ||
            m.has(e) ||
            Array.prototype.forEach.call(e.children, function (e) {
              if (f.has(e)) p(e);
              else
                try {
                  var r = e.getAttribute(c),
                    o = null !== r && "false" !== r,
                    i = (t.get(e) || 0) + 1,
                    u = (l.get(e) || 0) + 1;
                  (t.set(e, i),
                    l.set(e, u),
                    d.push(e),
                    1 === i && o && n.set(e, !0),
                    1 === u && e.setAttribute(a, "true"),
                    o || e.setAttribute(c, "true"));
                } catch (t) {
                  console.error("aria-hidden: cannot operate on ", e, t);
                }
            });
        };
        return (
          p(u),
          f.clear(),
          o++,
          function () {
            (d.forEach(function (e) {
              var r = t.get(e) - 1,
                o = l.get(e) - 1;
              (t.set(e, r),
                l.set(e, o),
                r || (n.has(e) || e.removeAttribute(c), n.delete(e)),
                o || e.removeAttribute(a));
            }),
              --o ||
                ((t = new WeakMap()),
                (t = new WeakMap()),
                (n = new WeakMap()),
                (r = {})));
          }
        );
      };
    ;
