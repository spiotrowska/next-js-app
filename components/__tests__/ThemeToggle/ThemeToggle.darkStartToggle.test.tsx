import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, readThemeCookie } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

// Start with dark via cookie to force initial dark branch for both ternaries (icon & next computation).
document.cookie = "app-theme=dark";
global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as any;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

describe("ThemeToggle dark start toggle next computation", () => {
  test("click from dark computes next=light and updates cookie", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    // Initially dark branch rendered -> Sun icon present (after async hydration update).
    await waitFor(() =>
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    );
    const button = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(button);
    // After toggle, dark class removed and cookie updated.
    await waitFor(() =>
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    );
    expect(document.cookie).toMatch(/app-theme=light/);
  });
});
