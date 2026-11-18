# Structured exam contracts

Generation SSE result retains existing action/exam/content/reply fields, adds optional structure on replace exam and append result. New generation requires validated structured artifact; malformed/truncated output returns safe existing error, never pretend generated structure exists. Streaming tokens are progress only; apply only final validated result.

Conversation payload `{html,action,structure?}` accepts old exact two-key schema and validated optional structure. Doc API optional structure validated along with content. Existing operation/session/revision fences unchanged.

POST /api/question-bank/sources adds optional structure. Existing fields unchanged. Server validates exact source blocks and all native mappings/anchors independently; valid sources start review, attempts0 and extractionMode native. Invalid submitted structure400; no structure means legacy pending extraction. payloadHash includes structure; same key/different mapping409. Confirm uses existing previewVersion/selected IDs; organization remains separate paid AI call. Auth/isolation/no-store/request limits unchanged.

Live capture must be shared: normalized current HTML + reconciled structure when provable, otherwise HTML only and Vietnamese reason. Structure never supplies alternate HTML and cannot override source content. Reconciliation rejects nested/duplicate/unknown/missing anchors or unowned substantive text and dangling contexts. All accepted known chrome stays raw source without being attached indiscriminately to every question.
