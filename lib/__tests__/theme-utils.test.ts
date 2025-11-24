import {
  getInitialTheme,
  readThemeCookie,
  prefersDarkMode,
} from "@/lib/theme-utils";

// Helper to mock matchMedia
function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: matches && query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe("theme-utils", () => {
  beforeEach(() => {
    // Properly clear theme cookie (Path=/ scope)
    document.cookie = "app-theme=; Max-Age=0; Path=/";
    // Ensure a consistent baseline where prefers-color-scheme: dark is false
    mockMatchMedia(false);
  });

  test("readThemeCookie returns null when absent", () => {
    expect(readThemeCookie()).toBeNull();
  });

  test("readThemeCookie returns light when cookie set", () => {
    document.cookie = "app-theme=light";
    expect(readThemeCookie()).toBe("light");
  });

  test("readThemeCookie returns dark when cookie set", () => {
    document.cookie = "app-theme=dark";
    expect(readThemeCookie()).toBe("dark");
  });

  test("readThemeCookie returns null for invalid value", () => {
    document.cookie = "app-theme=blue";
    expect(readThemeCookie()).toBeNull();
  });

  test("prefersDarkMode false when matchMedia returns false", () => {
    mockMatchMedia(false);
    expect(prefersDarkMode()).toBe(false);
  });

  test("prefersDarkMode true when matchMedia returns true", () => {
    mockMatchMedia(true);
    expect(prefersDarkMode()).toBe(true);
  });

  test("getInitialTheme returns cookie value when present", () => {
    document.cookie = "app-theme=dark";
    mockMatchMedia(false);
    expect(getInitialTheme()).toBe("dark");
  });

  test("getInitialTheme falls back to dark when prefers", () => {
    document.cookie = "";
    mockMatchMedia(true);
    expect(getInitialTheme()).toBe("dark");
  });

  test("getInitialTheme defaults to light when no cookie and prefers light", () => {
    document.cookie = ""; // cookie cleared in beforeEach but explicit for clarity
    mockMatchMedia(false); // reinforce preference false
    expect(getInitialTheme()).toBe("light");
  });
});
