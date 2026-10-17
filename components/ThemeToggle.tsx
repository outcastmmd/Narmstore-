"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

const THEMES = ["dim", "dracula", "halloween"] as const;
const LABELS: Record<(typeof THEMES)[number], string> = {
  dim: "دیم",
  dracula: "دراکولا",
  halloween: "هالووین",
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<(typeof THEMES)[number]>("dim");

  useEffect(() => {
    const t = localStorage.getItem("vesper-theme");
    if (t === "dim" || t === "dracula" || t === "halloween") setTheme(t);
  }, []);

  const cycle = () => {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setTheme(next);
    try {
      localStorage.setItem("vesper-theme", next);
    } catch {}
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button
      onClick={cycle}
      aria-label="تغییر تم"
      title={`تم فعلی: ${LABELS[theme]} — برای تغییر بزن`}
      className="w-10 h-10 rounded-full flex items-center justify-center text-muted hover:text-fg transition shrink-0"
    >
      <Palette className="w-5 h-5" />
    </button>
  );
}
