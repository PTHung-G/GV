# Idea Intake: Bộ mã đề, bản in và chấm đồng bộ

- **Slug**: exam-variant-print
- **Created**: 2026-11-15T02:21:33+07:00
- **Source**: pasted text; current teacher exam application
- **Type**: improvement

## Idea (as captured)

> bạn làm, thiết kế lại idea để mọi thứ thuận lợi cho giáo viên đi. Có thể làm thêm cơ chế tạo các mã đề (với các cơ chế xáo mã đề, như là đổi thứ tự câu hỏi, đổi số trong câu hỏi,...., những thủ thuật mà giáo viên việt nam áp dụng). Bạn hãy dùng đầy đủ các skill từ nghiên cứu, sinh idea, check valid rồi implement đầy đủ đến khi xong thì mới được dừng

## Restated

Thiết kế và triển khai một luồng thuận tiện từ trình soạn để tạo nhiều mã đề, xuất đề/barem/phiếu trả lời đồng bộ, nhận diện đúng phiên bản khi chụp chấm. Khảo sát cách xáo câu, lựa chọn, và tạo biến thể số liệu có đáp án tương ứng.

## Origin & Context

- **Raised by**: user/website owner.
- **Trigger**: phiếu độc lập mới xuất trong editor chưa liên kết mã đề, bản barem bất biến hay phiên chấm; user không muốn qua wizard chấm trước khi in.
- **Execution mode**: user explicitly delegates autonomous end-to-end research, idea evaluation, implementation and verification. Slug generated autonomously; no request for user to choose technical names.

## First-Glance Unknowns

- Cách giữ nguyên nhóm câu chung ngữ liệu, tham chiếu câu và đáp án khi xáo?
- Những dạng đề nào có thể phân tích chính xác từ HTML hiện có?
- Thay số liệu thế nào để kiểm chứng đáp án và không tăng độ khó ngoài ý muốn?
- Định danh QR và phiên bản đề/barem phải lưu thế nào để chấm an toàn?
- Luồng nhận ảnh hiện có ràng buộc phiên chấm và mã học sinh thế nào?
- Giới hạn thực tế của mẫu phiếu và các dạng câu ngoài A–D?
