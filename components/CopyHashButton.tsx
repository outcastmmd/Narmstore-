"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyHashButton({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={copy}
      className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      title="کپی هش"
      aria-label="کپی هش SHA-256"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4 opacity-60" />
      )}
    </button>
  );
}
