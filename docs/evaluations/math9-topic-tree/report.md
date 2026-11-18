# Public math9 first-pass evaluation — T014/T015

## Verdict

**The real pipeline ran successfully, but this is not a semantic acceptance pass or lossless PDF ingestion.** One Playwright test passed; all three extractions reached review and all three incremental organizations completed. Retained units were **8 + 5 + 19 = 32**, compared with **29 printed questions** and **37 preferred pedagogical units** in the frozen reference. Topic-path review: **27 correct, 3 ambiguous/too broad, 2 wrong** across 32 retained units. On the 37 preferred-unit axis: **27 correct, 8 ambiguous, 2 wrong**. These are manual semantic judgments, not exact taxonomy-string accuracy and not independent statistical estimates.

No core AI/store changes were made, no expected taxonomy was seeded, no provider retry was requested, and all first-pass outputs remain intact. T016 is intentionally for the parent; the demonstrated faults below should guide a minimal regression-backed fix, not retroactive edits of this run.

## Protocol and provenance

Read [independent gold](<independent-gold.md>) before provider outputs; verified its [freeze hash](<gold-freeze.sha256>) before and after the run. Gold SHA-256: `39f2f4e46b5fe38c8d176896767a029dc3d6523ed55d01b2ff6a2063b4e70b3f`. [Source manifest](<source-manifest.json>) SHA-256: `bd6b16c716c0721afd818fc1aa836d92e190b6a84e51f37a96c81acf40847ab9`. All three original PDF and exam-only text hashes matched the manifest before inference. Gold contents and expected counts/topics were not used to construct model inputs.

[Runner](<../../../scripts/math9-topic-evaluation.ts>) calls existing production `saveSource`, `processBank('extract')`, `confirmSource`, then `processBank('organize')` directly and sequentially for each source. Every physical text line becomes one escaped top-level HTML paragraph, preserving whitespace, line endings and formfeeds; block offsets are exact JavaScript string ranges into the captured HTML. This is question-boundary-oblivious capture, not a manually pre-segmented gold fixture. Only manifest exam-only text enters the production services: no source matrix, solution pages, answer key, gold rationale, or expected taxonomy. Originals/extractions remain in their manifest locations.

Fresh dedicated Docker PostgreSQL 16 Alpine container `math9-eval-20261116`, bound only to `127.0.0.1:55439`; runner refused a nonempty schema, applied existing migrations, created a synthetic `example.test` owner and deleted that owner on exit. Container was stopped after collection, not the app DB. No app build/server/reset, private documents, provider credentials, endpoint URLs or request headers were output.

### Exact commands

```sh
.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks
sha256sum -c docs/evaluations/math9-topic-tree/gold-freeze.sha256
docker run -d --name math9-eval-20261116 --label purpose=math9-public-evaluation -e POSTGRES_HOST_AUTH_METHOD=trust -p 127.0.0.1:55439:5432 postgres:16-alpine
QUESTION_BANK_PROVIDER_SMOKE=1 QUESTION_BANK_TEST_PORT=55439 pnpm exec playwright test --config=docs/evaluations/math9-topic-tree/playwright.config.ts
pnpm exec tsc --noEmit --pretty false
sha256sum -c docs/evaluations/math9-topic-tree/gold-freeze.sha256
docker stop math9-eval-20261116
```

Provider test: **1 passed (3.8m), exit 0**, no skips. Initial TypeScript check exited 2 due to concurrent parent-owned implementation references to not-yet-created `structured-exam` and their dependent test inference errors; **no runner/config errors were listed**. This is not a claim of a clean full-project typecheck. No tasks/checklists files were modified. No before/after implementation extension hooks were registered.

## Model, timing and usage

Configured `chib/deepseek-v4.1-flash`; all six actual successful responses reported **deepseek-v4.1-flash**, HTTP 200. Temperature/max-token/signal behavior is the unmodified production service. The runner itself does no retries; production transport has its existing retry machinery, but telemetry demonstrates exactly six attempts, one per stage. Run: 2026-11-16 09:22:46.602–09:26:33.155 UTC.

| Stage | Transport ms | Prompt tokens | Completion tokens | Total |
|---|---:|---:|---:|---:|
| Hát Môn extract | 27,387 | 2,686 | 5,134 | 7,820 |
| Hát Môn organize | 23,210 | 5,020 | 4,955 | 9,975 |
| Lý Sơn extract | 46,406 | 2,896 | 9,430 | 12,326 |
| Lý Sơn organize | 25,107 | 9,841 | 5,017 | 14,858 |
| Quảng Ninh extract | 38,027 | 5,059 | 7,464 | 12,523 |
| Quảng Ninh organize | 65,227 | 27,169 | 15,483 | 42,652 |
| **Total** | **225,364** | **52,671** | **47,483** | **100,154** |

Reasoning tokens reported: 42,121 (subset of completion tokens, not additional). Cost was not reported; no invented monetary estimate. [Telemetry](<first-pass-2026-11-16T09-22-46-602Z/telemetry.json>) retains full successful model choices including reasoning/output and timing/usage, not request secrets.

## Separate scoring axes

| Source | Captured blocks | Printed / preferred / retained | Extraction of supplied text | Grouping | Topic paths |
|---|---:|---|---|---|---|
| Hát Môn | 64 | 5 / 8 / 8 | Exact raw/blocks; all visible task text retained | 8 correct | 8 correct |
| Lý Sơn | 69 | 5 / 10 / 5 | Exact raw/blocks; all visible task text retained | 2 correct, 3 ambiguous merged units covering 8 preferred units | 2 correct, 3 ambiguous/too broad |
| Quảng Ninh | 116 | 19 / 19 / 19 | Exact raw/blocks; all visible task text retained | 19 correct | 17 correct, 2 wrong full-path ancestors |

Storage/execution checks passed: exact raw HTML and block arrays for 3/3 sources; zero duplicate body IDs; zero unreferenced captured blocks; confirmation idempotent for 3/3; durable close/reopen reload exact; incremental old source/question content unchanged apart from permitted topic movement; bounded valid final tree. All three composite circle exercises retain their setups and nine a–c subparts without severing into context-free exercises. **All 32 materialized units nevertheless have irrelevant non-body context pollution.** Thus source retention is a pass but dependency selectivity is not. No aggregate “everything passed” claim is warranted.

Per-question actual **full paths**, mapping to every gold unit and reasons are in [review table](<review-table.md>) and [machine-readable semantic review](<semantic-review.json>). [Actual materialized questions](<first-pass-2026-11-16T09-22-46-602Z/question-review.json>) retain full text/HTML plus body/context IDs, enabling independent auditing beyond labels.

## Demonstrated faults for parent (no fixes applied)

1. **Global fallback dependency pollution.** Production candidate validation adds every non-body block to every candidate, including blocks explicitly assigned only as another question's context. Hát Môn every question inherits unrelated Bài II/III/IV headings and detached square-figure label P. Quảng Ninh every question inherits both section headings, exam chrome and detached similarity marker S. Lý Sơn every question inherits unrelated headers/page numbers/farewell. Blocks are not lost, but all 32 snippets are polluted. Fix with explicit scoped dependencies/chrome semantics and regression tests; do not discard originals or secretly rewrite this first pass.
2. **Under-segmentation and overly broad retrieval.** Lý Sơn Bài I groups four independent algebra tasks, Bài II groups independent distance and production stories, Bài IV groups submarine trigonometry with a circle proof. Gold permits intact mixed printed Bài, so these three retained units are **ambiguous**, not wrong/lost. Retained count 5 versus preferred 10 is not alone a failure. Shared A/B algebra and complete circle proofs must remain together when improving separation.
3. **Incremental semantic ancestry fault.** Quảng Ninh I.8 goes through `Hình trụ và diện tích xung quanh → Thể tích hình trụ`. Correct volume leaf is attached under an area-specific inherited parent rather than a general cylinder parent. Scored wrong for **full-path semantics**, not for the relevant leaf. A reviewer interpreting the parent as a loose cylinder umbrella could soften this to ambiguous; that changes totals to 27 correct / 4 ambiguous / 1 wrong, not a flawless pass.
4. **Probability under statistics.** Quảng Ninh I.11 is `Thống kê → Xác suất`, although the task is classical equiprobable selection, not statistical/experimental probability. Correct leaf does not rescue an incorrect specific ancestor. A joint statistics-and-probability umbrella would be defensible; current label is only statistics.

Broad geometry placement for composite proofs is deliberately not penalized. Quảng Ninh II.6 at the shared cyclic/relations composite node is defensible despite additional similarity/midpoint topics. Lý Sơn III at radical expressions is relevant even though damaged source typography cannot be recovered from the text.

## PDF/input limitations — not successes

**Exact retention of a lossy text snapshot does not equal complete mathematical PDF ingestion.** Hát Môn I.2 lacks chart values outright; it cannot be used to answer the numerical chart questions. Original charts/figures are retained only in source PDFs, not passed as images to this text-only model. Lý Sơn radicals, powers, fractions and angles are flattened, especially I and III. Quảng Ninh I.10 root scope, II.1 excluded 9/4, II.4 radical scope, II.6 similarity symbol and II.7 footpoint/order geometry are damaged or absent. Original gold includes independent visual interpretation; the evaluated provider did not get that transcription. Topic/boundary review can proceed but numerical formula/diagram fidelity is **unscorable/incomplete**, not passed. No invented diagram values or repaired gold formulas were inserted.

Only three papers, one provider/model and one first pass were tested. These results do not establish robustness across providers, all Grade 9 curricula or adversarial inputs. The source mirror is third-party, not independent school verification. No browser/authenticated deployed app/native zero-extraction flow was tested by this runner.

## Evidence inventory

- [Runner](<../../../scripts/math9-topic-evaluation.ts>) and [isolated Playwright config](<playwright.config.ts>).
- [Final full bank](<first-pass-2026-11-16T09-22-46-602Z/final-bank.json>), [transport output/usage](<first-pass-2026-11-16T09-22-46-602Z/telemetry.json>), [coverage](<first-pass-2026-11-16T09-22-46-602Z/coverage.json>), [materialized full questions](<first-pass-2026-11-16T09-22-46-602Z/question-review.json>).
- Each source has exact `.input.txt`, `.input.html`, `.input.json` plus `.extracted-bank.json`, `.confirmed-bank.json`, `.organized-bank.json` within the timestamped first-pass directory. These retain complete first-pass snapshots, not selected success excerpts.
- [Full-path human review](<review-table.md>) and [separate-axis judgments](<semantic-review.json>).

Frozen gold/manifest unchanged. Parent owns marking T014/T015 and any T016 changes/rerun; future evidence should use a new timestamped run and append a final-results section without replacing this initial report/evidence.

## T016 final pass — appended 2026-11-16

The historical first-pass findings above are unchanged. Production extraction now uses explicit block accounting: every block must be body, deliberately scoped context, or declared chrome in `ignoredBlockIds`. No implicit broadcast occurs. Missing coverage fails safely; rich media/math cannot be ignored. Complete legacy `{questions}` responses remain accepted as ignoring nothing. The old default validator policy remains for compatibility, but production explicitly selects strict coverage. Shared setup is permitted only where declared; bodies stay disjoint. Exact original HTML blocks remain the materialization source.

The domain-neutral extraction prompt separates independent tasks within printed sections without fragmenting connected expressions, systems, choices or proofs. The organization prompt checks every ancestor and requires each parent to encompass all descendants; it allows justified relabel/reparent of existing nodes, not a fixed mathematical taxonomy. Full question HTML is supplied (no per-question 5,000-character truncation), with a fail-closed total prompt cap of 160,000 characters. Organization token allowance is 22,000 after a retained provider-length failure at 14,000. These prompt rules improve the observed result but are not a deterministic semantic guarantee.

### Successful final evidence and separate axes

The same three hashed exam-only snapshots were run sequentially through production save → extract → confirm → incremental organize in a fresh isolated PostgreSQL database, using configured `chib/deepseek-v4.1-flash` (returned `deepseek-v4.1-flash`). All three extraction and organization stages completed; six paid calls, no automatic paid retry within a run. Elapsed provider calls: 26.451s, 44.984s, 26.794s, 28.860s, 34.115s, 54.145s. Usage: 26,855 prompt + 42,988 completion = 69,843 total tokens. Gold and manifest rehashed after the run unchanged.

| Axis | First pass | Final pass |
|---|---|---|
| Retained snippets Hát Môn / Lý Sơn / Quảng Ninh | 8 / 5 / 19 (32) | 8 / 8 / 19 (35) |
| Topic, full ancestry, retained snippets | 27 Correct / 3 Ambiguous / 2 Wrong | 35 Correct / 0 Ambiguous / 0 Wrong |
| Fixed preferred boundary axis (37 gold units) | 27 Correct / 8 Ambiguous / 2 Wrong | 33 Correct / 4 Ambiguous / 0 Wrong |
| Context pollution | 32 polluted | 0 polluted; 35 clean |
| Captured source/block fidelity | Exact captured source, not PDF losslessness | Exact all 3 captured sources; 0 duplicate body references |
| Original PDF chart/formula fidelity | Incomplete/unscorable | Still incomplete/unscorable, NOT passed |

All 35 actual full paths and scoped dependencies were manually reviewed; all 58 ignored blocks (13/19/26) were checked as metadata, blanks, section/scoring instructions or footers, not mathematical data. Lý Sơn II.1/II.2 and IV.1/IV.2 are now independently reusable. Lý Sơn I.1a/b and I.2a/b remain two paired snippets rather than four independent preferred units because independent expressions occur on the same immutable physical-line blocks; splitting those would require richer capture or source rewriting. These four preferred units remain Ambiguous, not falsely passed. The three connected circle proofs and expression composites stay whole.

Actual final Quảng Ninh cylinder-volume ancestry is `Kho câu hỏi → Toán học → Hình học → Hình trụ: diện tích xung quanh và thể tích`; no area-only ancestor remains. Classical probability is `Kho câu hỏi → Toán học → Xác suất của biến cố`, separate from descriptive statistics. Broad encompassing leaves are counted as semantically correct, not an optimal pedagogic hierarchy. No gold boundaries, expected counts or corpus-specific labels were seeded into prompts or postprocessed into the bank.

- [Final complete bank](<final-pass-2026-11-16T09-41-31-055Z/final-bank.json>), [raw provider replies/reasoning and usage](<final-pass-2026-11-16T09-41-31-055Z/telemetry.json>), [exact block coverage](<final-pass-2026-11-16T09-41-31-055Z/coverage.json>), [actual materialized questions](<final-pass-2026-11-16T09-41-31-055Z/question-review.json>), [all ignored original blocks](<final-pass-2026-11-16T09-41-31-055Z/ignored-block-review.json>).
- [Final full-ancestry review table](<final-pass-2026-11-16T09-41-31-055Z/final-review-table.md>) and [machine-readable separate judgments](<final-pass-2026-11-16T09-41-31-055Z/final-semantic-review.json>).
- [Regression record](<final-regression-results.md>): 13 validator tests pass, one additional production-service synthetic regression passes in an isolated database; latest TypeScript check passes. Tests cover no broadcast, explicit accounting, malformed/overlapping ignore declarations, preserved composites, fail-safe failed extraction and production prompt wiring. Semantic/manual review remains separate from graph validity.

### Retained unsuccessful attempts and limits

Two setup-only attempts made zero provider calls: [09:34 telemetry](<final-pass-2026-11-16T09-34-51-930Z/telemetry.json>) and [09:36 telemetry](<final-pass-2026-11-16T09-36-01-283Z/telemetry.json>). Playwright's module linking of the concurrently added ESM parse5 dependency failed; runner preloading resolved it. The [09:36 paid attempt](<final-pass-2026-11-16T09-36-23-710Z/telemetry.json>) made six paid calls but the last organization hit actual `finish_reason: length` at 14,000 tokens and failed; all raw replies and intermediate snapshots remain, with no claim that attempt passed. After raising the allowance, the successful final run above started again on a fresh database. Thus two paid corpus attempts (12 paid calls total), not a hidden semantic retry. Final source code was unchanged during the successful paid run except removal of setup-only console diagnostics in the runner.

Text incorrectly declared chrome remains a semantic model risk; accounting cannot prove arbitrary prose is unimportant. Prompt ancestry checks likewise cannot prove mathematical membership. This is one successful final run on three public papers with one provider; not broad robustness evidence. Missing chart values, flattened radicals/fractions and absent diagrams remain upstream input defects, not repaired content. No original-PDF losslessness, numerical answerability, browser/authenticated deployed GUI or build/deploy claim is made. Disposable evaluation container removed after all checks; no application server was started. Parent retains ownership of task status and broader integration.

