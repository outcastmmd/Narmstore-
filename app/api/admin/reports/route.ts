import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const auth = await requireAdmin("reports.review");
  if ("response" in auth) return auth.response;
  const rows = await db.select({
    id: s.reports.id, type: s.reports.type, message: s.reports.message,
    status: s.reports.status, createdAt: s.reports.createdAt,
    appName: s.apps.nameFa, appSlug: s.apps.slug,
  }).from(s.reports).innerJoin(s.apps, eq(s.reports.appId, s.apps.id))
    .orderBy(desc(s.reports.createdAt)).limit(100);
  return NextResponse.json({ reports: rows });
}
