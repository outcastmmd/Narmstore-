import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, and, isNull, or, sql } from "drizzle-orm";

const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

// بررسی اپ‌های بدون گزینه دانلود
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    // اپ‌های اندروید بدون fileUrl در نسخه فعال
    const rows = await db
      .select({
        id: s.apps.id,
        nameEn: s.apps.nameEn,
        slug: s.apps.slug,
        platform: s.apps.platform,
        githubRepo: s.apps.githubRepo,
        sourceUrl: s.apps.sourceUrl,
        sourceType: s.apps.sourceType,
        versionId: s.appVersions.id,
        fileUrl: s.appVersions.fileUrl,
        fileType: s.appVersions.fileType,
      })
      .from(s.apps)
      .leftJoin(s.appVersions, and(
        eq(s.appVersions.appId, s.apps.id),
        eq(s.appVersions.status, "active")
      ))
      .where(eq(s.apps.isPublished, true))
      .limit(5000);

    const noDownload = rows.filter((r) => {
      const v = r.versionId ? { fileUrl: r.fileUrl, fileType: r.fileType } : null;
      const hasApk = r.platform === "android" && v && v.fileType !== "external" && v.fileUrl;
      const hasGithub = !!r.githubRepo;
      const sHost = r.sourceUrl ? (() => { try { return new URL(r.sourceUrl).hostname; } catch { return ""; } })() : "";
      const hasWeb = r.sourceUrl && sHost !== "github.com" && r.sourceType !== "fdroid";
      return !hasApk && !hasGithub && !hasWeb;
    });

    return NextResponse.json({
      ok: true,
      total: rows.length,
      noDownloadCount: noDownload.length,
      sample: noDownload.slice(0, 20).map((r) => ({
        nameEn: r.nameEn, slug: r.slug, platform: r.platform,
        hasVersion: !!r.versionId, fileUrl: !!r.fileUrl,
        githubRepo: r.githubRepo, sourceUrl: r.sourceUrl,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 200) }, { status: 500 });
  }
}
