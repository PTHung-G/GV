'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-accent text-white hover:bg-accent-hover',
  outline: 'border border-line-strong bg-white text-ink hover:bg-surface-2',
  ghost: 'text-ink-2 hover:bg-surface-3 hover:text-ink',
  secondary: 'bg-surface-3 text-ink hover:bg-line',
  danger: 'bg-danger text-white hover:bg-[color-mix(in_oklab,var(--color-danger),black_12%)]',
  // Kept so older call sites keep compiling; it is the same look as `default`.
  blue: 'bg-accent text-white hover:bg-accent-hover',
} as const;

const sizes = {
  sm: 'h-7 px-2.5 text-[12.5px]',
  default: 'h-8 px-3 text-[13.5px]',
  lg: 'h-10 px-4 text-[14.5px]',
  xl: 'h-11 px-5 text-[15px]',
  icon: 'size-8',
} as const;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'default', size = 'default', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap transition-colors outline-none',
        'focus-visible:ring-[3px] focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
});
