# Quickstart validation

1. Use disposable synthetic test users/database only; never reset populated production DB. Existing Postgres configuration required, don't print credentials.
2. `pnpm db:migrate` applies additive migration 0012 once serially. `pnpm exec tsc --noEmit`, `pnpm build`, `pnpm test` run type/build/regression (test server config requires built artifacts).
3. Open editor signed in as test A; add synthetic multi-domain questions with shared passage, LaTeX, SVG/caption and multipart. `Chốt và lưu câu hỏi`, inspect preview, select subset, confirm, browse private bank.
4. Reload; source/selected units unchanged. Edit source exam, repeat confirmation; old and new snapshots remain separate.
5. Add related second batch; verify valid tree, reused branches and permitted old-question move through deterministic mock provider test, then real configured provider smoke on synthetic content with cost/time recorded.
6. Inject provider errors/invalid cycle/unknown block/missing coverage/timeout. Source remains, no invalid tree applied, status true; retry idempotent. Restart during lease and recover after lease expiry.
7. Two owner/guest contexts: reject GET/mutations/resource IDs outside account. Concurrent save/process/confirm cannot overwrite or duplicate. Client owner switch discards stale result.
8. Source script/onload/SVG external references/javascript links never execute or load external network in previews. Figure and formula remain visible for safe input.
9. Benchmark browse/search on 200 synthetic retained questions; target <=2 seconds locally, record environment, not AI latency.
10. Build/start with `NEXT_BASE_PATH=/soandethi` on existing deployment port3210, not replacement server. Verify existing public URL authenticated and local base-path assets/routes; external basic-auth401 alone is not full smoke. Preserve current production process/deployment details and migrations before controlled restart.

Expected outcome: all core acceptance checks green, bounded provider processing measured honestly. No real exams, no hardcoded secrets, no taxonomy administration or replacement UI.
