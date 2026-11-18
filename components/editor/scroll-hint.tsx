'use client';

import { useEffect, useRef, useState } from 'react';

/** Marks its container when the content is wider than the visible area. */
export function ScrollHint({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setScrollable(el.scrollWidth - el.clientWidth > 8);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    el.addEventListener('scroll', check);
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', check);
    };
  }, []);

  return (
    <div ref={ref} data-scrollable={scrollable} className={className}>
      {children}
    </div>
  );
}
