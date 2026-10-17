"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import NotifBell from "./NotifBell";
import PlatformNav from "./PlatformNav";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2">
          <Link href="/" aria-label="Vesper - صفحه‌ی اصلی" className="flex items-center gap-2.5 shrink-0">
            <img src="/icons/icon-192.png" alt="Vesper" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
            <span className="font-wordmark font-bold text-[19px] tracking-[0.18em] pt-0.5">Vesper</span>
          </Link>
          <div className="flex-1" aria-hidden="true" />
          <div className="flex items-center shrink-0 rounded-full border border-border bg-surface-2/60 p-1">
            <NotifBell />
            <span className="w-px h-6 bg-border shrink-0" aria-hidden="true" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <PlatformNav />
      <div className="h-10" aria-hidden="true" />
    </>
  );
}
