// عکس پروکسی‌شده بدون Next Image optimizer (optimizer روی /api/img خطای ۴۰۰ می‌داد)
export default function PxImg({
  src, alt, width, height, className, loading = "lazy", onLoad, onError,
}: {
  src: string; alt: string; width: number; height: number; className?: string; loading?: "lazy" | "eager";
  onLoad?: () => void; onError?: () => void;
}) {
  return (
    <img
      draggable={false}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
