"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";

type Cat = { id: string; slug: string; nameFa: string; icon?: string | null };

export default function CategoryPills({ cats }: { cats: Cat[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const active = sp.get("cat");

  const go = (href: string) => {
    // ترنزیشن نرم بین تب‌ها با View Transitions API
    const nav = () => startTransition(() => router.push(href, { scroll: false }));
    if (document.startViewTransition) document.startViewTransition(nav);
    else nav();
  };

  const pill = (isActive: boolean) =>
    `pressable shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold border snap-start cursor-pointer ${
      isActive
        ? "bg-primary text-primary-fg border-primary shadow-md scale-[1.04]"
        : "bg-surface border-border text-foreground hover:border-primary/50"
    } ${pending ? "opacity-70" : ""}`;

  return (
    <nav aria-label="دسته‌بندی‌ها"
      className="sticky top-0 z-30 -mx-4 px-4 py-3 mb-6 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x scrollbar-none">
        <button onClick={() => go("/")} className={pill(!active)} aria-current={!active ? "page" : undefined}>
          <span aria-hidden="true">🏠</span> خانه
        </button>
        {cats.map((c) => (
          <button key={c.id} onClick={() => go(`/?cat=${c.slug}`)} className={pill(active === c.slug)}
            aria-current={active === c.slug ? "page" : undefined}>
            <span aria-hidden="true">{c.icon || "📦"}</span> {c.nameFa}
          </button>
        ))}
      </div>
      {pending && <div className="h-0.5 mt-2 rounded-full bg-primary/60 animate-pulse" aria-hidden="true" />}
    </nav>
  );
}
