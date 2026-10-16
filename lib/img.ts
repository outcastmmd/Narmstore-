// تبدیل آدرس عکس خارجی به پروکسی داخلی — چون f-droid.org ممکن است برای کاربر قابل دسترس نباشد
const ALLOWED_PREFIX = "https://f-droid.org/";

export function px(url: string | null | undefined): string | null {
  if (!url) return null;
  if (!url.startsWith(ALLOWED_PREFIX)) return url; // فقط f-droid پروکسی می‌شود
  const b64 = Buffer.from(url).toString("base64url");
  return `/api/img?u=${b64}`;
}

export function isProxiable(url: string | null | undefined): url is string {
  return !!url && url.startsWith(ALLOWED_PREFIX);
}

export function decodeProxyParam(b64: string): string | null {
  try {
    const url = Buffer.from(b64, "base64url").toString("utf8");
    return url.startsWith(ALLOWED_PREFIX) ? url : null;
  } catch {
    return null;
  }
}
