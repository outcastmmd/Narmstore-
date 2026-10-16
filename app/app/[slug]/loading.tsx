// اسکلت بارگذاری صفحه برنامه
export default function Loading() {
  return (
    <div className="animate-pulse max-w-3xl mx-auto">
      <div className="flex gap-4 items-start mb-6">
        <div className="w-24 h-24 bg-surface-2 rounded-3xl shrink-0" />
        <div className="flex-1">
          <div className="h-7 w-48 bg-surface-2 rounded-lg mb-2" />
          <div className="h-4 w-32 bg-surface-2 rounded mb-3" />
          <div className="h-10 w-40 bg-surface-2 rounded-xl" />
        </div>
      </div>
      <div className="h-4 bg-surface-2 rounded mb-2" />
      <div className="h-4 w-5/6 bg-surface-2 rounded mb-6" />
      <div className="h-12 bg-surface-2 rounded-2xl" />
    </div>
  );
}
