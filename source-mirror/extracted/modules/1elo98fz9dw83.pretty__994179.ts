// Reconstructed from 1elo98fz9dw83.pretty.js, module 994179.
// deps: m843476, m225913, m179862, m586011
// exports: Badge
export { function ({ className: e, variant: a = "default", asChild: s = !1, ...o }) { let l = s ? i.Slot.Root : "span"; return (0, t.jsx)(l, { "data-slot": "badge", "data-variant": a, className: (0, n.cn)(r({ variant: a }), e), ...o, }); } as "Badge" };

"use strict";
    var t = m843476,
      a = m225913,
      n = m179862,
      i = m586011;
    let r = (0, a.cva)(
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
