import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { APP_NAME, BUSINESS, CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description: `Điều khoản dịch vụ, chính sách giá, hoàn tiền và giải quyết khiếu nại trên ${APP_NAME}.`,
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-3xl px-(--gutter) py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-wider text-ink-3 uppercase">{APP_NAME}</p>
          <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Điều khoản sử dụng
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
            Khi tạo tài khoản hoặc sử dụng nền tảng {APP_NAME} do {BUSINESS.name} vận hành, bạn đồng ý với các quy định dưới đây nhằm bảo đảm quyền lợi học thuật của giáo viên và an toàn dữ liệu của nhà trường.
          </p>

          <div className="mt-10 space-y-10 text-[15px] leading-7 text-ink-2">
            <section aria-labelledby="scope-title">
              <h2 id="scope-title" className="text-lg font-semibold text-ink">
                1. Quyền sở hữu nội dung &amp; phạm vi sử dụng
              </h2>
              <p className="mt-2">
                Toàn bộ đề kiểm tra, đáp án, ngân hàng câu hỏi, danh sách lớp học và kết quả chấm bài do giáo viên tạo lập hoặc tải lên thuộc quyền sở hữu hoàn toàn của tài khoản tạo ra nội dung đó. {APP_NAME} không sử dụng đề kiểm tra nội bộ hoặc bài làm học sinh của bạn cho mục đích công khai khi chưa có sự đồng ý rõ ràng.
              </p>
              <p className="mt-2">
                Giáo viên có trách nhiệm kiểm tra lại nội dung chuyên môn, công thức và đáp án được tạo bởi trợ lý AI trước khi tổ chức kiểm tra chính thức hoặc công bố điểm cho học sinh.
              </p>
            </section>

            <section id="gia" aria-labelledby="gia-title">
              <h2 id="gia-title" className="text-lg font-semibold text-ink">
                2. Gói dịch vụ, giá và thanh toán
              </h2>
              <p className="mt-2">
                Nền tảng cung cấp các tính năng soạn thảo A4, quản lý lớp học, phát hành mã đề OMR và lưu trữ tài liệu cơ bản cho tài khoản giáo viên. Các gói nâng cao dành cho cá nhân, tổ bộ môn hoặc nhà trường sẽ được công bố bảng giá minh bạch theo từng kỳ trước khi người dùng xác nhận thanh toán.
              </p>
            </section>

            <section id="hoan-tien" aria-labelledby="hoan-tien-title">
              <h2 id="hoan-tien-title" className="text-lg font-semibold text-ink">
                3. Chấm dứt dịch vụ &amp; chính sách hoàn tiền
              </h2>
              <p className="mt-2">
                Người dùng có quyền ngừng sử dụng tài khoản và tải về dữ liệu đề thi, bảng điểm CSV bất kỳ lúc nào. Đối với các gói trả phí phát sinh lỗi kỹ thuật nghiêm trọng từ phía hệ thống hoặc thanh toán trùng lặp trong vòng 07 ngày kể từ thời điểm giao dịch, yêu cầu hoàn tiền sẽ được tiếp nhận và xử lý hoàn trả theo phương thức thanh toán ban đầu.
              </p>
            </section>

            <section id="khieu-nai" aria-labelledby="khieu-nai-title">
              <h2 id="khieu-nai-title" className="text-lg font-semibold text-ink">
                4. Giải quyết khiếu nại và hỗ trợ
              </h2>
              <p className="mt-2">
                Mọi phản hồi về bản quyền đề thi, sự cố chấm bài hoặc giao dịch thanh toán xin gửi về địa chỉ{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-accent hover:underline">
                  {CONTACT_EMAIL}
                </a>
                . Bộ phận kỹ thuật sẽ phản hồi và xác minh trong vòng 48 giờ làm việc.
              </p>
            </section>
          </div>

          <div className="mt-10 border-t border-line pt-6 text-sm text-ink-3">
            Xem thêm{' '}
            <Link href="/privacy" className="font-medium text-accent hover:underline">
              Chính sách bảo mật
            </Link>
            .
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
