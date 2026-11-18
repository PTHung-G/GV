-- Backend grading integrity only. Apply through the normal migration process;
-- this file does not run automatically from application code.
alter table submissions add column if not exists input_revision integer not null default 1;
alter table submissions add column if not exists mc_revision integer not null default 1;
alter table submissions add column if not exists essay_revision integer not null default 1;
alter table jobs add column if not exists input_revision integer not null default 1;
alter table jobs add column if not exists section_revision integer not null default 1;
-- A crashed/reclaimed worker must not finish a newer attempt of the same job.
alter table jobs add column if not exists lease_token uuid;
-- Preserve history when the teacher deliberately deletes a draft session/paper.
alter table audit_events drop constraint if exists audit_events_session_id_fkey;
alter table audit_events add constraint audit_events_session_id_fkey foreign key (session_id) references grading_sessions(id) on delete set null;
alter table audit_events drop constraint if exists audit_events_submission_id_fkey;
alter table audit_events add constraint audit_events_submission_id_fkey foreign key (submission_id) references submissions(id) on delete set null;

-- Map legacy queue generations to revision one so completing an existing paper
-- cannot create a second job beside the pre-migration one.
update jobs set idempotency_key = submission_id::text || ':' || kind || ':i1:s1'
where submission_id is not null and idempotency_key = submission_id::text || ':' || kind;
-- Older capture-created rows defaulted both sections to pending even for a
-- single-section session. Preserve scores, but normalize excluded sections.
update submissions sub set
  mc_status = case when s.mode = 'essay-only' then 'not-applicable' else sub.mc_status end,
  essay_status = case when s.mode = 'mc-only' then 'not-applicable' else sub.essay_status end
from grading_sessions s where sub.session_id = s.id and s.status = 'active';
