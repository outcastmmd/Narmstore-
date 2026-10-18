import Link from "next/link";

const links = [
  { href: "/categories", label: "دسته‌بندی‌ها" },
  { href: "/popular", label: "محبوب‌ترین‌ها" },
  { href: "/latest", label: "تازه‌ها" },
  { href: "/top", label: "برترین‌های هر دسته" },
  { href: "/alternatives", label: "جایگزین‌های آزاد" },
  { href: "/guides", label: "راهنمای نصب" },
  { href: "/how-we-verify", label: "چطور بررسی می‌کنیم" },
  { href: "/page/about", label: "درباره" },
  { href: "/page/terms", label: "قوانین" },
  { href: "/page/privacy", label: "حریم خصوصی" },
];

export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content p-10 mt-16">
      <aside className="flex flex-col items-center gap-1.5">
        <img src="/icons/icon-192.png" alt="لوگوی Vesper" width={36} height={36} className="w-9 h-9 rounded-xl object-cover" />
        <p className="font-extrabold text-lg">Vesper</p>
        <p className="text-xs opacity-60">فروشگاه اپ‌های آزاد</p>
      </aside>
      <nav aria-label="پیوندها" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="link link-hover text-sm">
            {l.label}
          </Link>
        ))}
      </nav>
      <aside>
        <p className="text-xs opacity-60">© ۱۴۰۵ Vesper</p>
      </aside>
    </footer>
  );
}
