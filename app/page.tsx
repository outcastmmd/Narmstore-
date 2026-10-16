import Link from "next/link";
import PxImg from "@/components/PxImg";
import { Suspense } from "react";
import AppCard from "@/components/AppCard";
import Section from "@/components/Section";
import CategoryPills from "@/components/CategoryPills";
import CategoryCards from "@/components/CategoryCards";
import DbIcon from "@/components/DbIcon";
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
      {/* برنامه‌ی شاخص */}
      {hero && (
        <section className="mb-12 rounded-[2rem] overflow-hidden border border-border bg-surface" aria-label="برنامه‌ی شاخص">
          <div className="p-6 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-8 bg-gradient-to-l from-primary-soft/70 via-primary-soft/25 to-transparent">
            {hero.iconUrl && (
              <PxImg src={px(hero.iconUrl) || "/icons/icon-192.png"} alt={`آیکون ${hero.nameFa}`} width={128} height={128}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-[1.75rem] bg-surface-2 object-cover shadow-xl ring-1 ring-border" />
            )}
            <div className="flex-1">
              <p className="text-xs font-bold text-primary mb-2 tracking-wide">انتخاب ما</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">{hero.nameFa}</h1>
              <p className="text-muted text-sm sm:text-base leading-8 line-clamp-2 max-w-2xl">{hero.shortDescFa || hero.shortDesc}</p>
              <Link href={platform && platform !== "android" ? `/app/${hero.slug}?platform=${platform}` : `/app/${hero.slug}`}
                className="inline-block mt-5 bg-primary text-primary-fg font-bold px-8 py-3 rounded-2xl hover:opacity-90 transition">
                مشاهده و دانلود
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* کالکشن‌ها */}
      {collections.length > 0 && (
        <Section title="کالکشن‌ها" href="/collections">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {collections.map((c, ci) => (
              <Link key={c.id} href={`/collection/${c.slug}`}
                style={{ animationDelay: `${ci * 60}ms` }}
                className="animate-card-in card-hover bg-surface border border-border rounded-3xl p-5 flex flex-col gap-2 min-h-32">
                <span className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <DbIcon icon={c.icon} className="w-6 h-6" />
                </span>
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
        <span className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <DbIcon icon={cat.icon} className="w-9 h-9" />
        </span>
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
                  <DbIcon icon={ch.icon} className="w-6 h-6 text-primary" />
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
