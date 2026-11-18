// Reconstructed from 3zi979v0iopom.pretty.js, module 99642.
// deps: none
// exports: none


"use strict";
    var e = t.i(733986),
      i = t.i(485651),
      s = t.i(843476),
      n = t.i(107230),
      r = t.i(287022),
      o = t.i(560140),
      a = t.i(271645),
      l = t.i(464978),
      h = t.i(231178),
      u = t.i(104035);
    let c = !1;
    class d extends a.Component {
      componentDidMount() {
        let {
            visualElement: t,
            layoutGroup: e,
            switchLayoutGroup: i,
            layoutId: s,
          } = this.props,
          { projection: r } = t;
        (r &&
          (e.group && e.group.add(r),
          i && i.register && s && i.register(r),
          c && r.root.didUpdate(),
          r.addEventListener("animationComplete", () => {
            this.safeToRemove();
          }),
          r.setOptions({
            ...r.options,
            layoutDependency: this.props.layoutDependency,
            onExitComplete: () => this.safeToRemove(),
          })),
          (n.globalProjectionState.hasEverUpdated = !0));
      }
      getSnapshotBeforeUpdate(t) {
        let {
            layoutDependency: e,
            visualElement: i,
            drag: s,
            isPresent: n,
          } = this.props,
          { projection: o } = i;
        return (
          o &&
            ((o.isPresent = n),
            t.layoutDependency !== e &&
              o.setOptions({ ...o.options, layoutDependency: e }),
            (c = !0),
            s || t.layoutDependency !== e || void 0 === e || t.isPresent !== n
              ? o.willUpdate()
              : this.safeToRemove(),
            t.isPresent !== n &&
              (n
                ? o.promote()
                : o.relegate() ||
                  r.frame.postRender(() => {
                    let t = o.getStack();
                    (t && t.members.length) || this.safeToRemove();
                  }))),
          null
        );
      }
      componentDidUpdate() {
        let { visualElement: t, layoutAnchor: e } = this.props,
          { projection: i } = t;
        i &&
          ((i.options.layoutAnchor = e),
          i.root.didUpdate(),
          o.microtask.postRender(() => {
            !i.currentAnimation && i.isLead() && this.safeToRemove();
          }));
      }
      componentWillUnmount() {
        let {
            visualElement: t,
            layoutGroup: e,
            switchLayoutGroup: i,
          } = this.props,
          { projection: s } = t;
        ((c = !0),
          s &&
            (s.scheduleCheckAfterUnmount(),
            e && e.group && e.group.remove(s),
            i && i.deregister && i.deregister(s)));
      }
      safeToRemove() {
        let { safeToRemove: t } = this.props;
        t && t();
      }
      render() {
        return null;
      }
    }
    function m(t) {
      let [e, i] = (0, l.usePresence)(),
        n = (0, a.useContext)(h.LayoutGroupContext);
      return (0, s.jsx)(d, {
        ...t,
        layoutGroup: n,
        switchLayoutGroup: (0, a.useContext)(u.SwitchLayoutGroupContext),
        isPresent: e,
        safeToRemove: i,
      });
    }
    t.s(["MeasureLayout", 0, m], 877397);
    var p = t.i(570596),
      f = t.i(476959),
      g = t.i(260830),
      v = t.i(939011),
      y = t.i(486427),
      x = t.i(83411),
      b = t.i(349404),
      T = t.i(716896),
      S = t.i(987333),
      w = t.i(496173),
      P = t.i(924463);
    t.i(763074);
    var A = t.i(889026),
      M = t.i(100706),
      V = t.i(733871),
      C = t.i(265091),
      E = t.i(783920),
      D = t.i(791559),
      k = t.i(895051);
    let R = k.cornerRadiusProps.length,
      L = (t) => ("string" == typeof t ? parseFloat(t) : t),
      B = (t) => "number" == typeof t || C.px.test(t);
    function F(t, e) {
      return void 0 !== t[e] ? t[e] : t.borderRadius;
    }
    let j = O(0, 0.5, D.circOut),
      I = O(0.5, 0.95, g.noop);
    function O(t, e, i) {
      return (s) => (s < t ? 0 : s > e ? 1 : i((0, E.progress)(t, e, s)));
    }
    function N(t, e) {
      ((t.min = e.min), (t.max = e.max));
    }
    function U(t, e) {
      (N(t.x, e.x), N(t.y, e.y));
    }
    function W(t, e) {
      ((t.translate = e.translate),
        (t.scale = e.scale),
        (t.originPoint = e.originPoint),
        (t.origin = e.origin));
    }
    var $ = t.i(135636),
      G = t.i(652101);
    function z(t, e, i, s, n) {
      return (
        (t -= e),
        (t = (0, $.scalePoint)(t, 1 / i, s)),
        void 0 !== n && (t = (0, $.scalePoint)(t, 1 / n, s)),
        t
      );
    }
    function H(t, e, [i, s, n], r, o) {
      !(function (t, e = 0, i = 1, s = 0.5, n, r = t, o = t) {
        if (
          (C.percent.test(e) &&
            ((e = parseFloat(e)),
            (e = (0, M.mixNumber)(o.min, o.max, e / 100) - o.min)),
          "number" != typeof e)
        )
          return;
        let a = (0, M.mixNumber)(r.min, r.max, s);
        (t === r && (a -= e),
          (t.min = z(t.min, e, i, a, n)),
          (t.max = z(t.max, e, i, a, n)));
      })(t, e[i], e[s], e[n], e.scale, r, o);
    }
    let K = ["x", "scaleX", "originX"],
      Y = ["y", "scaleY", "originY"];
    function X(t, e, i, s) {
      (H(t.x, e, K, i ? i.x : void 0, s ? s.x : void 0),
        H(t.y, e, Y, i ? i.y : void 0, s ? s.y : void 0));
    }
    var _ = t.i(130162);
    function q(t) {
      return 0 === t.translate && 1 === t.scale;
    }
    function Z(t) {
      return q(t.x) && q(t.y);
    }
    function J(t, e) {
      return t.min === e.min && t.max === e.max;
    }
    function Q(t, e) {
      return (
        Math.round(t.min) === Math.round(e.min) &&
        Math.round(t.max) === Math.round(e.max)
      );
    }
    function tt(t, e) {
      return Q(t.x, e.x) && Q(t.y, e.y);
    }
    function te(t) {
      return (0, G.calcLength)(t.x) / (0, G.calcLength)(t.y);
    }
    function ti(t, e) {
      return (
        t.translate === e.translate &&
        t.scale === e.scale &&
        t.originPoint === e.originPoint
      );
    }
    var ts = t.i(133887);
    class tn {
      constructor() {
        this.members = [];
      }
      add(t) {
        (0, ts.addUniqueItem)(this.members, t);
        for (let e = this.members.length - 1; e >= 0; e--) {
          let i = this.members[e];
          if (i === t || i === this.lead || i === this.prevLead) continue;
          let s = i.instance;
          (s && !1 !== s.isConnected) ||
            i.snapshot ||
            ((0, ts.removeItem)(this.members, i), i.unmount());
        }
        t.scheduleRender();
      }
      remove(t) {
        if (
          ((0, ts.removeItem)(this.members, t),
          t === this.prevLead && (this.prevLead = void 0),
          t === this.lead)
        ) {
          let t = this.members[this.members.length - 1];
          t && this.promote(t);
        }
      }
      relegate(t) {
        for (let e = this.members.indexOf(t) - 1; e >= 0; e--) {
          let t = this.members[e];
          if (!1 !== t.isPresent && t.instance?.isConnected !== !1)
            return (this.promote(t), !0);
        }
        return !1;
      }
      promote(t, e) {
        let i = this.lead;
        if (t !== i && ((this.prevLead = i), (this.lead = t), t.show(), i)) {
          (i.updateSnapshot(), t.scheduleRender());
          let { layoutDependency: s } = i.options,
            { layoutDependency: n } = t.options;
          ((void 0 === s || s !== n) &&
            ((t.resumeFrom = i),
            e && (i.preserveOpacity = !0),
            i.snapshot &&
              ((t.snapshot = i.snapshot),
              (t.snapshot.latestValues = i.animationValues || i.latestValues)),
            t.root?.isUpdating && (t.isLayoutDirty = !0)),
            !1 === t.options.crossfade && i.hide());
        }
      }
      exitAnimationComplete() {
        this.members.forEach((t) => {
          (t.options.onExitComplete?.(),
            t.resumingFrom?.options.onExitComplete?.());
        });
      }
      scheduleRender() {
        this.members.forEach((t) => t.instance && t.scheduleRender(!1));
      }
      removeLeadSnapshot() {
        this.lead?.snapshot && (this.lead.snapshot = void 0);
      }
    }
    var tr = t.i(655559);
    let to = (t, e) => t.depth - e.depth;
    class ta {
      constructor() {
        ((this.children = []), (this.isDirty = !1));
      }
      add(t) {
        ((0, ts.addUniqueItem)(this.children, t), (this.isDirty = !0));
      }
      remove(t) {
        ((0, ts.removeItem)(this.children, t), (this.isDirty = !0));
      }
      forEach(t) {
        (this.isDirty && this.children.sort(to),
          (this.isDirty = !1),
          this.children.forEach(t));
      }
    }
    var tl = t.i(177777);
    let th = ["", "X", "Y", "Z"],
      tu = 0;
    function tc(t, e, i, s) {
      let { latestValues: n } = e;
      n[t] && ((i[t] = n[t]), e.setStaticValue(t, 0), s && (s[t] = 0));
    }
    function td({
      attachResizeListener: t,
      defaultParent: e,
      measureScroll: i,
      checkIsScrollRoot: s,
      resetTransform: a,
    }) {
      return class {
        constructor(t = {}, i = e?.()) {
          ((this.id = tu++),
            (this.animationId = 0),
            (this.animationCommitId = 0),
            (this.children = new Set()),
            (this.options = {}),
            (this.isTreeAnimating = !1),
            (this.isAnimationBlocked = !1),
            (this.isLayoutDirty = !1),
            (this.isProjectionDirty = !1),
            (this.isSharedProjectionDirty = !1),
            (this.isTransformDirty = !1),
            (this.updateManuallyBlocked = !1),
            (this.updateBlockedByResize = !1),
            (this.isUpdating = !1),
            (this.isSVG = !1),
            (this.needsReset = !1),
            (this.shouldResetTransform = !1),
            (this.hasCheckedOptimisedAppear = !1),
            (this.treeScale = { x: 1, y: 1 }),
            (this.eventHandlers = new Map()),
            (this.hasTreeAnimated = !1),
            (this.updateScheduled = !1),
            (this.scheduleUpdate = () => this.update()),
            (this.projectionUpdateScheduled = !1),
            (this.checkUpdateFailed = () => {
              this.isUpdating &&
                ((this.isUpdating = !1), this.clearAllSnapshots());
            }),
            (this.updateProjection = () => {
              ((this.projectionUpdateScheduled = !1),
                this.nodes.forEach(tf),
                this.nodes.forEach(tA),
                this.nodes.forEach(tM),
                this.nodes.forEach(tg));
            }),
            (this.resolvedRelativeTargetAt = 0),
            (this.hasProjected = !1),
            (this.isVisible = !0),
            (this.animationProgress = 0),
            (this.sharedNodes = new Map()),
            (this.latestValues = t),
            (this.root = i ? i.root || i : this),
            (this.path = i ? [...i.path, i] : []),
            (this.parent = i),
            (this.depth = i ? i.depth + 1 : 0));
          for (let t = 0; t < this.path.length; t++)
            this.path[t].shouldResetTransform = !0;
          this.root === this && (this.nodes = new ta());
        }
        addEventListener(t, e) {
          return (
            this.eventHandlers.has(t) ||
              this.eventHandlers.set(t, new p.SubscriptionManager()),
            this.eventHandlers.get(t).add(e)
          );
        }
        notifyListeners(t, ...e) {
          let i = this.eventHandlers.get(t);
          i && i.notify(...e);
        }
        hasListeners(t) {
          return this.eventHandlers.has(t);
        }
        mount(e) {
          if (this.instance) return;
          ((this.isSVG =
            (0, A.isSVGElement)(e) &&
            (!(0, A.isSVGElement)(e) || "svg" !== e.tagName)),
            (this.instance = e));
          let { layoutId: i, layout: s, visualElement: o } = this.options;
          if (
            (o && !o.current && o.mount(e),
            this.root.nodes.add(this),
            this.parent && this.parent.children.add(this),
            this.root.hasTreeAnimated && (s || i) && (this.isLayoutDirty = !0),
            t)
          ) {
            let i,
              s = 0,
              o = () => (this.root.updateBlockedByResize = !1);
            (r.frame.read(() => {
              s = window.innerWidth;
            }),
              t(e, () => {
                let t = window.innerWidth;
                if (t !== s) {
                  
                  ((s = t),
                    (this.root.updateBlockedByResize = !0),
                    i && i(),
                    (e = w.time.now()),
                    (a = ({ timestamp: t }) => {
                      let i = t - e;
                      i >= 250 && ((0, r.cancelFrame)(a), o());
                    }),
                    r.frame.setup(a, !0),
                    (i = () => (0, r.cancelFrame)(a)),
                    n.globalProjectionState.hasAnimatedSinceResize &&
                      ((n.globalProjectionState.hasAnimatedSinceResize = !1),
                      this.nodes.forEach(tP)));
                }
              }));
          }
          (i && this.root.registerSharedNode(i, this),
            !1 !== this.options.animate &&
              o &&
              (i || s) &&
              this.addEventListener(
                "didUpdate",
                ({
                  delta: t,
                  hasLayoutChanged: e,
                  hasRelativeLayoutChanged: i,
                  layout: s,
                }) => {
                  if (this.isTreeAnimationBlocked()) {
                    ((this.target = void 0), (this.relativeTarget = void 0));
                    return;
                  }
                  let n =
                      this.options.transition || o.getDefaultTransition() || tR,
                    {
                      onLayoutAnimationStart: r,
                      onLayoutAnimationComplete: a,
                    } = o.getProps(),
                    l = !this.targetLayout || !tt(this.targetLayout, s),
                    h = !e && i;
                  if (
                    this.options.layoutRoot ||
                    this.resumeFrom ||
                    h ||
                    (e && (l || !this.currentAnimation))
                  ) {
                    this.resumeFrom &&
                      ((this.resumingFrom = this.resumeFrom),
                      (this.resumingFrom.resumingFrom = void 0));
                    let e = {
                      ...(0, S.getValueTransition)(n, "layout"),
                      onPlay: r,
                      onComplete: a,
                    };
                    ((o.shouldReduceMotion || this.options.layoutRoot) &&
                      ((e.delay = 0), (e.type = !1)),
                      this.startAnimation(e),
                      this.setAnimationOrigin(t, h, e.path));
                  } else
                    (e || tP(this),
                      this.isLead() &&
                        this.options.onExitComplete &&
                        this.options.onExitComplete());
                  this.targetLayout = s;
                },
              ));
        }
        unmount() {
          (this.options.layoutId && this.willUpdate(),
            this.root.nodes.remove(this));
          let t = this.getStack();
          (t && t.remove(this),
            this.parent && this.parent.children.delete(this),
            (this.instance = void 0),
            this.eventHandlers.clear(),
            (0, r.cancelFrame)(this.updateProjection));
        }
        blockUpdate() {
          this.updateManuallyBlocked = !0;
        }
        unblockUpdate() {
          this.updateManuallyBlocked = !1;
        }
        isUpdateBlocked() {
          return this.updateManuallyBlocked || this.updateBlockedByResize;
        }
        isTreeAnimationBlocked() {
          return (
            this.isAnimationBlocked ||
            (this.parent && this.parent.isTreeAnimationBlocked()) ||
            !1
          );
        }
        startUpdate() {
          !this.isUpdateBlocked() &&
            ((this.isUpdating = !0),
            this.nodes && this.nodes.forEach(tV),
            this.animationId++);
        }
        getTransformTemplate() {
          let { visualElement: t } = this.options;
          return t && t.getProps().transformTemplate;
        }
        willUpdate(t = !0) {
          if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked())) {
            this.options.onExitComplete && this.options.onExitComplete();
            return;
          }
          if (
            (window.MotionCancelOptimisedAnimation &&
              !this.hasCheckedOptimisedAppear &&
              (function t(e) {
                if (((e.hasCheckedOptimisedAppear = !0), e.root === e)) return;
                let { visualElement: i } = e.options;
                if (!i) return;
                let s = (0, T.getOptimisedAppearId)(i);
                if (window.MotionHasOptimisedAnimation(s, "transform")) {
                  let { layout: t, layoutId: i } = e.options;
                  window.MotionCancelOptimisedAnimation(
                    s,
                    "transform",
                    r.frame,
                    !(t || i),
                  );
                }
                let { parent: n } = e;
                n && !n.hasCheckedOptimisedAppear && t(n);
              })(this),
            this.root.isUpdating || this.root.startUpdate(),
            this.isLayoutDirty)
          )
            return;
          this.isLayoutDirty = !0;
          for (let t = 0; t < this.path.length; t++) {
            let e = this.path[t];
            ((e.shouldResetTransform = !0),
              ("string" == typeof e.latestValues.x ||
                "string" == typeof e.latestValues.y) &&
                (e.isLayoutDirty = !0),
              e.updateScroll("snapshot"),
              e.options.layoutRoot && e.willUpdate(!1));
          }
          let { layoutId: e, layout: i } = this.options;
          if (void 0 === e && !i) return;
          let s = this.getTransformTemplate();
          ((this.prevTransformTemplateValue = s
            ? s(this.latestValues, "")
            : void 0),
            this.updateSnapshot(),
            t && this.notifyListeners("willUpdate"));
        }
        update() {
          if (((this.updateScheduled = !1), this.isUpdateBlocked())) {
            let t = this.updateBlockedByResize;
            (this.unblockUpdate(),
              (this.updateBlockedByResize = !1),
              this.clearAllSnapshots(),
              t && this.nodes.forEach(tx),
              this.nodes.forEach(ty));
            return;
          }
          if (this.animationId <= this.animationCommitId)
            return void this.nodes.forEach(tb);
          ((this.animationCommitId = this.animationId),
            this.isUpdating
              ? ((this.isUpdating = !1),
                this.nodes.forEach(tT),
                this.nodes.forEach(tS),
                this.nodes.forEach(tw),
                this.nodes.forEach(tm),
                this.nodes.forEach(tp))
              : this.nodes.forEach(tb),
            this.clearAllSnapshots());
          let t = w.time.now();
          ((r.frameData.delta = (0, f.clamp)(
            0,
            1e3 / 60,
            t - r.frameData.timestamp,
          )),
            (r.frameData.timestamp = t),
            (r.frameData.isProcessing = !0),
            r.frameSteps.update.process(r.frameData),
            r.frameSteps.preRender.process(r.frameData),
            r.frameSteps.render.process(r.frameData),
            (r.frameData.isProcessing = !1));
        }
        didUpdate() {
          this.updateScheduled ||
            ((this.updateScheduled = !0),
            o.microtask.read(this.scheduleUpdate));
        }
        clearAllSnapshots() {
          (this.nodes.forEach(tv), this.sharedNodes.forEach(tC));
        }
        scheduleUpdateProjection() {
          this.projectionUpdateScheduled ||
            ((this.projectionUpdateScheduled = !0),
            r.frame.preRender(this.updateProjection, !1, !0));
        }
        scheduleCheckAfterUnmount() {
          r.frame.postRender(() => {
            this.isLayoutDirty
              ? this.root.didUpdate()
              : this.root.checkUpdateFailed();
          });
        }
        updateSnapshot() {
          !this.snapshot &&
            this.instance &&
            ((this.snapshot = this.measure()),
            !this.snapshot ||
              (0, G.calcLength)(this.snapshot.measuredBox.x) ||
              (0, G.calcLength)(this.snapshot.measuredBox.y) ||
              (this.snapshot = void 0));
        }
        updateLayout() {
          if (
            !this.instance ||
            (this.updateScroll(),
            !(this.options.alwaysMeasureLayout && this.isLead()) &&
              !this.isLayoutDirty)
          )
            return;
          if (this.resumeFrom && !this.resumeFrom.instance)
            for (let t = 0; t < this.path.length; t++)
              this.path[t].updateScroll();
          let t = this.layout;
          ((this.layout = this.measure(!1)),
            this.layoutCorrected || (this.layoutCorrected = (0, _.createBox)()),
            (this.isLayoutDirty = !1),
            (this.projectionDelta = void 0),
            this.notifyListeners("measure", this.layout.layoutBox));
          let { visualElement: e } = this.options;
          e &&
            e.notify(
              "LayoutMeasure",
              this.layout.layoutBox,
              t ? t.layoutBox : void 0,
            );
        }
        updateScroll(t = "measure") {
          let e = !!(this.options.layoutScroll && this.instance);
          if (
            (this.scroll &&
              this.scroll.animationId === this.root.animationId &&
              this.scroll.phase === t &&
              (e = !1),
            e && this.instance)
          ) {
            let e = s(this.instance);
            this.scroll = {
              animationId: this.root.animationId,
              phase: t,
              isRoot: e,
              offset: i(this.instance),
              wasRoot: this.scroll ? this.scroll.isRoot : e,
            };
          }
        }
        resetTransform() {
          if (!a) return;
          let t =
              this.isLayoutDirty ||
              this.shouldResetTransform ||
              this.options.alwaysMeasureLayout,
            e = this.projectionDelta && !Z(this.projectionDelta),
            i = this.getTransformTemplate(),
            s = i ? i(this.latestValues, "") : void 0,
            n = s !== this.prevTransformTemplateValue;
          t &&
            this.instance &&
            (e || (0, tl.hasTransform)(this.latestValues) || n) &&
            (a(this.instance, s),
            (this.shouldResetTransform = !1),
            this.scheduleRender());
        }
        measure(t = !0) {
          
          let i = this.measurePageBox(),
            s = this.removeElementScroll(i);
          return (
            t && (s = this.removeTransform(s)),
            tF((e = s).x),
            tF(e.y),
            {
              animationId: this.root.animationId,
              measuredBox: i,
              layoutBox: s,
              latestValues: {},
              source: this.id,
            }
          );
        }
        measurePageBox() {
          let { visualElement: t } = this.options;
          if (!t) return (0, _.createBox)();
          let e = t.measureViewportBox();
          if (!(this.scroll?.wasRoot || this.path.some(tI))) {
            let { scroll: t } = this.root;
            t &&
              ((0, $.translateAxis)(e.x, t.offset.x),
              (0, $.translateAxis)(e.y, t.offset.y));
          }
          return e;
        }
        removeElementScroll(t) {
          let e = (0, _.createBox)();
          if ((U(e, t), this.scroll?.wasRoot)) return e;
          for (let i = 0; i < this.path.length; i++) {
            let s = this.path[i],
              { scroll: n, options: r } = s;
            s !== this.root &&
              n &&
              r.layoutScroll &&
              (n.wasRoot && U(e, t),
              (0, $.translateAxis)(e.x, n.offset.x),
              (0, $.translateAxis)(e.y, n.offset.y));
          }
          return e;
        }
        applyTransform(t, e = !1, i) {
          let s = i || (0, _.createBox)();
          U(s, t);
          for (let t = 0; t < this.path.length; t++) {
            let i = this.path[t];
            (!e &&
              i.options.layoutScroll &&
              i.scroll &&
              i !== i.root &&
              ((0, $.translateAxis)(s.x, -i.scroll.offset.x),
              (0, $.translateAxis)(s.y, -i.scroll.offset.y)),
              (0, tl.hasTransform)(i.latestValues) &&
                (0, $.transformBox)(s, i.latestValues, i.layout?.layoutBox));
          }
          return (
            (0, tl.hasTransform)(this.latestValues) &&
              (0, $.transformBox)(s, this.latestValues, this.layout?.layoutBox),
            s
          );
        }
        removeTransform(t) {
          let e = (0, _.createBox)();
          U(e, t);
          for (let t = 0; t < this.path.length; t++) {
            let i,
              s = this.path[t];
            (0, tl.hasTransform)(s.latestValues) &&
              (s.instance &&
                ((0, tl.hasScale)(s.latestValues) && s.updateSnapshot(),
                U((i = (0, _.createBox)()), s.measurePageBox())),
              X(e, s.latestValues, s.snapshot?.layoutBox, i));
          }
          return (
            (0, tl.hasTransform)(this.latestValues) && X(e, this.latestValues),
            e
          );
        }
        setTargetDelta(t) {
          ((this.targetDelta = t),
            this.root.scheduleUpdateProjection(),
            (this.isProjectionDirty = !0));
        }
        setOptions(t) {
          this.options = {
            ...this.options,
            ...t,
            crossfade: void 0 === t.crossfade || t.crossfade,
          };
        }
        clearMeasurements() {
          ((this.scroll = void 0),
            (this.layout = void 0),
            (this.snapshot = void 0),
            (this.prevTransformTemplateValue = void 0),
            (this.targetDelta = void 0),
            (this.target = void 0),
            (this.isLayoutDirty = !1));
        }
        forceRelativeParentToResolveTarget() {
          this.relativeParent &&
            this.relativeParent.resolvedRelativeTargetAt !==
              r.frameData.timestamp &&
            this.relativeParent.resolveTargetDelta(!0);
        }
        resolveTargetDelta(t = !1) {
          let e = this.getLead();
          (this.isProjectionDirty ||
            (this.isProjectionDirty = e.isProjectionDirty),
            this.isTransformDirty ||
              (this.isTransformDirty = e.isTransformDirty),
            this.isSharedProjectionDirty ||
              (this.isSharedProjectionDirty = e.isSharedProjectionDirty));
          let i = !!this.resumingFrom || this !== e;
          if (
            !(
              t ||
              (i && this.isSharedProjectionDirty) ||
              this.isProjectionDirty ||
              this.parent?.isProjectionDirty ||
              this.attemptToResolveRelativeTarget ||
              this.root.updateBlockedByResize
            )
          )
            return;
          let { layout: s, layoutId: n } = this.options;
          if (!this.layout || !(s || n)) return;
          this.resolvedRelativeTargetAt = r.frameData.timestamp;
          let o = this.getClosestProjectingParent();
          (this.targetDelta ||
            this.relativeTarget ||
            (!1 !== this.options.layoutAnchor && o && o.layout
              ? this.createRelativeTarget(
                  o,
                  this.layout.layoutBox,
                  o.layout.layoutBox,
                )
              : this.removeRelativeTarget()),
            (this.relativeTarget || this.targetDelta) &&
              (this.target ||
                ((this.target = (0, _.createBox)()),
                (this.targetWithTransforms = (0, _.createBox)())),
              this.relativeTarget &&
              this.relativeTargetOrigin &&
              this.relativeParent &&
              this.relativeParent.target
                ? (this.forceRelativeParentToResolveTarget(),
                  (0, G.calcRelativeBox)(
                    this.target,
                    this.relativeTarget,
                    this.relativeParent.target,
                    this.options.layoutAnchor || void 0,
                  ))
                : this.targetDelta
                  ? (this.resumingFrom
                      ? this.applyTransform(
                          this.layout.layoutBox,
                          !1,
                          this.target,
                        )
                      : U(this.target, this.layout.layoutBox),
                    (0, $.applyBoxDelta)(this.target, this.targetDelta))
                  : U(this.target, this.layout.layoutBox),
              this.attemptToResolveRelativeTarget &&
                ((this.attemptToResolveRelativeTarget = !1),
                !1 !== this.options.layoutAnchor &&
                o &&
                !!o.resumingFrom == !!this.resumingFrom &&
                !o.options.layoutScroll &&
                o.target &&
                1 !== this.animationProgress
                  ? this.createRelativeTarget(o, this.target, o.target)
                  : (this.relativeParent = this.relativeTarget = void 0))));
        }
        getClosestProjectingParent() {
          if (
            !(
              !this.parent ||
              (0, tl.hasScale)(this.parent.latestValues) ||
              (0, tl.has2DTranslate)(this.parent.latestValues)
            )
          )
            if (this.parent.isProjecting()) return this.parent;
            else return this.parent.getClosestProjectingParent();
        }
        isProjecting() {
          return !!(
            (this.relativeTarget ||
              this.targetDelta ||
              this.options.layoutRoot) &&
            this.layout
          );
        }
        createRelativeTarget(t, e, i) {
          ((this.relativeParent = t),
            this.forceRelativeParentToResolveTarget(),
            (this.relativeTarget = (0, _.createBox)()),
            (this.relativeTargetOrigin = (0, _.createBox)()),
            (0, G.calcRelativePosition)(
              this.relativeTargetOrigin,
              e,
              i,
              this.options.layoutAnchor || void 0,
            ),
            U(this.relativeTarget, this.relativeTargetOrigin));
        }
        removeRelativeTarget() {
          this.relativeParent = this.relativeTarget = void 0;
        }
        calcProjection() {
          let t = this.getLead(),
            e = !!this.resumingFrom || this !== t,
            i = !0;
          if (
            ((this.isProjectionDirty || this.parent?.isProjectionDirty) &&
              (i = !1),
            e &&
              (this.isSharedProjectionDirty || this.isTransformDirty) &&
              (i = !1),
            this.resolvedRelativeTargetAt === r.frameData.timestamp && (i = !1),
            i)
          )
            return;
          let { layout: s, layoutId: n } = this.options;
          if (
            ((this.isTreeAnimating = !!(
              (this.parent && this.parent.isTreeAnimating) ||
              this.currentAnimation ||
              this.pendingAnimation
            )),
            this.isTreeAnimating ||
              (this.targetDelta = this.relativeTarget = void 0),
            !this.layout || !(s || n))
          )
            return;
          U(this.layoutCorrected, this.layout.layoutBox);
          let o = this.treeScale.x,
            a = this.treeScale.y;
          ((0, $.applyTreeDeltas)(
            this.layoutCorrected,
            this.treeScale,
            this.path,
            e,
          ),
            t.layout &&
              !t.target &&
              (1 !== this.treeScale.x || 1 !== this.treeScale.y) &&
              ((t.target = t.layout.layoutBox),
              (t.targetWithTransforms = (0, _.createBox)())));
          let { target: l } = t;
          if (!l) {
            this.prevProjectionDelta &&
              (this.createProjectionDeltas(), this.scheduleRender());
            return;
          }
          (this.projectionDelta && this.prevProjectionDelta
            ? (W(this.prevProjectionDelta.x, this.projectionDelta.x),
              W(this.prevProjectionDelta.y, this.projectionDelta.y))
            : this.createProjectionDeltas(),
            (0, G.calcBoxDelta)(
              this.projectionDelta,
              this.layoutCorrected,
              l,
              this.latestValues,
            ),
            (this.treeScale.x === o &&
              this.treeScale.y === a &&
              ti(this.projectionDelta.x, this.prevProjectionDelta.x) &&
              ti(this.projectionDelta.y, this.prevProjectionDelta.y)) ||
              ((this.hasProjected = !0),
              this.scheduleRender(),
              this.notifyListeners("projectionUpdate", l)));
        }
        hide() {
          this.isVisible = !1;
        }
        show() {
          this.isVisible = !0;
        }
        scheduleRender(t = !0) {
          if ((this.options.visualElement?.scheduleRender(), t)) {
            let t = this.getStack();
            t && t.scheduleRender();
          }
          this.resumingFrom &&
            !this.resumingFrom.instance &&
            (this.resumingFrom = void 0);
        }
        createProjectionDeltas() {
          ((this.prevProjectionDelta = (0, _.createDelta)()),
            (this.projectionDelta = (0, _.createDelta)()),
            (this.projectionDeltaWithTransform = (0, _.createDelta)()));
        }
        setAnimationOrigin(t, e = !1, i) {
          let s,
            n = this.snapshot,
            r = n ? n.latestValues : {},
            o = { ...this.latestValues },
            a = (0, _.createDelta)();
          ((this.relativeParent && this.relativeParent.options.layoutRoot) ||
            (this.relativeTarget = this.relativeTargetOrigin = void 0),
            (this.attemptToResolveRelativeTarget = !e));
          let l = (0, _.createBox)(),
            h =
              (n ? n.source : void 0) !==
              (this.layout ? this.layout.source : void 0),
            u = this.getStack(),
            c = !u || u.members.length <= 1,
            d = !!(
              h &&
              !c &&
              !0 === this.options.crossfade &&
              !this.path.some(tk)
            );
          this.animationProgress = 0;
          let m = i?.interpolateProjection(t);
          ((this.mixTargetDelta = (e) => {
            let i = e / 1e3,
              n = m?.(i);
            if (
              (n
                ? ((a.x.translate = n.x),
                  (a.x.scale = (0, M.mixNumber)(t.x.scale, 1, i)),
                  (a.x.origin = t.x.origin),
                  (a.x.originPoint = t.x.originPoint),
                  (a.y.translate = n.y),
                  (a.y.scale = (0, M.mixNumber)(t.y.scale, 1, i)),
                  (a.y.origin = t.y.origin),
                  (a.y.originPoint = t.y.originPoint))
                : (tE(a.x, t.x, i), tE(a.y, t.y, i)),
              this.setTargetDelta(a),
              this.relativeTarget &&
                this.relativeTargetOrigin &&
                this.layout &&
                this.relativeParent &&
                this.relativeParent.layout)
            ) {
              
              ((0, G.calcRelativePosition)(
                l,
                this.layout.layoutBox,
                this.relativeParent.layout.layoutBox,
                this.options.layoutAnchor || void 0,
              ),
                (f = this.relativeTarget),
                (g = this.relativeTargetOrigin),
                (v = l),
                (y = i),
                tD(f.x, g.x, v.x, y),
                tD(f.y, g.y, v.y, y),
                s &&
                  ((u = this.relativeTarget),
                  (p = s),
                  J(u.x, p.x) && J(u.y, p.y)) &&
                  (this.isProjectionDirty = !1),
                s || (s = (0, _.createBox)()),
                U(s, this.relativeTarget));
            }
            (h &&
              ((this.animationValues = o),
              (function (t, e, i, s, n, r) {
                n
                  ? ((t.opacity = (0, M.mixNumber)(0, i.opacity ?? 1, j(s))),
                    (t.opacityExit = (0, M.mixNumber)(e.opacity ?? 1, 0, I(s))))
                  : r &&
                    (t.opacity = (0, M.mixNumber)(
                      e.opacity ?? 1,
                      i.opacity ?? 1,
                      s,
                    ));
                for (let n = 0; n < R; n++) {
                  let r = k.cornerRadiusProps[n],
                    o = F(e, r),
                    a = F(i, r);
                  (void 0 !== o || void 0 !== a) &&
                    (o || (o = 0),
                    a || (a = 0),
                    0 === o || 0 === a || B(o) === B(a)
                      ? ((t[r] = Math.max((0, M.mixNumber)(L(o), L(a), s), 0)),
                        (C.percent.test(a) || C.percent.test(o)) &&
                          (t[r] += "%"))
                      : (t[r] = a));
                }
                (e.rotate || i.rotate) &&
                  (t.rotate = (0, M.mixNumber)(
                    e.rotate || 0,
                    i.rotate || 0,
                    s,
                  ));
              })(o, r, this.latestValues, i, d, c)),
              n &&
                void 0 !== n.rotate &&
                (this.animationValues || (this.animationValues = o),
                (this.animationValues.pathRotation = n.rotate)),
              this.root.scheduleUpdateProjection(),
              this.scheduleRender(),
              (this.animationProgress = i));
          }),
            this.mixTargetDelta(1e3 * !!this.options.layoutRoot));
        }
        startAnimation(t) {
          (this.notifyListeners("animationStart"),
            this.currentAnimation?.stop(),
            this.resumingFrom?.currentAnimation?.stop(),
            this.pendingAnimation &&
              ((0, r.cancelFrame)(this.pendingAnimation),
              (this.pendingAnimation = void 0)),
            (this.pendingAnimation = r.frame.update(() => {
              
              
              ((n.globalProjectionState.hasAnimatedSinceResize = !0),
                this.motionValue || (this.motionValue = (0, y.motionValue)(0)),
                this.motionValue.jump(0, !1),
                (this.currentAnimation =
                  ((e = this.motionValue),
                  (i = [0, 1e3]),
                  (s = {
                    ...t,
                    velocity: 0,
                    isSync: !0,
                    onUpdate: (e) => {
                      (this.mixTargetDelta(e), t.onUpdate && t.onUpdate(e));
                    },
                    onComplete: () => {
                      (t.onComplete && t.onComplete(),
                        this.completeAnimation());
                    },
                  }),
                  (r = (0, x.isMotionValue)(e)
                    ? e
                    : (0, y.motionValue)(e)).start(
                    (0, v.animateMotionValue)("", r, i, s),
                  ),
                  r.animation)),
                (0, b.notifyLayoutAnimationStart)(this.currentAnimation, this),
                this.resumingFrom &&
                  (this.resumingFrom.currentAnimation = this.currentAnimation),
                (this.pendingAnimation = void 0));
            })));
        }
        completeAnimation() {
          this.resumingFrom &&
            ((this.resumingFrom.currentAnimation = void 0),
            (this.resumingFrom.preserveOpacity = void 0));
          let t = this.getStack();
          (t && t.exitAnimationComplete(),
            (this.resumingFrom =
              this.currentAnimation =
              this.animationValues =
                void 0),
            this.notifyListeners("animationComplete"));
        }
        finishAnimation() {
          (this.currentAnimation &&
            (this.mixTargetDelta && this.mixTargetDelta(1e3),
            this.currentAnimation.stop()),
            this.completeAnimation());
        }
        applyTransformsToTarget() {
          let t = this.getLead(),
            { targetWithTransforms: e, layout: i, latestValues: s } = t,
            { target: n } = t;
          if (e && n && i) {
            if (
              this !== t &&
              this.layout &&
              i &&
              tj(this.options.animationType, this.layout.layoutBox, i.layoutBox)
            ) {
              n = this.target || (0, _.createBox)();
              let e = (0, G.calcLength)(this.layout.layoutBox.x);
              ((n.x.min = t.target.x.min), (n.x.max = n.x.min + e));
              let i = (0, G.calcLength)(this.layout.layoutBox.y);
              ((n.y.min = t.target.y.min), (n.y.max = n.y.min + i));
            }
            (U(e, n),
              (0, $.transformBox)(e, s),
              (0, G.calcBoxDelta)(
                this.projectionDeltaWithTransform,
                this.layoutCorrected,
                e,
                s,
              ));
          }
        }
        registerSharedNode(t, e) {
          (this.sharedNodes.has(t) || this.sharedNodes.set(t, new tn()),
            this.sharedNodes.get(t).add(e));
          let i = e.options.initialPromotionConfig;
          e.promote({
            transition: i ? i.transition : void 0,
            preserveFollowOpacity:
              i && i.shouldPreserveFollowOpacity
                ? i.shouldPreserveFollowOpacity(e)
                : void 0,
          });
        }
        isLead() {
          let t = this.getStack();
          return !t || t.lead === this;
        }
        getLead() {
          let { layoutId: t } = this.options;
          return (t && this.getStack()?.lead) || this;
        }
        getPrevLead() {
          let { layoutId: t } = this.options;
          return t ? this.getStack()?.prevLead : void 0;
        }
        getStack() {
          let { layoutId: t } = this.options;
          if (t) return this.root.sharedNodes.get(t);
        }
        promote({
          needsReset: t,
          transition: e,
          preserveFollowOpacity: i,
        } = {}) {
          let s = this.getStack();
          (s && s.promote(this, i),
            t && ((this.projectionDelta = void 0), (this.needsReset = !0)),
            e && this.setOptions({ transition: e }));
        }
        relegate() {
          let t = this.getStack();
          return !!t && t.relegate(this);
        }
        resetSkewAndRotation() {
          let { visualElement: t } = this.options;
          if (!t) return;
          let e = !1,
            { latestValues: i } = t;
          if (
            ((i.z ||
              i.rotate ||
              i.rotateX ||
              i.rotateY ||
              i.rotateZ ||
              i.skewX ||
              i.skewY) &&
              (e = !0),
            !e)
          )
            return;
          let s = {};
          i.z && tc("z", t, s, this.animationValues);
          for (let e = 0; e < th.length; e++)
            (tc(`rotate${th[e]}`, t, s, this.animationValues),
              tc(`skew${th[e]}`, t, s, this.animationValues));
          for (let e in (t.render(), s))
            (t.setStaticValue(e, s[e]),
              this.animationValues && (this.animationValues[e] = s[e]));
          t.scheduleRender();
        }
        applyProjectionStyles(t, e) {
          if (!this.instance || this.isSVG) return;
          if (!this.isVisible) {
            t.visibility = "hidden";
            return;
          }
          let i = this.getTransformTemplate();
          if (this.needsReset) {
            ((this.needsReset = !1),
              (t.visibility = ""),
              (t.opacity = ""),
              (t.pointerEvents =
                (0, V.resolveMotionValue)(e?.pointerEvents) || ""),
              (t.transform = i ? i(this.latestValues, "") : "none"));
            return;
          }
          let s = this.getLead();
          if (!this.projectionDelta || !this.layout || !s.target) {
            (this.options.layoutId &&
              ((t.opacity =
                void 0 !== this.latestValues.opacity
                  ? this.latestValues.opacity
                  : 1),
              (t.pointerEvents =
                (0, V.resolveMotionValue)(e?.pointerEvents) || "")),
              this.hasProjected &&
                !(0, tl.hasTransform)(this.latestValues) &&
                ((t.transform = i ? i({}, "") : "none"),
                (this.hasProjected = !1)));
            return;
          }
          t.visibility = "";
          let n = s.animationValues || s.latestValues;
          this.applyTransformsToTarget();
          let r = (function (t, e, i) {
            let s = "",
              n = t.x.translate / e.x,
              r = t.y.translate / e.y,
              o = i?.z || 0;
            if (
              ((n || r || o) && (s = `translate3d(${n}px, ${r}px, ${o}px) `),
              (1 !== e.x || 1 !== e.y) &&
                (s += `scale(${1 / e.x}, ${1 / e.y}) `),
              i)
            ) {
              let {
                transformPerspective: t,
                rotate: e,
                pathRotation: n,
                rotateX: r,
                rotateY: o,
                skewX: a,
                skewY: l,
              } = i;
              (t && (s = `perspective(${t}px) ${s}`),
                e && (s += `rotate(${e}deg) `),
                n && (s += `rotate(${n}deg) `),
                r && (s += `rotateX(${r}deg) `),
                o && (s += `rotateY(${o}deg) `),
                a && (s += `skewX(${a}deg) `),
                l && (s += `skewY(${l}deg) `));
            }
            let a = t.x.scale * e.x,
              l = t.y.scale * e.y;
            return (
              (1 !== a || 1 !== l) && (s += `scale(${a}, ${l})`),
              s || "none"
            );
          })(this.projectionDeltaWithTransform, this.treeScale, n);
          (i && (r = i(n, r)), (t.transform = r));
          let { x: o, y: a } = this.projectionDelta;
          for (let e in ((t.transformOrigin = `${100 * o.origin}% ${100 * a.origin}% 0`),
          s.animationValues
            ? (t.opacity =
                s === this
                  ? (n.opacity ?? this.latestValues.opacity ?? 1)
                  : this.preserveOpacity
                    ? this.latestValues.opacity
                    : n.opacityExit)
            : (t.opacity =
                s === this
                  ? void 0 !== n.opacity
                    ? n.opacity
                    : ""
                  : void 0 !== n.opacityExit
                    ? n.opacityExit
                    : 0),
          P.scaleCorrectors)) {
            if (void 0 === n[e]) continue;
            let {
                correct: i,
                applyTo: o,
                isCSSVariable: a,
              } = P.scaleCorrectors[e],
              l = "none" === r ? n[e] : i(n[e], s);
            if (o) {
              let e = o.length;
              for (let i = 0; i < e; i++) t[o[i]] = l;
            } else
              a
                ? (this.options.visualElement.renderState.vars[e] = l)
                : (t[e] = l);
          }
          this.options.layoutId &&
            (t.pointerEvents =
              s === this
                ? (0, V.resolveMotionValue)(e?.pointerEvents) || ""
                : "none");
        }
        clearSnapshot() {
          this.resumeFrom = this.snapshot = void 0;
        }
        resetTree() {
          (this.root.nodes.forEach((t) => t.currentAnimation?.stop()),
            this.root.nodes.forEach(ty),
            this.root.sharedNodes.clear());
        }
      };
    }
    function tm(t) {
      t.updateLayout();
    }
    function tp(t) {
      let e = t.resumeFrom?.snapshot || t.snapshot;
      if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
        let { layoutBox: i, measuredBox: s } = t.layout,
          { animationType: n } = t.options,
          r = e.source !== t.layout.source;
        if ("size" === n)
          (0, tr.eachAxis)((t) => {
            let s = r ? e.measuredBox[t] : e.layoutBox[t],
              n = (0, G.calcLength)(s);
            ((s.min = i[t].min), (s.max = s.min + n));
          });
        else if ("x" === n || "y" === n) {
          let t = "x" === n ? "y" : "x";
          N(r ? e.measuredBox[t] : e.layoutBox[t], i[t]);
        } else
          tj(n, e.layoutBox, i) &&
            (0, tr.eachAxis)((s) => {
              let n = r ? e.measuredBox[s] : e.layoutBox[s],
                o = (0, G.calcLength)(i[s]);
              ((n.max = n.min + o),
                t.relativeTarget &&
                  !t.currentAnimation &&
                  ((t.isProjectionDirty = !0),
                  (t.relativeTarget[s].max = t.relativeTarget[s].min + o)));
            });
        let o = (0, _.createDelta)();
        (0, G.calcBoxDelta)(o, i, e.layoutBox);
        let a = (0, _.createDelta)();
        r
          ? (0, G.calcBoxDelta)(a, t.applyTransform(s, !0), e.measuredBox)
          : (0, G.calcBoxDelta)(a, i, e.layoutBox);
        let l = !Z(o),
          h = !1;
        if (!t.resumeFrom) {
          let s = t.getClosestProjectingParent();
          if (s && !s.resumeFrom) {
            let { snapshot: n, layout: r } = s;
            if (n && r) {
              let o = t.options.layoutAnchor || void 0,
                a = (0, _.createBox)();
              (0, G.calcRelativePosition)(a, e.layoutBox, n.layoutBox, o);
              let l = (0, _.createBox)();
              ((0, G.calcRelativePosition)(l, i, r.layoutBox, o),
                tt(a, l) || (h = !0),
                s.options.layoutRoot &&
                  ((t.relativeTarget = l),
                  (t.relativeTargetOrigin = a),
                  (t.relativeParent = s)));
            }
          }
        }
        t.notifyListeners("didUpdate", {
          layout: i,
          snapshot: e,
          delta: a,
          layoutDelta: o,
          hasLayoutChanged: l,
          hasRelativeLayoutChanged: h,
        });
      } else if (t.isLead()) {
        let { onExitComplete: e } = t.options;
        e && e();
      }
      t.options.transition = void 0;
    }
    function tf(t) {
      t.parent &&
        (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty),
        t.isSharedProjectionDirty ||
          (t.isSharedProjectionDirty = !!(
            t.isProjectionDirty ||
            t.parent.isProjectionDirty ||
            t.parent.isSharedProjectionDirty
          )),
        t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
    }
    function tg(t) {
      t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
    }
    function tv(t) {
      t.clearSnapshot();
    }
    function ty(t) {
      t.clearMeasurements();
    }
    function tx(t) {
      ((t.isLayoutDirty = !0), t.updateLayout());
    }
    function tb(t) {
      t.isLayoutDirty = !1;
    }
    function tT(t) {
      t.isAnimationBlocked &&
        t.layout &&
        !t.isLayoutDirty &&
        ((t.snapshot = t.layout), (t.isLayoutDirty = !0));
    }
    function tS(t) {
      t.relativeTarget &&
        t.relativeParent?.isLayoutDirty &&
        (t.currentAnimation
          ? (t.isLayoutDirty = !0)
          : ((t.targetDelta = void 0), t.removeRelativeTarget()));
    }
    function tw(t) {
      let { visualElement: e } = t.options;
      (e &&
        e.getProps().onBeforeLayoutMeasure &&
        e.notify("BeforeLayoutMeasure"),
        t.resetTransform());
    }
    function tP(t) {
      (t.finishAnimation(),
        (t.targetDelta = t.relativeTarget = t.target = void 0),
        (t.isProjectionDirty = !0));
    }
    function tA(t) {
      t.resolveTargetDelta();
    }
    function tM(t) {
      t.calcProjection();
    }
    function tV(t) {
      t.resetSkewAndRotation();
    }
    function tC(t) {
      t.removeLeadSnapshot();
    }
    function tE(t, e, i) {
      ((t.translate = (0, M.mixNumber)(e.translate, 0, i)),
        (t.scale = (0, M.mixNumber)(e.scale, 1, i)),
        (t.origin = e.origin),
        (t.originPoint = e.originPoint));
    }
    function tD(t, e, i, s) {
      ((t.min = (0, M.mixNumber)(e.min, i.min, s)),
        (t.max = (0, M.mixNumber)(e.max, i.max, s)));
    }
    function tk(t) {
      return t.animationValues && void 0 !== t.animationValues.opacityExit;
    }
    let tR = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
      tL = (t) =>
        "u" > typeof navigator &&
        navigator.userAgent &&
        navigator.userAgent.toLowerCase().includes(t),
      tB = tL("applewebkit/") && !tL("chrome/") ? Math.round : g.noop;
    function tF(t) {
      ((t.min = tB(t.min)), (t.max = tB(t.max)));
    }
    function tj(t, e, i) {
      return (
        "position" === t ||
        ("preserve-aspect" === t && !(0, G.isNear)(te(e), te(i), 0.2))
      );
    }
    function tI(t) {
      return t !== t.root && t.scroll?.wasRoot;
    }
    var tO = t.i(282774);
    let tN = td({
        attachResizeListener: (t, e) => (0, tO.addDomEvent)(t, "resize", e),
        measureScroll: () => ({
          x:
            document.documentElement.scrollLeft ||
            document.body?.scrollLeft ||
            0,
          y:
            document.documentElement.scrollTop || document.body?.scrollTop || 0,
        }),
        checkIsScrollRoot: () => !0,
      }),
      tU = { current: void 0 },
      tW = td({
        measureScroll: (t) => ({ x: t.scrollLeft, y: t.scrollTop }),
        defaultParent: () => {
          if (!tU.current) {
            let t = new tN({});
            (t.mount(window),
              t.setOptions({ layoutScroll: !0 }),
              (tU.current = t));
          }
          return tU.current;
        },
        resetTransform: (t, e) => {
          t.style.transform = void 0 !== e ? e : "none";
        },
        checkIsScrollRoot: (t) =>
          "fixed" === window.getComputedStyle(t).position,
      });
    t.s(["HTMLProjectionNode", 0, tW], 717871);
    let t$ = {
      pan: { Feature: i.PanGesture },
      drag: { Feature: e.DragGesture, ProjectionNode: tW, MeasureLayout: m },
    };
    t.s(["drag", 0, t$], 646816);
    var tG = t.i(142098),
      tz = t.i(439676),
      tH = t.i(749652);
    function tK(t, e) {
      let i = (0, tH.resolveElements)(t),
        s = new AbortController();
      return [i, { passive: !0, ...e, signal: s.signal }, () => s.abort()];
    }
    t.s(["setupGesture", 0, tK], 973089);
    var tY = t.i(665536);
    function tX(t, e, i) {
      let { props: s } = t;
      t.animationState &&
        s.whileHover &&
        t.animationState.setActive("whileHover", "Start" === i);
      let n = s["onHover" + i];
      n && r.frame.postRender(() => n(e, (0, tY.extractEventInfo)(e)));
    }
    class t_ extends tG.Feature {
      mount() {
        let { current: t } = this.node;
        t &&
          (this.unmount = (function (t, e, i = {}) {
            let [s, n, r] = tK(t, i);
            return (
              s.forEach((t) => {
                let i,
                  s = !1,
                  r = !1,
                  o = (e) => {
                    (i && (i(e), (i = void 0)),
                      t.removeEventListener("pointerleave", l));
                  },
                  a = (t) => {
                    ((s = !1),
                      window.removeEventListener("pointerup", a),
                      window.removeEventListener("pointercancel", a),
                      r && ((r = !1), o(t)));
                  },
                  l = (t) => {
                    if ("touch" !== t.pointerType) {
                      if (s) {
                        r = !0;
                        return;
                      }
                      o(t);
                    }
                  };
                (t.addEventListener(
                  "pointerenter",
                  (s) => {
                    if ("touch" === s.pointerType || (0, tz.isDragActive)())
                      return;
                    r = !1;
                    let o = e(t, s);
                    "function" == typeof o &&
                      ((i = o), t.addEventListener("pointerleave", l, n));
                  },
                  n,
                ),
                  t.addEventListener(
                    "pointerdown",
                    () => {
                      ((s = !0),
                        window.addEventListener("pointerup", a, n),
                        window.addEventListener("pointercancel", a, n));
                    },
                    n,
                  ));
              }),
              r
            );
          })(
            t,
            (t, e) => (
              tX(this.node, e, "Start"),
              (t) => tX(this.node, t, "End")
            ),
          ));
      }
      unmount() {}
    }
    t.s(["HoverGesture", 0, t_], 957512);
    var tq = tG,
      tZ = t.i(738638);
    class tJ extends tq.Feature {
      constructor() {
        (super(...arguments), (this.isActive = !1));
      }
      onFocus() {
        let t = !1;
        try {
          t = this.node.current.matches(":focus-visible");
        } catch (e) {
          t = !0;
        }
        t &&
          this.node.animationState &&
          (this.node.animationState.setActive("whileFocus", !0),
          (this.isActive = !0));
      }
      onBlur() {
        this.isActive &&
          this.node.animationState &&
          (this.node.animationState.setActive("whileFocus", !1),
          (this.isActive = !1));
      }
      mount() {
        this.unmount = (0, tZ.pipe)(
          (0, tO.addDomEvent)(this.node.current, "focus", () => this.onFocus()),
          (0, tO.addDomEvent)(this.node.current, "blur", () => this.onBlur()),
        );
      }
      unmount() {}
    }
    t.s(["FocusGesture", 0, tJ], 99642);
