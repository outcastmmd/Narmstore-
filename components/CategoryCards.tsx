"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { LayoutGrid, ChevronLeft } from "lucide-react";
import { toFaDigits } from "@/lib/fa";
import DbIcon from "./DbIcon";

type Cat = { id: string; slug: string; nameFa: string; icon?: string | null; appCount?: number };

// لهجه‌ی رنگی هر دسته — آیکون و واش پس‌زمینه
const TINTS = [
  { wash: "from-violet-500/[0.10] dark:from-violet-500/[0.16]", icon: "bg-violet-500/12 text-violet-600 dark:text-violet-300" },
  { wash: "from-amber-500/[0.10] dark:from-amber-500/[0.14]", icon: "bg-amber-500/12 text-amber-600 dark:text-amber-300" },
  { wash: "from-rose-500/[0.10] dark:from-rose-500/[0.16]", icon: "bg-rose-500/12 text-rose-600 dark:text-rose-300" },
  { wash: "from-emerald-500/[0.10] dark:from-emerald-500/[0.14]", icon: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300" },
  { wash: "from-sky-500/[0.10] dark:from-sky-500/[0.16]", icon: "bg-sky-500/12 text-sky-600 dark:text-sky-300" },
  { wash: "from-orange-500/[0.10] dark:from-orange-500/[0.14]", icon: "bg-orange-500/12 text-orange-600 dark:text-orange-300" },
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
    <section aria-label="دسته‌بندی‌ها" className="mb-10">
      <div className="flex items-center justify-between mb-5 px-1">
        <h2 className="text-xl font-extrabold flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
            <LayoutGrid className="w-5 h-5" aria-hidden="true" />
          </span>
          دسته‌بندی‌ها
        </h2>
        <span className="text-xs text-muted font-bold bg-surface border border-border rounded-full px-3 py-1.5">
          {toFaDigits(cats.length)} دسته
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {cats.map((c, i) => {
          const isActive = active === c.slug;
          const tint = TINTS[i % TINTS.length];
          return (
            <button
              key={c.id}
              onClick={() => go(c.slug)}
              aria-current={isActive ? "true" : undefined}
              className={`pressable group relative rounded-3xl border p-5 flex flex-col items-start gap-3.5 text-right overflow-hidden transition-all duration-200 ${
                isActive
                  ? "border-primary shadow-lg shadow-primary/15 bg-primary/[0.06]"
                  : `border-border hover:border-primary/40 hover:-translate-y-0.5 bg-gradient-to-bl ${tint.wash} to-transparent bg-surface`
              } ${pending ? "opacity-70" : ""}`}
            >
              <span className={`w-12 h-12 rounded-2xl grid place-items-center shrink-0 ${tint.icon}`}>
                <DbIcon icon={c.icon} className="w-6 h-6" />
              </span>
              <span className="min-w-0">
                <span className="block font-extrabold leading-6 text-[15px]">{c.nameFa}</span>
                {typeof c.appCount === "number" && (
                  <span className="block text-xs text-muted mt-1.5 font-bold">
                    {toFaDigits(c.appCount)} برنامه
                  </span>
                )}
              </span>
              <ChevronLeft
                className="w-4 h-4 text-muted/50 absolute left-4 bottom-5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
