# Bounded AI-owned coverage correction — validation plan

User authorizes improving reliability after ten-paper evaluation. Scope is generic protocol/tooling, not seeded topic semantics.

## Acceptance

- At most one model correction after a well-formed, structurally valid but incomplete/duplicate/unknown alias assignment result.
- Mechanical coverage feedback only; model returns a complete new proposal. Never merge/fill/repair assignments in code.
- Same total90s signal,105s lease, revision/CAS, owner/global concurrency and input caps. No correction after abort/timeout, malformed JSON or invalid graph. Recheck current state before additional request.
- If correction fails, preserve all existing content/assignments and sanitized failure state. Valid native source still requires zero extraction calls.

## Evaluation boundary

Frozen ten-paper checkpoint after successful tenth incremental organization contains163questions/45nodes. Replay the exact rejected self-review response (162assignments, missingQ162) to reliably trigger correction; issue at most one actual-provider corrective request. No new extraction or full ten-paper run. Replay costs zero now and is counted separately from actual provider usage. Since replay is instantaneous, this is not proof two paid generations fit90s; shared-deadline tests and existing original48.973s latency provide separate evidence. Gold never enters model inputs.

The replay check must match original supplied nodes/questions exactly before delivering frozen response. Checkpoint hydration-only test at09:42:07 completed exit0 with zero provider requests; this alone is not a successful correction.

## Implementation evidence

- New coverage-only correction implemented; first proposal is never saved or merged. Same AbortSignal, read-only lease/revision fence before correction, final CAS unchanged.
- Targeted TDD:3expected preimplementation failures, then54passed/TypeScript exit0 (child evidence). Final combined regression/build pending collection.
- Second hydration-only check09:47:15 also reconstructed and compared the full original supplied nodes/retainedReferences/questions exactly against frozen request, exit0 and zero provider requests.
- PDF assessment found no direct PDF acquisition path in app; image transport exists but live vision support is unknown. See [assessment](<../../../.specify/assessments/pdf-source-fidelity/assessment.md>). No PDF importer or OCR fidelity improvement is claimed by this release. Safe next increment is private immutable original/page-image provenance, not guessed recovered math.

## Final verification and deployment

Actual replay run [09:47:31](<repair-pass-2026-11-17T09-47-31-517Z/telemetry.json>) completed successfully: one frozen162-assignment response (13ms, zero dispatched requests), then exactly one actual-provider corrective request (HTTP200,65,328ms,41,850prompt+4,471completion=46,321reported tokens),163assignments accepted atomically.45nodes,163questions, source HTML/blocks unchanged. Final node array equals pre-review node array and zero question topic IDs changed; this fixes completeness only, not semantic quality. Previous independent semantic judgments still apply because paths/content are unchanged.

**Timing limitation:** original historical response took48.973s, correction here65.328s; their sum114.301s exceeds90s. The replay is instantaneous and is NOT evidence that a live first response plus correction succeeds within90s. Identical total deadline is enforced and late corrections fail closed. This change provides a bounded recovery opportunity for sufficiently early incomplete replies, not guaranteed recovery for the historical two-call latency. No paid rerun or deadline relaxation was used to disguise this.

Final combined no-server regression171passed/20skipped(7.6s), TypeScript and subpathbuildexit0. Targeted54passed includes actual service module with mocked storage/provider, not live DB validation. Deployed existing service; authenticated Chromium native-save/reload/restart/cookie+source persistence smoke passed,0browsererrors,zero paid calls. Serviceactive; exact public URL still401at gateway, not authenticated public verification. No full Chromium rerun in this follow-up; prior225passed/22skipped remains historical.

Historical total38dispatched/594,740reported tokens/6missingusage plus this1dispatched/46,321tokens =39dispatched/641,061reported tokens/6missingusage. Monetary cost unknown. Frozen replay is not an additional dispatched request. Original accounting file remains frozen historical evidence.


## Fresh live no-replay test — 2026-11-17T09:54:13Z

At the user's request, ran one live whole-bank review from the unchanged ten-paper163-question checkpoint in a new disposable DB, with replay disabled. This is a real two-request test, not a new ten-paper extraction run. [Raw telemetry](<repair-pass-2026-11-17T09-54-13-139Z/telemetry.json>) and [final bank](<repair-pass-2026-11-17T09-54-13-139Z/final-bank.json>) retained. Test exit0.

- First actual request: HTTP200,68,650ms,162assignments,53,968tokens (37,329prompt+16,639completion).
- Automatic correction: HTTP200,14,560ms,163assignments,46,324tokens (41,849prompt+4,475completion;37,248cachedprompttokens).
- Sum of request durations83,210ms; complete test including setup/validation/cleanup84.487s. No changed deadline, manual patch, paid rerun or replay.
- Passed exact source/block preservation, complete163-question coverage, full-tree validation, durable reload. Final45-node array unchanged and no question path changed versus starting checkpoint; prior semantic limitations/scores remain, not newly improved.
- Two dispatched requests,total100,292reportedtokens. Accumulated accounting now41dispatched/741,353reportedtokens/6missingusage. No monetary estimate.

This demonstrates one genuine incomplete→corrected live execution within the existing90s budget. It is not evidence that all future executions succeed; latency varies, and sufficiently slow correction still must fail closed.

