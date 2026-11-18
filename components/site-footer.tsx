import Link from 'next/link';
import { BUSINESS, CONTACT_EMAIL, FOOTER_GROUPS, SUPPORT_PHONE, SUPPORT_ZALO_URL } from '@/lib/site';

const linkClass = 'text-[15px] text-ink-3 transition-colors hover:text-ink';

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="mx-auto grid w-full max-w-(--page-max) gap-10 px-(--gutter) py-14 sm:grid-cols-2 md:grid-cols-4 md:py-16 lg:grid-cols-[1fr_auto_auto_auto_auto] lg:gap-x-12 xl:gap-x-20">
        <div className="sm:col-span-2 md:col-span-4 lg:col-span-1">
          {/* The mark lives in the header only; the footer carries the name in text. */}
          <p className="text-[15px] font-semibold tracking-tight text-ink">
            soandethi<span className="text-ink-4">.com</span>
          </p>
          <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-ink-3">
            Trình soạn đề thi cho giáo viên: soạn trên trang A4, xuất Word hoặc in, làm đáp án và barem.
          </p>
        </div>
        {FOOTER_GROUPS.map((group) => (
          <nav aria-label={group.title} key={group.title}>
            <h2 className="text-sm font-semibold text-ink">{group.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) =>
                'external' in link && link.external ? (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={linkClass}
                      {...(link.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto w-full max-w-(--page-max) space-y-1 px-(--gutter) py-5 text-[13px] leading-relaxed text-ink-3">
          <p className="font-semibold text-ink-2">Đơn vị chủ quản: {BUSINESS.name}</p>
          <p>
            Giấy chứng nhận đăng ký hộ kinh doanh số {BUSINESS.registrationNo} do {BUSINESS.issuedBy} cấp ngày{' '}
            {BUSINESS.issuedOn}. Mã số thuế: {BUSINESS.taxCode}.
          </p>
          <p>
            Địa chỉ: {BUSINESS.address}. Chủ hộ kinh doanh: {BUSINESS.owner}. Điện thoại: {SUPPORT_PHONE}. Email:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-(--page-max) flex-wrap items-center justify-between gap-2 px-(--gutter) py-4 text-[13px] text-ink-3">
          <p>© 2026 soandethi.com. Mọi quyền được bảo lưu.</p>
          <p>
            <a href={SUPPORT_ZALO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              Liên hệ hỗ trợ
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
