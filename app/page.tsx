import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Check, FileText, ScanLine } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductWindow } from '@/components/home/product-window';
import { StartActions } from '@/components/home/start-actions';

export const metadata: Metadata = {
  title: 'Soạn đề, đáp án và chấm bài · Soạn đề thi',
  description: 'Tạo và chỉnh sửa đề trên trang A4, chuẩn bị đáp án và barem, chấm bài từ ảnh và tổng hợp điểm cho cả lớp.',
};
const steps = [
  ['01', 'Tạo hoặc mở đề', 'Mô tả nội dung cần kiểm tra, nhập từ ảnh hoặc tiếp tục một đề đã lưu. Bạn luôn có thể sửa lại bản nháp.'],
  ['02', 'Kiểm tra đề và barem', 'Chỉnh nội dung trên trang A4. Kiểm tra đáp án và barem ở trang riêng trước khi in hoặc tạo đợt chấm.'],
  ['03', 'Chụp bài và duyệt điểm', 'Chụp bài bằng điện thoại, kiểm tra kết quả theo từng câu và duyệt điểm trước khi xuất bảng điểm.'],
];
const faq = [
  ['Có cần cài ứng dụng không?', 'Không. Bạn sử dụng trên trình duyệt máy tính để soạn đề và quản lý điểm; mở trình duyệt điện thoại để chụp bài.'],
  ['Tôi có thể sửa đề và đáp án không?', 'Có. Đề và đáp án nằm ở các trang riêng trong trình soạn. Hãy rà soát nội dung, đáp án và từng mức điểm trước khi sử dụng.'],
  ['AI có tự quyết định điểm cuối cùng không?', 'Không. Giáo viên kiểm tra bài cần xem lại, điều chỉnh điểm khi cần và xác nhận kết quả. Công cụ hỗ trợ xử lý, không thay thế quyết định của giáo viên.'],
  ['Sửa đề sau này có làm thay đổi đợt đã chấm không?', 'Không. Khi tạo đợt chấm, đề, đáp án và barem được lưu thành bản riêng để giữ nguyên cơ sở chấm của đợt đó.'],
];

export default function HomePage() {
  return <>
    <SiteHeader />
    <main className="flex-1 bg-surface-2 text-ink">
      <section aria-labelledby="hero-title" className="mx-auto max-w-[1280px] px-5 pt-12 pb-10 sm:px-8 sm:pt-20 lg:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.12em] uppercase"><span className="h-px w-8 bg-accent" />Công cụ soạn đề và chấm bài</p>
            <h1 id="hero-title" className="mt-6 max-w-[620px] text-[43px] leading-[1.08] font-semibold tracking-[-0.045em] text-balance sm:text-[60px] lg:text-[66px]">Soạn đề, chuẩn bị đáp án,<br /><span className="font-serif font-normal italic text-accent">chấm bài</span> và tổng hợp điểm.</h1>
            <p className="mt-6 max-w-[440px] text-base leading-7 text-ink-2">Tạo và chỉnh sửa đề trên trang A4, tách riêng đáp án và barem, chấm bài từ ảnh rồi xuất bảng điểm cho cả lớp.</p>
            <div className="mt-8"><StartActions /></div>
            <a href="#quy-trinh" className="mt-6 inline-flex items-center gap-2 text-sm text-ink-2 underline-offset-4 hover:underline">Xem các bước sử dụng <ArrowDown className="size-3.5" aria-hidden /></a>
          </div>
          <div className="relative min-w-0 border border-line bg-surface-3 p-3 pb-5 sm:p-6 sm:pb-7">
            <div className="mb-5 flex items-center justify-between gap-3 text-[10px] font-medium tracking-[0.13em] text-ink-2 uppercase"><span>Trình soạn đề · Trang A4</span><span aria-hidden>01 — 03</span></div>
            <ProductWindow />
            <div className="mt-5 flex items-center gap-2 text-xs text-ink-2"><Check className="size-4" aria-hidden /> Đề và đáp án được lưu ở trang riêng.</div>
            <p className="mt-2 text-[10px] text-ink-2">Minh họa giao diện trình soạn đề</p>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-line pt-6 text-xs font-medium text-ink-2 sm:grid-cols-4 sm:text-sm">
          {['Soạn trên trang A4', 'Đáp án & barem riêng', 'Chụp bài bằng điện thoại', 'Duyệt rồi xuất bảng điểm'].map(text => <p key={text} className="flex items-center gap-2"><Check className="size-3.5 shrink-0 text-accent" aria-hidden />{text}</p>)}
        </div>
      </section>

      <section id="quy-trinh" aria-labelledby="flow-title" className="scroll-mt-20 border-y border-line bg-white">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-semibold tracking-widest text-accent uppercase">Các bước sử dụng</p><h2 id="flow-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Soạn đề, kiểm tra đáp án<br className="hidden sm:block" /> và duyệt kết quả chấm.</h2></div><p className="max-w-xs text-sm leading-6 text-ink-2">Giáo viên kiểm tra nội dung đề, thang điểm và kết quả trước khi sử dụng.</p></div>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">{steps.map(([number, title, body]) => <li key={number} className="border-t border-line pt-5"><span className="font-serif text-5xl text-ink-4">{number}</span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-3 max-w-sm text-sm leading-7 text-ink-2">{body}</p></li>)}</ol>
        </div>
      </section>

      <section aria-labelledby="tools-title" className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-xs font-semibold tracking-widest text-accent uppercase">Tính năng chính</p>
        <h2 id="tools-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Soạn đề và chấm bài</h2>
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          <article className="border border-line bg-surface-3 p-6 sm:p-9"><FileText className="size-6 text-ok" strokeWidth={1.5} aria-hidden /><p className="mt-7 text-xs font-medium text-ink-2">TRƯỚC GIỜ KIỂM TRA</p><h3 className="mt-2 text-2xl font-semibold tracking-tight">Chỉnh sửa đề và đáp án<br />trên trang A4.</h3><p className="mt-4 max-w-md text-sm leading-7 text-ink-2">Sửa câu hỏi, số liệu và công thức; xem bố cục trang trước khi in. Đáp án và barem được trình bày riêng với đề.</p><Link href="/my-exams" className="mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-semibold">Mở kho đề của tôi <ArrowUpRight className="size-4" aria-hidden /></Link></article>
          <article className="border border-line bg-surface-3 p-6 sm:p-9"><ScanLine className="size-6 text-accent" strokeWidth={1.5} aria-hidden /><p className="mt-7 text-xs font-medium text-ink-2">SAU GIỜ KIỂM TRA</p><h3 className="mt-2 text-2xl font-semibold tracking-tight">Chấm bài từ ảnh,<br />xem và điều chỉnh điểm.</h3><p className="mt-4 max-w-md text-sm leading-7 text-ink-2">Nhận ảnh bài làm, đối chiếu đáp án và xem lại các ý chấm. Bạn duyệt kết quả cuối cùng, rồi xuất bảng điểm cho cả lớp.</p><Link href="/grading" className="mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-semibold">Mở danh sách đợt chấm <ArrowUpRight className="size-4" aria-hidden /></Link></article>
        </div>
      </section>

      <section aria-labelledby="review-title" className="bg-ink text-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-20">
          <div><p className="text-xs font-medium tracking-widest text-surface/80 uppercase">Duyệt kết quả chấm</p><h2 id="review-title" className="mt-4 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">Xem điểm từng phần<br />trước khi chốt đợt chấm.</h2><p className="mt-5 max-w-md text-sm leading-7 text-surface/80">Xem riêng trắc nghiệm và tự luận, rà soát bài cần duyệt trước khi chốt. Đề và barem được giữ theo từng đợt, không thay đổi khi bạn sửa đề gốc.</p></div>
          <div className="min-w-0 border border-white/20 bg-white p-4 text-ink sm:p-6"><div className="mb-5 flex items-center justify-between gap-2"><span className="text-sm font-semibold">Bảng điểm · Lớp 9A</span><span className="text-[10px] text-ink-2">Dữ liệu minh họa</span></div><table className="w-full text-left text-xs sm:text-sm"><caption className="sr-only">Ví dụ điểm số, không phải dữ liệu học sinh thực tế</caption><thead><tr className="border-y border-line text-[11px] text-ink-2"><th className="py-3 font-medium">Mã bài</th><th className="py-3 text-right font-medium">TN</th><th className="py-3 text-right font-medium">TL</th><th className="py-3 text-right font-medium">Tổng</th></tr></thead><tbody>{[['9A-01','3,0','6,5','9,5'],['9A-02','2,5','5,0','7,5'],['9A-03','3,0','7,0','10,0']].map(row => <tr key={row[0]} className="border-b border-line">{row.map((cell,i) => <td key={i} className={`py-4 tabular-nums ${i ? 'text-right' : ''} ${i===3 ? 'font-semibold' : ''}`}>{cell}</td>)}</tr>)}</tbody></table><p className="mt-4 flex items-center gap-2 text-xs text-ok"><Check className="size-3.5" aria-hidden /> Kết quả cuối cùng do giáo viên xác nhận.</p></div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="mx-auto grid max-w-[1280px] gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.7fr_1fr] lg:gap-20"><div><p className="text-xs font-semibold tracking-widest text-accent uppercase">Câu hỏi thường gặp</p><h2 id="faq-title" className="mt-3 text-3xl font-semibold tracking-tight">Thông tin sử dụng</h2></div><div>{faq.map(([question, answer]) => <details key={question} className="group border-b border-line py-5 first:border-t"><summary className="cursor-pointer text-sm leading-6 font-semibold marker:text-accent">{question}</summary><p className="mt-3 pl-4 text-sm leading-7 text-ink-2">{answer}</p></details>)}</div></section>
      <section className="border-t border-line"><div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-7 px-5 py-12 sm:px-8"><div><p className="text-2xl font-semibold tracking-tight">Đăng nhập để soạn đề và quản lý bài chấm.</p><p className="mt-2 text-sm text-ink-2">Hoặc xem đề mẫu trước khi sử dụng.</p></div><StartActions /></div></section>
    </main>
    <SiteFooter />
  </>;
}
