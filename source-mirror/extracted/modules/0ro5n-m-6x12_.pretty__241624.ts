// Reconstructed from 0ro5n-m-6x12_.pretty.js, module 241624.
// deps: m843476, m271645
// exports: none


"use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      GracefulDegradeBoundary: function () {
        return i;
      },
      default: function () {
        return u;
      },
    };
    for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
    let a = m843476,
      l = m271645;
    class i extends l.Component {
      constructor(e) {
        (super(e),
          (this.state = { hasError: !1 }),
          (this.rootHtml = ""),
          (this.htmlAttributes = {}),
          (this.htmlRef = (0, l.createRef)()));
      }
      static getDerivedStateFromError(e) {
        return { hasError: !0 };
      }
      componentDidMount() {
        let e = this.htmlRef.current;
        this.state.hasError &&
          e &&
          Object.entries(this.htmlAttributes).forEach(([t, r]) => {
            e.setAttribute(t, r);
          });
      }
      render() {
        let { hasError: e } = this.state;
        return ("u" > typeof window &&
          !this.rootHtml &&
          ((this.rootHtml = document.documentElement.innerHTML),
          (this.htmlAttributes = (function (e) {
            let t = {};
            for (let r = 0; r < e.attributes.length; r++) {
              let n = e.attributes[r];
              t[n.name] = n.value;
            }
            return t;
          })(document.documentElement))),
        e)
          ? (0, a.jsx)("html", {
              ref: this.htmlRef,
              suppressHydrationWarning: !0,
              dangerouslySetInnerHTML: { __html: this.rootHtml },
            })
          : this.props.children;
      }
    }
    let u = i;
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
