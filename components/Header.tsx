"use client";

import SearchBox from "./SearchBox";
import ThemeToggle from "./ThemeToggle";
import NotifBell from "./NotifBell";
import PlatformNav from "./PlatformNav";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <SearchBox compact large />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <NotifBell />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <PlatformNav />
      <div className="h-10" aria-hidden="true" />
    </>
  );
}
