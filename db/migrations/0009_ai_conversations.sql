-- Document IDs are arbitrary legacy strings; identity is always (owner_id, doc_id).
create table if not exists ai_conversations (
  id uuid primary key,
  owner_id uuid not null references users(id) on delete cascade,
  doc_id text not null check (length(doc_id) between 1 and 200),
  messages jsonb not null default '[]'::jsonb check (jsonb_typeof(messages) = 'array'),
  revision bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, doc_id, id)
);
create index if not exists ai_conversations_owner_doc on ai_conversations(owner_id, doc_id, updated_at desc);
create table if not exists ai_conversation_heads (
  owner_id uuid not null references users(id) on delete cascade,
  doc_id text not null check (length(doc_id) between 1 and 200),
  conversation_id uuid,
  primary key (owner_id, doc_id),
  foreign key (owner_id, doc_id, conversation_id) references ai_conversations(owner_id, doc_id, id)
);
