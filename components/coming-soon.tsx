import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export function ComingSoon({
  eyebrow,
  title,
  description,
  bullets,
}: {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-(--page-max) px-(--gutter) pt-16 pb-24">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-ink-4 uppercase">{eyebrow}</p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2">{description}</p>

          <div className="mt-10 max-w-2xl rounded-md border border-line bg-surface-2 p-6">
            <p className="text-[13px] font-semibold tracking-wide text-ink-4 uppercase">Bản clone chưa làm phần này</p>
            <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink-2">
              {bullets.map((b) => (
                <li key={b} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-line-strong" />
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-[14px] font-semibold text-white hover:bg-accent-hover"
            >
              <ArrowLeft className="size-4" /> Về trang chủ
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
