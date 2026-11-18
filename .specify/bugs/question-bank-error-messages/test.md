# Bug Verification: Sanitized question-bank failure messages

- **Slug**: question-bank-error-messages
- **Tested**: 2026-11-17
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: verified

## Summary

The mocked equivalent of the supplied public failure now produces a coverage-specific message with no deadline claim. All focused tests and TypeScript pass; invalid results remain rejected without changing bank content.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | Production module with 163 mocked questions and valid JSON omitting Q162 | pass | Exact coverage message; original tree/content preserved, lease cleared, one call. |
| New / updated tests | `pnpm exec playwright test --config .data/organization-unit.config.ts` | pass | 13 added cases; 35 total passed in 2.6s. |
| Regression suite | Same focused config, both organization and bank validation suites | pass | Existing atomic rejection, bounded context, aliasing, CAS/lease and content validation remain passing. |
| Type-check | `pnpm exec tsc --noEmit` | pass | No diagnostics; combined command exit 0. |
| Live public evaluation | Not rerun | skipped | Paid calls explicitly prohibited; mocked equivalent is the assessment reproduction. |

## Output Excerpts

```text
Running 35 tests using 1 worker
35 passed (2.6s)
[status: completed, exit code: 0]
```

Only warning: NO_COLOR ignored because FORCE_COLOR is set. No test or TypeScript errors.

## Residual Risks

- Timeout/abort classification intentionally uses explicit Error names, not guesses from provider text. Unknown wrappers fall back to neutral sanitized messaging.
- No live UI/deployed verification or paid evaluation was performed. The stored UI-facing message is covered through the actual production module with persistence/provider mocks.
- No before/after paid timing comparison is claimed.
- No bug hooks are registered in `.specify/extensions.yml`.

## Recommendation

Close the bounded error-messaging bug based on its mocked reproduction and focused regression/type verification. This does not assert semantic quality of organization output and does not change the coverage rejection that protected the bank.
