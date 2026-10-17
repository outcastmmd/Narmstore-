"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate, toFaDigits } from "@/lib/fa";

type App = {
  id: string; slug: string; packageName: string;
  nameFa: string; nameEn: string; isPublished: boolean;
  featured: boolean; updatedAt: string; versionCount: number;
};

export default function AppsList() {
  const [apps, setApps] = useState<App[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/apps").then((r) => r.json()).then((j) => {
      setApps(j.apps || []); setLoading(false);
    });
  }, []);

  const filtered = apps.filter((a) =>
    !q || a.nameFa.includes(q) || a.nameEn.toLowerCase().includes(q.toLowerCase()) || a.packageName.includes(q)
  );

  const unpublish = async (id: string) => {
    if (!confirm("این برنامه از انتشار خارج شود؟")) return;
    await fetch(`/api/admin/apps/${id}`, { method: "DELETE" });
    setApps((p) => p.map((a) => a.id === id ? { ...a, isPublished: false } : a));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-extrabold">نرم‌افزارها ({toFaDigits(apps.length)})</h1>
        <div className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجو..."
            className="h-10 rounded-xl bg-surface border border-border px-4 text-sm w-48 focus:outline-none focus:border-primary" />
          <Link href="/admin/apps/new"
            className="h-10 px-5 rounded-xl bg-primary text-primary-fg font-bold text-sm flex items-center hover:opacity-90">
            ＋ جدید
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-surface border border-border rounded-2xl animate-pulse" />))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-3xl overflow-hidden">
          <ul className="divide-y divide-border">
            {filtered.map((a) => (
              <li key={a.id} className="flex items-center gap-4 p-4 hover:bg-surface-2/50 transition">
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">
                    {a.nameFa}
                    {!a.isPublished && <span className="text-xs text-accent font-normal ms-2">(پیش‌نویس)</span>}
                    {a.featured && <span className="text-xs text-primary font-normal ms-2">⭐</span>}
                  </p>
                  <p className="text-xs text-muted truncate" dir="ltr" style={{ textAlign: "right" }}>
                    {a.packageName} • {toFaDigits(a.versionCount)} نسخه • {formatDate(a.updatedAt)}
                  </p>
                </div>
                <Link href={`/admin/apps/${a.id}`}
                  className="text-sm text-primary font-bold hover:underline shrink-0">ویرایش</Link>
                {a.isPublished && (
                  <button onClick={() => unpublish(a.id)}
                    className="btn btn-error btn-sm shrink-0">لغو انتشار</button>
                )}
              </li>
            ))}
          </ul>
          {!filtered.length && <p className="p-10 text-center text-muted text-sm">موردی یافت نشد.</p>}
        </div>
      )}
    </div>
  );
}
