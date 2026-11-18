# Fix report — exam-grading-sync

## Metadata
- Slug: `exam-grading-sync`
- Date: 2026-11-12 (Asia/Bangkok)
- Assessment: [assessment.md](<assessment.md>) — preserved unchanged.
- Status: **partial** — major safety and synchronization fixes implemented and locally verified; database rollout and several secondary remediation items remain.
- No `before_bug_fix` / `after_bug_fix` hooks configured in [extensions.yml](<../../extensions.yml>).

## Summary
Implemented session lifecycle guards, revision-fenced workers, complete-data confirmation, explicit finalization exceptions and audited reopening; repaired editor/key/rubric round-trip and stale async results; added account-owned optimistic document persistence with explicit legacy import; linked library to grading and exposed immutable source snapshots. Historical grades are never silently updated when the original exam changes.

## Changes
| Area | Implementation |
| --- | --- |
| A1–A4, A10–A11, C5 | [HTML parser](<../../../lib/grading/answer-key-html.ts>), [shared renderer](<../../../lib/grading/answer-key-render.ts>), [rubric contract](<../../../lib/grading/rubric.ts>), [source fingerprint](<../../../lib/exam-revision.ts>), [editor](<../../../components/editor/editor-workspace.tsx>), [wizard](<../../../components/grading/new-session-wizard.tsx>), [answer-key API](<../../../app/api/exam-answer-key/route.ts>): horizontal MC and multi-step essay import; no guessed points; expected total and review required; stale source/results rejected; authenticated AI endpoint, explicit overlength/empty/coverage errors. |
| A6–A9, A12 | [Lifecycle helpers](<../../../lib/grading/lifecycle.ts>), [submission data](<../../../lib/grading/submissions.ts>), [grading worker](<../../../lib/grading/grade.ts>), [scores](<../../../lib/grading/scores.ts>), [jobs](<../../../lib/server/jobs.ts>) and grading API routes: session-first locks, input/section revisions, lease tokens, atomic enqueue, confirmation completeness, failure states, transactional finalization and audited reopen. |
| A5 / persistence | [Document API](<../../../app/api/documents/route.ts>), [provider](<../../../lib/docs-store.tsx>), [aggregate helpers](<../../../lib/document-library.ts>): authenticated owner scope, optimistic conflict refusal, account-scoped browser backups, explicit legacy import, no automatic assignment of shared-browser documents, pair-aware copy/delete. |
| Library and preview | [Library](<../../../components/my-exams.tsx>): source/key status, paired deletion confirmation, grading link and small-screen detail overlay. [Community detail](<../../../components/exams/exam-detail.tsx>): explicit preview-only copy and print labels; preview excluded from grading until teacher confirms completeness in editor. |
| Frozen source and refresh | [Session access](<../../../lib/grading/sessions.ts>), [client contract](<../../../lib/grading-client.ts>), [settings](<../../../components/grading/settings-tab.tsx>): view frozen exam/key in sandboxed frames; link to current source with warning; applicable section totals only; separate destructive area. [Events](<../../../app/api/grading/sessions/[id]/events/route.ts>), [workspace](<../../../components/grading/workspace.tsx>), [essay review](<../../../components/grading/essay-tab.tsx>): refresh on revisions and all changed progress events. |
| Classes / lifecycle UI | Wizard reuses saved classes by explicit owner-checked classId, disables misleading replacement-roster input. [Scores UI](<../../../components/grading/scores-tab.tsx>) asks reason for exception/reopen; exception action appears only for outstanding-submission errors. |
| Schema | [0006](<../../../db/migrations/0006_grading_integrity.sql>) adds input/section revision and job lease fences, legacy normalization, audit preservation. [0007](<../../../db/migrations/0007_document_libraries.sql>) adds account document libraries. **Neither migration applied in this task.** |

## Tests Added / Updated
- [Answer-key HTML](<../../../e2e/unit/answer-key-html.spec.ts>) and [contract round-trip](<../../../e2e/unit/answer-key-contract.spec.ts>): actual editor output, integer/comma points, essay steps, duplicate criteria, no silent splitting.
- [Grading integrity](<../../../e2e/unit/grading-integrity.spec.ts>) and [scores](<../../../e2e/unit/scores.spec.ts>): missing versus explicit blank/zero, confirm prerequisites, inactive-session locks, stale worker/lease rejection, revision job keys, four-page limit.
- [Document aggregate](<../../../e2e/unit/document-library.spec.ts>): pair-aware copy/delete, idempotent legacy merge, validation.
- [Document browser sync](<../../../e2e/unit/document-sync.spec.ts>): server library load, no silent legacy ownership, conflict error and retained dirty backup.
- [Wizard browser contract](<../../../e2e/unit/wizard-contract.spec.ts>): source changes discard late AI, explicit totals/review, valid/invalid preselection.

## Local Verification
- Focused parser/contract/document/integrity/scores suite: **31 passed**. Document validation subset rerun after hardening structured answer-key metadata: **4 passed**; rejects malformed question/step arrays, invalid source hashes and unknown completeness states. TypeScript passed again. Production build predates this additional validation hardening.
- Browser persistence and wizard suite: **6 distinct tests passed** (five initial tests plus the added unresolved-backup reload regression). Document persistence subset rerun: **3 passed**. Added defensive rejection of null/non-object document PUT bodies; final TypeScript and whitespace checks passed after this guard. Production build predates this small API guard.
- Final integrated `pnpm exec next build`: **passed**, including type validation, metadata correction, source-history links and preview-completeness confirmation.
- Latest production build passed after API metadata validation and both legacy/account-cache hardening. Corrupted browser recovery JSON no longer blocks the authoritative server library. Browser persistence subset: **5 passed**, bringing distinct focused/browser cases to **39** (31 focused + 8 browser cases). Legacy bytes remain untouched; invalid account backup shows a warning and may be replaced by a clean server cache. This supersedes earlier build-timing caveats above.
- `git diff --check`: **passed**, but repository files are broadly untracked, so this is not a complete baseline diff audit.
- Earlier intermediate TypeScript failures in backend changes were corrected before final checks.
- Browser tests emitted `column j.input_revision does not exist` from the existing worker against the unmigrated database. This is a rollout prerequisite, **not** a successful database integration test.
- Added and executed [isolated PostgreSQL smoke check](<../../../scripts/check-exam-sync-db.py>): all seven migrations applied successfully on a fresh PostgreSQL 16 container; migrations 0006/0007 reapplied successfully; two concurrent conditional library updates produced exactly one winner; revision/lease columns and audit SET NULL constraints verified. Additional real-row checks passed: editing the library leaves frozen exam HTML unchanged; deleting a session preserves its snapshot and audit reason while nulling deleted session/submission references. The script now verifies image, network isolation, tmpfs storage and absence of bind mounts before any write. Container had no network and tmpfs-only data and was stopped after checking its exact name/image. Existing application databases were untouched.
- Session-first PostgreSQL lock protocol smoke check also passed with concurrent transactions and a subsequent locked read observing `finalized`. This is a SQL-level check only, not proof of application worker/finalize race handling.
- Added opt-in [real PostgreSQL lifecycle test](<../../../e2e/unit/grading-postgres.spec.ts>): **1 passed** on an empty disposable PostgreSQL 16 database. Executes actual TypeScript `lockSession`, `queueSection`, and `checkWorkerFence`: duplicate enqueue yields one job; valid fence accepted; stale input/section revision and wrong lease rejected; a fence waiting behind finalization rejects with `session_locked`. TypeScript passed. Container exposed only to loopback and was stopped after verification. Total distinct tests verified: **40**. Full HTTP/AI worker execution remains untested.
- Remaining tests use pure/mocked contracts and intercepted browser API responses. No application-DB migration, production grading mutation, real AI call, real worker/finalize concurrency test, or deployed-site verification performed. No replacement product server was started manually; browser tests used the configured temporary test server.

## Deviations from Assessment
- More than four images are explicitly rejected with an actionable message; batching/all-page AI support is not implemented. No silent truncation.
- Fingerprint is deterministic synchronization metadata, not a cryptographic integrity signature.
- Single-answer A–D contract retained; multi-code/true-false/short-answer expansion deferred.
- Grading edits remain per-session. They do not publish back to the source exam.
- Snapshot/rubric retention is deliberate; no unsafe garbage collection without retention policy. Audit history survives deletion after migration.
- Full relational document normalization deferred: libraries are owner-scoped versioned JSON collections with size limits.
- Saved-class reuse implemented; roster remains live and is clearly labeled, not falsely presented as a frozen roster.

## Deployment — 2026-11-12
User explicitly authorized deployment. Backed up application PostgreSQL with custom-format pg_dump under the private `.data/backups` directory. Stopped the old product process before migration; applied 0006 and 0007 through the migration runner; status reports no pending migrations. Rebuilt with NEXT_BASE_PATH=/soandethi and restarted the existing port 3210 under managed job bash-cc6f4786744b437c. Worker started successfully; no missing-column error appeared in collected startup/smoke logs. Browser smoke against the deployed upstream: hub, library and new-grading routes returned 200, no page errors; unauthenticated document API returned 401. External URL still returns the expected existing Basic Auth 401, so authenticated external end-to-end verification is not claimed. No proxy/auth configuration changed. This supersedes earlier statements that migrations/deployment had not been performed; overall assessment status remains partial because deferred product scope and full live grading verification remain.

## Follow-ups
1. **Deployment gate:** back up database; stop old workers; apply migrations 0006 then 0007 using the repository migration procedure; deploy matching backend/frontend; restart workers. Do not overlap old/new worker versions. Verify real DB API flows and concurrency before production grading.
2. Run `/speckit-bug-test slug=exam-grading-sync`, including two-account/two-device isolation, concurrent PUT revision conflicts, page-add→complete/regrade, worker/finalize races, export/statistics consistency, forced exceptions/reopen audit, mobile widths 375/768/1024.
3. Decide class year/subject uniqueness and implement frozen roster semantics before changing existing class identity. Current same-name class reuse remains legacy-compatible.
4. Source-exam → prior grading sessions and subject/grade correction are now implemented in library details. Further terminology cleanup remains optional.
5. Decide retention/GC, explicit publish-back, per-account AI quota and all-page batching policies. AI coverage checks recognize conventional `Câu N` labels only; teacher review remains mandatory.
6. Add HTTP/real isolated PostgreSQL integration tests for document revision races and lifecycle commits. Browser tests are not evidence of PostgreSQL transaction correctness.
7. Final production artifacts have been rebuilt. Verify the intended deployed URL after controlled database/backend rollout; no live deployment claimed here.
