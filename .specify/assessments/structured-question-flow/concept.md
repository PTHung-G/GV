# Concept: retain question structure

- Slug: structured-question-flow
- Created: 2026-11-16
- Recommended: B

## Options
### A — keep HTML and second extraction
- Sketch: no product change; assess only on real downloaded exams.
- Appetite: small (budget, not estimate).
- Trade-offs: lowest regression risk but does not address the redundant-generation complaint.
- Rabbit holes: treating structurally valid trees as semantic accuracy.
### B — structured authoring with safe import fallback
- Sketch: newly generated exams retain individual question boundaries and common dependencies, remain editable, can be reviewed/saved without second AI extraction. Arbitrary imported or structurally damaged content still uses extraction with an explicit explanation. Test both on public grade9 exams.
- Appetite: medium budget; actual scope depends on editor transforms.
- Trade-offs: meets user intent without replacing editor; requires careful handling of structural edits to avoid stale metadata. Accuracy must be measured, not assumed.
- Rabbit holes: rebuilding rich-text editor, arbitrary PDF ingestion, permanent taxonomy standards.
### C — full block editor replacement
- Sketch: all documents become a new block-native editor and every operation explicitly preserves semantic blocks.
- Appetite: large budget, not appropriate for this request.
- Trade-offs: strongest long-term guarantees, excessive UI/data migration risk now.
- Rabbit holes: pagination, math, figures and backward migration rewrite.

## Recommendation
B: remove redundant recognition where boundaries are known, validate against current content and retain safe recovery for unstructured inputs. Scope bounded by regression tests and actual public-exam evidence.

## Out of Scope
Question substitution/equivalence, manual taxonomy tools, automatic answer invention, broad PDF/OCR UI, universal curriculum accuracy claims, wholesale editor rewrite.

## Assumptions to Validate
Known boundaries can survive existing pagination/math transforms without stale-content acceptance; shared contexts and multipart questions are preserved. Real source extraction quality is sufficient for at least3 exams; otherwise disclose exclusions and acquire another source rather than fabricate.
