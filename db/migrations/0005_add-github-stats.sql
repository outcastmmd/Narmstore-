-- آمار گیت‌هاب برای نمایش به‌جای دانلودهای داخلی
ALTER TABLE apps ADD COLUMN IF NOT EXISTS github_repo VARCHAR(255);
ALTER TABLE apps ADD COLUMN IF NOT EXISTS github_stars INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS apps_github_stars_idx ON apps(github_stars DESC);
