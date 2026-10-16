import { Smartphone, AppWindow, Terminal, type LucideIcon } from "lucide-react";

// بج تخصصی پلتفرم — هر پلتفرم آیکون و رنگ مخصوص خودش رو داره
const PLATFORMS: Record<string, { label: string; Icon: LucideIcon; pill: string }> = {
  android: {
    label: "نسخه اندروید",
    Icon: Smartphone,
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },
  windows: {
    label: "نسخه ویندوز",
    Icon: AppWindow,
    pill: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
  },
  linux: {
    label: "نسخه لینوکس",
    Icon: Terminal,
    pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
};

export default function PlatformBadge({ platform }: { platform: string | null | undefined }) {
  const p = platform ? PLATFORMS[platform] : null;
  if (!p) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-extrabold border rounded-full px-3 py-1.5 ${p.pill}`}
      title={p.label}
    >
      <p.Icon className="w-4 h-4" aria-hidden="true" /> {p.label}
    </span>
  );
}
