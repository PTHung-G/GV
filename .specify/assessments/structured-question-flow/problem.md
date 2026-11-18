# Problem Definition: preserve question identity

- Slug: structured-question-flow
- Created: 2026-11-16
- Inputs: intake.md, research.md, direct user request.

## Problem Statement
Teachers currently wait for a second model pass to rediscover questions that were just authored, because the application discards individual question structure. Without independently checked real-exam evidence, a technically valid topic tree can still put math questions into the wrong subject branches.

## Affected Users & Stakeholders
- Users: teacher creating/editing exams and retaining reusable questions privately.
- Stakeholder: requesting user, deciding acceptance of no-redundant-extraction and semantic evidence.

## Goals
- Preserve current edited question content and identity through generation, editing, reload and snapshot.
- Remove unnecessary extraction calls when question boundaries/dependencies remain known.
- Retain dependable import support for existing unstructured sources.
- Measure real public grade9 math extraction fidelity and semantic placement, report errors and repair demonstrated faults.

## Non-Goals
- Question replacement/equivalence, manual taxonomy administration, public redistribution corpus, general-purpose scanned-PDF importer, claimed curriculum-wide or expert-certified accuracy.

## Success Metrics
- Structured generated exams reach review with zero extraction model calls; confirm then organization still runs.
- Current edit content exact and survives reload; stable identities and shared-context links preserved for supported editing. Damaged structure never silently accepted as trusted.
- All legacy import/extraction, auth, immutable snapshots and tree regression tests remain green.
- At least3 attributable real public grade9 exams, independently reasoned question counts/topic expectations recorded before model result; per-question exact retention and actual tree path evaluated with composite/ambiguous cases disclosed. Target all evaluated items acceptable after fixes; report first-pass and final outcomes honestly, do not force taxonomy labels or conceal errors.
- Release build and authenticated deployed smoke pass; current public gateway limits disclosed.

## Cost of Inaction
Repeated extraction calls continue and can introduce unnecessary mistakes; synthetic-only evidence remains insufficient to answer the user's semantic correctness question.

## Open Questions
- Implementation details to resolve in architecture audit (not user blockers): retain structure across append/reapply/free edits and validate safely server-side.
- Corpus format/diagram fidelity subject to downloaded originals; evaluation must mark missing or uncertain content explicitly.
