-- Some databases applied an earlier revision of 0013 before this nullable
-- verification timestamp was added. Keep the historical migration untouched.
-- Do not backfill: only a successful OMR read may verify a published sheet.
-- Fresh databases already have the column; the repair must be a no-op there.
alter table submissions add column if not exists published_omr_verified_at timestamptz;
