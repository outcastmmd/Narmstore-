"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  if (me === undefined) return <span className="w-10 h-10 rounded-xl bg-surface-2 animate-pulse" aria-hidden="true" />;

  if (!me) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className="text-sm font-bold px-3 py-2 rounded-xl hover:bg-surface-2 transition hidden sm:block">
          ورود
        </Link>
        <Link href="/signup" className="text-sm font-bold px-4 py-2 rounded-xl bg-primary text-primary-fg hover:opacity-90 transition">
          ثبت‌نام
        </Link>
      </div>
    );
  }

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
                className="block px-3 py-2.5 rounded-xl text-sm hover:bg-surface-2 transition">❤️ علاقه‌مندی‌ها</Link>
              {me.role !== "user" && (
                <Link href="/admin" onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm hover:bg-surface-2 transition">🛠️ پنل مدیریت</Link>
              )}
              <button onClick={logout}
                className="w-full text-start px-3 py-2.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition">
                🚪 خروج
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
