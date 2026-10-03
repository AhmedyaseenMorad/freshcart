"use client";

import { useCallback, useEffect, useState } from "react";
import { Ico } from "./Icons";

export const THEME_KEY = "fc_theme";

export function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    setReady(true);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-surface-3 text-fg-muted transition-colors hover:bg-primary-50 hover:text-primary-600 ${className}`}
    >
      <Ico name={isDark ? "sun" : "moon"} className="text-base" spin={false} />
      {!ready && <span className="sr-only">Toggle theme</span>}
    </button>
  );
}