import Link from "next/link";

export default function Section({
  title,
  href,
  children,
  empty,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
  empty?: string;
}) {
  return (
    <section className="mb-10" aria-label={title}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full inline-block" aria-hidden="true" />
          {title}
        </h2>
        {href && (
          <Link href={href} className="text-sm text-primary hover:underline font-medium">
            مشاهده همه ←
          </Link>
        )}
      </div>
      {children || (empty && <p className="text-muted text-sm bg-surface border border-border rounded-xl p-6 text-center">{empty}</p>)}
    </section>
  );
}
