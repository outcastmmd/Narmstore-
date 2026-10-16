-- کالکشن‌های منتخب (لیست‌های دست‌چین سردبیر)
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name_fa VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(16),
  color VARCHAR(32) DEFAULT 'primary',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_apps (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT collection_app_uidx UNIQUE (collection_id, app_id)
);

CREATE INDEX IF NOT EXISTS collection_apps_cidx ON collection_apps (collection_id, sort_order);
