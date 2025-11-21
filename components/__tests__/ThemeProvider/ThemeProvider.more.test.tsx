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
    fireEvent.click(getByText(/mode:dark/));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  test("useTheme throws outside provider", () => {
    const Outside = () => {
      // Intentionally call hook outside provider.
      try {
        useTheme();
      } catch (e) {
        return <p>threw</p>;
      }
      return <p>no-throw</p>;
    };
    const { getByText } = render(<Outside />);
    expect(getByText("threw")).toBeInTheDocument();
  });
});
