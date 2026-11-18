'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Copy, FileText, MoreHorizontal, Plus, Search, Trash2, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useDocs, type ExamDoc } from '@/lib/docs-store';
import { gradingApi, type SessionSummary } from '@/lib/grading-client';
import { subjectLabel, SUBJECTS } from '@/lib/site';
import { examContentHash } from '@/lib/exam-revision';
import { relativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Dropdown } from '@/components/ui/dropdown';
import { AppFrame } from '@/components/shell/app-frame';
import { ShellHeader } from '@/components/shell/app-shell';

export function MyExams() {
  const { user, openDialog } = useAuth();
  const router = useRouter();
  const { docs, ready, create, duplicate, remove } = useDocs();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const exams = useMemo(
    () => docs.filter((doc) => doc.kind !== 'answer-key'),
    [docs],
  );

  const filtered = exams.filter((d) => d.title.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = exams.find((doc) => doc.id === selectedId) ?? null;

  const newDoc = () => {
    if (!user) {
      openDialog('Đăng nhập để soạn đề mới');
      return;
    }
    const id = create();
    router.push(`/doc/${id}`);
  };

  const exportHtml = (id: string, title: string) => {
    const doc = docs.find((d) => d.id === id);
    if (!doc) return;
    const blob = new Blob(
      [
        `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:'Times New Roman',serif;width:21cm;margin:0;padding:2cm}</style></head><body>${doc.content}</body></html>`,
      ],
      { type: 'text/html' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^\p{L}\p{N}\s-]/gu, '').trim() || 'de-thi'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const aside = <DocDetails doc={selected} onClose={() => setSelectedId(null)} />;

  return (
    <AppFrame aside={aside} asideTitle="Thông tin đề" asideIcon={<FileText className="size-4" />}>
      <ShellHeader title="Đề thi của tôi" subtitle={`${exams.length} đề đã lưu`} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-6 py-8">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-ink-3">Đề và đáp án được quản lý cùng nhau.</p>
              {!user ? <p className="mt-1.5 text-[13px] text-ink-3">Đăng nhập để mở kho đề của bạn.</p> : null}
            </div>
            <button
              type="button"
              onClick={newDoc}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              <Plus className="size-4" /> Đề mới
            </button>
          </header>

          <div role="search" className="mt-6">
            <label className="relative block">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-4"
                aria-hidden
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Tìm đề của tôi"
                placeholder="Tìm trong đề của tôi"
                className="h-10 w-full rounded-md border border-line bg-surface-2 pr-3 pl-9 text-[13.5px] outline-none transition-colors placeholder:text-ink-4 focus:border-line-strong focus:bg-white"
              />
            </label>
          </div>

          {!ready ? (
            <p className="py-14 text-center text-[13px] text-ink-4">Đang tải…</p>
          ) : filtered.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-line-strong bg-surface-2 py-14 text-center">
              <p className="text-[14px] font-medium text-ink">Chưa có đề nào</p>
              <p className="mt-1 text-[13px] text-ink-3">
                Tạo đề mới, hoặc sao một đề từ kho cộng đồng về đây.
              </p>
              <Link
                href="/exams"
                className="mt-4 inline-flex h-8 items-center rounded-md border border-line-strong bg-white px-3 text-[13px] font-medium text-ink hover:bg-surface-2"
              >
                Xem đề thi cộng đồng
              </Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-1">
              {filtered.map((doc) => (
                <li key={doc.id}>
                  <div
                    className={cn(
                      'group relative flex items-center gap-3 rounded-md border p-2.5 transition-colors',
                      selectedId === doc.id
                        ? 'border-line-strong bg-white shadow-[var(--shadow-xs)]'
                        : 'border-transparent hover:bg-surface-2',
                    )}
                  >
                    {/* Row navigates; the dot button only fills the aside. */}
                    <Link
                      href={`/doc/${doc.id}`}
                      aria-label={`Mở đề ${doc.title}`}
                      className="absolute inset-0 rounded-md"
                    />
                    <div className="pointer-events-none flex min-w-0 flex-1 items-center gap-3 text-left">
                      <span className="grid size-9 shrink-0 place-items-center rounded-md border border-line bg-surface-2 text-ink-3">
                        <FileText className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-medium text-ink">
                          {doc.title}
                        </span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11.5px] text-ink-3">
                          <span className="rounded-sm bg-surface-3 px-1.5 py-0.5 font-medium text-ink-2">
                            {subjectLabel(doc.subject)}
                          </span>
                          {doc.grade ? (
                            <span className="rounded-sm bg-surface-3 px-1.5 py-0.5 font-medium text-ink-2">
                              Lớp {doc.grade}
                            </span>
                          ) : null}
                          <span>sửa {relativeTime(doc.updatedAt)}</span>
                          <span>{doc.contentStatus === 'preview' ? 'Bản xem trước' : (() => {
                            const key = docs.find((key) => key.parentId === doc.id);
                            return !key ? 'Chưa có đáp án & barem' : !key.sourceContentHash ? 'Barem cũ — cần kiểm tra' : key.sourceContentHash !== examContentHash(doc.content) ? 'Barem cần cập nhật' : 'Đã có đáp án & barem';
                          })()}</span>
                        </span>
                      </span>
                    </div>

                    <div className="relative z-10 flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedId(doc.id === selectedId ? null : doc.id)}
                        aria-pressed={selectedId === doc.id}
                        aria-label={`Xem chi tiết ${doc.title}`}
                        className={cn(
                          'inline-flex h-8 items-center rounded-md border px-2.5 text-[12.5px] font-medium',
                          selectedId === doc.id
                            ? 'border-line-strong bg-accent-soft text-accent'
                            : 'border-transparent text-ink-3 hover:bg-surface-3 hover:text-ink',
                        )}
                      >
                        {selectedId === doc.id ? 'Đang xem' : 'Chi tiết'}
                      </button>
                      <Dropdown
                        align="end"
                        className="w-[200px]"
                        trigger={({ toggle }) => (
                          <button
                            type="button"
                            aria-label="Thao tác khác"
                            onClick={toggle}
                            className="grid size-8 place-items-center rounded-md text-ink-3 hover:bg-surface-3 hover:text-ink"
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        )}
                      >
                        {(close) => (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                duplicate(doc.id);
                                close();
                              }}
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13.5px] hover:bg-surface-3"
                            >
                              <Copy className="size-4 text-ink-3" /> Nhân bản
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                exportHtml(doc.id, doc.title);
                                close();
                              }}
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13.5px] hover:bg-surface-3"
                            >
                              <FileText className="size-4 text-ink-3" /> Xuất HTML
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Xóa đề và các trang đáp án đi kèm? Các đợt chấm lịch sử được giữ nguyên.')) remove(doc.id);
                                close();
                              }}
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13.5px] text-danger hover:bg-danger-soft"
                            >
                              <Trash2 className="size-4" /> Xoá
                            </button>
                          </>
                        )}
                      </Dropdown>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {selected ? <div className="fixed inset-0 z-50 flex items-end bg-black/30 lg:hidden" onClick={() => setSelectedId(null)}>
        <div role="dialog" aria-modal="true" aria-label="Thông tin đề" className="max-h-[85dvh] w-full overflow-y-auto bg-white" onClick={(event) => event.stopPropagation()}>{aside}</div>
      </div> : null}
    </AppFrame>
  );
}

/** Right-hand pane: the document picked in the list. */
function DocDetails({ doc, onClose }: { doc: ExamDoc | null; onClose: () => void }) {
  const { update } = useDocs();
  const [history, setHistory] = useState<SessionSummary[]>([]);
  const [historyError, setHistoryError] = useState('');
  useEffect(() => {
    let active = true; setHistory([]); setHistoryError('');
    if (doc) gradingApi.get<{ sessions: SessionSummary[] }>(`/api/grading/sessions?examId=${encodeURIComponent(doc.id)}`)
      .then(data => { if (active) setHistory(data.sessions); })
      .catch(() => { if (active) setHistoryError('Không tải được lịch sử chấm.'); });
    return () => { active = false; };
  }, [doc?.id]);
  if (!doc) {
    return (
      <div className="p-4">
        <div className="rounded-md border border-dashed border-line-strong bg-white p-4 text-center">
          <FileText className="mx-auto size-5 text-ink-4" aria-hidden />
          <p className="mt-2 text-[13px] font-medium text-ink">Chưa chọn đề nào</p>
          <p className="mt-1 text-[12px] text-ink-3">Chọn một đề để xem chi tiết.</p>
        </div>
      </div>
    );
  }

  const rows: Array<[string, string]> = [
    ['Môn', subjectLabel(doc.subject)],
    ['Lớp', doc.grade ? `Lớp ${doc.grade}` : 'Chưa chọn'],
    ['Cập nhật', relativeTime(doc.updatedAt)],
    ['Tạo lúc', new Date(doc.createdAt).toLocaleDateString('vi-VN')],
    ['Loại', doc.kind === 'answer-key' ? 'Trang đáp án' : 'Đề thi'],
  ];

  return (
    <div className="space-y-3 p-3">
      <section className="rounded-md border border-line bg-white p-3.5">
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 text-[13.5px] leading-snug font-semibold text-ink">{doc.title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Bỏ chọn"
            className="grid size-6 shrink-0 place-items-center rounded-md text-ink-4 hover:bg-surface-3 hover:text-ink"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <dl className="mt-3 space-y-1.5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 text-[12px] text-ink-3">{label}</dt>
              <dd className="min-w-0 truncate text-right text-[12.5px] font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <details className="mt-3 border-t border-line pt-2">
          <summary className="cursor-pointer text-sm">Sửa môn / khối</summary>
          <label className="mt-2 block text-xs">Môn học<select aria-label="Môn học của đề" value={doc.subject} onChange={(event) => update(doc.id, { subject: event.target.value })} className="mt-1 h-9 w-full rounded-md border border-line bg-white px-2">{SUBJECTS.map(subject => <option key={subject.id} value={subject.id}>{subject.label}</option>)}</select></label>
          <label className="mt-2 block text-xs">Khối lớp<select aria-label="Khối lớp của đề" value={doc.grade ?? ''} onChange={(event) => update(doc.id, { grade: event.target.value ? Number(event.target.value) : null })} className="mt-1 h-9 w-full rounded-md border border-line bg-white px-2"><option value="">Chưa chọn</option>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>Lớp {index + 1}</option>)}</select></label>
        </details>
        <Link
          href={`/doc/${doc.id}`}
          className="mt-3.5 flex h-8 items-center justify-center gap-1.5 rounded-md bg-accent text-[12.5px] font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Mở trong trình soạn
        </Link>
        {doc.contentStatus !== 'preview' ? <Link href={`/grading/new?examId=${encodeURIComponent(doc.id)}`} className="mt-2 flex h-8 items-center justify-center rounded-md border border-line text-sm font-medium">Chấm đề này</Link> : <p className="mt-2 text-xs text-warn">Bổ sung toàn bộ đề trong trình soạn trước khi chấm.</p>}
      </section>

      <section className="rounded-md border border-line bg-white p-3.5">
        <p className="text-sm font-medium">Các đợt đã dùng đề này</p>
        {historyError ? <p className="mt-2 text-xs text-warn">{historyError}</p> : history.length ? <ul className="mt-2 space-y-2">{history.map(item => <li key={item.id}><Link className="text-sm underline" href={`/grading/${item.id}`}>{item.className || item.title}</Link><p className="text-xs text-ink-3">{new Date(item.createdAt).toLocaleDateString('vi-VN')} · {item.confirmedCount}/{item.submissionCount} bài đã duyệt</p></li>)}</ul> : <p className="mt-2 text-xs text-ink-3">Chưa có đợt chấm liên kết.</p>}
        <p className="mt-1.5 text-[12px] leading-relaxed text-ink-3">
          Đề đã có đáp án thì trang barem nằm riêng, in cho học sinh không bị lộ đáp án.
        </p>
      </section>
    </div>
  );
}
