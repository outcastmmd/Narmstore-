"use client";
import { useState, useRef, useEffect } from "react";
import { Download, Package, Link2, Check } from "lucide-react";
import { formatBytes } from "@/lib/fa";

export default function DownloadButton({
  versionId, versionName, fileSize,
}: {
  versionId: string; versionName: string; fileSize: number | null;
}) {
  const [copied, setCopied] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const mainBtnRef = useRef<HTMLAnchorElement>(null);
  const url = `/api/download/${versionId}`;

  // فقط وقتی دکمه‌ی اصلی دیده نمی‌شه، دکمه‌ی شناور رو نشون بده
  useEffect(() => {
    const el = mainBtnRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <>
      {/* دکمه شناور پایین صفحه در موبایل — فقط وقتی دکمه‌ی اصلی دیده نمی‌شود */}
      <div
        className={`md:hidden fixed bottom-20 inset-x-4 z-40 transition-all duration-300 ${
          showSticky ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <a
          href={url}
          className="flex items-center justify-center gap-2 bg-primary text-primary-fg text-center font-extrabold text-lg py-4 rounded-2xl shadow-xl shadow-primary/30 active:scale-[0.99] transition"
        >
          <Download className="w-5 h-5" aria-hidden="true" /> دانلود نسخه <span dir="ltr">{versionName}</span>
        </a>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <a
        ref={mainBtnRef}
        href={url}
        className="flex-1 bg-primary text-primary-fg text-center font-extrabold text-lg py-4 rounded-2xl hover:opacity-90 active:scale-[0.99] transition shadow-lg shadow-primary/20 inline-flex items-center justify-center gap-2"
      >
        <Download className="w-5 h-5" aria-hidden="true" /> دانلود نسخه <span dir="ltr">{versionName}</span>
      </a>
      <div className="flex items-center gap-3 text-sm text-muted">
        <span className="bg-surface-2 rounded-lg px-3 py-2 inline-flex items-center gap-1.5"><Package className="w-4 h-4" aria-hidden="true" /> {formatBytes(fileSize)}</span>
        <button onClick={copy} className="bg-surface-2 hover:bg-border rounded-lg px-3 py-2 transition inline-flex items-center gap-1.5" aria-label="کپی لینک دانلود">
          {copied ? <><Check className="w-4 h-4" aria-hidden="true" /> کپی شد!</> : <><Link2 className="w-4 h-4" aria-hidden="true" /> کپی لینک</>}
        </button>
      </div>
      </div>
    </>
  );
}
