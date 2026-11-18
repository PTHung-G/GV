# Problem Definition: Giao diện thiếu nhất quán và quá nhiều chữ dẫn dắt

- **Slug**: ui-overhaul
- **Created**: 2026-11-05
- **Inputs used**: intake.md + câu trả lời của người dùng cho 7 câu hỏi làm rõ (2026-11-05)

## Problem Statement

Giao diện hiện tại là kết quả của nhiều vòng chỉnh lẻ nên mỗi màn có mật độ, sắc độ, bo góc và
lượng chữ hướng dẫn khác nhau: giáo viên làm việc liên tục giữa soạn đề và chấm bài phải đọc lại
lời dẫn ở từng màn và chịu những chỗ lệch nhau, trong khi màu sắc và giọng văn (tím-xám, câu hô
hào, nhãn hướng dẫn dày) không còn khớp với hình ảnh một công cụ làm việc nghiêm túc mà họ muốn.

## Affected Users & Stakeholders

- **Người dùng**: giáo viên soạn đề và chấm bài — bị ảnh hưởng trực tiếp: đọc nhiều chữ dẫn hơn
  mức cần, gặp chi tiết lệch nhau giữa các màn, và không có cảm giác "một sản phẩm" khi chuyển
  việc.
- **Người dùng phụ**: giáo viên quét bài bằng điện thoại tại lớp — thao tác một tay, ngoài sáng,
  nên mật độ và độ rõ trên màn nhỏ ảnh hưởng trực tiếp tới tốc độ.
- **Stakeholder**: chủ dự án — người quyết định hướng nhận diện và là người duyệt cuối.
- **Bên nhận kết quả gián tiếp**: học sinh — nhận đề in và phiếu trả lời; các bề mặt in này phải
  giữ nguyên chất lượng.

## Goals

- Một hệ thống hình thức duy nhất áp cho **toàn bộ** 15 màn: các màn đã đăng nhập, các trang công
  khai, trình soạn đề, và các màn quét/chấm trên điện thoại.
- Giảm chữ dẫn: bỏ câu hô hào, khẩu hiệu, lời mời gọi; giữ lại chỉ những câu cần để hiểu hoặc để
  tránh thao tác sai.
- Nhận diện sáng sủa, không tông tím, không lặp logo, không dùng hình thức "AI-generic".
- Mật độ theo kiểu công cụ chuyên dụng (dày vừa phải, quét mắt được), không rối mắt.
- Bo góc tiết chế, thống nhất — không bo tròn tràn lan.
- Có bộ token và thành phần dùng chung để lần thay đổi sau chỉ sửa một chỗ.
- Chạy đúng trên cả màn hình máy tính và điện thoại.
- Giữ nguyên trải nghiệm và chất lượng các bề mặt in: đề A4, phiếu trả lời, trang barem.

## Non-Goals

- Không đổi bố cục trình soạn đề: header công cụ ở trên, mục lục bên trái, chat AI bên phải.
- Không đổi chức năng nghiệp vụ, API, mô hình dữ liệu, hay luồng chấm điểm.
- Không thiết kế lại bộ nhận diện từ đầu (logo, tên miền, màu thương hiệu mới) — chỉ dọn cách
  dùng hiện có.
- Không thêm tính năng mới, không thêm màn hình mới.

## Success Metrics

- Số màu viết cứng ngoài token: **66 giá trị hex trong 43 tệp** → mục tiêu 0 ngoài token.
- Số bậc bo góc đang dùng: **5 bậc** (`md`, `lg`, `xl`, `2xl`, `full`, tổng 209 chỗ) → mục tiêu
  tối đa 3 bậc, có quy ước chỗ dùng.
- Lượng chữ dẫn và câu hô hào trên mỗi màn: chưa đo được (baseline: chưa có số) → mục tiêu: mỗi
  màn không còn khẩu hiệu, mỗi khối chỉ còn một dòng giải thích khi thật cần.
- Bộ kiểm thử hiện có: **90 test Playwright** → phải giữ xanh (trừ các test phụ thuộc nhà cung cấp
  AI, vốn đang đỏ vì khóa API hết hạn, không liên quan).
- Kiểm tra thủ công toàn bộ 15 màn ở hai bậc màn hình (máy tính ≥1280px và điện thoại ~390px):
  không tràn, không cắt chữ, không nút trùng.

## Cost of Inaction

Mỗi lần chỉnh giao diện phải sửa rải rác hàng chục tệp vì màu và bo góc nằm rải trong mã; các lỗi
lệch và trùng lặp sẽ tiếp tục tái diễn (vừa phải sửa một lỗi hai nút thu gọn đứng cạnh nhau). Giáo
viên tiếp tục đọc hướng dẫn thay vì làm việc, và ấn tượng về sản phẩm giữ ở mức "bản dựng thử"
thay vì công cụ dùng được hằng ngày.

## Open Questions

Đã chốt ngày 2026-11-05 (người dùng giao cho người thực hiện quyết định):

- **Trang công khai**: xoá hẳn khẩu hiệu và câu hô hào; mỗi trang còn một tiêu đề trung tính,
  phần mô tả chỉ giữ khi nó nói đúng điều người đọc cần biết để dùng sản phẩm.
- **Logo**: giữ đúng một chỗ — header trang công khai. Trình soạn đề chỉ còn tên đề và đường về.
- **Font**: bỏ font serif (Newsreader) cho tiêu đề; toàn hệ dùng một font không chân.
