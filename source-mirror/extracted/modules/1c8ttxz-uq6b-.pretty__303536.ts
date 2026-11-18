// Reconstructed from 1c8ttxz-uq6b-.pretty.js, module 303536.
// deps: m271645
// exports: useFocusGuards
export { u as "useFocusGuards" };

"use strict";
    var t = m271645,
      n = Object.defineProperty,
      r = (e, t) => n(e, "name", { value: t, configurable: !0 }),
      o = 0,
      i = null;
    function u() {
      t.useEffect(() => {
        i || (i = { start: a(), end: a() });
        let { start: e, end: t } = i;
        return (
          document.body.firstElementChild !== e &&
            document.body.insertAdjacentElement("afterbegin", e),
          document.body.lastElementChild !== t &&
            document.body.insertAdjacentElement("beforeend", t),
          o++,
          () => {
            (1 === o && (i?.start.remove(), i?.end.remove(), (i = null)),
              (o = Math.max(0, o - 1)));
          }
        );
      }, []);
    }
    function a() {
      let e = document.createElement("span");
      return (
        e.setAttribute("data-radix-focus-guard", ""),
        (e.tabIndex = 0),
        (e.style.outline = "none"),
        (e.style.opacity = "0"),
        (e.style.position = "fixed"),
        (e.style.pointerEvents = "none"),
        e
      );
    }
    (r(function (e) {
      return (u(), e.children);
    }, "FocusGuards"),
      r(u, "useFocusGuards"),
      r(a, "createFocusGuard"),
      );
