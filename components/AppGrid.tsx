import AppCard, { type CardApp } from "@/components/AppCard";
import { toFaDigits } from "@/lib/fa";

export default function AppGrid({ title, subtitle, apps }: {
  title: string; subtitle?: string; apps: CardApp[];
}) {
  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-extrabold mb-1">{title}</h1>
      {subtitle && <p className="text-sm text-muted mb-6">{subtitle}</p>}
      {!subtitle && <div className="mb-6" />}
      {apps.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {apps.map((a) => <AppCard key={a.id} app={a} />)}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-3xl p-10 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-bold mb-1">موردی برای نمایش وجود ندارد</p>
          <p className="text-sm text-muted">هنوز داده‌ی کافی ثبت نشده است.</p>
        </div>
      )}
      <p className="text-xs text-muted mt-6">{toFaDigits(apps.length)} برنامه</p>
    </div>
  );
}
