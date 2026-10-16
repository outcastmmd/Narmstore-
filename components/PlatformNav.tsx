"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";

type Platform = "android" | "windows" | "linux";
const PLATFORMS: { slug: Platform; label: string; icon: string }[] = [
  { slug: "android", label: "اندروید", icon: "🤖" },
  { slug: "windows", label: "ویندوز", icon: "🪟" },
  { slug: "linux", label: "لینوکس", icon: "🐧" },
];

function PlatformNavInner() {
  const sp = useSearchParams();
  const urlPlatform = sp.get("platform") as Platform | null;
  // پلتفرم از URL، وگرنه از localStorage (برای صفحه‌های برنامه و کالکشن)
  const [stored, setStored] = useState<Platform | null>(null);
  useEffect(() => {
    const s = localStorage.getItem("narm-platform") as Platform | null;
    if (s === "windows" || s === "linux" || s === "android") setStored(s);
  }, []);
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
              <span className="text-xl leading-none" aria-hidden="true">{p.icon}</span>
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
