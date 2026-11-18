# Bug Fix: Sanitized question-bank failure messages

- **Slug**: question-bank-error-messages
- **Fixed**: 2026-11-17
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Replaced the combined deadline/invalid-output fallback with an allowlisted message helper. Correct rejection, atomic preservation, model invocation behavior, prompts, and limits are unchanged.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `lib/server/question-bank-ai.ts` | modified | Added failureMessage, imported BankError, and used helper in catch. |
| `e2e/unit/question-bank-organization.spec.ts` | modified | Extended isolated mock with raw response text/provider mode; added 13 generated test cases and strengthened context-limit assertion. |

## Diff Highlights

- assignment_coverage: generic incomplete/incorrect assignment message, no deadline claim or internal code.
- invalid_proposal / SyntaxError / BankError: generic invalid-result message.
- explicit Error.name TimeoutError: waiting deadline message; AbortError: interrupted message.
- Unknown Error and non-Error values: neutral failure, never raw text or an inferred deadline.
- Existing context-limit and offline configuration messages retained exactly.

All new ordinary failure messages retain the statement that content is unchanged and manual retry remains possible. No retries were added.

## Tests Added or Updated

- 163-question valid JSON proposal missing only Q162: coverage message, one model call, lease released, exact non-work-state preservation.
- Invalid shape, malformed JSON with private marker, invalid tree: exact sanitized invalid-result message.
- Organize and extract × TimeoutError, AbortError, unknown Error, non-Error rejection: exact allowlisted messages and atomic preservation, including raw private URL/token/body markers that must never be shown.
- Offline: existing message and no model call.
- Oversized context: added exact existing-message assertion.

## Local Verification

- `pnpm exec playwright test --config .data/organization-unit.config.ts` → 35 passed (2.6s).
- `pnpm exec tsc --noEmit` → passed, no diagnostics; combined shell exit code 0.
- Reviewed the final helper and catch; edits target only import/helper/catch and mocked tests.
- No bug hooks registered in `.specify/extensions.yml`.

## Deviations from Assessment

None. Concurrent parent extraction-prompt edit was detected by the file observation guard; file was reread and only targeted import/helper/catch edits applied, preserving that parent change.

## Follow-ups

None required for this bounded messaging fix. No paid calls, builds, deployment, or live evaluation performed.
