// رجیستر مانیتورینگ سمت کلاینت — فقط وقتی DSN تنظیم شده باشد فعال است
import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0,
    // نادیده گرفتن نویزهای رایج مرورگر
    ignoreErrors: [
      /ResizeObserver loop/,
      /Non-Error promise rejection captured/,
      /Loading chunk \d+ failed/,
    ],
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
