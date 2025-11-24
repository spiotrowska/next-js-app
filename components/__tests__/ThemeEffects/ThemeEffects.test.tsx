import React from "react";
import { render, waitFor } from "@testing-library/react";
import { ThemeEffects } from "@/components/ThemeEffects";
import { useThemeStore } from "@/lib/theme-store";
import { act } from "react";

// Helper to reset store between tests
function resetStore() {
  useThemeStore.setState({ theme: "light" });
}

describe("ThemeEffects", () => {
  beforeEach(() => {
    // Clear theme cookie and html class before each test
    document.cookie = "app-theme=; Max-Age=0; Path=/";
    document.documentElement.className = "";
    resetStore();
    // Provide matchMedia stub (default light preference)
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
  });

  test("calls initialize exactly once on mount", async () => {
    const originalInitialize = useThemeStore.getState().initialize;
    const mockInitialize = jest.fn(originalInitialize);
    // Replace initialize in store with mock
    useThemeStore.setState({ initialize: mockInitialize as any });

    render(<ThemeEffects />);

    await waitFor(() => expect(mockInitialize).toHaveBeenCalledTimes(1));

    // Restore initialize inside act to avoid warnings
    act(() => {
      useThemeStore.setState({ initialize: originalInitialize });
    });
  });

  test("applies dark class from cookie on initialize", async () => {
    document.cookie = "app-theme=dark";
    render(<ThemeEffects />);
    await waitFor(() => expect(useThemeStore.getState().theme).toBe("dark"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  test("updates root class when theme toggles", async () => {
    const { unmount } = render(<ThemeEffects />);

    // Initially light
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    act(() => {
      useThemeStore.getState().setTheme("dark");
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    act(() => {
      useThemeStore.getState().toggleTheme(); // dark -> light
    });
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    unmount();
  });

  test("removes dark class when switching back via setTheme", async () => {
    render(<ThemeEffects />);

    act(() => {
      useThemeStore.getState().setTheme("dark");
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    act(() => {
      useThemeStore.getState().setTheme("light");
    });
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
