import { getPopularApps } from "@/lib/store";
import AppGrid from "@/components/AppGrid";

export const metadata = { title: "محبوب‌ترین‌ها", description: "پر دانلودترین نرم‌افزارهای اندروید بر اساس آمار واقعی" };

export default async function PopularPage() {
  const apps = await getPopularApps(48);
  return <AppGrid title="🔥 محبوب‌ترین‌ها" subtitle="بر اساس تعداد دانلود واقعی ثبت‌شده" apps={apps} />;
}
