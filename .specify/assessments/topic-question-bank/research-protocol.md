# Research protocol — bundled Math 9 pilot

- Date: 2026-11-13 (Asia/Bangkok).
- User authorized bundled Math 9 samples and replacement of research report.
- Scope: 25 already segmented questions, stage A=5, then B=20. Source lib/docs-store.tsx:58–96. No private account data; no production mutation.
- Extraction: deterministic local sample function evaluation and split by existing numbered HTML paragraphs. Not AI extraction, not a general parser; trimmed section heading between questions. Original HTML/LaTeX kept in sample-corpus.json. Initial extraction failed before write due to undefined sample constant; fixed constant binding and extracted 5+20.
- Agent test: isolated harness subagent, not app/provider API. Sequential output: save stage1 before reading stage2. Outputs question references, not edited HTML. Prompt constrains root, one parent, no cycles, one assignment each, no required teacher actions. No prebuilt taxonomy. This is a prompted reasoning probe, not a product implementation or performance benchmark. No external URL requests or provider secrets used.
- Structural checks: unique node/question IDs; root count=1; every parent/node reference valid; all nodes reachable from root; cycle absence; exact assignment coverage; old node stability; leaf-to-parent changes and old question moves.
- Independent content expectations recorded before observing agent output:
  - A1/B1: same operation (principal square root); candidate in principle, not certified replacement because A1 points unknown and A lacks supplied key.
  - A2/B2: same domain restriction operation, same qualification for points/key.
  - A3/B3: reject direct equivalent: rational radical expression essay versus numeric radical MC, 2 vs 0.5 points.
  - A4/B7: reject: multi-part length/altitude/area versus one trigonometric ratio, essay vs MC, 2 vs 0.5.
  - A5/B18: reject: proof of perpendicular bisector vs recognition of tangent-radius property, essay vs MC, 3 vs 0.5.
  - B15/B16: related solution sets x=±3 and same MC/points but different explicit operations (squaring vs square-root absolute value); don't accept strict skill-equivalence without criteria. B15 wording 'Số nào' with option '3 và −3' is also imperfect.
- Source-key caveat: bundled key is patterned A/B/C/D; do not treat existence as correctness. Manual review finds B15 supplied key C agrees with solution set, but wording needs review. No full academic validation here.
- Review is internal analyst evaluation, not teacher-required workflow. No independent expert labels, no calibration or measured teacher baseline. No success percentage claimed without denominator.
- No acceptance thresholds agreed; check results descriptive only. One run cannot establish stability, cost or latency for production.
