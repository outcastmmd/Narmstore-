import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// هدرهای امنیتی برای همه‌ی پاسخ‌ها
export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // جلوگیری از clickjacking
  res.headers.set("X-Frame-Options", "DENY");
  // جلوگیری از حدس نوع فایل
  res.headers.set("X-Content-Type-Options", "nosniff");
  // محدود کردن referrer
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // غیرفعال کردن قابلیت‌های خطرناک مرورگر
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  // HSTS — اجبار HTTPS برای ۱ سال (شامل زیردامنه‌ها)
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  // سیاست محتوای امنیتی
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );
  // حذف هدر شناسایی سرور
  res.headers.delete("X-Powered-By");

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|sw.js|manifest.webmanifest).*)"],
};
