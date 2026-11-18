// Reconstructed from 1yutqy473-l5a.pretty.js, module 63270.
// deps: m843476, m271645, m705844, m30030, m30207, m934620, m248425, m97456, m647163
// exports: Avatar, AvatarFallback, AvatarImage, Fallback, Image, Root, createAvatarScope, Avatar, AvatarFallback, AvatarImage
export { x as "Avatar" };
export { b as "AvatarFallback" };
export { m as "AvatarImage" };
export { b as "Fallback" };
export { m as "Image" };
export { x as "Root" };
export { h as "createAvatarScope" };
export { function ({ className: e, ...n }) { return (0, t.jsx)(j.Root, { "data-slot": "avatar", className: (0, M.cn)( "relative flex size-9 shrink-0 overflow-hidden rounded-full", e, ), ...n, }); } as "Avatar" };
export { function ({ className: e, ...n }) { return (0, t.jsx)(j.Fallback, { "data-slot": "avatar-fallback", className: (0, M.cn)( "flex size-full items-center justify-center rounded-full bg-[#f1f1ef] text-sm font-medium text-[#2383e2]", e, ), ...n, }); } as "AvatarFallback" };
export { function ({ className: e, ...n }) { return (0, t.jsx)(j.Image, { "data-slot": "avatar-image", referrerPolicy: "no-referrer", className: (0, M.cn)("aspect-square size-full object-cover", e), ...n, }); } as "AvatarImage" };

"use strict";
    var t = m843476,
      n = m271645,
      r = m705844,
      a = m30030,
      i = m30207,
      l = m934620,
      s = m248425,
      o = Object.defineProperty,
      c = (e, t) => o(e, "name", { value: t, configurable: !0 }),
      d = "Avatar",
      [u, h] = (0, a.createContextScope)(d),
      p = [0, () => void 0],
      [f, g] = u(d),
      x = n.forwardRef(
        c(function (e, r) {
          let { __scopeAvatar: a, ...i } = e,
            [l, o] = n.useState("idle"),
            [c, d] = k();
          return (0, t.jsx)(f, {
            scope: a,
            imageLoadingStatus: l,
            setImageLoadingStatus: o,
            imageCount: c,
            setImageCount: d,
            children: (0, t.jsx)(s.Primitive.span, { ...i, ref: r }),
          });
        }, "Avatar"),
      ),
      m = n.forwardRef(
        c(function (e, r) {
          let { __scopeAvatar: a, src: o, onLoadingStatusChange: c, ...d } = e,
            u = g("AvatarImage", a);
          w(u.setImageCount);
          let h = y(o, {
              referrerPolicy: d.referrerPolicy,
              crossOrigin: d.crossOrigin,
              loadingStatus: u.imageLoadingStatus,
              setLoadingStatus: u.setImageLoadingStatus,
            }),
            p = (0, i.useCallbackRef)((e) => {
              c?.(e);
            }),
            f = n.useRef(h);
          return (
            (0, l.useLayoutEffect)(() => {
              let e = f.current;
              ((f.current = h), h !== e && p(h));
            }, [h, p]),
            "loaded" === h
              ? (0, t.jsx)(s.Primitive.img, { ...d, ref: r, src: o })
              : null
          );
        }, "AvatarImage"),
      ),
      b = n.forwardRef(
        c(function (e, r) {
          let { __scopeAvatar: a, delayMs: i, ...l } = e,
            o = g("AvatarFallback", a),
            [c, d] = n.useState(void 0 === i);
          return (
            n.useEffect(() => {
              if (void 0 !== i) {
                let e = window.setTimeout(() => d(!0), i);
                return () => window.clearTimeout(e);
              }
            }, [i]),
            c && "loaded" !== o.imageLoadingStatus
              ? (0, t.jsx)(s.Primitive.span, { ...l, ref: r })
              : null
          );
        }, "AvatarFallback"),
      );
    function y(
      e,
      {
        loadingStatus: t,
        setLoadingStatus: n,
        referrerPolicy: r,
        crossOrigin: a,
      },
    ) {
      return (
        (0, l.useLayoutEffect)(() => {
          if (!e) return void n("error");
          let t = new window.Image(),
            i = c((e) => {
              n(v(e.currentTarget));
            }, "handleLoad"),
            l = c(() => n("error"), "handleError");
          return (
            t.addEventListener("load", i),
            t.addEventListener("error", l),
            r && (t.referrerPolicy = r),
            (t.crossOrigin = a ?? null),
            (t.src = e),
            n(v(t)),
            () => {
              (t.removeEventListener("load", i),
                t.removeEventListener("error", l),
                n("idle"));
            }
          );
        }, [e, a, r, n]),
        t
      );
    }
    function v(e) {
      return e.complete ? (e.naturalWidth > 0 ? "loaded" : "error") : "loading";
    }
    function k() {
      let e = p;
      if (r.IS_DEVELOPMENT) {
        let [t] = (e = n.useState(0)),
          r = n.useRef(!1);
        n.useEffect(() => {
          t > 1 &&
            !r.current &&
            ((r.current = !0),
            console.warn(
              "Avatar: Only one `Avatar.Image` component should be rendered per `Avatar.Root`, but multiple were detected. This will lead to unexpected behavior.",
            ));
        }, [t]);
      }
      return e;
    }
    function w(e) {
      r.IS_DEVELOPMENT &&
        n.useEffect(
          () => (
            e((e) => e + 1),
            () => {
              e((e) => e - 1);
            }
          ),
          [e],
        );
    }
    (c(y, "useImageLoadingStatus"),
      c(v, "getImageLoadingStatus"),
      c(k, "useImageCount"),
      c(w, "useUpdateImageCount"),
      );
    var j = m97456,
      j = j,
      M = m647163;
    ;
