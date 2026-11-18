-- Người dùng và phiên đăng nhập thật cho tính năng chấm bài.
-- gen_random_uuid() có sẵn từ PostgreSQL 13 nên không cần pgcrypto.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  password_hash text,
  avatar_color text not null default '#2383e2',
  points integer not null default 20000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Email không phân biệt hoa thường nhưng vẫn giữ nguyên bản gốc để hiển thị.
create unique index if not exists users_email_lower_key on users (lower(email));

create table if not exists auth_sessions (
  token_hash text primary key,
  user_id uuid not null references users(id) on delete cascade,
  -- 'user' là phiên đăng nhập thường; 'capture' là phiên điện thoại chỉ được tải bài lên.
  kind text not null default 'user' check (kind in ('user', 'capture')),
  scope jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  last_seen_at timestamptz
);

create index if not exists auth_sessions_user_idx on auth_sessions (user_id);
create index if not exists auth_sessions_expires_idx on auth_sessions (expires_at);
