import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

function Consumer() {
  const { theme } = useTheme();
  return <div data-theme={theme}>Theme: {theme}</div>;
}

describe("ThemeProvider default fallback", () => {
  beforeEach(() => {
    // Clear cookie and mock matchMedia to return false.
    document.cookie = "";
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockReturnValue({
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }),
    });
  });

  test("falls back to light when no cookie and no dark preference", () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );
    const el = screen.getByText(/Theme:/i);
    expect(el).toHaveAttribute("data-theme", "light");
    expect(el).toHaveTextContent(/light/);
  });
});
