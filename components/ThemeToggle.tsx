"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("narm-theme", next);
    setTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
      className="w-10 h-10 rounded-xl bg-surface-2 hover:bg-border flex items-center justify-center text-xl transition-colors"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
