"use client";

import React, { ReactElement } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle(): ReactElement {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = async () => {
    toggleTheme();
    try {
      const next = theme === "dark" ? "light" : "dark";
      await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: next }),
      });
    } catch {
      // ignore network errors; theme already toggled locally
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label="Toggle theme"
      aria-pressed={theme === "dark"}
      onClick={handleToggle}
      className="size-9 p-0 flex items-center justify-center"
      suppressHydrationWarning
    >
      {theme === "dark" ? (
        <Sun className="size-5 text-black dark:text-white" />
      ) : (
        <Moon className="size-5 text-black dark:text-white" />
      )}
    </Button>
  );
}
