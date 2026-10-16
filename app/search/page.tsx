import Link from "next/link";
import { searchApps } from "@/lib/store";
import AppCard from "@/components/AppCard";
import { toFaDigits } from "@/lib/fa";
import type { Metadata } from "next";


type Props = { searchParams: Promise<{ q?: string; sort?: string; oss?: string; page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const q = sp.q || "";
  return { title: q ? `جست‌وجو: ${q}` : "جست‌وجو", robots: { index: false } };
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const sort = (sp.sort === "popular" || sp.sort === "newest" || sp.sort === "name") ? sp.sort : "updated";
  const oss = sp.oss === "1";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const perPage = 24;

  const { items, total } = q
    ? await searchApps(q, { sort, openSource: oss || undefined }, perPage, (page - 1) * perPage)
    : { items: [], total: 0 };
  const pages = Math.ceil(total / perPage);
  const base = `/search?q=${encodeURIComponent(q)}&sort=${sort}${oss ? "&oss=1" : ""}`;

  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-extrabold mb-1">
        {q ? <>نتایج جست‌وجو برای «{q}»</> : "جست‌وجو"}
      </h1>
      <p className="text-sm text-muted mb-6">{q ? `${toFaDigits(total)} نتیجه` : "عبارتی را در کادر جست‌وجوی بالا وارد کنید."}</p>

      {q && (
        <div className="flex flex-wrap gap-2 mb-6">
          {([["updated", "مرتبط‌ترین"], ["popular", "محبوب‌ترین"], ["newest", "جدیدترین"], ["name", "نام"]] as const).map(([k, label]) => (
            <Link key={k} href={`/search?q=${encodeURIComponent(q)}&sort=${k}${oss ? "&oss=1" : ""}`}
              className={`text-sm px-4 py-2 rounded-xl border transition ${sort === k
                ? "bg-primary text-primary-fg border-primary font-bold" : "bg-surface border-border hover:border-primary/50"}`}>
              {label}
            </Link>
          ))}
          <Link href={`/search?q=${encodeURIComponent(q)}&sort=${sort}${oss ? "" : "&oss=1"}`}
            className={`text-sm px-4 py-2 rounded-xl border transition ${oss
              ? "bg-primary text-primary-fg border-primary font-bold" : "bg-surface border-border hover:border-primary/50"}`}>
            🆓 فقط متن‌باز
          </Link>
        </div>
      )}

      {q && (items.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((a, i) => <AppCard key={a.id} app={a} index={i} />)}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-3xl p-10 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-bold mb-1">نتیجه‌ای یافت نشد</p>
          <p className="text-sm text-muted">املای عبارت را بررسی کنید یا از کلمات ساده‌تر استفاده کنید.</p>
        </div>
      ))}

      {pages > 1 && (
        <nav className="flex justify-center gap-2 mt-8" aria-label="صفحه‌بندی">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`${base}&page=${p}`} aria-current={p === page ? "page" : undefined}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm border transition ${p === page
                ? "bg-primary text-primary-fg border-primary font-bold" : "bg-surface border-border hover:border-primary/50"}`}>
              {toFaDigits(p)}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
