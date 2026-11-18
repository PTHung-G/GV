# Problem Definition: Lưu giữ và tổ chức câu hỏi mà không tăng việc cho giáo viên

- **Slug**: topic-question-bank
- **Created**: 2026-11-13T02:22:29+07:00
- **Updated**: 2026-11-13, sau quyết định thu hẹp chức năng sang lưu và tổ chức, đồng thời bỏ giới hạn lĩnh vực
- **Inputs used**: [research.md](research.md); các quyết định trực tiếp mới nhất của người dùng và xác nhận cho phép ghi đè. intake.md chưa có.

## Problem Statement

Giáo viên cần lưu giữ và tìm lại câu hỏi đã chấp nhận thuộc bất kỳ lĩnh vực kiến thức nào, nhưng không muốn phải chuẩn bị danh mục, gắn nhãn hoặc xử lý phân loại khó khi nội dung tích lũy ngày càng nhiều. Nội dung cần được giữ nguyên vẹn, riêng tư và vẫn có thể lưu khi chưa có đáp án, barem hoặc điểm, mà không làm thay đổi âm thầm đề đã chốt.

Nguồn: yêu cầu trực tiếp mới nhất trong hội thoại; [Users & Demand](research.md#users--demand). Đây là nhu cầu được phát biểu, chưa đo tần suất hoặc công sức sử dụng thực tế.

## Affected Users & Stakeholders

- **Users**: giáo viên/người soạn đề — muốn giữ lại nội dung đã duyệt và tìm lại khi cần, không nhận thêm công phân loại. Không giới hạn môn, lớp hoặc lĩnh vực. Nguồn: yêu cầu trực tiếp và [nghiên cứu](research.md#users--demand).
- **Stakeholders**: chủ sở hữu nội dung/tài khoản — cần kiểm soát nội dung được giữ và quyền riêng tư. Đây là vai trò đã xác định từ yêu cầu kho riêng, chưa có phỏng vấn độc lập. Không suy rộng thành nhu cầu chia sẻ cộng đồng.

## Goals

- Giữ lại và tìm lại nội dung người dùng đã chấp nhận mà không yêu cầu họ tổ chức kiến thức thủ công.
- Không giới hạn phạm vi kiến thức vào một môn, lớp, chương trình hoặc danh mục dựng sẵn; nội dung ngoài Toán 9 không bị loại chỉ vì khác lĩnh vực.
- Không có thao tác quản trị phân loại bắt buộc; việc duyệt nội dung muốn giữ không biến thành duyệt danh mục hoặc sửa ca mơ hồ.
- Nội dung cũ vẫn đầy đủ và tìm được khi có thêm nội dung hoặc khi cách tổ chức trở nên chi tiết hơn; không ép phân loại chi tiết khi thiếu căn cứ.
- Thiếu đáp án, barem hoặc điểm không cản trở việc lưu và tổ chức; giữ trạng thái thiếu trung thực, không bịa hoặc bắt giáo viên bổ sung.
- Bảo toàn nội dung nguồn, công thức, hình, dữ kiện chung, các ý phụ và đáp án/barem nếu có; không âm thầm bỏ phần không xử lý được.
- Giữ dữ liệu riêng theo tài khoản. Chỉnh sửa đề sau khi lưu không tự ghi đè nội dung đã giữ; cập nhật cần xác nhận lại.
- Không làm gián đoạn công việc soạn đề và kiểm soát chi phí xử lý ở mức hợp lý dựa trên đo đạc thực tế.

Nguồn: quyết định trực tiếp của người dùng về năm nhóm làm rõ; [xác nhận chốt/lưu/sửa](research.md#phạm-vi-và-tín-hiệu-người-dùng-mới). Đây là mục tiêu, không phải kết quả đã đạt.

## Non-Goals

- Tìm ứng viên câu thay, xác nhận tương đương, đổi câu trong editor hoặc đồng bộ đáp án do thay câu: **hoãn toàn bộ sang giai đoạn sau**.
- Dùng khả năng tìm được câu tương đương làm tiêu chí chặn giai đoạn lưu và tổ chức hiện tại.
- Bắt giáo viên dựng/duyệt/sửa hệ thống phân loại hoặc bổ sung đáp án/barem trước khi lưu.
- Tự sinh đáp án, barem, điểm hay chứng nhận tính đúng học thuật của câu được lưu.
- Kho cộng đồng, tự chia sẻ giữa tài khoản hoặc thu thập mọi bản nháp không có xác nhận.
- Cam kết mọi nội dung đều được phân loại chi tiết hoặc chất lượng mọi lĩnh vực đã được kiểm chứng.
- Đồng nhất “mọi lĩnh vực kiến thức” với hỗ trợ sẵn mọi định dạng đầu vào như ảnh quét/OCR, âm thanh hoặc video. Phạm vi định dạng cần xác định riêng, không được dùng để giới hạn môn học.
- Lộ trình học hoặc quan hệ kiến thức tiên quyết.

Nguồn: quyết định mới nhất của người dùng và phần giải thích phạm vi được người dùng xác nhận. Không giới hạn lĩnh vực là yêu cầu đã chốt, không còn là câu hỏi về việc chỉ hỗ trợ Toán 9.

## Success Metrics

Các chỉ số là tiêu chí cần đo, không phải lời hứa đã đáp ứng. Người dùng giao nhóm phát triển lựa chọn mức thời gian/chi phí hợp lý; chưa có benchmark hoặc ngưỡng số được chứng minh. Không giữ các mốc 10/60 giây từng đề xuất làm cam kết.

| Signal | Baseline / bằng chứng hiện có | Kết quả mong muốn |
|---|---|---|
| Thao tác quản trị phân loại bắt buộc | Chưa có luồng sản phẩm; thử AI không yêu cầu người dùng sửa phân loại | 0, theo yêu cầu đã chốt |
| Mức bảo toàn nội dung khi lưu và tổ chức lại | Đủ vị trí cho 25/25 câu trong một phép thử; chưa kiểm tra toàn vẹn nội dung toàn luồng | Không mất/trùng câu ngoài chủ đích; không bỏ công thức, hình, ý phụ hoặc dữ kiện liên quan |
| Lưu câu thiếu đáp án/barem/điểm | Đã gặp thiếu điểm trong corpus; chưa thử luồng sản phẩm | Câu vẫn lưu được; thông tin thiếu không bị tự điền hoặc biến thành lý do từ chối lưu |
| Khả năng giữ và tìm lại nội dung qua nhiều lĩnh vực | Vòng 3 có 16 câu tổng hợp đa lĩnh vực, hai đầu ra đủ assignment; chưa đo UX hoặc trích xuất đầu vào thô | Không từ chối chỉ vì lĩnh vực; đánh giá riêng các nhóm kiến thức và trường hợp mơ hồ trong mẫu kiểm định |
| Khả năng tìm lại nội dung cũ sau khi bổ sung | Một thử nghiệm có 2 câu đổi vị trí, 7 câu ở cấp rộng; chưa có quan sát sử dụng | Nội dung cũ vẫn tìm được, không phải nhờ giáo viên sửa tổ chức |
| Thời gian/thao tác lưu và tìm lại | Chưa đo baseline | Đo trên cùng tác vụ; không phát sinh công quản trị lớn hơn lợi ích |
| Lỗi riêng tư hoặc ghi đè ngoài ý muốn | Chưa kiểm chứng cho tính năng mới | Không truy cập chéo tài khoản, không âm thầm cập nhật bản đã giữ hay đề đã chốt trong các kịch bản nghiệm thu |
| Thời gian xử lý, chi phí và số lần xử lý lại | Chưa đo model ứng dụng | Nhóm phát triển đề xuất giới hạn dựa trên đo thực; xử lý có giới hạn và không cản trở tiếp tục soạn đề |

Nguồn: [Experiment & Observations](research.md#experiment--observations), [Data & Constraints](research.md#data--constraints), yêu cầu mới nhất của người dùng. Tập kiểm định đa lĩnh vực chưa có; không trình bày ý định bao phủ rộng như bằng chứng đã hỗ trợ đúng mọi kiến thức.

## Cost of Inaction

Người dùng tiếp tục giữ nội dung ở mức đề và tự nhớ/tìm lại hoặc tự tổ chức khi cần. Nếu việc giữ nội dung đòi tự phân loại thì công việc có thể chỉ bị chuyển chỗ thay vì giảm. Chưa có số liệu định lượng công sức này; đây là hệ quả theo nhu cầu được phát biểu, không phải kết quả nghiên cứu hành vi. Nguồn: [Market & Context](research.md#market--context), yêu cầu trực tiếp.

## Evidence Boundary & Scope Change

- Nghiên cứu hiện có là lịch sử trước quyết định mới. Các mô tả giới hạn Toán 9 là phạm vi mẫu thử, không phải phạm vi kiến thức sản phẩm; các câu hỏi về chốt/lưu/sửa và cho lưu thiếu barem đã được người dùng trả lời.
- Vòng 1 cho thấy một biểu diễn cây có thể mở nhánh và sắp xếp lại trên 25 câu đã tách sẵn, không mất assignment trong kiểm tra. Chưa chứng minh tách đề, bảo toàn toàn bộ nội dung, ổn định qua nhiều đợt/thứ tự, riêng tư hoặc chất lượng đa lĩnh vực.
- Vòng 2 nghiên cứu tìm ứng viên và ghi nhận bất đồng đáng kể giữa hai agent. Kết quả này vẫn có giá trị cho giai đoạn đổi câu sau, nhưng không dùng tỷ lệ ứng viên hoặc thiếu đáp án làm điều kiện chặn lưu và tổ chức hiện tại.
- Vòng 3 bổ sung 16 câu tổng hợp đa lĩnh vực theo hai thứ tự, đều đủ assignment và tham chiếu nguồn; cả hai agent nhìn thấy toàn corpus và required_components đã có sẵn. Chưa chứng minh đầu vào thô hoặc nhập tăng dần có che dữ liệu tương lai. Nguồn: [vòng 3](research.md#round-3--tổ-chức-đa-lĩnh-vực-và-giữ-các-thành-phần-nguồn).
- Không chạy model ứng dụng hoặc đo giáo viên; độ tin cậy nghiên cứu tổng thể vẫn thấp. Quyết định phạm vi mới là đầu vào sản phẩm, không phải bằng chứng kỹ thuật đã đạt.
- Các ràng buộc giải pháp đã chốt — cây một cha không chu trình, AI xem cây hiện tại, tự mở nhánh/xem lại câu cũ, cho phép câu ở cha và không giao quản trị cho giáo viên — vẫn giữ nguyên để chuyển sang shape. Không mô tả kiến trúc trong bước define.

Nguồn: [nghiên cứu vòng 1](research.md#experiment--observations), [vòng 2](research.md#round-2--tìm-ứng-viên-không-chỉ-định-cặp-trước) và các quyết định trực tiếp mới nhất. Bản concept và decision trước chưa phản ánh đầy đủ phạm vi mới; bước này chỉ cập nhật định nghĩa, không thay verdict.

## Open Questions

1. [NEEDS CLARIFICATION: Những định dạng nội dung đầu vào nào cần được hỗ trợ ngay và cách giữ nguyên nội dung có hình, công thức, dữ kiện chung/nhóm câu được kiểm chứng ra sao? Không mở lại phạm vi lĩnh vực hoặc cho lưu thiếu barem đã chốt.]
2. [NEEDS CLARIFICATION: Tập kiểm định có quyền sử dụng, bao gồm nhiều lĩnh vực, nội dung tổng hợp và mơ hồ là gì; tiêu chí hữu ích/ổn định nào đủ để đánh giá khả năng tổ chức khi thêm nội dung? Nhóm phát triển thực hiện, không biến thành công việc phân loại thường ngày của giáo viên.]
3. [NEEDS CLARIFICATION: Baseline lưu/tìm lại và các giới hạn thời gian, chi phí, xử lý lại hợp lý do nhóm phát triển đề xuất từ phép đo thực là gì? Người dùng đã giao quyền đề xuất, không cần hỏi lại một ngân sách tùy ý trước khi đo.]

Các mục còn mở là phạm vi định dạng và bằng chứng/tiêu chí cần hoàn thiện trước hoặc trong đặc tả; không lặp lại yêu cầu người dùng quyết định thuật toán hoặc chất lượng thực tế của AI. Tính toàn vẹn, quyền riêng tư và khả năng giữ bản cũ là yêu cầu nghiệm thu, không phải lựa chọn để bỏ qua.

## Next Step

`/speckit-assess-shape slug=topic-question-bank`

Điều chỉnh concept theo trọng tâm lưu và tổ chức đa lĩnh vực; tách chức năng đổi câu sang giai đoạn sau. Cần xác nhận trước khi ghi đè concept hiện có. Không tự sửa nghiên cứu, concept, quyết định hoặc mã nguồn trong bước này.
