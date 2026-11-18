# Last-four independent review — incremental snapshots

Evaluation only; no paid calls, production edits, frozen-gold/manifest edits, or tested-output edits. Review covers only papers7–10, not earlier lineage. These are per-source organized snapshots before final self-review; final topic paths need a later review.

## Exact counts

| Paper | Expected / retained | Blocks | Unused | Boundary pass | Omitted / spurious | Topic relevant / mismatch / imprecise |
|---|---:|---:|---:|---:|---:|---:|
| tran-quoc-tuan-hk2-2025-2026 | 6 / 6 | 74 | 27 | 6 | 0 / 0 | 6 / 0 / 0 |
| tran-quang-dieu-hk2-2025-2026 | 21 / 21 | 115 | 14 | 21 | 0 / 0 | 19 / 2 / 0 |
| dong-cuong-hk2-2025-2026 | 15 / 15 | 73 | 9 | 15 | 0 / 0 | 15 / 0 / 0 |
| tran-phu-hk2-2025-2026 | 22 / 22 | 159 | 11 | 22 | 0 / 0 | 21 / 0 / 1 |

Total **64/64** candidates, **421** blocks, **61** unused blocks; **0** omitted/spurious questions, grouping errors or ambiguous groupings. **61 relevant**, **2 definite topic mismatches**, **1 related/imprecise**. All64 candidate bodies and contexts unchanged between extracted and organized snapshots. Eleven original PDF pages visually inspected. Eleven candidates have absent figures upstream; six essential, three redundant, two decorative. This is not a lossless-PDF-extraction claim.

## Issues
- **organizer_topic_mismatch**: Phone-use categories0,1,3,≥4 in a frequency table are not grouped continuous-interval data. Both currently map to Thống kê ghép nhóm. Parent Thống kê và xác suất is safer in this snapshot; descriptive leaf appears only in later snapshots.
- **organizer_topic_imprecision**: Square90°rotation placed under circle symmetry, related but not exact. No dedicated rotation leaf exists; mark related/imprecise rather than definitely unrelated.
- **upstream_loss_not_extractor_error**: Essential absent figures: TQT C3/C4; TQD C13; DC C13; TP I.5/I.6. Additional absent decorative/redundant illustrations affect5 candidates. Math font/radical/fraction damage is upstream, including DC C1/C2/C10/C15 and TP I.2.
- **frozen_reference_caveat**: PDF TP page1 proves I.2 optionB has sqrt(x), which text omits. Frozen gold tentative multiple-quadratics statement is not true of PDF. Report this as upstream loss, do not alter frozen gold.
- **minor_context_format_loss**: DC blocks2,3,43 and TP blocks1,2,60,61,118 excluded. Thus section-level response-mode/score instructions not attached. No numerical question omitted; TP labels preserve section identities. Treat separately from question-body completeness.
- **ordering**: TQD PDF physical C20,C19,C21 order is preserved in bodyblock provenance, but candidate array sorts C19 before C20. No omission/duplication; not a mathematical-content repair.

## Per-question judgments
All body/context block IDs, complete paths for every available node, all unused-block text and classifications, and snapshot hashes are in the [JSON report](<last-four-independent-review.json>). Every numbered row below is boundary/grouping pass relative to the supplied input; figure/math fidelity limitations remain upstream.

### tran-quoc-tuan-hk2-2025-2026
- **Câu 1** — relevant; Kho câu hỏi → Đại số → Hàm số bậc hai và đồ thị. Shared function, graph and ordinate task remain one unit; numerator above label retained. PDF confirms source typo “hai hàm số”.
- **Câu 2** — relevant; Kho câu hỏi → Đại số → Phương trình và hệ phương trình → Phương trình bậc hai và hệ thức Vi-ét. Quadratic and Viète expression remain complete.
- **Câu 3** — relevant; Kho câu hỏi → Toán thực tế → Bài toán diện tích và biểu thức. House/garden shared modelling task complete relative to input; essential layout x and x+3 missing upstream.
- **Câu 4** — relevant; Kho câu hỏi → Thống kê và xác suất. Cross-page chart stem and both tasks retained without page-number pollution; chart entirely absent upstream. Mixed statistics/probability parent placement defensible.
- **Câu 5** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình cầu và thể tích. Soup/cylinder/spheres, both tasks and supplied volume formula lines retained. Illustration decorative.
- **Câu 6** — relevant; Kho câu hỏi → Hình học → Đường tròn. Connected tangent, cyclicity, perpendicularity, product and inradius tasks retained together. Broad circle path defensible.

Unused blocks: 0 (header_footer_administration), 1 (header_footer_administration), 2 (header_footer_administration), 3 (header_footer_administration), 4 (header_footer_administration), 5 (header_footer_administration), 6 (blank), 7 (blank), 8 (blank), 9 (blank), 15 (blank), 20 (blank), 28 (blank), 29 (blank), 30 (blank), 31 (blank), 34 (blank), 35 (blank), 36 (blank), 37 (blank), 38 (header_footer_administration), 43 (blank), 63 (blank), 70 (blank), 71 (header_footer_administration), 72 (blank), 73 (header_footer_administration). No unused mathematical question text found.

### tran-quang-dieu-hk2-2025-2026
- **Câu 1** — mismatch_grouped_vs_discrete; Kho câu hỏi → Thống kê và xác suất → Thống kê ghép nhóm. Shared phone-use table blocks16–20 retained; categorical/discrete frequency is not grouped-interval statistics.
- **Câu 2** — mismatch_grouped_vs_discrete; Kho câu hỏi → Thống kê và xác suất → Thống kê ghép nhóm. Shared phone-use table blocks16–20 retained; categorical/discrete frequency is not grouped-interval statistics.
- **Câu 3** — relevant; Kho câu hỏi → Thống kê và xác suất → Xác suất của biến cố. Both coin outcomes and all four sample-space options retained.
- **Câu 4** — relevant; Kho câu hỏi → Thống kê và xác suất → Xác suất của biến cố. Two-dice sample-space question and options retained.
- **Câu 5** — relevant; Kho câu hỏi → Thống kê và xác suất → Xác suất của biến cố. Coin probability and vertically fragmented fraction options retained.
- **Câu 6** — relevant; Kho câu hỏi → Thống kê và xác suất → Xác suất của biến cố. House-number probability complete.
- **Câu 7** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích → Hình trụ. Cylinder rotation/lateral area complete.
- **Câu 8** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích → Hình nón. Cone radius/triangle rotation complete.
- **Câu 9** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích → Hình cầu. Sphere rotation/radius complete.
- **Câu 10** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích → Hình nón. Cone lateral-area formula and all fraction fragments retained.
- **Câu 11** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích → Hình cầu. Sphere volume formula options complete relative to text.
- **Câu 12** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích. Cylinder/cone comparison complete as one MC.
- **Câu 13** — relevant; Kho câu hỏi → Thống kê và xác suất → Thống kê ghép nhóm. All four assertions remain one chart-context unit; axis-label context retained, numerical histogram absent upstream.
- **Câu 14** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích. Cup cylinder/sphere displacement assertions remain one mixed-solids unit.
- **Câu 15** — relevant; Kho câu hỏi → Thống kê và xác suất → Xác suất của biến cố. Heart probability with short-answer context retained.
- **Câu 16** — relevant; Kho câu hỏi → Thống kê và xác suất → Xác suất của biến cố. Same-colour probability and decimal-format requirement retained.
- **Câu 17** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích → Hình nón. Cone data, answer line and source cm³ area typo retained; radical lost upstream.
- **Câu 18** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích → Hình cầu. Sphere volume/surface-area complete.
- **Câu 19** — relevant; Kho câu hỏi → Toán thực tế → Bài toán chuyển động đều. Ship motion question correctly bound despite appearing physically after C20.
- **Câu 20** — relevant; Kho câu hỏi → Thống kê và xác suất → Thống kê ghép nhóm. All forty long-jump values and grouped-table instruction retained.
- **Câu 21** — relevant; Kho câu hỏi → Hình học → Đường tròn → Tứ giác nội tiếp. Connected tangent/perpendicular construction, cyclicity and equal lengths retained.

Unused blocks: 0 (header_footer_administration), 1 (header_footer_administration), 2 (header_footer_administration), 3 (header_footer_administration), 4 (header_footer_administration), 5 (header_footer_administration), 6 (header_footer_administration), 7 (header_footer_administration), 8 (blank), 9 (header_footer_administration), 10 (header_footer_administration), 11 (blank), 12 (blank), 13 (blank). No unused mathematical question text found.

### dong-cuong-hk2-2025-2026
- **Câu 1** — relevant; Kho câu hỏi → Đại số → Căn thức bậc hai và bậc ba → Khái niệm căn bậc hai và điều kiện xác định. All expression lines retained, but cube-root/radical scope already missing in input.
- **Câu 2** — relevant; Kho câu hỏi → Đại số → Căn thức bậc hai và bậc ba → Tính toán và rút gọn biểu thức chứa căn. All radical/fraction lines retained; exact radical scope lost upstream.
- **Câu 3** — relevant; Kho câu hỏi → Đại số → Hàm số bậc hai và đồ thị. Graph membership/options complete.
- **Câu 4** — relevant; Kho câu hỏi → Đại số → Bất đẳng thức và bất phương trình → Bất phương trình bậc nhất một ẩn. Linear inequality/options complete.
- **Câu 5** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích → Hình nón. Cone lateral area/options complete.
- **Câu 6** — relevant; Kho câu hỏi → Hình học → Đường tròn → Góc ở tâm, góc nội tiếp và cung tròn. Central angle/minor arc and all choices retained; diagram-label context B,60°,A retained, other labels O/m share body lines. No separate omitted stem.
- **Câu 7** — relevant; Kho câu hỏi → Thống kê và xác suất → Thống kê mô tả. Full book-type table and relative-frequency MC retained.
- **Câu 8** — relevant; Kho câu hỏi → Thống kê và xác suất → Xác suất của biến cố. Two-dice sum probability and fraction options retained.
- **Câu 9** — relevant; Kho câu hỏi → Đại số → Phương trình và hệ phương trình → Phương trình bậc hai và hệ thức Vi-ét. Quadratic solve complete.
- **Câu 10** — relevant; Kho câu hỏi → Đại số → Căn thức bậc hai và bậc ba → Tính toán và rút gọn biểu thức chứa căn. All rational-radical numerator/denominator/domain lines retained; radical bars missing upstream.
- **Câu 11** — relevant; Kho câu hỏi → Đại số → Phương trình và hệ phương trình → Phương trình bậc hai và hệ thức Vi-ét. Parameter and weighted-root equality including terminal 1 retained.
- **Câu 12** — relevant; Kho câu hỏi → Toán thực tế → Bài toán chuyển động đều. Car-speed modelling complete.
- **Câu 13** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích → Hình trụ. Both hat-fabric tasks complete relative to input; essential diagram dimensions35cm,10cm,35cm missing upstream.
- **Câu 14** — relevant; Kho câu hỏi → Hình học → Đường tròn. Connected cyclicity/midpoint/collinearity proof retained.
- **Câu 15** — relevant; Kho câu hỏi → Đại số → Bất đẳng thức và bất phương trình → Bất đẳng thức. Leading fraction numerator3 retained with sum bound; PDF confirms sum≤3/2 and three square roots of a²+1/b² cyclically. Bars absent upstream.

Unused blocks: 0 (header_footer_administration), 1 (header_footer_administration), 2 (section_instruction_not_attached), 3 (section_instruction_not_attached), 24 (blank), 28 (blank), 30 (blank), 43 (section_instruction_not_attached), 72 (header_footer_administration). No unused mathematical question text found.

### tran-phu-hk2-2025-2026
- **Phần I - Câu 1** — relevant; Kho câu hỏi → Đại số → Hàm số bậc hai và đồ thị. Quadratic graph/options retained.
- **Phần I - Câu 2** — relevant; Kho câu hỏi → Đại số → Phương trình và hệ phương trình → Phương trình bậc hai một ẩn và hệ thức Vi-ét. All options retained relative to input. PDF option B is x²−√x+1=0, NOT a second quadratic: apparent multiple correct options result from upstream missing radical, contradicting tentative frozen-gold fidelity note; do not edit frozen gold.
- **Phần I - Câu 3** — relevant; Kho câu hỏi → Đại số → Phương trình và hệ phương trình → Phương trình bậc hai một ẩn và hệ thức Vi-ét. Squared-root sum via Viète complete.
- **Phần I - Câu 4** — relevant; Kho câu hỏi → Toán thực tế → Bài toán diện tích và biểu thức. Garden dimensions modelling complete; area path relevant.
- **Phần I - Câu 5** — relevant; Kho câu hỏi → Hình học → Đường tròn → Góc ở tâm, góc nội tiếp và cung tròn. Inscribed/central angle question and option fragments complete; required figure absent upstream.
- **Phần I - Câu 6** — related_imprecise; Kho câu hỏi → Hình học → Đường tròn → Tính chất đối xứng của đường tròn. Clockwise90° square rotation complete in text but vertex orientation missing upstream; circle symmetry path related but imprecise (not definite unrelated placement).
- **Phần I - Câu 7** — relevant; Kho câu hỏi → Hình học → Đường tròn → Tứ giác và đa giác nội tiếp. Cyclic-polygon options complete; snapshot leaf explicitly covers polygons as well as quadrilaterals.
- **Phần I - Câu 8** — relevant; Kho câu hỏi → Thống kê và xác suất → Thống kê mô tả. All46 shooting scores and count question retained.
- **Phần I - Câu 9** — relevant; Kho câu hỏi → Thống kê và xác suất → Xác suất của biến cố. Colour probability and options complete.
- **Phần I - Câu 10** — relevant; Kho câu hỏi → Thống kê và xác suất → Thống kê mô tả. Word-error frequency table complete.
- **Phần I - Câu 11** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích → Hình trụ. Cylinder volume complete.
- **Phần I - Câu 12** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích → Hình nón. Cone lateral area and fraction options complete.
- **Phần II - Câu 1** — relevant; Kho câu hỏi → Đại số → Hàm số bậc hai và đồ thị. All four quadratic-function assertions and displaced formula fragments retained.
- **Phần II - Câu 2** — relevant; Kho câu hỏi → Toán thực tế → Giải toán bằng cách lập phương trình/hệ phương trình. Entire planting story, restrictions and four assertions retained; equation modelling path apt.
- **Phần II - Câu 3** — relevant; Kho câu hỏi → Hình học → Đường tròn. Connected altitude/circle/segment/power assertions all retained across page break; diagram labels in context are not spurious questions.
- **Phần II - Câu 4** — relevant; Kho câu hỏi → Thống kê và xác suất. Shared32-score dataset and four mixed statistics/probability assertions kept together.
- **Phần III - Câu 1** — relevant; Kho câu hỏi → Toán thực tế → Bài toán chuyển động đều. Car/truck modelling complete.
- **Phần III - Câu 2** — relevant; Kho câu hỏi → Đại số → Phương trình và hệ phương trình → Phương trình bậc hai một ẩn và hệ thức Vi-ét. Parameter quadratic and root relation powers retained despite layout disorder.
- **Phần III - Câu 3** — relevant; Kho câu hỏi → Thống kê và xác suất → Xác suất của biến cố. Uniform numbered-ball modular event complete.
- **Phần III - Câu 4** — relevant; Kho câu hỏi → Thống kê và xác suất → Thống kê mô tả. Library relative-frequency table and total-population question complete.
- **Phần III - Câu 5** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích → Hình trụ. Stacked-cylinder volume relations complete; absent illustration redundant with text.
- **Phần III - Câu 6** — relevant; Kho câu hỏi → Hình học → Hình trụ, hình nón, hình cầu và thể tích. Soup/spheres displacement complete; duplicate story in TQT C5 correctly retained across distinct sources.

Unused blocks: 0 (header_footer_administration), 1 (section_instruction_not_attached), 2 (section_instruction_not_attached), 60 (section_instruction_not_attached), 61 (section_instruction_not_attached), 118 (section_instruction_not_attached), 124 (blank), 125 (blank), 128 (blank), 129 (blank), 158 (header_footer_administration). No unused mathematical question text found.
