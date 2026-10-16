// سید برنامه‌های ویندوز و لینوکس
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as s from "./schema.js";
import { readFileSync } from "node:fs";
import crypto from "node:crypto";

const _dbUrl = process.env.DATABASE_URL!;
let _ssl: any;
if (process.env.DB_SSL_SERVERNAME) {
  _ssl = { servername: process.env.DB_SSL_SERVERNAME, rejectUnauthorized: true };
} else _ssl = "require";
const client = postgres(_dbUrl, { ssl: _ssl });
const db = drizzle(client, { schema: s });

function slugify(name: string, id: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
  return (base || "app") + "-" + crypto.createHash("md5").update(id).digest("hex").slice(0, 6);
}

async function seedPlatform(file: string, platform: "windows" | "linux") {
  const items = JSON.parse(readFileSync(file, "utf8"));
  let added = 0, skipped = 0;
  for (const it of items) {
    const externalId = `${platform}:${it.id}`;
    const ex = await db.select().from(s.apps).where(eq(s.apps.externalId, externalId)).limit(1);
    if (ex.length) { skipped++; continue; }
    const slug = slugify(it.name, it.id);
    const [app] = await db.insert(s.apps).values({
      slug, packageName: `${platform}:${it.id}`,
      nameFa: it.nameFa || it.name, nameEn: it.name,
      shortDesc: (it.summary || "").slice(0, 300),
      description: it.description || null,
      shortDescFa: (it.summary || "").slice(0, 300),
      iconUrl: it.icon || null,
      platform,
      sourceType: platform === "linux" ? "flathub" : "winget",
      sourceUrl: it.homepage || null,
      externalId,
      license: it.license || null,
      isOpenSource: /gpl|mit|apache|bsd|mpl|lgpl/i.test(it.license || ""),
      isPublished: true,
    }).returning();
    // نسخه
    if (it.version) {
      await db.insert(s.appVersions).values({
        appId: app.id, versionName: String(it.version), versionCode: 1,
        fileUrl: it.homepage || "", fileSize: null,
        status: "active", isCurrent: true, fileType: "external",
        source: platform === "linux" ? "Flathub" : "Winget",
        verifiedAt: new Date(), publishedAt: new Date(),
      });
    }
    added++;
    if (added % 20 === 0) console.log(`  ${platform}: ${added}...`);
  }
  console.log(`✓ ${platform}: added=${added} skipped=${skipped}`);
  await client.end();
}

const platform = process.argv[2] as "windows" | "linux";
const file = process.argv[3];
if (!platform || !file) { console.error("usage: seed-platform.ts <windows|linux> <json>"); process.exit(1); }
seedPlatform(file, platform).catch((e) => { console.error(e); process.exit(1); });
