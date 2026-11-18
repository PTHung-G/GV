import type { Metadata } from "next";
import { QuestionBank } from "@/components/question-bank/question-bank";

export const metadata: Metadata = {
  title: "Kho câu hỏi",
  robots: { index: false, follow: false },
};

export default function QuestionBankPage() {
  return <QuestionBank />;
}
