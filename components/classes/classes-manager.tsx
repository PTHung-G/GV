'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2, Upload, Users } from 'lucide-react';
import { AppFrame } from '@/components/shell/app-frame';
import { ShellHeader } from '@/components/shell/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth-context';
import { basePath } from '@/lib/api-url';
import { parseRosterLines } from '@/lib/roster';
import { SUBJECTS } from '@/lib/site';

type ClassSummary = {
  id: string;
  name: string;
  subject: string | null;
  grade: number | null;
  studentCount: number;
};

type StudentRow = { id: string; code: string | null; name: string; sort_index: number };
type ClassDetail = {
  id: string;
  name: string;
  subject: string | null;
  grade: number | null;
  academicYear: string | null;
  students: StudentRow[];
};

export function ClassesManager() {
  const { user, ready, openDialog } = useAuth();
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSubject, setNewSubject] = useState('toan');
  const [newGrade, setNewGrade] = useState('9');
  const [newRosterText, setNewRosterText] = useState('');

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameVal, setRenameVal] = useState('');
  const [deleteClassOpen, setDeleteClassOpen] = useState(false);

  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [autoSbd, setAutoSbd] = useState(true);

  const [quickCode, setQuickCode] = useState('');
  const [quickName, setQuickName] = useState('');
  const [editingStudent, setEditingStudent] = useState<{ id: string; code: string; name: string } | null>(null);

  const loadList = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const r = await fetch(basePath('/api/classes'), { cache: 'no-store' });
      const d = (await r.json()) as { classes?: ClassSummary[]; error?: string };
      if (!r.ok) throw new Error(d.error || 'Không tải được danh sách lớp.');
      const list = d.classes ?? [];
      setClasses(list);
      setSelectedId((prev) => (prev && list.some((c) => c.id === prev) ? prev : list[0]?.id ?? null));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không kết nối được máy chủ.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadDetail = useCallback(
    async (id: string) => {
      if (!user) return;
      try {
        const r = await fetch(basePath(`/api/classes/${id}`), { cache: 'no-store' });
        const d = (await r.json()) as { class?: ClassDetail; error?: string };
        if (!r.ok) throw new Error(d.error || 'Không tải được chi tiết lớp.');
        setDetail(d.class ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không tải được học sinh.');
      }
    },
    [user],
  );

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId, loadDetail]);

  const createClass = async () => {
    if (!newName.trim() || busy) return;
    setBusy(true);
    setError('');
    try {
      const r = await fetch(basePath('/api/classes'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          subject: newSubject || null,
          grade: newGrade ? Number(newGrade) : null,
          students: parseRosterLines(newRosterText),
        }),
      });
      const d = (await r.json()) as { class?: ClassDetail; error?: string };
      if (!r.ok || !d.class) throw new Error(d.error || 'Không tạo được lớp.');
      setCreateOpen(false);
      setNewName('');
      setNewRosterText('');
      await loadList();
      setSelectedId(d.class.id);
      setDetail(d.class);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tạo được lớp.');
    } finally {
      setBusy(false);
    }
  };

  const addQuickStudent = async () => {
    if (!detail || !quickName.trim() || busy) return;
    setBusy(true);
    setError('');
    try {
      const r = await fetch(basePath(`/api/classes/${detail.id}/students`), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          students: [{ code: quickCode.trim() || null, name: quickName.trim() }],
          autoAssignSbd: !quickCode.trim(),
        }),
      });
      const d = (await r.json()) as { class?: ClassDetail; error?: string };
      if (!r.ok || !d.class) throw new Error(d.error || 'Không thêm được học sinh.');
      setDetail(d.class);
      setQuickCode('');
      setQuickName('');
      void loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thêm được học sinh.');
    } finally {
      setBusy(false);
    }
  };

  const importPaste = async () => {
    if (!detail || busy) return;
    const students = parseRosterLines(pasteText);
    if (!students.length) return;
    setBusy(true);
    setError('');
    try {
      const r = await fetch(basePath(`/api/classes/${detail.id}/students`), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ students, autoAssignSbd: autoSbd }),
      });
      const d = (await r.json()) as { class?: ClassDetail; error?: string };
      if (!r.ok || !d.class) throw new Error(d.error || 'Không nhập được danh sách.');
      setDetail(d.class);
      setPasteOpen(false);
      setPasteText('');
      void loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không nhập được danh sách.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppFrame>
      <div className="flex h-full flex-col overflow-hidden bg-surface-2">
        <ShellHeader
          title="Quản lý lớp học"
          subtitle="Lưu danh sách lớp & SBD để in phiếu chuẩn có QR riêng từng học sinh"
          icon={<Users className="size-4" />}
          actions={
            user ? (
              <Button variant="blue" size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="size-4" />
                Tạo lớp mới
              </Button>
            ) : null
          }
        />

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {!ready ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-5 animate-spin text-ink-4" />
            </div>
          ) : !user ? (
            <section className="mx-auto max-w-md rounded-lg border border-line bg-white p-8 text-center">
              <h1 className="text-lg font-semibold text-ink">Quản lý lớp học</h1>
              <p className="mt-2 text-sm text-ink-3">
                Đăng nhập để tạo và lưu danh sách lớp học, SBD phục vụ trộn mã đề và chấm OMR tự động.
              </p>
              <Button variant="blue" className="mt-4" onClick={() => openDialog('Đăng nhập để quản lý lớp học')}>
                Đăng nhập
              </Button>
            </section>
          ) : (
            <div className="mx-auto max-w-6xl space-y-4">
              {error ? (
                <p role="alert" className="rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
                  {error}
                </p>
              ) : null}

              <div className="grid items-start gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
                <aside className="rounded-lg border border-line bg-white p-3">
                  <div className="mb-2 flex items-center justify-between px-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink-4">
                      Các lớp ({classes.length})
                    </span>
                    {loading ? <Loader2 className="size-3.5 animate-spin text-ink-4" /> : null}
                  </div>
                  <div className="space-y-1">
                    {classes.map((cls) => (
                      <button
                        key={cls.id}
                        type="button"
                        onClick={() => setSelectedId(cls.id)}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                          selectedId === cls.id
                            ? 'bg-accent-soft font-semibold text-accent'
                            : 'text-ink-2 hover:bg-surface-2'
                        }`}
                      >
                        <span className="truncate">{cls.name}</span>
                        <span className="text-xs text-ink-4">{cls.studentCount}</span>
                      </button>
                    ))}
                    {!classes.length && !loading ? (
                      <p className="px-2 py-4 text-xs text-ink-4">
                        Chưa có lớp nào. Bấm “Tạo lớp mới” để bắt đầu.
                      </p>
                    ) : null}
                  </div>
                </aside>

                <section className="rounded-lg border border-line bg-white p-4">
                  {!detail ? (
                    <div className="py-12 text-center text-sm text-ink-3">
                      Chọn một lớp ở cột bên trái hoặc tạo lớp mới để quản lý danh sách học sinh.
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                        <div>
                          <h1 className="text-lg font-semibold text-ink">Lớp {detail.name}</h1>
                          <p className="text-xs text-ink-3">{detail.students.length} học sinh</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPasteOpen(true)}
                          >
                            <Upload className="size-3.5" />
                            Nhập CSV / Excel
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setRenameVal(detail.name);
                              setRenameOpen(true);
                            }}
                          >
                            <Pencil className="size-3.5" />
                            Đổi tên
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteClassOpen(true)}
                          >
                            <Trash2 className="size-3.5 text-danger" />
                            Xoá lớp
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Input
                          value={quickCode}
                          onChange={(e) => setQuickCode(e.target.value)}
                          placeholder="SBD (bỏ trống tự đánh)"
                          className="h-9 w-44 text-sm"
                        />
                        <Input
                          value={quickName}
                          onChange={(e) => setQuickName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && void addQuickStudent()}
                          placeholder="Họ và tên học sinh…"
                          className="h-9 min-w-[200px] flex-1 text-sm"
                        />
                        <Button
                          variant="blue"
                          size="sm"
                          disabled={busy || !quickName.trim()}
                          onClick={() => void addQuickStudent()}
                        >
                          <Plus className="size-3.5" />
                          Thêm học sinh
                        </Button>
                      </div>

                      <div className="mt-4 overflow-x-auto rounded-md border border-line">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="bg-surface-2 text-left text-xs text-ink-3">
                              <th className="w-14 border-b border-line px-3 py-2">#</th>
                              <th className="w-32 border-b border-line px-3 py-2">SBD / Mã</th>
                              <th className="border-b border-line px-3 py-2">Họ và tên</th>
                              <th className="w-24 border-b border-line px-3 py-2 text-right">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detail.students.map((st, idx) => {
                              const isEditing = editingStudent?.id === st.id;
                              return (
                                <tr key={st.id} className="hover:bg-surface-2">
                                  <td className="border-b border-surface-3 px-3 py-2 text-xs text-ink-4">
                                    {idx + 1}
                                  </td>
                                  <td className="border-b border-surface-3 px-3 py-1.5 font-mono text-xs">
                                    {isEditing ? (
                                      <input
                                        value={editingStudent.code}
                                        onChange={(e) =>
                                          setEditingStudent({ ...editingStudent, code: e.target.value })
                                        }
                                        className="w-24 rounded-sm border border-line px-1.5 py-1 text-xs"
                                      />
                                    ) : (
                                      st.code || '—'
                                    )}
                                  </td>
                                  <td className="border-b border-surface-3 px-3 py-1.5">
                                    {isEditing ? (
                                      <input
                                        value={editingStudent.name}
                                        onChange={(e) =>
                                          setEditingStudent({ ...editingStudent, name: e.target.value })
                                        }
                                        className="w-full rounded-sm border border-line px-2 py-1 text-sm"
                                      />
                                    ) : (
                                      st.name
                                    )}
                                  </td>
                                  <td className="border-b border-surface-3 px-3 py-1.5 text-right">
                                    {isEditing ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          void fetch(basePath(`/api/classes/${detail.id}/students`), {
                                            method: 'PATCH',
                                            headers: { 'content-type': 'application/json' },
                                            body: JSON.stringify({
                                              studentId: st.id,
                                              code: editingStudent.code.trim() || null,
                                              name: editingStudent.name.trim(),
                                            }),
                                          })
                                            .then((r) => r.json())
                                            .then((d: { class?: ClassDetail }) => {
                                              if (d.class) setDetail(d.class);
                                              setEditingStudent(null);
                                            });
                                        }}
                                        className="text-xs font-medium text-accent hover:underline"
                                      >
                                        Lưu
                                      </button>
                                    ) : (
                                      <div className="inline-flex items-center gap-1">
                                        <button
                                          type="button"
                                          aria-label={`Sửa ${st.name}`}
                                          onClick={() =>
                                            setEditingStudent({ id: st.id, code: st.code ?? '', name: st.name })
                                          }
                                          className="rounded-sm p-1 text-ink-4 hover:text-ink"
                                        >
                                          <Pencil className="size-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          aria-label={`Xoá ${st.name}`}
                                          onClick={() => {
                                            void fetch(
                                              basePath(`/api/classes/${detail.id}/students?studentId=${encodeURIComponent(st.id)}`),
                                              { method: 'DELETE' },
                                            )
                                              .then((r) => r.json())
                                              .then((d: { class?: ClassDetail }) => {
                                                if (d.class) setDetail(d.class);
                                                void loadList();
                                              });
                                          }}
                                          className="rounded-sm p-1 text-ink-4 hover:text-danger"
                                        >
                                          <Trash2 className="size-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                            {!detail.students.length ? (
                              <tr>
                                <td colSpan={4} className="px-3 py-8 text-center text-xs text-ink-4">
                                  Lớp chưa có học sinh. Nhập tên bên trên hoặc dán danh sách từ Excel.
                                </td>
                              </tr>
                            ) : null}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} labelledBy="cls-create-title" className="max-w-md p-5">
        <h2 id="cls-create-title" className="text-base font-semibold text-ink">
          Tạo lớp học mới
        </h2>
        <div className="mt-3 space-y-3 text-sm">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-2">Tên lớp</span>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ví dụ: 9A1" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-2">Môn (tuỳ chọn)</span>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="h-9 w-full rounded-md border border-line bg-white px-2 text-sm"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-2">Khối lớp</span>
              <Input
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value.replace(/\D/g, '').slice(0, 2))}
                placeholder="9"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-2">
              Danh sách học sinh ban đầu (tuỳ chọn)
            </span>
            <textarea
              value={newRosterText}
              onChange={(e) => setNewRosterText(e.target.value)}
              rows={5}
              placeholder={'09001 Nguyễn Văn An\n09002 Trần Minh Anh'}
              className="w-full rounded-md border border-line p-2 font-mono text-xs"
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCreateOpen(false)}>
            Huỷ
          </Button>
          <Button variant="blue" size="sm" disabled={busy || !newName.trim()} onClick={() => void createClass()}>
            Tạo lớp
          </Button>
        </div>
      </Dialog>

      <Dialog open={pasteOpen} onClose={() => setPasteOpen(false)} labelledBy="cls-paste-title" className="max-w-md p-5">
        <h2 id="cls-paste-title" className="text-base font-semibold text-ink">
          Nhập danh sách từ CSV / Excel
        </h2>
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          rows={7}
          placeholder={'Dán từng dòng:\n09001\tNguyễn Văn An\n09002, Trần Minh Anh\nhoặc chỉ họ tên'}
          className="mt-3 w-full rounded-md border border-line p-2.5 font-mono text-xs"
        />
        <label className="mt-2 flex items-center gap-2 text-xs text-ink-2">
          <input type="checkbox" checked={autoSbd} onChange={(e) => setAutoSbd(e.target.checked)} />
          Tự đánh SBD theo thứ tự cho dòng chưa có mã
        </label>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setPasteOpen(false)}>
            Huỷ
          </Button>
          <Button variant="blue" size="sm" disabled={busy || !pasteText.trim()} onClick={() => void importPaste()}>
            Nhập vào lớp
          </Button>
        </div>
      </Dialog>

      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)} labelledBy="cls-rename-title" className="max-w-sm p-5">
        <h2 id="cls-rename-title" className="text-base font-semibold text-ink">
          Đổi tên lớp
        </h2>
        <Input value={renameVal} onChange={(e) => setRenameVal(e.target.value)} className="mt-3" />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setRenameOpen(false)}>
            Huỷ
          </Button>
          <Button
            variant="blue"
            size="sm"
            disabled={busy || !renameVal.trim()}
            onClick={() => {
              if (!detail) return;
              void fetch(basePath(`/api/classes/${detail.id}`), {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ name: renameVal.trim() }),
              })
                .then((r) => r.json())
                .then((d: { class?: ClassDetail }) => {
                  if (d.class) setDetail(d.class);
                  setRenameOpen(false);
                  void loadList();
                });
            }}
          >
            Lưu
          </Button>
        </div>
      </Dialog>

      <Dialog open={deleteClassOpen} onClose={() => setDeleteClassOpen(false)} labelledBy="cls-del-title" className="max-w-sm p-5">
        <h2 id="cls-del-title" className="text-base font-semibold text-ink">
          Xoá lớp {detail?.name}
        </h2>
        <p className="mt-2 text-sm text-ink-2">
          Lớp sẽ bị xoá khỏi danh sách tái sử dụng; các bài làm và điểm đã chấm ở đợt cũ vẫn được giữ nguyên.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDeleteClassOpen(false)}>
            Huỷ
          </Button>
          <Button
            variant="blue"
            size="sm"
            onClick={() => {
              if (!detail) return;
              void fetch(basePath(`/api/classes/${detail.id}`), { method: 'DELETE' }).then(() => {
                setDeleteClassOpen(false);
                setSelectedId(null);
                void loadList();
              });
            }}
          >
            Xoá lớp
          </Button>
        </div>
      </Dialog>
    </AppFrame>
  );
}
