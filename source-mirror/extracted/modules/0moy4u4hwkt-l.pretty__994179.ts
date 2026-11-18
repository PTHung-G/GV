// Reconstructed from 0moy4u4hwkt-l.pretty.js, module 994179.
// deps: m843476, m225913, m179862, m586011
// exports: Badge
export { function ({ className: e, variant: n = "default", asChild: l = !1, ...s }) { let o = l ? a.Slot.Root : "span"; return (0, t.jsx)(o, { "data-slot": "badge", "data-variant": n, className: (0, r.cn)(i({ variant: n }), e), ...s, }); } as "Badge" };

"use strict";
    var t = m843476,
      n = m225913,
      r = m179862,
      a = m586011;
    let i = (0, n.cva)(
      "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
      {
        variants: {
          variant: {
            default:
              "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
            secondary:
              "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
            destructive:
              "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
            outline:
              "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            link: "text-primary underline-offset-4 [a&]:hover:underline",
          },
        },
        defaultVariants: { variant: "default" },
      },
    );
    ;
