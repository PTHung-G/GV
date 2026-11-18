'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/site-header';

export function AuthDialog() {
  const { dialogOpen, closeDialog, login, register, dialogReason } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const registering = mode === 'register';

  useEffect(() => {
    if (!dialogOpen) {
      setPassword('');
      setConfirmation('');
      setShowPassword(false);
      setError('');
      setMode('login');
    }
  }, [dialogOpen]);

  const switchMode = (next: 'login' | 'register') => {
    setMode(next);
    setPassword('');
    setConfirmation('');
    setShowPassword(false);
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setError('');
    if (registering) {
      if (!name.trim()) {
        setError('Vui lòng nhập họ và tên.');
        return;
      }
      if (password.length < 8 || password.length > 128) {
        setError('Mật khẩu phải có từ 8 đến 128 ký tự.');
        return;
      }
      if (password !== confirmation) {
        setError('Mật khẩu xác nhận chưa khớp.');
        return;
      }
    }
    setPending(true);
    try {
      if (registering) await register(email.trim(), password, name.trim());
      else await login(email.trim(), password);
      router.push('/hub');
    } catch (err) {
      setError(err instanceof Error ? err.message : registering ? 'Không tạo được tài khoản.' : 'Không đăng nhập được.');
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onClose={pending ? () => {} : closeDialog} labelledBy="auth-title">
      <div className="flex flex-col items-center text-center">
        <Logo className="size-10" />
        <h2 id="auth-title" className="mt-3 text-[22px] leading-tight font-semibold tracking-tight">
          {registering ? 'Tạo tài khoản' : 'Đăng nhập'}
        </h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-3">
          {dialogReason || 'Lưu đề và đồng bộ dữ liệu trên các thiết bị.'}
        </p>
      </div>

      <div className="mt-5 flex rounded-md border border-line bg-surface-2 p-1" role="tablist" aria-label="Đăng nhập hoặc đăng ký">
        {(['login', 'register'] as const).map((item) => (
          <button key={item} id={`auth-tab-${item}`} type="button" role="tab" disabled={pending}
            aria-selected={mode === item} aria-controls="auth-form" tabIndex={mode === item ? 0 : -1}
            onClick={() => switchMode(item)}
            onKeyDown={(event) => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === 'Home' ? 'login' : event.key === 'End' ? 'register' : item === 'login' ? 'register' : 'login';
              switchMode(next);
              document.getElementById(`auth-tab-${next}`)?.focus();
            }}
            className={`h-9 flex-1 rounded-sm text-[14px] font-medium transition-colors disabled:opacity-60 ${mode === item ? 'bg-white text-ink shadow-sm' : 'text-ink-3 hover:text-ink'}`}>
            {item === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        ))}
      </div>

      <form id="auth-form" role="tabpanel" aria-labelledby={`auth-tab-${mode}`} onSubmit={submit} className="mt-4 space-y-3" aria-busy={pending}>
        {registering && (
          <div>
            <label htmlFor="auth-name" className="mb-1.5 block text-[13px] font-medium text-ink-2">Họ và tên</label>
            <Input id="auth-name" name="name" autoComplete="name" required minLength={2} maxLength={80} disabled={pending}
              placeholder="Nguyễn Văn An" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div>
          <label htmlFor="auth-email" className="mb-1.5 block text-[13px] font-medium text-ink-2">Email</label>
          <Input id="auth-email" name="email" type="email" autoComplete="username" required disabled={pending}
            placeholder="giao.vien@truong.edu.vn" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="auth-password" className="mb-1.5 block text-[13px] font-medium text-ink-2">Mật khẩu</label>
          <div className="relative">
            <Input id="auth-password" name="password" type={showPassword ? 'text' : 'password'}
              autoComplete={registering ? 'new-password' : 'current-password'} required disabled={pending}
              minLength={registering ? 8 : undefined} maxLength={registering ? 128 : undefined}
              aria-describedby={registering ? 'auth-password-hint' : undefined}
              placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
            <button type="button" disabled={pending} onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={showPassword}
              className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-sm text-ink-4 hover:bg-surface-3 hover:text-ink">
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {registering && <p id="auth-password-hint" className="mt-1 text-[12px] text-ink-4">Từ 8 đến 128 ký tự.</p>}
        </div>
        {registering && (
          <div>
            <label htmlFor="auth-confirmation" className="mb-1.5 block text-[13px] font-medium text-ink-2">Xác nhận mật khẩu</label>
            <Input id="auth-confirmation" name="password-confirmation" type={showPassword ? 'text' : 'password'}
              autoComplete="new-password" required disabled={pending} minLength={8} maxLength={128}
              placeholder="Nhập lại mật khẩu" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
          </div>
        )}
        {error && <p role="alert" className="text-[13px] text-danger">{error}</p>}
        <Button type="submit" size="lg" variant="blue" className="w-full font-semibold" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {registering ? 'Tạo tài khoản' : 'Đăng nhập'}
        </Button>
      </form>
    </Dialog>
  );
}
