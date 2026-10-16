import Link from "next/link";
import PxImg from "@/components/PxImg";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAppBySlug } from "@/lib/store";
import { toFaDigits, formatBytes, formatDate, timeAgo } from "@/lib/fa";
import AppCard from "@/components/AppCard";
import DownloadButton from "@/components/DownloadButton";
import FavoriteButton from "@/components/FavoriteButton";
import Reviews from "@/components/Reviews";
import { px } from "@/lib/img";
import { siteUrl } from "@/lib/site-url";


type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = await getAppBySlug(slug);
  if (!app) return { title: "یافت نشد" };
  const desc = app.shortDescFa || app.shortDesc || `دانلود ${app.nameFa} برای اندروید با لینک مستقیم`;
  return {
    title: `دانلود ${app.nameFa}`,
    description: desc,
    alternates: { canonical: `/app/${app.slug}` },
    openGraph: {
      title: `${app.nameFa} | نرم‌استور`,
      description: desc,
      images: app.iconUrl && px(app.iconUrl) ? [siteUrl() + px(app.iconUrl)!] : undefined,
    },
  };
}

function InfoRow({ k, v, ltr = false }: { k: string; v: React.ReactNode; ltr?: boolean }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-border last:border-0 text-sm">
      <dt className="text-muted shrink-0">{k}</dt>
      <dd className="font-medium text-left break-all" dir={ltr ? "ltr" : "rtl"}>{v}</dd>
    </div>
  );
}

export default async function AppPage({ params }: Props) {
  const { slug } = await params;
  const app = await getAppBySlug(slug);
  if (!app) notFound();
  const v = app.current;

  return (
    <div className="animate-fade-up">
      {/* سربرگ */}
      <div className="bg-surface border border-border rounded-3xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-5">
          {app.iconUrl ? (
            <PxImg src={px(app.iconUrl) || "/icons/icon-192.png"} alt={`آیکون ${app.nameFa}`} width={112} height={112}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover bg-surface-2 shadow" />
          ) : (
            <span className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-primary-soft text-primary flex items-center justify-center text-4xl font-bold">
              {app.nameFa.charAt(0)}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold">{app.nameFa}</h1>
              {app.isOpenSource && (
                <span className="text-xs bg-primary-soft text-primary font-bold px-2.5 py-1 rounded-full">متن‌باز</span>
              )}
              <span className="ms-auto"><FavoriteButton appId={app.id} appName={app.slug} /></span>
            </div>
            <p className="text-muted text-sm mb-2" dir="ltr" style={{ textAlign: "right" }}>{app.nameEn}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              {app.developerName && <span>👤 {app.developerName}</span>}
              <span>⬇️ {toFaDigits(app.downloadCount)} دانلود</span>
              {v && <span>🕐 به‌روزرسانی: {timeAgo(v.publishedAt || v.createdAt)}</span>}
            </div>
            {(app.shortDescFa || app.shortDesc) && <p className="mt-3 text-sm leading-7">{app.shortDescFa || app.shortDesc}</p>}
          </div>
        </div>

        {/* دانلود */}
        <div className="mt-6 pt-6 border-t border-border">
          {v ? (
            <DownloadButton versionId={v.id} versionName={v.versionName} fileSize={v.fileSize} />
          ) : (
            <div className="bg-surface-2 border border-border rounded-2xl p-5 text-center">
              <p className="font-bold mb-1">لینک دانلود در دسترس نیست</p>
              <p className="text-sm text-muted">در حال حاضر نسخه‌ی فعالی برای این برنامه ثبت نشده است.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* تصاویر */}
          {app.screenshots.length > 0 && (
            <section className="bg-surface border border-border rounded-3xl p-6" aria-label="تصاویر محیط برنامه">
              <h2 className="font-extrabold mb-4">تصاویر محیط برنامه</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {app.screenshots.map((sh) => (
                  <PxImg key={sh.id} src={px(sh.url) || sh.url} alt={`تصویر ${app.nameFa}`} width={180} height={320}
                    className="h-64 w-auto rounded-xl border border-border object-cover shrink-0" />
                ))}
              </div>
            </section>
          )}

          {/* معرفی */}
          {(app.descriptionFa || app.description) && (
            <section className="bg-surface border border-border rounded-3xl p-6" aria-label="معرفی کامل">
              <h2 className="font-extrabold mb-4">معرفی</h2>
              <p className="text-sm leading-8 whitespace-pre-line text-fg/90">{app.descriptionFa || app.description}</p>
            </section>
          )}

          {/* نسخه‌های قبلی */}
          {app.versions.length > 1 && (            <section className="bg-surface border border-border rounded-3xl p-6" aria-label="نسخه‌های قبلی">
              <h2 className="font-extrabold mb-4">نسخه‌های قبلی</h2>
              <ul className="space-y-2">
                {app.versions.slice(1).map((ver) => (
                  <li key={ver.id} className="flex items-center justify-between gap-3 bg-surface-2 rounded-xl px-4 py-3 text-sm">
                    <span className="font-bold" dir="ltr">v{ver.versionName}</span>
                    <span className="text-muted text-xs">{formatDate(ver.publishedAt || ver.createdAt)} • {formatBytes(ver.fileSize)}</span>
                    <Link href={`/api/download/${ver.id}`} className="text-primary font-bold text-xs hover:underline shrink-0">
                      دانلود
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="space-y-6">
          {/* اطلاعات فنی */}
          <section className="bg-surface border border-border rounded-3xl p-6" aria-label="اطلاعات فنی">
            <h2 className="font-extrabold mb-2">اطلاعات فنی</h2>
            <dl>
              <InfoRow k="نسخه" v={v ? <span dir="ltr">{v.versionName}</span> : "—"} ltr />
              <InfoRow k="حجم فایل" v={formatBytes(v?.fileSize)} />
              <InfoRow k="حداقل اندروید" v={v?.minSdk ? toFaDigits(v.minSdk) + "+" : "نامشخص"} />
              <InfoRow k="نام بسته" v={app.packageName} ltr />
              <InfoRow k="مجوز" v={app.license || "نامشخص"} ltr />
              <InfoRow k="توسعه‌دهنده" v={app.developerName || "نامشخص"} />
              {v?.sha256 && (
                <InfoRow k="SHA-256" v={
                  <span className="text-xs font-mono break-all" dir="ltr">{v.sha256.slice(0, 32)}…</span>
                } />
              )}
              <InfoRow k="منبع" v={app.sourceUrl ? (
                <a href={app.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" dir="ltr">
                  {app.sourceType === "fdroid" ? "F-Droid" : app.sourceUrl}
                </a>
              ) : "داخلی"} />
              <InfoRow k="وضعیت تأیید" v={
                v?.verifiedAt
                  ? <span className="text-primary font-bold">✅ بررسی‌شده {formatDate(v.verifiedAt)}</span>
                  : <span className="text-accent font-bold">⏳ این نسخه هنوز بررسی نشده است</span>
              } />
            </dl>
            {v?.sha256 && (
              <details className="mt-3 text-xs">
                <summary className="cursor-pointer text-primary font-bold">نمایش کامل هش SHA-256</summary>
                <code className="block mt-2 p-3 bg-surface-2 rounded-lg break-all font-mono" dir="ltr">{v.sha256}</code>
              </details>
            )}
          </section>

          {/* دسته‌بندی‌ها */}
          {app.categories.length > 0 && (
            <section className="bg-surface border border-border rounded-3xl p-6" aria-label="دسته‌بندی‌ها">
              <h2 className="font-extrabold mb-3">دسته‌بندی‌ها</h2>
              <div className="flex flex-wrap gap-2">
                {app.categories.map((c) => (
                  <Link key={c.slug} href={`/category/${c.slug}`}
                    className="text-xs bg-surface-2 hover:bg-primary-soft hover:text-primary border border-border rounded-full px-3 py-1.5 transition">
                    {c.icon} {c.nameFa}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* مجوزها */}
          {app.permissions.length > 0 && (
            <section className="bg-surface border border-border rounded-3xl p-6" aria-label="مجوزهای برنامه">
              <h2 className="font-extrabold mb-3">مجوزهای درخواستی ({toFaDigits(app.permissions.length)})</h2>
              <ul className="text-xs space-y-1.5 max-h-48 overflow-y-auto">
                {app.permissions.map((p) => (
                  <li key={p.id} className="font-mono bg-surface-2 rounded px-2 py-1 break-all" dir="ltr" style={{ textAlign: "left" }}>
                    {p.permission}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Link href={`/report?app=${app.slug}`}
            className="block text-center text-sm text-muted hover:text-danger border border-border rounded-2xl py-3 transition">
            ⚠️ گزارش مشکل یا لینک خراب
          </Link>
        </div>
      </div>

      <Reviews appId={app.id} />

      {/* مشابه‌ها */}
      {app.similar.length > 0 && (
        <section className="mt-10" aria-label="نرم‌افزارهای مشابه">
          <h2 className="text-xl font-extrabold mb-4">نرم‌افزارهای مشابه</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {app.similar.map((a, i) => <AppCard key={a.id} app={a} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
