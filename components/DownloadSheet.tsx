"use client";

import { useEffect, useState } from "react";
import { X, Download, ShieldCheck, FileDown, Globe, Hash, ChevronLeft } from "lucide-react";
import PxImg from "@/components/PxImg";
import { px } from "@/lib/img";
import { toFaDigits, formatBytes } from "@/lib/fa";

export type DownloadOption = {
  label: string;
  href: string;
  external?: boolean;
  detail?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  appName: string;
  iconUrl: string | null;
  versionName: string | null;
  fileSize: number | null;
  sha256: string | null;
  sourceLabel: string;
  options: DownloadOption[];
};

// باتم‌شیت دانلود — نسخه‌ی بهتر و روان‌تر
export default function DownloadSheet({
  open, onClose, appName, iconUrl, versionName, fileSize, sha256, sourceLabel, options,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [showHash, setShowHash] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open ]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;
  const primary = options[0];
  const rest = options.slice(1);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`دانلود ${appName}`}>
      {/* بک‌دراپ */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      {/* شیت */}
      <div
        className={`absolute bottom-0 inset-x-0 max-h-[88dvh] overflow-y-auto bg-surface border-t border-border rounded-t-[28px] px-6 pt-3 pb-8 transition-transform duration-300 ease-out ${visible ? "translate-y-0" : "translate-y-full"}`}
        onTransitionEnd={() => !open && setVisible(false)}
      >
        <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5" aria-hidden="true" />
        <button
          onClick={onClose}
          aria-label="بستن"
          className="absolute top-4 left-4 w-9 h-9 grid place-items-center rounded-full bg-surface-2 text-muted hover:text-foreground transition"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* سربرگ اپ */}
        <div className="flex items-center gap-4 mb-6">
          {iconUrl ? (
            <PxImg src={px(iconUrl) || iconUrl} alt="" width={72} height={72} className="w-[72px] h-[72px] rounded-[22%] object-cover shadow-lg shrink-0" />
          ) : (
            <span className="w-[72px] h-[72px] rounded-[22%] bg-primary-soft text-primary grid place-items-center text-3xl font-extrabold shrink-0" aria-hidden="true">
              {(appName || "?").trim().charAt(0)}
            </span>
          )}
          <div className="min-w-0">
            <h2 className="font-extrabold text-lg leading-7 truncate">{appName}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {versionName && (
                <span dir="ltr" className="text-sm text-muted font-bold">{versionName}</span>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-0.5">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> پایدار
              </span>
            </div>
          </div>
        </div>

        {/* جزئیات فایل */}
        <dl className="bg-surface-2 rounded-2xl divide-y divide-border mb-5 text-sm">
          {fileSize ? (
            <div className="flex items-center justify-between px-4 py-3">
              <dt className="inline-flex items-center gap-2 text-muted"><FileDown className="w-4 h-4" aria-hidden="true" /> حجم فایل</dt>
              <dd className="font-bold" dir="ltr">{formatBytes(fileSize)}</dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="inline-flex items-center gap-2 text-muted"><Globe className="w-4 h-4" aria-hidden="true" /> منبع</dt>
            <dd className="font-bold">{sourceLabel}</dd>
          </div>
          {sha256 && (
            <div className="px-4 py-3">
              <button onClick={() => setShowHash(!showHash)} className="flex items-center justify-between w-full">
                <span className="inline-flex items-center gap-2 text-muted"><Hash className="w-4 h-4" aria-hidden="true" /> هش SHA-256</span>
                <ChevronLeft className={`w-4 h-4 text-muted transition-transform ${showHash ? "-rotate-90" : ""}`} aria-hidden="true" />
              </button>
              {showHash && (
                <dd dir="ltr" className="mt-2 text-[11px] font-mono break-all text-muted bg-surface rounded-xl p-3 select-all">{sha256}</dd>
              )}
            </div>
          )}
        </dl>

        {/* دکمه‌ی اصلی */}
        {primary && (
          <a
            href={primary.href}
            {...(primary.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex items-center justify-center gap-2 w-full bg-primary text-white font-extrabold text-base rounded-2xl py-4 mb-3 hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-primary/25"
          >
            <Download className="w-5 h-5" aria-hidden="true" />
            دانلود {versionName ? <span dir="ltr">{versionName}</span> : null}
          </a>
        )}

        {/* گزینه‌های بیشتر */}
        {rest.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted font-bold px-1 mt-2">گزینه‌های بیشتر</p>
            {rest.map((o) => (
              <a
                key={o.label}
                href={o.href}
                {...(o.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center justify-between w-full border border-border rounded-2xl px-4 py-3 hover:border-primary/50 transition group"
              >
                <span>
                  <span className="block font-bold text-sm group-hover:text-primary transition">{o.label}</span>
                  {o.detail && <span className="block text-xs text-muted mt-0.5">{o.detail}</span>}
                </span>
                <ChevronLeft className="w-4 h-4 text-muted" aria-hidden="true" />
              </a>
            ))}
          </div>
        )}

        <p className="text-[11px] text-muted text-center mt-5 leading-5">
          دانلود از منبع رسمی انجام می‌شود. هش فایل را می‌توانید با مقدار بالا مقایسه کنید.
        </p>
      </div>
    </div>
  );
}
