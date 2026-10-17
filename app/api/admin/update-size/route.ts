import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq } from "drizzle-orm";

const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

// آپدیت بچ fileSize نسخه‌ها
export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => null);
    const updates = body?.updates;
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ ok: false, error: "updates خالی است" }, { status: 400 });
    }
    let done = 0;
    for (const u of updates) {
      if (!u?.versionId || typeof u.fileSize !== "number" || u.fileSize <= 0) continue;
      await db
        .update(s.appVersions)
        .set({ fileSize: Math.round(u.fileSize) })
        .where(eq(s.appVersions.id, u.versionId));
      done++;
    }
    return NextResponse.json({ ok: true, updated: done });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e).slice(0, 200) },
      { status: 500 }
    );
  }
}
