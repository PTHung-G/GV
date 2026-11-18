# Bản mô tả logo — soandethi.com

Tài liệu này để bạn mang sang một công cụ tạo ảnh (hoặc thuê người vẽ) và nhận về một bộ logo
dùng được ngay trong mã nguồn.

Điều quan trọng nhất: **logo phải là một hình khối phẳng, vẽ được bằng vài nét**, vì nó sẽ sống ở
ba kích thước rất khác nhau — 24px trên thanh địa chỉ, 28px ở header, và in trên phiếu trả lời.

---

## 1. Logo hiện tại và lý do thay

Hiện tại là một ô vuông bo góc có hình tờ giấy — đúng nghĩa "một tài liệu", không nói được gì về
sản phẩm và trùng với hàng trăm biểu tượng khác. Cần một dấu hiệu riêng, gắn với thứ chỉ sản phẩm
này có: **phiếu trả lời tô đen được máy đọc**.

---

## 2. Ba hướng, chọn một

### Hướng A — Phiếu trả lời (tôi khuyên chọn)

Tờ phiếu thu nhỏ: một hình chữ nhật đứng, bốn góc có bốn chấm nhỏ (đây chính là bốn mốc căn chỉnh
mà hệ thống dùng để nhận diện phiếu), và bên trong là một lưới 3×2 ô tròn, trong đó **một ô được
tô đặc** bằng màu nhấn.

Vì sao hợp: nó kể đúng câu chuyện "đề → phiếu → chấm", khác biệt hẳn với biểu tượng tài liệu
thông thường, và bốn chấm góc là chi tiết kỹ thuật có thật trong sản phẩm.

### Hướng B — Đề và dấu duyệt

Một tờ giấy có ba đường chữ, góc dưới bên phải là một dấu tick lớn, vẽ bằng một nét gấp khúc duy
nhất, màu nhấn. Đơn giản hơn A, dễ nhận ra ở 24px, nhưng gần với biểu tượng "task done" quen thuộc.

### Hướng C — Chữ lồng

Hai chữ `s` và `đ` lồng nhau thành một khối vuông. Rất khó làm đẹp vì `đ` có dấu gạch ngang, dễ
thành nét rối khi thu nhỏ. Chỉ chọn nếu bạn muốn một dấu hiệu thuần chữ.

---

## 3. Prompt chính (tiếng Anh — dùng cho Midjourney / DALL·E / Ideogram / Recraft)

Sao chép nguyên khối dưới đây:

```text
A flat vector app icon, 1:1 square, for a Vietnamese exam-making and grading tool.
Subject: a small portrait answer sheet — a rounded-square sheet shape with four tiny
solid dots near its corners (registration anchors), and inside it a 3x2 grid of small
circles; exactly one circle is filled solid.
Style: geometric, flat, minimal, two colours only, crisp edges, generous padding around
the mark, centred, no gradient, no drop shadow, no glow, no 3D, no texture, no outline
stroke variation.
Colours: mark in near-black #17171A on a pure white #FFFFFF background; the single filled
circle in blue #0B63D6.
Composition: the sheet occupies about 70% of the canvas height, perfectly centred, with
equal white space on all sides. Shapes must stay readable when scaled down to 24x24 pixels.
Deliver a clean, symmetrical, pixel-aligned icon suitable for tracing into SVG.
```

**Prompt cho hướng B** (nếu bạn muốn thử hướng đơn giản hơn):

```text
A flat vector app icon, 1:1 square, minimal, for an exam-grading tool.
Subject: a portrait sheet of paper with three short horizontal text lines, and a bold
check mark overlapping its lower-right corner; the check mark is the only coloured element.
Style: flat, geometric, two colours, sharp corners, no gradient, no shadow, no 3D,
no texture, thick even strokes, readable at 24 pixels.
Colours: sheet and lines in near-black #17171A, background pure white #FFFFFF,
check mark in blue #0B63D6.
Composition: centred, about 70% of canvas, equal margins.
```

---

## 4. Negative prompt (bắt buộc dán kèm)

```text
gradient, purple, violet, magenta, neon, glow, lens flare, 3D render, isometric, bevel,
emboss, drop shadow, long shadow, glassmorphism, skeuomorphism, paper texture, grunge,
hand-drawn sketch, watercolor, cartoon mascot, robot, brain, sparkles, magic wand,
circuit board, hexagon tech pattern, letter A, infinity loop, gradient stroke, thin
hairlines, cluttered detail, text, Vietnamese words, watermark
```

Cấm `purple`/`violet` là có chủ đích: cả giao diện đã bỏ tông tím, logo mà tím là lệch ngay.

---

## 5. Bảng màu chính xác (lấy từ mã nguồn, không tự đổi)

| Vai trò | Mã | Ghi chú |
| --- | --- | --- |
| Mực (hình khối chính) | `#17171A` | gần đen, hơi ngả trung tính |
| Nền | `#FFFFFF` | |
| Nhấn (một chi tiết duy nhất) | `#0B63D6` | xanh, **không phải** xanh tím |
| Nhấn đậm (nếu cần viền) | `#0A55B8` | |
| Xám nhạt (chi tiết phụ) | `#9B9BA3` | |

Tối đa **hai** màu trong một logo. Nhiều hơn là không in đen trắng được.

---

## 6. Bộ tệp cần nhận về

| Tệp | Kích thước | Dùng ở đâu |
| --- | --- | --- |
| `logo-mark.svg` | vuông, nền trong suốt | header, favicon (Next đọc `app/icon.svg`) |
| `logo-mark-1024.png` | 1024×1024, nền trắng | ảnh chia sẻ, tài liệu |
| `logo-mark-mono.svg` | một màu mực | in phiếu trả lời, fax, ảnh đen trắng |
| `logo-mark-white.svg` | một màu trắng | đặt trên nền đậm |

**Quy tắc**: chữ "soandethi.com" **không** đưa vào ảnh — hiện nó đang là chữ trong mã
(`components/site-header.tsx`, font Inter đậm, khoảng chữ hẹp). Giữ như vậy thì sửa tên miền chỉ
phải sửa một dòng.

---

## 7. Ba phép thử trước khi nhận

1. **Thu nhỏ**: xem ở 24×24 và 32×32. Nếu bốn chấm góc dính vào nhau hoặc ô tròn bị đặc thành một
   cục, hướng A không đạt — giảm còn lưới 2×2 hoặc bỏ bớt chấm.
2. **Đen trắng**: in laser đen trắng. Mọi chi tiết phải còn phân biệt được chỉ bằng độ đậm.
3. **Cạnh chữ**: đặt cạnh chữ "soandethi.com" cỡ 15px. Logo cao bằng chiều cao chữ hoa, không
   lớn hơn.

---

## 8. Khi có tệp, tôi sẽ làm gì

1. Thay `Logo` trong `components/site-header.tsx` (đang là SVG nội tuyến) bằng tệp mới.
2. Thêm `app/icon.svg` để trình duyệt hiện favicon.
3. Thêm `logo-mark-mono.svg` vào khung in phiếu trả lời (`lib/sheet-template.ts`), chỗ hiện đang
   dùng mốc căn chỉnh hình vuông.
4. Chạy lại bộ kiểm thử — có test đếm logo trên trang nên nếu chèn sai chỗ là báo đỏ ngay.
