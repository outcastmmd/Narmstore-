"use client";
import { useEffect, useState } from "react";
import { Moon, Sun, Zap, type LucideIcon } from "lucide-react";

type Theme = "light" | "dark" | "neon";
const ORDER: Theme[] = ["light", "dark", "neon"];
// آیکونِ تمِ بعدی (چیزی که با کلیک بهش می‌ری)
const NEXT_ICON: Record<Theme, LucideIcon> = { light: Moon, dark: Zap, neon: Sun };
const NEXT_LABEL: Record<Theme, string> = { light: "حالت تاریک", dark: "حالت نئونی", neon: "حالت روشن" };

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem("narm-theme", t); } catch {}
}

function readTheme(): Theme {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "neon" ? "neon" : t === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = readTheme();
    // همگام‌سازی با چیزی که اسکریپت layout اعمال کرده
    if (document.documentElement.getAttribute("data-theme") !== current) {
      applyTheme(current);
    }
    setTheme(current);
  }, []);

  const toggle = () => {
    // خواندن وضعیت واقعی از DOM (نه فقط state) تا همیشه درست بچرخه
    const current = readTheme();
    const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
    applyTheme(next);
    setTheme(next);
  };

  const NextIcon = NEXT_ICON[theme];
  return (
    <button
      onClick={toggle}
      aria-label={NEXT_LABEL[theme]}
      title={NEXT_LABEL[theme]}
      className="w-10 h-10 rounded-xl bg-surface-2 hover:bg-border flex items-center justify-center transition-colors"
    >
      <NextIcon className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}
