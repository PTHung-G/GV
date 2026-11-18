'use client';

/**
 * Creating a grading session, in three steps.
 *
 * Step 1 picks an exam; step 2 confirms the rubric (the only place a teacher can
 * see and fix the marking scheme before it is frozen); step 3 attaches a class
 * and creates the session.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDocs, type ExamDoc } from '@/lib/docs-store';
import { basePath } from '@/lib/api-url';
import { gradingApi, GradingApiError } from '@/lib/grading-client';
import { parseAnswerKeyHtml } from '@/lib/grading/answer-key-html';
import { AppFrame } from '@/components/shell/app-frame';
import { ShellHeader } from '@/components/shell/app-shell';
import { examContentHash } from '@/lib/exam-revision';
import { normalizeRubric, type AnswerKeyQuestion } from '@/lib/grading/rubric';

type EditableStep = { key: string; text: string; points: string };
type EditableQuestion =
  | { no: number; type: 'mc'; points: string; answer: string; label?: string }
  | { no: number; type: 'essay'; points: string; steps: EditableStep[]; label?: string; answer?: string };


function parsePoints(value: string): number | null {
  const cleaned = value.replace(/\s/g, '').replace(',', '.');
  if (!cleaned) return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

function numberFromLabel(label: string | undefined, fallback: number): number {
  const match = /(\d+)/.exec(label ?? '');
  return match ? Number(match[1]) : fallback;
}

/** Turns the answer-key endpoint's shape into editable rows with sane defaults. */
function toEditable(questions: AnswerKeyQuestion[]): EditableQuestion[] {
  return questions.map((question, index) => {
    const no = numberFromLabel(question.label, index + 1);
    const steps = (question.steps ?? []).filter((step) => step.text?.trim());
    const answer = String(question.answer ?? '').trim();
    const isMc = question.type !== 'essay' && steps.length === 0 && /^[A-Da-d]$/.test(answer);

    if (isMc) {
      return {
        no,
        type: 'mc',
        points: (question.points ?? '').replace('.', ','),
        answer: answer.toUpperCase(),
        label: question.label,
      };
    }

    const questionPoints = question.points ?? '';
    const rawSteps = steps.length
      ? steps.map((step, stepIndex) => ({
          key: `s${stepIndex + 1}`,
          text: step.text ?? '',
          points: (step.points ?? '').replace('.', ','),
        }))
      : [{ key: 's1', text: '', points: questionPoints.replace('.', ',') }];

    return {
      no,
      type: 'essay',
      points: questionPoints.replace('.', ','),
      steps: rawSteps,
      label: question.label,
      answer,
    };
  });
}

/** "09001 Nguyễn Văn An" — the leading token is the code, the rest is the name. */
const LEADING_CODE = /^([A-Za-z]{0,4}\d{1,8})\s+(\S.*)$/;

function parseRoster(text: string): Array<{ code?: string; name: string }> {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      // Tab, comma or a wide gap is the most explicit separator when present.
      const parts = line.split(/\t|,|;|\s{2,}/).map((part) => part.trim()).filter(Boolean);
      if (parts.length >= 2) return { code: parts[0], name: parts.slice(1).join(' ') };

      // Otherwise a single space is enough: teachers write "mã tên" on one line.
      const match = LEADING_CODE.exec(line);
      if (match) return { code: match[1], name: match[2] };

      return { name: line };
    })
    .filter((student) => student.name);
}

const STEPS = ['Chọn đề', 'Thang điểm', 'Lớp & cách chấm'];

export function NewSessionWizard() {
  const router = useRouter();
  const { docs, ready } = useDocs();

  const [step, setStep] = useState(0);
  const [exam, setExam] = useState<ExamDoc | null>(null);
  // A teacher who already has the exam on paper must still be able to grade it.
  const [source, setSource] = useState<'mine' | 'external'>('mine');
  const [extTitle, setExtTitle] = useState('');
  const [extSubject, setExtSubject] = useState('');
  const [extGrade, setExtGrade] = useState('9');
  const [extContent, setExtContent] = useState('');
  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrNote, setOcrNote] = useState('');
  const [questions, setQuestions] = useState<EditableQuestion[]>([]);
  const [generating, setGenerating] = useState(false);
  const [className, setClassName] = useState('');
  const [classId, setClassId] = useState('');
  const [savedClasses, setSavedClasses] = useState<Array<{ id: string; name: string; studentCount: number }>>([]);
  const [classNote, setClassNote] = useState('');
  useEffect(() => {
    let active = true;
    gradingApi.get<{ classes: Array<{ id: string; name: string; studentCount: number }> }>('/api/classes')
      .then(data => { if (active) setSavedClasses(data.classes); })
      .catch(() => { if (active) setClassNote('Không tải được lớp đã lưu. Bạn vẫn có thể nhập lớp mới.'); });
    return () => { active = false; };
  }, []);
  const [rosterText, setRosterText] = useState('');
  const [sheetMode, setSheetMode] = useState<'template' | 'manual'>('manual');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [expectedTotal, setExpectedTotal] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [keyWarning, setKeyWarning] = useState('');
  const generation = useRef(0);
  const selectedExam = docs.find(item => item.id === exam?.id) ?? null;

  // Blank drafts ("Đề thi mới", no content yet) cannot be graded, so they would
  // only push the real exams down a list of identical rows.
  const exams = useMemo(
    () => docs.filter((doc) => doc.kind !== 'answer-key' && doc.contentStatus !== 'preview' && doc.content.trim().length > 0),
    [docs],
  );

  const answerKeyFor = useMemo(() => {
    const map = new Map<string, ExamDoc>();
    for (const doc of docs) {
      if (doc.kind === 'answer-key' && doc.parentId) map.set(doc.parentId, doc);
    }
    return map;
  }, [docs]);

  useEffect(() => {
    if (!ready) return;
    const id = new URLSearchParams(window.location.search).get('examId');
    const selected = exams.find(item => item.id === id);
    if (selected) setExam(selected);
  }, [ready]);

  /** One shape for both sources, so later steps never branch on where it came from. */
  const draft = useMemo(() => {
    if (source === 'mine') {
      if (!selectedExam || selectedExam.contentStatus === 'preview') return null;
      const exam = selectedExam;
      return {
        title: exam.title,
        subject: exam.subject ?? null,
        grade: exam.grade ?? null,
        content: exam.content,
        answerKeyHtml: answerKeyFor.get(exam.id)?.content ?? null,
        key: answerKeyFor.get(exam.id),
        sourceExamId: exam.id as string | null,
      };
    }
    const title = extTitle.trim();
    if (!title || !extContent.trim()) return null;
    return {
      title,
      subject: extSubject.trim() || null,
      grade: extGrade.trim() ? Number(extGrade) : null,
      content: extContent,
      answerKeyHtml: null,
      key: undefined,
      sourceExamId: null,
    };
  }, [source, selectedExam, answerKeyFor, extTitle, extSubject, extGrade, extContent]);

  const draftFingerprint = JSON.stringify([source, draft?.sourceExamId, draft?.title, draft?.content, draft?.subject, draft?.grade]);
  const currentFingerprint = useRef(draftFingerprint);
  currentFingerprint.current = draftFingerprint;
  useEffect(() => {
    generation.current += 1;
    setGenerating(false);
    setQuestions([]);
    setExpectedTotal('');
    setReviewed(false);
    setKeyWarning('');
    setStep(0);
  }, [draftFingerprint]);

  useEffect(() => { setReviewed(false); }, [questions]);

  const totalPoints = questions.reduce((sum, question) => sum + (parsePoints(question.points) ?? 0), 0);
  const mcCount = questions.filter((question) => question.type === 'mc').length;
  const essayCount = questions.length - mcCount;

  async function readExamImages(files: File[]) {
    const fingerprint = draftFingerprint;
    setOcrBusy(true);
    setOcrNote('');
    setError('');
    try {
      const images = await Promise.all(
        files.map(
          async (file) =>
            await new Promise<{ data: string; mimeType: string }>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                const result = String(reader.result);
                const comma = result.indexOf(',');
                resolve({ data: result.slice(comma + 1), mimeType: file.type || 'image/jpeg' });
              };
              reader.onerror = () => reject(new Error('read-failed'));
              reader.readAsDataURL(file);
            }),
        ),
      );

      const res = await fetch(basePath('/api/exam-image'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ images, subject: extSubject || undefined }),
      });
      const data = (await res.json().catch(() => null)) as
        | { exam?: { content?: string }; warnings?: string[] }
        | null;

      if (currentFingerprint.current !== fingerprint) return;
      const content = data?.exam?.content;
      if (!res.ok || !content) {
        setOcrNote('Không đọc được ảnh đề. Thầy/cô dán nội dung đề bằng tay giúp em.');
      } else {
        setExtContent(content);
        setOcrNote(
          `Đã đọc ${images.length} ảnh. Kiểm tra lại công thức toán trước khi tạo thang điểm.`,
        );
      }
    } catch {
      if (currentFingerprint.current === fingerprint) setOcrNote('Không đọc được ảnh đề. Thầy/cô dán nội dung đề bằng tay giúp em.');
    } finally {
      setOcrBusy(false);
    }
  }

  function pickExam(doc: ExamDoc) {
    setExam(doc);
    setQuestions([]);
    setError('');
  }

  /**
   * Walk into the rubric step with the teacher's own key already loaded. Asking
   * a model to rebuild a key that already exists is slower and can disagree with
   * what the class was actually given.
   */
  function goToRubric() {
    setReviewed(false);
    if (!draft) return;
    if (questions.length === 0 && draft.key) {
      const key = draft.key;
      if (key.sourceContentHash && key.sourceContentHash !== examContentHash(draft.content)) {
        setQuestions([]);
        setKeyWarning('Đề đã đổi sau khi tạo barem. Không dùng đáp án cũ; hãy tạo lại hoặc nhập tay.');
      } else {
        const imported = key.answerKeyQuestions?.length ? key.answerKeyQuestions : parseAnswerKeyHtml(key.content);
        setQuestions(toEditable(imported));
        setKeyWarning(key.answerKeyQuestions?.length && key.sourceContentHash
          ? 'Đã nạp bản nháp có liên kết phiên bản đề. Hãy đối chiếu đủ câu và điểm.'
          : 'Barem cũ chỉ có HTML/chưa xác minh phiên bản. Kiểm tra đủ câu, phần tự luận và điểm trước khi xác nhận; có thể có nội dung chưa đọc được.');
      }
    }
    setStep(1);
  }

  async function generateRubric() {
    if (!draft) return;
    const request = ++generation.current;
    const fingerprint = draftFingerprint;
    setGenerating(true);
    setReviewed(false);
    setError('');
    try {
      const data = await gradingApi.post<{ codes: Array<{ questions: AnswerKeyQuestion[] }> }>(
        '/api/exam-answer-key',
        { exam: { title: draft.title, content: draft.content } },
      );
      if (generation.current !== request || currentFingerprint.current !== fingerprint) return;
      const generated = data.codes?.[0]?.questions ?? [];
      if (generated.length === 0) {
        setError('AI không trả về câu nào. Hãy thêm câu thủ công.');
      } else {
        setQuestions(toEditable(generated));
        setKeyWarning('Bản nháp AI dùng riêng cho đợt này, không sửa barem nguồn. Kiểm tra đủ câu và tự nhập điểm đề chưa quy định.');
      }
    } catch (err) {
      if (generation.current === request) setError(err instanceof GradingApiError ? err.message : 'Không tạo được đáp án.');
    } finally {
      if (generation.current === request) setGenerating(false);
    }
  }

  function updateQuestion(index: number, patch: Partial<EditableQuestion>) {
    setReviewed(false);
    setQuestions((current) =>
      current.map((question, i) => (i === index ? ({ ...question, ...patch } as EditableQuestion) : question)),
    );
  }

  function addQuestion(type: 'mc' | 'essay') {
    const no = questions.reduce((max, question) => Math.max(max, question.no), 0) + 1;
    setQuestions((current) =>
      current.concat(
        type === 'mc'
          ? [{ no, type: 'mc', points: '', answer: '' }]
          : [{ no, type: 'essay', points: '', steps: [{ key: 's1', text: '', points: '' }] }],
      ),
    );
  }

  function removeQuestion(index: number) {
    setQuestions((current) => current.filter((_, i) => i !== index));
  }

  function buildRubric() {
    return {
      version: 1 as const,
      questions: questions.map((question) => {
        const points = parsePoints(question.points) ?? 0;
        if (question.type === 'mc') {
          return {
            no: question.no,
            type: 'mc' as const,
            points,
            answer: question.answer,
            label: question.label,
          };
        }
        return {
          no: question.no,
          type: 'essay' as const,
          points,
          label: question.label,
          answer: question.answer,
          steps: question.steps.map((step) => ({
            key: step.key,
            text: step.text,
            points: parsePoints(step.points) ?? 0,
          })),
        };
      }),
    };
  }

  function validateRubric() {
    const expected = parsePoints(expectedTotal);
    if (expected === null || expected <= 0) throw new Error('Nhập tổng điểm mong muốn của đề trước khi xác nhận.');
    if (!reviewed) throw new Error('Hãy xác nhận đã đối chiếu đủ câu, đáp án và điểm.');
    return normalizeRubric(buildRubric(), expected);
  }

  async function create() {
    if (!draft) return;
    setSaving(true);
    setError('');
    try {
      const rubric = validateRubric();
      const session = await gradingApi.post<{ session: { id: string } }>('/api/grading/sessions', {
        examTitle: draft.title,
        subject: draft.subject,
        grade: draft.grade,
        examHtml: draft.content,
        answerKeyHtml: draft.answerKeyHtml,
        sourceExamId: draft.sourceExamId,
        rubric,
        expectedTotal: parsePoints(expectedTotal),
        sheetMode,
        classId: classId || null,
        className: className.trim() || null,
        students: classId ? [] : parseRoster(rosterText),
      });
      router.push(`/grading/${session.session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tạo được đợt chấm.');
      setSaving(false);
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-5 animate-spin text-ink-4" />
      </div>
    );
  }

  return (
    <AppFrame>
      <ShellHeader title="Đợt chấm mới" subtitle={`Bước ${step + 1}/${STEPS.length}`} />
      <div className="min-h-0 flex-1 overflow-y-auto">
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link href="/grading" className="inline-flex items-center gap-1 text-[13px] text-ink-3 hover:text-ink">
        <ArrowLeft className="size-4" />
        Danh sách đợt chấm
      </Link>

      {/* The header already shows this name; keep it for screen readers only so
          the page still has one h1 without printing the title twice. */}
      <h1 className="sr-only">Đợt chấm mới</h1>

      {/* Compact step strip: the current step is the only thing emphasised. */}
      <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]">
        {STEPS.map((label, index) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`grid size-5 shrink-0 place-items-center rounded-sm text-[11px] font-semibold tabular-nums ${
                index === step
                  ? 'bg-accent text-white'
                  : index < step
                    ? 'bg-accent-soft text-accent'
                    : 'bg-surface-3 text-ink-4'
              }`}
            >
              {index + 1}
            </span>
            <span
              aria-current={index === step ? 'step' : undefined}
              className={index <= step ? 'text-ink' : 'text-ink-4'}
            >
              {label}
            </span>
            {index < STEPS.length - 1 ? (
              <span aria-hidden className="mx-1 h-px w-6 bg-line sm:w-10" />
            ) : null}
          </li>
        ))}
      </ol>

      {error ? (
        <div className="mt-5 rounded-md border border-warn-line bg-warn-soft px-3 py-2 text-[13px] text-warn">
          {error}
        </div>
      ) : null}

      {/* Step 1 */}
      {step === 0 ? (
        <section className="mt-6">
          <h2 className="text-[15px] font-medium text-ink">Chọn đề thi</h2>
          <p className="mt-1 text-[13px] text-ink-3">
            Đề soạn trên web hay đề đã in sẵn đều chấm được. Đề chưa có bảng đáp án thì bước sau sẽ tạo.
          </p>

          <div className="mt-3 flex gap-1.5">
            <button
              type="button"
              onClick={() => setSource('mine')}
              className={`rounded-md border px-2.5 py-1 text-[12.5px] ${
                source === 'mine'
                  ? 'border-accent bg-accent-soft text-ink'
                  : 'border-line bg-white text-ink-3'
              }`}
            >
              Đề của tôi
            </button>
            <button
              type="button"
              onClick={() => setSource('external')}
              className={`rounded-md border px-2.5 py-1 text-[12.5px] ${
                source === 'external'
                  ? 'border-accent bg-accent-soft text-ink'
                  : 'border-line bg-white text-ink-3'
              }`}
            >
              Đề bên ngoài
            </button>
          </div>

          {source === 'external' ? (
            <div className="mt-4 space-y-2.5 rounded-md border border-line bg-white p-4">
              <div className="grid gap-2.5 sm:grid-cols-[1fr_120px_90px]">
                <label className="block">
                  <span className="text-[12px] text-ink-3">Tên đề</span>
                  <Input
                    value={extTitle}
                    onChange={(event) => setExtTitle(event.target.value)}
                    placeholder="Kiểm tra giữa kỳ I môn Toán 9"
                    className="mt-1 h-9 text-[13.5px]"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] text-ink-3">Môn</span>
                  <Input
                    value={extSubject}
                    onChange={(event) => setExtSubject(event.target.value)}
                    placeholder="Toán"
                    className="mt-1 h-9 text-[13.5px]"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] text-ink-3">Khối</span>
                  <Input
                    type="number"
                    value={extGrade}
                    onChange={(event) => setExtGrade(event.target.value)}
                    className="mt-1 h-9 text-[13.5px]"
                  />
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-ink-3">Nội dung đề</span>
                  <label className="cursor-pointer text-[12px] text-accent hover:underline">
                    {ocrBusy ? 'Đang đọc ảnh…' : 'Chụp ảnh đề để đọc chữ'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      disabled={ocrBusy}
                      onChange={(event) => {
                        const files = Array.from(event.target.files ?? []);
                        event.target.value = '';
                        if (files.length) void readExamImages(files);
                      }}
                    />
                  </label>
                </div>
                <textarea
                  value={extContent}
                  onChange={(event) => setExtContent(event.target.value)}
                  rows={8}
                  placeholder="Dán nội dung đề, hoặc chụp ảnh đề ở trên để máy đọc giúp."
                  className="mt-1 w-full rounded-md border border-line-strong bg-white px-3 py-2 font-mono text-[12.5px] leading-relaxed text-ink outline-none focus:border-accent"
                />
                {ocrNote ? <p className="mt-1 text-[12px] text-ink-3">{ocrNote}</p> : null}
              </div>
            </div>
          ) : null}

          {source === 'mine' && exams.length === 0 ? (
            <div className="mt-4 rounded-md border border-dashed border-line-strong bg-surface-2 px-5 py-10 text-center">
              <p className="text-[14px] text-ink-2">Bạn chưa có đề nào.</p>
              <Link href="/my-exams">
                <Button variant="outline" className="mt-3">
                  Soạn đề trước
                </Button>
              </Link>
            </div>
          ) : null}

          {source === 'mine' && exams.length > 0 ? (
            <div className="mt-4 space-y-2">
              {exams.map((doc) => {
                const selected = exam?.id === doc.id;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => pickExam(doc)}
                    className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left transition-colors ${
                      selected ? 'border-accent bg-accent-soft' : 'border-line bg-white hover:bg-surface-2'
                    }`}
                  >
                    <div>
                      <p className="text-[14px] font-medium text-ink">{doc.title}</p>
                      <p className="mt-0.5 text-[12px] text-ink-4">
                        Lớp {doc.grade ?? '—'} · {answerKeyFor.has(doc.id) ? 'Có barem — cần kiểm tra phiên bản và điểm' : 'Chưa có barem'}
                      </p>
                    </div>
                    {selected ? <span className="text-[12px] text-accent">Đã chọn</span> : null}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="mt-6 flex justify-end">
            <Button variant="blue" disabled={!draft} onClick={goToRubric}>
              Tiếp tục
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>
      ) : null}

      {/* Step 2 */}
      {step === 1 ? (
        <section className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-medium text-ink">Xác nhận thang điểm</h2>
              <p className="mt-1 text-[13px] text-ink-3">
                Máy chấm đúng theo bảng này. Sửa cho khớp đáp án thật rồi mới tạo đợt.
              </p>
            </div>
            <Button variant="outline" onClick={() => void generateRubric()} disabled={generating}>
              {generating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Tạo bằng AI
            </Button>
          </div>

          {keyWarning ? <p role="status" className="mt-3 text-[13px] text-warn">{keyWarning}</p> : null}
          <label className="mt-4 block text-[13px]">Tổng điểm mong muốn
            <Input aria-label="Tổng điểm mong muốn" value={expectedTotal} onChange={event => { setExpectedTotal(event.target.value); setReviewed(false); }} placeholder="Nhập theo thang điểm của đề" className="mt-1 w-56" />
          </label>
          {questions.length === 0 ? (
            <div className="mt-4 rounded-md border border-dashed border-line-strong bg-surface-2 px-5 py-8 text-center">
              <p className="text-[13.5px] text-ink-2">Chưa có câu nào. Tạo bằng AI hoặc thêm thủ công.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {questions.map((question, index) => (
                <div key={`${question.no}-${index}`} className="rounded-md border border-line bg-white p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-ink-4">Câu</span>
                    <Input
                      type="number"
                      value={question.no}
                      onChange={(event) => updateQuestion(index, { no: Number(event.target.value) })}
                      className="h-8 w-14 px-2 text-[13px]"
                    />
                    <select
                      value={question.type}
                      onChange={(event) =>
                        updateQuestion(index, {
                          type: event.target.value as 'mc' | 'essay',
                          ...(event.target.value === 'essay'
                            ? { steps: [{ key: 's1', text: '', points: question.points }], answer: '' }
                            : { answer: 'A' }),
                        } as Partial<EditableQuestion>)
                      }
                      className="h-8 rounded-sm border border-line-strong bg-white px-2 text-[13px] text-ink"
                    >
                      <option value="mc">Trắc nghiệm</option>
                      <option value="essay">Tự luận</option>
                    </select>
                    <span className="ml-auto text-[12px] text-ink-4">Điểm</span>
                    <Input
                      value={question.points}
                      onChange={(event) => updateQuestion(index, { points: event.target.value })}
                      className="h-8 w-16 px-2 text-[13px]"
                    />
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      aria-label="Xoá câu"
                      className="grid size-7 place-items-center rounded-sm text-ink-4 hover:bg-surface-3 hover:text-danger"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {question.type === 'mc' ? (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[12px] text-ink-4">Đáp án</span>
                      {['A', 'B', 'C', 'D'].map((letter) => (
                        <button
                          key={letter}
                          type="button"
                          onClick={() => updateQuestion(index, { answer: letter })}
                          className={`grid size-7 place-items-center rounded-sm border text-[12px] font-medium ${
                            question.answer === letter
                              ? 'border-accent bg-accent text-white'
                              : 'border-line-strong bg-white text-ink-2'
                          }`}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 space-y-1.5">
                      {question.steps.map((stepValue, stepIndex) => (
                        <div key={stepValue.key} className="flex items-center gap-1.5">
                          <span className="w-6 text-[11px] text-ink-4">{stepIndex + 1}.</span>
                          <Input
                            value={stepValue.text}
                            onChange={(event) => {
                              const steps = question.steps.map((entry, i) =>
                                i === stepIndex ? { ...entry, text: event.target.value } : entry,
                              );
                              updateQuestion(index, { steps } as Partial<EditableQuestion>);
                            }}
                            className="h-8 flex-1 px-2 text-[13px]"
                            placeholder="Nội dung bước chấm"
                          />
                          <Input
                            value={stepValue.points}
                            onChange={(event) => {
                              const steps = question.steps.map((entry, i) =>
                                i === stepIndex ? { ...entry, points: event.target.value } : entry,
                              );
                              updateQuestion(index, { steps } as Partial<EditableQuestion>);
                            }}
                            className="h-8 w-16 px-2 text-[13px]"
                          />
                          <button
                            type="button"
                            aria-label="Xoá bước"
                            onClick={() => {
                              const steps = question.steps.filter((_, i) => i !== stepIndex);
                              updateQuestion(index, { steps } as Partial<EditableQuestion>);
                            }}
                            className="grid size-7 place-items-center rounded-sm text-ink-4 hover:bg-surface-3 hover:text-danger"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const steps = question.steps.concat({
                            key: `s-${crypto.randomUUID()}`,
                            text: '',
                            points: '',
                          });
                          updateQuestion(index, { steps } as Partial<EditableQuestion>);
                        }}
                        className="text-[12px] text-accent hover:underline"
                      >
                        + Thêm bước
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => addQuestion('mc')}>
              <Plus className="size-3.5" />
              Câu trắc nghiệm
            </Button>
            <Button variant="outline" size="sm" onClick={() => addQuestion('essay')}>
              <Plus className="size-3.5" />
              Câu tự luận
            </Button>
            <span className="ml-auto text-[13px] text-ink-3">
              Tổng: <b className="text-ink">{totalPoints.toFixed(2).replace('.', ',')}</b> điểm ·{' '}
              {mcCount} TN · {essayCount} TL
            </span>
          </div>

          <label className="mt-4 flex gap-2 text-[13px]"><input type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)} />Tôi đã đối chiếu đủ câu, đáp án, barem và tổng điểm của đề.</label>
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(0)}>
              <ArrowLeft className="size-4" />
              Quay lại
            </Button>
            <Button variant="blue" disabled={questions.length === 0 || totalPoints <= 0} onClick={() => { try { validateRubric(); setError(''); setStep(2); } catch (err) { setError(err instanceof Error ? err.message : 'Barem chưa hợp lệ.'); } }}>
              Tiếp tục
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>
      ) : null}

      {/* Step 3 */}
      {step === 2 ? (
        <section className="mt-6">
          <h2 className="text-[15px] font-medium text-ink">Lớp và cách chấm</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-ink-2">Lớp đã lưu</span>
              <select aria-label="Lớp đã lưu" value={classId} className="mb-3 h-10 w-full rounded-md border border-line bg-white px-3 text-sm" onChange={(event) => {
                const id = event.target.value; setClassId(id);
                setClassName(savedClasses.find(item => item.id === id)?.name ?? '');
              }}><option value="">Nhập lớp mới / không chọn lớp</option>{savedClasses.map(item => <option key={item.id} value={item.id}>{item.name} · {item.studentCount} học sinh</option>)}</select>
              {classNote ? <p className="mb-2 text-xs text-warn">{classNote}</p> : null}
              {classId ? <p className="mb-2 text-xs text-ink-3">Dùng danh sách học sinh hiện có của lớp. Danh sách lớp hiện dùng chung giữa các đợt; chưa đóng băng theo đợt.</p> : null}
              <span className="mb-1.5 block text-[13px] font-medium text-ink-2">Tên lớp</span>
              <Input disabled={!!classId} value={className} onChange={(event) => setClassName(event.target.value)} placeholder="Ví dụ: 9A" />
            </label>
            <div>
              <span className="mb-1.5 block text-[13px] font-medium text-ink-2">Hình thức nộp bài</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSheetMode('manual')}
                  className={`flex-1 rounded-md border px-3 py-2 text-left text-[12.5px] ${
                    sheetMode === 'manual' ? 'border-accent bg-accent-soft' : 'border-line-strong bg-white'
                  }`}
                >
                  <b className="block text-ink">Giấy thường</b>
                  <span className="text-ink-3">Chụp ảnh bài đã làm</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSheetMode('template')}
                  className={`flex-1 rounded-md border px-3 py-2 text-left text-[12.5px] ${
                    sheetMode === 'template' ? 'border-accent bg-accent-soft' : 'border-line-strong bg-white'
                  }`}
                >
                  <b className="block text-ink">Phiếu chuẩn</b>
                  <span className="text-ink-3">In phiếu trước khi thi</span>
                </button>
              </div>
            </div>
          </div>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-[13px] font-medium text-ink-2">
              Danh sách học sinh <span className="font-normal text-ink-4">(không bắt buộc)</span>
            </span>
            <textarea
              disabled={!!classId} value={rosterText}
              onChange={(event) => setRosterText(event.target.value)}
              rows={6}
              placeholder={'Mỗi dòng một học sinh:\n09001 Nguyễn Văn An\n09002 Trần Minh Anh\n\nDán từ Excel (có tab) cũng được.'}
              className="w-full rounded-md border border-line-strong bg-white px-3 py-2 font-mono text-[13px] text-ink outline-none focus-visible:border-accent"
            />
          </label>

          <p className="mt-2 text-[12px] text-ink-4">
            Mã đứng đầu dòng là mã học sinh — mã này in vào QR trên phiếu để máy tự nhận đúng bài.
            Bỏ trống vẫn chấm được: mỗi bài sẽ có nhãn Bài 001, Bài 002… và gán tên sau.
          </p>

          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft className="size-4" />
              Quay lại
            </Button>
            <Button variant="blue" onClick={() => void create()} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              Tạo đợt chấm
            </Button>
          </div>
        </section>
      ) : null}
    </div>
      </div>
    </AppFrame>
  );
}
