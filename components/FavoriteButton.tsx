"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ appId, appName }: { appId: string; appName: string }) {
  const [fav, setFav] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/favorites").then((r) => {
      if (!r.ok) { setFav(false); return null; }
      return r.json();
    }).then((j) => {
      if (j) setFav((j.favorites || []).some((f: any) => f.appId === appId));
    }).catch(() => setFav(false));
  }, [appId]);

  const toggle = async () => {
    if (fav === null || busy) return;
    setBusy(true);
    const r = await fetch("/api/favorites", {
      method: fav ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appId }),
    });
    if (r.status === 401) {
      router.push(`/login?next=/app/${appName}`);
      return;
    }
    if (r.ok) {
      const j = await r.json();
      setFav(j.favorited);
    }
    setBusy(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={busy || fav === null}
      aria-label={fav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      aria-pressed={!!fav}
      title={fav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl transition shrink-0 ${fav
        ? "bg-red-50 border-red-200 text-red-500"
        : "bg-surface border-border text-muted hover:border-red-300 hover:text-red-400"
        }`}
    >
      {fav ? "❤️" : "🤍"}
    </button>
  );
}
