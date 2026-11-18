// Reconstructed from 2cv-l13l_j_z0.pretty.js, module 301223.
// deps: none
// exports: none


"use strict";
    var i = t.r(646253),
      n = t.r(965464),
      a = t.r(48913),
      s = t.r(500846),
      o = t.r(713133),
      h = t.r(643220),
      u = t.r(852929),
      l = t.r(6664),
      d = t.r(542527),
      f = t.r(513303),
      c = function (t, e, r) {
        var i,
          s = n.getTypeOf(e),
          l = n.extend(r || {}, o);
        ((l.date = l.date || new Date()),
          null !== l.compression &&
            (l.compression = l.compression.toUpperCase()),
          "string" == typeof l.unixPermissions &&
            (l.unixPermissions = parseInt(l.unixPermissions, 8)),
          l.unixPermissions && 16384 & l.unixPermissions && (l.dir = !0),
          l.dosPermissions && 16 & l.dosPermissions && (l.dir = !0),
          l.dir && (t = _(t)),
          l.createFolders && (i = p(t)) && m.call(this, i, !0));
        var c = "string" === s && !1 === l.binary && !1 === l.base64;
        ((r && void 0 !== r.binary) || (l.binary = !c),
          ((e instanceof h && 0 === e.uncompressedSize) ||
            l.dir ||
            !e ||
            0 === e.length) &&
            ((l.base64 = !1),
            (l.binary = !0),
            (e = ""),
            (l.compression = "STORE"),
            (s = "string")));
        var g = null;
        g =
          e instanceof h || e instanceof a
            ? e
            : d.isNode && d.isStream(e)
              ? new f(t, e)
              : n.prepareContent(
                  t,
                  e,
                  l.binary,
                  l.optimizedBinaryString,
                  l.base64,
                );
        var v = new u(t, g, l);
        this.files[t] = v;
      },
      p = function (t) {
        "/" === t.slice(-1) && (t = t.substring(0, t.length - 1));
        var e = t.lastIndexOf("/");
        return e > 0 ? t.substring(0, e) : "";
      },
      _ = function (t) {
        return ("/" !== t.slice(-1) && (t += "/"), t);
      },
      m = function (t, e) {
        return (
          (e = void 0 !== e ? e : o.createFolders),
          (t = _(t)),
          this.files[t] || c.call(this, t, null, { dir: !0, createFolders: e }),
          this.files[t]
        );
      };
    function g(t) {
      return "[object RegExp]" === Object.prototype.toString.call(t);
    }
    e.exports = {
      load: function () {
        throw Error(
          "This method has been removed in JSZip 3.0, please check the upgrade guide.",
        );
      },
      forEach: function (t) {
        
        for (e in this.files)
          ((i = this.files[e]),
            (r = e.slice(this.root.length, e.length)) &&
              e.slice(0, this.root.length) === this.root &&
              t(r, i));
      },
      filter: function (t) {
        var e = [];
        return (
          this.forEach(function (r, i) {
            t(r, i) && e.push(i);
          }),
          e
        );
      },
      file: function (t, e, r) {
        if (1 == arguments.length)
          if (g(t)) {
            var i = t;
            return this.filter(function (t, e) {
              return !e.dir && i.test(t);
            });
          } else {
            var n = this.files[this.root + t];
            return n && !n.dir ? n : null;
          }
        return ((t = this.root + t), c.call(this, t, e, r), this);
      },
      folder: function (t) {
        if (!t) return this;
        if (g(t))
          return this.filter(function (e, r) {
            return r.dir && t.test(e);
          });
        var e = this.root + t,
          r = m.call(this, e),
          i = this.clone();
        return ((i.root = r.name), i);
      },
      remove: function (t) {
        t = this.root + t;
        var e = this.files[t];
        if (
          (e || ("/" !== t.slice(-1) && (t += "/"), (e = this.files[t])),
          e && !e.dir)
        )
          delete this.files[t];
        else
          for (
            var r = this.filter(function (e, r) {
                return r.name.slice(0, t.length) === t;
              }),
              i = 0;
            i < r.length;
            i++
          )
            delete this.files[r[i].name];
        return this;
      },
      generate: function () {
        throw Error(
          "This method has been removed in JSZip 3.0, please check the upgrade guide.",
        );
      },
      generateInternalStream: function (t) {
        var e,
          r = {};
        try {
          if (
            (((r = n.extend(t || {}, {
              streamFiles: !1,
              compression: "STORE",
              compressionOptions: null,
              type: "",
              platform: "DOS",
              comment: null,
              mimeType: "application/zip",
              encodeFileName: i.utf8encode,
            })).type = r.type.toLowerCase()),
            (r.compression = r.compression.toUpperCase()),
            "binarystring" === r.type && (r.type = "string"),
            !r.type)
          )
            throw Error("No output type specified.");
          (n.checkSupport(r.type),
            ("darwin" === r.platform ||
              "freebsd" === r.platform ||
              "linux" === r.platform ||
              "sunos" === r.platform) &&
              (r.platform = "UNIX"),
            "win32" === r.platform && (r.platform = "DOS"));
          var o = r.comment || this.comment || "";
          e = l.generateWorker(this, r, o);
        } catch (t) {
          (e = new a("error")).error(t);
        }
        return new s(e, r.type || "string", r.mimeType);
      },
      generateAsync: function (t, e) {
        return this.generateInternalStream(t).accumulate(e);
      },
      generateNodeStream: function (t, e) {
        return (
          (t = t || {}).type || (t.type = "nodebuffer"),
          this.generateInternalStream(t).toNodejsStream(e)
        );
      },
    };
