# Feature Specification: Làm lại toàn bộ giao diện

**Feature Branch**: `001-ui-overhaul`

**Created**: 2026-11-05

**Status**: Draft

**Input**: User description: "tôi muốn sửa đổi, chuyên nghiệp, gọn gàng hóa lại toàn bộ giao diện"
(kèm 7 câu trả lời làm rõ: phạm vi toàn bộ; mật độ kiểu công cụ, không rối, tham chiếu Notion và
iPhone, ít bo góc, ít chữ hướng dẫn, không khẩu hiệu; sáng sủa, không tím, không lặp logo, không
"AI slop"; giữ nguyên bố cục trình soạn đề; cả máy tính và điện thoại; cần chuẩn hoá dùng chung)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Làm việc liền mạch giữa các màn (Priority: P1)

Giáo viên chuyển liên tục giữa soạn đề, thư viện đề, và chấm bài trong một buổi làm việc. Ở mỗi
màn họ gặp cùng một hệ thống hình thức: cùng kiểu thanh bên, cùng kiểu nút, cùng bậc bo góc, cùng
cách trình bày danh sách và bảng. Không phải học lại cách đọc từng màn.

**Why this priority**: Đây là lý do chính của việc làm lại — sự thiếu nhất quán là cái người dùng
cảm nhận rõ nhất và ảnh hưởng tới mọi màn.

**Independent Test**: Mở lần lượt các màn đã đăng nhập và kiểm rằng nút chính, nút phụ, hàng danh
sách, thẻ, và thanh bên có cùng hình thức ở mọi màn; không có màn nào dùng bậc bo góc hay sắc độ
khác.

**Acceptance Scenarios**:

1. **Given** giáo viên đang ở Sảnh tính năng, **When** mở Thư viện đề rồi mở Chấm bài, **Then**
   các nút cùng vai trò có cùng hình thức, các khối nội dung có cùng bậc bo góc và cùng khoảng cách.
2. **Given** một màn có thanh bên, **When** thu gọn rồi mở lại, **Then** mỗi cạnh chỉ có một nút
   điều khiển và trạng thái được giữ lại sau khi tải lại trang.

---

### User Story 2 - Đọc ít chữ hơn, hiểu nhanh hơn (Priority: P1)

Giáo viên mở một màn và chỉ thấy những chữ cần để làm việc: tên mục, nhãn nút, và tối đa một dòng
giải thích ở chỗ thật sự dễ nhầm. Không còn khẩu hiệu, câu kêu gọi, hay đoạn hướng dẫn dài.

**Why this priority**: Người dùng nêu rõ "không nhiều chữ hướng dẫn, không câu kêu gọi, không hô
hào"; chữ thừa là thứ làm giao diện trông thiếu chuyên nghiệp nhất.

**Independent Test**: Kiểm từng màn: không còn câu khẩu hiệu hay lời mời gọi; mỗi khối chỉ còn một
dòng giải thích khi cần; các nhãn nút là động từ ngắn.

**Acceptance Scenarios**:

1. **Given** trang chủ công khai, **When** mở trang, **Then** không còn khẩu hiệu hay câu hô hào;
   chỉ còn tên sản phẩm, một dòng nói sản phẩm làm được gì, và lối vào để dùng.
2. **Given** một màn có khối trống, **When** khối đó không có dữ liệu, **Then** nó hiện một câu
   ngắn nói cần làm gì, không phải một đoạn văn.

---

### User Story 3 - Dùng trên điện thoại tại lớp (Priority: P2)

Giáo viên đứng cạnh học sinh, một tay cầm điện thoại, ánh sáng ngoài trời. Màn quét bài và các
màn danh sách phải đọc được, nút bấm đủ lớn, không tràn ngang, không cắt chữ.

**Why this priority**: Màn quét là nơi giao diện được dùng thật ngoài đời, nhưng phạm vi nhỏ hơn
hai mục trên.

**Independent Test**: Mở toàn bộ các màn ở bề rộng điện thoại và kiểm không tràn ngang, không cắt
chữ, nút bấm không nhỏ hơn ngưỡng chạm.

**Acceptance Scenarios**:

1. **Given** điện thoại bề rộng 390px, **When** mở màn quét bài, **Then** nút chụp và các điều
   khiển nằm trong tầm ngón tay, không cần cuộn ngang.
2. **Given** điện thoại, **When** mở thanh bên, **Then** nó trượt vào dưới dạng ngăn kéo và đóng
   được bằng nút rõ ràng.

---

### User Story 4 - Nhận diện sáng, trung tính, không trang trí thừa (Priority: P2)

Giáo viên nhìn sản phẩm như một công cụ làm việc: nền sáng, chữ đậm rõ, một màu nhấn duy nhất cho
hành động chính, logo xuất hiện đúng một chỗ.

**Why this priority**: Đây là điều kiện để giao diện "trông chuyên nghiệp", nhưng phụ thuộc vào
việc hoàn thành ba mục trên.

**Independent Test**: Kiểm rằng không còn sắc tím ở bất kỳ bề mặt nào; logo chỉ xuất hiện ở header
trang công khai; mỗi màn chỉ một màu nhấn cho hành động chính.

**Acceptance Scenarios**:

1. **Given** bất kỳ màn nào, **When** xem tổng thể, **Then** không có sắc tím; nền sáng; chữ đủ
   tương phản để đọc ngoài trời.
2. **Given** trình soạn đề, **When** mở, **Then** không có logo lặp; chỉ có tên đề và đường quay về.

---

### Edge Cases

- Tiêu đề đề thi rất dài: cắt bằng dấu ba chấm, không đẩy vỡ bố cục header.
- Danh sách rỗng, danh sách rất dài (hàng trăm dòng): vẫn cuộn được, không giật.
- Màn hình rất hẹp (320px) và rất rộng (2560px): nội dung không kéo giãn quá mức đọc.
- Trạng thái lỗi và đang tải: dùng cùng một kiểu hiển thị ở mọi màn.
- Bề mặt in (đề A4, phiếu trả lời, trang barem): phải giữ nguyên hình thức in.
- Trình duyệt tắt JavaScript: các trang công khai vẫn đọc được nội dung.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Toàn bộ màn hình dùng chung một bộ giá trị màu, bo góc, khoảng cách; không bề mặt nào
  dùng màu hay bo góc nằm ngoài bộ đó.
- **FR-002**: Số bậc bo góc tối đa là ba, mỗi bậc có quy ước nơi dùng.
- **FR-003**: Mọi màn hình dùng chung một bộ thành phần (nút, ô nhập, hộp thoại, menu, thẻ, hàng
  danh sách) thay vì mỗi màn tự vẽ.
- **FR-004**: Hệ màu không chứa sắc tím; nền sáng; chỉ một màu nhấn cho hành động chính và liên kết.
- **FR-005**: Toàn hệ dùng một font không chân; bỏ font serif ở tiêu đề.
- **FR-006**: Trang công khai không còn khẩu hiệu, câu hô hào, hay lời mời gọi; mỗi trang còn một
  tiêu đề trung tính và chỉ giữ phần mô tả cần thiết để dùng sản phẩm.
- **FR-007**: Logo chỉ xuất hiện ở header của trang công khai.
- **FR-008**: Bố cục trình soạn đề giữ nguyên: header công cụ ở trên, mục lục bên trái, chat AI bên
  phải; chỉ thay hình thức, không đổi vị trí hay chức năng.
- **FR-009**: Mỗi cạnh của khung làm việc chỉ có một nút điều khiển thu gọn; khi panel đóng thì
  không còn phần tử nào bên trong nhận được tiêu điểm bàn phím.
- **FR-010**: Mọi màn hình dùng được ở cả hai bậc bề rộng: máy tính (≥1280px) và điện thoại
  (~390px), không tràn ngang, không cắt chữ.
- **FR-011**: Mọi trạng thái tương tác (thường, rê chuột, tiêu điểm bàn phím, đang bấm, vô hiệu)
  phải phân biệt được bằng mắt.
- **FR-012**: Các bề mặt in (đề A4, phiếu trả lời, trang barem) không thay đổi về kích thước, lề,
  hay cách ngắt trang.
- **FR-013**: Chức năng và luồng nghiệp vụ không đổi: tạo đề, soạn, tạo đáp án, tạo đợt chấm, quét
  bài, duyệt điểm, xuất CSV.

### Key Entities

- **Hệ hình thức dùng chung**: bộ giá trị màu, chữ, bo góc, khoảng cách, độ đậm, đổ bóng — nguồn
  duy nhất cho mọi bề mặt.
- **Thành phần giao diện**: nút, ô nhập, hộp thoại, menu, thẻ, hàng danh sách, nhãn trạng thái.
- **Màn hình**: 15 trang thuộc bốn nhóm — đã đăng nhập, công khai, trình soạn đề, và quét/chấm trên
  điện thoại.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% bề mặt dùng chung bộ màu đã định nghĩa; số giá trị màu nằm ngoài bộ đó giảm từ
  66 xuống 0.
- **SC-002**: Số bậc bo góc giảm từ 5 xuống tối đa 3.
- **SC-003**: Cả 15 màn hình được kiểm ở hai bậc bề rộng (≥1280px và ~390px) với 0 trường hợp tràn
  ngang hoặc cắt chữ.
- **SC-004**: Trang công khai còn 0 câu khẩu hiệu hoặc hô hào.
- **SC-005**: Logo xuất hiện đúng 1 chỗ trên toàn ứng dụng.
- **SC-006**: Toàn bộ 90 kiểm thử hiện có vẫn chạy đúng (trừ các kiểm thử phụ thuộc dịch vụ AI bên
  ngoài, vốn hỏng vì khóa API hết hạn, không liên quan tới giao diện).
- **SC-007**: Kết quả in (đề A4, phiếu trả lời, trang barem) giữ nguyên số trang và bố cục so với
  trước khi làm lại.

## Assumptions

- Người dùng chính là giáo viên đã đăng nhập, dùng trên trình duyệt hiện đại; không cần hỗ trợ
  trình duyệt cũ.
- Chỉ có một chế độ sáng; không làm chế độ tối trong phạm vi này.
- Nội dung tiếng Việt; thuật ngữ chuyên môn giữ nguyên, không dịch máy.
- Bề mặt in dùng chung hệ màu với màn hình nhưng phải giữ đúng kích thước và ngắt trang.
- Các chức năng và dữ liệu hiện có được giữ nguyên; đây là việc thay hình thức, không phải viết lại
  nghiệp vụ.
