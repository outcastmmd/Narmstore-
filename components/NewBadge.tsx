// بج «جدید» برای برنامه‌های اضافه‌شده در ۷ روز اخیر — daisyUI
const WEEK = 7 * 24 * 3600 * 1000;

export function isNew(createdAt: Date | string | null | undefined): boolean {
  if (!createdAt) return false;
  const t = new Date(createdAt).getTime();
  return !Number.isNaN(t) && Date.now() - t < WEEK;
}

export default function NewBadge({ createdAt, className = "" }: { createdAt: Date | string | null | undefined; className?: string }) {
  if (!isNew(createdAt)) return null;
  return <span className={`badge badge-primary badge-sm ${className}`}>جدید</span>;
}
