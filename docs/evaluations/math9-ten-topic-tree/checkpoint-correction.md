# Third attempt correction and checkpoint verification

The third attempt (`repair-pass-2026-11-17T09-01-11-757Z`) **did not resume** despite its launch environment specifying a checkpoint. Inspection of its actual request audit shows extraction began again with Huỳnh Thúc Kháng. The executing runner did not contain resume support. Earlier progress messages claiming that attempt continued without repeating the first three papers were incorrect. Actual evidence takes precedence over intent; all duplicated requests/usage must be counted.

The third attempt did show compact aliases working: five complete extraction/organization stages, then sixth extraction complete and organization timed out90s. No full ten-paper pass or final self-review.

Resume support was subsequently added via a verified literal edit. A **provider-free hydration-only test** completed exit0 at `repair-pass-2026-11-17T09-10-33-051Z`: it populated a new empty disposable DB from the sixth-paper exact failed snapshot, checked frozen source HTML/blocks, recorded checkpoint SHA, and made zero provider requests. This test is not an inference success.

A fourth paid attempt now continues from that verified checkpoint in another empty isolated database. It resets only processing status/lease, not the AI-created tree, sources or assignments. Generic prompt now asks for brief internal review without repeating question text/analysis. No domain seeds, no output repair, no timeout increase, no model substitution. Actual run request audit must confirm first call is sixth-paper organization before claiming successful resume.
