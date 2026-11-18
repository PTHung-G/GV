import type { Metadata } from 'next';
import { PairClaim } from '@/components/grading/pair-claim';

export const metadata: Metadata = {
  title: 'Ghép thiết bị',
  robots: { index: false, follow: false },
};

export default async function PairPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <PairClaim code={code} />;
}
