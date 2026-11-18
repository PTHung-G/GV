// Reconstructed from 180c0fplvd4t3.pretty.js, module 747925.
// deps: m843476, m271645, m689664, m576248, m632781, m954808, m647163, m167881, m456420
// exports: ClarificationWizard, ShieldAlert, Wrench
export { function ({ clarifications: e, disabled: l = !1, answered: s = !1, onSubmit: o, }) { let [c, u] = n.useState({}), [d, h] = n.useState({}), [m, p] = n.useState({}), [f, g] = n.useState({}), [x, b] = n.useState(""), v = n.useMemo( () => (e || []).map((e) => ({ name: e.id, required: !1, choices: e.options.map((e) => ({ value: e.label })), })), [e], ); if (!e || 0 === e.length) return null; if (1 === e.length && "confirm" === e[0].kind) { let n = e[0], r = (e) => { l || s || c[n.id] || (u({ [n.id]: e }), o( [ { id: n.id, question: n.question, proposal: n.proposal, kind: "confirm", answer: e, }, ], e, )); }, a = c[n.id]; return (0, t.jsxs)("div", { className: "space-y-2 text-sm", children: [ (0, t.jsx)("p", { children: n.proposal }), s || a ? (0, t.jsx)("p", { className: "text-xs text-neutral-500", children: a || "Đã trả lời", }) : (0, t.jsxs)(t.Fragment, { children: [ (0, t.jsx)("p", { children: n.question }), (0, t.jsxs)("div", { className: "flex gap-2", children: [ (0, t.jsx)("button", { type: "button", disabled: l, onClick: () => r("Đồng ý"), className: "rounded-lg bg-[#37352f] px-4 py-1.5 text-white disabled:opacity-50", children: "Có", }), (0, t.jsx)("button", { type: "button", disabled: l, onClick: () => r("Không đồng ý"), className: "rounded-lg border border-neutral-300 px-4 py-1.5 disabled:opacity-50", children: "Không", }), ], }), ], }), ], }); } return (0, t.jsx)("div", { className: "mt-3 rounded-xl border border-[#a8cff0]/80 bg-white p-3.5 shadow-xs transition-all", children: s ? (0, t.jsxs)("div", { className: "space-y-2 py-1", children: [ (0, t.jsxs)("div", { className: "flex items-center gap-2 rounded-lg bg-[#f7f6f3] border border-[#a8cff0]/60 px-3 py-2 text-xs font-medium text-[#0b6bcb]", children: [ (0, t.jsx)(r.Check, { className: "size-4 shrink-0 text-[#2383e2]", }), (0, t.jsx)("span", { children: e.some((e) => "confirm" === e.kind) ? "Đã gửi xác nhận kế hoạch." : "Đã gửi lựa chọn.", }), ], }), (0, t.jsx)("div", { className: "space-y-1.5 pt-1", children: e.map((n, r) => { let a = c[n.id]; return (0, t.jsxs)( "div", { className: "text-[11px] leading-relaxed text-neutral-600", children: [ (0, t.jsxs)("span", { className: "font-medium text-neutral-700", children: [ e.length > 1 ? `${r + 1}. ` : "", n.question, ":", ], }), " ", (0, t.jsx)("span", { className: "font-medium text-[#0b6bcb]", children: a || "Đã gửi", }), ], }, n.id, ); }), }), ], }) : (0, t.jsxs)(O, { items: v, shortcuts: "letters", onSubmit: (t) => { if ((t.preventDefault(), l || s)) return; let n = new FormData(t.currentTarget), r = {}; for (let t of e) { let e = n .getAll(t.id) .map(String) .map((e) => e.trim()) .filter((e) => t.options.some((t) => t.label === e)), a = (d[t.id] || "").trim(); if ("confirm" === t.kind) { let n = e[0] || f[t.id]?.[0]; if ("Đồng ý" !== n && "Không đồng ý" !== n) return void b( `Vui l\xf2ng x\xe1c nhận: ${t.question}`, ); r[t.id] = n; continue; } let i = f[t.id] ?? e; if (0 === i.length && !a) return void b( `Vui l\xf2ng chọn hoặc nhập \xfd kiến: ${t.question}`, ); let l = []; for (let e of i) { let n = t.options.find((t) => t.label === e), r = n && Y(n); if (r) { let n = (m[t.id]?.[e] || "").trim(); if (!n) return void b( `Vui l\xf2ng nhập ${r.label.toLowerCase()} cho lựa chọn “${e}”.`, ); l.push(`${e} — ${r.label}: ${n}`); } else l.push(e); } (a && l.push(`\xdd kiến kh\xe1c: ${a}`), (r[t.id] = l.join("; "))); } (b(""), u(r), o( e.map((e) => ({ id: e.id, question: e.question, answer: r[e.id] || "", kind: e.kind || "choice", proposal: e.proposal, })), e .map( (e, t) => `${t + 1}. ${e.question}: ${r[e.id] || ""}`, ) .join("\n"), )); }, children: [ (0, t.jsxs)("div", { className: "mb-3 flex items-center justify-between border-b border-neutral-100 pb-2.5", children: [ (0, t.jsxs)("div", { className: "flex items-center gap-1.5 text-xs font-medium text-[#0b6bcb]", children: [ (0, t.jsx)(a.HelpCircle, { className: "size-4 text-[#2383e2]", }), (0, t.jsx)("span", { children: e.some((e) => "confirm" === e.kind) ? "Duyệt kế hoạch tạo đề" : "Thông tin cần làm rõ", }), ], }), e.length > 1 && (0, t.jsx)(L, { render: (e, n) => (0, t.jsxs)("div", { ...e, className: "flex items-center gap-2", children: [ (0, t.jsxs)("span", { className: "text-[11px] font-medium text-neutral-500 tabular-nums", children: [ "Câu ", n.current, " / ", n.total, ], }), (0, t.jsx)("div", { className: "flex items-center gap-1", children: Array.from({ length: n.total, }).map((e, r) => (0, t.jsx)( "span", { className: `h-1.5 rounded-full transition-all ${r + 1 === n.current ? "w-3.5 bg-[#2383e2]" : r + 1 < n.current ? "w-1.5 bg-[#7cacf8]" : "w-1.5 bg-neutral-200"}`, }, r, ), ), }), ], }), }), ], }), e.map((e) => { let n = (d[e.id] || "").trim(), r = f[e.id] || [], a = "confirm" === e.kind, i = r.every((t) => { let n = e.options.find((e) => e.label === t); return !(n && Y(n)) || !!m[e.id]?.[t]?.trim(); }), s = a ? r.includes("Đồng ý") || r.includes("Không đồng ý") : (r.length > 0 || n.length > 0) && i; return (0, t.jsxs)( F, { name: e.id, multiple: e.multiSelect, required: !s, children: [ (0, t.jsx)(H, { children: e.question }), e.proposal && (0, t.jsx)("div", { className: "my-2 whitespace-pre-wrap rounded-lg border border-[#d3e5ef] bg-[#f7f6f3]/70 p-2.5 text-xs leading-relaxed text-neutral-700", children: e.proposal, }), (0, t.jsxs)(B, { children: [ e.options.map((n) => (0, t.jsxs)( K, { value: n.label, checked: r.includes(n.label), onChange: (t) => { let r = t.currentTarget.checked; (e.multiSelect || a || !r || h((t) => ({ ...t, [e.id]: "" })), g((t) => { let a = t[e.id] || []; return e.multiSelect ? { ...t, [e.id]: r ? [ ...a.filter( (e) => e !== n.label, ), n.label, ] : a.filter( (e) => e !== n.label, ), } : { ...t, [e.id]: r ? [n.label] : [], }; })); }, children: [ (0, t.jsx)("span", { className: "font-medium text-xs text-neutral-800", children: n.label, }), n.description ? (0, t.jsx)(V, { className: "text-[11px] text-neutral-500", children: n.description, }) : null, ], }, n.label, ), ), !a && (0, t.jsx)(U, { placeholder: e.customPlaceholder || "Mô tả phương án khác bạn muốn...", "aria-label": "Lựa chọn khác", disabled: l, value: d[e.id] || "", onChange: (t) => { let n = t.target.value; (h((t) => ({ ...t, [e.id]: n })), !e.multiSelect && !a && n.trim() && g((t) => ({ ...t, [e.id]: [] }))); }, }), r.map((n) => { let r = e.options.find((e) => e.label === n), a = r && Y(r); return a ? (0, t.jsxs)( "label", { className: "block space-y-1.5 pt-1 text-xs font-medium text-neutral-700", children: [ (0, t.jsx)("span", { children: a.label, }), (0, t.jsx)("input", { type: "text", placeholder: a.placeholder || `Nhập ${a.label.toLowerCase()}...`, "aria-label": `${a.label} cho lựa chọn ${n}`, disabled: l, value: m[e.id]?.[n] || "", onChange: (t) => p((r) => ({ ...r, [e.id]: { ...r[e.id], [n]: t.target.value, }, })), className: "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-normal outline-none focus:border-[#2383e2] focus:ring-2 focus:ring-[#2383e2]/15", }), ], }, n, ) : null; }), ], }), (0, t.jsx)(G, { children: "Vui lòng chọn hoặc nhập câu trả lời để tiếp tục.", }), ], }, e.id, ); }), x && (0, t.jsx)("p", { role: "alert", className: "mt-2 text-xs text-rose-600", children: x, }), (0, t.jsxs)(X, { children: [ (0, t.jsx)(Q, { disabled: l, children: "Quay lại" }), (0, t.jsxs)("div", { className: "ml-auto flex items-center gap-2", children: [ (0, t.jsx)(W, { disabled: l, children: "Tiếp theo", }), (0, t.jsx)(J, { disabled: l, children: l ? (0, t.jsxs)("span", { className: "flex items-center gap-1.5", children: [ (0, t.jsx)(i.Loader2, { className: "size-3.5 animate-spin", }), (0, t.jsx)("span", { children: "Đang gửi...", }), ], }) : e.some((e) => "confirm" === e.kind) ? "Xác nhận kế hoạch" : "Gửi lựa chọn", }), ], }), ], }), ], }), }); } as "ClarificationWizard" };
export { ee as "ShieldAlert" };
export { et as "Wrench" };

"use strict";
    var t = m843476,
      n = m271645,
      r = m689664,
      a = m576248,
      i = m632781,
      l = m954808,
      s = n.createContext(null),
      o = n.createContext(null),
      c = n.createContext(null);
    function u(e) {
      let t = n.useContext(o);
      if (!t)
        throw Error(`${e} must be used within a Questionnaire.Root component.`);
      return t;
    }
    function d(e) {
      let t = n.useContext(s);
      if (!t)
        throw Error(
          `${e} must be used within a Questionnaire.Choice component.`,
        );
      return t;
    }
    function h(e) {
      let t = n.useContext(c);
      if (!t)
        throw Error(`${e} must be used within a Questionnaire.Item component.`);
      return t;
    }
    function m(e) {
      return Array.isArray(e)
        ? e.some((e) => String(e).trim().length > 0)
        : null != e && String(e).trim().length > 0;
    }
    function p(e) {
      return "letters" === e
        ? Array.from({ length: 26 }, (e, t) => String.fromCharCode(65 + t))
        : "numbers" === e
          ? Array.from({ length: 9 }, (e, t) => String(t + 1))
          : [];
    }
    function f(e, t) {
      return [e, t ? "Enter" : null].filter(Boolean).join(" ") || void 0;
    }
    function g(e) {
      return "choice" === e.type
        ? e.element.checked
        : e.element.hasAttribute("name") && m(e.element.value);
    }
    function x(e) {
      return (
        !!(
          e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement
        ) ||
        (e instanceof HTMLInputElement
          ? !["button", "checkbox", "radio", "reset", "submit"].includes(e.type)
          : e instanceof HTMLElement && e.isContentEditable)
      );
    }
    function b(e) {
      return e instanceof HTMLInputElement && "radio" === e.type;
    }
    function v(e, t) {
      if (e.element === t.element) return 0;
      let n = e.element.compareDocumentPosition(t.element);
      return n & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : n & Node.DOCUMENT_POSITION_PRECEDING
          ? 1
          : 0;
    }
    function y(e, t) {
      if (e.element === t.element) return 0;
      let n = e.element.compareDocumentPosition(t.element);
      return n & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : n & Node.DOCUMENT_POSITION_PRECEDING
          ? 1
          : 0;
    }
    function w(e, t) {
      if (!e) return t ?? null;
      let n = t ? e.itemByName.get(t) : void 0;
      return n && !n.disabled ? n.name : (e.enabledItems[0]?.name ?? null);
    }
    function k({
      children: e,
      disabled: t,
      onClick: n,
      props: r,
      render: a,
      shortcut: i,
      status: s,
      tabIndex: o,
      type: c,
      visible: u,
    }) {
      let d = u && !t ? (i ?? null) : null;
      return (0, l.a)({
        defaultTagName: "button",
        props: (0, l.b)(
          {
            "aria-hidden": !u || void 0,
            "aria-keyshortcuts": d ?? void 0,
            children: e,
            disabled: t,
            hidden: !u,
            inert: !u,
            onClick: n,
            tabIndex: u ? o : -1,
            type: c,
          },
          r,
        ),
        render: a,
        state: { disabled: t, shortcut: d, status: s, visible: u },
        stateAttributesMapping: {
          visible: (e) => ({
            "data-hidden": e ? void 0 : "",
            "data-visible": e ? "" : void 0,
          }),
        },
      });
    }
    var j = function ({
        defaultItem: e,
        item: r,
        items: a,
        noValidate: i = !0,
        onItemChange: s,
        onReset: c,
        onSubmit: u,
        ref: d,
        shortcuts: h,
        ...m
      }) {
        let {
            context: f,
            rootProps: y,
            state: k,
          } = (function ({
            defaultItem: e,
            item: t,
            items: r,
            noValidate: a,
            onItemChange: i,
            onReset: s,
            onSubmit: o,
            ref: c,
            shortcuts: u,
          }) {
            let d = n.useMemo(
                () =>
                  void 0 === r
                    ? null
                    : {
                        enabledItems: r.filter((e) => !e.disabled),
                        itemByName: new Map(r.map((e) => [e.name, e])),
                        items: r,
                      },
                [r],
              ),
              [h, m] = n.useState([]),
              [f, y] = n.useState(() => w(d, e)),
              [k, j] = n.useState(null),
              [C, N] = n.useState(0),
              S = n.useRef(null),
              M = void 0 !== t,
              R = M ? t : f,
              I = n.useRef(R),
              A = !1 === a,
              T = u ?? null;
            (n.useRef(new Set()),
              n.useLayoutEffect(() => {}, [d, e, h, k, T]),
              n.useLayoutEffect(() => {
                if (!k || typeof MutationObserver > "u") return;
                let e = new MutationObserver(() => {
                  N((e) => e + 1);
                });
                return (
                  e.observe(k, { childList: !0, subtree: !0 }),
                  () => e.disconnect()
                );
              }, [k]));
            let E = n.useMemo(
                () => h.filter((e) => !e.disabled).sort(v),
                [C, h],
              ),
              P = n.useMemo(() => new Map(E.map((e) => [e.name, e])), [E]),
              $ = d?.enabledItems ?? E,
              _ = $.findIndex((e) => e.name === R),
              q = _ < 0 || !R ? null : (P.get(R) ?? null),
              z = R ? d?.itemByName.get(R) : void 0,
              D = _ < 0 ? null : z ? !!z.required : (q?.required ?? !1),
              O = _ < 0 ? null : (q?.status ?? (R ? "unanswered" : null)),
              L = n.useMemo(
                () =>
                  d
                    ? d.enabledItems.flatMap((e) => {
                        let t = P.get(e.name);
                        return t ? [t] : [];
                      })
                    : E,
                [d, P, E],
              ),
              F = $.length,
              H = _ < 0 ? 0 : _ + 1,
              B = F > 0 && 0 === _,
              K = F > 0 && _ === F - 1,
              V = n.useCallback(
                (e, t = "item") => {
                  e !== R &&
                    ((S.current = { name: e, target: t }), M || y(e), i?.(e));
                },
                [R, M, i],
              );
            n.useLayoutEffect(() => {
              if (0 === F) return;
              if (_ < 0)
                return M || null !== R ? void V($[0].name) : void y($[0].name);
              let e = S.current,
                t = I.current !== R;
              if (((I.current = R), !e || e.name !== R)) {
                M && t && ((S.current = null), q?.focus());
                return;
              }
              ("invalid" === e.target ? q?.focusInvalid() : q?.focus(),
                (S.current = null));
            }, [q, R, M, _, $, V, F]);
            let U = n.useCallback(
                (e) => (
                  m((t) => [
                    ...t.filter(
                      (t) => t.element !== e.element && t.name !== e.name,
                    ),
                    e,
                  ]),
                  () => {
                    m((t) => t.filter((t) => t !== e));
                  }
                ),
                [],
              ),
              G = n.useCallback(() => {
                _ <= 0 || V($[_ - 1].name);
              }, [_, $, V]),
              X = n.useCallback(() => {
                if (!(!q || _ >= F - 1)) {
                  if (!q.validate()) return void q.focusInvalid();
                  V($[_ + 1].name);
                }
              }, [q, _, $, V, F]),
              Q = n.useCallback(() => {
                if (q) {
                  if (!q.validate()) return void q.focusInvalid();
                  if (K) return void k?.requestSubmit();
                  V($[_ + 1].name);
                }
              }, [q, _, K, $, k, V]),
              W = n.useCallback(() => {
                if (!(!q || q.required)) {
                  if ((q.skip(), !K)) return void V($[_ + 1].name);
                  queueMicrotask(() => {
                    k?.requestSubmit();
                  });
                }
              }, [q, _, K, $, k, V]),
              J = { current: H, first: B, last: K, total: F };
            return {
              context: n.useMemo(
                () => ({
                  ...J,
                  activeItem: q,
                  activeItemName: R,
                  activeItemRequired: D,
                  activeItemStatus: O,
                  domVersion: C,
                  goNext: X,
                  goPrevious: G,
                  itemDefinitionByName: d?.itemByName ?? null,
                  nativeValidation: A,
                  registerItem: U,
                  shortcuts: T,
                  skipCurrent: W,
                }),
                [q, R, D, O, d, H, C, B, X, G, K, A, U, T, W, F],
              ),
              rootProps: {
                "data-shortcuts": T ?? void 0,
                onKeyDown: function (e) {
                  
                  
                  if (
                    e.defaultPrevented ||
                    e.nativeEvent.isComposing ||
                    229 === e.keyCode ||
                    !q ||
                    !(e.target instanceof Element)
                  )
                    return;
                  if (
                    "Enter" === e.key &&
                    (e.metaKey || e.ctrlKey) &&
                    !e.altKey &&
                    !e.shiftKey
                  ) {
                    (e.preventDefault(), e.repeat || Q());
                    return;
                  }
                  if (e.metaKey || e.ctrlKey || e.altKey) return;
                  if (
                    ("ArrowUp" === e.key || "ArrowDown" === e.key) &&
                    q.moveAnswerFocus(
                      e.target,
                      "ArrowDown" === e.key ? "next" : "previous",
                    )
                  )
                    return void e.preventDefault();
                  if (
                    ("ArrowLeft" === e.key || "ArrowRight" === e.key) &&
                    !x(e.target) &&
                    !b(e.target)
                  ) {
                    if ((e.preventDefault(), e.repeat)) return;
                    "ArrowLeft" === e.key
                      ? G()
                      : "unanswered" !== q.status && X();
                    return;
                  }
                  if ("Enter" === e.key) {
                    let t = q.getAnswerByElement(e.target);
                    if (!t) return;
                    (e.preventDefault(), !e.repeat && g(t) && Q());
                    return;
                  }
                  if (!T || x(e.target)) return;
                  let r =
                      ((t = e.key),
                      (n = "letters" === T ? t.toUpperCase() : t),
                      p(T).includes(n) ? n : null),
                    a = r ? q.getAnswerByShortcut(r) : null;
                  a &&
                    (e.preventDefault(),
                    e.repeat ||
                      (a.element.focus(),
                      "choice" === a.type && a.element.click()));
                },
                onReset: function (t) {
                  if ((s?.(t), t.defaultPrevented)) return;
                  for (let e of h) e.reset();
                  let n = d
                    ? w(d, e)
                    : (E.find((t) => t.name === e)?.name ?? E[0]?.name);
                  n && V(n);
                },
                onSubmit: function (e) {
                  let t = L.find((e) => !e.validate());
                  if (t) {
                    (e.preventDefault(),
                      V(t.name, "invalid"),
                      t.name === R && (t.focusInvalid(), (S.current = null)));
                    return;
                  }
                  o?.(e);
                },
                ref: n.useCallback(
                  (e) => {
                    (j(e), (0, l.c)(c)?.(e));
                  },
                  [c],
                ),
              },
              state: J,
            };
          })({
            defaultItem: e,
            item: r,
            items: a,
            noValidate: i,
            onItemChange: s,
            onReset: c,
            onSubmit: u,
            ref: d,
            shortcuts: h,
          }),
          j = (0, l.a)({
            defaultTagName: "form",
            props: (0, l.b)({ ...y, noValidate: i }, m),
            state: k,
          });
        return (0, t.jsx)(o.Provider, { value: f, children: j });
      },
      C = function ({ children: e, render: t, ...n }) {
        let {
            current: r,
            first: a,
            last: i,
            total: s,
          } = u("Questionnaire.Progress"),
          o = s ? `Question ${r} of ${s}` : void 0;
        return (0, l.a)({
          defaultTagName: "div",
          props: (0, l.b)(
            {
              "aria-label": "Questionnaire progress",
              "aria-live": "polite",
              "aria-valuemax": s || void 0,
              "aria-valuemin": s ? 1 : void 0,
              "aria-valuenow": s ? r : void 0,
              "aria-valuetext": o,
              children: e ?? o,
              role: "progressbar",
            },
            n,
          ),
          render: t,
          state: { current: r, first: a, last: i, total: s },
        });
      },
      N = function ({
        "aria-describedby": e,
        "aria-keyshortcuts": r,
        children: a,
        disabled: i = !1,
        invalid: s = !1,
        multiple: o = !1,
        name: d,
        onStatusChange: h,
        ref: f,
        required: v = !1,
        ...w
      }) {
        let {
            context: k,
            itemProps: j,
            state: C,
          } = (function ({
            "aria-describedby": e,
            "aria-keyshortcuts": t,
            disabled: r = !1,
            invalid: a = !1,
            multiple: i = !1,
            name: s,
            onStatusChange: o,
            ref: c,
            required: d = !1,
          }) {
            let {
                activeItemName: h,
                domVersion: f,
                first: v,
                itemDefinitionByName: w,
                last: k,
                nativeValidation: j,
                registerItem: C,
                shortcuts: N,
              } = u("Questionnaire.Item"),
              [S, M] = n.useState(null),
              [R, I] = n.useState([]),
              [A, T] = n.useState(!1),
              [E, P] = n.useState([]),
              [$, _] = n.useState(!1),
              [q, z] = n.useState(0),
              [D, O] = n.useState([]),
              [L, F] = n.useState([]),
              H = n.useRef([]),
              B = n.useRef(i),
              K = n.useRef(i);
            B.current = i;
            let V = !r && h === s,
              U = n.useMemo(() => [...R].sort(y), [R, f]),
              G = n.useMemo(() => U.filter((e) => !e.disabled), [U]),
              X = G.some((e) => E.includes(e.id)),
              Q = $ ? "skipped" : X ? "answered" : "unanswered",
              W = "skipped" === Q && !d,
              J = r || W || (!a && "answered" === Q),
              Y = !r && !W && (a || (A && !J)),
              Z = G.some((e) => "input" === e.type),
              ee = n.useRef(Q),
              et = w?.get(s),
              en = n.useMemo(
                () =>
                  w
                    ? (function (e, t) {
                        let n = new Map();
                        if (!e || !t) return n;
                        let r = p(t),
                          a = 0;
                        for (let t of e.choices ?? []) {
                          if (t.disabled) continue;
                          let e = r[a];
                          if (!e) break;
                          (n.set(t.value, e), (a += 1));
                        }
                        return n;
                      })(et, N)
                    : null,
                [et, w, N],
              ),
              er = n.useMemo(() => {
                if (en) return new Map();
                let e = p(N);
                return new Map(
                  G.filter((e) => "choice" === e.type)
                    .slice(0, e.length)
                    .map((t, n) => [t.id, e[n]]),
                );
              }, [G, en, N]),
              ea = n.useCallback(
                (e) => (
                  I((t) => [
                    ...t.filter(
                      (t) => t.element !== e.element && t.id !== e.id,
                    ),
                    e,
                  ]),
                  () => {
                    I((t) => t.filter((t) => t !== e));
                  }
                ),
                [],
              );
            n.useLayoutEffect(() => {
              ee.current !== Q && ((ee.current = Q), o?.(Q));
            }, [o, Q]);
            let ei = n.useCallback(
                (e, t) => {
                  P((n) =>
                    t
                      ? i
                        ? n.includes(e)
                          ? n
                          : [...n, e]
                        : [e]
                      : n.filter((t) => t !== e),
                  );
                },
                [i],
              ),
              el = n.useCallback(
                (e, t) => {
                  (_(!1), ei(e, t));
                },
                [ei],
              ),
              es = n.useCallback(
                (e, t) => {
                  (t && _(!1), ei(e, t));
                },
                [ei],
              ),
              eo = n.useCallback(
                (e, t) => (
                  t &&
                    ((H.current = [...H.current.filter((t) => t !== e), e]),
                    P((t) =>
                      B.current
                        ? t.includes(e)
                          ? t
                          : [...t, e]
                        : t.length
                          ? t
                          : [e],
                    )),
                  () => {
                    ((H.current = H.current.filter((t) => t !== e)),
                      P((t) => t.filter((t) => t !== e)));
                  }
                ),
                [],
              ),
              ec = n.useCallback((e, t) => {
                if (t) {
                  H.current = H.current.includes(e)
                    ? H.current
                    : [...H.current, e];
                  return;
                }
                H.current = H.current.filter((t) => t !== e);
              }, []),
              eu = n.useCallback(
                (e) => (
                  O((t) => (t.includes(e) ? t : [...t, e])),
                  () => {
                    O((t) => t.filter((t) => t !== e));
                  }
                ),
                [],
              ),
              ed = n.useCallback(
                (e) => (
                  F((t) => (t.includes(e) ? t : [...t, e])),
                  () => {
                    F((t) => t.filter((t) => t !== e));
                  }
                ),
                [],
              ),
              eh = n.useCallback(() => {
                if ((T(!0), !J)) return !1;
                if (!j) return !0;
                let e = G.find(
                  (e) =>
                    g(e) && e.element.willValidate && !e.element.validity.valid,
                );
                return (
                  !e || (e.element.focus(), e.element.reportValidity(), !1)
                );
              }, [G, j, J]),
              em = n.useCallback(() => {
                S?.focus();
              }, [S]),
              ep = n.useCallback(() => {
                let e = S?.querySelector(
                    "input[data-filled][name]:not(:disabled)",
                  ),
                  t = S?.querySelector(
                    "input:not([type=hidden]):not(:disabled), textarea:not(:disabled)",
                  );
                (e ?? t ?? S)?.focus();
              }, [S]),
              ef = n.useCallback(() => {
                (T(!1),
                  _(!1),
                  P(i ? [...H.current] : H.current.slice(0, 1)),
                  z((e) => e + 1));
              }, [i]),
              eg = n.useCallback(() => {
                d || (P([]), _(!0));
              }, [d]);
            n.useLayoutEffect(() => {
              let e = K.current;
              ((K.current = i),
                !e ||
                  i ||
                  P((e) => {
                    let t = G.find((t) => e.includes(t.id));
                    return t ? [t.id] : [];
                  }));
            }, [G, i]);
            let ex = n.useCallback(
                (e) => G.find((t) => t.element === e) ?? null,
                [G],
              ),
              eb = n.useCallback(
                (e) => {
                  if (en) {
                    let t = Array.from(en.entries()).find(
                      ([, t]) => t === e,
                    )?.[0];
                    return (
                      G.find((e) => "choice" === e.type && e.value === t) ??
                      null
                    );
                  }
                  let t = Array.from(er.entries()).find(
                    ([, t]) => t === e,
                  )?.[0];
                  return G.find((e) => e.id === t) ?? null;
                },
                [G, er, en],
              ),
              ev = n.useCallback(
                (e, t) => {
                  let n = G.findIndex((t) => t.element === e),
                    r = n < 0 ? null : (G[n] ?? null);
                  if (
                    !G.length ||
                    (x(e) &&
                      (!(
                        r?.type === "input" &&
                        [
                          "email",
                          "password",
                          "search",
                          "tel",
                          "text",
                          "url",
                        ].includes(r.element.type)
                      ) ||
                        m(r.element.value))) ||
                    (n < 0 && e !== S)
                  )
                    return !1;
                  let a =
                    n < 0
                      ? (G.find(g) ?? ("next" === t ? G[0] : G[G.length - 1]))
                      : G[(n + ("next" === t ? 1 : -1) + G.length) % G.length];
                  return (
                    !(
                      !a ||
                      a.element === e ||
                      (n >= 0 && b(e) && b(a.element))
                    ) &&
                    (a.element.focus(),
                    "choice" === a.type && b(a.element) && a.element.click(),
                    !0)
                  );
                },
                [G, S],
              );
            n.useLayoutEffect(() => {
              if (S)
                return C({
                  choices: U.flatMap((e) =>
                    "choice" === e.type
                      ? [{ disabled: e.ownDisabled, value: e.value }]
                      : [],
                  ),
                  disabled: r,
                  element: S,
                  focus: em,
                  focusInvalid: ep,
                  getAnswerByElement: ex,
                  getAnswerByShortcut: eb,
                  moveAnswerFocus: ev,
                  name: s,
                  required: d,
                  reset: ef,
                  skip: eg,
                  status: Q,
                  validate: eh,
                });
            }, [U, r, S, em, ep, ex, eb, ev, s, C, d, ef, eg, Q, eh]);
            let ey = n.useMemo(
                () => ({
                  active: V,
                  disabled: r,
                  hasInputAnswer: Z,
                  invalid: Y,
                  multiple: i,
                  name: s,
                  registerAnswerControl: ea,
                  registerAnswerSelection: eo,
                  registerDescription: eu,
                  registerError: ed,
                  required: d,
                  resetVersion: q,
                  selectedAnswerIds: E,
                  setAnswerDefault: ec,
                  setAnswerSelectionFromInteraction: el,
                  shortcutByAnswerId: er,
                  shortcutByChoiceValue: en,
                  shortcuts: N,
                  status: Q,
                  syncControlledAnswerSelection: es,
                }),
                [
                  V,
                  r,
                  Z,
                  Y,
                  i,
                  s,
                  ea,
                  eo,
                  eu,
                  ed,
                  d,
                  q,
                  E,
                  ec,
                  el,
                  er,
                  en,
                  N,
                  Q,
                  es,
                ],
              ),
              ew = n.useCallback(
                (e) => {
                  (M(e), (0, l.c)(c)?.(e));
                },
                [c],
              );
            return {
              context: ey,
              itemProps: {
                "aria-describedby":
                  [...D, ...(Y ? L : []), e].filter(Boolean).join(" ") ||
                  void 0,
                "aria-invalid": Y || void 0,
                "aria-keyshortcuts":
                  [
                    t,
                    V ? "Meta+Enter Control+Enter" : void 0,
                    V && G.length ? "ArrowUp ArrowDown" : void 0,
                    V && !v ? "ArrowLeft" : void 0,
                    V && !k && "unanswered" !== Q ? "ArrowRight" : void 0,
                  ]
                    .filter(Boolean)
                    .join(" ") || void 0,
                disabled: r,
                hidden: !V,
                inert: !V,
                ref: ew,
                tabIndex: -1,
              },
              state: {
                active: V,
                disabled: r,
                invalid: Y,
                multiple: i,
                required: d,
                status: Q,
              },
            };
          })({
            "aria-describedby": e,
            "aria-keyshortcuts": r,
            disabled: i,
            invalid: s,
            multiple: o,
            name: d,
            onStatusChange: h,
            ref: f,
            required: v,
          }),
          N = (0, l.a)({
            defaultTagName: "fieldset",
            props: (0, l.b)({ ...j, children: a }, w),
            state: C,
            stateAttributesMapping: {
              active: (e) => ({ "data-active": e ? "" : void 0 }),
            },
          });
        return (0, t.jsx)(c.Provider, { value: k, children: N });
      },
      S = function ({ render: e, ...t }) {
        return (
          h("Questionnaire.Title"),
          (0, l.a)({ defaultTagName: "legend", props: t, render: e })
        );
      },
      M = function ({ render: e, ...t }) {
        let { shortcuts: n } = h("Questionnaire.Choices");
        return (0, l.a)({
          defaultTagName: "div",
          props: t,
          render: e,
          state: { shortcuts: n },
        });
      },
      R = function ({
        checked: e,
        children: r,
        defaultChecked: a = !1,
        disabled: i = !1,
        onChange: o,
        render: c,
        value: u,
        ...d
      }) {
        let { inputProps: m, state: p } = (function ({
            checked: e,
            defaultChecked: t = !1,
            disabled: r = !1,
            onChange: a,
            value: i,
          }) {
            let {
                disabled: l,
                hasInputAnswer: s,
                invalid: o,
                multiple: c,
                name: u,
                registerAnswerControl: d,
                registerAnswerSelection: m,
                required: p,
                resetVersion: g,
                selectedAnswerIds: x,
                setAnswerDefault: b,
                setAnswerSelectionFromInteraction: v,
                shortcutByAnswerId: y,
                shortcutByChoiceValue: w,
                status: k,
                syncControlledAnswerSelection: j,
              } = h("Questionnaire.Choice"),
              C = n.useId(),
              [N, S] = n.useState(null),
              M = n.useRef(t),
              R = void 0 !== e,
              I = l || r,
              A = x.includes(C),
              T = R ? "skipped" !== k && e : A,
              E = c ? "checkbox" : "radio",
              P = w?.get(i) ?? y.get(C) ?? null;
            return (
              n.useLayoutEffect(() => m(C, M.current), [C, m]),
              n.useLayoutEffect(() => b(C, t), [C, t, b]),
              n.useLayoutEffect(() => {
                if (N)
                  return d({
                    disabled: I,
                    element: N,
                    id: C,
                    ownDisabled: r,
                    type: "choice",
                    value: i,
                  });
              }, [C, r, I, N, d, i]),
              n.useLayoutEffect(() => {
                R && j(C, e);
              }, [C, R, e, g, j]),
              n.useLayoutEffect(() => {
                N && ((N.defaultChecked = R ? e : t), g > 0 && (N.checked = T));
              }, [T, R, e, t, N, g]),
              {
                inputProps: {
                  ref: S,
                  "aria-invalid": o || void 0,
                  "aria-keyshortcuts": f(P, !I && T),
                  checked: T,
                  disabled: I,
                  id: C,
                  name: "skipped" === k ? void 0 : u,
                  onChange: function (t) {
                    if ((a?.(t), !t.defaultPrevented)) {
                      if (!R) return void v(C, t.target.checked);
                      "skipped" === k && e === t.target.checked && v(C, e);
                    }
                  },
                  required: p && !c && !s,
                  type: E,
                  value: i,
                },
                state: {
                  checked: T,
                  disabled: I,
                  invalid: o,
                  shortcut: P,
                  type: E,
                },
              }
            );
          })({
            checked: e,
            defaultChecked: a,
            disabled: i,
            onChange: o,
            value: u,
          }),
          g = (0, l.a)({
            defaultTagName: "label",
            props: (0, l.b)({ children: r }, d),
            render: c,
            state: p,
            stateAttributesMapping: {
              checked: (e) => ({
                "data-checked": e ? "" : void 0,
                "data-unchecked": e ? void 0 : "",
              }),
            },
          });
        return (0, t.jsx)(s.Provider, {
          value: { inputProps: m, state: p },
          children: g,
        });
      },
      I = function ({ render: e, ...t }) {
        let { inputProps: n, state: r } = d("Questionnaire.ChoiceInput");
        return (0, l.a)({
          defaultTagName: "input",
          props: (0, l.b)(n, t),
          render: e,
          state: r,
          stateAttributesMapping: {
            checked: (e) => ({
              "data-checked": e ? "" : void 0,
              "data-unchecked": e ? void 0 : "",
            }),
          },
        });
      },
      A = function ({ render: e, ...t }) {
        return (
          d("Questionnaire.ChoiceLabel"),
          (0, l.a)({ defaultTagName: "span", props: t, render: e })
        );
      },
      T = function ({ children: e, render: t, ...n }) {
        let { state: r } = d("Questionnaire.ChoiceShortcut"),
          a = { shortcut: r.shortcut };
        return (0, l.a)({
          defaultTagName: "span",
          props: (0, l.b)(
            {
              "aria-hidden": !0,
              children: e ?? r.shortcut,
              hidden: null === r.shortcut,
            },
            n,
          ),
          render: t,
          state: a,
        });
      },
      E = function ({
        defaultValue: e,
        disabled: t = !1,
        onChange: r,
        ref: a,
        render: i,
        type: s = "text",
        value: o,
        ...c
      }) {
        let { inputProps: u, state: d } = (function ({
          defaultValue: e,
          disabled: t = !1,
          onChange: r,
          ref: a,
          type: i = "text",
          value: s,
        }) {
          let {
              disabled: o,
              invalid: c,
              name: u,
              registerAnswerControl: d,
              registerAnswerSelection: p,
              resetVersion: g,
              selectedAnswerIds: x,
              setAnswerDefault: b,
              setAnswerSelectionFromInteraction: v,
              syncControlledAnswerSelection: y,
            } = h("Questionnaire.Input"),
            w = n.useId(),
            k = n.useRef(null),
            j = n.useRef(m(e)),
            C = void 0 !== s,
            N = m(e),
            S = m(s),
            [M, R] = n.useState(N),
            I = o || t,
            A = C ? S : M,
            T = x.includes(w);
          (n.useLayoutEffect(() => p(w, j.current), [w, p]),
            n.useLayoutEffect(() => b(w, N), [N, w, b]),
            n.useLayoutEffect(() => {
              let e = k.current;
              if (e)
                return d({ disabled: I, element: e, id: w, type: "input" });
            }, [I, w, d]),
            n.useLayoutEffect(() => {
              C ? y(w, S) : g > 0 && R(N);
            }, [C, S, s, N, w, g, y]),
            n.useLayoutEffect(() => {
              let e = k.current;
              e && C && (e.defaultValue = String(s));
            }, [C, s]));
          let E = n.useCallback(
            (e) => {
              ((k.current = e), (0, l.c)(a)?.(e));
            },
            [a],
          );
          return {
            inputProps: {
              "aria-invalid": c || void 0,
              "aria-keyshortcuts": f(null, !I && A && T),
              defaultValue: C ? void 0 : e,
              disabled: I,
              form: T ? void 0 : "",
              id: w,
              name: T ? u : void 0,
              onChange: function (e) {
                if ((r?.(e), e.defaultPrevented)) return;
                let t = e.target.value.trim().length > 0;
                C || (R(t), v(w, t));
              },
              ref: E,
              type: i,
              value: C ? s : void 0,
            },
            state: { disabled: I, filled: A, invalid: c },
          };
        })({
          defaultValue: e,
          disabled: t,
          onChange: r,
          ref: a,
          type: s,
          value: o,
        });
        return (0, l.a)({
          defaultTagName: "input",
          props: (0, l.b)(u, c),
          render: i,
          state: d,
          stateAttributesMapping: {
            filled: (e) => ({
              "data-empty": e ? void 0 : "",
              "data-filled": e ? "" : void 0,
            }),
          },
        });
      },
      P = function ({ children: e, id: t, render: r, ...a }) {
        let {
            invalid: i,
            registerError: s,
            required: o,
          } = h("Questionnaire.Error"),
          c = n.useId(),
          u = t ?? c;
        return (
          n.useLayoutEffect(() => s(u), [u, s]),
          (0, l.a)({
            defaultTagName: "p",
            props: (0, l.b)(
              {
                children:
                  e ??
                  (o
                    ? "Choose an answer to continue."
                    : "Choose an answer or skip this question."),
                hidden: !i,
                id: u,
                role: i ? "alert" : void 0,
              },
              a,
            ),
            render: r,
            state: { invalid: i },
          })
        );
      },
      $ = function ({
        children: e,
        disabled: t = !1,
        onClick: n,
        render: r,
        tabIndex: a,
        type: i = "button",
        ...l
      }) {
        let s = u("Questionnaire.Previous"),
          o = s.total > 1 && !s.first;
        return k({
          children: e ?? "Previous",
          disabled: t,
          onClick: function (e) {
            (n?.(e), e.defaultPrevented || s.goPrevious());
          },
          props: l,
          render: r,
          status: s.activeItemStatus,
          tabIndex: a,
          type: i,
          visible: o,
        });
      },
      _ = function ({
        children: e,
        disabled: t = !1,
        onClick: n,
        render: r,
        tabIndex: a,
        type: i = "button",
        ...l
      }) {
        let s = u("Questionnaire.Next"),
          o = s.total > 1 && !s.last;
        return k({
          children: e ?? "Next",
          disabled: t,
          onClick: function (e) {
            (n?.(e), e.defaultPrevented || s.goNext());
          },
          props: l,
          render: r,
          shortcut: "Enter",
          status: s.activeItemStatus,
          tabIndex: a,
          type: i,
          visible: o,
        });
      },
      q = function ({
        children: e,
        disabled: t = !1,
        render: n,
        tabIndex: r,
        type: a = "submit",
        ...i
      }) {
        let l = u("Questionnaire.Submit"),
          s = l.total > 0 && l.last;
        return k({
          children: e ?? "Submit",
          disabled: t,
          props: i,
          render: n,
          shortcut: "Enter",
          status: l.activeItemStatus,
          tabIndex: r,
          type: a,
          visible: s,
        });
      },
      z = m647163,
      D = m167881;
    function O({ className: e, ...n }) {
      return (0, t.jsx)(j, {
        "data-slot": "questionnaire",
        className: (0, z.cn)("flex w-full min-w-0 flex-col gap-3.5", e),
        ...n,
      });
    }
    function L({ className: e, ...n }) {
      return (0, t.jsx)(C, {
        "data-slot": "questionnaire-progress",
        className: (0, z.cn)(
          "min-h-[1lh] w-fit min-w-[8ch] text-[11px] font-medium text-neutral-500 tabular-nums",
          e,
        ),
        ...n,
      });
    }
    function F({ className: e, ...n }) {
      return (0, t.jsx)(N, {
        "data-slot": "questionnaire-item",
        className: (0, z.cn)(
          "flex min-w-0 flex-col gap-2.5 border-0 p-0 outline-none data-[hidden]:hidden",
          e,
        ),
        ...n,
      });
    }
    function H({ className: e, ...n }) {
      return (0, t.jsx)(S, {
        "data-slot": "questionnaire-title",
        className: (0, z.cn)(
          "text-xs font-semibold leading-snug text-neutral-900",
          e,
        ),
        ...n,
      });
    }
    function B({ className: e, ...n }) {
      return (0, t.jsx)(M, {
        "data-slot": "questionnaire-choices",
        className: (0, z.cn)(
          "group/questionnaire-choices grid min-w-0 gap-1.5",
          e,
        ),
        ...n,
      });
    }
    function K({ children: e, className: n, ...a }) {
      return (0, t.jsxs)(R, {
        "data-slot": "questionnaire-choice",
        className: (0, z.cn)(
          "group/questionnaire-choice relative flex min-h-10 cursor-pointer items-start gap-2.5 rounded-lg border border-neutral-200/90 bg-white px-3 py-2 text-start text-xs transition-colors outline-none select-none hover:bg-neutral-50/80 has-[>input:focus-visible]:border-[#2383e2] has-[>input:focus-visible]:ring-2 has-[>input:focus-visible]:ring-[#2383e2]/20 data-invalid:border-rose-500 group-has-[[data-slot=questionnaire-input][data-filled]]/questionnaire-choices:data-invalid:border-neutral-200/90 data-checked:border-[#2383e2] data-checked:bg-[#f7f6f3]/60",
          "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
          n,
        ),
        ...a,
        children: [
          (0, t.jsx)(I, {
            "data-slot": "questionnaire-choice-input",
            className:
              "absolute inset-0 z-10 size-full cursor-pointer opacity-0",
          }),
          (0, t.jsxs)("span", {
            "aria-hidden": "true",
            "data-slot": "questionnaire-choice-indicator",
            className:
              "pointer-events-none relative flex size-4 shrink-0 translate-y-0.5 items-center justify-center rounded-[4px] border border-neutral-300 bg-white group-data-[type=radio]/questionnaire-choice:rounded-full group-data-checked/questionnaire-choice:border-[#2383e2] group-data-checked/questionnaire-choice:bg-[#37352f] group-data-checked/questionnaire-choice:text-white",
            children: [
              (0, t.jsx)("span", {
                "data-slot": "questionnaire-choice-indicator-dot",
                className:
                  "hidden size-1.5 rounded-full bg-white group-data-[type=checkbox]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block",
              }),
              (0, t.jsx)(r.Check, {
                "data-slot": "questionnaire-choice-indicator-check",
                className:
                  "hidden size-3 text-white group-data-[type=radio]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block",
              }),
            ],
          }),
          (0, t.jsx)(A, {
            "data-slot": "questionnaire-choice-label",
            className: "flex min-w-0 flex-1 flex-col gap-0.5 leading-snug",
            children: e,
          }),
          (0, t.jsx)(T, {
            "data-slot": "questionnaire-choice-shortcut",
            className:
              "pointer-events-none ms-auto hidden size-5 shrink-0 translate-y-0.5 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 font-mono text-[0.625rem] leading-none font-medium text-neutral-500 group-data-[shortcut]/questionnaire-choice:inline-flex",
          }),
        ],
      });
    }
    function V({ className: e, ...n }) {
      return (0, t.jsx)("span", {
        "data-slot": "questionnaire-choice-description",
        className: (0, z.cn)("text-[11px] leading-relaxed text-neutral-500", e),
        ...n,
      });
    }
    function U({ className: e, ...n }) {
      return (0, t.jsx)("div", {
        "data-slot": "questionnaire-input-wrapper",
        className: "group/questionnaire-input relative w-full min-w-0 pt-0.5",
        children: (0, t.jsx)(E, {
          "data-slot": "questionnaire-input",
          className: (0, z.cn)(
            "h-9 min-h-9 w-full min-w-0 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-800 transition-all outline-none focus-visible:border-[#2383e2] focus-visible:ring-2 focus-visible:ring-[#2383e2]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-rose-500 placeholder:text-neutral-400 data-filled:border-[#2383e2] data-filled:bg-[#f7f6f3]/30",
            e,
          ),
          ...n,
        }),
      });
    }
    function G({ className: e, ...n }) {
      return (0, t.jsx)(P, {
        "data-slot": "questionnaire-error",
        className: (0, z.cn)(
          "mt-1 text-xs text-rose-600 group-has-[[data-slot=questionnaire-input][data-filled]]:hidden",
          e,
        ),
        ...n,
      });
    }
    function X({ className: e, ...n }) {
      return (0, t.jsx)("div", {
        "data-slot": "questionnaire-actions",
        className: (0, z.cn)(
          "flex w-full items-center justify-between gap-2 border-t border-neutral-100 pt-2.5",
          e,
        ),
        ...n,
      });
    }
    function Q({
      children: e,
      className: n,
      size: r = "sm",
      variant: a = "outline",
      ...i
    }) {
      return (0, t.jsx)($, {
        "data-slot": "questionnaire-previous",
        "data-size": r,
        "data-variant": a,
        className: (0, z.cn)(
          (0, D.buttonVariants)({ size: r, variant: a }),
          "cursor-pointer text-xs text-neutral-600 hover:text-neutral-800 disabled:pointer-events-none disabled:opacity-50 data-[hidden]:hidden data-[visible]:inline-flex",
          n,
        ),
        ...i,
        children: e ?? "Quay lại",
      });
    }
    function W({
      children: e,
      className: n,
      size: r = "sm",
      variant: a = "default",
      ...i
    }) {
      return (0, t.jsx)(_, {
        "data-slot": "questionnaire-next",
        "data-size": r,
        "data-variant": a,
        className: (0, z.cn)(
          (0, D.buttonVariants)({ size: r, variant: a }),
          "cursor-pointer bg-[#37352f] text-xs text-white hover:bg-[#1f1e1b] disabled:pointer-events-none disabled:opacity-50 data-[hidden]:hidden data-[visible]:inline-flex",
          n,
        ),
        ...i,
        children: e ?? "Tiếp theo",
      });
    }
    function J({
      children: e,
      className: n,
      size: r = "sm",
      variant: a = "default",
      ...i
    }) {
      return (0, t.jsx)(q, {
        "data-slot": "questionnaire-submit",
        "data-size": r,
        "data-variant": a,
        className: (0, z.cn)(
          (0, D.buttonVariants)({ size: r, variant: a }),
          "cursor-pointer bg-[#37352f] text-xs text-white shadow-xs hover:bg-[#1f1e1b] disabled:pointer-events-none disabled:opacity-50 data-[hidden]:hidden data-[visible]:inline-flex",
          n,
        ),
        ...i,
        children: e ?? "Gửi câu trả lời",
      });
    }
    function Y(e) {
      if (e.followUp?.label) return e.followUp;
      if (!/\s+cụ thể$/i.test(e.label) || /^không\s+/i.test(e.label))
        return null;
      let t = e.label
        .replace(/\s+cụ thể$/i, "")
        .replace(/^(?:chọn|theo|dùng|sử dụng)(?: một)?\s+/i, "")
        .replace(/^một\s+/i, "")
        .trim();
      return t
        ? {
            label: t[0].toUpperCase() + t.slice(1),
            placeholder: `Ghi r\xf5 ${t.toLowerCase()} bạn muốn`,
          }
        : null;
    }
    ;
    var Z = m456420;
    let ee = (0, Z.default)("shield-alert", [
      [
        "path",
        {
          d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
          key: "oel41y",
        },
      ],
      ["path", { d: "M12 8v4", key: "1got3b" }],
      ["path", { d: "M12 16h.01", key: "1drbdi" }],
    ]);
    ;
    let et = (0, Z.default)("wrench", [
      [
        "path",
        {
          d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
          key: "1ngwbx",
        },
      ],
    ]);
    ;
