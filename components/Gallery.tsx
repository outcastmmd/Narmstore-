"use client";

import { useState, useEffect, useCallback } from "react";
import PxImg from "@/components/PxImg";

type Shot = { id: string; url: string };

function Spinner() {
  return (
    <div
      className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin"
      role="status"
      aria-label="در حال بارگذاری تصویر"
    />
  );
}

export default function Gallery({ shots, appName }: { shots: Shot[]; appName: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => {
    setOpen((i) => (i === null ? i : (i + d + shots.length) % shots.length));
  }, [shots.length]);

  // ریست وضعیت بارگذاری + پیش‌بارگذاری تصاویر هنگام باز شدن/جابه‌جایی لایت‌باکس
  useEffect(() => {
    if (open === null) return;
    setLoadedUrl(null);
    setFailedUrl(null);
    setRetry(0);
    // پیش‌بارگذاری همه‌ی اسکرین‌شات‌ها تا جابه‌جایی بدون مکث باشد
    shots.forEach((s) => {
      const im = new Image();
      im.src = s.url;
    });
  }, [open, shots]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(1);   // RTL: چپ = بعدی
      if (e.key === "ArrowRight") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  if (!shots.length) return null;

  const current = open !== null ? shots[open] : null;
  const failed = !!current && failedUrl === current.url;
  const loading = !!current && !failed && loadedUrl !== current.url;

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {shots.map((sh, i) => (
          <button key={sh.id} onClick={() => setOpen(i)}
            className="pressable shrink-0 rounded-xl overflow-hidden border border-border hover:border-primary/50"
            aria-label={`مشاهده تصویر ${i + 1} از ${appName}`}>
            <PxImg src={sh.url} alt={`تصویر ${appName}`} width={180} height={320}
              className="h-64 w-auto object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {current && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-fade-up"
          role="dialog" aria-modal="true" aria-label={`گالری ${appName}`}
          onClick={close}>
          <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm font-bold">{appName} — {open! + 1} از {shots.length}</span>
            <button onClick={close} aria-label="بستن"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl transition">
              ✕
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2 px-2 pb-4 min-h-0" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => step(-1)} aria-label="قبلی"
              className="w-11 h-11 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition z-10">
              ›
            </button>
            <div className="flex-1 flex items-center justify-center min-h-0 h-full relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner />
                </div>
              )}
              {failed ? (
                <div className="flex flex-col items-center gap-3 text-white/80">
                  <span className="text-sm">تصویر بارگذاری نشد</span>
                  <button
                    onClick={() => { setFailedUrl(null); setLoadedUrl(null); setRetry((r) => r + 1); }}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm transition">
                    تلاش مجدد
                  </button>
                </div>
              ) : (
                <PxImg
                  key={`${current.id}-${retry}`}
                  src={current.url}
                  alt={`تصویر ${open! + 1} از ${appName}`}
                  width={360} height={640} loading="eager"
                  className={`max-h-full max-w-full w-auto h-auto object-contain rounded-lg transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
                  onLoad={() => setLoadedUrl(current.url)}
                  onError={() => setFailedUrl(current.url)}
                />
              )}
            </div>
            <button onClick={() => step(1)} aria-label="بعدی"
              className="w-11 h-11 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition z-10">
              ‹
            </button>
          </div>
          <div className="flex justify-center gap-2 pb-6" onClick={(e) => e.stopPropagation()}>
            {shots.map((sh, i) => (
              <button key={sh.id} onClick={() => setOpen(i)} aria-label={`تصویر ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition ${i === open ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"}`} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
