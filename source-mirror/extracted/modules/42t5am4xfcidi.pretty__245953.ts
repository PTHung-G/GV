// Reconstructed from 42t5am4xfcidi.pretty.js, module 245953.
// deps: none
// exports: none


"use strict";
    var n = {
      single_source_shortest_paths: function (t, e, r) {
        var o,
          i,
          a,
          s,
          u,
          l,
          h,
          f = {},
          c = {};
        c[e] = 0;
        var g = n.PriorityQueue.make();
        for (g.push(e, 0); !g.empty(); )
          for (a in ((i = (o = g.pop()).value), (s = o.cost), (u = t[i] || {})))
            u.hasOwnProperty(a) &&
              ((l = s + u[a]),
              (h = c[a]),
              (void 0 === c[a] || h > l) &&
                ((c[a] = l), g.push(a, l), (f[a] = i)));
        if (void 0 !== r && void 0 === c[r])
          throw Error(
            ["Could not find a path from ", e, " to ", r, "."].join(""),
          );
        return f;
      },
      extract_shortest_path_from_predecessor_list: function (t, e) {
        for (var r = [], n = e; n; ) (r.push(n), t[n], (n = t[n]));
        return (r.reverse(), r);
      },
      find_path: function (t, e, r) {
        var o = n.single_source_shortest_paths(t, e, r);
        return n.extract_shortest_path_from_predecessor_list(o, r);
      },
      PriorityQueue: {
        make: function (t) {
          var e,
            r = n.PriorityQueue,
            o = {};
          for (e in ((t = t || {}), r)) r.hasOwnProperty(e) && (o[e] = r[e]);
          return ((o.queue = []), (o.sorter = t.sorter || r.default_sorter), o);
        },
        default_sorter: function (t, e) {
          return t.cost - e.cost;
        },
        push: function (t, e) {
          (this.queue.push({ value: t, cost: e }),
            this.queue.sort(this.sorter));
        },
        pop: function () {
          return this.queue.shift();
        },
        empty: function () {
          return 0 === this.queue.length;
        },
      },
    };
    e.exports = n;
