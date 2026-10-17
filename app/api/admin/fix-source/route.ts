import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";

const KEY = "b1-9f3e7a2c4d8b1e6a5f0c3d9e7b2a4f1";

const bodySchema = z.object({
  fixes: z.array(z.object({
    id: z.string().min(1),
    sourceUrl: z.string().nullable(),
  })).max(2000),
});

export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "bad payload" }, { status: 400 });
    }
    let updated = 0;
    for (const f of parsed.data.fixes) {
      // اعتبارسنجی URL (یا null برای خالی کردن)
      if (f.sourceUrl !== null) {
        const chk = z.string().url().safeParse(f.sourceUrl);
        if (!chk.success) continue;
      }
      const r = await db.update(s.apps)
        .set({ sourceUrl: f.sourceUrl, updatedAt: new Date() })
        .where(eq(s.apps.id, f.id));
      updated += 1;
    }
    return NextResponse.json({ ok: true, updated });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 200) }, { status: 500 });
  }
}
