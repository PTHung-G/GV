import type { Metadata } from 'next';
import { ComingSoon } from '@/components/coming-soon';

export const metadata: Metadata = { title: 'Điều khoản sử dụng' };

const BULLETS = [
  'Điều khoản dùng thử bản clone', 'Giấy phép nội dung'
];

export default function Page() {
  return (
    <ComingSoon
      eyebrow="Chính sách"
      title="Điều khoản sử dụng"
      description="Trang điều khoản của bản clone."
      bullets={BULLETS}
    />
  );
}
