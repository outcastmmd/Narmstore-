"use client";

import { Download, Globe } from "lucide-react";
import { getDownloadOptions, type DownloadAppInfo } from "./DownloadActions";

// دکمه‌های دانلود ساده — بدون شیت، گزینه‌ها کنار هم
export default function DownloadButtons({ app }: { app: DownloadAppInfo }) {
  const opts = getDownloadOptions(app);
  if (!opts.length) return null;

  const primary = opts.find((o) => o.primary) ?? opts[0];
  const rest = opts.filter((o) => o !== primary);

  return (
    <section aria-label="دانلود" className="mt-6">
      <div className="flex flex-col sm:flex-row gap-2.5">
        <a
          href={primary.href}
          target={primary.external ? "_blank" : undefined}
          rel={primary.external ? "noopener noreferrer" : undefined}
          download={!primary.external ? "" : undefined}
          className="flex-1 flex items-center justify-center gap-2.5 font-extrabold text-base rounded-2xl py-4 px-6 transition active:scale-[0.98] text-white shadow-lg"
          style={{ background: "var(--primary)", boxShadow: "0 8px 24px -8px var(--primary)" }}
        >
          <span className="[&>svg]:w-6 [&>svg]:h-6">{primary.icon}</span>
          {primary.label === "دانلود مستقیم" ? "دانلود" : primary.label}
        </a>
        {rest.map((o) => (
          <a
            key={o.key}
            href={o.href}
            target={o.external ? "_blank" : undefined}
            rel={o.external ? "noopener noreferrer" : undefined}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 font-bold text-sm rounded-2xl py-4 px-5 border border-border bg-surface text-foreground transition active:scale-[0.98] hover:border-primary/50"
          >
            <span className="[&>svg]:w-5 [&>svg]:h-5 text-primary">{o.icon}</span>
            {o.label}
          </a>
        ))}
      </div>
    </section>
  );
}
