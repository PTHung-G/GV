# Feature Specification: Bộ mã đề, bản in và chấm đồng bộ

**Feature Branch**: `003-exam-variant-print`
**Created**: 2026-11-15
**Status**: Ready for planning
**Input**: User delegates research, idea validation and complete implementation of teacher-friendly multi-code exams, safe shuffling/numeric variants, synchronized QR print/grading.

## User Scenarios & Testing

### US1 — Chốt bộ in ngay tại trình soạn (P1)

Giáo viên mở nút Chốt đề & xuất PDF, rà soát đề/barem, chọn mã và chốt bộ in; không làm lại wizard chấm. Có thể mở lại, in riêng đề/barem/phiếu hoặc toàn bộ từng loại. Bản chốt không thay đổi khi sửa đề nguồn.

**Why**: core requested convenience and correct identity.
**Independent Test**: publish one code from editor, reload, reprint; edit source then reprint old release unchanged.
**Acceptance**:
1. Given owned exam with complete reviewed rubric, when publish, then exam/key/sheet display same mã đề and release identity, grading ready automatically.
2. Given publish retry/concurrent double-click, then one release only; failure creates no partial variant set.
3. Given missing/stale key, then explain correction/review requirement, never silently use guessed answers.
4. Given existing unlinked preview sheet, then clearly distinguish from published gradeable sheet; new normal action prioritizes linked publish.

### US2 — Tạo nhiều mã có ánh xạ đúng (P1)

Giáo viên chọn mã (defaults101–104, editable, 1–12 codes), shuffle question order within reviewed sections/groups, and/or shuffle A–D options. Preview shows original→printed mapping and linked key. They can pin questions/options and group consecutive questions with common passage.

**Independent Test**: fixture MC/mixed exam with formulas/figure and dependent options; several seeds; all content preserved once; answer remaps correct and totals unchanged.
**Acceptance**:
1. Grouped passage/subparts move atomically, preserve internal order; ambiguous structure is not silently shuffled.
2. Options with references to letters/order or all-above are pinned with explanation; only marked label positions relabel, never formula/body strings.
3. Essay criteria move with question; unsupported types/duplicate numbering/ambiguous nested source trigger actionable block or keep-order path, not data loss.
4. Same input/settings/seed yields same preview; publish stores exact preview with server validation; duplicate effective permutations reported rather than pretending unique.

### US3 — Chụp mã nào nhận đúng mã đó (P1)

Giáo viên enters a release workspace and scans mixed codes; paired phone can do the same without full teacher account. QR selects exact stored template/rubric before reading answers. Unknown, wrong-release, missing/unreadable QR cannot produce automatic scores and presents retake/manual resolution guidance.

**Independent Test**: two variants equal question count but different answers; synthetic images/QR route to correct frozen template/session; wrong variants create no grades.
**Acceptance**:
1. QR binds release+variant+snapshot/rubric/template identity via server-verifiable token; visible code alone not trusted.
2. Source edits/new release cannot modify grading of old printed papers.
3. Wrong/legacy QR in published variant session rejected before score/AI fallback; legacy sessions retain explicitly separate behavior.
4. Bundle capture capability grants only its release variants, not arbitrary teacher sessions; owner isolation on print/reprint/routes.
5. Student reassignment/duplicate scans have explicit review behavior, never silently double-confirm across variants.

### US4 — Biến thể số liệu có kiểm chứng (P2)

Giáo viên can opt selected question into an explicit supported parameter recipe, preview generated statement/options/solution per code and acknowledge replacement. No arbitrary find/replace numeric editing. Initial recipes: perfect-square square roots, integer linear equations, exact rational addition. Each binds full statement/options/answer/explanation; teacher knows original question is replaced by that template.

**Independent Test**: enumerate finite recipe domains; all generated questions have one unique correct option, valid domain and regenerated solution; selected seed persisted.
**Acceptance**:
1. Only selected questions replaced, parameters/rendered proof recorded in release; no hidden changes to original doc.
2. Runtime verifies derived answer/distractor uniqueness/domain; invalid recipes/config refused.
3. Unsupported free-text numeric rewrite is unavailable with clear reason, not delegated to unchecked AI.

## Edge Cases

- More than60 MC, zero MC, missing points, malformed key, duplicate/restarted numbers, partial/no choices, nested containers.
- Passage before first question vs global instructions, cross-references, multiple sections, shared tables/images and page breaks.
- Key stale by content hash, recently typed unsaved editor data, publish while source changes.
- Concurrent publish retries, QR altered/missing, captured variant from another release/owner, session deleted/archived, stale geometry after deploy.
- Slow loads/errors, mobile dialog/phone camera permission, no AI credentials.

## Functional Requirements

- **FR001** Owned persistent releases contain immutable source snapshot/settings/seed/algorithm version/variants/rendered artifacts/rubric/template/provenance.
- **FR002** Atomic idempotent publication; reprints use stored output/geometry, not regenerated mutable builders.
- **FR003** Server validates one-to-one question/key mapping and source review, bounded settings and permutation invariants. Never rely solely on browser current-key flag or dummy layout answers.
- **FR004** Separate teacher artifact from student outputs; no answer leak in sheets/exam HTML.
- **FR005** Same human-visible mã đề and release reference on all three artifacts; opaque verifiable QR on sheets; reproducible mapping visible to teacher.
- **FR006** Strict supported parser preserves content; reviewed atomic grouping/pinning and stable identities; unsupported source fails explicitly with keep-original single-code route where valid.
- **FR007** Validated question/option permutations remap rubric and printed key, preserve points/types and sections.
- **FR008** Recipe-only numeric transformations include explicit replacement preview, parameter constraints, runtime exact verification, stored provenance.
- **FR009** One editor workflow and persistent release library/reopen link; print individual/all codes per artifact with browser Save PDF accurately described.
- **FR010** QR-first mixed scan routes authorized frozen template/session, rejects unresolved identity before submissions/score writes; published OMR and AI completion cannot bypass identity.
- **FR011** Release-scoped phone pairing; no widening existing single-session capture grant.
- **FR012** Existing legacy editor/session flows remain compatible but do not claim unlinked sheets gradeable.
- **FR013** No secrets/answers in QR token; authorized fetch only, bounds/origin checking, no untrusted HTML script execution.
- **FR014** Teacher review required before publish; stale key requires update; legacy imported key requires explicit review.
- **FR015** Published variant session deletion cannot orphan release artifacts/identity. Grades maintain source provenance.
- **FR016** Errors visible; no fake PDF downloads, no silent truncation/case conversion, no false successful publication.

### Key Entities

- **Release**: owned immutable preparation of an exam, identity and source revision, review, settings and idempotency key.
- **Variant**: visible code, transformed question/option mapping, exact exam/key/blank sheet, rubric, geometry and grading destination.
- **Question group**: atomic reviewed dependent question set; sections and pinning constraints.
- **Numeric recipe**: explicit finite-domain template with version, deterministic parameters/evaluator/solution.
- **Capture grant**: expiring release-scoped limited phone access.
- **Submission provenance**: verified printed identity and selected immutable variant.

## Success Criteria

- **SC001** Teacher publishes and reprints1–12 codes from editor without opening old setup wizard.
- **SC002** All randomized test cases preserve supported question content/point totals and correct answer mapping.
- **SC003** All invalid/missing/mismatched identity test cases reject before scoring; mixed valid codes grade against their own key.
- **SC004** Reprints after source modification/deploy use same frozen exam/key/sheet data.
- **SC005** Every enabled numeric recipe passes finite-domain and runtime uniqueness/correctness checks.
- **SC006** Desktop and phone workflows display actionable failure states; existing regression suite remains green or unrelated failures documented/fixed honestly.

## Assumptions & Boundaries

- Initial OMR only single A–D up to60; no promise of generic TF/short-answer scanner. Mixed essay keeps manual/AI-review grading already supported, subject to identity validation.
- Arbitrary HTML semantic dependency detection not guaranteed; cautious parser plus explicit teacher groups/pins required. No AI-as-proof.
- New release per revision; edits never mutate released variants. Human code need only unique within release; QR identity global.
- Browser printing supports Save PDF; PDF isn't silently server-generated. Existing auth/database/deployment reused.
- Research documents local evidence and web-search failure; no false official Vietnamese assessment-policy claims.
