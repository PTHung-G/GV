import type { Metadata } from 'next';
import { ExamsShell } from '@/components/exams/exams-shell';
import { ExamsBrowser } from '@/components/exams/exams-browser';
import { COMMUNITY_EXAMS } from '@/lib/community-exams';

export const metadata: Metadata = {
  title: 'Đề thi được chia sẻ',
  description: 'Tìm đề mẫu theo môn và lớp, sao về trình soạn để chỉnh theo ý, trộn mã đề và chấm bài.',
};

export default function ExamsPage() {
  return (
    <ExamsShell subtitle="Thư viện 12 đề mẫu K–12 hoàn chỉnh kèm đáp án">
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
    </ExamsShell>
  );
}
