import React from "react";
import { render, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@/components/ThemeProvider";

// Dark preference test
describe("ThemeProvider dark initialization", () => {
  test("applies dark class when prefers-color-scheme dark", async () => {
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
    // Ensure no overriding cookie
    document.cookie = "";
    render(
      <ThemeProvider>
        <div>Child</div>
      </ThemeProvider>
    );
    await waitFor(() =>
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    );
  });
});
