"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTransition, Suspense } from "react";

type Platform = "android" | "windows" | "linux";
const PLATFORMS: { slug: Platform; label: string; icon: string }[] = [
  { slug: "android", label: "اندروید", icon: "🤖" },
  { slug: "windows", label: "ویندوز", icon: "🪟" },
  { slug: "linux", label: "لینوکس", icon: "🐧" },
];

function PlatformNavInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const current = (sp.get("platform") as Platform) || "android";

  const go = (p: Platform) => {
    const params = new URLSearchParams(sp.toString());
    if (p === "android") params.delete("platform");
    else params.set("platform", p);
    params.delete("cat");
    const target = pathname === "/" ? `/?${params.toString()}` : `/?${params.toString()}`;
    const nav = () => startTransition(() => router.push(target, { scroll: false }));
    if (document.startViewTransition) document.startViewTransition(nav);
    else nav();
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
            <button
              key={p.slug}
              onClick={() => go(p.slug)}
              aria-pressed={active}
              title={p.label}
              className={`pressable flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-extrabold transition-all ${
                active
                  ? "bg-primary text-primary-fg shadow-md"
                  : "text-muted hover:text-foreground hover:bg-surface-2"
              } ${pending ? "opacity-60" : ""}`}
            >
              <span className="text-xl leading-none" aria-hidden="true">{p.icon}</span>
              <span className={active ? "" : "hidden sm:inline"}>{p.label}</span>
            </button>
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
