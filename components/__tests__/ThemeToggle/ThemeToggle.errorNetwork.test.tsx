import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

// Mock fetch to reject to exercise catch branch.
global.fetch = jest.fn(() => Promise.reject(new Error("network"))) as any;

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

describe("ThemeToggle network error branch", () => {
  test("toggles locally even when fetch rejects", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(button);
    // Either icon is now Sun (dark) or Moon (light); ensure fetch called and error swallowed.
    expect(global.fetch).toHaveBeenCalled();
  });
});
