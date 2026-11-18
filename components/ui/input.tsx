import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, type = 'text', ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          'flex h-9 w-full rounded-md border border-line-strong bg-white px-2.5 text-[14px] text-ink outline-none transition-colors',
          'placeholder:text-ink-4 hover:border-ink-4 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/15',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
