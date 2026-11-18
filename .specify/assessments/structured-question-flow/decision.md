# Decision: structured question flow

- Slug: structured-question-flow
- Decided: 2026-11-16
- Verdict: go
- Artifacts reviewed: intake.md, research.md, problem.md, concept.md (created and reviewed this session).

## Scorecard
| Criterion | Rating | Justification |
|---|---|---|
| Problem validity | strong | User explicitly challenges redundant extraction; current HTML-only generator proves cause. |
| Evidence strength | adequate | Current code paths inspected, no semantic accuracy baseline yet; measuring it is part of request not a preclaimed benefit. |
| Value vs. inaction | strong | Removes avoidable model step where structure survives and adds real evidence. |
| Feasibility / appetite | adequate | Bounded retained structure with validated fallback avoids editor rewrite. Audit details required before code changes. |
| Strategic fit | adequate | Extends existing private-bank purpose. Constitution is unratified placeholder; no principles invented. |
| Risk posture | adequate | Stale edits, shared data, malformed JSON, unsupported PDFs and biased gold are explicit validation risks. |

## Verdict & Rationale
Proceed to specification with concept B. This is authorization to build/test, not a claim that existing tree classification is correct. Keep exact current content and safe fallback as release gates. Independently prepared gold precedes output evaluation; disclose first-pass mistakes and final fixes.

## Handoff
- Problem: individual questions are lost before snapshot; semantic tree correctness lacks real source evidence.
- Chosen approach: structured authoring through editor, direct question review/save with no extraction call when valid, safe legacy/import fallback.
- In scope: generation schema/validation, editor identity through current transforms, persistence, bank bridge, regression, public grade9 corpus extraction/classification evaluation, fixes and deploy.
- Out: replacement/equivalence, manual taxonomy, answer invention, broad scanned importer/editor rewrite, expert accuracy guarantees.
- Success: no extraction for valid generated structures, exact current content after edits/reload, malformed structure never silently trusted, legacy compatibility, >=3 real public exams with provenance and per-question semantic results; green regression and deployed smoke.
- Open technical questions: exact append/reapply and structural-edit rules resolved in plan; diagram source fidelity in corpus manifest. No user-facing blocker.
