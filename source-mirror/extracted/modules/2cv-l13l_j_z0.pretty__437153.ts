// Reconstructed from 2cv-l13l_j_z0.pretty.js, module 437153.
// deps: none
// exports: none


"use strict";
    var i = t.r(965464),
      n = t.r(624375),
      a = t.r(646253),
      s = t.r(12938),
      o = t.r(101648),
      h = t.r(542527);
    e.exports = function (t, e) {
      var r = this;
      return ((e = i.extend(e || {}, {
        base64: !1,
        checkCRC32: !1,
        optimizedBinaryString: !1,
        createFolders: !1,
        decodeFileName: a.utf8decode,
      })),
      h.isNode && h.isStream(t))
        ? n.Promise.reject(
            Error("JSZip can't accept a stream when loading a zip file."),
          )
        : i
            .prepareContent(
              "the loaded zip file",
              t,
              !0,
              e.optimizedBinaryString,
              e.base64,
            )
            .then(function (t) {
              var r = new s(e);
              return (r.load(t), r);
            })
            .then(function (t) {
              var r = [n.Promise.resolve(t)],
                i = t.files;
              if (e.checkCRC32)
                for (var a = 0; a < i.length; a++)
                  r.push(
                    (function (t) {
                      return new n.Promise(function (e, r) {
                        var i = t.decompressed.getContentWorker().pipe(new o());
                        i.on("error", function (t) {
                          r(t);
                        })
                          .on("end", function () {
                            i.streamInfo.crc32 !== t.decompressed.crc32
                              ? r(Error("Corrupted zip : CRC32 mismatch"))
                              : e();
                          })
                          .resume();
                      });
                    })(i[a]),
                  );
              return n.Promise.all(r);
            })
            .then(function (t) {
              for (var n = t.shift(), a = n.files, s = 0; s < a.length; s++) {
                var o = a[s],
                  h = o.fileNameStr,
                  u = i.resolve(o.fileNameStr);
                (r.file(u, o.decompressed, {
                  binary: !0,
                  optimizedBinaryString: !0,
                  date: o.date,
                  dir: o.dir,
                  comment: o.fileCommentStr.length ? o.fileCommentStr : null,
                  unixPermissions: o.unixPermissions,
                  dosPermissions: o.dosPermissions,
                  createFolders: e.createFolders,
                }),
                  o.dir || (r.file(u).unsafeOriginalName = h));
              }
              return (n.zipComment.length && (r.comment = n.zipComment), r);
            });
    };
