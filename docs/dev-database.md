# Database dev cho chấm bài

Đã tạo PostgreSQL 16 bằng Docker Compose riêng của dự án. Không sử dụng hay sửa database của ứng dụng khác.

- Database: `soandethi_dev`.
- User: `sdt_dev` (chỉ dùng dev, chưa phải role runtime production).
- Endpoint trên host: `127.0.0.1:54329`.
- Credentials và DATABASE_URL: `.data/dev-db.env`, quyền 600, nằm trong đường dẫn gitignored. Không commit hoặc đưa vào client bundle.
- Volume bền vững: `trangchugiaovien_grading_pgdata`.
- Cấu hình: `compose.dev-db.yml`.

```bash
docker compose --env-file .data/dev-db.env -f compose.dev-db.yml up -d --wait
docker compose --env-file .data/dev-db.env -f compose.dev-db.yml exec -T db psql -U sdt_dev -d soandethi_dev
```

Đã xác minh kết nối bằng SELECT và binding loopback. Chưa tạo schema nghiệp vụ, chưa nối backend ứng dụng, chưa thay auth mô phỏng. Database chưa có dữ liệu học sinh.

Ứng dụng chạy trực tiếp trên host có thể dùng DATABASE_URL trên. Nếu ứng dụng chuyển vào container, phải dùng mạng Docker và hostname service thích hợp, không dùng loopback của container.

## Sang Supabase sau này

Dùng SQL migrations PostgreSQL chuẩn trong repo khi triển khai schema. Không phụ thuộc trực tiếp vào auth.users ở schema dev; có lớp ánh xạ danh tính ứng dụng sang provider auth. Khi chuyển production cần cấu hình Supabase Auth, Storage, RLS/phân quyền, TLS và connection pool phù hợp, rồi chạy migration và kiểm tra import dữ liệu. Không phải chỉ thay URL là đủ cho cả auth và ảnh.

Dev chưa có sao lưu tự động. Trước khi lưu dữ liệu thật phải có backup, restore test, hạn mức, retention và các kiểm tra phân quyền.
