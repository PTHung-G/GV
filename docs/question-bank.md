# Kho câu hỏi riêng

## Luồng sử dụng
Trong editor, chọn **Chốt và lưu câu hỏi** để chụp nội dung hiện tại. Xác nhận lưu nguồn riêng rồi mở **Kho câu hỏi**. Nguồn được lưu bền trước khi gọi AI.

- **Đề mới có cấu trúc hợp lệ:** giữ định danh câu/khối từ lúc tạo đề. Khi chốt, đọc nội dung hiện tại của từng khối, kiểm tra toàn bộ ranh giới và dữ kiện chung; mở thẳng bản kiểm tra câu hỏi, **không gọi AI tách lại**. Chỉnh chữ, công thức hoặc định dạng trong khối vẫn giữ định danh nếu cấu trúc còn nguyên. Việc phân loại vào cây vẫn dùng AI sau khi giáo viên xác nhận.
- **Đề cũ, nhập ngoài hoặc ranh giới hỏng:** báo rõ cần nhận diện lại. Nguồn HTML hiện tại vẫn được lưu nguyên; chọn phân tách, xem thân/ngữ cảnh các câu nhận diện, chọn câu cần giữ rồi xác nhận. AI phải khai báo từng khối đã dùng hoặc bỏ qua dưới dạng tiêu đề/trang trí; chỉ gắn dữ kiện chung cho câu thực sự cần, không rải mọi khối thừa vào mọi câu. Kiểm tra này bảo đảm đủ tham chiếu, không tự chứng minh AI đã hiểu đúng ngữ nghĩa. Không dùng JSON cũ để bỏ qua phần vừa sửa/thêm. Dán khối trùng định danh, xóa/mất mốc hoặc nội dung không thuộc khối đã biết sẽ không được tin ngầm.

AI tổ chức theo cây đa lĩnh vực; không có thao tác sửa taxonomy hoặc đổi câu trong phiên bản này. Câu nhiều ý dùng chung dữ kiện được giữ trọn; nhánh cha có thể đúng cho bài tổng hợp. Tính hợp lệ của cây không tự chứng minh phân loại đúng kiến thức.

Barem liên kết đúng phiên bản được giữ dưới dạng nguồn riêng, không in lẫn vào câu. Không đoán đáp án/điểm/rubric khi thiếu hoặc chưa ánh xạ an toàn. Chỉnh đề hay xóa đề gốc không sửa snapshot đã giữ; chốt lại tạo phiên bản mới. Gửi lại cùng thao tác không nhân bản.

## Trạng thái và phục hồi
`Chờ xử lý`, `Đang xử lý`, `Cần kiểm tra`, `Đã lưu`, `Xử lý chưa thành công` phản ánh trạng thái trong PostgreSQL. Xử lý được kích hoạt bởi yêu cầu người dùng, không phải daemon nền. Đóng tab/restart không làm mất nguồn; mở lại kho và tiếp tục/thử lại. Lease hết hạn sau khoảng105 giây, kết quả cũ không ghi đè phiên mới. Lỗi AI không làm mất câu đã xác nhận; câu chưa được tổ chức ở gốc. AI chưa cấu hình được báo rõ, không giả kết quả offline.

Mỗi tài khoản một lời gọi đang chạy; tối đa2 kho chạy AI đồng thời toàn dịch vụ. Không tự retry vô hạn. Model client có retry tạm thời trong ngân sách signal90 giây. Mutation trong lúc AI xử lý khiến kết quả stale bị từ chối và có thể thử lại.

## Giới hạn phiên bản đầu
- Nguồn HTML trong app tối đa2 triệu ký tự; lần gửi JSON tối đa12 MB; toàn kho24 MB.
- 200 nguồn,2.000 câu,200 topic, sâu tối đa12 cạnh; nhãn100 ký tự.
- Phân tách AI tối đa160.000 ký tự JSON khối; nguồn lớn vẫn giữ nguyên nhưng có thể không phân tách được. Không truncate nguồn âm thầm.
- Tổ chức tối đa200 câu mỗi lần: ưu tiên chưa tổ chức rồi câu cũ liên quan theo từ trong nội dung. Các lượt sau xử lý phần còn lại; root có thể là vị trí đúng cho câu tổng hợp. Gửi nguyên câu và ngữ cảnh rõ ràng, không cắt âm thầm; tổng JSON ngữ cảnh tối đa160.000 ký tự, vượt giới hạn thì báo thất bại và giữ nguyên nguồn để thử lại theo nguồn nhỏ hơn.
- Preview cách ly bằng sandbox/CSP, không tải tài nguyên ngoài, không chạy script. Hỗ trợ LaTeX/MathML, SVG nội tuyến và ảnh raster data; HTML/style không hỗ trợ bị bỏ ở preview, không thay bản nguồn. Không hứa giữ hình từ URL ngoài.

## Vận hành
Migration0012 additive tạo kho độc lập document_libraries. Sao lưu Postgres trước deploy. Không reset DB. AI xử lý ngoài transaction; transaction owner row lock/CAS lease chặn kết quả stale. Bản nguồn và câu không ghi ngược vào autosave editor. Không sử dụng shared memory API để phân loại.

Kiểm chứng luồng có cấu trúc và trạng thái release: [verification004](<../specs/004-structured-question-flow/verification.md>). Bộ đề thật, đánh giá từng đường dẫn chủ đề và giới hạn chuyển PDF: [báo cáo thử nghiệm](<evaluations/math9-topic-tree/report.md>). Kết quả hợp lệ kỹ thuật không thay thế giáo viên kiểm tra nội dung; bản trích văn bản thiếu biểu đồ/ký hiệu không được xem là PDF đã nhập nguyên vẹn.
