"use client";
import { create } from "zustand";
import { getInitialTheme } from "@/lib/theme-utils";

type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  initialize: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  setTheme: (t) => {
    set({ theme: t });
    try {
      document.cookie = `app-theme=${t}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {}
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    set({ theme: next });
    try {
      document.cookie = `app-theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {}
  },
  initialize: () => {
    const detected = getInitialTheme();

    if (detected !== get().theme) set({ theme: detected });
  },
}));
