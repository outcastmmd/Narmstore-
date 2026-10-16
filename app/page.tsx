import Link from "next/link";
import PxImg from "@/components/PxImg";
import { Suspense } from "react";
import PopularRow from "@/components/PopularRow";
import NewBadge from "@/components/NewBadge";
import AppCard from "@/components/AppCard";
import Section from "@/components/Section";
import CategoryPills from "@/components/CategoryPills";
import CategoryCards from "@/components/CategoryCards";
import DbIcon from "@/components/DbIcon";
import {
  getRootCategories, getFeaturedApps, getPopularApps,
  getLatestApps, getCategoryBySlug, getChildPreviews, getCollections, getHomeStats,
} from "@/lib/store";
import { toFaDigits } from "@/lib/fa";
import { px } from "@/lib/img";
import type { Platform } from "@/lib/store";

type Props = { searchParams: Promise<{ cat?: string; platform?: string }> };

function appHref(slug: string, platform?: Platform) {
  return platform && platform !== "android" ? `/app/${slug}?platform=${platform}` : `/app/${slug}`;
}

async function HomeSlide({ platform }: { platform?: Platform }) {
  const [featured, popular, latest, collections, stats] = await Promise.all([
    getFeaturedApps(4, platform), getPopularApps(8, platform),
    getLatestApps(8, platform), getCollections(platform), getHomeStats(platform),
  ]);
  const hero = featured[0];

  return (
    <>
      {/* برنامه‌ی شاخص — مثل رفرنس: کارت بزرگ با رنگ تأکید */}
      {hero && (
        <Link href={appHref(hero.slug, platform)} aria-label={hero.nameFa}
          className="block mb-6 rounded-[20px] bg-primary text-primary-fg p-6 sm:p-7">
          <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 items-center">
            {hero.iconUrl ? (
              <PxImg src={px(hero.iconUrl) || "/icons/icon-192.png"} alt="" width={84} height={84}
                className="w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-[22px] object-cover row-span-3 bg-primary-fg" />
            ) : (
              <span className="w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-[22px] row-span-3 grid place-items-center text-4xl font-bold bg-primary-fg text-primary" dir="ltr">
                {hero.nameEn.charAt(0)}
              </span>
            )}
            <small className="text-[13px] opacity-80">پیشنهاد این هفته</small>
            <span className="font-head text-4xl leading-tight">{hero.nameFa}</span>
            <p className="opacity-90 text-[15px] leading-7 line-clamp-2 max-w-[46ch]">{hero.shortDescFa || hero.shortDesc}</p>
            <span className="justify-self-start mt-2 bg-primary-fg text-primary rounded-full px-6 py-2 font-bold text-sm">
              دریافت
            </span>
          </div>
        </Link>
      )}

      {/* نوار آمار زنده — ظریف، زیر هیرو */}
      <div className="mb-10 flex items-center justify-center gap-4 sm:gap-6 text-[13px] text-muted" role="status" aria-label="آمار فروشگاه">
        <span><b className="text-fg font-bold">{toFaDigits(stats.apps)}</b> برنامه</span>
        <span className="w-px h-4 bg-border" aria-hidden="true" />
        <span><b className="text-fg font-bold">{toFaDigits(stats.downloads)}</b> دانلود</span>
        <span className="w-px h-4 bg-border" aria-hidden="true" />
        <span><b className="text-fg font-bold">{toFaDigits(stats.categories)}</b> دسته‌بندی</span>
      </div>

      {/* تازه‌ها — اسکرولر افقی */}
      <Section title="تازه‌ها" href={platform ? `/latest?platform=${platform}` : "/latest"}>
        <div className="flex gap-3.5 overflow-x-auto pb-3 snap-x scrollbar-none">
          {latest.map((a) => (
            <Link key={a.id} href={appHref(a.slug, platform)}
              className="flex-none w-32 sm:w-[150px] snap-start flex flex-col gap-2 group">
              {a.iconUrl ? (
                <PxImg src={px(a.iconUrl) || "/icons/icon-192.png"} alt={`آیکون ${a.nameFa}`} width={150} height={150}
                  className="w-32 h-32 sm:w-[150px] sm:h-[150px] rounded-[30px] object-cover bg-surface-2" />
              ) : (
                <span className="w-32 h-32 sm:w-[150px] sm:h-[150px] rounded-[30px] bg-surface-2 grid place-items-center text-5xl font-bold text-muted" dir="ltr">
                  {a.nameEn.charAt(0)}
                </span>
              )}
              <b className="font-bold leading-6 group-hover:text-primary transition truncate flex items-center gap-1.5">
                <span className="truncate">{a.nameFa}</span>
                <NewBadge createdAt={a.createdAt} className="shrink-0" />
              </b>
              <span className="text-muted text-[13px] leading-6 line-clamp-2">{a.shortDescFa || a.shortDesc}</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* پرطرفدارها — لیست فشرده */}
      <Section title="پرطرفدارها" href={platform ? `/popular?platform=${platform}` : "/popular"} empty="هنوز آماری ثبت نشده است.">
        <div className="border-t border-border">
          {popular.map((a) => <PopularRow key={a.id} app={a} platform={platform} />)}
        </div>
      </Section>

      {/* مجموعه‌ها — ردیف‌های متنی ساده */}
      {collections.length > 0 && (
        <Section title="مجموعه‌ها" href="/collections">
          <div className="grid sm:grid-cols-2 gap-x-7">
            {collections.map((c) => (
              <Link key={c.id} href={`/collection/${c.slug}`}
                className="flex items-center justify-between gap-3 py-3.5 border-b border-border group">
                <div className="min-w-0">
                  <strong className="font-bold group-hover:text-primary transition">{c.nameFa}</strong>
                  <br />
                  <span className="text-muted text-[13px] line-clamp-1">{c.description}</span>
                </div>
                <span className="text-muted text-[13px] shrink-0">{toFaDigits(c.appCount)} برنامه</span>
              </Link>
            ))}
          </div>
        </Section>
      )}
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
