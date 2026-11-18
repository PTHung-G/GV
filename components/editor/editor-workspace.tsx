'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { basePath } from '@/lib/api-url';
import { ArrowLeft, Check, CloudOff, Loader2, Printer } from 'lucide-react';
import { useDoc, useDocs } from '@/lib/docs-store';
import { useAuth } from '@/lib/auth-context';
import { sanitize } from '@/lib/editor-model';
import { reconcileStructure, type StructuredExam } from '@/lib/structured-exam';
import { renderMath, renderMathInHtml } from '@/lib/math';
import { CONTENT_HEIGHT, layoutChoiceGrids } from '@/lib/layout';
import { splitAcrossPages, unsplitText } from '@/lib/split-text';
import { EditorToolbar } from './editor-toolbar';
import { EditorOutline } from './editor-outline';
import { AiPanel } from './ai-panel';
import { FigureDialog } from './figure-dialog';
import { MathPopover, type MathTarget } from './math-popover';
import { cn } from '@/lib/utils';
import { examContentHash } from '@/lib/exam-revision';
import { renderAnswerKeyHtml } from '@/lib/grading/answer-key-render';
import type { AnswerKeyQuestion } from '@/lib/grading/rubric';
import { ExportDialog } from './export-dialog';
import { ReleaseDialog } from './release-dialog';
import type { ExportSnapshot } from '@/lib/editor-export';
import { SaveToQuestionBank } from '@/components/question-bank/save-to-question-bank';

type SaveState = 'idle' | 'saving' | 'saved';

const A4_WIDTH = 793.7; // 210mm at 96dpi
const A4_HEIGHT = 1122.5; // 297mm at 96dpi

export function EditorWorkspace({ docId }: { docId: string }) {
  const { doc, ready, update } = useDoc(docId);
  const { docs, create, saveStatus } = useDocs();
  const { user } = useAuth();
  const pageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstLoad = useRef(true);
  const artifactRef = useRef<StructuredExam | undefined>(undefined);
  const [structure, setStructure] = useState<StructuredExam | undefined>(undefined);
  const identity = `${user?.id ?? 'guest'}:${docId}`;
  const identityRef = useRef(identity);
  identityRef.current = identity;

  const [title, setTitle] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [zoom, setZoom] = useState(100);
  const [outlineOpen, setOutlineOpen] = useState(true);
  const [aiOpen, setAiOpen] = useState(true);
  const [exportSnapshot, setExportSnapshot] = useState<ExportSnapshot | null>(null);
  const [quickPrint, setQuickPrint] = useState(false);
  const [figureOpen, setFigureOpen] = useState(false);
  const [html, setHtml] = useState('');
  const [baseline, setBaseline] = useState('');
  const [mathTarget, setMathTarget] = useState<MathTarget | null>(null);
  const [answerKey, setAnswerKey] = useState<{
    state: 'idle' | 'loading' | 'done' | 'error';
    questions: Array<{ label: string; answer: string }>;
    message?: string;
  }>({ state: 'idle', questions: [] });

  /**
   * The exam and its answer key are separate documents, so the bottom strip
   * lists them as tabs: one page per printable artefact.
   */
  const parentId = doc?.kind === 'answer-key' ? (doc.parentId ?? docId) : docId;
  const keyDocs = docs.filter((d) => d.kind === 'answer-key' && d.parentId === parentId);
  const tabs = [
    {
      id: parentId,
      label: 'Đề gốc',
      kind: 'exam' as const,
    },
    ...keyDocs.map((d) => ({
      id: d.id,
      label: 'Đáp án',
      kind: 'answer-key' as const,
    })),
  ];
  const hasAnswerKey = keyDocs.length > 0;
  const sourceExam = docs.find(item => item.id === parentId);
  const activeKey = doc?.kind === 'answer-key' ? doc : keyDocs[0];
  const keyNeedsReview = !!activeKey && (!activeKey.sourceContentHash || !sourceExam || activeKey.sourceContentHash !== examContentHash(sourceExam.content));
  const isAnswerKeyDoc = doc?.kind === 'answer-key';

  // Seed the surface once per document id (docs load asynchronously from storage).
  /**
   * Page breaks. Blocks are placed one at a time against the remaining room on
   * the current sheet; inserting a spacer shifts everything after it, so the
   * running position is tracked incrementally instead of read from the DOM.
   */
  const paginate = useCallback((target: HTMLElement) => {
    target.querySelectorAll('[data-page-spacer]').forEach((el) => el.remove());
    // Restore blocks that a previous pass split, so measurements start clean.
    unsplitText(target);

    const budget = CONTENT_HEIGHT;

    // A plain-text block that crosses the boundary is split at a word break so
    // the tail continues on the next sheet instead of leaving a hole.
    splitAcrossPages(target, budget, (block, text) => {
      const clone = block.cloneNode(false) as HTMLElement;
      clone.textContent = text;
      return clone;
    });

    const blocks = Array.from(target.children) as HTMLElement[];
    if (!blocks.length) return;

    // Flush pending layout first: without this the heights below still reflect
    // the spacers that were just removed.
    void target.offsetHeight;
    const heights = blocks.map((b) => b.getBoundingClientRect().height);
    let used = 0;

    for (let i = 0; i < blocks.length; i++) {
      const h = heights[i];
      if (used > 0 && used + h > budget) {
        // A drawing stranded at the top of a sheet, away from the question it
        // belongs to, is the one layout mistake a teacher is sure to notice.
        // When the figure fits on a fresh sheet together with the paragraph
        // just above it, the break is taken before that paragraph instead.
        let start = i;
        if (blocks[i].matches('figure.doc-figure')) {
          let j = i - 1;
          while (j >= 0 && blocks[j].hasAttribute('data-page-spacer')) j -= 1;
          const lead = j >= 0 ? blocks[j] : null;
          if (
            lead &&
            lead.tagName === 'P' &&
            heights[j] <= budget * 0.3 &&
            heights[j] + h <= budget
          ) {
            start = j;
          }
        }

        const spacer = document.createElement('div');
        spacer.setAttribute('data-page-spacer', '');
        spacer.setAttribute('aria-hidden', 'true');
        spacer.style.height = `${Math.max(1, budget - used)}px`;
        blocks[start].before(spacer);

        // Blocks start..i all move to the new sheet.
        used = 0;
        for (let k = start; k < i; k += 1) used += heights[k];
      }
      used += h;
    }
  }, []);

  /**
   * LaTeX stays in the saved HTML; the on-screen page shows KaTeX MathML with the
   * original `$...$` stashed in data-latex so edits round-trip losslessly.
   */
  const paint = useCallback((target: HTMLElement, stored: string) => {
    target.innerHTML = stored;
    for (const el of Array.from(target.querySelectorAll<HTMLElement>('span.doc-math'))) {
      const latex = el.dataset.latex;
      if (latex) el.outerHTML = latex;
    }
    target.innerHTML = renderMathInHtml(target.innerHTML);
    for (const el of Array.from(target.querySelectorAll<HTMLElement>('span.doc-math'))) {
      const tex = el.querySelector('annotation[encoding="application/x-tex"]')?.textContent ?? '';
      el.dataset.latex = el.classList.contains('doc-math-display') ? `$$${tex}$$` : `$${tex}$`;
    }
    layoutChoiceGrids(target);
  }, []);

  /**
   * Layout passes run after the browser has measured the painted content.
   * Two frames: one for the DOM change, one for fonts/KaTeX to settle.
   */
  const relayout = useCallback(() => {
    const el = pageRef.current;
    if (!el) return;
    layoutChoiceGrids(el);
    paginate(el);
  }, [paginate]);

  /** Converts rendered MathML back to the `$...$` source before persisting. */
  const unmath = useCallback((root: HTMLElement) => {
    const clone = root.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[data-page-spacer]').forEach((el) => el.remove());
    // A page split turns one block into head+tail; merge them back so the saved
    // document holds whole paragraphs rather than screen fragments.
    unsplitText(clone);
    for (const el of Array.from(clone.querySelectorAll<HTMLElement>('span.doc-math'))) {
      if (el.dataset.latex) el.outerHTML = el.dataset.latex;
    }
    return clone.innerHTML;
  }, []);

  // Keep option grids and page breaks in sync with the rendered document.
  const layoutRaf = useRef<number | null>(null);
  useEffect(() => {
    if (layoutRaf.current) cancelAnimationFrame(layoutRaf.current);
    layoutRaf.current = requestAnimationFrame(() => {
      layoutRaf.current = requestAnimationFrame(() => relayout());
    });
    return () => {
      if (layoutRaf.current) cancelAnimationFrame(layoutRaf.current);
    };
  }, [html, zoom, relayout]);

  const seededFor = useRef<string | null>(null);
  useEffect(() => {
    if (!doc || seededFor.current === identity) return;
    seededFor.current = identity;
    firstLoad.current = false;
    setTitle(doc.title);
    const next = sanitize(doc.content);
    artifactRef.current = reconcileStructure(next, doc.structure) ?? undefined;
    setStructure(artifactRef.current);
    setHtml(next);
    setBaseline(next);
    if (pageRef.current) paint(pageRef.current, next);
  }, [doc, identity, paint]);

  // A stable flush always reads the latest document/title AND the synchronous
  // artifact ref. Blur/unmount must not resurrect the pre-apply artifact.
  const liveRef = useRef({ doc, title, baseline, update, identity });
  liveRef.current = { doc, title, baseline, update, identity };
  const capture = useCallback(() => {
    if (!pageRef.current) return '';
    const next = unmath(pageRef.current);
    const reconciled = reconcileStructure(next, artifactRef.current) ?? undefined;
    setStructure(reconciled);
    return next;
  }, [unmath]);
  const flush = useCallback(() => {
    const live = liveRef.current;
    if (!pageRef.current || !live.doc || seededFor.current !== live.identity || identityRef.current !== live.identity) return;
    const next = capture();
    const nextStructure = reconcileStructure(next, artifactRef.current) ?? undefined;
    const nextTitle = live.title.trim() || live.doc.title;
    if (next === live.baseline && nextTitle === live.doc.title && JSON.stringify(nextStructure) === JSON.stringify(live.doc.structure)) return;
    setSaveState('saving');
    live.update(live.doc.id, { content: next, structure: nextStructure, title: nextTitle, ...(live.doc.kind === 'answer-key' && next !== live.baseline ? { answerKeyQuestions: undefined, sourceContentHash: undefined } : {}) });
    // Keep repeated synchronous flushes idempotent before React commits.
    liveRef.current = { ...live, baseline: next };
    setBaseline(next);
    setHtml(next);
    setTimeout(() => setSaveState('saved'), 280);
  }, [capture]);

  const applyGenerated = (incoming: string, incomingStructure: StructuredExam | undefined, replace: boolean) => {
    const el = pageRef.current;
    if (!el || !doc || seededFor.current !== identity) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    const current = capture();
    const clean = sanitize(incoming);
    const incomingArtifact = reconcileStructure(clean, incomingStructure);
    const existingArtifact = reconcileStructure(current, artifactRef.current);
    const next = replace ? clean : current + clean;
    let candidate = incomingArtifact ?? undefined;
    if (!replace && current.trim()) {
      candidate = existingArtifact && incomingArtifact ? {
        version: 1,
        blocks: [...existingArtifact.blocks, ...incomingArtifact.blocks],
        questions: [...existingArtifact.questions, ...incomingArtifact.questions],
      } : undefined;
    }
    // Combined reconciliation rejects block/question ID collisions, as well as
    // any damage in either half. Append is always a top-level end insertion.
    artifactRef.current = reconcileStructure(next, candidate) ?? undefined;
    setStructure(artifactRef.current);
    paint(el, next);
    const content = unmath(el);
    artifactRef.current = reconcileStructure(content, artifactRef.current) ?? undefined;
    setStructure(artifactRef.current);
    setHtml(content);
    setBaseline(content);
    liveRef.current = { ...liveRef.current, baseline: content };
    update(doc.id, { content, structure: artifactRef.current, title: title.trim() || doc.title });
  };

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flush, 700);
  }, [flush]);

  /** Rewrites one formula in place, keeping the stored `$...$` in sync. */
  const replaceMath = useCallback(
    (el: HTMLElement, latex: string, display: boolean) => {
      const page = pageRef.current;
      if (!page) return;
      // Build the rendered span directly: round-tripping through
      // renderMathInHtml would treat the LaTeX inside the attribute as prose.
      const span = document.createElement('span');
      span.className = display ? 'doc-math doc-math-display' : 'doc-math';
      span.dataset.latex = display ? `$$${latex}$$` : `$${latex}$`;
      span.innerHTML = renderMath(latex, display);
      el.replaceWith(span);
      setHtml(unmath(page));
      scheduleSave();
      relayout();
    },
    [relayout, scheduleSave, unmath],
  );

  /** Opens the formula editor for the clicked `span.doc-math`. */
  const openMathEditor = useCallback((el: HTMLElement) => {
    const latex = (el.dataset.latex ?? '').replace(/^\$\$?|\$\$?$/g, '').trim();
    const rect = el.getBoundingClientRect();
    const width = 384;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    const top = Math.min(rect.bottom + 6, window.innerHeight - 220);
    setMathTarget({
      el,
      latex,
      display: el.classList.contains('doc-math-display'),
      top,
      left,
    });
  }, []);


  /** Asks the model for the answer key and appends it to the document. */
  const generateAnswerKey = useCallback(async () => {
    const page = pageRef.current;
    if (!page || !doc) return;
    const sourceContent = unmath(page);
    const sourceHash = examContentHash(sourceContent);
    const sourceId = doc.id;
    const sourceIdentity = identity;
    setAnswerKey({ state: 'loading', questions: [] });
    flush();
    try {
      const res = await fetch(basePath('/api/exam-answer-key'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          exam: { title: title.trim() || doc.title, content: sourceContent },
        }),
      });
      const data = (await res.json()) as {
        codes?: Array<{
          questions?: Array<{
            label: string;
            answer: string;
            points?: string;
            steps?: Array<{ text: string; points?: string }>;
          }>;
        }>;
        message?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? data.message ?? 'Không tạo được đáp án.');
      if (!pageRef.current || identityRef.current !== sourceIdentity || seededFor.current !== sourceIdentity || liveRef.current.doc?.id !== sourceId || examContentHash(unmath(pageRef.current)) !== sourceHash) {
        throw new Error('Đề đã thay đổi trong khi AI đang xử lý. Kết quả cũ không được lưu; hãy tạo lại đáp án.');
      }
      const questions: AnswerKeyQuestion[] = data.codes?.[0]?.questions ?? [];
      if (!questions.length) throw new Error('Mô hình không trả về đáp án nào.');
      setAnswerKey({ state: 'done', questions });

      const section = document.createElement('div');
      section.innerHTML = renderAnswerKeyHtml(questions, document);

      // The rubric carries LaTeX, so render it before it is stored — otherwise
      // the key would show raw "$…$" strings.
      section.innerHTML = renderMathInHtml(section.innerHTML);
      for (const el of Array.from(section.querySelectorAll<HTMLElement>('span.doc-math'))) {
        const tex = el.querySelector('annotation[encoding="application/x-tex"]')?.textContent ?? '';
        el.dataset.latex = el.classList.contains('doc-math-display') ? `$$${tex}$$` : `$${tex}$`;
      }
      layoutChoiceGrids(section);
      // Store the children, not the wrapper: one bare <div> would collapse the
      // whole sheet into a single block and leave the outline empty.
      const keyHtml = section.innerHTML;

      // Replace an existing key for this exam instead of piling up duplicates.
      const existing = docs.find((d) => d.kind === 'answer-key' && d.parentId === doc.id);
      if (existing) {
        update(existing.id, { content: keyHtml, answerKeyQuestions: questions, sourceContentHash: sourceHash, updatedAt: new Date().toISOString() });
      } else {
        create({
          title: `Đáp án – ${title.trim() || doc.title}`,
          content: keyHtml,
          answerKeyQuestions: questions,
          sourceContentHash: sourceHash,
          kind: 'answer-key',
          parentId: doc.id,
          subject: doc.subject,
          grade: doc.grade,
        });
      }
    } catch (err) {
      setAnswerKey({
        state: 'error',
        questions: [],
        message: err instanceof Error ? err.message : 'Không tạo được đáp án.',
      });
    }
  }, [create, doc, docs, title, update, unmath, flush, identity]);

  useEffect(() => {
    const onBeforeUnload = () => flush();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flush]);

  // Title edits are saved on the same debounce as body edits.
  useEffect(() => {
    if (!doc || firstLoad.current) return;
    if (title !== doc.title) scheduleSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  useLayoutEffect(() => {
    if (!doc || saveState !== 'idle') return;
    // Autosave indicator fades back to idle so the header stays calm.
    const t = setTimeout(() => setSaveState('idle'), 2400);
    return () => clearTimeout(t);
  }, [saveState, doc]);

  if (!ready) {
    return (
      <div className="grid flex-1 place-items-center text-ink-4">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="grid flex-1 place-items-center bg-surface-2">
        <div className="text-center">
          <p className="font-display text-2xl font-medium">Không mở được đề</p>
          <p className="mt-2 text-[14px] text-ink-3">Đề này chưa có trong máy bạn, hoặc đã bị xoá.</p>
          <a
            href="/my-exams"
            className="mt-5 inline-flex h-10 items-center rounded-md bg-accent px-4 text-[14px] font-semibold text-white hover:bg-accent-hover"
          >
            Xem kho đề của tôi
          </a>
        </div>
      </div>
    );
  }

  const openExport = () => {
    const exam = isAnswerKeyDoc ? sourceExam : doc;
    if (!exam) return;
    const liveContent = pageRef.current ? sanitize(unmath(pageRef.current)) : doc.content;
    const key = activeKey;
    const keyContent = isAnswerKeyDoc ? liveContent : key?.content;
    flush();
    setQuickPrint(false);
    setExportSnapshot({
      sourceExamId: exam.id,
      title: isAnswerKeyDoc ? exam.title : (title.trim() || exam.title),
      content: isAnswerKeyDoc ? exam.content : liveContent,
      subject: exam.subject,
      answerKey: key && keyContent ? {
        content: keyContent,
        sourceContentHash: key.sourceContentHash,
        answerKeyQuestions: isAnswerKeyDoc && liveContent !== baseline ? undefined : key.answerKeyQuestions,
      } : undefined,
    });
  };

  return (
    <>
      {exportSnapshot && (quickPrint ? <ExportDialog snapshot={exportSnapshot} onClose={() => setExportSnapshot(null)} /> : <ReleaseDialog snapshot={exportSnapshot} onClose={() => setExportSnapshot(null)} onQuickPrint={() => setQuickPrint(true)} />)}
      <div className="no-print editor-header flex h-14 shrink-0 items-center gap-2 border-b border-line bg-white px-(--gutter)">
        <a
          href="/my-exams"
          title="Về thư viện đề"
          aria-label="Về thư viện đề"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-ink-3 hover:bg-surface-3 hover:text-ink"
        >
          <ArrowLeft className="size-4" />
        </a>

        <div className="min-w-0 flex-1">
          <div className="flex h-6 min-w-0 items-center gap-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Tên đề"
              title="Tên đề (cũng là tên file khi xuất)"
              className="h-6 w-auto min-w-32 max-w-full field-sizing-content rounded-md border border-transparent px-1.5 text-ellipsis text-[15px] leading-6 font-medium text-ink outline-none hover:border-line focus:border-accent"
            />
            <span className="hidden shrink-0 items-center gap-1 text-xs text-ink-3 lg:inline-flex" aria-live="polite">
              {saveState === 'saving' || saveStatus === 'saving' || saveStatus === 'loading' ? <><CloudOff className="size-3.5" /> Đang lưu…</> : saveStatus === 'saved' ? <><Check className="size-3.5 text-ok" /> Đã lưu vào tài khoản</> : <><CloudOff className="size-3.5" /> {saveStatus === 'error' ? 'Chưa đồng bộ — xem cảnh báo' : 'Chỉ ở trình duyệt này'}</>}
            </span>
          </div>
          {doc?.contentStatus === 'preview' ? <p className="px-1.5 text-xs text-warn">Bản xem trước — cần bổ sung đầy đủ câu hỏi. <button className="underline" onClick={() => { if (window.confirm('Bạn đã bổ sung và kiểm tra toàn bộ đề, không chỉ bản xem trước?')) update(docId, { contentStatus: 'complete' }); }}>Xác nhận đề đã đầy đủ</button></p> : null}
          <EditorMenubar
            onPrint={() => window.print()}
            onToggleOutline={() => setOutlineOpen((v) => !v)}
            onToggleAi={() => setAiOpen((v) => !v)}
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button type="button" onClick={openExport} aria-label="Chốt đề & xuất PDF" title="Chốt bản xuất: đề thi, barem và phiếu tô trắc nghiệm" className="flex h-9 shrink-0 items-center gap-2 rounded-md bg-accent px-3 text-sm font-semibold text-white hover:bg-accent-hover">
            <Printer className="size-4" />
            <span className="hidden sm:inline">Chốt đề & xuất PDF</span>
          </button>
          {!isAnswerKeyDoc && <SaveToQuestionBank docId={doc.id} title={title} structure={structure} capture={capture} keyDocs={keyDocs} />}
          <a
            className="flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-ink transition-colors hover:bg-surface-3"
            aria-label="Xem kho đề của tôi"
            title="Xem tất cả đề đã lưu trong tài khoản"
            href="/my-exams"
          >
            <span aria-hidden className="text-[15px] leading-none">✉</span>
            <span className="editor-action-label hidden sm:inline">Xem kho đề của tôi</span>
          </a>
          <button
            type="button"
            onClick={() => setAiOpen(true)}
            className="flex h-9 shrink-0 items-center gap-2 rounded-md bg-surface-3 px-3 text-sm font-semibold text-ink"
          >
            <span aria-hidden className="text-[15px] leading-none">✦</span>
            <span className="editor-action-label hidden sm:inline">Hỏi AI</span>
          </button>
          <div className="flex h-9 w-9 justify-end sm:w-[168px]">
            <button
              type="button"
              className="flex h-9 shrink-0 items-center gap-2 rounded-md px-2 text-sm font-medium text-ink transition-colors hover:bg-surface-3"
            >
              <span className="grid size-6 place-items-center rounded-full bg-accent text-[10px] font-semibold text-white">
                PH
              </span>
              <span className="hidden truncate sm:inline">{user?.name ?? 'Tài khoản'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="print-flow relative flex min-h-0 flex-1 overflow-hidden">
        {outlineOpen && <EditorOutline html={html} onClose={() => setOutlineOpen(false)} onPrint={() => window.print()} />}

        <div className="print-flow relative flex min-w-0 flex-1 flex-col">
          <EditorToolbar
            zoom={zoom}
            onZoom={setZoom}
            outlineOpen={outlineOpen}
            onToggleOutline={() => setOutlineOpen((v) => !v)}
            aiOpen={aiOpen}
            onToggleAi={() => setAiOpen((v) => !v)}
            onInsert={(snippet) => {
              const el = pageRef.current;
              if (!el) return;
              el.focus();
              document.execCommand('insertHTML', false, snippet);
              scheduleSave();
            }}
            onOpenFigure={() => setFigureOpen(true)}
            onPageBreak={() => {
              const el = pageRef.current;
              if (!el) return;
              el.focus();
              document.execCommand('insertHTML', false, '<p class="page-break">&nbsp;</p><p><br></p>');
              scheduleSave();
            }}
          />

          {keyNeedsReview ? <p role="status" className="no-print border-b border-warn-line bg-warn-soft px-4 py-2 text-[12px] text-warn">Đáp án & barem chưa được xác minh với phiên bản đề hiện tại. Kiểm tra hoặc tạo lại trước khi chấm.</p> : null}
          <div ref={scrollRef} className="print-area relative z-0 min-h-0 flex-1 overflow-auto bg-surface-2">
            <EditorRuler zoom={zoom} />
            <div className="print-plain flex justify-center px-3 pb-24">
              <div
                className="doc-sheet relative bg-white shadow-[var(--shadow-sm)]"
                style={{
                  width: A4_WIDTH,
                  minHeight: A4_HEIGHT,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center',
                  marginBottom: `calc(${(zoom / 100 - 1) * A4_HEIGHT}px)`,
                }}
              >
                <div
                  ref={pageRef}
                  id="doc-surface"
                  contentEditable
                  suppressContentEditableWarning
                  role="textbox"
                  aria-multiline="true"
                  aria-label="Nội dung đề"
                  data-placeholder="Bắt đầu soạn đề…"
                  onClick={(e) => {
                    const el = (e.target as HTMLElement | null)?.closest?.(
                      'span.doc-math',
                    ) as HTMLElement | null;
                    if (el && pageRef.current?.contains(el)) openMathEditor(el);
                  }}
                  onInput={() => {
                    // Store the LaTeX source, not the rendered MathML, so the
                    // document stays portable and re-renders identically.
                    if (pageRef.current) setHtml(capture());
                    scheduleSave();
                  }}
                  onBlur={flush}
                  className="doc-page doc-surface min-h-[1122px] outline-none"
                  style={{ padding: '75.59px 56.69px 75.59px 75.59px' }}
                />
              </div>
            </div>
          </div>

          <div className="no-print flex h-12 shrink-0 items-center gap-1 border-t border-line bg-white px-2 sm:px-3">
            <nav aria-label="Các trang của đề" className="scrollbar-none flex h-full items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const active = tab.id === docId;
                return (
                  <Link
                    key={tab.id}
                    href={`/doc/${tab.id}`}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex h-9 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium whitespace-nowrap',
                      active
                        ? 'bg-surface-3 text-ink'
                        : 'text-ink-2 hover:bg-surface-3 hover:text-ink',
                    )}
                  >
                    <span aria-hidden>{tab.kind === 'answer-key' ? '◧' : '▤'}</span>
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={() => void generateAnswerKey()}
              disabled={answerKey.state === 'loading' || isAnswerKeyDoc}
              title={isAnswerKeyDoc ? 'Đang xem bảng đáp án của đề' : undefined}
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium whitespace-nowrap text-ink-2 hover:bg-surface-3 disabled:opacity-60"
            >
              {answerKey.state === 'loading' ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Đang giải…
                </>
              ) : (
                <>
                  <span aria-hidden>＋</span> {hasAnswerKey ? 'Cập nhật đáp án' : 'Tạo đáp án'}
                </>
              )}
            </button>
            {answerKey.state === 'error' && (
              <span role="alert" className="ml-2 truncate text-xs text-red-600">
                {answerKey.message}
              </span>
            )}
            <span className="ml-auto shrink-0 text-xs text-ink-3" aria-live="polite">
              <PageStats html={html} />
            </span>
          </div>
        </div>

        {mathTarget && (
          <MathPopover
            target={mathTarget}
            onSave={(latex, display) => {
              const el = mathTarget.el;
              setMathTarget(null);
              if (!latex.trim()) {
                el.remove();
                if (pageRef.current) {
                  setHtml(unmath(pageRef.current));
                  scheduleSave();
                  relayout();
                }
                return;
              }
              replaceMath(el, latex, display);
            }}
            onDelete={() => {
              mathTarget.el.remove();
              setMathTarget(null);
              if (pageRef.current) {
                setHtml(unmath(pageRef.current));
                scheduleSave();
                relayout();
              }
            }}
            onClose={() => setMathTarget(null)}
          />
        )}

        <div className={aiOpen ? "contents" : "hidden"}>
          <AiPanel
            docId={doc.id}
            examTitle={title}
            examContent={html}
            onClose={() => setAiOpen(false)}
            onApply={(insert, incomingStructure) => applyGenerated(insert, incomingStructure, false)}
            onOpenFigure={() => setFigureOpen(true)}
            onReplace={(next, incomingStructure) => applyGenerated(next, incomingStructure, true)}
          />
        </div>
      </div>

      <FigureDialog
        open={figureOpen}
        onClose={() => setFigureOpen(false)}
        onInsert={(snippet) => {
          const el = pageRef.current;
          if (!el) return;
          const selection = window.getSelection();
          const caretInside =
            !!selection && selection.rangeCount > 0 && el.contains(selection.getRangeAt(0).commonAncestorContainer);

          // Adding a figure must never land above the exam header: without a
          // caret inside the sheet it goes at the end of the document.
          if (caretInside) {
            el.focus();
            document.execCommand('insertHTML', false, snippet);
          } else {
            el.insertAdjacentHTML('beforeend', snippet);
          }
          setHtml(el.innerHTML);
          scheduleSave();
        }}
      />
    </>
  );
}

function PageStats({ html }: { html: string }) {
  const [stats, setStats] = useState({ pages: 1, words: 0 });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    const words = (tpl.content.textContent ?? '').trim().split(/\s+/).filter(Boolean).length;
    const breaks = tpl.content.querySelectorAll('.page-break').length;
    setStats({ pages: breaks + 1, words });
  }, [html]);
  return (
    <>
      {stats.pages} trang · {new Intl.NumberFormat('vi-VN').format(stats.words)} từ
    </>
  );
}

function EditorRuler({ zoom }: { zoom: number }) {
  const marks = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div
      className={cn(
        'no-print mx-auto mb-1 flex h-6 max-w-full items-end justify-center gap-0 overflow-hidden text-[10px] text-ink-4',
      )}
      aria-hidden="true"
    >
      <div style={{ width: A4_WIDTH, transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }} className="relative flex h-6 items-end">
        <div className="absolute inset-x-[75.59px] bottom-0 flex h-6 items-end">
          {marks.map((m) => (
            <div key={m} className="flex flex-1 flex-col items-start">
              <span className="mb-0.5 pl-px leading-none">{m || ''}</span>
              <span className="h-2 w-px bg-line-strong" />
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-[75.59px] h-1 w-[calc(100%-132.28px)] bg-transparent" />
      </div>
    </div>
  );
}

function EditorMenubar({
  onPrint,
  onToggleOutline,
  onToggleAi,
}: {
  onPrint: () => void;
  onToggleOutline: () => void;
  onToggleAi: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const items: Record<string, Array<{ label: string; action?: () => void; hint?: string }>> = {
    Tệp: [
      { label: 'Đề mới', hint: '' },
      { label: 'In đề (Ctrl+P)', action: onPrint },
      { label: 'Xuất Word (.docx)' },
      { label: 'Tải PDF' },
    ],
    'Chỉnh sửa': [
      { label: 'Hoàn tác (Ctrl+Z)', action: () => document.execCommand('undo') },
      { label: 'Làm lại (Ctrl+Y)', action: () => document.execCommand('redo') },
      { label: 'Chọn tất cả (Ctrl+A)' },
    ],
    Xem: [
      { label: 'Dàn ý và mẫu chèn', action: onToggleOutline },
      { label: 'Trợ lý AI', action: onToggleAi },
    ],
    Chèn: [
      { label: 'Công thức toán' },
      { label: 'Hình ảnh' },
      { label: 'Bảng' },
      { label: 'Ngắt trang (Ctrl+Enter)' },
    ],
    'Định dạng': [
      { label: 'Đậm (Ctrl+B)', action: () => document.execCommand('bold') },
      { label: 'Nghiêng (Ctrl+I)', action: () => document.execCommand('italic') },
      { label: 'Gạch chân (Ctrl+U)', action: () => document.execCommand('underline') },
    ],
    'Công cụ': [{ label: 'Đếm từ' }, { label: 'Kiểm tra chính tả' }],
  };
  return (
    <div role="menubar" className="flex items-center gap-0.5">
      {Object.keys(items).map((name) => (
        <div key={name} className="relative">
          <button
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={open === name}
            onClick={() => setOpen((v) => (v === name ? null : name))}
            className={cn(
              'rounded-md px-2 py-0.5 text-[13px] text-ink-2 outline-none hover:bg-surface-3',
              open === name && 'bg-accent-soft text-accent',
            )}
          >
            {name}
          </button>
          {open === name && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpen(null)} aria-hidden />
              <div
                role="menu"
                className="absolute top-full left-0 z-40 mt-1 w-[220px] rounded-md border border-line bg-white p-1.5 shadow-[var(--shadow-md)]"
              >
                {items[name].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      item.action?.();
                      setOpen(null);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[13.5px] text-ink hover:bg-surface-3"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
