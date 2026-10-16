import { getLatestApps } from "@/lib/store";
import AppGrid from "@/components/AppGrid";
import type { Platform } from "@/lib/store";

export const metadata = { title: "تازه‌ترین نسخه‌ها", description: "آخرین نسخه‌های منتشرشده‌ی نرم‌افزارها" };

type Props = { searchParams: Promise<{ platform?: string }> };

export default async function LatestPage({ searchParams }: Props) {
  const { platform } = await searchParams;
  const plat: Platform = (platform === "windows" || platform === "linux") ? platform : "android";
  const apps = await getLatestApps(48, plat);
  return <AppGrid title="تازه‌ترین نسخه‌ها" subtitle="برنامه‌هایی که اخیراً به‌روزرسانی شده‌اند" apps={apps} />;
}
