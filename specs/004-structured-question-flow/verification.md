# Verification — deployed004

Feature004 structured-question-flow, 2026-11-16. Implementation, corpus evaluation and deployment completed; chronological findings below retain initial failures and subsequent verification. Public authenticated gateway traversal remains unverified.

## Pre-implementation checks
- Code audit confirms generation HTML-only, no native question array. Conversation `{html,action}` validation and editor live DOM/pagination/math serialization require changes, not simple payload forwarding.
- Existing release003 parser relies on top-level question starts: no whole-question wrappers introduced by design.
- Independent corpus collection complete:3 original PDFs, source/exam hashes and pre-inference gold freeze. Lossy text formula/diagram limits explicitly recorded in docs/evaluations/math9-topic-tree/independent-gold.md.
- Spec/plan/tasks consistency checked:14FR and5SC covered by19 tasks, no critical contradictions; constitution unratified placeholder. Optional context hooks deferred; no mandatory hooks registered.

## Red test evidence
`QUESTION_BANK_TEST_PORT=55434 pnpm exec playwright test e2e/unit/question-bank-storage.spec.ts --workers=1 -g 'native structured source'` against fresh disposable `sdt-structured-storage-test` PostgreSQL16 container, loopback55434.1 test failed as expected: native source status pending (expected review), extractionMode absent. This confirms new storage test detects missing direct-review path. No app DB touched. Final green run pending, disposable container must be stopped when finished.

## Deployment finding
Existing enabled soandethi.service was inactive at start. Journal shows clean exit0/SUCCESS on2026-11-14, not a diagnosed crash. Existing Restart=on-failure does not restart clean unexpected exit. Repository unit changed to Restart=always (explicit systemctl stop still remains stopped); installation/restart/validation pending. No claim of current production availability or public gateway traversal.

## Remaining release gates
Shared core tests, native editor/save lifecycle/browser, legacy fallback, owner/idempotency/storage, real provider corpus semantic scoring/fixes, full build/regression, subpath build + authenticated deployed smoke/restart, final evidence and limitations.

## Integrated green and first full regression
- `pnpm exec tsc --noEmit` passed after integration. Root `pnpm build` passed.
- Disposable PostgreSQL55435: structured schema + generation + bank storage suite **32 passed (4.5s)**. Native direct review, attempts0, no provider calls, scoped context, immutable confirmation, owner/CAS/idempotency passed.
- Browser bank + structured lifecycle: **14 passed (14.2s)**, including live math/edit/reload, unsafe anchors, history append/collision and legacy preview. Added direct bank capture/fallback test also passed in full regression.
- First full regression discovered227 tests and exited1; five persistent failures after retry: release preview missing visible code, old app schema missing published OMR column in live scan, borrowed palette, two grading source guards. Two initial bank failures were concurrent red tests from semantic-fix agent and now pass. Failures retained in [.data log](<../../.data/structured-last-failed.log>); release preview code fix added, remaining repair delegated. No claim full regression green yet.
- Actual-provider first pass: **32 retained units;27 correct/3 ambiguous/2 wrong**, all32 polluted by legacy broadcast context. See [unaltered first-pass report](<../../docs/evaluations/math9-topic-tree/report.md>). General extraction/ancestry fixes and same-corpus final run in progress. PDF chart/formula fidelity is separate and incomplete.

## Full regression after evidenced repairs
- Historical DB drift confirmed metadata-only:0013 recorded applied but nullable `submissions.published_omr_verified_at` absent. New migration0014 safely adds it without backfill. Child standalone disposable test passed fresh chain, drift repair and repeated application;13 focused grading/token tests passed.
- Private custom-format backup `.data/pre-structured-release-20261116.dump` created mode0600 before migration. Initial attempt with wrong role failed before mutation; inspected compose configuration and retried correct configured role. Normal runner applied0014; prior migrations untouched. Root rebuild passed.
- Preview previously put code only in document title; now escaped visible code in body, without rewriting frozen published artifacts. Source-guard test mocks updated for extra provenance query and strengthened independent revision/lease checks. Semantic palette restored.
- `pnpm exec tsc --noEmit --pretty false`: exit0.
- `pnpm exec playwright test --workers=2`: **210 passed,21 skipped (53.0s), exit0**,231 discovered. Skips are explicit opt-in DB/provider/HTTP suites, not hidden failures; disposable native/storage suite was run separately32/32. Native release parser compatibility and undo reconciliation plus actual generation conversation persistence passed. Release/live-scan browser regressions now pass after migration/preview fixes.
- Disposable storage container stopped. Same-corpus semantic rerun and deployed authenticated checks remain pending.

## Deployed004 checks
- Production `NEXT_BASE_PATH=/soandethi pnpm build`: exit0. Installed inspected existing systemd unit, daemon-reload and enabled existing port3210 service; `Restart=always`, `ActiveState=active`. No replacement application server.
- `node scripts/question-bank-deploy-smoke.mjs`: exit0. Synthetic authenticated source saved as native review, attempts0, exact HTML/stable question ID; service restarted and cookie/source persisted; browser reload passed with0 page errors. Synthetic account removed using exact ID/email guard. [Screenshot](<../../test-results-bank-deployed.png>) inspected: direct-review message visible, formula renders, no extraction button.
- Explicit deployed loopback owner-boundary HTTP suite: **2 passed (1.3s)**, actual registration/cookies, guest401, two-account isolation and foreign-source rejection, exact synthetic cleanup DB match. No secrets printed.
- Public https://dsh.vnotemate.com/soandethi/ returned401: Basic-auth gateway only. Public authenticated traversal remains unverified; loopback app verification is not a claim of bypassing gateway.
- Remaining gate: collect final actual-provider semantic rerun/review and incorporate honest initial→final comparison.

## Final semantic evidence and completion
Same frozen three-source corpus, real configured deepseek-v4.1-flash, sequential production services, fresh disposable database: successful final six-call run completed. First-pass and unsuccessful final attempts retained, including provider token truncation before increasing bounded output allowance. See [appended complete report](<../../docs/evaluations/math9-topic-tree/report.md#L83-L114>).

| Axis | Initial | Final |
|---|---|---|
| Retained units |32 (8/5/19)|35 (8/8/19)|
| Actual full topic paths |27 correct/3 ambiguous/2 wrong|35 correct/0 ambiguous/0 wrong|
|37 preferred boundary units |27 correct/8 ambiguous/2 wrong|33 correct/4 ambiguous/0 wrong|
| Unrelated context pollution |32 snippets|0 snippets|

All35 paths and58 ignored blocks manually reviewed. Four preferred expression/equation units remain ambiguous because paired independent expressions occupy the same immutable physical-line blocks. No source rewriting was invented to force ideal boundaries. Cylinder ancestry encompasses volume; probability separate from descriptive statistics. These are manual judgments on three papers with one model, not national robustness/teacher certification. Original PDF chart/formula fidelity remains incomplete/unscorable. Gold/manifest unchanged.

Production shell returned200 and all12 referenced subpath assets returned success. Final semantic code was included in production build; later additions are tests/evidence only. Existing service active with restart supervision; synthetic deployed native and two-owner checks passed. All19 feature tasks complete, with remaining limits disclosed rather than counted as perfect ingestion.
