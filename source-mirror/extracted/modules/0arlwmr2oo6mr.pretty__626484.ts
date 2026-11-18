// Reconstructed from 0arlwmr2oo6mr.pretty.js, module 626484.
// deps: m799887, m389567, m857444
// exports: composeWithLibrary
export { s as "composeWithLibrary" };

"use strict";
    var t = m799887,
      n = m389567,
      a = m857444;
    async function s(e, s) {
      let { document: i } = await (0, t.createDocument)("Đề thi mới", "");
      ((0, a.saveSources)(i.id, s),
        (0, n.track)("doc_create", { source: "library" }),
        e.push(`/doc/${i.id}`));
    }
    ;
