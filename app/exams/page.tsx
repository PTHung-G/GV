import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ExamsBrowser } from '@/components/exams/exams-browser';
import { COMMUNITY_EXAMS } from '@/lib/community-exams';

export const metadata: Metadata = {
  title: 'Đề thi được chia sẻ',
  description: 'Tìm đề theo môn và lớp, sao về trình soạn để chỉnh theo ý, hoặc chia sẻ đề của bạn.',
};

export default function ExamsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-(--page-max) px-(--gutter) pt-8 pb-16 sm:pt-12">
          <div className="w-full min-[520px]:mx-auto min-[520px]:w-[calc(round(down,100%_+_20px,230px)_-_20px)]">
            <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
              <h1 className="font-display text-4xl leading-none font-semibold tracking-tight text-ink sm:text-[2.75rem]">
                Đề thi được chia sẻ
              </h1>
            </header>
            <ExamsBrowser exams={COMMUNITY_EXAMS} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
