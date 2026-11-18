'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Printer, Loader2 } from 'lucide-react';
import { basePath } from '@/lib/api-url';
import { exportKeyStatus, exportMcNumbers, exportPrintHtml, type ExportSnapshot } from '@/lib/editor-export';
export type { ExportSnapshot } from '@/lib/editor-export';

type Artifact = 'exam' | 'key' | 'sheet';
export function ExportDialog({ snapshot, onClose }: { snapshot: ExportSnapshot; onClose: () => void }) {
  const [artifact, setArtifact] = useState<Artifact>('exam');
  const [reviewed, setReviewed] = useState(false);
  const [reviewedKey, setReviewedKey] = useState(false);
  const [manualCount, setManualCount] = useState('40');
  const [manual, setManual] = useState(false);
  const [sheet, setSheet] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const modal = useRef<HTMLElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key === 'Tab') {
        const elements = [...(modal.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),iframe') ?? [])];
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = overflow; previous?.focus(); };
  }, [onClose]);
  const status = exportKeyStatus(snapshot);
  const keyAllowed = status === 'current' || (status === 'unverified' && reviewedKey);
  const mc = useMemo(() => keyAllowed ? exportMcNumbers(snapshot.answerKey?.answerKeyQuestions ?? []) : [], [snapshot, keyAllowed]);
  const numbers = !manual && mc.length ? mc : Array.from({ length: Math.min(60, Math.max(0, Number(manualCount) || 0)) }, (_, i) => i + 1);
  const validCount = Number.isInteger(Number(manualCount)) && Number(manualCount) >= 1 && Number(manualCount) <= 60;
  const html = useMemo(() => artifact === 'sheet' ? sheet : artifact === 'key' && keyAllowed ? exportPrintHtml(`${snapshot.title} — Đáp án & barem`, snapshot.answerKey?.content ?? '') : artifact === 'exam' ? exportPrintHtml(snapshot.title, snapshot.content) : '', [artifact, sheet, keyAllowed, snapshot]);
  const switchArtifact = (next: Artifact) => { setArtifact(next); setReady(false); setError(''); };
  const generateSheet = async () => {
    if (!manual && mc.length > 60) { setError('Đề có hơn 60 câu A–D; mẫu phiếu này chỉ hỗ trợ tối đa 60 câu. Không tự cắt bớt câu.'); return; }
    if ((!mc.length || manual) && !validCount) { setError('Nhập số nguyên từ 1 đến 60 câu.'); return; }
    setPending(true); setError(''); setReady(false);
    try {
      const response = await fetch(basePath('/api/editor/export-sheet'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: snapshot.title, numbers }) });
      const data = await response.json();
      if (!response.ok || typeof data.html !== 'string') throw new Error(data.error || 'Không tạo được phiếu.');
      setSheet(data.html);
    } catch (e) { setError(e instanceof Error ? e.message : 'Không tạo được phiếu.'); }
    finally { setPending(false); }
  };
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-2 sm:p-6" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section ref={modal} role="dialog" aria-modal="true" aria-labelledby="export-title" className="flex max-h-[95dvh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-line bg-white shadow-xl">
      <header className="flex items-start justify-between gap-3 border-b border-line p-4"><div><h2 id="export-title" className="text-lg font-semibold">Chốt đề & xuất PDF</h2><p className="mt-1 text-xs text-ink-3">Bản chụp nội dung lúc mở hộp thoại; không khóa hay thay đổi đề gốc.</p></div><button type="button" aria-label="Đóng xuất PDF" onClick={onClose} className="rounded p-2 hover:bg-surface-3"><X className="size-4" /></button></header>
      <div className="min-h-0 overflow-auto p-4">
        <div className="flex flex-wrap gap-2" aria-label="Chọn bản in">{([['exam', 'Đề thi'], ['key', 'Đáp án & barem'], ['sheet', 'Phiếu tô trắc nghiệm']] as const).map(([id, label]) => <button key={id} type="button" aria-pressed={artifact === id} onClick={() => switchArtifact(id)} className={`rounded border px-3 py-2 text-sm ${artifact === id ? 'border-accent bg-accent-soft text-accent' : 'border-line'}`}>{label}</button>)}</div>
        {status === 'stale' ? <p role="status" className="mt-3 text-sm text-warn">Đề đã thay đổi so với đáp án liên kết. Không thể xuất barem cũ hoặc dùng nó để suy ra số câu. Hãy cập nhật đáp án rồi mở lại hộp thoại; vẫn có thể in đề và phiếu nhập số câu thủ công.</p> : null}
        {status === 'missing' ? <p className="mt-3 text-sm text-ink-3">Chưa có đáp án liên kết. Bạn vẫn in được đề và phiếu A–D nhập số câu thủ công.</p> : null}
        {status === 'unverified' ? <label className="mt-3 flex items-start gap-2 text-sm text-warn"><input type="checkbox" checked={reviewedKey} onChange={e => { setReviewedKey(e.target.checked); setReady(false); setSheet(''); }} />Tôi đã đối chiếu đáp án cũ chưa có dấu phiên bản với đề hiện tại.</label> : null}
        {artifact === 'key' && !keyAllowed ? <p className="mt-4 text-sm">Đáp án chưa đủ điều kiện xuất.</p> : null}
        {artifact === 'sheet' ? <div className="mt-3 space-y-2 rounded border border-line p-3 text-sm">
          <p>Phiếu A–D trống, không in đáp án. Phiếu độc lập, chưa liên kết đợt chấm; không bảo đảm quét vào một đợt chấm khác.</p>
          {mc.length ? <><p>Nhận diện {mc.length} câu chọn A–D từ đáp án có cấu trúc.</p><label className="flex gap-2"><input type="checkbox" checked={manual} onChange={e => { setManual(e.target.checked); setSheet(''); }} />Nhập số câu thủ công (đánh số từ 1)</label></> : <p>Không có cấu trúc A–D đã xác minh: vui lòng nhập số câu.</p>}
          {(!mc.length || manual) ? <label className="flex items-center gap-2">Số câu A–D<input aria-label="Số câu A–D" type="number" min={1} max={60} step={1} value={manualCount} onChange={e => { setManualCount(e.target.value); setSheet(''); }} className="w-20 rounded border border-line px-2 py-1" /></label> : null}
          <p className="text-xs text-ink-3">Tối đa 60 câu trên một tờ A4. Chưa hỗ trợ ô Đúng/Sai và trả lời ngắn; các dạng này không được tự chuyển thành A–D.</p>
          <button type="button" disabled={pending} onClick={() => void generateSheet()} className="flex items-center gap-2 rounded border border-line px-3 py-1.5">{pending ? <Loader2 className="size-4 animate-spin" /> : null}Tạo phiếu xem trước</button>
        </div> : null}
        {error ? <p role="alert" className="mt-3 text-sm text-red-700">{error}</p> : null}
        {html ? <iframe key={artifact} ref={frame} title="Xem trước bản in" sandbox="allow-same-origin allow-modals" srcDoc={html} onLoad={() => setReady(true)} className="mt-4 h-[45dvh] w-full rounded border border-line bg-white" /> : null}
        <label className="mt-4 flex items-start gap-2 text-sm"><input type="checkbox" checked={reviewed} onChange={e => setReviewed(e.target.checked)} />Tôi đã rà soát đề, đáp án cần dùng và bản xem trước trước khi in.</label>
        <p className="mt-2 text-xs text-ink-3">Nút bên dưới mở hộp thoại in của trình duyệt. Chọn “Lưu dưới dạng PDF” để lưu PDF; A4, tỷ lệ 100%, tắt đầu/chân trang. Không phải tệp PDF được máy chủ tạo sẵn.</p>
      </div>
      <footer className="flex justify-end gap-2 border-t border-line p-3"><button type="button" onClick={onClose} className="rounded border border-line px-3 py-2 text-sm">Đóng</button><button type="button" disabled={!reviewed || !html || !ready || pending} onClick={() => { try { frame.current?.contentWindow?.focus(); frame.current?.contentWindow?.print(); } catch { setError('Trình duyệt chặn in. Vui lòng thử lại.'); } }} className="flex items-center gap-2 rounded bg-accent px-3 py-2 text-sm text-white disabled:opacity-40"><Printer className="size-4" />In / Lưu PDF</button></footer>
    </section>
  </div>;
}
