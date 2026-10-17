import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

// به‌روزرسانی موقت دسته‌های ویندوز و لینوکس — بعد از اجرا حذف می‌شود.
const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

const KEYWORDS: Record<string, string[]> = {
  "2fa": ["2fa", "two-factor", "authenticator", "otp", "totp", "دوعاملی", "احراز هویت"],
  adblock: ["adblock", "ad block", "advertising block", "مسدودکننده تبلیغ"],
  design: ["draw", "paint", "sketch", "illustrat", "graphic", "photo edit", "image edit", "نقاشی", "طراحی", "گرافیک"],
  development: ["code editor", "ide", "compiler", "git", "program", "develop", "کدنویسی", "برنامه‌نویسی", "توسعه"],
  ebook: ["ebook", "e-book", "epub", "reader", "کتابخوان", "کتاب‌خوان"],
  email: ["email", "mail client", "thunderbird", "ایمیل"],
  flashcard: ["flashcard", "anki", "فلش‌کارت", "فلش کارت"],
  gallery: ["gallery", "photo viewer", "image viewer", "گالری", "نمایش عکس"],
  habit: ["habit", "habit tracker", "ردیاب عادت", "عادت"],
  keyboard: ["keyboard", "keymap", "صفحه‌کلید"],
  launcher: ["launcher", "app launcher", "لانچر"],
  maps: ["map", "navigation", "gps", "نقشه", "مسیریابی"],
  "media-player": ["media player", "video player", "music player", "mpv", "vlc", "پخش‌کننده"],
  messenger: ["messenger", "chat", "telegram", "signal", "matrix", "xmpp", "پیام‌رسان"],
  notes: ["note", "notepad", "markdown", "یادداشت"],
  office: ["office", "document", "word", "excel", "spreadsheet", "presentation", "libreoffice", "آفیس", "سند", "اسناد"],
  "online-media": ["streaming", "youtube", "netflix", "پخش آنلاین"],
  password: ["password manager", "passphrase", "keepass", "bitwarden", "مدیریت رمز"],
  pdf: ["pdf", "پی‌دی‌اف"],
  personalization: ["theme", "customize", "wallpaper", "شخصی‌سازی"],
  podcast: ["podcast", "پادکست"],
  radio: ["radio", "رادیو"],
  recorder: ["recorder", "screen record", "audio record", "ضبط"],
  sms: ["sms", "پیامک"],
  store: ["app store", "software center", "package manager", "فروشگاه"],
  sync: ["sync", "backup", "rsync", "syncthing", "همگام‌سازی", "پشتیبان"],
  tasks: ["task", "todo", "taskwarrior", "مدیریت وظایف", "کارها"],
  terminal: ["terminal", "console", "shell", "ترمینال"],
  transfer: ["file transfer", "scp", "ftp", "sftp", "انتقال فایل"],
  vpn: ["vpn", "proxy", "wireguard", "openvpn", "پروکسی"],
  browser: ["browser", "firefox", "chrome", "chromium", "مرورگر"],
  encryption: ["encrypt", "gpg", "veracrypt", "رمزنگاری"],
  "file-manager": ["file manager", "file browser", "مدیریت فایل"],
  firewall: ["firewall", "فایروال"],
  network: ["network", "wireshark", "nmap", "شبکه"],
  security: ["security", "antivirus", "malware", "امنیت"],
  system: ["system", "monitor", "task manager", "سیستم"],
  tools: ["tool", "utility", "ابزار"],
  internet: ["internet", "download manager", "اینترنت"],
  multimedia: ["multimedia", "multimedia", "چندرسانه‌ای"],
  communication: ["communication", "voip", "video call", "ارتباطات"],
  productivity: ["productivity", "بهره‌وری"],
  games: ["game", "gaming", "steam", "بازی"],
};

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const platform = req.nextUrl.searchParams.get("platform") || "windows";
  try {
    const cats = await db
      .select({
        slug: s.categories.slug,
        nameFa: s.categories.nameFa,
        count: sql<number>`COUNT(${s.apps.id})`,
      })
      .from(s.categories)
      .leftJoin(s.appCategories, eq(s.appCategories.categoryId, s.categories.id))
      .leftJoin(s.apps, and(eq(s.apps.id, s.appCategories.appId), eq(s.apps.platform, platform as any)))
      .groupBy(s.categories.slug, s.categories.nameFa)
      .orderBy(sql`COUNT(${s.apps.id}) ASC`);
    const empty = cats.filter((c) => Number(c.count) === 0);
    return NextResponse.json({
      ok: true,
      platform,
      emptyCount: empty.length,
      empty: empty.map((c) => ({ slug: c.slug, nameFa: c.nameFa })),
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 200) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const platform = req.nextUrl.searchParams.get("platform") || "windows";
  try {
    const apps = await db
      .select({ id: s.apps.id, nameEn: s.apps.nameEn, nameFa: s.apps.nameFa, shortDescFa: s.apps.shortDescFa })
      .from(s.apps)
      .where(and(eq(s.apps.platform, platform as any), eq(s.apps.isPublished, true)));

    const cats = await db.select({ id: s.categories.id, slug: s.categories.slug }).from(s.categories);
    const catId: Record<string, string> = {};
    cats.forEach((c) => (catId[c.slug] = c.id));

    const existing = await db
      .select({ appId: s.appCategories.appId, categoryId: s.appCategories.categoryId })
      .from(s.appCategories);
    const has = new Set(existing.map((e) => `${e.appId}:${e.categoryId}`));

    const results: Record<string, number> = {};
    for (const [slug, kws] of Object.entries(KEYWORDS)) {
      const cid = catId[slug];
      if (!cid) continue;
      let added = 0;
      for (const app of apps) {
        const text = `${app.nameEn} ${app.nameFa} ${app.shortDescFa || ""}`.toLowerCase();
        if (kws.some((k) => text.includes(k.toLowerCase()))) {
          if (!has.has(`${app.id}:${cid}`)) {
            await db.insert(s.appCategories).values({ appId: app.id, categoryId: cid }).onConflictDoNothing();
            has.add(`${app.id}:${cid}`);
            added++;
          }
        }
      }
      if (added > 0) results[slug] = added;
    }
    return NextResponse.json({ ok: true, platform, results });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 200) }, { status: 500 });
  }
}
