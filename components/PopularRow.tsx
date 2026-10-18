import Link from "next/link";
import PxImg from "@/components/PxImg";
import { px } from "@/lib/img";

export type PopularApp = {
  id: string; slug: string; nameFa: string; nameEn: string;
  iconUrl: string | null; shortDesc: string | null; shortDescFa: string | null;
  fileSize: number | null; isOpenSource: boolean | null; platform?: string | null;
  createdAt?: Date | string | null;
};

// کارت فشرده «پرطرفدارها» — فقط رتبه + آیکون، بدون اسم
export default function PopularRow({ app, platform, index = 0 }: { app: PopularApp; platform?: string; index?: number }) {
  const href = platform && platform !== "android" ? `/app/${app.slug}?platform=${platform}` : `/app/${app.slug}`;
  const rank = (index + 1).toLocaleString("fa-IR");
  const top3 = index < 3;
  return (
    <Link
      href={href}
      title={app.nameFa}
      aria-label={`${rank} — ${app.nameFa}`}
      className="card bg-base-200 transition-all hover:scale-[1.03]"
    >
      <div className="card-body p-3 flex flex-row items-center gap-2.5">
        <span
          className={`font-extrabold text-lg shrink-0 w-6 text-center ${top3 ? "text-warning" : "opacity-40"}`}
          aria-hidden="true"
        >
          {rank}
        </span>
        {app.iconUrl ? (
          <PxImg src={px(app.iconUrl) || "/icons/icon-192.png"} alt="" width={44} height={44}
            className="w-11 h-11 rounded-xl object-cover" />
        ) : (
          <span className="w-11 h-11 rounded-xl bg-base-300 grid place-items-center text-lg font-bold opacity-60" dir="ltr">
            {app.nameEn.charAt(0)}
          </span>
        )}
      </div>
    </Link>
  );
}
