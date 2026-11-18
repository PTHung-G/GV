import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * The one way to show a status.
 *
 * Before this, every screen painted its own version — `rounded-sm`, `rounded-sm`
 * and `rounded-md`, three paddings and four text sizes — so the same word
 * ("Đã chốt") looked different from one list to the next.
 */
const tones = {
  neutral: 'bg-surface-3 text-ink-2',
  accent: 'bg-accent-soft text-accent',
  ok: 'bg-ok-soft text-ok',
  warn: 'bg-warn-soft text-warn',
  danger: 'bg-danger-soft text-danger',
} as const;

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: keyof typeof tones;
};

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-tone={tone}
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-sm px-1.5 py-px text-[10.5px] font-medium whitespace-nowrap',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
