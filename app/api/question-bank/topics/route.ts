import { bankUser, bankResponse, jsonError } from '@/lib/server/question-bank-http';
import { createBankTopic, deleteBankTopic, updateBankTopic } from '@/lib/server/question-bank-store';
import { validateAuthRequest } from '@/lib/server/auth-input';
import { HttpError, readJson } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    validateAuthRequest(req);
    const user = await bankUser();
    const body = await readJson<{ label: string; parentId?: string | null; isLocked?: boolean }>(req);
    const res = await createBankTopic(user.id, body);
    return bankResponse(res.envelope, { topic: res.value });
  } catch (e) {
    return jsonError(e);
  }
}

export async function PATCH(req: Request) {
  try {
    validateAuthRequest(req);
    const user = await bankUser();
    const body = await readJson<{ id: string; label?: string; parentId?: string | null; isLocked?: boolean }>(req);
    if (!body.id) throw new HttpError(400, 'Thiếu mã chủ đề.', 'invalid_topic');
    const res = await updateBankTopic(user.id, body.id, body);
    return bankResponse(res.envelope, { topic: res.value });
  } catch (e) {
    return jsonError(e);
  }
}

export async function DELETE(req: Request) {
  try {
    validateAuthRequest(req);
    const user = await bankUser();
    const id = new URL(req.url).searchParams.get('id') || (await readJson<{ id?: string }>(req).catch(() => ({} as { id?: string }))).id;
    if (!id) throw new HttpError(400, 'Thiếu mã chủ đề.', 'invalid_topic');
    const res = await deleteBankTopic(user.id, id);
    return bankResponse(res.envelope, { deletedId: res.value });
  } catch (e) {
    return jsonError(e);
  }
}
