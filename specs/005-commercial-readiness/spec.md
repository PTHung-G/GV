# Đặc tả Nâng cấp Thương mại Toàn diện (005-commercial-readiness)

**Mã tính năng**: `005-commercial-readiness`  
**Ngày lập**: 2026-11-18  
**Trạng thái**: Sẵn sàng duyệt kế hoạch  
**Phạm vi loại trừ**: Giữ nguyên cơ chế đăng nhập/đăng ký tạm và cấu hình PostgreSQL local hiện tại theo yêu cầu (nhưng sửa lỗi bảo mật/cookie ghép đôi thiết bị quét và chuẩn hoá các bảng dữ liệu nghiệp vụ trên PostgreSQL).

---

## 1. Mục tiêu & Tầm nhìn Vòng lặp Thương mại

Biến **GV** thành nền tảng soạn đề, quản trị học liệu, tổ chức kiểm tra và chấm bài khép kín cho giáo viên phổ thông Việt Nam (THCS & THPT), vận hành ổn định, an toàn trước tải đồng thời nhiều người dùng và đáp ứng chuẩn thi **GDPT 2018 / THPT 2025**.

Vòng lặp khép kín chuẩn thương mại:
1. **Kho câu hỏi v2 (`/question-bank`)**: Lưu câu hỏi kèm đáp án, thang điểm và lời giải chi tiết; tổ chức theo cây chuyên đề có kiểm soát (`is_locked`); chọn câu hỏi để dựng đề mới hoặc chèn trực tiếp vào đề đang soạn.
2. **Trình soạn đề A4 v2 & Trợ lý AI (`/doc/[id]`)**: Gõ tiếng Việt Telex/VNI mượt mà qua ngắt trang A4, Undo/Redo 100 bước cấp ứng dụng, dán sạch từ Word, sửa trực tiếp công thức Toán (MathLive) và hình học TikZ đã chèn, đính kèm ảnh đề thi cho AI OCR.
3. **Xuất bản đa định dạng (`.docx`, `PDF`, `Bộ mã đề GDPT 2018`)**: Tải file Microsoft Word (`.docx`) chuẩn thể thức hành chính với công thức OMML và hình ảnh sắc nét; xuất PDF không mất chữ/nhãn hình; trộn 1–12 mã đề hỗ trợ đủ 4 dạng câu (A–D, Đúng/Sai 4 ý, Trả lời ngắn, Tự luận) và đánh số lại theo Phần.
4. **Quản lý Lớp học & Chấm bài OMR + Vision (`/classes`, `/exam-releases`, `/grading`)**: Quản lý danh sách lớp/SBD độc lập (có nhập nhanh Excel/CSV), gắn lớp vào Bộ mã đề để quét điện thoại tự nhận diện SBD trên mọi mã đề, chấm tự luận theo lô siêu tốc, gán tên học sinh trực tiếp trên giao diện, và xuất **1 bảng điểm hợp nhất toàn lớp**.

---

## 2. Các Kịch bản Người dùng (User Scenarios)

### US1 — Soạn đề A4 ổn định, không mất dữ liệu & xuất Word/PDF hoàn chỉnh (P0/P1)
- Giáo viên mở đề trong `/doc/[id]`, thay đổi phông chữ, cỡ chữ, tô màu nhấn, chèn công thức Toán và hình học TikZ → Xuất PDF hoặc chốt Mã đề không bị lỗi `500`, không mất văn bản trong thẻ `<font>`, không mất chữ ký hiệu đỉnh `$A, B, C, O, x, y$` trên hình vẽ.
- Gõ tiếng Việt bằng bộ gõ Telex/VNI liên tục qua ranh giới ngắt trang A4 không bị mất dấu, không nhảy con trỏ, không mất định dạng `<b>/<i>/<u>` của đoạn văn vắt trang.
- Bấm *"Thay vào đề"* từ AI hoặc *"Áp dụng mẫu đề"* (có hộp thoại xác nhận) có thể nhấn `Ctrl+Z` / `Ctrl+Y` để hoàn tác đến 100 bước.
- Dán nội dung từ Microsoft Word vào trang đề tự động lọc bỏ XML/CSS rác của Office, giữ nguyên đậm/nghiêng/bảng biểu/chỉ số và nhận diện công thức `$...$`.
- Xuất file **`.docx`** mở trên Microsoft Word giữ đúng bố cục 2 cột đầu đề, lưới 1/2/4 cột đáp án A/B/C/D, công thức Toán chỉnh sửa được và hình vẽ độ nét cao.

### US2 — Hỗ trợ trọn vẹn chuẩn đề thi GDPT 2018 / THPT 2025 (P1)
- Soạn, tạo đáp án (AI hoặc chỉnh tay qua `RubricEditorDialog`), trộn mã đề và quét OMR được cả 4 phần thi:
  - **Phần I (`mc`)**: Trắc nghiệm nhiều lựa chọn A, B, C, D.
  - **Phần II (`tf`)**: Trắc nghiệm Đúng/Sai 4 ý `a, b, c, d`, hỗ trợ trộn thứ tự câu, trộn thứ tự 4 ý `a–d` kèm hoán vị đáp án đúng sai, và chấm điểm luỹ tiến Bộ GD&ĐT (`0.1 / 0.25 / 0.5 / 1.0` điểm theo số ý đúng trên thang 1,0đ hoặc tỉ lệ theo tổng điểm câu).
  - **Phần III (`short`)**: Trả lời ngắn (tối đa 4 ký tự gồm dấu âm `-`, dấu phẩy/chấm thập phân, chữ số `0–9`).
  - **Phần IV (`essay`)**: Tự luận chia bước thang điểm; phiếu trả lời tự động tách Phần Tự luận sang trang 2 nếu vượt quá 1 trang A4 thay vì bị cắt mất khung viết bài.
- Hỗ trợ đánh số lại `Câu 1` theo từng `PHẦN`, tiêu đề phần dùng `<h2>` hoặc `<p><b>PHẦN...</b></p>`, và nhãn câu kèm điểm `"Câu 1 (2,0 điểm)."`.

### US3 — Khép kín Kho câu hỏi v2 (P1)
- Khi chốt đề có sẵn Đáp án từ Editor sang Kho câu hỏi, từng câu hỏi tự động mang theo đáp án, điểm và thang chấm bước.
- Trong `/question-bank`, giáo viên xem được ngay nội dung câu hỏi (không phải bấm từng `<details>` hoặc chờ hàng chục `<iframe>` nặng), lọc theo chủ đề/dạng câu/nguồn đề/từ khoá, sửa nội dung & đáp án, xoá câu hỏi hoặc nguồn đề thừa.
- Giáo viên tự tạo, đổi tên, sắp xếp, di chuyển câu giữa các thư mục và **khoá thư mục (`is_locked`)** để AI phân loại tôn trọng tuyệt đối các nhánh đã chốt.
- Giáo viên tích chọn nhiều câu trong Kho để **"Tạo đề mới"** (tạo cả Đề + Đáp án liên kết và mở ngay trong Editor), hoặc từ Editor/AI Panel mở **`BankPickerDialog`** để chèn câu hỏi vào đề đang soạn.

### US4 — Quản lý Lớp học, Ghép đôi Quét bài & Bảng điểm Hợp nhất (P1)
- Trang `/classes` độc lập cho phép tạo/sửa/xoá lớp, thêm/sửa/xoá học sinh, dán danh sách từ Excel/CSV (`SBD, Họ tên`) và tự động kiểm tra trùng mã.
- Khi phát hành Bộ mã đề (`/exam-releases`), giáo viên chọn Lớp học gắn kèm; mã ghép đôi hiển thị QR rõ ràng; trên `/grading/pair` có thể nhập tay mã 6 ký tự; thiết bị quét dùng cookie riêng `sdt_grading_capture` (không làm đăng xuất giáo viên nếu mở trên cùng máy) và chỉ có quyền gửi ảnh/lấy danh sách lớp (không đọc được điểm cả lớp).
- Quét OMR tự động nhận dạng SBD theo danh sách lớp (và vẫn lưu `student_code` ngay cả khi SBD chưa có trong danh sách); tại `/exam-releases/[id]` có tab **"Bảng điểm toàn lớp"** tổng hợp mọi mã đề (`101..112`) vào 1 bảng duy nhất kèm nút xuất CSV/Excel; giáo viên có thể gán hoặc xác nhận tên học sinh trực tiếp ngay trong bảng điểm và danh sách bài nộp.

### US5 — Kiến trúc Backend Đa người dùng & Bảo mật Tài nguyên (P0/P2)
- Chặn xác thực (`requireUser()`), kiểm soát tần suất (`rate-limit.ts`), truyền `AbortSignal` và giới hạn tiến trình song song (`Semaphore`) cho mọi API tốn tài nguyên (`/api/suggestions`, `/api/figures`, `/api/exam-image`, `/api/chat-exam/verify`).
- Ngưng gọi `/api/suggestions` trên từng phím gõ; nén chuỗi `<svg>` thành placeholder gọn trước khi gửi ngữ cảnh đề cho AI.
- Chuẩn hoá lưu trữ sang các bảng quan hệ (`documents`, `bank_topics`, `bank_sources`, `bank_questions`, `bank_org_states`) không còn khoá toàn cục 2 user và giới hạn blob 10MB/24MB.
- Sửa các lỗi vòng đời chấm bài (`addPage` tăng `input_revision`, `regrade` theo đúng `session.mode`, `loadPages` kiểm tra vượt trang chính xác, batch Vision cho tự luận, worker đa luồng).
- Hỗ trợ driver lưu trữ ảnh S3 / Cloudflare R2 song song với Local Disk.

### US6 — Thương hiệu Chuyên nghiệp, Giao diện Đồng nhất & Responsive (P3)
- Xoá bỏ 100% dấu vết `soandethi.com`, pháp nhân bên thứ ba, chữ *"Bản clone"*, và số dư ảo `20.000 điểm`. Mặc định dùng cấu hình thương hiệu **`Hỗ trợ giáo viên`** (cấu hình được qua biến môi trường tại `lib/site.ts`).
- Hoàn chỉnh nội dung `/terms` (gồm các mục `#gia`, `#hoan-tien`, `#khieu-nai`), `/privacy`, `/about`.
- Thay 24 đề cộng đồng cào lỗi bằng 12 đề mẫu K–12 hoàn chỉnh (Toán, Lý, Hoá, Sinh, Anh, Văn, Sử, Địa).
- Thống nhất khung `AppFrame` cho toàn bộ trang sau đăng nhập (`/hub`, `/my-exams`, `/question-bank`, `/exam-releases`, `/classes`, `/grading`, `/memory`, `/exams`), nâng cấp `/hub` thành Bảng điều khiển giáo viên, tối ưu responsive Drawer cho mobile/tablet (`< 1024px`) và thay thế toàn bộ `window.alert/confirm/prompt` bằng `<Dialog>` chuẩn token thiết kế.

---

## 3. Yêu cầu Chức năng (Functional Requirements)

- **FR001**: `renderMathInHtml()` trong `lib/math.ts` PHẢI chạy được cả ở Node.js server lẫn trình duyệt bằng `parse5` (không phụ thuộc `document`), gắn `contenteditable="false"` và không biến nhầm ký tự `$` tiền tệ rời rạc thành công thức.
- **FR002**: `safeExportHtml()` và `sanitizeReleaseHtml()` PHẢI giữ lại toàn bộ văn bản bên trong thẻ `<font>`, `<center>`, `<mark>` (chuyển thành `<span>` hoặc unwrap) và giữ thẻ `<use>` kèm thuộc tính `href`/`xlink:href` trỏ fragment nội bộ `#...`.
- **FR003**: `sceneToTikz()` trong `lib/geometry/tikz.ts` PHẢI tính khung bao gồm cả `polylines` và `circles` để trục toạ độ Parabol không bị cắt cụt.
- **FR004**: Tất cả API AI/LaTeX (`/api/suggestions`, `/api/figures`, `/api/exam-image`, `/api/chat-exam/verify`) PHẢI yêu cầu `requireUser()`, giới hạn tần suất, truyền `req.signal` (AI) hoặc `Semaphore(3)` (`pdflatex`).
- **FR005**: `addPage()` trong `lib/grading/submissions.ts` PHẢI tăng `input_revision`, reset trạng thái chấm và làm mới tổng điểm; `ReceiveTab.regrade` PHẢI tôn trọng `session.mode` và `isPublishedRelease`.
- **FR006**: `loadPages()` trong `lib/grading/grade.ts` PHẢI truy vấn `MAX_PAGES_PER_CALL + 1` (với `MAX_PAGES_PER_CALL = 8`) để phát hiện chính xác bài quá số trang quy định và trả trạng thái `'graded'` khi đạt chuẩn không có cờ xem lại.
- **FR007**: Cookie ghép đôi chấm bài PHẢI tách thành `sdt_grading_capture` độc lập với `sdt_session`; `authorizeSessionCapture` bị giới hạn chỉ xem tên đợt, danh sách lớp và tải trang bài thi lên; `/grading/pair` PHẢI hiển thị form nhập mã 6 ký tự.
- **FR008**: Migration `0015_commercial_foundation.sql` PHẢI tạo bảng chuẩn hoá `documents`, `bank_topics`, `bank_sources`, `bank_questions`, `bank_org_states`, mở rộng `classes`, `exam_releases`, `grading_sessions`, và tự động backfill không làm mất dữ liệu cũ.
- **FR009**: Hệ thống kho đề hỗ trợ `GET/PUT/DELETE /api/documents/[id]` theo từng tài liệu với optimistic concurrency (`revision`) và `POST /api/documents/import` để khôi phục file sao lưu `.json`.
- **FR010**: `lib/server/storage.ts` PHẢI tự động chuyển sang driver S3/Cloudflare R2 khi đủ biến môi trường `S3_*` và giữ tương thích Local Disk ở môi trường dev.
- **FR011**: Trình soạn đề PHẢI cung cấp lịch sử Undo/Redo 100 bước (`lib/editor-history.ts`), bộ lọc dán từ Word (`lib/editor-paste.ts`), phân trang không mất thẻ inline & an toàn với bộ gõ IME tiếng Việt, nút sửa trực tiếp hình vẽ TikZ đã chèn, và 17/17 mục menu hoạt động thật.
- **FR012**: `reconcileStructure()` trong `lib/structured-exam.ts` PHẢI tự chữa lành khi giáo viên bấm `Enter` tách khối hoặc xoá/thêm đoạn cục bộ mà không phá huỷ toàn bộ cấu trúc các câu còn lại.
- **FR013**: Hệ thống PHẢI xuất được file `.docx` thật (`lib/docx-export.ts`) với khổ A4, bảng biểu chuẩn, công thức OMML và ảnh PNG hình vẽ từ `ExportDialog`, `ReleaseDialog`, `EditorMenubar` và `MyExams`.
- **FR014**: `AiPanel` PHẢI gắn kết nút đính kèm ảnh với `/api/exam-image` (OCR); pipeline AI phải nén SVG bằng `compactHtmlForAi`, dùng `action` tường minh từ Planner và bật tự động lưu ghi nhớ bounded.
- **FR015**: `Rubric`, `scores.ts`, `exam-answer-key`, `engine.ts`, `sheet-template.ts` và `omr.ts` PHẢI hỗ trợ đủ 4 dạng câu (`mc`, `tf`, `short`, `essay`), đánh số lại `Câu 1` theo từng Phần, nhãn `Câu N (X điểm).`, trộn ý `a, b, c, d` và tách trang tự luận trên phiếu trả lời.
- **FR016**: Chấm tự luận AI PHẢI gộp mọi câu tự luận của một bài vào 1 cuộc gọi Vision duy nhất và worker hàng đợi hỗ trợ `WORKER_CONCURRENCY = 3`.
- **FR017**: Kho câu hỏi v2 PHẢI hỗ trợ tự ánh xạ đáp án khi chốt, sửa/xoá câu hỏi & nguồn đề, quản lý thư mục chủ đề (kèm `is_locked`), chọn câu dựng đề mới hoặc chèn vào Editor (`BankPickerDialog`).
- **FR018**: Phân hệ `/classes` PHẢI hỗ trợ CRUD lớp/học sinh + nhập nhanh CSV/Excel; Bộ mã đề `/exam-releases` cho phép gắn lớp, hiển thị bảng điểm tổng hợp mọi mã đề và xuất CSV; giao diện chấm bài có bộ chọn gán học sinh & xác nhận tên OCR.
- **FR019**: Toàn bộ giao diện mới và sửa đổi PHẢI tuân thủ nghiêm ngặt quy tắc design token tại `e2e/unit/design-tokens.spec.ts` (không hex màu cứng ngoài allowlist, không sắc tím, tối đa 3 bậc `rounded-sm | rounded-md | rounded-lg`).

---

## 4. Tiêu chí Nghiệm thu (Success Criteria)

- **SC001**: `pnpm exec tsc --noEmit` đạt 0 lỗi; `pnpm db:migrate` thành công trên cả DB trắng và DB có dữ liệu mẫu 0001–0014.
- **SC002**: Toàn bộ unit test (`e2e/unit/` gồm cả `design-tokens.spec.ts`, `docx-export.spec.ts`, `thpt2025-engine-omr.spec.ts`) đạt 100% pass.
- **SC003**: Toàn bộ bộ E2E Playwright (`pnpm test`) + kịch bản khép kín `e2e/commercial-loop.spec.ts` chạy pass trên bản build production (`pnpm build`).
- **SC004**: Xuất thành công bản build dưới subpath `NEXT_BASE_PATH=/soandethi pnpm build` không lỗi.
- **SC005**: Kiểm tra bằng grep không còn bất kỳ chuỗi thương hiệu cũ (`soandethi`, `Ngũ Thành An`, `04020305266`, `Bản clone`) trong `app/`, `components/`, `lib/`.
