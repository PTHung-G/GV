# Round 2 — protocol before results

Date: 2026-11-13T11:26:16+07:00. Scope: existing 25 bundled Math 9 questions only. No application API or private data, no source modifications.

User confirmed: explicit finalize plus approval of retained content; later document edits do not silently overwrite retained questions, updating requires renewed confirmation. Research remains Math 9 samples, not release scope. Development team proposes criteria; numerical acceptance limits remain unapproved.

Two independent Harness subagents receive corpus only, not old assignments or old six-pair results. Retrieval agent returns at most three candidates per source question (25 sources, excludes self), with fit/conditional/reject reasoning; no prescribed pairs, no topic-tree restriction. Separate reference agent evaluates all 300 unordered pairs from content and records plausible pairs and abstention reasons, without seeing retrieval output. This is independent agent review, NOT independent human expert gold data; same-family model errors may correlate.

Criteria: compare skill/task, response form, known points, dependencies, answer availability and visible defects. Unknown points remain unknown. Same topic or same numerical answer insufficient. Distinguish pedagogical candidate from verified complete replacement. Do not invent answers, repair corpus, or generate new questions. Record zero suitable candidates honestly.

Comparison: exact source coverage and valid IDs, candidate overlap with reference plausible pairs, disagreements and reasons, count strict safe replacements versus conditional suggestions. Do not publish accuracy/recall against this agent reference as academic ground truth. No latency/cost benchmark, no production extraction/replacement, no stability claim from retrieval results. This round narrows candidate-availability evidence, not all blockers.
