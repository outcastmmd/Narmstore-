import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

// بررسی موقت ریپوهای گیت‌هاب بدون Releases — بعد از اجرا حذف می‌شود.
const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

function checkKey(req: NextRequest) {
  return req.nextUrl.searchParams.get("key") === KEY;
}

// لیست اپ‌های دارای github_repo
export async function GET(req: NextRequest) {
  if (!checkKey(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "200", 10) || 200, 500);
  const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0", 10) || 0;
  try {
    const rows = await db
      .select({
        id: s.apps.id,
        nameEn: s.apps.nameEn,
        nameFa: s.apps.nameFa,
        platform: s.apps.platform,
        githubRepo: s.apps.githubRepo,
        sourceUrl: s.apps.sourceUrl,
      })
      .from(s.apps)
      .where(
        and(
          eq(s.apps.isPublished, true),
          sql`${s.apps.githubRepo} IS NOT NULL AND ${s.apps.githubRepo} != ''`
        )
      )
      .limit(limit)
      .offset(offset);
    const [{ c }] = await db
      .select({ c: sql<number>`count(*)` })
      .from(s.apps)
      .where(
        and(
          eq(s.apps.isPublished, true),
          sql`${s.apps.githubRepo} IS NOT NULL AND ${s.apps.githubRepo} != ''`
        )
      );
    return NextResponse.json({ ok: true, total: Number(c), count: rows.length, offset, apps: rows });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 200) }, { status: 500 });
  }
}

// آپدیت sourceUrl اپ‌ها
export async function POST(req: NextRequest) {
  if (!checkKey(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as { fixes?: { id: string; sourceUrl: string | null }[] };
    const fixes = Array.isArray(body.fixes) ? body.fixes : [];
    if (fixes.length === 0 || fixes.length > 200) {
      return NextResponse.json({ error: "bad input" }, { status: 400 });
    }
    let updated = 0;
    for (const f of fixes) {
      if (!f.id) continue;
      await db
        .update(s.apps)
        .set({ sourceUrl: f.sourceUrl, updatedAt: new Date() })
        .where(eq(s.apps.id, f.id));
      updated++;
    }
    return NextResponse.json({ ok: true, updated });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 200) }, { status: 500 });
  }
}
