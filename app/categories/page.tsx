import Link from "next/link";
import { getAllCategories } from "@/lib/store";


export const metadata = { title: "دسته‌بندی‌ها" };

export default async function CategoriesPage() {
  const cats = await getAllCategories();
  const roots = cats.filter((c) => !c.parentId);
  const childrenOf = (id: string) => cats.filter((c) => c.parentId === id);

  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-extrabold mb-6">دسته‌بندی‌ها</h1>
      <div className="space-y-6">
        {roots.map((r) => {
          const kids = childrenOf(r.id);
          return (
            <section key={r.id} className="bg-surface border border-border rounded-3xl p-6" aria-label={r.nameFa}>
              <Link href={`/category/${r.slug}`} className="flex items-center gap-3 mb-4 group">
                <span className="text-3xl" aria-hidden="true">{r.icon || "📦"}</span>
                <h2 className="text-lg font-extrabold group-hover:text-primary transition">{r.nameFa}</h2>
                <span className="text-primary text-sm">←</span>
              </Link>
              {kids.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {kids.map((k) => (
                    <Link key={k.id} href={`/category/${k.slug}`}
                      className="text-sm bg-surface-2 hover:bg-primary-soft hover:text-primary border border-border rounded-full px-4 py-2 transition">
                      {k.icon} {k.nameFa}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">زیرشاخه‌ای ثبت نشده است.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
