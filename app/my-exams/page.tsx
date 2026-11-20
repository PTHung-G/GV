import type { Metadata } from "next";
import { MyExams } from "@/components/my-exams";

export const metadata: Metadata = {
  title: "Đề thi của tôi",
  robots: { index: false, follow: false },
};

export default function MyExamsPage() {
  return <MyExams />;
}
