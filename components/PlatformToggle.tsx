"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { PLATFORMS, type Platform } from "@/lib/store";

export default function PlatformToggle() {
  const sp = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const current = (sp.get("platform") as Platform) || "android";

  const go = (p: Platform) => {
    const params = new URLSearchParams(sp.toString());
    if (p === "android") params.delete("platform");
    else params.set("platform", p);
    params.delete("cat"); // سوییچ پلتفرم، دسته را ریست می‌کند
    const nav = () => startTransition(() => router.push(`/?${params.toString()}`, { scroll: false }));
    if (document.startViewTransition) document.startViewTransition(nav);
    else nav();
  };

  return (
    <div className="flex justify-center mb-6" role="tablist" aria-label="پلتفرم">
      <div className="inline-flex bg-surface border border-border rounded-2xl p-1.5 gap-1 shadow-sm">
        {PLATFORMS.map((p) => {
          const active = current === p.slug;
          return (
            <button key={p.slug} role="tab" aria-selected={active}
              onClick={() => go(p.slug)}
              className={`pressable flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all ${
                active
                  ? "bg-primary text-primary-fg shadow-md scale-[1.03]"
                  : "text-muted hover:text-foreground hover:bg-surface-2"
              } ${pending ? "opacity-60" : ""}`}>
              <span className="text-lg" aria-hidden="true">{p.icon}</span>
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
