import { getPopularApps } from "@/lib/store";
import AppGrid from "@/components/AppGrid";
import type { Platform } from "@/lib/store";

export const metadata = { title: "محبوب‌ترین‌ها", description: "پر دانلودترین نرم‌افزارها بر اساس آمار واقعی" };

type Props = { searchParams: Promise<{ platform?: string }> };

export default async function PopularPage({ searchParams }: Props) {
  const { platform } = await searchParams;
  const plat: Platform = (platform === "windows" || platform === "linux") ? platform : "android";
  const apps = await getPopularApps(48, plat);
  return <AppGrid title="محبوب‌ترین‌ها" subtitle="بر اساس تعداد دانلود واقعی ثبت‌شده" apps={apps} />;
}
