# Feature Specification: Structured question authoring and real-exam evaluation

**Feature**: 004-structured-question-flow
**Created**: 2026-11-16
**Status**: Ready for planning
**Input**: User approves correcting generation/editor to retain question structure without redundant extraction, then downloading actual public grade9 mathematics exams to test question extraction and semantic topic-tree placement. Assessment: structured-question-flow, decision go.

## User Scenarios & Testing
### US1 — Save newly authored questions without rediscovery (P1)
Teacher generates an exam, edits its contents, and chots selected questions into the private bank without asking AI to identify already-known questions again.
**Independent test**: generate structured exam, apply, edit formula/text, reload and save; candidate preview opens without any extraction model request, exact current content retained.
1. Given valid generated structure, saving source immediately offers known questions for review; teacher selects and confirms, then AI organizes topics.
2. Given edits within known units, current edited text/figures/math, not original generated text, enters immutable snapshot.
3. Given appended/reapplied generation, identities remain unique, shared context references correct, all current content accounted for.
### US2 — Recover safely from unstructured content (P1)
Teacher imports old HTML or structurally damages edited boundaries; saving still retains raw source and clearly explains extraction is needed.
**Independent test**: legacy and duplicate/missing anchor snapshots become pending or reject malformed submitted structures safely without data loss, then existing extraction/review works.
1. Unknown meaningful content, missing/duplicate anchors or unsafe dependencies never silently use stale structured metadata.
2. Modal capture is frozen; later editing/account/doc switch cannot alter/cross-save it.
### US3 — Verify mathematical topic placement with real sources (P1)
User sees reproducible actual public grade9 exam results and genuine semantic errors, not just a valid graph.
**Independent test**: original downloads, provenance, pre-result gold counts/topic expectations, actual model candidates/tree paths and per-question judgments available for >=3 exams.
1. Multipart questions stay whole and shared figures/data remain connected.
2. Equivalent topic labels are accepted by meaning; overly broad, ambiguous/composite and wrong paths are distinguished.
3. First-pass mistakes remain recorded after fixes/retests; no model receives gold expectations as taxonomy instructions.

## Edge Cases
- Truncated/malformed structured generation, unsupported version, extra unsafe markup; model never supplies authoritative IDs or execution directives.
- Duplicate anchors on paste/reapply; deletion of questions or referenced contexts; question split/merge and unknown outside blocks; undo/redo and pagination/math serialization.
- Same operation key with altered structure; overlapping ranges and bodies, dangling dependencies, stale HTML digest, oversized body/context/prompt.
- Source without barem; barem mismatch; owner switch and stale async generation; process restart.
- Real PDF text extraction loses visual formulas or diagrams; retain originals and report/exclude unsupported portions instead of inventing text or figures.
- Existing variant-print parser requires top-level question starts; rendering must stay compatible.

## Functional Requirements
- FR001: Generated exams MUST carry explicit ordered question units and shared-context relationships alongside deterministic printable content; no second AI recognition required for valid known boundaries.
- FR002: Question and block identities MUST be stable and unique independently of displayed numbering, with validated schema version and bounded sizes.
- FR003: Editor MUST preserve identity for safe in-unit edits and recover exact current HTML/formulas/figures through pagination, capture, autosave/reload, append/replace and conversation reapply.
- FR004: Unknown, missing, duplicated, merged or inconsistent structure MUST fail safe with visible fallback; all current substantive source content MUST remain retained, not silently dropped.
- FR005: HTML and structure MUST persist atomically per document version; account isolation and existing conflict protection remain unchanged.
- FR006: Source saving MUST independently validate structured references and exact source correspondence server-side, include structure in idempotency identity and directly create review candidates only when valid.
- FR007: Teacher confirmation, immutable source/question snapshots and subsequent AI topic organization MUST remain distinct. Missing answer/rubric/points MUST remain permitted and not invented.
- FR008: Imported/legacy HTML MUST keep existing extraction/review/retry path and private ownership rules.
- FR009: Shared data/diagrams MUST attach only to relevant known questions; multipart subquestions/options MUST stay with parent. Document chrome may be retained in source without polluting semantic topic text.
- FR010: At least3 real public grade9 math exams MUST be downloaded with attributable URL/year/school where known, hashes and exact originals; fidelity limits and copyright/redistribution uncertainty disclosed.
- FR011: Expected question counts, boundaries and acceptable semantic topic(s) MUST be independently recorded before model results; per-question retention/dependency and actual full tree paths MUST be reviewed separately.
- FR012: Evaluation MUST use actual configured provider and persisted production bank services against synthetic disposable account/database; report model/call counts/timing/retries and both initial/final results, not upload private exams.
- FR013: Existing auth, source bounds, acyclic tree, HTML preview security, question-bank, release/variant and editor behavior MUST pass regression; deploy verified through authenticated application/restart.
- FR014: Tests and UI MUST not claim universally correct taxonomy from a small corpus, or count public gateway401 as deployed authenticated traversal success.

## Key Entities
- Structured exam artifact: versioned ordered content blocks, questions with stable identity/body membership/context dependencies, explicit document chrome.
- Captured structured snapshot: current frozen source with independently verifiable question/block mappings.
- Evaluation case: original public exam and provenance, extraction fidelity notes, independent expectations and observed tree outcomes.

## Success Criteria
- SC001: In all supported generated-exam acceptance scenarios, teachers reach review without a second extraction step or extraction model call.
- SC002: All tested safe edits/reloads retain exact current content and identity; all tested corrupted structures avoid stale fast-path saves.
- SC003: Every evaluated real source question is either retained with exact source dependencies or explicitly reported as a failure/unsupported case; no omission hidden.
- SC004: At least3 real exams receive per-question semantic placement judgments, with correct/too-broad/ambiguous/wrong counts and first-pass/final evidence. All observed actionable placement defects addressed or explicitly left as limitations, never relabeled as success.
- SC005: Existing regression and new owner/security/compatibility scenarios pass; deployed structured save/reload/restart verified and operator recovery documented.

## Assumptions and Scope
- Existing Next/Postgres/private-bank application and configured AI reused. No full editor replacement, public corpus redistribution, new generic OCR UI, question replacement/equivalence or manual taxonomy required.
- Benchmark uses a small selected corpus and AI-agent mathematical review, not independent professional teacher certification.
- Constitution remains an unratified placeholder; no invented principles. Existing release003 is preserved.
