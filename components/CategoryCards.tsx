"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toFaDigits } from "@/lib/fa";

type Cat = { id: string; slug: string; nameFa: string; icon?: string | null; appCount?: number };

// گرادیان‌های مخصوص هر دسته — پالت اختصاصی نرم‌استور
const GRADIENTS = [
  "from-violet-500/20 to-violet-500/5",
  "from-amber-500/20 to-amber-500/5",
  "from-rose-500/20 to-rose-500/5",
  "from-emerald-500/20 to-emerald-500/5",
  "from-sky-500/20 to-sky-500/5",
  "from-orange-500/20 to-orange-500/5",
  "from-fuchsia-500/20 to-fuchsia-500/5",
  "from-teal-500/20 to-teal-500/5",
  "from-indigo-500/20 to-indigo-500/5",
  "from-lime-500/20 to-lime-500/5",
];

export default function CategoryCards({ cats }: { cats: Cat[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const active = sp.get("cat");

  const go = (slug: string) => {
    const nav = () => startTransition(() => router.push(`/?cat=${slug}`, { scroll: false }));
    if (document.startViewTransition) document.startViewTransition(nav);
    else nav();
  };

  if (!cats.length) return null;

  return (
    <section aria-label="مرور دسته‌بندی‌ها" className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg font-extrabold">🗂️ مرور دسته‌بندی‌ها</h2>
        <p className="text-xs text-muted">بکش و یکی رو انتخاب کن</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-none -mx-4 px-4">
        {cats.map((c, i) => {
          const isActive = active === c.slug;
          const grad = GRADIENTS[i % GRADIENTS.length];
          return (
            <button
              key={c.id}
              onClick={() => go(c.slug)}
              aria-current={isActive ? "true" : undefined}
              className={`pressable snap-start shrink-0 w-28 rounded-3xl border p-4 flex flex-col items-center gap-2 bg-gradient-to-b ${grad} ${
                isActive
                  ? "border-primary shadow-lg shadow-primary/20 scale-[1.03]"
                  : "border-border hover:border-primary/40 hover:-translate-y-0.5"
              } transition-all ${pending ? "opacity-70" : ""}`}
            >
              <span className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-2xl shadow-sm">
                <span aria-hidden="true">{c.icon || "📦"}</span>
              </span>
              <span className="text-sm font-extrabold text-center leading-5 line-clamp-2 min-h-[2.5rem]">
                {c.nameFa}
              </span>
              {typeof c.appCount === "number" && (
                <span className="text-xs text-muted font-bold">
                  {toFaDigits(c.appCount)} برنامه
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
