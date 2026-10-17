import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notifyVersionPublished } from "@/lib/notify";

// تأیید گروهی موقت نسخه‌های pending — بعد از اجرا حذف می‌شود.
const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const pending = await db
      .select({ id: s.appVersions.id, appId: s.appVersions.appId, publishedAt: s.appVersions.publishedAt })
      .from(s.appVersions)
      .where(eq(s.appVersions.status, "pending"));

    let approved = 0;
    for (const ver of pending) {
      // نسخه‌های قبلی همین اپ دیگر current نیستند
      await db
        .update(s.appVersions)
        .set({ isCurrent: false })
        .where(eq(s.appVersions.appId, ver.appId));
      await db
        .update(s.appVersions)
        .set({
          status: "active",
          isCurrent: true,
          verifiedAt: new Date(),
          publishedAt: ver.publishedAt ?? new Date(),
        })
        .where(eq(s.appVersions.id, ver.id));
      approved++;
      // اعلان (خطا نادیده گرفته می‌شود)
      notifyVersionPublished(ver.appId, ver.id).catch(() => {});
    }

    const remaining = await db
      .select({ id: s.appVersions.id })
      .from(s.appVersions)
      .where(eq(s.appVersions.status, "pending"));

    return NextResponse.json({ ok: true, approved, remaining: remaining.length });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e).slice(0, 300) },
      { status: 500 }
    );
  }
}
