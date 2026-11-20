# Kế hoạch Kiến trúc & Triển khai Kỹ thuật (005-commercial-readiness)

**Tính năng**: `005-commercial-readiness`  
**Ngày lập**: 2026-11-18  
**Tài liệu liên quan**: [spec.md](./spec.md) · [data-model.md](./data-model.md) · [api-and-export.md](./contracts/api-and-export.md) · [tasks.md](./tasks.md)

---

## 1. Bối cảnh Kỹ thuật & Ràng buộc Hệ thống

- **Ngăn xếp hiện tại**: Next.js 15.5 (`App Router`), React 19, TypeScript 5.7 strict, Tailwind CSS v4, PostgreSQL (`pg` + migration tuần tự `db/migrations/`), KaTeX 0.19, MathLive 0.111, `parse5` 8.1, `jsqr`, `qrcode`, Playwright 1.56.
- **Ràng buộc tương thích bắt buộc**:
  1. **Design Tokens (`e2e/unit/design-tokens.spec.ts`)**: Toàn bộ tệp trong `app/` và `components/` **tuyệt đối không** viết mã màu `#hex` trực tiếp (trừ allowlist có sẵn) hoặc dùng các lớp Tailwind mặc định kiểu `bg-neutral-*`, `text-gray-*`, `indigo/violet/purple`; bo góc chỉ dùng 3 mức `rounded-sm`, `rounded-md`, `rounded-lg`. Mọi giao diện mới bắt buộc sử dụng token trong `app/globals.css` (`bg-surface-2`, `text-ink`, `text-ink-3`, `border-line`, `bg-accent`...).
  2. **Subpath Deployment (`NEXT_BASE_PATH`)**: Mọi `fetch` API phía client phải đi qua `apiUrl()` (`lib/api-url.ts`), không gọi cứng `fetch('/api/...')`.
  3. **Bảo vệ dữ liệu hiện có**: Các migration phải là additive + backfill idempotent; không phá hỏng dữ liệu người dùng đang có.

---

## 2. Quyết định Kiến trúc Cốt lõi

### 2.1 Chiến lược nâng cấp Trình soạn đề: Block-Safe + History Stack (thay vì viết lại hoàn toàn bằng TipTap)
- **Lý do chọn**: Trình soạn đề hiện tại đã tinh chỉnh kích thước trang A4 chuẩn `793.7 × 1122.5 px`, hỗ trợ MathLive popover, SVG TikZ inline, lưới đáp án tự đo cột (`measureColumns`) và đồng bộ `data-sdt-block` của `StructuredExam`. Thay bằng TipTap toàn phần sẽ làm gãy toàn bộ bộ test E2E và đòi hỏi viết lại toàn bộ schema NodeView cho `.doc-header`, `.doc-grid`, `.doc-figure`, `StructuredExam`.
- **Cách làm chuẩn thương mại**:
  1. Giữ bề mặt A4 hiện tại nhưng **ngắt vòng lặp phá DOM trên từng phím gõ**: bỏ chạy `relayout()` ngay sau mỗi `onInput`; chỉ chạy sau `debounce(250ms)` và tuyệt đối bỏ qua khi đang gõ tiếng Việt IME (`compositionstart` → `compositionend`).
  2. Tách biệt **lớp trạng thái lịch sử (`useEditorHistory`)** gồm 100 snapshot `{ html, structure }`: mọi thao tác AI Replace/Append, Áp dụng mẫu, Sửa công thức, Chèn/Sửa hình vẽ đều đẩy snapshot vào stack để `Ctrl+Z` / `Ctrl+Y` khôi phục tức thì.
  3. Cô lập hoàn toàn node đặc biệt (`contentEditable="false"` cho `.doc-math` và `figure.doc-figure`), bổ sung tự phục hồi `reconcileStructure()` khi người dùng `Enter` tách đoạn hoặc thêm/xoá khối cục bộ.
  4. Sửa `lib/split-text.ts` đo bằng container ẩn có class `.doc-page` và **không bao giờ** ghi đè `.textContent` lên đoạn chứa thẻ `<b>`, `<i>`, `<u>`, `.doc-math`.

### 2.2 Chiến lược Database & Storage: Chuẩn hoá Quan hệ + S3/R2 Pluggable
- Tách `document_libraries` (10 MB JSONB) → bảng `documents` (`PUT /api/documents/[id]` lưu từng đề riêng lẻ kèm optimistic revision).
- Tách `question_banks` (24 MB JSONB + khoá toàn cục 2 người) → 4 bảng `bank_topics`, `bank_sources`, `bank_questions`, `bank_org_states`; thay lưu lặp `blocks.html + blocks.text` bằng `block_ranges`; thay khoá toàn cục bằng khoá theo `owner_id` + `Semaphore(AI_BANK_CONCURRENCY)`.
- Hỗ trợ driver S3/Cloudflare R2 nhẹ bằng `node:crypto` (AWS SigV4) + `fetch` trong `lib/server/storage.ts`, tự kích hoạt khi có `S3_*` env vars, không làm nặng bundle hoặc phụ thuộc SDK bên thứ ba.

### 2.3 Chiến lược Xuất Word (`.docx`)
- Cài đặt thư viện `docx` (pure TypeScript) chạy trực tiếp tại browser (hoặc qua helper dùng chung).
- Chuyển đổi trực tiếp cây HTML đã render Toán (`data-latex`) + Hình vẽ (`<svg>` / `<img>`) sang cấu trúc OpenXML chuẩn của Microsoft Word (bảng ẩn viền cho `.doc-header` và `.doc-grid`, OMML `Math` cho công thức cơ bản/phổ thông, ảnh PNG raster hoá từ SVG cho hình học TikZ).

### 2.4 Chiến lược Hỗ trợ Chuẩn Đề GDPT 2018 / THPT 2025
- Mở rộng đồng bộ theo trục dọc từ gốc đến ngọn:
  `Chat-Exam AI Prompt` → `Exam-Answer-Key + RubricEditorDialog` → `Rubric v2 (mc, tf, short, essay)` → `Release Engine v2 (renumber by section, shuffle tf a-d, fix context theft)` → `SheetTemplate v2 (Multi-page + TF + Short)` → `OMR v2 (Adaptive Threshold)` → `Batched Essay Vision & Concurrent Worker`.

### 2.5 Chiến lược Thương hiệu & Giao diện
- Gom toàn bộ thông tin thương hiệu vào `lib/site.ts` đọc từ biến môi trường (`NEXT_PUBLIC_APP_NAME` mặc định `'Hỗ trợ giáo viên'`, `NEXT_PUBLIC_COMPANY_NAME`, `NEXT_PUBLIC_SUPPORT_PHONE`, `NEXT_PUBLIC_CONTACT_EMAIL`), giúp chủ dự án dễ dàng đổi tên công ty thương mại chỉ qua `.env` mà không cần sửa code UI.

---

## 3. Phân chia 6 Giai đoạn Thực thi & Kiểm soát Rủi ro

| Giai đoạn | Trọng tâm | Điều kiện qua cổng (Gate) |
| :--- | :--- | :--- |
| **Giai đoạn 1** | Vá lỗi P0 (Crash 500 Math SSR, mất chữ `<font>`, mất nhãn `<use>` SVG, Parabol $Oy$, đốt token `/api/suggestions`, bảo mật `/api/figures` & `/api/exam-image`, sửa `addPage` `input_revision`, `regrade`, `loadPages`, tách cookie capture & trang `/grading/pair`) | `tsc --noEmit` sạch + test export/release có công thức Toán + TikZ pass |
| **Giai đoạn 2** | Chuẩn hoá DB `0015_commercial_foundation.sql`, Per-Document API & Import sao lưu, Relational Question Bank Store, Storage S3/R2 | `pnpm db:migrate` chạy sạch cả DB trống và DB có dữ liệu mẫu 0001–0014 |
| **Giai đoạn 3** | Editor A4 v2 (`editor-history.ts`, `editor-paste.ts`, IME-safe pagination, sửa lại TikZ, 17/17 menu, self-healing `StructuredExam`), Xuất Word `.docx`, AI Pipeline v2 (OCR ảnh trong `AiPanel`, nén SVG, sửa `verify`, tắt bão `FOR UPDATE`) | Unit tests `docx-export.spec.ts`, `structured-exam.spec.ts`, `editor-export.spec.ts` pass |
| **Giai đoạn 4** | GDPT 2018 / THPT 2025 (Đúng/Sai 4 ý, Trả lời ngắn, đánh số lại theo Phần, `RubricEditorDialog`), OMR v2 (Adaptive Threshold + 2 trang tự luận), Batch Essay Vision & Worker đa luồng | Unit & integration tests `thpt2025-engine-omr.spec.ts`, `scores.spec.ts`, `grading-integrity.spec.ts` pass |
| **Giai đoạn 5** | Khép kín Kho câu hỏi v2 (`BankPickerDialog`, tạo đề từ câu đã chọn, CRUD + khoá chủ đề), Quản lý Lớp học `/classes` + nhập CSV, Bộ mã đề gắn Lớp & Bảng điểm hợp nhất + Gán tên học sinh | Test luồng Kho câu hỏi → Tạo đề → Lớp → Bộ mã đề → OMR SBD → Bảng điểm CSV pass |
| **Giai đoạn 6** | Thương hiệu `Hỗ trợ giáo viên`, `/terms` & `/privacy` thật, 12 đề mẫu K–12, thống nhất `AppFrame`, Mobile/Tablet drawers, thay `alert/confirm/prompt` bằng `<Dialog>`, kiểm tra toàn bộ E2E & Subpath Build | `design-tokens.spec.ts` pass, `pnpm build` + `pnpm test` pass 100%, `NEXT_BASE_PATH=/soandethi pnpm build` pass |

---

## 4. Phương án Rollback (Khôi phục An toàn)
- Migration `0015` giữ nguyên bảng `document_libraries` và `question_banks`; toàn bộ code đọc mới ưu tiên bảng quan hệ và có fallback đọc dữ liệu cũ nếu cần.
- Driver S3 mặc định tắt nếu không khai báo `S3_BUCKET` nên môi trường dev/staging vẫn chạy 100% self-contained không cần tài khoản cloud.
