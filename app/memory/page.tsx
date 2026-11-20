'use client';

/**
 * /memory — the teacher's standing preferences for the assistant.
 *
 * Mirrors the original's memory page: list, add, edit, delete, restore, clear,
 * and a master switch. Every action goes through /api/memory.
 */
import { useCallback, useEffect, useState } from 'react';
import { Loader2, RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { basePath } from '@/lib/api-url';
import { AppFrame } from '@/components/shell/app-frame';
import { ShellHeader } from '@/components/shell/app-shell';
import { useAuth } from '@/lib/auth-context';

type Item = { id: string; text: string; deleted?: boolean; createdAt: number };
type Memory = { items: Item[]; useMemory: boolean };

export default function MemoryPage() {
  const { user, ready, openDialog } = useAuth();
  if (!ready) {
    return (
      <AppFrame>
        <ShellHeader title="Trí nhớ trợ lý" />
        <p className="p-6 text-sm text-ink-3">Đang kiểm tra tài khoản…</p>
      </AppFrame>
    );
  }
  if (!user) {
    return (
      <AppFrame>
        <ShellHeader title="Trí nhớ trợ lý" />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[720px] p-6">
            <h1 className="text-xl font-semibold text-ink">Trí nhớ của trợ lý</h1>
            <p className="mt-2 text-sm text-ink-3">
              Đăng nhập để xem và tuỳ chỉnh quy tắc AI ghi nhớ riêng cho bạn.
            </p>
            <button
              type="button"
              className="mt-4 inline-flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-white hover:bg-accent-hover"
              onClick={() => openDialog('Đăng nhập để quản lý trí nhớ trợ lý')}
            >
              Đăng nhập để quản lý trí nhớ riêng của bạn
            </button>
          </div>
        </div>
      </AppFrame>
    );
  }
  return <AccountMemory key={user.id} />;
}

function AccountMemory() {
  const [memory, setMemory] = useState<Memory | null>(null);
  const [text, setText] = useState('');
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(basePath('/api/memory'), { cache: 'no-store' });
      if (!res.ok) throw new Error('Không tải được trí nhớ.');
      const data = (await res.json()) as { memory: Memory };
      setMemory(data.memory);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra.');
    }
  }, []);

  useEffect(() => {
    void load();
    const refresh = () => void load();
    window.addEventListener('focus', refresh);
    const timer = setInterval(refresh, 10000);
    return () => { window.removeEventListener('focus', refresh); clearInterval(timer); };
  }, [load]);

  /** Runs one mutation, then refreshes so the list always matches the server. */
  const run = async (fn: () => Promise<Response>) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fn();
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message ?? 'Thao tác không thành công.');
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra.');
    } finally {
      setBusy(false);
    }
  };

  const active = memory?.items.filter((i) => !i.deleted) ?? [];
  const removed = memory?.items.filter((i) => i.deleted) ?? [];

  return (
    <AppFrame>
      <ShellHeader title="Trí nhớ trợ lý" subtitle="Tuỳ chọn ưu tiên cho trợ lý AI soạn đề" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[720px] px-6 py-10">
          <h1 className="font-display text-[30px] font-semibold tracking-tight text-ink">
            Trí nhớ của trợ lý
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
            Những điều trợ lý nhớ về cách thầy cô soạn đề — cỡ chữ, đơn vị, cách ra câu hỏi. Trợ lý đọc
            phần này trước mỗi lần soạn đề.
          </p>

          {error && (
            <p role="alert" className="mt-4 rounded-md bg-danger-soft px-3 py-2 text-[13.5px] text-danger">
              {error}
            </p>
          )}

      {!memory ? (
        <div className="mt-10 flex items-center gap-2 text-[14px] text-ink-3">
          <Loader2 className="size-4 animate-spin" /> Đang tải…
        </div>
      ) : (
        <>
          <label className="mt-8 flex items-center gap-3 rounded-md border border-line px-4 py-3">
            <input
              type="checkbox"
              checked={memory.useMemory}
              disabled={busy}
              onChange={(e) =>
                void run(() =>
                  fetch(basePath('/api/memory/settings'), {
                    method: 'PATCH',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ useMemory: e.target.checked }),
                  }),
                )
              }
              className="size-4 accent-accent"
            />
            <span className="text-[14px] text-ink">Dùng trí nhớ khi soạn đề</span>
          </label>

          <form
            className="mt-5 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const value = text.trim();
              if (!value) return;
              void run(() =>
                fetch(basePath('/api/memory'), {
                  method: 'POST',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ text: value }),
                }),
              ).then(() => setText(''));
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ví dụ: luôn dùng đơn vị cm, làm tròn 2 chữ số"
              className="h-10 flex-1 rounded-md border border-line px-3 text-[14px] text-ink outline-none placeholder:text-ink-4 focus:border-accent"
            />
            <button
              type="submit"
              disabled={busy || !text.trim()}
              className="h-10 rounded-md bg-accent px-4 text-[14px] font-medium text-white disabled:opacity-50"
            >
              Thêm
            </button>
          </form>

          <ul className="mt-6 space-y-2">
            {active.length === 0 && (
              <li className="rounded-md border border-dashed border-line px-4 py-6 text-center text-[14px] text-ink-3">
                Chưa có ghi nhớ nào.
              </li>
            )}
            {active.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-2 rounded-md border border-line px-4 py-3"
              >
                {editing?.id === item.id ? (
                  <>
                    <input
                      autoFocus
                      value={editing.text}
                      onChange={(e) => setEditing({ id: item.id, text: e.target.value })}
                      className="h-8 flex-1 rounded-sm border border-line px-2 text-[14px] outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        void run(() =>
                          fetch(basePath(`/api/memory/${item.id}`), {
                            method: 'PATCH',
                            headers: { 'content-type': 'application/json' },
                            body: JSON.stringify({ text: editing.text }),
                          }),
                        ).then(() => setEditing(null))
                      }
                      className="rounded-sm px-2 py-1 text-[13px] font-medium text-accent hover:bg-surface-3"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="rounded-sm px-2 py-1 text-[13px] text-ink-2 hover:bg-surface-3"
                    >
                      Huỷ
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditing({ id: item.id, text: item.text })}
                      className="flex-1 text-left text-[14px] leading-relaxed text-ink hover:text-accent"
                      title="Bấm để sửa"
                    >
                      {item.text}
                    </button>
                    <button
                      type="button"
                      aria-label="Xoá ghi nhớ"
                      onClick={() => void run(() => fetch(basePath(`/api/memory/${item.id}`), { method: 'DELETE' }))}
                      className="rounded-sm p-1.5 text-ink-3 hover:bg-surface-3 hover:text-danger"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>

          {removed.length > 0 && (
            <section className="mt-8">
              <h2 className="text-[13px] font-medium tracking-wide text-ink-3 uppercase">
                Đã xoá
              </h2>
              <ul className="mt-2 space-y-1">
                {removed.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-[13.5px] text-ink-4"
                  >
                    <span className="flex-1 line-through">{item.text}</span>
                    <button
                      type="button"
                      onClick={() =>
                        void run(() => fetch(basePath(`/api/memory/${item.id}/restore`), { method: 'POST' }))
                      }
                      className="inline-flex items-center gap-1 rounded-sm px-1.5 py-1 hover:bg-surface-3 hover:text-ink"
                    >
                      <RotateCcw className="size-3.5" /> Khôi phục
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {memory.items.length > 0 && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void run(() => fetch(basePath('/api/memory'), { method: 'DELETE' }))}
              className={cn(
                'mt-8 rounded-md border border-line px-3 py-1.5 text-[13px] text-ink-2',
                'hover:border-danger/40 hover:bg-danger-soft hover:text-danger disabled:opacity-50',
              )}
            >
              Xoá toàn bộ trí nhớ
            </button>
          )}
        </>
      )}
        </div>
      </div>
    </AppFrame>
  );
}
