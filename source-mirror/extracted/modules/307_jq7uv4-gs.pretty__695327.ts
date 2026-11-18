// Reconstructed from 307_jq7uv4-gs.pretty.js, module 695327.
// deps: m715760, m725678, m366499
// exports: addUpload, deleteDeck, loadDeck, loadSources, loadUploads, localDeckIds, removeUpload, deckFromServer, hasLocalDecks, isServerDeckId, migrateLocalDeck, migrateLocalDecks, previewDeck, saveErrorMessage, sourcesFromServer, uploadDeck, rememberImportNotice, takeImportNotice
export { function (e) { let t = [e, ...m().filter((t) => t.data !== e.data)].slice(0, 40); for (; t.length; ) try { return (l()?.setItem(g, JSON.stringify(t)), t); } catch { t = t.slice(0, -1); } return []; } as "addUpload" };
export { u as "deleteDeck" };
export { c as "loadDeck" };
export { p as "loadSources" };
export { m as "loadUploads" };
export { d as "localDeckIds" };
export { function (e) { let t = m().filter((t) => t.id !== e); try { l()?.setItem(g, JSON.stringify(t)); } catch {} return t; } as "removeUpload" };
export { function (e) { let t = e.deck && "object" == typeof e.deck ? e.deck : {}; return (0, i.normalizeDeck)({ title: e.title, ...t, id: e.id }); } as "deckFromServer" };
export { () => d().length > 0 as "hasLocalDecks" };
export { (e) => f.test(e) as "isServerDeckId" };
export { x as "migrateLocalDeck" };
export { function () { return (y ??= (async () => { let e = 0; try { for (let t of d()) (await x(t)) && (e += 1); return { moved: e, error: null }; } catch (t) { return { moved: e, error: t }; } finally { y = null; } })()); } as "migrateLocalDecks" };
export { function (e) { let { slide: t, theme: a } = e.preview ?? {}; return (0, i.normalizeDeck)({ id: e.id, title: e.title, theme: a, slides: t ? [t] : [], createdAt: e.createdAt, updatedAt: e.updatedAt, }); } as "previewDeck" };
export { function (e) { return e instanceof t.ApiError ? 401 === e.status ? "Phiên đăng nhập đã hết - đăng nhập lại để tiếp tục lưu." : e.message : "Mất kết nối tới máy chủ - sẽ tự lưu lại khi có mạng."; } as "saveErrorMessage" };
export { function (e) { return (Array.isArray(e.sources) ? e.sources : []).filter( (e) => !!e && "string" == typeof e?.id && "string" == typeof e.name && "string" == typeof e.content, ); } as "sourcesFromServer" };
export { h as "uploadDeck" };
export { function (e, t) { try { sessionStorage.setItem(k(e), JSON.stringify(t)); } catch {} } as "rememberImportNotice" };
export { function (e) { try { let t = sessionStorage.getItem(k(e)); if (null === t) return null; sessionStorage.removeItem(k(e)); let a = JSON.parse(t); return "string" == typeof a.message ? { message: a.message, tone: "done" === a.tone ? "done" : "error", } : null; } catch { return null; } } as "takeImportNotice" };

"use strict";
    var t = m715760,
      a = m725678,
      i = m366499;
    let r = "slide-builder:index:v1",
      n = (e) => `slide-builder:deck:v1:${e}`,
      s = (e) => `slide-builder:sources:v1:${e}`;
    function l() {
      try {
        return window.localStorage;
      } catch {
        return null;
      }
    }
    function o() {
      try {
        let e = l()?.getItem(r),
          t = e ? JSON.parse(e) : [];
        return Array.isArray(t)
          ? t.sort((e, t) => t.updatedAt.localeCompare(e.updatedAt))
          : [];
      } catch {
        return [];
      }
    }
    function d() {
      let e = l();
      if (!e) return [];
      try {
        let t = n(""),
          a = new Set(o().map((e) => e.id));
        for (let i = 0; i < e.length; i++) {
          let r = e.key(i);
          r?.startsWith(t) && a.add(r.slice(t.length));
        }
        return [...a];
      } catch {
        return [];
      }
    }
    function c(e) {
      try {
        let t = l()?.getItem(n(e));
        return t ? (0, i.normalizeDeck)(JSON.parse(t)) : null;
      } catch {
        return null;
      }
    }
    function u(e) {
      let t = l();
      if (t)
        try {
          (t.removeItem(n(e)),
            t.removeItem(s(e)),
            t.setItem(r, JSON.stringify(o().filter((t) => t.id !== e))));
        } catch {}
    }
    function p(e) {
      try {
        let t = l()?.getItem(s(e)),
          a = t ? JSON.parse(t) : [];
        return Array.isArray(a)
          ? a.filter((e) => "string" == typeof e?.content)
          : [];
      } catch {
        return [];
      }
    }
    let g = "slide-builder:uploads:v1";
    function m() {
      try {
        let e = l()?.getItem(g),
          t = e ? JSON.parse(e) : [];
        return Array.isArray(t)
          ? t.filter((e) => "string" == typeof e?.data)
          : [];
      } catch {
        return [];
      }
    }
    ;
    let f = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    async function h(e, t = []) {
      let { deck: i } = await (0, a.createSlideDeck)(e.title, e, t);
      return i.id;
    }
    async function x(e) {
      let t = c(e);
      if (!t) return null;
      let a = await h(t, p(e));
      return (u(e), a);
    }
    let y = null;
    ;
    let k = (e) => `slide-import-notice:${e}`;
    ;
