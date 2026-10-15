"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
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
        🔍
      </button>
    </form>
  );
}
