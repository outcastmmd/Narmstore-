// برچسب‌های هوشمند بر اساس دسترسی‌ها و متادیتا
import { Ban, WifiOff, BookOpen, Feather, type LucideIcon } from "lucide-react";

export type AppTag = { slug: string; label: string; Icon: LucideIcon };

const AD_PERMS = [
  "com.google.android.gms.permission.AD_ID",
  "com.google.android.gms.permission.AD_ID_NOTIFICATION",
];

export function computeTags(opts: {
  permissions: string[];
  isOpenSource: boolean;
  fileSize: number | null;
}): AppTag[] {
  const tags: AppTag[] = [];
  const perms = opts.permissions || [];

  // بدون تبلیغ: بدون شناسه تبلیغاتی
  if (!perms.some((p) => AD_PERMS.some((ad) => p.includes(ad)))) {
    tags.push({ slug: "no-ads", label: "بدون تبلیغ", Icon: Ban });
  }
  // آفلاین: بدون اینترنت
  if (!perms.includes("android.permission.INTERNET")) {
    tags.push({ slug: "offline", label: "آفلاین", Icon: WifiOff });
  }
  // متن‌باز
  if (opts.isOpenSource) {
    tags.push({ slug: "open-source", label: "متن‌باز", Icon: BookOpen });
  }
  // سبک: کمتر از ۱۵ مگابایت
  if (opts.fileSize && opts.fileSize < 15 * 1024 * 1024) {
    tags.push({ slug: "lightweight", label: "سبک", Icon: Feather });
  }
  return tags;
}
