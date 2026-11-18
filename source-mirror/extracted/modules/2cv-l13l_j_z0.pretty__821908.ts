// Reconstructed from 2cv-l13l_j_z0.pretty.js, module 821908.
// deps: none
// exports: none


"use strict";
    var i = t.r(965464),
      n = t.r(48913),
      a = t.r(646253),
      s = t.r(763494),
      o = t.r(71471),
      h = function (t, e) {
        var r,
          i = "";
        for (r = 0; r < e; r++)
          ((i += String.fromCharCode(255 & t)), (t >>>= 8));
        return i;
      },
      u = function (t, e) {
        var r = t;
        return (t || (r = e ? 16893 : 33204), (65535 & r) << 16);
      },
      l = function (t, e, r, n, l, d) {
        var f,
          c,
          p = t.file,
          _ = t.compression,
          m = d !== a.utf8encode,
          g = i.transformTo("string", d(p.name)),
          v = i.transformTo("string", a.utf8encode(p.name)),
          b = p.comment,
          y = i.transformTo("string", d(b)),
          w = i.transformTo("string", a.utf8encode(b)),
          k = v.length !== p.name.length,
          x = w.length !== b.length,
          S = "",
          C = "",
          E = "",
          z = p.dir,
          A = p.date,
          I = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
        (!e || r) &&
          ((I.crc32 = t.crc32),
          (I.compressedSize = t.compressedSize),
          (I.uncompressedSize = t.uncompressedSize));
        var O = 0;
        (e && (O |= 8), !m && (k || x) && (O |= 2048));
        var B = 0,
          T = 0;
        ((z && (B |= 16), "UNIX" === l)
          ? ((T = 798), (B |= u(p.unixPermissions, z)))
          : ((T = 20), (B |= 63 & (p.dosPermissions || 0))),
          (f =
            (((A.getUTCHours() << 6) | A.getUTCMinutes()) << 5) |
            (A.getUTCSeconds() / 2)),
          (c =
            ((((A.getUTCFullYear() - 1980) << 4) | (A.getUTCMonth() + 1)) <<
              5) |
            A.getUTCDate()),
          k &&
            ((C = h(1, 1) + h(s(g), 4) + v), (S += "up" + h(C.length, 2) + C)),
          x &&
            ((E = h(1, 1) + h(s(y), 4) + w), (S += "uc" + h(E.length, 2) + E)));
        var R = "";
        return (
          (R += "\n\0"),
          (R += h(O, 2)),
          (R += _.magic),
          (R += h(f, 2)),
          (R += h(c, 2)),
          (R += h(I.crc32, 4)),
          (R += h(I.compressedSize, 4)),
          (R += h(I.uncompressedSize, 4)),
          (R += h(g.length, 2)),
          (R += h(S.length, 2)),
          {
            fileRecord: o.LOCAL_FILE_HEADER + R + g + S,
            dirRecord:
              o.CENTRAL_FILE_HEADER +
              h(T, 2) +
              R +
              h(y.length, 2) +
              "\0\0\0\0" +
              h(B, 4) +
              h(n, 4) +
              g +
              S +
              y,
          }
        );
      },
      d = function (t, e, r, n, a) {
        var s = i.transformTo("string", a(n));
        return (
          o.CENTRAL_DIRECTORY_END +
          "\0\0\0\0" +
          h(t, 2) +
          h(t, 2) +
          h(e, 4) +
          h(r, 4) +
          h(s.length, 2) +
          s
        );
      },
      f = function (t) {
        return (
          o.DATA_DESCRIPTOR +
          h(t.crc32, 4) +
          h(t.compressedSize, 4) +
          h(t.uncompressedSize, 4)
        );
      };
    function c(t, e, r, i) {
      (n.call(this, "ZipFileWorker"),
        (this.bytesWritten = 0),
        (this.zipComment = e),
        (this.zipPlatform = r),
        (this.encodeFileName = i),
        (this.streamFiles = t),
        (this.accumulate = !1),
        (this.contentBuffer = []),
        (this.dirRecords = []),
        (this.currentSourceOffset = 0),
        (this.entriesCount = 0),
        (this.currentFile = null),
        (this._sources = []));
    }
    (i.inherits(c, n),
      (c.prototype.push = function (t) {
        var e = t.meta.percent || 0,
          r = this.entriesCount,
          i = this._sources.length;
        this.accumulate
          ? this.contentBuffer.push(t)
          : ((this.bytesWritten += t.data.length),
            n.prototype.push.call(this, {
              data: t.data,
              meta: {
                currentFile: this.currentFile,
                percent: r ? (e + 100 * (r - i - 1)) / r : 100,
              },
            }));
      }),
      (c.prototype.openedSource = function (t) {
        ((this.currentSourceOffset = this.bytesWritten),
          (this.currentFile = t.file.name));
        var e = this.streamFiles && !t.file.dir;
        if (e) {
          var r = l(
            t,
            e,
            !1,
            this.currentSourceOffset,
            this.zipPlatform,
            this.encodeFileName,
          );
          this.push({ data: r.fileRecord, meta: { percent: 0 } });
        } else this.accumulate = !0;
      }),
      (c.prototype.closedSource = function (t) {
        this.accumulate = !1;
        var e = this.streamFiles && !t.file.dir,
          r = l(
            t,
            e,
            !0,
            this.currentSourceOffset,
            this.zipPlatform,
            this.encodeFileName,
          );
        if ((this.dirRecords.push(r.dirRecord), e))
          this.push({ data: f(t), meta: { percent: 100 } });
        else
          for (
            this.push({ data: r.fileRecord, meta: { percent: 0 } });
            this.contentBuffer.length;

          )
            this.push(this.contentBuffer.shift());
        this.currentFile = null;
      }),
      (c.prototype.flush = function () {
        for (var t = this.bytesWritten, e = 0; e < this.dirRecords.length; e++)
          this.push({ data: this.dirRecords[e], meta: { percent: 100 } });
        var r = this.bytesWritten - t,
          i = d(
            this.dirRecords.length,
            r,
            t,
            this.zipComment,
            this.encodeFileName,
          );
        this.push({ data: i, meta: { percent: 100 } });
      }),
      (c.prototype.prepareNextSource = function () {
        ((this.previous = this._sources.shift()),
          this.openedSource(this.previous.streamInfo),
          this.isPaused ? this.previous.pause() : this.previous.resume());
      }),
      (c.prototype.registerPrevious = function (t) {
        this._sources.push(t);
        var e = this;
        return (
          t.on("data", function (t) {
            e.processChunk(t);
          }),
          t.on("end", function () {
            (e.closedSource(e.previous.streamInfo),
              e._sources.length ? e.prepareNextSource() : e.end());
          }),
          t.on("error", function (t) {
            e.error(t);
          }),
          this
        );
      }),
      (c.prototype.resume = function () {
        return (
          !!n.prototype.resume.call(this) &&
          (!this.previous && this._sources.length
            ? (this.prepareNextSource(), !0)
            : this.previous || this._sources.length || this.generatedError
              ? void 0
              : (this.end(), !0))
        );
      }),
      (c.prototype.error = function (t) {
        var e = this._sources;
        if (!n.prototype.error.call(this, t)) return !1;
        for (var r = 0; r < e.length; r++)
          try {
            e[r].error(t);
          } catch (t) {}
        return !0;
      }),
      (c.prototype.lock = function () {
        n.prototype.lock.call(this);
        for (var t = this._sources, e = 0; e < t.length; e++) t[e].lock();
      }),
      (e.exports = c));
