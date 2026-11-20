'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PairCodeEntryPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    const cleaned = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (cleaned.length < 4) {
      setError('Hãy nhập đủ mã ghép hiển thị trên màn hình máy tính.');
      return;
    }
    router.push(`/grading/pair/${encodeURIComponent(cleaned)}`);
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface-2 px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border border-line bg-white p-6 text-center shadow-sm">
        <Smartphone className="mx-auto size-8 text-accent" />
        <h1 className="mt-3 font-display text-[20px] font-medium text-ink">
          Ghép thiết bị quét bài
        </h1>
        <p className="mt-1.5 text-[13px] text-ink-3">
          Nhập mã 6 ký tự đang hiển thị ở hộp thoại “Quét bằng điện thoại” trên máy tính.
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3 text-left">
          <label className="block">
            <span className="mb-1 block text-[12.5px] font-medium text-ink-2">Mã ghép</span>
            <Input
              value={code}
              onChange={(event) => {
                setCode(event.target.value.toUpperCase());
                setError('');
              }}
              placeholder="Ví dụ: A1B2C3"
              autoComplete="off"
              autoCapitalize="characters"
              className="text-center font-mono text-[16px] tracking-[0.2em] uppercase"
            />
          </label>

          {error ? (
            <p role="alert" className="text-[12.5px] text-danger">
              {error}
            </p>
          ) : null}

          <Button type="submit" variant="blue" className="w-full">
            Kết nối thiết bị
          </Button>
        </form>

        <div className="mt-4">
          <Link href="/grading/capture" className="text-[12.5px] text-ink-3 underline hover:text-ink">
            Quay lại màn hình chụp
          </Link>
        </div>
      </div>
    </main>
  );
}
