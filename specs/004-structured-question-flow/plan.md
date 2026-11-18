# Implementation Plan: Structured question flow

**Feature**: 004-structured-question-flow | **Date**: 2026-11-16 | **Spec**: spec.md

## Summary
Introduce a versioned question artifact generated as structured JSON, server-assigned opaque IDs and top-level HTML block anchors. Reconcile current normalized editor HTML against artifact identities before autosave/bank snapshot; do not retain generated HTML copies as authoritative after edits. Server validates exact current ranges and mapping before direct review. Legacy/damaged content retains extraction path. Run real provider against3 downloaded exams, compare frozen independent gold before accepting semantic behavior.

## Technical Context
- TypeScript strict, Next15/React19, Node24, pg/Postgres16, existing parse5 dependency for isomorphic HTML structure validation.
- Existing cookie auth, account document JSON/revision, owner-specific bank JSON/revision/lease; additive JSON fields, no required schema migration.
- Playwright unit/browser/storage/API tests, real provider opt-in corpus runner, production3210 subpath /soandethi.
- Performance: zero extraction model calls for valid structured snapshot. Existing source2Mchars/bank24MB/questions2000/node200 limits remain; model context caps retained. No unbounded DOM polling.

## Constitution Check
Constitution inspected: placeholder/unratified. No invented gates. Operational gates inherited from current product: exact retained source, owner isolation, no fabricated barem, safe preview, bounded valid tree, current-editor capture, backwards compatibility and release003 parser compatibility. Pre-design passed; post-design same constraints satisfied conceptually, tests required before release.

## Design Decisions / Phase0
1. Model output block keys are local references only; server mints authoritative UUID-based IDs and renders one top-level element per block with `data-sdt-block` anchor; preserve top-level p/grid/figure, no whole-question wrappers.
2. Artifact `{version:1,blocks:[{id}],questions:[{id,label,bodyBlockIds,contextBlockIds}]}` describes membership, not a stale HTML mirror. Blocks absent from any body/context are explicit chrome. Validate unique IDs, disjoint bodies, existing dependencies, quotas. Shared contexts explicitly scoped, not all unassigned content auto-attached.
3. Reconcile normalized live HTML with artifact: exact top-level anchored element coverage, reject nested/duplicate/missing/unknown meaningful blocks. Whitespace allowed. Safe edits in anchored units keep IDs; structural changes conservatively fall back. Do not guess newly split questions. Whole append merges artifacts only if existing/incoming reconciliation both valid and ID-disjoint; force insertion at block boundary/end to avoid nested anchors. Replace takes incoming artifact. Imported/template replacement clears artifact. Stale artifact after any arbitrary edit is harmless because every capture revalidates.
4. Source request adds optional native structure. Browser captures exact current blocks; server independently parses source with locations and checks anchors and exact block boundaries, artifact mapping and sizes. Valid → review candidates with stable provenance IDs and new previewVersion, no extraction. Invalid submission rejected; UI sends no structure when reconciliation cannot prove validity and explains fallback.
5. Persist artifact with ExamDoc and conversation `{html,action,structure?}`; validate import/library/conversations optional schema. Duplicate has document-local IDs; append collisions fallback/remap explicitly.
6. No generated per-question answer/rubric implicit mapping. Existing separate answer snapshot binding unchanged.

## Source Layout
- lib/structured-exam.ts: shared schema, generation materialization, render/reconcile/candidate bridge using parse5.
- app/api/chat-exam/route.ts, lib/server/{chat-exam-types,model,conversations}.ts: structured generation and history.
- lib/{docs-store.tsx,document-library.ts}, components/editor/{ai-panel,editor-workspace}.tsx: atomic persistence/reapply/current capture.
- components/question-bank/{source-snapshot,save-to-question-bank}.tsx/ts, lib/server/question-bank-store.ts: direct review bridge and fallback UI.
- e2e structured unit/storage/editor tests; scripts real corpus runner; docs/evaluations/math9-topic-tree evidence.

## Phase1 Contracts/Data
See data-model.md, contracts/structured-exam.md and quickstart.md. No unresolved user clarification. The3-exam source manifest/gold already prepared by independent collector before any model inference; actual text extraction fidelity is explicitly limited (lost math/one chart).

## Dependencies / Sequence
Core schema/tests → generation and history → editor/persistence bridge → source direct-review validation → corpus runner → semantic review/fixes → full regression/deploy. Source ownership of each file stays with one agent; independent collector complete.

## Follow-up: bounded AI-owned correction

One corrective organizer call at most when a parseable, structurally valid proposal fails exact alias coverage. Feedback contains mechanical alias diagnostics only; AI must return a complete replacement proposal. Never merge assignments, synthesize classifications, or seed semantic examples. Same90s AbortSignal and105s lease span both calls; validate fresh revision/lease before correction and CAS before commit. Unknown/malformed/timeout/invalid-graph errors do not create retry loops. No extraction auto-retry.

Regression must include163expected/162returned, second failure preserving original tree, sanitized unknown IDs, duplicate aliases, stale revision/lease, same deadline, native zero-extraction. Actual-provider check replays the exact frozen rejected response and allows one paid corrective request in a new isolated DB; replay is not a newly generated first pass and must be reported separately. No new ten-paper run or quality-score substitution.

PDF acquisition is assessed separately against actual app code before implementation; absent multimodal/OCR support is not papered over by plain-text prompts. No guessed formulas or semantic segmentation supplied by code.

## Release / Recovery
Build/test root first, then build NEXT_BASE_PATH=/soandethi and restart existing service3210 (currently inactive; investigate clean-exit restart policy). Confirm authenticated save/reload/restart. Do not claim public Basic Auth traversal. Existing backup remains private, do not reset app DB. Additive fields allow older HTML fallback; rollback code must not rewrite current documents with unknown metadata removed.
