# Follow-up plan — autonomous tree and ten public papers

## User constraint

AI invents every semantic node, hierarchy and assignment. No hand-built taxonomy, source-to-topic mapping, gold hints or manual repair of resulting trees. Root `Kho câu hỏi` is a technical container, not a subject seed. Changes are restricted to prompts and supporting tools.

## Implementation

1. Preserve before-service source hash, old three-paper evidence, and all new failed/successful inference attempts.
2. Improve generic incremental organization/self-review instructions. Allow safe removal/merge of obsolete nodes when full reference validation passes; protect unseen references and their ancestry. Keep exact source/HTML, leasing/CAS, native generation bypass, and mechanical graph validation.
3. Use existing production extraction/save/confirm/organization with ten public papers in a separate loopback-only disposable PostgreSQL container, never app DB. Start root-only. Corpus and independent expected content/boundaries frozen before model calls. No gold enters capture/service request.
4. Retain full public provider messages/replies, usage, statuses, source hashes and each incremental bank snapshot. Hard paid-call budget 21: ten extraction + ten organization + one final self-review; failed runs remain explicit and any repair run is separately documented.
5. Final self-review uses the same production organizer over accumulated questions, not an evaluator supplying correct topics. Record actual selected question count: if context limit prevents whole-bank coverage, do not call it a whole-bank review.
6. Compare before/after self-review trees structurally and independently review every question path, boundary, context and ignored block. Incomplete formula/image capture is a separate input-fidelity failure, not a pass based on topic alone.
7. Regression/type/build and deploy only verified changes. Preserve existing subpath/server and owner data; no replacement web server or uncoordinated root build.

## Evidence and acceptance

- Ten distinct sources with URL, scope, hashes and input-fidelity disclosure.
- No predefined semantic nodes in initial tree or domain-specific examples in organizer prompt.
- Mechanical invariants: complete assignments, valid connected tree, no missing questions, exact content preservation, idempotent confirmation, durable reload, stable untouched sources.
- Semantic counts must be independently reviewed; no target percentage fabricated or relaxed after seeing outputs.
- Full-ancestry topic suitability and useful specificity are scored separately. Ambiguous retained composites remain disclosed.
- Costs/calls and all failures are reported, not only successful final attempt.

## Parallel ownership

Corpus agent owns new raw sources, manifest and frozen independent expectations. Prompt agent owns production organizer and focused tests. Parent owns runner, summaries, integration, evaluation review and deployment. Prior evidence is immutable.

## Runtime note

Goal runtime currently rejects an exact freshly-read ID/revision as stale. Existing goal is blocked at prior round cap; create/edit calls failed. Work is tracked in follow-up tasks T020–T024 and session todo rather than claiming persisted goal activation.
