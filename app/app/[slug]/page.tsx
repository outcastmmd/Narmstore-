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
import AppTile from "@/components/AppTile";
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
  RefreshCw,
  BadgeCheck, TriangleAlert,
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
    <div className="animate-fade-up max-w-3xl mx-auto">
      {/* سربرگ iOS-استایل */}
      <div className="px-1 pt-2 pb-6">
        <div className="flex gap-4 items-start">
          {app.iconUrl ? (
            <PxImg src={px(app.iconUrl) || "/icons/icon-192.png"} alt={`آیکون ${app.nameFa}`} width={120} height={120}
              className="w-[104px] h-[104px] rounded-[24%] object-cover shadow-md shrink-0" />
          ) : (
            <span className="w-[104px] h-[104px] rounded-[24%] bg-primary-soft text-primary flex items-center justify-center text-4xl font-bold shrink-0">
              {app.nameFa.charAt(0)}
            </span>
          )}
          <div className="flex-1 min-w-0 pt-1">
            <h1 className="text-[22px] font-extrabold leading-8">{app.nameFa}</h1>
            {app.developerName && (
              <p className="text-primary text-[15px] mt-0.5">{app.developerName}</p>
            )}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <PlatformBadge platform={app.platform} />
              {tags.map((t) => (
                <span key={t.slug} className="text-[11px] text-muted font-bold">{t.label}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0 pt-1">
            <FavoriteButton appId={app.id} appName={app.slug} />
            <FollowButton appId={app.id} />
          </div>
        </div>

        {/* ردیف اطلاعات iOS — نسخه / حجم / پلتفرم */}
        <div className="flex mt-6 py-2" role="list" aria-label="مشخصات برنامه">
          {v?.versionName && (
            <div role="listitem" className="flex-1 text-center px-2">
              <div dir="ltr" className="font-bold text-[17px]">{v.versionName}</div>
              <div className="text-[12px] text-muted mt-1">نسخه</div>
            </div>
          )}
          {v?.fileSize ? (
            <div role="listitem" className="flex-1 text-center px-2 border-s border-border">
              <div dir="ltr" className="font-bold text-[17px]">{formatBytes(v.fileSize)}</div>
              <div className="text-[12px] text-muted mt-1">حجم</div>
            </div>
          ) : null}
          <div role="listitem" className="flex-1 text-center px-2 border-s border-border">
            <div className="font-bold text-[17px]">
              {app.platform === "android" ? "اندروید" : app.platform === "windows" ? "ویندوز" : "لینوکس"}
            </div>
            <div className="text-[12px] text-muted mt-1">پلتفرم</div>
          </div>
          {(app.githubStars ?? 0) > 0 && (
            <div role="listitem" className="flex-1 text-center px-2 border-s border-border">
              <div className="font-bold text-[17px]">{toFaDigits(app.githubStars ?? 0)}</div>
              <div className="text-[12px] text-muted mt-1">استار</div>
            </div>
          )}
        </div>

        {/* بنر آپدیت */}
        {hasUpdate && v && (
          <div className="mt-4 bg-primary-soft rounded-2xl p-4 flex items-center gap-3" role="status">
            <RefreshCw className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
            <p className="text-sm">
              <b>نسخه‌ی جدید موجوده!</b>{" "}
              <span className="text-muted">
                {downloadedVersion ? (
                  <>از <span dir="ltr">{downloadedVersion}</span> به <span dir="ltr">{v.versionName}</span></>
                ) : (
                  <>نسخه‌ی <span dir="ltr">{v.versionName}</span> منتشر شده</>
                )}
              </span>
            </p>
          </div>
        )}

        {/* دانلود */}
        <div className="mt-5">
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
      </div>

      <div className="h-px bg-border" />

      {/* تصاویر */}
      {app.screenshots.length > 0 && (
        <section className="py-6" aria-label="تصاویر محیط برنامه">
          <h2 className="font-extrabold text-[17px] px-1 mb-3">پیش‌نمایش</h2>
          <Gallery
            appName={app.nameFa}
            shots={app.screenshots.map((sh) => ({ id: sh.id, url: px(sh.url) || sh.url }))}
          />
        </section>
      )}

      {/* معرفی */}
      {(app.descriptionFa || app.description) && (
        <>
          <div className="h-px bg-border" />
          <section className="py-6" aria-label="معرفی">
            <h2 className="font-extrabold text-[17px] px-1 mb-3">درباره‌ی این برنامه</h2>
            <p className="text-[15px] leading-8 px-1 whitespace-pre-line text-foreground/90">{app.descriptionFa || app.description}</p>
          </section>
        </>
      )}

      {/* نسخه‌های قبلی */}
      {app.versions.length > 1 && (
        <>
          <div className="h-px bg-border" />
          <div className="py-4">
            <VersionsDrawer versions={app.versions} />
          </div>
        </>
      )}

      <div className="h-px bg-border" />

      {/* اطلاعات — استایل گروهی iOS */}
      <section className="py-6" aria-label="اطلاعات">
        <h2 className="font-extrabold text-[17px] px-1 mb-3">اطلاعات</h2>
        <dl className="bg-surface rounded-2xl px-4">
          {app.platform === "android" && (
            <>
              <InfoRow k="نسخه" v={v ? <span dir="ltr">{v.versionName}</span> : "—"} ltr />
              <InfoRow k="حجم" v={formatBytes(v?.fileSize)} />
              <InfoRow k="حداقل اندروید" v={androidVersion(v?.minSdk)} />
            </>
          )}
          {app.platform !== "android" && (
            <InfoRow k="پلتفرم" v={app.platform === "windows" ? "ویندوز" : "لینوکس"} />
          )}
          <InfoRow k="توسعه‌دهنده" v={app.developerName || "نامشخص"} />
          <InfoRow k="مجوز" v={app.license || "نامشخص"} ltr />
          <InfoRow k="به‌روزرسانی" v={v ? timeAgo(v.publishedAt || v.createdAt) : "—"} />
          <InfoRow k="منبع" v={app.sourceUrl ? (
            <a href={app.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary" dir="ltr">
              {app.sourceType === "fdroid" ? "F-Droid" : new URL(app.sourceUrl).hostname.replace(/^www\./, "")}
            </a>
          ) : "داخلی"} />
          <InfoRow k="وضعیت بررسی" v={
            v?.verifiedAt
              ? <span className="text-primary font-bold inline-flex items-center gap-1"><BadgeCheck className="w-4 h-4" aria-hidden="true" /> {formatDate(v.verifiedAt)}</span>
              : <span className="text-muted">در انتظار بررسی</span>
          } />
        </dl>
        {v?.sha256 && (
          <details className="mt-3 px-1 text-[13px]">
            <summary className="cursor-pointer text-primary font-bold">هش SHA-256</summary>
            <code className="block mt-2 p-3 bg-surface rounded-xl break-all font-mono text-[12px]" dir="ltr">{v.sha256}</code>
          </details>
        )}
      </section>

      {/* جایگزین‌ها */}
      {altEntry && altApps.length > 0 && (
        <>
          <div className="h-px bg-border" />
          <div className="py-6">
            <Alternatives entry={altEntry} apps={altApps} />
          </div>
        </>
      )}

      {/* دسته‌بندی‌ها */}
      {app.categories.length > 0 && (
        <>
          <div className="h-px bg-border" />
          <section className="py-6" aria-label="دسته‌بندی‌ها">
            <h2 className="font-extrabold text-[17px] px-1 mb-3">دسته‌بندی</h2>
            <div className="flex flex-wrap gap-2 px-1">
              {app.categories.map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`}
                  className="text-[13px] bg-surface rounded-full px-4 py-2 inline-flex items-center gap-1.5">
                  <DbIcon icon={c.icon} className="w-4 h-4 text-primary" /> {c.nameFa}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* مجوزها */}
      {app.permissions.length > 0 && (
        <>
          <div className="h-px bg-border" />
          <section className="py-6" aria-label="مجوزها">
            <h2 className="font-extrabold text-[17px] px-1 mb-3">مجوزهای درخواستی ({toFaDigits(app.permissions.length)})</h2>
            <ul className="px-1 text-[13px] space-y-2 max-h-44 overflow-y-auto">
              {app.permissions.map((p) => (
                <li key={p.id} className="font-mono bg-surface rounded-lg px-3 py-2 break-all" dir="ltr" style={{ textAlign: "left" }}>
                  {p.permission}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <div className="h-px bg-border" />
      <div className="py-6 px-1 space-y-3">
        <ReportButton appId={app.id} appName={app.nameFa} />
        <Link href={`/report?app=${app.slug}`}
          className="flex items-center justify-center gap-2 text-[13px] text-muted py-2">
          <TriangleAlert className="w-4 h-4" aria-hidden="true" /> گزارش مشکل یا لینک خراب
        </Link>
      </div>

      <QuickRating appId={app.id} />
      <Reviews appId={app.id} />

      {/* شاید بپسندی */}
      {app.similar.length > 0 && (
        <section className="mt-8" aria-label="شاید بپسندی">
          <h2 className="text-[17px] font-extrabold mb-4 px-1">شاید بپسندی</h2>
          <div className="grid grid-cols-3 gap-4">
            {app.similar.slice(0, 6).map((a, i) => <AppTile key={a.id} app={a} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
