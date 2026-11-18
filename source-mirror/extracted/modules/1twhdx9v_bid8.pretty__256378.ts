// Reconstructed from 1twhdx9v_bid8.pretty.js, module 256378.
// deps: m183672, m10552, m428762, m827121, m925193, m974278, m604366, m197021, m413615, m963612, m690256, m756044, m649717, m76399
// exports: default, default, Heading, default, HorizontalRule, default, default
export { r as "default" };
export { i as "default" };
export { b as "Heading" };
export { b as "default" };
export { v as "HorizontalRule" };
export { v as "default" };
export { ei as "default" };

"use strict";
    var t = m183672,
      r = t.Placeholder;
    ;
    var n = m10552;
    let i = n.Extension.create({
      name: "textAlign",
      addOptions: () => ({
        types: [],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: null,
      }),
      addGlobalAttributes() {
        return [
          {
            types: this.options.types,
            attributes: {
              textAlign: {
                default: this.options.defaultAlignment,
                parseHTML: (e) => {
                  let t = e.style.textAlign;
                  return this.options.alignments.includes(t)
                    ? t
                    : this.options.defaultAlignment;
                },
                renderHTML: (e) =>
                  e.textAlign ? { style: `text-align: ${e.textAlign}` } : {},
              },
            },
          },
        ];
      },
      addCommands() {
        return {
          setTextAlign:
            (e) =>
            ({ commands: t }) =>
              !!this.options.alignments.includes(e) &&
              this.options.types
                .map((r) => t.updateAttributes(r, { textAlign: e }))
                .some((e) => e),
          unsetTextAlign:
            () =>
            ({ commands: e }) =>
              this.options.types
                .map((t) => e.resetAttributes(t, "textAlign"))
                .some((e) => e),
          toggleTextAlign:
            (e) =>
            ({ editor: t, commands: r }) =>
              !!this.options.alignments.includes(e) &&
              (t.isActive({ textAlign: e })
                ? r.unsetTextAlign()
                : r.setTextAlign(e)),
        };
      },
      addKeyboardShortcuts() {
        return {
          "Mod-Shift-l": () => this.editor.commands.setTextAlign("left"),
          "Mod-Shift-e": () => this.editor.commands.setTextAlign("center"),
          "Mod-Shift-r": () => this.editor.commands.setTextAlign("right"),
          "Mod-Shift-j": () => this.editor.commands.setTextAlign("justify"),
        };
      },
    });
    ;
    var a = m428762,
      o = m827121,
      s = m925193;
    let l = /^\s*>\s$/,
      u = n.Node.create({
        name: "blockquote",
        addOptions: () => ({ HTMLAttributes: {} }),
        content: "block+",
        group: "block",
        defining: !0,
        parseHTML: () => [{ tag: "blockquote" }],
        renderHTML({ HTMLAttributes: e }) {
          return (0, s.jsx)("blockquote", {
            ...(0, n.mergeAttributes)(this.options.HTMLAttributes, e),
            children: (0, s.jsx)("slot", {}),
          });
        },
        parseMarkdown: (e, t) => {
          
          let n = null != (r = t.parseBlockChildren) ? r : t.parseChildren;
          return t.createNode("blockquote", void 0, n(e.tokens || []));
        },
        renderMarkdown: (e, t) => {
          if (!e.content) return "";
          let r = [];
          return (
            e.content.forEach((e, n) => {
              
              let o = (
                null !=
                (i = null == (a = t.renderChild) ? void 0 : a.call(t, e, n))
                  ? i
                  : t.renderChildren([e])
              )
                .split("\n")
                .map((e) => ("" === e.trim() ? ">" : `> ${e}`));
              r.push(o.join("\n"));
            }),
            r.join(`
>
`)
          );
        },
        addCommands() {
          return {
            setBlockquote:
              () =>
              ({ commands: e }) =>
                e.wrapIn(this.name),
            toggleBlockquote:
              () =>
              ({ commands: e }) =>
                e.toggleWrap(this.name),
            unsetBlockquote:
              () =>
              ({ commands: e }) =>
                e.lift(this.name),
          };
        },
        addKeyboardShortcuts() {
          return {
            "Mod-Shift-b": () => this.editor.commands.toggleBlockquote(),
            Backspace: () =>
              ((e, t) => {
                
                let { state: n } = e,
                  { selection: i } = n;
                if (!i.empty) return !1;
                let { $from: s } = i;
                if (0 !== s.parentOffset) return !1;
                let l = s.depth - 1;
                if (l < 0) return !1;
                let u = s.node(l),
                  c = s.index(l);
                if (0 === c) return !1;
                if (u.type === t) return e.commands.lift(t.name);
                let f = u.child(c - 1);
                if (
                  f.type !== t ||
                  !(null == (r = f.lastChild) ? void 0 : r.isTextblock)
                )
                  return !1;
                let d = s.before() - 1 - 1;
                return e.commands.command(({ tr: e, dispatch: t }) => {
                  if (!t) return !0;
                  let r = s.parent.content,
                    n = new a.Slice(r, 0, 0);
                  return (
                    e.replace(d, s.after(), n),
                    e.setSelection(o.TextSelection.create(e.doc, d + r.size)),
                    e.scrollIntoView(),
                    t(e),
                    !0
                  );
                });
              })(this.editor, this.type),
          };
        },
        addInputRules() {
          return [(0, n.wrappingInputRule)({ find: l, type: this.type })];
        },
      });
    var c = m974278;
    let f = (e) => {
        let t = /`([^`]+)`(?!`)$/.exec(e);
        return !t || (t.index > 0 && "`" === e[t.index - 1])
          ? null
          : { index: t.index, text: t[0], replaceWith: t[1] };
      },
      d = (e) => {
        let t,
          r = /`([^`]+)`(?!`)/g,
          n = [];
        for (; null !== (t = r.exec(e)); )
          (t.index > 0 && "`" === e[t.index - 1]) ||
            n.push({ index: t.index, text: t[0], replaceWith: t[1] });
        return n;
      },
      p = n.Mark.create({
        name: "code",
        addOptions: () => ({ HTMLAttributes: {} }),
        excludes: "_",
        code: !0,
        exitable: !0,
        parseHTML: () => [{ tag: "code" }],
        renderHTML({ HTMLAttributes: e }) {
          return [
            "code",
            (0, n.mergeAttributes)(this.options.HTMLAttributes, e),
            0,
          ];
        },
        markdownTokenName: "codespan",
        parseMarkdown: (e, t) =>
          t.applyMark("code", [{ type: "text", text: e.text || "" }]),
        renderMarkdown: (e, t) =>
          e.content ? `\`${t.renderChildren(e.content)}\`` : "",
        addCommands() {
          return {
            setCode:
              () =>
              ({ commands: e }) =>
                e.setMark(this.name),
            toggleCode:
              () =>
              ({ commands: e }) =>
                e.toggleMark(this.name),
            unsetCode:
              () =>
              ({ commands: e }) =>
                e.unsetMark(this.name),
          };
        },
        addKeyboardShortcuts() {
          return { "Mod-e": () => this.editor.commands.toggleCode() };
        },
        addInputRules() {
          return [(0, n.markInputRule)({ find: f, type: this.type })];
        },
        addPasteRules() {
          return [(0, n.markPasteRule)({ find: d, type: this.type })];
        },
      }),
      h = /^```([a-z]+)?[\s\n]$/,
      m = /^~~~([a-z]+)?[\s\n]$/,
      g = n.Node.create({
        name: "codeBlock",
        addOptions: () => ({
          languageClassPrefix: "language-",
          exitOnTripleEnter: !0,
          exitOnArrowDown: !0,
          exitOnArrowUp: !0,
          defaultLanguage: null,
          enableTabIndentation: !1,
          tabSize: 4,
          HTMLAttributes: {},
        }),
        content: "text*",
        marks: "",
        group: "block",
        code: !0,
        defining: !0,
        addAttributes() {
          return {
            language: {
              default: this.options.defaultLanguage,
              parseHTML: (e) => {
                
                let { languageClassPrefix: r } = this.options;
                if (!r) return null;
                let n = [
                  ...((null == (t = e.firstElementChild)
                    ? void 0
                    : t.classList) || []),
                ]
                  .filter((e) => e.startsWith(r))
                  .map((e) => e.replace(r, ""))[0];
                return n || null;
              },
              rendered: !1,
            },
          };
        },
        parseHTML: () => [{ tag: "pre", preserveWhitespace: "full" }],
        renderHTML({ node: e, HTMLAttributes: t }) {
          return [
            "pre",
            (0, n.mergeAttributes)(this.options.HTMLAttributes, t),
            [
              "code",
              {
                class: e.attrs.language
                  ? this.options.languageClassPrefix + e.attrs.language
                  : null,
              },
              0,
            ],
          ];
        },
        markdownTokenName: "code",
        parseMarkdown: (e, t) => {
          
          return (null == (r = e.raw) ? void 0 : r.startsWith("```")) === !1 &&
            (null == (n = e.raw) ? void 0 : n.startsWith("~~~")) === !1 &&
            "indented" !== e.codeBlockStyle
            ? []
            : t.createNode(
                "codeBlock",
                { language: e.lang || null },
                e.text ? [t.createTextNode(e.text)] : [],
              );
        },
        renderMarkdown: (e, t) => {
          
          let n = (null == (r = e.attrs) ? void 0 : r.language) || "";
          return e.content
            ? [`\`\`\`${n}`, t.renderChildren(e.content), "```"].join("\n")
            : `\`\`\`${n}

\`\`\``;
        },
        addCommands() {
          return {
            setCodeBlock:
              (e) =>
              ({ commands: t }) =>
                t.setNode(this.name, e),
            toggleCodeBlock:
              (e) =>
              ({ commands: t }) =>
                t.toggleNode(this.name, "paragraph", e),
          };
        },
        addKeyboardShortcuts() {
          return {
            "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
            Backspace: () => {
              let { empty: e, $anchor: t } = this.editor.state.selection,
                r = 1 === t.pos;
              return (
                !!e &&
                t.parent.type.name === this.name &&
                (!!r || !t.parent.textContent.length) &&
                this.editor.commands.clearNodes()
              );
            },
            Tab: ({ editor: e }) => {
              
              if (!this.options.enableTabIndentation) return !1;
              let r = null != (t = this.options.tabSize) ? t : 4,
                { state: n } = e,
                { selection: i } = n,
                { $from: a, empty: o } = i;
              if (a.parent.type !== this.type) return !1;
              let s = " ".repeat(r);
              return o
                ? e.commands.insertContent(s)
                : e.commands.command(({ tr: e }) => {
                    let { from: t, to: r } = i,
                      a = n.doc
                        .textBetween(t, r, "\n", "\n")
                        .split("\n")
                        .map((e) => s + e)
                        .join("\n");
                    return (e.replaceWith(t, r, n.schema.text(a)), !0);
                  });
            },
            "Shift-Tab": ({ editor: e }) => {
              
              if (!this.options.enableTabIndentation) return !1;
              let r = null != (t = this.options.tabSize) ? t : 4,
                { state: n } = e,
                { selection: i } = n,
                { $from: a, empty: s } = i;
              return (
                a.parent.type === this.type &&
                (s
                  ? e.commands.command(({ tr: e }) => {
                      
                      let { pos: i } = a,
                        s = a.start(),
                        l = a.end(),
                        u = n.doc.textBetween(s, l, "\n", "\n").split("\n"),
                        c = 0,
                        f = 0,
                        d = i - s;
                      for (let e = 0; e < u.length; e += 1) {
                        if (f + u[e].length >= d) {
                          c = e;
                          break;
                        }
                        f += u[e].length + 1;
                      }
                      let p = Math.min(
                        (
                          (null == (t = u[c].match(/^ */)) ? void 0 : t[0]) ||
                          ""
                        ).length,
                        r,
                      );
                      if (0 === p) return !0;
                      let h = s;
                      for (let e = 0; e < c; e += 1) h += u[e].length + 1;
                      return (
                        e.delete(h, h + p),
                        i - h <= p &&
                          e.setSelection(o.TextSelection.create(e.doc, h)),
                        !0
                      );
                    })
                  : e.commands.command(({ tr: e }) => {
                      let { from: t, to: a } = i,
                        o = n.doc
                          .textBetween(t, a, "\n", "\n")
                          .split("\n")
                          .map((e) => {
                            
                            let n = Math.min(
                              (
                                (null == (t = e.match(/^ */))
                                  ? void 0
                                  : t[0]) || ""
                              ).length,
                              r,
                            );
                            return e.slice(n);
                          })
                          .join("\n");
                      return (e.replaceWith(t, a, n.schema.text(o)), !0);
                    }))
              );
            },
            Enter: ({ editor: e }) => {
              if (!this.options.exitOnTripleEnter) return !1;
              let { state: t } = e,
                { selection: r } = t,
                { $from: n, empty: i } = r;
              if (!i || n.parent.type !== this.type) return !1;
              let a = n.parentOffset === n.parent.nodeSize - 2,
                o = n.parent.textContent.endsWith("\n\n");
              return (
                !!a &&
                !!o &&
                e
                  .chain()
                  .command(({ tr: e }) => (e.delete(n.pos - 2, n.pos), !0))
                  .exitCode()
                  .run()
              );
            },
            ArrowUp: ({ editor: e }) => {
              if (!this.options.exitOnArrowUp) return !1;
              let { state: t } = e,
                { selection: r } = t,
                { $from: n, empty: i } = r;
              if (!i || n.parent.type !== this.type || 0 !== n.parentOffset)
                return !1;
              let a = n.before();
              return !(a > 0) && e.commands.insertDefaultBlock({ pos: a });
            },
            ArrowDown: ({ editor: e }) => {
              if (!this.options.exitOnArrowDown) return !1;
              let { state: t } = e,
                { selection: r, doc: n } = t,
                { $from: i, empty: a } = r;
              if (
                !a ||
                i.parent.type !== this.type ||
                i.parentOffset !== i.parent.nodeSize - 2
              )
                return !1;
              let s = i.after();
              return (
                void 0 !== s &&
                (n.nodeAt(s)
                  ? e.commands.command(
                      ({ tr: e }) => (
                        e.setSelection(o.Selection.near(n.resolve(s))),
                        !0
                      ),
                    )
                  : e.commands.exitCode())
              );
            },
          };
        },
        addInputRules() {
          return [
            (0, n.textblockTypeInputRule)({
              find: h,
              type: this.type,
              getAttributes: (e) => ({ language: e[1] }),
            }),
            (0, n.textblockTypeInputRule)({
              find: m,
              type: this.type,
              getAttributes: (e) => ({ language: e[1] }),
            }),
          ];
        },
        addProseMirrorPlugins() {
          return [
            new o.Plugin({
              key: new o.PluginKey("codeBlockVSCodeHandler"),
              props: {
                handlePaste: (e, t) => {
                  if (!t.clipboardData || this.editor.isActive(this.type.name))
                    return !1;
                  let r = t.clipboardData.getData("text/plain"),
                    n = t.clipboardData.getData("vscode-editor-data"),
                    i = n ? JSON.parse(n) : void 0,
                    a = null == i ? void 0 : i.mode;
                  if (!r || !a) return !1;
                  let { tr: s, schema: l } = e.state,
                    u = l.text(r.replace(/\r\n?/g, "\n"));
                  return (
                    s.replaceSelectionWith(
                      this.type.create({ language: a }, u),
                    ),
                    s.selection.$from.parent.type !== this.type &&
                      s.setSelection(
                        o.TextSelection.near(
                          s.doc.resolve(Math.max(0, s.selection.from - 2)),
                        ),
                      ),
                    s.setMeta("paste", !0),
                    e.dispatch(s),
                    !0
                  );
                },
              },
            }),
          ];
        },
      });
    var x = m604366,
      y = m197021;
    let b = n.Node.create({
      name: "heading",
      addOptions: () => ({ levels: [1, 2, 3, 4, 5, 6], HTMLAttributes: {} }),
      content: "inline*",
      group: "block",
      defining: !0,
      addAttributes: () => ({ level: { default: 1, rendered: !1 } }),
      parseHTML() {
        return this.options.levels.map((e) => ({
          tag: `h${e}`,
          attrs: { level: e },
        }));
      },
      renderHTML({ node: e, HTMLAttributes: t }) {
        return [
          `h${this.options.levels.includes(e.attrs.level) ? e.attrs.level : this.options.levels[0]}`,
          (0, n.mergeAttributes)(this.options.HTMLAttributes, t),
          0,
        ];
      },
      parseMarkdown: (e, t) =>
        t.createNode(
          "heading",
          { level: e.depth || 1 },
          t.parseInline(e.tokens || []),
        ),
      renderMarkdown: (e, t) => {
        
        let n = (null == (r = e.attrs) ? void 0 : r.level)
            ? parseInt(e.attrs.level, 10)
            : 1,
          i = "#".repeat(n);
        return e.content ? `${i} ${t.renderChildren(e.content)}` : "";
      },
      addCommands() {
        return {
          setHeading:
            (e) =>
            ({ commands: t }) =>
              !!this.options.levels.includes(e.level) &&
              t.setNode(this.name, e),
          toggleHeading:
            (e) =>
            ({ commands: t }) =>
              !!this.options.levels.includes(e.level) &&
              t.toggleNode(this.name, "paragraph", e),
        };
      },
      addKeyboardShortcuts() {
        return this.options.levels.reduce(
          (e, t) => ({
            ...e,
            [`Mod-Alt-${t}`]: () =>
              this.editor.commands.toggleHeading({ level: t }),
          }),
          {},
        );
      },
      addInputRules() {
        return this.options.levels.map((e) =>
          (0, n.textblockTypeInputRule)({
            find: RegExp(`^(#{${Math.min(...this.options.levels)},${e}})\\s$`),
            type: this.type,
            getAttributes: { level: e },
          }),
        );
      },
    });
    ;
    let v = n.Node.create({
      name: "horizontalRule",
      addOptions: () => ({ HTMLAttributes: {}, nextNodeType: "paragraph" }),
      group: "block",
      parseHTML: () => [{ tag: "hr" }],
      renderHTML({ HTMLAttributes: e }) {
        return ["hr", (0, n.mergeAttributes)(this.options.HTMLAttributes, e)];
      },
      markdownTokenName: "hr",
      parseMarkdown: (e, t) => t.createNode("horizontalRule"),
      renderMarkdown: () => "---",
      addCommands() {
        return {
          setHorizontalRule:
            () =>
            ({ chain: e, state: t }) => {
              if (!(0, n.canInsertNode)(t, t.schema.nodes[this.name]))
                return !1;
              let { selection: r } = t,
                { $to: i } = r,
                a = e();
              return (
                (0, n.isNodeSelection)(r)
                  ? a.insertContentAt(i.pos, { type: this.name })
                  : a.insertContent({ type: this.name }),
                a
                  .command(({ state: e, tr: t, dispatch: r }) => {
                    if (r) {
                      let { $to: r } = t.selection,
                        n = r.end();
                      if (r.nodeAfter)
                        r.nodeAfter.isTextblock
                          ? t.setSelection(
                              o.TextSelection.create(t.doc, r.pos + 1),
                            )
                          : r.nodeAfter.isBlock
                            ? t.setSelection(
                                o.NodeSelection.create(t.doc, r.pos),
                              )
                            : t.setSelection(
                                o.TextSelection.create(t.doc, r.pos),
                              );
                      else {
                        let i =
                            e.schema.nodes[this.options.nextNodeType] ||
                            r.parent.type.contentMatch.defaultType,
                          a = null == i ? void 0 : i.create();
                        a &&
                          (t.insert(n, a),
                          t.setSelection(o.TextSelection.create(t.doc, n + 1)));
                      }
                      t.scrollIntoView();
                    }
                    return !0;
                  })
                  .run()
              );
            },
        };
      },
      addInputRules() {
        return [
          (0, n.nodeInputRule)({
            find: /^(?:---|—-|___\s|\*\*\*\s)$/,
            type: this.type,
          }),
        ];
      },
    });
    ;
    var w = m413615,
      N = m963612;
    let A = "textStyle",
      M = /^\s*([-+*])\s$/,
      D = n.Node.create({
        name: "bulletList",
        addOptions: () => ({
          itemTypeName: "listItem",
          HTMLAttributes: {},
          keepMarks: !1,
          keepAttributes: !1,
        }),
        group: "block list",
        content() {
          return `${this.options.itemTypeName}+`;
        },
        parseHTML: () => [{ tag: "ul" }],
        renderHTML({ HTMLAttributes: e }) {
          return [
            "ul",
            (0, n.mergeAttributes)(this.options.HTMLAttributes, e),
            0,
          ];
        },
        markdownTokenName: "list",
        parseMarkdown: (e, t) =>
          "list" !== e.type || e.ordered
            ? []
            : {
                type: "bulletList",
                content: e.items ? t.parseChildren(e.items) : [],
              },
        renderMarkdown: (e, t) =>
          e.content ? t.renderChildren(e.content, "\n") : "",
        markdownOptions: { indentsContent: !0 },
        addCommands() {
          return {
            toggleBulletList:
              () =>
              ({ commands: e, chain: t }) =>
                this.options.keepAttributes
                  ? t()
                      .toggleList(
                        this.name,
                        this.options.itemTypeName,
                        this.options.keepMarks,
                      )
                      .updateAttributes(
                        "listItem",
                        this.editor.getAttributes(A),
                      )
                      .run()
                  : e.toggleList(
                      this.name,
                      this.options.itemTypeName,
                      this.options.keepMarks,
                    ),
          };
        },
        addKeyboardShortcuts() {
          return {
            "Mod-Shift-8": () => this.editor.commands.toggleBulletList(),
          };
        },
        addInputRules() {
          let e = (0, n.wrappingInputRule)({ find: M, type: this.type });
          return (
            (this.options.keepMarks || this.options.keepAttributes) &&
              (e = (0, n.wrappingInputRule)({
                find: M,
                type: this.type,
                keepMarks: this.options.keepMarks,
                keepAttributes: this.options.keepAttributes,
                getAttributes: () => this.editor.getAttributes(A),
                editor: this.editor,
              })),
            [e]
          );
        },
      }),
      C = (e, t) =>
        n.Extension.create({
          name: `${e}BranchingDeleteKeymap`,
          priority: 101,
          addKeyboardShortcuts() {
            let r = () => {
              
              return (
                (r = this.editor),
                ((e, t, r, n) => {
                  let i = ((e, t, r) => {
                    let { selection: n } = e;
                    if (!n.empty) return null;
                    let { $from: i } = n;
                    if (
                      !i.parent.isTextblock ||
                      i.parentOffset !== i.parent.content.size
                    )
                      return null;
                    let a = -1;
                    for (let e = i.depth; e > 0; e -= 1)
                      if (i.node(e).type.name === t) {
                        a = e;
                        break;
                      }
                    if (a < 0) return null;
                    let o = i.node(a),
                      s = i.index(a);
                    if (s + 1 >= o.childCount) return null;
                    let l = o.child(s + 1);
                    if (!r.includes(l.type.name)) return null;
                    let u = e.schema.nodes[t],
                      c = !1;
                    if (
                      (l.forEach((e) => {
                        e.type === u && e.childCount > 1 && (c = !0);
                      }),
                      !c)
                    )
                      return null;
                    let f = e.doc.resolve(i.after()).nodeAfter;
                    if (!f || !r.includes(f.type.name)) return null;
                    let d = [];
                    return (f.forEach((e) => {
                      d.push(e);
                    }),
                    0 === d.length)
                      ? null
                      : {
                          listItemDepth: a,
                          nestedList: f,
                          nestedListPos: i.after(),
                          insertPos: i.after(a),
                          items: d,
                        };
                  })(e, r, n);
                  if (!i) return !1;
                  let { selection: o } = e,
                    {
                      nestedList: s,
                      nestedListPos: l,
                      insertPos: u,
                      items: c,
                    } = i,
                    f = e.tr;
                  f.delete(l, l + s.nodeSize);
                  let d = f.mapping.map(u);
                  return (
                    f.insert(d, a.Fragment.from(c)),
                    f.setSelection(o.map(f.doc, f.mapping)),
                    t && t(f),
                    !0
                  );
                })(r.state, r.view.dispatch, e, t)
              );
            };
            return { Delete: r, "Mod-Delete": r };
          },
        }),
      E = [
        [1e3, "m"],
        [900, "cm"],
        [500, "d"],
        [400, "cd"],
        [100, "c"],
        [90, "xc"],
        [50, "l"],
        [40, "xl"],
        [10, "x"],
        [9, "ix"],
        [5, "v"],
        [4, "iv"],
        [1, "i"],
      ],
      S = "abcdefghijklmnopqrstuvwxyz",
      T = String.raw`\d+|[ivxlcdmIVXLCDM]+|${"[a-zA-Z]{1,2}"}`;
    function k(e) {
      let t = e,
        r = "";
      for (let [e, n] of E) for (; t >= e; ) ((r += n), (t -= e));
      return r;
    }
    function F(e) {
      return k(e).toUpperCase();
    }
    function B(e) {
      let t = e.toLowerCase(),
        r = 0,
        n = 0;
      for (; r < t.length; ) {
        let e = !1;
        for (let [i, a] of E)
          if (t.startsWith(a, r)) {
            ((n += i), (r += a.length), (e = !0));
            break;
          }
        if (!e) return 0;
      }
      return n;
    }
    function O(e) {
      if (e <= 26) return S[e - 1];
      let t = Math.floor((e - 1) / 26) - 1,
        r = (e - 1) % 26;
      return t < 0 ? S[r] : S[t] + S[r];
    }
    function z(e) {
      if (!(!e || /^\d+$/.test(e))) {
        if (
          (function (e) {
            if (!/^[ivxlcdmIVXLCDM]+$/.test(e)) return !1;
            let t = B(e);
            return !(t <= 0) && (e === e.toLowerCase() ? k(t) : F(t)) === e;
          })(e)
        )
          return e === e.toLowerCase() ? "i" : "I";
        if (/^[a-z]{1,2}$/.test(e)) return "a";
        if (/^[A-Z]{1,2}$/.test(e)) return "A";
      }
    }
    function _(e) {
      if (/^\d+$/.test(e)) return parseInt(e, 10);
      let t = z(e);
      if ("i" === t || "I" === t) return B(e);
      if ("a" === t || "A" === t) {
        let t,
          r =
            1 === (t = e.toLowerCase()).length
              ? t.charCodeAt(0) - 97 + 1
              : 2 === t.length
                ? (t.charCodeAt(0) - 97 + 1) * 26 + (t.charCodeAt(1) - 97) + 1
                : 0;
        return r > 0 ? r : 1;
      }
      let r = parseInt(e, 10);
      return Number.isNaN(r) ? 1 : r;
    }
    let j = n.Node.create({
        name: "listItem",
        addOptions: () => ({
          HTMLAttributes: {},
          bulletListTypeName: "bulletList",
          orderedListTypeName: "orderedList",
        }),
        content: "paragraph block*",
        defining: !0,
        parseHTML: () => [{ tag: "li" }],
        renderHTML({ HTMLAttributes: e }) {
          return [
            "li",
            (0, n.mergeAttributes)(this.options.HTMLAttributes, e),
            0,
          ];
        },
        markdownTokenName: "list_item",
        parseMarkdown: (e, t) => {
          
          if ("list_item" !== e.type) return [];
          let o = null != (r = t.parseBlockChildren) ? r : t.parseChildren,
            s = [];
          if (e.tokens && e.tokens.length > 0) {
            
            if (
              ((r = null == (n = e.tokens) ? void 0 : n[0]),
              e.text &&
                (null == (i = e.tokens) ? void 0 : i.length) === 1 &&
                (null == r ? void 0 : r.type) === "list" &&
                r.ordered &&
                r.raw === e.text)
            )
              return {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content:
                      ((a = e.text || ""),
                      t.tokenizeInline
                        ? t.parseInline(t.tokenizeInline(a))
                        : t.parseInline([{ type: "text", raw: a, text: a }])),
                  },
                ],
              };
            if (e.tokens.some((e) => "paragraph" === e.type)) s = o(e.tokens);
            else {
              let r = e.tokens[0];
              if (r && "text" === r.type && r.tokens && r.tokens.length > 0) {
                if (
                  ((s = [
                    { type: "paragraph", content: t.parseInline(r.tokens) },
                  ]),
                  e.tokens.length > 1)
                ) {
                  let t = o(e.tokens.slice(1));
                  s.push(...t);
                }
              } else s = o(e.tokens);
            }
          }
          return (
            0 === s.length && (s = [{ type: "paragraph", content: [] }]),
            { type: "listItem", content: s }
          );
        },
        renderMarkdown: (e, t, r) =>
          (0, n.renderNestedMarkdownContent)(
            e,
            t,
            (e) => {
              if ("bulletList" === e.parentType) return "- ";
              if ("orderedList" === e.parentType) {
                
                let n =
                  (null == (t = e.meta) || null == (t = t.parentAttrs)
                    ? void 0
                    : t.start) || 1;
                return (function (e, t, r = ". ") {
                  let n = t + 1;
                  if (!e || "1" === e) return `${n}${r}`;
                  switch (e) {
                    case "a":
                      return `${O(n)}${r}`;
                    case "A":
                      return `${O(n).toUpperCase()}${r}`;
                    case "i":
                      return `${k(n)}${r}`;
                    case "I":
                      return `${F(n)}${r}`;
                    default:
                      return `${n}${r}`;
                  }
                })(
                  null == (r = e.meta) || null == (r = r.parentAttrs)
                    ? void 0
                    : r.type,
                  n - 1 + (e.index || 0),
                  ". ",
                );
              }
              return "- ";
            },
            r,
            {
              alignNestedToPrefix:
                (null == r ? void 0 : r.parentType) === "orderedList",
            },
          ),
        addExtensions() {
          return [
            C(this.name, [
              this.options.bulletListTypeName,
              this.options.orderedListTypeName,
            ]),
          ];
        },
        addKeyboardShortcuts() {
          return {
            Enter: () => this.editor.commands.splitListItem(this.name),
            Tab: () => this.editor.commands.sinkListItem(this.name),
            "Shift-Tab": () => this.editor.commands.liftListItem(this.name),
          };
        },
      }),
      $ = (e, t) => {
        let { $from: r } = t.selection,
          i = (0, n.getNodeType)(e, t.schema),
          a = r.depth,
          o = r.pos,
          s = null;
        for (; a > 0 && null === s; )
          r.node(a).type === i ? (s = a) : ((a -= 1), (o -= 1));
        return null === s ? null : { $pos: t.doc.resolve(o), depth: s };
      },
      R = (e, t) => {
        let r = $(e, t);
        if (!r) return !1;
        let [, i] = (0, n.getNodeAtPosition)(t, e, r.$pos.pos + 4);
        return i;
      },
      I = (e, t, r) => {
        if (e.commands.undoInputRule()) return !0;
        if (e.state.selection.from !== e.state.selection.to) return !1;
        if (
          !(0, n.isNodeActive)(e.state, t) &&
          ((e, t) => {
            let { $anchor: r } = e.selection,
              n = Math.max(0, r.pos - 2),
              i = e.doc.resolve(n).node();
            return !!i && !!t.includes(i.type.name);
          })(e.state, r)
        ) {
          let { $anchor: r } = e.state.selection,
            n = e.state.doc.resolve(r.before() - 1),
            i = [];
          n.node().descendants((e, r) => {
            e.type.name === t && i.push({ node: e, pos: r });
          });
          let a = i.at(-1);
          if (!a) return !1;
          let o = e.state.doc.resolve(n.start() + a.pos + 1);
          return e
            .chain()
            .cut({ from: r.start() - 1, to: r.end() + 1 }, o.end())
            .joinForward()
            .run();
        }
        if (
          !(0, n.isNodeActive)(e.state, t) ||
          !(0, n.isAtStartOfNode)(e.state)
        )
          return !1;
        let { $from: i } = e.state.selection,
          a = i.depth - 1;
        return (
          i.node(a).type === e.schema.nodes[t] &&
          0 === i.index(a) &&
          e.chain().liftListItem(t).run()
        );
      },
      L = (e, t) => {
        
        
        if (
          !(0, n.isNodeActive)(e.state, t) ||
          !(0, n.isAtEndOfNode)(e.state, t)
        )
          return !1;
        let { selection: u } = e.state,
          { $from: c, $to: f } = u;
        return (
          !(!u.empty && c.sameParent(f)) &&
          (((a = R(t, (r = e.state))), (o = $(t, r)) && a && (a > o.depth || 0))
            ? e
                .chain()
                .focus(e.state.selection.from + 4)
                .lift(t)
                .joinBackward()
                .run()
            : ((s = R(t, (i = e.state))),
                (l = $(t, i)) && s && (s < l.depth || 0))
              ? e.chain().joinForward().joinBackward().run()
              : e.commands.joinItemForward())
        );
      },
      P = (e, t, r) => {
        let { state: i } = e,
          { selection: s } = i;
        if (!s.empty) return !1;
        let { $from: l } = s;
        if (
          0 !== l.parentOffset ||
          !l.parent.isTextblock ||
          (0, n.isNodeActive)(i, t)
        )
          return !1;
        let u = (0, n.getPreviousBlockSibling)(l);
        if (!u || !r.includes(u.type.name)) return !1;
        let c = u.lastChild;
        if (!c || c.type.name !== t) return !1;
        let f = l.parent;
        if (!c.canReplace(c.childCount, c.childCount, a.Fragment.from(f)))
          return !1;
        let d = l.before(),
          p = l.after(),
          h = d - 2;
        return e.commands.command(
          ({ tr: e, dispatch: t }) => (
            t &&
              (e.delete(d, p).insert(h, a.Fragment.from(f)),
              e.setSelection(o.TextSelection.create(e.doc, h + 1)),
              e.scrollIntoView()),
            !0
          ),
        );
      },
      q = n.Extension.create({
        name: "listKeymap",
        addOptions: () => ({
          listTypes: [
            {
              itemName: "listItem",
              wrapperNames: ["bulletList", "orderedList"],
            },
            { itemName: "taskItem", wrapperNames: ["taskList"] },
          ],
        }),
        addKeyboardShortcuts() {
          return {
            Delete: ({ editor: e }) => {
              let t = !1;
              return (
                this.options.listTypes.forEach(({ itemName: r }) => {
                  void 0 !== e.state.schema.nodes[r] && L(e, r) && (t = !0);
                }),
                t
              );
            },
            "Mod-Delete": ({ editor: e }) => {
              let t = !1;
              return (
                this.options.listTypes.forEach(({ itemName: r }) => {
                  void 0 !== e.state.schema.nodes[r] && L(e, r) && (t = !0);
                }),
                t
              );
            },
            Backspace: ({ editor: e }) => {
              let t = !1;
              return (
                this.options.listTypes.forEach(
                  ({ itemName: r, wrapperNames: n }) => {
                    void 0 !== e.state.schema.nodes[r] &&
                      I(e, r, n) &&
                      (t = !0);
                  },
                ),
                t
              );
            },
            "Mod-Backspace": ({ editor: e }) => {
              let t = !1;
              return (
                this.options.listTypes.forEach(
                  ({ itemName: r, wrapperNames: n }) => {
                    void 0 !== e.state.schema.nodes[r] &&
                      I(e, r, n) &&
                      (t = !0);
                  },
                ),
                t
              );
            },
            Tab: ({ editor: e }) => {
              for (let { itemName: t, wrapperNames: r } of this.options
                .listTypes)
                if (void 0 !== e.state.schema.nodes[t] && P(e, t, r)) return !0;
              return !1;
            },
          };
        },
      }),
      H = RegExp(`^(\\s*)(${T})([.)])\\s+(.*)$`),
      U = /^\s/,
      G = {
        heading: /^#{1,6}(?:\s|$)/,
        bulletItem: /^[-+*]\s+/,
        codeFence: /^(?:```|~~~)/,
        blockMath: /^\$\$/,
        thematicBreak: /^(?:(?:-[ \t]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})$/,
      },
      W = RegExp(`^(${T})([.)])\\s+(.+)$`),
      V = "textStyle",
      X = /^(\d+)\.\s$/;
    function Y(e) {
      let t = e.match(/list-style-type\s*:\s*([^;]+)/i);
      if (!t) return null;
      switch (t[1].trim().toLowerCase()) {
        case "upper-roman":
          return "I";
        case "lower-roman":
          return "i";
        case "upper-alpha":
        case "upper-latin":
          return "A";
        case "lower-alpha":
        case "lower-latin":
          return "a";
        default:
          return null;
      }
    }
    let J = n.Node.create({
        name: "orderedList",
        addOptions: () => ({
          itemTypeName: "listItem",
          HTMLAttributes: {},
          keepMarks: !1,
          keepAttributes: !1,
        }),
        group: "block list",
        content() {
          return `${this.options.itemTypeName}+`;
        },
        addAttributes: () => ({
          start: {
            default: 1,
            parseHTML: (e) =>
              e.hasAttribute("start")
                ? parseInt(e.getAttribute("start") || "", 10)
                : 1,
          },
          type: {
            default: null,
            parseHTML: (e) => {
              let t = e.getAttribute("type");
              if (t) return t;
              let r = e.getAttribute("style");
              if (r) {
                let e = Y(r);
                if (e) return e;
              }
              let n = e.querySelector("li");
              if (n) {
                let e = n.getAttribute("style");
                if (e) {
                  let t = Y(e);
                  if (t) return t;
                }
              }
              return null;
            },
          },
        }),
        parseHTML: () => [{ tag: "ol" }],
        renderHTML({ HTMLAttributes: e }) {
          let { start: t, type: r, ...i } = e,
            a = (0, n.mergeAttributes)(this.options.HTMLAttributes, i);
          return (
            1 !== t && (a.start = t),
            r && "1" !== r && (a.type = r),
            ["ol", a, 0]
          );
        },
        markdownTokenName: "list",
        parseMarkdown: (e, t) => {
          
          if ("list" !== e.type || !e.ordered) return [];
          let n = e.start || 1,
            i = e.typeMarker,
            a = e.items
              ? ((r = e.items),
                r.map((e) => {
                  if ("list_item" !== e.type) return t.parseChildren([e])[0];
                  let r = [];
                  return (
                    e.tokens &&
                      e.tokens.length > 0 &&
                      e.tokens.forEach((e) => {
                        if (
                          "paragraph" === e.type ||
                          "list" === e.type ||
                          "blockquote" === e.type ||
                          "code" === e.type
                        )
                          r.push(...t.parseChildren([e]));
                        else if ("text" === e.type && e.tokens) {
                          let n = t.parseChildren([e]);
                          r.push({ type: "paragraph", content: n });
                        } else {
                          let n = t.parseChildren([e]);
                          n.length > 0 && r.push(...n);
                        }
                      }),
                    { type: "listItem", content: r }
                  );
                }))
              : [],
            o = {};
          return (1 !== n && (o.start = n),
          i && (o.type = i),
          Object.keys(o).length > 0)
            ? { type: "orderedList", attrs: o, content: a }
            : { type: "orderedList", content: a };
        },
        renderMarkdown: (e, t) =>
          e.content ? t.renderChildren(e.content, "\n") : "",
        markdownTokenizer: {
          name: "orderedList",
          level: "block",
          start: () => -1,
          tokenize: (e, t, r) => {
            
            let a = e.split("\n"),
              [o, s] = (function (e) {
                let t = [],
                  r = 0,
                  n = 0;
                for (; r < e.length; ) {
                  let i = e[r],
                    a = i.match(H);
                  if (!a) break;
                  let [, o, s, l, u] = a,
                    c = o.length,
                    f = parseInt(s, 10),
                    d = isNaN(f) ? z(s) : void 0,
                    p = isNaN(f) ? _(s) : f,
                    h = [u],
                    m = r + 1,
                    g = [i],
                    x = !1;
                  for (; m < e.length; ) {
                    let t = e[m];
                    if (t.match(H)) break;
                    if ("" === t.trim())
                      (g.push(t), h.push(""), (x = !0), (m += 1));
                    else if (t.match(U)) {
                      let e = t.length - t.trimStart().length,
                        r = c + s.length + 1;
                      (g.push(t), h.push(t.slice(Math.min(e, r))), (m += 1));
                    } else {
                      if (
                        x ||
                        (function (e) {
                          return Object.values(G).some((t) => t.test(e));
                        })(t)
                      )
                        break;
                      (g.push(t), h.push(t), (m += 1));
                    }
                  }
                  (t.push({
                    indent: c,
                    number: p,
                    type: d,
                    content: h.join("\n").trim(),
                    contentLines: h,
                    raw: g.join("\n"),
                  }),
                    (n = m),
                    (r = m));
                }
                return [t, n];
              })(a);
            if (0 === o.length) return;
            let l = (function e(t, r, n) {
              let i = [],
                a = 0;
              for (; a < t.length; ) {
                let o = t[a];
                if (o.indent === r) {
                  let { paragraphLines: s, blockLines: l } = (function (e) {
                      let t = [],
                        r = [],
                        n = !1;
                      return (
                        e.forEach((e) => {
                          
                          if (n) return void r.push(e);
                          if (
                            "" === e.trim() ||
                            (t.length > 0 &&
                              ((i = e.trimStart()),
                              G.bulletItem.test(i) ||
                                H.test(i.trimStart()) ||
                                G.heading.test(i) ||
                                (G.thematicBreak.test(i) &&
                                  !i.startsWith("-")) ||
                                /^>\s?/.test(i) ||
                                G.codeFence.test(i) ||
                                G.blockMath.test(i)))
                          ) {
                            ((n = !0), r.push(e));
                            return;
                          }
                          t.push(e);
                        }),
                        { paragraphLines: t, blockLines: r }
                      );
                    })(o.contentLines),
                    u = s.join("\n").trim(),
                    c = [];
                  u &&
                    c.push({
                      type: "paragraph",
                      raw: u,
                      tokens: n.inlineTokens(u),
                    });
                  let f = l.join("\n").trim();
                  if (f) {
                    let e = n.blockTokens(f);
                    c.push(...e);
                  }
                  let d = a + 1,
                    p = [];
                  for (; d < t.length && t[d].indent > r; )
                    (p.push(t[d]), (d += 1));
                  if (p.length > 0) {
                    let t = e(p, Math.min(...p.map((e) => e.indent)), n);
                    c.push({
                      type: "list",
                      ordered: !0,
                      start: p[0].number,
                      typeMarker: p[0].type,
                      items: t,
                      raw: p.map((e) => e.raw).join("\n"),
                    });
                  }
                  (i.push({ type: "list_item", raw: o.raw, tokens: c }),
                    (a = d));
                } else a += 1;
              }
              return i;
            })(o, o[0].indent, r);
            if (0 !== l.length)
              return {
                type: "list",
                ordered: !0,
                start: (null == (n = o[0]) ? void 0 : n.number) || 1,
                typeMarker: null == (i = o[0]) ? void 0 : i.type,
                items: l,
                raw: a.slice(0, s).join("\n"),
              };
          },
        },
        markdownOptions: { indentsContent: !0 },
        addCommands() {
          return {
            toggleOrderedList:
              () =>
              ({ commands: e, chain: t }) =>
                this.options.keepAttributes
                  ? t()
                      .toggleList(
                        this.name,
                        this.options.itemTypeName,
                        this.options.keepMarks,
                      )
                      .updateAttributes(
                        "listItem",
                        this.editor.getAttributes(V),
                      )
                      .run()
                  : e.toggleList(
                      this.name,
                      this.options.itemTypeName,
                      this.options.keepMarks,
                    ),
          };
        },
        addKeyboardShortcuts() {
          return {
            "Mod-Shift-7": () => this.editor.commands.toggleOrderedList(),
          };
        },
        addProseMirrorPlugins: () => [
          new o.Plugin({
            props: {
              handlePaste: (e, t) => {
                
                let i =
                  null == (r = t.clipboardData)
                    ? void 0
                    : r.getData("text/html");
                if (null == i ? void 0 : i.trim()) return !1;
                let a =
                  null == (n = t.clipboardData)
                    ? void 0
                    : n.getData("text/plain");
                if (!a) return !1;
                let o = (function (e) {
                  let t = e.split("\n").filter((e) => e.trim().length > 0);
                  if (0 === t.length) return null;
                  let r = [];
                  for (let e of t) {
                    let t = e.trim().match(W);
                    if (!t) return null;
                    r.push({ marker: t[1], content: t[3] });
                  }
                  return !(function (e) {
                    
                    if (0 === e.length) return !1;
                    let r = null != (t = z(e[0])) ? t : "numeric",
                      n = _(e[0]);
                    if (n < 1) return !1;
                    for (let t = 0; t < e.length; t++) {
                      let i = (function (e, t) {
                        if ("numeric" === e) return String(t);
                        switch (e) {
                          case "a":
                            return O(t);
                          case "A":
                            return O(t).toUpperCase();
                          case "i":
                            return k(t);
                          case "I":
                            return F(t);
                          default:
                            return String(t);
                        }
                      })(r, n + t);
                      if (e[t] !== i) return !1;
                    }
                    return !0;
                  })(r.map((e) => e.marker))
                    ? null
                    : {
                        type: "orderedList",
                        attrs: (function (e) {
                          let { type: t, start: r } = {
                              type: z(e),
                              start: _(e),
                            },
                            n = {};
                          return (
                            t && (n.type = t),
                            1 !== r && (n.start = r),
                            n
                          );
                        })(r[0].marker),
                        content: r.map((e) => ({
                          type: "listItem",
                          content: [
                            {
                              type: "paragraph",
                              content: [{ type: "text", text: e.content }],
                            },
                          ],
                        })),
                      };
                })(a);
                if (!o) return !1;
                try {
                  let t = e.state.schema.nodeFromJSON(o),
                    r = e.state.tr.replaceSelectionWith(t);
                  return (e.dispatch(r), !0);
                } catch {
                  return !1;
                }
              },
            },
          }),
        ],
        addInputRules() {
          let e = (e, t) =>
              (!t.attrs.type || "1" === t.attrs.type) &&
              t.childCount + t.attrs.start === +e[1],
            t = (0, n.wrappingInputRule)({
              find: X,
              type: this.type,
              getAttributes: (e) => ({ start: +e[1] }),
              joinPredicate: e,
            });
          return (
            (this.options.keepMarks || this.options.keepAttributes) &&
              (t = (0, n.wrappingInputRule)({
                find: X,
                type: this.type,
                keepMarks: this.options.keepMarks,
                keepAttributes: this.options.keepAttributes,
                getAttributes: (e) => ({
                  start: +e[1],
                  ...this.editor.getAttributes(V),
                }),
                joinPredicate: e,
                editor: this.editor,
              })),
            [t]
          );
        },
      }),
      K = /^\s*(\[([( |x])?\])\s$/,
      Z = n.Node.create({
        name: "taskItem",
        addOptions: () => ({
          nested: !1,
          HTMLAttributes: {},
          taskListTypeName: "taskList",
          a11y: void 0,
        }),
        content() {
          return this.options.nested ? "paragraph block*" : "paragraph+";
        },
        defining: !0,
        addAttributes: () => ({
          checked: {
            default: !1,
            keepOnSplit: !1,
            parseHTML: (e) => {
              let t = e.getAttribute("data-checked");
              return "" === t || "true" === t;
            },
            renderHTML: (e) => ({ "data-checked": e.checked }),
          },
        }),
        parseHTML() {
          return [
            {
              tag: `li[data-type="${this.name}"]`,
              priority: 51,
              contentElement: (e) => {
                
                return null != (t = e.querySelector("div")) ? t : e;
              },
            },
          ];
        },
        renderHTML({ node: e, HTMLAttributes: t }) {
          return [
            "li",
            (0, n.mergeAttributes)(this.options.HTMLAttributes, t, {
              "data-type": this.name,
            }),
            [
              "label",
              [
                "input",
                {
                  type: "checkbox",
                  checked: e.attrs.checked ? "checked" : null,
                },
              ],
              ["span"],
            ],
            ["div", 0],
          ];
        },
        parseMarkdown: (e, t) => {
          let r = [];
          if (
            (e.tokens && e.tokens.length > 0
              ? r.push(t.createNode("paragraph", {}, t.parseInline(e.tokens)))
              : e.text
                ? r.push(
                    t.createNode("paragraph", {}, [
                      t.createNode("text", { text: e.text }),
                    ]),
                  )
                : r.push(t.createNode("paragraph", {}, [])),
            e.nestedTokens && e.nestedTokens.length > 0)
          ) {
            let n = t.parseChildren(e.nestedTokens);
            r.push(...n);
          }
          return t.createNode("taskItem", { checked: e.checked || !1 }, r);
        },
        renderMarkdown: (e, t) => {
          
          let i = `- [${(null == (r = e.attrs) ? void 0 : r.checked) ? "x" : " "}] `;
          return (0, n.renderNestedMarkdownContent)(e, t, i);
        },
        addExtensions() {
          return this.options.nested
            ? [C(this.name, [this.options.taskListTypeName])]
            : [];
        },
        addKeyboardShortcuts() {
          let e = {
            Enter: () => this.editor.commands.splitListItem(this.name),
            "Shift-Tab": () => this.editor.commands.liftListItem(this.name),
          };
          return this.options.nested
            ? { ...e, Tab: () => this.editor.commands.sinkListItem(this.name) }
            : e;
        },
        addNodeView() {
          return ({ node: e, HTMLAttributes: t, getPos: r, editor: i }) => {
            let a = document.createElement("li"),
              o = document.createElement("label"),
              s = document.createElement("span"),
              l = document.createElement("input"),
              u = document.createElement("div");
            s.style.cssText =
              "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0";
            let c = (e) => {
              
              let i =
                ((t = e.attrs.checked),
                (null == (r = this.options.a11y) ||
                null == (n = r.checkboxLabel)
                  ? void 0
                  : n.call(r, e, t)) ||
                  `Task item checkbox for ${e.textContent || "empty task item"}`);
              (l.setAttribute("aria-label", i), (s.textContent = i));
            };
            (c(e),
              (o.contentEditable = "false"),
              (l.type = "checkbox"),
              l.addEventListener("mousedown", (e) => e.preventDefault()),
              l.addEventListener("change", (t) => {
                if (!i.isEditable && !this.options.onReadOnlyChecked) {
                  l.checked = !l.checked;
                  return;
                }
                let { checked: n } = t.target;
                (i.isEditable &&
                  "function" == typeof r &&
                  i
                    .chain()
                    .focus(void 0, { scrollIntoView: !1 })
                    .command(({ tr: e }) => {
                      let t = r();
                      if ("number" != typeof t) return !1;
                      let i = e.doc.nodeAt(t);
                      return (
                        e.setNodeMarkup(t, void 0, {
                          ...(null == i ? void 0 : i.attrs),
                          checked: n,
                        }),
                        !0
                      );
                    })
                    .run(),
                  i.isEditable ||
                    !this.options.onReadOnlyChecked ||
                    this.options.onReadOnlyChecked(e, n) ||
                    (l.checked = !l.checked));
              }),
              Object.entries(this.options.HTMLAttributes).forEach(([e, t]) => {
                a.setAttribute(e, t);
              }),
              (a.dataset.checked = e.attrs.checked),
              (l.checked = e.attrs.checked),
              o.append(l, s),
              a.append(o, u),
              Object.entries(t).forEach(([e, t]) => {
                a.setAttribute(e, t);
              }));
            let f = new Set(Object.keys(t));
            return {
              dom: a,
              contentDOM: u,
              update: (e) => {
                if (e.type !== this.type) return !1;
                ((a.dataset.checked = e.attrs.checked),
                  (l.checked = e.attrs.checked),
                  c(e));
                let t = i.extensionManager.attributes,
                  r = (0, n.getRenderedAttributes)(e, t),
                  o = new Set(Object.keys(r)),
                  s = this.options.HTMLAttributes;
                return (
                  f.forEach((e) => {
                    o.has(e) ||
                      (e in s ? a.setAttribute(e, s[e]) : a.removeAttribute(e));
                  }),
                  Object.entries(r).forEach(([e, t]) => {
                    null == t
                      ? e in s
                        ? a.setAttribute(e, s[e])
                        : a.removeAttribute(e)
                      : a.setAttribute(e, t);
                  }),
                  (f = o),
                  !0
                );
              },
            };
          };
        },
        addInputRules() {
          return [
            (0, n.wrappingInputRule)({
              find: K,
              type: this.type,
              getAttributes: (e) => ({ checked: "x" === e[e.length - 1] }),
            }),
          ];
        },
      }),
      Q = n.Node.create({
        name: "taskList",
        addOptions: () => ({ itemTypeName: "taskItem", HTMLAttributes: {} }),
        group: "block list",
        content() {
          return `${this.options.itemTypeName}+`;
        },
        parseHTML() {
          return [{ tag: `ul[data-type="${this.name}"]`, priority: 51 }];
        },
        renderHTML({ HTMLAttributes: e }) {
          return [
            "ul",
            (0, n.mergeAttributes)(this.options.HTMLAttributes, e, {
              "data-type": this.name,
            }),
            0,
          ];
        },
        parseMarkdown: (e, t) =>
          t.createNode("taskList", {}, t.parseChildren(e.items || [])),
        renderMarkdown: (e, t) =>
          e.content ? t.renderChildren(e.content, "\n") : "",
        markdownTokenizer: {
          name: "taskList",
          level: "block",
          start(e) {
            
            let r =
              null == (t = e.match(/^\s*[-+*]\s+\[([ xX])\]\s+/))
                ? void 0
                : t.index;
            return void 0 !== r ? r : -1;
          },
          tokenize(e, t, r) {
            let i = (e) => {
                let t = (0, n.parseIndentedBlocks)(
                  e,
                  {
                    itemPattern: /^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,
                    extractItemData: (e) => ({
                      indentLevel: e[1].length,
                      mainContent: e[4],
                      checked: "x" === e[3].toLowerCase(),
                    }),
                    createToken: (e, t) => ({
                      type: "taskItem",
                      raw: "",
                      mainContent: e.mainContent,
                      indentLevel: e.indentLevel,
                      checked: e.checked,
                      text: e.mainContent,
                      tokens: r.inlineTokens(e.mainContent),
                      nestedTokens: t,
                    }),
                    customNestedParser: i,
                  },
                  r,
                );
                if (t) {
                  let n = { type: "taskList", raw: t.raw, items: t.items },
                    i = e.slice(t.raw.length);
                  return i.trim() ? [n, ...r.blockTokens(i)] : [n];
                }
                return r.blockTokens(e);
              },
              a = (0, n.parseIndentedBlocks)(
                e,
                {
                  itemPattern: /^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,
                  extractItemData: (e) => ({
                    indentLevel: e[1].length,
                    mainContent: e[4],
                    checked: "x" === e[3].toLowerCase(),
                  }),
                  createToken: (e, t) => ({
                    type: "taskItem",
                    raw: "",
                    mainContent: e.mainContent,
                    indentLevel: e.indentLevel,
                    checked: e.checked,
                    text: e.mainContent,
                    tokens: r.inlineTokens(e.mainContent),
                    nestedTokens: t,
                  }),
                  customNestedParser: i,
                },
                r,
              );
            if (a) return { type: "taskList", raw: a.raw, items: a.items };
          },
        },
        markdownOptions: { indentsContent: !0 },
        addCommands() {
          return {
            toggleTaskList:
              () =>
              ({ commands: e }) =>
                e.toggleList(this.name, this.options.itemTypeName),
          };
        },
        addKeyboardShortcuts() {
          return { "Mod-Shift-9": () => this.editor.commands.toggleTaskList() };
        },
      });
    n.Extension.create({
      name: "listKit",
      addExtensions() {
        let e = [];
        return (
          !1 !== this.options.bulletList &&
            e.push(D.configure(this.options.bulletList)),
          !1 !== this.options.listItem &&
            e.push(j.configure(this.options.listItem)),
          !1 !== this.options.listKeymap &&
            e.push(q.configure(this.options.listKeymap)),
          !1 !== this.options.orderedList &&
            e.push(J.configure(this.options.orderedList)),
          !1 !== this.options.taskItem &&
            e.push(Z.configure(this.options.taskItem)),
          !1 !== this.options.taskList &&
            e.push(Q.configure(this.options.taskList)),
          e
        );
      },
    });
    var ee = m690256,
      et = m756044,
      er = m649717,
      en = m76399;
    let ei = n.Extension.create({
      name: "starterKit",
      addExtensions() {
        
        let a = [];
        return (
          !1 !== this.options.bold &&
            a.push(c.Bold.configure(this.options.bold)),
          !1 !== this.options.blockquote &&
            a.push(u.configure(this.options.blockquote)),
          !1 !== this.options.bulletList &&
            a.push(D.configure(this.options.bulletList)),
          !1 !== this.options.code && a.push(p.configure(this.options.code)),
          !1 !== this.options.codeBlock &&
            a.push(g.configure(this.options.codeBlock)),
          !1 !== this.options.document &&
            a.push(x.Document.configure(this.options.document)),
          !1 !== this.options.dropcursor &&
            a.push(t.Dropcursor.configure(this.options.dropcursor)),
          !1 !== this.options.gapcursor &&
            a.push(t.Gapcursor.configure(this.options.gapcursor)),
          !1 !== this.options.hardBreak &&
            a.push(y.HardBreak.configure(this.options.hardBreak)),
          !1 !== this.options.heading &&
            a.push(b.configure(this.options.heading)),
          !1 !== this.options.undoRedo &&
            a.push(t.UndoRedo.configure(this.options.undoRedo)),
          !1 !== this.options.horizontalRule &&
            a.push(v.configure(this.options.horizontalRule)),
          !1 !== this.options.italic &&
            a.push(w.Italic.configure(this.options.italic)),
          !1 !== this.options.listItem &&
            a.push(j.configure(this.options.listItem)),
          !1 !== this.options.listKeymap &&
            a.push(
              q.configure(null == (e = this.options) ? void 0 : e.listKeymap),
            ),
          !1 !== this.options.link &&
            a.push(
              N.Link.configure(null == (r = this.options) ? void 0 : r.link),
            ),
          !1 !== this.options.orderedList &&
            a.push(J.configure(this.options.orderedList)),
          !1 !== this.options.paragraph &&
            a.push(ee.Paragraph.configure(this.options.paragraph)),
          !1 !== this.options.strike &&
            a.push(et.Strike.configure(this.options.strike)),
          !1 !== this.options.text &&
            a.push(er.Text.configure(this.options.text)),
          !1 !== this.options.underline &&
            a.push(
              en.Underline.configure(
                null == (n = this.options) ? void 0 : n.underline,
              ),
            ),
          !1 !== this.options.trailingNode &&
            a.push(
              t.TrailingNode.configure(
                null == (i = this.options) ? void 0 : i.trailingNode,
              ),
            ),
          a
        );
      },
    });
    ;
