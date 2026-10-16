import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, and, inArray, sql, desc } from "drizzle-orm";

// GET /api/compare?slugs=a,b,c — داده‌ی مقایسه‌ی چند برنامه
export async function GET(req: NextRequest) {
  const slugs = (req.nextUrl.searchParams.get("slugs") || "").split(",")
    .map((x) => x.trim().toLowerCase()).filter(Boolean).slice(0, 3);
  if (!slugs.length) return NextResponse.json({ apps: [] });

  const apps = await db.select({
    id: s.apps.id, slug: s.apps.slug, nameFa: s.apps.nameFa,
    iconUrl: s.apps.iconUrl, shortDescFa: s.apps.shortDescFa,
  }).from(s.apps).where(and(inArray(s.apps.slug, slugs), eq(s.apps.isPublished, true)));

  const out = [];
  for (const a of apps) {
    const vers = await db.select().from(s.appVersions)
      .where(and(eq(s.appVersions.appId, a.id), eq(s.appVersions.status, "active")))
      .orderBy(desc(s.appVersions.versionCode)).limit(1);
    const cur = vers[0];
    const perms = cur ? await db.select({ c: sql<number>`count(*)` }).from(s.appPermissions).where(eq(s.appPermissions.versionId, cur.id)) : [{ c: 0 }];
    const dl = await db.select({ c: sql<number>`count(*)` }).from(s.downloadEvents).where(eq(s.downloadEvents.appId, a.id));
    const cats = await db.select({ nameFa: s.categories.nameFa }).from(s.appCategories)
      .innerJoin(s.categories, eq(s.appCategories.categoryId, s.categories.id))
      .where(eq(s.appCategories.appId, a.id)).limit(3);
    const rev = await db.select({ avg: sql<number>`avg(${s.reviews.rating})` }).from(s.reviews)
      .where(and(eq(s.reviews.appId, a.id), eq(s.reviews.status, "approved")));
    out.push({
      ...a,
      versionName: cur?.versionName ?? null,
      fileSize: cur?.fileSize ?? null,
      permCount: Number(perms[0]?.c ?? 0),
      downloadCount: Number(dl[0]?.c ?? 0),
      categories: cats.map((c) => c.nameFa).join("، "),
      rating: rev[0]?.avg ? Math.round(Number(rev[0].avg) * 10) / 10 : null,
      updatedAt: cur?.publishedAt ?? null,
    });
  }
  // حفظ ترتیب درخواستی
  out.sort((x, y) => slugs.indexOf(x.slug) - slugs.indexOf(y.slug));
  return NextResponse.json({ apps: out });
}
