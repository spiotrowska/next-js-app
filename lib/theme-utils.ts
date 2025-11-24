"use client";

export type Theme = "light" | "dark";

export function readThemeCookie(): Theme | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  const themeCookie = cookies.find((c) => c.trim().startsWith("app-theme="));
  if (!themeCookie) return null;
  const value = themeCookie.split("=")[1];
  return value === "dark" || value === "light" ? value : null;
}

export function prefersDarkMode(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function getInitialTheme(): Theme {
  const cookieTheme = readThemeCookie();
  return cookieTheme ?? (prefersDarkMode() ? "dark" : "light");
}
