import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryApps, getCategoryBySlug, getChildPreviews } from "@/lib/store";
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

  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  // دسته‌ی والد: نمایش ریل افقی هر زیردسته (به سبک اپ‌استورها)
  const previews = cat.children.length ? await getChildPreviews(cat.id) : [];

  const data = !previews.length ? await getCategoryApps(slug, perPage, (page - 1) * perPage, sort) : null;
  const items = data?.items ?? [];
  const total = data?.total ?? previews.reduce((s, p) => s + p.total, 0);
  const pages = Math.ceil(total / perPage);

  return (
    <div className="animate-fade-up">
      {/* سربرگ */}
      <section className="rounded-3xl overflow-hidden border border-border bg-gradient-to-l from-primary-soft/50 to-surface mb-8" aria-label={cat.nameFa}>
        <div className="p-6 sm:p-8 flex items-center gap-5">
          <span className="text-5xl sm:text-6xl shrink-0" aria-hidden="true">{cat.icon || "📦"}</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{cat.nameFa}</h1>
            <p className="text-sm text-muted mt-1">{toFaDigits(total)} برنامه</p>
            {cat.description && <p className="text-sm text-muted mt-2 leading-7 max-w-2xl">{cat.description}</p>}
          </div>
        </div>
      </section>

      {previews.length > 0 ? (
        /* ریل زیردسته‌ها */
        <div className="space-y-10">
          {previews.map(({ category: ch, apps, total: t }) => (
            <section key={ch.id} aria-label={ch.nameFa}>
              <div className="flex items-center justify-between mb-4">
                <Link href={`/category/${ch.slug}`} className="flex items-center gap-2 group">
                  <span className="text-2xl" aria-hidden="true">{ch.icon || "📦"}</span>
                  <h2 className="text-lg font-extrabold group-hover:text-primary transition">{ch.nameFa}</h2>
                  <span className="text-xs text-muted">({toFaDigits(t)})</span>
                </Link>
                {t > apps.length && (
                  <Link href={`/category/${ch.slug}`} className="text-sm text-primary font-bold hover:underline shrink-0">
                    مشاهده همه ←
                  </Link>
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x scrollbar-none">
                {apps.map((a: any, i: number) => (
                  <div key={a.id} className="w-64 sm:w-72 shrink-0 snap-start">
                    <AppCard app={a} index={i} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* دسته‌ی بدون زیردسته: گرید + مرتب‌سازی + صفحه‌بندی */
        <>
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
              {items.map((a, i) => <AppCard key={a.id} app={a} index={i} />)}
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
        </>
      )}
    </div>
  );
}
