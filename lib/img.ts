// تبدیل آدرس عکس خارجی به پروکسی داخلی — چون f-droid.org و google.com ممکن است برای کاربر قابل دسترس نباشند
const ALLOWED_PREFIXES = ["https://f-droid.org/", "https://www.google.com/s2/favicons"];

function isAllowed(url: string): boolean {
  return ALLOWED_PREFIXES.some((p) => url.startsWith(p));
}

export function px(url: string | null | undefined): string | null {
  if (!url) return null;
  if (!isAllowed(url)) return url; // فقط دامنه‌های مجاز پروکسی می‌شوند
  const b64 = Buffer.from(url).toString("base64url");
  return `/api/img?u=${b64}`;
}

export function isProxiable(url: string | null | undefined): url is string {
  return !!url && isAllowed(url);
}

export function decodeProxyParam(b64: string): string | null {
  try {
    const url = Buffer.from(b64, "base64url").toString("utf8");
    return isAllowed(url) ? url : null;
  } catch {
    return null;
  }
}
