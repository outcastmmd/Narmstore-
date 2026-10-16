// رجیستر مانیتورینگ سمت سرور — Next 16 instrumentation (stable)
import type { Instrumentation } from "next";
import * as Sentry from "@sentry/nextjs";

const DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

export async function register() {
  // Sentry فقط وقتی فعال می‌شود که DSN تنظیم شده باشد
  if (DSN) {
    Sentry.init({
      dsn: DSN,
      environment: process.env.NODE_ENV,
      // بدون tracing در tier رایگان؛ فقط خطاها
      tracesSampleRate: 0,
    });
  }
}

// خطاهای سمت سرور (رندر، روت‌هندلرها) — به لاگ داخلی + Sentry
export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context
) => {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  const digest =
    typeof err === "object" && err !== null && "digest" in err
      ? String((err as { digest: unknown }).digest)
      : undefined;

  const url =
    typeof request === "object" && request !== null && "url" in request
      ? String((request as { url: unknown }).url)
      : typeof context === "object" &&
          context !== null &&
          "routerKind" in context
        ? `[${String((context as { routerKind: unknown }).routerKind)}]`
        : undefined;

  const fullMessage = digest ? `${message} (digest: ${digest})` : message;

  // لاگ داخلی — همیشه فعال (dynamic import تا در edge-register اتصال دیتابیس باز نشود)
  try {
    const { logError } = await import("@/lib/error-log");
    await logError({ kind: "server", message: fullMessage, stack, url });
  } catch {}

  // Sentry — فقط با DSN
  if (DSN) {
    Sentry.captureException(err, { extra: { url, digest } });
    await Sentry.flush(2000).catch(() => {});
  }
};
