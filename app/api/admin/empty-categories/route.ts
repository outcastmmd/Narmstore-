import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// گزارش موقت دسته‌های خالی — بعد از اجرا حذف می‌شود.
const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // همه‌ی دسته‌ها با تعداد اپ‌های هر پلتفرم
    const cats = await db
      .select({
        slug: s.categories.slug,
        nameFa: s.categories.nameFa,
        android: sql<number>`COUNT(*) FILTER (WHERE ${s.apps.platform} = 'android')`,
        windows: sql<number>`COUNT(*) FILTER (WHERE ${s.apps.platform} = 'windows')`,
        linux: sql<number>`COUNT(*) FILTER (WHERE ${s.apps.platform} = 'linux')`,
      })
      .from(s.categories)
      .leftJoin(s.appCategories, eq(s.appCategories.categoryId, s.categories.id))
      .leftJoin(s.apps, eq(s.apps.id, s.appCategories.appId))
      .groupBy(s.categories.slug, s.categories.nameFa)
      .orderBy(s.categories.slug);

    const empty = cats.filter(
      (c) => Number(c.android) === 0 && Number(c.windows) === 0 && Number(c.linux) === 0
    );

    return NextResponse.json({
      ok: true,
      total: cats.length,
      emptyCount: empty.length,
      empty: empty.map((c) => ({ slug: c.slug, nameFa: c.nameFa })),
      all: cats.map((c) => ({
        slug: c.slug,
        nameFa: c.nameFa,
        android: Number(c.android),
        windows: Number(c.windows),
        linux: Number(c.linux),
      })),
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e).slice(0, 300) },
      { status: 500 }
    );
  }
}
