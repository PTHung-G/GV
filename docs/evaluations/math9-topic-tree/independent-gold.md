# Independent pedagogical gold — Vietnamese Grade 9

Prepared 2026-11-16 from downloaded originals, before any tested-model output. No paid AI or application import/classification was run. This is a manually reasoned grouping/topic reference, not an exact taxonomy-string oracle. It contains no claim of measured model accuracy.

## Scoring rules (freeze before inference)

Score segmentation, context preservation, and topic relevance independently. **Correct**: relevant broad category or a defensible more-specific category, all tasks retained once, shared definitions retained. **Ambiguous**: defensible mixed-topic placement or granularity disagreement without lost content; diagram-dependent data absent in the supplied text; uncertain formula damaged by extraction. **Wrong**: unrelated category, lost/duplicated task, answer key/matrix imported as questions, severed geometry subpart lacking its setup, invented graph/diagram values. Do not call a broad geometry parent incorrect merely because a tangent/chord/inscribed-angle leaf exists. Composite circle proofs stay one exercise with subparts; assigning each proof to an isolated topic is undesirable.

Counts have two explicit axes: printed top-level question count and preferred retained exercise count. Independent numerical exercises under a printed Bài may be split; connected geometry and shared-expression exercises must stay whole. Keeping a mixed printed Bài intact is acceptable/ambiguous rather than automatically wrong if every subpart/context is present. The preferred count is not a standalone pass/fail metric.

## A. Hát Môn HK2 2025–2026

Source: [publisher page](https://thcs.toanmath.com/2026/05/de-cuoi-hoc-ky-2-toan-9-nam-2025-2026-truong-thcs-hat-mon-ha-noi.html). Printed top-level Bài I–V = **5**; preferred retained units = **8**. Only exam text lines 151–214 of [raw extraction](../../../.data/math9-evaluation/hat-mon-hk2-2025-2026/extracted.txt#L151-L214) is input; the preceding specification matrix and subsequent marking guide are excluded.

| Printed question | Expected topic(s), reasoning | Boundaries / shared context | Preferred units |
|---|---|---|---:|
| I | Statistics: frequencies, relative frequencies, reading a frequency chart, mean. These are data-analysis tasks, not probability. | I.1(a,b) share the 32-student score table and stay together. I.2(a,b,c) share the ice-sale chart and stay together; separate from I.1. | 2 |
| II | II.1 quadratic equation coefficients/solution. II.2 quadratic function and line intersections; discriminant and Viète. | II.1 is independent. II.2(a,b) share y=x², y=2mx+6, parameter m and roots x1,x2; retain together. | 2 |
| III | Algebraic modelling: simultaneous linear equations / percentages and annual interest. Amounts add to 500 million; interest relation is 0.07u+0.06v=32 million. Not a compound-interest problem. | One complete investment story, no lettered subparts. | 1 |
| IV | IV.1 solid geometry: cylinder lateral area/rolling surface. IV.2 plane/circle geometry: cyclic quadrilateral, secant product, concurrence. | IV.1 is independent of IV.2. For IV.2 retain triangle ABC right at A, M on AC, circle diameter CM and intersections D,N with BM,BC; keep proofs a–c together. | 2 |
| V | Geometric optimisation: minimum area of an inscribed square; quadratic expression/inequality method also valid. Broad geometry or algebraic optimisation acceptable. | Outer square side 8m; inner square MNPQ vertices on respective sides; one problem. No independent splitting of the vertices. | 1 |

Quality: I.2's chart values are **missing from plain text**, so numerical chart transcription/completeness is not scorable without PDF/image input. IV.1 roller and V square diagrams likewise are not represented in text; prose supports topic annotation, but do not fabricate diagrams. II.1 prints 3x²−4x+5=0 (no real roots); retain exactly, do not 'repair' the sign based on expectations. The source matrix describes a cone although the actual IV.1 is a cylinder, and describes III as quadratic although the actual story is linear. Gold follows actual questions, **not the matrix or source metadata**.

## B. Lý Sơn HK1 2025–2026 (code 901)

Source: [publisher page](https://thcs.toanmath.com/2026/01/de-cuoi-ki-1-toan-9-nam-2025-2026-truong-thcs-ly-son-ha-noi.html). Date printed: 25 December 2025; 90 minutes. Printed top-level I–V = **5**; preferred retained units = **10**. [Raw extraction](../../../.data/math9-evaluation/ly-son-hk1-2025-2026/extracted.txt) is the two-page exam only.

| Printed question | Expected topic(s), reasoning | Boundaries / shared context | Preferred units |
|---|---|---|---:|
| I | I.1a,b radical arithmetic/simplification; I.2a product equation; I.2b linear inequality. Broad algebra acceptable. | Four independently solvable expressions: 1a,1b,2a,2b. Headers 'rút gọn'/'giải phương trình và bất phương trình' must travel with each child if split. | 4 |
| II | Algebraic word-problem modelling. II.1 distance/speed/time, linear equation: d/45−d/50=12/60. II.2 simultaneous equations with production percentages: u+v=700, 1.2u+0.9v=720. | Two independent stories, not one combined system spanning both. | 2 |
| III | Rational expressions containing square roots; evaluation, simplification, inequality/integer solutions. | Shared A=3/(√x−2)−(√x+10)/(x−4), B=(√x+2)/(√x−2), x≥0,x≠4. Keep a (B at x=1), b (simplify A), c (P=A·B<−1 for integer x) together. | 1 |
| IV | IV.1 right-triangle trigonometry: 30° descent and 100m depth, hypotenuse distance. IV.2 circle geometry: tangent radii, cyclic points, angle equality and length products. | IV.1 independent. IV.2 must keep circle (O), diameter AB, tangent Ax, C with AC<CB, tangents meeting M; later H,K,N,I constructions belong to the same exercise. Keep a–c together; b has two conclusions, not two independent exercises. | 2 |
| V | Geometric optimisation: rectangle inscribed in an equilateral triangle side 6m. Similar triangles and a quadratic-area maximum; broad geometry/algebra acceptable. | M,N on BC; P on AC and Q on AB; maximise rectangular door area. Single shared figure and objective. | 1 |

Quality: radical signs, powers and fractions are badly flattened by pdftotext in I and III. A rendered original page was visually inspected to establish the above A/B definitions and topics; no OCR engine was run. **Raw extracted text is not lossless mathematical input.** IV.1 submarine picture and V rectangle figure do not survive text extraction; constraints are in prose. IV.2 formula angle symbols are damaged (IBK and HAB) but topic and group boundaries remain clear. Do not penalise a model for exact symbol recovery when only damaged text was supplied.

## C. Quảng Ninh entrance 10, 2026–2027

Source: [publisher page](https://thcs.toanmath.com/2026/06/de-tuyen-sinh-lop-10-mon-toan-nam-2026-2027-so-gddt-quang-ninh.html). Sở GD&ĐT Quảng Ninh; common/non-specialist official entrance paper, source page states 24 June 2026; 120 minutes. Printed top-level **19** = 12 MC + 7 written; preferred retained **19**. Namespace section/question ids, since numbering restarts. [Raw extraction](../../../.data/math9-evaluation/quang-ninh-entrance10-2026-2027/extracted.txt#L1-L116); exclude marking guide from line 117 onward.

| ID | Expected topic(s) and manual rationale | Boundaries/context | Units |
|---|---|---|---:|
| I.1 | Cube roots of negative numbers (−27). | One MC stem + options A–D; options are not exercises. | 1 |
| I.2 | Quadratic function evaluation y=−x²/2 at x=2. | Retain function, coordinate and options. | 1 |
| I.3 | Linear inequality 2x+4<0; test a proposed solution. | One MC item. | 1 |
| I.4 | Linear equation in two unknowns 2x−3y=−8; check ordered pair. 'Systems/linear algebra' parent defensible though it is only one equation. | Retain ordered-pair options. | 1 |
| I.5 | Grouped frequency table; sum counts for 60–100 minutes. | Shared table is essential; one MC item, not five interval questions. | 1 |
| I.6 | Right triangle trigonometric ratio, sine using AB=2, AC=4. | Full triangle setup and options. | 1 |
| I.7 | Circle central angle subtended by a side of an inscribed equilateral triangle. | Keep triangle/circle description. | 1 |
| I.8 | Cylinder volume (radius 3dm, height 9dm), rounding. | One solid-geometry question. | 1 |
| I.9 | Cone lateral area (radius 12cm, height 5cm); slant height by Pythagoras. | One item, not two retained exercises. | 1 |
| I.10 | Radical simplification/absolute value under a≤0: √(4a²)+a. | Root bar missing in raw text; exact form should be verified from PDF before formula-sensitive scoring. | 1 |
| I.11 | Elementary classical probability: evenly selected ball numbered 1–9, even number event. Not experimental probability despite publisher summary wording. | One MC stem/options. | 1 |
| I.12 | Applied right-triangle trigonometry: lamp height =20 tan35°+1.6, rounding. | Diagram and measurement context; one MC item. | 1 |
| II.1 | Rational expressions with square roots, simplification and excluded value. | P=(5/(2√x−3)+1/(2√x+3)):(√x+1), x≥0,x≠9/4. Whole expression is one question. | 1 |
| II.2 | Two linear equations/two unknowns. | 3x−4y=8; x−5y=−1. One system, not one exercise per equation. | 1 |
| II.3 | Linear inequality with fractional coefficients. | (5x−3)/4+(3x+1)/2>−3. One exercise. | 1 |
| II.4 | Quadratic roots/Viète plus radical simplification. | x²−4x+1=0, x1>x2; P=(x2+3)√(x1²+2x2−7)−x1². 'Do not solve equation' is part of task. Keep setup and expression together. | 1 |
| II.5 | Work/rate word problem leading to rational/quadratic equation. | Pool 144m³, two pumps jointly 60m³ in 2h, separate filling times differ by 4h. Entire story one unit. | 1 |
| II.6 | Composite circle geometry: two tangents, diameter/secant, cyclic quadrilateral, triangle similarity and midpoint. Broad 'circle geometry' is fully correct. | M outside circle, tangents MA,MB; diameter BC; secant MC hits D; H=AB∩MO. Keep a AC∥MO, b cyclic MDHB AND similarity MDH~MOC, c construction E and midpoint claim together. | 1 |
| II.7 | Applied geometric optimisation / minimum travel time, Pythagorean distance and inequality methods. | A,D same side of HK; AH=4,DK=3,HK=20; B,C on HK, speeds 30/50/40. Geometry+optimisation or algebraic optimisation acceptable; no calculus needed. Whole route one unit. | 1 |

Quality: Original page 2 was rendered and visually inspected to disambiguate II.1, II.4, II.6 similarity and diagram-based II.7 layout. Lamp and transport figures absent from plain text; transport diagram establishes perpendicular footpoints H,K and order H–B–C–K; do not silently assume extracted loose labels preserve this. Original figures remain in PDF and rendered page. Raw text's '94' means 9/4; radical scope is damaged in II.4. Topic/boundary scoring can proceed, but formula fidelity needs original-PDF input or an explicitly reviewed transcription.

## Aggregate and freeze policy

Printed top-level questions: **29** (5+5+19). Preferred retained pedagogical exercises: **37** (8+10+19). Nine lettered circle-proof subparts across three composite problems must not become standalone context-free exercises (Hát Môn IV.2 a–c; Lý Sơn IV.2 a–c; Quảng Ninh II.6 a–c). All three geometry exercises stay whole. Store model outputs separately after hashing this file; never edit gold to match a model's taxonomy. Report correct/ambiguous/wrong with reasons and both counts, not a deceptively exact taxonomy accuracy percentage. A different defensible independent-unit granularity is ambiguous, not inherently wrong.
