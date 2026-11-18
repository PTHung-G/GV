# Problem Definition: In và chấm nhiều mã đề an toàn

- **Slug**: exam-variant-print
- **Created**: 2026-11-15
- **Inputs used**: intake.md, research.md, user input

## Problem Statement

Giáo viên cần phát nhiều mã đề và phiếu trả lời rồi chấm chính xác, nhưng hiện phải điều phối các bước rời rạc và phiếu xuất trực tiếp không nhận diện được bản đề/barem. Việc sửa đề, xáo câu hoặc thay số liệu làm tăng nguy cơ dùng sai đáp án khi in và chấm.

## Affected Users & Stakeholders

- **Users**: giáo viên soạn/in/chấm, theo yêu cầu trực tiếp của user.
- **Stakeholders**: chủ website (user), học sinh chịu ảnh hưởng điểm số; không giả định có khảo sát học sinh.

## Goals

- Giáo viên hoàn tất chuẩn bị bộ in tại nơi soạn, không phải cấu hình lại cùng đề ở màn hình chấm.
- Mỗi bài được nhận đúng phiên bản và đáp án đã phát; sai mã không tạo điểm âm thầm.
- Nhiều mã đề vẫn bảo toàn nội dung, nhóm phụ thuộc và đáp án tương ứng.
- Biến thể số liệu có tính đúng được kiểm chứng, giáo viên biết rõ giới hạn.

## Non-Goals

- Tuyên bố thay số an toàn cho mọi môn/mọi HTML hoặc chứng nhận độ khó tương đương.
- Tự suy luận đáp án còn thiếu hoặc âm thầm chuẩn hóa các dạng chưa hỗ trợ.
- Thay toàn bộ trình soạn, auth, question bank hoặc bỏ cơ chế duyệt điểm hiện có.

## Success Metrics

- Một luồng từ editor đến bộ đề/barem/phiếu có mã, không qua wizard chấm (baseline: chưa liên kết).
- 100% case kiểm thử hoán vị có ánh xạ đáp án chính xác, giữ số câu/điểm.
- 100% case sai mã/bản QR/owner trong kiểm thử bị từ chối trước ghi điểm.
- Bản đã chốt không đổi sau sửa/xóa đề nguồn, in lại khớp dữ liệu cũ.
- Biến thể số liệu được kiểm thử tính nghiệm/miền giá trị/đáp án duy nhất.

## Cost of Inaction

Phiếu trực tiếp tiếp tục không hỗ trợ tự nhận đúng đề; giáo viên phải đi lại wizard hoặc quản lý thủ công. Những rủi ro này được ghi trong research, không gán chi phí tài chính chưa đo.

## Open Questions

- Phạm vi parser và numeric recipes cụ thể được giải quyết trong đặc tả/technical spike, không hỏi user về chi tiết kỹ thuật đã được ủy quyền.
