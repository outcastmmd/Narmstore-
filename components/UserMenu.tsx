"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Wrench, LogOut } from "lucide-react";

type Me = { id: string; name: string | null; email: string; role: string } | null;

export default function UserMenu() {
  const [me, setMe] = useState<Me | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/signup").then((r) => r.json()).then((j) => setMe(j.user || null)).catch(() => setMe(null));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    router.push("/");
    router.refresh();
  };

  // فعلاً دکمه‌های ورود/ثبت‌نام در هدر نیست؛ ورود به‌صورت موقعیتی (مثلاً هنگام علاقه‌مندی) انجام می‌شود
  if (me === undefined || !me) return null;

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-label="منوی کاربر" aria-expanded={open}
        className="w-10 h-10 rounded-xl bg-primary-soft text-primary font-extrabold flex items-center justify-center hover:opacity-80 transition">
        {(me.name || me.email).charAt(0)}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute end-0 top-12 z-50 w-52 bg-surface border border-border rounded-2xl shadow-xl p-2 animate-fade-up">
            <p className="px-3 py-2 text-sm font-bold truncate">{me.name || "کاربر"}</p>
            <p className="px-3 pb-2 text-xs text-muted truncate" dir="ltr" style={{ textAlign: "right" }}>{me.email}</p>
            <div className="border-t border-border pt-1">
              <Link href="/favorites" onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm hover:bg-surface-2 transition"><Heart className="w-4 h-4" aria-hidden="true" /> علاقه‌مندی‌ها</Link>
              {me.role !== "user" && (
                <Link href="/admin" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm hover:bg-surface-2 transition"><Wrench className="w-4 h-4" aria-hidden="true" /> پنل مدیریت</Link>
              )}
              <button onClick={logout}
                className="w-full text-start px-3 py-2.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition flex items-center gap-2">
                <LogOut className="w-4 h-4" aria-hidden="true" /> خروج
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
