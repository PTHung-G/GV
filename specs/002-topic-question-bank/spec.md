# Feature Specification: Kho câu hỏi riêng tự tổ chức

**Feature Branch**: existing branch; no branch hook configured
**Created**: 2026-11-13
**Status**: Ready for planning
**Input**: User-chosen B and autonomous delivery authorization; [assessment handoff](../../.specify/assessments/topic-question-bank/decision.md).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Chốt và giữ nguyên nội dung (Priority: P1)

Giáo viên chốt đề, xem các câu/ngữ cảnh được nhận diện, chọn nội dung giữ và xác nhận. Thiếu đáp án/barem/điểm vẫn giữ; bản nguồn không phụ thuộc tổ chức AI thành công.

**Why this priority**: toàn vẹn và quyền quyết định là nền tảng.
**Independent Test**: giữ đề tổng hợp có đoạn chung/hình/công thức/ý phụ rồi tải lại đối chiếu.
**Acceptance Scenarios**:
1. **Given** đề thiếu đáp án/barem/điểm, **When** xác nhận giữ, **Then** vẫn lưu và không bịa phần thiếu.
2. **Given** hai câu dùng chung đoạn và một câu có hình/caption/ý a/b, **When** chọn giữ một câu, **Then** nội dung/ngữ cảnh đủ và nguyên văn, không bị AI viết lại.
3. **Given** phân tách không chắc hoặc AI lỗi, **When** chốt nguồn, **Then** nguồn được giữ và báo chưa hoàn tất, không tạo câu hỏng như đã xong.
4. **Given** nội dung đã giữ, **When** sửa đề, **Then** bản giữ cũ không đổi; xác nhận mới giữ phiên bản mới và còn bản cũ.
5. **Given** gửi lại cùng thao tác do mạng/nhấn lặp, **When** xử lý, **Then** không nhân bản nguồn/câu của thao tác đó.

### User Story 2 - Duyệt cây tự phát triển (Priority: P2)

Giáo viên chọn nhánh, tìm câu theo nội dung/nguồn và xem ngữ cảnh, không quản trị taxonomy.

**Why this priority**: giúp tìm lại thay vì tăng công phân loại.
**Independent Test**: nhập hai đợt đa lĩnh vực rồi tìm lại từng câu.
**Acceptance Scenarios**:
1. **Given** kho trống, **When** giữ câu đa lĩnh vực, **Then** cây hình thành không theo danh sách môn cố định, một gốc/một cha/không cycle.
2. **Given** cây/câu cũ, **When** thêm câu liên quan, **Then** AI xem ngữ cảnh hiện có, dùng/mở nhánh và có thể chuyển câu cũ liên quan, không mất/trùng câu.
3. **Given** câu tổng hợp/mơ hồ, **When** tổ chức, **Then** giữ một vị trí ở cha/gốc, không giao ngoại lệ cho giáo viên.
4. **Given** AI chưa xong, **When** mở kho, **Then** tìm được nguồn đã giữ/trạng thái và tiếp tục soạn bình thường.

### User Story 3 - Riêng tư và trạng thái đáng tin (Priority: P1)

Giáo viên chỉ thấy kho mình; biết AI lỗi/chưa hoàn tất và thử lại được mà không phân loại thủ công.

**Why this priority**: không đánh đổi riêng tư/lưu bền lấy AI.
**Independent Test**: hai tài khoản, đăng xuất, lỗi AI, tải lại và khởi động lại dịch vụ.
**Acceptance Scenarios**:
1. **Given** tài khoản A/B, **When** B truy cập nguồn/câu/cây/trạng thái hoặc mutation của A, **Then** bị từ chối và không lộ dữ liệu.
2. **Given** AI trả cycle/ID lạ/thiếu câu hoặc timeout, **When** xử lý, **Then** không áp dụng kết quả sai, nguồn còn và báo lỗi có thể thử lại.
3. **Given** cập nhật đồng thời, **When** áp dụng tổ chức, **Then** snapshot cũ không ghi đè dữ liệu mới.
4. **Given** reload/restart sau xác nhận, **When** mở kho, **Then** nguồn còn, việc dang dở phục hồi được, không báo thành công giả.

### Edge Cases

- Nhiều đoạn/bảng/danh sách/formula/figure và phụ thuộc trước/sau câu: không chắc thì giữ nguồn, báo chưa hoàn tất, không cắt âm thầm.
- Đề rỗng/không câu nhận diện được/quá lớn: báo rõ giới hạn, không âm thầm truncate.
- Nguồn đổi khi đang duyệt: xác nhận đúng snapshot được xem; đề bị xóa không làm mất bản đã giữ.
- Barem tài liệu kèm: giữ khi có liên kết nguồn đáng tin; không suy đoán đáp án.
- Script/event handler/liên kết nguy hiểm/prompt injection trong đề: không thực thi hoặc tin làm hướng dẫn hệ thống.
- Cây quá sâu/trùng tên/quota/thiếu khóa/request hủy: trạng thái thật, xử lý giới hạn và không bắt giáo viên sửa taxonomy.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Chốt/xem trước/chọn/xác nhận là chủ đích; không tự thu gom draft/chat.
- **FR-002**: Giữ snapshot bất biến gồm nguồn gốc/phiên bản/thời gian/chủ sở hữu; sửa đề không thay bản giữ.
- **FR-003**: Cho chọn nội dung giữ, nguyên thân/ngữ cảnh/hình/caption/formula/ý phụ và đáp án/barem có sẵn; không dùng AI viết lại thay nguồn.
- **FR-004**: Thiếu đáp án/barem/điểm hợp lệ, không tự tạo.
- **FR-005**: Không hoàn tất phân tách nếu thiếu độ phủ/phụ thuộc; giữ nguồn và báo chưa hoàn tất để thử lại, không bắt sửa taxonomy.
- **FR-006**: Mọi nguồn/câu/cây/trạng thái/đọc/ghi riêng theo tài khoản đã xác thực; không tin owner từ trình duyệt.
- **FR-007**: Đúng một gốc, một cha mỗi nhánh khác gốc, không cycle/cross-link; mỗi câu một vị trí kể cả cha/gốc.
- **FR-008**: AI dùng cây và câu liên quan hiện có khi thêm; được mở nhánh/chuyển câu cũ trong giới hạn, không tạo cây độc lập bỏ câu cũ.
- **FR-009**: Không quản trị taxonomy bắt buộc; không danh sách môn/lớp làm điều kiện đầu vào.
- **FR-010**: Duyệt cây/tìm nội dung và nguồn/xem ngữ cảnh; nhánh bao gồm câu tại chính nó và hậu duệ.
- **FR-011**: Giữ nguồn không phụ thuộc AI; trạng thái pending/failed/completed rõ; retry không nhân bản.
- **FR-012**: Công khai khi chạm giới hạn kích thước/thời gian/lần xử lý; không xử lý lại toàn kho vô hạn hoặc khóa editor.
- **FR-013**: Không áp dụng kết quả AI sai hoặc snapshot stale; việc dang dở phục hồi được.
- **FR-014**: Nội dung không an toàn không được thực thi; chỉ dẫn trong đề không đổi quyền/ràng buộc hệ thống.
- **FR-015**: Tích hợp luồng soạn/kho đề hiện có, tiếng Việt sáng/gọn/không tím/không slogan, chạy tại đường dẫn deploy hiện tại.
- **FR-016**: Không đổi câu/tìm tương đương/sinh barem/cộng đồng/OCR/audio/video hoặc taxonomy thủ công.

### Key Entities

- **Nguồn đã chốt**: snapshot bất biến, owner, đề gốc/phiên bản/lần xác nhận và trạng thái.
- **Câu giữ**: nội dung/ngữ cảnh từ nguồn, dữ liệu đáp án nếu có, nguồn gốc/vị trí duy nhất.
- **Topic**: nhãn kiến thức riêng tài khoản, cha duy nhất.
- **Lần xử lý**: trạng thái/lỗi/lần thử/phiên bản đầu vào, không phải công việc taxonomy người dùng.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Bộ nghiệm thu ít nhất 10 câu đa lĩnh vực có đoạn chung/hình/ý phụ/formula: 100% câu chọn giữ đọc lại nguyên vẹn sau tải lại, không phát sinh metadata thiếu.
- **SC-002**: Ít nhất hai đợt nhập: 100% câu có một vị trí tìm lại được, zero cycle/cha mất/gán trùng; kiểm thử ca chuyển câu cũ.
- **SC-003**: Giữ–duyệt–tìm lại với zero thao tác quản trị taxonomy/bổ sung barem bắt buộc.
- **SC-004**: 100% kiểm thử chéo tài khoản/không đăng nhập bị từ chối, không lộ/sửa dữ liệu.
- **SC-005**: Lỗi AI/timeout/invalid/restart: 100% nguồn đã xác nhận còn, không báo hoàn tất giả, retry không nhân bản cùng thao tác.
- **SC-006**: Sửa đề không thay bất kỳ bản giữ cũ, xác nhận mới còn cả hai phiên bản để đối chiếu.
- **SC-007**: Với kho nghiệm thu 200 câu, tìm/duyệt nội dung đã giữ trong 2 giây ở môi trường test; mục tiêu cục bộ, không SLA hoặc độ trễ AI.

## Assumptions

- Nguồn đầu tiên là đề trong ứng dụng và barem đi kèm đã lưu; không nhận mọi định dạng, không giới hạn lĩnh vực.
- Dùng xác thực hiện có; chỉ test tổng hợp, không dùng đề thật/bí mật.
- Hiển thị nguồn qua rào chắn an toàn, giữ nội dung không chứng nhận học thuật.
- Giới hạn kỹ thuật/time/cost cụ thể do nhóm phát triển đo/chọn ở kế hoạch; không cam kết 10/60 giây.
- Nghiên cứu fixture là bằng chứng sơ bộ, không human gold; baseline UX tiếp tục đo khi có người dùng.
