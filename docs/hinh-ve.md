# Hình vẽ trong đề thi

Từ bản này, đề thi có thể có hình hình học thật — nét vector, in ra sắc như chữ.

## Vì sao không để AI vẽ

Đã thử: cho mô hình tự viết SVG hoặc TikZ thì hình *trông* giống nhưng quan hệ hình học sai
(tam giác "vuông" không vuông, "tiếp tuyến" không tiếp xúc). Với đề thi, đó không phải lỗi thẩm mỹ.

Đã thử cả cách để TeX tự kiểm: dựng một đề sai (điểm A nằm **trong** đường tròn mà vẫn yêu cầu kẻ tiếp
tuyến). `pdflatex` trả về **exit code 0**, vẫn ra 1 trang, và vẽ ra một hình rác — không một cảnh báo.

Kết luận: **biên dịch thành công không có nghĩa hình đúng**. Vì vậy kiến trúc ở đây tách đôi.

## Kiến trúc

```
LLM  →  JSON đặc tả        {"kind":"triangle-right","params":{"ab":6,"ac":8,"altitude":true}}
      ↓
lib/geometry/spec.ts        giải toạ độ + KIỂM TRA quan hệ
      ↓                     (bất đẳng thức tam giác, góc vuông, A ngoài đường tròn…)
      ↓  sai → từ chối, nêu lý do, KHÔNG vẽ
lib/geometry/tikz.ts        TikZ chỉ chứa toạ độ đã tính
      ↓
lib/server/latex.ts         pdflatex → pdftocairo → SVG, cache theo nội dung
      ↓
<figure class="doc-figure">{svg}</figure>   chèn vào tài liệu HTML
```

TeX ở đây **chỉ là tay vẽ**. Mọi con số do TypeScript tính, nên kiểm chứng được bằng test.

## Bốn loại hình

| `kind` | Tham số | Dựng gì |
| --- | --- | --- |
| `triangle-right` | `ab`, `ac`, `altitude` | Tam giác ABC vuông tại A; `altitude: true` thêm đường cao AH (tự tìm chân H trên BC) |
| `triangle-sides` | `a`, `b`, `c` | Tam giác từ ba cạnh; `a = BC`, `b = CA`, `c = AB` |
| `circle-tangents` | `r`, `d` | Hai tiếp tuyến từ A tới (O; R); cần `d > r` |
| `parabola` | `a`, `b`, `c` | Đồ thị y = ax² + bx + c cùng hệ trục |

Bị từ chối (trả 422 kèm lý do tiếng Việt):

- `a + b ≤ c` — ba cạnh không tạo thành tam giác.
- `d ≤ r` — A nằm trong/trên đường tròn nên không có tiếp tuyến.
- cạnh ≤ 0, hoặc `a = 0` với parabol.
- chân đường cao rơi ra ngoài đoạn BC.

## Kích thước và vị trí

**Kích thước.** Một tam giác 6 x 8 cm vẽ đúng tỉ lệ, cộng nhãn chữ, cao tới 9,2 cm —
một phần ba trang A4. Vì vậy mỗi hình được thu vào khung **8,2 x 6,2 cm**: phần *hình học*
co lại, còn **cữ chữ nhãn giữ nguyên 10 pt**, nên mọi hình trong một đề đều có chữ bằng nhau
và đọc được. Hình nhỏ hơn khung thì giữ nguyên, không phóng to.

Khung tính cả lề nhãn (`LABEL_MARGIN = 1,1 cm`), nếu không thì "6,2 cm" đo theo toạ độ lại
thành 7,4 cm khi in — đúng lỗi đã gặp.

**Vị trí.** Hai quy tắc, một cho màn hình và một cho giấy:

- *Màn hình*: khi hình không vừa chỗ còn lại, bộ phân trang đẩy **cả đoạn văn ngay trên nó**
  sang trang mới cùng với hình (`components/editor/editor-workspace.tsx`), thay vì để hình
  trơ trọi ở đầu trang sau.
- *Bản in*: `break-before: avoid` trên `figure.doc-figure` và `figcaption`, để Chromium
  không cắt trang ngay trước hình.

## Ba đường vào

1. **Thanh công cụ → Thêm công cụ → Chèn hình** — chọn loại, nhập số đo, xem trước, chèn.
2. **Panel trợ lý AI → nút hình ảnh** — mở cùng hộp thoại đó.
3. **AI soạn đề** — mô hình được dạy viết
   `<figure data-figure-spec='{"kind":…,"params":{…}}'></figure>` ngay dưới câu hỏi; máy chủ dựng
   hình khi trả kết quả. Đặc tả sai thì hình đó thành ghi chú `[Hình vẽ: …]` và cảnh báo được đưa
   vào `warnings` của kết quả, đề vẫn dùng được.

## In ấn

- `figure.doc-figure` là khối nguyên tử: `break-inside: avoid`, không bị cắt qua trang.
- Hình cao tối đa `200mm`, rộng tối đa 100% khung — không bao giờ tràn lề.
- Bộ phân trang sẵn có (`lib/split-text.ts` + vòng hai trong `editor-workspace.tsx`) đẩy cả khối
  sang trang sau khi không vừa.
- SVG mang kích thước thật theo điểm (`width="205.627pt"`), nên tam giác 6×8 cm in ra đúng
  6×8 cm (đo được: 7,3 × 9,2 cm tính cả nhãn).

## Một chi tiết dễ sai

`pdftocairo` sinh `<g id="glyph-0-0">` và `<use xlink:href="#glyph-0-0">`. Hai hình trên cùng một
trang sẽ **trùng id**, và `<use>` phân giải theo toàn tài liệu — hình thứ hai sẽ mượn glyph của hình
thứ nhất. `namespaceSvgIds()` gắn tiền tố riêng cho từng lần chèn. Có test cho việc này.

## Hai lỗi đã từng xảy ra

**Cắt thiếu một ký tự.** Khi tách `<svg>` ra khỏi tệp do `pdftocairo` sinh,
`end + 5` bỏ mất dấu `>` cuối (`'</svg>'.length` là **6**). Thẻ không đóng, và
trình duyệt nuốt **toàn bộ nội dung sau hình** vào bên trong SVG. Hình vẫn hiện,
nên lỗi rất khó thấy: chỉ có chú thích và mọi câu phía sau biến mất. Có test
`an inline SVG is closed, so nothing after the figure is swallowed`.

**Parabol cao 16 cm.** Với `y = x² − 2x − 1`, miền vẽ rộng 6 đơn vị nhưng cao tới
16, nên hình thành một vệt dài hơn cả trang. Nay miền vẽ tự co lại sao cho
`|a|·s² ≤ 4s`, tức bề cao không vượt quá bề rộng. Có test
`a parabola stays page-sized for a steep coefficient`.

## Yêu cầu máy chủ

Cần `pdflatex` và `pdftocairo` trong môi trường chạy. Thiếu thì:

- `GET /api/figures` trả `available: false`,
- `POST` trả 503 với thông báo rõ,
- đề AI vẫn sinh được, hình thành ghi chú thay vì làm hỏng cả đề.

Với Docker, `texlive-latex-base` + `texlive-pictures` + `poppler-utils` là đủ. Hoặc dùng
`tectonic` (một tệp nhị phân, tự tải gói cần dùng) nếu muốn image nhẹ hơn.

## Kiểm thử

`e2e/unit/geometry.spec.ts` — 11 test, đo toạ độ thật:

- H nằm đúng trên BC, `AH · BC = AB · AC`, `AH ⟂ BC`;
- tam giác 3-4-5 có góc A đúng 90° (sai số < 0,01°);
- tiếp điểm cách tâm đúng R và `OT ⟂ AT`;
- ba ca bị từ chối đúng lý do;
- TikZ sinh ra chứa toạ độ đã tính `(3.84,2.88)`;
- hai hình không dùng chung glyph id;
- đặc tả sai từ AI → ghi chú, không có `<svg>`.
