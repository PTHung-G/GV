# Ten-paper evaluation: current-lineage extraction findings

Current retained lineage: first six source extractions from09:01 run, then exact checkpoint continuation09:10:58. Earlier08:50 reviews are separate model outputs and are excluded from these counts.

All **163 retained candidates** across ten sources independently inspected:

| Scope | Retained | Question-body/boundary passes | Other findings |
|---|---:|---:|---|
| First four |70|61 strict passes|6 context failures (2 contamination +4 missing true/false mode);3 ambiguous grouping units|
| Fifth/sixth |29|29|No substantive unused blocks; upstream loss remains|
| Last four |64|64 body/grouping passes|8 unused blocks contain section-response/score instructions, separately flagged; not a blanket context pass|

No wholly omitted printed question or spurious candidate identified. Preferred167 units vs actual163 is explained by three gathered units among first four: two domains together, two expressions together, three independent equations together (deficit4). “No whole-question omissions” does **not** mean all contextual instructions or original mathematical notation survive.

Task-mode instructions need a consistent separate metric: first-four reviewer counted missing true/false instructions as4 context failures; last-four reviewer reported8 instruction/score blocks separately while passing body/grouping. Do not aggregate61+29+64 into a purported clean-context success rate. Prompt was subsequently amended generically to retain response-mode instructions, but that amendment has **not** been actual-provider re-evaluated; results above remain unchanged.

Final complete-topic-path judgments are pending a dedicated163-question review; incremental findings include categorical-vs-grouped statistics mistakes and square-rotation placement imprecision. Do not combine semantic scores from different tree revisions.

PDF acquisition loses diagrams, radicals, powers, angle/fraction layout before extraction. Some retained exercises cannot be answered from input text. Original PDF inspection also identified two frozen-gold shorthand imperfections (Tương Bình Hiệp C5 radicals; Trần Phú I.2 √x option). Gold remains frozen and never entered model input.

Detailed evidence:
- [First four](<repair-pass-2026-11-17T09-01-11-757Z/current-first-four-review.md>)
- [Fifth/sixth](<repair-pass-2026-11-17T09-01-11-757Z/late-independent-review.md>)
- [Last four](<repair-pass-2026-11-17T09-10-58-522Z/last-four-independent-review.md>)
- [Whole-bank rejection](<repair-pass-2026-11-17T09-10-58-522Z/self-review-rejection.md>)
