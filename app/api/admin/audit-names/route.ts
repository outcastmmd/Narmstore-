import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

// گزارش موقت اسامی اپ‌ها — بعد از اجرا حذف می‌شود.
const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const offset = Number(req.nextUrl.searchParams.get("offset") || "0");
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") || "500"), 1000);
  const platform = req.nextUrl.searchParams.get("platform");

  try {
    const where = platform
      ? and(eq(s.apps.isPublished, true), eq(s.apps.platform, platform as any))
      : eq(s.apps.isPublished, true);
    const rows = await db
      .select({
        id: s.apps.id,
        slug: s.apps.slug,
        platform: s.apps.platform,
        nameEn: s.apps.nameEn,
        nameFa: s.apps.nameFa,
      })
      .from(s.apps)
      .where(where)
      .orderBy(s.apps.platform, s.apps.slug)
      .offset(offset)
      .limit(limit);
    const [{ n }] = await db
      .select({ n: sql<number>`count(*)` })
      .from(s.apps)
      .where(where);
    return NextResponse.json({ ok: true, total: Number(n), offset, rows });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 200) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const { updates } = await req.json() as { updates: { id: string; nameFa: string }[] };
    if (!Array.isArray(updates) || updates.length > 500) {
      return NextResponse.json({ error: "bad input" }, { status: 400 });
    }
    let done = 0;
    for (const u of updates) {
      await db.update(s.apps).set({ nameFa: u.nameFa }).where(eq(s.apps.id, u.id));
      done++;
    }
    return NextResponse.json({ ok: true, updated: done });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 200) }, { status: 500 });
  }
}
