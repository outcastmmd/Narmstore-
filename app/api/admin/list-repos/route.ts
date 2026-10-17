import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, isNotNull, and, ne, sql } from "drizzle-orm";

const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

// لیست یکتای github_repo + آیدی اپ‌های دارای آن
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const rows = await db
      .select({
        id: s.apps.id,
        nameEn: s.apps.nameEn,
        platform: s.apps.platform,
        githubRepo: s.apps.githubRepo,
        sourceUrl: s.apps.sourceUrl,
      })
      .from(s.apps)
      .where(and(
        eq(s.apps.isPublished, true),
        isNotNull(s.apps.githubRepo),
        ne(s.apps.githubRepo, "")
      ));

    // گروه‌بندی بر اساس ریپوی یکتا
    const map = new Map<string, { repo: string; apps: { id: string; nameEn: string; platform: string; sourceUrl: string | null }[] }>();
    for (const r of rows) {
      const repo = (r.githubRepo as string).trim();
      if (!repo) continue;
      let entry = map.get(repo);
      if (!entry) { entry = { repo, apps: [] }; map.set(repo, entry); }
      entry.apps.push({ id: r.id, nameEn: r.nameEn, platform: r.platform, sourceUrl: r.sourceUrl });
    }

    return NextResponse.json({
      ok: true,
      totalApps: rows.length,
      uniqueRepos: map.size,
      repos: [...map.values()],
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 200) }, { status: 500 });
  }
}
