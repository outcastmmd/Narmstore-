import Link from "next/link";
import PxImg from "@/components/PxImg";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAppBySlug } from "@/lib/store";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import * as s from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { toFaDigits, formatBytes, formatDate, timeAgo, androidVersion } from "@/lib/fa";
import AppCard from "@/components/AppCard";
import PlatformBadge from "@/components/PlatformBadge";
import FavoriteButton from "@/components/FavoriteButton";
import FollowButton from "@/components/FollowButton";
import VersionsDrawer from "@/components/VersionsDrawer";
import DownloadTrigger from "@/components/DownloadTrigger";
import Reviews from "@/components/Reviews";
import QuickRating from "@/components/QuickRating";
import Gallery from "@/components/Gallery";
import { computeTags } from "@/lib/tags";
import { px } from "@/lib/img";
import DbIcon from "@/components/DbIcon";
import ReportButton from "@/components/ReportButton";
import Alternatives from "@/components/Alternatives";
import { findAlternatives } from "@/data/alternatives";
import {
  User, Star, Download, Clock, RefreshCw, Sparkles,
  AppWindow, Terminal, BadgeCheck, TriangleAlert, Lightbulb, ExternalLink,
} from "lucide-react";
import { siteUrl } from "@/lib/site-url";


type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = await getAppBySlug(slug);
  if (!app) return { title: "یافت نشد" };
  const platFa = app.platform === "android" ? "اندروید" : app.platform === "windows" ? "ویندوز" : "لینوکس";
  const desc = app.shortDescFa || app.shortDesc || `دانلود ${app.nameFa} برای ${platFa} با لینک مستقیم و بررسی امنیتی`;
  return {
    title: `دانلود ${app.nameFa} برای ${platFa} | نرم‌استور`,
    description: desc,
    alternates: { canonical: `/app/${app.slug}` },
    openGraph: {
      title: `دانلود ${app.nameFa} برای ${platFa} | نرم‌استور`,
      description: desc,
      images: app.iconUrl && px(app.iconUrl) ? [siteUrl() + px(app.iconUrl)!] : undefined,
    },
  };
}

function InfoRow({ k, v, ltr = false }: { k: string; v: React.ReactNode; ltr?: boolean }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-border last:border-0 text-sm">
      <dt className="text-muted shrink-0">{k}</dt>
      <dd className="font-medium text-left break-all min-w-0" dir={ltr ? "ltr" : "rtl"}>{v}</dd>
    </div>
  );
}

export default async function AppPage({ params }: Props) {
  const { slug } = await params;
  const app = await getAppBySlug(slug);
  if (!app) notFound();
  const v = app.current;

  // بررسی آپدیت: آیا کاربر لاگین‌کرده این برنامه را دانلود کرده و نسخه جدید آمده؟
  let hasUpdate = false;
  let downloadedVersion: string | null = null;
  try {
    const user = await getSessionUser();
    if (user && v && app.platform === "android") {
      const dls = await db.select({ versionId: s.downloadEvents.versionId })
        .from(s.downloadEvents)
        .where(and(eq(s.downloadEvents.userId, user.id), eq(s.downloadEvents.appId, app.id)))
        .orderBy(desc(s.downloadEvents.createdAt)).limit(1);
      if (dls.length && dls[0].versionId && dls[0].versionId !== v.id) {
        hasUpdate = true;
        const dv = await db.select({ versionName: s.appVersions.versionName })
          .from(s.appVersions).where(eq(s.appVersions.id, dls[0].versionId!)).limit(1);
        downloadedVersion = dv[0]?.versionName ?? null;
      }
    }
  } catch {}

  const tags = computeTags({
    permissions: app.permissions.map((p: any) => p.permission),
    isOpenSource: app.isOpenSource,
    fileSize: v?.fileSize ?? null,
  });

  // جایگزین‌های آزاد: اگر برای این برنامه نگاشت داریم، اپ‌های جایگزین را از DB پیدا کن
  let altEntry = findAlternatives(app.nameEn);
  let altApps: { nameEn: string; why: string; slug: string; nameFa: string; iconUrl: string | null }[] = [];
  if (altEntry) {
    try {
      const names = altEntry.alternatives.map((a) => a.nameEn);
      const rows = await db.select({
        nameEn: s.apps.nameEn, slug: s.apps.slug, nameFa: s.apps.nameFa, iconUrl: s.apps.iconUrl,
      })
        .from(s.apps)
        .where(and(s.apps.isPublished, sql`lower(${s.apps.nameEn}) = ANY(${names.map((n) => n.toLowerCase())})`));
      const byName = new Map(rows.map((r) => [r.nameEn.toLowerCase(), r]));
      altApps = altEntry.alternatives
        .map((a) => {
          const hit = byName.get(a.nameEn.toLowerCase());
          return hit ? { ...a, slug: hit.slug, nameFa: hit.nameFa, iconUrl: hit.iconUrl } : null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);
    } catch {}
  }

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
              <PlatformBadge platform={app.platform} />
              {tags.map((t) => (
                <span key={t.slug} className="text-xs bg-primary-soft text-primary font-bold px-2.5 py-1 rounded-full">{t.label}</span>
              ))}
              <span className="ms-auto flex items-center gap-2">
                <FollowButton appId={app.id} />
                <FavoriteButton appId={app.id} appName={app.slug} />
              </span>
            </div>
            <p className="text-muted text-sm mb-4" dir="ltr" style={{ textAlign: "right" }}>{app.nameEn}</p>
            {/* ردیف اطلاعات — نسخه / حجم / پلتفرم */}
            <div className="flex items-stretch text-center mb-2" role="list" aria-label="مشخصات برنامه">
              {v?.versionName && (
                <div role="listitem" className="flex-1 px-2">
                  <div dir="ltr" className="font-extrabold text-[15px]">{v.versionName}</div>
                  <div className="text-[11px] text-muted mt-0.5">نسخه</div>
                </div>
              )}
              {v?.fileSize ? (
                <div role="listitem" className="flex-1 px-2 border-s border-border">
                  <div dir="ltr" className="font-extrabold text-[15px]">{formatBytes(v.fileSize)}</div>
                  <div className="text-[11px] text-muted mt-0.5">حجم</div>
                </div>
              ) : null}
              <div role="listitem" className="flex-1 px-2 border-s border-border">
                <div className="font-extrabold text-[15px]">
                  {app.platform === "android" ? "اندروید" : app.platform === "windows" ? "ویندوز" : "لینوکس"}
                </div>
                <div className="text-[11px] text-muted mt-0.5">پلتفرم</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              {app.developerName && <span className="inline-flex items-center gap-1"><User className="w-4 h-4" aria-hidden="true" /> {app.developerName}</span>}
              {app.githubStars ? (
                <span className="inline-flex items-center gap-1"><Star className="w-4 h-4" aria-hidden="true" /> {toFaDigits(app.githubStars)} استار گیت‌هاب</span>
              ) : (
                <span className="inline-flex items-center gap-1"><Download className="w-4 h-4" aria-hidden="true" /> {toFaDigits(app.downloadCount)} دانلود</span>
              )}
              {v && <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" aria-hidden="true" /> به‌روزرسانی: {timeAgo(v.publishedAt || v.createdAt)}</span>}
              {v && (() => {
                const pub = v.publishedAt || v.createdAt;
                const days = pub ? (Date.now() - new Date(pub).getTime()) / 86400000 : 99;
                return days <= 7 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-1">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> نسخه‌ی جدید
                  </span>
                ) : null;
              })()}
            </div>
          </div>
        </div>

        {/* بنر آپدیت — اگر نسخه جدید آمده */}
        {hasUpdate && v && (
          <div className="mt-4 bg-primary-soft border border-primary/30 rounded-2xl p-4 flex items-center gap-3" role="status">
            <RefreshCw className="w-6 h-6 text-primary shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-extrabold text-sm">نسخه‌ی جدید موجوده!</p>
              <p className="text-xs text-muted mt-0.5">
                {downloadedVersion ? (
                  <>از نسخه‌ی <span dir="ltr">{downloadedVersion}</span> به <span dir="ltr">{v.versionName}</span> به‌روزرسانی کن</>
                ) : (
                  <>نسخه‌ی <span dir="ltr">{v.versionName}</span> منتشر شده</>
                )}
              </p>
            </div>
          </div>
        )}

        {/* دانلود — کامپوننت هوشمند یکپارچه */}
        <DownloadTrigger
          app={{
            platform: app.platform,
            githubRepo: app.githubRepo,
            githubStars: app.githubStars,
            sourceUrl: app.sourceUrl,
            sourceType: app.sourceType,
            version: v
              ? {
                  id: v.id,
                  versionName: v.versionName,
                  fileSize: v.fileSize,
                  fileType: v.fileType,
                  fileUrl: v.fileUrl,
                }
              : null,
          }}
          appName={app.nameFa}
          iconUrl={app.iconUrl}
          sha256={v?.sha256 ?? null}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* تصاویر */}
          {app.screenshots.length > 0 && (
            <section className="bg-surface border border-border rounded-3xl p-6" aria-label="تصاویر محیط برنامه">
              <h2 className="font-extrabold mb-4">تصاویر محیط برنامه</h2>
              <Gallery
                appName={app.nameFa}
                shots={app.screenshots.map((sh) => ({ id: sh.id, url: px(sh.url) || sh.url }))}
              />
            </section>
          )}

          {/* معرفی */}
          {(app.descriptionFa || app.description) && (
            <section className="bg-surface border border-border rounded-3xl p-6" aria-label="معرفی کامل">
              <h2 className="font-extrabold mb-4">معرفی</h2>
              <p className="text-sm leading-8 whitespace-pre-line text-fg/90">{app.descriptionFa || app.description}</p>
            </section>
          )}

          {/* نسخه‌های قبلی — دراور جمع‌شونده برای همه پلتفرم‌ها */}
          {app.versions.length > 1 && (
            <VersionsDrawer versions={app.versions} />
          )}
        </div>

        <div className="space-y-6">
          {/* اطلاعات فنی */}
          <section className="bg-surface border border-border rounded-3xl p-6" aria-label="اطلاعات فنی">
            <h2 className="font-extrabold mb-2">اطلاعات فنی</h2>
            <dl>
              {app.platform === "android" && (
                <>
                  <InfoRow k="نسخه" v={v ? <span dir="ltr">{v.versionName}</span> : "—"} ltr />
                  <InfoRow k="حجم فایل" v={formatBytes(v?.fileSize)} />
                  <InfoRow k="حداقل اندروید" v={androidVersion(v?.minSdk)} />
                </>
              )}
              {app.platform !== "android" && (
                <InfoRow k="پلتفرم" v={app.platform === "windows"
                  ? <span className="inline-flex items-center gap-1.5"><AppWindow className="w-4 h-4" aria-hidden="true" /> ویندوز</span>
                  : <span className="inline-flex items-center gap-1.5"><Terminal className="w-4 h-4" aria-hidden="true" /> لینوکس</span>} />
              )}
              <InfoRow k="نام بسته" v={app.packageName} ltr />
              <InfoRow k="مجوز" v={app.license || "نامشخص"} ltr />
              <InfoRow k="توسعه‌دهنده" v={app.developerName || "نامشخص"} />
              <InfoRow k="منبع" v={app.sourceUrl ? (
                <a href={app.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" dir="ltr">
                  {app.sourceType === "fdroid" ? "F-Droid" : app.sourceUrl}
                </a>
              ) : "داخلی"} />
              <InfoRow k="وضعیت تأیید" v={
                v?.verifiedAt
                  ? <span className="text-primary font-bold inline-flex items-center gap-1"><BadgeCheck className="w-4 h-4" aria-hidden="true" /> بررسی‌شده {formatDate(v.verifiedAt)}</span>
                  : <span className="text-accent font-bold inline-flex items-center gap-1"><Clock className="w-4 h-4" aria-hidden="true" /> این نسخه هنوز بررسی نشده است</span>
              } />
            </dl>
            {v?.sha256 && (
              <details className="mt-3 text-xs">
                <summary className="cursor-pointer text-primary font-bold">نمایش کامل هش SHA-256</summary>
                <code className="block mt-2 p-3 bg-surface-2 rounded-lg break-all font-mono" dir="ltr">{v.sha256}</code>
              </details>
            )}
            <div className="mt-4 pt-4 border-t border-border">
              <ReportButton appId={app.id} appName={app.nameFa} />
            </div>
          </section>

          {/* جایگزین‌های آزاد */}
          {altEntry && altApps.length > 0 && (
            <Alternatives entry={altEntry} apps={altApps} />
          )}

          {/* دسته‌بندی‌ها */}
          {app.categories.length > 0 && (
            <section className="bg-surface border border-border rounded-3xl p-6" aria-label="دسته‌بندی‌ها">
              <h2 className="font-extrabold mb-3">دسته‌بندی‌ها</h2>
              <div className="flex flex-wrap gap-2">
                {app.categories.map((c) => (
                  <Link key={c.slug} href={`/category/${c.slug}`}
                    className="text-xs bg-surface-2 hover:bg-primary-soft hover:text-primary border border-border rounded-full px-3 py-1.5 transition inline-flex items-center gap-1.5">
                    <DbIcon icon={c.icon} className="w-3.5 h-3.5" /> {c.nameFa}
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
            className="flex items-center justify-center gap-2 text-sm text-muted hover:text-danger border border-border rounded-2xl py-3 transition">
            <TriangleAlert className="w-4 h-4" aria-hidden="true" /> گزارش مشکل یا لینک خراب
          </Link>
        </div>
      </div>

      <QuickRating appId={app.id} />
      <Reviews appId={app.id} />

      {/* شاید بپسندی */}
      {app.similar.length > 0 && (
        <section className="mt-10" aria-label="شاید بپسندی">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" aria-hidden="true" /> شاید بپسندی
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {app.similar.map((a, i) => <AppCard key={a.id} app={a} index={i} />)}
          </div>
        </section>
      )}

    </div>
  );
}
