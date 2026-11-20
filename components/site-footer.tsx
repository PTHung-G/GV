import Link from 'next/link';
import { APP_NAME, BUSINESS, CONTACT_EMAIL, FOOTER_GROUPS, SUPPORT_PHONE, SUPPORT_ZALO_URL } from '@/lib/site';

const linkClass = 'text-[15px] text-ink-3 transition-colors hover:text-ink';

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="mx-auto grid w-full max-w-(--page-max) gap-10 px-(--gutter) py-14 sm:grid-cols-2 md:grid-cols-4 md:py-16 lg:grid-cols-[1fr_auto_auto_auto_auto] lg:gap-x-12 xl:gap-x-20">
        <div className="sm:col-span-2 md:col-span-4 lg:col-span-1">
          {/* The mark lives in the header only; the footer carries the name in text. */}
          <p className="text-[15px] font-semibold tracking-tight text-ink">{APP_NAME}</p>
          <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-ink-3">
            Nền tảng soạn đề thi AI, quản lý ngân hàng câu hỏi, trộn mã đề & chấm bài OMR cho giáo viên Việt Nam.
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
          <p className="font-semibold text-ink-2">Đơn vị vận hành: {BUSINESS.name}</p>
          {BUSINESS.registrationNo ? (
            <p>
              Giấy chứng nhận đăng ký số {BUSINESS.registrationNo}
              {BUSINESS.issuedBy ? ` do ${BUSINESS.issuedBy} cấp` : ''}
              {BUSINESS.issuedOn ? ` ngày ${BUSINESS.issuedOn}` : ''}.
              {BUSINESS.taxCode ? ` Mã số thuế: ${BUSINESS.taxCode}.` : ''}
            </p>
          ) : null}
          <p>
            {BUSINESS.address ? `Khu vực hoạt động: ${BUSINESS.address}. ` : ''}
            {BUSINESS.owner ? `Đại diện: ${BUSINESS.owner}. ` : ''}
            {SUPPORT_PHONE ? `Điện thoại: ${SUPPORT_PHONE}. ` : ''}
            Email:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-(--page-max) flex-wrap items-center justify-between gap-2 px-(--gutter) py-4 text-[13px] text-ink-3">
          <p>© 2026 {APP_NAME}. Mọi quyền được bảo lưu.</p>
          <p>
            {SUPPORT_ZALO_URL ? (
              <a href={SUPPORT_ZALO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                Liên hệ hỗ trợ
              </a>
            ) : (
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">
                Liên hệ hỗ trợ
              </a>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
