import type { Metadata } from "next";
import { MyExams } from "@/components/my-exams";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Đề thi của tôi",
  robots: { index: false, follow: false },
};

export default function MyExamsPage() {
  return (
    <>
      <div className="flex justify-end border-b border-line bg-surface px-5 py-2 sm:px-8">
        <Link
          href="/question-bank"
          className="inline-flex items-center gap-2 rounded-lg bg-accent-soft px-4 py-2 text-sm font-semibold text-accent hover:bg-accent-soft"
        >
          <span aria-hidden>▤</span> Kho câu hỏi
        </Link>
      </div>
      <MyExams />
    </>
  );
}
