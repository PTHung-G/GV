# Tasks: Structured question flow

## Phase1 Setup
- [x] T001 Record assessment, spec, plan and audited compatibility constraints in specs/004-structured-question-flow/.
- [x] T002 [P] Collect >=3 original public exams and freeze independent gold in docs/evaluations/math9-topic-tree/ and .data/math9-evaluation/.

## Phase2 Foundation
- [x] T003 Add failing schema/reconciliation/generation tests in e2e/unit/structured-exam.spec.ts; cover duplicate/nested/missing IDs, unknown content, contexts, source fidelity and quotas.
- [x] T004 Implement lib/structured-exam.ts: version1; unique safe IDs; bounded sizes; every body nonempty and disjoint; all dependencies existing; exact top-level anchored coverage; deterministic render/materialize/reconcile.

## Phase3 US1 — native generation MVP
Independent test: generation→safe edit→autosave/reload→bank review with0 extraction requests.
- [x] T005 [US1] Generate structured JSON and validate/materialize IDs in app/api/chat-exam/route.ts and lib/server/chat-exam-types.ts; adapt offline lib/server/model.ts fixture.
- [x] T006 [US1] Persist optional artifact through lib/server/conversations.ts and components/editor/ai-panel.tsx including history reapply.
- [x] T007 [US1] Add optional validated structure to lib/docs-store.tsx and lib/document-library.ts; capture atomic HTML/structure in components/editor/editor-workspace.tsx, preserving current edits and safe append/replace.
- [x] T008 [US1] Add failing native source/idempotency/confirmation storage tests in e2e/unit/question-bank-storage.spec.ts and browser lifecycle tests in e2e/structured-question-flow.spec.ts.
- [x] T009 [US1] Independently validate native sources/direct-review candidates/payload identity in lib/server/question-bank-store.ts and lib/question-bank/types.ts; attempts0, no extraction, stable provenance, immutable confirmation unchanged.
- [x] T010 [US1] Bridge exact live capture in components/question-bank/source-snapshot.ts and save-to-question-bank.tsx; show direct review vs fallback and keep frozen modal source.

## Phase4 US2 — legacy/corrupt structure
Independent test: legacy source still extracts; corrupted native DOM falls back visibly, raw source retained.
- [x] T011 [US2] Add malformed paste, missing anchor, unknown content, template replacement, undo/reload, context and variant parser compatibility coverage in e2e/unit/structured-exam.spec.ts and e2e/structured-question-flow.spec.ts.
- [x] T012 [US2] Validate schema on imports/history, invalidate unsafe structure without losing HTML in lib/document-library.ts, lib/server/conversations.ts and components/editor/editor-workspace.tsx; preserve owner/stale-response guards.
- [x] T013 [US2] Run existing bank/preview/variant/editor unit and browser tests; fix regressions only with evidence in specs/004-structured-question-flow/verification.md.

## Phase5 US3 — real semantic evaluation
Independent test: actual provider outputs reviewed against frozen gold per source question, no gold leaked into prompts.
- [x] T014 [US3] Implement scripts/math9-topic-evaluation.ts using disposable DB and existing save/extract/confirm/organize service; preserve raw outputs/call telemetry and source/gold hashes under docs/evaluations/math9-topic-tree/.
- [x] T015 [US3] Run3 exam inputs, review exact source fidelity/dependencies separately from actual tree paths against independent-gold.md; record initial per-question judgments in docs/evaluations/math9-topic-tree/report.md.
- [x] T016 [US3] Fix demonstrated extraction/topic faults in lib/server/question-bank-ai.ts with regression coverage; rerun and append final results without deleting first-pass evidence in evaluation report.

## Phase6 Release
- [x] T017 Run TypeScript/root build/full regression and real authenticated API tests; record counts/skips in specs/004-structured-question-flow/verification.md.
- [x] T018 Update docs/question-bank.md and deployment guide for native/fallback and additive rollback; review clean-exit Restart policy in deploy/soandethi.service.
- [x] T019 Build subpath/restart existing service3210, run authenticated deployed native source/reload/restart smoke and inspect UI; record gateway limitations and screenshots in specs/004-structured-question-flow/verification.md.

## Follow-up 2026-11-17 — autonomous tree, ten-paper evaluation

User constraint: AI invents every topic and hierarchy; no seeded taxonomy, domain mapping, hand-repaired outputs, or evaluation gold in model inputs. Changes limited to prompts and supporting tools. The prior nineteen tasks remain completed historical release evidence, not acceptance of this follow-up.

- [x] T020 Freeze ten public grade9 papers and independent evaluation-only expectations, document source fidelity and hashes in docs/evaluations/math9-ten-topic-tree/.
- [x] T021 Improve generic self-review prompt and safe merge/reparent/removal tools in lib/server/question-bank-ai.ts; preserve unseen references and native no-extraction flow; add mocked regression coverage.
- [x] T022 Implement isolated actual-provider runner scripts/math9-ten-topic-evaluation.ts with root-only start, per-stage snapshots, complete request audit, budget limits and whole-bank self-review.
- [x] T023 Run ten-paper incremental inference, independently review every question path/boundary/context and ignored source block; compare before/after self-review without output editing.
- [x] T024 Repair only evidenced generic issues, retain failed attempts, run regression/build, deploy and document final limitations/costs/tree.

## Follow-up — bounded AI-owned correction

- [x] T025 Implement max-one coverage correction with mechanical missing/duplicate/unknown-ID feedback; same90s signal, lease/CAS, no deterministic output patching; add163-question regression and stale/timeout tests.
- [x] T026 Replay the frozen rejected163-question proposal in an isolated DB and allow at most one actual-provider corrective request; audit replay vs billable requests separately, retain failed results, verify no source changes.
- [x] T027 Assess actual PDF acquisition/multimodal support and record safe provenance-preserving next increment; do not claim lossy text fixes recover figures.
- [x] T028 Run final regression/build, deploy existing service and authenticated durability smoke; document limitations and actual validation scope.

## Dependencies and Parallel Opportunities
T001→T003→T004→US1/T011. T002 complete independently. After T004, generator/history (T005–6) and bank backend (T008–9) may run independently with separate ownership; editor integration follows shared core. Corpus runner T014 can run alongside editor work, but semantic fixes require actual evidence. All stories required for this user request; US1 is first validated increment, not final delivery.

## Strategy
Tests before feature changes, targeted validation after each slice, preserve first-pass evidence, full regression before production build. No git commits possible without existing HEAD; don't create baseline over unrelated files. Optional context hooks deferred; no mandatory hooks registered in inspected extensions.yml.
