import { bankUser, bankResponse, jsonError } from '@/lib/server/question-bank-http';
import { deleteBankQuestion, updateBankQuestion } from '@/lib/server/question-bank-store';
import { validateAuthRequest } from '@/lib/server/auth-input';
import { HttpError, readJson } from '@/lib/server/http';
import type { BankQuestionType, BankRubricStep } from '@/lib/question-bank/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type PatchBody = {
  label?: string;
  topicId?: string;
  questionType?: BankQuestionType;
  customHtml?: string | null;
  answer?: string | null;
  points?: number | null;
  rubric?: BankRubricStep[] | null;
};

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    validateAuthRequest(req);
    const user = await bankUser();
    const { id } = await params;
    const body = await readJson<PatchBody>(req);
    if (!body || typeof body !== 'object') throw new HttpError(400, 'Dữ liệu không hợp lệ.', 'invalid_body');
    const res = await updateBankQuestion(user.id, id, body);
    return bankResponse(res.envelope, { question: res.value });
  } catch (e) {
    return jsonError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    validateAuthRequest(req);
    const user = await bankUser();
    const { id } = await params;
    const res = await deleteBankQuestion(user.id, id);
    return bankResponse(res.envelope, { deletedId: res.value });
  } catch (e) {
    return jsonError(e);
  }
}
