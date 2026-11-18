# AI chat persistence and account isolation

## Storage and boundaries

- PostgreSQL migrations `0008_ai_memory.sql` and `0009_ai_conversations.sql` keep preferences and conversation history scoped to authenticated owners. The former shared memory JSON file is deliberately not imported into any account.
- Conversation identity includes owner, document and session. Starting a new session retains earlier sessions as read-only history. Changing account clears the visible memory/chat UI.
- Planner and generator use owner-checked persisted conversation context, bounded to the latest 12 pairs / 24,000 characters. Successful assistant drafts are included, but failed/cancelled assistant text is not treated as successful context.

## Turn lifecycle

- Starting a turn is atomic and idempotent by turn ID and prompt; competing turns return 409.
- Generator admission is transactional: only one request can start model generation for a turn. Retrying the same HTTP generation request is rejected rather than making another model call.
- The generator saves completed HTML before emitting its SSE result. The planner saves clarification/rejection replies. Server errors terminate their turns.
- Stop marks the turn cancelled, aborts the local fetch and is checked server-side every two seconds during model calls. Terminal results cannot overwrite cancelled/interrupted turns.
- Leaving the document aborts local work and sends a best-effort cancellation. If the browser or server disappears before this completes, running turns older than five minutes are recovered as interrupted on the next read. This is recovery, not a durable background-job queue.
- Collapsing the panel keeps it mounted. Visible inactive panels refresh every three seconds and on focus. Memory refreshes on focus and every ten seconds.
- Retry explicitly starts a new turn with the previous prompt, preserving the failed attempt. Draft application has an atomic applied marker to prevent repeated insertion across tabs. Applying the marker and saving the document are separate operations: there is no cross-resource transaction covering a browser crash between them.

## Verification

- `pnpm exec tsc --noEmit`: passed.
- Production root build: passed.
- Editor + conversation + progress + durable-generation suite: 17 passed.
- PostgreSQL memory tests: 3 passed, including concurrent first writes and rollback.
- PostgreSQL conversation lifecycle tests: 3 passed, including concurrent initial session creation, single generator admission, stale recovery and archive retention.
- Provider streaming parser tests: 3 passed.
- Final full suite: 139 passed, 7 skipped. Six skipped owner-memory/conversation PostgreSQL checks passed separately with DATABASE_URL loaded. The remaining opt-in grading PostgreSQL lifecycle check requires a separate disposable database and was not run.
- Fixed grading session serialization to select its snapshot timestamp, source ID and saved HTML; grading wizard and live scanner browser tests now pass.
- Production subpath build passed and started on port 3210. Local subpath pages and authenticated conversation/memory APIs returned 200; authenticated memory UI hydrated with no browser errors. Public anonymous request returned the expected HTTP 401 gate, so public authenticated end-to-end access was not reverified.

## Deployment

Build and start with `NEXT_BASE_PATH=/soandethi`, port 3210. The public reverse proxy requires its existing HTTP authentication gate; an unauthenticated 401 alone does not verify the application behind it. No credentials should be placed in this report.
