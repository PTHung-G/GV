// Reconstructed from 2cv-l13l_j_z0.pretty.js, module 48913.
// deps: none
// exports: none


"use strict";
    function i(t) {
      ((this.name = t || "default"),
        (this.streamInfo = {}),
        (this.generatedError = null),
        (this.extraStreamInfo = {}),
        (this.isPaused = !0),
        (this.isFinished = !1),
        (this.isLocked = !1),
        (this._listeners = { data: [], end: [], error: [] }),
        (this.previous = null));
    }
    ((i.prototype = {
      push: function (t) {
        this.emit("data", t);
      },
      end: function () {
        if (this.isFinished) return !1;
        this.flush();
        try {
          (this.emit("end"), this.cleanUp(), (this.isFinished = !0));
        } catch (t) {
          this.emit("error", t);
        }
        return !0;
      },
      error: function (t) {
        return (
          !this.isFinished &&
          (this.isPaused
            ? (this.generatedError = t)
            : ((this.isFinished = !0),
              this.emit("error", t),
              this.previous && this.previous.error(t),
              this.cleanUp()),
          !0)
        );
      },
      on: function (t, e) {
        return (this._listeners[t].push(e), this);
      },
      cleanUp: function () {
        ((this.streamInfo = this.generatedError = this.extraStreamInfo = null),
          (this._listeners = []));
      },
      emit: function (t, e) {
        if (this._listeners[t])
          for (var r = 0; r < this._listeners[t].length; r++)
            this._listeners[t][r].call(this, e);
      },
      pipe: function (t) {
        return t.registerPrevious(this);
      },
      registerPrevious: function (t) {
        if (this.isLocked)
          throw Error("The stream '" + this + "' has already been used.");
        ((this.streamInfo = t.streamInfo),
          this.mergeStreamInfo(),
          (this.previous = t));
        var e = this;
        return (
          t.on("data", function (t) {
            e.processChunk(t);
          }),
          t.on("end", function () {
            e.end();
          }),
          t.on("error", function (t) {
            e.error(t);
          }),
          this
        );
      },
      pause: function () {
        return (
          !this.isPaused &&
          !this.isFinished &&
          ((this.isPaused = !0), this.previous && this.previous.pause(), !0)
        );
      },
      resume: function () {
        if (!this.isPaused || this.isFinished) return !1;
        this.isPaused = !1;
        var t = !1;
        return (
          this.generatedError && (this.error(this.generatedError), (t = !0)),
          this.previous && this.previous.resume(),
          !t
        );
      },
      flush: function () {},
      processChunk: function (t) {
        this.push(t);
      },
      withStreamInfo: function (t, e) {
        return ((this.extraStreamInfo[t] = e), this.mergeStreamInfo(), this);
      },
      mergeStreamInfo: function () {
        for (var t in this.extraStreamInfo)
          Object.prototype.hasOwnProperty.call(this.extraStreamInfo, t) &&
            (this.streamInfo[t] = this.extraStreamInfo[t]);
      },
      lock: function () {
        if (this.isLocked)
          throw Error("The stream '" + this + "' has already been used.");
        ((this.isLocked = !0), this.previous && this.previous.lock());
      },
      toString: function () {
        var t = "Worker " + this.name;
        return this.previous ? this.previous + " -> " + t : t;
      },
    }),
      (e.exports = i));
