# Concept: Một bộ đề đã chốt, nhiều mã, một luồng giáo viên

- **Slug**: exam-variant-print
- **Created**: 2026-11-15
- **Recommended option**: B — bộ mã đề có kiểm chứng

## Options

### Option A — Chỉ liên kết phiếu hiện có
- **Sketch**: giáo viên chốt một đề, in phiếu có nhận dạng và chấm đúng bản đó; chưa hỗ trợ tạo mã khác.
- **Appetite**: small, budget not estimate.
- **Trade-offs**: ít rủi ro, giải quyết lệch phiên bản; không đáp ứng yêu cầu tạo mã/xáo đề.
- **Rabbit holes**: giữ hai luồng in độc lập dễ khiến người dùng nhầm.

### Option B — Bộ mã đề có kiểm chứng
- **Sketch**: tại editor, giáo viên chọn số mã/cách xáo, xem trước ánh xạ đề-đáp án, chốt một bộ in có thể mở lại. Mỗi mã có đề, barem và phiếu cùng định danh; chụp nhận đúng bản. Xáo chỉ áp dụng cấu trúc được kiểm tra; nhóm ngữ liệu/câu phụ thuộc giữ nguyên hoặc được giáo viên khóa. Đổi số liệu là tùy chọn qua mẫu tham số hóa có kiểm chứng chứ không sửa số trong đề tùy ý.
- **Appetite**: medium as complexity budget; actual completion depends on validation, no deadline promise.
- **Trade-offs**: đáp ứng tính tiện lợi và an toàn; cần giáo viên rà soát cấu trúc với HTML cũ, không quảng cáo tự động mọi đề.
- **Rabbit holes**: arbitrary HTML semantic inference; equal-difficulty proofs; unlimited numeric transformations. Explicitly exclude those.

### Option C — Tự sinh mọi biến thể bằng AI / dùng công cụ ngoài
- **Sketch**: giao sinh lại đề-đáp án cho AI hoặc yêu cầu xuất/nhập công cụ trộn đề khác.
- **Appetite**: large/unknown for trustworthy validation.
- **Trade-offs**: phạm vi rộng nhưng không có bằng chứng đúng, thêm thao tác và làm mất lợi thế luồng hiện có.
- **Rabbit holes**: kiểm chứng mọi môn/dạng toán, sai đáp án, phụ thuộc vendor.

## Recommendation

B đáp ứng yêu cầu user, tái sử dụng phần chấm có thật, nhưng chỉ hứa điều có thể kiểm thử: hoán vị bảo toàn ánh xạ, phiên bản bất biến, từ chối sai mã, và công thức tham số hóa hữu hạn. Không giữ hai nút xuất gây hiểu nhầm về khả năng chấm.

## Out of Scope (for the recommended option)

- Tự động thay số mọi câu tự do hoặc nhận định độ khó tương đương.
- Ô Đúng/Sai/trả lời ngắn trong OMR nếu chưa có schema; phải thông báo, không giả chuyển thành A–D.
- Chấm sai QR bằng cách đoán đề.

## Assumptions to Validate

- Bộ đề hỗ trợ được parser cấu trúc chặt; ambiguous giữ nguyên hoặc báo chặn, không mất nội dung.
- Giáo viên chấp nhận preview/review một lần; hệ thống không yêu cầu wizard thứ hai.
- Session per variant có thể gom dưới bộ in để giáo viên không quản lý thủ công nhiều đợt.
