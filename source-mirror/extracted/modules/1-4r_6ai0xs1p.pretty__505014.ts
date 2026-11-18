// Reconstructed from 1-4r_6ai0xs1p.pretty.js, module 505014.
// deps: m271645
// exports: mergeClasses, default
export { t as "mergeClasses" };
export { l as "default" };

"use strict";
    let t = (...e) =>
      e
        .filter((e, t, r) => !!e && "" !== e.trim() && r.indexOf(e) === t)
        .join(" ")
        .trim();
    ;
    var r = m271645,
      n = {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      };
    let o = (0, r.createContext)({}),
      l = (0, r.forwardRef)(
        (
          {
            color: e,
            size: l,
            strokeWidth: i,
            absoluteStrokeWidth: a,
            className: s = "",
            children: u,
            iconNode: c,
            ...f
          },
          d,
        ) => {
          let {
              size: p = 24,
              strokeWidth: h = 2,
              absoluteStrokeWidth: m = !1,
              color: g = "currentColor",
              className: b = "",
            } = (0, r.useContext)(o) ?? {},
            v = (a ?? m) ? (24 * Number(i ?? h)) / Number(l ?? p) : (i ?? h);
          return (0, r.createElement)(
            "svg",
            {
              ref: d,
              ...n,
              width: l ?? p ?? n.width,
              height: l ?? p ?? n.height,
              stroke: e ?? g,
              strokeWidth: v,
              className: t("lucide", b, s),
              ...(!u &&
                !((e) => {
                  for (let t in e)
                    if (t.startsWith("aria-") || "role" === t || "title" === t)
                      return !0;
                  return !1;
                })(f) && { "aria-hidden": "true" }),
              ...f,
            },
            [
              ...c.map(([e, t]) => (0, r.createElement)(e, t)),
              ...(Array.isArray(u) ? u : [u]),
            ],
          );
        },
      );
    ;
