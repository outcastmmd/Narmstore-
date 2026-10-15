import { getOpenSourceApps } from "@/lib/store";
import AppGrid from "@/components/AppGrid";

export const metadata = { title: "نرم‌افزارهای متن‌باز", description: "فهرست نرم‌افزارهای آزاد و متن‌باز اندروید" };

export default async function OpenSourcePage() {
  const apps = await getOpenSourceApps(48);
  return <AppGrid title="🆓 نرم‌افزارهای متن‌باز" subtitle="برنامه‌های آزاد با کد منبع در دسترس" apps={apps} />;
}
