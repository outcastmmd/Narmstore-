import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCollectionBySlug } from "@/lib/store";
import AppCard from "@/components/AppCard";
import { toFaDigits } from "@/lib/fa";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = await getCollectionBySlug(slug);
  if (!col) return { title: "یافت نشد" };
  return { title: col.nameFa, description: col.description || `کالکشن ${col.nameFa} در نرم‌استور` };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const col = await getCollectionBySlug(slug);
  if (!col) notFound();

  return (
    <div className="animate-fade-up">
      <nav className="text-sm text-muted mb-4" aria-label="مسیر">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span className="mx-2">/</span>
        <Link href="/collections" className="hover:text-primary">کالکشن‌ها</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-bold">{col.nameFa}</span>
      </nav>

      <section className="rounded-3xl overflow-hidden border border-border bg-gradient-to-l from-primary-soft/60 to-surface mb-8">
        <div className="p-6 sm:p-8 flex items-center gap-5">
          <span className="text-5xl sm:text-6xl" aria-hidden="true">{col.icon || "✨"}</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{col.nameFa}</h1>
            <p className="text-sm text-muted mt-1">{toFaDigits(col.apps.length)} برنامه</p>
            {col.description && <p className="text-sm text-muted mt-2 leading-7">{col.description}</p>}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {col.apps.map((a: any, i: number) => <AppCard key={a.id} app={a} index={i} />)}
      </div>
    </div>
  );
}
