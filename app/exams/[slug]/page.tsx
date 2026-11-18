import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ExamDetail } from '@/components/exams/exam-detail';
import { COMMUNITY_EXAMS } from '@/lib/community-exams';

export function generateStaticParams() {
  return COMMUNITY_EXAMS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const exam = COMMUNITY_EXAMS.find((e) => e.slug === slug);
  if (!exam) return { title: 'Không tìm thấy đề' };
  return { title: exam.title, description: `${exam.title} — ${exam.author}, ${exam.copies} lượt sử dụng.` };
}

export default async function ExamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exam = COMMUNITY_EXAMS.find((e) => e.slug === slug);
  if (!exam) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <ExamDetail exam={exam} />
      </main>
      <SiteFooter />
    </>
  );
}
