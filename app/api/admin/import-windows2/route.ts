import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, or } from "drizzle-orm";
import chunkA from "@/data/windows-batch2a.json";
import chunkB from "@/data/windows-batch2b.json";
import chunkC from "@/data/windows-batch2c.json";
import chunkD from "@/data/windows-batch2d.json";
import chunkE from "@/data/windows-batch2e.json";

// ایمپورت موقت ویندوز بچ ۲ — بعد از اجرا حذف می‌شود.
const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

const CHUNKS: Record<string, any[]> = {
  a: chunkA as any[],
  b: chunkB as any[],
  c: chunkC as any[],
  d: chunkD as any[],
  e: chunkE as any[],
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
  const chunkName = req.nextUrl.searchParams.get("chunk") || "";
  const tools = CHUNKS[chunkName];
  if (!tools) {
    return NextResponse.json({ error: "unknown chunk", chunks: Object.keys(CHUNKS) }, { status: 400 });
  }

  const stats = { added: 0, skipped: 0 };
  try {
    const cats = await db.select().from(s.categories);
    const catId: Record<string, string> = {};
    cats.forEach((c) => (catId[c.slug] = c.id));

    for (const t of tools) {
      const pkg = `windows:${t.slug}`;
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
          platform: "windows",
          isPublished: true,
          sourceType: "external",
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
      .where(eq(s.apps.platform, "windows"));
    return NextResponse.json({ ok: true, chunk: chunkName, ...stats, total: total.length });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, chunk: chunkName, ...stats, error: String(e?.message || e).slice(0, 300) },
      { status: 500 }
    );
  }
}
