import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { APP_NAME, CONTACT_EMAIL, ZALO_GROUP_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description:
    `${APP_NAME} là nền tảng soạn đề thi AI dành cho giáo viên, hỗ trợ quản lý ngân hàng câu hỏi, trộn mã đề chuẩn THPT 2025 và chấm bài tự động.`,
};

const FACTS = [
  {
    title: 'Trang A4 & Trộn mã đề',
    body: 'Soạn thảo trực tiếp trên trang A4 với KaTeX và hình học SVG. Tự động sinh bộ mã đề trộn theo 4 phần THPT 2025 kèm phiếu tô OMR đồng bộ.',
  },
  {
    title: 'Kho câu hỏi & Trợ lý AI',
    body: 'Tích luỹ câu hỏi từ đề cũ theo cây chủ đề, gắn sẵn đáp án/barem và dùng lại trực tiếp khi soạn đề mới hoặc tinh chỉnh số liệu với AI.',
  },
  {
    title: 'Lớp học & Bảng điểm hợp nhất',
    body: 'Quản lý danh sách học sinh theo lớp/SBD, quét phiếu OMR bằng điện thoại và tổng hợp bảng điểm chuẩn xác cho từng bài kiểm tra.',
  },
];

const STEPS = [
  { title: 'Soạn & Chốt đề', body: 'Soạn trên trang A4 hoặc ghép từ Kho câu hỏi, rà soát đáp án và barem có cấu trúc.' },
  { title: 'Sinh mã đề & In', body: 'Xuất bộ mã đề trộn, đáp án từng mã và phiếu trả lời trắc nghiệm OMR theo lớp.' },
  {
    title: 'Chụp bài & Xuất điểm',
    body: 'Quét phiếu trên điện thoại, duyệt điểm tự luận bằng AI và xuất bảng điểm CSV cho cả lớp.',
  },
];

const FAQ = [
  {
    q: `${APP_NAME} là gì?`,
    a: 'Nền tảng hỗ trợ toàn bộ quy trình kiểm tra đánh giá cho giáo viên: soạn đề A4 với AI, lưu trữ ngân hàng câu hỏi, trộn mã đề chuẩn 4 phần THPT 2025 và chấm phiếu OMR.',
  },
  {
    q: 'Tôi có cần đăng nhập không?',
    a: 'Bạn cần đăng nhập để đồng bộ đề thi, kho câu hỏi, danh sách lớp học và kết quả chấm bài lên máy chủ tài khoản trên mọi thiết bị.',
  },
  {
    q: 'Nền tảng hỗ trợ những dạng câu hỏi nào?',
    a: 'Đầy đủ 4 phần theo định dạng THPT 2025: trắc nghiệm nhiều lựa chọn (Phần I), trắc nghiệm Đúng/Sai tính điểm luỹ tiến (Phần II), trả lời ngắn (Phần III) và tự luận (Phần IV).',
  },
  {
    q: 'AI đọc được những ảnh và tệp nào?',
    a: 'Ảnh chụp đề giấy hoặc bài làm học sinh (JPG, PNG) và các tệp Word (.docx), TXT, Markdown.',
  },
  {
    q: 'Tôi có xuất ra Word hoặc in chuẩn A4 được không?',
    a: 'Có. Trình soạn xuất trực tiếp file Word (.docx) hoặc in PDF khổ A4 đồng bộ vị trí ngắt trang, kèm bộ đề trộn và phiếu tô trắc nghiệm.',
  },
  {
    q: 'Sửa đề sau khi đã phát hành hoặc tạo đợt chấm có làm sai điểm cũ không?',
    a: 'Không. Khi phát hành bộ mã đề hoặc tạo đợt chấm, đề và barem được đóng băng thành bản độc lập nên điểm của học sinh luôn chính xác theo đúng đề đã thi.',
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-(--page-max) px-(--gutter) pt-14 pb-12 sm:pt-20">
          <h1 className="font-display max-w-3xl text-4xl leading-[1.1] font-medium tracking-tight text-balance sm:text-[3.25rem]">
            Về {APP_NAME}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-2">
            Giải pháp soạn đề thi AI trên trang A4, xây dựng ngân hàng câu hỏi, phát hành bộ mã đề OMR và quản lý bảng
            điểm toàn lớp dành cho giáo viên.
          </p>
        </section>

        <section aria-labelledby="principles-title" className="border-t border-line bg-surface-2">
          <div className="mx-auto w-full max-w-(--page-max) px-(--gutter) py-14 sm:py-20">
            <h2 id="principles-title" className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Những phần chính
            </h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line">
              {FACTS.map((p) => (
                <li key={p.title} className="sm:px-8 sm:first:pl-0 sm:last:pr-0">
                  <h3 className="text-base font-semibold">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="steps-title">
          <div className="mx-auto w-full max-w-(--page-max) px-(--gutter) py-14 sm:py-20">
            <h2 id="steps-title" className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Các bước
            </h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="rounded-md border border-line p-6">
                  <span className="grid size-8 place-items-center rounded-full bg-surface-3 text-[13px] font-semibold text-ink-2">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-[15px] text-ink-2">
              Cần hỏi thêm? Gửi thư tới{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
                {CONTACT_EMAIL}
              </a>
              {ZALO_GROUP_URL ? (
                <>
                  {' '}
                  hoặc hỏi trong{' '}
                  <a href={ZALO_GROUP_URL} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    nhóm Zalo
                  </a>
                </>
              ) : null}
              .
            </p>
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-title" className="border-t border-line bg-surface-2">
          <div className="mx-auto w-full max-w-(--page-max) px-(--gutter) py-14 sm:py-20">
            <h2 id="faq-title" className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Câu hỏi thường gặp
            </h2>
            <div className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
              {FAQ.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span aria-hidden className="text-ink-4 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 pr-8 text-[15px] leading-relaxed text-ink-2">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="about-cta" className="border-t border-line">
          <div className="mx-auto w-full max-w-(--page-max) px-(--gutter) py-16 sm:py-20">
            <h2 id="about-cta" className="font-display max-w-xl text-3xl font-medium tracking-tight text-balance sm:text-4xl">
              Thử soạn một đề với AI ngay hôm nay
            </h2>
            <Link
              href="/my-exams"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-accent px-6 text-[15px] font-semibold text-white hover:bg-accent-hover"
            >
              Bắt đầu soạn đề
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
