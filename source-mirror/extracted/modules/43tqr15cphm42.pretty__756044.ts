// Reconstructed from 43tqr15cphm42.pretty.js, module 756044.
// deps: m10552, m827121
// exports: jsx, Bold, default, Document, default, HardBreak, default, Italic, default, Link, default, Paragraph, default, Strike, default
export { s as "jsx" };
export { h as "Bold" };
export { h as "default" };
export { u as "Document" };
export { u as "default" };
export { p as "HardBreak" };
export { p as "default" };
export { v as "Italic" };
export { v as "default" };
export { tn as "Link" };
export { tn as "default" };
export { ti as "Paragraph" };
export { ti as "default" };
export { tl as "Strike" };
export { tl as "default" };

"use strict";
    var t = m10552;
    let n = new WeakSet(),
      r = new WeakSet();
    function i(e) {
      return (n.add(e), e);
    }
    function o(e) {
      return Array.isArray(e) && n.has(e);
    }
    let s = (e, t) =>
      (function (e, t) {
        if ("slot" === e) return 0;
        if (e instanceof Function) {
          let n = e(t);
          return !Array.isArray(n) || o(n) || r.has(n) ? n : i(n);
        }
        let { children: n, ...s } = null != t ? t : {};
        if ("svg" === e)
          throw Error(
            "SVG elements are not supported in the JSX syntax, use the array syntax instead",
          );
        if (Array.isArray(n)) {
          if (o(n)) return i([e, s, n]);
          if (0 === n.length) return i([e, s]);
          let t = (function e(t) {
            return t.flatMap((t) =>
              null == t
                ? []
                : Array.isArray(t) && r.has(t) && !o(t)
                  ? e(t)
                  : [t],
            );
          })(n);
          return 0 === t.length ? i([e, s]) : i([e, s, ...t]);
        }
        return null != n ? i([e, s, n]) : i([e, s]);
      })(e, t);
    ;
    let l = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/,
      a = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g,
      d = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/,
      c = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g,
      h = t.Mark.create({
        name: "bold",
        addOptions: () => ({ HTMLAttributes: {} }),
        parseHTML() {
          return [
            { tag: "strong" },
            {
              tag: "b",
              getAttrs: (e) => "normal" !== e.style.fontWeight && null,
            },
            {
              style: "font-weight=400",
              clearMark: (e) => e.type.name === this.name,
            },
            {
              style: "font-weight",
              getAttrs: (e) => /^(bold(er)?|[5-9]\d{2,})$/.test(e) && null,
            },
          ];
        },
        renderHTML({ HTMLAttributes: e }) {
          return s("strong", {
            ...(0, t.mergeAttributes)(this.options.HTMLAttributes, e),
            children: s("slot", {}),
          });
        },
        markdownTokenName: "strong",
        parseMarkdown: (e, t) =>
          t.applyMark("bold", t.parseInline(e.tokens || [])),
        markdownOptions: {
          htmlReopen: { open: "<strong>", close: "</strong>" },
        },
        renderMarkdown: (e, t) => `**${t.renderChildren(e)}**`,
        addCommands() {
          return {
            setBold:
              () =>
              ({ commands: e }) =>
                e.setMark(this.name),
            toggleBold:
              () =>
              ({ commands: e }) =>
                e.toggleMark(this.name),
            unsetBold:
              () =>
              ({ commands: e }) =>
                e.unsetMark(this.name),
          };
        },
        addKeyboardShortcuts() {
          return {
            "Mod-b": () => this.editor.commands.toggleBold(),
            "Mod-B": () => this.editor.commands.toggleBold(),
          };
        },
        addInputRules() {
          return [
            (0, t.markInputRule)({ find: l, type: this.type }),
            (0, t.markInputRule)({ find: d, type: this.type }),
          ];
        },
        addPasteRules() {
          return [
            (0, t.markPasteRule)({ find: a, type: this.type }),
            (0, t.markPasteRule)({ find: c, type: this.type }),
          ];
        },
      });
    ;
    let u = t.Node.create({
      name: "doc",
      topNode: !0,
      content: "block+",
      renderMarkdown: (e, t) =>
        e.content ? t.renderChildren(e.content, "\n\n") : "",
    });
    ;
    let p = t.Node.create({
      name: "hardBreak",
      markdownTokenName: "br",
      addOptions: () => ({ keepMarks: !0, HTMLAttributes: {} }),
      inline: !0,
      group: "inline",
      selectable: !1,
      linebreakReplacement: !0,
      parseHTML: () => [{ tag: "br" }],
      renderHTML({ HTMLAttributes: e }) {
        return ["br", (0, t.mergeAttributes)(this.options.HTMLAttributes, e)];
      },
      renderText: () => "\n",
      renderMarkdown: () => `  
`,
      parseMarkdown: () => ({ type: "hardBreak" }),
      addCommands() {
        return {
          setHardBreak:
            () =>
            ({ commands: e, chain: t, state: n, editor: r }) =>
              e.first([
                () => e.exitCode(),
                () =>
                  e.command(() => {
                    let { selection: e, storedMarks: i } = n;
                    if (e.$from.parent.type.spec.isolating) return !1;
                    let { keepMarks: o } = this.options,
                      { splittableMarks: s } = r.extensionManager,
                      l = i || (e.$to.parentOffset && e.$from.marks());
                    return t()
                      .insertContent({ type: this.name })
                      .command(({ tr: e, dispatch: t }) => {
                        if (t && l && o) {
                          let t = l.filter((e) => s.includes(e.type.name));
                          e.ensureMarks(t);
                        }
                        return !0;
                      })
                      .scrollIntoView()
                      .run();
                  }),
              ]),
        };
      },
      addKeyboardShortcuts() {
        return {
          "Mod-Enter": () => this.editor.commands.setHardBreak(),
          "Shift-Enter": () => this.editor.commands.setHardBreak(),
        };
      },
    });
    ;
    let f = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/,
      m = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g,
      g = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/,
      y = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g,
      v = t.Mark.create({
        name: "italic",
        addOptions: () => ({ HTMLAttributes: {} }),
        parseHTML() {
          return [
            { tag: "em" },
            {
              tag: "i",
              getAttrs: (e) => "normal" !== e.style.fontStyle && null,
            },
            {
              style: "font-style=normal",
              clearMark: (e) => e.type.name === this.name,
            },
            { style: "font-style=italic" },
          ];
        },
        renderHTML({ HTMLAttributes: e }) {
          return [
            "em",
            (0, t.mergeAttributes)(this.options.HTMLAttributes, e),
            0,
          ];
        },
        addCommands() {
          return {
            setItalic:
              () =>
              ({ commands: e }) =>
                e.setMark(this.name),
            toggleItalic:
              () =>
              ({ commands: e }) =>
                e.toggleMark(this.name),
            unsetItalic:
              () =>
              ({ commands: e }) =>
                e.unsetMark(this.name),
          };
        },
        markdownTokenName: "em",
        parseMarkdown: (e, t) =>
          t.applyMark("italic", t.parseInline(e.tokens || [])),
        markdownOptions: { htmlReopen: { open: "<em>", close: "</em>" } },
        renderMarkdown: (e, t) => `*${t.renderChildren(e)}*`,
        addKeyboardShortcuts() {
          return {
            "Mod-i": () => this.editor.commands.toggleItalic(),
            "Mod-I": () => this.editor.commands.toggleItalic(),
          };
        },
        addInputRules() {
          return [
            (0, t.markInputRule)({ find: f, type: this.type }),
            (0, t.markInputRule)({ find: g, type: this.type }),
          ];
        },
        addPasteRules() {
          return [
            (0, t.markPasteRule)({ find: m, type: this.type }),
            (0, t.markPasteRule)({ find: y, type: this.type }),
          ];
        },
      });
    ;
    let w = "numeric",
      b = "ascii",
      k = "alpha",
      x = "asciinumeric",
      S = "alphanumeric",
      M = "domain",
      C = "emoji",
      E = "whitespace";
    function O(e, t, n) {
      for (let r in (t[w] && ((t[x] = !0), (t[S] = !0)),
      t[b] && ((t[x] = !0), (t[k] = !0)),
      t[x] && (t[S] = !0),
      t[k] && (t[S] = !0),
      t[S] && (t[M] = !0),
      t[C] && (t[M] = !0),
      t)) {
        let t = (r in n || (n[r] = []), n[r]);
        0 > t.indexOf(e) && t.push(e);
      }
    }
    function T(e = null) {
      ((this.j = {}), (this.jr = []), (this.jd = null), (this.t = e));
    }
    ((T.groups = {}),
      (T.prototype = {
        accepts() {
          return !!this.t;
        },
        go(e) {
          let t = this.j[e];
          if (t) return t;
          for (let t = 0; t < this.jr.length; t++) {
            let n = this.jr[t][0],
              r = this.jr[t][1];
            if (r && n.test(e)) return r;
          }
          return this.jd;
        },
        has(e, t = !1) {
          return t ? e in this.j : !!this.go(e);
        },
        ta(e, t, n, r) {
          for (let i = 0; i < e.length; i++) this.tt(e[i], t, n, r);
        },
        tr(e, t, n, r) {
          
          return (
            (r = r || T.groups),
            t && t.j ? (i = t) : ((i = new T(t)), n && r && O(t, n, r)),
            this.jr.push([e, i]),
            i
          );
        },
        ts(e, t, n, r) {
          let i = this,
            o = e.length;
          if (!o) return i;
          for (let t = 0; t < o - 1; t++) i = i.tt(e[t]);
          return i.tt(e[o - 1], t, n, r);
        },
        tt(e, t, n, r) {
          if (((r = r || T.groups), t && t.j)) return ((this.j[e] = t), t);
          let i,
            o = this.go(e);
          return (
            o
              ? (Object.assign((i = new T()).j, o.j),
                i.jr.push.apply(i.jr, o.jr),
                (i.jd = o.jd),
                (i.t = o.t))
              : (i = new T()),
            t &&
              (r &&
                (i.t && "string" == typeof i.t
                  ? O(
                      t,
                      Object.assign(
                        (function (e, t) {
                          let n = {};
                          for (let r in t) t[r].indexOf(e) >= 0 && (n[r] = !0);
                          return n;
                        })(i.t, r),
                        n,
                      ),
                      r,
                    )
                  : n && O(t, n, r)),
              (i.t = t)),
            (this.j[e] = i),
            i
          );
        },
      }));
    let N = (e, t, n, r, i) => e.ta(t, n, r, i),
      A = (e, t, n, r, i) => e.tr(t, n, r, i),
      D = (e, t, n, r, i) => e.ts(t, n, r, i),
      R = (e, t, n, r, i) => e.tt(t, n, r, i),
      P = "WORD",
      I = "UWORD",
      z = "ASCIINUMERICAL",
      L = "ALPHANUMERICAL",
      B = "LOCALHOST",
      $ = "UTLD",
      j = "SCHEME",
      V = "SLASH_SCHEME",
      F = "OPENBRACE",
      H = "CLOSEBRACE",
      W = "OPENBRACKET",
      q = "CLOSEBRACKET",
      U = "OPENPAREN",
      K = "CLOSEPAREN",
      _ = "OPENANGLEBRACKET",
      J = "CLOSEANGLEBRACKET",
      G = "FULLWIDTHLEFTPAREN",
      Y = "FULLWIDTHRIGHTPAREN",
      Q = "LEFTCORNERBRACKET",
      X = "RIGHTCORNERBRACKET",
      Z = "LEFTWHITECORNERBRACKET",
      ee = "RIGHTWHITECORNERBRACKET",
      et = "FULLWIDTHLESSTHAN",
      en = "FULLWIDTHGREATERTHAN",
      er = "AMPERSAND",
      ei = "APOSTROPHE",
      eo = "ASTERISK",
      es = "BACKSLASH",
      el = "BACKTICK",
      ea = "CARET",
      ed = "COLON",
      ec = "COMMA",
      eh = "DOLLAR",
      eu = "EQUALS",
      ep = "EXCLAMATION",
      ef = "HYPHEN",
      em = "PERCENT",
      eg = "PIPE",
      ey = "PLUS",
      ev = "POUND",
      ew = "QUERY",
      eb = "QUOTE",
      ek = "FULLWIDTHMIDDLEDOT",
      ex = "SEMI",
      eS = "SLASH",
      eM = "TILDE",
      eC = "UNDERSCORE",
      eE = "EMOJI";
    var eO = Object.freeze({
      __proto__: null,
      ALPHANUMERICAL: L,
      AMPERSAND: er,
      APOSTROPHE: ei,
      ASCIINUMERICAL: z,
      ASTERISK: eo,
      AT: "AT",
      BACKSLASH: es,
      BACKTICK: el,
      CARET: ea,
      CLOSEANGLEBRACKET: J,
      CLOSEBRACE: H,
      CLOSEBRACKET: q,
      CLOSEPAREN: K,
      COLON: ed,
      COMMA: ec,
      DOLLAR: eh,
      DOT: "DOT",
      EMOJI: eE,
      EQUALS: eu,
      EXCLAMATION: ep,
      FULLWIDTHGREATERTHAN: en,
      FULLWIDTHLEFTPAREN: G,
      FULLWIDTHLESSTHAN: et,
      FULLWIDTHMIDDLEDOT: ek,
      FULLWIDTHRIGHTPAREN: Y,
      HYPHEN: ef,
      LEFTCORNERBRACKET: Q,
      LEFTWHITECORNERBRACKET: Z,
      LOCALHOST: B,
      NL: "NL",
      NUM: "NUM",
      OPENANGLEBRACKET: _,
      OPENBRACE: F,
      OPENBRACKET: W,
      OPENPAREN: U,
      PERCENT: em,
      PIPE: eg,
      PLUS: ey,
      POUND: ev,
      QUERY: ew,
      QUOTE: eb,
      RIGHTCORNERBRACKET: X,
      RIGHTWHITECORNERBRACKET: ee,
      SCHEME: j,
      SEMI: ex,
      SLASH: eS,
      SLASH_SCHEME: V,
      SYM: "SYM",
      TILDE: eM,
      TLD: "TLD",
      UNDERSCORE: eC,
      UTLD: $,
      UWORD: I,
      WORD: P,
      WS: "WS",
    });
    let eT = /[a-z]/,
      eN = /\p{L}/u,
      eA = /\p{Emoji}/u,
      eD = /\d/,
      eR = /\s/,
      eP = null,
      eI = null;
    function ez(e, t) {
      let n = (function (e) {
          let t = [],
            n = e.length,
            r = 0;
          for (; r < n; ) {
            let i,
              o = e.charCodeAt(r),
              s =
                o < 55296 ||
                o > 56319 ||
                r + 1 === n ||
                (i = e.charCodeAt(r + 1)) < 56320 ||
                i > 57343
                  ? e[r]
                  : e.slice(r, r + 2);
            (t.push(s), (r += s.length));
          }
          return t;
        })(t.replace(/[A-Z]/g, (e) => e.toLowerCase())),
        r = n.length,
        i = [],
        o = 0,
        s = 0;
      for (; s < r; ) {
        let l = e,
          a = null,
          d = 0,
          c = null,
          h = -1,
          u = -1;
        for (; s < r && (a = l.go(n[s])); )
          ((l = a).accepts()
            ? ((h = 0), (u = 0), (c = l))
            : h >= 0 && ((h += n[s].length), u++),
            (d += n[s].length),
            (o += n[s].length),
            s++);
        ((o -= h),
          (s -= u),
          (d -= h),
          i.push({ t: c.t, v: t.slice(o - d, o), s: o - d, e: o }));
      }
      return i;
    }
    function eL(e, t, n, r, i) {
      let o,
        s = t.length;
      for (let n = 0; n < s - 1; n++) {
        let s = t[n];
        (e.j[s]
          ? (o = e.j[s])
          : (((o = new T(r)).jr = i.slice()), (e.j[s] = o)),
          (e = o));
      }
      return (((o = new T(n)).jr = i.slice()), (e.j[t[s - 1]] = o), o);
    }
    function eB(e) {
      let t = [],
        n = [],
        r = 0;
      for (; r < e.length; ) {
        let i = 0;
        for (; "0123456789".indexOf(e[r + i]) >= 0; ) i++;
        if (i > 0) {
          t.push(n.join(""));
          for (let t = parseInt(e.substring(r, r + i), 10); t > 0; t--) n.pop();
          r += i;
        } else (n.push(e[r]), r++);
      }
      return t;
    }
    let e$ = {
      defaultProtocol: "http",
      events: null,
      format: eV,
      formatHref: eV,
      nl2br: !1,
      tagName: "a",
      target: null,
      rel: null,
      validate: !0,
      truncate: 1 / 0,
      className: null,
      attributes: null,
      ignoreTags: [],
      render: null,
    };
    function ej(e, t = null) {
      let n = Object.assign({}, e$);
      e && (n = Object.assign(n, e instanceof ej ? e.o : e));
      let r = n.ignoreTags,
        i = [];
      for (let e = 0; e < r.length; e++) i.push(r[e].toUpperCase());
      ((this.o = n), t && (this.defaultRender = t), (this.ignoreTags = i));
    }
    function eV(e) {
      return e;
    }
    function eF(e, t) {
      ((this.t = "token"), (this.v = e), (this.tk = t));
    }
    function eH(e, t) {
      class n extends eF {
        constructor(t, n) {
          (super(t, n), (this.t = e));
        }
      }
      for (let e in t) n.prototype[e] = t[e];
      return ((n.t = e), n);
    }
    ((ej.prototype = {
      o: e$,
      ignoreTags: [],
      defaultRender: (e) => e,
      check(e) {
        return this.get("validate", e.toString(), e);
      },
      get(e, t, n) {
        let r = null != t,
          i = this.o[e];
        return (
          i &&
            ("object" == typeof i
              ? "function" == typeof (i = n.t in i ? i[n.t] : e$[e]) &&
                r &&
                (i = i(t, n))
              : "function" == typeof i && r && (i = i(t, n.t, n))),
          i
        );
      },
      getObj(e, t, n) {
        let r = this.o[e];
        return ("function" == typeof r && null != t && (r = r(t, n.t, n)), r);
      },
      render(e) {
        let t = e.render(this);
        return (this.get("render", null, e) || this.defaultRender)(t, e.t, e);
      },
    }),
      (eF.prototype = {
        isLink: !1,
        toString() {
          return this.v;
        },
        toHref(e) {
          return this.toString();
        },
        toFormattedString(e) {
          let t = this.toString(),
            n = e.get("truncate", t, this),
            r = e.get("format", t, this);
          return n && r.length > n ? r.substring(0, n) + "…" : r;
        },
        toFormattedHref(e) {
          return e.get(
            "formatHref",
            this.toHref(e.get("defaultProtocol")),
            this,
          );
        },
        startIndex() {
          return this.tk[0].s;
        },
        endIndex() {
          return this.tk[this.tk.length - 1].e;
        },
        toObject(e = e$.defaultProtocol) {
          return {
            type: this.t,
            value: this.toString(),
            isLink: this.isLink,
            href: this.toHref(e),
            start: this.startIndex(),
            end: this.endIndex(),
          };
        },
        toFormattedObject(e) {
          return {
            type: this.t,
            value: this.toFormattedString(e),
            isLink: this.isLink,
            href: this.toFormattedHref(e),
            start: this.startIndex(),
            end: this.endIndex(),
          };
        },
        validate(e) {
          return e.get("validate", this.toString(), this);
        },
        render(e) {
          let t = this.toHref(e.get("defaultProtocol")),
            n = e.get("formatHref", t, this),
            r = e.get("tagName", t, this),
            i = this.toFormattedString(e),
            o = {},
            s = e.get("className", t, this),
            l = e.get("target", t, this),
            a = e.get("rel", t, this),
            d = e.getObj("attributes", t, this),
            c = e.getObj("events", t, this);
          return (
            (o.href = n),
            s && (o.class = s),
            l && (o.target = l),
            a && (o.rel = a),
            d && Object.assign(o, d),
            { tagName: r, attributes: o, content: i, eventListeners: c }
          );
        },
      }));
    let eW = eH("email", {
        isLink: !0,
        toHref() {
          return "mailto:" + this.toString();
        },
      }),
      eq = eH("text"),
      eU = eH("nl"),
      eK = eH("url", {
        isLink: !0,
        toHref(e = e$.defaultProtocol) {
          return this.hasProtocol() ? this.v : `${e}://${this.v}`;
        },
        hasProtocol() {
          let e = this.tk;
          return e.length >= 2 && e[0].t !== B && e[1].t === ed;
        },
      }),
      e_ = (e) => new T(e);
    function eJ(e, t, n) {
      let r = n[0].s,
        i = n[n.length - 1].e;
      return new e(t.slice(r, i), n);
    }
    let eG = ("u" > typeof console && console && console.warn) || (() => {}),
      eY = {
        scanner: null,
        parser: null,
        tokenQueue: [],
        pluginQueue: [],
        customSchemes: [],
        initialized: !1,
      };
    function eQ(e, t = !1) {
      if (
        (eY.initialized &&
          eG(
            `linkifyjs: already initialized - will not register custom scheme "${e}" until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.`,
          ),
        !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(e))
      )
        throw Error(`linkifyjs: incorrect scheme format.
1. Must only contain digits, lowercase ASCII letters or "-"
2. Cannot start or end with "-"
3. "-" cannot repeat`);
      eY.customSchemes.push([e, t]);
    }
    function eX(e) {
      return (
        eY.initialized ||
          (function () {
            eY.scanner = (function (e = []) {
              let t = {};
              T.groups = t;
              let n = new T();
              (null == eP &&
                (eP = eB(
                  "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4w0s2x0a2z0ure5ba0by2idu3namex4d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dad1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2odyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3nd0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rck0msd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0axi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp3ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2oodside6rk0s2ld3w2s1tc1f3xbox3erox4ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2",
                )),
                null == eI &&
                  (eI = eB(
                    "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2",
                  )),
                R(n, "'", ei),
                R(n, "{", F),
                R(n, "}", H),
                R(n, "[", W),
                R(n, "]", q),
                R(n, "(", U),
                R(n, ")", K),
                R(n, "<", _),
                R(n, ">", J),
                R(n, "（", G),
                R(n, "）", Y),
                R(n, "「", Q),
                R(n, "」", X),
                R(n, "『", Z),
                R(n, "』", ee),
                R(n, "＜", et),
                R(n, "＞", en),
                R(n, "&", er),
                R(n, "*", eo),
                R(n, "@", "AT"),
                R(n, "`", el),
                R(n, "^", ea),
                R(n, ":", ed),
                R(n, ",", ec),
                R(n, "$", eh),
                R(n, ".", "DOT"),
                R(n, "=", eu),
                R(n, "!", ep),
                R(n, "-", ef),
                R(n, "%", em),
                R(n, "|", eg),
                R(n, "+", ey),
                R(n, "#", ev),
                R(n, "?", ew),
                R(n, '"', eb),
                R(n, "/", eS),
                R(n, ";", ex),
                R(n, "~", eM),
                R(n, "_", eC),
                R(n, "\\", es),
                R(n, "・", ek));
              let r = A(n, eD, "NUM", { [w]: !0 });
              A(r, eD, r);
              let i = A(r, eT, z, { [x]: !0 }),
                o = A(r, eN, L, { [S]: !0 }),
                s = A(n, eT, P, { [b]: !0 });
              (A(s, eD, i), A(s, eT, s), A(i, eD, i), A(i, eT, i));
              let l = A(n, eN, I, { [k]: !0 });
              (A(l, eT),
                A(l, eD, o),
                A(l, eN, l),
                A(o, eD, o),
                A(o, eT),
                A(o, eN, o));
              let a = R(n, "\n", "NL", { [E]: !0 }),
                d = R(n, "\r", "WS", { [E]: !0 }),
                c = A(n, eR, "WS", { [E]: !0 });
              (R(n, "￼", c),
                R(d, "\n", a),
                R(d, "￼", c),
                A(d, eR, c),
                R(c, "\r"),
                R(c, "\n"),
                A(c, eR, c),
                R(c, "￼", c));
              let h = A(n, eA, eE, { [C]: !0 });
              (R(h, "#"), A(h, eA, h), R(h, "️", h));
              let u = R(h, "‍");
              (R(u, "#"), A(u, eA, h));
              let p = [
                  [eT, s],
                  [eD, i],
                ],
                f = [
                  [eT, null],
                  [eN, l],
                  [eD, o],
                ];
              for (let e = 0; e < eP.length; e++) eL(n, eP[e], "TLD", P, p);
              for (let e = 0; e < eI.length; e++) eL(n, eI[e], $, I, f);
              (O("TLD", { tld: !0, ascii: !0 }, t),
                O($, { utld: !0, alpha: !0 }, t),
                eL(n, "file", j, P, p),
                eL(n, "mailto", j, P, p),
                eL(n, "http", V, P, p),
                eL(n, "https", V, P, p),
                eL(n, "ftp", V, P, p),
                eL(n, "ftps", V, P, p),
                O(j, { scheme: !0, ascii: !0 }, t),
                O(V, { slashscheme: !0, ascii: !0 }, t),
                (e = e.sort((e, t) => (e[0] > t[0] ? 1 : -1))));
              for (let t = 0; t < e.length; t++) {
                let r = e[t][0],
                  i = e[t][1] ? { scheme: !0 } : { slashscheme: !0 };
                (r.indexOf("-") >= 0
                  ? (i[M] = !0)
                  : eT.test(r)
                    ? eD.test(r)
                      ? (i[x] = !0)
                      : (i[b] = !0)
                    : (i[w] = !0),
                  D(n, r, r, i));
              }
              return (
                D(n, "localhost", B, { ascii: !0 }),
                (n.jd = new T("SYM")),
                { start: n, tokens: Object.assign({ groups: t }, eO) }
              );
            })(eY.customSchemes);
            for (let e = 0; e < eY.tokenQueue.length; e++)
              eY.tokenQueue[e][1]({ scanner: eY.scanner });
            eY.parser = (function ({ groups: e }) {
              let t = e.domain.concat([
                  er,
                  eo,
                  "AT",
                  es,
                  el,
                  ea,
                  eh,
                  eu,
                  ef,
                  "NUM",
                  em,
                  eg,
                  ey,
                  ev,
                  eS,
                  "SYM",
                  eM,
                  eC,
                ]),
                n = [
                  ei,
                  ed,
                  ec,
                  "DOT",
                  ep,
                  em,
                  ew,
                  eb,
                  ex,
                  _,
                  J,
                  F,
                  H,
                  q,
                  W,
                  U,
                  K,
                  G,
                  Y,
                  Q,
                  X,
                  Z,
                  ee,
                  et,
                  en,
                ],
                r = [
                  er,
                  ei,
                  eo,
                  es,
                  el,
                  ea,
                  eh,
                  eu,
                  ef,
                  F,
                  H,
                  em,
                  eg,
                  ey,
                  ev,
                  ew,
                  eS,
                  "SYM",
                  eM,
                  eC,
                ],
                i = e_(),
                o = R(i, eM);
              (N(o, r, o), N(o, e.domain, o));
              let s = e_(),
                l = e_(),
                a = e_();
              (N(i, e.domain, s),
                N(i, e.scheme, l),
                N(i, e.slashscheme, a),
                N(s, r, o),
                N(s, e.domain, s));
              let d = R(s, "AT");
              (R(o, "AT", d), R(l, "AT", d), R(a, "AT", d));
              let c = R(o, "DOT");
              (N(c, r, o), N(c, e.domain, o));
              let h = e_();
              (N(d, e.domain, h), N(h, e.domain, h));
              let u = R(h, "DOT");
              N(u, e.domain, h);
              let p = e_(eW);
              (N(u, e.tld, p), N(u, e.utld, p), R(d, B, p));
              let f = R(h, ef);
              (R(f, ef, f),
                N(f, e.domain, h),
                N(p, e.domain, h),
                R(p, "DOT", u),
                R(p, ef, f));
              let m = R(s, ef),
                g = R(s, "DOT");
              (R(m, ef, m), N(m, e.domain, s), N(g, r, o), N(g, e.domain, s));
              let y = e_(eK);
              (N(g, e.tld, y),
                N(g, e.utld, y),
                N(y, e.domain, s),
                N(y, r, o),
                R(y, "DOT", g),
                R(y, ef, m),
                R(y, "AT", d));
              let v = R(y, ed),
                w = e_(eK);
              N(v, e.numeric, w);
              let b = e_(eK),
                k = e_();
              (N(b, t, b),
                N(b, n, k),
                N(k, t, b),
                N(k, n, k),
                R(y, eS, b),
                R(w, eS, b));
              let x = R(l, ed),
                S = R(a, ed),
                M = R(S, eS),
                C = R(M, eS);
              (N(l, e.domain, s),
                R(l, "DOT", g),
                R(l, ef, m),
                N(a, e.domain, s),
                R(a, "DOT", g),
                R(a, ef, m),
                N(x, e.domain, b),
                R(x, eS, b),
                R(x, ew, b),
                N(C, e.domain, b),
                N(C, t, b),
                R(C, eS, b));
              let E = [
                [F, H],
                [W, q],
                [U, K],
                [_, J],
                [G, Y],
                [Q, X],
                [Z, ee],
                [et, en],
              ];
              for (let e = 0; e < E.length; e++) {
                let [r, i] = E[e],
                  o = R(b, r);
                R(k, r, o);
                let s = e_(eK);
                N(o, t, s);
                let l = e_();
                (N(o, n, l),
                  R(o, i, b),
                  N(s, t, s),
                  N(s, n, l),
                  N(l, t, s),
                  N(l, n, l),
                  R(s, i, b),
                  R(l, i, b));
              }
              return (R(i, B, y), R(i, "NL", eU), { start: i, tokens: eO });
            })(eY.scanner.tokens);
            for (let e = 0; e < eY.pluginQueue.length; e++)
              eY.pluginQueue[e][1]({ scanner: eY.scanner, parser: eY.parser });
            eY.initialized = !0;
          })(),
        (function (e, t, n) {
          let r = n.length,
            i = 0,
            o = [],
            s = [];
          for (; i < r; ) {
            let l = e,
              a = null,
              d = null,
              c = 0,
              h = null,
              u = -1;
            for (; i < r && !(a = l.go(n[i].t)); ) s.push(n[i++]);
            for (; i < r && (d = a || l.go(n[i].t)); )
              ((a = null),
                (l = d).accepts() ? ((u = 0), (h = l)) : u >= 0 && u++,
                i++,
                c++);
            if (u < 0) (i -= c) < r && (s.push(n[i]), i++);
            else {
              (s.length > 0 && (o.push(eJ(eq, t, s)), (s = [])),
                (i -= u),
                (c -= u));
              let e = h.t,
                r = n.slice(i - c, i);
              o.push(eJ(e, t, r));
            }
          }
          return (s.length > 0 && o.push(eJ(eq, t, s)), o);
        })(eY.parser.start, e, ez(eY.scanner.start, e))
      );
    }
    function eZ(e, t = null, n = null) {
      if (t && "object" == typeof t) {
        if (n)
          throw Error(`linkifyjs: Invalid link type ${t}; must be a string`);
        ((n = t), (t = null));
      }
      let r = new ej(n),
        i = eX(e),
        o = [];
      for (let e = 0; e < i.length; e++) {
        let n = i[e];
        n.isLink &&
          (!t || n.t === t) &&
          r.check(n) &&
          o.push(n.toFormattedObject(r));
      }
      return o;
    }
    eX.scan = ez;
    var e0 = m827121;
    let e1 = "[\0-   ᠎ -\u2029 　]",
      e2 = new RegExp(e1),
      e3 = RegExp(`${e1}$`),
      e5 = RegExp(e1, "g"),
      e4 =
        /\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)$/,
      e6 =
        /\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)/g;
    function e9(e, t) {
      let n = 0;
      for (let r = t - 1; r >= 0 && "\\" === e[r]; r -= 1) n += 1;
      return n % 2 == 1;
    }
    function e7(e, t, n) {
      
      let [, o, s] = t;
      return (
        !(
          (t.index ? e[t.index - 1] : void 0) === "!" ||
          e9(e, null != (r = t.index) ? r : 0) ||
          (function (e, t) {
            let n = 0,
              r = 0;
            for (; r < t; ) {
              if ("`" !== e[r] || (0 === n && e9(e, r))) {
                r += 1;
                continue;
              }
              let i = 0;
              for (; r < t && "`" === e[r]; ) ((i += 1), (r += 1));
              0 === n ? (n = i) : i === n && (n = 0);
            }
            return n > 0;
          })(e, null != (i = t.index) ? i : 0)
        ) &&
        !!o.trim() &&
        n(s)
      );
    }
    function e8(e) {
      
      let [r, i, o, , s, l, a] = e,
        d = null != (t = null != s ? s : l) ? t : a;
      return {
        index: null != (n = e.index) ? n : 0,
        text: r,
        replaceWith: i,
        data: { href: o, title: d || null, markdown: !0 },
      };
    }
    function te(e) {
      
      return {
        href: null == (t = e.data) ? void 0 : t.href,
        title: null != (n = null == (r = e.data) ? void 0 : r.title) ? n : null,
      };
    }
    function tt(e, t) {
      let n = [
        "http",
        "https",
        "ftp",
        "ftps",
        "mailto",
        "tel",
        "callto",
        "sms",
        "cid",
        "xmpp",
      ];
      return (
        t &&
          t.forEach((e) => {
            let t = "string" == typeof e ? e : e.scheme;
            t && n.push(t);
          }),
        !e ||
          e
            .replace(e5, "")
            .match(
              RegExp(
                `^(?:(?:${n.map((e) => e.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|")}):|[^a-z]|[a-z0-9+.\\-]+(?:[^a-z+.\\-:]|$))`,
                "i",
              ),
            )
      );
    }
    let tn = t.Mark.create({
      name: "link",
      priority: 1e3,
      keepOnSplit: !1,
      exitable: !0,
      onCreate() {
        (this.options.validate &&
          !this.options.shouldAutoLink &&
          ((this.options.shouldAutoLink = this.options.validate),
          console.warn(
            "The `validate` option is deprecated. Rename to the `shouldAutoLink` option instead.",
          )),
          this.options.protocols.forEach((e) => {
            "string" == typeof e ? eQ(e) : eQ(e.scheme, e.optionalSlashes);
          }));
      },
      onDestroy() {
        ((T.groups = {}),
          (eY.scanner = null),
          (eY.parser = null),
          (eY.tokenQueue = []),
          (eY.pluginQueue = []),
          (eY.customSchemes = []),
          (eY.initialized = !1));
      },
      inclusive() {
        return this.options.autolink;
      },
      addOptions: () => ({
        openOnClick: !0,
        enableClickSelection: !1,
        linkOnPaste: !0,
        markdownLinks: !1,
        autolink: !0,
        protocols: [],
        defaultProtocol: "http",
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer nofollow",
          class: null,
        },
        isAllowedUri: (e, t) => !!tt(e, t.protocols),
        validate: (e) => !!e,
        shouldAutoLink: (e) => {
          let t = /^[a-z][a-z0-9+.-]*:\/\//i.test(e),
            n = /^[a-z][a-z0-9+.-]*:/i.test(e);
          if (t || (n && !e.includes("@"))) return !0;
          let r = (e.includes("@") ? e.split("@").pop() : e).split(/[/?#:]/)[0];
          return !/^\d{1,3}(\.\d{1,3}){3}$/.test(r) && !!/\./.test(r);
        },
      }),
      addAttributes() {
        
        return {
          href: { default: null, parseHTML: (e) => e.getAttribute("href") },
          target: {
            default:
              null != (e = this.options.HTMLAttributes.target) ? e : null,
          },
          rel: {
            default: null != (t = this.options.HTMLAttributes.rel) ? t : null,
          },
          class: {
            default: null != (n = this.options.HTMLAttributes.class) ? n : null,
          },
          title: { default: null },
        };
      },
      parseHTML() {
        return [
          {
            tag: "a[href]",
            getAttrs: (e) => {
              let t = e.getAttribute("href");
              return (
                !!t &&
                !!this.options.isAllowedUri(t, {
                  defaultValidate: (e) => !!tt(e, this.options.protocols),
                  protocols: this.options.protocols,
                  defaultProtocol: this.options.defaultProtocol,
                }) &&
                null
              );
            },
          },
        ];
      },
      renderHTML({ HTMLAttributes: e }) {
        return this.options.isAllowedUri(e.href, {
          defaultValidate: (e) => !!tt(e, this.options.protocols),
          protocols: this.options.protocols,
          defaultProtocol: this.options.defaultProtocol,
        })
          ? ["a", (0, t.mergeAttributes)(this.options.HTMLAttributes, e), 0]
          : [
              "a",
              (0, t.mergeAttributes)(this.options.HTMLAttributes, {
                ...e,
                href: "",
              }),
              0,
            ];
      },
      markdownTokenName: "link",
      parseMarkdown: (e, t) =>
        t.applyMark("link", t.parseInline(e.tokens || []), {
          href: e.href,
          title: e.title || null,
        }),
      renderMarkdown: (e, t) => {
        
        let s = null != (n = null == (r = e.attrs) ? void 0 : r.href) ? n : "",
          l = null != (i = null == (o = e.attrs) ? void 0 : o.title) ? i : "",
          a = t.renderChildren(e);
        return l ? `[${a}](${s} "${l}")` : `[${a}](${s})`;
      },
      addCommands() {
        return {
          setLink:
            (e) =>
            ({ chain: t }) => {
              let { href: n } = e;
              return (
                !!this.options.isAllowedUri(n, {
                  defaultValidate: (e) => !!tt(e, this.options.protocols),
                  protocols: this.options.protocols,
                  defaultProtocol: this.options.defaultProtocol,
                }) &&
                t().setMark(this.name, e).setMeta("preventAutolink", !0).run()
              );
            },
          toggleLink:
            (e) =>
            ({ chain: t }) => {
              let { href: n } = e || {};
              return (
                (!n ||
                  !!this.options.isAllowedUri(n, {
                    defaultValidate: (e) => !!tt(e, this.options.protocols),
                    protocols: this.options.protocols,
                    defaultProtocol: this.options.defaultProtocol,
                  })) &&
                t()
                  .toggleMark(this.name, e, { extendEmptyMarkRange: !0 })
                  .setMeta("preventAutolink", !0)
                  .run()
              );
            },
          unsetLink:
            () =>
            ({ chain: e }) =>
              e()
                .unsetMark(this.name, { extendEmptyMarkRange: !0 })
                .setMeta("preventAutolink", !0)
                .run(),
        };
      },
      addInputRules() {
        
        
        return this.options.markdownLinks
          ? [
              ((e = {
                type: this.type,
                isAllowedHref: (e) =>
                  this.options.isAllowedUri(e, {
                    defaultValidate: (e) => !!tt(e, this.options.protocols),
                    protocols: this.options.protocols,
                    defaultProtocol: this.options.defaultProtocol,
                  }),
              }),
              (n = (0, t.markInputRule)({
                find: (t) => {
                  let n = e4.exec(t);
                  return n && e7(t, n, e.isAllowedHref) ? e8(n) : null;
                },
                type: e.type,
                getAttributes: te,
              })),
              new t.InputRule({
                find: n.find,
                handler: (e) => {
                  let t = n.handler(e);
                  return (
                    null !== t &&
                      e.state.tr.steps.length &&
                      e.state.tr.setMeta("preventAutolink", !0),
                    t
                  );
                },
              })),
            ]
          : [];
      },
      addPasteRules() {
        let e = (e) => {
          let t = [];
          if (e) {
            let { protocols: n, defaultProtocol: r } = this.options;
            eZ(e)
              .filter(
                (e) =>
                  e.isLink &&
                  this.options.isAllowedUri(e.value, {
                    defaultValidate: (e) => !!tt(e, n),
                    protocols: n,
                    defaultProtocol: r,
                  }),
              )
              .forEach((e) => {
                this.options.shouldAutoLink(e.value) &&
                  t.push({
                    text: e.value,
                    data: { href: e.href },
                    index: e.start,
                  });
              });
          }
          return t;
        };
        if (this.options.markdownLinks) {
          
          
          return [
            ((n = {
              type: this.type,
              isAllowedHref: (e) =>
                this.options.isAllowedUri(e, {
                  defaultValidate: (e) => !!tt(e, this.options.protocols),
                  protocols: this.options.protocols,
                  defaultProtocol: this.options.defaultProtocol,
                }),
              findPlainUrls: e,
            }),
            (r = (0, t.markPasteRule)({
              find: (e) => {
                
                let i = [];
                for (let t of e.matchAll(e6))
                  e7(e, t, n.isAllowedHref) && i.push(e8(t));
                let o = (
                  null !=
                  (t = null == (r = n.findPlainUrls) ? void 0 : r.call(n, e))
                    ? t
                    : []
                ).filter(
                  (e) =>
                    !i.some(
                      (t) =>
                        t.index < e.index + e.text.length &&
                        e.index < t.index + t.text.length,
                    ),
                );
                return [...i, ...o];
              },
              type: n.type,
              getAttributes: te,
            })),
            new t.PasteRule({
              find: r.find,
              handler: (e) => {
                
                let n = r.handler(e);
                return (
                  null !== n &&
                    e.state.tr.steps.length &&
                    (null == (t = e.match.data) ? void 0 : t.markdown) &&
                    e.state.tr.setMeta("preventAutolink", !0),
                  n
                );
              },
            })),
          ];
        }
        return [
          (0, t.markPasteRule)({
            find: e,
            type: this.type,
            getAttributes: (e) => {
              
              return { href: null == (t = e.data) ? void 0 : t.href };
            },
          }),
        ];
      },
      addProseMirrorPlugins() {
        
        let i = [],
          { protocols: o, defaultProtocol: s } = this.options;
        return (
          this.options.autolink &&
            i.push(
              ((e = {
                type: this.type,
                defaultProtocol: this.options.defaultProtocol,
                validate: (e) =>
                  this.options.isAllowedUri(e, {
                    defaultValidate: (e) => !!tt(e, o),
                    protocols: o,
                    defaultProtocol: s,
                  }),
                shouldAutoLink: this.options.shouldAutoLink,
              }),
              new e0.Plugin({
                key: new e0.PluginKey("autolink"),
                appendTransaction: (n, r, i) => {
                  let o = n.some((e) => e.docChanged) && !r.doc.eq(i.doc),
                    s = n.some((e) => e.getMeta("preventAutolink"));
                  if (!o || s) return;
                  let { tr: l } = i,
                    a = (0, t.combineTransactionSteps)(r.doc, [...n]);
                  if (
                    ((0, t.getChangedRanges)(a).forEach(({ newRange: n }) => {
                      let r,
                        o,
                        s = (0, t.findChildrenInRange)(
                          i.doc,
                          n,
                          (e) => e.isTextblock,
                        );
                      if (s.length > 1)
                        ((r = s[0]),
                          (o = i.doc.textBetween(
                            r.pos,
                            r.pos + r.node.nodeSize,
                            void 0,
                            " ",
                          )));
                      else if (s.length) {
                        let e = i.doc.textBetween(n.from, n.to, " ", " ");
                        if (!e3.test(e)) return;
                        ((r = s[0]),
                          (o = i.doc.textBetween(r.pos, n.to, void 0, " ")));
                      }
                      if (r && o) {
                        let n = o.split(e2).filter(Boolean);
                        if (n.length <= 0) return !1;
                        let s = n[n.length - 1],
                          a = r.pos + o.lastIndexOf(s);
                        if (!s) return !1;
                        let d = eX(s).map((t) => t.toObject(e.defaultProtocol));
                        if (
                          !(1 === d.length
                            ? d[0].isLink
                            : 3 === d.length &&
                              !!d[1].isLink &&
                              ["()", "[]"].includes(d[0].value + d[2].value))
                        )
                          return !1;
                        d.filter((e) => e.isLink)
                          .map((e) => ({
                            ...e,
                            from: a + e.start + 1,
                            to: a + e.end + 1,
                          }))
                          .filter(
                            (e) =>
                              !i.schema.marks.code ||
                              !i.doc.rangeHasMark(
                                e.from,
                                e.to,
                                i.schema.marks.code,
                              ),
                          )
                          .filter((t) => e.validate(t.value))
                          .filter((t) => e.shouldAutoLink(t.value))
                          .forEach((n) => {
                            (0, t.getMarksBetween)(n.from, n.to, i.doc).some(
                              (t) => t.mark.type === e.type,
                            ) ||
                              l.addMark(
                                n.from,
                                n.to,
                                e.type.create({ href: n.href }),
                              );
                          });
                      }
                    }),
                    l.steps.length)
                  )
                    return l;
                },
              })),
            ),
          i.push(
            ((n = {
              type: this.type,
              editor: this.editor,
              openOnClick:
                "whenNotEditable" === this.options.openOnClick ||
                this.options.openOnClick,
              enableClickSelection: this.options.enableClickSelection,
            }),
            new e0.Plugin({
              key: new e0.PluginKey("handleClickLink"),
              props: {
                handleClick: (e, r, i) => {
                  if (0 !== i.button || !e.editable) return !1;
                  let o = null;
                  if (i.target instanceof HTMLAnchorElement) o = i.target;
                  else {
                    let e = i.target;
                    if (!e) return !1;
                    let t = n.editor.view.dom;
                    (o = e.closest("a")) && !t.contains(o) && (o = null);
                  }
                  if (!o) return !1;
                  let s = !1;
                  if (
                    (n.enableClickSelection &&
                      (s = n.editor.commands.extendMarkRange(n.type.name)),
                    n.openOnClick)
                  ) {
                    
                    let r = (0, t.getAttributes)(e.state, n.type.name),
                      i = null != (l = o.href) ? l : r.href,
                      d = null != (a = o.target) ? a : r.target;
                    i && (window.open(i, d), (s = !0));
                  }
                  return s;
                },
              },
            })),
          ),
          this.options.linkOnPaste &&
            i.push(
              ((r = {
                editor: this.editor,
                defaultProtocol: this.options.defaultProtocol,
                type: this.type,
                shouldAutoLink: this.options.shouldAutoLink,
              }),
              new e0.Plugin({
                key: new e0.PluginKey("handlePasteLink"),
                props: {
                  handlePaste: (e, t, n) => {
                    let { shouldAutoLink: i } = r,
                      { state: o } = e,
                      { selection: s } = o,
                      { empty: l } = s;
                    if (l) return !1;
                    let a = "";
                    n.content.forEach((e) => {
                      a += e.textContent;
                    });
                    let d = eZ(a, { defaultProtocol: r.defaultProtocol }).find(
                      (e) => e.isLink && e.value === a,
                    );
                    return (
                      !!a &&
                      !!d &&
                      (void 0 === i || !!i(d.value)) &&
                      r.editor.commands.setMark(r.type, { href: d.href })
                    );
                  },
                },
              })),
            ),
          i
        );
      },
    });
    ;
    let tr = "&nbsp;",
      ti = t.Node.create({
        name: "paragraph",
        priority: 1e3,
        addOptions: () => ({ HTMLAttributes: {} }),
        group: "block",
        content: "inline*",
        parseHTML: () => [{ tag: "p" }],
        renderHTML({ HTMLAttributes: e }) {
          return [
            "p",
            (0, t.mergeAttributes)(this.options.HTMLAttributes, e),
            0,
          ];
        },
        parseMarkdown: (e, t) => {
          let n = e.tokens || [];
          if (1 === n.length && "image" === n[0].type)
            return t.parseChildren([n[0]]);
          let r = t.parseInline(n);
          return 1 === n.length &&
            "text" === n[0].type &&
            (n[0].raw === tr ||
              n[0].text === tr ||
              " " === n[0].raw ||
              " " === n[0].text) &&
            1 === r.length &&
            "text" === r[0].type &&
            (r[0].text === tr || " " === r[0].text)
            ? t.createNode("paragraph", void 0, [])
            : t.createNode("paragraph", void 0, r);
        },
        renderMarkdown: (e, t, n) => {
          if (!e) return "";
          let r = Array.isArray(e.content) ? e.content : [];
          if (0 === r.length) {
            
            let e = Array.isArray(
              null == n || null == (i = n.previousNode) ? void 0 : i.content,
            )
              ? n.previousNode.content
              : [];
            return (null == n || null == (o = n.previousNode)
              ? void 0
              : o.type) === "paragraph" && 0 === e.length
              ? tr
              : "";
          }
          return t.renderChildren(r);
        },
        addCommands() {
          return {
            setParagraph:
              () =>
              ({ commands: e }) =>
                e.setNode(this.name),
          };
        },
        addKeyboardShortcuts() {
          return { "Mod-Alt-0": () => this.editor.commands.setParagraph() };
        },
      });
    ;
    let to = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/,
      ts = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g,
      tl = t.Mark.create({
        name: "strike",
        addOptions: () => ({ HTMLAttributes: {} }),
        parseHTML: () => [
          { tag: "s" },
          { tag: "del" },
          { tag: "strike" },
          {
            style: "text-decoration",
            consuming: !1,
            getAttrs: (e) => !!e.includes("line-through") && {},
          },
        ],
        renderHTML({ HTMLAttributes: e }) {
          return [
            "s",
            (0, t.mergeAttributes)(this.options.HTMLAttributes, e),
            0,
          ];
        },
        markdownTokenName: "del",
        parseMarkdown: (e, t) =>
          t.applyMark("strike", t.parseInline(e.tokens || [])),
        renderMarkdown: (e, t) => `~~${t.renderChildren(e)}~~`,
        addCommands() {
          return {
            setStrike:
              () =>
              ({ commands: e }) =>
                e.setMark(this.name),
            toggleStrike:
              () =>
              ({ commands: e }) =>
                e.toggleMark(this.name),
            unsetStrike:
              () =>
              ({ commands: e }) =>
                e.unsetMark(this.name),
          };
        },
        addKeyboardShortcuts() {
          return { "Mod-Shift-s": () => this.editor.commands.toggleStrike() };
        },
        addInputRules() {
          return [(0, t.markInputRule)({ find: to, type: this.type })];
        },
        addPasteRules() {
          return [(0, t.markPasteRule)({ find: ts, type: this.type })];
        },
      });
    ;
