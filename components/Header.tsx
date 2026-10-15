import Link from "next/link";
import SearchBox from "./SearchBox";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="نرم‌استور - صفحه اصلی">
            <span className="w-9 h-9 rounded-xl bg-primary text-primary-fg flex items-center justify-center text-xl font-bold">ن</span>
            <span className="font-bold text-lg hidden sm:inline">نرم‌استور</span>
          </Link>
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBox compact />
          </div>
          <nav className="hidden md:flex items-center gap-1 text-sm ms-auto" aria-label="ناوبری اصلی">
            <Link href="/" className="px-3 py-2 rounded-lg hover:bg-surface-2 transition">خانه</Link>
            <Link href="/categories" className="px-3 py-2 rounded-lg hover:bg-surface-2 transition">دسته‌بندی‌ها</Link>
            <Link href="/popular" className="px-3 py-2 rounded-lg hover:bg-surface-2 transition">محبوب‌ترین‌ها</Link>
            <Link href="/latest" className="px-3 py-2 rounded-lg hover:bg-surface-2 transition">تازه‌ها</Link>
          </nav>
          <div className="ms-auto md:ms-0 flex items-center gap-2">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
        <div className="md:hidden px-4 pb-3">
          <SearchBox compact />
        </div>
      </header>

      {/* ناوبری پایین موبایل */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-border"
        aria-label="ناوبری موبایل"
      >
        <div className="grid grid-cols-4 text-center text-xs">
          <Link href="/" className="py-2.5 flex flex-col items-center gap-0.5 hover:text-primary">
            <span className="text-lg">🏠</span>خانه
          </Link>
          <Link href="/categories" className="py-2.5 flex flex-col items-center gap-0.5 hover:text-primary">
            <span className="text-lg">🗂️</span>دسته‌ها
          </Link>
          <Link href="/popular" className="py-2.5 flex flex-col items-center gap-0.5 hover:text-primary">
            <span className="text-lg">🔥</span>محبوب‌ها
          </Link>
          <Link href="/latest" className="py-2.5 flex flex-col items-center gap-0.5 hover:text-primary">
            <span className="text-lg">✨</span>تازه‌ها
          </Link>
        </div>
      </nav>
      <div className="md:hidden h-16" aria-hidden="true" />
    </>
  );
}
