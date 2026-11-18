# Middle independent review — repair pass

Independent evaluation only; no paid provider calls and no production, gold or existing output edits. Frozen manifest/gold hashes verified. Every scoped body, context and unused block was reviewed; PDF pages 1–2 of both originals were visually checked. Block ids below are **0-based**.

## Exact findings

- **Trần Quý Cáp:** 22 candidates / 22 persisted questions, all 17 printed questions covered; preferred gold21. All22 bodies complete relative to text; **19 strict boundary/context passes, 2 ambiguous B4 split candidates, 1 context-contaminated I.9**. Zero actual omitted questions and zero spurious question candidates. All22 complete ancestor paths are relevant (some broad).
- **Quán Toan:** all22 candidates pass boundaries/body/context relative to input:12 MC+4 intact true/false groups+6 short. Zero omitted/spurious candidates. **No organization or root semantic score:** deadline failure, and zero persisted fourth-source questions in extracted snapshot is expected, not zero recall.
- **Concrete defect:** third candidate9 context block42 contains the entire I.10 stem plus B,C labels from I.9 figure. The extractor selected an upstream mixed block; this contaminates I.9 context but does not create a spurious new question.
- **Ambiguity:** third candidates20/21 split B4a/b despite gold preferring one shared-context unit; both repeat radius/angle setup. This explains22 vs21 and is not an omission.
- **Upstream caveats:** radicals, degrees, powers, fraction layout and graphics are absent/damaged before extraction. PDF confirms these, so do not credit input text as lossless or charge candidate extraction with recovering them. Third B1c has no explicit excluded-domain sentence to omit; fourth II.3 false assertions and II.4c missing π are printed source content.

## tran-quy-cap-hk1-2025-2026

22 vs preferred21 is exactly B4a/B4b split; all 17 printed questions covered.

| Candidate | Verdict | Finding | Full ancestor path |
|---|---|---|---|
| candidate-1 — Câu 1 | pass_relative_to_text | Complete MC stem and A–D; superscripts flattened upstream. Body=[10, 11]; context=[]. | Kho câu hỏi → Đại số → Phương trình, bất phương trình và hệ phương trình → Phương trình bậc nhất hai ẩn |
| candidate-2 — Câu 2 | pass_relative_to_text | Complete MC inequality stem and A–D. Body=[12, 13]; context=[]. | Kho câu hỏi → Đại số → Phương trình, bất phương trình và hệ phương trình → Bất đẳng thức và bất phương trình bậc nhất một ẩn → Tính chất của bất đẳng thức |
| candidate-3 — Câu 3 | pass_relative_to_text | Complete MC square-root stem and A–D. Body=[14, 15]; context=[]. | Kho câu hỏi → Đại số → Căn bậc hai và căn thức → Căn bậc hai |
| candidate-4 — Câu 4 | pass_relative_to_text | Complete MC radical factor extraction; radical bars lost upstream, not omitted by candidate. Body=[16, 17]; context=[]. | Kho câu hỏi → Đại số → Căn bậc hai và căn thức → Biến đổi và rút gọn căn thức → Đưa thừa số ra ngoài dấu căn |
| candidate-5 — Câu 5 | pass_relative_to_text | Complete MC radical product/factor identity; PDF shows a√b=√(a²b). Khai phương một tích is relevant though not the most precise leaf. Body=[18, 19]; context=[]. | Kho câu hỏi → Đại số → Căn bậc hai và căn thức → Biến đổi và rút gọn căn thức → Khai phương một tích |
| candidate-6 — Câu 6 | pass_relative_to_text | Complete MC cosine stem and all fraction rows; PDF triangle graphic/labels absent upstream. Body=[20, 21, 22, 23]; context=[]. | Kho câu hỏi → Hình học → Tam giác vuông: hệ thức lượng và tỉ số lượng giác |
| candidate-7 — Câu 7 | pass_relative_to_text | Complete MC special-angle sine and A–D; radicals/degrees flattened upstream. Body=[24, 25, 26, 27]; context=[]. | Kho câu hỏi → Hình học → Tam giác vuông: hệ thức lượng và tỉ số lượng giác |
| candidate-8 — Câu 8 | pass_relative_to_text | Complete MC inverse-sine rounding and all unusually ordered option rows; degree superscripts flattened upstream. Body=[28, 29, 30, 31, 32]; context=[]. | Kho câu hỏi → Hình học → Tam giác vuông: hệ thức lượng và tỉ số lượng giác |
| candidate-9 — Câu 9 | context_contamination | Body preserves I.9 and options. Context block 42 also contains the entire I.10 stem, because B,C diagram labels share that block in layout extraction. Actual extraneous next-question context, not an extra question or lost I.9 question. Block granularity prevents selecting only the B,C labels; figure absent upstream. Body=[33, 35, 36, 37, 38, 39, 40, 41]; context=[42]. | Kho câu hỏi → Hình học → Tam giác vuông: hệ thức lượng và tỉ số lượng giác |
| candidate-10 — Câu 10 | pass_relative_to_text | Complete I.10 stem/options. Its stem block also contains stray B,C labels from I.9 diagram: upstream layout mixing, not a new candidate defect. Body=[42, 44, 45]; context=[]. | Kho câu hỏi → Hình học → Đường tròn → Đường tròn và tính chất đối xứng |
| candidate-11 — Câu 11 | pass_relative_to_text | Complete central-angle/minor-arc MC with options; arc/angle and degree glyphs damaged upstream. Body=[46, 47, 48]; context=[]. | Kho câu hỏi → Hình học → Đường tròn → Góc và cung của đường tròn → Góc ở tâm, cung và số đo cung → Góc ở tâm |
| candidate-12 — Câu 12 | pass_relative_to_text | Complete arc-length formula MC including numerator/denominator rows; topic relevant. Body=[49, 50, 51, 52]; context=[]. | Kho câu hỏi → Hình học → Đường tròn → Độ dài đường tròn, cung tròn và diện tích hình quạt tròn → Độ dài cung tròn |
| candidate-13 — Bài 1a | pass_relative_to_text | Independent domain subpart, instruction retained; radical missing upstream. Body=[55]; context=[]. | Kho câu hỏi → Đại số → Căn bậc hai và căn thức → Căn thức bậc hai và điều kiện xác định |
| candidate-14 — Bài 1b | pass_relative_to_text | Independent linear inequality, instruction retained. Body=[56]; context=[]. | Kho câu hỏi → Đại số → Phương trình, bất phương trình và hệ phương trình → Bất đẳng thức và bất phương trình bậc nhất một ẩn → Giải bất phương trình bậc nhất một ẩn |
| candidate-15 — Bài 1c | pass_relative_to_text | Independent rational equation with instruction and all numerator/denominator rows. No explicit excluded-domain sentence exists in PDF; must infer x≠−1,2, not claim an omitted sentence. Body=[57, 58, 59]; context=[]. | Kho câu hỏi → Đại số → Phương trình, bất phương trình và hệ phương trình → Phương trình chứa ẩn ở mẫu |
| candidate-16 — Bài 2a | pass_relative_to_text | Independent rationalization task with instruction and all fraction rows; radical lost upstream. Body=[61, 62, 63]; context=[]. | Kho câu hỏi → Đại số → Căn bậc hai và căn thức → Biến đổi và rút gọn căn thức → Trục căn thức ở mẫu |
| candidate-17 — Bài 2b | pass_relative_to_text | Independent radical arithmetic task, complete available text; nested radical scope is lost upstream. Body=[64]; context=[]. | Kho câu hỏi → Đại số → Căn bậc hai và căn thức → Biến đổi và rút gọn căn thức → Rút gọn biểu thức chứa căn |
| candidate-18 — Bài 2c | pass_relative_to_text | Independent radical simplification task; all fraction rows and x≥0,x≠1 retained. Body=[65, 66, 67]; context=[]. | Kho câu hỏi → Đại số → Căn bậc hai và căn thức → Biến đổi và rút gọn căn thức → Rút gọn biểu thức chứa căn |
| candidate-19 — Bài 3 | pass_relative_to_text | Complete right-triangle DEF trigonometric-ratios task; only printed title/points ignored. Body=[70]; context=[]. | Kho câu hỏi → Hình học → Tam giác vuông: hệ thức lượng và tỉ số lượng giác |
| candidate-20 — Bài 4a | ambiguous_shared_context_split | Shared radius 6cm/central-angle 60° context retained. B4a and B4b split although frozen gold prefers one connected shared-context unit. Independently solvable from duplicated context: ambiguous over-split, no omission; broad Đường tròn path is relevant. Body=[73]; context=[72]. | Kho câu hỏi → Hình học → Đường tròn |
| candidate-21 — Bài 4b | ambiguous_shared_context_split | Shared radius/angle retained and both sector-area body lines retained. Paired with candidate-20: ambiguous over-split relative to one preferred B4 unit; no missing construction or domain. Body=[74, 75]; context=[72]. | Kho câu hỏi → Hình học → Đường tròn → Độ dài đường tròn, cung tròn và diện tích hình quạt tròn → Diện tích hình quạt tròn |
| candidate-22 — Bài 5 | pass_relative_to_text | Complete airplane/observers story, 2500m,37°/30°, requested CH and metre rounding. Figure absent upstream; PDF confirms C above H between A,B. Body=[77, 78, 79, 80, 81, 82]; context=[]. | Kho câu hỏi → Hình học → Tam giác vuông: hệ thức lượng và tỉ số lượng giác |

### Every ignored block

| Block | Frozen line | Verdict | Text |
|---|---|---|---|
| 0 | 1 | correctly_ignored_structural_header_instruction_title_points_or_footer | TRƯỜNG THCS TRẦN QUÝ CÁP                                 ĐỀ KIỂM TRA |
| 1 | 2 | correctly_ignored_structural_header_instruction_title_points_or_footer | HỌC KỲ I - NĂM HỌC: 2025-2026 |
| 2 | 3 | correctly_ignored_structural_header_instruction_title_points_or_footer | MÔN: TOÁN 9 |
| 3 | 4 | correctly_ignored_structural_header_instruction_title_points_or_footer | ĐỀ CHÍNH THỨC |
| 4 | 5 | correctly_ignored_structural_header_instruction_title_points_or_footer | THỜI GIAN LÀM BÀI: 90 phút |
| 5 | 6 | correctly_ignored_structural_header_instruction_title_points_or_footer | (không kể thời gian giao – nhận đề) |
| 6 | 7 | correctly_ignored_structural_header_instruction_title_points_or_footer | (Đề gồm có 02 trang – Học sinh làm bài trên giấy thi do giám thị phát) |
| 7 | 8 | correctly_ignored_blank |  |
| 8 | 9 | correctly_ignored_structural_header_instruction_title_points_or_footer | I. TRẮC NGHIỆM: (3,0 điểm) |
| 9 | 10 | correctly_ignored_structural_header_instruction_title_points_or_footer | Chọn một phương án trả lời đúng cho mỗi câu sau rồi ghi vào giấy làm bài. |
| 34 | 35 | correctly_ignored_blank |  |
| 43 | 44 | correctly_ignored_blank |  |
| 53 | 54 | correctly_ignored_structural_header_instruction_title_points_or_footer | II. TỰ LUẬN: (7,0 điểm) |
| 54 | 55 | correctly_ignored_structural_header_instruction_title_points_or_footer | Bài 1: (2,25 điểm) |
| 60 | 61 | correctly_ignored_structural_header_instruction_title_points_or_footer | Bài 2: (2,0 điểm) |
| 68 | 69 | correctly_ignored_blank |  |
| 69 | 70 | correctly_ignored_structural_header_instruction_title_points_or_footer | Bài 3: (0,5 điểm) |
| 71 | 72 | correctly_ignored_structural_header_instruction_title_points_or_footer | Bài 4: (1,25 điểm) |
| 76 | 77 | correctly_ignored_structural_header_instruction_title_points_or_footer | Bài 5: (1,0 điểm) |
| 83 | 84 | correctly_ignored_blank |  |
| 84 | 85 | correctly_ignored_blank |  |
| 85 | 86 | correctly_ignored_structural_header_instruction_title_points_or_footer | ------------------ Hết------------------- |

## quan-toan-hk1-2025-2026

22 candidates exactly cover 12 MC+4 true/false+6 short; extracted stage intentionally has no confirmed/persisted fourth-source questions.

| Candidate | Verdict | Finding | Full ancestor path |
|---|---|---|---|
| candidate-1 — Câu 1 | pass_relative_to_text | Complete bridge-load MC stem/options. 10t sign graphic absent upstream; diagram-dependent, no invented graphic recovery. Body=[13, 14, 15, 16, 17, 18, 19, 20]; context=[]. | NOT SCORED (deadline failure) |
| candidate-2 — Câu 2 | pass_relative_to_text | Complete central-angle recognition MC/options; four figures absent upstream, hence cannot solve from candidate text alone. Body=[21, 22]; context=[]. | NOT SCORED (deadline failure) |
| candidate-3 — Câu 3 | pass_relative_to_text | Complete 9–12 right-triangle cosine MC and all fraction tokens. Body=[23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]; context=[]. | NOT SCORED (deadline failure) |
| candidate-4 — Câu 4 | pass_relative_to_text | Complete arithmetic-square-root MC/options; radical bars lost upstream. Body=[39, 40, 41, 42]; context=[]. | NOT SCORED (deadline failure) |
| candidate-5 — Câu 5 | pass_relative_to_text | Complete system/solution MC with all equation and answer token rows; raw math ordering damaged upstream. Body=[43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62]; context=[]. | NOT SCORED (deadline failure) |
| candidate-6 — Câu 6 | pass_relative_to_text | Complete right-triangle/altitude false-identity MC/options; fraction ordering flattened upstream. Body=[63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80]; context=[]. | NOT SCORED (deadline failure) |
| candidate-7 — Câu 7 | pass_relative_to_text | Complete two-circle-position MC: radii6,2 and distance9 retained with all options. Body=[81, 82, 83, 84, 85, 86, 87, 88, 89]; context=[]. | NOT SCORED (deadline failure) |
| candidate-8 — Câu 8 | pass_relative_to_text | Complete two-tangent-properties MC/options including false assertion; not answer leakage. Body=[90, 91, 92, 93, 94, 95, 96]; context=[]. | NOT SCORED (deadline failure) |
| candidate-9 — Câu 9 | pass_relative_to_text | Complete linear-system-recognition MC with all 56 blocks, including all four option token lists. Severe formula flattening is upstream. Body=[97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152]; context=[]. | NOT SCORED (deadline failure) |
| candidate-10 — Câu 10 | pass_relative_to_text | Complete radical-domain MC/options; radical bar lost upstream. Body=[153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167]; context=[]. | NOT SCORED (deadline failure) |
| candidate-11 — Câu 11 | pass_relative_to_text | Complete tangent-length MC, radius5/distance13 and options. Body=[168, 169, 170, 171, 172]; context=[]. | NOT SCORED (deadline failure) |
| candidate-12 — Câu 12 | pass_relative_to_text | Complete inequality-solution MC/options; radicals in A=√5,D=√3 absent upstream, not candidate omissions. Body=[173, 174, 175, 176, 177, 178]; context=[]. | NOT SCORED (deadline failure) |
| candidate-13 — PHẦN II - Câu 1 | pass_relative_to_text | One complete true/false stem with a–d, not four detached tasks. Radical/superscript losses upstream. Body=[181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195]; context=[]. | NOT SCORED (deadline failure) |
| candidate-14 — PHẦN II - Câu 2 | pass_relative_to_text | One complete A,B-expression true/false task, definitions and all a–d/domain assertions retained; severe fraction/radical flattening upstream. Body=[196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231]; context=[]. | NOT SCORED (deadline failure) |
| candidate-15 — PHẦN II - Câu 3 | pass_relative_to_text | One complete car speed/time true/false story with all definitions/assertions. Natural-number condition and y−x=30 are printed false statements, not model mistakes to correct. Body=[232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250]; context=[]. | NOT SCORED (deadline failure) |
| candidate-16 — PHẦN II - Câu 4 | pass_relative_to_text | One complete connected triangle/circle true/false task, all constructions and a–d retained. PDF prints c)10/9 without π; do not invent π as a recovery. Body=[251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276]; context=[]. | NOT SCORED (deadline failure) |
| candidate-17 — PHẦN III - Câu 1 | pass_relative_to_text | Complete annulus short task: both radii, π=3.14 and rounding retained. CD picture occurs atop PDF page2 and is absent upstream; radii in prose suffice. Body=[278, 279, 280, 281, 282]; context=[]. | NOT SCORED (deadline failure) |
| candidate-18 — PHẦN III - Câu 2 | pass_relative_to_text | Complete radical-maximum short task including x≥16 and two-decimal rounding; PDF A=√(x−16)/(3x), formula structure lost upstream. Body=[284, 285, 286, 287, 288, 289, 290, 291, 292, 293]; context=[]. | NOT SCORED (deadline failure) |
| candidate-19 — PHẦN III - Câu 3 | pass_relative_to_text | Complete special-angle expression short task and rounding; degree placement flattened upstream. Body=[294, 295, 296, 297, 298, 299]; context=[]. | NOT SCORED (deadline failure) |
| candidate-20 — PHẦN III - Câu 4 | pass_relative_to_text | Complete radical arithmetic short task; nested radical/fraction scope lost upstream. Body=[300, 301, 302, 303, 304, 305, 306, 307]; context=[]. | NOT SCORED (deadline failure) |
| candidate-21 — PHẦN III - Câu 5 | pass_relative_to_text | Complete weighted-mark inequality story including weights, threshold8,9.25/7.75 and rounding. Body=[308, 309, 310, 311, 312]; context=[]. | NOT SCORED (deadline failure) |
| candidate-22 — PHẦN III - Câu 6 | pass_relative_to_text | Complete lighting trigonometry story including height2.95,baseline1.88,spread25° and both angle/length rounding instructions. Diagram absent upstream; PDF confirms D,C,A collinear in that order. Body=[313, 314, 315, 316, 317, 318, 319, 320]; context=[]. | NOT SCORED (deadline failure) |

### Every ignored block

| Block | Frozen line | Verdict | Text |
|---|---|---|---|
| 0 | 1 | correctly_ignored_structural_header_instruction_title_points_or_footer | Mã đề 901 Trang 1/2 |
| 1 | 2 | correctly_ignored_structural_header_instruction_title_points_or_footer | UBND PHƯỜNG HỒNG AN |
| 2 | 3 | correctly_ignored_structural_header_instruction_title_points_or_footer | TRƯỜNG THCS QUÁN TOAN |
| 3 | 4 | correctly_ignored_structural_header_instruction_title_points_or_footer | -------------------- |
| 4 | 5 | correctly_ignored_structural_header_instruction_title_points_or_footer | (Đề thi có 02 trang) |
| 5 | 6 | correctly_ignored_structural_header_instruction_title_points_or_footer | ĐỀ KIỂM TRA CUỐI HỌC KÌ I |
| 6 | 7 | correctly_ignored_structural_header_instruction_title_points_or_footer | NĂM HỌC 2025 - 2026 |
| 7 | 8 | correctly_ignored_structural_header_instruction_title_points_or_footer | MÔN: TOÁN |
| 8 | 9 | correctly_ignored_structural_header_instruction_title_points_or_footer | Thời gian làm bài: 90 phút |
| 9 | 10 | correctly_ignored_structural_header_instruction_title_points_or_footer | (không kể thời gian phát đề) |
| 10 | 11 | correctly_ignored_structural_header_instruction_title_points_or_footer | Họ và tên: ............................................................................Số báo danh: ....... Mã đề 901 |
| 11 | 12 | correctly_ignored_structural_header_instruction_title_points_or_footer | PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn. Thí sinh trả lời từ câu 1 đến câu 12. Mỗi |
| 12 | 13 | correctly_ignored_structural_header_instruction_title_points_or_footer | câu hỏi thí sinh chỉ chọn một phương án. |
| 179 | 180 | correctly_ignored_structural_header_instruction_title_points_or_footer | PHẦN II. Câu trắc nghiệm đúng sai. Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) |
| 180 | 181 | correctly_ignored_structural_header_instruction_title_points_or_footer | ở mỗi câu, thí sinh chọn đúng hoặc sai. |
| 277 | 278 | correctly_ignored_structural_header_instruction_title_points_or_footer | PHẦN III. Câu trắc nghiệm trả lời ngắn. Thí sinh trả lời từ câu 1 đến câu 6. |
| 283 | 284 | correctly_ignored_structural_header_instruction_title_points_or_footer | Mã đề 901 Trang 2/2 |
| 321 | 322 | correctly_ignored_structural_header_instruction_title_points_or_footer | ------ HẾT ------ |

## Interpretation limits

Full details, exact block arrays, question UUIDs, artifact hashes and every ancestor id/label are in the companion JSON. Strict pass counts exclude both members of an ambiguous split; they do not imply two omitted questions. Structural instructions (including true/false section directions), printed titles/points, page headers, blank lines and end markers are appropriately unused, not lost exercise content. No source mathematical transcription was repaired. Rendered images were temporary inspection artifacts only.
