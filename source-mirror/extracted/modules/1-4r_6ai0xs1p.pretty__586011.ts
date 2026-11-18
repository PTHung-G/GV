// Reconstructed from 1-4r_6ai0xs1p.pretty.js, module 586011.
// deps: m843476, m207670, m647163, m991918
// exports: cva, Slot, Button, buttonVariants
export { l as "cva" };
export { a as "Slot" };
export { function ({ className: e, variant: r = "default", size: n = "default", asChild: o = !1, ...l }) { let u = o ? a.Root : "button"; return (0, t.jsx)(u, { "data-slot": "button", "data-variant": r, "data-size": n, className: (0, i.cn)(s({ variant: r, size: n, className: e })), ...l, }); } as "Button" };
export { s as "buttonVariants" };

"use strict";
    var t = m843476,
      r = m207670;
    let n = (e) => ("boolean" == typeof e ? `${e}` : 0 === e ? "0" : e),
      o = r.clsx,
      l = (e, t) => (r) => {
        
        if ((null == t ? void 0 : t.variants) == null)
          return o(
            e,
            null == r ? void 0 : r.class,
            null == r ? void 0 : r.className,
          );
        let { variants: i, defaultVariants: a } = t,
          s = Object.keys(i).map((e) => {
            let t = null == r ? void 0 : r[e],
              o = null == a ? void 0 : a[e];
            if (null === t) return null;
            let l = n(t) || n(o);
            return i[e][l];
          }),
          u =
            r &&
            Object.entries(r).reduce((e, t) => {
              let [r, n] = t;
              return (void 0 === n || (e[r] = n), e);
            }, {});
        return o(
          e,
          s,
          null == t || null == (l = t.compoundVariants)
            ? void 0
            : l.reduce((e, t) => {
                let { class: r, className: n, ...o } = t;
                return Object.entries(o).every((e) => {
                  let [t, r] = e;
                  return Array.isArray(r)
                    ? r.includes({ ...a, ...u }[t])
                    : { ...a, ...u }[t] === r;
                })
                  ? [...e, r, n]
                  : e;
              }, []),
          null == r ? void 0 : r.class,
          null == r ? void 0 : r.className,
        );
      };
    ;
    var i = m647163,
      a = m991918;
    ;
    var a = a;
    let s = l(
      "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      {
        variants: {
          variant: {
            default:
              "bg-primary font-semibold text-primary-foreground hover:bg-[#1f1e1b]",
            destructive:
              "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
            outline:
              "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
            secondary:
              "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost:
              "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline",
          },
          size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
            sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
            lg: "h-11 rounded-md px-6 text-[15px] has-[>svg]:px-5",
            icon: "size-9",
            "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
            "icon-sm": "size-8",
            "icon-lg": "size-10",
          },
        },
        defaultVariants: { variant: "default", size: "default" },
      },
    );
    ;
