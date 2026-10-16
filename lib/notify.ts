import { db } from "./db";
import * as s from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

// اعلان انتشار نسخه جدید برای کاربرانی که برنامه را به علاقه‌مندی‌ها اضافه کرده‌اند
export async function notifyVersionPublished(appId: string, versionId: string) {
  const app = await db.select({ nameFa: s.apps.nameFa, slug: s.apps.slug })
    .from(s.apps).where(eq(s.apps.id, appId)).limit(1).then((r) => r[0]);
  const ver = await db.select({ versionName: s.appVersions.versionName })
    .from(s.appVersions).where(eq(s.appVersions.id, versionId)).limit(1).then((r) => r[0]);
  if (!app || !ver) return 0;

  // کاربرانی که این برنامه را دوست دارند یا دنبال می‌کنند
  const fans = await db.select({ userId: s.favorites.userId })
    .from(s.favorites).where(eq(s.favorites.appId, appId));
  const followers = await db.select({ userId: s.follows.userId })
    .from(s.follows).where(eq(s.follows.appId, appId));
  const userIds = new Set([...fans.map((f) => f.userId), ...followers.map((f) => f.userId)]);
  if (!userIds.size) return 0;

  const existing = await db.select({ userId: s.notifications.userId })
    .from(s.notifications)
    .where(and(eq(s.notifications.versionId, versionId), eq(s.notifications.type, "version")));
  const already = new Set(existing.map((e) => e.userId));

  const title = `نسخه جدید ${app.nameFa}`;
  const message = `نسخه ${ver.versionName} منتشر شد — همین حالا به‌روزرسانی کنید.`;
  let n = 0;
  for (const userId of userIds) {
    if (already.has(userId)) continue;
    await db.insert(s.notifications).values({
      userId, appId, versionId, type: "version", title, message,
    });
    n++;
  }
  return n;
}

export async function getUnreadCount(userId: string): Promise<number> {
  const r = await db.select({ c: sql<number>`count(*)` }).from(s.notifications)
    .where(and(eq(s.notifications.userId, userId), eq(s.notifications.isRead, false)));
  return Number(r[0]?.c ?? 0);
}
