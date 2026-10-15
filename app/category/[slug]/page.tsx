import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryApps } from "@/lib/store";
import AppCard from "@/components/AppCard";
import { toFaDigits } from "@/lib/fa";


type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ sort?: string; page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryApps(slug, 1);
  if (!data) return { title: "یافت نشد" };
  return {
    title: data.category.nameFa,
    description: `دانلود بهترین برنامه‌های ${data.category.nameFa} برای اندروید`,
    alternates: { canonical: `/category/${slug}` },
  };
}

const SORTS = [
  ["updated", "آخرین به‌روزرسانی"],
  ["popular", "محبوب‌ترین"],
  ["name", "نام"],
] as const;

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const sort = (sp.sort === "popular" || sp.sort === "name") ? sp.sort : "updated";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const perPage = 24;

  const data = await getCategoryApps(slug, perPage, (page - 1) * perPage, sort);
  if (!data) notFound();
  const { category, items, total } = data;
  const pages = Math.ceil(total / perPage);

  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl" aria-hidden="true">{category.icon || "📦"}</span>
        <div>
          <h1 className="text-2xl font-extrabold">{category.nameFa}</h1>
          <p className="text-sm text-muted">{toFaDigits(total)} برنامه</p>
        </div>
      </div>
      {category.description && <p className="text-sm text-muted mb-6 leading-7">{category.description}</p>}

      {category.children.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {category.children.map((k) => (
            <Link key={k.id} href={`/category/${k.slug}`}
              className="text-sm bg-surface border border-border hover:border-primary/50 rounded-full px-4 py-2 transition">
              {k.icon} {k.nameFa}
            </Link>
          ))}
        </div>
      )}

      <div className="flex gap-2 mb-6" role="group" aria-label="مرتب‌سازی">
        {SORTS.map(([key, label]) => (
          <Link key={key} href={`/category/${slug}?sort=${key}`}
            className={`text-sm px-4 py-2 rounded-xl border transition ${sort === key
              ? "bg-primary text-primary-fg border-primary font-bold"
              : "bg-surface border-border hover:border-primary/50"}`}>
            {label}
          </Link>
        ))}
      </div>

      {items.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((a) => <AppCard key={a.id} app={a} />)}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-3xl p-10 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-bold mb-1">برنامه‌ای در این دسته ثبت نشده است</p>
          <p className="text-sm text-muted">به‌زودی برنامه‌های جدید اضافه می‌شود.</p>
        </div>
      )}

      {pages > 1 && (
        <nav className="flex justify-center gap-2 mt-8" aria-label="صفحه‌بندی">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`/category/${slug}?sort=${sort}&page=${p}`}
              aria-current={p === page ? "page" : undefined}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm border transition ${p === page
                ? "bg-primary text-primary-fg border-primary font-bold"
                : "bg-surface border-border hover:border-primary/50"}`}>
              {toFaDigits(p)}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
