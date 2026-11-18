# Validation guide

Prerequisites: existing PostgreSQL and .env.local (never print credentials); pnpm install dependencies as needed, pnpm db:migrate. Production server owns3210 and shares .next; stop managed app job before any build.

1. Engine tests: deterministic order, group constraints, exact option remapping, complete content once, dependent-option pin, duplicate/malformed rejection, math/SVG preserved. Enumerate declared numeric finite domains and verify exact unique correctness.
2. API tests: isolated account, publish two codes with different keys; idempotent replay, concurrent retry, rollback no partial rows, owner isolation, immutable reprint/source-edit, frozen geometry, QR missing/forged/wrong release, no AI fallback bypass, duplicate student review.
3. Browser: editor live typed content → release preview → review → publish → re-open → print three artifact types, desktop/mobile no horizontal overflow; mixed QR routes proper template/session; paired phone capability cannot access unrelated release.
4. `pnpm exec tsc --noEmit`; root regression `AI_API_KEY= pnpm exec next build`, `PLAYWRIGHT_BROWSERS_PATH=/home/dsh/.cache/ms-playwright pnpm exec playwright test` (existing test server configured3100).
5. Stop root test server, `NEXT_BASE_PATH=/soandethi pnpm exec next build`; managed start `NEXT_BASE_PATH=/soandethi pnpm exec next start -p3210`; smoke existing production URL/subpath. Collect jobs, document actual pass/fail not assumed results.
