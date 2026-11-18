# GV — trình soạn đề và kho câu hỏi AI

## Tiếp tục phát triển trên máy khác

Yêu cầu: Node.js24 LTS, pnpm và Docker Compose (hoặc PostgreSQL16 riêng).

```bash
git clone https://github.com/PTHung-G/GV.git
cd GV
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
mkdir -p .data
```

Tạo `.data/dev-db.env` với `POSTGRES_PASSWORD=<mật-khẩu-dev-tự-chọn>`. Sửa `DATABASE_URL` trong `.env.local` để dùng cùng mật khẩu (URL-encode nếu có ký tự đặc biệt). Không commit hai file này.

```bash
docker compose --env-file .data/dev-db.env -f compose.dev-db.yml up -d --wait
pnpm db:migrate
pnpm dev
```

Mở http://localhost:3000 và đăng ký tài khoản mới. Muốn dùng AI thật, điền `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` của bạn; không có key thì chỉ có chế độ offline/fixture, không phải AI thật. Kho câu hỏi AI cần provider thật.

Kiểm tra cơ bản:

```bash
pnpm exec tsc --noEmit
pnpm exec playwright install chromium
pnpm build
pnpm test
```

Repo chứa mã nguồn, migrations, kiểm thử, tài liệu và bằng chứng đánh giá công khai/tổng hợp. Không chứa database/dữ liệu tài khoản trên server, API key, `.env.local`, `.data/`, dependency hoặc build artifacts. Một số kiểm thử tích hợp cần DB riêng; các script đánh giá provider là opt-in và có thể tốn tiền. Corpus PDF thô trong `.data/` không đi kèm nên các phép kiểm tra corpus cần khôi phục/tải nguồn trước. `source-mirror/` là tư liệu tham chiếu lịch sử, không phải backend đang chạy; xem lưu ý quyền sử dụng bên dưới.

Tài liệu quan trọng:
- [Triển khai subpath](<deploy/soandethi-subpath.md>)
- [Kho câu hỏi](<docs/question-bank.md>)
- [Kiểm chứng AI tự sửa thiếu câu và giới hạn](<docs/evaluations/math9-ten-topic-tree/bounded-correction-verification.md>)
- [Lỗi phân loại ngữ nghĩa còn mở](<.specify/bugs/topic-semantic-drift/assessment.md>)

Phần mô tả dưới đây có nội dung prototype lịch sử; hướng dẫn khởi chạy ở trên áp dụng cho kiến trúc PostgreSQL hiện tại.

---

## Lịch sử dự án: soandethi.com — bản clone để học và cải tiến

Bản clone giao diện **soandethi.com** (trình soạn đề thi cho giáo viên, có trợ lý AI), viết lại
hoàn toàn bằng Next.js 15 + React 19 + Tailwind CSS 4 dưới dạng một dự án đọc được và sửa được.

> **Lưu ý về bản quyền.** Đây là bản dựng lại phục vụ mục đích học tập/nghiên cứu giao diện. Nội dung
> chữ, cấu trúc trang và thông tin doanh nghiệp trong bản gốc thuộc về chủ sở hữu soandethi.com. Trước
> khi dùng cho mục đích thương mại, hãy xin phép chủ sở hữu và đọc Điều khoản sử dụng của họ.
>
> **Cập nhật kiến trúc:** phần mô tả prototype bên dưới có nội dung lịch sử. Tài khoản, phiên đăng nhập, kho đề riêng, barem/chấm bài và kho câu hỏi hiện được lưu ở PostgreSQL; không còn chỉ localStorage. Cần `DATABASE_URL`, chạy migration trước khi dùng. Browser storage chỉ là bản dự phòng/sync cho editor; không phải kho câu hỏi. Xem [triển khai subpath](deploy/soandethi-subpath.md), [kho câu hỏi và giới hạn](docs/question-bank.md), [bằng chứng release](specs/002-topic-question-bank/verification.md). Các trang/tính năng đã mở rộng có thể khác bảng prototype cũ.

---

## 1. Chạy thử

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Các lệnh khác:

```bash
pnpm build          # build production
pnpm start          # chạy bản build ở cổng 3000
pnpm test           # Playwright tự start bản đã build ở3100; chạy pnpm build trước
pnpm exec next dev -p 3000
```

Test end-to-end dùng Playwright; lần đầu cần tải trình duyệt:

```bash
pnpm exec playwright install chromium
```

---

## 2. Đã làm được gì

### Trang công khai

| Đường dẫn        | Nội dung                                                                       |
| ---------------- | ------------------------------------------------------------------------------ |
| `/`              | Hero + khối mô phỏng trang A4 soạn đề bằng AI, 4 nhóm tính năng AI, 3 tính năng trình soạn |
| `/exams`         | Kho đề cộng đồng: tìm kiếm, lọc theo lớp và môn, đổi dạng lưới/danh sách, phân trang |
| `/exams/<slug>`  | Chi tiết đề: xem trước trang đề, chia sẻ, in/tải PDF, "Sao về trình soạn"        |
| `/about`         | Giới thiệu, 3 nguyên tắc làm việc, 3 bước hoạt động, FAQ                          |
| `/my-exams`      | Kho đề của người dùng: tạo mới, mở, nhân bản, xuất HTML, xoá                      |
| `/doc/<id>`      | **Trình soạn đề** (phần chính, xem mục 3)                                        |
| `/slides`, `/library`, `/board-renderer`, `/missions`, `/nap-diem`, `/grading`, `/terms`, `/privacy` | Trang giới thiệu "chưa làm phần này" để thanh điều hướng không bị 404 |

### Trình soạn đề `/doc/<id>`

- Trang A4 thật **793.7 × 1122.5 px** (210×297mm @96dpi), lề `75.59 / 56.69 / 75.59 / 75.59 px`,
  font Times New Roman 15.33px — đúng như bản gốc.
- `contentEditable` với thanh công cụ: hoàn tác/làm lại, in, thu phóng 50–200%, kiểu đoạn (H1–H3,
  văn bản thường), phông chữ, cỡ chữ, đậm/nghiêng/gạch chân, công thức toán, công thức hoá học, menu
  chèn (bảng, liên kết, màu chữ, màu nền, chỉ số trên/dưới, danh sách, thụt lề, căn lề, ngắt trang).
- Thước ngang, dàn ý tự sinh từ nội dung (bấm để nhảy tới từng câu), tab **Mẫu đề thi** chèn nhanh
  4 mẫu đề.
- Thanh trạng thái "Đang lưu… / Đã lưu vào tài khoản", thống kê `n trang · m từ`, nút Chia sẻ, Mã đề,
  Xuất Word/PDF, in theo khổ A4 (`@page` + `.page-break`).
- **Trợ lý AI**: chạy pipeline 3 bước (lập kế hoạch → soạn → kiểm tra) qua SSE thật; hội thoại có
  hiệu ứng gõ chữ, nút "Thay vào đề" / "Chèn vào đề" đổ HTML đã sanitize vào trang với
  ngắt trang. Nội dung trả lời là mẫu cố định (`mockAnswer`) vì bản clone không gọi API.
- Autosave có debounce 700ms, lưu cả khi rời trang (`beforeunload`) và khi mất focus.

### Không có backend

Đăng nhập và kho đề đều lưu trong `localStorage`:

- `sdt.auth.v1` — tài khoản đang đăng nhập (đăng nhập email bất kỳ hoặc nút Google đều là mô phỏng,
  độ trễ 450ms). Tài khoản mới được tặng 20.000 điểm.
- `sdt.docs.v1` — danh sách đề, có sẵn một đề mẫu `demo-de-giua-ky-toan-9`.

Nhờ vậy bản clone chạy được hoàn toàn offline, không cần API key, không gửi dữ liệu đi đâu.

---

## 3. Cấu trúc mã nguồn

```
app/
  layout.tsx                 # metadata, AuthProvider + DocsProvider + AuthDialog
  globals.css                # token Tailwind 4, typography trang đề, keyframes, @media print
  page.tsx                   # trang chủ
  about/page.tsx             # giới thiệu + FAQ
  exams/page.tsx             # kho đề cộng đồng
  exams/[slug]/page.tsx      # chi tiết đề (SSG từ COMMUNITY_EXAMS)
  my-exams/page.tsx          # kho đề của tôi
  doc/[id]/page.tsx          # vỏ trình soạn đề (h-dvh, không header/footer)
  <các trang còn lại>/page.tsx  # ComingSoon
components/
  site-header.tsx            # logo, nav desktop/mobile, đăng nhập / avatar + điểm
  site-footer.tsx            # 4 cột liên kết + thông tin pháp lý
  auth-dialog.tsx            # hộp thoại đăng nhập
  home/                      # hero-cta, hero-stage (khối mô phỏng A4)
  exams/                     # exams-browser, exam-paper-preview, exam-detail
  editor/
    editor-workspace.tsx     # trạng thái, autosave, bố cục 3 cột, thước A4 (EditorRuler)
    editor-toolbar.tsx       # thanh công cụ + menu (MenuButton, InsertMenu)
    editor-outline.tsx       # dàn ý / mẫu đề
    ai-panel.tsx             # trợ lý AI
    scroll-hint.tsx          # đánh dấu khi thanh công cụ bị tràn
  shell/                     # app-shell.tsx (khung 3 phần), sidebar.tsx (rail), app-frame.tsx
  ui/                        # button, input, dialog, dropdown (tự viết, không dùng thư viện UI)
lib/
  site.ts                    # thông tin doanh nghiệp, nav, môn học, khối lớp
  auth-context.tsx           # useAuth()
  docs-store.tsx             # useDocs(), useDoc(id)
  editor-model.ts            # htmlToBlocks, buildOutline, countWords, countPages, sanitize
  community-exams.ts         # 24 đề mẫu cho kho cộng đồng
  utils.ts                   # cn, formatNumber, slugify, relativeTime
styles/fonts.css             # @font-face của Inter / Newsreader / Geist Mono
e2e/                         # test Playwright
source-mirror/               # dữ liệu gốc đã tải về để đối chiếu (xem mục 4)
scripts/                     # công cụ tách module JS đã minify
```

### Quy ước thiết kế

**Khung ba phần.** Mọi màn đã đăng nhập chạy trong `components/shell/app-shell.tsx`:

```
[ rail 264px ][        giữa (việc chính)        ][ aside 400–440px ]
```

- `rail` là `components/shell/sidebar.tsx`: chip tài khoản, ô tìm nhanh (⌘K), điều hướng, đề gần
  đây, chân trang.
- `aside` là nội dung theo từng màn (thông tin đề, tiến độ đợt chấm, bảng điều khiển…), do chính
  màn đó truyền vào chứ không phải khung biết trước.
- Hai panel thu gọn độc lập; lựa chọn lưu ở `localStorage` (`sdt.shell.left` / `sdt.shell.right`).
  Dưới `lg`, rail thành ngăn kéo trượt có lớp phủ, đóng bằng nút X hoặc `Esc`.
- Mỗi ranh giới chỉ có **một** nút: panel đang mở thì nút nằm ở đầu panel đó; panel đóng thì nút
  mở lại nằm ở header cột giữa (rail) hoặc ở dải mép phải (aside). Trước đây cả hai chỗ cùng vẽ nút
  nên có lúc hiện hai dấu `»` sát nhau.

**Bảng màu** — trung tính, sáng, một màu nhấn duy nhất; không còn sắc tím.
Mực `#17171a`, chữ phụ `#5b5b64`, mờ `#83838c`, nhạt `#9b9ba3`; viền `#e7e7ea` / `#d5d5da`;
nền `#ffffff` / `#fafafa` / `#f3f3f4`; nhấn `#0b63d6` (hover `#0a55b8`, nền nhạt `#eaf2fe`);
trạng thái `#1a7f4b` (đạt), `#a8620a` (cần chú ý), `#c0362c` (lỗi).

Mọi giá trị nằm trong `app/globals.css` và chỉ dùng qua lớp tiện ích (`text-ink`, `bg-surface-2`,
`border-line`, `text-accent`…). **Không viết mã màu trực tiếp trong component** — có test chặn
(`e2e/unit/design-tokens.spec.ts`), cùng test kiểm không có sắc tím và bo góc không quá ba bậc.

Bo góc đúng ba bậc: `rounded-sm` (4px — nhãn, chip), `rounded-md` (6px — nút, ô nhập, thẻ, hàng),
`rounded-lg` (10px — chỉ hộp thoại). Vòng tròn chỉ dùng cho ảnh đại diện và chấm trạng thái.

Một font không chân (Inter) cho toàn giao diện; `font-display` đã trỏ về cùng font đó. Bề mặt in
(`.doc-page`, khối `@media print`) vẫn giữ Times New Roman vì đó là nội dung đề, không phải giao diện.

Khung làm việc: hai panel thu gọn độc lập, mỗi cạnh **một** nút điều khiển duy nhất; panel đóng thì
không render nội dung bên trong nên bàn phím không Tab vào chỗ bị cắt. Cột giữa nền trắng, hai panel
nền xám rất nhạt.

Hai tiện ích bố cục dùng biến CSS: `px-(--gutter)` (1rem → 1.5rem @640 → 2rem @1024) và
`max-w-(--page-max)` (80rem).

---

## 4. `source-mirror/` — dữ liệu gốc để đối chiếu

Thư mục này giữ lại những gì đã tải từ site gốc, phục vụ việc so sánh giao diện:

| Thư mục                  | Nội dung                                                        |
| ------------------------ | --------------------------------------------------------------- |
| `source-mirror/dom/`     | HTML + text thuần của các trang (home, exams, about, my-exams, doc) |
| `source-mirror/css/`     | CSS đã build của bản gốc (dùng để lấy `@font-face` và token màu) |
| `source-mirror/js/`      | 60 chunk JS đã minify                                            |
| `source-mirror/extracted/modules/` | 1215 module `.ts` đọc được, tách từ các chunk          |

Tách lại module từ chunk:

```bash
node scripts/extract-modules.mjs     # -> chunks=60 modules=1215
```

`scripts/jstokens.mjs` là tokenizer viết tay cho JS đã minify; `extract-modules.mjs` dùng nó để biến
mỗi cặp `(id, factory)` trong chunk thành một file `.ts` với `import`/`export` thật. Phần này chỉ để
tra cứu, **không** nằm trong bundle của ứng dụng (`tsconfig.json` loại trừ `source-mirror/`).

---

## 5. Kiểm thử

```bash
pnpm test
```

90 test Playwright. Nhóm giao diện (`e2e/shell.spec.ts`, 5 test) kiểm khung ba phần: rail/giữa/aside
nằm cạnh nhau đúng thứ tự, thu gọn rail thì bề rộng dồn sang cột giữa và lựa chọn còn nguyên sau khi
tải lại, panel phải thu gọn độc lập, trên điện thoại rail là ngăn kéo đóng sẵn, và mọi màn đã đăng
nhập đều nằm trong khung. Phần còn lại phủ: 8 trang công khai, điều hướng, đăng nhập, kho đề, trình
soạn (autosave, menu công cụ, dàn ý, trợ lý AI), và toàn bộ đường chấm bài + phiếu in + OMR.

Ảnh chụp đối chiếu khi phát triển nằm ngoài repo (thư mục `/tmp/shots`), không commit vào đây.

---

## 6. Những điểm chưa làm / khác bản gốc

- **Backend AI có thật.** Bốn endpoint dựng đúng contract của bản gốc: `/api/chat-exam/plan`,
  `/api/chat-exam` (SSE 5 event), `/api/chat-exam/verify`, và `/api/exam-image` (OCR ảnh đề) — xem
  [docs/ai-backend.md](docs/ai-backend.md). Cùng một model phục vụ cả chat lẫn OCR. Cấu hình trong
  `.env.local` (`AI_API_KEY`, `AI_MODEL`, `AI_BASE_URL`); không có key thì rơi về provider offline
  trả nội dung mẫu để test được pipeline.
- **Công thức toán**: lưu LaTeX (`$...$` / `$$...$$`), render bằng KaTeX ra MathML đúng như bản gốc
  (`lib/math.ts`). CSS canh baseline chép từ stylesheet gốc.
- **Bố cục đề**: đầu đề hai cột (`.doc-header`), lưới đáp án A/B/C/D tự đo số cột
  (`lib/layout.ts`), tự ngắt trang A4 ở 971px như thuật toán `measureColumns` của bản gốc.
- **In / PDF**: `@page` A4 lề 20/15/18/20mm, spacer màn hình bị ẩn khi in, khối nội dung
  không bị cắt dở trang.
- **Sửa công thức**: bấm vào công thức trong đề để mở bàn phím toán MathLive
  (`components/editor/math-popover.tsx`), đổi được trong dòng / riêng dòng, xoá.
- **Tách đoạn qua trang**: đoạn văn dài được cắt tại chỗ xuống dòng (`lib/split-text.ts`),
  phần dư sang trang sau; khi lưu tự nối lại thành một đoạn.
- **Tạo đáp án**: nút "Tạo đáp án" gọi `/api/exam-answer-key`, chèn bảng đáp án dàn cột
  vào cuối đề.
- **Gợi ý prompt**: khung trợ lý lấy 3 gợi ý theo trạng thái đề từ `/api/suggestions`.
- **Trí nhớ**: trang `/memory` để thêm/sửa/xoá/khôi phục những điều trợ lý nhớ, có công
  tắc bật tắt; trợ lý đọc danh sách này trước mỗi lần soạn đề.
- Chưa dựng lại: tạo đáp án riêng (`/api/exam-answer-key`), 4 endpoint trí nhớ (`/api/memory/*`),
  `requireApproval` cho thao tác giao diện, `editRanges`, gợi ý mẫu câu.
- Đăng nhập, điểm thưởng và lưu trữ đề vẫn là mô phỏng phía trình duyệt (`localStorage`), không có
  server lưu trữ.
- Các trang `/slides`, `/library`, `/board-renderer`, `/missions`, `/nap-diem`, `/grading`,
  `/terms`, `/privacy` mới là trang giới thiệu, chưa có chức năng.
- Chưa có: xuất `.docx` thật (hiện xuất HTML rồi in PDF), tạo mã đề, chấm bài, tải ảnh đề lên để AI
  đọc, đồng bộ nhiều thiết bị.
- Kho đề cộng đồng dùng 24 đề mẫu cố định trong `lib/community-exams.ts`, không lấy từ máy chủ.
- Trình soạn dùng `document.execCommand` (đã bị đánh dấu deprecated nhưng vẫn chạy tốt trên mọi
  trình duyệt hiện nay). Nếu muốn nâng cấp, thay bằng TipTap/ProseMirror là hướng hợp lý tiếp theo.
- So với bản gốc, một số chi tiết nhỏ trong bố cục thanh công cụ và dàn ý được đơn giản hoá.

---

## 7. Hướng cải tiến gợi ý

1. Thay `document.execCommand` bằng editor có schema (TipTap) để undo/redo và bảng biểu chắc chắn hơn.
2. Đặt `AI_API_KEY` để bật model thật; dựng tiếp OCR ảnh đề và 4 endpoint trí nhớ theo
   [docs/ai-backend.md](docs/ai-backend.md).
3. Xuất `.docx` bằng `docx` hoặc chuyển qua Pandoc để giữ đúng ngắt trang.
4. Phân trang A4 thật trong trình soạn (hiện là một trang cao dần, ngắt trang chỉ là dấu in).
5. Thêm ma trận đề, tạo mã đề, chấm bài theo barem.
