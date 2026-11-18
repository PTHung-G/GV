import type { Metadata } from 'next';
import { GradingSessionList } from '@/components/grading/session-list';

export const metadata: Metadata = {
  title: 'Chấm bài',
  robots: { index: false, follow: false },
};

export default function GradingPage() {
  return <GradingSessionList />;
}
