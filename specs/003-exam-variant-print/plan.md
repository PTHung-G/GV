# Implementation Plan: Exam variant release

**Branch**: 003-exam-variant-print | **Date**: 2026-11-15 | **Spec**: spec.md

## Summary

Persist atomic immutable releases of 1–12 variants with complete grading destinations. Strict structural engine (shared browser/server via parse5 HTML AST) preserves source units, explicit group/pin controls, structured key remapping and bounded exact numeric recipes. Release UI sits inside editor export and supports reopening. QR-first capture resolves immutable session/template before submission and rejects unbound data. Store exact print HTML/geometry; don't regenerate published sheets on reads.

## Technical Context

- TypeScript strict, Next15 App Router, React19, PostgreSQL16/pg, Tailwind4.
- Dependencies: existing qrcode/jsqr, KaTeX MathML; add parse5 only if installed dependency resolution needed for shared non-DOM structural parser.
- Testing: Playwright API/browser + pure engine tests via Playwright node context; tsc/build; production subpath smoke.
- Platform: Linux existing app3210, /soandethi base path; phone browser camera.
- Scope: max12 variants, max60 MC, <=160k HTML for structural processing; deterministic seeds, algorithm version1, no arbitrary numeric expression eval.
- Performance: bounded inputs/generation; no blocking AI calls needed to publish.

## Constitution Check

Constitution is an unfilled template, not binding fabricated principles. Explicit user constraints apply: Vietnamese bright compact UI, no purple/slogans, existing deployment, read-before-write, server authorization and honest unsupported states. Pre/post-design gates pass subject to verification tests; do not claim implementation gate passed before tests.

## Phase 0 decisions

Read assessment research and independent code evidence. Use own sessions per variant (rubric already session-bound), grouped by release. Publication must use shared transaction, not repeated createSession. Store opaque random QR token per variant; token is identifier, not auth, resolver always checks owner or release-scoped phone grant. Retain legacy QR v1 for legacy only. Published QR v2 contains variant id + token + session id; DB authoritative matches all fields. Keep geometry freeze at publish; no builder update on published sheet reads.

Structural contract in contracts/engine.md. Unambiguous question boundaries only; if ambiguous, reject shuffle and support original single-code only after complete key review. Keep-global-order path must not imply structured numeric/options transform occurred.

## Phase 1 design

See data-model.md, contracts/engine.md, contracts/http.md and quickstart.md. Browser preview engine output is untrusted; server recomputes from submitted source/settings and validates rubric mapping. Source content snapshot may be live unsaved editor HTML; validate owner/source record, include SHA256 exact request, require explicit review, compare linked key hash/structured metadata to actual stored source where available. Legacy hash is a UI hint, not release binding.

## Project Structure

- lib/exam-release/: types/engine/recipes + server persistence/identity helpers.
- app/api/exam-releases/: preview/publish/list/detail/resolve/print/pairing endpoints.
- components/editor/: integrated release dialog; release library/workspace UI.
- components/grading/: QR-first released scan routing; existing legacy UI retained.
- db/migrations/: release schema + identity protection.
- e2e/: pure engine, API transactional/identity, browser workflow, regression and subpath smoke.

## Dependency / risk controls

Engine and server persistence independently implement against explicit shared contract. UI depends on both. Capture integration follows backend identity enforcement. Independent review checks answer leaks, wrong-key acceptance and route authorization. No release until bound-sheet completion cannot bypass OMR identity. No broad permission changes or existing proxy edits.

## Complexity Tracking

No extra service or new deployment. Own sessions per variant reuse existing immutable rubric design, avoiding invasive multi-rubric session redesign. One new grouping layer is necessary to avoid burdening teachers with many separate session setups.
