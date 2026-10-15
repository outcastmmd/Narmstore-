"use client";
import { useState } from "react";
import { formatBytes } from "@/lib/fa";

export default function DownloadButton({
  versionId, versionName, fileSize,
}: {
  versionId: string; versionName: string; fileSize: number | null;
}) {
  const [copied, setCopied] = useState(false);
  const url = `/api/download/${versionId}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <a
        href={url}
        className="flex-1 bg-primary text-primary-fg text-center font-extrabold text-lg py-4 rounded-2xl hover:opacity-90 active:scale-[0.99] transition shadow-lg shadow-primary/20"
      >
        ⬇️ دانلود نسخه <span dir="ltr">{versionName}</span>
      </a>
      <div className="flex items-center gap-3 text-sm text-muted">
        <span className="bg-surface-2 rounded-lg px-3 py-2">📦 {formatBytes(fileSize)}</span>
        <button onClick={copy} className="bg-surface-2 hover:bg-border rounded-lg px-3 py-2 transition" aria-label="کپی لینک دانلود">
          {copied ? "✅ کپی شد!" : "🔗 کپی لینک"}
        </button>
      </div>
    </div>
  );
}
