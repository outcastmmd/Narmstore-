import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, and } from "drizzle-orm";

// بررسی موقت وضعیت انتشار اپ‌های یک دسته — بعد از اجرا حذف می‌شود.
const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const slug = req.nextUrl.searchParams.get("slug") || "maps";
  try {
    const [cat] = await db.select({ id: s.categories.id }).from(s.categories).where(eq(s.categories.slug, slug)).limit(1);
    if (!cat) return NextResponse.json({ error: "no category" }, { status: 404 });
    const rows = await db
      .select({
        nameEn: s.apps.nameEn,
        nameFa: s.apps.nameFa,
        platform: s.apps.platform,
        isPublished: s.apps.isPublished,
        sourceType: s.apps.sourceType,
      })
      .from(s.apps)
      .innerJoin(s.appCategories, eq(s.appCategories.appId, s.apps.id))
      .where(eq(s.appCategories.categoryId, cat.id))
      .limit(30);
    const pub = rows.filter((r) => r.isPublished).length;
    return NextResponse.json({
      ok: true, slug, total: rows.length, published: pub, unpublished: rows.length - pub,
      sample: rows.slice(0, 10).map((r) => ({ name: r.nameEn, plat: r.platform, pub: r.isPublished, src: r.sourceType })),
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 200) }, { status: 500 });
  }
}
