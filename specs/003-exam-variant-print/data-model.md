# Data model

release: UUID id, owner_id FK, source_exam_id text nullable (source deletion must not cascade released data), title, source_sha256, input JSONB exact reviewed snapshot/settings, idempotency_key text per owner unique, request_sha256, created_at.

variant: UUID id, release_id FK, code text unique per release, session_id FK unique, snapshot_id/rubric_revision_id references, qr_token random >=192bit, exam_html/key_html/sheet_html text, template JSONB, template_sha256, rubric JSONB, mapping JSONB. Persisted one transaction with exam_snapshots/rubric_revisions/grading_sessions. Published rendered fields immutable by app endpoints and DB protection where practical; never repoint session rubric/template. Protect session deletion for linked variants.

submission provenance: variant_id/reference + verified identity status captured on server, enforced prior OMR/complete; reject invalid identities with no score mutation. Pairings: release-scoped expiring/one-time code, capability references release only, separate from existing single-session cookie. Bundle duplicate student review policy prevents silent confirmation on second variant.
