# Implementation Plan: Làm lại toàn bộ giao diện

**Feature**: [spec.md](./spec.md) · **Created**: 2026-11-05

## Hướng kỹ thuật

Toàn bộ hình thức đi qua một tầng token trong `app/globals.css`; mã nguồn chỉ tham chiếu biến, không
viết giá trị màu trực tiếp. Nhờ vậy chỉ số SC-001 (0 màu ngoài token) kiểm được bằng máy.

## Quyết định hình thức

**Màu** (sáng, trung tính, một màu nhấn, không tím):

| Token | Giá trị | Dùng cho |
| --- | --- | --- |
| `--ink` | `#17171a` | chữ chính, viền nút đậm |
| `--ink-2` | `#5b5b64` | chữ phụ |
| `--ink-3` | `#8a8a93` | chữ mờ, nhãn nhỏ |
| `--line` | `#e7e7ea` | đường kẻ, viền thẻ |
| `--line-strong` | `#d5d5da` | viền ô nhập, nút phụ |
| `--surface` | `#ffffff` | nền cột nội dung |
| `--surface-2` | `#fafafa` | nền thanh bên, panel |
| `--surface-3` | `#f2f2f3` | rê chuột, nền ô tìm kiếm |
| `--accent` | `#0b63d6` | hành động chính, liên kết |
| `--accent-soft` | `#eaf2fe` | nền nhấn nhạt |
| `--ok` `--warn` `--danger` | `#1a7f4b` `#a8620a` `#c0362c` | trạng thái |

**Bo góc** — đúng ba bậc: `--r-sm: 4px` (nhãn, chip, nút nhỏ), `--r-md: 6px` (nút, ô nhập, thẻ,
panel), `--r-lg: 10px` (hộp thoại). Vòng tròn chỉ dùng cho ảnh đại diện và chấm trạng thái.

**Chữ** — một font không chân (Inter) cho toàn hệ; bỏ `Newsreader`; thang cỡ 11/12/13/14/16/20/24.

**Mật độ** — chiều cao hàng 36–40px, đệm khối 12–16px; bảng và danh sách ưu tiên quét mắt.

## Các giai đoạn

1. **Tầng token** — viết lại `app/globals.css`: biến màu/bo góc/khoảng cách, bỏ font serif.
2. **Thay màu viết cứng** — ánh xạ 66 giá trị hex sang biến; hạ bo góc về ba bậc.
3. **Thành phần dùng chung** — nút, ô nhập, hộp thoại, menu theo token mới.
4. **Khung làm việc** — thanh bên, header, panel phải; giữ nguyên một nút thu gọn mỗi cạnh.
5. **Nhóm màn đã đăng nhập** — sảnh tính năng, thư viện đề, danh sách và bàn làm việc chấm bài,
   bước tạo đợt chấm.
6. **Trình soạn đề** — chỉ thay hình thức, giữ nguyên bố cục ba cột; bỏ logo lặp.
7. **Trang công khai** — bỏ khẩu hiệu, còn tiêu đề trung tính và phần mô tả cần thiết.
8. **Màn quét trên điện thoại** — kiểm và chỉnh cho bề rộng 390px.
9. **Chốt** — kiểm 15 màn ở hai bậc bề rộng, chạy 90 test, kiểm bề mặt in, deploy.

## Kiểm chứng

- Thêm một kiểm thử đọc mã nguồn và báo lỗi nếu có giá trị màu viết cứng ngoài `globals.css`.
- Chụp ảnh từng màn ở 1512px và 390px để đối chiếu trước/sau.
- Bề mặt in: dựng lại đề A4 và phiếu trả lời, so số trang với bản trước khi đổi.
