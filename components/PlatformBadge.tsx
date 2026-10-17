import { Smartphone, AppWindow, Terminal, type LucideIcon } from "lucide-react";

// بج پلتفرم — daisyUI با رنگ معنایی هر پلتفرم
const PLATFORMS: Record<string, { label: string; Icon: LucideIcon; tint: string }> = {
  android: { label: "اندروید", Icon: Smartphone, tint: "badge-success" },
  windows: { label: "ویندوز", Icon: AppWindow, tint: "badge-info" },
  linux: { label: "لینوکس", Icon: Terminal, tint: "badge-warning" },
};

export default function PlatformBadge({ platform }: { platform: string | null | undefined }) {
  const p = platform ? PLATFORMS[platform] : null;
  if (!p) return null;
  return (
    <span className={`badge badge-sm gap-1 ${p.tint}`} title={p.label}>
      <p.Icon className="w-3.5 h-3.5" aria-hidden="true" /> {p.label}
    </span>
  );
}
