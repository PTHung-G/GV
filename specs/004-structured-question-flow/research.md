# Research decisions

Architecture audit read generation, conversation validation, editor transforms/autosave, document imports, bank snapshots and existing release003 parser. Current generation is HTML, not question JSON. Detailed evidence recorded in ../../.specify/assessments/structured-question-flow/research.md (relative from this file: ../../.specify).

Chosen: explicit block/question artifact, deterministic anchored HTML, live reconciliation and server independent exact-source checks. Reject stale offset-only metadata and whole-question div wrappers (release engine top-level starts). Optional additive JSON metadata avoids destructive migration. Explicit context references avoid unrelated chrome in retained questions.

Alternative full block editor rejected for scope; HTML regex question detection alone still rediscovery and cannot reliably preserve context. A content hash alone detects edits but cannot preserve safe edits.

Public corpus:3 originals and frozen gold from independent collector; see docs/evaluations/math9-topic-tree/source-manifest.json and independent-gold.md. No provider accuracy measured yet. Text extraction loses some math/figures; preserve original and explicitly bound results.
