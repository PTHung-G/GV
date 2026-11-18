'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { basePath } from './api-url';
import { duplicateDocumentPair, mergeImportedDocuments, removeDocumentPair, validateDocuments } from './document-library';
import { reconcileStructure, type StructuredExam } from './structured-exam';
import type { AnswerKeyQuestion } from './grading/rubric';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

export type DocTab = {
  id: string;
  name: string;
  /** Original exam kept alongside generated variants (mã đề). */
  isOriginal?: boolean;
  inMyExams?: boolean;
};

export type ExamDoc = {
  id: string;
  title: string;
  /** Sanitised HTML of the A4 page(s). */
  content: string;
  /** Optional identities for the current HTML; never an alternate content source. */
  structure?: StructuredExam;
  subject: string;
  grade: number | null;
  createdAt: string;
  updatedAt: string;
  /** Present when the doc was copied from a community exam. */
  sourceId?: string;
  shared?: boolean;
  authorName?: string;
  /**
   * Marks an answer-key sheet belonging to another document. The key lives on
   * its own page so the exam itself can still be printed for students.
   */
  kind?: 'exam' | 'answer-key';
  /** For `kind: 'answer-key'`, the id of the exam it grades. */
  parentId?: string;
  answerKeyQuestions?: AnswerKeyQuestion[];
  sourceContentHash?: string;
  contentStatus?: 'complete' | 'preview';
};

type DocsState = {
  docs: ExamDoc[];
  ready: boolean;
  create: (partial?: Partial<ExamDoc>) => string;
  update: (id: string, patch: Partial<ExamDoc>) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => string | null;
  openNew: () => void;
  saveStatus: 'local' | 'loading' | 'saving' | 'saved' | 'error';
};

const STORAGE_KEY = 'sdt.docs.v1';
const SAMPLE_SEEDED_KEY = 'sdt.docs.sample.v1';
const DocsContext = createContext<DocsState | null>(null);

function seedDoc(): ExamDoc {
  const now = new Date().toISOString();
  return {
    id: 'demo-de-giua-ky-toan-9',
    title: 'Đề kiểm tra giữa kì I môn Toán 9',
    subject: 'toan',
    grade: 9,
    createdAt: now,
    updatedAt: now,
    content: `<div class="doc-header"><div class="doc-header-col"><p><b>TRƯỜNG THCS NGUYỄN DU</b></p><p>TỔ KHOA HỌC TỰ NHIÊN</p></div><div class="doc-header-col"><p><b>KIỂM TRA GIỮA HỌC KÌ I</b></p><p>Môn: Toán – Lớp 9</p></div></div>
<h1>ĐỀ KIỂM TRA GIỮA HỌC KÌ I</h1>
<p style="text-align:center"><b>Môn: Toán – Lớp 9</b><br/>Thời gian làm bài: 90 phút (không kể thời gian phát đề)</p>
<h3>PHẦN I. TRẮC NGHIỆM (3,0 điểm)</h3>
<p><b>Câu 1.</b> Căn bậc hai số học của 81 là</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. 9.</p></div><div class="doc-grid-cell"><p>B. −9.</p></div><div class="doc-grid-cell"><p>C. 81.</p></div><div class="doc-grid-cell"><p>D. ±9.</p></div></div>
<p><b>Câu 2.</b> Giá trị của biểu thức $\\sqrt{x-2}$ xác định khi</p>
<div class="doc-grid"><div class="doc-grid-cell"><p>A. x ≥ 2.</p></div><div class="doc-grid-cell"><p>B. x &gt; 2.</p></div><div class="doc-grid-cell"><p>C. x ≤ 2.</p></div><div class="doc-grid-cell"><p>D. x &lt; 2.</p></div></div>
<h3>PHẦN II. TỰ LUẬN (7,0 điểm)</h3>
<p><b>Câu 3.</b> (2,0 điểm) Rút gọn biểu thức $A = \\dfrac{1}{\\sqrt{x}-1} - \\dfrac{1}{\\sqrt{x}+1}$ với $x \\ge 0,\\ x \\ne 1$.</p>
<p><b>Câu 4.</b> (2,0 điểm) Cho tam giác ABC vuông tại A, đường cao AH. Biết AB = 6 cm, AC = 8 cm. Tính BC, AH và diện tích tam giác ABC.</p>
<p><b>Câu 5.</b> (3,0 điểm) Cho đường tròn (O; R) và điểm A nằm ngoài đường tròn. Kẻ hai tiếp tuyến AB, AC tới (O). Chứng minh rằng AO là đường trung trực của BC.</p>`,
  };
}

/** The sample a first-time teacher can grade immediately: exam plus its key. */
const SAMPLE_EXAM_ID = 'mau-de-toan-9-20-cau';
const SAMPLE_KEY_ID = 'mau-de-toan-9-20-cau-dap-an';

function sampleExamDoc(): ExamDoc {
  const now = new Date().toISOString();
  return {
    id: SAMPLE_EXAM_ID,
    title: 'Đề kiểm tra 20 câu – Toán 9',
    subject: 'toan',
    grade: 9,
    createdAt: now,
    updatedAt: now,
    content:
      '<div class="doc-header"><div class="doc-header-col"><p><b>TRƯỜNG THCS …</b></p><p>TỔ KHOA HỌC TỰ NHIÊN</p></div><div class="doc-header-col"><p><b>KIỂM TRA 20 CÂU</b></p><p>Môn: Toán – Lớp 9 · 30 phút</p></div></div>\n<h1>ĐỀ KIỂM TRA 20 CÂU – TOÁN 9</h1>\n<p style="text-align:center">Chọn một đáp án đúng cho mỗi câu. Mỗi câu 0,5 điểm.</p>\n<p><b>Câu 1.</b> Căn bậc hai số học của 16 là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 4</p></div><div class="doc-grid-cell"><p>B. −4</p></div><div class="doc-grid-cell"><p>C. ±4</p></div><div class="doc-grid-cell"><p>D. 8</p></div></div>\n<p><b>Câu 2.</b> Điều kiện xác định của biểu thức √(x − 3) là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. x ≥ −3</p></div><div class="doc-grid-cell"><p>B. x ≥ 3</p></div><div class="doc-grid-cell"><p>C. x ≤ 3</p></div><div class="doc-grid-cell"><p>D. x ≠ 3</p></div></div>\n<p><b>Câu 3.</b> Rút gọn √50 được</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 2√5</p></div><div class="doc-grid-cell"><p>B. 25√2</p></div><div class="doc-grid-cell"><p>C. 5√2</p></div><div class="doc-grid-cell"><p>D. 10√5</p></div></div>\n<p><b>Câu 4.</b> Hàm số y = (m − 2)x + 1 đồng biến trên ℝ khi</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. m < 2</p></div><div class="doc-grid-cell"><p>B. m = 2</p></div><div class="doc-grid-cell"><p>C. m ≤ 2</p></div><div class="doc-grid-cell"><p>D. m > 2</p></div></div>\n<p><b>Câu 5.</b> Nghiệm của hệ phương trình x + y = 5, x − y = 1 là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. (3; 2)</p></div><div class="doc-grid-cell"><p>B. (2; 3)</p></div><div class="doc-grid-cell"><p>C. (4; 1)</p></div><div class="doc-grid-cell"><p>D. (1; 4)</p></div></div>\n<p><b>Câu 6.</b> Nghiệm của phương trình x² − 5x + 6 = 0 là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 1 và 6</p></div><div class="doc-grid-cell"><p>B. 2 và 3</p></div><div class="doc-grid-cell"><p>C. −2 và −3</p></div><div class="doc-grid-cell"><p>D. −1 và −6</p></div></div>\n<p><b>Câu 7.</b> Tam giác ABC vuông tại A có AB = 3, AC = 4. Khi đó sin B bằng</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 3/5</p></div><div class="doc-grid-cell"><p>B. 3/4</p></div><div class="doc-grid-cell"><p>C. 4/5</p></div><div class="doc-grid-cell"><p>D. 4/3</p></div></div>\n<p><b>Câu 8.</b> Đường tròn (O; 5 cm) có đường kính bằng</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 2,5 cm</p></div><div class="doc-grid-cell"><p>B. 5 cm</p></div><div class="doc-grid-cell"><p>C. 20 cm</p></div><div class="doc-grid-cell"><p>D. 10 cm</p></div></div>\n<p><b>Câu 9.</b> Giá trị của √((2 − √5)²) bằng</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. √5 − 2</p></div><div class="doc-grid-cell"><p>B. 2 − √5</p></div><div class="doc-grid-cell"><p>C. √5 + 2</p></div><div class="doc-grid-cell"><p>D. 5 − 2</p></div></div>\n<p><b>Câu 10.</b> Rút gọn √12 − √27 + √3 được</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 2√3</p></div><div class="doc-grid-cell"><p>B. 0</p></div><div class="doc-grid-cell"><p>C. −2√3</p></div><div class="doc-grid-cell"><p>D. 4√3</p></div></div>\n<p><b>Câu 11.</b> Hệ số góc của đường thẳng y = −2x + 3 là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 3</p></div><div class="doc-grid-cell"><p>B. 2</p></div><div class="doc-grid-cell"><p>C. −2</p></div><div class="doc-grid-cell"><p>D. −3</p></div></div>\n<p><b>Câu 12.</b> Nghiệm của phương trình 2x − 6 = 0 là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. x = −3</p></div><div class="doc-grid-cell"><p>B. x = 12</p></div><div class="doc-grid-cell"><p>C. x = 2</p></div><div class="doc-grid-cell"><p>D. x = 3</p></div></div>\n<p><b>Câu 13.</b> Giá trị của cos 30° là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. √3/2</p></div><div class="doc-grid-cell"><p>B. 1/2</p></div><div class="doc-grid-cell"><p>C. √2/2</p></div><div class="doc-grid-cell"><p>D. √3/3</p></div></div>\n<p><b>Câu 14.</b> Diện tích hình tròn bán kính 3 cm là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 3π cm²</p></div><div class="doc-grid-cell"><p>B. 9π cm²</p></div><div class="doc-grid-cell"><p>C. 6π cm²</p></div><div class="doc-grid-cell"><p>D. 12π cm²</p></div></div>\n<p><b>Câu 15.</b> Số nào dưới đây là nghiệm của phương trình x² = 9</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 9</p></div><div class="doc-grid-cell"><p>B. −9</p></div><div class="doc-grid-cell"><p>C. 3 và −3</p></div><div class="doc-grid-cell"><p>D. 81</p></div></div>\n<p><b>Câu 16.</b> √(x²) = 3 khi</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. x = 3</p></div><div class="doc-grid-cell"><p>B. x = −3</p></div><div class="doc-grid-cell"><p>C. x = ±9</p></div><div class="doc-grid-cell"><p>D. x = ±3</p></div></div>\n<p><b>Câu 17.</b> Cho đường tròn (O; R) và dây AB = R. Số đo góc AOB bằng</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 60°</p></div><div class="doc-grid-cell"><p>B. 90°</p></div><div class="doc-grid-cell"><p>C. 120°</p></div><div class="doc-grid-cell"><p>D. 30°</p></div></div>\n<p><b>Câu 18.</b> Tiếp tuyến của một đường tròn vuông góc với bán kính tại</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. tâm</p></div><div class="doc-grid-cell"><p>B. tiếp điểm</p></div><div class="doc-grid-cell"><p>C. trung điểm của dây</p></div><div class="doc-grid-cell"><p>D. điểm bất kỳ</p></div></div>\n<p><b>Câu 19.</b> Giá trị của biểu thức (√7 − √3)(√7 + √3) là</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 10</p></div><div class="doc-grid-cell"><p>B. 7 − 3√21</p></div><div class="doc-grid-cell"><p>C. 4</p></div><div class="doc-grid-cell"><p>D. 21</p></div></div>\n<p><b>Câu 20.</b> Hai đường tròn (O; 3 cm) và (O\'; 5 cm) tiếp xúc ngoài khi OO\' bằng</p>\n<div class="doc-grid"><div class="doc-grid-cell"><p>A. 2 cm</p></div><div class="doc-grid-cell"><p>B. 3 cm</p></div><div class="doc-grid-cell"><p>C. 5 cm</p></div><div class="doc-grid-cell"><p>D. 8 cm</p></div></div>',
  };
}

function sampleKeyDoc(): ExamDoc {
  const now = new Date().toISOString();
  return {
    id: SAMPLE_KEY_ID,
    title: 'Đáp án – Đề kiểm tra 20 câu Toán 9',
    subject: 'toan',
    grade: 9,
    createdAt: now,
    updatedAt: now,
    kind: 'answer-key',
    parentId: SAMPLE_EXAM_ID,
    content:
      '<h1>HƯỚNG DẪN CHẤM VÀ THANG ĐIỂM</h1>\n<p style="text-align:center">Đề kiểm tra 20 câu – Toán 9 · Tổng 10 điểm · Mỗi câu 0,5 điểm</p>\n<table><thead><tr><th>Câu</th><th>Đáp án</th><th>Điểm</th></tr></thead><tbody>\n<tr><td>1</td><td><b>A</b></td><td>0,5</td></tr>\n<tr><td>2</td><td><b>B</b></td><td>0,5</td></tr>\n<tr><td>3</td><td><b>C</b></td><td>0,5</td></tr>\n<tr><td>4</td><td><b>D</b></td><td>0,5</td></tr>\n<tr><td>5</td><td><b>A</b></td><td>0,5</td></tr>\n<tr><td>6</td><td><b>B</b></td><td>0,5</td></tr>\n<tr><td>7</td><td><b>C</b></td><td>0,5</td></tr>\n<tr><td>8</td><td><b>D</b></td><td>0,5</td></tr>\n<tr><td>9</td><td><b>A</b></td><td>0,5</td></tr>\n<tr><td>10</td><td><b>B</b></td><td>0,5</td></tr>\n<tr><td>11</td><td><b>C</b></td><td>0,5</td></tr>\n<tr><td>12</td><td><b>D</b></td><td>0,5</td></tr>\n<tr><td>13</td><td><b>A</b></td><td>0,5</td></tr>\n<tr><td>14</td><td><b>B</b></td><td>0,5</td></tr>\n<tr><td>15</td><td><b>C</b></td><td>0,5</td></tr>\n<tr><td>16</td><td><b>D</b></td><td>0,5</td></tr>\n<tr><td>17</td><td><b>A</b></td><td>0,5</td></tr>\n<tr><td>18</td><td><b>B</b></td><td>0,5</td></tr>\n<tr><td>19</td><td><b>C</b></td><td>0,5</td></tr>\n<tr><td>20</td><td><b>D</b></td><td>0,5</td></tr>\n</tbody></table>',
  };
}

export function DocsProvider({ children }: { children: React.ReactNode }) {
  const [docs, setDocs] = useState<ExamDoc[]>([]);
  const [ready, setReady] = useState(false);
  const [loadedOwner, setLoadedOwner] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<DocsState['saveStatus']>('loading');
  const [error, setError] = useState('');
  const [legacy, setLegacy] = useState<ExamDoc[]>([]);
  const [recovery, setRecovery] = useState<ExamDoc[] | null>(null);
  const { user, ready: authReady } = useAuth();
  const router = useRouter();
  const owner = user?.id ?? 'guest';
  const sync = useRef({ owner: '', revision: 0, saved: '', pending: '', saving: false, enabled: false });

  useEffect(() => {
    if (!authReady) return;
    let cancelled = false;
    const state = { owner, revision: 0, saved: '', pending: '', saving: false, enabled: false };
    sync.current = state;
    setReady(false);
    setDocs([]);
    setLoadedOwner(null);
    setLegacy([]);
    setRecovery(null);
    setError('');
    setSaveStatus('loading');
    (async () => {
      try {
        // Browser storage is optional recovery data, never a prerequisite to load
        // the authoritative account library (it can be blocked or corrupted).
        let legacyDocs: ExamDoc[] = [];
        try {
          const legacyRaw = localStorage.getItem(STORAGE_KEY);
          legacyDocs = legacyRaw ? validateDocuments(JSON.parse(legacyRaw), { strictStructure: false }) : [];
          if (!cancelled && user && !localStorage.getItem(`sdt.docs.import-dismissed.${owner}`)) setLegacy(legacyDocs);
        } catch { /* Keep the original storage untouched for manual recovery. */ }
        if (!user) {
          // Guests can view examples but never see another account's cached library.
          const examples = [sampleExamDoc(), sampleKeyDoc(), seedDoc()];
          state.saved = JSON.stringify(examples);
          if (!cancelled) { setDocs(examples); setSaveStatus('local'); }
        } else {
          const res = await fetch(basePath('/api/documents'), { cache: 'no-store' });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Không tải được kho đề từ tài khoản.');
          let next = validateDocuments(data.documents, { strictStructure: false });
          state.revision = data.revision;
          state.saved = JSON.stringify(next);
          try {
            const cached = localStorage.getItem(`sdt.docs.account.${owner}`);
            if (cached) {
              const backup = JSON.parse(cached);
              if (backup?.dirty && JSON.stringify(backup.documents) !== state.saved) {
                const recovered = validateDocuments(backup.documents, { strictStructure: false });
                if (backup.revision === state.revision) next = recovered;
                else if (!cancelled) setRecovery(recovered);
              }
            }
          } catch {
            if (!cancelled) setError('Không đọc được bản dự phòng trên trình duyệt. Kho đề máy chủ vẫn được tải.');
          }
          state.enabled = true;
          if (!cancelled) { setDocs(next); setSaveStatus('saved'); }
        }
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Không đọc được kho đề.');
          setSaveStatus('error');
        }
      } finally {
        if (!cancelled) { setLoadedOwner(owner); setReady(true); }
      }
    })();
    return () => { cancelled = true; state.enabled = false; };
  }, [authReady, owner, user]);

  useEffect(() => {
    const state = sync.current;
    if (!ready || loadedOwner !== owner || !user || !state.saved) return;
    if (recovery) return; // Preserve the conflicting backup until the user explicitly resolves it.
    const serialized = JSON.stringify(docs);
    state.pending = serialized;
    try {
      localStorage.setItem(`sdt.docs.account.${owner}`, JSON.stringify({ revision: state.revision, documents: docs, dirty: serialized !== state.saved }));
    } catch { setError('Không lưu được bản dự phòng trên trình duyệt. Đừng đóng trang khi chưa lưu lên tài khoản.'); }
    if (serialized === state.saved || !state.enabled) return;
    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      if (state.saving || !state.enabled) return;
      state.saving = true;
      try {
        while (state.enabled && state.pending !== state.saved) {
          const outgoing = state.pending;
          const res = await fetch(basePath('/api/documents'), {
            method: 'PUT', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ ownerId: owner, revision: state.revision, documents: JSON.parse(outgoing) }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Không lưu được kho đề lên tài khoản.');
          state.revision = data.revision;
          state.saved = outgoing;
          if (!state.enabled) return;
          localStorage.setItem(`sdt.docs.account.${owner}`, JSON.stringify({ revision: state.revision, documents: JSON.parse(state.pending), dirty: state.pending !== state.saved }));
        }
        if (state.enabled) { setSaveStatus('saved'); setError(''); }
      } catch (cause) {
        if (state.enabled) {
          state.enabled = false; // Never overwrite a concurrent device after a conflict.
          setSaveStatus('error');
          setError(cause instanceof Error ? cause.message : 'Không lưu được kho đề.');
        }
      } finally { state.saving = false; }
    }, 500);
    return () => clearTimeout(timer);
  }, [docs, loadedOwner, owner, ready, user, recovery]);

  const create = useCallback((partial: Partial<ExamDoc> = {}) => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const doc: ExamDoc = {
      id,
      title: 'Đề thi mới',
      content: '',
      subject: 'toan',
      grade: null,
      createdAt: now,
      updatedAt: now,
      ...partial,
    };
    doc.structure = reconcileStructure(doc.content, doc.structure) ?? undefined;
    setDocs((prev) => [doc, ...prev]);
    return id;
  }, []);

  const update = useCallback((id: string, patch: Partial<ExamDoc>) => {
    setDocs((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const next = { ...d, ...patch, updatedAt: new Date().toISOString() };
        next.structure = reconcileStructure(next.content, next.structure) ?? undefined;
        return next;
      }),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setDocs((prev) => removeDocumentPair(prev, id));
  }, []);

  const duplicate = useCallback(
    (id: string) => {
      const result = duplicateDocumentPair(docs, id, () => crypto.randomUUID(), new Date().toISOString());
      if (result.id) setDocs(result.docs);
      return result.id;
    },
    [docs],
  );

  const openNew = useCallback(() => {
    if (!user) return;
    const id = create();
    router.push(`/doc/${id}`);
  }, [create, router, user]);

  const accountReady = ready && loadedOwner === owner;
  const value = useMemo<DocsState>(
    () => ({ docs: accountReady ? docs : [], ready: accountReady, create, update, remove, duplicate, openNew, saveStatus }),
    [accountReady, docs, create, update, remove, duplicate, openNew, saveStatus],
  );

  function backupLibrary() {
    const blob = new Blob([JSON.stringify({ documents: docs, recovery }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sao-luu-kho-de.json'; a.click();
    URL.revokeObjectURL(url);
  }

  return <DocsContext.Provider value={value}>
    {accountReady && user && (legacy.length > 0 || recovery || error) ? (
      <div role="status" className="border-b border-warn-line bg-warn-soft px-4 py-2 text-sm text-warn">
        {error ? <p>{error} <button className="underline" onClick={backupLibrary}>Tải bản sao lưu</button></p> : null}
        {legacy.length > 0 ? <p>Có {legacy.length} tài liệu cũ trên trình duyệt dùng chung. Chỉ nhập nếu thuộc tài khoản {user.email}.
          {' '}<button className="underline" onClick={() => {
            setDocs((current) => mergeImportedDocuments(current, legacy));
            localStorage.setItem(`sdt.docs.import-dismissed.${owner}`, '1'); setLegacy([]);
          }}>Xác nhận nhập vào tài khoản này</button>
          {' · '}<button className="underline" onClick={() => {
            localStorage.setItem(`sdt.docs.import-dismissed.${owner}`, '1'); setLegacy([]);
          }}>Không nhập</button>
        </p> : null}
        {recovery ? <p>Có bản nháp chưa lưu khác với phiên bản máy chủ. Không tự ghi đè dữ liệu thiết bị khác.
          {' '}<button className="underline" onClick={backupLibrary}>Tải bản dự phòng</button>
          {' · '}<button className="underline" onClick={() => setRecovery(null)}>Giữ bản máy chủ</button>
        </p> : null}
      </div>
    ) : null}
    {children}
  </DocsContext.Provider>;
}

export function useDocs() {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error('useDocs must be used inside <DocsProvider>');
  return ctx;
}

export function useDoc(id: string) {
  const { docs, ready, update } = useDocs();
  const doc = docs.find((d) => d.id === id) ?? null;
  return { doc, ready, update };
}
