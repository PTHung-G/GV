# Interrupted first attempt

Run started 2026-11-17T08:40:54.985Z. Parent stopped managed job after repeated 90-second timeouts, rather than continue spending on the same failure. This is **not a completed ten-paper evaluation** and no topic-quality score is claimed.

Last observed persisted telemetry showed seven dispatched provider requests: three completed extraction responses with usage, three organization responses timing out after response headers, and one extraction timing out. A request may have been in flight at interruption; authoritative exact observed count is the retained telemetry. Timed-out requests may still incur provider charges; absent usage is not zero usage.

Findings:

- First extraction: 19 retained candidates; independent review found 16 clean preferred boundaries, one acceptable gathering, two minor contaminated candidates caused by a physical source line mixing MC option text with next-question diagram label. No whole question omitted. This is not lossless mathematical extraction: source plain text already loses powers/radicals/diagrams.
- Organizer latency exceeded the unchanged 90s budget repeatedly.
- Evaluation audit previously awaited `response.clone().json()` before returning the original response. Replaced with single body read and exact-byte replay to avoid tee/clone complications and to log body read failures honestly. This is a harness repair, not evidence that clone was the sole timeout cause.
- Production bank calls now explicitly request `reasoning: 'fast'` via the existing model tool. This changes the generic effort hint, not model identity, semantic taxonomy, context/lease timeout or scoring criteria. Quality must be checked again; the hint does not guarantee actual reduced provider reasoning.
- Runner now stops on the first failed extraction/organization rather than sending more paid calls after the pipeline is already invalid.

Next attempt uses a new empty database, original frozen inputs/gold, distinct timestamped evidence, same actual provider, root-only initial tree and no hand-fixed outputs. All prior evidence remains untouched.
