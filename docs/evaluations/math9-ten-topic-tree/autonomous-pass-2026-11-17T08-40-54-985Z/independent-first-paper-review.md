# Independent first-paper extraction review

Evaluation only; reviewed all 79 input blocks and all 19 candidates, plus original PDF pages 6–7. No paid inference, production changes, gold/output changes, or organization review.

## Exact outcome

- Printed top-level: **16**; preferred independent units: **20**; retained candidates: **19**.
- **0 wholly omitted question units**, **0 unused question-bearing blocks**, **0 spurious/duplicate whole questions**, **0 geometry/option over-splits**.
- **1 gathered candidate** (Bài 2b: M and N), representing **2** preferred units; **1 preferred separation missing**. This is ambiguous, not an automatic omission/failure.
- **1 mixed-line boundary/context contamination case affects 2 candidates** (Câu 8 and Câu 9).
- **16 candidates have clean preferred boundaries relative to the text input**, **1 is acceptable but gathered**, **2 have minor contamination**. These are candidate judgments, not a formula-fidelity score.
- 65 unique body blocks + 5 unique context blocks = **69 unique selected blocks** (block 25 overlaps); **10 appropriately unused blocks**.

## Principal issues

1. **Mixed diagram-label block:** block 25 / raw source line 193 contains both Câu 8 option C and Câu 9 diagram label A. Câu 8 body retains foreign A; Câu 9 context retrieves A but also imports unrelated option C. Original PDF page 6 confirms their ownership. Câu 9 still keeps its own full stem/options and C,O,B labels (block 30). Missing actual diagram geometry is upstream, not this extractor error.
2. **Gathered M/N:** candidate 16 keeps Bài 2b instruction, both expressions, their numerator/denominator rows and x>0,y>0. It does not prefer separate M and N exercises; it does not omit N.
3. **Upstream mathematical losses:** especially Câu 1 last equation loses the squares from −x²+y²=0. Radical signs, fraction layout, angle hats, and actual central-angle/bicycle graphics are absent or damaged before extraction. Exact input-token preservation is not mathematical fidelity.

## Every retained candidate

| Candidate | Body blocks | Context blocks | Verdict and context judgment |
|---|---|---|---|
| Câu 1 (candidate-1) | 6,7,8 | — | One MC; all four listed equations and options A–D retained. PDF has superscripts in the last equation which were already lost in input; not an extractor omission. |
| Câu 2 (candidate-2) | 9,10,11 | — | One product-equation MC; both stated roots and options A–D retained. |
| Câu 3 (candidate-3) | 12,13,14 | — | One minimum-age MC; two-line stem and options A–D retained. |
| Câu 4 (candidate-4) | 15,16 | — | One square-root MC; stem and options A–D retained. Missing radical/font encoding is upstream. |
| Câu 5 (candidate-5) | 17,18 | — | One radical-domain MC; stem and options A–D retained. Radical absent upstream. |
| Câu 6 (candidate-6) | 19,20 | — | One radical-factor MC; M,N nonnegative conditions and options A–D retained. Radical bars/superscript layout damaged upstream. |
| Câu 7 (candidate-7) | 21,22 | — | One inequality MC; stem and options A–D retained. Radical signs already missing upstream. |
| Câu 8 (candidate-8) | 23,24,25,26 | — | All circle-symmetry stem/options retained, but body block 25 also contains isolated A belonging to the adjacent Câu 9 diagram. PDF page 6 confirms this is not part of option C. Mixed physical-line block produces minor foreign-diagram-label contamination. |
| Câu 9 (candidate-9) | 27,28,29,31,32 | 25,30 | All central-angle stem/options retained, plus diagram labels A,C,O,B. Correctly reaches backward for A via context block 25, but that indivisible block also imports Câu 8 option C (có vô số tâm đối xứng). PDF page 6 proves this overlap. Context block 30 contains C,O,B diagram labels, not an extra question. Actual circle/segments absent upstream. |
| Câu 10 (candidate-10) | 34,35 | — | One point-circle MC; radius and options A–D retained. |
| Câu 11 (candidate-11) | 36,37,38,39,40 | — | One arc-measure MC; full stem and four complete options retained. |
| Câu 12 (candidate-12) | 41,42,43,44 | — | One sector-area MC; numerator row, A–D formula row and denominator row all retained across page break. No formula tokens dropped by extractor; 2D fraction fidelity already limited upstream. |
| Bài 1a (candidate-13) | 48 | 47 | Independent inequality unit; complete instruction/expression in block 48; Bài 1 header context 47 retained. |
| Bài 1b (candidate-14) | 49,50,51 | 47 | Independent system unit; equation row preceding the b instruction and second row all retained (49–51); Bài 1 header context retained. No equation split off. |
| Bài 2a (candidate-15) | 53 | 52 | Bài 2a calculations remain together with Tính instruction and header context. Missing outer/inner radical signs already upstream. |
| Bài 2b (candidate-16) | 54,55,56,57 | 52 | Both independent M and N simplifications gathered in one Bài 2b unit. Simplification instruction, numerator/denominator rows, and x>0,y>0 restriction retained. Preferred gold requests separate M and N units, but this complete printed subpart is defensibly ambiguous rather than an omission. Splitting requires horizontal formula handling; shared physical lines hold parts of both expressions. |
| Bài 3 (candidate-17) | 58,59,60,61,62,63 | — | One connected geometry a–c unit; includes block 58 (angle =30° fragment physically extracted before Bài 3 stem), 59 setup, all a–c including later circle/H construction and tangent/arc tasks. Correct non-naive preceding-fragment assignment. Do not split a–c. |
| Bài 4a (candidate-18) | 65,66,67 | 64 | Independent rational radical expression equation; numerator row before a instruction, full domain x>0,x≠1 and denominator row all retained (65–67), with Bài 4 header context. Radical/fraction loss already upstream. |
| Bài 4b (candidate-19) | 68,69,70,71,72,73,74,75,76,77 | 64 | One complete bicycle story with both travel-distance and 2km pedal-count requests; all 10 prose lines and dimensions 14cm,4cm,67cm retained, with Bài 4 header context. Missing bicycle graphic is upstream; not a lost separate exercise. |

## Omitted, split, gathered and ignored content

All 16 printed exercises are represented. Splits of Bài 1 into a/b, Bài 2 into a/b, and Bài 4 into a/b explain 19 candidates from 16 printed exercises; separating M/N once more would give preferred 20. Bài 3 a–c is correctly connected, including the preceding angle fragment (block 58), later O/H construction, tangent proof and arc request. Bài 4b keeps both questions together. No options become independent exercises.

Unused input block IDs: **0,1,2,3,4,5,33,45,46,78**. These are institutional/title/time headers (0–2), blank separators (3,5,33,45), MC section/global instruction (4), written-section heading (46), and end marker (78). None is an omitted question unit. Task-specific instructions remain.

Matrix/specification, code 2, marking guides, and accessibility-selection list were excluded before extraction under frozen scope. PDF page 7 shows the accessibility list after -Hết-; not retaining it is correct.

## Evidence and integrity

- [Frozen gold](<docs/evaluations/math9-ten-topic-tree/independent-gold.md>); [source manifest](<docs/evaluations/math9-ten-topic-tree/source-manifest.json>).
- [Complete input](<docs/evaluations/math9-ten-topic-tree/autonomous-pass-2026-11-17T08-40-54-985Z/huynh-thuc-khang-hk1-2025-2026.input.json>); [reviewed extracted bank](<docs/evaluations/math9-ten-topic-tree/autonomous-pass-2026-11-17T08-40-54-985Z/huynh-thuc-khang-hk1-2025-2026.extracted-bank.json>).
- [Original PDF](<.data/math9-ten-evaluation/huynh-thuc-khang-hk1-2025-2026/original.pdf>), pages 6–7 visually inspected.
- [Machine-readable full review](<docs/evaluations/math9-ten-topic-tree/autonomous-pass-2026-11-17T08-40-54-985Z/independent-first-paper-review.json>).
- Source blocks/raw HTML equal input. Concatenated block text SHA256 matches frozen input: `3e72737ddb93d03944c66bfcd6ce510ddf66917fe3c1b922b3964c476cd6d18f`.
- Review does not inspect organized output, wait for organization, or assign an optimistic expected-count score.

Parent delivery: no `send_message` tool is exposed to this delegated session; use these new report files and the final result.
