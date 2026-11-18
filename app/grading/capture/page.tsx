import type { Metadata } from 'next';
import { CaptureScreen } from '@/components/grading/capture-screen';

export const metadata: Metadata = {
  title: 'Quét bài',
  robots: { index: false, follow: false },
};

export default function CapturePage() {
  return <CaptureScreen />;
}
