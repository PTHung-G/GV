# Kết quả thử nghiệm AI tự tổ chức cây — 10 đề Toán 9

## Kết luận

Đã xử lý đủ10đề công khai, lưu163câu và45node do AI tự đặt tên/cấu trúc từ root kỹ thuật. **Chưa đạt trọn luồng:** lượt tự rà soát toàn kho trả thiếu1/163assignment, bị từ chối an toàn. Không có taxonomy/mapping/gold được đưa vào prompt, không sửa tay cây hoặc gán hộ câu thiếu.

## Đánh giá độc lập cây cuối

Đọc mọi đường tổ tiên của163câu, không chỉ tên lá:

| Kết luận | Câu |
|---|---:|
| Phù hợp |153|
| Phù hợp nhưng còn thô/thiếu trọng tâm |8|
| Sai rõ |1|
| Chưa thể kết luận do đầu vào hỏng ký hiệu |1|

Sai rõ: Trần Phú I.6 hỏi phép quay90°của hình vuông, bị xếp vào đối xứng đường tròn. Không sửa tay. Hai câu tần số rời rạc từng bị xếp nhầm thống kê ghép nhóm ở snapshot trước, nhưng cây incremental cuối đã đổi; không cộng lỗi cũ vào điểm cuối. Có chồng lấn nhánh ứng dụng/kỹ thuật và nhãn kết hợp tam giác/đường tròn, không coi45node là bằng chứng cây tối ưu.

## Tách câu và độ trung thực nguồn

Đã xem mọi163candidate và các block không dùng. Không phát hiện bỏ nguyên câu in sẵn hoặc tạo câu giả.154câu đánh số trên giấy tương ứng167đơn vị độc lập ưu tiên; thực tế163do3nhóm được giữ chung (thiếu4đơn vị so với ưu tiên, không mất nội dung).

Còn2nhiễm context vì dòng PDF trộn nhãn hình/câu bên cạnh;4nhóm đúng/sai Quán Toan thiếu hướng dẫn dạng trả lời.8block hướng dẫn/chấm điểm ở hai đề cuối cũng không gắn theo câu, được báo riêng, không đánh đồng “body đủ” với “context sạch”.

PDF→text mất căn, số mũ, phân số, góc và hình trước khi AI phân tách; có câu thiếu hình thiết yếu nên không thể tuyên bố trả lời được hay bảo toàn PDF. Hai chỗ gold ghi tắt chưa đúng PDF được công khai, giữ hash frozen và ưu tiên bản gốc khi đánh giá.

## Lượt chạy và chi phí

Có nhiều lần lỗi/timeout và một lần dự định resume nhưng thực tế chạy lại vì runner thiếu mã khôi phục. Đã đính chính và tính cả lượt trùng. Resume sau đó được xác minh provider-free trước khi chạy thật.

Tổng38requestđã gửi,594740tokenđược provider báo;6requestkhông cóusage nên tổng token/tiền thực có thể cao hơn. Không có bảng giá/hóa đơn để quy đổi tiền. Không retry trả phí thêm.

Lượt self-review cuối trả sau48.973giây, JSON45node/162assignment, thiếuQ162; **không phải timeout**. Cổng kiểm tra không cho commit một phần; cây163câu trước đó còn nguyên. Cây công bố là cây sau đề10, không phải cây tự rà soát thành công.

## Thay đổi và kiểm thử

Chỉ prompt/công cụ chung: tự rà soát ngữ nghĩa toàn đường dẫn, thao tác gộp/chuyển an toàn, aliasQ tạm để giảm overhead, ràng buộc abort khi đọc response body, checkpoint giữ nguyên AI state. Prompt sau đánh giá thêm quy tắc giữ hướng dẫn cách trả lời; **chưa actual-provider retest quy tắc mới**, không nâng điểm bộ10đề.

Kiểm thử đã hoàn tất trước bản sửa thông báo lỗi cuối:139passed/20skipped(no-server);13passed(PostgreSQL riêng);225passed/22skipped(full Chromium,247discovered);TypeScript và root/subpath build exit0. Xác minh bản cuối và triển khai:152passed/20skipped(no-server),35focusedpassed,TypeScript/subpathbuildexit0. Đã restart dịch vụ hiện có; authenticated Chromium smoke tại3210/soandethi đạt lưu nguồn native(không gọi AI), reload, restart, cookie/nguồn giữ nguyên và0browsererror. Chỉ dùng/xóa tài khoản tổng hợp. Dịch vụactive. URL công khai trả401ở gateway; chưa xác minh phiên đăng nhập qua gateway, không tuyên bố public200. Bộ Chromium225passed/22skipped chạy trước bản sửa thông báo cuối; bản cuối được phủ bằng focused/no-server và deployed smoke, không gộp thành một lượt full-suite mới.

## Bằng chứng

- [Cây thực tế và số câu từng nhánh](<repair-pass-2026-11-17T09-10-58-522Z/actual-tree.md>)
- [Đánh giá ngữ nghĩa từng câu](<repair-pass-2026-11-17T09-10-58-522Z/final-semantic-review.md>)
- [Tổng hợp tách câu đúng lineage](<current-lineage-findings.md>)
- [Chẩn đoán self-review](<repair-pass-2026-11-17T09-10-58-522Z/self-review-rejection.md>)
- [Đính chính checkpoint](<checkpoint-correction.md>)
- [Kế toán provider đầy đủ](<provider-accounting.json>)
- [Nguồn10đề và hash](<source-manifest.json>)
