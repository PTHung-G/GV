# Concept: Kho câu hỏi riêng với cây kiến thức tự tổ chức

- **Slug**: topic-question-bank
- **Created**: 2026-11-13T02:22:29+07:00
- **Updated**: 2026-11-13T17:53:56+07:00
- **Recommended option**: B — Lưu nội dung và tự tổ chức cây, chưa làm đổi câu
- **Inputs**: [problem.md](problem.md), [research.md](research.md), quyết định trực tiếp mới nhất của người dùng. intake.md chưa có. Người dùng đã xác nhận cho phép ghi đè concept.
- **Status**: concept, không phải đặc tả, kế hoạch triển khai hoặc verdict go. Các appetite bên dưới là ngân sách định hướng chưa được kiểm chứng bằng ước lượng kỹ thuật.

## Options

### Option A — Kho riêng tối giản, chưa tự tổ chức cây

- **Sketch**: Giáo viên xác nhận nội dung muốn giữ, sau đó xem và tìm lại trong kho cá nhân theo nội dung/nguồn mà không gắn nhãn. Câu thiếu đáp án, barem hoặc điểm vẫn được giữ đúng như nguồn. Đây là phương án nhỏ nhất để thử giá trị lưu và tìm lại, không kèm chức năng đổi câu.
- **Appetite**: small — ngân sách theo ngày cho một lát cắt đối chứng hẹp; không phải ước lượng hoàn thành kho sản phẩm, chưa đủ bằng chứng kỹ thuật để cam kết.
- **Trade-offs**: Giảm bất định về phân nhánh và tổ chức lại, tập trung vào bảo toàn nội dung và quyền riêng tư. Đổi lại, duyệt kho lớn có thể khó và chưa đáp ứng yêu cầu cây tự tổ chức đã chốt. Không dùng phương án này để âm thầm thay thế B.
- **Rabbit holes**: Mở rộng thành công cụ tìm kiếm hoặc biên tập kho tổng quát; tưởng lưu trọn đề đã đủ trong khi người dùng cần giữ và tìm lại câu với đầy đủ ngữ cảnh.

### Option B — Kho riêng với cây tự hình thành và phát triển

- **Sketch**: Khi chốt và xác nhận nội dung muốn giữ, giáo viên có kho câu hỏi riêng, duyệt được theo cây kiến thức và xem lại nội dung/nguồn. Không cần cây có sẵn hoặc giới hạn môn, lớp, lĩnh vực. AI xem cấu trúc hiện tại và nội dung liên quan để dùng nhánh phù hợp hoặc tạo nhánh mới, tự xem lại câu cũ liên quan khi phân loại chi tiết hơn. Câu tổng hợp hoặc chưa rõ được giữ ở cấp cha thích hợp; giáo viên không nhận hàng đợi duyệt/sửa topic. Thiếu đáp án, barem hoặc điểm vẫn lưu bình thường, không tự bịa phần thiếu. Sửa đề sau đó không tự ghi đè nội dung đã giữ; việc cập nhật cần xác nhận lại. Chưa có thao tác tìm câu tương đương hoặc đổi câu trong editor.
- **Appetite**: medium — dành ngân sách định hướng theo tuần cho lát cắt lưu–tổ chức–duyệt trên nội dung trong ứng dụng, không phải lời hứa giao hàng hoặc chứng minh có thể hoàn thành trong vài tuần. Chưa đủ dữ liệu để ước lượng độ rộng định dạng, chất lượng đa lĩnh vực hoặc chi phí toàn luồng; cần thu hẹp theo định dạng/ngân sách nếu vượt appetite, không tự giới hạn môn học.
- **Trade-offs**: Đáp ứng trực tiếp yêu cầu lưu và tổ chức mà không chuyển công việc sang giáo viên; hoãn đổi câu giúp tránh gộp bài toán tương đương học thuật vào giai đoạn này. Đổi lại, hệ thống gánh bất định phân loại, mở nhánh và tổ chức lại; cây hợp lệ chưa chắc dễ dùng hoặc ổn định. Cho câu ở cha giảm ép nhãn nhưng có thể làm cấp cha đông câu. Không giới hạn lĩnh vực không có nghĩa chất lượng mọi lĩnh vực đã được chứng minh.
- **Rabbit holes**: Nhánh trùng hoặc phân tầng quá sâu; liên tục xáo trộn cây; xử lý lại toàn kho mỗi lần; suy luận đáp án không được yêu cầu; OCR/đa phương tiện hoặc đổi câu len vào phạm vi; biến ngoại lệ thành việc giáo viên phải xử lý.

### Option C — Giữ quy trình hiện tại, chưa xây kho mới

- **Sketch**: Tiếp tục giữ nội dung ở các đề trong ứng dụng và tìm lại theo cách hiện có; quan sát một số tác vụ lưu/tìm lại làm baseline trước khi đầu tư vào kho câu hỏi. Không khẳng định quy trình hiện tại đã có khả năng tìm câu ở mức chi tiết.
- **Appetite**: small — ngân sách theo ngày để quan sát tác vụ hẹp; không bao gồm xây tính năng.
- **Trade-offs**: Tránh chi phí và rủi ro phân loại mới nhưng không giải quyết nhu cầu kho tự tổ chức. Chưa có số liệu để kết luận công sức hiện tại nhỏ hay lớn; chờ thêm không tự tạo ra bằng chứng nếu không đo.
- **Rabbit holes**: Kéo dài khảo sát hoặc quay lại nghiên cứu tìm/thay câu trong khi quyết định hiện tại chỉ cần lưu và tổ chức.

## Recommendation

Khuyến nghị **B**, bám lựa chọn cây tự tổ chức đã được người dùng chốt, nhưng bỏ toàn bộ tìm/đổi câu khỏi giai đoạn này. A là đối chứng nhẹ, không đáp ứng đầy đủ yêu cầu; C là baseline không xây. Tiêu chí thành công của B là giữ nguyên nội dung, tìm lại được khi kho tăng, không có công quản trị phân loại bắt buộc, dữ liệu riêng và chi phí hợp lý — không phải số node hoặc cây trông đẹp. Nguồn: [goals và metrics](problem.md#success-metrics).

[Nghiên cứu vòng 1](research.md#experiment--observations) hỗ trợ hẹp cho cách biểu diễn: một lần thêm 5 rồi 20 câu đã tách sẵn tạo cây từ 4 lên 10 node, đủ 25/25 assignment, không lỗi cấu trúc trong kiểm tra; có 2 câu cũ chuyển vị trí và 7 câu ở node có con. Vòng 3 bổ sung mẫu đa lĩnh vực đã tách sẵn; vòng 4 trích 6→10 câu từ HTML thô, tự giữ đoạn chung/hình và không nhìn trước đợt B, kiểm tra cấu trúc/nguồn không lỗi. Đây là bằng chứng hẹp trên fixture sạch, chưa có bảo toàn nội dung toàn luồng sản phẩm, ổn định kho lớn, model ứng dụng hoặc quan sát giáo viên. Vì vậy đây là khuyến nghị hướng concept, không phải kết luận khả thi đã được chứng minh.

[Nghiên cứu vòng 2](research.md#round-2--tìm-ứng-viên-không-chỉ-định-cặp-trước) ghi nhận bất đồng về câu thay. Giữ bằng chứng đó cho giai đoạn sau; không dùng việc chưa có câu thay đã xác minh hoặc thiếu barem để chặn lưu và tổ chức hiện tại. Việc hoãn đổi câu không tự giải quyết những rủi ro riêng về phân loại, nội dung và quyền riêng tư.

### Boundaries of the Recommended Concept

- **Quyền kiểm soát nội dung**: chốt và đồng ý lưu là hành động có chủ đích; không thu gom mọi bản nháp/chat. Duyệt nội dung không bao gồm duyệt phân loại. Cập nhật sau khi sửa cần xác nhận lại, không làm thay đổi âm thầm bản đã giữ hay đề khác.
- **Tính nguyên vẹn**: công thức, hình, các ý phụ, dữ kiện dùng chung và đáp án/barem có sẵn được giữ cùng ngữ cảnh cần thiết. Không tự tách mất phụ thuộc hoặc bỏ phần không xử lý được. Nếu chưa xử lý được, giữ nguồn nguyên vẹn và báo trạng thái trung thực; cách hỗ trợ từng định dạng cần chốt khi đặc tả, không đưa câu hỏng vào kho như đã hoàn tất.
- **Thiếu dữ liệu**: thiếu đáp án/barem/điểm vẫn lưu và tổ chức; không phải lỗi bắt giáo viên sửa. Nội dung được lưu không đồng nghĩa đã được chứng nhận đúng học thuật.
- **Cây thật, không phải đồ thị**: một gốc, mỗi topic không phải gốc có một cha, không chu trình hoặc liên kết chéo. Mỗi câu có một vị trí tổ chức; câu tổng hợp có thể nằm ở cha hoặc gốc thay vì bị nhân bản qua nhiều nhánh. Không mở lại các ràng buộc này như lựa chọn chưa chốt.
- **Nhập thêm có ngữ cảnh**: AI được xem cây đang có và các nội dung liên quan, ưu tiên nhánh phù hợp, không khởi tạo cây độc lập mỗi lần. Khi mở nhánh, có thể xem lại và chuyển câu cũ trong phạm vi liên quan, giữ câu và nguồn không thất lạc.
- **Không quản trị thay AI**: không bắt giáo viên tạo topic, phê duyệt mở nhánh, giải quyết bất định hoặc sửa lỗi phân loại. Trạng thái chưa đủ căn cứ không biến thành hàng đợi giáo viên.
- **Giới hạn xử lý**: tổ chức chạy nền, không khóa việc soạn đề; không đòi hoàn tất AI mới bảo toàn được nội dung nguồn. Lỗi xử lý không được làm mất nội dung đã xác nhận hoặc hiển thị thành công giả. Có giới hạn xử lý lại và phạm vi xem xét để tránh chi phí không kiểm soát; chưa đặt con số hay cơ chế kỹ thuật tại bước này.
- **Riêng tư**: kho và cây riêng theo tài khoản; không tự chia sẻ, không dùng nội dung tài khoản khác để tổ chức hoặc hiển thị.

## Out of Scope (for the recommended option)

- Tìm ứng viên câu thay, chứng nhận tương đương, thay câu, cập nhật đáp án/barem do thay hoặc sinh câu thay mới.
- Bắt giáo viên quản trị cây hoặc bổ sung dữ liệu thiếu để được lưu.
- Danh mục cố định theo môn/lớp làm điều kiện đầu vào, cây kiến thức tiên quyết, nhiều cha hoặc liên kết chéo.
- Tự tạo đáp án/barem/điểm, sửa nội dung học thuật hoặc hiệu chuẩn độ khó từ kết quả học sinh.
- Kho cộng đồng, chia sẻ liên tài khoản và tự thu thập bản nháp.
- Cam kết OCR, âm thanh, video hoặc nhập mọi định dạng bất kỳ ngay giai đoạn này. Đề xuất ranh giới đầu tiên là nội dung đã có trong ứng dụng; đây là ranh giới định dạng/nguồn cần xác nhận trong đặc tả, không phải hạn chế lĩnh vực.
- Xây bộ quản trị taxonomy, tổ chức lại toàn kho không giới hạn, hoặc mở rộng thành nền tảng quản lý kiến thức tổng quát.
- Cam kết chất lượng mọi lĩnh vực, độ trễ/chi phí chưa đo hoặc coi ngân sách medium là lịch giao hàng.

## Assumptions to Validate

- **Tổ chức đa lĩnh vực hữu ích**: AI có thể mở nhánh theo nội dung mà không cần taxonomy sẵn, không tạo nhánh trùng/xáo trộn quá nhiều. Đã có mẫu tổng hợp đa lĩnh vực vòng 3/4, nhưng còn nhỏ, chưa có gold hữu ích độc lập; cần kiểm định tăng dần trên nội dung trong ứng dụng và ca tổng hợp/mơ hồ. Đây là việc kiểm định của nhóm phát triển, không giao giáo viên quản trị.
- **Cây một vị trí đủ dùng**: câu ở cha/gốc vẫn tìm lại được và không làm cây quá khó duyệt khi kho tăng; chưa có quan sát sử dụng xác nhận. Không dùng giả định này để âm thầm đổi sang đồ thị.
- **Giữ nguyên câu và ngữ cảnh**: có thể lưu câu cùng hình/công thức/dữ kiện chung khi cần, kể cả thiếu barem. Phép thử chỉ gán tham chiếu câu đã tách, chưa kiểm chứng toàn luồng tách–lưu–hiển thị.
- **Ổn định khi nhập thêm**: nhiều đợt, thứ tự nhập khác nhau hoặc lỗi AI không dẫn tới mất/trùng câu, vòng lặp tổ chức hoặc yêu cầu giáo viên sửa; chưa được kiểm thử.
- **Thực sự giảm công**: thao tác xác nhận và tìm lại không tạo gánh nặng lớn hơn giá trị; cần baseline lưu/tìm lại, không lấy baseline đổi câu làm thay thế.
- **Phân quyền và bản đã giữ**: cách ly tài khoản và không ghi đè ngoài ý muốn có thể được bảo đảm trong luồng sản phẩm; kho đề hiện có không chứng minh sẵn tính an toàn của kho câu hỏi mới.
- **Chi phí và thời gian hợp lý**: cần đo model ứng dụng, nội dung tăng dần, số lần xử lý lại và đưa ra giới hạn do nhóm phát triển đề xuất theo ủy quyền của người dùng. Không hỏi lại ngân sách tùy ý trước khi có phép đo; không coi 10/60 giây là ngưỡng đã chốt.
- **Phạm vi định dạng khả thi trong appetite**: ưu tiên nội dung có sẵn trong ứng dụng là đề xuất, không phải quyết định đã được người dùng xác nhận riêng. Ba nhóm câu hỏi trong [problem.md](problem.md#open-questions) vẫn cần giải quyết trước hoặc trong đặc tả, không lặp lại các quyết định lĩnh vực/thiếu barem/hoãn đổi câu đã có.

## Next Step

`/speckit-assess-decide slug=topic-question-bank`

Đánh giá lại theo phạm vi lưu và tổ chức đa lĩnh vực. Concept này thay phạm vi concept cũ, không sửa nghiên cứu hoặc verdict. decision.md hiện có cần được đánh giá lại và chỉ ghi đè khi được người dùng xác nhận; không tự coi khuyến nghị B là go hoặc cho phép triển khai.
