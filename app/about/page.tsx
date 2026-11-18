import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CONTACT_EMAIL, ZALO_GROUP_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description:
    'soandethi.com là trình soạn đề thi dành cho giáo viên, có trợ lý AI lo phần viết câu hỏi, chỉnh số liệu, chép đề từ ảnh và làm đáp án, barem.',
};

const FACTS = [
  {
    title: 'Trang A4',
    body: 'Đề soạn trực tiếp trên trang A4, có công thức, đồ thị và hình học. Chỗ ngắt trang trên màn hình trùng với chỗ ngắt khi xuất Word hoặc in.',
  },
  {
    title: 'Trợ lý AI',
    body: 'Trợ lý viết, chỉnh và giải bài ngay trong trang. Kết quả hiện ra để bạn đọc và sửa tiếp như một tài liệu bình thường.',
  },
  {
    title: 'Kho đề',
    body: 'Đề chia sẻ được người khác sao về chỉnh theo ý. Nội dung chia sẻ được kiểm trùng trước khi vào kho.',
  },
];

const STEPS = [
  { title: 'Nhập đề', body: 'Mô tả đề cần soạn, hoặc gửi ảnh và tệp đề có sẵn.' },
  { title: 'Nhận bản nháp', body: 'Câu hỏi, công thức, đáp án và barem hiện trên trang A4.' },
  {
    title: 'Sửa và xuất',
    body: 'Chỉnh chữ, đổi số liệu, rồi xuất Word hoặc in.',
  },
];

const FAQ = [
  {
    q: 'soandethi.com là gì?',
    a: 'Trình soạn đề thi cho giáo viên. Trợ lý AI soạn đề từ một lời mô tả, chỉnh số liệu trong bài, chép đề từ ảnh thành văn bản, và làm đáp án cùng barem.',
  },
  {
    q: 'Tôi có cần đăng nhập không?',
    a: 'Bạn cần đăng nhập để lưu đề vào tài khoản và đồng bộ trên mọi thiết bị. Trong bản clone này, đăng nhập chỉ lưu trạng thái trong trình duyệt của bạn.',
  },
  {
    q: 'Điểm tín dụng AI là gì?',
    a: 'Là số điểm dùng cho các lần trợ lý AI soạn, chỉnh hoặc giải đề. Mỗi tác vụ tiêu tốn một lượng điểm tuỳ độ dài đề và mức suy luận.',
  },
  {
    q: 'Làm sao để nhận thêm điểm?',
    a: 'Tạo tài khoản mới được tặng 20.000 điểm. Bạn có thể nhận thêm điểm qua nhiệm vụ và nạp điểm trong phần Nạp điểm.',
  },
  {
    q: 'AI đọc được những ảnh và tệp nào?',
    a: 'Ảnh chụp đề giấy (JPG, PNG) và các tệp Word, TXT, Markdown, JSON.',
  },
  {
    q: 'Tôi có xuất ra Word hoặc in được không?',
    a: 'Có. Trình soạn xuất Word để giữ đúng định dạng, và in trực tiếp theo khổ A4 với cùng vị trí ngắt trang.',
  },
  {
    q: 'Kết quả của AI có chính xác không?',
    a: 'Trợ lý AI có thể mắc sai sót, nên bạn hãy kiểm tra kỹ nội dung. Bạn luôn có thể nhờ AI sửa lại phần cụ thể thay vì soạn lại cả đề.',
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-(--page-max) px-(--gutter) pt-14 pb-12 sm:pt-20">
          <h1 className="font-display max-w-3xl text-4xl leading-[1.1] font-medium tracking-tight text-balance sm:text-[3.25rem]">
            Về soandethi.com
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-2">
            Trình soạn đề thi cho giáo viên: soạn trên trang A4, xuất Word hoặc in, làm đáp án và barem, chấm bài của
            cả lớp.
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
              </a>{' '}
              hoặc hỏi trong{' '}
              <a href={ZALO_GROUP_URL} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                nhóm Zalo
              </a>
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
