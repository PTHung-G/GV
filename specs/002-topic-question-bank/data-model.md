# Data model

## Account bank
userId (server authenticated); revision; nodes; sources; questions. Additive table question_banks(user_id FK users on delete cascade, revision bigint, state jsonb, updated_at). All SQL selects/updates owner-filtered. Initial root created in empty state, not fixed subject taxonomy. Atomically validate full state at commits; optimistic revisions/lease fencing prevent stale overwrite.

## Source
id, operationKey scoped owner, docId, title, rawHtml, sourceHash (SHA256), exact blocks, capturedAt, optional answerKey snapshot (raw + structured existing metadata, only matching source hash), extraction status pending/processing/review/failed/complete, leaseToken/deadline, error, candidates. Immutable source payload; statuses mutable. Request idempotency key plus payload hash mismatch => conflict. Source save occurs before AI call. Limits explicit, no trimming source.

## Candidate / retained question
candidate id, label, body block indices, context block indices, answer metadata null unless matched existing explicit source. Materialize HTML from source exact blocks in original order, no duplicated indices. Verify each block exists; body coverage includes all identified question starts and nontrivial source blocks or unallocated blocks shown as context conservatively. Approve selected candidate IDs on same snapshot/version only. Retained question id references source/candidate, createdAt, topicId, unchanged source components. Repeat confirm returns same retained IDs. New source version doesn't replace existing units.

## Topic
id, label bounded 100 characters, parentId nullable only root. Max 200 nodes/depth 12; unique IDs, valid parents, connected to root/no cycle. Empty nodes allowed but avoid duplicate sibling labels. Each retained question one valid node; root fallback honest pending organization.

## Processing
Source extraction and bank organization have durable statuses, attempt count and lease token/deadline. Claim atomic; model call outside transaction; commit only current lease and revision. Revision mismatch preserves other writes and returns retryable conflict (bounded retry, not overwrite). Timeout/invalid => failed with source preserved; manual retry clears error and claims new token. Organization context includes selected old IDs; reject modifications to other old IDs. Save/confirmation remains durable even if classification fails.
