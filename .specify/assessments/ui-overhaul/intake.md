# Idea Intake: Làm lại toàn bộ giao diện cho gọn gàng, chuyên nghiệp

- **Slug**: ui-overhaul
- **Created**: 2026-11-04
- **Source**: pasted text (yêu cầu của người dùng trong phiên làm việc hiện tại)
- **Type**: improvement

## Idea (as captured)

> tôi muốn sửa đổi, chuyên nghiệp, gọn gàng hóa lại toàn bộ giao diện

Không kèm URL, không kèm tệp đính kèm, không nêu màn hình cụ thể.

## Restated

Người dùng muốn rà soát và làm lại giao diện của toàn bộ ứng dụng theo hướng gọn gàng và
chuyên nghiệp hơn, thay vì tiếp tục chỉnh lẻ từng màn.

## Origin & Context

- **Raised by**: chủ dự án (người đang trực tiếp dùng và duyệt giao diện trong phiên này).
- **Trigger**: sau nhiều vòng chỉnh giao diện liên tiếp trong cùng phiên — dựng khung ba phần
  (rail điều hướng / nội dung / panel phải), đổi bảng màu sang tông tím-xám nhạt với xanh thương
  hiệu `#3358f4`, thay nút thu gọn bằng chevron `«` / `»`. Người dùng vừa phát hiện lỗi trùng nút
  thu gọn ở hai panel và yêu cầu sửa. Việc "làm lại toàn bộ" được nêu ngay sau đó, tức là các
  chỉnh lẻ đã tích tụ thành nhu cầu hệ thống hoá. `[NEEDS CLARIFICATION: điều gì cụ thể chưa đạt —
  mật độ thông tin, typography, khoảng cách, trạng thái nút, hay tính nhất quán giữa các màn?]`

### Hiện trạng kỹ thuật liên quan (đo được trong phiên này)

- Khung ba phần dùng chung: `components/shell/app-shell.tsx`, `sidebar.tsx`, `app-frame.tsx`.
  Áp cho `/hub`, `/my-exams`, `/grading`, `/grading/[id]`, `/grading/new`.
- Trình soạn `/doc/[id]` **giữ bố cục riêng** (header công cụ trên cùng, mục lục bên trái, chat AI
  bên phải) theo yêu cầu tường minh của người dùng; không nằm trong khung ba phần.
- Bảng màu tập trung ở `app/globals.css` (`@theme` + biến `--shell-*`), nhưng phần lớn màu vẫn
  được viết trực tiếp dưới dạng lớp Tailwind (`text-[#1c1b22]`, `bg-[#fbfaff]`…) rải trong
  ~40 tệp, chưa có component token dùng chung.
- 90 test Playwright (5 test riêng cho khung ba phần), `tsc` sạch, build sạch.
- Trang công khai `/`, `/exams`, `/about`, `/terms`, `/privacy` vẫn dùng header marketing riêng.

## First-Glance Unknowns

- [NEEDS CLARIFICATION: "toàn bộ giao diện" gồm những đâu — chỉ các màn đã đăng nhập trong khung
  ba phần, hay cả trang chủ/kho đề công khai, cả trình soạn đề, cả các màn quét bài trên điện
  thoại?]
- [NEEDS CLARIFICATION: "chuyên nghiệp" muốn đạt điều gì cụ thể — mật độ dày hơn kiểu công cụ
  chuyên dụng, hay thoáng hơn kiểu tài liệu; nghiêng về bảng biểu nhiều dữ liệu hay về thẻ lớn?]
- [NEEDS CLARIFICATION: có giữ tông tím-xám nhạt + xanh `#3358f4` hiện tại, hay đây là dịp đổi
  hẳn nhận diện?]
- [NEEDS CLARIFICATION: có chấp nhận thay đổi bố cục trình soạn đề không, hay tuyệt đối giữ nguyên
  như hiện tại?]
- [NEEDS CLARIFICATION: phạm vi thiết bị — chỉ máy tính, hay phải hoàn thiện cả điện thoại (màn
  quét bài đang được dùng thật trên điện thoại)?]
- [NEEDS CLARIFICATION: có cần chuẩn hoá thành bộ token/component dùng chung (để lần sau đổi một
  chỗ), hay chỉ cần kết quả nhìn gọn hơn?]
- [NEEDS CLARIFICATION: mốc hoàn thành — cần đạt tới đâu thì dừng, và có bắt buộc giữ nguyên 90
  test hiện có cùng các bề mặt in/PDF (đề A4, phiếu trả lời, barem) không?]

---

## Clarifications resolved (2026-11-05)

Người dùng trả lời 7 câu hỏi ở trên:

1. **Phạm vi** ("toàn bộ"): tất cả các màn — đã đăng nhập, công khai, trình soạn đề, và màn quét
   bài trên điện thoại.
2. **"Chuyên nghiệp"**: mật độ kiểu công cụ, không rối; tham chiếu cảm giác của Notion và giao
   diện iPhone; **không bo góc tròn nhiều**; **không nhiều chữ hướng dẫn**; không câu kêu gọi, không
   khẩu hiệu hô hào.
3. **Nhận diện**: sáng sủa; **không màu tím**; không lặp logo; không hình thức "AI slop".
4. **Trình soạn đề**: **giữ nguyên bố cục** (header công cụ trên, mục lục trái, chat AI phải).
5. **Thiết bị**: cả máy tính và điện thoại.
6. **Chuẩn hoá**: có — cần bộ token/thành phần dùng chung.
7. **Mốc dừng**: người dùng giao cho người thực hiện quyết định.
