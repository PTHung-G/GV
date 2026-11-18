# Bug Assessment: provider response-body deadline

- **Slug**: model-body-abort (automatically generated)
- **Created**: 2026-11-17
- **Source**: delegated ten-paper evaluation timeout report
- **Verdict**: valid
- **Severity**: high

## Symptom and evidence

The evaluation fetch wrapper awaits response.clone().json() before returning the original response. HTTP200 therefore means headers arrived, not that a JSON completion finished. Current telemetry has progressed beyond reported sixth call: eight completed calls at inspection, with calls2/4/5/7 taking approximately90000ms and having null output. This is deadline/body-read failure, not proof of an infinite stall. No paid calls were made during investigation.

## Reproduction

Use the actual production complete() with a mocked fetch that returns an HTTP200 Response backed by a never-finishing ReadableStream which ignores the supplied abort signal. Abort the caller signal. Existing complete() awaits res.json() indefinitely. A wrapper that awaits a cloned body before returning can likewise prevent fetch() from settling despite an aborted request signal.

## Suspected Code Paths

- lib/server/model.ts complete(): signal supplied only to fetch; awaited fetch and res.json()/res.text() have no independent deadline race.
- scripts/math9-ten-topic-evaluation.ts lines72–95: telemetry wrapper buffers cloned JSON before returning; errors are swallowed as null, so elapsed headers/body latency cannot be distinguished.

## Root Cause Hypothesis

High confidence: wrappers/custom transports need not honour signal even though native fetch normally aborts body consumption. Existing code trusts this behaviour and can process a late result or wait indefinitely. Telemetry observed aborts do occur at90s in this run; therefore no assertion that every observed timeout is this defect. Provider latency exceeding the unchanged90s remains a real pipeline failure.

## Proposed Remediation

Bound both awaited fetch and response-body reading in complete() by the same combined existing caller/per-attempt signal. Cleanup abort listeners, preserve original abort reason, never accept late content. Do not increase deadlines, change provider/model or add retries. Add hermetic tests for hung fetch-wrapper, successful headers/hung body, error-body, normal success, and late response rejection.

Files likely to change: lib/server/model.ts and new e2e/unit/model-abort.spec.ts only, plus diagnostic reports. Do not edit the running runner or question-bank-ai.ts.

## Risks and Considerations

Promise racing bounds the application wait; it cannot guarantee cancellation of an uncooperative transport's own underlying work. Native fetch receives the exact combined signal as before. Provider performance/semantic failures are not repaired or hidden by this change. Streaming variant not implicated by this nonstreaming run; leave unchanged.
