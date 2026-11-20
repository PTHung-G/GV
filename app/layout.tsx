import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { DocsProvider } from '@/lib/docs-store';
import { AuthDialog } from '@/components/auth-dialog';
import { APP_NAME, APP_TAGLINE, BUSINESS } from '@/lib/site';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    'Nền tảng Hỗ trợ giáo viên: soạn đề thi AI trên trang A4, quản lý ngân hàng câu hỏi, sinh bộ mã đề trộn & phiếu tô OMR, và chấm điểm tự động.',
  applicationName: APP_NAME,
  icons: {
    icon: [{ url: `${base}/brand/favicon-light-white-32.png`, sizes: '32x32', type: 'image/png' }],
    apple: [{ url: `${base}/brand/favicon-light-white-180.png`, sizes: '180x180' }],
  },
  authors: [{ name: BUSINESS.name }],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: APP_NAME,
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description:
      'Trợ lý AI giúp giáo viên soạn đề thi, tổ chức ngân hàng câu hỏi, trộn mã đề và chấm bài nhanh trên cả trắc nghiệm OMR lẫn tự luận.',
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
