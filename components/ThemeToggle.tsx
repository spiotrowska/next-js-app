"use client";

import React, { ReactElement } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle(): ReactElement {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label="Toggle theme"
      aria-pressed={theme === "dark"}
      onClick={toggleTheme}
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
