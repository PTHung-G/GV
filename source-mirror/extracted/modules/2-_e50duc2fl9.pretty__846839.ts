// Reconstructed from 2-_e50duc2fl9.pretty.js, module 846839.
// deps: m715760
// exports: REMEMBER_HINT, addMemory, deleteMemory, fetchSuggestions, getMemory, rebuildMemory, rememberFromChat, restoreMemory, updateMemory, updateMemorySettings, wipeMemory
export { /(nhớ|từ (giờ|nay|lần sau)|lần sau|về sau|mặc định|luôn luôn|lúc nào cũng)/i as "REMEMBER_HINT" };
export { s as "addMemory" };
export { a as "deleteMemory" };
export { d as "fetchSuggestions" };
export { r as "getMemory" };
export { u as "rebuildMemory" };
export { c as "rememberFromChat" };
export { o as "restoreMemory" };
export { i as "updateMemory" };
export { n as "updateMemorySettings" };
export { l as "wipeMemory" };

"use strict";
    var t = m715760;
    async function r() {
      return (await (0, t.requestJson)("GET", "/api/memory")).memory;
    }
    async function n(e) {
      return (await (0, t.requestJson)("PATCH", "/api/memory/settings", e))
        .memory;
    }
    async function s(e) {
      return (await (0, t.requestJson)("POST", "/api/memory", { text: e }))
        .item;
    }
    async function i(e, r) {
      return (
        await (0, t.requestJson)(
          "PATCH",
          `/api/memory/${encodeURIComponent(e)}`,
          { text: r },
        )
      ).item;
    }
    async function a(e) {
      await (0, t.requestJson)(
        "DELETE",
        `/api/memory/${encodeURIComponent(e)}`,
      );
    }
    async function o(e) {
      return (
        await (0, t.requestJson)(
          "POST",
          `/api/memory/${encodeURIComponent(e)}/restore`,
        )
      ).item;
    }
    async function l() {
      return (await (0, t.requestJson)("DELETE", "/api/memory")).memory;
    }
    async function u() {
      return (await (0, t.requestJson)("POST", "/api/memory/rebuild")).memory;
    }
    async function c(e) {
      return (
        await (0, t.requestJson)("POST", "/api/memory/remember", { message: e })
      ).item;
    }
    async function d(e, r = !1, n) {
      return (
        await (0, t.requestJson)(
          "POST",
          "/api/suggestions",
          { ...e, refresh: r },
          { signal: n },
        )
      ).result;
    }
    ;
