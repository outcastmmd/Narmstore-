import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHmac } from "node:crypto";

const COOKIE = "narm_admin_session";

function validSession(raw: string | undefined): boolean {
  if (!raw) return false;
  const [userId, exp, sig] = raw.split(".");
  if (!userId || !exp || !sig) return false;
  const secret = process.env.SESSION_SECRET || "dev-secret";
  const expected = createHmac("sha256", secret).update(`${userId}.${exp}`).digest("hex");
  if (expected !== sig) return false;
  return Number(exp) > Math.floor(Date.now() / 1000);
}

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://www.google.com https://www.gstatic.com",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );
  res.headers.delete("X-Powered-By");
  return res;
}

// گیت احراز هویت پنل مدیریت + هدرهای امنیتی
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let res: NextResponse;
  if (pathname === "/admin/login") {
    if (validSession(request.cookies.get(COOKIE)?.value)) {
      res = NextResponse.redirect(new URL("/admin", request.url));
    } else {
      res = NextResponse.next();
    }
  } else if (pathname.startsWith("/admin")) {
    if (!validSession(request.cookies.get(COOKIE)?.value)) {
      res = NextResponse.redirect(new URL("/admin/login", request.url));
    } else {
      res = NextResponse.next();
    }
  } else {
    res = NextResponse.next();
  }
  return applySecurityHeaders(res);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|sw.js|manifest.webmanifest).*)"],
};
