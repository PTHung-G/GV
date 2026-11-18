// Reconstructed from 307_jq7uv4-gs.pretty.js, module 725678.
// deps: m715760
// exports: createSlideDeck, deleteSlideDeck, getSlideDeck, getSlideDeckVersion, listSlideAssets, listSlideDeckVersions, listSlideDecks, nameSlideDeckVersion, renameSlideDeckVersion, restoreSlideDeckVersion, saveSlideDeck, saveSlideDeckSources, uploadSlideAsset
export { (e, a, i = []) => (0, t.requestJson)("POST", "/api/slide-decks", { title: e, deck: a, sources: i, }) as "createSlideDeck" };
export { (e) => (0, t.requestJson)( "DELETE", `/api/slide-decks/${encodeURIComponent(e)}`, ) as "deleteSlideDeck" };
export { (e) => (0, t.requestJson)("GET", `/api/slide-decks/${encodeURIComponent(e)}`) as "getSlideDeck" };
export { (e, i) => (0, t.requestJson)("GET", `${a(e)}/${encodeURIComponent(i)}`) as "getSlideDeckVersion" };
export { () => (0, t.requestJson)("GET", "/api/slide-assets") as "listSlideAssets" };
export { (e) => (0, t.requestJson)("GET", a(e)) as "listSlideDeckVersions" };
export { (e = 100, a = 0) => (0, t.requestJson)("GET", `/api/slide-decks?limit=${e}&offset=${a}`) as "listSlideDecks" };
export { (e, i) => (0, t.requestJson)("POST", a(e), { label: i }) as "nameSlideDeckVersion" };
export { (e, i, r) => (0, t.requestJson)("PATCH", `${a(e)}/${encodeURIComponent(i)}`, { label: r, }) as "renameSlideDeckVersion" };
export { (e, i) => (0, t.requestJson)("POST", `${a(e)}/${encodeURIComponent(i)}/restore`) as "restoreSlideDeckVersion" };
export { (e, a, i, r = {}) => (0, t.requestJson)( "PUT", `/api/slide-decks/${encodeURIComponent(e)}`, { title: a, deck: i, ...(r.overwrite ? { overwrite: !0 } : r.revision ? { revision: r.revision } : {}), }, { keepalive: r.keepalive }, ) as "saveSlideDeck" };
export { (e, a) => (0, t.requestJson)( "PUT", `/api/slide-decks/${encodeURIComponent(e)}/sources`, { sources: a }, ) as "saveSlideDeckSources" };
export { i as "uploadSlideAsset" };

"use strict";
    var t = m715760;
    let a = (e) => `/api/slide-decks/${encodeURIComponent(e)}/versions`;
    async function i(e, a) {
      let i = new FormData();
      return (
        i.append("file", e, a.name || "anh"),
        i.append("name", a.name),
        a.width && i.append("width", String(Math.round(a.width))),
        a.height && i.append("height", String(Math.round(a.height))),
        (await (0, t.postForm)("/api/slide-assets", i)).asset
      );
    }
    ;
