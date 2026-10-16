// لاگ خطاهای داخلی — لایه‌ی مانیتورینگ بدون نیاز به سرویس خارجی
// Sentry (در صورت تنظیم SENTRY_DSN) مکمل این سیستم است، نه جایگزین آن.
// این فایل باید edge-safe باشد (در instrumentation هم import می‌شود).
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export type ErrorKind = "client" | "server" | "api";

// هش FNV-1a خالص جاوااسکریپت — بدون نیاز به node:crypto (edge-safe)
function fnv1a(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

function fingerprintOf(message: string, url?: string | null): string {
  // نرمال‌سازی: حذف اعداد/آی‌دی‌های متغیر تا خطاهای مشابه گروه‌بندی شوند
  const norm = (message + "|" + (url || ""))
    .replace(/\b[0-9a-f]{8,}(-[0-9a-f]{4,})*\b/gi, "#id")
    .replace(/\b\d+\b/g, "#n")
    .slice(0, 500);
  // دو پاس FNV برای کاهش برخورد
  return fnv1a("a" + norm) + fnv1a("b" + norm);
}

/** ثبت خطا در دیتابیس با گروه‌بندی خودکار موارد تکراری */
export async function logError(opts: {
  kind: ErrorKind;
  message: string;
  stack?: string | null;
  url?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  const message = (opts.message || "خطای نامشخص").slice(0, 2000);
  const fingerprint = fingerprintOf(message, opts.url);
  try {
    const existing = await db
      .select({ id: s.errorLogs.id })
      .from(s.errorLogs)
      .where(eq(s.errorLogs.fingerprint, fingerprint))
      .limit(1);
    if (existing[0]) {
      await db
        .update(s.errorLogs)
        .set({
          count: sql`${s.errorLogs.count} + 1`,
          lastSeenAt: new Date(),
          // اگر قبلاً resolved شده بود و دوباره رخ داد، بازش کن
          status: "open",
          stack: opts.stack?.slice(0, 8000) ?? undefined,
        })
        .where(eq(s.errorLogs.id, existing[0].id));
    } else {
      await db.insert(s.errorLogs).values({
        fingerprint,
        kind: opts.kind,
        message,
        stack: opts.stack?.slice(0, 8000) ?? null,
        url: opts.url?.slice(0, 1000) ?? null,
        userAgent: opts.userAgent?.slice(0, 500) ?? null,
      });
    }
  } catch {
    // لاگ خطا نباید خودش باعث خطا شود
  }
}
