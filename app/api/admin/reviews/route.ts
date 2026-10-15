import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const auth = await requireAdmin("reports.review");
  if ("response" in auth) return auth.response;
  const rows = await db.select({
    id: s.reviews.id, rating: s.reviews.rating, text: s.reviews.text,
    status: s.reviews.status, createdAt: s.reviews.createdAt,
    userName: s.users.name, appName: s.apps.nameFa, appSlug: s.apps.slug,
  }).from(s.reviews)
    .innerJoin(s.users, eq(s.reviews.userId, s.users.id))
    .innerJoin(s.apps, eq(s.reviews.appId, s.apps.id))
    .orderBy(desc(s.reviews.createdAt)).limit(100);
  return NextResponse.json({ reviews: rows });
}
