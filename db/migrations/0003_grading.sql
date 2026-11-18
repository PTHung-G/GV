-- Toàn bộ schema cho tính năng chấm bài.
--
-- Nguyên tắc:
--   * Đề, đáp án và barem được ĐÓNG BĂNG vào snapshot khi tạo đợt, để sửa đề về
--     sau không làm đổi điểm đã chấm.
--   * Ảnh bài làm nằm trong kho riêng tư; bảng chỉ giữ khoá và metadata.
--   * Trắc nghiệm và tự luận có trạng thái, job và điểm riêng.

-- ---------------------------------------------------------------- snapshot

create table if not exists exam_snapshots (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  title text not null,
  subject text,
  grade integer,
  exam_html text,
  answer_key_html text,
  -- Id tài liệu phía trình duyệt, chỉ để tham chiếu ngược.
  source_exam_id text,
  created_at timestamptz not null default now()
);

create table if not exists rubric_revisions (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references exam_snapshots(id) on delete cascade,
  version integer not null default 1,
  total_points numeric(6, 2) not null,
  mc_points numeric(6, 2) not null default 0,
  essay_points numeric(6, 2) not null default 0,
  -- Cấu trúc đầy đủ: câu, đáp án, các bước chấm.
  payload jsonb not null,
  note text,
  created_at timestamptz not null default now(),
  unique (snapshot_id, version)
);

-- ------------------------------------------------------------------- đợt

create table if not exists grading_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  snapshot_id uuid not null references exam_snapshots(id) on delete cascade,
  rubric_revision_id uuid not null references rubric_revisions(id),
  title text not null,
  class_id uuid references classes(id) on delete set null,
  class_name text,
  mode text not null check (mode in ('mc-only', 'essay-only', 'mixed')),
  -- 'template': phiếu chuẩn có marker/QR; 'manual': giấy ngoài chụp tay.
  sheet_mode text not null default 'manual' check (sheet_mode in ('template', 'manual')),
  status text not null default 'active' check (status in ('active', 'finalized', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  finalized_at timestamptz
);

create index if not exists grading_sessions_owner_idx
  on grading_sessions (owner_id, created_at desc);

-- ------------------------------------------------------------------ bài

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references grading_sessions(id) on delete cascade,
  student_id uuid references students(id) on delete set null,
  student_code text,
  student_name text,
  -- Danh tính và điểm là hai trục độc lập: bài có thể đã chấm nhưng chưa gán đúng người.
  identity_status text not null default 'unassigned'
    check (identity_status in ('unassigned', 'suggested', 'verified', 'conflict', 'anonymous-confirmed')),
  exam_code text,
  label text,
  page_count integer not null default 0,
  mc_status text not null default 'pending'
    check (mc_status in ('not-applicable', 'pending', 'processing', 'needs-review', 'confirmed', 'failed')),
  essay_status text not null default 'pending'
    check (essay_status in ('not-applicable', 'pending', 'processing', 'needs-review', 'confirmed', 'failed')),
  mc_score numeric(6, 2),
  essay_score numeric(6, 2),
  total_score numeric(6, 2),
  status text not null default 'draft'
    check (status in ('draft', 'processing', 'needs-review', 'confirmed', 'absent')),
  flags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create index if not exists submissions_session_idx on submissions (session_id, created_at);
create index if not exists submissions_student_idx on submissions (session_id, student_id);
-- Một học sinh chỉ có một bài trong một đợt.
create unique index if not exists submissions_session_student_key
  on submissions (session_id, student_id)
  where student_id is not null;

create table if not exists page_assets (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  storage_key text not null,
  mime_type text not null,
  byte_size bigint not null,
  width integer,
  height integer,
  page_index integer not null default 0,
  -- 'original' giữ nguyên bản; ảnh xử lý lưu thành bản riêng để luôn đối chiếu được.
  kind text not null default 'original' check (kind in ('original', 'processed')),
  status text not null default 'stored'
    check (status in ('pending', 'stored', 'needs-retake', 'duplicate', 'superseded', 'failed')),
  sha256 text,
  created_at timestamptz not null default now()
);

create index if not exists page_assets_submission_idx
  on page_assets (submission_id, page_index);
create index if not exists page_assets_sha_idx on page_assets (submission_id, sha256);

-- --------------------------------------------------------------- điểm

-- Một dòng cho mỗi ý chấm (hoặc một dòng 'answer' cho câu trắc nghiệm).
create table if not exists criterion_scores (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  section text not null check (section in ('mc', 'essay')),
  question_no integer not null,
  criterion_key text not null,
  max_points numeric(6, 2) not null,
  ai_points numeric(6, 2),
  final_points numeric(6, 2),
  evidence text,
  confidence numeric(4, 3),
  flags text[] not null default '{}',
  source text not null default 'ai' check (source in ('ai', 'teacher', 'omr')),
  reviewed_by uuid references users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (submission_id, question_no, criterion_key)
);

create index if not exists criterion_scores_submission_idx
  on criterion_scores (submission_id, section, question_no);

create table if not exists mc_answers (
  submission_id uuid not null references submissions(id) on delete cascade,
  question_no integer not null,
  picked text,
  confidence numeric(4, 3),
  source text not null default 'ai' check (source in ('ai', 'teacher', 'omr')),
  flags text[] not null default '{}',
  reviewed_by uuid references users(id) on delete set null,
  reviewed_at timestamptz,
  primary key (submission_id, question_no)
);

-- ---------------------------------------------------------------- job

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references grading_sessions(id) on delete cascade,
  submission_id uuid references submissions(id) on delete cascade,
  kind text not null check (kind in ('grade-mc', 'grade-essay')),
  status text not null default 'queued'
    check (status in ('queued', 'running', 'succeeded', 'failed')),
  attempts integer not null default 0,
  max_attempts integer not null default 3,
  -- Chống xếp trùng cùng một việc.
  idempotency_key text not null,
  last_error text,
  result jsonb,
  run_after timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  unique (idempotency_key)
);

create index if not exists jobs_queue_idx on jobs (status, run_after);
create index if not exists jobs_submission_idx on jobs (submission_id);

-- ------------------------------------------------------------- ghép máy

create table if not exists capture_pairings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references grading_sessions(id) on delete cascade,
  created_by uuid not null references users(id) on delete cascade,
  -- Mã ngắn in vào QR; chỉ dùng một lần.
  code text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  revoked_at timestamptz
);

create index if not exists capture_pairings_session_idx on capture_pairings (session_id);

-- -------------------------------------------------------------- lịch sử

create table if not exists audit_events (
  id bigserial primary key,
  session_id uuid references grading_sessions(id) on delete cascade,
  submission_id uuid references submissions(id) on delete cascade,
  actor_id uuid references users(id) on delete set null,
  action text not null,
  before_value jsonb,
  after_value jsonb,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists audit_events_session_idx on audit_events (session_id, created_at desc);
