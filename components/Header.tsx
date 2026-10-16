import Link from "next/link";
import SearchBox from "./SearchBox";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import NotifBell from "./NotifBell";
import PlatformNav from "./PlatformNav";

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
            <Link href="/updates" className="w-10 h-10 rounded-xl hover:bg-surface-2 flex items-center justify-center text-xl transition" title="به‌روزرسانی‌ها" aria-label="به‌روزرسانی‌ها">
              🔄
            </Link>
            <NotifBell />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
        <div className="md:hidden px-4 pb-3">
          <SearchBox compact />
        </div>
      </header>

      {/* نوبار شناور پلتفرم (موبایل و دسکتاپ) */}
      <PlatformNav />
      <div className="h-20" aria-hidden="true" />
    </>
  );
}
