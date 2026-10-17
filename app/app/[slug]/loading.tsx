// اسکلت بارگذاری صفحه برنامه
export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <div className="flex gap-4 items-start mb-2">
        <div className="skeleton w-24 h-24 rounded-3xl shrink-0" />
        <div className="flex-1 flex flex-col gap-3">
          <div className="skeleton h-7 w-48 rounded-lg" />
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-10 w-40 rounded-full" />
        </div>
      </div>
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-5/6 rounded" />
      <div className="skeleton h-12 rounded-2xl" />
    </div>
  );
}
