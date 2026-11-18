# Tasks: Làm lại toàn bộ giao diện

**Feature**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

## Giai đoạn 1 — Tầng token
- [x] T001 Viết lại `app/globals.css`: biến màu, bo góc, khoảng cách, đổ bóng; bỏ font serif
- [x] T002 Ánh xạ toàn bộ giá trị hex trong `app/` + `components/` sang biến token
- [x] T003 Hạ bo góc về ba bậc, thống nhất nơi dùng

## Giai đoạn 2 — Thành phần dùng chung
- [x] T004 Nút: một kiểu chính, một kiểu phụ, một kiểu im lặng; đủ trạng thái
- [x] T005 Ô nhập, hộp thoại, menu theo token mới
- [x] T006 Nhãn trạng thái: `components/ui/badge.tsx`, dùng ở danh sách đợt chấm

## Giai đoạn 3 — Khung làm việc
- [x] T007 Thanh bên: mật độ công cụ, tìm nhanh, mục gần đây
- [x] T008 Header và panel phải: một nút thu gọn mỗi cạnh
- [x] T009 Kiểm thu gọn trên máy tính và ngăn kéo trên điện thoại

## Giai đoạn 4 — Màn đã đăng nhập
- [x] T010 Sảnh tính năng
- [ ] T011 Thư viện đề
- [x] T012 Danh sách đợt chấm
- [ ] T013 Bàn làm việc chấm bài (sáu thẻ)
- [x] T014 Bước tạo đợt chấm

## Giai đoạn 5 — Trình soạn đề
- [x] T015 Thay hình thức, giữ nguyên bố cục ba cột
- [x] T016 Bỏ logo lặp ở header trình soạn

## Giai đoạn 6 — Trang công khai
- [x] T017 Trang chủ: bỏ khẩu hiệu, còn tiêu đề trung tính
- [ ] T018 Kho đề cộng đồng, điều khoản, chính sách (trang chủ + giới thiệu đã xong)

## Giai đoạn 7 — Điện thoại
- [ ] T019 Màn quét bài và màn ghép máy ở bề rộng 390px

## Giai đoạn 8 — Chốt
- [x] T020 Kiểm thử chặn màu viết cứng
- [x] T021 Chụp ảnh 15 màn ở hai bậc bề rộng
- [x] T022 Chạy 90 test, kiểm bề mặt in, deploy
