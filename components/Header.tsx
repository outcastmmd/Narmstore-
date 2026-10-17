"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SearchBox from "./SearchBox";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import NotifBell from "./NotifBell";
import PlatformNav from "./PlatformNav";

const NAV = [
  { href: "/", label: "خانه" },
  { href: "/categories", label: "دسته‌بندی‌ها" },
  { href: "/popular", label: "محبوب‌ترین‌ها" },
  { href: "/latest", label: "تازه‌ها" },
];

export default function Header() {
  const pathname = usePathname();
  // صفحه‌ی اصلی جست‌وجوی هیرو را دارد؛ جست‌وجوی هدر فقط برای بقیه‌ی صفحه‌هاست
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isHome) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-border">
        {/* ردیف اصلی: لوگو، جست‌وجو (غیر خانه)، ناوبری، ابزارها — هنگام اسکرول جمع می‌شود */}
        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ${scrolled ? "max-h-0 opacity-0" : "max-h-16 opacity-100"}`}
          aria-hidden={scrolled}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2 sm:gap-3">
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Vesper - صفحه اصلی" tabIndex={scrolled ? -1 : 0}>
              <img src="/icons/icon-192.png" alt="لوگوی Vesper" width={40} height={40} className="w-10 h-10 rounded-xl object-cover" />
              <span className="font-wordmark font-bold text-[19px] tracking-[0.18em] pt-0.5">Vesper</span>
            </Link>
            {!isHome && (
              <div className="hidden md:block flex-1 max-w-md">
                <SearchBox compact />
              </div>
            )}
            <nav className={`hidden md:flex items-center gap-1 text-sm ${isHome ? "" : "ms-auto"}`} aria-label="ناوبری اصلی">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} tabIndex={scrolled ? -1 : 0}
                  className="px-3 py-2 rounded-xl hover:bg-surface-2 transition font-medium">
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className={`flex items-center gap-1.5 ${isHome ? "ms-auto" : "ms-auto md:ms-0"}`}>
              <NotifBell />
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>

        {/* ردیف جست‌وجو: فقط غیر صفحه‌ی اصلی — موبایل همیشه، دسکتاپ هنگام اسکرول */}
        {!isHome && (
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 ${scrolled ? "" : "md:hidden"}`}>
            <div className={scrolled ? "py-2" : "pt-1 pb-3"}>
              <SearchBox compact slim={scrolled} />
            </div>
          </div>
        )}
      </header>

      {/* نوبار شناور پلتفرم (موبایل و دسکتاپ) */}
      <PlatformNav />
      <div className="h-10" aria-hidden="true" />
    </>
  );
}
