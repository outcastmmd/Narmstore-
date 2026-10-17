import Link from "next/link";

const links = [
  { href: "/categories", label: "دسته‌بندی‌ها" },
  { href: "/popular", label: "محبوب‌ترین‌ها" },
  { href: "/latest", label: "تازه‌ها" },
  { href: "/alternatives", label: "جایگزین‌های آزاد" },
  { href: "/guides", label: "راهنمای نصب" },
  { href: "/how-we-verify", label: "چطور بررسی می‌کنیم" },
  { href: "/page/about", label: "درباره" },
  { href: "/page/terms", label: "قوانین" },
  { href: "/page/privacy", label: "حریم خصوصی" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/60 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col items-center gap-7 text-center">
          <div className="flex items-center gap-2.5">
            <img src="/icons/icon-192.png" alt="لوگوی نرم‌استور" width={36} height={36} className="w-9 h-9 rounded-xl object-cover" />
            <span className="font-extrabold text-lg">نرم‌استور</span>
          </div>
          <nav aria-label="پیوندها" className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm text-muted">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-primary transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-muted/60">© ۱۴۰۵ نرم‌استور</p>
        </div>
      </div>
    </footer>
  );
}
