import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-fg flex items-center justify-center font-bold">ن</span>
            <span className="font-bold">نرم‌استور</span>
          </div>
          <p className="text-sm text-muted leading-7">
            فروشگاه فارسی نرم‌افزار اندروید؛ معرفی و دانلود امن برنامه‌ها با لینک مستقیم و تأیید اصالت فایل.
          </p>
        </div>
        <nav aria-label="دسترسی سریع">
          <h3 className="font-bold mb-3 text-sm">دسترسی سریع</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/categories" className="hover:text-primary">دسته‌بندی‌ها</Link></li>
            <li><Link href="/popular" className="hover:text-primary">محبوب‌ترین‌ها</Link></li>
            <li><Link href="/latest" className="hover:text-primary">تازه‌ترین نسخه‌ها</Link></li>
            <li><Link href="/open-source" className="hover:text-primary">نرم‌افزارهای متن‌باز</Link></li>
          </ul>
        </nav>
        <nav aria-label="راهنما">
          <h3 className="font-bold mb-3 text-sm">راهنما</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/page/install-guide" className="hover:text-primary">راهنمای نصب</Link></li>
            <li><Link href="/page/about" className="hover:text-primary">درباره ما</Link></li>
            <li><Link href="/report" className="hover:text-primary">گزارش مشکل</Link></li>
          </ul>
        </nav>
        <nav aria-label="قوانین">
          <h3 className="font-bold mb-3 text-sm">قوانین</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/page/terms" className="hover:text-primary">قوانین استفاده</Link></li>
            <li><Link href="/page/privacy" className="hover:text-primary">حریم خصوصی</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-xs text-muted flex flex-wrap gap-2 justify-between">
          <span>© ۱۴۰۵ نرم‌استور — تمام حقوق محفوظ است.</span>
          <span>داده‌ها از مخزن رسمی F-Droid دریافت می‌شود.</span>
        </div>
      </div>
    </footer>
  );
}
