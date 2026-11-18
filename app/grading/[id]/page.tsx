import type { Metadata } from 'next';
import { GradingWorkspace } from '@/components/grading/workspace';

export const metadata: Metadata = {
  title: 'Đợt chấm',
  robots: { index: false, follow: false },
};

export default async function GradingSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GradingWorkspace sessionId={id} />;
}
