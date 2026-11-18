'use client';

/**
 * The product, drawn rather than described.
 *
 * A landing page for a document tool should show a document. This is a static
 * replica of the editor window — title bar, tool strip, outline, A4 page — so a
 * first-time visitor sees what they will actually be working in.
 */

const OUTLINE = [
  { level: 1, text: 'PHẦN I. TRẮC NGHIỆM (3,0 điểm)' },
  { level: 2, text: 'Câu 1. Căn bậc hai số học của 81' },
  { level: 2, text: 'Câu 2. Điều kiện xác định của biểu thức' },
  { level: 1, text: 'PHẦN II. TỰ LUẬN (7,0 điểm)' },
  { level: 2, text: 'Câu 3. Rút gọn biểu thức A' },
  { level: 2, text: 'Câu 4. Tam giác vuông tại A' },
];

export function ProductWindow() {
  return (
    <figure
      role="img"
      aria-label="Cửa sổ trình soạn đề: khung tên đề, dải công cụ, mục lục bên trái và trang A4 đang soạn"
      className="w-full"
    >
      <div className="overflow-hidden rounded-md border border-line bg-surface shadow-[var(--shadow-md)]">
        {/* Title bar */}
        <div className="flex h-9 items-center gap-2 border-b border-line bg-surface-2 px-3">
          <span className="truncate text-[12px] font-medium text-ink">
            Đề kiểm tra giữa kì I môn Toán 9
          </span>
          <span className="ml-auto hidden shrink-0 items-center gap-1 text-[10.5px] text-ink-4 sm:flex">
            <span className="size-1.5 rounded-full bg-ok" aria-hidden />
            Đã lưu
          </span>
        </div>

        {/* Tool strip */}
        <div className="flex h-8 items-center gap-1 overflow-hidden border-b border-line px-2 whitespace-nowrap" aria-hidden>
          {['100%', 'Times New Roman', '15', 'B', 'I', 'U', '∑', '≡'].map((label, i) => (
            <span
              key={label}
              className={
                i < 2
                  ? 'shrink-0 rounded-sm px-1.5 py-0.5 text-[10.5px] text-ink-2'
                  : 'grid size-5 shrink-0 place-items-center rounded-sm text-[10.5px] font-medium text-ink-2'
              }
            >
              {label}
            </span>
          ))}
          <span className="ml-auto shrink-0 rounded-sm bg-surface-3 px-1.5 py-0.5 text-[10px] text-ink-3">
            1 trang
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[86px_minmax(0,1fr)]">
          {/* Outline */}
          <div className="hidden border-r border-line bg-surface-2 p-2 sm:block">
            <p className="text-[9.5px] font-semibold tracking-[0.08em] text-ink-4 uppercase">
              Mục lục
            </p>
            <ul className="mt-1.5 space-y-1">
              {OUTLINE.map((item) => (
                <li
                  key={item.text}
                  className={
                    item.level === 1
                      ? 'truncate text-[9.5px] font-semibold text-ink-2'
                      : 'truncate pl-2 text-[9.5px] text-ink-4'
                  }
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* A4 page, in the document's own serif face */}
          <div className="bg-surface-3 p-3">
            <div className="doc-page mx-auto w-full max-w-[430px] rounded-sm bg-surface px-4 py-4 shadow-[var(--shadow-xs)] sm:px-6 sm:py-5">
              <p className="text-center text-[11px] font-bold tracking-tight">
                ĐỀ KIỂM TRA GIỮA HỌC KÌ I
              </p>
              <p className="mt-0.5 text-center text-[9.5px]">Môn: Toán – Lớp 9 · 90 phút</p>

              <p className="mt-3 text-[10px] font-bold">PHẦN I. TRẮC NGHIỆM (3,0 điểm)</p>
              <p className="mt-1 text-[10px] leading-relaxed">
                <b>Câu 1.</b> Căn bậc hai số học của 81 là
              </p>
              <p className="text-[9.5px] leading-relaxed">
                A. 9. &nbsp;&nbsp; B. −9. &nbsp;&nbsp; C. 81. &nbsp;&nbsp; D. ±9.
              </p>
              <p className="mt-1 text-[10px] leading-relaxed">
                <b>Câu 2.</b> Biểu thức √(x − 2) xác định khi
              </p>
              <p className="text-[9.5px] leading-relaxed">
                A. x ≥ 2. &nbsp;&nbsp; B. x &gt; 2. &nbsp;&nbsp; C. x ≤ 2. &nbsp;&nbsp; D. x &lt; 2.
              </p>

              <p className="mt-3 text-[10px] font-bold">PHẦN II. TỰ LUẬN (7,0 điểm)</p>
              <p className="mt-1 text-[10px] leading-relaxed">
                <b>Câu 3.</b> (2,0 điểm) Rút gọn biểu thức A = 1/(√x − 1) − 1/(√x + 1) với x ≥ 0, x ≠ 1.
              </p>
              <p className="mt-1 text-[10px] leading-relaxed">
                <b>Câu 4.</b> (2,0 điểm) Cho tam giác ABC vuông tại A, đường cao AH. Biết AB = 6 cm,
                AC = 8 cm. Tính BC, AH.
              </p>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
