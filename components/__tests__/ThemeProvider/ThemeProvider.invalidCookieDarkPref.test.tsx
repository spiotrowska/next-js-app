import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@/components/ThemeProvider";

describe("ThemeProvider invalid cookie with dark preference", () => {
  test("prefers dark mode when cookie value invalid", () => {
    // Set an invalid theme cookie value
    document.cookie = "app-theme=blue";
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
    render(
      <ThemeProvider>
        <div>child</div>
      </ThemeProvider>
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
