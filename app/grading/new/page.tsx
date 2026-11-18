import type { Metadata } from 'next';
import { NewSessionWizard } from '@/components/grading/new-session-wizard';

export const metadata: Metadata = {
  title: 'Đợt chấm mới',
  robots: { index: false, follow: false },
};

export default function NewGradingSessionPage() {
  return <NewSessionWizard />;
}
