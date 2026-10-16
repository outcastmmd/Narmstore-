-- پلتفرم برنامه: android | windows | linux
ALTER TABLE apps ADD COLUMN IF NOT EXISTS platform VARCHAR(16) NOT NULL DEFAULT 'android';
CREATE INDEX IF NOT EXISTS apps_platform_idx ON apps(platform);
