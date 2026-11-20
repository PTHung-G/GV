-- Commercial foundation: normalized per-row tables for documents and question
-- banks, class-linked exam releases, and THPT 2025 structured answer storage.
-- Strictly additive with idempotent backfill from legacy JSONB tables.

-- --------------------------------------------------------------- 1. documents
create table if not exists documents (
  owner_id uuid not null references users(id) on delete cascade,
  id text not null check (length(id) between 1 and 200),
  kind text not null default 'exam' check (kind in ('exam', 'answer-key')),
  parent_id text,
  title text not null,
  subject text not null default 'toan',
  grade integer check (grade is null or (grade >= 1 and grade <= 12)),
  content text not null default '',
  structure jsonb,
  answer_key_questions jsonb,
  source_content_hash text,
  content_status text check (content_status is null or content_status in ('complete', 'preview')),
  source_id text,
  shared boolean,
  author_name text,
  revision bigint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (owner_id, id)
);

create index if not exists documents_owner_updated_idx
  on documents (owner_id, updated_at desc);

create index if not exists documents_owner_parent_idx
  on documents (owner_id, parent_id);

insert into documents (
  owner_id, id, kind, parent_id, title, subject, grade, content,
  structure, answer_key_questions, source_content_hash, content_status,
  source_id, shared, author_name, created_at, updated_at
)
select
  dl.owner_id,
  d->>'id',
  case when d->>'kind' = 'answer-key' then 'answer-key' else 'exam' end,
  d->>'parentId',
  coalesce(d->>'title', 'Đề thi mới'),
  coalesce(d->>'subject', 'toan'),
  case
    when (d->>'grade') ~ '^\d+$' and (d->>'grade')::int between 1 and 12
    then (d->>'grade')::int
    else null
  end,
  coalesce(d->>'content', ''),
  d->'structure',
  d->'answerKeyQuestions',
  d->>'sourceContentHash',
  case when d->>'contentStatus' in ('complete', 'preview') then d->>'contentStatus' else null end,
  d->>'sourceId',
  case when d ? 'shared' then (d->>'shared')::boolean else null end,
  d->>'authorName',
  coalesce(nullif(d->>'createdAt', '')::timestamptz, now()),
  coalesce(nullif(d->>'updatedAt', '')::timestamptz, now())
from document_libraries dl
cross join lateral jsonb_array_elements(dl.documents) as d
where d->>'id' is not null and length(d->>'id') between 1 and 200
on conflict (owner_id, id) do nothing;

-- ---------------------------------------------------- 2. relational question bank
create table if not exists bank_topics (
  owner_id uuid not null references users(id) on delete cascade,
  id text not null check (length(id) between 1 and 128),
  label text not null check (length(label) between 1 and 100),
  parent_id text,
  sort_order integer not null default 0,
  is_locked boolean not null default false,
  scope_note text,
  created_at timestamptz not null default now(),
  primary key (owner_id, id)
);

create table if not exists bank_sources (
  owner_id uuid not null references users(id) on delete cascade,
  id uuid not null,
  operation_key text not null,
  payload_hash text,
  doc_id text not null,
  title text not null,
  raw_html text not null,
  hash text not null,
  block_ranges jsonb not null default '[]'::jsonb,
  status text not null check (status in ('pending', 'processing', 'review', 'complete', 'failed')),
  error text,
  candidates jsonb not null default '[]'::jsonb,
  preview_version text not null,
  confirmed_ids jsonb not null default '[]'::jsonb,
  extraction_mode text not null default 'ai' check (extraction_mode in ('native', 'ai')),
  structure jsonb,
  answer_key jsonb,
  lease_token text,
  lease_until bigint,
  attempts integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (owner_id, id),
  unique (owner_id, operation_key)
);

create index if not exists bank_sources_lease_idx
  on bank_sources (lease_until)
  where lease_until is not null;

create table if not exists bank_questions (
  owner_id uuid not null references users(id) on delete cascade,
  id uuid not null,
  source_id uuid not null,
  candidate_id text not null,
  label text not null,
  question_type text not null default 'mc' check (question_type in ('mc', 'tf', 'short', 'essay')),
  custom_html text,
  body_block_ids jsonb not null default '[]'::jsonb,
  context_block_ids jsonb not null default '[]'::jsonb,
  topic_id text not null default 'root',
  answer text,
  points numeric(6, 2),
  rubric_steps jsonb,
  organized boolean,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (owner_id, id),
  foreign key (owner_id, source_id) references bank_sources(owner_id, id) on delete cascade
);

create index if not exists bank_questions_owner_topic_idx
  on bank_questions (owner_id, topic_id, sort_order);

create table if not exists bank_org_states (
  owner_id uuid primary key references users(id) on delete cascade,
  status text not null default 'complete' check (status in ('pending', 'processing', 'complete', 'failed')),
  error text,
  lease_token text,
  lease_until bigint,
  attempts integer not null default 0,
  revision bigint not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists bank_org_states_lease_idx
  on bank_org_states (lease_until)
  where lease_until is not null;

insert into bank_org_states (
  owner_id, status, error, lease_token, lease_until, attempts, revision, updated_at
)
select
  qb.owner_id,
  coalesce(nullif(qb.state->'organization'->>'status', ''), 'complete'),
  qb.state->'organization'->>'error',
  qb.state->'organization'->'lease'->>'token',
  case
    when (qb.state->'organization'->'lease'->>'until') ~ '^\d+$'
    then (qb.state->'organization'->'lease'->>'until')::bigint
    else null
  end,
  coalesce((qb.state->'organization'->>'attempts')::int, 0),
  qb.revision,
  qb.updated_at
from question_banks qb
on conflict (owner_id) do nothing;

insert into bank_topics (owner_id, id, label, parent_id, sort_order)
select
  qb.owner_id,
  n.node->>'id',
  coalesce(nullif(n.node->>'label', ''), 'Kho câu hỏi'),
  n.node->>'parentId',
  (n.ordinality - 1)::int
from question_banks qb
cross join lateral jsonb_array_elements(coalesce(qb.state->'nodes', '[]'::jsonb)) with ordinality as n(node, ordinality)
where n.node->>'id' is not null
on conflict (owner_id, id) do nothing;

insert into bank_sources (
  owner_id, id, operation_key, payload_hash, doc_id, title, raw_html, hash,
  block_ranges, status, error, candidates, preview_version, confirmed_ids,
  extraction_mode, structure, answer_key, lease_token, lease_until, attempts,
  sort_order, created_at
)
select
  qb.owner_id,
  (s.src->>'id')::uuid,
  s.src->>'operationKey',
  s.src->>'payloadHash',
  coalesce(s.src->>'docId', ''),
  coalesce(s.src->>'title', ''),
  coalesce(s.src->>'rawHtml', ''),
  coalesce(s.src->>'hash', ''),
  coalesce((
    select jsonb_agg(jsonb_build_object('start', (b->'start')::int, 'end', (b->'end')::int, 'text', coalesce(b->>'text', '')) order by ord)
    from jsonb_array_elements(coalesce(s.src->'blocks', '[]'::jsonb)) with ordinality as blk(b, ord)
  ), '[]'::jsonb),
  coalesce(nullif(s.src->>'status', ''), 'pending'),
  s.src->>'error',
  coalesce(s.src->'candidates', '[]'::jsonb),
  coalesce(s.src->>'previewVersion', ''),
  coalesce(s.src->'confirmedIds', '[]'::jsonb),
  case when s.src->>'extractionMode' = 'native' then 'native' else 'ai' end,
  s.src->'structure',
  case when jsonb_typeof(s.src->'answerKey') = 'object' then s.src->'answerKey' else null end,
  s.src->'lease'->>'token',
  case
    when (s.src->'lease'->>'until') ~ '^\d+$'
    then (s.src->'lease'->>'until')::bigint
    else null
  end,
  coalesce((s.src->>'attempts')::int, 0),
  (s.ordinality - 1)::int,
  coalesce(nullif(s.src->>'createdAt', '')::timestamptz, now())
from question_banks qb
cross join lateral jsonb_array_elements(coalesce(qb.state->'sources', '[]'::jsonb)) with ordinality as s(src, ordinality)
where s.src->>'id' is not null
on conflict (owner_id, id) do nothing;

insert into bank_questions (
  owner_id, id, source_id, candidate_id, label, body_block_ids, context_block_ids,
  topic_id, organized, sort_order, created_at
)
select
  qb.owner_id,
  (q.item->>'id')::uuid,
  (q.item->>'sourceId')::uuid,
  coalesce(q.item->>'candidateId', ''),
  coalesce(q.item->>'label', ''),
  coalesce(q.item->'bodyBlockIds', '[]'::jsonb),
  coalesce(q.item->'contextBlockIds', '[]'::jsonb),
  coalesce(nullif(q.item->>'topicId', ''), 'root'),
  case when q.item ? 'organized' then (q.item->>'organized')::boolean else null end,
  (q.ordinality - 1)::int,
  coalesce(nullif(q.item->>'createdAt', '')::timestamptz, now())
from question_banks qb
cross join lateral jsonb_array_elements(coalesce(qb.state->'questions', '[]'::jsonb)) with ordinality as q(item, ordinality)
where q.item->>'id' is not null and q.item->>'sourceId' is not null
on conflict (owner_id, id) do nothing;

-- ------------------------------------------- 3. classes, releases & structured answers
alter table classes
  add column if not exists academic_year text,
  add column if not exists archived_at timestamptz;

alter table exam_releases
  add column if not exists class_id uuid references classes(id) on delete set null,
  add column if not exists class_name text;

alter table grading_sessions
  add column if not exists release_id uuid references exam_releases(id) on delete set null,
  add column if not exists roster_snapshot jsonb;

alter table mc_answers
  add column if not exists answer_payload jsonb;

-- Allow linking a class to an exam release while keeping all content, variants,
-- rubrics, snapshots and OMR templates strictly immutable.
create or replace function protect_exam_release() returns trigger language plpgsql as $$
begin
  if tg_table_name = 'exam_releases' and tg_op = 'UPDATE' then
    if new.id = old.id
      and new.owner_id = old.owner_id
      and new.source_exam_id = old.source_exam_id
      and new.title = old.title
      and new.source_sha256 = old.source_sha256
      and new.input is not distinct from old.input
      and new.warnings is not distinct from old.warnings
      and new.algorithm_version = old.algorithm_version
      and new.idempotency_key = old.idempotency_key
      and new.request_sha256 = old.request_sha256
      and new.created_at = old.created_at
    then
      return new;
    end if;
  end if;
  raise exception 'Published exam releases are immutable';
end; $$;

update grading_sessions s
   set release_id = v.release_id
  from exam_release_variants v
 where v.session_id = s.id
   and s.release_id is null;
