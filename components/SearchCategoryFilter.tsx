"use client";
import { useRouter } from "next/navigation";
import { ListFilter } from "lucide-react";

export default function SearchCategoryFilter({
  cats, current, base,
}: {
  cats: { slug: string; nameFa: string }[];
  current: string;
  base: string;
}) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl border bg-surface border-border hover:border-primary/50 transition cursor-pointer">
      <ListFilter className="w-4 h-4 text-muted shrink-0" strokeWidth={2} aria-hidden="true" />
      <select
        value={current}
        onChange={(e) => router.push(`${base}${e.target.value ? `&cat=${e.target.value}` : ""}`)}
        aria-label="فیلتر دسته‌بندی"
        className="bg-transparent font-bold cursor-pointer focus:outline-none max-w-40 truncate"
      >
        <option value="">همه‌ی دسته‌ها</option>
        {cats.map((c) => (
          <option key={c.slug} value={c.slug}>{c.nameFa}</option>
        ))}
      </select>
    </label>
  );
}
