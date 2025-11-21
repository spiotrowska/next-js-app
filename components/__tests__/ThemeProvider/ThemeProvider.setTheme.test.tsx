import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

// MatchMedia false to start in light
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: () => ({ matches: false }),
});

describe("ThemeProvider setTheme direct branch remove/add", () => {
  test("setTheme applies and then removes dark class explicitly", () => {
    const Consumer = () => {
      const { setTheme, theme } = useTheme();
      return (
        <div>
          <button onClick={() => setTheme("dark")}>to-dark</button>
          <button onClick={() => setTheme("light")}>to-light</button>
          <span>{theme}</span>
        </div>
      );
    };
    const { getByText } = render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );
    // Initially light
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    fireEvent.click(getByText("to-dark"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    fireEvent.click(getByText("to-light"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
