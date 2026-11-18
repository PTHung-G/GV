-- Private AI preferences. The former shared JSON file is deliberately NOT imported.
create table if not exists ai_memories (
  owner_id uuid primary key references users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  use_memory boolean not null default true,
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(items) = 'array')
);
