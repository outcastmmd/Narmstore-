-- لاگ خطاهای داخلی (مانیتورینگ؛ مکمل Sentry)
CREATE TABLE IF NOT EXISTS error_logs (
  id TEXT PRIMARY KEY,
  fingerprint VARCHAR(64) NOT NULL,
  kind VARCHAR(32) NOT NULL DEFAULT 'client',
  message TEXT NOT NULL,
  stack TEXT,
  url TEXT,
  user_agent TEXT,
  count INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  first_seen_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS error_logs_fingerprint_uidx ON error_logs(fingerprint);
CREATE INDEX IF NOT EXISTS error_logs_status_idx ON error_logs(status, last_seen_at);
