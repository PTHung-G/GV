# Hợp đồng API, Bảo mật & Xuất bản `.docx` / PDF (005-commercial-readiness)

## 1. Hợp đồng API Tài liệu (`documents`)

| Endpoint | Method | Mô tả | Concurrency / Validation |
| :--- | :--- | :--- | :--- |
| `/api/documents` | `GET` | Trả về `{ documents, revision }` đọc từ bảng `documents` | `requireUser()`, sắp xếp `updated_at desc` |
| `/api/documents` | `PUT` | Tương thích ngược đồng bộ cả danh sách (dành cho test cũ & sync hàng loạt) | Khớp `ownerId`, giới hạn kích thước từng doc 2 MB |
| `/api/documents/[id]` | `PUT` | **Autosave 1 tài liệu duy nhất** `{ doc, expectedRevision }` | So sánh `documents.revision = expectedRevision`, trả `409 doc_conflict` nếu tab khác sửa mới hơn, trả về `{ revision }` mới |
| `/api/documents/[id]` | `DELETE` | Xoá 1 đề thi cùng `answer-key` con (`parent_id = id`) | Transaction `owner_id = user.id` |
| `/api/documents/import` | `POST` | Khôi phục từ file `sao-luu-kho-de.json` | Gọi `mergeImportedDocuments`, không ghi đè đề trùng ID |

---

## 2. Hợp đồng API Kho câu hỏi v2 (`question-bank`)

| Endpoint | Method | Mô tả |
| :--- | :--- | :--- |
| `/api/question-bank` | `GET` | Trả `BankEnvelope` gọn nhẹ (câu hỏi, cây chủ đề, metadata nguồn); `rawHtml` nguồn có thể load lazy nếu tổng vượt 2 MB |
| `/api/question-bank/sources/[id]` | `GET` | Tải đầy đủ `rawHtml` & `blocks` của 1 nguồn (đã có route, nối vào UI) |
| `/api/question-bank/sources/[id]` | `DELETE` | Xoá 1 nguồn đề và toàn bộ câu hỏi thuộc nguồn đó (`cascade`) |
| `/api/question-bank/questions/[id]` | `PATCH` | Sửa nội dung (`customHtml`), nhãn (`label`), phân loại (`topicId`), đáp án/điểm/thang chấm (`questionType`, `answer`, `points`, `rubricSteps`) |
| `/api/question-bank/questions/[id]` | `DELETE` | Xoá 1 câu hỏi khỏi kho |
| `/api/question-bank/topics` | `POST` | Tạo thư mục chủ đề mới `{ label, parentId, isLocked?, scopeNote? }` |
| `/api/question-bank/topics` | `PATCH` | Đổi tên, chuyển cha (chống chu trình), đổi trạng thái `isLocked` hoặc chuyển hàng loạt câu hỏi sang chủ đề khác |
| `/api/question-bank/topics` | `DELETE` | Xoá thư mục rỗng (chặn xoá `root` hoặc thư mục đang còn câu hỏi trừ khi truyền `moveToTopicId`) |
| `/api/question-bank/assemble` | `POST` | Nhận `{ title, subject, grade, questionIds: string[], includeAnswerKey: boolean }` → dựng `ExamDoc` mới có `StructuredExam` hợp lệ + `answer-key` doc liên kết, lưu vào `documents` và trả `{ docId, answerKeyId }` |

---

## 3. Hợp đồng API Lớp học, Bộ mã đề & Chấm bài

### 3.1 Lớp học & Học sinh (`/api/classes`)
- `GET /api/classes`: Danh sách lớp (kèm `studentCount`, `academicYear`, tuỳ chọn `?includeArchived=true`).
- `POST /api/classes`: Tạo lớp mới `{ name, grade?, subject?, academicYear?, students?: Array<{ code?: string; name: string }> }`.
- `GET /api/classes/[id]`: Chi tiết lớp + danh sách học sinh.
- `PATCH /api/classes/[id]`: Cập nhật tên lớp, khối, môn, năm học, lưu trữ (`archived`).
- `DELETE /api/classes/[id]`: Xoá lớp (các `grading_sessions` và `exam_releases` đặt `class_id = null`, bảo toàn dữ liệu lịch sử đã chấm).
- `POST /api/classes/[id]/students`: Thêm đơn lẻ hoặc nhập hàng loạt từ CSV/Excel (`{ students: Array<{ code?, name }>, mode: 'append' | 'upsert' }`), kiểm tra trùng `code` (không phân biệt hoa thường) trả lỗi `409 duplicate_student_code`.
- `PATCH / DELETE /api/classes/[id]/students/[studentId]`: Sửa tên/SBD hoặc xoá học sinh.

### 3.2 Bộ mã đề & Bảng điểm hợp nhất (`/api/exam-releases`)
- `GET /api/exam-releases`: Danh sách mọi bộ mã đề của giáo viên (hỗ trợ lọc `?sourceExamId=...`), kèm số mã đề, tên lớp gắn kèm và tiến độ bài đã chấm.
- `POST /api/exam-releases`: Bổ sung trường tuỳ chọn `classId?: string`; nếu có `classId`, gắn xuống `exam_releases.class_id`, `exam_releases.class_name` và mọi `grading_sessions` của từng mã đề.
- `PATCH /api/exam-releases/[id]`: Cập nhật `{ classId: string | null }` (gắn hoặc đổi lớp sau khi phát hành) và đồng bộ xuống mọi `grading_sessions` thuộc bộ mã đề đó.
- `GET /api/exam-releases/[id]/gradebook`:
  - Trả JSON `{ release, classRoster, variants, rows, summary }`, trong đó mỗi `row` tổng hợp trạng thái từng học sinh qua tất cả mã đề (hiện rõ `absent` nếu có danh sách lớp mà chưa nộp, `duplicate` nếu nộp >1 mã đề, điểm từng phần `mcScore`, `tfScore`, `shortScore`, `essayScore`, `totalScore`).
  - Hỗ trợ query `?format=csv`: xuất file `.csv` có UTF-8 BOM (`\uFEFF`) mở thẳng trên Microsoft Excel không lỗi font tiếng Việt.

### 3.3 Phân tách Quyền Thiết bị Quét (`sdt_grading_capture`)

| Endpoint | `user` (Giáo viên) | `capture` (Điện thoại ghép đôi) |
| :--- | :---: | :---: |
| `GET /api/grading/capture` | ✅ | ✅ (chỉ đợt chấm được ghép) |
| `POST /api/grading/sessions/[id]/submissions` | ✅ | ✅ |
| `POST /api/grading/submissions/[id]/pages` | ✅ | ✅ |
| `POST /api/grading/submissions/[id]/omr` | ✅ | ✅ |
| `POST /api/grading/submissions/[id]/complete` | ✅ | ✅ |
| `GET /api/grading/sessions/[id]/submissions` (xem điểm cả lớp) | ✅ | ❌ (`403 teacher_only`) |
| `GET /api/grading/sessions/[id]/review` & `/stats` | ✅ | ❌ (`403 teacher_only`) |
| `GET /api/grading/pages/[id]` (xem ảnh bài thi học sinh) | ✅ | ❌ (`403 teacher_only`) |
| `PATCH / DELETE /api/grading/submissions/[id]` | ✅ | ❌ (`403 teacher_only`) |

---

## 4. Hợp đồng Bảo mật AI, LaTeX & Làm sạch HTML Isomorphic

### 4.1 Giới hạn & Xác thực AI/LaTeX Endpoints
- `POST /api/suggestions`: `requireUser()` + Rate Limit `20 req / phút / user` + truyền `req.signal` vào `complete()`.
- `POST /api/figures`: `requireUser()` + Rate Limit `30 req / phút / user` + `Semaphore(3)` bọc `compileTikz()` trong `lib/server/latex.ts`.
- `POST /api/exam-image`: `requireUser()` + Rate Limit `10 req / phút / user` + `images.length <= 6`, chỉ chấp nhận `image/png | image/jpeg | image/webp`, truyền `req.signal` vào `complete()`.
- `POST /api/chat-exam/verify`: `requireUser()`.

### 4.2 Bộ lọc HTML Xuất bản (`editor-export.ts` & `render-server.ts`)
- **Xử lý `<font>` / `<center>` / `<mark>`**:
  - `<font face="..." size="..." color="...">` → chuyển đổi thuộc tính sang `<span style="font-family:...;font-size:...;color:...">` (ánh xạ legacy size `1..7` sang `pt` hợp lệ), luôn **giữ lại mọi node con** (tuyệt đối không gọi `node.remove()`).
- **Xử lý `<use>` trong TikZ SVG**:
  - Cho phép tag `use` trong cả client (`TAGS`) và server (`passiveTags`).
  - Cho phép thuộc tính `href` và `xlink:href` **duy nhất trên thẻ `use`** khi và chỉ khi giá trị khớp `/^\#[A-Za-z0-9_.:-]+$/`. Mọi giá trị chứa URL ngoài (`http:`, `data:`, `//`) đều bị xoá thuộc tính.
- **Render Toán Isomorphic (`lib/math.ts`)**:
  - Sử dụng `parseFragment` và `serialize` từ `parse5` (đã có sẵn trong `package.json`).
  - Không đụng tới text bên trong `<math>`, `<svg>`, `<code>`, `<pre>`, `<script>`, `<style>`.
  - Với các cặp `$...$` trên cùng dòng, chỉ coi là Toán khi **không** khớp mẫu tiền tệ kiểu `$\d` ngay trước khoảng trắng/chữ tiếng Việt rõ ràng mà không có toán tử LaTeX (`^`, `_`, `\`, `=`, `+`, `-`, `/`, `{`) — giảm thiểu false-positive giá tiền `$10 và $20`.

---

## 5. Hợp đồng Xuất Microsoft Word (`.docx`) (`lib/docx-export.ts`)

- **Thư viện**: `docx` (tạo gói OpenXML chuẩn ISO/ECMA-376 chạy trực tiếp trên trình duyệt để tải ngay lập tức không tốn băng thông server, đồng thời hỗ trợ export unit-test trên Node.js).
- **Thông số Trang**:
  - Khổ A4: `width: 11906 twips` (210mm), `height: 16838 twips` (297mm).
  - Lề trang: `top: 1020` (18mm), `bottom: 1020` (18mm), `left: 1134` (20mm), `right: 850` (15mm).
  - Font mặc định: `Times New Roman`, `26 half-pt` (13pt), `line: 300` (1.25x spacing).
- **Ánh xạ Phần tử HTML → OpenXML**:
  - `.doc-header` → `Table` 2 cột (`width: 42% / 58%`), `borders: NONE`, căn giữa từng cột.
  - `.doc-grid` → `Table` ẩn viền với số cột bằng `data-columns` (`1`, `2` hoặc `4`), mỗi `.doc-grid-cell` là 1 `TableCell`.
  - `.doc-math` → Chuyển `data-latex` sang `Math` run của gói `docx` (các ký tự mũ/chỉ số/phân số/căn cơ bản sang `MathRun` / `MathFraction` / `MathSuperScript` / `MathSubScript` / `MathRadical`; công thức phức tạp rơi về `MathRun` đọc được hoặc ảnh SVG fallback sạch, không mất chữ).
  - `<figure class="doc-figure"><svg>` & `<img src="data:image/...">` → Chuyển `<svg>` qua `<canvas>` (trên trình duyệt, scale 2x–3x tương đương ~288 DPI) sang `Uint8Array` PNG nhúng qua `ImageRun` kèm `figcaption` căn giữa bên dưới.
  - `.page-break` / `[data-page-break]` → `Paragraph` có `pageBreakBefore: true`.
  - Bảng dữ liệu `<table>` → `Table` có đường viền mảnh `SINGLE` màu `#555555`, giữ `colspan` / `rowspan` và nền tiêu đề bảng.
