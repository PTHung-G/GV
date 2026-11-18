export const BUSINESS = {
  name: 'Hộ kinh doanh Ngũ Thành An',
  registrationNo: '04020305266',
  issuedBy: 'Phòng Kinh tế UBND xã Tam Kỳ, tỉnh Nghệ An',
  issuedOn: '15/10/2026',
  taxCode: '04020305266',
  address: 'Số 1, đường Trường Sơn, xóm Trường Sơn, xã Tam Kỳ, tỉnh Nghệ An',
  owner: 'Ngũ Thành An',
};

export const SUPPORT_PHONE = '0858 562 678';
export const CONTACT_EMAIL = 'lienhe@soandethi.com';
export const SUPPORT_ZALO_URL = 'https://zalo.me/0858562678';
export const ZALO_GROUP_URL = 'https://zalo.me/g/soandethi';
export const TIKTOK_URL = 'https://www.tiktok.com/@soandethi.com';

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
      { href: SUPPORT_ZALO_URL, label: `Zalo ${SUPPORT_PHONE}`, external: true },
      { href: ZALO_GROUP_URL, label: 'Nhóm Zalo', external: true },
      { href: TIKTOK_URL, label: 'TikTok', external: true },
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
