import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";

// GET /api/reviews?appId=... — نظرات تأییدشده + میانگین امتیاز
export async function GET(req: NextRequest) {
  const appId = new URL(req.url).searchParams.get("appId");
  if (!appId) return NextResponse.json({ error: "appId لازم است" }, { status: 400 });

  const [list, agg] = await Promise.all([
    db.select({
      id: s.reviews.id, rating: s.reviews.rating, text: s.reviews.text,
      createdAt: s.reviews.createdAt, userName: s.users.name,
    }).from(s.reviews)
      .innerJoin(s.users, eq(s.reviews.userId, s.users.id))
      .where(and(eq(s.reviews.appId, appId), eq(s.reviews.status, "approved")))
      .orderBy(desc(s.reviews.createdAt)).limit(20),
    db.select({
      avg: sql<number>`avg(${s.reviews.rating})`,
      count: sql<number>`count(*)`,
    }).from(s.reviews)
      .where(and(eq(s.reviews.appId, appId), eq(s.reviews.status, "approved"))),
  ]);

  return NextResponse.json({
    reviews: list,
    average: agg[0]?.count ? Math.round(Number(agg[0].avg) * 10) / 10 : null,
    count: Number(agg[0]?.count ?? 0),
  });
}

const Body = z.object({
  appId: z.string().min(1),
  rating: z.number().int().min(1, "امتیاز بدهید").max(5),
  text: z.string().trim().max(2000).optional(),
});

// POST /api/reviews — ثبت نظر (وضعیت: در انتظار تأیید)
export async function POST(req: NextRequest) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "برای ثبت نظر وارد شوید" }, { status: 401 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "ورودی نامعتبر است" }, { status: 400 });
  }

  const app = await db.select({ id: s.apps.id }).from(s.apps)
    .where(and(eq(s.apps.id, parsed.data.appId), eq(s.apps.isPublished, true))).limit(1);
  if (!app[0]) return NextResponse.json({ error: "برنامه یافت نشد" }, { status: 404 });

  // هر کاربر یک نظر برای هر برنامه (به‌روزرسانی نظر قبلی)
  const existing = await db.select({ id: s.reviews.id }).from(s.reviews)
    .where(and(eq(s.reviews.appId, parsed.data.appId), eq(s.reviews.userId, u.id))).limit(1);

  if (existing[0]) {
    await db.update(s.reviews).set({
      rating: parsed.data.rating, text: parsed.data.text || null, status: "pending",
    }).where(eq(s.reviews.id, existing[0].id));
  } else {
    await db.insert(s.reviews).values({
      appId: parsed.data.appId, userId: u.id,
      rating: parsed.data.rating, text: parsed.data.text || null, status: "pending",
    });
  }
  return NextResponse.json({ ok: true, message: "نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود" });
}
