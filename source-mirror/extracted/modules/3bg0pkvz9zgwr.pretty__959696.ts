// Reconstructed from 3bg0pkvz9zgwr.pretty.js, module 959696.
// deps: none
// exports: none


"use strict";
    var e = t.i(954206);
    let n = "[[ẢNH]]";
    function a(t) {
      return t.trim().length >= 3;
    }
    let i = new Map(),
      r = new Set(),
      o = /^\s*(?:\*\*|__)?\s*(?:Câu|Bài|Question|CÂU|BÀI)\s+\d+/,
      l = /^#{1,6}\s/,
      s = /\(data:[^)\s]*\)/g;
    t.s([
      "IMAGE_CONCURRENCY",
      0,
      2,
      "IMAGE_MARKER",
      0,
      n,
      "canDrawImage",
      0,
      a,
      "imageContext",
      0,
      function (t, a) {
        
        let r = ((i = a.alt), (0, e.imageAlt)(i)),
          c = t.replace(s, "()").split("\n"),
          h = c.findIndex((t) =>
            (function (t, e, n) {
              let a = t.indexOf(`![${e}](`);
              if (a < 0) return !1;
              let i = t.slice(a + e.length + 4);
              return n ? i.startsWith(n) : i.startsWith(")");
            })(t, r, a.src),
          ),
          u = "";
        if (h < 0) {
          let t = `"src":${JSON.stringify(a.src)},"alt":${JSON.stringify(a.alt)}`;
          if ((h = c.findIndex((e) => e.startsWith("{") && e.includes(t))) < 0)
            return "";
          let e = [
              ...c[h].matchAll(
                /"type":"examImage","attrs":\{"src":("(?:[^"\\]|\\.)*"),"alt":("(?:[^"\\]|\\.)*")/g,
              ),
            ],
            i = !1;
          u = e
            .map((t, e) => {
              let r = JSON.parse(t[2]),
                o = !i && JSON.parse(t[1]) === a.src && r === a.alt;
              return (o && (i = !0), `\xd4 ảnh ${e + 1}: ${o ? n : r}`);
            })
            .join("\n");
        }
        let g = (t) => o.test(t) || l.test(t.trim()),
          d = h;
        for (; d > 0 && !g(c[d]); ) d--;
        let p = h + 1;
        for (; p < c.length && !g(c[p]); ) p++;
        if (
          p < c.length &&
          o.test(c[p]) &&
          !c.slice(h + 1, p).some((t) => t.trim())
        )
          for (p++; p < c.length && !g(c[p]); ) p++;
        let f = `![${r}](`,
          m = c
            .slice(d, p)
            .map((t, e) => {
              if (d + e !== h) return t;
              if (u) return u;
              let a = t.indexOf(f),
                i = t.indexOf(")", a + f.length),
                r = /^\{[^}\n]*\}/.exec(t.slice(i + 1));
              return t.slice(0, a) + n + t.slice(i + 1 + (r ? r[0].length : 0));
            })
            .join("\n")
            .trim();
        if (m.length <= 2800) return m;
        let y = Math.max(0, Math.min(m.indexOf(n) - 1400, m.length - 2800));
        return m.slice(y, y + 2800);
      },
      "imageJob",
      0,
      function (t) {
        return i.get(t);
      },
      "imageJobBusy",
      0,
      function (t) {
        let e = i.get(t)?.status;
        return "queued" === e || "drawing" === e;
      },
      "imageJobKey",
      0,
      function (t) {
        return `${t.src}\u0000${t.alt}`;
      },
      "newImageDescriptions",
      0,
      function (t, e, n = 8) {
        let i = new Set(t),
          r = [];
        for (let t of e)
          if (!i.has(t) && a(t) && (i.add(t), r.push(t), r.length >= n)) break;
        return r;
      },
      "setImageJob",
      0,
      function (t, e) {
        for (let n of (e ? i.set(t, e) : i.delete(t), r)) n();
      },
      "stopsImageQueue",
      0,
      function (t, e) {
        return (
          401 === e ||
          402 === e ||
          "quota_exhausted" === t ||
          "image_disabled" === t ||
          "network_error" === t
        );
      },
      "subscribeImageJobs",
      0,
      function (t) {
        return (
          r.add(t),
          () => {
            r.delete(t);
          }
        );
      },
    ]);
