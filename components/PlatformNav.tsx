"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { Smartphone, AppWindow, Terminal, type LucideIcon } from "lucide-react";

type Platform = "android" | "windows" | "linux";
const PLATFORMS: { slug: Platform; label: string; Icon: LucideIcon }[] = [
  { slug: "android", label: "اندروید", Icon: Smartphone },
  { slug: "windows", label: "ویندوز", Icon: AppWindow },
  { slug: "linux", label: "لینوکس", Icon: Terminal },
];

function PlatformNavInner() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const urlPlatform = sp.get("platform") as Platform | null;
  const [stored, setStored] = useState<Platform | null>(null);

  // خواندن پلتفرم از localStorage در هر تغییر مسیر
  // فقط برای صفحه‌هایی که پلتفرم توی URL نیست (مثل /app و /collection)
  // توی صفحه اصلی، URL حرف اول رو می‌زنه
  useEffect(() => {
    try {
      if (pathname === "/") {
        // صفحه اصلی: فقط URL مهمه، localStorage نادیده گرفته می‌شه
        setStored(null);
      } else {
        const s = localStorage.getItem("narm-platform") as Platform | null;
        setStored(s === "windows" || s === "linux" ? s : null);
      }
    } catch {
      setStored(null);
    }
  }, [pathname, urlPlatform]);

  const current = urlPlatform || stored || "android";

  const savePlatform = (p: Platform) => {
    try {
      if (p === "android") localStorage.removeItem("narm-platform");
      else localStorage.setItem("narm-platform", p);
    } catch {}
  };

  const href = (p: Platform) => {
    const params = new URLSearchParams(sp.toString());
    if (p === "android") params.delete("platform");
    else params.set("platform", p);
    params.delete("cat");
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <nav
      className="fixed bottom-4 inset-x-0 z-40 flex justify-center pointer-events-none"
      aria-label="انتخاب پلتفرم"
    >
      <div className="pointer-events-auto flex items-center gap-1 bg-surface/95 backdrop-blur border border-border rounded-full px-2 py-2 shadow-xl">
        {PLATFORMS.map((p) => {
          const active = current === p.slug;
          return (
            <Link
              key={p.slug}
              href={href(p.slug)}
              onClick={() => savePlatform(p.slug)}
              aria-pressed={active}
              title={p.label}
              className={`pressable flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-extrabold transition-all ${
                active
                  ? "bg-primary text-primary-fg shadow-md"
                  : "text-muted hover:text-foreground hover:bg-surface-2"
              }`}
            >
              <p.Icon className="w-5 h-5" aria-hidden="true" />
              <span className={active ? "" : "hidden sm:inline"}>{p.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function PlatformNav() {
  return (
    <Suspense fallback={null}>
      <PlatformNavInner />
    </Suspense>
  );
}
