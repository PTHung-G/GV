// Reconstructed from 3n7v2d43g4jof.pretty.js, module 996296.
// deps: none
// exports: blobToDataURL, compressImageFile, formatBytes
export { a as "blobToDataURL" };
export { s as "compressImageFile" };
export { function (e) { return e < 1024 ? `${e} B` : e < 1048576 ? `${Math.round(e / 1024)} KB` : `${(e / 1048576).toFixed(1).replace(".", ",")} MB`; } as "formatBytes" };

"use strict";
    async function t(e) {
      if ("function" == typeof createImageBitmap)
        try {
          let t = await createImageBitmap(e);
          return {
            source: t,
            width: t.width,
            height: t.height,
            release: () => t.close(),
          };
        } catch {}
      let t = URL.createObjectURL(e);
      try {
        let e = await new Promise((e, a) => {
          let n = new Image();
          ((n.onload = () => e(n)),
            (n.onerror = () => a(Error("Trình duyệt không đọc được ảnh này."))),
            (n.src = t));
        });
        return {
          source: e,
          width: e.naturalWidth,
          height: e.naturalHeight,
          release: () => URL.revokeObjectURL(t),
        };
      } catch {
        return (URL.revokeObjectURL(t), null);
      }
    }
    function a(e) {
      return new Promise((t, a) => {
        let n = new FileReader();
        ((n.onload = () => t(n.result)),
          (n.onerror = () => a(Error("Không đọc được dữ liệu ảnh."))),
          n.readAsDataURL(e));
      });
    }
    function n(e) {
      let t = e.indexOf(",");
      return -1 === t ? e : e.slice(t + 1);
    }
    async function i(e) {
      let t = await a(e);
      return {
        dataUrl: t,
        base64: n(t),
        mimeType: e.type || "image/jpeg",
        bytes: e.size,
        originalBytes: e.size,
        width: 0,
        height: 0,
        compressed: !1,
      };
    }
    async function s(e, r = {}) {
      let l = r.maxDimension ?? 1600,
        o = r.maxBytes ?? 921600,
        c = r.mimeType ?? "image/jpeg",
        d = r.skipBelowBytes ?? 204800,
        u = Math.max(0.1, Math.min(1, r.minQuality ?? 0.45));
      if (e.size <= d) return i(e);
      let h = await t(e);
      if (!h || 0 === h.width || 0 === h.height) return i(e);
      try {
        let t = Math.min(1, l / Math.max(h.width, h.height)),
          s = Math.min(t, (r.minDimension ?? 1) / Math.max(h.width, h.height)),
          d = Math.max(u, r.quality ?? 0.82),
          m = null;
        for (let e = 0; e < 6; e += 1) {
          let e = Math.max(1, Math.round(h.width * t)),
            a = Math.max(1, Math.round(h.height * t)),
            n = await (function (e, t, a) {
              return new Promise((n, i) => {
                e.toBlob(
                  (e) => (e ? n(e) : i(Error("Không mã hoá lại được ảnh."))),
                  t,
                  a,
                );
              });
            })(
              (function (e, t, a) {
                let n = document.createElement("canvas");
                ((n.width = t), (n.height = a));
                let i = n.getContext("2d");
                if (!i) throw Error("Trình duyệt không hỗ trợ canvas 2D.");
                return (
                  (i.fillStyle = "#ffffff"),
                  i.fillRect(0, 0, t, a),
                  (i.imageSmoothingEnabled = !0),
                  (i.imageSmoothingQuality = "high"),
                  i.drawImage(e.source, 0, 0, t, a),
                  n
                );
              })(h, e, a),
              c,
              d,
            );
          if (((m = { blob: n, width: e, height: a }), n.size <= o)) break;
          if (d > u) d = Math.max(u, d - 0.12);
          else {
            let e = Math.max(s, 0.8 * t);
            if (e === t) break;
            t = e;
          }
        }
        if (!m || m.blob.size >= e.size) return i(e);
        let x = await a(m.blob);
        return {
          dataUrl: x,
          base64: n(x),
          mimeType: c,
          bytes: m.blob.size,
          originalBytes: e.size,
          width: m.width,
          height: m.height,
          compressed: !0,
        };
      } catch {
        return i(e);
      } finally {
        h.release();
      }
    }
    ;
