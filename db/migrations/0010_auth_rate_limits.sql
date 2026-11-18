-- Persistent, multi-worker authentication throttles; keys contain hashes, never emails/passwords.
create table if not exists auth_rate_limits (
  key text primary key,
  attempts integer not null default 1,
  reset_at timestamptz not null
);
create index if not exists auth_rate_limits_reset_idx on auth_rate_limits(reset_at);
