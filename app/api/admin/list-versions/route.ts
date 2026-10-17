import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, and, isNull, isNotNull } from "drizzle-orm";

const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

// لیست نسخه‌های فعال بدون fileSize که اپ‌شان githubRepo دارد
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const rows = await db
      .select({
        versionId: s.appVersions.id,
        githubRepo: s.apps.githubRepo,
        platform: s.apps.platform,
      })
      .from(s.appVersions)
      .innerJoin(s.apps, eq(s.appVersions.appId, s.apps.id))
      .where(
        and(
          eq(s.appVersions.status, "active"),
          isNull(s.appVersions.fileSize),
          isNotNull(s.apps.githubRepo),
          eq(s.apps.isPublished, true)
        )
      );
    return NextResponse.json({
      ok: true,
      count: rows.length,
      versions: rows,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e).slice(0, 200) },
      { status: 500 }
    );
  }
}
