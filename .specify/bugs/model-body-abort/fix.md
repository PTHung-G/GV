# Fix: bounded provider response reading

- **Slug**: model-body-abort (assessment context)
- **Status**: applied; no deployment

## Changes

lib/server/model.ts complete() now independently races the awaited fetch (including custom wrappers) and success/error body reads against the existing combined caller/120s attempt signal. The transport still receives that exact signal. Abort reasons survive, late results cannot succeed, listeners are removed, and synchronous/deferred pre-abort is checked. No model/provider changes, deadline increases, semantic prompts, runner edits or new retry policy.

Added hermetic production-module tests e2e/unit/model-abort.spec.ts covering hung success body, clone-reading wrapper stall, hung error body/no retry, exact normal success, late transport result rejection, and pre-aborted zero work. No network or paid calls.

## Verification

`pnpm exec playwright test --config=docs/evaluations/math9-ten-topic-tree/unit.config.ts model-abort.spec.ts model-stream.spec.ts`: 9 passed (6 new,3 existing), exit0. `pnpm exec tsc --noEmit`: exit0.

## Diagnosis and limits

At initial inspection telemetry had eight completed calls rather than the reported six. Multiple HTTP200s had body parse errors at approximately90s, so observed behavior is genuine provider completion deadline failure, not demonstrated infinite hang. The clone-buffering evaluation wrapper obscures header-vs-body timing and waits before model receives response. Native fetch abort did appear to interrupt those reads in this run. Independent abort bounding is a generic safety fix demonstrated with mocked uncooperative body/wrapper, not a claim to make the slow provider finish in time.

For a future runner revision (not modified here), avoid awaiting clone.json() unbounded ahead of the production response: either race its body reading with request signal and propagate/record body error, or explicitly read once under bounded signal and reconstruct a Response. Do not silently treat HTTP200/null body as a successful completion. Preserve failed-run evidence and no automatic paid retries.

An uncooperative third-party promise may continue internal work after caller returns; bounding the application's await cannot forcibly cancel arbitrary JS transport internals. No parent job killed, running module hot-patched, new provider request, deployment, taxonomy or output repair.

## Deviations

None. Streaming transport unchanged; existing streaming regression passed. Required send_message tool not available in delegated tool catalog, so parent handoff is via closing response.
