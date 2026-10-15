// Base URL سراسری سایت — روی Render به‌صورت خودکار از RENDER_EXTERNAL_URL می‌آید
export function siteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "");
  return "http://localhost:3000";
}
