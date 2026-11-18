# Whole-bank self-review rejection — exact diagnosis

All ten sources completed incremental organization:163questions,45nodes including root. The final requested whole-bank review received all163questions.

The provider replied HTTP200 in48,973ms, finish_reason=stop. JSON was parseable with45nodes and162assignments. Expected aliases Q0–Q162; **Q162 missing**, no duplicate/unknown aliases, no invalid node/parent references. The strict assignment-coverage gate correctly rejected the entire proposal. No proposal was repaired or partially committed; all163questions and prior valid tree remain stored.

This was **not a90second timeout**. The service exposes a combined sanitized error (“90 seconds or invalid result”), and the initial progress message incorrectly attributed the failure to the deadline before the actual envelope was diagnosed. This note supersedes that attribution. Earlier incremental organization timeouts remain genuine.

Telemetry records `selfReviewWholeBank=true`, `selfReviewQuestionCount=163`, `selfReviewComplete=false`, outcome=failed. The tree in actual-tree.md is the successful tenth incremental tree, not a successful final reviewed tree. No semantic improvement can be claimed from the rejected self-review. No paid retry is currently scheduled.

Accounting all attempts:38dispatched requests,594740reported tokens,6requests without usage. Missing usage may still be billed; monetary cost unknown because no price/billing data was supplied. Includes duplicate work caused by the earlier absent checkpoint code.
