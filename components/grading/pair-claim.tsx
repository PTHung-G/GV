'use client';

/**
 * Claiming a pairing code on the phone.
 *
 * The code is the credential; once claimed, the phone holds a capture session
 * limited to this one grading session.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Smartphone } from 'lucide-react';
import { gradingApi, GradingApiError } from '@/lib/grading-client';

export function PairClaim({ code }: { code: string }) {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await gradingApi.post(`/api/grading/pairings/${encodeURIComponent(code)}/claim`);
        if (!cancelled) router.replace('/grading/capture');
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof GradingApiError ? err.message : 'Không ghép được thiết bị.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, router]);

  return (
    <div className="mx-auto max-w-sm px-6 py-24 text-center">
      <Smartphone className="mx-auto size-9 text-accent" />
      {error ? (
        <>
          <h1 className="mt-4 text-[18px] font-medium text-ink">Không ghép được</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">{error}</p>
          <p className="mt-3 text-[12.5px] text-ink-4">
            Hãy nhờ giáo viên tạo mã mới trên máy tính rồi quét lại.
          </p>
        </>
      ) : (
        <>
          <h1 className="mt-4 text-[18px] font-medium text-ink">Đang ghép thiết bị…</h1>
          <p className="mt-3 flex items-center justify-center gap-2 text-[13px] text-ink-3">
            <Loader2 className="size-4 animate-spin" />
            Vui lòng chờ trong giây lát
          </p>
        </>
      )}
    </div>
  );
}
