import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, or } from "drizzle-orm";
import windowsPower from "@/data/windows-power-batch1.json";
import linuxCreative from "@/data/linux-creative-batch1.json";
import androidPrivacy from "@/data/android-privacy-batch1.json";

// ایمپورت موقت بچ‌ها — بعد از اجرا حذف می‌شود.
// GET /api/admin/import-batch?key=...&batch=windows-power|linux-creative|android-privacy
// عملیات idempotent است (رکورد تکراری نادیده گرفته می‌شود).
const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

const BATCHES: Record<
  string,
  { tools: any[]; platform: string; pkgPrefix: string | null }
> = {
  "windows-power": { tools: windowsPower as any[], platform: "windows", pkgPrefix: "windows" },
  "linux-creative": { tools: linuxCreative as any[], platform: "linux", pkgPrefix: "linux" },
  "android-privacy": { tools: androidPrivacy as any[], platform: "android", pkgPrefix: null },
};

function favicon(u: string | null): string | null {
  try {
    if (!u) return null;
    return `https://www.google.com/s2/favicons?domain=${new URL(u).hostname}&sz=128`;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const batchName = req.nextUrl.searchParams.get("batch") || "";
  const batch = BATCHES[batchName];
  if (!batch) {
    return NextResponse.json({ error: "unknown batch", batches: Object.keys(BATCHES) }, { status: 400 });
  }

  const stats = { added: 0, skipped: 0 };
  try {
    const tools = batch.tools;
    if (!Array.isArray(tools) || !tools.length) throw new Error("JSON خالی است");

    const cats = await db.select().from(s.categories);
    const catId: Record<string, string> = {};
    cats.forEach((c) => (catId[c.slug] = c.id));

    for (const t of tools) {
      const pkg = t.package_name || `${batch.pkgPrefix}:${t.slug}`;
      const ex = await db
        .select({ id: s.apps.id })
        .from(s.apps)
        .where(or(eq(s.apps.slug, t.slug), eq(s.apps.packageName, pkg)))
        .limit(1);
      if (ex.length) {
        stats.skipped++;
        continue;
      }
      const appId = randomUUID();
      await db
        .insert(s.apps)
        .values({
          id: appId,
          slug: t.slug,
          packageName: pkg,
          nameEn: t.name,
          nameFa: t.name_fa,
          shortDescFa: t.short_desc_fa || null,
          descriptionFa: t.short_desc_fa || null,
          iconUrl: t.icon_url || favicon(t.source_url),
          platform: batch.platform,
          isPublished: true,
          sourceType: batch.platform === "android" ? "fdroid" : "external",
          sourceUrl: t.source_url || null,
          externalId: pkg,
          githubRepo: t.github_repo || null,
          isOpenSource: true,
        })
        .onConflictDoNothing();
      await db.insert(s.appVersions).values({
        id: randomUUID(),
        appId,
        versionName: "1.0",
        versionCode: 1,
        fileUrl: t.source_url || "",
        fileType: "external",
        status: "active",
        isCurrent: true,
        publishedAt: new Date(),
      });
      const cid = catId[t.category_slug];
      if (cid) {
        await db
          .insert(s.appCategories)
          .values({ appId, categoryId: cid })
          .onConflictDoNothing();
      }
      stats.added++;
    }

    const total = await db
      .select({ id: s.apps.id })
      .from(s.apps)
      .where(eq(s.apps.platform, batch.platform));
    return NextResponse.json({ ok: true, batch: batchName, ...stats, total: total.length });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, batch: batchName, ...stats, error: String(e?.message || e).slice(0, 300) },
      { status: 500 }
    );
  }
}
