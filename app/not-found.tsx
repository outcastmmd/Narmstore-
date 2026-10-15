import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
      <p className="text-7xl mb-4">🔍</p>
      <h1 className="text-2xl font-extrabold mb-2">صفحه‌ای پیدا نشد</h1>
      <p className="text-muted text-sm mb-6">نشانی واردشده اشتباه است یا این صفحه حذف شده.</p>
      <Link href="/" className="bg-primary text-primary-fg font-bold px-6 py-3 rounded-xl hover:opacity-90">
        بازگشت به خانه
      </Link>
    </div>
  );
}
