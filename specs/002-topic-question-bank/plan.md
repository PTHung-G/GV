# Implementation Plan: Private topic question bank

**Branch**: `002-topic-question-bank` | **Date**: 2026-11-13 | **Spec**: [spec.md](spec.md)

## Summary

Add a private bank with immutable approved source snapshots, source-fragment question units, AI-managed incremental topic tree, review/confirm flow and browsing. Reuse session authentication, PostgreSQL and existing compatible model client. Source kept before AI, never generated HTML replacing originals. Use durable DB state and request-driven jobs with expiring leases; model calls outside transactions, revision-checked commit.

## Technical Context

**Language/Version**: strict TypeScript, React 19, Next 15 App Router.
**Primary Dependencies**: existing pg/model complete(); add no service or queue dependencies. Browser DOM for source block extraction and isolated preview; server validates source fragments/coverage/limits.
**Storage**: PostgreSQL account-scoped bank JSONB with revision, immutable snapshots, durable operations/leases stored in same transactional bank state.
**Testing**: existing Playwright unit/API/browser infrastructure; synthetic sources only.
**Target Platform**: existing Linux Node production at `/soandethi`, port 3210 behind existing proxy.
**Project Type**: web application, same deployment.
**Performance Goals**: 200-question browse/search within 2 seconds locally; AI duration measured separately, no SLA.
**Constraints**: 2 MB source matching library bound, bounded 200-question organization context per call; 90-second job/model budget, at most explicit retry, no endless background retries; no owner accepted from client. Actual limits may tighten from measurements with explicit UI errors. No AI API key exposed/logged.
**Scale/Scope**: initial per-account 2,000 questions, 200 topics, 200 immutable snapshots; reject over-limit atomically rather than truncate. Large old context selected deterministically with root/tree and relevant text, proposals may only modify supplied old IDs.

## Constitution Check

Constitution is still an unratified placeholder; no principles invented. Explicit user constraints govern: source integrity, private accounts, no cycle, no taxonomy labor, no replacement. Pre-design PASS subject to release tests. Post-design PASS: transactions/CAS/leases, source validation, safe preview, no cross-account shared memory dependency. No existing shared memory route used.

## Project Structure

### Documentation (this feature)

`specs/002-topic-question-bank/`: plan, research, data-model, contracts, quickstart; tasks next.

### Source Code (repository root)

- `lib/question-bank/`: shared types, source block/range validation, tree validation and selection.
- `lib/server/question-bank.ts`: owner-scoped state/store/operations and model proposal processing.
- `app/api/question-bank/`: authenticated read/save/process/confirm routes.
- `app/question-bank/page.tsx`, `components/question-bank/`: bank browse/preview/confirm UI.
- `components/editor/editor-workspace.tsx`, existing exam library UI: entry points only, not replacement workflow.
- `db/migrations/0012_question_banks.sql`: additive owner-scoped storage.
- `e2e/unit/`, `e2e/`: validation, failure injection and browser/API coverage.

**Structure Decision**: same Next application, no new server or third-party queue. Persist pending jobs; process endpoint claims lease, stale/reloaded work reclaims after deadline. Client schedules bounded calls while open and resumes on revisit, so closing tab does not lose source or pretend jobs complete.

## Complexity Tracking

No constitution violations. JSONB state chosen over separate graph tables to atomically enforce tree/assignments with existing pg transactions; explicit caps bound payload size and lock duration. Immutable snapshot text retained inside state; processing context built from bounded blocks. Read-only integration audit completed before implementation; migration/auth/deployment decisions were verified against the existing app. Release evidence and the public gateway verification limitation are recorded in verification.md.
