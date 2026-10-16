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

// ردیف فشرده‌ی «پرطرفدارها» — مثل رفرنس: آیکون، نام، توضیح تک‌خطی، بج لایسنس و دکمه‌ی دریافت
export default function PopularRow({ app, platform }: { app: PopularApp; platform?: string }) {
  const href = platform && platform !== "android" ? `/app/${app.slug}?platform=${platform}` : `/app/${app.slug}`;
  const desc = app.shortDescFa || app.shortDesc;
  return (
    <div className="flex items-center gap-3.5 py-3 border-b border-border last:border-b-0">
      <Link href={href} className="shrink-0" aria-hidden="true" tabIndex={-1}>
        {app.iconUrl ? (
          <PxImg src={px(app.iconUrl) || "/icons/icon-192.png"} alt="" width={56} height={56}
            className="w-14 h-14 rounded-[15px] object-cover bg-surface-2" />
        ) : (
          <span className="w-14 h-14 rounded-[15px] bg-surface-2 grid place-items-center text-2xl font-bold text-muted" dir="ltr">
            {app.nameEn.charAt(0)}
          </span>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Link href={href} className="block font-bold leading-6 hover:text-primary transition truncate min-w-0">
            {app.nameFa}{" "}
            <span className="text-muted font-normal text-[13px]" dir="ltr" style={{ unicodeBidi: "isolate" }}>{app.nameEn}</span>
          </Link>
          <NewBadge createdAt={app.createdAt} className="shrink-0" />
        </div>
        {desc && <span className="block text-muted text-[13px] truncate">{desc}</span>}
        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted">
          <span className={`border rounded-md px-1.5 leading-5 ${app.isOpenSource ? "border-primary text-primary" : "border-border"}`}>
            {app.isOpenSource ? "متن‌باز" : "غیرمتن‌باز"}
          </span>
          {app.fileSize ? <span>{formatBytes(app.fileSize)}</span> : null}
        </div>
      </div>
      <Link href={href}
        className="shrink-0 border border-primary text-primary rounded-full px-5 py-1.5 font-medium text-sm transition hover:bg-primary hover:text-primary-fg">
        دریافت
      </Link>
    </div>
  );
}
