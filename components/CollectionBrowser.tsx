"use client";

import Link from "next/link";
import { toFaDigits } from "@/lib/fa";
import { FolderOpen } from "lucide-react";

type Col = { id: string; slug: string; nameFa: string; appCount?: number };

// مرور مینیمال مجموعه‌ها — چیپ‌های کوچک افقی مثل دسته‌بندی‌ها
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
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
        {collections.map((c) => (
          <Link
            key={c.id}
            href={`/collection/${c.slug}`}
            className="snap-start shrink-0 flex flex-col items-center gap-2 w-[72px] group"
          >
            <span className="w-14 h-14 rounded-2xl bg-base-200 grid place-items-center text-primary group-hover:scale-105 transition shadow-sm">
              <FolderOpen className="w-6 h-6" aria-hidden="true" />
            </span>
            <span className="text-[11px] font-bold leading-4 text-center line-clamp-2">
              {c.nameFa}
            </span>
            <span className="text-[10px] text-muted -mt-1">
              {toFaDigits(c.appCount ?? 0)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
