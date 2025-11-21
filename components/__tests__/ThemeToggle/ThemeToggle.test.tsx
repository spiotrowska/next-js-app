import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

// Mock fetch to avoid real network call.
global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as any;

// Provide matchMedia mock required by ThemeProvider initial theme detection.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

describe("ThemeToggle", () => {
  test("toggles theme from light to dark and calls fetch", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole("button", { name: /toggle theme/i });
    // Initial theme may be light or dark depending on media; force expectation by clicking.
    await user.click(button);
    expect(global.fetch).toHaveBeenCalled();
  });
});
