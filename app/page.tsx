import Link from "next/link";
import PxImg from "@/components/PxImg";
import { Suspense } from "react";
import AppCard from "@/components/AppCard";
import Section from "@/components/Section";
import CategoryPills from "@/components/CategoryPills";
import CategoryCards from "@/components/CategoryCards";
import {
  getRootCategories, getFeaturedApps, getPopularApps,
  getLatestApps, getEditorChoice, getOpenSourceApps,
  getCategoryBySlug, getChildPreviews, getCollections,
} from "@/lib/store";
import { toFaDigits } from "@/lib/fa";
import { px } from "@/lib/img";
import type { Platform } from "@/lib/store";

type Props = { searchParams: Promise<{ cat?: string; platform?: string }> };

async function HomeSlide({ platform }: { platform?: Platform }) {
  const [featured, popular, latest, editors, oss, collections] = await Promise.all([
    getFeaturedApps(4, platform), getPopularApps(8, platform),
    getLatestApps(8, platform), getEditorChoice(8, platform), getOpenSourceApps(8, platform), getCollections(platform),
  ]);
  const hero = featured[0];

  return (
    <>
      {/* بنر منتخب */}
      {hero && (
        <section className="mb-10 rounded-3xl overflow-hidden border border-border bg-surface" aria-label="نرم‌افزار منتخب">
          <div className="p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-gradient-to-l from-primary-soft/60 to-transparent">
            {hero.iconUrl && (
              <PxImg src={px(hero.iconUrl) || "/icons/icon-192.png"} alt={`آیکون ${hero.nameFa}`} width={96} height={96}
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

      {/* کالکشن‌های منتخب */}
      {collections.length > 0 && (
        <Section title="کالکشن‌های منتخب" href="/collections">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {collections.map((c, ci) => (
              <Link key={c.id} href={`/collection/${c.slug}`}
                style={{ animationDelay: `${ci * 60}ms` }}
                className="animate-card-in card-hover bg-gradient-to-bl from-primary-soft/70 to-surface border border-border rounded-3xl p-5 flex flex-col gap-2 min-h-32">
                <span className="text-4xl" aria-hidden="true">{c.icon || "✨"}</span>
                <span className="font-extrabold">{c.nameFa}</span>
                <span className="text-xs text-muted line-clamp-2 leading-5">{c.description}</span>
                <span className="text-xs text-primary font-bold mt-auto">{toFaDigits(c.appCount)} برنامه ←</span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* محبوب‌ترین‌ها */}
      <Section title="محبوب‌ترین نرم‌افزارها" href="/popular" empty="هنوز آماری ثبت نشده است.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((a, i) => <AppCard key={a.id} app={a} index={i} />)}
        </div>
      </Section>

      {/* تازه‌ترین نسخه‌ها */}
      <Section title="تازه‌ترین نسخه‌ها" href="/latest">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latest.map((a, i) => <AppCard key={a.id} app={a} index={i} />)}
        </div>
      </Section>

      {/* منتخب سردبیر */}
      {editors.length > 0 && (
        <Section title="منتخب سردبیر">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {editors.map((a, i) => <AppCard key={a.id} app={a} index={i} />)}
          </div>
        </Section>
      )}

      {/* متن‌باز */}
      <Section title="نرم‌افزارهای متن‌باز" href="/open-source">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {oss.map((a, i) => <AppCard key={a.id} app={a} index={i} />)}
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
        <p className="text-muted text-center py-10">به‌زودی برنامه‌های جدید اضافه می‌شود.</p>
      )}
    </div>
  );
}

export default async function Home({ searchParams }: Props) {
  const { cat, platform } = await searchParams;
  const plat = (platform === "windows" || platform === "linux") ? platform : undefined;
  const cats = await getRootCategories(plat);

  return (
    <div>
      <Suspense>
        <CategoryPills cats={cats} />
      </Suspense>
      {!cat && (
        <Suspense>
          <CategoryCards cats={cats} />
        </Suspense>
      )}
      {cat ? <CategorySlide slug={cat} /> : <HomeSlide platform={plat} />}
    </div>
  );
}
