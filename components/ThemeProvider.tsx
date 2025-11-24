"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";

  const cookieTheme = readThemeCookie();

  if (cookieTheme) return cookieTheme;

  const prefersDark = prefersDarkMode();

  if (prefersDark) return "dark";

  return "light";
}

export function readThemeCookie(): Theme | null {
  const cookies = document.cookie.split(";");
  const themeCookie = cookies.find((c) => c.trim().startsWith("app-theme="));

  if (!themeCookie) return null;

  const value = themeCookie.split("=")[1];

  return value === "dark" || value === "light" ? value : null;
}

export function prefersDarkMode(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const detected = getInitialTheme();

    if (detected !== theme) {
      setTimeout(() => setThemeState(detected), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () =>
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);

  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");

  return ctx;
}
