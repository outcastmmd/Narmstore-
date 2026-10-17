import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

// انتخاب موقت بهترین‌ها برای پیشنهاد هفته — بعد از اجرا حذف می‌شود.
const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const platform = req.nextUrl.searchParams.get("platform") || "android";
  try {
    // ۱۲ تای برتر بر اساس استار گیت‌هاب + دانلود
    const rows = await db
      .select({
        id: s.apps.id,
        nameEn: s.apps.nameEn,
        nameFa: s.apps.nameFa,
        slug: s.apps.slug,
        githubStars: s.apps.githubStars,
        githubRepo: s.apps.githubRepo,
        downloadCount: sql<number>`(SELECT COUNT(*) FROM ${s.downloadEvents} WHERE ${s.downloadEvents.appId} = ${s.apps.id})`,
      })
      .from(s.apps)
      .where(and(eq(s.apps.platform, platform as any), eq(s.apps.isPublished, true)))
      .orderBy(desc(s.apps.githubStars))
      .limit(12);
    return NextResponse.json({
      ok: true,
      platform,
      top: rows.map((r) => ({
        id: r.id, nameEn: r.nameEn, nameFa: r.nameFa, slug: r.slug,
        stars: r.githubStars ?? 0, downloads: Number(r.downloadCount ?? 0),
        repo: r.githubRepo,
      })),
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
    const { ids } = await req.json() as { ids: string[] };
    if (!Array.isArray(ids) || ids.length > 20) {
      return NextResponse.json({ error: "bad input" }, { status: 400 });
    }
    // اول همه را پاک کن، بعد انتخاب‌های جدید
    const platform = req.nextUrl.searchParams.get("platform") || "android";
    await db.update(s.apps).set({ editorChoice: false })
      .where(eq(s.apps.platform, platform as any));
    for (const id of ids) {
      await db.update(s.apps).set({ editorChoice: true }).where(eq(s.apps.id, id));
    }
    return NextResponse.json({ ok: true, set: ids.length, platform });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 200) }, { status: 500 });
  }
}
