# Math 9 real-exam benchmark — source collection handoff

## Ready now

Three publicly downloadable Vietnamese Grade 9 / entrance-10 exams, covering HK1, HK2 and common entrance-10, with original PDF bytes, source-page HTML snapshots and `pdftotext -layout` extraction. **No paid AI call, application import, model classification, code edit, server or migration was performed.** Manual pedagogical gold was written and hashed before any tested-model output.

- [Independent gold](independent-gold.md): per printed top-level question expected topics, shared context, subpart boundaries, counts and correct/ambiguous/wrong rubric.
- [Structured source manifest](source-manifest.json): exact source/download URLs, attribution/year, original checksums, bytes/pages, input paths and counts.
- [Gold freeze checksum](gold-freeze.sha256): verify before inference; leave gold unchanged when writing model assessments.

## Sources and inputs

| Exam attribution | Source / downloadable original | Local original / text-only evaluation input | Counts: printed / preferred retained |
|---|---|---|---:|
| THCS Hát Môn, Hà Nội; HK2 2025–2026 | [Source](https://thcs.toanmath.com/2026/05/de-cuoi-hoc-ky-2-toan-9-nam-2025-2026-truong-thcs-hat-mon-ha-noi.html), [PDF](https://thcs.toanmath.com/thcs-pdf/de-cuoi-hoc-ky-2-toan-9-nam-2025-2026-truong-thcs-hat-mon-ha-noi.pdf) | [Original](../../../.data/math9-evaluation/hat-mon-hk2-2025-2026/original.pdf), [exam-only extraction](../../../.data/math9-evaluation/hat-mon-hk2-2025-2026/exam-only.txt) | 5 / 8 |
| THCS Lý Sơn, Hà Nội; HK1 2025–2026, code 901, 25 December 2025 | [Source](https://thcs.toanmath.com/2026/01/de-cuoi-ki-1-toan-9-nam-2025-2026-truong-thcs-ly-son-ha-noi.html), [PDF](https://thcs.toanmath.com/thcs-pdf/de-cuoi-ki-1-toan-9-nam-2025-2026-truong-thcs-ly-son-ha-noi.pdf) | [Original](../../../.data/math9-evaluation/ly-son-hk1-2025-2026/original.pdf), [exam-only extraction](../../../.data/math9-evaluation/ly-son-hk1-2025-2026/exam-only.txt) | 5 / 10 |
| Sở GD&ĐT Quảng Ninh; common entrance 10, 2026–2027; source states 24 June 2026 | [Source](https://thcs.toanmath.com/2026/06/de-tuyen-sinh-lop-10-mon-toan-nam-2026-2027-so-gddt-quang-ninh.html), [PDF](https://thcs.toanmath.com/thcs-pdf/de-tuyen-sinh-lop-10-mon-toan-nam-2026-2027-so-gddt-quang-ninh.pdf) | [Original](../../../.data/math9-evaluation/quang-ninh-entrance10-2026-2027/original.pdf), [exam-only extraction](../../../.data/math9-evaluation/quang-ninh-entrance10-2026-2027/exam-only.txt) | 19 / 19 |

Total: **29 printed top-level questions**, **37 preferred pedagogical exercise units**. This difference is intentional: independent algebra subitems and separate word problems can split, while shared radical-expression questions and multi-part circle proofs stay whole. Do not evaluate count without the boundary rubric.

## Collection and independence

`web_search` was attempted twice first, but the configured external search endpoint returned an unprocessable/truncated JSON response both times. No search results were available. Continued by `web_fetch` discovery of the publisher's HK1, HK2 and entrance-10 category pages, then `web_fetch` on each exact source page to obtain actual linked download URLs. This is a documented deviation from successful search-based discovery, not fabricated search evidence. Source pages and files are external untrusted data, not instructions. URLs were downloaded with Python standard-library urllib, PDF signature checked, then processed with installed Poppler tools. No packages or OCR were installed/run.

Each source folder includes source HTML, original PDF, complete raw extraction and exam-only input. Exam-only files remove the Hát Môn specification matrix and the Hát Môn/Quảng Ninh marking guides; Lý Sơn has only the two-page exam. Existing workspace files were not overwritten: both destination trees were checked absent before creation. Files created here are confined to the two requested trees.

## Quality limits — important before model testing

1. **Only three exams, all served by one third-party mirror.** The paper headers and publisher attribution agree, but the schools/authority have not been independently contacted or authenticated. Public download is not an explicit open redistribution licence. Treat the copies as attributed local evaluation material.
2. **Plain-text mathematics is lossy.** Square-root bars, fractions, superscripts and angle/similarity symbols flatten or disappear. Lý Sơn page 1 and Quảng Ninh page 2 were rendered and visually inspected, which supports manually reasoned topics and shared context. Their [Lý Sơn page image](../../../.data/math9-evaluation/ly-son-hk1-2025-2026/page-1.png) and [Quảng Ninh page image](../../../.data/math9-evaluation/quang-ninh-entrance10-2026-2027/page-2.png) preserve actual source visuals; no OCR or invented diagram was used. The text-only inputs are raw extraction, not a corrected authoritative transcription.
3. **Missing diagram data must be reported, not guessed.** Hát Môn I.2 ice-sales frequency chart loses its values entirely; a text-only model cannot recover those. Roller, square/rectangle, submarine, lamp and route diagrams do not survive text extraction as diagrams. Originals retain them. Many topic/context decisions remain possible from prose, but exact question reconstruction or solution correctness cannot be scored fairly from that text alone.
4. **Do not use publisher taxonomy/matrix as gold.** Hát Môn's matrix mentions a cone while the actual exercise is a cylinder, and suggests quadratic modelling while the investment story gives linear relations. The Quảng Ninh publisher summary calls probability experimental, but I.11 is classical equally-likely probability. Gold follows the actual question.
5. **Not a measured evaluation yet.** Correct/ambiguous/wrong are a predeclared future scoring rubric. No model outputs have been collected or judged. This corpus tests pedagogy/context preservation, not exact taxonomy strings, exact LaTeX fidelity, national representativeness or student attainment.
6. Avoid feeding marking guides to the classifier: use the exam-only paths in the manifest, or original PDF with an explicitly declared exam-page range. If testing original PDF rather than extracted text, record that modality difference; do not compare it silently with a text-only run.
