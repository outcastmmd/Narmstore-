import Link from "next/link";
import PxImg from "@/components/PxImg";
import NewBadge from "@/components/NewBadge";
import { px } from "@/lib/img";
import { formatBytes } from "@/lib/fa";

export type PopularApp = {
  id: string; slug: string; nameFa: string; nameEn: string;
  iconUrl: string | null; shortDesc: string | null; shortDescFa: string | null;
  fileSize: number | null; isOpenSource: boolean | null; platform?: string | null;
  createdAt?: Date | string | null;
};

// ردیف «پرطرفدارها» — تمیز و تحریریه‌ای: رتبه، آیکون، نام، بج لایسنس
export default function PopularRow({ app, platform, index = 0 }: { app: PopularApp; platform?: string; index?: number }) {
  const href = platform && platform !== "android" ? `/app/${app.slug}?platform=${platform}` : `/app/${app.slug}`;
  const desc = app.shortDescFa || app.shortDesc;
  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-border last:border-b-0 group">
      <span className="rank-num" aria-hidden="true">{(index + 1).toLocaleString("fa-IR")}</span>
      <Link href={href} className="shrink-0" aria-hidden="true" tabIndex={-1}>
        {app.iconUrl ? (
          <PxImg src={px(app.iconUrl) || "/icons/icon-192.png"} alt="" width={52} height={52}
            className="w-[52px] h-[52px] rounded-xl object-cover bg-surface-2 border border-border" />
        ) : (
          <span className="w-[52px] h-[52px] rounded-xl bg-surface-2 border border-border grid place-items-center text-xl font-bold text-muted" dir="ltr">
            {app.nameEn.charAt(0)}
          </span>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Link href={href} className="block font-bold leading-6 group-hover:text-primary transition-colors truncate min-w-0">
            {app.nameFa}{" "}
            <span className="text-muted font-normal text-[13px]" dir="ltr" style={{ unicodeBidi: "isolate" }}>{app.nameEn}</span>
          </Link>
          <NewBadge createdAt={app.createdAt} className="shrink-0" />
        </div>
        {desc && <span className="block text-muted text-[13px] truncate mt-0.5">{desc}</span>}
      </div>
      <span className={`shrink-0 text-[11px] font-bold rounded-full px-3 py-1 border ${
        app.isOpenSource
          ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
          : "text-sky-600 dark:text-sky-400 border-sky-500/30 bg-sky-500/10"
      }`}>
        {app.isOpenSource ? "متن‌باز" : "رایگان"}
      </span>
    </div>
  );
}
