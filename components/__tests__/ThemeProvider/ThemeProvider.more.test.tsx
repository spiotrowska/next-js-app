import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

describe("ThemeProvider additional branches", () => {
  test("default light when no cookie and prefers light", () => {
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
    document.cookie = "";
    render(
      <ThemeProvider>
        <div>child</div>
      </ThemeProvider>
    );
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  test("toggleTheme cycles light->dark->light", () => {
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
    document.cookie = "";
    const ToggleConsumer = () => {
      const { toggleTheme, theme } = useTheme();
      return <button onClick={toggleTheme}>mode:{theme}</button>;
    };
    const { getByText } = render(
      <ThemeProvider>
        <ToggleConsumer />
      </ThemeProvider>
    );
    const btn = getByText(/mode:light/);
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.cookie).toMatch(/app-theme=dark/);
    fireEvent.click(getByText(/mode:dark/));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.cookie).toMatch(/app-theme=light/);
  });

  test("useTheme outside provider still works via store (no throw)", () => {
    const Outside = () => {
      const { theme } = useTheme();
      return <p>theme:{theme}</p>;
    };
    const { getByText } = render(<Outside />);
    expect(getByText(/theme:/)).toBeInTheDocument();
  });
});
