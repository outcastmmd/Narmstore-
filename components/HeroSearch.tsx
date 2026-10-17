import SearchBox from "./SearchBox";

// هیروی صفحه‌ی اصلی: فقط جست‌وجو
export default function HeroSearch() {
  return (
    <section aria-label="جست‌وجوی سریع" className="bg-surface border border-border rounded-3xl p-5 sm:p-6 mb-10">
      <SearchBox compact />
    </section>
  );
}
