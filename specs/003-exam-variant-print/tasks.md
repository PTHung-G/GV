# Tasks: Exam variant release

## Phase 1 — Setup
- [x] T001 Complete assessment and interface contracts in specs/003-exam-variant-print/contracts/.
- [ ] T002 Establish shared input/output types and bounded parser dependency in lib/exam-release/types.ts and package.json.

## Phase 2 — Foundation
- [ ] T003 [P] Add immutable release/variant schema and provenance constraints in db/migrations/0010_exam_releases.sql (verify next free number).
- [ ] T004 [P] Add strict structural extraction/identity/group validation in lib/exam-release/engine.ts.

## Phase 3 — US1 publish / reopen
Independent test: editor publishes one code, reload/reprint after source edits stays identical.
- [ ] T005 [US1] Write publication/idempotency/owner/rollback tests in e2e/exam-release-api.spec.ts.
- [ ] T006 [US1] Implement atomic release persistence, live owned source review and idempotency in lib/exam-release/server.ts.
- [ ] T007 [US1] Add preview/publish/list/detail/stored print endpoints in app/api/exam-releases/.
- [ ] T008 [US1] Integrate reviewed publish/reopen/artifact workflow in components/editor/release-dialog.tsx and editor-workspace.tsx.
- [ ] T009 [US1] Freeze published sheet reads and prevent orphan deletion in app/api/grading/sessions/[id]/sheet/route.ts and route.ts.

## Phase 4 — US2 safe variants
Independent test: deterministic remap and preserved groups/math/SVG/points across seeds.
- [ ] T010 [P] [US2] Write engine tests in e2e/exam-release-engine.spec.ts.
- [ ] T011 [US2] Implement deterministic section/group/pin/order permutations and structured option/key remap in lib/exam-release/engine.ts.
- [ ] T012 [US2] Expose group/pin/settings/mapping/warnings preview in components/editor/release-dialog.tsx.

## Phase 5 — US3 QR-first scan
Independent test: two equal-count different-key variants route correctly; wrong QR cannot score or queue fallback.
- [ ] T013 [US3] Write identity, mixed-code, scoped phone and no-bypass tests in e2e/exam-release-api.spec.ts.
- [ ] T014 [US3] Implement opaque v2 identity resolver and release capture grants in lib/exam-release/access.ts and app/api/exam-releases/.
- [ ] T015 [US3] Enforce identity before published submission/OMR/complete/AI and duplicate-student review in lib/grading/submissions.ts and app/api/grading/submissions/[id]/omr/route.ts.
- [ ] T016 [US3] Implement QR-first mixed-release scanner and limited paired phone UI in components/grading/release-scan.tsx and release workspace route.

## Phase 6 — US4 numeric recipes
Independent test: finite-domain exact validity and explicit preview replacement.
- [ ] T017 [P] [US4] Write finite-domain recipe tests in e2e/exam-release-engine.spec.ts.
- [ ] T018 [US4] Implement square-root/linear-equation/rational-addition recipes with proof metadata and exact runtime validation in lib/exam-release/recipes.ts.
- [ ] T019 [US4] Add explicit per-question numeric recipe selection/replacement acknowledgment in components/editor/release-dialog.tsx.

## Phase 7 — Validation / deployment
- [ ] T020 Add end-to-end editor/mobile/reprint browser coverage in e2e/exam-release.spec.ts.
- [ ] T021 Run independent correctness/security review and close findings in specs/003-exam-variant-print/verification.md.
- [ ] T022 Run tsc/build/full Playwright suite, record counts and fixes in specs/003-exam-variant-print/verification.md.
- [ ] T023 Build /soandethi production artifacts, restart existing3210 and verify real URL in specs/003-exam-variant-print/verification.md.
- [ ] T024 Reconcile spec with implementation via converge and close all unfinished requirements in specs/003-exam-variant-print/tasks.md.

## Dependencies and parallel execution

T001→T002; schema and structural foundation then server and engine independent. UI integrates stable contracts after T006/T011. US3 depends on publication identity/schema, US4 engine can run parallel backend publication. T020–024 after all stories. Do not deploy partially finished work; user requested full delivery.

Backend worker owns server/API/schema, engine worker owns types/engine/recipes/pure tests, parent owns UI/scanner integration and system tests. No overlapping edits without coordination. Tests first then implementation; mark completed only with evidence.
