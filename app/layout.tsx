import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { DocsProvider } from '@/lib/docs-store';
import { AuthDialog } from '@/components/auth-dialog';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  title: {
    default: 'soandethi.com — Soạn đề thi bằng AI',
    template: '%s · soandethi.com',
  },
  description:
    'Soạn đề thi bằng AI: viết đề từ lời mô tả, chỉnh số liệu, chuyển ảnh đề thành văn bản và làm đáp án, barem. Xuất Word hoặc in A4.',
  applicationName: 'soandethi.com',
  icons: {
    icon: [{ url: `${base}/brand/favicon-light-white-32.png`, sizes: '32x32', type: 'image/png' }],
    apple: [{ url: `${base}/brand/favicon-light-white-180.png`, sizes: '180x180' }],
  },
  authors: [{ name: 'Hộ kinh doanh Ngũ Thành An' }],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'soandethi.com',
    title: 'soandethi.com — Soạn đề thi bằng AI',
    description:
      'Trợ lý AI giúp giáo viên soạn đề thi, chỉnh số liệu, chuyển ảnh đề thành văn bản và làm đáp án cùng barem chấm điểm.',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        {/* Served from /public so the urls stay relative and work under any basePath. */}
        <link rel="stylesheet" href={`${base}/fonts.css`} />
      </head>
      <body className="flex min-h-dvh flex-col bg-white text-ink antialiased">
        <AuthProvider>
          <DocsProvider>
            {children}
            <AuthDialog />
          </DocsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
