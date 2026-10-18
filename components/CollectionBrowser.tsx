"use client";

import Link from "next/link";
import { toFaDigits } from "@/lib/fa";
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

// مجموعه‌ها — کارت‌های مربعی با اسم
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
              className="snap-start shrink-0 w-28 rounded-2xl bg-base-200 border border-base-300/60 p-3 flex flex-col items-center gap-2 text-center hover:border-primary/40 hover:-translate-y-0.5 transition"
            >
              <span className="w-12 h-12 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </span>
              <span className="text-[11px] font-bold leading-4 line-clamp-2">{c.nameFa}</span>
              <span className="text-[10px] opacity-50 -mt-1">{toFaDigits(c.appCount ?? 0)} اپ</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
