"use client";

import { useEffect } from "react";

// گزارش خطاهای کلاینت (window.onerror / unhandledrejection) به /api/errors
// سبک و بدون وابستگی؛ debounce دارد تا طوفان خطا رخ ندهد.
export default function ErrorReporter() {
  useEffect(() => {
    let lastSent = 0;
    let sentCount = 0;

    const send = (message: string, stack?: string) => {
      const now = Date.now();
      // حداکثر ۱ خطا در ۵ ثانیه، و سقف ۱۰ خطا در هر بازدید صفحه
      if (now - lastSent < 5000 || sentCount >= 10) return;
      lastSent = now;
      sentCount++;
      try {
        fetch("/api/errors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: message.slice(0, 2000),
            stack: stack?.slice(0, 8000),
            url: window.location.href,
          }),
          keepalive: true,
        }).catch(() => {});
      } catch {}
    };

    const onError = (event: ErrorEvent) => {
      send(event.message || "خطای نامشخص کلاینت", event.error?.stack);
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === "string"
            ? reason
            : "unhandled promise rejection";
      send(message, reason instanceof Error ? reason.stack : undefined);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
