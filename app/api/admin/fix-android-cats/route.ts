import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";

// به‌روزرسانی موقت دسته‌های اندروید — بعد از اجرا حذف می‌شود.
const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

// کلمات کلیدی برای هر دسته (انگلیسی + فارسی)
const KEYWORDS: Record<string, string[]> = {
  design: ["draw", "paint", "sketch", "illustrat", "graphic", "photo edit", "image edit", "نقاشی", "طراحی", "گرافیک"],
  development: ["code editor", "ide", "compiler", "git", "terminal", "program", "develop", "کدنویسی", "برنامه‌نویسی", "توسعه"],
  office: ["office", "document", "word", "excel", "spreadsheet", "presentation", "pdf", "آفیس", "سند", "اسناد"],
};

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const cats = await db
      .select({
        slug: s.categories.slug,
        nameFa: s.categories.nameFa,
        id: s.categories.id,
        count: sql<number>`COUNT(${s.apps.id})`,
      })
      .from(s.categories)
      .leftJoin(s.appCategories, eq(s.appCategories.categoryId, s.categories.id))
      .leftJoin(s.apps, and(eq(s.apps.id, s.appCategories.appId), eq(s.apps.platform, "android")))
      .groupBy(s.categories.slug, s.categories.nameFa, s.categories.id)
      .orderBy(sql`COUNT(${s.apps.id}) ASC`);
    return NextResponse.json({
      ok: true,
      cats: cats.map((c) => ({ slug: c.slug, nameFa: c.nameFa, android: Number(c.count) })),
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 200) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    // همه‌ی اپ‌های اندروید با نام و توضیح
    const apps = await db
      .select({ id: s.apps.id, nameEn: s.apps.nameEn, nameFa: s.apps.nameFa, shortDescFa: s.apps.shortDescFa })
      .from(s.apps)
      .where(and(eq(s.apps.platform, "android"), eq(s.apps.isPublished, true)));

    const cats = await db.select({ id: s.categories.id, slug: s.categories.slug }).from(s.categories);
    const catId: Record<string, string> = {};
    cats.forEach((c) => (catId[c.slug] = c.id));

    // دسته‌های فعلی هر اپ (برای جلوگیری از تکرار)
    const existing = await db
      .select({ appId: s.appCategories.appId, categoryId: s.appCategories.categoryId })
      .from(s.appCategories);
    const has = new Set(existing.map((e) => `${e.appId}:${e.categoryId}`));

    const results: Record<string, number> = {};
    for (const [slug, kws] of Object.entries(KEYWORDS)) {
      const cid = catId[slug];
      if (!cid) continue;
      let added = 0;
      for (const app of apps) {
        const text = `${app.nameEn} ${app.nameFa} ${app.shortDescFa || ""}`.toLowerCase();
        if (kws.some((k) => text.includes(k.toLowerCase()))) {
          if (!has.has(`${app.id}:${cid}`)) {
            await db.insert(s.appCategories).values({ appId: app.id, categoryId: cid }).onConflictDoNothing();
            has.add(`${app.id}:${cid}`);
            added++;
          }
        }
      }
      results[slug] = added;
    }
    return NextResponse.json({ ok: true, results });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 200) }, { status: 500 });
  }
}
