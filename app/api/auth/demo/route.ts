import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
/** The former shared-account impersonation endpoint is permanently retired. */
export async function POST() {
  return NextResponse.json({ success: false, error: 'Đăng nhập demo đã ngừng. Vui lòng đăng ký hoặc đăng nhập bằng email.', code: 'demo_disabled' }, { status: 403 });
}
