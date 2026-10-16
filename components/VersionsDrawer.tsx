"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, History } from "lucide-react";
import { toFaDigits, formatBytes, formatDate } from "@/lib/fa";

type Version = {
  id: string;
  versionName: string | null;
  publishedAt: Date | string | null;
  createdAt: Date | string | null;
  fileSize: number | null;
};

export default function VersionsDrawer({ versions }: { versions: Version[] }) {
  const [open, setOpen] = useState(false);

  if (versions.length <= 1) return null;

  return (
    <section className="bg-surface border border-border rounded-3xl overflow-hidden" aria-label="نسخه‌های قبلی">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 hover:bg-surface-2/50 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 font-extrabold">
          <History className="w-5 h-5 text-primary" />
          نسخه‌های قبلی
          <span className="text-xs font-normal text-muted bg-surface-2 rounded-full px-2 py-0.5">
            {toFaDigits(versions.length - 1)}
          </span>
        </span>
        <ChevronDown
          className={`w-5 h-5 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="px-6 pb-6 space-y-2">
          {versions.slice(1).map((ver) => (
            <li
              key={ver.id}
              className="flex items-center justify-between gap-3 bg-surface-2 rounded-xl px-4 py-3 text-sm"
            >
              <span className="font-bold" dir="ltr">
                v{ver.versionName ?? "?"}
              </span>
              <span className="text-muted text-xs">
                {formatDate(ver.publishedAt || ver.createdAt)} • {formatBytes(ver.fileSize)}
              </span>
              <Link
                href={`/api/download/${ver.id}`}
                className="text-primary font-bold text-xs hover:underline shrink-0"
              >
                دانلود
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
