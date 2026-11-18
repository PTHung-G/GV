# Delivery verification — deployed; public gateway traversal unverified

## 2026-11-13
- Plan/design/contracts/tasks authored; optional agent-context hook ran successfully with no configured context target (no managed file changed).
- Read-only persistence audit: document whole-library autosave must stay separate; migration numbering next0012, pg transaction/session helpers reused. Existing grading queue is not generic. Request-driven bank processing chosen, pending durable/resumable but not a daemon.
- Checklist requirements 16/16 checked, 0 unchecked.
- Analysis: all FR001–016 and SC001–007 mapped to T001–024; medium release risks: exact barem retention/display and explicit technical-limit messaging. Constitution placeholder only, no ratified principle inferred.
- Pure tests written before validator: red missing module (exit1); green10 tests in1.1s; strict TypeScript passed. Evidence reported by validation agent; final combined run still required.
- Current deployment inspection: port3210 not listening; no soandethi systemd service found. Public anonymous URL responds401 Basic auth (gate only, not app health). Existing unrelated services left unchanged. Must restore supervised production app after build/migration and verify authenticated application, not claim401 as success.
- Independent storage tests use dedicated synthetic tmpfs Postgres container, never application populated DB.

## Real configured provider
- Dedicated disposable PostgreSQL; synthetic round4 raw HTML batches6+4 only. Real model deepseek-v4.1-flash,4 HTTP200 calls, no retries,13,576 tokens total,41.1s test. Extraction/organization per call about4.9/12.1/5.3/17.8s. Provider fixture result is not expert accuracy evaluation or production efficacy guarantee.
- Retained10; exact raw snapshots/block ranges; shared passage, nested SVG figure, multipart/math included, missing answer/rubric/points remain null. Pool close/reopen confirms DB durability (not full operating-system restart). Immutable first batch and valid incremental tree verified. Detailed hashes/timing in [provider-smoke](provider-smoke.json).

## Final release verification (2026-11-14 Asia/Bangkok)
- Final root `pnpm build` passed; full Playwright **160 passed,20 skipped,29.7s**, no failed tests. Skips are explicit opt-in environment suites, not claimed executed in that run. Bank storage12, pure10, real provider1 and HTTP2 were separately run as described. Earlier four regression failures fixed: landing page token drift, bank token/radius drift and outdated heading expectation; tests not relaxed to hide source faults.
- 200-question benchmark now passes after lazy iframe mount only when opening content. All6 bank browser scenarios pass. Existing full-data text search/tree count remain unchanged; initial3338ms failure superseded by green assertion<=2000ms (whole bank benchmark test628ms in first optimized full run).
- Subpath build `NEXT_BASE_PATH=/soandethi pnpm build` passed. Installed/enabled systemd `soandethi.service`, port3210, `Restart=on-failure`; no previous3210 service/listener existed. No host proxy config changed, no unrelated service restarted.
- Deployed localhost `/soandethi/` and `/soandethi/question-bank`200;14 referenced subpath JS/CSS assets200; guest API401. Real HTTP2 tests repeated against3210/soandethi pass1.3s: two cookie-auth owners, foreign404, owner mismatch409, malformed/cross Origin403; exact synthetic users removed, zero model calls.
- Deployed Chromium smoke: register synthetic account, save exact pending source, load source tab with no browser errors, restart actual systemd app, same cookie fetch exact persisted source and reload bank successfully. Screenshot [deployed source tab](../../test-results-bank-deployed.png). Synthetic user removed by ID+exact email guard. Initial smoke locator typo corrected (tab label is Nguồn đã lưu); no product failure.
- Database backup signature and `pg_restore --list` validated; backup/manifest0600, migration0012 applied additive. Runtime account root matches existing private environment ownership; documented non-root hardening requires deliberate storage/secret migration.
- Public https://dsh.vnotemate.com/soandethi/question-bank returns Basic-auth401. This is **only gateway evidence**; authenticated public-domain browser/proxy traversal not tested because gateway credentials unavailable. Direct deployed subpath, auth routes and assets verified independently. Do not call the401 public end-to-end success.
- Rollback instructions in deployment guide. Request-driven work resumes explicitly; full restart persistence demonstrated above. No replacement/equivalence feature delivered.

## Earlier intermediate evidence (superseded by final checks above)

### Progress measurements
- Application database target matched both config files (loopback54329, soandethi_dev). Private pg_dump custom backup saved in ignored `.data/` before migration;0012 applied,0001–0011 unchanged. Backup not published.
- Two root builds passed TypeScript/Next compile. Storage12 tests pass in dedicated disposable DB (1.9s), including concurrency, full payload idempotence, owner isolation, stale revision/token/lease, invalid extraction/tree, incremental old moves and root composite status. Containers removed by test owner.
- Browser5 nonbenchmark tests passed4.9s: subset/context/provenance/reload, guest, explicit retry, script/network/navigation isolation, exact current editor snapshot. Initial benchmark3338ms failed target2000ms even workers1;200 preview iframes identified, optimization underway. This is a real failed acceptance check, not waived.

Original acceptance checklist: raw10+ question exact retention, selected subset dependencies, barem source display, two owners+guest, invalid provider/cycle/stale lease/restart/idempotency, incremental old moves, browser malicious payload,200-question benchmark, configured provider synthetic smoke, build/regression, subpath deployment. Evidence above covers bounded implementation; no expert taxonomy-accuracy certification. Public authenticated gateway traversal remains explicitly unverified.
