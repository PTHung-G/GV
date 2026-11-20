import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { APP_NAME, CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: `Chính sách thu thập, lưu trữ và bảo vệ dữ liệu giáo viên, đề thi và bảng điểm trên ${APP_NAME}.`,
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-3xl px-(--gutter) py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-wider text-ink-3 uppercase">{APP_NAME}</p>
          <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Chính sách bảo mật
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
            {APP_NAME} cam kết bảo mật tuyệt đối tài liệu giảng dạy, ngân hàng câu hỏi, danh sách lớp và hình ảnh bài làm học sinh theo nguyên tắc tối thiểu dữ liệu cần thiết để vận hành hệ thống.
          </p>

          <div className="mt-10 space-y-8 text-[15px] leading-7 text-ink-2">
            <section aria-labelledby="collect-title">
              <h2 id="collect-title" className="text-lg font-semibold text-ink">
                1. Dữ liệu được lưu trữ
              </h2>
              <p className="mt-2">
                Hệ thống chỉ lưu thông tin tài khoản (họ tên, địa chỉ email, mật khẩu băm một chiều), nội dung đề thi và đáp án của bạn, cấu trúc cây chủ đề kho câu hỏi, danh sách học sinh theo lớp/SBD và kết quả các đợt chấm bài do bạn tạo.
              </p>
            </section>

            <section aria-labelledby="omr-title">
              <h2 id="omr-title" className="text-lg font-semibold text-ink">
                2. Hình ảnh phiếu bài làm &amp; thông tin học sinh
              </h2>
              <p className="mt-2">
                Ảnh bài làm học sinh và bảng điểm lớp học được gắn chặt theo quyền sở hữu tài khoản giáo viên (owner isolation). Khi giáo viên xoá đợt chấm hoặc xoá lớp học, dữ liệu liên quan sẽ được gỡ bỏ khỏi giao diện làm việc và vùng lưu trữ của tài khoản.
              </p>
            </section>

            <section aria-labelledby="security-title">
              <h2 id="security-title" className="text-lg font-semibold text-ink">
                3. Phiên đăng nhập và bảo vệ tài khoản
              </h2>
              <p className="mt-2">
                Phiên làm việc sử dụng cookie bảo mật <code className="rounded-sm bg-surface-3 px-1.5 py-0.5 text-xs">HttpOnly</code> và <code className="rounded-sm bg-surface-3 px-1.5 py-0.5 text-xs">SameSite=Lax</code> nhằm ngăn chặn truy cập trái phép từ kịch bản bên thứ ba. Hệ thống áp dụng giới hạn tần suất đăng nhập để bảo vệ tài khoản trước các lần thử mật khẩu tự động.
              </p>
            </section>

            <section aria-labelledby="contact-privacy-title">
              <h2 id="contact-privacy-title" className="text-lg font-semibold text-ink">
                4. Yêu cầu chỉnh sửa hoặc xoá dữ liệu
              </h2>
              <p className="mt-2">
                Nếu bạn cần hỗ trợ xuất dữ liệu hoặc yêu cầu xoá vĩnh viễn tài khoản, vui lòng liên hệ{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-accent hover:underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-10 border-t border-line pt-6 text-sm text-ink-3">
            Xem thêm{' '}
            <Link href="/terms" className="font-medium text-accent hover:underline">
              Điều khoản sử dụng
            </Link>
            .
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
