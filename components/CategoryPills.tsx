"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Cat = { id: string; slug: string; nameFa: string; icon?: string | null };

export default function CategoryPills({ cats }: { cats: Cat[] }) {
  const sp = useSearchParams();
  const active = sp.get("cat");

  const pill = (isActive: boolean) =>
    `shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold border transition-all snap-start ${
      isActive
        ? "bg-primary text-primary-fg border-primary shadow-md scale-[1.03]"
        : "bg-surface border-border text-foreground hover:border-primary/50"
    }`;

  return (
    <nav aria-label="دسته‌بندی‌ها"
      className="sticky top-0 z-30 -mx-4 px-4 py-3 mb-6 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x scrollbar-none">
        <Link href="/" className={pill(!active)} aria-current={!active ? "page" : undefined}>
          <span aria-hidden="true">🏠</span> خانه
        </Link>
        {cats.map((c) => (
          <Link key={c.id} href={`/?cat=${c.slug}`} className={pill(active === c.slug)}
            aria-current={active === c.slug ? "page" : undefined}>
            <span aria-hidden="true">{c.icon || "📦"}</span> {c.nameFa}
          </Link>
        ))}
      </div>
    </nav>
  );
}
