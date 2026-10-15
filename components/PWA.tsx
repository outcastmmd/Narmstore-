"use client";
import { useEffect, useState } from "react";

// ثبت Service Worker
export function SWRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

// دکمه‌ی نصب اپ (PWA)
export function InstallButton() {
  const [deferred, setDeferred] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferred || dismissed) return null;

  const install = async () => {
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 inset-x-4 z-50 max-w-md mx-auto" role="dialog" aria-label="نصب نرم‌استور">
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-fade-up">
        <span className="w-11 h-11 rounded-xl bg-primary text-primary-fg flex items-center justify-center text-xl font-bold shrink-0">ن</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">نرم‌استور را نصب کنید</p>
          <p className="text-xs text-muted">دسترسی سریع‌تر، مثل یک اپ واقعی</p>
        </div>
        <button onClick={install} className="bg-primary text-primary-fg text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 shrink-0">
          نصب
        </button>
        <button onClick={() => setDismissed(true)} aria-label="بستن"
          className="text-muted hover:text-fg text-lg px-1 shrink-0">✕</button>
      </div>
    </div>
  );
}
