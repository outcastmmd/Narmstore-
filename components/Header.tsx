"use client";

import Link from "next/link";
import SearchBox from "./SearchBox";
import ThemeToggle from "./ThemeToggle";
import NotifBell from "./NotifBell";
import NavDrawer from "./NavDrawer";
import PlatformNav from "./PlatformNav";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2">
          <NavDrawer />
          <div className="flex-1 min-w-0">
            <SearchBox compact large />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <NotifBell />
            <ThemeToggle />
            <Link href="/" aria-label="Vesper - صفحه‌ی اصلی" className="shrink-0">
              <span className="block w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/60 ring-offset-2 ring-offset-surface">
                <img src="/icons/icon-192.png" alt="Vesper" width={40} height={40} className="w-full h-full object-cover" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      <PlatformNav />
      <div className="h-10" aria-hidden="true" />
    </>
  );
}
