# Bug Assessment: semantic topic drift and self-review anchoring

- **Slug**: topic-semantic-drift (user selected suggested name)
- **Created**: 2026-11-17
- **Source**: pasted text, “check xem lỗi từ đâu ra”, following actual tree discussion
- **Verdict**: valid
- **Severity**: medium — incorrect topic retrieval; no source loss or cross-owner access demonstrated.

## Symptom

A clockwise90-degree rotation of inscribed-square vertices is assigned to circle symmetry. Cross-cutting application/technique branches and a bundled triangle/circle branch also remain in the AI-generated hierarchy. These latter structures are quality concerns, not proof every assigned question is wrong.

## Reproduction and observed evidence

Read-only tracing of frozen corpus, actual provider requests/replies and final snapshots; no new provider calls or application changes.

1. Starting tree for first paper is root-only. Actual first organizer response in [09:01 telemetry](</home/dsh/trangchugiaovien/docs/evaluations/math9-ten-topic-tree/repair-pass-2026-11-17T09-01-11-757Z/telemetry.json>) creates `doi_xung_duong_tron`, `tam_giac_vuong_duong_tron`, `toan_thuc_te`. These are AI outputs, not seeded framework nodes.
2. Trần Phú Phần I Câu6 source blocks25/26 explicitly contain “Cho hình vuông ABCD nội tiếp đường tròn ( O ) … Phép quay thuận chiều” and “90o tâm O biến các điểm A, B, C , D…”. Block31 contains all four answer choices. Context27–30 is blank because the figure did not survive text acquisition. The geometry image is missing, but the tested operation is explicitly readable; missing image does not account for classifying rotation as circle symmetry.
3. [09:10 telemetry](</home/dsh/trangchugiaovien/docs/evaluations/math9-ten-topic-tree/repair-pass-2026-11-17T09-10-58-522Z/telemetry.json>), `organize:tran-phu-hk2-2025-2026`: inputQ5 has currentTopic=root and full above content. Raw AI response itself assignsQ5→doi_xung_duong_tron. Final stored question has same topic. Wrong classification predates alias reverse mapping/storage.
4. Historical full self-review supplies same question asQ89 with currentTopic=doi_xung_duong_tron; raw response preserves that topic (this whole proposal was rejected for separate missingQ162).
5. [fresh live09:54 telemetry](</home/dsh/trangchugiaovien/docs/evaluations/math9-ten-topic-tree/repair-pass-2026-11-17T09-54-13-139Z/telemetry.json>): both initial and corrective responses again assignQ89 to that node. Correction restores coverage, not semantic truth. Accepted45-node tree and all paths unchanged.

## Suspected Code Paths

- [questionHtml:111–121](</home/dsh/trangchugiaovien/lib/question-bank/validation.ts#L111-L121>) assembles exact sorted source blocks; no semantic substitution.
- [organizer context/prompt:84–91](</home/dsh/trangchugiaovien/lib/server/question-bank-ai.ts#L84-L91>) supplies existing tree/currentTopic and asks same model for full self-review. Prompt already says relatedness is not containment and permits new nodes, but has no auditable task-focus/evidence contract.
- [alias map:93–112](</home/dsh/trangchugiaovien/lib/server/question-bank-ai.ts#L93-L112>) maps raw returned alias; this trace matches, not the source of the wrong topic.
- [coverage checker:26–53](</home/dsh/trangchugiaovien/lib/server/question-bank-ai.ts#L26-L53>) checks shape/coverage/references, not mathematics.
- [validateTree:125–167](</home/dsh/trangchugiaovien/lib/question-bank/validation.ts#L125-L167>) enforces topology/counts/labels/references, not semantic inclusion.
- [commit:114–121](</home/dsh/trangchugiaovien/lib/server/question-bank-ai.ts#L114-L121>) correctly persists returned topic after mechanical validation. `complete` means mechanically complete, not independently approved semantic accuracy.
- [context selection:138–143](</home/dsh/trangchugiaovien/lib/server/question-bank-ai.ts#L138-L143>) caps200; not causal here because all163 questions were supplied. No evidence deadline/context truncation caused this classification.

## Root Cause Hypothesis

**High confidence at observable boundary:** organizer model makes wrong semantic assignment despite explicit task text; code accepts structurally valid classifications without semantic verification. Not an alias, persistence or seeded-taxonomy defect.

**Medium confidence for mechanism:** pre-existing circle-symmetry branch/currentTopic plus generic reuse/stability instructions anchor the model to existing categories; it likely uses incidental “inscribed circle” context rather than the asked transformation. Same model rereading its own tree is not independent verification. This is inferred from unchanged outputs, not a claim about hidden model reasoning. Fast hint, long context, model capability and absent image may influence quality, but no controlled ablation demonstrates their causal contribution.

Mixed-axis/bundled branches originated in first AI output, then survive incremental review. Single-parent tree lacks explicit distinction between knowledge topic and application-context tags, and node labels have no model-generated scope/exclusion description. No fixed taxonomy should be added to solve this.

## Proposed Remediation

**Preferred**: generic AI-owned semantic evidence before assignment: have AI identify the task/operation actually requested separately from contextual objects; compare that against full path scopes, with freedom to reject currentTopic/create a different node or use a genuinely encompassing parent. Do not embed the observed rotation→topic correction, curriculum hierarchy or gold in production prompts. Add AI-generated short node scope definitions/assignment evidence only if bounded and validated; do not expose hidden chain-of-thought or demand long reasoning.

Then test optional bounded independent critique on suspect assignments without supplying currentTopic initially; measure quality and latency in isolation before integration. Blind task inference can reduce anchoring but requires real evaluation, not a guarantee. Distinguish semantic-review state from mechanically complete status in docs/UI if useful. Keep coverage retry separate; it must not pretend to fix meaning.

**Tests to add/update**:
- Mechanical tests ensure any new evidence/schema remains bounded and IDs/CAS unchanged; no taxonomy or assignment rule in code.
- Opt-in real-provider evaluation on frozen bad placements AND fresh unseen counterexamples, with independent gold excluded from prompts. Compare first outputs, all changed full paths, and task/context distinction; no manual tree repairs.
- Retain existing timeout/coverage/native-flow regressions. Budget separate semantic critique explicitly; do not silently increase90s or paid calls.

**Likely files**: organizer prompt/schema and its tests; evaluation-only runner/report. PDF acquisition requires separate work and cannot alone fix this explicit-text semantic error.

## Risks & Considerations

More prompt prose may not change behavior; all prior observed self-reviews preserve this mistake. Additional critique has latency/cost tradeoffs. Evidence fields can be post-hoc rationalizations; independent review remains necessary. Preserve sources, owner isolation, coverage and atomic commit. Do not manually seed correct hierarchy/rotation classification. Current assessment changes no source or production state.

## Open Questions

Whether unanchored task inference or scope-aware critique improves error rate within latency/cost budget requires a controlled actual-provider test. Missing diagrams still limit answerability independently of classification.

## Hook checks

Inspected extensions config: only after_specify/after_plan optional hooks; no before_bug_assess/after_bug_assess hooks registered. No hooks executed.
