import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@/components/ThemeProvider";

describe("ThemeProvider cookie overrides", () => {
  test("applies light theme when cookie set to light even if prefers dark", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    document.cookie = "app-theme=light";
    render(
      <ThemeProvider>
        <div>child</div>
      </ThemeProvider>
    );
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  test("applies dark theme when cookie set to dark", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => ({
        matches: false,
        media: "(prefers-color-scheme: dark)",
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    document.cookie = "app-theme=dark";
    render(
      <ThemeProvider>
        <div>child</div>
      </ThemeProvider>
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
