import Link from "next/link";
import PxImg from "@/components/PxImg";
import { Suspense } from "react";
import PopularRow from "@/components/PopularRow";
import NewBadge from "@/components/NewBadge";
import AppCard from "@/components/AppCard";
import Section from "@/components/Section";
import CategoryCards from "@/components/CategoryCards";
import DbIcon from "@/components/DbIcon";
import WeeklyPicks from "@/components/WeeklyPicks";
import {
  getRootCategories, getPopularApps,
  getLatestApps, getCategoryBySlug, getChildPreviews, getCollections, getHomeStats,
  getEditorChoice,
} from "@/lib/store";
import { toFaDigits } from "@/lib/fa";
import { px } from "@/lib/img";
import type { Platform } from "@/lib/store";

type Props = { searchParams: Promise<{ cat?: string; platform?: string }> };

function appHref(slug: string, platform?: Platform) {
  return platform && platform !== "android" ? `/app/${slug}?platform=${platform}` : `/app/${slug}`;
}

async function HomeSlide({ platform }: { platform?: Platform }) {
  const [popular, latest, collections, stats, weeklyPicks] = await Promise.all([
    getPopularApps(8, platform),
    getLatestApps(8, platform), getCollections(platform, 6), getHomeStats(platform),
    getEditorChoice(6, platform),
  ]);

  return (
    <>
      {/* پیشنهادهای هفته — ۶ اپ منتخب سردبیر با آیکون کوچک */}
      <WeeklyPicks apps={weeklyPicks} platform={platform} />

      {/* نوار آمار — کارت‌های کوچک با اعداد هلویی */}
      <div className="mb-10 grid grid-cols-3 gap-3 text-center" role="status" aria-label="آمار فروشگاه">
        <div className="bg-surface border border-border rounded-2xl py-4">
          <b className="block text-xl font-extrabold text-primary">{toFaDigits(stats.apps)}</b>
          <small className="text-xs text-muted">برنامه</small>
        </div>
        <div className="bg-surface border border-border rounded-2xl py-4">
          <b className="block text-xl font-extrabold text-primary">{toFaDigits(stats.downloads)}</b>
          <small className="text-xs text-muted">دانلود</small>
        </div>
        <div className="bg-surface border border-border rounded-2xl py-4">
          <b className="block text-xl font-extrabold text-primary">{toFaDigits(stats.categories)}</b>
          <small className="text-xs text-muted">دسته‌بندی</small>
        </div>
      </div>

      {/* تازه‌ها — اسکرولر افقی */}
      <Section title="تازه‌ها" href={platform ? `/latest?platform=${platform}` : "/latest"}>
        <div className="flex gap-3.5 overflow-x-auto pb-3 snap-x scrollbar-none">
          {latest.map((a) => (
            <Link key={a.id} href={appHref(a.slug, platform)}
              className="flex-none w-32 sm:w-[150px] snap-start flex flex-col gap-2 group">
              {a.iconUrl ? (
                <PxImg src={px(a.iconUrl) || "/icons/icon-192.png"} alt={`آیکون ${a.nameFa}`} width={130} height={130}
                  className="w-28 h-28 sm:w-[130px] sm:h-[130px] rounded-[28px] object-cover bg-surface-2" />
              ) : (
                <span className="w-28 h-28 sm:w-[130px] sm:h-[130px] rounded-[28px] bg-surface-2 grid place-items-center text-5xl font-bold text-muted" dir="ltr">
                  {a.nameEn.charAt(0)}
                </span>
              )}
              <b className="font-bold leading-6 group-hover:text-primary transition truncate flex items-center gap-1.5">
                <span className="truncate">{a.nameFa}</span>
                <NewBadge createdAt={a.createdAt} className="shrink-0" />
              </b>
            </Link>
          ))}
        </div>
      </Section>

      {/* پرطرفدارها — لیست فشرده */}
      <Section title="پرطرفدارها" href={platform ? `/popular?platform=${platform}` : "/popular"} empty="هنوز آماری ثبت نشده است.">
        <div className="border-t border-border">
          {popular.map((a, i) => <PopularRow key={a.id} app={a} platform={platform} index={i} />)}
        </div>
      </Section>

      {/* مجموعه‌ها — ردیف‌های متنی ساده */}
      {collections.length > 0 && (
        <Section title="مجموعه‌ها" href={`/collections${platform === "android" ? "" : `?platform=${platform}`}`}>
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

async function CategorySlide({ slug, platform }: { slug: string; platform: Platform }) {
  const cat = await getCategoryBySlug(slug);
  if (!cat) return <p className="text-muted text-center py-10">دسته‌بندی یافت نشد.</p>;
  const previews = await getChildPreviews(cat.id, 10, platform);
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
                <Link href={`/category/${ch.slug}${platform === "android" ? "" : `?platform=${platform}`}`} className="flex items-center gap-2 group">
                  <DbIcon icon={ch.icon} className="w-6 h-6 text-primary" />
                  <h2 className="text-lg font-extrabold group-hover:text-primary transition">{ch.nameFa}</h2>
                  <span className="text-xs text-muted">({toFaDigits(t)})</span>
                </Link>
                {t > apps.length && (
                  <Link href={`/category/${ch.slug}${platform === "android" ? "" : `?platform=${platform}`}`} className="text-sm text-primary font-bold hover:underline shrink-0">
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
  const plat: Platform = (platform === "windows" || platform === "linux") ? platform : "android";
  const cats = await getRootCategories(plat);

  return (
    <div>
      {!cat && (
        <Suspense>
          <CategoryCards cats={cats} />
        </Suspense>
      )}
      {cat ? <CategorySlide slug={cat} platform={plat} /> : <HomeSlide platform={plat} />}
    </div>
  );
}
