import type { Metadata } from 'next';
import { ComingSoon } from '@/components/coming-soon';

export const metadata: Metadata = { title: 'Chính sách bảo mật' };

const BULLETS = [
  'Dữ liệu chỉ lưu trong trình duyệt', 'Không gửi nội dung đề ra máy chủ'
];

export default function Page() {
  return (
    <ComingSoon
      eyebrow="Chính sách"
      title="Chính sách bảo mật"
      description="Trang chính sách bảo mật của bản clone."
      bullets={BULLETS}
    />
  );
}
