# Decision: Bộ mã đề có kiểm chứng

- **Slug**: exam-variant-print
- **Decided**: 2026-11-15
- **Verdict**: go
- **Artifacts reviewed**: intake.md, research.md, problem.md, concept.md

## Scorecard

| Criterion | Rating | Justification |
|---|---|---|
| Problem validity | strong | Direct owner request plus demonstrable unlinked sheet behavior. |
| Evidence strength | adequate | Code and user request establish local problem; external market evidence limited, no general adoption claim. |
| Value vs. inaction | strong | Prevent misgrading and repeated teacher configuration; outcome testable. |
| Feasibility / appetite | adequate | Existing snapshot/rubric/scanner reusable with explicitly bounded parser/recipes. |
| Strategic fit | strong | Central exam-authoring/grading product workflow. |
| Risk posture | adequate | Risks identified; gate release on fail-closed identity tests, immutable outputs, strict supported structure, explicit preview. |

## Verdict & Rationale

GO for concept B, not for arbitrary AI-driven rewriting. Market demand outside this user remains unknown but isn't necessary to establish this local product defect. Two additional research findings shape delivery: existing OMR wrong-session warning must become a rejecting boundary for published sheets; existing sheet regeneration must not mutate published geometry. Mixed-code scanning must resolve QR before choosing session/template, including capture authorization.

## If go — Handoff to `/speckit-specify`

- **Problem**: Teachers need trustworthy multiple exam codes with synchronized printable and grading artifacts without another wizard.
- **Chosen approach**: One editor release flow, deterministic constrained variants, stored immutable output, QR-first recognition.
- **In scope / out of scope**: shuffle supported groups/options; numeric recipe authoring/selection with exact runtime verification; persistent release reopening/reprinting; owner-isolated publish and capture; no blind number replacement, no generic TF/short OMR claim.
- **Success metrics**: preserve full source and rubric, deterministic remapping, unchanged reprints, reject wrong identity before writes, teacher browser flow end-to-end.
- **Carried-forward open questions**: bounded parser UI, practical supported numeric recipes, bundle-scoped mobile flow; resolve in technical plan rather than require user technical choices.
