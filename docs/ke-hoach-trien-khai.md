# Kế hoạch triển khai — Chấm bài thi

Bám theo `docs/cham-bai.md`. Mỗi giai đoạn là một mốc **build + test được**, không để dở dang.

## Tình trạng thực tế (cập nhật cuối cùng)

| Giai đoạn | Trạng thái | Ghi chú |
|---|---|---|
| P0 Nền móng | ✅ Xong | PostgreSQL 16 dev, migration runner, storage riêng tư, auth server thật (scrypt + cookie HttpOnly) |
| P1 Đợt chấm | ✅ Xong | Snapshot đề + rubric đóng băng, validate chặt, API tạo/list/chi tiết |
| P2 Nhận bài | ✅ Xong | Ghép thiết bị bằng mã một lần, upload nhiều trang, chống trùng bằng SHA-256, SSE tiến độ |
| P3 Chấm | ✅ Xong | Worker nền, job idempotent, vision cho trắc nghiệm/tự luận, **OMR thật cho phiếu chuẩn**, code tự tính tổng |
| P4 Giao diện | ✅ Xong | `/grading`, `/grading/new`, `/grading/[id]` (6 tab gồm Thống kê), `/grading/pair/[code]`, `/grading/capture` |
| P5 Kiểm định | ✅ Xong | 53 test (24 cũ + 11 unit điểm/CSV + 12 unit phiếu/OMR + 6 e2e chấm bài), build + chạy thật trên domain |

### Đã chạy được thật

- Đăng nhập bằng tài khoản lưu ở PostgreSQL, mọi API chấm bài kiểm quyền theo chủ sở hữu.
- Tạo đợt chấm từ đề có sẵn; rubric được sao lưu bất biến vào `exam_snapshots` + `rubric_revisions`.
- Ghép điện thoại bằng QR/mã 8 ký tự dùng một lần; phiên điện thoại chỉ tải được bài lên đúng đợt đó.
- Tải ảnh nhiều trang cho một bài, phát hiện ảnh trùng, từ chối tệp không phải ảnh.
- Worker tự chấm: đọc trắc nghiệm (A/B/C/D + độ tin cậy) và chấm tự luận theo từng bước barem, **trích dẫn câu chữ của học sinh làm căn cứ**.
- Giáo viên sửa đáp án trong lưới, sửa điểm từng bước, xác nhận bài, chấm lại; mọi thay đổi ghi `audit_events`.
- Bảng điểm phân biệt điểm dự kiến/đã duyệt, xuất CSV UTF-8 BOM dùng dấu `;` và dấu phẩy thập phân, chốt đợt có kiểm tra ngoại lệ.

### Chưa làm (cần biết trước khi hứa với người dùng)

- **Đối chiếu tên gần giống**: model đọc được tên/mã trên bài và lưu thành gợi ý, nhưng chưa so khớp mờ với danh sách lớp để hiện "có phải em này không".
- **Nhiều giáo viên cùng một đợt chấm**.
- **PDF đề thi**: nguồn "đề bên ngoài" nhận ảnh chụp và văn bản dán tay, chưa đọc trực tiếp PDF nhiều trang.
- **Ảnh thumbnail**: lưới bài vẫn tải ảnh gốc 2000px thay vì bản thu nhỏ.
- **Đồng bộ nhiều máy tính**: một đợt do một tài khoản sở hữu; chưa có chia sẻ cho đồng nghiệp.
- **Kiểm định chữ viết tay thật**: mới thử trên ảnh chụp bài in/chụp màn hình. Chưa đo độ chính xác trên chữ viết tay học sinh.
- **Vận hành production**: `AUTH_AUTO_PROVISION` đang bật cho tiện demo (phải tắt), chưa có sao lưu, chưa có chính sách xoá ảnh theo thời hạn, chưa cấu hình Supabase.

### Cách chạy

```bash
docker compose --env-file .data/dev-db.env -f compose.dev-db.yml up -d --wait
pnpm db:migrate
pnpm dev            # http://localhost:3000/grading
```

Biến môi trường cần: `DATABASE_URL` (bắt buộc cho tính năng chấm), `AI_API_KEY` (bắt buộc để chấm bằng AI), `UPLOAD_DIR` (tuỳ chọn, mặc định `.data/uploads`).

## Nguyên tắc

1. Nền móng trước: DB, migration, storage, auth. Không viết UI trên nền giả.
2. Không phá 24 test hiện có; `tsc` và `next build` sạch sau mỗi giai đoạn.
3. API server kiểm quyền; không tin `userId` do client gửi.
4. Mỗi bảng có migration riêng, chạy lại được nhiều lần (idempotent qua `schema_migrations`).
5. Ảnh là dữ liệu riêng tư: thư mục ngoài `public`, chỉ phục vụ qua route có kiểm quyền.

## Định nghĩa hoàn thành (mỗi giai đoạn)

- `pnpm exec tsc --noEmit` sạch.
- `pnpm exec next build` thành công.
- Migration chạy được trên DB dev trống và trên DB đã có dữ liệu.
- Có ít nhất một kiểm tra tự động hoặc lệnh chứng minh giai đoạn đó chạy.

## Bước tiếp theo đề xuất

1. Đo độ chính xác trên 30–50 bài viết tay thật trước khi công bố bất kỳ con số nào.
2. So khớp mờ tên viết tay với danh sách lớp để gợi ý vài ứng viên.
3. Ảnh thumbnail riêng cho lưới bài (đang tải ảnh gốc 2000px cho ô 96px).
4. Sao lưu, chính sách xoá ảnh, và chuyển sang Supabase khi triển khai thật.
