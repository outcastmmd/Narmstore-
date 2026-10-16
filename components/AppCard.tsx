import Link from "next/link";
import PxImg from "@/components/PxImg";
import { toFaDigits } from "@/lib/fa";
import { px } from "@/lib/img";

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
};

function Initial({ name }: { name: string }) {
  const ch = (name || "?").trim().charAt(0);
  return (
    <span className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center text-2xl font-bold shrink-0" aria-hidden="true">
      {ch}
    </span>
  );
}

export default function AppCard({ app, index = 0 }: { app: CardApp; index?: number }) {
  return (
    <Link
      href={`/app/${app.slug}`}
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
      className="animate-card-in card-hover group bg-surface border border-border rounded-2xl p-4 flex gap-3"
    >
      {app.iconUrl ? (
        <PxImg
          src={px(app.iconUrl) || app.iconUrl}
          alt={`آیکون ${app.nameFa}`}
          width={56}
          height={56}
          className="w-14 h-14 rounded-2xl object-cover shrink-0 bg-surface-2"
        />
      ) : (
        <Initial name={app.nameFa} />
      )}
      <div className="min-w-0 flex-1">
        <h3 className="font-bold truncate group-hover:text-primary transition-colors">{app.nameFa}</h3>
        <p className="text-xs text-muted truncate mt-0.5" dir="ltr" style={{ textAlign: "right" }}>{app.nameEn}</p>
        {(app.shortDescFa || app.shortDesc) && <p className="text-xs text-muted line-clamp-2 mt-1.5 leading-5">{app.shortDescFa || app.shortDesc}</p>}
        <div className="flex items-center gap-3 mt-2 text-xs text-muted">
          {app.versionName && (
            <span className="bg-surface-2 rounded-md px-2 py-0.5" dir="ltr">v{app.versionName}</span>
          )}
          <span>⬇️ {toFaDigits(app.downloadCount)}</span>
        </div>
      </div>
    </Link>
  );
}
