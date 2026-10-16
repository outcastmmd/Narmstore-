import Link from "next/link";
import Image from "next/image";
import AppCard from "@/components/AppCard";
import Section from "@/components/Section";
import {
  getRootCategories, getFeaturedApps, getPopularApps,
  getLatestApps, getEditorChoice, getOpenSourceApps,
} from "@/lib/store";
import { toFaDigits } from "@/lib/fa";
import { px } from "@/lib/img";


export default async function Home() {
  const [cats, featured, popular, latest, editors, oss] = await Promise.all([
    getRootCategories(), getFeaturedApps(4), getPopularApps(8),
    getLatestApps(8), getEditorChoice(8), getOpenSourceApps(8),
  ]);
  const hero = featured[0];

  return (
    <div>
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
              <p className="text-muted text-sm leading-7 line-clamp-2 max-w-2xl">{hero.shortDesc}</p>
              <Link href={`/app/${hero.slug}`}
                className="inline-block mt-4 bg-primary text-primary-fg font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition">
                مشاهده و دانلود
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* دسته‌بندی‌ها */}
      <Section title="دسته‌بندی‌ها" href="/categories">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-3">
          {cats.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`}
              className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary/50 hover:shadow-md transition group">
              <span className="text-3xl group-hover:scale-110 transition-transform" aria-hidden="true">{c.icon || "📦"}</span>
              <span className="text-xs font-bold text-center leading-5">{c.nameFa}</span>
              <span className="text-[11px] text-muted">{toFaDigits(Number(c.appCount))} برنامه</span>
            </Link>
          ))}
        </div>
      </Section>

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
    </div>
  );
}
