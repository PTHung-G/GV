-- Lưu hình học phiếu chuẩn vào đợt chấm.
-- Template được sinh cùng lúc với đợt (một lần, tất định) nên bản in và bản quét
-- luôn dùng đúng cùng một bộ toạ độ.

alter table grading_sessions
  add column if not exists sheet_template jsonb,
  add column if not exists sheet_printed_at timestamptz;
