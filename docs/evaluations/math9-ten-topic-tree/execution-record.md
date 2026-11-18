# Execution record — autonomous ten-paper follow-up

## Scope and constraints

User requires every semantic topic/hierarchy to be invented by the AI. Only prompts and supporting tools may change. No seeded taxonomy, manual output corrections or gold-derived mappings. All ten papers are new relative to the earlier three-paper evaluation. Full source manifest and independent gold were frozen before paid inference.

## Implemented changes

- Generic organizer self-review instructions; no statistics/probability/measurement examples.
- AI can merge/delete obsolete nodes if exact supplied assignments and full-bank tree/reference validation succeed.
- Input includes counts for nodes referenced by unsupplied questions, without claiming to classify unseen content. Semantic preservation of unseen ancestors remains an AI responsibility, not something graph validation proves.
- Native extraction bypass, immutable source/HTML, context limits, leases and revision fencing retained.
- Isolated ten-paper runner records full public request messages/replies, usage, per-source snapshots, source/gold hashes and final same-tool self-review. Root-only initial state. Max 21 provider requests per run. No automatic paid retries.

## Checks completed before semantic results

- Corpus offline verifier: ten distinct original PDFs; exact exam-only slices and freezes pass; 154 printed / 167 preferred retained units. Plain-text capture is not lossless PDF/figure capture.
- Focused organizer/validator suite: 20 passed; TypeScript exit0.
- Initial broad no-server config inadvertently included eight browser tests. They failed with invalid relative navigation URLs because no baseURL/server was supplied: five document-sync and three wizard tests. Historical log preserved at `.data/math9-ten-unit-regression.log`. These are harness/config failures, not evidence of app regressions.
- Corrected no-server config explicitly excludes those two browser files; 131 passed / 20 skipped / exit0. Skipped tests require explicit DB/provider fixtures; they are not claimed passing.
- Matching production subpath build (`NEXT_BASE_PATH=/soandethi pnpm build`): exit0. This is build evidence, not deployment verification.

## In progress

## Actual-provider results so far (not a completed ten-paper result)

- First attempt interrupted after repeated deadlines: eight observed dispatched requests, 43,148 reported tokens across responses with usage; four requests lack usage and may still be charged.
- Second attempt completed extraction+organization for three papers, extracted fourth, then fourth organization exceeded90s: eight dispatched requests, 93,896 reported tokens, one response without usage. Test correctly exited1. No successful full-bank self-review occurred.
- Independent early snapshot review: all27 retained questions from first two papers;22 clean preferred boundaries,3 acceptable ambiguous gatherings,2 minor source boundary/context issues. No wholly omitted printed question. Zero definitely irrelevant full topic paths, one coarse Hình học assignment. Upstream plain-text loss prevents claims of lossless/fully answerable math.
- Frozen gold remains unchanged; reviewer observed its Tương Bình Hiệp C5 prose omits radical notation present in the original PDF (√11,√14). Original PDF takes precedence for evaluation; gold is not assumed infallible.
- Model tool now bounds fetch and body reads independently with the existing abort signal; nine hermetic abort/streaming tests passed. No deadline increase or provider/model replacement.
- Bank calls explicitly use existing fast-effort prompt hint. Quality must still be checked, and hint does not guarantee provider speed.
- To avoid paying again for already completed work, runner can hydrate an exact AI-produced checkpoint into a new empty disposable DB; verifies source HTML/blocks against frozen input and records checkpoint hash. Only processing status/lease reset, no semantic edits. Such a result will be labeled checkpoint continuation, not a clean single-attempt ten-paper success.

- Organizer wire protocol now uses per-call `Q0`, `Q1`, … aliases, mapped strictly back to stable IDs before validation/commit. Unknown/duplicate/original-ID aliases fail atomically; no content or semantic edits. Nine organizer service tests plus thirteen validators pass (22 total).
- Combined no-server suite after alias + abort changes: **139 passed / 20 skipped**, exit0; TypeScript exit0. Eight browser tests remain explicitly outside this no-server run and still require browser regression. No deployment acceptance yet.
- Checkpoint continuation launched from the fourth paper’s exact failed-organization snapshot in a third empty isolated database; it retains three completed AI trees and fourth extracted source without paying to extract them again. The resumed run uses current generic alias/effort prompts and must be reported as a multi-attempt continuation.

- **Correction:** the attempted checkpoint continuation at09:01 actually restarted from root; resume code was absent from the executing runner. Its12 dispatched calls must all be counted. It completed five papers before sixth organization90s timeout. Earlier intended-resume statements are superseded by [the correction](<checkpoint-correction.md>).
- Verified hydration-only run at09:10:33: zero provider calls, six exact sources/99questions/31AI nodes restored, source blocks verified and checkpoint hash recorded. Actual paid continuation at09:10:58 starts with `organize:ngo-gia-tu-hk2-2025-2026`, completed47.44s. No timeout increase, no taxonomy or manual semantic edits.
- Snapshot lineage matters: reviews from08:50 apply only to that attempt, not automatically to changed09:01 outputs. A fresh first-four review of the current lineage is in progress. Fifth/sixth current lineage extraction independently reviewed:29/29 body/grouping passes relative to supplied text; no substantive unused blocks. Fifth20unqualified topic paths plus2specificity caveats; sixth semantic review pending successful organization.

Original actual-provider run `autonomous-pass-2026-11-17T08-40-54-985Z` ran in loopback-only disposable PostgreSQL container `math9-ten-evaluation-db-20261117` / database `math9_ten_2026111701`, not the application database. Semantic judgments, costs, pipeline outcome, tree comparisons, browser regression/deployment and all limitations must be appended after results exist. No ten-paper quality claim yet.
