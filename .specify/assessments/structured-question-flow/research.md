# Idea Research: structured question flow

- Slug: structured-question-flow
- Created: 2026-11-16
- Evidence confidence overall: high for current software behavior; semantic classification accuracy not measured yet.

## Users & Demand
- Teacher/user explicitly challenges redundant extraction and requests real internet grade9 math tests — direct conversation, cited intake.md (high).

## Prior Art
- Existing generator streams HTML, counted by `<b>Câu` regex, then returns JSON envelope; `ExamPayload.content` is a string, no question array — app/api/chat-exam/route.ts:29–94,145–193 and lib/server/chat-exam-types.ts:8–14 (high).
- Current source save captures current editor surface, canonicalizes exact blocks, immutable raw source then starts pending extraction — components/question-bank/save-to-question-bank.tsx:79–95; lib/server/question-bank-store.ts:34–50 (high).
- Existing candidate validator uses source block IDs, rejects invented HTML, disjoint bodies and exact ranges; carries unallocated material as shared context — lib/question-bank/validation.ts:43–106 (high).
- Current editor paginates/splits text, paints math, and accepts free-form contenteditable HTML. Structural identity must survive those transforms or be explicitly marked untrustworthy — components/editor/editor-workspace.tsx:88–160 and lib/editor-model.ts:111–125 (high).

## Market & Context
- No market/commercial claims required: direct user-requested correction of current pipeline. Cost in model latency/tokens of second extraction exists by code path, but no timing baseline measured here (high code evidence; quantitative unknown).

## Data & Constraints
- Existing ownership, source limits, exact ranges, bounded acyclic tree, teacher confirmation and missing-barem support remain requirements, see specs/002-topic-question-bank/spec.md (high).
- Public corpus collection and independently reasoned gold labels delegated; sources and extraction fidelity will be reported separately. No public-page accuracy inferred from synthetic smoke (high methodological constraint).

## Evidence Against the Idea
- New JSON alone cannot guarantee current editor matches generated structure; stale metadata would silently save wrong/old content. Free edits, paste, splits, merges and duplicate IDs need validation/invalidation and fallback — editor behavior cited above (high).
- Broader schema may increase output size and truncation risk; current maxTokens3000 is insufficient for some longer structured exams (ASSUMPTION to test; medium).
- Small selected public grade9 corpus cannot establish subject-general tree accuracy; no expert teacher review is available (high limitation).

## Gaps & Open Questions
- Architecture audit pending for append/reapply/document persistence and server validation. To resolve before spec.
- Real public PDFs may be scanned or diagrams absent from text; retain originals and exclude unsupported evidence rather than invent figures.

## Sources
- Direct user conversation and internal code cited above, no external fetch in this assessment.
- External benchmark source manifest will be linked after research agent completion; source attribution does not imply redistribution license.
