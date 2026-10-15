import { NextResponse } from "next/server";
import { getSessionUser, can, type SessionUser } from "@/lib/auth";

/** بررسی نشست مدیر؛ در صورت عدم احراز، پاسخ 401/403 برمی‌گرداند */
export async function requireAdmin(perm?: string): Promise<{ user: SessionUser } | { response: NextResponse }> {
  const user = await getSessionUser();
  if (!user) return { response: NextResponse.json({ error: "وارد نشده‌اید" }, { status: 401 }) };
  if (user.role === "user") return { response: NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 }) };
  if (perm && !can(user, perm)) return { response: NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 }) };
  return { user };
}
