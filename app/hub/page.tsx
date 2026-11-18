import type { Metadata } from 'next';
import { FeatureHall } from '@/components/hub/feature-hall';

export const metadata: Metadata = {
  title: 'Sảnh tính năng',
  description: 'Chọn việc bạn muốn làm: soạn đề thi hoặc chấm bài thi.',
  robots: { index: false, follow: false },
};

export default function HubPage() {
  return <FeatureHall />;
}
