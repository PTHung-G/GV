# Bank API and UI contract

All routes `/api/question-bank`, prefixed by basePath on client. Require DB/authenticated user; no-store reads; JSON same-origin mutations, explicit body limit; derive owner solely from session. Foreign resource => 404, guest => 401, invalid => 400, size/cap => 413, conflict/busy => 409, missing DB => 503. Errors sanitized, no raw provider source/secrets. Existing account identity changes discard client results and abort requests.

- GET `/`: returns `{ownerId,revision,bank}` including nodes/questions/source summaries/status, not other owners.
- POST `/sources`: `{operationKey,docId,title,rawHtml,blocks,answerKey?}` explicit snapshot source. Persist immutable source, validate blocks match exact source fragments and source size, return source/idempotent result. No model call required to retain source. Same operation key different payload =>409.
- POST `/process`: `{sourceId?,kind:'extract'|'organize',retry?:boolean}` claims owner lease, performs bounded AI call outside DB lock; returns state/status/revision. Concurrent claim =>409; stale revision doesn't overwrite. No global tick exposed.
- GET `/sources/[id]`: owner-scoped source/raw/candidates/metadata for preview; source snapshots stay immutable.
- POST `/confirm`: `{sourceId,candidateIds,previewVersion}` atomically retain selected candidates, create root assignments pending organization, idempotent per candidate. Requires preview version match. Organize request follows, can fail without losing approved units.

## AI contract
Extraction JSON only `{questions:[{label,bodyBlockIds:number[],contextBlockIds:number[]}]}`; no generated question HTML/answer fields. Every referenced index exists, body nonempty/disjoint across questions; source coverage/dependencies validated or conservative shared context attached. Unsafe/ambiguous coverage => source failed/not complete. Existing answerKey kept separately as original, only attach matching source explicit metadata, never guess label mapping.
Organization `{nodes:[{id,label,parentId}],assignments:[{questionId,topicId}]}` full tree and assignments only for supplied new/related old IDs; existing other assignments preserved; supplied old nodes retained/compatible. Validate root, IDs, labels, parent/depth, cycles, coverage before commit. Prompts treat source as untrusted data and never obey embedded instructions. Offline non-AI mode reports unavailable, source/root retained, retry possible.

## UI
Entry `Kho câu hỏi` from my exams/editor. Editor action `Chốt và lưu câu hỏi` snapshots current surface, not stale server doc. Flow source kept→extract/review selectable content+context→confirm→organization. Sources pending/failed remain visible and retryable. Browse topic tree including self+descendants, text search, isolated source/candidate/question previews, version provenance. No replacement or manual topic tools. Review is for content, never teacher taxonomy approval. Isolated preview sandbox/CSP blocks scripts, forms, network and navigation.
