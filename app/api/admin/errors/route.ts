import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-guard";

// GET /api/admin/errors — لیست خطاهای ثبت‌شده
export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const rows = await db
    .select()
    .from(s.errorLogs)
    .orderBy(desc(s.errorLogs.lastSeenAt))
    .limit(100);
  return NextResponse.json({ errors: rows });
}
