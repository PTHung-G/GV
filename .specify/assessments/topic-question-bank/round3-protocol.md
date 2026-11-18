# Round 3 protocol — 2026-11-13T22:41:08+07:00

User authorized updating research and synthetic-data tests. Research only: no product changes, private exams or paid application API.

## Predeclared method

Create 16 original synthetic questions spanning mathematics, physics, chemistry, biology, history, language, computing and economics. Include composite questions, common passage, LaTeX, SVG figure and missing answers/points. Synthetic data is a test fixture, not observed demand or representative real exam data.

Two independent Harness agents read only this protocol and corpus. Agent A processes Q01–Q08, commits a first tree, then Q09–Q16 using its existing tree. Agent B reverses those batches. They may inspect the current tree, create branches and move old assignments; no supplied taxonomy. They never inspect the other output. Output snapshots record nodes, assignments and rationale; final retained units reference source IDs and exact component IDs, not paraphrased source text.

Checks: one root; one parent per nonroot; no cycles; all question IDs assigned exactly once; no missing/extra IDs; old questions retained after increment; no teacher taxonomy actions; each retained unit resolves every declared required component, including common passage, figure and subparts; missing answer/points remain null. Compare co-clustering across final trees, report differences, not exact label equality or ground-truth accuracy. Parent/root assignments are allowed.

Preservation probe: materialize each retained unit from exact source components and compare payload/hash to the declared required source bundle. This checks reference completeness and deterministic assembly, NOT AI extraction, production storage, visual rendering or semantic correctness of source-to-component segmentation (the corpus is pre-segmented). Do not claim otherwise.

Report every failure, AI rationale and sample limitations. No human expert gold. No time/cost production benchmark from Harness duration. Evidence cannot establish all-domain quality, actual privacy or implementation readiness by itself.
