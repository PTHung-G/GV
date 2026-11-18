# Bug Assessment: Sanitized question-bank failure messages

- **Slug**: question-bank-error-messages
- **Created**: 2026-11-17
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

Public evaluation final whole-bank request returned in 48.973 seconds with valid JSON containing 162/163 assignments (missing Q162). Rejection was correct, but the UI described a 90-second deadline or invalid output. User requests sanitized distinctions without provider detail or changes to prompts, semantic repair, retry behavior, taxonomy, or limits.

## Symptom

An incomplete organization response is correctly rejected, yet its stored error misleadingly mentions a deadline that was not reached. Expected: distinguish known coverage, invalid-output, timeout, and abort failures; use a neutral fallback when the cause is unknown.

## Reproduction

1. Mock the existing production-module harness with 163 questions and valid proposal JSON assigning only Q0 through Q161.
2. Call processBank for organization without waiting for a deadline.
3. Observe failure with unchanged content and tree; before the fix the message mentions 90 seconds or invalid output.

The public paid evaluation is supplied evidence, not rerun. Its error-path equivalent will be reproduced with mocks only.

## Suspected Code Paths

- `lib/server/question-bank-ai.ts:47-60`: proposal shape, assignment coverage, and tree validation correctly reject unsafe output.
- `lib/server/question-bank-ai.ts:72-79`: catch stores one combined deadline/invalid-output message for all remaining failures.
- `lib/server/model.ts:81-93`: abort wrappers preserve explicit signal reasons.
- `e2e/unit/question-bank-organization.spec.ts`: existing production-module harness isolates persistence and model calls.

## Root Cause Hypothesis

High confidence: the catch branch distinguishes only context overflow and unavailable configuration. All other errors, including assignment_coverage and invalid_proposal, receive the same misleading deadline text.

## Proposed Remediation

**Preferred**: introduce a small allowlisted failure-message helper. Preserve current context-limit and offline messages. Map assignment_coverage to a generic coverage explanation; invalid_proposal, syntax errors, and known BankError validation failures to invalid output; explicit TimeoutError/AbortError names to distinct waiting/interruption messages. Unknown failures receive a neutral generic message. Never interpolate exception text or provider data. Leave all validation and execution behavior unchanged.

**Files likely to change**:
- `lib/server/question-bank-ai.ts`
- `e2e/unit/question-bank-organization.spec.ts`

**Tests to add or update**:
- Exact 163-question / 162-assignment reproduction, with atomic preservation and one model call.
- Invalid proposal shape, malformed JSON, tree-validation failure.
- Explicit TimeoutError and AbortError; unknown provider errors/non-Error rejections remain sanitized and do not imply timeout.
- Existing context-overflow and offline messages remain intact.

## Risks & Considerations

- Error names identify explicit timeout/abort only; do not infer causes from arbitrary provider text.
- No raw messages, IDs, provider names, URLs, or response bodies reach the UI.
- No paid calls, builds, deploys, prompt edits, retries, semantic changes, dependencies, or limit changes.
- No bug-related extension hooks are registered in `.specify/extensions.yml`.

## Open Questions

None for the bounded mocked reproduction.
