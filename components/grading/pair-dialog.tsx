'use client';

/**
 * Pairing a phone with this grading session.
 *
 * The desktop shows a QR; the phone scans it, trades the one-time code for a
 * capture session, and can then upload photos. The code is short enough to type
 * by hand when a camera is unavailable.
 */
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Loader2, RefreshCw, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { basePath } from '@/lib/api-url';
import { gradingApi, GradingApiError } from '@/lib/grading-client';

type Pairing = { code: string; expiresAt: string; claimPath: string };

export function PairDialog({
  sessionId,
  open,
  onClose,
}: {
  sessionId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [pairing, setPairing] = useState<Pairing | null>(null);
  const [qr, setQr] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function mint() {
    setLoading(true);
    setError('');
    try {
      const data = await gradingApi.post<{ pairing: Pairing }>(
        `/api/grading/sessions/${sessionId}/pairings`,
      );
      const url = `${window.location.origin}${basePath(data.pairing.claimPath)}`;
      setPairing(data.pairing);
      setLink(url);
      setQr(await QRCode.toDataURL(url, { width: 320, margin: 1 }));
    } catch (err) {
      setError(err instanceof GradingApiError ? err.message : 'Không tạo được mã ghép.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open && !pairing) void mint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} labelledBy="pair-title">
      <div className="text-center">
        <Smartphone className="mx-auto size-8 text-accent" />
        <h2 id="pair-title" className="mt-3 font-display text-[20px] font-medium text-ink">
          Quét bài bằng điện thoại
        </h2>
        <p className="mt-1 text-[13px] text-ink-3">
          Mở camera điện thoại, quét mã bên dưới rồi chụp lần lượt từng bài.
        </p>
      </div>

      {loading ? (
        <div className="mt-6 flex justify-center py-10">
          <Loader2 className="size-5 animate-spin text-ink-4" />
        </div>
      ) : error ? (
        <p className="mt-6 text-center text-[13px] text-danger">{error}</p>
      ) : pairing ? (
        <div className="mt-5 flex flex-col items-center">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="Mã QR ghép điện thoại" className="size-56 rounded-md border border-line" />
          ) : null}

          <p className="mt-4 text-[12px] text-ink-4">Hoặc nhập mã này trên điện thoại</p>
          <p className="mt-1 font-mono text-[26px] font-semibold tracking-[0.2em] text-ink">
            {pairing.code}
          </p>

          <p className="mt-3 max-w-xs text-center text-[12px] leading-relaxed text-ink-4">
            Mã chỉ dùng được một lần và hết hạn sau ít phút. Điện thoại chỉ được phép tải bài lên đợt
            chấm này.
          </p>

          <p className="mt-2 max-w-full truncate text-[11px] text-ink-4">{link}</p>
        </div>
      ) : null}

      <div className="mt-6 flex justify-center gap-2">
        <Button variant="outline" onClick={() => void mint()} disabled={loading}>
          <RefreshCw className="size-4" />
          Mã mới
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </Dialog>
  );
}
