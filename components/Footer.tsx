import Link from "next/link";

const links = [
  { href: "/categories", label: "دسته‌بندی‌ها" },
  { href: "/popular", label: "پرطرفدارها" },
  { href: "/latest", label: "تازه‌ها" },
  { href: "/top", label: "برترین‌ها" },
  { href: "/alternatives", label: "جایگزین‌ها" },
  { href: "/guides", label: "راهنمای نصب" },
  { href: "/how-we-verify", label: "روش بررسی ما" },
  { href: "/page/about", label: "درباره‌ی ما" },
  { href: "/page/terms", label: "قوانین" },
  { href: "/page/privacy", label: "حریم خصوصی" },
];

export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content px-6 py-8 mt-12 gap-5">
      <aside className="flex flex-row items-center gap-2.5">
        <img src="/icons/icon-192.png" alt="لوگوی Vesper" width={32} height={32} className="w-8 h-8 rounded-xl object-cover" />
        <div className="text-start">
          <p className="font-extrabold text-sm leading-5">Vesper</p>
          <p className="text-[11px] opacity-60">فروشگاه اپ‌های آزاد</p>
        </div>
      </aside>
      <nav aria-label="پیوندها" className="grid grid-cols-3 sm:grid-cols-5 gap-x-4 gap-y-2.5 max-w-lg">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="link link-hover text-[13px] text-center">
            {l.label}
          </Link>
        ))}
      </nav>
      <aside>
        <p className="text-[11px] opacity-50">© ۱۴۰۵ Vesper</p>
      </aside>
    </footer>
  );
}
