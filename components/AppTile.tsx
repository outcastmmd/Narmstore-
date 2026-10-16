import Link from "next/link";
import PxImg from "@/components/PxImg";
import { toFaDigits } from "@/lib/fa";
import { px } from "@/lib/img";
import { Star } from "lucide-react";
import type { CardApp } from "./AppCard";

function Initial({ name }: { name: string }) {
  const ch = (name || "?").trim().charAt(0);
  return (
    <span
      className="w-16 h-16 rounded-2xl bg-primary-soft text-primary flex items-center justify-center text-3xl font-bold shrink-0"
      aria-hidden="true"
    >
      {ch}
    </span>
  );
}

// تایل مربعی برنامه — مخصوص نمایش داخل کالکشن‌ها
export default function AppTile({ app, index = 0 }: { app: CardApp; index?: number }) {
  return (
    <Link
      href={app.platform && app.platform !== "android" ? `/app/${app.slug}?platform=${app.platform}` : `/app/${app.slug}`}
      style={{ animationDelay: `${Math.min(index, 18) * 30}ms` }}
      className="animate-card-in card-hover group bg-surface border border-border rounded-2xl p-3 flex flex-col items-center justify-center gap-2 aspect-square text-center"
    >
      {app.iconUrl ? (
        <PxImg
          src={px(app.iconUrl) || app.iconUrl}
          alt={`آیکون ${app.nameFa}`}
          width={64}
          height={64}
          className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-surface-2 border border-border"
        />
      ) : (
        <Initial name={app.nameFa} />
      )}
      <h3 className="font-bold text-[13px] leading-5 line-clamp-2 group-hover:text-primary transition-colors w-full">
        {app.nameFa}
      </h3>
      <span className="inline-flex items-center gap-1 text-[11px] text-muted shrink-0">
        <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
        {toFaDigits(app.githubStars ?? 0)}
      </span>
    </Link>
  );
}
