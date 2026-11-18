# Chấm bài thi — kiến trúc và luồng đề xuất

Trạng thái: **đã triển khai và kiểm chứng** (xem mục 13 để biết chính xác cái gì chạy được và cái gì chưa).
Kế hoạch thi công nằm ở `docs/ke-hoach-trien-khai.md`; hạ tầng dev ở `docs/dev-database.md`.

## 1. Quyết định chính

- Đơn vị làm việc là **đợt chấm**: một đề/bộ mã đề, một lớp, một phiên bản đáp án và barem.
- **Một đợt, nhận bài một lần, hai luồng chấm, một bảng điểm tổng.** Tách trắc nghiệm và tự luận ở xử lý và giao diện duyệt, không tách thành hai tính năng độc lập hay yêu cầu tải lại cùng ảnh.
- Điện thoại là máy quét; máy tính là bàn duyệt. Có thể làm tất cả trên điện thoại.
- Cần backend lưu bền vững để đồng bộ hai thiết bị. localStorage hiện tại không đủ; đăng nhập hiện tại là mô phỏng và phải thay bằng xác thực thật.
- Bài giấy thường và tự luận là luồng nhập bài chính; phiếu trắc nghiệm chuẩn là lựa chọn tối ưu, không bắt giáo viên đổi giấy mới dùng được.
- AI chỉ đề xuất điểm tự luận. Giáo viên phải duyệt trước khi chốt.
- Các con số độ chính xác, thời gian chấm, chi phí trong bản trước chưa được đo trên dữ liệu thực. Không dùng làm cam kết.

## 2. Hành trình từ card Chấm bài thi

```text
Sảnh → Chấm bài thi → Danh sách đợt chấm
                          ↓ Tạo đợt
                   Chọn đề / tải đề ngoài
                          ↓
                   Xác nhận đáp án, barem
                          ↓
                   Chọn lớp → Tạo đợt
                          ↓
              Bàn làm việc của đợt chấm
                ├─ Nhận bài: điện thoại / tải ảnh, PDF
                ├─ Xử lý nền: đọc bài → đề xuất điểm
                ├─ Cần duyệt: danh tính, trang, đáp án, điểm
                └─ Bảng điểm → Chốt đợt → Xuất kết quả
```

### Màn 1 — Danh sách đợt chấm

Route `/grading`.

- Nút chính: **+ Tạo đợt chấm**.
- Mỗi đợt: tên, môn, lớp, số học sinh, số bài nhận, số bài cần duyệt, trạng thái, lần cập nhật.
- Bộ lọc: đang chấm / đã chốt / lưu trữ.
- Lần đầu: hướng dẫn ba bước, không tự bật wizard hay camera.
- Bấm một đợt tiếp tục đúng công việc còn dở.

### Màn 2 — Tạo đợt: Chọn đề

Hai nguồn:
1. **Đề của tôi**: lấy đề và đáp án đã soạn trên web.
2. **Tải đề bên ngoài**: ảnh/PDF hoặc nhập đáp án trực tiếp với đề trắc nghiệm.

Không bắt buộc đề phải được soạn trên web. Đề ngoài cần bước kiểm tra nội dung nhận dạng trước khi chấm.

Tên đợt tự gợi ý từ đề và lớp; giáo viên có thể sửa.

Hệ thống suy ra hình thức từ đề/barem để giáo viên xác nhận: **chỉ trắc nghiệm**, **chỉ tự luận**, hoặc **kết hợp**. Chỉ hiện phần có sử dụng; đề kết hợp cấu hình điểm tối đa từng phần và quy tắc quy đổi tổng. Đây là thuộc tính độc lập với nguồn đề và chế độ camera.

### Màn 3 — Xác nhận đáp án và barem

Đây là bước bắt buộc, không chỉ kiểm tra rằng có một tài liệu HTML đáp án.

- Hiện từng câu, loại câu, đáp án, điểm tối đa và các ý chấm.
- Nếu chưa có: **Tạo bản nháp bằng AI** hoặc nhập tay. Bản AI chưa được coi là đáp án chính thức.
- Kiểm tra số câu, mã đề, tổng điểm, tổng điểm các ý, câu thiếu đáp án.
- Thiếu barem ở câu nào: bổ sung hoặc chọn giáo viên chấm tay câu đó; không âm thầm chấm thô.
- Cho phép lời giải khác đúng, điểm thành phần và nguyên tắc xử lý lỗi kéo theo.
- Giáo viên bấm **Xác nhận đáp án và thang điểm**.
- Tạo snapshot cả đề, ánh xạ mã đề, đáp án, barem. Không chỉ lưu tham chiếu tài liệu có thể thay đổi.

### Màn 4 — Chọn lớp và tạo đợt

- Chọn lớp đã lưu; hoặc dán danh sách Excel; hoặc nhận bài chưa gán học sinh rồi gán sau.
- Mã học sinh/SBD là khóa nhận diện, không dùng tên làm khóa vì có thể trùng tên.
- Có thể chọn phiếu chuẩn và in nếu chưa thi; không bắt chọn giấy ở một màn riêng.
- Bấm **Tạo đợt chấm**, vào bàn làm việc.

### Màn 5 — Bàn làm việc của đợt

Route `/grading/[id]`, các tab theo query:
- `?tab=receive`: Nhận bài dùng chung cho cả hai phần; xử lý danh tính, trang thiếu và chất lượng ảnh tại đây.
- `?tab=mc`: Trắc nghiệm — lưới học sinh × câu hỏi, duyệt lựa chọn không rõ và điểm phần này. Chỉ hiện nếu đề có trắc nghiệm.
- `?tab=essay`: Tự luận — ảnh bài cạnh barem, duyệt điểm từng ý, theo bài hoặc theo câu. Chỉ hiện nếu đề có tự luận.
- `?tab=scores`: Bảng điểm tổng hợp, phân biệt điểm từng phần và trạng thái xác nhận.
- `?tab=settings`: Đề, barem, in phiếu, cấu hình và lịch sử.

Không dùng một tab duyệt chung làm màn chính cho hai loại câu. Các badge cần xử lý xuất hiện trên từng tab; lỗi nhận bài/danh tính có liên kết về Nhận bài. Deep-link đến đúng bài/câu bằng query bổ sung. Nếu dùng lại URL `?tab=review` từ bản thiết kế cũ thì chuyển về tab tương ứng hoặc Nhận bài, không tạo một luồng nghiệp vụ thứ ba.

Đầu màn hình luôn có: tên đợt, lớp, số bài đã nhận/cần duyệt/đã duyệt, nút **Quét bằng điện thoại**.

Không bắt người dùng theo wizard nữa sau khi đợt được tạo; có thể vừa nhận bài vừa duyệt.

## 3. Điện thoại quét, máy tính nhận ngay

Trên máy tính, bấm **Quét bằng điện thoại** → hiện QR và liên kết có thời hạn.

1. Điện thoại quét QR, mở web HTTPS, không cần cài app.
2. Thiết bị được ghép cặp với đúng đợt. Nếu dùng liên kết cấp quyền thay cho đăng nhập, quyền chỉ được tải bài lên, không xem danh sách lớp/bảng điểm.
3. Máy tính xác nhận ghép cặp; liên kết trao đổi thành phiên thiết bị giới hạn quyền, không giữ token dài hạn trên URL.
4. Điện thoại xin quyền camera sau thao tác của giáo viên. Dùng camera sau, có phương án tải ảnh khi camera bị từ chối hoặc không hỗ trợ.
5. Ảnh được lưu nháp trên điện thoại, tải lên, server xác nhận đã lưu bền vững. Chỉ lúc đó mới hiện **Đã nhận trên hệ thống**.
6. Máy tính cập nhật khi có ảnh mới và khi chấm xong; đóng camera không làm dừng việc chấm ở server.
7. Giáo viên kết thúc phiên hoặc thu hồi thiết bị. Link ghép cặp hết hạn nhanh; phiên quét có thời hạn riêng.

Màn quét trên điện thoại chỉ cần: tên đợt, học sinh/bài đang chụp, khung camera, nút chụp, ảnh thu nhỏ và nút **Xong bài → Bài tiếp**.

## 4. Một bài nhiều trang — quy tắc bắt buộc

- Mặc định **một học sinh là một bài, nhiều ảnh là nhiều trang**, không coi mỗi ảnh là một học sinh.
- Bắt đầu bài → chụp trang 1, 2… → xem lại, sắp xếp, xoay hoặc chụp lại → **Xong bài**.
- Quét liên tục không rời camera; nút Xong bài giúp tránh ghép trang của hai học sinh.
- Phiếu chuẩn có QR chứa định danh không nhạy cảm: phiên bản mẫu, mã đề, mã bài và số trang nếu có. Không nhúng đáp án hay họ tên vào QR.
- Tên OCR chỉ là gợi ý. Mã trùng, tên trùng, mã không thuộc lớp, hoặc không rõ danh tính → hàng cần gán, không tự gán đoán.
- PDF nhiều học sinh: bước chia trang thành từng bài và xác nhận trước khi chấm. Chưa tự suy luận ranh giới rồi chốt điểm.
- Chưa nhận bài không đồng nghĩa vắng; vắng phải do giáo viên đánh dấu.

## 5. Nhận bài và chất lượng ảnh

- Kiểm tra mờ, chói, thiếu góc, chữ quá nhỏ; cảnh báo để chụp lại. Có chế độ giữ ảnh để xử lý thủ công thay vì làm giáo viên kẹt ở camera.
- Tự cắt phối cảnh với tùy chọn chỉnh tay; giữ bản gốc để đối chiếu.
- Không nén cố định mọi ảnh về 1600px: chữ viết nhỏ và công thức cần đủ độ phân giải. Tối ưu theo chất lượng nhận dạng và kích thước tải.
- Trạng thái tải riêng: lưu trên máy / đang tải / server đã nhận / tải lỗi.
- IndexedDB giữ hàng chờ offline. Khi mở lại ứng dụng, tiếp tục đồng bộ; không hứa upload nền khi trình duyệt bị đóng, đặc biệt trên iOS.
- Hash nội dung giúp phát hiện tải lại đúng file. Chụp lại cùng tờ tạo hash khác nên phải kết hợp mã bài, số trang, dấu vân tay ảnh và xác nhận của giáo viên.
- Không ghi đè trang hoặc bài một cách im lặng; lưu phiên bản thay thế.

## 6. Xử lý và chấm

### Một đầu vào chung, hai pipeline độc lập

```text
Nhận bài một lần → lưu ảnh/PDF → xác nhận nhóm trang, danh tính, mã đề
                                      ↓
                         Xác định câu và các trang liên quan
                          ┌───────────┴───────────┐
                          ↓                       ↓
                 Job trắc nghiệm            Job tự luận
                 Đọc lựa chọn               Đọc bài và căn cứ
                 Code tính điểm             AI đề xuất từng ý
                          ↓                       ↓
                 Duyệt ô nghi vấn            Giáo viên duyệt
                          └───────────┬───────────┘
                                      ↓
                            Một bảng điểm tổng hợp
```

- Phiếu trắc nghiệm và giấy tự luận có thể quét ở hai lượt khác nhau trong cùng đợt. Ghép bằng mã bài/SBD đã xác nhận, không bằng tên gần giống.
- Một trang có thể chứa cả hai loại câu: lưu ảnh một lần, liên kết vùng/trang vào các câu tương ứng; không ép mỗi trang chỉ thuộc một phần.
- Trang chưa phân loại được vào hàng cần xác nhận; không bỏ sót âm thầm hoặc chạy chấm hai lần cùng câu.
- Không cần đợi tự luận xử lý xong mới xem điểm trắc nghiệm và ngược lại.
- Mỗi pipeline có job, retry, lỗi và phiên bản kết quả riêng. Retry/chấm lại một phần không chạy lại hay ghi đè phần kia.
- Sửa trang dùng chung phải đánh dấu kết quả các câu bị ảnh hưởng là cần xử lý/duyệt lại, không để điểm cũ mang trạng thái đã xác nhận với bằng chứng mới.

### Trắc nghiệm

- Phiếu chuẩn: OMR đo ô tô theo hình học mẫu, có kiểm tra neo/góc/xoay và chất lượng ảnh.
- Giấy khác: vision đọc đáp án, mọi chỗ không rõ đưa vào duyệt.
- Hỗ trợ từng loại câu theo schema: một lựa chọn trước; đúng/sai nhiều ý và trả lời ngắn cần quy tắc riêng, không ép thành A/B/C/D.
- Code tính điểm, không để model tự cộng điểm.
- Giai đoạn đầu kết quả vẫn là dự kiến; chỉ cho phép tự xác nhận OMR sau khi đã kiểm định với dữ liệu thực và giáo viên chủ động bật.

### Tự luận

- Đọc đủ các trang liên quan đến câu, gồm trang làm tiếp. Không gửi đơn độc một trang khi bài có thể tiếp ở trang khác.
- Giữ liên kết căn cứ với pageId và vùng ảnh nếu xác định được. Bản chép OCR không thay thế ảnh gốc.
- Mỗi ý: nội dung đọc được, điểm đề xuất, lý do và cảnh báo.
- Không đọc rõ khác với làm sai: trường hợp không đọc rõ có điểm `null`, yêu cầu xem lại/chụp lại; không tự cho 0.
- Lời giải khác barem không tự coi là sai; chuyển giáo viên duyệt khi chưa xác minh được tính tương đương.
- Kiểm tra schema, phạm vi điểm, tổng điểm, phần thiếu và mã đề bằng code.
- Confidence model tự báo không phải xác suất đúng đã hiệu chuẩn; không dùng một ngưỡng tùy ý để chốt điểm.
- Gọi lại cùng model không được coi là kiểm chứng độc lập.
- Nội dung trong ảnh là dữ liệu không đáng tin: không làm theo các chỉ dẫn viết trong bài; không cấp công cụ hay quyền thay đổi barem cho model.

## 7. Duyệt và chốt

Hàng duyệt phân loại: chưa gán học sinh / trang lỗi hoặc thiếu / đáp án không rõ / điểm tự luận cần duyệt.

Desktop: trái là ảnh bài, giữa là từng câu và căn cứ, phải là barem và điểm. Điện thoại dùng ảnh ở trên, thẻ chấm bên dưới, không ép giao diện ba cột.

- Duyệt theo bài hoặc theo câu cho cả lớp. Chấm theo câu là cách tổ chức công việc, không mặc nhiên làm model chính xác hơn nếu các lần gọi độc lập.
- Sửa OCR và sửa điểm là hai thao tác khác nhau, đều ghi lịch sử.
- Luôn phân biệt điểm AI đề xuất và điểm giáo viên đã duyệt.
- Tự luận luôn cần giáo viên duyệt; có thể xác nhận cả bài sau khi xem các câu.
- Bài thiếu trang hoặc còn điểm null không được chốt thành bài đầy đủ.
- Bảng điểm hiển thị rõ điểm dự kiến/đã duyệt, học sinh chưa nhận bài/vắng và tiến độ xử lý.
- **Chốt đợt** kiểm tra bài chưa duyệt, chưa gán, đang xử lý và học sinh chưa có bài. Có thể chốt có ngoại lệ nếu giáo viên xác nhận và hệ thống ghi rõ ngoại lệ.
- Xuất bảng chính thức chỉ gồm điểm đã duyệt; bản nháp có nhãn rõ. Không tự gán xếp loại học lực từ điểm một bài kiểm tra.
- Mở lại đợt đã chốt để sửa có lịch sử. Đổi barem tạo revision mới, chấm lại có chủ đích và không âm thầm ghi đè điểm cũ.

### Điểm từng phần và điều kiện tổng hợp

Trạng thái điểm trắc nghiệm và tự luận độc lập: `not-applicable`, `not-received`, `processing`, `needs-review`, `confirmed`, `failed`. Cờ thiếu trang và danh tính vẫn được quản lý riêng.

- `not-applicable`: đề không có phần này; không tính là thiếu và không hiển thị cột không cần thiết.
- `not-received` hoặc điểm `null`: chưa nhận/không đủ căn cứ, **không tự đổi thành 0**.
- Chỉ có tổng chính thức khi tất cả phần bắt buộc đã xác nhận và danh tính đã được xử lý hợp lệ; ngoại lệ phải do giáo viên xác nhận, có lịch sử.
- Điểm dự kiến chỉ cộng khi đủ dữ liệu và gắn nhãn rõ; nếu thiếu phần thì hiển thị tổng chưa đủ, không tạo ảo giác đã hoàn tất.
- Quy đổi/làm tròn theo cấu hình snapshot của đợt; code tính tổng từ điểm phần, không để AI tự cộng.

Ví dụ đề trắc nghiệm 3 điểm + tự luận 7 điểm:

| Học sinh | Trắc nghiệm /3 | Tự luận /7 | Tổng /10 | Trạng thái |
|---|---|---|---|---|
| An | 2,5 đã xác nhận | 5,0 đã duyệt | 7,5 chính thức | Hoàn tất |
| Anh | 3,0 đã xác nhận | 4,5 chờ duyệt | 7,5 dự kiến | Chờ duyệt tự luận |
| Minh | 2,0 đã xác nhận | Chưa nhận | — | Thiếu tự luận |

## 8. Kiến trúc triển khai đề xuất

```text
Web desktop + web camera trên điện thoại
                ↓ HTTPS, xác thực/phân quyền
Next.js API ── PostgreSQL: lớp, đợt, trang, jobs, điểm, lịch sử
     │
     ├─ Object storage riêng tư: ảnh/PDF
     └─ Hàng đợi bền vững → Worker → OMR / model vision
                                   ↓
                         kết quả và sự kiện tiến độ
                                   ↓
                    SSE hoặc polling cho các thiết bị
```

- MVP có thể dùng bảng jobs trong PostgreSQL, không cần Redis ngay. Worker tách khỏi vòng đời request web.
- Object storage tương thích S3 hoặc kho file riêng tư có sao lưu ở quy mô nhỏ; ảnh không nằm trong thư mục public.
- IndexedDB là bộ đệm upload và phục hồi trên thiết bị, không phải nguồn dữ liệu chính.
- Auth thật và dữ liệu theo chủ sở hữu là điều kiện trước khi dùng ảnh học sinh thật. Không dùng userId do client tự khai làm bằng chứng quyền truy cập.
- Mọi query/file URL phải kiểm tra quyền sở hữu. Dùng signed URL ngắn hạn, không để QR/capture token đọc ảnh hay bảng điểm.
- Job có idempotency key, timeout, retry có giới hạn, trạng thái lỗi và nút thử lại. Phân biệt lỗi hạ tầng với kết quả bài làm.
- Chống ghi đè khi hai thiết bị sửa cùng bài bằng revision/optimistic locking.
- Giới hạn dung lượng, số trang, concurrency, hạn mức chi phí; kiểm tra MIME và nội dung file thực, không chỉ đuôi file.

### Các thực thể chính

- User, Class, Student, Enrollment.
- ExamSnapshot, ExamVariant, RubricRevision, Question, Criterion.
- GradingSession: owner, lớp, snapshot, hình thức `mc-only | essay-only | mixed`, trọng số/quy tắc quy đổi, trạng thái.
- SessionSection: phần trắc nghiệm/tự luận, điểm tối đa và tập câu trong snapshot.
- Submission: một học sinh/đợt, mã đề, danh tính; dùng chung cho hai phần, không tạo hai bài độc lập chỉ vì khác loại câu.
- SubmissionSection: trạng thái nhận/xử lý/duyệt, điểm đề xuất và xác nhận của mỗi phần.
- PageAsset: ảnh gốc, ảnh xử lý, thứ tự, trạng thái upload, phiên bản.
- QuestionEvidence: liên kết câu với một hoặc nhiều trang/vùng ảnh; một trang có thể phục vụ nhiều câu thuộc hai phần.
- ProcessingJob, GradingRun: loại pipeline/câu/phần, model/config/prompt version, rubric revision, kết quả, chi phí và khóa idempotency.
- CriterionScore: AI proposed, teacher confirmed, evidence, flags.
- ReviewAction/AuditEvent: người sửa, thời gian, giá trị trước/sau, lý do.
- CaptureDeviceSession: quyền upload giới hạn đợt, thời hạn, khả năng thu hồi.

ID câu/ý ổn định; hỗ trợ số câu lặp theo phần. Điểm lưu dưới dạng số nguyên đơn vị nhỏ hoặc decimal chính xác; tổng điểm không bắt buộc 10, có phép quy đổi cấu hình.

### API phác thảo

```text
POST /api/grading/sessions
GET  /api/grading/sessions/:id
POST /api/grading/sessions/:id/capture-pairings
POST /api/grading/sessions/:id/submissions
POST /api/grading/submissions/:id/uploads
POST /api/grading/submissions/:id/complete
GET  /api/grading/sessions/:id/events
POST /api/grading/submissions/:id/review
POST /api/grading/sessions/:id/finalize
GET  /api/grading/sessions/:id/export
```

Chỉ enqueue khi trang đã tải xong và bài được đánh dấu Xong bài; có thể OCR trước để giảm chờ nhưng chưa kết luận thiếu câu trước lúc hoàn tất bài.

## 9. Riêng tư và vận hành

- Bản đồng bộ hai thiết bị sẽ lưu ảnh trên server kể cả ảnh phiếu OMR. Không quảng cáo ảnh không rời máy trong chế độ này.
- Tách riêng chế độ offline-local nếu bổ sung sau; khi đó không có đồng bộ ảnh và phải nói rõ giới hạn.
- Vision gửi ảnh cho provider: cần kiểm tra chính sách lưu giữ, sử dụng huấn luyện, nơi xử lý và điều khoản phù hợp trước khi dùng dữ liệu học sinh thật.
- Ưu tiên cắt/che thông tin định danh không cần thiết trước khi gọi provider, nhưng giữ phần bài làm cần chấm.
- Cấu hình thời hạn giữ ảnh, quyền xóa ảnh, giữ điểm và lịch sử cần thiết. Chính sách bao gồm cả bản sao lưu và dữ liệu đã gửi provider.
- Không ghi ảnh, token ghép cặp hay nội dung nhận dạng đầy đủ vào log thông thường.
- Sao lưu DB và ảnh; thử khôi phục, không chỉ có nút xuất CSV.

## 10. Phạm vi và kiểm định

### Bản đầu dùng được

Auth thật, DB và kho ảnh; tạo đợt từ đề hiện có; xác nhận barem; ghép điện thoại; nhiều trang một bài; upload bền vững; hàng đợi; chấm nháp; duyệt; bảng điểm; xuất CSV.

Ưu tiên một môn/một dạng bài và một lớp thử nghiệm trước khi mở rộng mọi đề. Phiếu OMR thêm như nhánh tối ưu, không làm điều kiện để nhận bài giấy thường.

### Mở rộng sau

Tự chụp khi ảnh ổn định, nhập PDF hàng loạt, nhiều mã đề đầy đủ, phiếu cá nhân hóa, xuất XLSX/phiếu nhận xét, thống kê và cộng tác nhiều giáo viên.

### Cổng kiểm định trước phát hành

- Bộ ảnh chữ viết tay thật đã được phép sử dụng; có ảnh mờ, sửa/xóa, hình học, nhiều trang và lời giải khác.
- Đối chiếu điểm từng ý với giáo viên, đo lỗi OCR riêng với lỗi chấm.
- Đo lệch điểm, tỷ lệ phải sửa, thời gian duyệt và chi phí thực trên mỗi bài.
- OMR thử nhiều điện thoại, máy in, ánh sáng và kiểu tô; đo lỗi nhận sai mà không cảnh báo, không chỉ tỷ lệ đọc được.
- Test mất mạng, đóng/mở điện thoại, tải trùng, retry, ghép nhầm trang, truy cập trái quyền và xung đột sửa điểm.
- Chưa có dữ liệu đo thì không cam kết 99,9%, thời gian chấm hay số tiền cố định.

## 11. Thiết kế bổ sung: hai chế độ camera và xác thực học sinh

### Chọn chế độ trước khi mở camera

Hiện rõ hai lựa chọn: **Tờ chuẩn của hệ thống — tự quét** và **Đề/giấy bên ngoài — chụp thủ công**. Nguồn đề và loại giấy là hai thuộc tính độc lập: đề ngoài vẫn có thể được in trên mẫu chuẩn, đề soạn trên web nhưng chép lên giấy thường vẫn dùng thủ công.

Tờ chuẩn không nhất thiết chỉ là phiếu trắc nghiệm. Có thể là đề có vùng làm tự luận; mỗi trang có 4 marker, hướng trang, QR gồm templateVersion, examVariantId, paperInstanceId, pageIndex và pageCount nếu biết trước. Không có marker thì không gọi là tờ chuẩn hỗ trợ auto-scan. Tờ tự luận viết tiếp ngoài mẫu được thêm như trang thủ công.

### Camera tự quét tờ chuẩn

Máy trạng thái: tìm tờ → đủ 4 marker và đúng mẫu → đánh giá chất lượng nhiều khung liên tiếp → chụp ảnh độ phân giải cao → kiểm tra lại ảnh chụp → lưu nháp/upload → chờ thay tờ → tìm tờ tiếp.

Bốn marker dùng để xác định hình học, không chứng minh ảnh sắc nét. Phải kiểm tra thêm rung/mờ, vùng chói, kích thước chữ sau crop, giấy bị che và hướng trang. Khoảng ổn định 500–1000ms chỉ là tham số khởi đầu để thử thực tế; đo trên thiết bị thật trước khi chốt.

Sau chụp, rung/beep nếu thiết bị hỗ trợ và hiện ảnh thu nhỏ. Camera không đóng. Tuy nhiên **không tự chụp lại tờ vẫn đang nằm đó**: chờ tờ rời khung hoặc thấy QR trang khác. Cho phép nút chụp lại/ghi đè có xác nhận nếu cần. Nếu cùng một tờ đưa vào lại, báo đã có trang này thay vì tạo bài mới.

QR liên kết paperInstanceId với bài và pageIndex với trang: tự nhóm trang, tự chuyển bài khi thấy paperInstance khác. Không tự chốt bài đủ trang khi pageCount chưa biết; giáo viên xác nhận Xong bài, hoặc xác nhận trong màn tổng kết. Chỉ tự hoàn tất trang/bài khi đã nhận đủ trang khai báo, không còn lỗi và không cần trang bổ sung.

Nếu khó bắt marker, có nút chuyển sang thủ công; không bắt người dùng kẹt ở camera. Auto-scan chỉ chạy khi camera web đang mở và được cấp quyền, không hứa chạy khi khóa màn hình.

### Camera thủ công cho đề ngoài

- Chọn hoặc tạo bài đang chụp; nếu có danh sách lớp, có thể chọn sẵn học sinh.
- Nút Chụp → xem lại và crop/xoay → Giữ trang hoặc Chụp lại.
- **Back**: quay lại xem trang đã chụp, sửa/xóa/sắp xếp; không xóa tự động.
- **Next/Chụp trang tiếp**: giữ nguyên bài hiện tại để chụp thêm trang.
- **Xong bài → Học sinh tiếp**: kết thúc nhóm trang và bắt đầu bài mới, tách khỏi Next để tránh gộp hai học sinh.
- Có thể gợi ý cắt mép giấy bằng computer vision nhưng không auto chụp/chuyển bài trong chế độ này.

### Có upload danh sách lớp

Import CSV/XLSX hoặc dán Excel; xem trước, ánh xạ cột mã/SBD, họ tên, lớp; báo trùng mã, trùng tên và dòng lỗi trước khi lưu. SBD không được mặc định là mã học sinh toàn trường: phạm vi theo kỳ/đợt. Giữ nguyên tên gốc để hiển thị.

Thứ tự nhận diện: QR cá nhân hóa đã ánh xạ → mã/SBD viết/in trên bài → họ tên và lớp → giáo viên chọn. QR được tra server và kiểm tra đúng đợt, không tin payload tự khai.

- QR/mã khớp duy nhất và không xung đột: liên kết đề xuất; nếu QR đã cá nhân hóa hợp lệ thì có thể liên kết tự động theo cấu hình.
- Mã khớp nhưng tên mâu thuẫn: cờ xung đột, không ghi đè tên trong danh sách.
- Tên khớp duy nhất sau chuẩn hóa: gợi ý; mặc định giáo viên xác nhận đối với OCR viết tay.
- Tên gần giống: hiện vài ứng viên, không tự gán.
- Hai học sinh trùng tên: bắt buộc thêm mã hoặc giáo viên chọn.
- Không khớp: giữ bài chưa gán, cho chọn thủ công hoặc thêm học sinh ngoài danh sách có xác nhận.
- Hai bài cùng một học sinh: cảnh báo bài trùng, cho gộp trang/thay thế/lưu bài nộp lại có phiên bản; không tự ghi đè.

Chuẩn hóa Unicode, chữ hoa/thường, khoảng trắng; chỉ bỏ dấu cho tìm kiếm ứng viên, không dùng để kết luận hai người là một. Không tự thay O/0, I/1 trong mã rồi coi là khớp chính xác. Lưu raw OCR, ứng viên, phương pháp gán, người xác nhận và lịch sử.

### Không upload danh sách lớp

Mỗi bài nhận UUID riêng và nhãn Bài 001/Bài 002; OCR lấy tên, lớp, mã nếu đọc được. Giáo viên có thể xác nhận nhanh trên thẻ ảnh hoặc duyệt sau; không phải gõ trước mỗi lần chụp.

Không có danh sách tham chiếu thì chỉ **trích xuất và xác nhận thông tin**, không thể chứng minh người đó thuộc lớp. Tên đọc được vẫn là chưa xác thực, không phải danh tính đã valid. Không gộp hai bài chỉ vì tên giống nhau.

Có thể tiếp tục chấm nháp khi chưa gán tên; bảng chính thức cần giáo viên xác nhận tên hoặc chủ động chốt với mã ẩn danh được ghi rõ. Cho import danh sách về sau và chạy đối chiếu lại, giữ nguyên ID bài và điểm đã duyệt. Không thể báo số học sinh thiếu/vắng nếu chưa có danh sách lớp đầy đủ.

### Trạng thái độc lập

Không nhét mọi thứ vào một status:
- Upload: local/pending/uploading/stored/failed.
- Trang: valid/needs-retake/duplicate/superseded.
- Danh tính: unassigned/suggested/verified/conflict/anonymous-confirmed.
- Xử lý: queued/running/succeeded/failed.
- Điểm: draft/needs-review/confirmed, quản lý theo câu và từng phần trắc nghiệm/tự luận; trạng thái tổng hợp tuân theo mục 7.

Bài có thể đã chấm nháp nhưng chưa xác nhận danh tính; không đưa vào điểm chính thức của một học sinh cho đến khi gán đúng. Hai chiều cấu hình độc lập:

| Loại giấy/camera | Trắc nghiệm | Tự luận |
|---|---|---|
| Tờ chuẩn có marker/QR — tự quét | Có | Có |
| Giấy ngoài — chụp thủ công | Có | Có |

Không mặc định trắc nghiệm là tự quét hoặc tự luận là chụp tay.

## 12. Hiện trạng đã kiểm chứng và chưa kiểm chứng

- Code hiện tại có route vision cho ảnh và đã đọc được một ảnh chữ in tổng hợp; điều này chỉ xác nhận đường truyền multimodal hoạt động với mẫu đó.
- Chưa chứng minh khả năng đọc chữ viết tay thật hoặc độ chính xác chấm tự luận.
- Đăng nhập và đề hiện lưu localStorage; cần thay/migrate sang backend trước khi triển khai luồng đa thiết bị.
- Chưa có tính năng chấm bài thực tế được triển khai theo tài liệu này.

---

## 13. Trạng thái triển khai

Đã xây và kiểm chứng bằng test tự động lẫn chạy thật trên domain.

### Chạy được

| Phần | Bằng chứng |
|---|---|
| Auth server thật (scrypt, cookie HttpOnly, phân quyền theo chủ sở hữu) | 401 khi không đăng nhập, 404 khi truy cập đợt của người khác |
| Đợt chấm + rubric đóng băng | Tạo đợt, đọc lại thấy đúng barem; sửa đề không đổi điểm cũ |
| **Hai nguồn đề** | Chọn đề soạn trên web, **hoặc** dán/chụp ảnh đề đã in sẵn rồi tạo thang điểm |
| Xoá đợt chấm | Xoá luôn ảnh bài làm trên đĩa, không để lại tệp mồ côi |
| Ghép điện thoại bằng mã một lần | Mã dùng lại bị từ chối; phiên điện thoại chỉ vào được đúng đợt |
| Nhận bài nhiều trang, chống trùng | Ảnh trùng không tăng số trang; tệp không phải ảnh bị từ chối |
| **Phiếu chuẩn + OMR** | Sinh phiếu in có 4 điểm neo + QR; đọc ô tô trong trình duyệt; câu tô 2 ô vào hàng duyệt |
| Chấm tự luận bằng AI | Đề xuất điểm từng bước kèm **trích dẫn câu chữ của học sinh** |
| Duyệt và sửa | Sửa đáp án trong lưới, sửa điểm từng bước, xác nhận, chấm lại; có `audit_events` |
| **Tự gán học sinh từ QR trên phiếu** | QR đúng đợt → gán "verified"; phiếu của đợt khác bị bỏ qua kèm cảnh báo |
| **Số báo danh tô trên phiếu** | Lưới 6 cột × 10 chữ số; đọc được cả khi ảnh xoay 1,4° và nén JPEG; cột để trống → không đoán, trả `code = null` |
| **Phiếu in chuyên nghiệp** | Một tờ A4 dùng chung cho cả lớp: khung, đầu phiếu, lưới SBD, ô thí sinh, hướng dẫn, lưới trả lời, ô điểm + chữ ký giám khảo |
| **Quét liên tục bằng camera** | Camera mở suốt buổi; mỗi 220 ms dò 4 điểm neo trên khung 640 px; phiếu chiếm ≥ 45% khung, máy thẳng, giữ yên 3 khung → tự chụp, tự đọc, tự nộp, tự chấm, và ngắm lại ngay cho tờ sau |
| **Chống nộp trùng** | Sau mỗi tờ, camera chỉ "nạp đạn" lại khi phiếu đã rời khung; giữ nguyên một tờ trước ống kính không sinh bài thứ hai (có test e2e) |
| **Kiểm tra 4 điểm neo** | Sau khi bắt 4 góc, kiểm tra chúng có tạo thành hình chữ nhật A4 (tỉ lệ cạnh, độ lồi, tỉ lệ khung) và có đủ đậm không; sai thì mọi câu bị gắn cờ `unstable-anchors`, cả bài tự vào trạng thái “cần xem lại” |
| **Lớp phủ “Máy đọc được gì”** | Bấm vào ảnh trang ở tab Nhận bài, hoặc icon con mắt ở tab TN: vẽ 4 điểm neo, tâm từng ô đã lấy mẫu kèm độ chênh sáng, ô máy chọn (xanh) và ô đậm mà không được chọn (đỏ) |
| **Thang điểm lấy từ bảng đáp án có sẵn** | Chọn đề đã kèm tài liệu đáp án thì bước 2 điền sẵn số câu và điểm, không gọi model; chỉ đề chưa có đáp án mới cần "Tạo bằng AI" |
| **QR giải trong vùng đã biết** | Khi 4 điểm neo tin được, chúng cho biết trang nằm ở đâu nên chỉ quét ô mã thay vì cả ảnh: 280 ms → 63 ms một tờ ở 1600 px |
| **QR làm mốc định vị dự phòng** | Góc in bị chói/lẫn với nền thì mã QR ra tay: 3 tâm ô định vị (chính xác đến một phần module) cho một phép biến đổi, dự phóng 4 góc in, dò lại từng góc trong cửa sổ hẹp, rồi tự dò hệ số tỉ lệ và bù góc còn thiếu từ 3 góc đo được. Góc bù được báo rõ trong lớp phủ và trong cảnh báo của bài |
| **Gợi ý danh tính từ ảnh bài** | Model đọc họ tên/mã viết tay, lưu ở trạng thái `suggested`, không tự coi là đã xác thực |
| **Chấm tự luận theo câu cho cả lớp** | Chọn câu → cả lớp xếp cạnh nhau, mỗi bước có căn cứ trích dẫn |
| Bảng điểm + CSV + thống kê | CSV UTF-8 BOM dấu `;`; phổ điểm, tỉ lệ đúng từng câu, phân bố phương án |
| Chốt đợt | Từ chối khi còn bài chưa duyệt; cho phép chốt có ngoại lệ và ghi lại |

**Kiểm định:** 85 test tự động (24 test cũ, 11 unit tính điểm/CSV/thống kê, 19 unit phiếu in + OMR + số báo danh, 7 unit luật quét tự động, 6 unit đọc bảng đáp án, 12 unit hình học lớp phủ + kiểm tra 4 góc + định vị lại bằng QR, 6 e2e chấm bài + quét liên tục), `tsc` sạch, build sạch, chạy thật trên `dsh.vnotemate.com/soandethi`.

### Chưa làm

- **Kiểm định chữ viết tay thật**: mới thử ảnh bài in/chụp màn hình. Chưa có số đo độ chính xác, **không nên công bố bất kỳ con số nào**.
- **Vận hành production**: tắt `AUTH_AUTO_PROVISION`, sao lưu, chính sách xoá ảnh theo thời hạn, chuyển sang Supabase, TLS và phân quyền thật.
- **Số báo danh dài hơn 8 chữ số** hoặc mã có chữ cái: lưới in cố định 6 cột, đổi qua `sbdDigits` khi tạo phiếu.
- **Nhiều giáo viên cùng một đợt**: hiện một đợt thuộc một tài khoản.
- **Đối chiếu tên viết tay gần giống** với danh sách lớp để hiện vài ứng viên: hiện chỉ lưu đúng chuỗi model đọc được.

### Sửa lỗi phát hiện trong quá trình kiểm chứng

- Ảnh trùng làm `pageCount` sai → kiểm tra SHA-256 trước khi lưu.
- `regrade` không tạo job khi bài chưa từng "Xong bài" → đổi sang upsert.
- Job kẹt `running` sau khi tiến trình chết → worker thu hồi sau 10 phút.
- "Xong bài" sau khi đọc phiếu ghi đè kết quả OMR → bỏ qua job vision khi đã có kết quả phiếu.
- Ngưỡng "dưới 5" cố định sai với đề không phải 10 điểm → tính theo nửa thang điểm thật.
- Route gợi ý AI không bật JSON nên luôn rơi về bản dự phòng → bật `json: true`.
- Ảnh điện thoại 3–6 MB gửi nguyên lên server → thu nhỏ còn 2000px tại trình duyệt trước khi tải (3,24 MB → 0,74 MB), OMR vẫn đọc bản gốc.
- Nhà cung cấp AI trả 429 là job báo hỏng oan → thử lại 3 lần, tôn trọng `Retry-After`, mỗi lần gọi có trần 120 giây.
- Mã học sinh trên QR không được kiểm tra đợt → giờ đối chiếu `sid` và chỉ gán khi đúng lớp, đúng đợt.
- Dựng phép biến đổi từ 4 góc jsQR trả về làm cả trang co còn 0,75 → `bottomRightCorner` của jsQR là tâm ô alignment chứ không phải góc mã, nên giờ dựng từ 3 tâm ô định vị (sai số dưới một module) rồi mới tinh chỉnh 4 góc.
- Tìm lại góc trong cửa sổ: ngưỡng diện tích ban đầu so với diện tích *cửa sổ* thay vì diện tích *ô in* nên không bao giờ đạt, mọi góc đều bị coi là mất → so với diện tích ô in.
- Góc bị chói lấy thẳng từ dự phóng affine nên lệch ~15 px ở góc xa, đủ để cả lưới ô lệch và bài về 0 điểm → hiệu chỉnh affine từ 3 góc đo được rồi mới suy ra góc thứ tư; tờ bị chói một góc giờ vẫn 10/10 và chỉ một cảnh báo.
