"use client";
import { useRouter } from "next/navigation";

export default function SearchCategoryFilter({
  cats, current, base,
}: {
  cats: { slug: string; nameFa: string }[];
  current: string;
  base: string;
}) {
  const router = useRouter();
  return (
    <select
      value={current}
      onChange={(e) => router.push(`${base}${e.target.value ? `&cat=${e.target.value}` : ""}`)}
      aria-label="فیلتر دسته‌بندی"
      className="select select-bordered select-sm max-w-44"
    >
      <option value="">همه‌ی دسته‌ها</option>
      {cats.map((c) => (
        <option key={c.slug} value={c.slug}>{c.nameFa}</option>
      ))}
    </select>
  );
}
