"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, House, LayoutGrid, Trophy, Clock3, LogIn, UserPlus } from "lucide-react";

const NAV = [
  { href: "/", label: "خانه", Icon: House },
  { href: "/categories", label: "دسته‌بندی‌ها", Icon: LayoutGrid },
  { href: "/popular", label: "محبوب‌ترین‌ها", Icon: Trophy },
  { href: "/latest", label: "تازه‌ها", Icon: Clock3 },
];

export default function NavDrawer() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="باز کردن منو"
        className="w-10 h-10 shrink-0 rounded-xl hover:bg-surface-2 flex items-center justify-center transition"
      >
        <Menu className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
      </button>

      <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          onClick={close}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute top-0 bottom-0 start-0 w-72 max-w-[85vw] bg-surface border-e border-border p-4 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-label="منوی ناوبری"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-2">
              <img src="/icons/icon-192.png" alt="" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-wordmark font-bold tracking-[0.18em]">Vesper</span>
            </span>
            <button onClick={close} aria-label="بستن منو"
              className="w-9 h-9 rounded-xl hover:bg-surface-2 flex items-center justify-center transition">
              <X className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <nav className="space-y-1" aria-label="ناوبری اصلی">
            {NAV.map(({ href, label, Icon }) => (
              <Link key={href} href={href} onClick={close}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-bold hover:bg-surface-2 transition">
                <Icon className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-border mt-4 pt-4 space-y-1">
            <Link href="/login" onClick={close}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-bold hover:bg-surface-2 transition">
              <LogIn className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
              ورود
            </Link>
            <Link href="/signup" onClick={close}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-bold bg-primary text-primary-fg hover:opacity-90 transition">
              <UserPlus className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
              ثبت‌نام
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
