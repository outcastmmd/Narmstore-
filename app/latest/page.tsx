import { getLatestApps } from "@/lib/store";
import AppGrid from "@/components/AppGrid";

export const metadata = { title: "تازه‌ترین نسخه‌ها", description: "آخرین نسخه‌های منتشرشده‌ی نرم‌افزارها" };

export default async function LatestPage() {
  const apps = await getLatestApps(48);
  return <AppGrid title="✨ تازه‌ترین نسخه‌ها" subtitle="برنامه‌هایی که اخیراً به‌روزرسانی شده‌اند" apps={apps} />;
}
