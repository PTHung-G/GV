-- Account-owned, optimistic-versioned authoring library. IDs inside payload are
-- text because legacy browser documents and sample documents are not all UUIDs.
create table if not exists document_libraries (
  owner_id uuid primary key references users(id) on delete cascade,
  revision bigint not null default 0,
  documents jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(documents) = 'array')
);
