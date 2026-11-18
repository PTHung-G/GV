# Final first-pass findings for parent

T014/T015 implemented and actually run. See [full report](<report.md>), [per-question full paths](<review-table.md>), [machine-readable judgments](<semantic-review.json>) and [full telemetry/output](<first-pass-2026-11-16T09-22-46-602Z/telemetry.json>). No core/task/gold/manifest edits. No send_message tool is exposed in this delegated runtime; final response plus this file are the available handoff.

Command: `QUESTION_BANK_PROVIDER_SMOKE=1 QUESTION_BANK_TEST_PORT=55439 pnpm exec playwright test --config=docs/evaluations/math9-topic-tree/playwright.config.ts` → **1 passed (3.8m), exit0**, six actual HTTP200 calls, response model deepseek-v4.1-flash, configured chib/deepseek-v4.1-flash. 100,154 total tokens (52,671 prompt,47,483 completion). Fresh disposable Docker PostgreSQL16 at55439, empty-schema guard, synthetic owner deleted; container stopped and verified exited. All background jobs collected.

32 retained units =8+5+19 vs29 printed/37 preferred. Topic full-path manual review:27 correct/3 ambiguous/2 wrong on retained axis,27/8/2 on preferred axis. No percentage or overall semantic acceptance claim.

Demonstrated faults for T016:
1. Every non-body block is attached to EVERY candidate by validateCandidates, polluting all32 question dependencies with unrelated headings/chrome/loose figure labels. Exact source retention is not selective dependency fidelity.
2. Lý Sơn retains5 whole printed Bài rather than10 independent units; I merges4 algebra exercises, II merges2 independent stories, IV merges submarine trigonometry and circle proof. Gold permits intact mixed Bài: ambiguous/too broad, not lost text. Whole circle proofs/shared expressions must remain intact.
3. Quảng Ninh I.8 volume leaf under inherited area-specific cylinder parent (full-path semantic fault); I.11 classical probability under Thống kê (wrong ancestor though leaf is relevant). See report for scoring sensitivity of cylinder parent.
4. PDF-to-text lost chart/images/radicals/fractions; formula/chart/diagram fidelity unscorable/incomplete, not passed. Do not seed gold-corrected formulas into prompts.

Seven storage checks true: hash verification, raw/blocks exact, no duplicate bodies, idempotent confirmation, durable reload, valid tree, old-content stable. All visible task text retained;3 complete circle setups and9 proof subparts intact. No paid retry requested or transport retry observed.

Initial concurrent `pnpm exec tsc --noEmit --pretty false` exit2 reported missing parent-owned structured-exam module/inference errors only, no runner errors. Final Playwright --list discovers1 test. Runner gained explicit final pipeline success assertions after paid run (all those recorded statuses already satisfied); no second paid run. Parent owns final full typecheck and marking tasks.
