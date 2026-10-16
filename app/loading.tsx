// اسکلت بارگذاری صفحه اصلی — برای cold start سرور
export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* بنر */}
      <div className="h-48 bg-surface-2 rounded-3xl mb-6" />
      {/* کارت‌های دسته */}
      <div className="flex gap-3 overflow-hidden mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="shrink-0 w-28 h-20 bg-surface-2 rounded-2xl" />
        ))}
      </div>
      {/* ردیف برنامه‌ها */}
      {[0, 1].map((s) => (
        <div key={s} className="mb-6">
          <div className="h-6 w-40 bg-surface-2 rounded-lg mb-3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface-2 rounded-2xl p-4">
                <div className="w-14 h-14 bg-surface rounded-2xl mb-3" />
                <div className="h-4 bg-surface rounded mb-2" />
                <div className="h-3 w-2/3 bg-surface rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
