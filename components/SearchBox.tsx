"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Search } from "lucide-react";

function SearchBoxInner({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const sp = useSearchParams();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    // حفظ پلتفرم فعلی در جست‌وجو تا نتایج فقط از همان پلتفرم باشند
    const p = sp.get("platform");
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("narm-platform");
    } catch {}
    const plat = p === "windows" || p === "linux" ? p
      : stored === "windows" || stored === "linux" ? stored : null;
    const qs = plat ? `&platform=${plat}` : "";
    router.push(`/search?q=${encodeURIComponent(query)}${qs}`);
  };

  return (
    <form onSubmit={submit} role="search" className={`relative ${compact ? "w-full" : "w-full max-w-xl"}`}>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="جست‌وجوی برنامه‌ها..."
        aria-label="جست‌وجوی برنامه‌ها"
        className="w-full h-11 rounded-xl bg-surface-2 border border-border pe-11 ps-4 text-fg placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
      />
      <button
        type="submit"
        aria-label="جست‌وجو"
        className="absolute end-1 top-1 w-9 h-9 rounded-lg bg-primary text-primary-fg flex items-center justify-center hover:opacity-90 transition"
      >
        <Search className="w-4 h-4" aria-hidden="true" />
      </button>
    </form>
  );
}

export default function SearchBox({ compact = false }: { compact?: boolean }) {
  return (
    <Suspense fallback={null}>
      <SearchBoxInner compact={compact} />
    </Suspense>
  );
}
