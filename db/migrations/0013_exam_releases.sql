create table exam_releases (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references users(id),
 source_exam_id text not null, title text not null, source_sha256 text not null,
 input jsonb not null, warnings jsonb not null default '[]', algorithm_version integer not null default 1,
 idempotency_key text not null, request_sha256 text not null, created_at timestamptz not null default now(),
 unique(owner_id,idempotency_key)
);
create table exam_release_variants (
 id uuid primary key, release_id uuid not null references exam_releases(id), code text not null,
 session_id uuid not null unique references grading_sessions(id), snapshot_id uuid not null references exam_snapshots(id),
 rubric_revision_id uuid not null references rubric_revisions(id), qr_token text not null unique,
 exam_html text not null, key_html text not null, sheet_html text not null,
 template jsonb not null, template_sha256 text not null, rubric jsonb not null, mapping jsonb not null,
 unique(release_id,code)
);
create index exam_releases_owner_idx on exam_releases(owner_id,created_at desc);
alter table submissions add column published_variant_id uuid references exam_release_variants(id);
alter table submissions add column published_identity_verified_at timestamptz;
alter table submissions add column published_omr_verified_at timestamptz;
create table release_capture_pairings (
 id uuid primary key default gen_random_uuid(), release_id uuid not null references exam_releases(id),
 code_hash text not null unique, expires_at timestamptz not null, consumed_at timestamptz,
 created_at timestamptz not null default now()
);
create table release_capture_grants (
 token_hash text primary key, release_id uuid not null references exam_releases(id),
 expires_at timestamptz not null, revoked_at timestamptz, created_at timestamptz not null default now()
);
create function protect_exam_release() returns trigger language plpgsql as $$
begin raise exception 'Published exam releases are immutable'; end; $$;
create trigger release_immutable before update or delete on exam_releases for each row execute function protect_exam_release();
create trigger variant_immutable before update or delete on exam_release_variants for each row execute function protect_exam_release();
create function protect_published_session() returns trigger language plpgsql as $$
begin
 if exists(select 1 from exam_release_variants where session_id=old.id) then
  if tg_op='DELETE' then raise exception 'Published grading sessions cannot be deleted'; end if;
  if new.snapshot_id is distinct from old.snapshot_id or new.rubric_revision_id is distinct from old.rubric_revision_id or new.sheet_template is distinct from old.sheet_template or new.owner_id is distinct from old.owner_id then
   raise exception 'Published session identity is immutable';
  end if;
 end if;
 return new;
end; $$;
create trigger published_session_immutable before update or delete on grading_sessions for each row execute function protect_published_session();
create function protect_published_snapshot() returns trigger language plpgsql as $$
begin
 if tg_table_name='exam_snapshots' then
  if exists(select 1 from exam_release_variants where snapshot_id=old.id) then raise exception 'Published snapshot is immutable'; end if;
 else
  if exists(select 1 from exam_release_variants where rubric_revision_id=old.id) then raise exception 'Published rubric is immutable'; end if;
 end if;
 if tg_op='DELETE' then return old; end if; return new;
end; $$;
create trigger published_snapshot_immutable before update or delete on exam_snapshots for each row execute function protect_published_snapshot();
create trigger published_rubric_immutable before update or delete on rubric_revisions for each row execute function protect_published_snapshot();
