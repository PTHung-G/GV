# Bug Assessment: AI chat hides invalid provider credentials

- **Slug**: ai-chat-invalid-response
- **Created**: 2026-11-12T17:11:04+07:00
- **Source**: pasted text and user screenshot
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)

User submits “tạo cho tôi một đề thi machine learning chỉ gồm các câu hỏi về PCA”. Chat displays “Dịch vụ trả về phản hồi không hợp lệ.” User requests investigation.

## Symptom

Exam creation fails during planning. The user-facing error obscures the underlying provider authentication failure. Expected: a valid configured provider generates the exam, or the application clearly reports unavailable AI configuration without revealing secrets.

## Reproduction

1. Use current local AI configuration: base URL `https://api.vilao.ai/v1`, model `chib/deepseek-v4.1-flash`; key is present, value intentionally omitted.
2. Authenticated GET `/models` and POST `/chat/completions` directly to that configured provider both return HTTP 401, JSON `error.code=INVALID_API_KEY`, `error.message=Invalid API key.`, `error.type=authentication_error`.
3. POST the user's PCA prompt to the running app at `/soandethi/api/chat-exam/plan` returns HTTP 502 JSON, `code=plan_failed`, `error=Không lập được kế hoạch.`
4. Previous public-path verification returned an HTML 502 page; the client turns a non-JSON response into the generic message shown in the screenshot. The exact intermediary generating that HTML was not independently identified during this assessment.

## Suspected Code Paths

- `lib/server/model.ts:80-141` — complete() calls configured provider and throws on non-retryable 401.
- `lib/server/planner.ts:69-77` — planner invokes complete(), so authentication failure prevents any generation.
- `app/api/chat-exam/plan/route.ts:36-45` — provider errors are reduced to generic 502 plan_failed; extracted error message is unused.
- `lib/chat-exam-client.ts:46-57` — non-JSON error response becomes generic invalid response message.
- `.env.local` — current provider connection configuration; never copy secret values into this assessment.

## Root Cause Hypothesis

**High confidence**: the configured API key is rejected by the configured AI provider. This is established by two direct requests returning INVALID_API_KEY, independently of the PCA prompt and application planner. Whether the key was revoked, entered incorrectly, expired, or belongs to another service cannot be inferred from this response. Model availability has not been verified because authentication fails first. Secondary error handling masks the actionable cause.

## Proposed Remediation

**Preferred**: obtain a valid key for this provider from the owner and update server configuration through a private channel, then restart the app. Do not substitute the offline fixture and claim real generation works. Add safe classification of provider 401/403 as an AI configuration/authentication problem, with a clear Vietnamese message and correlation identifier. Never forward raw provider response or secret values to users. Verify non-JSON 502 handling through the public route.

**Files likely to change**:
- `.env.local` — only when valid replacement credentials are provided securely.
- `lib/server/model.ts` — typed/safe provider error classification.
- `app/api/chat-exam/plan/route.ts` — safe meaningful error mapping.
- `app/api/chat-exam/route.ts` — consistent generation error mapping.
- `lib/chat-exam-client.ts` — useful handling of upstream non-JSON 502 responses.
- `e2e/unit/model-stream.spec.ts` or dedicated provider error tests; AI UI error tests.

**Tests to add or update**:
- Provider 401/403 yields a safe classified configuration error; no retry for 401 and no key leakage.
- Non-JSON HTTP 502 yields a useful service error rather than implying a prompt problem.
- Successful real-provider planner returns steps and generation completes for PCA prompt after credentials are replaced.

## Risks & Considerations

- All features using the same provider configuration may be affected, not only the exam assistant.
- Replacing credentials requires restarting the running server; do not send credentials through chat or commit them.
- Existing mocked UI tests prove interface behavior, not provider health.
- No source or configuration was modified during assessment. No database changes required.

## Open Questions

- Owner must supply a working key privately or repair the current key at the provider.
- Exact reason the provider rejects the key is not exposed beyond INVALID_API_KEY.
