import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import windowsPower from "@/data/windows-power-batch1.json";
import linuxCreative from "@/data/linux-creative-batch1.json";
import androidPrivacy from "@/data/android-privacy-batch1.json";

// به‌روزرسانی موقت کالکشن‌ها — بعد از اجرا حذف می‌شود.
const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

// نگاشت بچ → کالکشن‌ها
const MAPPING: Record<string, string[]> = {
  "windows-power": ["productivity", "essentials"],
  "linux-creative": ["media"],
  "android-privacy": ["privacy"],
};

const BATCH_DATA: Record<string, any[]> = {
  "windows-power": windowsPower as any[],
  "linux-creative": linuxCreative as any[],
  "android-privacy": androidPrivacy as any[],
};

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const results: Record<string, any> = {};
  try {
    const allCollections = await db.select().from(s.collections);
    const collBySlug: Record<string, string> = {};
    allCollections.forEach((c) => (collBySlug[c.slug] = c.id));

    for (const [batchName, collectionSlugs] of Object.entries(MAPPING)) {
      const tools = BATCH_DATA[batchName];
      const slugs = tools.map((t: any) => t.slug);
      const foundApps = await db
        .select({ id: s.apps.id, slug: s.apps.slug })
        .from(s.apps)
        .where(inArray(s.apps.slug, slugs));

      const batchResult: Record<string, number> = {};
      for (const collSlug of collectionSlugs) {
        const collId = collBySlug[collSlug];
        if (!collId) {
          batchResult[collSlug] = -1; // کالکشن پیدا نشد
          continue;
        }
        let added = 0;
        for (const app of foundApps) {
          try {
            await db
              .insert(s.collectionApps)
              .values({ collectionId: collId, appId: app.id })
              .onConflictDoNothing();
            added++;
          } catch {
            // نادیده گرفتن خطای تکراری
          }
        }
        batchResult[collSlug] = added;
      }
      results[batchName] = { appsFound: foundApps.length, ...batchResult };
    }

    return NextResponse.json({ ok: true, results });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e).slice(0, 300), results },
      { status: 500 }
    );
  }
}
