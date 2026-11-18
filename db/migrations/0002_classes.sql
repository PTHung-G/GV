-- Lớp và học sinh. Danh sách lớp là dữ liệu do giáo viên tải lên, không phải
-- nguồn chân lý toàn trường, nên mã học sinh chỉ duy nhất trong phạm vi một lớp.

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  name text not null,
  subject text,
  grade integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists classes_owner_name_key on classes (owner_id, lower(name));

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  -- Mã học sinh / SBD. Có thể trống nếu giáo viên chỉ có họ tên.
  code text,
  name text not null,
  sort_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists students_class_idx on students (class_id, sort_index);

-- Mã trống được phép trùng; mã có giá trị thì không được trùng trong lớp.
create unique index if not exists students_class_code_key
  on students (class_id, lower(code))
  where code is not null;
