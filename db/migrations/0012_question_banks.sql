-- Private question bank, independent from editor whole-library autosave.
create table if not exists question_banks (
  owner_id uuid primary key references users(id) on delete cascade,
  revision bigint not null default 0,
  state jsonb not null,
  updated_at timestamptz not null default now(),
  constraint question_bank_state_object check (jsonb_typeof(state) = 'object')
);
