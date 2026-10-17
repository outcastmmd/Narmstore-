import Link from "next/link";
import SearchBox from "./SearchBox";
import { SlidersHorizontal } from "lucide-react";
import type { Platform } from "@/lib/store";

// هیروی صفحه‌ی اصلی: جست‌وجوی بزرگ + چیپ‌های دسته‌ی سریع
export default function HeroSearch({
  cats, platform,
}: {
  cats: { slug: string; nameFa: string }[];
  platform?: Platform;
}) {
  const platQs = platform && platform !== "android" ? `?platform=${platform}` : "";
  return (
    <section aria-label="جست‌وجوی سریع" className="bg-surface border border-border rounded-3xl p-5 sm:p-6 mb-10">
      <div className="flex gap-2">
        <div className="flex-1 min-w-0">
          <SearchBox compact />
        </div>
        <Link
          href={`/categories${platQs}`}
          aria-label="فیلتر دسته‌بندی‌ها"
          title="دسته‌بندی‌ها"
          className="w-11 h-11 shrink-0 rounded-xl bg-primary text-primary-fg flex items-center justify-center hover:opacity-90 transition"
        >
          <SlidersHorizontal className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
      {cats.length > 0 && (
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-none pb-1" role="list" aria-label="دسته‌های پرطرفدار">
          {cats.map((c) => (
            <Link
              key={c.slug}
              role="listitem"
              href={`/category/${c.slug}${platQs}`}
              className="shrink-0 text-sm font-bold px-4 py-2 rounded-full bg-surface-2 border border-border hover:border-primary/60 hover:text-primary transition"
            >
              {c.nameFa}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
