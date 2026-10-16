// بج «جدید» برای برنامه‌های اضافه‌شده در ۷ روز اخیر — ظریف و مینیمال
const WEEK = 7 * 24 * 3600 * 1000;

export function isNew(createdAt: Date | string | null | undefined): boolean {
  if (!createdAt) return false;
  const t = new Date(createdAt).getTime();
  return !Number.isNaN(t) && Date.now() - t < WEEK;
}

export default function NewBadge({ createdAt, className = "" }: { createdAt: Date | string | null | undefined; className?: string }) {
  if (!isNew(createdAt)) return null;
  return (
    <span className={`inline-block bg-primary text-primary-fg text-[11px] font-bold rounded-full px-2 py-0.5 leading-5 ${className}`}>
      جدید
    </span>
  );
}
