import Link from "next/link";
import PxImg from "@/components/PxImg";
import { toFaDigits } from "@/lib/fa";
import { px } from "@/lib/img";
import { Star, Download } from "lucide-react";

export type CardApp = {
  id: string;
  slug: string;
  nameFa: string;
  nameEn: string;
  iconUrl: string | null;
  shortDesc: string | null;
  shortDescFa: string | null;
  versionName: string | null;
  downloadCount: number;
  githubStars: number | null;
  platform?: string | null;
};

function Initial({ name }: { name: string }) {
  const ch = (name || "?").trim().charAt(0);
  return (
    <span className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center text-2xl font-bold shrink-0" aria-hidden="true">
      {ch}
    </span>
  );
}

// کارت برنامه — ارتفاع یکسان: آیکون + نام + استار/دانلود، بدون توضیحات
export default function AppCard({ app, index = 0 }: { app: CardApp; index?: number }) {
  return (
    <Link
      href={app.platform && app.platform !== "android" ? `/app/${app.slug}?platform=${app.platform}` : `/app/${app.slug}`}
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
      className="animate-card-in card-hover group bg-surface border border-border rounded-2xl p-4 flex gap-3 h-full"
    >
      {app.iconUrl ? (
        <PxImg
          src={px(app.iconUrl) || app.iconUrl}
          alt={`آیکون ${app.nameFa}`}
          width={56}
          height={56}
          className="w-14 h-14 rounded-xl object-cover shrink-0 bg-surface-2 border border-border"
        />
      ) : (
        <Initial name={app.nameFa} />
      )}
      <div className="min-w-0 flex-1 flex flex-col">
        <h3 className="font-bold truncate leading-6 group-hover:text-primary transition-colors">{app.nameFa}</h3>
        <div className="flex items-center gap-3 mt-auto pt-2 text-xs text-muted">
          {app.githubStars ? (
            <span className="inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              {toFaDigits(app.githubStars)}
            </span>
          ) : null}
          {app.downloadCount > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              {toFaDigits(app.downloadCount)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
