import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logError } from "@/lib/error-log";

const Body = z.object({
  message: z.string().trim().min(1).max(2000),
  stack: z.string().max(8000).optional().nullable(),
  url: z.string().max(1000).optional().nullable(),
});

// POST /api/errors — دریافت خطاهای کلاینت (rate limit ساده)
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 20; // حداکثر ۲۰ خطا در دقیقه از هر IP
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid input" }, { status: 400 });
  }

  // نادیده گرفتن نویزهای بی‌ارزش مرورگر
  const msg = parsed.data.message;
  if (
    /ResizeObserver|Script error\.?|cancelled|canceled|net::ERR_ABORTED/i.test(msg)
  ) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  await logError({
    kind: "client",
    message: msg,
    stack: parsed.data.stack ?? null,
    url: parsed.data.url ?? req.headers.get("referer"),
    userAgent: req.headers.get("user-agent"),
  });
  return NextResponse.json({ ok: true });
}
