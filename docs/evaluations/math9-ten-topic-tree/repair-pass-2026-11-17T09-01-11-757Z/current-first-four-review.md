# Current first-four independent review

Reviewed **70/70 retained questions** in the current cumulative snapshot (revision 28). **61 pass, 6 fail, 3 ambiguous** on boundaries/context; **70/70 complete topic ancestries pass**. Preferred count is 74, but the four-unit deficit is grouped independent subtasks, not missing printed questions.

Snapshot SHA256: `d4566f52a0b99033558c1c95d52e4ad62cdb4c7816fe577dee3ce440fee3234b`.

Scope: [repair-pass-2026-11-17T09-01-11-757Z cumulative Quán Toan snapshot](<docs/evaluations/math9-ten-topic-tree/repair-pass-2026-11-17T09-01-11-757Z/quan-toan-hk1-2025-2026.organized-bank.json>), exact resume `repair-pass-2026-11-17T09-10-58-522Z`. The first-four source and question objects match the resume exactly. **Incremental only:** later taxonomy moves need re-review; these are not final-organization verdicts.

## Findings

1. **Two cross-question context leaks:** Huỳnh Thúc Kháng Câu 9 imports Câu 8 option C via block 25; Trần Quý Cáp Câu 9 imports Câu 10 stem via block 42. Visual PDF inspection confirms these blocks mix figure labels with unrelated prose. Figure loss itself is upstream.
2. **Four missing true/false instructions:** Quán Toan PHẦN II Câu 1–4 omit the available section instruction in blocks 179–180. Assertions stay grouped correctly, but each retained exercise needs the choose-true/false mode.
3. **Three ambiguous granularities:** HTK Bài 2b retains M,N together (preferred 2); TBH Câu 2 keeps two domains together (preferred 2); TBH Câu 4 keeps a–c together (preferred 3). All content survives; these are not outright omissions.
4. **No topical mismatch** under broad relevant and mixed-topic placement policy. All 70 paths reach root without missing parents/cycles. TQC Bài 4 at broad circle ancestor is appropriate for arc+sector tasks; connected geometry tasks remain intact.
5. **Upstream is not recovery:** PDF shows TBH Câu 5 has √11 and √14, HTK Câu 1 has y², QT Câu 12 options √5 and √3. Those glyphs are already absent/flattened in input. Do not treat plain-number text or gold shorthand as exact mathematical transcription. No frozen gold changed.

## Method and safeguards

Evaluation only; zero paid calls; no model/production/original-output/manifest/gold edits. Independently read every retained body/context and every unused block from this snapshot; previous reviews were not used to copy judgments. Block text concatenations equal the four run inputs. Original PDF pages visually inspected: HTK 6–7, TBH 1, TQC 1–2, QT 1–2. No polling, waiting, background jobs, or inference calls.

Boundary/content and topic relevance scored separately. Missing diagrams/radicals/fraction structure remain upstream limitations even for a boundary pass. “Pass” is not a claim that a text-only item can be solved exactly. Ignored-block review means the computed unused complement; no undocumented ignore metadata is assumed.

## Per-source counts

| Source | Retained / preferred | Pass | Fail | Ambiguous | Topic paths pass |
|---|---:|---:|---:|---:|---:|
| huynh-thuc-khang-hk1-2025-2026 | 19 / 20 | 17 | 1 | 1 | 19 |
| tuong-binh-hiep-hk1-2025-2026 | 8 / 11 | 6 | 0 | 2 | 8 |
| tran-quy-cap-hk1-2025-2026 | 21 / 21 | 20 | 1 | 0 | 21 |
| quan-toan-hk1-2025-2026 | 22 / 22 | 18 | 4 | 0 | 22 |

## Every retained question

Block ids below are 0-based within each source. All complete paths include the root. Upstream flag concerns mathematical/image fidelity separately from the boundary verdict.

### huynh-thuc-khang-hk1-2025-2026

#### Câu 1 — PASS
- Candidate `candidate-1`; question `f4e2048f-1b7f-49ce-8b5a-c5e7a042bc2c`.
- Body blocks `[6, 7, 8]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Phương trình và hệ phương trình (`pt_he`) → Phương trình bậc nhất hai ẩn (`pt_bac_nhat_hai_an`). **Topic: pass.**
- Evidence: Recognize first-degree equations in two unknowns; all four equations and A–D retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 2 — PASS
- Candidate `candidate-2`; question `23f908d3-c3ff-4432-9251-0cf35191d5e6`.
- Body blocks `[9, 10, 11]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Phương trình và hệ phương trình (`pt_he`) → Phương trình tích và nghiệm (`pt_tich_nghiem`). **Topic: pass.**
- Evidence: Product equation roots 1 and 5; all choices retained.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Câu 3 — PASS
- Candidate `candidate-3`; question `24714616-6404-49aa-b72f-c7a2dd6920fa`.
- Body blocks `[12, 13, 14]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Bất đẳng thức và bất phương trình (`bd_bpt`) → Bất đẳng thức (`bat_dang_thuc`). **Topic: pass.**
- Evidence: Minimum age 16 translated to inequality; all choices retained.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Câu 4 — PASS
- Candidate `candidate-4`; question `231ba8a2-9235-4543-bef6-f375bf8df362`.
- Body blocks `[15, 16]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Khái niệm căn bậc hai và điều kiện xác định (`can_thuc_khai_niem`). **Topic: pass.**
- Evidence: Square roots of 36; all choices retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 5 — PASS
- Candidate `candidate-5`; question `a134ea30-09b2-4603-a463-8c530bba09fe`.
- Body blocks `[17, 18]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Khái niệm căn bậc hai và điều kiện xác định (`can_thuc_khai_niem`). **Topic: pass.**
- Evidence: Radical domain x−1; all choices retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 6 — PASS
- Candidate `candidate-6`; question `76aa8f20-e0ed-4f5d-97c3-def0848d8a75`.
- Body blocks `[19, 20]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Tính toán và rút gọn biểu thức chứa căn (`can_thuc_tinh_toan`). **Topic: pass.**
- Evidence: Extract square factor from radical M²N; assumptions and choices retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 7 — PASS
- Candidate `candidate-7`; question `2a2b9113-77dd-4121-9514-89dc4bbe04f5`.
- Body blocks `[21, 22]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → So sánh căn bậc hai (`so_sanh_can`). **Topic: pass.**
- Evidence: Compare radicals numerically; radical-comparison leaf is appropriate (PDF confirms radicals).
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 8 — PASS
- Candidate `candidate-8`; question `754f0567-79c3-4fe2-bedf-8d05e89caeb2`.
- Body blocks `[23, 24, 25, 26]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Tính chất đối xứng của đường tròn (`doi_xung_duong_tron`). **Topic: pass.**
- Evidence: Circle symmetry; all choices retained; isolated A at end of block 25 is interleaved diagram-label debris.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 9 — FAIL
- Candidate `candidate-9`; question `861ee229-538d-4705-bb87-bce4ae77174e`.
- Body blocks `[27, 28, 29, 31, 32]`; context `[25, 30]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Góc ở tâm, góc nội tiếp và cung tròn (`goc_tam_cung`). **Topic: pass.**
- Evidence: Central angle; context block 25 carries previous Câu 8 option C alongside diagram A. This is actual unrelated question text contamination, not just missing image. Block 30 has C/O/B diagram labels.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 10 — PASS
- Candidate `candidate-10`; question `cb40b6f6-3c55-4d05-9ae9-18ee883fd9a1`.
- Body blocks `[34, 35]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Điểm thuộc đường tròn (`diem_thuoc_duong_tron`). **Topic: pass.**
- Evidence: Point-circle distance OM=2; all choices retained.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Câu 11 — PASS
- Candidate `candidate-11`; question `1ea8e7e1-bc66-426f-8c21-22bb2397e531`.
- Body blocks `[36, 37, 38, 39, 40]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Góc ở tâm, góc nội tiếp và cung tròn (`goc_tam_cung`). **Topic: pass.**
- Evidence: Major/minor arc relation; all choices retained.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Câu 12 — PASS
- Candidate `candidate-12`; question `29905612-0271-4de6-9442-2e796274926f`.
- Body blocks `[41, 42, 43, 44]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Hình quạt tròn (`hinh_quat_tron`). **Topic: pass.**
- Evidence: Sector area formula; numerator/denominator lines and all choices retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Bài 1a — PASS
- Candidate `candidate-13`; question `cac2ed89-a382-465b-a690-939097c648bf`.
- Body blocks `[48]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Bất đẳng thức và bất phương trình (`bd_bpt`) → Bất phương trình bậc nhất một ẩn (`bpt_bac_nhat`). **Topic: pass.**
- Evidence: Independent linear inequality with solve instruction.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Bài 1b — PASS
- Candidate `candidate-14`; question `058317bf-d5c6-4e32-9987-bfcf7212e081`.
- Body blocks `[49, 50, 51]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Phương trình và hệ phương trình (`pt_he`) → Hệ phương trình bậc nhất hai ẩn (`he_pt_bac_nhat`). **Topic: pass.**
- Evidence: Independent simultaneous linear system with solve instruction and both equations.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Bài 2a — PASS
- Candidate `candidate-15`; question `b60a041a-edb8-4b53-b384-31df7c09a748`.
- Body blocks `[53]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Tính toán và rút gọn biểu thức chứa căn (`can_thuc_tinh_toan`). **Topic: pass.**
- Evidence: Radical arithmetic list retained as one calculator/algebra unit.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Bài 2b — AMBIGUOUS
- Candidate `candidate-16`; question `5adc7781-2b46-4506-a1d2-545d32d09dda`.
- Body blocks `[54, 55, 56, 57]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Tính toán và rút gọn biểu thức chứa căn (`can_thuc_tinh_toan`). **Topic: pass.**
- Evidence: M and N simplifications are independent; complete grouped printed subpart is defensible, but gold prefers two. No missing expression or domain text.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Bài 3 — PASS
- Candidate `candidate-17`; question `6124cd11-53cb-41a6-a064-8b7e1c587dbe`.
- Body blocks `[58, 59, 60, 61, 62, 63]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Tam giác vuông và đường tròn (`tam_giac_vuong_duong_tron`). **Topic: pass.**
- Evidence: Connected right-triangle/circle/tangent/arc exercise a–c remains intact, including C=30° line above stem. Mixed right-triangle-and-circle leaf is defensible.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Bài 4a — PASS
- Candidate `candidate-18`; question `20e71305-1600-4c07-87d7-9a22ca869ab2`.
- Body blocks `[65, 66, 67]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Tính toán và rút gọn biểu thức chứa căn (`can_thuc_tinh_toan`). **Topic: pass.**
- Evidence: Radical rational expression equation; x>0 and x≠1 retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Bài 4b — PASS
- Candidate `candidate-19`; question `3ed9bf50-6b88-4313-ac0f-d319d0744571`.
- Body blocks `[68, 69, 70, 71, 72, 73, 74, 75, 76, 77]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Toán thực tế (`toan_thuc_te`) → Chuyển động của bánh răng và bánh xe (`banh_rang_banh_xe`). **Topic: pass.**
- Evidence: Bicycle gearing/circumference: all dimensions, two questions and rounding retained; practical bicycle leaf fits.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Unused/ignored complement

- Block 0 / input line 1: acceptable administrative/header/blank/end-marker omission; `UBND XÃ TAM ANH        ĐỀ KIỂM TRA CUỐI KÌ I, NĂM HỌC 2025-2026`
- Block 1 / input line 2: acceptable administrative/header/blank/end-marker omission; `TRƯỜNG THCS HUỲNH THÚC KHÁNG          MÔN: TOÁN – LỚP 9 – MÃ ĐỀ 1`
- Block 2 / input line 3: acceptable administrative/header/blank/end-marker omission; `(Đề gồm có 02 trang) Thời gian: 90 phút (không kể thời gian giao đề)`
- Block 3 / input line 4: acceptable administrative/header/blank/end-marker omission; ``
- Block 4 / input line 5: acceptable administrative/header/blank/end-marker omission; `I. TRẮC NGHIỆM (3,0 điểm). Chọn câu trả lời đúng rồi ghi vào giấy làm bài.`
- Block 5 / input line 6: acceptable administrative/header/blank/end-marker omission; ``
- Block 33 / input line 34: acceptable administrative/header/blank/end-marker omission; ``
- Block 45 / input line 46: acceptable administrative/header/blank/end-marker omission; ``
- Block 46 / input line 47: acceptable administrative/header/blank/end-marker omission; `II. TỰ LUẬN (7,0 điểm).`
- Block 47 / input line 48: acceptable administrative/header/blank/end-marker omission; `Bài 1. (1,25 điểm)`
- Block 52 / input line 53: acceptable administrative/header/blank/end-marker omission; `Bài 2. (2,0 điểm)`
- Block 64 / input line 65: acceptable administrative/header/blank/end-marker omission; `Bài 4. (1,0 điểm)`
- Block 78 / input line 79: acceptable administrative/header/blank/end-marker omission; `-Hết-`

### tuong-binh-hiep-hk1-2025-2026

#### Câu 1 — PASS
- Candidate `candidate-1`; question `47f4700f-d230-4ced-b5d7-cc5ec9e52582`.
- Body blocks `[6, 7, 8]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Bất đẳng thức và bất phương trình (`bd_bpt`) → Bất phương trình bậc nhất một ẩn (`bpt_bac_nhat`). **Topic: pass.**
- Evidence: Two values checked against same inequality; keep together.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Câu 2 — AMBIGUOUS
- Candidate `candidate-2`; question `f7743a0f-1234-4d93-b079-e58fd50e632a`.
- Body blocks `[9, 10, 11, 12]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Khái niệm căn bậc hai và điều kiện xác định (`can_thuc_khai_niem`). **Topic: pass.**
- Evidence: Two independent radical domains retained together with instruction; complete but preferred split is two units.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 3 — PASS
- Candidate `candidate-3`; question `ba6e28c1-6b5f-4676-aae3-47c4d9b5a398`.
- Body blocks `[13, 14, 15, 16]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Phương trình và hệ phương trình (`pt_he`) → Phương trình tích và nghiệm (`pt_tich_nghiem`). **Topic: pass.**
- Evidence: Product equation; preceding parenthesis/fraction line retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 4 — AMBIGUOUS
- Candidate `candidate-4`; question `8f65578d-3925-4625-916c-28be68d95422`.
- Body blocks `[17, 18, 19, 20, 21, 22, 23, 24, 25, 26]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Tính toán và rút gọn biểu thức chứa căn (`can_thuc_tinh_toan`). **Topic: pass.**
- Evidence: Calculator square/cube roots with rounding, absolute-value radical simplification a<2, and rationalization x<0,y>0 are all retained. Complete printed group is defensible; three preferred units. Square-root-labelled parent is a reasonable broad radical placement despite cube roots in part a.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 5 — PASS
- Candidate `candidate-5`; question `1d44dd51-9ef0-43f4-999a-61ba5cf10e85`.
- Body blocks `[27, 28, 29, 30, 31]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Hệ thức lượng và tỉ số lượng giác trong tam giác vuông (`tam_giac_vuong_ty_so`). **Topic: pass.**
- Evidence: Shared right triangle MNP, both subtasks and rounding retained. PDF has MN=√11, MP=√14, not literal 11 and 14; missing radical glyphs already in input, not candidate loss.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 6 — PASS
- Candidate `candidate-6`; question `37ebf0e6-0497-4a1a-afb3-782ee5a253d3`.
- Body blocks `[34, 35, 36, 37, 38, 39]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Góc ở tâm, góc nội tiếp và cung tròn (`goc_tam_cung`). **Topic: pass.**
- Evidence: Central/inscribed angles: all figure-dependent requests retained; PDF confirms BAD=40°. Damaged angle label and absent diagram are upstream.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 7 — PASS
- Candidate `candidate-7`; question `30bb770c-c954-48d8-8336-98f2f20dec69`.
- Body blocks `[40, 41, 42]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Toán thực tế (`toan_thuc_te`) → Bài toán chuyển động đều (`toan_chuyen_dong`). **Topic: pass.**
- Evidence: Opposing vehicles: 160 km, 1 h 36, 10 km/h difference retained; motion modelling topic fits.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Câu 8 — PASS
- Candidate `candidate-8`; question `cf871e42-b7b0-402d-9391-5c22ff59228b`.
- Body blocks `[43, 44, 45, 46, 47, 48]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Tiếp tuyến của đường tròn (`tiep_tuyen_duong_tron`). **Topic: pass.**
- Evidence: One connected tangent construction and proofs a–c intact. Tangency leaf covers orthogonality/cyclicity/length-product consequences.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Unused/ignored complement

- Block 0 / input line 1: acceptable administrative/header/blank/end-marker omission; `SỞ GDĐT TP HỒ CHÍ MINH                               KIỂM TRA CUỐI HỌC KỲ I`
- Block 1 / input line 2: acceptable administrative/header/blank/end-marker omission; `TRƯỜNG THCS TƯƠNG BÌNH HIỆP                                Môn : TOÁN – Lớp 9`
- Block 2 / input line 3: acceptable administrative/header/blank/end-marker omission; `Năm học: 2025 – 2026`
- Block 3 / input line 4: acceptable administrative/header/blank/end-marker omission; `Thời gian : 90 phút`
- Block 4 / input line 5: acceptable administrative/header/blank/end-marker omission; `(Không kể thời gian phát đề)`
- Block 5 / input line 6: acceptable administrative/header/blank/end-marker omission; `ĐỀ CHÍNH THỨC`
- Block 32 / input line 33: acceptable administrative/header/blank/end-marker omission; ``
- Block 33 / input line 34: acceptable administrative/header/blank/end-marker omission; ``
- Block 49 / input line 50: acceptable administrative/header/blank/end-marker omission; ``
- Block 50 / input line 51: acceptable administrative/header/blank/end-marker omission; `--- HẾT ---`

### tran-quy-cap-hk1-2025-2026

#### Câu 1 — PASS
- Candidate `candidate-1`; question `3c32e3e5-ef86-4e08-bfb9-c5638a50224c`.
- Body blocks `[10, 11]`; context `[9]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Phương trình và hệ phương trình (`pt_he`) → Phương trình bậc nhất hai ẩn (`pt_bac_nhat_hai_an`). **Topic: pass.**
- Evidence: First-degree equation in two unknowns; A–D and single-answer instruction retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 2 — PASS
- Candidate `candidate-2`; question `ee56cc6c-f676-444d-8988-a4c4239c3380`.
- Body blocks `[12, 13]`; context `[9]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Bất đẳng thức và bất phương trình (`bd_bpt`) → Bất đẳng thức (`bat_dang_thuc`). **Topic: pass.**
- Evidence: Inequality preservation; all alternatives and instruction retained.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Câu 3 — PASS
- Candidate `candidate-3`; question `b9579fca-6042-437d-81bd-3e5435bf8a7d`.
- Body blocks `[14, 15]`; context `[9]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Khái niệm căn bậc hai và điều kiện xác định (`can_thuc_khai_niem`). **Topic: pass.**
- Evidence: Square roots of 4; all alternatives retained.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Câu 4 — PASS
- Candidate `candidate-4`; question `9d7307af-de9b-46bd-9304-e7a2e578e7f5`.
- Body blocks `[16, 17]`; context `[9]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Tính toán và rút gọn biểu thức chứa căn (`can_thuc_tinh_toan`). **Topic: pass.**
- Evidence: Extract factor from √50; all alternatives retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 5 — PASS
- Candidate `candidate-5`; question `66e01097-1aef-4eee-bfab-d299c9e042a1`.
- Body blocks `[18, 19]`; context `[9]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Tính toán và rút gọn biểu thức chứa căn (`can_thuc_tinh_toan`). **Topic: pass.**
- Evidence: Radical factor/product identity; all alternatives retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 6 — PASS
- Candidate `candidate-6`; question `10fbd856-4c10-462a-b399-0a7ebb1c75bf`.
- Body blocks `[20, 21, 22, 23]`; context `[9]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Hệ thức lượng và tỉ số lượng giác trong tam giác vuông (`tam_giac_vuong_ty_so`). **Topic: pass.**
- Evidence: Right-triangle cosine definition; fraction lines retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 7 — PASS
- Candidate `candidate-7`; question `22985dc1-8931-4f28-b6ec-09141d058a43`.
- Body blocks `[24, 25, 26, 27]`; context `[9]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Hệ thức lượng và tỉ số lượng giác trong tam giác vuông (`tam_giac_vuong_ty_so`). **Topic: pass.**
- Evidence: sin60°; all fraction/choice lines retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 8 — PASS
- Candidate `candidate-8`; question `1ba4cce6-cd8f-40be-9b4d-bd5f52bd50f7`.
- Body blocks `[28, 29, 30, 31, 32]`; context `[9]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Hệ thức lượng và tỉ số lượng giác trong tam giác vuông (`tam_giac_vuong_ty_so`). **Topic: pass.**
- Evidence: Inverse sine and degree rounding; all detached degree/choice lines retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 9 — FAIL
- Candidate `candidate-9`; question `23af8c60-db74-420c-83e8-ba171d6c8bf0`.
- Body blocks `[33, 35, 36, 37, 38, 39, 40, 41]`; context `[9, 42]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Hệ thức lượng và tỉ số lượng giác trong tam giác vuông (`tam_giac_vuong_ty_so`). **Topic: pass.**
- Evidence: Right-triangle sine definition; all options retained, but context block 42 includes next Câu 10 stem. PDF verifies B/C belong to Câu 9 diagram; full block reuse leaks an unrelated question stem.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 10 — PASS
- Candidate `candidate-10`; question `2a28188a-2869-4b17-bb1e-0a2bce7873c7`.
- Body blocks `[42, 44, 45]`; context `[9]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Tính chất đối xứng của đường tròn (`doi_xung_duong_tron`). **Topic: pass.**
- Evidence: Circle symmetry; all options retained. B/C on its stem line are diagram-label debris already interleaved upstream.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 11 — PASS
- Candidate `candidate-11`; question `53d1a0af-7f17-47bb-a1ef-590bdd3348d8`.
- Body blocks `[46, 47, 48]`; context `[9]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Góc ở tâm, góc nội tiếp và cung tròn (`goc_tam_cung`). **Topic: pass.**
- Evidence: Arc 120° to central angle; both split stem lines and options retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 12 — PASS
- Candidate `candidate-12`; question `2db9bfda-4941-47e8-bd9f-29d7ffdda1e4`.
- Body blocks `[49, 50, 51, 52]`; context `[9]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Góc ở tâm, góc nội tiếp và cung tròn (`goc_tam_cung`). **Topic: pass.**
- Evidence: Arc-length formula; all fractions retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Bài 1a — PASS
- Candidate `candidate-13`; question `8b844e6d-b53e-4bf3-b561-ff64ed144e4f`.
- Body blocks `[55]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Khái niệm căn bậc hai và điều kiện xác định (`can_thuc_khai_niem`). **Topic: pass.**
- Evidence: Independent radical domain retained with instruction.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Bài 1b — PASS
- Candidate `candidate-14`; question `d9ea7ea4-db38-4a55-83d6-e1aacdaad320`.
- Body blocks `[56]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Bất đẳng thức và bất phương trình (`bd_bpt`) → Bất phương trình bậc nhất một ẩn (`bpt_bac_nhat`). **Topic: pass.**
- Evidence: Independent linear inequality retained with instruction.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Bài 1c — PASS
- Candidate `candidate-15`; question `85572f41-2993-4b95-b44d-ebdfe022c419`.
- Body blocks `[57, 58, 59]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Phương trình và hệ phương trình (`pt_he`) → Phương trình chứa ẩn ở mẫu (`pt_chua_an_o_mau`). **Topic: pass.**
- Evidence: Rational equation with variable denominators; all numerator/denominator lines retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Bài 2a — PASS
- Candidate `candidate-16`; question `439966c9-1fd5-4e70-93e5-9c23b0095009`.
- Body blocks `[61, 62, 63]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Tính toán và rút gọn biểu thức chứa căn (`can_thuc_tinh_toan`). **Topic: pass.**
- Evidence: Rationalize radical denominator; all fraction lines retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Bài 2b — PASS
- Candidate `candidate-17`; question `46033b7c-d4f7-40b1-bfbf-232681caa4a4`.
- Body blocks `[64]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Tính toán và rút gọn biểu thức chứa căn (`can_thuc_tinh_toan`). **Topic: pass.**
- Evidence: Radical arithmetic; complete expression line retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Bài 2c — PASS
- Candidate `candidate-18`; question `486b81a7-598b-4b63-bb84-99871a54efe4`.
- Body blocks `[65, 66, 67]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Tính toán và rút gọn biểu thức chứa căn (`can_thuc_tinh_toan`). **Topic: pass.**
- Evidence: Rational radical simplification; expression and x≥0,x≠1 retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Bài 3 — PASS
- Candidate `candidate-19`; question `9635bce2-8b42-4ed6-bedb-fc7370179022`.
- Body blocks `[70]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Hệ thức lượng và tỉ số lượng giác trong tam giác vuông (`tam_giac_vuong_ty_so`). **Topic: pass.**
- Evidence: Right-triangle DEF trig ratios; full setup and instruction retained.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Bài 4 — PASS
- Candidate `candidate-20`; question `81aaa9b7-21fb-40fc-91e8-71c7ff365e04`.
- Body blocks `[72, 73, 74, 75]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`). **Topic: pass.**
- Evidence: Shared circle radius 6, angle 60°, arc measures/length and sector area retained together; broad circle ancestor is appropriate for mixed tasks.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Bài 5 — PASS
- Candidate `candidate-21`; question `58508c91-5439-46fd-9787-bb27ee9dcfc5`.
- Body blocks `[77, 78, 79, 80, 81, 82]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Hệ thức lượng và tỉ số lượng giác trong tam giác vuông (`tam_giac_vuong_ty_so`). **Topic: pass.**
- Evidence: Airplane-height applied trigonometry, observer separation and both elevation angles retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Unused/ignored complement

- Block 0 / input line 1: acceptable administrative/header/blank/end-marker omission; `TRƯỜNG THCS TRẦN QUÝ CÁP                                 ĐỀ KIỂM TRA`
- Block 1 / input line 2: acceptable administrative/header/blank/end-marker omission; `HỌC KỲ I - NĂM HỌC: 2025-2026`
- Block 2 / input line 3: acceptable administrative/header/blank/end-marker omission; `MÔN: TOÁN 9`
- Block 3 / input line 4: acceptable administrative/header/blank/end-marker omission; `ĐỀ CHÍNH THỨC`
- Block 4 / input line 5: acceptable administrative/header/blank/end-marker omission; `THỜI GIAN LÀM BÀI: 90 phút`
- Block 5 / input line 6: acceptable administrative/header/blank/end-marker omission; `(không kể thời gian giao – nhận đề)`
- Block 6 / input line 7: acceptable administrative/header/blank/end-marker omission; `(Đề gồm có 02 trang – Học sinh làm bài trên giấy thi do giám thị phát)`
- Block 7 / input line 8: acceptable administrative/header/blank/end-marker omission; ``
- Block 8 / input line 9: acceptable administrative/header/blank/end-marker omission; `I. TRẮC NGHIỆM: (3,0 điểm)`
- Block 34 / input line 35: acceptable administrative/header/blank/end-marker omission; ``
- Block 43 / input line 44: acceptable administrative/header/blank/end-marker omission; ``
- Block 53 / input line 54: acceptable administrative/header/blank/end-marker omission; `II. TỰ LUẬN: (7,0 điểm)`
- Block 54 / input line 55: acceptable administrative/header/blank/end-marker omission; `Bài 1: (2,25 điểm)`
- Block 60 / input line 61: acceptable administrative/header/blank/end-marker omission; `Bài 2: (2,0 điểm)`
- Block 68 / input line 69: acceptable administrative/header/blank/end-marker omission; ``
- Block 69 / input line 70: acceptable administrative/header/blank/end-marker omission; `Bài 3: (0,5 điểm)`
- Block 71 / input line 72: acceptable administrative/header/blank/end-marker omission; `Bài 4: (1,25 điểm)`
- Block 76 / input line 77: acceptable administrative/header/blank/end-marker omission; `Bài 5: (1,0 điểm)`
- Block 83 / input line 84: acceptable administrative/header/blank/end-marker omission; ``
- Block 84 / input line 85: acceptable administrative/header/blank/end-marker omission; ``
- Block 85 / input line 86: acceptable administrative/header/blank/end-marker omission; `------------------ Hết-------------------`

### quan-toan-hk1-2025-2026

#### Câu 1 — PASS
- Candidate `candidate-1`; question `a3d740c5-d6fa-48e7-b8d5-8fc2c44e99fa`.
- Body blocks `[13, 14, 15, 16, 17, 18, 19, 20]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Bất đẳng thức và bất phương trình (`bd_bpt`) → Bất đẳng thức (`bat_dang_thuc`). **Topic: pass.**
- Evidence: Bridge-load inequality; stem and all options retained. Missing 10t sign image is upstream.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 2 — PASS
- Candidate `candidate-2`; question `4fc1ab8a-d40a-4c8a-ac8b-38129af0b865`.
- Body blocks `[21, 22]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Góc ở tâm, góc nội tiếp và cung tròn (`goc_tam_cung`). **Topic: pass.**
- Evidence: Identify central angle from four figures; stem/options retained; missing figures are upstream.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 3 — PASS
- Candidate `candidate-3`; question `82e774e7-2bab-49fe-9769-41c9ef3607ed`.
- Body blocks `[23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Hệ thức lượng và tỉ số lượng giác trong tam giác vuông (`tam_giac_vuong_ty_so`). **Topic: pass.**
- Evidence: Cosine in 9–12 right triangle; stem and all fraction options retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 4 — PASS
- Candidate `candidate-4`; question `1509699a-c18c-4f90-9238-8fc6aa126f1e`.
- Body blocks `[39, 40, 41, 42]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Khái niệm căn bậc hai và điều kiện xác định (`can_thuc_khai_niem`). **Topic: pass.**
- Evidence: Arithmetic square root of 7; options retained; radical glyph absence upstream.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 5 — PASS
- Candidate `candidate-5`; question `21de33b7-f870-4fe9-8aeb-3da3575d192d`.
- Body blocks `[43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Phương trình và hệ phương trình (`pt_he`) → Hệ phương trình bậc nhất hai ẩn (`he_pt_bac_nhat`). **Topic: pass.**
- Evidence: Solve linear system; full vertical tokens and all paired choices retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 6 — PASS
- Candidate `candidate-6`; question `e5bfd84a-13e5-466c-ac04-097718eb71ed`.
- Body blocks `[63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Hệ thức lượng và tỉ số lượng giác trong tam giác vuông (`tam_giac_vuong_ty_so`). **Topic: pass.**
- Evidence: Choose false right-triangle trig identity; full stem and four fraction choices retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 7 — PASS
- Candidate `candidate-7`; question `55a04d6c-d007-48a9-81eb-b3a504b2f4aa`.
- Body blocks `[81, 82, 83, 84, 85, 86, 87, 88, 89]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Vị trí tương đối của hai đường tròn (`vi_tri_hai_duong_tron`). **Topic: pass.**
- Evidence: Two circles radii 6 and 2, centers distance 9; stem and four positions retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 8 — PASS
- Candidate `candidate-8`; question `ad154410-24e9-47bd-bf60-996d08dd21ff`.
- Body blocks `[90, 91, 92, 93, 94, 95, 96]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Tiếp tuyến của đường tròn (`tiep_tuyen_duong_tron`). **Topic: pass.**
- Evidence: Two tangents from A; false-property instruction and all alternatives retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 9 — PASS
- Candidate `candidate-9`; question `8713d2eb-3b46-4a56-94ae-de008b268394`.
- Body blocks `[97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Phương trình và hệ phương trình (`pt_he`) → Hệ phương trình bậc nhất hai ẩn (`he_pt_bac_nhat`). **Topic: pass.**
- Evidence: Recognize first-degree linear system; complete four vertically flattened systems retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 10 — PASS
- Candidate `candidate-10`; question `850e7a68-3ccb-41b0-9702-4b72cc308ed5`.
- Body blocks `[153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Khái niệm căn bậc hai và điều kiện xác định (`can_thuc_khai_niem`). **Topic: pass.**
- Evidence: Radical domain √(1−4x); all alternatives retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 11 — PASS
- Candidate `candidate-11`; question `97e42829-0b1e-443b-a957-0b6da2ae0816`.
- Body blocks `[168, 169, 170, 171, 172]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Tiếp tuyến của đường tròn (`tiep_tuyen_duong_tron`). **Topic: pass.**
- Evidence: Tangent length with radius 5 and distance 13; all alternatives retained.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Câu 12 — PASS
- Candidate `candidate-12`; question `b7f1a57d-1eba-47a4-aab4-c758b94de53c`.
- Body blocks `[173, 174, 175, 176, 177, 178]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Bất đẳng thức và bất phương trình (`bd_bpt`) → Bất phương trình bậc nhất một ẩn (`bpt_bac_nhat`). **Topic: pass.**
- Evidence: Test solutions of 2x−4≥0; all alternatives retained. PDF shows √5 and √3 choices; raw input lost radicals.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 1 (PHẦN II) — FAIL
- Candidate `candidate-13`; question `d8fdc283-c0bb-4607-84b3-01b7b341aaf1`.
- Body blocks `[181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Bất đẳng thức và bất phương trình (`bd_bpt`) → Bất đẳng thức (`bat_dang_thuc`). **Topic: pass.**
- Evidence: Shared inequality and four assertions intact, but missing true/false task instruction in ignored blocks 179–180. Without it these look like supplied claims, not an exercise.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 2 (PHẦN II) — FAIL
- Candidate `candidate-14`; question `3c03f677-c55a-49c2-8494-f6739661261f`.
- Body blocks `[196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Tính toán và rút gọn biểu thức chứa căn (`can_thuc_tinh_toan`). **Topic: pass.**
- Evidence: A/B radical expressions and four assertions intact; missing true/false task instruction in ignored blocks 179–180.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 3 (PHẦN II) — FAIL
- Candidate `candidate-15`; question `3081b200-99f9-4e5e-9000-8c575923f498`.
- Body blocks `[232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Toán thực tế (`toan_thuc_te`) → Bài toán chuyển động đều (`toan_chuyen_dong`). **Topic: pass.**
- Evidence: Shared car story, variable definitions and four assertions intact; missing true/false task instruction in ignored blocks 179–180. Preserve x,y∈N and y−x=30 as source assertions, not answers to repair.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 4 (PHẦN II) — FAIL
- Candidate `candidate-16`; question `9b033ace-43b0-4239-b295-c77429494001`.
- Body blocks `[251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Tam giác vuông và đường tròn (`tam_giac_vuong_duong_tron`). **Topic: pass.**
- Evidence: Connected right-triangle/circle construction and four assertions intact; missing true/false task instruction in ignored blocks 179–180. Mixed circle/right-triangle leaf is defensible.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 1 (PHẦN III) — PASS
- Candidate `candidate-17`; question `56bfad04-8ad1-4989-980e-00248780d10e`.
- Body blocks `[278, 279, 280, 281, 282]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Đường tròn (`duong_tron`) → Hình vành khuyên (`hinh_vanh_khuyen`). **Topic: pass.**
- Evidence: Annulus radii 1.5 and 5, pi approximation and rounding retained; annulus leaf exact.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 2 (PHẦN III) — PASS
- Candidate `candidate-18`; question `d6af0c35-6726-4568-b91c-74c3d5300e0f`.
- Body blocks `[284, 285, 286, 287, 288, 289, 290, 291, 292, 293]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Bất đẳng thức và bất phương trình (`bd_bpt`) → Bất đẳng thức (`bat_dang_thuc`). **Topic: pass.**
- Evidence: Maximize √(x−16)/(3x), x≥16; inequality/optimization placement is defensible. PDF resolves radical scope; raw math remains flattened.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 3 (PHẦN III) — PASS
- Candidate `candidate-19`; question `32892abe-8bea-4644-a0a4-d7b65dacd598`.
- Body blocks `[294, 295, 296, 297, 298, 299]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Hệ thức lượng và tỉ số lượng giác trong tam giác vuông (`tam_giac_vuong_ty_so`). **Topic: pass.**
- Evidence: Trig expression sinα−2cosα at 30° with rounding retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 4 (PHẦN III) — PASS
- Candidate `candidate-20`; question `d9b008a2-43f7-49ff-b36b-8a6bcc80ce4c`.
- Body blocks `[300, 301, 302, 303, 304, 305, 306, 307]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Căn thức bậc hai (`can_thuc`) → Tính toán và rút gọn biểu thức chứa căn (`can_thuc_tinh_toan`). **Topic: pass.**
- Evidence: Numerical radical arithmetic; all vertical expression tokens retained.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Câu 5 (PHẦN III) — PASS
- Candidate `candidate-21`; question `9a2df9c0-dfa1-494c-909c-e5657e145697`.
- Body blocks `[308, 309, 310, 311, 312]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Đại số (`dai_so`) → Bất đẳng thức và bất phương trình (`bd_bpt`) → Bất phương trình bậc nhất một ẩn (`bpt_bac_nhat`). **Topic: pass.**
- Evidence: Minimum weighted-average subject mark; all weights, given marks and rounding retained; linear inequality leaf fits.
- Upstream fidelity limitation: no additional item-specific loss flagged; generic text-extraction caveat remains.

#### Câu 6 (PHẦN III) — PASS
- Candidate `candidate-22`; question `8aeceb68-e439-4af4-9bef-f88c2c21c039`.
- Body blocks `[313, 314, 315, 316, 317, 318, 319, 320]`; context `[]`.
- Complete ancestry: Kho câu hỏi (`root`) → Hình học (`hinh_hoc`) → Hệ thức lượng và tỉ số lượng giác trong tam giác vuông (`tam_giac_vuong_ty_so`). **Topic: pass.**
- Evidence: Ground illumination length; height 2.95, baseline 1.88, angle spread 25°, rounding retained; applied right-triangle trigonometry fits. PDF confirms order D–C–A; diagram absent upstream.
- Upstream fidelity limitation: yes; not charged as model boundary/organization error.

#### Unused/ignored complement

- Block 0 / input line 1: acceptable administrative/header/blank/end-marker omission; `Mã đề 901 Trang 1/2`
- Block 1 / input line 2: acceptable administrative/header/blank/end-marker omission; `UBND PHƯỜNG HỒNG AN`
- Block 2 / input line 3: acceptable administrative/header/blank/end-marker omission; `TRƯỜNG THCS QUÁN TOAN`
- Block 3 / input line 4: acceptable administrative/header/blank/end-marker omission; `--------------------`
- Block 4 / input line 5: acceptable administrative/header/blank/end-marker omission; `(Đề thi có 02 trang)`
- Block 5 / input line 6: acceptable administrative/header/blank/end-marker omission; `ĐỀ KIỂM TRA CUỐI HỌC KÌ I`
- Block 6 / input line 7: acceptable administrative/header/blank/end-marker omission; `NĂM HỌC 2025 - 2026`
- Block 7 / input line 8: acceptable administrative/header/blank/end-marker omission; `MÔN: TOÁN`
- Block 8 / input line 9: acceptable administrative/header/blank/end-marker omission; `Thời gian làm bài: 90 phút`
- Block 9 / input line 10: acceptable administrative/header/blank/end-marker omission; `(không kể thời gian phát đề)`
- Block 10 / input line 11: acceptable administrative/header/blank/end-marker omission; `Họ và tên: ............................................................................Số báo danh: ....... Mã đề 901`
- Block 11 / input line 12: acceptable administrative/header/blank/end-marker omission; `PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn. Thí sinh trả lời từ câu 1 đến câu 12. Mỗi`
- Block 12 / input line 13: acceptable administrative/header/blank/end-marker omission; `câu hỏi thí sinh chỉ chọn một phương án.`
- Block 179 / input line 180: required task-mode instruction improperly omitted; `PHẦN II. Câu trắc nghiệm đúng sai. Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d)`
- Block 180 / input line 181: required task-mode instruction improperly omitted; `ở mỗi câu, thí sinh chọn đúng hoặc sai.`
- Block 277 / input line 278: acceptable administrative/header/blank/end-marker omission; `PHẦN III. Câu trắc nghiệm trả lời ngắn. Thí sinh trả lời từ câu 1 đến câu 6.`
- Block 283 / input line 284: acceptable administrative/header/blank/end-marker omission; `Mã đề 901 Trang 2/2`
- Block 321 / input line 322: acceptable administrative/header/blank/end-marker omission; `------ HẾT ------`

## Machine-readable evidence

[JSON review](<docs/evaluations/math9-ten-topic-tree/repair-pass-2026-11-17T09-01-11-757Z/current-first-four-review.json>) includes all question IDs, retained texts, block/line references, full topic ancestry, per-source unused-block decisions and frozen reference hashes.
