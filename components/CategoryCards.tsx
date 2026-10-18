"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { LayoutGrid } from "lucide-react";
import { toFaDigits } from "@/lib/fa";
import DbIcon from "./DbIcon";

type Cat = { id: string; slug: string; nameFa: string; icon?: string | null; appCount?: number };

// دکمه‌های آیکونی دسته‌بندی — بدون اسم، کوچک و مینیمال
export default function CategoryCards({ cats }: { cats: Cat[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const active = sp.get("cat");

  const go = (slug: string) => {
    const p = sp.get("platform");
    const qs = p === "windows" || p === "linux" ? `?platform=${p}&cat=${slug}` : `?cat=${slug}`;
    const nav = () => startTransition(() => router.push(`/${qs}`, { scroll: false }));
    if (document.startViewTransition) document.startViewTransition(nav);
    else nav();
  };

  if (!cats.length) return null;

  return (
    <section aria-label="دسته‌بندی‌ها" className="mb-10">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-base font-extrabold flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-primary" aria-hidden="true" />
          دسته‌بندی‌ها
        </h2>
        <span className="badge badge-ghost badge-sm font-bold">
          {toFaDigits(cats.length)} دسته
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {cats.map((c) => {
          const isActive = active === c.slug;
          return (
            <button
              key={c.id}
              onClick={() => go(c.slug)}
              title={c.nameFa}
              aria-label={c.nameFa}
              aria-current={isActive ? "true" : undefined}
              className={`w-16 h-16 rounded-2xl grid place-items-center transition-all shrink-0 ${
                isActive
                  ? "bg-primary text-primary-content shadow"
                  : "bg-base-200 text-primary hover:scale-105"
              } ${pending ? "opacity-70" : ""}`}
            >
              <DbIcon icon={c.icon} className="w-7 h-7" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
