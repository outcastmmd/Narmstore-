"use client";

import Link from "next/link";
import {
  MessageCircle, Gamepad2, Zap, Clapperboard, ShieldCheck,
  Sparkles, Code2, FolderOpen, type LucideIcon,
} from "lucide-react";

type Col = { id: string; slug: string; nameFa: string; appCount?: number };

// آیکون متمایز هر مجموعه بر اساس کلیدواژه‌ی اسم
function colIcon(nameFa: string): LucideIcon {
  const n = nameFa;
  if (n.includes("پیام‌رسان") || n.includes("پیامرسان")) return MessageCircle;
  if (n.includes("بازی")) return Gamepad2;
  if (n.includes("بهره‌وری") || n.includes("بهرهوری")) return Zap;
  if (n.includes("سرگرمی") || n.includes("رسانه") || n.includes("موسیقی") || n.includes("چندرسانه")) return Clapperboard;
  if (n.includes("خصوصی") || n.includes("حریم") || n.includes("امنیت")) return ShieldCheck;
  if (n.includes("ضروری") || n.includes("منتخب") || n.includes("پیشنهاد")) return Sparkles;
  if (n.includes("توسعه") || n.includes("برنامه‌نویس") || n.includes("کدنویسی")) return Code2;
  return FolderOpen;
}

// مرور مینیمال مجموعه‌ها — آیکونی بدون اسم
export default function CollectionBrowser({
  collections,
  platform,
}: {
  collections: Col[];
  platform?: string;
}) {
  if (!collections.length) return null;

  return (
    <section aria-label="مجموعه‌ها" className="mb-10">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-base font-extrabold">مجموعه‌ها</h2>
        <Link
          href={`/collections${platform && platform !== "android" ? `?platform=${platform}` : ""}`}
          className="text-xs text-primary font-bold hover:underline"
        >
          همه
        </Link>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
        {collections.map((c) => {
          const Icon = colIcon(c.nameFa);
          return (
            <Link
              key={c.id}
              href={`/collection/${c.slug}`}
              title={c.nameFa}
              aria-label={c.nameFa}
              className="snap-start shrink-0 w-20 h-20 rounded-2xl bg-base-200 border border-base-300/60 grid place-items-center text-primary hover:scale-105 hover:border-primary/40 hover:-translate-y-0.5 transition"
            >
              <Icon className="w-8 h-8" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
