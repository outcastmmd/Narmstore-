"use client";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "amoled";
const ORDER: Theme[] = ["light", "dark", "amoled"];
const ICON: Record<Theme, string> = { light: "🌙", dark: "⬛", amoled: "☀️" };
const LABEL: Record<Theme, string> = { light: "حالت تاریک", dark: "حالت امولد", amoled: "حالت روشن" };

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme");
    setTheme(t === "dark" ? "dark" : t === "amoled" ? "amoled" : "light");
  }, []);

  const toggle = () => {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("narm-theme", next);
    setTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={LABEL[theme]}
      title={LABEL[theme]}
      className="w-10 h-10 rounded-xl bg-surface-2 hover:bg-border flex items-center justify-center text-xl transition-colors"
    >
      {ICON[theme]}
    </button>
  );
}
