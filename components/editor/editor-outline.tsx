'use client';

import { useMemo, useState } from 'react';
import { ChevronsLeft, ListTree } from 'lucide-react';
import { buildOutline } from '@/lib/editor-model';
import { cn } from '@/lib/utils';
import { Dialog } from '@/components/ui/dialog';

const TEMPLATES: Array<{ title: string; hint: string; html: string }> = [
  {
    title: 'Đề tự luận 90 phút',
    hint: 'Tiêu đề trường, môn, thời gian, 5 câu',
    html: `<h1>ĐỀ KIỂM TRA GIỮA HỌC KÌ I</h1><p style="text-align:center"><b>Môn: Toán – Lớp 9</b><br/>Thời gian làm bài: 90 phút (không kể thời gian phát đề)</p><h3>PHẦN I. TRẮC NGHIỆM</h3><p class="doc-question"><b>Câu 1.</b> …</p>`,
  },
  {
    title: 'Đề trắc nghiệm 4 lựa chọn',
    hint: 'Câu hỏi kèm A, B, C, D',
    html: `<h1>ĐỀ KIỂM TRA TRẮC NGHIỆM</h1><p class="doc-question"><b>Câu 1.</b> Nội dung câu hỏi</p><p>A. …&nbsp;&nbsp;&nbsp;B. …&nbsp;&nbsp;&nbsp;C. …&nbsp;&nbsp;&nbsp;D. …</p><p class="doc-question"><b>Câu 2.</b> Nội dung câu hỏi</p><p>A. …&nbsp;&nbsp;&nbsp;B. …&nbsp;&nbsp;&nbsp;C. …&nbsp;&nbsp;&nbsp;D. …</p>`,
  },
  {
    title: 'Đề có đáp án và barem',
    hint: 'Đề gốc + bảng điểm kèm ngắt trang',
    html: `<h1>ĐỀ KIỂM TRA</h1><p class="doc-question"><b>Câu 1.</b> …</p><p class="page-break">&nbsp;</p><h3>HƯỚNG DẪN CHẤM</h3>`,
  },
  {
    title: 'Phiếu trả lời trắc nghiệm',
    hint: 'Bảng tô + mã đề',
    html: `<h1>PHIẾU TRẢ LỜI TRẮC NGHIỆM</h1><p><b>Mã đề:</b> 101</p><p><b>Họ tên:</b> ……………………………… <b>SBD:</b> …………</p><table><tbody><tr><th>Câu</th><th>Đáp án</th></tr><tr><td>1</td><td></td></tr><tr><td>2</td><td></td></tr></tbody></table>`,
  },
];

export function EditorOutline({
  html,
  onClose,
  onApplyTemplate,
}: {
  html: string;
  onClose: () => void;
  onPrint?: () => void;
  onApplyTemplate?: (tplHtml: string) => void;
}) {
  const [tab, setTab] = useState<'outline' | 'templates'>('outline');
  const [pendingTpl, setPendingTpl] = useState<{ title: string; html: string } | null>(null);
  const outline = useMemo(() => (typeof window === 'undefined' ? [] : buildOutline(html)), [html]);
  const hasContent = useMemo(() => html.replace(/<[^>]+>/g, '').trim().length > 0, [html]);

  const applyTemplateNow = (tplHtml: string) => {
    if (onApplyTemplate) {
      onApplyTemplate(tplHtml);
      return;
    }
    const surface = document.querySelector('.doc-surface') as HTMLElement | null;
    if (!surface) return;
    surface.focus();
    document.execCommand('selectAll', false);
    document.execCommand('insertHTML', false, tplHtml);
    surface.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return (
    <aside
      aria-label="Dàn ý và mẫu chèn"
      className="no-print flex w-[240px] shrink-0 flex-col border-r border-line bg-white max-lg:fixed max-lg:inset-y-14 max-lg:left-0 max-lg:z-30 max-lg:w-[min(86vw,260px)] max-lg:shadow-[var(--shadow-md)]"
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-semibold text-ink">Tài liệu</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Ẩn dàn ý và mẫu chèn"
          title="Thu gọn dàn ý"
          className="grid size-7 place-items-center rounded-md text-ink-3 hover:bg-surface-3 hover:text-ink"
        >
          <ChevronsLeft className="size-[18px]" />
        </button>
      </div>

      <div className="mx-3 mb-3 flex rounded-md bg-surface-3 p-0.5">
        {(
          [
            { id: 'outline', label: 'Mục lục' },
            { id: 'templates', label: 'Mẫu đề thi' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'h-7 flex-1 rounded-md text-[12.5px] font-medium transition-colors',
              tab === t.id ? 'bg-white text-accent shadow-xs' : 'text-ink-2 hover:text-ink',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {tab === 'outline' ? (
          outline.length === 0 ? (
            <div className="px-2 py-6 text-center">
              <span className="mx-auto grid size-10 place-items-center rounded-md bg-surface-3 text-ink-4">
                <ListTree className="size-[18px]" />
              </span>
              <p className="mx-auto mt-3 max-w-[180px] text-[13px] leading-relaxed text-ink-4">
                Tiêu đề và các câu hỏi sẽ hiện ở đây để bạn di chuyển nhanh trong đề.
              </p>
            </div>
          ) : (
            <ul className="space-y-0.5">
              {outline.map((item) => (
                <li key={item.index}>
                  <button
                    type="button"
                    onClick={() => {
                      const surface = document.querySelector('.doc-surface');
                      if (!surface) return;
                      const realChildren = Array.from(surface.children).filter(
                        (el) => !el.hasAttribute('data-page-spacer'),
                      );
                      const target = realChildren[item.index] as HTMLElement | undefined;
                      target?.scrollIntoView({ block: 'center', behavior: 'smooth' });
                    }}
                    className={cn(
                      'block w-full truncate rounded-md py-1.5 pr-2 text-left text-[13px] text-ink-2 hover:bg-surface-3 hover:text-ink',
                      item.kind === 'title' && 'font-semibold text-ink',
                      item.level === 1 ? 'pl-2' : item.level === 2 ? 'pl-4' : 'pl-6',
                    )}
                    title={item.label}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          )
        ) : (
          <ul className="space-y-1">
            {TEMPLATES.map((tpl) => (
              <li key={tpl.title}>
                <button
                  type="button"
                  onClick={() => {
                    if (hasContent) {
                      setPendingTpl({ title: tpl.title, html: tpl.html });
                    } else {
                      applyTemplateNow(tpl.html);
                    }
                  }}
                  className="w-full rounded-md border border-line px-3 py-2 text-left hover:border-line-strong hover:bg-surface-2"
                >
                  <span className="block text-[13px] font-medium text-ink">{tpl.title}</span>
                  <span className="block text-[12px] leading-snug text-ink-4">{tpl.hint}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={pendingTpl !== null} onClose={() => setPendingTpl(null)} labelledBy="tpl-confirm-title">
        <h3 id="tpl-confirm-title" className="text-[15.5px] font-semibold text-ink">
          Áp dụng mẫu đề mới?
        </h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
          Mẫu <b>{pendingTpl?.title}</b> sẽ thay thế toàn bộ nội dung đang có trên trang soạn. Thầy cô vẫn có thể bấm Hoàn tác (Ctrl+Z) nếu cần.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setPendingTpl(null)}
            className="h-8 rounded-md px-3 text-[13px] font-medium text-ink-2 hover:bg-surface-3"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={() => {
              if (pendingTpl) applyTemplateNow(pendingTpl.html);
              setPendingTpl(null);
            }}
            className="h-8 rounded-md bg-accent px-3.5 text-[13px] font-medium text-white hover:bg-accent-hover"
          >
            Ghi đè mẫu đề
          </button>
        </div>
      </Dialog>

    </aside>
  );
}
