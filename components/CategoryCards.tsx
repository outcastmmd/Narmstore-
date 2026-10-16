"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { LayoutGrid } from "lucide-react";
import { toFaDigits } from "@/lib/fa";
import DbIcon from "./DbIcon";

type Cat = { id: string; slug: string; nameFa: string; icon?: string | null; appCount?: number };

// پالت‌های دسته‌بندی — در تم روشن ملایم، در تم تیره عمیق
const GRADIENTS = [
  "from-violet-500/12 to-transparent dark:from-violet-500/25 dark:to-violet-950/40",
  "from-amber-500/12 to-transparent dark:from-amber-500/20 dark:to-amber-950/40",
  "from-rose-500/12 to-transparent dark:from-rose-500/20 dark:to-rose-950/40",
  "from-emerald-500/12 to-transparent dark:from-emerald-500/20 dark:to-emerald-950/40",
  "from-sky-500/12 to-transparent dark:from-sky-500/20 dark:to-sky-950/40",
  "from-orange-500/12 to-transparent dark:from-orange-500/20 dark:to-orange-950/40",
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
    <section aria-label="دسته‌بندی‌ها" className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg font-extrabold flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-primary" aria-hidden="true" />
          دسته‌بندی‌ها
        </h2>
        <p className="text-xs text-muted">بکش و یکی رو انتخاب کن</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-none -mx-4 px-4">
        {cats.map((c, i) => {
          const isActive = active === c.slug;
          const plain = i % 2 === 1; // یکی در میان: کارت ساده با بوردر
          const grad = GRADIENTS[(i >> 1) % GRADIENTS.length];
          return (
            <button
              key={c.id}
              onClick={() => go(c.slug)}
              aria-current={isActive ? "true" : undefined}
              className={`pressable snap-start shrink-0 w-28 rounded-3xl border p-4 flex flex-col items-center gap-2 ${
                plain ? "bg-surface" : `bg-gradient-to-b ${grad}`
              } ${
                isActive
                  ? "border-primary shadow-lg shadow-primary/20 scale-[1.03]"
                  : "border-border hover:border-primary/40 hover:-translate-y-0.5"
              } transition-all ${pending ? "opacity-70" : ""}`}
            >
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                plain ? "bg-primary/10 text-primary" : "bg-surface text-foreground"
              }`}>
                <DbIcon icon={c.icon} className="w-6 h-6" />
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
