// ایمپورت بچ اول لینوکس: ۵۰ ابزار تخصصی (امنیت، شبکه، سیس‌ادمین...)
// طراحی شده برای اجرا در Web Shell سرویس Render، جایی که DATABASE_URL داخلی کار می‌کند.
// استفاده:
//   node scripts/import-linux-batch1.mjs data/linux-specialized-batch1.json
//   node scripts/import-linux-batch1.mjs https://example.com/batch.json
import postgres from "postgres";
import { readFileSync } from "node:fs";
import crypto from "node:crypto";

const src = process.argv[2] || "data/linux-specialized-batch1.json";
let tools;
if (/^https?:\/\//.test(src)) {
  const res = await fetch(src);
  if (!res.ok) throw new Error("download failed: " + res.status);
  tools = await res.json();
} else {
  tools = JSON.parse(readFileSync(src, "utf8"));
}
if (!Array.isArray(tools) || !tools.length) throw new Error("JSON خالی یا نامعتبر است");

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL لازم است");
const ssl = process.env.DB_SSL_SERVERNAME
  ? { servername: process.env.DB_SSL_SERVERNAME, rejectUnauthorized: true }
  : undefined;
const sql = postgres(dbUrl, { ssl, max: 3 });

const cats = await sql`SELECT id, slug FROM categories`;
const catId = {};
cats.forEach((c) => (catId[c.slug] = c.id));

function favicon(u) {
  try {
    const d = new URL(u).hostname;
    return `https://www.google.com/s2/favicons?domain=${d}&sz=128`;
  } catch { return null; }
}

const stats = { added: 0, skipped: 0, versions: 0, cats: 0 };
const securityAppIds = [];

for (const t of tools) {
  try {
    const pkg = `linux:${t.slug}`;
    const ex = await sql`SELECT id FROM apps WHERE slug = ${t.slug} OR package_name = ${pkg} LIMIT 1`;
    if (ex.length) { stats.skipped++; continue; }

    const appId = crypto.randomUUID();
    const iconUrl = t.icon_url || favicon(t.source_url);
    await sql`INSERT INTO apps (id, slug, package_name, name_en, name_fa,
      short_desc_fa, description_fa, icon_url, platform, is_published,
      source_type, source_url, external_id, github_repo, is_open_source)
      VALUES (${appId}, ${t.slug}, ${pkg}, ${t.name}, ${t.name_fa},
      ${t.short_desc_fa || null}, ${t.short_desc_fa || null}, ${iconUrl}, 'linux', true,
      'external', ${t.source_url || null}, ${pkg}, ${t.github_repo || null}, true)`;

    await sql`INSERT INTO app_versions (id, app_id, version_name, version_code, file_url,
      file_type, status, is_current, published_at)
      VALUES (${crypto.randomUUID()}, ${appId}, '1.0', 1, ${t.source_url || ""},
      'external', 'active', true, NOW())`;
    stats.versions++;

    const cid = catId[t.category_slug];
    if (cid) {
      await sql`INSERT INTO app_categories (app_id, category_id) VALUES (${appId}, ${cid}) ON CONFLICT DO NOTHING`;
      stats.cats++;
    }
    if (t.category_slug === "security" || t.category_slug === "encryption") securityAppIds.push(appId);
    stats.added++;
    if (stats.added % 10 === 0) console.log(`  ... ${stats.added} درج شد`);
  } catch (e) {
    console.log(`  ✗ ${t.slug}: ${(e.message || "").slice(0, 90)}`);
    stats.skipped++;
  }
}

// کالکشن «امنیت و تست نفوذ»: ابزارهای تخصصی امنیتی لینوکس
if (securityAppIds.length) {
  const colSlug = "linux-security-pentest";
  let col = await sql`SELECT id FROM collections WHERE slug = ${colSlug} LIMIT 1`;
  let colId;
  if (!col.length) {
    colId = crypto.randomUUID();
    await sql`INSERT INTO collections (id, slug, name_fa, description, icon, color, sort_order, is_active)
      VALUES (${colId}, ${colSlug}, 'امنیت و تست نفوذ',
      'ابزارهای تخصصی تست نفوذ و امنیت شبکه روی لینوکس؛ از Nmap و Wireshark تا Metasploit',
      'shield', 'primary', 50, true)`;
    console.log("✓ کالکشن «امنیت و تست نفوذ» ساخته شد");
  } else colId = col[0].id;
  let n = 0;
  for (const appId of securityAppIds) {
    await sql`INSERT INTO collection_apps (id, collection_id, app_id, sort_order)
      VALUES (${crypto.randomUUID()}, ${colId}, ${appId}, ${n})
      ON CONFLICT DO NOTHING`;
    n++;
  }
  console.log(`✓ ${n} ابزار به کالکشن امنیت اضافه شد`);
}

const total = await sql`SELECT count(*)::int c FROM apps WHERE platform='linux' AND is_published`;
console.log(`\nنتیجه: ${stats.added} اضافه، ${stats.skipped} تکراری/خطا، ${stats.versions} نسخه، مجموع لینوکس: ${total[0].c}`);
await sql.end();
