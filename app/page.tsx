import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import AppCard from "@/components/AppCard";
import Section from "@/components/Section";
import CategoryPills from "@/components/CategoryPills";
import {
  getRootCategories, getFeaturedApps, getPopularApps,
  getLatestApps, getEditorChoice, getOpenSourceApps,
  getCategoryBySlug, getChildPreviews,
} from "@/lib/store";
import { toFaDigits } from "@/lib/fa";
import { px } from "@/lib/img";


type Props = { searchParams: Promise<{ cat?: string }> };

async function HomeSlide() {
  const [featured, popular, latest, editors, oss] = await Promise.all([
    getFeaturedApps(4), getPopularApps(8),
    getLatestApps(8), getEditorChoice(8), getOpenSourceApps(8),
  ]);
  const hero = featured[0];

  return (
    <>
      {/* بنر منتخب */}
      {hero && (
        <section className="mb-10 rounded-3xl overflow-hidden border border-border bg-surface" aria-label="نرم‌افزار منتخب">
          <div className="p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-gradient-to-l from-primary-soft/60 to-transparent">
            {hero.iconUrl && (
              <Image src={px(hero.iconUrl) || "/icons/icon-192.png"} alt={`آیکون ${hero.nameFa}`} width={96} height={96}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-surface-2 object-cover shadow-lg" />
            )}
            <div className="flex-1">
              <p className="text-xs font-bold text-primary mb-1">✨ پیشنهاد نرم‌استور</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{hero.nameFa}</h1>
              <p className="text-muted text-sm leading-7 line-clamp-2 max-w-2xl">{hero.shortDescFa || hero.shortDesc}</p>
              <Link href={`/app/${hero.slug}`}
                className="inline-block mt-4 bg-primary text-primary-fg font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition">
                مشاهده و دانلود
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* محبوب‌ترین‌ها */}
      <Section title="محبوب‌ترین نرم‌افزارها" href="/popular" empty="هنوز آماری ثبت نشده است.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((a) => <AppCard key={a.id} app={a} />)}
        </div>
      </Section>

      {/* تازه‌ترین نسخه‌ها */}
      <Section title="تازه‌ترین نسخه‌ها" href="/latest">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latest.map((a) => <AppCard key={a.id} app={a} />)}
        </div>
      </Section>

      {/* منتخب سردبیر */}
      {editors.length > 0 && (
        <Section title="منتخب سردبیر">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {editors.map((a) => <AppCard key={a.id} app={a} />)}
          </div>
        </Section>
      )}

      {/* متن‌باز */}
      <Section title="نرم‌افزارهای متن‌باز" href="/open-source">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {oss.map((a) => <AppCard key={a.id} app={a} />)}
        </div>
      </Section>
    </>
  );
}

async function CategorySlide({ slug }: { slug: string }) {
  const cat = await getCategoryBySlug(slug);
  if (!cat) return <p className="text-muted text-center py-10">دسته‌بندی یافت نشد.</p>;
  const previews = await getChildPreviews(cat.id);
  const total = previews.reduce((s, p) => s + p.total, 0);

  return (
    <div className="animate-fade-up" key={slug}>
      <div className="flex items-center gap-4 mb-8">
        <span className="text-5xl" aria-hidden="true">{cat.icon || "📦"}</span>
        <div>
          <h1 className="text-2xl font-extrabold">{cat.nameFa}</h1>
          <p className="text-sm text-muted">{toFaDigits(total)} برنامه</p>
        </div>
      </div>
      {previews.length ? (
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
              <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x">
                {apps.map((a: any) => (
                  <div key={a.id} className="w-64 sm:w-72 shrink-0 snap-start">
                    <AppCard app={a} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-muted text-center py-10">به‌زودی برنامه‌های جدید اضافه می‌شود.</p>
      )}
    </div>
  );
}

export default async function Home({ searchParams }: Props) {
  const { cat } = await searchParams;
  const cats = await getRootCategories();

  return (
    <div>
      <Suspense>
        <CategoryPills cats={cats} />
      </Suspense>
      {cat ? <CategorySlide slug={cat} /> : <HomeSlide />}
    </div>
  );
}
