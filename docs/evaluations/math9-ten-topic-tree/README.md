# Ten-paper Math9 held-out corpus

This corpus preparation run performed **no model inference**, database access, application import, runner edit, or production taxonomy change. All ten papers are new relative to the prior three-paper corpus. All modifications are confined to this directory and `.data/math9-ten-evaluation/`.

## Subsequent execution (2026-11-17)

The sections below preserve corpus-preparation provenance; their “no inference” statements describe preparation only, not the later evaluation. Actual-provider execution now covers all ten papers with163retained questions and45AI-created nodes. Whole-bank self-review failed exact assignment coverage (162/163), so this is **not** a clean end-to-end pass. Checkpoint continuation followed failed/duplicated attempts; no semantic output repair was made.

Start with [current-lineage findings](<current-lineage-findings.md>), [actual tree](<repair-pass-2026-11-17T09-10-58-522Z/actual-tree.md>), [self-review rejection](<repair-pass-2026-11-17T09-10-58-522Z/self-review-rejection.md>), [checkpoint correction](<checkpoint-correction.md>), [provider accounting](<provider-accounting.json>) and [execution record](<execution-record.md>). Later generic response-instruction prompt repair is not included in the actual-provider scores. Final semantic review/deployment evidence are separate from corpus freeze.

## Authoritative artifacts

- `source-manifest.json`: schema version 1 JSON object with `sources` array, ten items. Compatible field names with the previous evaluation: `id`, `source_url`, `download_url`, `sha256`, `original_path`, `extracted_path`, `exam_only_path`, `exam_only_sha256`, `printed_top_level_count`, `preferred_retained_count`, `raw_exam_line_range`, `pdf_pages`. Adds extraction/source-page hashes, inclusive original PDF page bounds, line convention, variant, fidelity notes, and explicit input contract. `excluded_sources` records rejected scanned Tĩnh Gia PDF.
- `independent-gold.md`: held-out, per-paper/per-question expected boundaries, content and free-form topic descriptors. Never pass it to extraction or organization. **Not a taxonomy seed or model topic mapping.**
- `gold-freeze.sha256`, `manifest-freeze.sha256`: final pre-inference freezes. Nothing has been inferred against them.
- `corpus-validation.json`: offline verification summary. 154 printed questions, 167 preferred independent retained units; count is not a standalone correctness oracle.
- `verify-corpus.py`: run `python3 docs/evaluations/math9-ten-topic-tree/verify-corpus.py` from repository root. Verifies hashes, exact LF-line slices, distinct PDF hashes, freeze hashes and answer-heading exclusion. No network or inference.

## Physical corpus format

Each `.data/math9-ten-evaluation/<paper-id>/` contains downloaded `original.pdf`, `source-page.html`, `pdfinfo.txt`, full `extracted.txt` and exact `exam-only.txt`. Quán Toan also contains `extracted-raw-order.txt` (the designated extraction instead of layout mode) and a visually inspected page render. Download-only intermediate `collection.json`, `collection-revised.json`, `excluded-sources.json` are provenance, **not the authoritative input manifest**.

UTF-8 exam captures are unedited pdftotext output slices, using **LF only** as the line delimiter, preserving formfeeds and blanks. Reproduce with the per-source `capture_command`, then join extracted LF lines `[start-1:end]` from `raw_exam_line_range`. Never use Python `splitlines()` for this: it splits formfeed too. Do not feed original PDFs directly: they include matrices, variants and/or marking schemes outside capture bounds.

A future evaluator should read only `sources[].exam_only_path` for model content, use generic document titles, and create one HTML paragraph/source block per physical LF line exactly as the old runner's neutral capture function. Do not split by gold question bounds, import expected counts or descriptions, or supply topic names/hierarchy. This preparation **does not modify the old runner**; it still points at the prior corpus and must not be mistaken for a ten-paper runner.

## Sources and coverage

| Paper | Term | Mirror region | Printed | Preferred |
|---|---|---|---:|---:|
| Huỳnh Thúc Kháng, code 1 | HK1 | Đà Nẵng | 16 | 20 |
| Tương Bình Hiệp | HK1 | TP HCM | 8 | 11 |
| Trần Quý Cáp | HK1 | Đà Nẵng | 17 | 21 |
| Quán Toan, code 901 | HK1 | Hải Phòng | 22 | 22 |
| PTDTBT Thái Niên, đề 1 | HK1 quality survey | Lào Cai | 22 | 22 |
| Ngô Gia Tự, đề 01 | HK2 | Hà Nội | 5 | 7 |
| Trần Quốc Tuấn | HK2 | TP HCM | 6 | 6 |
| Trần Quang Diệu | HK2 | Gia Lai | 21 | 21 |
| Đông Cương, đề chẵn | HK2 | Thanh Hóa | 15 | 15 |
| Trần Phú | HK2 | Hải Phòng | 22 | 22 |

Exact source-page/download URLs and full hashes are in the manifest. They were public HTTPS downloads from THCS.TOANMATH.com; this is one third-party mirror, not ten independently authenticated school publishers. PDFs have ten distinct SHA256s, but the soup-and-stones question recurs across Trần Quốc Tuấn and Trần Phú: useful for consistency, not evidence of question-level uniqueness.

## Failures and limitations

- `web_search` failed with malformed/truncated endpoint JSON. `web_fetch` succeeded on HK1 category and Trần Quang Diệu article; ordinary HTTPS category/source-page discovery and PDF downloads succeeded. No endpoint configuration was changed.
- Initial `python` command failed (not installed); all collection/verification used `python3` successfully.
- Tĩnh Gia HK1 PDF is scanned; pdftotext produces only formfeeds. Original retained under the new corpus directory but **excluded from the ten**. Replaced with Trần Quý Cáp. No OCR was run; installed Tesseract lacks Vietnamese language data.
- Quán Toan A3 two-column typesetting interleaves questions in layout mode. Raw-order extraction selected after reading both captures and visually inspecting original page 1. No text content was manually repaired.
- Charts, diagrams, root bars and fraction placement are not lossless in plain text. Gold documents affected tasks and restricts formula-sensitive scoring. No source solutions were used as model input.
- New physical data lives under `.data/`, which repository ignore rules exclude; preserve/archive that directory separately if transferring the corpus. The docs manifest alone cannot recreate immutable historical bytes without downloads matching recorded hashes.
