import Link from "next/link";
import Image from "next/image";
import { toFaDigits } from "@/lib/fa";

export type CardApp = {
  id: string;
  slug: string;
  nameFa: string;
  nameEn: string;
  iconUrl: string | null;
  shortDesc: string | null;
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

export default function AppCard({ app }: { app: CardApp }) {
  return (
    <Link
      href={`/app/${app.slug}`}
      className="animate-fade-up group bg-surface border border-border rounded-2xl p-4 flex gap-3 hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5 transition-all"
    >
      {app.iconUrl ? (
        <Image
          src={app.iconUrl}
          alt={`آیکون ${app.nameFa}`}
          width={56}
          height={56}
          loading="lazy"
          className="w-14 h-14 rounded-2xl object-cover shrink-0 bg-surface-2"
        />
      ) : (
        <Initial name={app.nameFa} />
      )}
      <div className="min-w-0 flex-1">
        <h3 className="font-bold truncate group-hover:text-primary transition-colors">{app.nameFa}</h3>
        <p className="text-xs text-muted truncate mt-0.5" dir="ltr" style={{ textAlign: "right" }}>{app.nameEn}</p>
        {app.shortDesc && <p className="text-xs text-muted line-clamp-2 mt-1.5 leading-5">{app.shortDesc}</p>}
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
