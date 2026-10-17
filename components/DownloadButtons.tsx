"use client";

import { Download } from "lucide-react";
import { getDownloadOptions, type DownloadAppInfo } from "./DownloadActions";

// ─── آیکون‌های پلتفرم (اینلاین، بدون وابستگی) ───
const AndroidIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M17.6 9.5a5.6 5.6 0 0 0-11.2 0Zm-8-3.9-1.3-2.2a.3.3 0 0 1 .5-.3l1.3 2.2a6.5 6.5 0 0 1 5.8 0l1.3-2.2a.3.3 0 0 1 .5.3l-1.3 2.2A5.6 5.6 0 0 1 17.6 9.5H6.4a5.6 5.6 0 0 1 3.2-3.9ZM9.2 8a.6.6 0 1 0 0-1.1.6.6 0 0 0 0 1.1Zm5.6 0a.6.6 0 1 0 0-1.1.6.6 0 0 0 0 1.1ZM6 10.3h12v8a1.7 1.7 0 0 1-1.7 1.7h-.9v2.4a1.3 1.3 0 0 1-2.6 0V20h-1.6v2.4a1.3 1.3 0 0 1-2.6 0V20h-.9A1.7 1.7 0 0 1 6 18.3Z" />
  </svg>
);

const TuxIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2C8 2 5 5.5 5 10c0 1.5.4 2.9 1 4.1L4 19l2.5-.7c1 .9 2.2 1.7 3.6 2.1l-.6 1.6h5l-.6-1.6c1.4-.4 2.6-1.2 3.6-2.1L20 19l-2-4.9c.6-1.2 1-2.6 1-4.1 0-4.5-3-8-7-8Zm-2.5 5.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5Zm5 0c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5ZM12 13.5c-1.2 0-2.3.5-3 1.4l-.5.6 1.8 1.3c.5-.4 1.1-.6 1.7-.6s1.2.2 1.7.6l1.8-1.3-.5-.6c-.7-.9-1.8-1.4-3-1.4Z" />
  </svg>
);

const WindowsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M3 5.5 10.5 4.4v7.1H3zM11.6 4.2 21 3v8.5h-9.4zM3 12.5h7.5v7.1L3 18.5zM11.6 12.5H21V21l-9.4-1.3z" />
  </svg>
);

function platformIcon(platform: string, className: string) {
  if (platform === "linux") return <TuxIcon className={className} />;
  if (platform === "windows") return <WindowsIcon className={className} />;
  return <AndroidIcon className={className} />;
}

const platformFa: Record<string, string> = {
  android: "اندروید",
  windows: "ویندوز",
  linux: "لینوکس",
};

// دکمه‌های دانلود آیکونی — فقط آیکون پلتفرم، بدون متن نسخه
export default function DownloadButtons({ app }: { app: DownloadAppInfo }) {
  const opts = getDownloadOptions(app);
  if (!opts.length) return null;

  const primary = opts.find((o) => o.primary) ?? opts[0];
  const rest = opts.filter((o) => o !== primary);

  return (
    <section aria-label="دانلود" className="mt-6">
      <div className="flex items-center gap-3">
        <a
          href={primary.href}
          target={primary.external ? "_blank" : undefined}
          rel={primary.external ? "noopener noreferrer" : undefined}
          download={!primary.external ? "" : undefined}
          title="دانلود"
          aria-label={`دانلود برای ${platformFa[app.platform] ?? app.platform}`}
          className="relative grid place-items-center w-20 h-20 rounded-3xl text-white transition active:scale-95 hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 85%, black), color-mix(in srgb, var(--primary) 60%, black))",
            boxShadow: "0 12px 32px -10px var(--primary)",
          }}
        >
          <span className="relative [&>svg]:w-10 [&>svg]:h-10">
            {platformIcon(app.platform, "")}
            <span
              className="absolute -bottom-2 -end-2 grid place-items-center w-7 h-7 rounded-full text-white shadow-md ring-2 ring-white/25"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <Download className="w-4 h-4" aria-hidden="true" />
            </span>
          </span>
        </a>
        {rest.map((o) => (
          <a
            key={o.key}
            href={o.href}
            target={o.external ? "_blank" : undefined}
            rel={o.external ? "noopener noreferrer" : undefined}
            title={o.label}
            aria-label={o.label}
            className="grid place-items-center w-12 h-12 rounded-2xl border border-border bg-surface text-foreground transition active:scale-95 hover:border-primary/60"
          >
            <span className="[&>svg]:w-6 [&>svg]:h-6 text-primary">{o.icon}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
