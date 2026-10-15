import { scryptSync, timingSafeEqual, createHmac, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "./db";
import * as s from "@/db/schema";
import { eq } from "drizzle-orm";

const COOKIE = "narm_admin_session";
const MAX_AGE = 60 * 60 * 24 * 30; // ۳۰ روز برای کاربران عادی

export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pw, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function sign(payload: string): string {
  const secret = process.env.SESSION_SECRET || "dev-secret";
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [algo, salt, hash] = stored.split(":");
    if (algo !== "scrypt" || !salt || !hash) return false;
    const derived = scryptSync(password, salt, 64).toString("hex");
    const a = Buffer.from(derived, "hex");
    const b = Buffer.from(hash, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function createSession(userId: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `${userId}.${exp}`;
  const sig = sign(payload);
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sig}`, {
    httpOnly: true, sameSite: "lax", path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export type SessionUser = { id: string; email: string; name: string | null; role: string; permissions: string[] };

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  const [userId, exp, sig] = raw.split(".");
  if (!userId || !exp || !sig) return null;
  if (sign(`${userId}.${exp}`) !== sig) return null;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return null;
  const rows = await db.select({
    id: s.users.id, email: s.users.email, name: s.users.name,
    isActive: s.users.isActive, role: s.roles.name, permissions: s.roles.permissions,
  }).from(s.users).innerJoin(s.roles, eq(s.users.roleId, s.roles.id))
    .where(eq(s.users.id, userId)).limit(1);
  const u = rows[0];
  if (!u || !u.isActive) return null;
  return { id: u.id, email: u.email, name: u.name, role: u.role, permissions: u.permissions };
}

export function can(user: SessionUser | null, perm: string): boolean {
  if (!user) return false;
  return user.permissions.includes("*") || user.permissions.includes(perm);
}
