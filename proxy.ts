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

// گیت احراز هویت پنل مدیریت — بررسی امضای کوکی قبل از رندر
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") {
    // کاربر لاگین‌کرده را به داشبورد بفرست
    if (validSession(request.cookies.get(COOKIE)?.value)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }
  if (!validSession(request.cookies.get(COOKIE)?.value)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
