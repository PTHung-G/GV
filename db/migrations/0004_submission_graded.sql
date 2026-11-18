-- Thêm trạng thái 'graded': máy đã chấm xong nhưng giáo viên chưa xác nhận.
-- Tách khỏi 'needs-review' (có điểm cần người xem) và 'confirmed' (người đã chốt).

alter table submissions drop constraint if exists submissions_status_check;

alter table submissions add constraint submissions_status_check
  check (status in ('draft', 'processing', 'graded', 'needs-review', 'confirmed', 'absent'));
