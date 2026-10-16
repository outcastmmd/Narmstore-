import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, or } from "drizzle-orm";
import tools from "@/data/linux-specialized-batch1.json";

// ایمپورت موقت بچ اول لینوکس — بعد از اجرا حذف می‌شود.
// کلید تصادفی یک‌بارمصرف؛ عملیات idempotent است (رکورد تکراری نادیده گرفته می‌شود).
const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

function favicon(u: string | null): string | null {
  try {
    if (!u) return null;
    return `https://www.google.com/s2/favicons?domain=${new URL(u).hostname}&sz=128`;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const stats = { added: 0, skipped: 0 };
  const securityAppIds: string[] = [];
  try {
    const cats = await db.select().from(s.categories);
    const catId: Record<string, string> = {};
    cats.forEach((c) => (catId[c.slug] = c.id));

    for (const t of tools as any[]) {
      const pkg = `linux:${t.slug}`;
      const ex = await db
        .select({ id: s.apps.id })
        .from(s.apps)
        .where(or(eq(s.apps.slug, t.slug), eq(s.apps.packageName, pkg)))
        .limit(1);
      if (ex.length) {
        stats.skipped++;
        continue;
      }
      const appId = randomUUID();
      await db
        .insert(s.apps)
        .values({
          id: appId,
          slug: t.slug,
          packageName: pkg,
          nameEn: t.name,
          nameFa: t.name_fa,
          shortDescFa: t.short_desc_fa || null,
          descriptionFa: t.short_desc_fa || null,
          iconUrl: t.icon_url || favicon(t.source_url),
          platform: "linux",
          isPublished: true,
          sourceType: "external",
          sourceUrl: t.source_url || null,
          externalId: pkg,
          githubRepo: t.github_repo || null,
          isOpenSource: true,
        })
        .onConflictDoNothing();
      await db.insert(s.appVersions).values({
        id: randomUUID(),
        appId,
        versionName: "1.0",
        versionCode: 1,
        fileUrl: t.source_url || "",
        fileType: "external",
        status: "active",
        isCurrent: true,
        publishedAt: new Date(),
      });
      const cid = catId[t.category_slug];
      if (cid) {
        await db
          .insert(s.appCategories)
          .values({ appId, categoryId: cid })
          .onConflictDoNothing();
      }
      if (t.category_slug === "security" || t.category_slug === "encryption") {
        securityAppIds.push(appId);
      }
      stats.added++;
    }

    // کالکشن «امنیت و تست نفوذ»
    let collectionCount = 0;
    if (securityAppIds.length) {
      const colSlug = "linux-security-pentest";
      const existing = await db
        .select({ id: s.collections.id })
        .from(s.collections)
        .where(eq(s.collections.slug, colSlug))
        .limit(1);
      let colId: string;
      if (!existing.length) {
        colId = randomUUID();
        await db.insert(s.collections).values({
          id: colId,
          slug: colSlug,
          nameFa: "امنیت و تست نفوذ",
          description:
            "ابزارهای تخصصی تست نفوذ و امنیت شبکه روی لینوکس؛ از Nmap و Wireshark تا Metasploit",
          icon: "shield",
          color: "primary",
          sortOrder: 50,
          isActive: true,
        });
      } else {
        colId = existing[0].id;
      }
      let n = 0;
      for (const appId of securityAppIds) {
        await db
          .insert(s.collectionApps)
          .values({ id: randomUUID(), collectionId: colId, appId, sortOrder: n })
          .onConflictDoNothing();
        n++;
      }
      collectionCount = n;
    }

    const total = await db
      .select({ id: s.apps.id })
      .from(s.apps)
      .where(eq(s.apps.platform, "linux"));
    return NextResponse.json({
      ok: true,
      ...stats,
      collectionApps: collectionCount,
      totalLinux: total.length,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, ...stats, error: String(e?.message || e).slice(0, 300) },
      { status: 500 }
    );
  }
}
