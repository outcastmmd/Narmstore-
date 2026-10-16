-- دنبال کردن برنامه برای دریافت اعلان نسخه جدید
CREATE TABLE IF NOT EXISTS follows (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, app_id)
);
CREATE INDEX IF NOT EXISTS follows_app_idx ON follows(app_id);
