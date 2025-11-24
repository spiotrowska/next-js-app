"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/lib/theme-store";

export function ThemeEffects() {
  const theme = useThemeStore((s) => s.theme);
  const initialize = useThemeStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return null;
}
