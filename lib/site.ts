export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME?.trim() || 'Hỗ trợ giáo viên';
export const APP_TAGLINE =
  process.env.NEXT_PUBLIC_APP_TAGLINE?.trim() || 'Soạn đề thi AI, ngân hàng câu hỏi & chấm phiếu OMR';
export const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN?.trim() || 'hotrogiaovien.vn';

export const BUSINESS = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME?.trim() || 'Nền tảng Hỗ trợ giáo viên',
  registrationNo: process.env.NEXT_PUBLIC_BUSINESS_REG?.trim() || '',
  issuedBy: process.env.NEXT_PUBLIC_BUSINESS_ISSUED_BY?.trim() || '',
  issuedOn: process.env.NEXT_PUBLIC_BUSINESS_ISSUED_ON?.trim() || '',
  taxCode: process.env.NEXT_PUBLIC_BUSINESS_TAX_CODE?.trim() || '',
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS?.trim() || 'Việt Nam',
  owner: process.env.NEXT_PUBLIC_BUSINESS_OWNER?.trim() || '',
};

export const SUPPORT_PHONE = process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim() || '';
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || 'lienhe@hotrogiaovien.vn';
export const SUPPORT_ZALO_URL = process.env.NEXT_PUBLIC_SUPPORT_ZALO_URL?.trim() || '';
export const ZALO_GROUP_URL = process.env.NEXT_PUBLIC_ZALO_GROUP_URL?.trim() || '';
export const TIKTOK_URL = process.env.NEXT_PUBLIC_TIKTOK_URL?.trim() || '';

export const NAV_LINKS = [
  { href: '/hub', label: 'Sảnh tính năng' },
  { href: '/my-exams', label: 'Soạn đề thi' },
  { href: '/grading', label: 'Chấm bài thi' },
  { href: '/exams', label: 'Đề thi cộng đồng' },
] as const;

export const FOOTER_GROUPS = [
  {
    title: 'Khám phá',
    links: [
      { href: '/', label: 'Trang chủ' },
      { href: '/hub', label: 'Sảnh tính năng' },
      { href: '/my-exams', label: 'Soạn đề thi' },
      { href: '/grading', label: 'Chấm bài thi' },
      { href: '/exams', label: 'Đề thi cộng đồng' },
    ],
  },
  {
    title: 'Giới thiệu',
    links: [
      { href: '/about', label: 'Về chúng tôi' },
      { href: '/about#faq', label: 'Câu hỏi thường gặp' },
    ],
  },
  {
    title: 'Chính sách',
    links: [
      { href: '/terms', label: 'Điều khoản sử dụng' },
      { href: '/privacy', label: 'Chính sách bảo mật' },
      { href: '/terms#gia', label: 'Giá và thanh toán' },
      { href: '/terms#hoan-tien', label: 'Chấm dứt dịch vụ, hoàn tiền' },
      { href: '/terms#khieu-nai', label: 'Giải quyết khiếu nại' },
    ],
  },
  {
    title: 'Liên hệ',
    links: [
      { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL, external: true },
      ...(SUPPORT_ZALO_URL
        ? [{ href: SUPPORT_ZALO_URL, label: SUPPORT_PHONE ? `Zalo ${SUPPORT_PHONE}` : 'Hỗ trợ Zalo', external: true }]
        : []),
      ...(ZALO_GROUP_URL ? [{ href: ZALO_GROUP_URL, label: 'Nhóm Zalo', external: true }] : []),
      ...(TIKTOK_URL ? [{ href: TIKTOK_URL, label: 'TikTok', external: true }] : []),
    ],
  },
];

export const SUBJECTS = [
  { id: 'toan', label: 'Toán' },
  { id: 'ngu-van', label: 'Ngữ văn' },
  { id: 'tieng-viet', label: 'Tiếng Việt' },
  { id: 'tieng-anh', label: 'Tiếng Anh' },
  { id: 'vat-li', label: 'Vật lí' },
  { id: 'hoa-hoc', label: 'Hoá học' },
  { id: 'sinh-hoc', label: 'Sinh học' },
  { id: 'khtn', label: 'Khoa học tự nhiên' },
  { id: 'lich-su', label: 'Lịch sử' },
  { id: 'dia-li', label: 'Địa lí' },
  { id: 'lich-su-dia-li', label: 'Lịch sử và Địa lí' },
  { id: 'gdcd', label: 'Giáo dục công dân' },
  { id: 'gdktpl', label: 'Giáo dục kinh tế và pháp luật' },
  { id: 'tin-hoc', label: 'Tin học' },
  { id: 'cong-nghe', label: 'Công nghệ' },
  { id: 'khac', label: 'Môn khác' },
] as const;

export const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

export function subjectLabel(id: string) {
  return SUBJECTS.find((s) => s.id === id)?.label ?? 'Môn khác';
}
