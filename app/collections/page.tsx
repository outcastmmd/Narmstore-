import Link from "next/link";
import type { Metadata } from "next";
import { getCollections } from "@/lib/store";
import { toFaDigits } from "@/lib/fa";

export const metadata: Metadata = { title: "کالکشن‌های منتخب", description: "لیست‌های دست‌چین برنامه‌ها در نرم‌استور" };

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-extrabold mb-2">✨ کالکشن‌های منتخب</h1>
      <p className="text-sm text-muted mb-8">لیست‌های دست‌چین سردبیر از بهترین برنامه‌ها</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {collections.map((c, i) => (
          <Link key={c.id} href={`/collection/${c.slug}`}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-card-in card-hover bg-gradient-to-bl from-primary-soft/70 to-surface border border-border rounded-3xl p-6 flex items-center gap-5">
            <span className="text-5xl shrink-0" aria-hidden="true">{c.icon || "✨"}</span>
            <div className="flex-1">
              <h2 className="font-extrabold text-lg">{c.nameFa}</h2>
              <p className="text-sm text-muted mt-1 leading-6 line-clamp-2">{c.description}</p>
              <p className="text-xs text-primary font-bold mt-2">{toFaDigits(c.appCount)} برنامه ←</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
