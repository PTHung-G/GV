# Bounded organization coverage correction

## Implementation

- Scope: `lib/server/question-bank-ai.ts` and `e2e/unit/question-bank-organization.spec.ts`; this new evidence note only. No runner, external prompt, deployment, build, or provider changes.
- Organization accepts at most one corrective `complete` call after well-formed JSON with mechanically missing, duplicate, or unknown assignment aliases. First output is never persisted. Correction requests a FULL replacement nodes/assignments object using original questions/context and the exact raw first output as an explicitly untrusted assistant message.
- Feedback lists at most 40 aliases/category plus counts; unknown text is restricted to short canonical Q-number aliases, with arbitrary/private values redacted. No taxonomy, semantic mapping, deterministic assignment completion, merging, or copying between model responses.
- Coverage is measured before tree validation; every assignment topic (including unknown/duplicate alias rows) is validated with synthetic validation-only question IDs. The full-bank reference projection is then validated before deciding to retry. Invalid trees/topics and omitted references to removed nodes fail without retry.
- Same 90-second AbortSignal, 105-second claim lease, admission/owner limits, and final CAS/lease fences remain. Before correction, `readBank` checks revision/token/expiry without a revision mutation. Aborted signals are checked after replies and after that read. Correction input (original question context + raw response + feedback) also stays within 160,000 characters, without truncation.

## TDD and verification

- Added tests first; targeted initial run of `npx playwright test -c .data/organization-unit.config.ts --grep '163/162 coverage|duplicate and unknown feedback|second incomplete'`: **3 failed**, expected before implementation (only one model call; no correction success).
- Final `npx playwright test -c .data/organization-unit.config.ts`: **54 passed (3.5s)**, exit 0. This includes 41 organization tests and 13 bank validation tests.
- `npx tsc --noEmit`: **passed**, exit 0 (independently rerun with explicit `TYPECHECK_EXIT=0`).
- Regression coverage: 163 questions / 162 assignments followed by complete success; repeated incomplete failure preserving bank; replacement-not-merge; sanitized duplicate/unknown feedback; malformed JSON/shape/assignments, cycles and invalid topics/reference failures without retry; identical signal; elapsed deadline before and during fence; second-call timeout; revision/expiry/token fences before correction and on corrected commit; input caps; native review and AI extraction remain single/no-call as appropriate.

## Limitations

- All provider/persistence behavior in these tests is mocked around the actual production module. No paid model, database, live ten-paper replay, deployment, or semantic taxonomy assessment was performed.
- A first incomplete response that also invalidates an existing full-bank reference is intentionally rejected without correction; coverage errors cannot conceal an invalid tree.
- Near-cap inputs may have no space to include the complete raw proposal in correction context and fail closed without a second call.
- Repository files are currently untracked in this workspace; `git diff --check` has no tracked diff to inspect.
