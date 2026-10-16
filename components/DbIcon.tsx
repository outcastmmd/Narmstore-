// نگاشت آیکون‌های ایموجی ذخیره‌شده در دیتابیس به آیکون‌های Lucide
// چون مقدار icon در جدول‌های categories و collections ایموجی است،
import {
  Lock, KeyRound, Mail, Settings, RefreshCw, Radio, Compass, Rocket, Map,
  Store, Podcast, Laptop, Camera, Blocks, FileText, Headphones, Upload,
  LockKeyhole, Repeat, CheckCircle2, BookOpen, Palette, Shield, MessageCircle,
  Keyboard, Mic, Tv, Gamepad2, Smartphone, Terminal, Clapperboard, Zap,
  AppWindow, Dumbbell, Package, Sparkles, type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  "🔒": Lock,
  "🔑": KeyRound,
  "📧": Mail,
  "✉️": Mail,
  "⚙️": Settings,
  "🔄": RefreshCw,
  "🔁": Repeat,
  "📡": Radio,
  "📻": Podcast,
  "🧭": Compass,
  "🚀": Rocket,
  "🗺️": Map,
  "🏪": Store,
  "💻": Laptop,
  "📷": Camera,
  "🧱": Blocks,
  "📄": FileText,
  "🎧": Headphones,
  "📤": Upload,
  "🔐": LockKeyhole,
  "✅": CheckCircle2,
  "📚": BookOpen,
  "🎨": Palette,
  "🛡️": Shield,
  "💬": MessageCircle,
  "⌨️": Keyboard,
  "🎙️": Mic,
  "📺": Tv,
  "🎮": Gamepad2,
  "📱": Smartphone,
  "🐧": Terminal,
  "🎬": Clapperboard,
  "⚡": Zap,
  "🪟": AppWindow,
  "💪": Dumbbell,
  "📦": Package,
  "✨": Sparkles,
};

export default function DbIcon({
  icon,
  className = "w-6 h-6",
  fallback = Package,
}: {
  icon?: string | null;
  className?: string;
  fallback?: LucideIcon;
}) {
  const Cmp = (icon && MAP[icon]) || fallback;
  return <Cmp className={className} aria-hidden="true" />;
}
