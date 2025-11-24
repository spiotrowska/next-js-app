"use client";

import React, { useEffect, ReactNode } from "react";
import { useThemeStore } from "@/lib/theme-store";
import {
  getInitialTheme,
  readThemeCookie,
  prefersDarkMode,
} from "@/lib/theme-utils";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
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

  return <>{children}</>;
};

export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return { theme, setTheme, toggleTheme } as const;
}

export { getInitialTheme, readThemeCookie, prefersDarkMode };
