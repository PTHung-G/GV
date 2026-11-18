# Tasks: Kho câu hỏi riêng tự tổ chức

**Input**: [plan](plan.md), [spec](spec.md), design/contracts. Tests explicitly required for release.

## Phase 1: Setup
- [x] T001 Inspect live deployment/test conventions without secrets and record constraints in specs/002-topic-question-bank/verification.md
- [x] T002 Create shared types/limits in lib/question-bank/types.ts (2 MB source, 2,000 questions, 200 topics/snapshots; labels <=100 characters; depth <=12)

## Phase 2: Foundation
- [x] T003 Write pure source/tree/idempotency tests first in e2e/unit/question-bank.spec.ts; run red before implementation
- [x] T004 Implement exact source block/range validation and tree invariants in lib/question-bank/validation.ts
- [x] T005 [P] Add additive owner-FK revision/state migration db/migrations/0012_question_banks.sql and owner-scoped transactional store lib/server/question-bank-store.ts
- [x] T006 Add authenticated same-origin/no-store/error wrapper app/api/question-bank/route.ts; server-derived owner only

## Phase 3: US1 - Keep content (P1 MVP)
Goal: immutable source, content review/confirm, missing metadata allowed.
Independent test: shared passage/figure/multipart/formula survive save+reload; old version unchanged.
- [x] T007 [US1] Write source save/confirm/idempotency/version and raw dependencies tests e2e/unit/question-bank-storage.spec.ts
- [x] T008 [US1] Implement source capture/operationKey hash conflict and immutable snapshots lib/server/question-bank-store.ts
- [x] T009 [US1] Implement AI source-index extraction validation lib/server/question-bank-ai.ts; answer/rubric/points null unless explicit matched source, no generated HTML
- [x] T010 [US1] Add source/process/confirm endpoints under app/api/question-bank/ (per contracts/question-bank.md)
- [x] T011 [US1] Build isolated safe HTML preview and selectable content confirmation components/question-bank/source-review.tsx
- [x] T012 [US1] Add current-surface chốt/lưu action components/editor/editor-workspace.tsx; do not mutate source library from worker

## Phase 4: US3 - Privacy/recovery (P1)
Goal: ownership and durable true statuses, not taxonomy labor.
Independent test: two owners/guest, failure/restart/race, no lost snapshot or duplicate.
- [x] T013 [US3] Write guest/foreign/race/stale lease/provider error tests e2e/unit/question-bank-storage.spec.ts and e2e/question-bank.spec.ts
- [x] T014 [US3] Implement owner lease/revision fences/90-second budget/explicit bounded retry in lib/server/question-bank-store.ts and lib/server/question-bank-ai.ts
- [x] T015 [US3] Add body limits/owner admission/error sanitization to app/api/question-bank/ routes; no raw provider errors
- [x] T016 [US3] Add reload/pending resume/account-switch cancellation and error retry components/question-bank/bank-workspace.tsx

## Phase 5: US2 - Tree/browse (P2)
Goal: automatic context-aware tree, one position per question, find content.
Independent test: two batches and deterministic old-question relocation, parent/root composites, no cycle.
- [x] T017 [US2] Write incremental tree/move/context-selection/cycle rejection tests e2e/unit/question-bank.spec.ts
- [x] T018 [US2] Implement bounded existing-tree/related-old-question AI proposals and validated atomic apply lib/server/question-bank-ai.ts
- [x] T019 [US2] Build tree/self+descendant filter/text search/provenance/previews components/question-bank/bank-workspace.tsx and app/question-bank/page.tsx
- [x] T020 [US2] Add bank navigation in app/my-exams/page.tsx and editor action; no replace/manual taxonomy controls

## Phase 6: Polish/release
- [x] T021 Run safe-preview malicious HTML/SVG/network and browser primary flows e2e/question-bank.spec.ts; fix uncovered issues
- [x] T022 Benchmark 200 synthetic questions, real configured provider synthetic-only smoke and record latency/limits in specs/002-topic-question-bank/verification.md
- [x] T023 Run tsc/build/full Playwright regression, converge artifacts against implementation; record evidence specs/002-topic-question-bank/verification.md
- [x] T024 Update docs/question-bank.md and deploy/soandethi-subpath.md with limits/recovery; additive migration then controlled existing production restart, authenticated base-path/deployed asset smoke, record rollback/evidence in specs/002-topic-question-bank/verification.md

## Dependencies & execution
T001→T002; T003 precedes T004; T005 parallel with T004 once types known; T006 after store. US1 after foundation; US3 shares store and follows source service; US2 after confirmed units. No simultaneous edits to store/UI by multiple agents. UI isolated preview and pure tests may be delegated once contract fixed.

Parallel examples: US1 source preview (T011) alongside backend extraction (T009), separate files. US3 browser auth tests alongside frontend cancellation, separate files. US2 pure tree tests alongside UI tree, after shared types defined.

## Implementation strategy
Deliver US1 working slice, independently test. Then privacy/recovery acceptance before full AI organization. Then tree browse/incremental tests. Finally full regression/provider/production verification. No claim complete based on mocked AI alone. Mark task done only after files/test evidence. Source retention remains available when AI unavailable; no false classification success.

## Phase 7: Convergence
- [x] T025 [US3] Align same-origin validation with forwarded/public Host deployment in lib/server/question-bank-http.ts; malformed Origin must return403 not500. Verify via synthetic authenticated subpath HTTP mutation (FR006/FR015).
- [x] T026 [US1] Add independent end-to-end >=10-question source retention test using raw fixture batches and configured provider; exact body/shared figure/formula after confirmation+reload, record evidence in specs/002-topic-question-bank/verification.md (SC001/SC005). Existing pure and mocked tests do not satisfy real configured-provider delivery check.
- [x] T027 [US3] Add HTTP-level two-owner/guest resource routes and owner-change body tests under e2e/question-bank-api.spec.ts; store tests alone don't verify authentication/cookie/route boundary (SC004).
