# Design research

## Decision: Separate bank storage from document library
Rationale: existing whole-library autosave uses optimistic version and pauses on conflict; background mutations must not overwrite editor data. Bank captures explicit client-reviewed snapshot and does not modify document_libraries. References: existing docs-store and migration 0007; read-only integration audit.
Alternatives: reuse document JSONB (rejected: races editor), reuse grading jobs (rejected: grading-specific joins/types).

## Decision: Source-index extraction, never regenerated question HTML
Rationale: browser tokenizes top-level source blocks, server persists exact block strings and raw snapshot; AI selects existing block indices plus context, coverage validated, no free text replacing source. Ambiguity leaves source retained/pending. User approves content, not topics. Keep unselected units in preview source but don't add as retained questions.
Alternatives: AI rewrite (loss risk), fixture required_components (doesn't test inference).

## Decision: Durable state with fenced processing
Rationale: separate account JSONB row with optimistic revision and process lease. Claims/commits use transactions, calls outside locks. Resumable request-driven processing; tab closed leaves pending visible, reopened UI resumes. No promise of autonomous daemon while no browser/request active. Explicit retry after error only, not infinite loop.
Alternatives: untracked after() tasks lose restart recovery; adding Redis queue unnecessary for initial bounded scope.

## Decision: Existing model client and bounded context
Rationale: complete() handles compatible provider; bank passes AbortSignal and JSON schema instructions, rejects invalid output. Include tree, new units and bounded relevant old units; proposals can only move old supplied IDs. Offline mode clearly labeled and cannot falsely claim intelligent classification.
Alternatives: subject lookup taxonomy violates domain neutrality; Harness agents in production unavailable.

## Decision: Isolated preview
Rationale: current sanitizer is minimal and server no-op; don't render untrusted source in app document. Use sandboxed iframe without scripts/same-origin, CSP blocking network/forms/navigation; preserve source separately. Preview copies trusted math styles only if safe and no external fetch. Test javascript/events/external resources.
Alternatives: existing sanitize alone insufficient for retained SVG/HTML.

## Resolved unknowns
Initial inputs existing app HTML/barem. Technical limits defined in plan, rejection explicit; measurements recorded during delivery. Constitution has placeholders only. Account/session/Postgres and deployment conventions reused, no private data inspected or secrets printed.
